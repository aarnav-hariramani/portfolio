
import React from 'react'
const watch = [
  {sym:'AARN', label:'About'},
  {sym:'EXPR', label:'Experience'},
  {sym:'PRJ', label:'Projects'},
  {sym:'BLOG', label:'Blog'},
  {sym:'CNTC', label:'Contact'}
]
function compact({onPick}){
  return (
    <div className="sidenav" style={{gridRow:'1/3'}}>
      {watch.map((w)=>(
        <div key={w.sym} className="iconbtn" onClick={()=>onPick(w.sym)} title={w.label}>
          {w.sym[0]}
        </div>
      ))}
    </div>
  )
}
export default { compact }
