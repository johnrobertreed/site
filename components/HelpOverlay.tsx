import { twitterDm } from "@/lib/content";

export function HelpOverlay() {
  return (
    <a
      className="help-trigger"
      href={twitterDm}
      target="_blank"
      rel="noreferrer"
    >
      Contact
    </a>
  );
}
