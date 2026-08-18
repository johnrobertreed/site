export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-6 flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
      <span aria-hidden="true" className="text-accent">
        ↳
      </span>
      {children}
    </p>
  );
}
