import { linkedIn, twitter } from "@/lib/content";

export function Footer() {
  return (
    <footer>
      <div className="footer-links">
        <a href={linkedIn}>LinkedIn</a>
        <a href={twitter}>X</a>
      </div>
      <p className="footer-credit">
        © 2026 John Robert Reed
      </p>
      <p className="footer-legal">
        The information contained herein is not an offer to buy or sell any security. The views expressed in speaking engagements are my own and don't necessarily reflect those of my employer. Inclusion of the links to such engagements does not represent an endorsement of me by the sponsors. Speaking engagements and writings are a sample of complete works.
      </p>
      <p className="footer-credit">
        Site design heavily inspired by{" "}
        <a href="https://dahbiahmed.com/">Ahmed Dahbi</a>
      </p>
    </footer>
  );
}
