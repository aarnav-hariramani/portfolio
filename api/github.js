
export default async function handler(req, res) {
  const login = (req.query && req.query.login) || "aarnav-hariramani";
  const token = process.env.GITHUB_TOKEN;
  if (!token) { res.status(500).json({ error: "Missing GITHUB_TOKEN" }); return; }
  async function gql(query, variables){
    const r=await fetch("https://api.github.com/graphql",{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({query,variables})});
    const j=await r.json(); if(j.errors) throw new Error(JSON.stringify(j.errors)); return j.data;
  }
  const qYears=`query($login:String!){ user(login:$login){ contributionsCollection{ contributionYears } pullRequests(states:MERGED){ totalCount } repositoriesContributedTo(includeUserRepositories:true, contributionTypes:[COMMIT,PULL_REQUEST,ISSUE,REPOSITORY]){ totalCount } starredRepositories{ totalCount } } }`;
  const yearsData=await gql(qYears,{login});
  const years=yearsData.user.contributionsCollection.contributionYears;
  const earliest=Math.min(...years);
  const from=new Date(Date.UTC(earliest,0,1)).toISOString();
  const to=new Date().toISOString();
  const qDays=`query($login:String!, $from:DateTime!, $to:DateTime!){ user(login:$login){ contributionsCollection(from:$from, to:$to){ contributionCalendar{ weeks{ contributionDays{ date contributionCount } } } } } }`;
  const d=await gql(qDays,{login,from,to});
  const days=d.user.contributionsCollection.contributionCalendar.weeks.flatMap(w=>w.contributionDays).map(x=>({date:x.date,v:x.contributionCount})).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const vals=days.map(d=>d.v); const take=n=>vals.slice(Math.max(0,vals.length-n));
  const y=new Date().getFullYear();
  const ytd_total=days.filter(dd=>new Date(dd.date).getFullYear()===y).reduce((s,d)=>s+d.v,0);
  const payload={ series:{ALL:vals,"1Y":take(365),"1M":take(30),"1W":take(7)}, tiles:{ ytd_total, stars_total: yearsData.user.starredRepositories.totalCount, prs_merged: yearsData.user.pullRequests.totalCount, active_repos: yearsData.user.repositoriesContributedTo.totalCount } };
  res.setHeader("Cache-Control","s-maxage=180, stale-while-revalidate=1200"); res.status(200).json(payload);
}
