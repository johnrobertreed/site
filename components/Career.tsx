import { career } from "@/lib/content";

export function Career() {
  return (
    <ol className="border-t border-line">
      {career.map((role) => {
        const key = `${role.title}-${role.company}-${role.dates ?? "undated"}`;
        return (
          <li
            key={key}
            className="grid grid-cols-1 gap-2 border-b border-line py-6 sm:grid-cols-[132px_1fr] sm:gap-x-8"
          >
            <div className="font-mono text-[13px] tabular-nums text-muted">
              {role.dates ?? ""}
            </div>
            <div>
              <p className="text-[1.05rem] leading-snug text-ink">{role.title}</p>
              {role.href ? (
                <a
                  href={role.href}
                  className="company mt-1 inline-block text-[1.05rem] leading-snug"
                >
                  {role.company}
                </a>
              ) : (
                <p className="mt-1 text-[1.05rem] leading-snug text-accent">
                  {role.company}
                </p>
              )}
              {role.description ? (
                <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-muted">
                  {role.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
