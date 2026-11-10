import { useEffect, useRef, useState } from "react";

export function Glyph({ name, size = 20 }: { name: "close" | "diagonal" | "right" | "camera" | "scale" | "review" | "storage" | "receipt" | "up" | "play" | "pause" | "plus"; size?: number }) {
  const paths = { close: "M6 6l12 12M18 6 6 18", diagonal: "M6 18 18 6M6 6h12v12", right: "M5 12h14M13 6l6 6-6 6", camera: "M4 7h4l2-3h4l2 3h4v13H4ZM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0", scale: "M12 3v17M5 20h14M4 7h16M6 7l-4 7h8ZM18 7l-4 7h8Z", review: "M9 4H5v17h14V4h-4M9 3h6v4H9ZM8 14l3 3 5-6", storage: "M20 6c0 2-16 2-16 0s16-2 16 0ZM4 6v12c0 3 16 3 16 0V6M4 12c0 3 16 3 16 0", receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2ZM9 7h6M9 11h6M9 15h3", up: "M12 19V5M5 12l7-7 7 7", play: "M8 5l11 7-11 7Z", pause: "M8 5v14M16 5v14", plus: "M5 12h14M12 5v14" };
  return <svg className="ui-glyph" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}

export function ScrollDetails() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
      progressRef.current?.style.setProperty("--read-progress", String(progress));
      setVisible(scrollY > 600);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); };
  }, []);
  return <div ref={progressRef} className="scroll-details"><div className="reading-line" aria-hidden="true" />{visible && <a className="back-to-top round-control" href="#home" aria-label="Back to top"><Glyph name="up" /><span className="top-tooltip">Back to top</span></a>}</div>;
}

export function ContactBeacon() {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let visible = false;
    const sync = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return <div ref={ref} className="contact-beacon" data-running={running} aria-hidden="true"><div className="beacon-ring ring-a"/><div className="beacon-ring ring-b"/><div className="beacon-ring ring-c"/><span className="beacon-orbit"><i/></span><span className="beacon-center"><Glyph name="diagonal" size={32}/></span><span className="beacon-cross cross-a">+</span><span className="beacon-cross cross-b">+</span></div>;
}
