
import React from 'react'
export default function Toolbar(){
  const buttons = ['D','1D','1W','1M','3M','1Y','5Y','⚙','⊕','⚡']
  return (
    <div className="flex" style={{gap:8}}>
      {buttons.map((b,i)=>(
        <div key={i} className="iconbtn" title={b}>{b}</div>
      ))}
    </div>
  )
}
