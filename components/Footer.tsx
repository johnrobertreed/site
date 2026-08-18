import { email, linkedIn, twitter } from "@/lib/content";

export function Footer() {
  return (
    <footer>
      <div className="footer-links">
        <a href={linkedIn}>LinkedIn</a>
        <a href={twitter}>X</a>
        <a href={`mailto:${email}`}>Email</a>
      </div>
      <p className="footer-credit">
        Site design inspired by{" "}
        <a href="https://dahbiahmed.com/">Ahmed Dahbi</a>
      </p>
    </footer>
  );
}
