
import React, { useEffect, useMemo, useRef, useState } from 'react'
export default function BigChart({series, unit='Contribs'}){
  const ref=useRef(null); const [hover,setHover]=useState(null)
  const max=useMemo(()=>series.length?Math.max(...series):1,[series])
  const min=useMemo(()=>series.length?Math.min(...series):0,[series])
  useEffect(()=>{
    const c=ref.current; if(!c) return; const ctx=c.getContext('2d')
    const dpr=window.devicePixelRatio||1; const w=c.clientWidth, h=c.clientHeight
    c.width=w*dpr; c.height=h*dpr; ctx.scale(dpr,dpr)
    const padL=56, padR=16, padT=12, padB=36
    const y=v=> padT+(h-padT-padB)*(1-(v-min)/(max-min||1))
    const x=i=> padL+(w-padL-padR)*i/(series.length-1||1)
    function draw(cursor=null){
      ctx.clearRect(0,0,w,h)
      ctx.strokeStyle='#182235'; ctx.lineWidth=1
      for(let gx=padL; gx<=w-padR; gx+=80){ ctx.beginPath(); ctx.moveTo(gx,padT); ctx.lineTo(gx,h-padB); ctx.stroke() }
      for(let gy=padT; gy<=h-padB; gy+=60){ ctx.beginPath(); ctx.moveTo(padL,gy); ctx.lineTo(w-padR,gy); ctx.stroke() }
      ctx.lineWidth=2; ctx.strokeStyle='#7ddc9c'; ctx.beginPath()
      series.forEach((v,i)=>{ const xx=x(i), yy=y(v); if(i===0) ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy) }); ctx.stroke()
      const g=ctx.createLinearGradient(0,padT,0,h-padB); g.addColorStop(0,'rgba(125,220,156,.28)'); g.addColorStop(1,'rgba(125,220,156,0)')
      ctx.fillStyle=g; ctx.lineTo(x(series.length-1),h-padB); ctx.lineTo(x(0),h-padB); ctx.closePath(); ctx.fill()
      ctx.fillStyle='#a7b3c8'; ctx.font='12px system-ui'
      const labels=4
      for(let i=0;i<=labels;i++){ const yy=padT+(h-padT-padB)*i/labels; const val=(max-(max-min)*i/labels).toFixed(0); ctx.fillText(val,8,yy+4) }
      // x-axis tick approx years
      const ticks=6
      for(let i=0;i<=ticks;i++){ const ii=Math.round(i*(series.length-1)/ticks); const dd=new Date(Date.now()-(series.length-1-ii)*86400000); const label=dd.getFullYear(); const xx=x(ii); ctx.fillText(label, xx-18, h-12) }
      if(cursor){ const {i}=cursor; const xx=x(i), yy=y(series[i])
        const s=ctx.createLinearGradient(xx,0,xx,h); s.addColorStop(0,'rgba(82,168,255,.15)'); s.addColorStop(1,'rgba(82,168,255,.03)')
        ctx.fillStyle=s; ctx.fillRect(xx-2,padT,4,h-padT-padB)
        ctx.strokeStyle='#2b6cb0'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(xx,padT); ctx.lineTo(xx,h-padB); ctx.stroke()
        ctx.fillStyle='#2b9cff'; ctx.beginPath(); ctx.arc(xx,yy,5,0,Math.PI*2); ctx.fill()
        const label=series[i].toFixed(2)+' '+unit; const tw=ctx.measureText(label).width+12; const bx=Math.min(Math.max(padL,xx-tw/2),w-padR-tw); const by=padT+6; ctx.fillStyle='#0e1a2f'; ctx.strokeStyle='#22406a'; ctx.beginPath(); if(ctx.roundRect){ ctx.roundRect(bx,by,tw,22,6) } else { ctx.rect(bx,by,tw,22) } ctx.fill(); ctx.stroke(); ctx.fillStyle='#d7e7ff'; ctx.fillText(label,bx+6,by+15)
      }
    }
    draw()
    function onMove(e){ const r=c.getBoundingClientRect(); const mx=e.clientX-r.left; const i=Math.round((mx-padL)/((w-padL-padR)/(series.length-1||1))); const ii=Math.max(0,Math.min(series.length-1,i)); setHover({i:ii}); draw({i:ii}) }
    function onLeave(){ setHover(null); draw() }
    c.addEventListener('mousemove', onMove); c.addEventListener('mouseleave', onLeave)
    return ()=>{ c.removeEventListener('mousemove', onMove); c.removeEventListener('mouseleave', onLeave) }
  },[series,min,max,unit])
  return <canvas ref={ref} className="bigchart" style={{width:'100%',height:'360px'}}/>
}
