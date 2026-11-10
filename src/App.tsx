import { useCallback, useEffect, useRef, useState } from "react";
import Services from "./Services";
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
  screenshotStatus: string;
  completionStatus: string;
  repository: ProjectLink;
  demo: ProjectLink;
};

const projects: Project[] = [
  {
    category: "FEATURED PROJECT",
    title: "SmartPOS",
    fullTitle: "Inventory System and POS with Smart Weighing Scale for Fresh Produce",
    summary:
      "A smart weighing and point-of-sale system that combines camera-based produce identification, inventory management, and web administration for fresh-produce vendors.",
    overview:
      "SmartPOS connects weighing hardware, camera-based produce recognition, and a point-of-sale application to support fresh-produce vendors in public markets. The system combines a Raspberry Pi terminal with local storage and a browser-based administration interface.",
    intendedUsers: "Fresh-produce vendors, sellers, and business owners.",
    problem:
      "Produce vendors often handle product identification, weighing, pricing, and sales records through separate manual steps. SmartPOS brings these activities into an integrated workflow.",
    contribution:
      "Worked on hardware–software integration, the Linux environment, and web integration and hosting.",
    keyCapabilities: [
      "Camera-based produce identification",
      "Smart weighing using a load cell and HX711",
      "Point-of-sale transactions and checkout",
      "Product catalog and inventory management",
      "Owner-controlled produce-recognition training",
      "Price inquiry",
      "Sales history and reporting",
      "Customer-facing transaction display",
      "Receipt printing",
      "Owner and Seller access",
      "Local transaction storage with cloud synchronization logic",
      "Browser-based Web Admin",
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
      "Integrating physical hardware with application software, working within a Linux environment, and connecting the local system with a web administration interface and hosting setup.",
    screenshotStatus: "Screenshots are available but have not been uploaded yet.",
    completionStatus: "Deployment and completion status have not been confirmed.",
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
      <span className="flex min-h-[240px] w-full flex-col items-start gap-3.5 rounded-xl bg-[#0d1421] p-5 sm:min-h-[300px]">
        <span className="font-mono-design text-[15px] leading-[1.25] text-[#76a7ff]">
          {"< project preview />"}
        </span>
        <span className="font-inter-regular text-[13px] leading-[1.25] text-[#a3afc2]">
          {project.screenshotStatus}
        </span>
      </span>
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
          <section aria-labelledby="showcase-heading">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3
                id="showcase-heading"
                className="font-mono-design text-[11px] leading-[1.25] text-[#76a7ff]"
              >
                PROJECT SHOWCASE
              </h3>
              <span className="font-mono-design rounded-md border border-[#293345] bg-[#0d1421] px-2 py-1 text-[9px] text-[#7f8ca2]">
                SCREENSHOTS NOT YET UPLOADED
              </span>
            </div>
            <div className="flex aspect-[4/3] min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-[#263d5d] bg-[#0d1421] p-8 sm:aspect-[16/8]">
              <div className="text-center">
                <p className="font-mono-design text-[13px] text-[#76a7ff]">
                  {"< large project screenshot />"}
                </p>
                <p className="font-inter-regular mt-3 text-[13px] text-[#7f8ca2]">
                  {project.screenshotStatus}
                </p>
              </div>
            </div>
          </section>

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

            <ShowcaseSection title="THE PROBLEM">
              <p className="font-inter-regular text-[14px] leading-[1.7] text-[#a3afc2]">
                {project.problem}
              </p>
            </ShowcaseSection>

            <ShowcaseSection title="MY ROLE & CONTRIBUTIONS">
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

            <ShowcaseSection title="CHALLENGES & LEARNINGS" className="md:col-span-2">
              <p className="font-inter-regular text-[14px] leading-[1.7] text-[#a3afc2]">
                {project.challenges}
              </p>
              <p className="font-inter-regular mt-3 text-[13px] leading-[1.6] text-[#7f8ca2]">
                These are ongoing engineering challenges and learning areas; no measured outcomes
                are claimed.
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
              <p className="font-inter-regular mt-2 text-[13px] leading-[1.5] text-[#7f8ca2]">
                {project.completionStatus}
              </p>
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
          <p className="font-mono-design text-[10px] text-[#76a7ff]">SYSTEM MAP / 01</p>
          <h3
            id="inside-smartpos-heading"
            className="font-inter-semibold mt-2 text-[20px] leading-[1.3] text-[#f1f5fc]"
          >
            Inside SmartPOS
          </h3>
        </div>
        <span className="font-mono-design rounded-md border border-[#33445f] bg-[#0d1421] px-2.5 py-1.5 text-[9px] leading-[1.4] text-[#8ea0bb]">
          ILLUSTRATIVE SYSTEM OVERVIEW
        </span>
      </div>

      <p className="font-inter-regular mt-3 max-w-[720px] text-[13px] leading-[1.6] text-[#8ea0bb]">
        Select a layer to explore the system components. This overview is illustrative and is not a
        live device monitor.
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
          <p className="font-mono-design text-[10px] text-[#76a7ff]">TYPICAL SALE</p>
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
          <p className="font-mono-design text-[10px] text-[#76a7ff]">CONDITIONAL PROCESS</p>
          <p className="font-inter-semibold mt-2 text-[13px] leading-[1.45] text-[#d7deeb]">
            Cloud synchronization
          </p>
          <p className="font-inter-regular mt-2 text-[12px] leading-[1.6] text-[#8ea0bb]">
            Cloud synchronization is a separate conditional process and is not required for every
            local sale.
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
      {label} · URL placeholder
    </button>
  );
}

const toolboxGroups = [
  {
    title: "Programming languages",
    items: ["Python", "TypeScript"],
  },
  {
    title: "AI-assisted workflows",
    items: ["Claude Code", "ChatGPT / Codex", "Gemini", "AI prompting"],
  },
  {
    title: "Design and productivity",
    items: ["Figma", "Microsoft Office"],
  },
  {
    title: "Hardware and environments",
    items: [
      "Linux",
      "Raspberry Pi",
      "Arduino",
      "Discrete electronic components",
      "Hardware–software integration",
    ],
  },
  {
    title: "Areas of interest",
    items: [
      "Website implementation",
      "Database-backed applications",
      "Embedded systems and automation",
      "Engineering prototyping",
      "Capstone prototyping and technical support",
    ],
  },
];

export default function App() {
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
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <>
      <ScrollDetails />
      <div id="home" className="min-h-dvh bg-[#0b0e14] px-5 py-8 text-[#f1f5fc] sm:px-10 sm:py-12 lg:px-20 lg:py-20">
        <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
          <nav
            className="flex flex-wrap items-center gap-x-5 gap-y-3"
            aria-label="Primary navigation"
          >
            <p className="font-inter-semibold mr-1 text-[18px] leading-[1.25] text-[#f1f5fc]">
              EDRIAN MONFORTE PATULOT
            </p>
            <a className="nav-link" href="#work">
              Work
            </a>
            <a className="nav-link" href="#about">
              About
            </a>
            <a className="nav-link" href="#services">
              Services
            </a>
            <a className="nav-link" href="#contact">
              Contact
            </a>
          </nav>

          <p className="font-mono-design text-[11px] leading-[1.25] text-[#76a7ff]">
            PORTFOLIO / SELECTED WORK
          </p>

          <section
            ref={heroRef}
            className={`hero-surface reveal-section grid overflow-hidden rounded-3xl border border-[#293345] bg-[#141a24] lg:grid-cols-[minmax(0,1fr)_460px] ${heroEffectsActive ? "effects-active" : ""}`}
            onPointerMove={updateSpotlight}
          >
            <div className="hero-content relative z-[2] flex min-h-[420px] flex-col items-start justify-center gap-[18px] px-6 py-12 sm:px-10 lg:py-9">
              <p className="font-mono-design text-[11px] leading-[1.25] text-[#76a7ff]">
                HELLO, I’M EDRIAN MONFORTE PATULOT
              </p>
              <h1 className="font-inter-semibold max-w-[720px] text-[38px] leading-[1.18] text-[#f1f5fc] sm:text-[48px] lg:text-[54px] lg:leading-[1.2]">
                Connecting hardware, software, and practical ideas.
              </h1>
              <p className="font-inter-semibold text-[16px] leading-[1.4] text-[#d7deeb] sm:text-[18px]">
                Computer Engineer
              </p>
              <p className="font-mono-design text-[11px] leading-[1.5] text-[#76a7ff]">
                AI-assisted Development · Hardware–Software Integration
              </p>
              <p className="font-inter-regular max-w-[720px] text-[16px] leading-[1.65] text-[#a3afc2] sm:text-[18px]">
                I work on projects that connect physical devices with digital systems—from websites
                and databases to embedded hardware and integrated applications.
              </p>
              <a className="primary-button" href="#work">
                Explore projects <span className="arrow-shift" aria-hidden="true"><Glyph name="right" size={18}/></span>
              </a>
            </div>

            <aside
              id="about"
              className="hero-content relative z-[2] scroll-mt-6 bg-[#101b2d] px-5 py-6 sm:px-7"
            >
              <div className="workspace-scene mx-auto w-full max-w-[460px] overflow-hidden rounded-[14px] border border-[#263d5d] bg-[#0d1625] pt-3">
                <p className="workspace-header font-mono-design flex items-center gap-1.5 px-3 text-[10px] leading-[1.25] text-[#76a7ff]">
                  <span className="window-dots flex gap-1" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="ml-2">workspace / 01</span>
                </p>
                <div className="workspace-art relative aspect-square w-full">
                  <div className="workspace-particles" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <img
                    src={`${import.meta.env.BASE_URL}assets/ee678.png`}
                    alt="Pixel artwork of a developer working at a laptop"
                    className="relative z-[1] size-full object-contain"
                  />
                </div>
              </div>
              <p className="font-mono-design mt-3 text-[11px] leading-[1.25] text-[#76a7ff]">
                ABOUT
              </p>
              <h2 className="font-inter-semibold mt-3 text-[23px] leading-[1.25] text-[#f1f5fc]">
                From components to connected systems.
              </h2>
              <p className="font-inter-regular mt-3 text-[14px] leading-[1.65] text-[#a3afc2]">
                My interests span computer engineering, AI-assisted development, website
                implementation, and hardware–software integration. I enjoy working with Linux,
                Raspberry Pi, Arduino, and electronic components to turn ideas into practical
                prototypes. I use AI tools to support development, troubleshoot problems, and
                explore different approaches.
              </p>
              <a className="text-link mt-3 inline-flex" href="#about">
                More about me <span className="arrow-shift" aria-hidden="true"><Glyph name="right" size={18}/></span>
              </a>
            </aside>
          </section>

          <section id="work" className="reveal-section scroll-mt-6">
            <p className="section-caption">01 / SELECTED PROJECT</p>
            <h2 className="font-inter-semibold mb-7 text-[34px] leading-[1.25] text-[#f1f5fc]">
              Selected work
            </h2>
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} onOpen={openProject} />
              ))}
            </div>
          </section>

          <Services />

          <section
            className="reveal-section rounded-[22px] border border-[#293345] bg-[#141a24] p-5 sm:p-[30px]"
            aria-labelledby="toolbox-heading"
          >
            <p className="font-mono-design text-[11px] leading-[1.25] text-[#76a7ff]">TOOLBOX</p>
            <h2
              id="toolbox-heading"
              className="font-inter-semibold mt-3 text-[26px] leading-[1.25] text-[#f1f5fc]"
            >
              Tools, platforms, and areas of interest.
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolboxGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-xl border border-[#293345] bg-[#0d1421] p-5"
                >
                  <h3 className="font-inter-semibold text-[14px] leading-[1.4] text-[#d7deeb]">
                    {group.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="font-inter-regular flex gap-2.5 text-[13px] leading-[1.5] text-[#a3afc2]"
                      >
                        <span className="font-mono-design text-[#76a7ff]" aria-hidden="true">
                          /
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="reveal-section scroll-mt-6 rounded-[22px] border border-[#293345] bg-[#172640] p-6 sm:p-9"
          >
            <ContactBeacon />
            <p className="font-mono-design text-[11px] leading-[1.25] text-[#76a7ff]">
              HAVE SOMETHING IN MIND?
            </p>
            <h2 className="font-inter-semibold mt-[18px] text-[32px] leading-[1.25] text-[#f1f5fc] sm:text-[40px]">
              Have a project in mind? Let’s talk.
            </h2>
            <p className="font-inter-regular mt-3 max-w-[720px] text-[15px] leading-[1.6] text-[#a3afc2]">
              Reach out about website implementation, hardware–software integration, or engineering
              prototypes.
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
          </section>

          <footer className="reveal-section flex flex-col gap-3 pb-2 text-[#a3afc2]">
            <p className="font-mono-design text-[11px] leading-[1.25]">
              EDRIAN MONFORTE PATULOT / PORTFOLIO
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
