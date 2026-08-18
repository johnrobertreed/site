import { Career } from "@/components/Career";
import { Footer } from "@/components/Footer";
import { HelpOverlay } from "@/components/HelpOverlay";
import { SectionLabel } from "@/components/SectionLabel";
import { helpTopics } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <main
        id="main"
        className="mx-auto w-full max-w-[740px] px-6 pb-32 pt-16 sm:pt-24"
      >
        <header className="mb-16 sm:mb-20">
          <h1 className="font-display text-[2.35rem] font-medium leading-[1.15] tracking-tight text-ink sm:text-5xl">
            John Robert Reed
          </h1>
          <p className="mt-3 text-lg text-muted">
            Partner &amp; CMO at Multicoin Capital
          </p>
          <p className="mt-8 max-w-[58ch] text-[17px] leading-[1.7] text-ink">
            John Robert (“JR”) is a Partner and leads global marketing and
            communications at Multicoin Capital. He has worked in service of
            venture capital for nearly 20 years and specializes in go-to-market
            strategy, public relations, branding, and early-stage
            commercialization.
          </p>
        </header>

        <section id="about" aria-labelledby="about-heading" className="mb-20">
          <SectionLabel>About</SectionLabel>
          <h2 id="about-heading" className="sr-only">
            About
          </h2>
          <div className="space-y-5 max-w-[58ch] text-[17px] leading-[1.7] text-ink">
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
          </div>
        </section>

        <section id="career" aria-labelledby="career-heading" className="mb-20">
          <SectionLabel>Career</SectionLabel>
          <h2 id="career-heading" className="sr-only">
            Career
          </h2>
          <Career />
        </section>

        <section id="advisory" aria-labelledby="advisory-heading">
          <SectionLabel>Advisory</SectionLabel>
          <h2 id="advisory-heading" className="sr-only">
            Advisory
          </h2>
          <p className="max-w-[58ch] text-[17px] leading-[1.7] text-ink">
            Building a company is easier when you have someone good to think
            with. I advise founders and operators on narrative, go-to-market,
            and how to show up in a noisy market.
          </p>
          <ul className="mt-10 space-y-8">
            {helpTopics.map((topic) => (
              <li key={topic.id} className="max-w-[46ch]">
                <h3 className="text-[1.05rem] font-medium text-ink">
                  {topic.label}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                  {topic.subtitle}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <Footer />
      </main>

      <HelpOverlay />
    </>
  );
}
