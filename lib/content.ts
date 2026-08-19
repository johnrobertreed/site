export type Role = {
  dates?: string;
  title: string;
  company: string;
  href?: string;
  description?: string;
};

export type HelpTopic = {
  id: string;
  label: string;
  subtitle: string;
};

export type Book = {
  title: string;
  author: string;
  isbn: string;
  href: string;
  description: string;
};

export const career: Role[] = [
  {
    dates: "2018–now",
    title: "Partner & CMO",
    company: "Multicoin Capital",
    href: "https://multicoin.capital/",
    description:
      "Leads global marketing, communications, and go-to-market. Multicoin is a thesis-driven investment firm that invests in cryptocurrencies, tokens, and blockchain companies across public and private markets.",
  },
  {
    dates: "now",
    title: "Board Member",
    company: "Friends of the Children Austin",
    href: "https://friendsaustin.org/",
    description:
      "Assists with fundraising, marketing, and strategy to the Austin Chapter of Friends of the Children (Friends Austin). Friends of the Children leverages embedded, long-duration mentoring to stem the advance of systemic poverty for the children most in need.",
  },
  {
    dates: "now",
    title: "Co-Chair, Marketing & Communications Working Group",
    company: "Blockchain Association",
    href: "https://www.blockchainassociation.org/",
    description:
      "Works with the industry trade association on how crypto companies talk to the public and to policymakers.",
  },
  {
    dates: "now",
    title: "Advisory Board Member",
    company: "SXSW",
    href: "https://www.sxsw.com/",
    description:
      "Advises on the conference's direction. Worked inside SXSW earlier in his career and has stayed close to it since.",
  },
  {
    dates: "now",
    title: "Mentor",
    company: "Techstars",
    href: "https://www.techstars.com/",
    description:
      "Mentored companies going through the accelerator and was often selected to help them prepare for demo day.",
  },
  {
    dates: "now",
    title: "Mentor",
    company: "Capital Factory",
    href: "https://www.capitalfactory.com/",
    description:
      "Mentored startups in the program and was often tapped to get them ready for demo day.",
  },
  {
    dates: "now",
    title: "Co-founder",
    company: "Whiskey For Water",
    description:
      "Co-founded with friends. Produced tasting events where whiskey enthusiasts could sample new and rare spirits, with proceeds going to Well Aware. That work helped fund 15 wells for communities in Africa.",
  },
  {
    dates: "2009–2018",
    title: "Senior Director, Marketing",
    company: "Jones-Dilworth, Inc.",
    href: "https://www.jones-dilworth.com/",
    description:
      "Founding-team member at a boutique consultancy that brings emerging technologies to market, focused on frontier science and deep tech.",
  },
  {
    title: "Booking Coordinator",
    company: "SXSW",
    href: "https://www.sxsw.com/",
    description:
      "Booked influencers, directors, actors, and press for Studio SX during the Film and Interactive conferences.",
  },
];

export const helpTopics: HelpTopic[] = [
  {
    id: "gtm",
    label: "Go-to-market",
    subtitle:
      "Positioning, launch, and how a product actually gets into the world.",
  },
  {
    id: "comms",
    label: "Communications",
    subtitle: "Press, public narrative, and the story a firm tells about itself.",
  },
  {
    id: "brand",
    label: "Branding",
    subtitle:
      "Naming the thing clearly enough that the right people remember it.",
  },
];

export const advisoryTopics: HelpTopic[] = [
  ...helpTopics,
  {
    id: "investing",
    label: "Investing",
    subtitle:
      "Angeling into early-stage projects and funds — writing the check, then staying useful after it clears.",
  },
];

/** Starter placeholders for the 3D shelf — not a reading list claim. */
export const books: Book[] = [
  {
    title: "Crossing the Chasm",
    author: "Geoffrey Moore",
    isbn: "9780060517120",
    href: "https://openlibrary.org/isbn/9780060517120",
    description:
      "How technology products move from early adopters across the gulf to a pragmatic mainstream market.",
  },
  {
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    isbn: "9780062273208",
    href: "https://openlibrary.org/isbn/9780062273208",
    description:
      "A blunt operating manual for the ugly, un-teachable parts of building and running a company.",
  },
  {
    title: "Influence",
    author: "Robert Cialdini",
    isbn: "9780061241895",
    href: "https://openlibrary.org/isbn/9780061241895",
    description:
      "The psychology of persuasion: the principles that make people say yes, and how to see them coming.",
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    isbn: "9780804139298",
    href: "https://openlibrary.org/isbn/9780804139298",
    description:
      "Notes on startups and monopoly — why creating something new beats competing on a crowded field.",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "9780374533557",
    href: "https://openlibrary.org/isbn/9780374533557",
    description:
      "Two systems of thought: the fast, intuitive one and the slow, deliberate one, and how they shape judgment.",
  },
  {
    title: "Poor Charlie's Almanack",
    author: "Charles T. Munger",
    isbn: "9781578645015",
    href: "https://openlibrary.org/isbn/9781578645015",
    description:
      "Talks and writing on mental models, inversion, and the worldly wisdom Charlie Munger kept returning to.",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    isbn: "9780857197689",
    href: "https://openlibrary.org/isbn/9780857197689",
    description:
      "Essays on how people think about money — and why behavior usually beats brilliance.",
  },
  {
    title: "The Sovereign Individual",
    author: "Davidson & Rees-Mogg",
    isbn: "9780684832722",
    href: "https://openlibrary.org/isbn/9780684832722",
    description:
      "A late-1990s forecast of how force, information, and the nation-state would unbundle in a digital economy.",
  },
  {
    title: "On Writing Well",
    author: "William Zinsser",
    isbn: "9780060891541",
    href: "https://openlibrary.org/isbn/9780060891541",
    description:
      "A craftsman's guide to nonfiction: clarity, simplicity, and the discipline of cutting clutter.",
  },
];

export const email = "johnrobertreed@gmail.com";
export const linkedIn = "https://www.linkedin.com/in/john-robert-reed/";
export const twitter = "https://x.com/johnrobertreed";
export const twitterDm =
  "https://x.com/messages/compose?recipient_id=23902511";
