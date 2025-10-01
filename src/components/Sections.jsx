
import React from 'react'
import data from '../data.json'

function About(){
  return (<div>
    <h2>About</h2>
    <p>I’m <b>{data.name}</b> — {data.role}. Based in {data.location}.</p>
    <h3>Skills</h3>
    <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
      {data.skills.map((s,i)=>(<span key={i} className="badge">{s}</span>))}
    </div>
  </div>)
}
function Experience(){
  return (<div>
    <h2>Experience</h2>
    {data.experience.map((x,i)=>(
      <div key={i} style={{marginBottom:12}}>
        <div><b>{x.title}</b> — <span style={{color:'#7dd3fc'}}>{x.company}</span></div>
        <div className="small">{x.date}</div>
        <ul>{x.bullets.map((b,j)=>(<li key={j}>{b}</li>))}</ul>
      </div>
    ))}
  </div>)
}
function Projects(){
  return (<div>
    <h2>Projects</h2>
    <div className="grid2">
      {data.projects.map((p,i)=>(
        <div key={i} className="card" style={{padding:10}}>
          <div style={{fontWeight:600}}>{p.name}</div>
          <div className="small">{p.desc}</div>
          <div className="small" style={{marginTop:6}}>#{p.tags.join(' #')}</div>
        </div>
      ))}
    </div>
  </div>)
}
function Blog(){
  return (<div><h2>Blog</h2><p>Coming soon — research notes & write‑ups.</p></div>)
}
function Contact(){
  return (<div><h2>Contact</h2>
    <p>Email: <a href={"mailto:"+data.email}>{data.email}</a></p>
    <p>LinkedIn: <a target="_blank" href={data.links[0].href}>{data.links[0].label}</a></p>
    <p>GitHub: <a target="_blank" href={data.links[1].href}>{data.links[1].href.replace('https://','')}</a></p>
  </div>)
}

const Component = ({which}) => {
  if(which==='About') return <About/>
  if(which==='Experience') return <Experience/>
  if(which==='Projects') return <Projects/>
  if(which==='Blog') return <Blog/>
  return <Contact/>
}
export default { Component }
