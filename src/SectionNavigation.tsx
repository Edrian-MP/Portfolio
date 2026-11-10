import { useEffect, useLayoutEffect, useRef, useState } from "react";

const sections=[{id:"work",label:"Work"},{id:"about",label:"About"},{id:"services",label:"Services"},{id:"contact",label:"Contact"}];
export function useActiveSection() {
  const [active,setActive]=useState<string|null>(null);
  useEffect(()=>{
    let frame=0;
    const update=()=>{frame=0;const candidates=sections.map(s=>({id:s.id,top:document.getElementById(s.id)?.getBoundingClientRect().top??Infinity})).filter(s=>s.top<=Math.min(120,innerHeight*.18)).sort((a,b)=>b.top-a.top);setActive(scrollY+innerHeight>=document.documentElement.scrollHeight-8?"contact":candidates[0]?.id??null);};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule);update();
    return()=>{removeEventListener("scroll",schedule);removeEventListener("resize",schedule);cancelAnimationFrame(frame);};
  },[]);
  return active;
}
export default function SectionNavigation({active,mobile=false}:{active:string|null;mobile?:boolean}) {
  const ref=useRef<HTMLDivElement>(null);
  const [marker,setMarker]=useState({x:0,w:0});
  useLayoutEffect(()=>{const update=()=>{const link=ref.current?.querySelector<HTMLElement>('[aria-current="location"]');setMarker(link?{x:link.offsetLeft,w:link.offsetWidth}:{x:0,w:0});};const observer=new ResizeObserver(update);if(ref.current)observer.observe(ref.current);update();return()=>observer.disconnect();},[active]);
  return <div ref={ref} className={`section-nav ${mobile?"mobile-section-nav":"desktop-section-nav"}`} role={mobile?"navigation":undefined} aria-label={mobile?"Mobile section navigation":undefined}><span className="nav-indicator" aria-hidden="true" style={{width:marker.w,transform:`translateX(${marker.x}px)`,opacity:marker.w?1:0}}/>{sections.map(s=><a key={s.id} href={`#${s.id}`} className="nav-link" aria-current={active===s.id?"location":undefined}>{s.label}</a>)}</div>;
}
