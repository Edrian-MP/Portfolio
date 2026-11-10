import { useEffect, useRef, useState } from "react";
import { Glyph } from "./VisualDetails";

const devices = [
  { id: "software", label: "Laptop", title: "Interfaces that connect.", text: "Website implementation, databases, and AI-assisted development.", chips: ["Web interfaces", "Database integration", "AI tools"] },
  { id: "hardware", label: "Raspberry Pi", title: "Small board. Real possibilities.", text: "Linux environments, Raspberry Pi projects, and connected applications.", chips: ["Linux", "Raspberry Pi", "SmartPOS"] },
  { id: "circuit", label: "Circuit", title: "From signal to system.", text: "Arduino, discrete components, and hardware–software prototyping.", chips: ["Arduino", "Electronics", "Prototyping"] },
];

export function Workbench({ day, onToggleTheme }: { day: boolean; onToggleTheme: () => void }) {
  const [selected, setSelected] = useState(0);
  const [avatarPaused, setAvatarPaused] = useState(false);
  const [blinkReady, setBlinkReady] = useState(false);
  const active = devices[selected];
  const bench = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => { let visible = false; const sync = () => setInView(visible && !document.hidden); const observer = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; sync();}); if(bench.current) observer.observe(bench.current); document.addEventListener("visibilitychange", sync); return () => {observer.disconnect();document.removeEventListener("visibilitychange",sync);}; }, []);
  return <div ref={bench} className="workbench" data-running={inView} data-mode={day ? "day" : "night"} data-device={active.id}>
    <div className="bench-toolbar"><span><i/> EDRIAN’S WORKBENCH</span><button type="button" aria-label="Day mode for entire website" title={day ? "Switch entire website to Night" : "Switch entire website to Day"} aria-pressed={day} onClick={onToggleTheme}><span key={day ? "sun" : "moon"} className="theme-symbol" aria-hidden="true">{day ? "☀" : "☾"}</span>{day ? "Day" : "Night"}</button></div>
    <div className="bench-scene">
      <div className="bench-window" aria-hidden="true"><i/><i/></div><div className="bench-halo" aria-hidden="true"/>
      <div className="bench-person" data-motion={inView && !avatarPaused}>
        <div key={selected} className="avatar-reaction"><div className="avatar-breathe">
          <img src={`${import.meta.env.BASE_URL}assets/ee678.png`} alt="Pixel Edrian working at his laptop"/>
          <img className="avatar-blink" src={`${import.meta.env.BASE_URL}assets/edrian-blink-v1.png`} alt="" aria-hidden="true" onLoad={()=>setBlinkReady(true)} style={{display:blinkReady?undefined:"none"}}/>
        </div></div>
      </div>
      <div className="bench-desk" aria-hidden="true"/>
      <button className="bench-device bench-laptop" type="button" aria-pressed={selected===0} onClick={()=>setSelected(0)}><span className="device-screen" aria-hidden="true">&lt;/&gt;<i/><b className="monitor-activity"/></span><span>Laptop</span></button>
      <button className="bench-device bench-pi" type="button" aria-pressed={selected===1} onClick={()=>setSelected(1)}><span className="device-board" aria-hidden="true"><i/><b/><em/></span><span>Raspberry Pi</span></button>
      <button className="bench-device bench-circuit" type="button" aria-pressed={selected===2} onClick={()=>setSelected(2)}><span className="device-circuit" aria-hidden="true"><i/><b/><em/></span><span>Circuit</span></button>
      <span className="bench-wire wire-left" aria-hidden="true"/><span className="bench-wire wire-right" aria-hidden="true"/>
    </div>
    <div className="bench-detail" aria-live="polite"><span className="experience-kicker">EXPLORE THE WORKSPACE / 0{selected+1}</span><h3>{active.title}</h3><p>{active.text}</p><div className="bench-chips">{active.chips.map(x=><span key={x}>{x}</span>)}</div></div>
    <div className="avatar-controls"><button className="avatar-motion-control" type="button" aria-pressed={avatarPaused} onClick={()=>setAvatarPaused(!avatarPaused)}><Glyph name={avatarPaused ? "play" : "pause"} size={13}/>{avatarPaused ? "Resume character" : "Pause character"}</button></div>
  </div>;
}

const produce = [{name:"Tomato",price:60,color:"#ee806f",kind:"tomato"},{name:"Carrot",price:80,color:"#f6b36d",kind:"carrot"},{name:"Eggplant",price:70,color:"#b69be2",kind:"eggplant"}];
export function ProduceArt({kind}:{kind:string}) {
  return <svg className={`produce-art produce-${kind}`} viewBox="0 0 100 100" aria-hidden="true"><path className="produce-body" d={kind==="carrot"?"M36 28Q70 20 72 42L36 87Q25 94 29 79Z":kind==="eggplant"?"M64 21Q89 46 59 77Q25 103 18 77Q13 60 43 39Z":"M50 28C20 14 7 48 20 72C32 96 72 95 84 70C97 43 79 17 50 28Z"}/><path className="produce-leaf" d={kind==="carrot"?"M48 27L39 7M54 25L62 6M59 30L78 19":"M47 29L38 16L52 21L60 9L61 23L76 24L64 34Z"}/><path className="produce-shine" d="M28 55q-3 12 5 17"/></svg>;
}

