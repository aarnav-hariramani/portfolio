
import React, { useEffect, useState } from 'react'

export default function Trades({symbol}){
  const [rows, setRows] = useState([])
  useEffect(()=>{
    setRows([])
    const id = setInterval(()=>{
      const price = 100 + Math.random()*40
      const size = Math.round(Math.random()*120)+10
      const side = Math.random()>0.5?'B':'S'
      const time = new Date().toLocaleTimeString()
      setRows(r => [{side, price:+price.toFixed(2), size, time}, ...r].slice(0,15))
    }, 650)
    return ()=> clearInterval(id)
  }, [symbol])
  return (
    <div style={{display:'grid', gridTemplateRows:'auto 1fr', height:'100%'}}>
      <div className="toolbar"><div className="badge">Recent Trades — {symbol}</div></div>
      <table className="table">
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td style={{width:40, color: r.side==='B'?'#22c55e':'#ef4444'}}>{r.side}</td>
              <td style={{width:80}}>{r.price.toFixed(2)}</td>
              <td style={{width:60}}>{r.size}</td>
              <td className="small">{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
