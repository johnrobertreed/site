import { Accordion, Drawer } from "@/components/Accordion";
import { Bookshelf } from "@/components/Bookshelf";
import { Career } from "@/components/Career";
import { Footer } from "@/components/Footer";
import { HelpOverlay } from "@/components/HelpOverlay";
import { Portrait } from "@/components/Portrait";
import { ThemeToggle } from "@/components/ThemeToggle";
import { advisoryTopics, email } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="page">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <main id="main">
        <header>
          <div className="header-top">
            <Portrait />
            <ThemeToggle />
          </div>
          <h1>John Robert Reed</h1>
          <p className="tagline">Partner &amp; CMO at Multicoin Capital</p>
          <p>
            John Robert (“JR”) is a Partner and leads global marketing and
            communications at Multicoin Capital. He has worked in service of
            venture capital for nearly 20 years and specializes in go-to-market
            strategy, public relations, branding, and early-stage
            commercialization.
          </p>
        </header>

        <Accordion>
          <Drawer id="about" title="About">
            <p>
              I&apos;ve worked inside hundreds of startups over ~20 years,
              across AI, robotics, SaaS, and crypto. I&apos;ve helped grow
              businesses from a kernel of an idea to multi-million-dollar
              acquisitions, and helped grow Multicoin Capital from tens of
              millions in AUM in 2018 to more than a billion across our hedge
              fund and venture funds today.
            </p>
            <p>
              As CMO I lead marketing, communications, and events, including
              the Multicoin Summit, an invite-only gathering of the
              industry&apos;s best investors and thought leaders. I also still
              work closely with our portfolio on go-to-market, crisis comms,
              PR, and brand strategy.
            </p>
            <p>
              Beyond the firm I invest, read, write, and build for fun. I have
              deep roots in Austin and try to give back by mentoring at the
              University of Texas, Techstars, and Capital Factory, advising
              SXSW, and serving on the board of Friends of the Children Austin.
            </p>
          </Drawer>

          <Drawer id="career" title="Career">
            <Career />
          </Drawer>

          <Drawer id="advisory" title="Advisory">
            <p>
              Building a company is easier when you have someone good to think
              with. I advise founders and operators on narrative, go-to-market,
              and how to show up in a noisy market. I also angel into early-stage
              projects and funds.
            </p>
            <div className="advisory-list">
              {advisoryTopics.map((topic) => (
                <div key={topic.id} className="advisory-item">
                  <strong>{topic.label}</strong>
                  <span>{topic.subtitle}</span>
                </div>
              ))}
            </div>
            <p className="advisory-cta">
              Interested? Let&apos;s chat (
              <a href={`mailto:${email}`}>{email}</a>).
            </p>
          </Drawer>

          <Drawer id="bookshelf" title="Bookshelf">
            <Bookshelf />
          </Drawer>
        </Accordion>

        <HelpOverlay />
        <Footer />
      </main>
    </div>
  );
}
