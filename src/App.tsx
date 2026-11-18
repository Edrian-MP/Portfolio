import { useCallback, useEffect, useRef, useState } from "react";
import Services from "./Services";
import { Architecture, ExtraLab, SkillsMap, Resume } from "./StudioExpansion";
import TechnicalSkills from "./TechnicalSkills";
import SectionNavigation, { useActiveSection } from "./SectionNavigation";
import SmartGallery, { SmartPOSCover } from "./SmartGallery";
import { useTheme } from "./useTheme";
import { flushSync } from "react-dom";
import { Workbench, SmartDemo, CommandPalette } from "./Experiences";
import { ContactBeacon, Glyph, ScrollDetails } from "./VisualDetails";

type ProjectLink =
  | { status: "missing" }
  | { status: "private" }
  | { status: "available"; url: string };

type StackGroup = {
  title: string;
  items: string[];
};

type Project = {
  category: string;
  title: string;
  fullTitle: string;
  summary: string;
  overview: string;
  intendedUsers: string;
  problem: string;
  contribution: string;
  keyCapabilities: string[];
  stack: StackGroup[];
  challenges: string;
  repository: ProjectLink;
  demo: ProjectLink;
};

const projects: Project[] = [
  {
    category: "FEATURED PROJECT",
    title: "SmartPOS",
    fullTitle: "Inventory System and POS with Smart Weighing Scale for Fresh Produce",
    summary:
      "A point-of-sale and inventory system for produce vendors that uses cameras to identify items and a digital scale to calculate prices by weight.",
    overview:
      "The Raspberry Pi terminal handles weighing, produce recognition, and checkout. It stores sales locally, and a separate web dashboard provides access to inventory and sales records.",
    intendedUsers: "Produce vendors and stall owners in public markets.",
    problem:
      "Selling produce by weight involves identifying the item, weighing it, applying the correct price per kilogram, and recording the sale. SmartPOS brings those steps into a single checkout workflow.",
    contribution:
      "I worked on integrating the hardware with the point-of-sale software, setting up the Linux environment, and connecting the terminal to the web dashboard. I also worked on hosting the web application.",
    keyCapabilities: [
      "Camera-based produce identification",
      "Smart weighing using a load cell and HX711",
      "Point-of-sale transactions and checkout",
      "Product catalog and inventory management",
      "Produce recognition training tools for owners",
      "Price inquiry",
      "Sales history and reporting",
      "Customer-facing transaction display",
      "Receipt printing",
      "Separate owner and seller access",
      "Local transaction storage and cloud synchronization",
      "Web administration dashboard",
    ],
    stack: [
      {
        title: "Main terminal",
        items: ["Python", "Tkinter", "SQLite", "Raspberry Pi / Linux"],
      },
      {
        title: "Produce recognition",
        items: [
          "MobileNetV2 feature extraction",
          "Distance-weighted k-nearest neighbors classifier",
        ],
      },
      {
        title: "Hardware",
        items: [
          "Raspberry Pi 5",
          "Arduino",
          "Load cell and HX711",
          "Three webcams",
          "Vendor touchscreen",
          "Customer display",
          "Thermal printer",
        ],
      },
      {
        title: "Web Admin",
        items: ["React", "TypeScript", "Vite", "Tailwind CSS / CSS"],
      },
      {
        title: "Cloud and synchronization",
        items: ["Supabase", "FastAPI synchronization receiver"],
      },
    ],
    challenges:
      "The main challenge was integrating the cameras and scale with the checkout software in a Linux environment. The web dashboard added a second integration task because it needed to work with sales records stored on the terminal.",
    repository: { status: "private" },
    demo: { status: "missing" },
  },
];

