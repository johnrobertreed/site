import { career } from "@/lib/content";

export function Career() {
  return (
    <div className="career-list">
      {career.map((role) => {
        const key = `${role.title}-${role.company}-${role.dates ?? "undated"}`;
        return (
          <article key={key} className="career-item">
            <div className="career-meta">
              <span className="career-date">{role.dates ?? ""}</span>
            </div>
            <div className="career-details">
              <span className="career-title">{role.title}</span>
              <h3>
                {role.href ? (
                  <a href={role.href}>{role.company}</a>
                ) : (
                  role.company
                )}
              </h3>
              {role.description ? <p>{role.description}</p> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
