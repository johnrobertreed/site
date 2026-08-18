"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { shelfCatalog } from "@/components/shelf/catalog";

const SECTION_IDS = ["about", "career", "advisory", "bookshelf"] as const;
type SectionId = (typeof SECTION_IDS)[number];

type AccordionValue = {
  openId: string | null;
  requestOpen: (id: string | null) => void;
};

const AccordionContext = createContext<AccordionValue | null>(null);

export function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion context missing");
  return ctx;
}

export function useDrawerOpen(id: string) {
  return useAccordion().openId === id;
}

function isSection(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

function motionOff() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Accordion({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const requestOpen = useCallback((id: string | null) => {
    setOpenId(id);
    const path = `${window.location.pathname}${window.location.search}`;
    if (id) {
      if (window.location.hash !== `#${id}`) {
        history.replaceState(null, "", `${path}#${id}`);
      }
    } else if (window.location.hash) {
      history.replaceState(null, "", path);
    }
  }, []);

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (isSection(id)) setOpenId(id);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <AccordionContext.Provider value={{ openId, requestOpen }}>
      <div className="drawers">{children}</div>
    </AccordionContext.Provider>
  );
}

export function Drawer({
  id,
  title,
  children,
}: {
  id: SectionId;
  title: string;
  children: ReactNode;
}) {
  const { openId, requestOpen } = useAccordion();
  const open = openId === id;
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const warmed = useRef(false);

  useEffect(() => {
    const details = detailsRef.current;
    const content = contentRef.current;
    if (!details || !content) return;

    const duration = motionOff() ? 1 : 100;

    if (open && !wasOpen.current) {
      details.open = true;
      content.style.height = "0px";
      content.style.overflow = "hidden";
      const target = `${content.scrollHeight}px`;
      const anim = content.animate([{ height: "0px" }, { height: target }], {
        duration,
        easing: "ease-out",
        fill: "forwards",
      });
      void anim.finished
        .then(() => {
          content.style.height = "";
          content.style.overflow = "";
          anim.cancel();
          details.scrollIntoView({
            behavior: motionOff() ? "auto" : "smooth",
            block: "start",
          });
        })
        .catch(() => undefined);
    } else if (!open && wasOpen.current) {
      const start = `${content.offsetHeight}px`;
      content.style.overflow = "hidden";
      const anim = content.animate([{ height: start }, { height: "0px" }], {
        duration,
        easing: "ease-out",
        fill: "forwards",
      });
      void anim.finished
        .then(() => {
          details.open = false;
          content.style.height = "";
          content.style.overflow = "";
          anim.cancel();
        })
        .catch(() => undefined);
    } else {
      details.open = open;
    }

    wasOpen.current = open;
  }, [open]);

  return (
    <details ref={detailsRef} id={id} className="drawer animated">
      <summary
        onClick={(event) => {
          event.preventDefault();
          requestOpen(open ? null : id);
        }}
        onPointerEnter={() => {
          if (id !== "bookshelf" || warmed.current) return;
          warmed.current = true;
          if (prefersSaveData()) return;
          void import("@/components/shelf/engine").then((mod) => {
            mod.warmCovers(shelfCatalog());
          });
        }}
      >
        <h2>{title}</h2>
      </summary>
      <div className="details-content" ref={contentRef}>
        {children}
      </div>
    </details>
  );
}

function prefersSaveData() {
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

