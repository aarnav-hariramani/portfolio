
import React, { useEffect, useRef } from 'react'
export default function Sparkline({series, color='#7ddc9c'}){
  const ref=useRef(null)
  useEffect(()=>{
    const c=ref.current; if(!c) return; const ctx=c.getContext('2d')
    const dpr=window.devicePixelRatio||1; const w=c.clientWidth, h=c.clientHeight
    c.width=w*dpr; c.height=h*dpr; ctx.scale(dpr,dpr); ctx.clearRect(0,0,w,h)
    if(!series?.length) return
    const pad=4, max=Math.max(...series), min=Math.min(...series)
    const y=v=> pad+(h-2*pad)*(1-(v-min)/(max-min||1))
    const x=i=> pad+(w-2*pad)*i/(series.length-1||1)
    const g=ctx.createLinearGradient(0,pad,0,h-pad); g.addColorStop(0,'rgba(125,220,156,.45)'); g.addColorStop(1,'rgba(125,220,156,0)')
    ctx.fillStyle=g; ctx.strokeStyle=color; ctx.lineWidth=1.6
    ctx.beginPath(); series.forEach((v,i)=>{ const xx=x(i), yy=y(v); if(i===0) ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy) }); ctx.stroke()
    ctx.lineTo(x(series.length-1),h-pad); ctx.lineTo(x(0),h-pad); ctx.closePath(); ctx.fill()
  },[series,color])
  return <canvas ref={ref} style={{width:'100%',height:'100%'}}/>
}
