
import React, { useEffect, useRef } from 'react'

function series(n, start=100, kind='candle'){
  let p = start
  const out = []
  for(let i=0;i<n;i++){
    const ch=(Math.random()-0.5)*2.2
    const o=p
    const c=Math.max(1, o+ch)
    const h=Math.max(o,c)+Math.random()*1.6
    const l=Math.max(1, Math.min(o,c)-Math.random()*1.6)
    out.push({o,h,l,c})
    p=c
  }
  return out
}

export default function ChartCanvas({mode='candle', title}){
  const ref = useRef(null)

  useEffect(()=>{
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio||1
    const width = canvas.clientWidth, height = canvas.clientHeight
    canvas.width = width*dpr; canvas.height = height*dpr; ctx.scale(dpr,dpr)

    const data = series(120, 80+Math.random()*40)
    const pad=12, w=width, h=height
    const max = Math.max(...data.map(s=>s.h))
    const min = Math.min(...data.map(s=>s.l))
    const y = v => pad+(h-2*pad)*(1-(v-min)/(max-min))
    const cw = (w-2*pad)/data.length

    ctx.clearRect(0,0,w,h)
    // grid
    ctx.strokeStyle='#131b33'; ctx.lineWidth=1
    for(let gx=pad; gx<w-pad; gx+=16){ ctx.beginPath(); ctx.moveTo(gx,pad); ctx.lineTo(gx,h-pad); ctx.stroke() }
    for(let gy=pad; gy<h-pad; gy+=16){ ctx.beginPath(); ctx.moveTo(pad,gy); ctx.lineTo(w-pad,gy); ctx.stroke() }

    if(mode==='line'){
      ctx.strokeStyle='#93c5fd'; ctx.beginPath()
      data.forEach((s,i)=>{
        const x = pad+i*cw+cw*0.5
        const yy = y(s.c)
        if (i === 0) { ctx.moveTo(x, yy); } else { ctx.lineTo(x, yy); }
      })
      ctx.stroke()
    } else {
      data.forEach((s,i)=>{
        const x = pad+i*cw+cw*0.5
        const col = s.c>=s.o? '#22c55e':'#ef4444'
        ctx.strokeStyle=col
        ctx.beginPath(); ctx.moveTo(x,y(s.h)); ctx.lineTo(x,y(s.l)); ctx.stroke()
        ctx.fillStyle=col
        const r=Math.max(1, Math.abs(y(s.o)-y(s.c)))
        ctx.fillRect(x-cw*0.35, Math.min(y(s.o),y(s.c)), cw*0.7, r)
      })
    }
    ctx.fillStyle='#9fb0d0'
    ctx.fillText(title||'', 10, 14)
  }, [mode, title])

  return <canvas ref={ref} style={{width:'100%', height:'100%'}}/>
}
