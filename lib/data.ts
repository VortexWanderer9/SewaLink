export type Category = {
  slug: string;
  name: string;
  nameNe: string;
  blurb: string;
  avgPrice: string;
};

export const categories: Category[] = [
  { slug: "electrician", name: "Electrician", nameNe: "बिजुली मिस्त्री", blurb: "Wiring, switchboards, fault repair", avgPrice: "Rs 500–1,500" },
  { slug: "plumber", name: "Plumber", nameNe: "प्लम्बर", blurb: "Leaks, pipe fitting, geysers", avgPrice: "Rs 400–1,800" },
  { slug: "carpenter", name: "Carpenter", nameNe: "सिकर्मी", blurb: "Furniture repair, custom woodwork", avgPrice: "Rs 600–3,000" },
  { slug: "painter", name: "Painter", nameNe: "रंगकर्मी", blurb: "Interior & exterior painting", avgPrice: "Rs 15/sq.ft" },
  { slug: "ac-technician", name: "AC Technician", nameNe: "एसी टेक्निसियन", blurb: "Servicing, gas refill, installation", avgPrice: "Rs 1,200–3,500" },
  { slug: "cctv", name: "CCTV Installer", nameNe: "सीसीटीभी", blurb: "Setup, repair, remote access", avgPrice: "Rs 2,000–6,000" },
  { slug: "mechanic", name: "Vehicle Mechanic", nameNe: "मेकानिक", blurb: "Bike & car servicing, doorstep repair", avgPrice: "Rs 500–2,500" },
  { slug: "tutor", name: "Home Tutor", nameNe: "ट्युटर", blurb: "School, +2, entrance prep", avgPrice: "Rs 800–2,000/mo" },
  { slug: "cleaner", name: "Deep Cleaning", nameNe: "सरसफाई", blurb: "Home, kitchen, sofa & carpet", avgPrice: "Rs 1,500–4,000" },
  { slug: "mover", name: "Movers & Packers", nameNe: "सरसामान सार्ने", blurb: "Local shifting, loading, unloading", avgPrice: "Rs 3,000–12,000" },
  { slug: "photographer", name: "Photographer", nameNe: "फोटोग्राफर", blurb: "Events, portraits, real estate", avgPrice: "Rs 5,000+/event" },
  { slug: "pest-control", name: "Pest Control", nameNe: "किरा नियन्त्रण", blurb: "Termite, cockroach, rodent", avgPrice: "Rs 1,800–4,500" },
];

export type Worker = {
  id: string;
  name: string;
  category: string;
  location: string;
  yearsExp: number;
  rating: number;
  jobsDone: number;
  priceFrom: number;
  verified: boolean;
  badges: string[];
  bio: string;
  responseTime: string;
  avatarInitials: string;
  gulfReturnee?: boolean;
};

export const workers: Worker[] = [
  {
    id: "bishnu-shrestha",
    name: "Bishnu Shrestha",
    category: "electrician",
    location: "Lalitpur — Jawalakhel",
    yearsExp: 15,
    rating: 4.9,
    jobsDone: 812,
    priceFrom: 500,
    verified: true,
    badges: ["Top Rated", "Qatar-trained"],
    bio: "15 years of industrial and residential wiring experience, including 6 years in Qatar. Specializes in fault diagnosis and smart-home wiring.",
    responseTime: "Usually responds in 12 min",
    avatarInitials: "BS",
    gulfReturnee: true,
  },
  {
    id: "sita-tamang",
    name: "Sita Tamang",
    category: "cleaner",
    location: "Kathmandu — Baneshwor",
    yearsExp: 6,
    rating: 4.8,
    jobsDone: 540,
    priceFrom: 1500,
    verified: true,
    badges: ["Top Rated"],
    bio: "Leads a 3-person deep-cleaning team. Known for kitchen degreasing and move-in/move-out cleaning.",
    responseTime: "Usually responds in 20 min",
    avatarInitials: "ST",
  },
  {
    id: "ramesh-koirala",
    name: "Ramesh Koirala",
    category: "plumber",
    location: "Bhaktapur — Suryabinayak",
    yearsExp: 9,
    rating: 4.7,
    jobsDone: 398,
    priceFrom: 400,
    verified: true,
    badges: ["Fast Responder"],
    bio: "Handles everything from leak repair to full bathroom fittings. Carries common spare parts on every visit.",
    responseTime: "Usually responds in 8 min",
    avatarInitials: "RK",
  },
  {
    id: "hari-magar",
    name: "Hari Magar",
    category: "ac-technician",
    location: "Kathmandu — Kalanki",
    yearsExp: 11,
    rating: 4.9,
    jobsDone: 671,
    priceFrom: 1200,
    verified: true,
    badges: ["Top Rated", "Malaysia-trained"],
    bio: "Certified split & VRF AC technician. Malaysia-trained, specializes in gas leak diagnosis.",
    responseTime: "Usually responds in 15 min",
    avatarInitials: "HM",
    gulfReturnee: true,
  },
  {
    id: "puja-rai",
    name: "Puja Rai",
    category: "tutor",
    location: "Pokhara — Lakeside",
    yearsExp: 4,
    rating: 4.8,
    jobsDone: 210,
    priceFrom: 800,
    verified: true,
    badges: ["Parent Favorite"],
    bio: "B.Ed graduate, teaches Science and Math for grades 6–10, with a focus on SEE exam preparation.",
    responseTime: "Usually responds in 30 min",
    avatarInitials: "PR",
  },
  {
    id: "dipesh-gurung",
    name: "Dipesh Gurung",
    category: "carpenter",
    location: "Kathmandu — Chabahil",
    yearsExp: 13,
    rating: 4.6,
    jobsDone: 305,
    priceFrom: 600,
    verified: true,
    badges: ["Fast Responder"],
    bio: "Custom furniture and door/window repair. Works with both traditional Newari joinery and modern modular fittings.",
    responseTime: "Usually responds in 25 min",
    avatarInitials: "DG",
  },
];

export const testimonials = [
  {
    quote:
      "The electrician arrived within the hour and showed his verification badge before entering. I finally trust who's coming into my home.",
    name: "Sunita K.",
    role: "Homeowner, Baneshwor",
  },
  {
    quote:
      "I used to wait days for small jobs. Now I get 4–5 bookings a week through the app alone, on top of my regular customers.",
    name: "Bishnu S.",
    role: "Electrician, Lalitpur",
  },
  {
    quote:
      "We manage AC and CCTV maintenance for three hotel properties from one dashboard now instead of six different phone numbers.",
    name: "Prakash M.",
    role: "Hotel Owner, Biratnagar",
  },
];
