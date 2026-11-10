import { useEffect, useRef, useState } from "react";
import { Glyph } from "./VisualDetails";
import { swipeDirection } from "./galleryGestures";

const screenshots = [
  { file:"recognition", title:"Produce recognition", category:"SELLER TERMINAL", caption:"Three camera views show carrots on the scale, with Carrot selected by the recognition interface. The confidence shown belongs to this captured session; it is not a measured accuracy benchmark.", alt:"SmartPOS terminal with three camera views of carrots, a carrot recognition label, weight reading, and checkout controls" },
  { file:"terminal", title:"Sales terminal", category:"SELLER TERMINAL", caption:"The selling workspace brings together camera feeds, scale weight, quick product selection, a cart, and checkout controls.", alt:"SmartPOS selling screen with three scanning camera feeds, quick-select produce buttons, weight reading, and an empty cart" },
  { file:"price-inquiry", title:"Price inquiry", category:"SELLER TERMINAL", caption:"The price-inquiry panel presents the detected produce, weight, unit price, and an estimated total before checkout.", alt:"AI Price Inquiry panel showing carrot, 0.37 kilogram weight, unit price, and estimated total" },
  { file:"customer-display", title:"Customer display", category:"CUSTOMER VIEW", caption:"A separate customer-facing view presents the current item, weight, unit price, cart entries, and total due.", alt:"Customer-facing SmartPOS screen with an Onion label, large weight reading, cart items, and total due" },
  { file:"inventory", title:"Inventory management", category:"ADMIN DASHBOARD", caption:"The inventory view lists produce names, prices per kilogram, and stock levels, with controls for adding products and adjusting stock.", alt:"SmartPOS admin inventory table with product names, price per kilogram, stock levels, and stock adjustment controls" },
  { file:"training", title:"Recognition training", category:"ADMIN DASHBOARD", caption:"The training screen provides a product label, three-camera capture or folder upload, and dataset-image capture controls.", alt:"SmartPOS training screen with three camera feeds, a product label field, capture and upload options, and a dataset capture button" },
  { file:"reports", title:"Sales reporting", category:"ADMIN DASHBOARD", caption:"Reports summarize products by volume and transaction count, alongside a dated sales summary.", alt:"SmartPOS reports screen with product-volume and transaction-count bar charts and a daily sales summary table" },
  { file:"history", title:"Transaction history", category:"ADMIN DASHBOARD", caption:"The history view combines date filtering, sales entries, stock adjustments, and receipt and export controls.", alt:"SmartPOS history table with a date range, sales and stock-adjustment entries, and PDF export and receipt controls" },
  { file:"pin-access", title:"PIN access", category:"ACCESS SCREEN", caption:"A numeric keypad provides the terminal’s PIN-entry screen. No access PIN is shown in this capture.", alt:"SmartPOS access screen with an empty PIN field, numeric keypad, Clear, and Go buttons" },
];
const source = (file:string) => `${import.meta.env.BASE_URL}assets/smartpos/${file}.png`;

export function SmartPOSCover() {
  return <span className="smartpos-cover"><span className="cover-heading"><span>SMARTPOS / IN ACTION</span><span>ACTUAL SCREEN</span></span><span className="cover-image"><img src={source("recognition")} width="900" height="562" loading="lazy" alt="Actual SmartPOS interface identifying carrots across three camera feeds"/></span><span className="cover-caption"><span>Three cameras. One connected workflow.</span><span className="cover-count">9 screens <Glyph name="diagonal" size={15}/></span></span></span>;
}

