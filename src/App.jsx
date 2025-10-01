
import React, { useState } from 'react'
import Toolbar from './components/Toolbar'
import TickerTape from './components/TickerTape'
import ChartGrid from './components/ChartGrid'
import OrderBook from './components/OrderBook'
import Trades from './components/Trades'
import OrderEntry from './components/OrderEntry'
import Sections from './components/Sections'
import SideNav from './components/SideNav'

const mapping = { AARN:'About', EXPR:'Experience', PRJ:'Projects', BLOG:'Blog', CNTC:'Contact' }

export default function App(){
  const [symbol, setSymbol] = useState('AARN')
  const [open, setOpen] = useState(null)
  const [price, setPrice] = useState(100)

  return (
    <div className="layout">
      <div className="card toolbar" style={{gridColumn:'1/4'}}>
        <SideNav.compact onPick={(s)=>setSymbol(s)}/>
        <div className="badge">TradeSim • Aarnav</div>
        <div className="small">Select a ticker, then <b>Buy</b> to open its portfolio section.</div>
        <div className="space"/>
        <Toolbar/>
      </div>

      <div className="card" style={{gridColumn:'1/4'}}>
        <TickerTape active={symbol} onPick={(s)=>setSymbol(s)}/>
      </div>

      <div className="card" style={{gridRow:'2/3', gridColumn:'1/3'}}>
        <ChartGrid symbol={symbol} onPrice={setPrice}/>
      </div>

      <div className="card" style={{gridRow:'2/4', gridColumn:'3/4'}}>
        <OrderBook symbol={symbol} price={price} onBuy={()=>setOpen(mapping[symbol])}/>
      </div>

      <div className="card" style={{gridRow:'3/4', gridColumn:'1/2'}}>
        <OrderEntry symbol={symbol} onBuy={()=>setOpen(mapping[symbol])}/>
      </div>

      <div className="card" style={{gridRow:'3/4', gridColumn:'2/3'}}>
        <Trades symbol={symbol}/>
      </div>

      <div className="card footer" style={{padding:'8px 10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div className="small">Keyboard: <span className="badge">B = Buy</span></div>
        <div className="small">AARN→About • EXPR→Experience • PRJ→Projects • BLOG→Blog • CNTC→Contact</div>
      </div>

      {open && (
        <div className="modal" onClick={()=>setOpen(null)}>
          <div className="panel" onClick={e=>e.stopPropagation()}>
            <div className="panel-header">
              <div className="badge">Portfolio</div>
              <div className="small">Section: <b>{open}</b></div>
              <div style={{flex:1}}/>
              <button className="btn" onClick={()=>setOpen(null)}>Close</button>
            </div>
            <div className="panel-body">
              <Sections.Component which={open}/>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
