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
      "Leads global marketing, communications, and events, including the Multicoin Summit. Multicoin is a thesis-driven firm that makes long-term, high-conviction investments in crypto companies and protocols across public and private markets.",
  },
  {
    dates: "2026–now",
    title: "Board Member",
    company: "Friends of the Children Austin",
    href: "https://friendsaustin.org/",
    description:
      "Assists with fundraising, marketing, and strategy to the Austin Chapter of Friends of the Children (Friends Austin). Friends of the Children leverages embedded, long-duration mentoring to stem the advance of systemic poverty for the children most in need.",
  },
  {
    dates: "2018–now",
    title: "Advisory Board Member",
    company: "SXSW",
    href: "https://www.sxsw.com/",
    description:
      "Advises on programming and the direction of the Interactive conference. Worked inside SXSW earlier in his career and has stayed close to it since.",
  },
  {
    dates: "2025–2026",
    title: "Co-Chair, Marketing & Communications Working Group",
    company: "Blockchain Association",
    href: "https://www.blockchainassociation.org/",
    description:
      "Worked with senior members on consensus, partnerships, and how the industry talks to the press.",
  },
  {
    dates: "2018–2023",
    title: "Startup Mentor",
    company: "Techstars",
    href: "https://www.techstars.com/",
    description:
      "Mentored companies in the Austin accelerator and was often selected to help them prepare for demo day.",
  },
  {
    dates: "2018–2023",
    title: "Startup Mentor",
    company: "Capital Factory",
    href: "https://www.capitalfactory.com/",
    description:
      "Mentored startups in the program and was often tapped to get them ready for demo day.",
  },
  {
    dates: "2015–2018",
    title: "Co-founder",
    company: "Whiskey For Water",
    href: "http://www.whiskeyforwater.org/",
    description:
      "Co-founded with friends. Produced tasting events where whiskey enthusiasts could sample new and rare spirits, with proceeds going to Well Aware. That work helped fund 15 wells for communities in Africa.",
  },
  {
    dates: "2009–2018",
    title: "Senior Director",
    company: "Jones-Dilworth, Inc.",
    href: "https://www.jones-dilworth.com/",
    description:
      "Founding-team member at a boutique consultancy that brings emerging technologies to market, focused on frontier science and deep tech.",
  },
  {
    dates: "2009–2010",
    title: "Booking Coordinator",
    company: "SXSW",
    href: "https://www.sxsw.com/",
    description:
      "Booked influencers, directors, actors, and press for Studio SX during the Film and Interactive conferences.",
  },
  {
    dates: "2008",
    title: "Festival Coordinator",
    company: "GamePlan",
    description:
      "Coordinated the South Padre Music Festival for a digital agency focused on live, mobile, and online experiences.",
  },
  {
    dates: "2007",
    title: "Public Relations Intern",
    company: "TateAustinHahn",
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

export const advisoryTopics: HelpTopic[] = [...helpTopics];

export const investingThemes = [
  { id: "crypto", label: "Crypto" },
  { id: "applied-ai", label: "Applied AI" },
  { id: "physical-ai", label: "Physical AI" },
  { id: "energy", label: "New energy production" },
  { id: "materials", label: "Materials science" },
  { id: "hospitality", label: "High-end hospitality" },
  { id: "analog", label: "Technology disruptors of analog industries" },
  { id: "delightful", label: "Delightful products" },
] as const;

export const books: Book[] = [
  {
    title: "On Writing",
    author: "Stephen King",
    isbn: "9781439156810",
    href: "https://openlibrary.org/isbn/9781439156810",
    description:
      "A memoir of the craft: how King learned to write, and the habits that kept him doing it.",
  },
  {
    title: "All the Pretty Horses",
    author: "Cormac McCarthy",
    isbn: "9780679744399",
    href: "https://openlibrary.org/isbn/9780679744399",
    description:
      "A young cowboy rides into Mexico and finds the West already gone — and still exacting a price.",
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
    title: "Reflections on the Art of Living",
    author: "Joseph Campbell (Diane K. Osbon, ed.)",
    isbn: "9780060926175",
    href: "https://openlibrary.org/isbn/9780060926175",
    description:
      "Campbell on myth, vocation, and how to live the life that's actually yours.",
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    isbn: "9780553418026",
    href: "https://openlibrary.org/isbn/9780553418026",
    description:
      "An astronaut left for dead on Mars treats survival as an engineering problem — and talks himself through it.",
  },
  {
    title: "Wanting",
    author: "Luke Burgis",
    isbn: "9781250262486",
    href: "https://openlibrary.org/isbn/9781250262486",
    description:
      "Mimetic desire: why we want what other people want, and what that does to markets and lives.",
  },
  {
    title: "Breakneck: China's Quest to Engineer the Future",
    author: "Dan Wang",
    isbn: "9781324106036",
    href: "https://openlibrary.org/isbn/9781324106036",
    description:
      "China as an engineering state, America as a lawyerly one — and what each model builds and breaks.",
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    href: "https://openlibrary.org/isbn/9780451524935",
    description:
      "A novel about a state that owns language, memory, and the last private room in a person's head.",
  },
  {
    title: "How Countries Go Broke",
    author: "Ray Dalio",
    isbn: "9781501124068",
    href: "https://openlibrary.org/isbn/9781501124068",
    description:
      "Dalio's map of the big debt cycle — how nations load up, roll over, and eventually run out of room.",
  },
  {
    title: "The Technological Republic",
    author: "Alexander C. Karp & Nicholas W. Zamiska",
    isbn: "9780593798690",
    href: "https://openlibrary.org/isbn/9780593798690",
    description:
      "A brief against a software industry that stopped building for the state, and a state that stopped asking.",
  },
  {
    title: "The Lessons of History",
    author: "Will & Ariel Durant",
    isbn: "9781439149959",
    href: "https://openlibrary.org/isbn/9781439149959",
    description:
      "A slim survey of civilization: what repeats when you look at power, wealth, and belief across centuries.",
  },
  {
    title: "Great Founders Write",
    author: "Ben Putano",
    isbn: "9781737676560",
    href: "https://openlibrary.org/isbn/9781737676560",
    description:
      "Why the founders who can think on the page tend to be the ones who can lead.",
  },
  {
    title: "The New Map",
    author: "Daniel Yergin",
    isbn: "9780143111153",
    href: "https://openlibrary.org/isbn/9780143111153",
    description:
      "Energy, geopolitics, and the new map of power drawn by oil, gas, climate, and renewables.",
  },
  {
    title: "Angel Investing: Start to Finish",
    author: "Joe Wallin & Pete Baltaxe",
    isbn: "9781952120206",
    href: "https://openlibrary.org/isbn/9781952120206",
    description:
      "A practical walk through writing the first checks: terms, diligence, and what early-stage actually looks like.",
  },
  {
    title: "The Art of Being There: Creating Change, One Child at a Time",
    author: "Duncan Campbell & Craig Borlase",
    isbn: "9780989341950",
    href: "https://openlibrary.org/isbn/9780989341950",
    description:
      "How long-term, professional mentoring of one child at a time can interrupt a life already written off.",
  },
  {
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    isbn: "9781544514215",
    href: "https://openlibrary.org/isbn/9781544514215",
    description:
      "A compilation of Naval's notes on wealth, judgment, and getting leverage without losing the plot.",
  },
  {
    title: "Homo Deus",
    author: "Yuval Noah Harari",
    isbn: "9780062464316",
    href: "https://openlibrary.org/isbn/9780062464316",
    description:
      "A forecast of what happens when humans stop dying of the old things and start worshipping data instead.",
  },
  {
    title: "Outlive",
    author: "Peter Attia",
    isbn: "9780593236598",
    href: "https://openlibrary.org/isbn/9780593236598",
    description:
      "A physician's argument that most of what kills us is slow, and most of it is still negotiable.",
  },
  {
    title: "What I Talk About When I Talk About Running",
    author: "Haruki Murakami",
    isbn: "9780307389831",
    href: "https://openlibrary.org/isbn/9780307389831",
    description:
      "Murakami on running as the other job: the miles that keep the writing possible.",
  },
  {
    title: "The Power Law",
    author: "Sebastian Mallaby",
    isbn: "9780525559993",
    href: "https://openlibrary.org/isbn/9780525559993",
    description:
      "How venture capital actually works — a few bets pay for everything, and the rest is noise.",
  },
  {
    title: "The Uninhabitable Earth: Life After Warming",
    author: "David Wallace-Wells",
    isbn: "9780525576709",
    href: "https://www.amazon.com/dp/0525576703",
    description:
      "A climate book that skips the gentle version: what warming does to places, states, and the stories we tell.",
  },
  {
    title: "More Money Than God",
    author: "Sebastian Mallaby",
    isbn: "9780143119418",
    href: "https://openlibrary.org/isbn/9780143119418",
    description:
      "The history of hedge funds: how a few people made the market their profession, and what it cost.",
  },
  {
    title: "The Fixer",
    author: "Bradley Tusk",
    isbn: "9780525536499",
    href: "https://openlibrary.org/isbn/9780525536499",
    description:
      "A political operator's account of keeping startups alive when incumbents call in the government.",
  },
  {
    title: "High Growth Handbook",
    author: "Elad Gil",
    isbn: "9781732265103",
    href: "https://openlibrary.org/isbn/9781732265103",
    description:
      "A playbook for the stretch from twenty people to thousands — boards, execs, and the ugly middle.",
  },
  {
    title: "Debt: The First 5,000 Years",
    author: "David Graeber",
    isbn: "9781612194196",
    href: "https://openlibrary.org/isbn/9781612194196",
    description:
      "A history of obligation: credit came before coin, and debt has always been a moral story.",
  },
  {
    title: "Positioning: The Battle for Your Mind",
    author: "Al Ries & Jack Trout",
    isbn: "9780071373586",
    href: "https://openlibrary.org/isbn/9780071373586",
    description:
      "The argument that the fight isn't on the shelf — it's for the slot a brand occupies in someone's head.",
  },
];

export const email = "johnrobertreed@gmail.com";
export const linkedIn = "https://www.linkedin.com/in/john-robert-reed/";
export const twitter = "https://x.com/johnrobertreed";
export const twitterDm =
  "https://x.com/messages/compose?recipient_id=23902511";
