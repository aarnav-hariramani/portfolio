// /api/github.js
export default async function handler(req, res) {
  const login = (req.query && req.query.login) || "aarnav-hariramani";
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({ error: "Missing GITHUB_TOKEN" });
    return;
  }

  async function gql(query, variables) {
    const r = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    const j = await r.json();
    if (j.errors) throw new Error(JSON.stringify(j.errors));
    return j.data;
  }

  // 1) Get available contribution years + tile counts
  const Q_YEARS = `
    query($login:String!){
      user(login:$login){
        contributionsCollection { contributionYears }
        pullRequests(states:MERGED) { totalCount }
        repositoriesContributedTo(
          includeUserRepositories:true,
          contributionTypes:[COMMIT,PULL_REQUEST,ISSUE,REPOSITORY]
        ) { totalCount }
        starredRepositories { totalCount }
      }
      rateLimit { remaining resetAt }
    }
  `;
  const yearsData = await gql(Q_YEARS, { login });
  const years = [...yearsData.user.contributionsCollection.contributionYears].sort((a,b)=>a-b);
  const stars_total = yearsData.user.starredRepositories.totalCount;
  const prs_merged = yearsData.user.pullRequests.totalCount;
  const active_repos = yearsData.user.repositoriesContributedTo.totalCount;

  // 2) Helper to fetch one calendar year (<= 1y span)
  const Q_DAYS = `
    query($login:String!, $from:DateTime!, $to:DateTime!){
      user(login:$login){
        contributionsCollection(from:$from, to:$to){
          contributionCalendar{
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
      rateLimit { remaining resetAt }
    }
  `;
  async function fetchYearSpan(y) {
    const from = new Date(Date.UTC(y, 0, 1, 0, 0, 0)).toISOString();
    // Use end-of-year unless it's the current year (then "now")
    const now = new Date();
    const isCurrent = y === now.getUTCFullYear();
    const to = isCurrent
      ? now.toISOString()
      : new Date(Date.UTC(y, 11, 31, 23, 59, 59)).toISOString();

    const d = await gql(Q_DAYS, { login, from, to });
    const days = d.user.contributionsCollection.contributionCalendar.weeks
      .flatMap(w => w.contributionDays)
      .map(d => ({ date: d.date, v: d.contributionCount }));
    return days;
  }

  // 3) Fetch each year and merge
  const allDays = [];
  for (const y of years) {
    const chunk = await fetchYearSpan(y);
    allDays.push(...chunk);
  }
  // sort + de-dup (just in case of overlaps at boundaries)
  const map = new Map();
  for (const d of allDays) map.set(d.date, d.v);
  const days = [...map.entries()]
    .map(([date, v]) => ({ date, v }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 4) Build series windows (counts only, newest at the end)
  const vals = days.map(d => d.v);
  const take = n => vals.slice(Math.max(0, vals.length - n));
  const series = {
    ALL: vals,
    "1Y": take(365),
    "1M": take(30),
    "1W": take(7),
  };

  // 5) Tiles (YTD sum)
  const thisYear = new Date().getFullYear();
  const ytd_total = days
    .filter(d => new Date(d.date).getFullYear() === thisYear)
    .reduce((s, d) => s + d.v, 0);

  const payload = {
    series,
    tiles: { ytd_total, stars_total, prs_merged, active_repos },
  };

  // Cache for speed & rate limits
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=1800");
  res.status(200).json(payload);
}