
import React, { useEffect, useMemo, useState } from 'react'
const base = [
  {sym:'AARN', price:128.12, chg:+0.84},
  {sym:'EXPR', price:64.02, chg:-0.12},
  {sym:'PRJ', price:212.44, chg:+1.92},
  {sym:'BLOG', price:33.10, chg:+0.04},
  {sym:'CNTC', price:17.88, chg:-0.44},
]
export default function TickerTape({active, onPick}){
  const [items, setItems] = useState(base)
  useEffect(()=>{
    const id = setInterval(()=>{
      setItems(prev => prev.map(it=>{
        const jitter=(Math.random()-0.5)*0.7
        const price=Math.max(1, it.price+jitter)
        const chg=price-it.price
        return {...it, price:+price.toFixed(2), chg:+chg.toFixed(2)}
      }))
    }, 900)
    return ()=> clearInterval(id)
  }, [])
  const dup = useMemo(()=> items.concat(items), [items])
  return (
    <div className="tape">
      <div className="tape-inner">
        {dup.map((it,i)=>(
          <div key={i} className="ticker-item" onClick={()=>onPick(it.sym)} style={{background: it.sym===active? '#0d1a36':'transparent'}}>
            <b>{it.sym}</b>
            <span>{it.price.toFixed(2)}</span>
            <span className={it.chg>=0?'price-up':'price-down'}>{it.chg>=0?'▲':'▼'} {Math.abs(it.chg).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
