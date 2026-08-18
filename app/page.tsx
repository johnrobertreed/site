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
              I live in Austin. I studied public relations and business
              foundations at the University of Texas at Austin, then spent a
              decade helping frontier-science and deep-tech companies get to
              market.
            </p>
            <p>
              These days I lead marketing and communications at Multicoin
              Capital, a thesis-driven firm investing in cryptocurrencies,
              tokens, and blockchain companies. I still advise when the problem
              is go-to-market, narrative, or how a company shows up in the
              world.
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
