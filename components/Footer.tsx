import { email, linkedIn } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line pt-8">
      <nav aria-label="Contact" className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href={linkedIn} className="plain">
          LinkedIn
        </a>
        <a href={`mailto:${email}`} className="plain">
          Email
        </a>
      </nav>
      <p className="mt-6 text-[13px] text-muted">
        Site design inspired by{" "}
        <a href="https://dahbiahmed.com/" className="plain">
          Ahmed Dahbi
        </a>
      </p>
    </footer>
  );
}