function supportsPointerMotion(event: React.PointerEvent<HTMLElement>) {
  return (
    event.pointerType === "mouse" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function updateSpotlight(event: React.PointerEvent<HTMLElement>) {
  if (!supportsPointerMotion(event)) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project, trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      className="project-card group grid w-full gap-6 rounded-[22px] border border-[#293345] bg-[#141a24] p-5 text-left sm:p-6 lg:grid-cols-[1.1fr_.9fr] lg:items-stretch"
      type="button"
      onClick={(event) => onOpen(project, event.currentTarget)}
      onPointerMove={updateSpotlight}
      aria-label={`View details for ${project.title}`}
    >
      <SmartPOSCover />
      <span className="flex flex-col items-start justify-center gap-4">
        <span className="font-mono-design text-[11px] leading-[1.25] text-[#76a7ff]">
          {project.category}
        </span>
        <span className="font-inter-semibold text-[32px] leading-[1.15] text-[#f1f5fc]">
          {project.title}
        </span>
        <span className="font-inter-semibold text-[16px] leading-[1.45] text-[#d7deeb]">
          {project.fullTitle}
        </span>
        <span className="font-inter-regular text-[15px] leading-[1.6] text-[#a3afc2]">
          {project.summary}
        </span>
        <span className="font-mono-design text-[11px] leading-[1.5] text-[#a3afc2]">
          {project.stack
            .slice(0, 3)
            .map((group) => group.title)
            .join(" · ")}
        </span>
        <span className="font-inter-semibold text-[15px] leading-[1.25] text-[#f1f5fc] transition-colors group-hover:text-[#8bb5ff]">
          View project <span className="arrow-shift" aria-hidden="true"><Glyph name="right" size={18}/></span>
        </span>
      </span>
    </button>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector(".image-viewer[open]")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!modalRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[#070a10]/85 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="modal-panel h-dvh w-full overflow-y-auto bg-[#141a24] shadow-2xl sm:h-auto sm:max-h-[calc(100dvh-48px)] sm:max-w-[1120px] sm:rounded-[22px] sm:border sm:border-[#33445f]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        aria-describedby="project-modal-summary"
      >
        <div className="sticky top-0 z-20 flex items-start justify-between gap-5 border-b border-[#293345] bg-[#141a24]/95 px-5 py-4 backdrop-blur sm:px-9 sm:py-6">
          <div className="min-w-0">
            <p className="font-mono-design mb-2 text-[11px] leading-[1.25] text-[#76a7ff]">
              {project.category}
            </p>
            <h2
              id="project-modal-title"
              className="font-inter-semibold text-[28px] leading-[1.15] text-[#f1f5fc] sm:text-[36px]"
            >
              {project.title}
            </h2>
            <p
              id="project-modal-summary"
              className="font-inter-regular mt-2 max-w-[680px] text-[14px] leading-[1.5] text-[#a3afc2] sm:text-[16px]"
            >
              {project.summary}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="icon-button round-control flex size-11 shrink-0 items-center justify-center border border-[#33445f] bg-[#0d1421] text-[#f1f5fc]"
            aria-label="Close project details"
          >
            <Glyph name="close" />
          </button>
        </div>

        <div className="p-5 sm:p-9">
          <SmartGallery />
          <details className="demo-disclosure">
            <summary>Try the checkout demo</summary>
            <SmartDemo />
          </details>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <ShowcaseSection title="OVERVIEW" className="md:col-span-2">
              <p className="font-inter-semibold text-[18px] leading-[1.45] text-[#f1f5fc]">
                {project.fullTitle}
              </p>
              <p className="font-inter-regular mt-3 text-[14px] leading-[1.7] text-[#a3afc2]">
                {project.overview}
              </p>
              <div className="mt-5 rounded-xl border border-[#293345] bg-[#0d1421] p-4">
                <p className="font-mono-design text-[10px] text-[#76a7ff]">INTENDED USERS</p>
                <p className="font-inter-regular mt-2 text-[14px] leading-[1.6] text-[#d7deeb]">
                  {project.intendedUsers}
                </p>
              </div>
            </ShowcaseSection>

            <InsideSmartPOS />
            <Architecture />

            <ShowcaseSection title="ENGINEERING DECISIONS" className="md:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><h4 className="font-inter-semibold text-[15px] text-[#f1f5fc]">Local-first transaction storage</h4><p className="font-inter-regular mt-2 text-[14px] leading-[1.7] text-[#a3afc2]">The terminal records transactions in SQLite; synchronization is separate from checkout when a connection is available.</p></div>
                <div><h4 className="font-inter-semibold text-[15px] text-[#f1f5fc]">Physical-to-digital integration</h4><p className="font-inter-regular mt-2 text-[14px] leading-[1.7] text-[#a3afc2]">The camera identifies the produce while the scale provides its weight; the checkout software combines the inputs to calculate the item price.</p></div>
              </div>
            </ShowcaseSection>

            <ShowcaseSection title="THE PROBLEM">
              <p className="font-inter-regular text-[14px] leading-[1.7] text-[#a3afc2]">
                {project.problem}
              </p>
            </ShowcaseSection>

            <ShowcaseSection title="MY CONTRIBUTIONS">
              <p className="font-inter-regular text-[14px] leading-[1.7] text-[#a3afc2]">
                {project.contribution}
              </p>
            </ShowcaseSection>

            <ShowcaseSection title="KEY CAPABILITIES" className="md:col-span-2">
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {project.keyCapabilities.map((capability, index) => (
                  <li
                    key={capability}
                    className="font-inter-regular flex gap-3 text-[14px] leading-[1.55] text-[#a3afc2]"
                  >
                    <span className="font-mono-design text-[#76a7ff]" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </ShowcaseSection>

            <ShowcaseSection title="TECHNOLOGY STACK" className="md:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.stack.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-xl border border-[#293345] bg-[#0d1421] p-4"
                  >
                    <p className="font-inter-semibold text-[13px] text-[#d7deeb]">{group.title}</p>
                    <ul className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="font-mono-design flex gap-2 text-[10px] leading-[1.5] text-[#a3afc2]"
                        >
                          <span className="text-[#76a7ff]" aria-hidden="true">
                            /
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ShowcaseSection>

            <ShowcaseSection title="INTEGRATION CHALLENGES" className="md:col-span-2">
              <p className="font-inter-regular text-[14px] leading-[1.7] text-[#a3afc2]">
                {project.challenges}
              </p>
            </ShowcaseSection>
          </div>

          <section
            className="mt-7 rounded-2xl border border-[#293345] bg-[#101620] p-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5"
            aria-labelledby="project-links-heading"
          >
            <div>
              <h3
                id="project-links-heading"
                className="font-mono-design text-[11px] text-[#76a7ff]"
              >
                PROJECT LINKS
              </h3>
            </div>
            <div className="mt-4 flex flex-col gap-2.5 sm:mt-0 sm:min-w-[210px]">
              <ProjectLinkAction link={project.repository} label="GitHub" repository />
              <ProjectLinkAction link={project.demo} label="Live Demo" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ShowcaseSection({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-[#293345] bg-[#101620] p-5 sm:p-6 ${className}`}>
      <h3 className="font-mono-design mb-4 text-[11px] leading-[1.25] text-[#76a7ff]">{title}</h3>
      {children}
    </section>
  );
}

type SmartPOSLayer = {
  id: "hardware" | "local" | "cloud";
  label: string;
  eyebrow: string;
  summary: string;
  nodes: string[];
};

const smartPOSLayers: SmartPOSLayer[] = [
  {
    id: "hardware",
    label: "Hardware",
    eyebrow: "PHYSICAL LAYER",
    summary:
      "Raspberry Pi 5, Arduino, load cell with HX711, three webcams, vendor touchscreen, customer display, and thermal printer.",
    nodes: [
      "Raspberry Pi 5",
      "Arduino",
      "Load cell + HX711",
      "Three webcams",
      "Vendor touchscreen",
      "Customer display",
      "Thermal printer",
    ],
  },
  {
    id: "local",
    label: "Local Application",
    eyebrow: "TERMINAL LAYER",
    summary:
      "Python and Tkinter interface, SQLite local storage, and produce recognition using MobileNetV2 feature extraction with a distance-weighted k-NN classifier.",
    nodes: [
      "Python + Tkinter",
      "SQLite local storage",
      "MobileNetV2 features",
      "Distance-weighted k-NN",
    ],
  },
  {
    id: "cloud",
    label: "Web & Cloud",
    eyebrow: "CONNECTED LAYER",
    summary:
      "React, TypeScript, and Vite Web Admin, with Supabase services and a FastAPI synchronization receiver.",
    nodes: ["React + TypeScript", "Vite Web Admin", "Supabase services", "FastAPI sync receiver"],
  },
];

function InsideSmartPOS() {
  const [activeLayerId, setActiveLayerId] = useState<SmartPOSLayer["id"]>("hardware");
  const activeLayer =
    smartPOSLayers.find((layer) => layer.id === activeLayerId) ?? smartPOSLayers[0];

  const handleLayerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const keyOffsets: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    let nextIndex = currentIndex;

    if (event.key in keyOffsets) {
      nextIndex =
        (currentIndex + keyOffsets[event.key] + smartPOSLayers.length) % smartPOSLayers.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = smartPOSLayers.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextLayer = smartPOSLayers[nextIndex];
    setActiveLayerId(nextLayer.id);
    const tabList = event.currentTarget.closest('[role="tablist"]');
    tabList?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
  };

  const renderLayerButton = (layer: SmartPOSLayer, index: number, variant: "tab" | "map") => (
    <button
      key={layer.id}
      type="button"
      role="tab"
      aria-selected={activeLayerId === layer.id}
      aria-controls="smartpos-layer-panel"
      tabIndex={activeLayerId === layer.id ? 0 : -1}
      className={variant === "map" ? "system-map-layer" : "system-tab"}
      data-active={activeLayerId === layer.id}
      onClick={() => setActiveLayerId(layer.id)}
      onKeyDown={(event) => handleLayerKeyDown(event, index)}
    >
      {variant === "map" && <span className="system-map-port" aria-hidden="true" />}
      <span className="font-inter-semibold text-[12px] leading-[1.3]">{layer.label}</span>
      {variant === "map" && (
        <span className="system-map-chips" aria-hidden="true">
          {layer.nodes.slice(0, 3).map((node) => (
            <span key={node}>{node}</span>
          ))}
        </span>
      )}
    </button>
  );

  const saleSteps = [
    "Identify produce",
    "Read weight",
    "Review transaction",
    "Save sale locally",
    "Print receipt",
  ];

  return (
    <section className="inside-smartpos md:col-span-2" aria-labelledby="inside-smartpos-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono-design text-[10px] text-[#76a7ff]">SYSTEM ARCHITECTURE</p>
          <h3
            id="inside-smartpos-heading"
            className="font-inter-semibold mt-2 text-[20px] leading-[1.3] text-[#f1f5fc]"
          >
            Inside SmartPOS
          </h3>
        </div>
        <span className="font-mono-design rounded-md border border-[#33445f] bg-[#0d1421] px-2.5 py-1.5 text-[9px] leading-[1.4] text-[#8ea0bb]">
          COMPONENT OVERVIEW
        </span>
      </div>

      <p className="font-inter-regular mt-3 max-w-[720px] text-[13px] leading-[1.6] text-[#8ea0bb]">
        Select a layer to see how the hardware, local application, and web dashboard fit together.
      </p>

      <div
        className="system-mobile-tabs mt-5 grid grid-cols-3 gap-2 md:hidden"
        role="tablist"
        aria-label="SmartPOS system layers"
      >
        {smartPOSLayers.map((layer, index) => renderLayerButton(layer, index, "tab"))}
      </div>

      <div className="mt-5 md:grid md:grid-cols-[300px_minmax(0,1fr)] md:gap-5">
        <div
          className="system-map hidden md:flex"
          role="tablist"
          aria-label="SmartPOS system map"
          data-active={activeLayerId}
        >
          <span className="system-map-line" aria-hidden="true" />
          {smartPOSLayers.map((layer, index) => renderLayerButton(layer, index, "map"))}
        </div>

        <div
          id="smartpos-layer-panel"
          className="system-explanation"
          role="tabpanel"
          aria-live="polite"
          aria-label={`${activeLayer.label} details`}
        >
          <div key={activeLayer.id} className="system-panel-content">
            <p className="font-mono-design text-[9px] text-[#76a7ff]">{activeLayer.eyebrow}</p>
            <h4 className="font-inter-semibold mt-2 text-[18px] leading-[1.35] text-[#f1f5fc]">
              {activeLayer.label}
            </h4>
            <p className="font-inter-regular mt-3 text-[14px] leading-[1.7] text-[#a3afc2]">
              {activeLayer.summary}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {activeLayer.nodes.map((node) => (
                <li
                  key={node}
                  className="font-mono-design flex items-start gap-2 rounded-lg border border-[#293345] bg-[#0d1421] px-3 py-2 text-[11px] leading-[1.45] text-[#c0cad9]"
                >
                  <span className="system-pixel mt-1" aria-hidden="true" />
                  {node}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="sale-section mt-5 grid gap-4">
        <div className="rounded-xl border border-[#293345] bg-[#0d1421] p-4">
          <p className="font-mono-design text-[10px] text-[#76a7ff]">CHECKOUT WORKFLOW</p>
          <ol className="sale-flow mt-4">
            {saleSteps.map((step, index) => (
              <li key={step}>
                <span className="sale-step-icon" aria-hidden="true"><Glyph name={(["camera", "scale", "review", "storage", "receipt"] as const)[index]} size={22}/></span>
                <span className="sale-step-number" aria-hidden="true">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>
                <span className="sale-step-label">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="rounded-xl border border-[#33445f] bg-[#132039] p-4">
          <p className="font-mono-design text-[10px] text-[#76a7ff]">DATA SYNC</p>
          <p className="font-inter-semibold mt-2 text-[13px] leading-[1.45] text-[#d7deeb]">
            Cloud synchronization
          </p>
          <p className="font-inter-regular mt-2 text-[12px] leading-[1.6] text-[#8ea0bb]">
            The terminal saves sales locally. Cloud synchronization runs separately when available.
          </p>
        </aside>
      </div>
    </section>
  );
}

function ProjectLinkAction({
  link,
  label,
  repository = false,
}: {
  link: ProjectLink;
  label: string;
  repository?: boolean;
}) {
  if (link.status === "private" && repository) {
    return (
      <span className="private-repository" role="status">
        Private repository
      </span>
    );
  }

  if (link.status === "available") {
    return (
      <a
        className="project-action"
        href={link.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${label} for this project (opens in a new tab)`}
      >
        {label} <span className="arrow-shift" aria-hidden="true"><Glyph name="diagonal" size={18}/></span>
      </a>
    );
  }

  if (label === "Live Demo") return null;

  return (
    <button className="disabled-action justify-center text-center" type="button" disabled>
      {label} unavailable
    </button>
  );
}

function transitionProject(update: () => void) {
  const doc = document as Document & { startViewTransition?: (callback: () => void) => { finished: Promise<void>; ready: Promise<void> } };
  if (doc.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const transition = doc.startViewTransition(() => flushSync(update));
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
  } else update();
}


function EngineeringStudio() {
  const [duty, setDuty] = useState(40);
  const [frequency, setFrequency] = useState(1000);
  const [gate, setGate] = useState<"AND" | "OR" | "XOR">("AND");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const output = gate === "AND" ? a && b : gate === "OR" ? a || b : a !== b;
  const period = 1000 / frequency;
  const high = 96 * duty / 100;
  const wave = Array.from({length:3}, (_, i) => {
    const x = 16 + i * 96;
    return duty === 0 ? `M ${x} 85 H ${x+96}` : duty === 100 ? `M ${x} 22 H ${x+96}` :
      `M ${x} 85 V 22 H ${x+high} V 85 H ${x+96}`;
  }).join(" ");
  return (
    <section id="lab" className="reveal-section scroll-mt-6">
      <p className="font-mono-design text-[11px] text-[#76a7ff]">ENGINEERING STUDIO / 01</p>
      <h2 className="font-inter-semibold mt-3 text-[34px] leading-[1.25] text-[#f1f5fc]">Experiment with the fundamentals.</h2>
      <p className="font-inter-regular mt-3 max-w-[720px] text-[15px] leading-[1.7] text-[#a3afc2]">Explore interactive demonstrations of embedded control, digital electronics, and serial communication. These are educational simulations, not connected physical devices.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#293345] bg-[#141a24] p-5 sm:p-7">
          <p className="font-mono-design text-[11px] text-[#76a7ff]">01 / SIGNAL GENERATOR</p>
          <h3 className="font-inter-semibold mt-3 text-[24px] text-[#f1f5fc]">Pulse-width modulation</h3>
          <svg viewBox="0 0 320 108" role="img" aria-label={`Three PWM cycles at ${duty} percent duty cycle`} className="mt-4 w-full rounded-xl border border-[#293345] bg-[#0d1421]" >
            {[16,64,112,160,208,256,304].map(x => <path key={x} d={`M ${x} 12 V 96`} stroke="#33445f" strokeWidth=".6" strokeDasharray="3 4"/>)}
            <path d="M16 22 H304 M16 85 H304" stroke="#33445f" strokeWidth="1"/>
            <path d={wave} fill="none" stroke="#76a7ff" strokeWidth="2.4" strokeLinejoin="round"/>
          </svg>
          <label className="font-inter-regular mt-5 block text-[14px] text-[#d7deeb]" htmlFor="lab-duty">Duty cycle: {duty}%</label>
          <input id="lab-duty" className="mt-2 w-full" style={{accentColor:"#76a7ff"}} type="range" min={0} max={100} value={duty} onChange={e=>setDuty(Number(e.target.value))}/>
          <label className="font-inter-regular mt-3 block text-[14px] text-[#d7deeb]" htmlFor="lab-frequency">Frequency: {frequency} Hz</label>
          <input id="lab-frequency" className="mt-2 w-full" style={{accentColor:"#76a7ff"}} type="range" min={100} max={2000} step={100} value={frequency} onChange={e=>setFrequency(Number(e.target.value))}/>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#293345] bg-[#0d1421] p-3"><p className="font-mono-design text-[10px] text-[#a3afc2]">PERIOD</p><p className="font-inter-semibold mt-1 text-[18px] text-[#f1f5fc]">{period.toFixed(2)} ms</p></div>
            <div className="rounded-xl border border-[#293345] bg-[#0d1421] p-3"><p className="font-mono-design text-[10px] text-[#a3afc2]">HIGH TIME</p><p className="font-inter-semibold mt-1 text-[18px] text-[#f1f5fc]">{(period*duty/100).toFixed(2)} ms</p></div>
          </div>
          <p className="font-inter-regular mt-3 text-[12px] leading-[1.6] text-[#a3afc2]">Waveform is normalized to three cycles. Duty cycle controls the high-time fraction; frequency controls the period.</p>
        </article>
        <article className="rounded-2xl border border-[#293345] bg-[#141a24] p-5 sm:p-7">
          <p className="font-mono-design text-[11px] text-[#76a7ff]">02 / DIGITAL LOGIC</p>
          <h3 className="font-inter-semibold mt-3 text-[24px] text-[#f1f5fc]">Logic gate playground</h3>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Select logic gate">
            {(["AND","OR","XOR"] as const).map(g=><button key={g} type="button" aria-pressed={gate===g} onClick={()=>setGate(g)} className="rounded-lg border border-[#33445f] px-4 py-2 font-mono-design text-[12px] text-[#f1f5fc]" style={{outline:gate===g?"2px solid #76a7ff":"none",outlineOffset:2}}>{g}</button>)}
          </div>
          <svg viewBox="0 0 320 126" className="mt-5 w-full rounded-xl border border-[#293345] bg-[#0d1421]" role="img" aria-label={`Input A ${Number(a)}, input B ${Number(b)}, ${gate} gate output ${Number(output)}`}>
            <path d="M55 38 H122 M55 88 H122" stroke="#33445f" strokeWidth="2.5"/>
            <path d="M55 38 H122" stroke={a?"#76a7ff":"#33445f"} strokeWidth="3"/>
            <path d="M55 88 H122" stroke={b?"#76a7ff":"#33445f"} strokeWidth="3"/>
            <rect x="122" y="22" width="80" height="82" rx="12" fill="#141a24" stroke="#76a7ff"/>
            <text x="162" y="68" fill="#76a7ff" fontSize="15" fontWeight="600" textAnchor="middle">{gate}</text>
            <path d="M202 63 H264" stroke={output?"#76a7ff":"#33445f"} strokeWidth="3"/>
            <circle cx="37" cy="38" r="17" fill={a?"#76a7ff":"#293345"}/><circle cx="37" cy="88" r="17" fill={b?"#76a7ff":"#293345"}/><circle cx="280" cy="63" r="17" fill={output?"#76a7ff":"#293345"}/>
            {[{x:37,y:38,v:a},{x:37,y:88,v:b},{x:280,y:63,v:output}].map(n=><text key={n.x+":"+n.y} x={n.x} y={n.y+5} textAnchor="middle" fill={n.v?"#0b0e14":"#d7deeb"} fontSize="14">{Number(n.v)}</text>)}
          </svg>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" aria-pressed={a} onClick={()=>setA(!a)} className="rounded-xl border border-[#33445f] bg-[#0d1421] p-3 text-[#f1f5fc] font-inter-semibold">Input A: {Number(a)}</button>
            <button type="button" aria-pressed={b} onClick={()=>setB(!b)} className="rounded-xl border border-[#33445f] bg-[#0d1421] p-3 text-[#f1f5fc] font-inter-semibold">Input B: {Number(b)}</button>
          </div>
          <p className="font-inter-regular mt-4 text-[14px] leading-[1.6] text-[#a3afc2]" aria-live="polite">Output: {Number(output)}. {gate==="AND"?"Both inputs must be high.":gate==="OR"?"At least one input must be high.":"The inputs must differ."}</p>
        </article>
      </div>
    <ExtraLab />
    </section>
  );
}

function EngineeringJourney() {
  const stages = [
    {label:"FOUNDATIONS", title:"Computer engineering", detail:"Programming, electronics, and digital systems."},
    {label:"PRACTICE", title:"Embedded prototyping", detail:"Working with Raspberry Pi, Arduino, Linux, and sensors."},
    {label:"CAPSTONE", title:"SmartPOS", detail:"Integrating the physical checkout terminal, local software, and web dashboard."},
    {label:"CURRENT", title:"Fourth-year student", detail:"BS Computer Engineering · STI College Balayan, Philippines."}
  ];
  return <section id="journey" className="reveal-section scroll-mt-6 rounded-[22px] border border-[#293345] bg-[#141a24] p-6 sm:p-9">
    <p className="font-mono-design text-[11px] text-[#76a7ff]">ENGINEERING JOURNEY</p>
    <h2 className="font-inter-semibold mt-3 text-[30px] text-[#f1f5fc]">From fundamentals to connected systems.</h2>
    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage,i)=><article key={stage.label} className="border-t border-[#33445f] pt-4"><p className="font-mono-design text-[11px] text-[#76a7ff]">0{i+1} / {stage.label}</p><h3 className="font-inter-semibold mt-3 text-[17px] text-[#f1f5fc]">{stage.title}</h3><p className="font-inter-regular mt-2 text-[14px] leading-[1.6] text-[#a3afc2]">{stage.detail}</p></article>)}
    </div>
  </section>;
}


function InquiryComposer() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [topic,setTopic]=useState("Project collaboration");
  const [message,setMessage]=useState("");
  const [notice,setNotice]=useState("");
  const body=()=>`Hello Edrian,\n\n${message.trim()}\n\nFrom: ${name.trim()}\nEmail: ${email.trim()}`;
  const fieldClass="mt-2 w-full rounded-xl border border-[#33445f] bg-[#0d1421] p-3 font-inter-regular text-[14px] text-[#f1f5fc]";
  return <form className="mt-7 rounded-2xl border border-[#33445f] bg-[#141a24] p-5 sm:p-7" onSubmit={e=>{e.preventDefault(); const uri=`mailto:edrianmonfortepatulot@gmail.com?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(body())}`;location.href=uri;setNotice("Your email app should open with the draft. Review it and send it there.");}}>
    <p className="font-mono-design text-[11px] text-[#76a7ff]">PROJECT INQUIRY</p>
    <h3 className="font-inter-semibold mt-2 text-[23px] text-[#f1f5fc]">Tell me what you're building.</h3>
    <p className="font-inter-regular mt-2 text-[14px] leading-[1.6] text-[#a3afc2]">Prepare a message without creating an account. This form opens your email app; it does not transmit or store your information.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="font-inter-regular text-[14px] text-[#d7deeb]">Name<input className={fieldClass} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required maxLength={100}/></label>
      <label className="font-inter-regular text-[14px] text-[#d7deeb]">Email<input className={fieldClass} autoComplete="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={160}/></label>
    </div>
    <label className="font-inter-regular mt-4 block text-[14px] text-[#d7deeb]">Inquiry type<select className={fieldClass} value={topic} onChange={e=>setTopic(e.target.value)}>{["Project collaboration","Web development","Embedded systems","Internship or career opportunity","Other inquiry"].map(t=><option key={t}>{t}</option>)}</select></label>
    <label className="font-inter-regular mt-4 block text-[14px] text-[#d7deeb]">Message<textarea className={fieldClass} rows={5} required maxLength={1500} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Describe your project, goals, or the opportunity."/></label>
    <div className="mt-5 flex flex-wrap items-center gap-4">
      <button className="primary-button" type="submit">Open email draft <Glyph name="diagonal" size={17}/></button>
      <button type="button" className="text-link" onClick={async()=>{try{await navigator.clipboard.writeText(topic+"\n\n"+body());setNotice("Draft copied. Paste it into your preferred email app.");}catch{setNotice("Clipboard unavailable. Use Open email draft instead.");}}}>Copy draft</button>
    </div>
    <p role="status" className="font-inter-regular mt-3 text-[13px] text-[#a3afc2]">{notice}</p>
  </form>;
}

function StudioNotes() {
  const notes=[
    {tag:"SYSTEM DESIGN",title:"Why local-first matters",text:"A checkout terminal should retain transaction records even when internet connectivity is unavailable. SmartPOS uses local SQLite storage and a separate synchronization workflow."},
    {tag:"EMBEDDED INTEGRATION",title:"Connecting measurements to applications",text:"Physical inputs such as weight and camera observations become application data. Integration requires coordinating devices, data formats, and user workflows."},
    {tag:"DEVELOPMENT WORKFLOW",title:"Testing before release",text:"This portfolio uses a separate preview branch to evaluate updates before production. Version control keeps changes traceable and makes it easier to restore a working version."}
  ];
  return <section id="notes" className="reveal-section scroll-mt-6">
    <p className="font-mono-design text-[11px] text-[#76a7ff]">STUDIO NOTES</p>
    <h2 className="font-inter-semibold mt-3 text-[34px] text-[#f1f5fc]">Engineering in practice.</h2>
    <div className="mt-5 divide-y divide-[#293345] rounded-2xl border border-[#293345] bg-[#141a24] px-5 sm:px-7">
      {notes.map((note,i)=><article key={note.title} className="grid gap-3 py-6 sm:grid-cols-[120px_1fr]"><p className="font-mono-design text-[11px] leading-[1.6] text-[#76a7ff]">0{i+1} / {note.tag}</p><div><h3 className="font-inter-semibold text-[20px] text-[#f1f5fc]">{note.title}</h3><p className="font-inter-regular mt-2 text-[14px] leading-[1.7] text-[#a3afc2]">{note.text}</p></div></article>)}
    </div>
  </section>;
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const activeSection = useActiveSection();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [heroEffectsActive, setHeroEffectsActive] = useState(true);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".reveal-section"));
    if (
      sections.length === 0 ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return;

    let heroInView = true;
    const syncActivity = () => setHeroEffectsActive(heroInView && !document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => {
        heroInView = entry.isIntersecting;
        syncActivity();
      },
      { threshold: 0.05 },
    );

    observer.observe(hero);
    document.addEventListener("visibilitychange", syncActivity);
    syncActivity();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncActivity);
    };
  }, []);

  const openProject = useCallback((project: Project, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    if (location.hash !== "#smartpos") history.pushState(null, "", "#smartpos");
    transitionProject(() => setSelectedProject(project));
  }, []);

  const closeProject = useCallback(() => {
    if (location.hash === "#smartpos") history.replaceState(null, "", "#work");
    transitionProject(() => setSelectedProject(null));
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    const syncProject = () => setSelectedProject(location.hash === "#smartpos" ? projects[0] : null);
    syncProject();
    window.addEventListener("hashchange", syncProject);
    window.addEventListener("popstate", syncProject);
    return () => {window.removeEventListener("hashchange", syncProject); window.removeEventListener("popstate", syncProject);};
  }, []);

  return (
    <>
      <ScrollDetails />
      <SectionNavigation active={activeSection} mobile />
      <div id="home" className={`portfolio-shell ${selectedProject ? "has-project" : ""} min-h-dvh bg-[#0b0e14] px-5 py-8 text-[#f1f5fc] sm:px-10 sm:py-12 lg:px-20 lg:py-20`}>
        <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
          <nav
            className="portfolio-nav flex flex-wrap items-center gap-x-5 gap-y-3"
            aria-label="Primary navigation"
          >
            <p className="font-inter-semibold mr-1 text-[18px] leading-[1.25] text-[#f1f5fc]">
              EDRIAN MONFORTE PATULOT
            </p>
            <CommandPalette disabled={!!selectedProject} />
            <SectionNavigation active={activeSection} />
          </nav>

          <section
            ref={heroRef}
            className={`hero-surface reveal-section grid overflow-hidden rounded-3xl border border-[#293345] bg-[#141a24] lg:grid-cols-[minmax(0,1fr)_460px] ${heroEffectsActive ? "effects-active" : ""}`}
            onPointerMove={updateSpotlight}
          >
            <div className="hero-content relative z-[2] flex min-h-[420px] flex-col items-start justify-center gap-[18px] px-6 py-12 sm:px-10 lg:py-9">
              <p className="font-mono-design text-[11px] leading-[1.25] text-[#76a7ff]">
                COMPUTER ENGINEERING STUDENT · PHILIPPINES
              </p>
              <h1 className="font-inter-semibold max-w-[720px] text-[38px] leading-[1.18] text-[#f1f5fc] sm:text-[48px] lg:text-[54px] lg:leading-[1.2]">
                Bridging hardware and software.
              </h1>
              <p className="font-inter-regular max-w-[720px] text-[16px] leading-[1.65] text-[#a3afc2] sm:text-[18px]">
                I build web applications and embedded prototypes that connect physical devices to useful software, from sensor readings to connected retail systems.
              </p>
              <a className="primary-button" href="#work">
                Explore my work <span className="arrow-shift" aria-hidden="true"><Glyph name="right" size={18}/></span>
              </a>
              <a className="text-link" href="#contact">Get in touch <Glyph name="diagonal" size={16}/></a>
              <a className="text-link" href="#resume">View résumé <Glyph name="diagonal" size={16}/></a>
            </div>

            <aside
              id="workspace"
              className="hero-content relative z-[2] scroll-mt-6 bg-[#101b2d] px-5 py-6 sm:px-7"
            >
              <Workbench day={theme === "light"} onToggleTheme={toggleTheme} />
            </aside>
          </section>

          <section id="about" className="about-summary reveal-section">
              <p className="font-mono-design mt-3 text-[11px] leading-[1.25] text-[#76a7ff]">
                ABOUT
              </p>
              <h2 className="font-inter-semibold mt-3 text-[23px] leading-[1.25] text-[#f1f5fc]">
                Engineering background
              </h2>
              <p className="font-inter-regular mt-3 text-[14px] leading-[1.65] text-[#a3afc2]">
                I am a fourth-year BS Computer Engineering student at STI College Balayan, focused on embedded systems, web development, and hardware–software integration. I work with Linux, Raspberry Pi, Arduino, and electronic components to build and test practical prototypes.
              </p>
          </section>

          <section id="work" className="reveal-section scroll-mt-6">
            <p className="font-mono-design mb-3 text-[11px] text-[#76a7ff]">PROJECT SPOTLIGHT / CAPSTONE</p>
            <h2 className="font-inter-semibold mb-7 text-[34px] leading-[1.25] text-[#f1f5fc]">
              Featured work
            </h2>
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} onOpen={openProject} />
              ))}
            </div>
          </section>

          <EngineeringStudio />

          <EngineeringJourney />

          <StudioNotes />

          <Services />

          <TechnicalSkills />

          <SkillsMap />

          <Resume />

          <section
            id="contact"
            className="reveal-section scroll-mt-6 rounded-[22px] border border-[#293345] bg-[#172640] p-6 sm:p-9"
          >
            <ContactBeacon />
            <p className="font-mono-design text-[11px] leading-[1.25] text-[#76a7ff]">
              CONTACT
            </p>
            <h2 className="font-inter-semibold mt-[18px] text-[32px] leading-[1.25] text-[#f1f5fc] sm:text-[40px]">
              Get in touch
            </h2>
            <p className="font-inter-regular mt-3 max-w-[720px] text-[15px] leading-[1.6] text-[#a3afc2]">
              For project inquiries or technical collaboration, email me with a short description of what you’re working on.
            </p>
            <div className="mt-[18px] flex flex-wrap items-center gap-5">
              <a className="contact-action" href="mailto:edrianmonfortepatulot@gmail.com">
                Email Edrian <span className="arrow-shift" aria-hidden="true"><Glyph name="right" size={18}/></span>
              </a>
              <a
                className="contact-secondary"
                href="https://github.com/Edrian-MP"
                target="_blank"
                rel="noreferrer"
              >
                View GitHub profile <span className="arrow-shift" aria-hidden="true"><Glyph name="diagonal" size={18}/></span>
              </a>
            </div>
            <InquiryComposer />
          </section>

          <footer className="reveal-section flex flex-col gap-3 pb-2 text-[#a3afc2]">
            <p className="font-mono-design text-[11px] leading-[1.25]">
              © {new Date().getFullYear()} Edrian Monforte Patulot · Engineering Studio
            </p>
            <div className="font-inter-regular flex flex-wrap items-center gap-2 text-[14px] leading-[1.25]">
              <a
                className="footer-link"
                href="https://github.com/Edrian-MP"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <span aria-hidden="true">·</span>
              <a className="footer-link" href="mailto:edrianmonfortepatulot@gmail.com">
                Email
              </a>
            </div>
          </footer>
        </main>
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={closeProject} />}
    </>
  );
}
