import { useEffect, useRef, useState } from "react";

const services = [
  { id: "web", title: "Web Applications", label: "01 / DIGITAL", summary: "Website implementation, database integration, and deployment.", tags: ["Interfaces", "Databases", "Deployment"], subject: "Web Applications" },
  { id: "hardware", title: "Hardware–Software Integration", label: "02 / CONNECTED", summary: "Raspberry Pi, Arduino, sensors, and connected interfaces.", tags: ["Raspberry Pi", "Arduino", "Sensors"], subject: "Hardware–Software Integration" },
  { id: "prototype", title: "Engineering Prototypes", label: "03 / EXPERIMENTAL", summary: "Proof-of-concept builds, troubleshooting, and capstone technical support.", tags: ["Prototyping", "Troubleshooting", "Technical support"], subject: "Engineering Prototypes" },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let inView = false;
    const sync = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  function move(event: React.PointerEvent<HTMLElement>) {
    if (paused || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const node = event.currentTarget;
    const box = node.getBoundingClientRect();
    node.style.setProperty("--service-x", `${event.clientX - box.left}px`);
    node.style.setProperty("--service-y", `${event.clientY - box.top}px`);
    node.style.setProperty("--tilt-x", `${-(event.clientY - box.top - box.height / 2) / box.height * 4}deg`);
    node.style.setProperty("--tilt-y", `${(event.clientX - box.left - box.width / 2) / box.width * 4}deg`);
  }

  return (
    <section ref={sectionRef} id="services" className="services-section reveal-section" aria-labelledby="services-heading" data-running={active && !paused} data-paused={paused}>
      <div className="services-heading-row">
        <div>
          <p className="service-eyebrow">IDEA → PROTOTYPE → IMPLEMENTATION</p>
          <h2 id="services-heading">What I can help with.</h2>
          <p className="services-intro">Digital interfaces. Physical systems. The connections between them.</p>
        </div>
        <button className="motion-control" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span> {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
      <div className="service-grid">
        {services.map(service => (
          <article key={service.id} className={`service-card service-${service.id}`} onPointerMove={move} onPointerLeave={event => { event.currentTarget.style.setProperty("--tilt-x", "0deg"); event.currentTarget.style.setProperty("--tilt-y", "0deg"); }}>
            <div className="service-visual" aria-hidden="true">
              <span className="visual-coordinate">{service.id === "web" ? "interface.tsx" : service.id === "hardware" ? "signal / bridge" : "prototype / lab"}</span>
              {service.id === "web" ? (
                <div className="mini-browser"><div className="mini-browser-bar"><i /><i /><i /><span>build / preview</span></div><div className="mini-browser-body"><div className="mini-sidebar"/><div className="mini-content"><div className="mini-code">&lt;idea /&gt;<span className="code-caret"/></div><div className="mini-line"/><div className="mini-widgets"><i/><i/><i/></div></div></div><span className="browser-scan"/></div>
              ) : service.id === "hardware" ? (
                <div className="circuit-scene"><span className="circuit-label circuit-input">SENSOR</span><span className="circuit-track track-left"/><span className="circuit-chip">I/O<small>BRIDGE</small></span><span className="circuit-track track-right"/><span className="circuit-label circuit-output">APP</span><span className="signal-packet packet-one"/><span className="signal-packet packet-two"/></div>
              ) : (
                <div className="prototype-scene"><div className="orbit orbit-one"><i/></div><div className="orbit orbit-two"><i/></div><div className="prototype-core"><span>+</span></div><span className="prototype-axis axis-horizontal"/><span className="prototype-axis axis-vertical"/><span className="prototype-note">test. adjust. repeat.</span></div>
              )}
            </div>
            <div className="service-copy"><p className="service-eyebrow">{service.label}</p><h3>{service.title}</h3><p className="service-summary">{service.summary}</p><ul className="service-tags">{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              <a className="service-cta" href={`mailto:edrianmonfortepatulot@gmail.com?subject=${encodeURIComponent(`Project inquiry — ${service.subject}`)}`}>Discuss a project <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
