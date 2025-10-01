
import React from 'react'
import ChartCanvas from './ChartCanvas'

export default function ChartGrid({symbol, onPrice}){
  return (
    <div className="chartgrid">
      <div className="card grid-bg" style={{padding:'6px'}}><div className="small" style={{margin:'2px 6px'}}>International Business Machines — {symbol}</div><div style={{height:'100%'}}><ChartCanvas mode="candle" title="Kagi / SMA"/></div></div>
      <div className="card grid-bg" style={{padding:'6px'}}><div className="small" style={{margin:'2px 6px'}}>Microsoft — {symbol}</div><div style={{height:'100%'}}><ChartCanvas mode="line" title="Line / Vol"/></div></div>
      <div className="card grid-bg" style={{padding:'6px'}}><div className="small" style={{margin:'2px 6px'}}>AMD — {symbol}</div><div style={{height:'100%'}}><ChartCanvas mode="line" title="SMA / Volume"/></div></div>
      <div className="card grid-bg" style={{padding:'6px'}}><div className="small" style={{margin:'2px 6px'}}>Apple — {symbol}</div><div style={{height:'100%'}}><ChartCanvas mode="candle" title="Heikin Ashi"/></div></div>
    </div>
  )
}
