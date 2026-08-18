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
  },
  {
    dates: "now",
    title: "Mentor",
    company: "Capital Factory",
    href: "https://www.capitalfactory.com/",
  },
  {
    dates: "now",
    title: "Board Member",
    company: "Whiskey For Water",
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

export const email = "johnrobertreed@gmail.com";
export const linkedIn = "https://www.linkedin.com/in/john-robert-reed/";
