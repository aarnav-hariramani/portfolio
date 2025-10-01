
import React, { useEffect, useMemo, useState } from 'react'
import Sparkline from './components/Sparkline'
import BigChart from './components/BigChart'
import data from './data.json'

function formatDate(){ const d=new Date(); return d.toLocaleDateString(undefined,{month:'long',day:'numeric'}) }
function Seg({value,setValue}){ const opts=['1W','1M','1Y','ALL']; return <div className="seg">{opts.map(o=>(<button key={o} className={value===o?'active':''} onClick={()=>setValue(o)}>{o}</button>))}</div> }

export default function App(){
  const [open,setOpen]=useState(false)
  const [range,setRange]=useState('ALL')
  const [live,setLive]=useState(null)
  const [loading,setLoading]=useState(false)
  const [err,setErr]=useState(null)

  useEffect(()=>{ if(!open) return; setLoading(true); fetch('/api/github?login=aarnav-hariramani').then(r=>r.json()).then(j=>{setLive(j);setLoading(false)}).catch(e=>{setErr(String(e));setLoading(false)}) },[open])

  const series = live?.series?.[range] || []
  const pill = useMemo(()=> series.length?series[series.length-1]:0, [series])

  return (<div className="container">
    <div className="topbar"><div><div className="title">Stocks</div><div className="subtitle">{formatDate()}</div></div><div className="badge">Aarnav • Desktop</div></div>
    <div className="search">Search</div>
    <div className="sectionTitle">My Symbols ▾</div>
    <div className="list">
      <div className="row" style={{cursor:'pointer'}} onClick={()=>setOpen(true)}>
        <div className="left"><div className="name">GitHub Contributions</div><div className="sub">Daily contributions</div></div>
        <div className="sparkwrap"><Sparkline series={live?.series?.['1M']||[]}/></div>
        <div className="pill">{pill.toFixed?pill.toFixed(2):pill}</div>
        <div className="disclosure">›</div>
      </div>
    </div>

    <div className={"detail "+(open?'open':'')} onClick={()=>setOpen(false)}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheetHeader">
          <div><div className="sheetTitle">GitHub Contributions</div><div className="sheetSub">All Time</div></div>
          <div style={{marginLeft:'auto'}}><Seg value={range} setValue={setRange}/></div>
        </div>
        <BigChart series={series} unit="Contribs" />
        <div className="stats">
          <div className="tile"><div className="k">Contribs (YTD)</div><div className="v">{live?.tiles?.ytd_total ?? '—'}</div></div>
          <div className="tile"><div className="k">Stars</div><div className="v">{live?.tiles?.stars_total ?? '—'}</div></div>
          <div className="tile"><div className="k">PRs Merged</div><div className="v">{live?.tiles?.prs_merged ?? '—'}</div></div>
          <div className="tile"><div className="k">Active Repos</div><div className="v">{live?.tiles?.active_repos ?? '—'}</div></div>
          <div className="tile"><div className="k">Range</div><div className="v">{range}</div></div>
          <div className="tile"><div className="k">API</div><div className="v">{loading?'Loading…':(err?'Error':'OK')}</div></div>
        </div>
        <div className="actions">
          <a className="btn" href={data.profile.links.github} target="_blank">Open GitHub</a>
          <a className="btn" href={data.profile.links.linkedin} target="_blank">LinkedIn</a>
          <a className="btn" href={data.profile.links.resume} target="_blank" download>Download Resume</a>
          <a className="btn" href={"mailto:"+data.profile.email}>Email</a>
        </div>
      </div>
    </div>
  </div>)
}