export function SmartDemo() {
  const [item,setItem]=useState(0); const [weight,setWeight]=useState(0.75); const [receipt,setReceipt]=useState(false);
  const current=produce[item]; const total=current.price*weight;
  return <div className="smart-demo">
    <div className="demo-intro"><div><span className="experience-kicker">TRY THE WORKFLOW</span><h4>From produce to receipt.</h4></div><span className="demo-badge">INTERACTIVE ILLUSTRATION</span></div>
    <p className="demo-disclaimer">A simplified concept demo with sample prices. No camera recognition, device connection, or real transaction takes place.</p>
    <div className="demo-layout"><div className="demo-controls"><label className="demo-label">01 / SELECT PRODUCE</label><div className="produce-options">{produce.map((p,i)=><button key={p.name} aria-pressed={item===i} type="button" onClick={()=>{setItem(i);setReceipt(false);}} style={{"--produce-color":p.color} as React.CSSProperties}><ProduceArt kind={p.kind}/><span>{p.name}</span></button>)}</div>
      <label className="demo-label" htmlFor="demo-weight">02 / ADJUST SAMPLE WEIGHT <strong>{weight.toFixed(2)} kg</strong></label><input id="demo-weight" type="range" min="0.25" max="3" step="0.25" value={weight} onChange={e=>{setWeight(Number(e.target.value));setReceipt(false);}}/><div className="weight-labels"><span>0.25 kg</span><span>3.00 kg</span></div>
      <button className="demo-checkout" type="button" onClick={()=>setReceipt(true)} disabled={receipt}><Glyph name="receipt" size={18}/>{receipt?"Sample receipt generated":"03 / Generate sample receipt"}</button>
    </div><div className="demo-result" aria-live="polite">{receipt?<div className="sample-receipt"><span className="experience-kicker">SMARTPOS / SAMPLE ONLY</span><h5>Sale illustration</h5><div><span>{current.name}</span><span>{weight.toFixed(2)} kg</span></div><div><span>Sample price / kg</span><span>₱{current.price.toFixed(2)}</span></div><div className="receipt-total"><span>Total</span><strong>₱{total.toFixed(2)}</strong></div><span className="receipt-bars" aria-hidden="true"/><p>No payment or sale was recorded.</p><button type="button" onClick={()=>{setReceipt(false);setItem(0);setWeight(.75);}}>Start again</button></div>:<div className="scale-display" style={{"--produce-color":current.color} as React.CSSProperties}><span className="experience-kicker">SIMULATED SCALE</span><ProduceArt kind={current.kind}/><h5>{current.name}</h5><div><span>{weight.toFixed(2)}<small> kg</small></span><strong>₱{total.toFixed(2)}</strong></div><p>Sample price: ₱{current.price.toFixed(2)} / kg</p></div>}</div></div>
  </div>;
}

const commands=[{label:"Selected work",detail:"Explore SmartPOS",target:"#work"},{label:"About Edrian",detail:"Background and engineering interests",target:"#about"},{label:"Services",detail:"Web, hardware, and prototyping",target:"#services"},{label:"Contact",detail:"Start a conversation",target:"#contact"},{label:"GitHub profile",detail:"github.com/Edrian-MP",target:"https://github.com/Edrian-MP"},{label:"Email Edrian",detail:"Open your email app",target:"mailto:edrianmonfortepatulot@gmail.com"}];
export function CommandPalette({disabled=false}:{disabled?:boolean}) {
  const [open,setOpen]=useState(false);const [query,setQuery]=useState("");const [active,setActive]=useState(0);const input=useRef<HTMLInputElement>(null);const previous=useRef<HTMLElement|null>(null);const panel=useRef<HTMLDivElement>(null);
  const matches=commands.filter(c=>(c.label+" "+c.detail).toLowerCase().includes(query.toLowerCase()));
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"&&!disabled){e.preventDefault();setOpen(v=>!v);}};document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key);},[disabled]);
  useEffect(()=>{if(!open)return;previous.current=document.activeElement as HTMLElement;const overflow=document.body.style.overflow;document.body.style.overflow="hidden";input.current?.focus();return()=>{document.body.style.overflow=overflow;previous.current?.focus();};},[open]);
  return <><button className="command-trigger" aria-label="Quick navigation" type="button" onClick={()=>{setQuery("");setActive(0);setOpen(true);}} disabled={disabled}><span aria-hidden="true">⌘</span><span>Quick jump</span><kbd>Ctrl K</kbd></button>{open&&<div className="command-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false);}}><div ref={panel} className="command-panel" role="dialog" aria-modal="true" aria-label="Quick navigation" onKeyDown={e=>{if(e.key==="Escape"){e.preventDefault();setOpen(false);}if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();setActive(n=>matches.length?(n+(e.key==="ArrowDown"?1:-1)+matches.length)%matches.length:0);}if(e.key==="Enter"&&document.activeElement===input.current){e.preventDefault();panel.current?.querySelectorAll<HTMLAnchorElement>(".command-result")[active]?.click();}if(e.key==="Tab"){const nodes=[...panel.current!.querySelectorAll<HTMLElement>("input,button,a")];if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus();}else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus();}}}}><div className="command-input-row"><input ref={input} value={query} onChange={e=>{setQuery(e.target.value);setActive(0);}} placeholder="Where would you like to go?" aria-label="Search navigation"/><button aria-label="Close quick navigation" onClick={()=>setOpen(false)}><Glyph name="close"/></button></div><div className="command-results">{matches.map((c,i)=><a key={c.target} className="command-result" data-active={i===active} href={c.target} target={c.target.startsWith("https")?"_blank":undefined} rel={c.target.startsWith("https")?"noreferrer":undefined} onClick={()=>setOpen(false)}><span>{c.label}<small>{c.detail}</small></span><Glyph name={c.target.startsWith("#")?"right":"diagonal"} size={18}/></a>)}{!matches.length&&<p className="command-empty">No matches. Try “work” or “contact”.</p>}</div><div className="command-footer">↑ ↓ to explore <span>Enter to open · Esc to close</span></div></div></div>}</>;
}
