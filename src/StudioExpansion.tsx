import { useState } from "react";

const panel="rounded-2xl border border-[#293345] bg-[#141a24] p-5 sm:p-7";
const overline="font-mono-design text-[11px] text-[#76a7ff]";
const heading="font-inter-semibold mt-2 text-[24px] text-[#f1f5fc]";
const body="font-inter-regular mt-3 text-[14px] leading-[1.7] text-[#a3afc2]";
const button="rounded-lg border border-[#33445f] bg-[#0d1421] px-3 py-2 text-[13px] text-[#f1f5fc]";
const field="mt-2 w-full rounded-lg border border-[#33445f] bg-[#0d1421] p-2 text-[#f1f5fc]";
const nodes=[
 {id:"camera",group:"Inputs",name:"Cameras",desc:"Supply produce images to the recognition workflow.",links:["pi"]},
 {id:"scale",group:"Inputs",name:"Load cell + HX711",desc:"Measures load-cell signals for the weighing subsystem.",links:["arduino","pi"]},
 {id:"arduino",group:"Inputs",name:"Arduino",desc:"Supports the hardware integration layer. Exact pin assignments are outside this overview.",links:["pi"]},
 {id:"pi",group:"Terminal",name:"Raspberry Pi 5",desc:"Hosts the Linux-based point-of-sale terminal and local processing.",links:["pos"]},
 {id:"pos",group:"Terminal",name:"Python / Tkinter POS",desc:"Combines produce recognition and weight information with item pricing and checkout.",links:["db","printer","display"]},
 {id:"db",group:"Terminal",name:"SQLite",desc:"Retains local transaction records independently of internet availability.",links:["sync"]},
 {id:"sync",group:"Connected services",name:"FastAPI sync receiver",desc:"Supports the separate synchronization workflow between local and cloud records.",links:["cloud"]},
 {id:"cloud",group:"Connected services",name:"Supabase",desc:"Provides cloud services for the connected records and web administration.",links:["web"]},
 {id:"web",group:"Connected services",name:"React web admin",desc:"Provides an interface for inventory and sales records.",links:[]},
 {id:"printer",group:"Outputs",name:"Thermal printer",desc:"Produces transaction receipts.",links:[]},
 {id:"display",group:"Outputs",name:"Customer display",desc:"Displays transaction information to the customer.",links:[]}
];
const modes=["System","Hardware","Software","Data flow"] as const;
const groups=["Inputs","Terminal","Connected services","Outputs"];
export function Architecture() {
 const [selected,setSelected]=useState<string|null>(null);const [mode,setMode]=useState<typeof modes[number]>("System");
 const allowed=mode==="Hardware"?["camera","scale","arduino","pi","printer","display"]:mode==="Software"?["pi","pos","db","sync","cloud","web"]:mode==="Data flow"?["camera","scale","pi","pos","db","sync","cloud","web","printer","display"]:nodes.map(n=>n.id);
 const relevant=nodes.filter(n=>allowed.includes(n.id));
 return <section className={panel+" md:col-span-2 studio-mobile-section"} aria-label="SmartPOS conceptual architecture">
 <p className={overline}>SYSTEM ARCHITECTURE / EXPLORER</p><h3 className={heading}>From physical inputs to connected records</h3><p className={body}>Select a component to reveal its role and related components directly below it. This is a conceptual system map, not a wiring schematic or network trace.</p>
 <div className="mt-5 flex flex-wrap gap-2">{modes.map(m=><button key={m} type="button" className={button+" studio-mode"} aria-pressed={mode===m} onClick={()=>{setMode(m);setSelected(null);}}>{m}</button>)}</div>
 <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{groups.map((g,i)=>{const items=relevant.filter(n=>n.group===g);return items.length?<div key={g} className="rounded-xl border border-[#293345] bg-[#0d1421] p-3 studio-architecture-group"><p className={overline}>0{i+1} / {g}</p><div className="mt-3 grid gap-2">{items.map(n=>{const open=selected===n.id;const id="arch-detail-"+n.id;const connected=nodes.filter(c=>n.links.includes(c.id)||c.links.includes(n.id));return <div className="studio-disclosure" data-open={open} key={n.id}><button id={id+"-button"} aria-expanded={open} aria-controls={id} className={button+" studio-disclosure-toggle"} type="button" onClick={()=>setSelected(open?null:n.id)}><span>{n.name}</span><span className="studio-chevron" aria-hidden="true">{open?"−":"+"}</span></button><div id={id} role="region" aria-labelledby={id+"-button"} hidden={!open} className="studio-inline-detail"><p className={body}>{n.desc}</p>{connected.length>0&&<><p className={overline+" mt-3"}>RELATED COMPONENTS</p><ul className="studio-related">{connected.map(c=><li key={c.id}>{c.name}</li>)}</ul></>}</div></div>})}</div></div>:null;})}</div>
 </section>;
}
function ADC(){
 const [bits,setBits]=useState(10),[voltage,setVoltage]=useState(1.65),[ref,setRef]=useState(3.3);
 const max=2**bits-1,code=Math.min(max,Math.floor(voltage/ref*(max+1))),step=ref/(max+1);
 return <article className={panel}><p className={overline}>03 / ANALOG INPUT</p><h3 className={heading}>ADC simulator</h3><p className={body}>Ideal unipolar ADC model with saturation at full scale.</p><label className={body+" block"}>Resolution<select className={field} value={bits} onChange={e=>setBits(+e.target.value)}>{[8,10,12].map(n=><option key={n} value={n}>{n}-bit</option>)}</select></label><label className={body+" block"}>Reference voltage<select className={field} value={ref} onChange={e=>{const v=+e.target.value;setRef(v);setVoltage(x=>Math.min(x,v));}}><option value={3.3}>3.3 V</option><option value={5}>5 V</option></select></label><label className={body+" block"}>Input: {voltage.toFixed(2)} V<input type="range" className="mt-2 w-full" style={{accentColor:"#76a7ff"}} min={0} max={ref} step={0.01} value={voltage} onChange={e=>setVoltage(+e.target.value)}/></label><div className="mt-4 h-3 overflow-hidden rounded-lg bg-[#293345]"><div style={{width:(voltage/ref*100)+"%",height:"100%",background:"#76a7ff"}}/></div><div className="mt-5 grid grid-cols-2 gap-3"><div><p className={overline}>DIGITAL CODE</p><p className={heading}>{code} / {max}</p></div><div><p className={overline}>LSB SIZE</p><p className={heading}>{(step*1000).toFixed(2)} mV</p></div></div><p className={body} style={{overflowWrap:"anywhere"}}>Binary: {code.toString(2).padStart(bits,"0")}</p></article>
}
const colors=["Black","Brown","Red","Orange","Yellow","Green","Blue","Violet","Gray","White","Gold","Silver"];
const hex=["#20232a","#834925","#df4545","#f29336","#f0cb40","#42a45c","#4779dc","#a66bda","#9299a5","#f8f7f2","#bc9b45","#c4cad3"];
function Resistor(){
 const [first,setFirst]=useState(4),[second,setSecond]=useState(7),[mult,setMult]=useState(2),[tol,setTol]=useState(10);
 const v=(first*10+second)*10**(mult===10?-1:mult===11?-2:mult),ts=tol===10?5:tol===11?10:tol===1?1:2;
 const value=v>=1e6?(v/1e6)+" MΩ":v>=1000?(v/1000)+" kΩ":Number(v.toPrecision(6))+" Ω";
 return <article className={panel}><p className={overline}>04 / PASSIVE COMPONENTS</p><h3 className={heading}>Resistor color codes</h3><svg viewBox="0 0 320 100" role="img" aria-label={`Four band resistor ${colors[first]}, ${colors[second]}, ${colors[mult]}, ${colors[tol]}`} className="mt-4 w-full"><path d="M8 50 H312" stroke="#a3afc2" strokeWidth="5"/><rect x="62" y="23" width="196" height="54" rx="18" fill="#d5bb8b"/>{[first,second,mult,tol].map((n,i)=><rect key={i} x={[93,129,165,222][i]} y="23" width="15" height="54" rx="2" fill={hex[n]}/>)}</svg><div className="grid grid-cols-2 gap-3">{[{label:"First digit",v:first,set:setFirst,options:[1,2,3,4,5,6,7,8,9]},{label:"Second digit",v:second,set:setSecond,options:[0,1,2,3,4,5,6,7,8,9]},{label:"Multiplier",v:mult,set:setMult,options:[0,1,2,3,4,5,6,7,8,9,10,11]},{label:"Tolerance",v:tol,set:setTol,options:[1,2,10,11]}].map(f=><label key={f.label} className={body}>{f.label}<select className={field} value={f.v} onChange={e=>f.set(+e.target.value)}>{f.options.map(i=><option key={i} value={i}>{colors[i]}</option>)}</select></label>)}</div><div className="mt-5 rounded-xl border border-[#33445f] bg-[#0d1421] p-4" aria-live="polite"><p className={overline}>NOMINAL RESISTANCE</p><p className={heading}>{value} ±{ts}%</p><p className={body}>{Number((v*(1-ts/100)).toPrecision(6))}–{Number((v*(1+ts/100)).toPrecision(6))} Ω</p></div></article>
}
const protocols=["UART","SPI","I2C"] as const;
function Protocol(){
 const [protocol,setProtocol]=useState<typeof protocols[number]>("UART"),[byte,setByte]=useState(165),[baud,setBaud]=useState(9600);
 const bits=byte.toString(2).padStart(8,"0").split("").map(Number);
 const data=protocol==="UART"?[0,...bits.slice().reverse(),1]:protocol==="SPI"?bits:[...bits,0];
 const rows=protocol==="UART"?[{label:"TX",values:data}]:protocol==="SPI"?[{label:"MOSI",values:data},{label:"SCLK",values:data.map(()=>1)},{label:"CS",values:data.map(()=>0)}]:[{label:"SDA",values:data},{label:"SCL",values:data.map(()=>1)}];
 return <article className={panel+" lg:col-span-2"}><p className={overline}>05 / COMMUNICATION</p><h3 className={heading}>Serial protocol visualizer</h3><div className="mt-4 flex flex-wrap gap-2">{protocols.map(p=><button type="button" className={button} key={p} aria-pressed={protocol===p} style={{borderColor:p===protocol?"#76a7ff":undefined}} onClick={()=>setProtocol(p)}>{p}</button>)}</div><label className={body+" block"}>Data byte: 0x{byte.toString(16).toUpperCase().padStart(2,"0")} ({byte})<input className="mt-2 w-full" style={{accentColor:"#76a7ff"}} type="range" min={0} max={255} value={byte} onChange={e=>setByte(+e.target.value)}/></label>{protocol==="UART"&&<label className={body+" block"}>Baud rate<select className={field} value={baud} onChange={e=>setBaud(+e.target.value)}>{[9600,19200,57600,115200].map(b=><option key={b}>{b}</option>)}</select></label>}
 <svg viewBox={`0 0 340 ${rows.length*45+32}`} role="img" aria-label={`${protocol} illustrative serial waveform for byte ${byte}`} className="mt-5 w-full rounded-xl border border-[#293345] bg-[#0d1421]">{rows.map((row,i)=>{const w=260/data.length;const y=18+i*45;const clock=row.label==="SCLK"||row.label==="SCL";const d=row.values.map((v,j)=>{const x=64+j*w;return clock?`M ${x} ${y+20} H ${x+w*.3} V ${y} H ${x+w*.7} V ${y+20} H ${x+w}`:`${j===0?"M":"V"} ${j===0?x+" ":""}${y+(v?0:20)} H ${x+w}`;}).join(" ");return <g key={row.label}><text x="9" y={y+13} fontSize="10" fill="#a3afc2">{row.label}</text>{data.map((_,j)=><path key={j} d={`M ${64+j*w} ${y-5} V ${y+27}`} stroke="#293345" strokeDasharray="2 3"/>)}<path d={d} fill="none" stroke="#76a7ff" strokeWidth="2"/></g>;})}{data.map((v,i)=><text key={i} x={64+(i+.5)*260/data.length} y={rows.length*45+17} fontSize="10" fill="#a3afc2" textAnchor="middle">{protocol==="UART"&&i===0?"S":protocol==="UART"&&i===9?"P":protocol==="I2C"&&i===8?"ACK":v}</text>)}</svg><p className={body}>{protocol==="UART"?`8N1, idle high (outside diagram), start low, LSB first, stop high. Bit time: ${(1e6/baud).toFixed(2)} µs.`:protocol==="SPI"?"Illustrative mode 0 transfer: clock idle low, data stable at rising edges, MSB first, active-low chip select. MISO is omitted.":"Illustrative I²C data byte within a transaction: MSB first, receiver ACK low on the ninth clock. START, address and STOP are outside this byte-level view."}</p></article>
}
export function ExtraLab(){return <div className="mt-5 grid gap-5 lg:grid-cols-2"><ADC/><Resistor/><Protocol/></div>}
const skills=[
 {group:"Programming",items:[["Python","SmartPOS local application runs in Python."],["TypeScript","React web admin and portfolio."],["SQL / SQLite","Local transaction storage in SmartPOS."]]},
 {group:"Web applications",items:[["React","Web administration and portfolio interface."],["Vite","Build tooling for both web projects."],["Tailwind CSS","Web interface styling."]]},
 {group:"Embedded systems",items:[["Raspberry Pi","Linux-based checkout terminal."],["Arduino","Hardware integration in SmartPOS."],["Load cell / HX711","Digital weighing subsystem."],["Linux","Device setup and application environment."]]},
 {group:"Connected systems",items:[["Supabase","SmartPOS cloud services."],["FastAPI","SmartPOS synchronization receiver."],["GitHub / Vercel","Version control and portfolio preview deployments."]]}
];
export function SkillsMap(){
 const [selected,setSelected]=useState<string|null>(null);
 return <section id="skill-map" className="reveal-section scroll-mt-6 studio-mobile-section">
  <p className={overline}>TECHNOLOGY MAP</p><h2 className="font-inter-semibold mt-3 text-[34px] text-[#f1f5fc]">Skills in context</h2>
  <p className={body}>Tap a technology to see how it is used across SmartPOS and this studio. These are application examples, not proficiency ratings.</p>
  <div className="mt-5 grid gap-3 sm:grid-cols-2">{skills.map((g,gi)=><article className={panel+" studio-skill-cluster"} key={g.group}><p className={overline}>{g.group}</p><div className="mt-3 grid gap-2">{g.items.map((n,ni)=>{const open=selected===n[0];const id="skill-detail-"+gi+"-"+ni;return <div key={n[0]} className="studio-disclosure" data-open={open}>
  <button id={id+"-button"} type="button" className={button+" studio-disclosure-toggle"} aria-expanded={open} aria-controls={id} onClick={()=>setSelected(open?null:n[0])}><span>{n[0]}</span><span aria-hidden="true" className="studio-chevron">{open?"−":"+"}</span></button>
  <div id={id} role="region" aria-labelledby={id+"-button"} hidden={!open} className="studio-inline-detail"><p className={body}>{n[1]}</p><a className="text-link" href="#work">Explore featured work →</a></div>
  </div>})}</div></article>)}</div>
 </section>
}
export function Resume(){return <section id="resume" className={panel+" reveal-section scroll-mt-6"}><p className={overline}>PROFESSIONAL PROFILE</p><h2 className="font-inter-semibold mt-3 text-[34px] text-[#f1f5fc]">Edrian Monforte Patulot</h2><p className={body}>BS Computer Engineering student · Embedded systems · Web development</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><div><p className={overline}>EDUCATION</p><h3 className={heading}>STI College Balayan</h3><p className={body}>BS Computer Engineering, fourth year (current).</p></div><div><p className={overline}>SELECTED PROJECT</p><h3 className={heading}>SmartPOS</h3><p className={body}>Hardware and software integration, Linux environment setup, web dashboard integration and hosting.</p></div></div><p className={overline+" mt-6"}>TECHNICAL AREAS</p><p className={body}>Python · React · TypeScript · Raspberry Pi · Arduino · Linux · SQLite · GitHub</p><a className="primary-button mt-5" href={import.meta.env.BASE_URL+"resume.html"} target="_blank" rel="noreferrer">Open printable résumé ↗</a></section>}
