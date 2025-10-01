
import React, { useEffect, useState } from 'react'

export default function OrderBook({symbol, price, onBuy}){
  const [bids, setBids] = useState([])
  const [asks, setAsks] = useState([])

  useEffect(()=>{
    function gen(side){
      const arr=[]
      for(let i=0;i<20;i++){
        const p = price + (side==='ask'? i*0.12 : -i*0.12) + (Math.random()-0.5)*0.03
        const s = Math.round(Math.random()*100)+10
        arr.push({price:+p.toFixed(2), size:s})
      }
      return arr
    }
    setBids(gen('bid')); setAsks(gen('ask'))
  }, [symbol, price])

  const max=Math.max(...bids.map(b=>b.size), ...asks.map(a=>a.size), 1)

  return (
    <div style={{display:'grid', gridTemplateRows:'auto 1fr auto'}}>
      <div className="toolbar">
        <div className="badge">NYSE:{symbol}</div>
        <div className="space"/>
        <button className="btn" onClick={onBuy}>Buy Mkt</button>
        <button className="btn" style={{marginLeft:8, background:'#2a0e0e', borderColor:'#3b0f0f'}}>Sell Mkt</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, padding:'0 8px'}}>
        <div>
          {bids.map((r,i)=>(
            <div className="orderbook-row" key={'b'+i}>
              <div className="depth" style={{width:`${(r.size/max)*100}%`, background:'#13311f'}}/>
              <div style={{width:60, textAlign:'right', color:'#22c55e'}}>{r.price.toFixed(2)}</div>
              <div style={{width:40, textAlign:'right', color:'#9fb0d0'}}>{r.size}</div>
            </div>
          ))}
        </div>
        <div>
          {asks.map((r,i)=>(
            <div className="orderbook-row right" key={'a'+i}>
              <div style={{width:40, textAlign:'left', color:'#9fb0d0'}}>{r.size}</div>
              <div style={{width:60, textAlign:'left', color:'#ef4444'}}>{r.price.toFixed(2)}</div>
              <div className="depth" style={{width:`${(r.size/max)*100}%`, background:'#3a1420'}}/>
            </div>
          ))}
        </div>
      </div>
      <div className="small" style={{padding:'6px 8px', borderTop:'1px solid #1a2542'}}>Orderbook depth • Bids left, Asks right.</div>
    </div>
  )
}
