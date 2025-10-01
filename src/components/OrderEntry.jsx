
import React, { useEffect } from 'react'

export default function OrderEntry({symbol, onBuy}){
  useEffect(()=>{
    const onKey=(e)=>{ if(e.key.toLowerCase()==='b') onBuy() }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [onBuy])

  return (
    <div className="order-entry">
      <div className="toolbar">
        <div className="badge">Order Entry — {symbol}</div>
      </div>
      <div style={{padding:'10px'}}>
        <div className="badge">TIF: DAY</div> <span className="badge">Type: MKT</span>
        <div style={{marginTop:10}}>
          <button className="btn" onClick={onBuy}>Buy</button>
          <button className="btn" style={{marginLeft:8, opacity:.7}}>Sell</button>
        </div>
        <div className="small" style={{marginTop:10}}>Press <b>B</b> to Buy instantly.</div>
      </div>
      <div className="small" style={{padding:'10px', borderTop:'1px solid #1a2542'}}>
        Buying <b>AARN</b> opens <b>About</b>, <b>EXPR</b>→Experience, <b>PRJ</b>→Projects, <b>BLOG</b>→Blog, <b>CNTC</b>→Contact.
      </div>
    </div>
  )
}