export default function SmartGallery() {
  const [active,setActive]=useState(0);
  const tabs=useRef<HTMLDivElement>(null);
  const viewer=useRef<HTMLDialogElement>(null);
  const opener=useRef<HTMLButtonElement>(null);
  const touch=useRef<{x:number;y:number}|null>(null);
  const [expanded,setExpanded]=useState(false);
  const [zoom,setZoom]=useState(false);
  useEffect(()=>{if(expanded&&!viewer.current?.open)viewer.current?.showModal();},[expanded]);
  const shot=screenshots[active];
  const select=(next:number,focus=false)=>{
    const index=(next+screenshots.length)%screenshots.length;
    setActive(index);
    setZoom(false);
    const button=tabs.current?.querySelectorAll<HTMLButtonElement>("button")[index];
    if(focus) button?.focus({preventScroll:true});
    if (button && tabs.current) tabs.current.scrollTo({left:Math.max(0,button.offsetLeft-(tabs.current.clientWidth-button.clientWidth)/2),behavior:"instant"});
  };
  return <section className="smart-gallery" aria-labelledby="smart-gallery-heading">
    <div className="gallery-heading"><div><p className="experience-kicker">ACTUAL APPLICATION / SCREEN GALLERY</p><h3 id="smart-gallery-heading">Inside the real SmartPOS.</h3></div><span className="gallery-tag">9 ORIGINAL CAPTURES</span></div>
    <div className="gallery-stage" id="gallery-image-panel" role="tabpanel" aria-labelledby={`gallery-tab-${active}`}>
      <button ref={opener} type="button" className="gallery-image-link" onClick={()=>setExpanded(true)} aria-label={`Open fullscreen screenshot: ${shot.title}`}><img key={shot.file} src={source(shot.file)} width="906" height="564" alt={shot.alt}/><span className="gallery-expand">Open fullscreen <Glyph name="diagonal" size={15}/></span></button>
      <div className="gallery-caption"><div aria-live="polite"><p className="experience-kicker">{shot.category}</p><h4>{shot.title}</h4><p>{shot.caption}</p></div><div className="gallery-controls"><button className="round-control" type="button" aria-label="Previous screenshot" onClick={()=>select(active-1)}><span className="gallery-prev"><Glyph name="right" size={18}/></span></button><span>{String(active+1).padStart(2,"0")} / 09</span><button className="round-control" type="button" aria-label="Next screenshot" onClick={()=>select(active+1)}><Glyph name="right" size={18}/></button></div></div>
    </div>
    <div ref={tabs} className="gallery-thumbnails" role="tablist" aria-label="SmartPOS screenshots" onKeyDown={e=>{let next=active;if(e.key==="ArrowRight"||e.key==="ArrowDown")next++;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")next--;else if(e.key==="Home")next=0;else if(e.key==="End")next=screenshots.length-1;else return;e.preventDefault();select(next,true);}}>
      {screenshots.map((s,i)=><button key={s.file} id={`gallery-tab-${i}`} role="tab" type="button" aria-controls="gallery-image-panel" aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>select(i)}><img src={source(s.file)} width="160" height="100" loading="lazy" alt=""/><span><b>{String(i+1).padStart(2,"0")}</b>{s.title}</span></button>)}
    </div>
    <dialog ref={viewer} className="image-viewer" aria-labelledby="viewer-title" onClose={()=>{setExpanded(false);setZoom(false);opener.current?.focus({preventScroll:true});}} onKeyDown={e=>{e.stopPropagation();if(e.key==="ArrowRight"){e.preventDefault();select(active+1);}if(e.key==="ArrowLeft"){e.preventDefault();select(active-1);}}}>
      <header className="viewer-header"><div><span className="experience-kicker">SMARTPOS / SCREEN GALLERY</span><h3 id="viewer-title">{shot.title}</h3></div><button className="round-control" type="button" aria-label="Close fullscreen viewer" onClick={()=>viewer.current?.close()} autoFocus><Glyph name="close"/></button></header>
      <div className="viewer-image-area" data-zoom={zoom} onTouchStart={e=>{if(e.touches.length===1)touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};else touch.current=null;}} onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start||zoom||e.changedTouches.length!==1)return;const direction=swipeDirection(start,{x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY});if(direction)select(active+direction);}}><img key={shot.file} src={source(shot.file)} alt={shot.alt}/></div>
      <footer className="viewer-footer"><div className="viewer-paging"><button className="round-control" type="button" aria-label="Previous fullscreen screenshot" onClick={()=>select(active-1)}><span className="gallery-prev"><Glyph name="right"/></span></button><span aria-live="polite">{String(active+1).padStart(2,"0")} / 09</span><button className="round-control" type="button" aria-label="Next fullscreen screenshot" onClick={()=>select(active+1)}><Glyph name="right"/></button></div><div className="viewer-tools"><button type="button" aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?"Fit screen":"Zoom in"}</button><a href={source(shot.file)} target="_blank" rel="noreferrer">Original image <Glyph name="diagonal" size={14}/></a></div><p>Swipe or use ← → to explore · Esc to close</p></footer>
    </dialog>
    <p className="gallery-footnote">Original application screenshots supplied by Edrian. On-screen values reflect the captured sessions.</p>
  </section>;
}
