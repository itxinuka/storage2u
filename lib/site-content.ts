/** Shared marketing + dashboard copy (ported from prototype app/data.js). */

export const siteContent = {
  brand: {
    proofStars: 4.9,
    stats: [
      ["5,000+", "students served"],
      ["20+", "Canadian campuses"],
      ["$0", "hidden fees"],
    ] as const,
  },

  navLinks: [
    { label: "How it works", href: "#how" },
    { label: "Compare", href: "#compare" },
    { label: "Universities", href: "#universities" },
    { label: "Help", href: "#help" },
  ],

  boxes: [
    {
      id: "small",
      name: "Small box",
      price: 7,
      dims: '18" × 18" × 16"',
      blurb: "Books, clothes, kitchen bits — the everyday stuff.",
      popular: false,
    },
    {
      id: "medium",
      name: "Medium box",
      price: 9,
      dims: '18" × 18" × 24"',
      blurb: "The classic moving box. Most students live here.",
      popular: true,
    },
    {
      id: "large",
      name: "Large box",
      price: 13,
      dims: '24" × 24" × 24"',
      blurb: "Bedding, lamps, and the bulkier end-of-term gear.",
      popular: false,
    },
  ],

  items: [
    { id: "mattress", name: "Mattress", price: 20, icon: "mattress", note: "Sealed & wrapped free", tag: true },
    { id: "fridge", name: "Mini-fridge", price: 18, icon: "fridge" },
    { id: "bike", name: "Bicycle", price: 15, icon: "bike" },
    { id: "suitcase", name: "Suitcase", price: 9, icon: "suitcase" },
    { id: "backpack", name: "Backpack", price: 5, icon: "backpack" },
    { id: "monitor", name: "TV / Monitor", price: 16, icon: "monitor" },
  ],

  steps: [
    {
      icon: "calendar-check" as const,
      n: "01",
      title: "Book a pickup",
      body: "Tell us how many boxes you've got and pick a one-hour window. We come straight to your dorm or apartment — no hauling across campus.",
    },
    {
      icon: "shield-check" as const,
      n: "02",
      title: "We store it safely",
      body: "Your boxes go to our secure, climate-controlled warehouse. Everything is catalogued and photographed, so you always know what's inside.",
    },
    {
      icon: "truck" as const,
      n: "03",
      title: "We deliver it back",
      body: "New semester, new place, or just need your winter coat? Request a delivery and we bring everything back to your door.",
    },
  ],

  why: [
    { icon: "truck" as const, title: "Free campus pickup & delivery", body: "We come to you. No moving truck, no bribing a friend with a car." },
    { icon: "shield-check" as const, title: "Climate-controlled & insured", body: "Clean, monitored, secure storage — every box covered up to $500." },
    { icon: "dollar-sign" as const, title: "Pay per box, monthly", body: "Only pay for what you actually store. No oversized locker you half-fill." },
    { icon: "circle-check" as const, title: "Cancel anytime", body: "Month-to-month, no lock-in. Get your stuff back whenever you need it." },
  ],

  universities: [
    ["University of British Columbia", "Vancouver, BC"],
    ["University of Toronto", "Toronto, ON"],
    ["McGill University", "Montréal, QC"],
    ["University of Waterloo", "Waterloo, ON"],
    ["Queen's University", "Kingston, ON"],
    ["Simon Fraser University", "Burnaby, BC"],
    ["Western University", "London, ON"],
    ["McMaster University", "Hamilton, ON"],
    ["University of Alberta", "Edmonton, AB"],
    ["York University", "Toronto, ON"],
    ["Concordia University", "Montréal, QC"],
    ["Dalhousie University", "Halifax, NS"],
    ["Memorial University", "St. John's, NL"],
  ] as const,

  logoStrip: [
    ["ubc", "University of British Columbia", "UBC"],
    ["uoft", "University of Toronto", "U of T"],
    ["mcgill", "McGill University", "McGill"],
    ["waterloo", "University of Waterloo", "Waterloo"],
    ["queens", "Queen's University", "Queen's"],
    ["sfu", "Simon Fraser University", "SFU"],
    ["dal", "Dalhousie University", "Dalhousie"],
    ["memorial", "Memorial University", "Memorial"],
  ] as const,

  testimonials: [
    { quote: "Honestly the easiest part of moving out — they showed up, grabbed my boxes, and that was it.", name: "Priya S.", meta: "2nd year · UBC" },
    { quote: "I had six boxes, so I paid for six boxes. No giant locker I'd just half-fill all summer.", name: "Jordan T.", meta: "4th year · U of T" },
    { quote: "Everything came back the morning I moved in. Zero stress during exam season — exactly what I needed.", name: "Émile R.", meta: "3rd year · McGill" },
  ],

  faqs: [
    ["How does per-box pricing work?", "You pay a flat monthly fee for each box you store — $7, $9, or $13 depending on size. No deposits, no setup fees, and pickup and delivery on campus are always free."],
    ["When can I get my stuff back?", "Anytime. Request a delivery from your dashboard and pick a window — we'll have it back at your door, usually within 48 hours."],
    ["Is my stuff insured?", "Yes. Every box is stored in a climate-controlled, monitored facility and covered up to $500. Need more coverage? Just ask."],
    ["What if I'm not sure how many boxes I need?", "Start with your best guess — you can add or remove boxes anytime, and we'll only ever bill you for what you're actually storing."],
  ] as const,

  compare: [
    ["Pickup & delivery", { us: "Free, to your door", them: "You rent a van & haul it yourself" }],
    ["Pricing", { us: "Per box, monthly", them: "Fixed unit — pay for empty space" }],
    ["Contract", { us: "Month-to-month, cancel anytime", them: "Often locked into 6–12 months" }],
    ["Climate control", { us: true, them: "Extra fee, if offered" }],
    ["Inventory photos", { us: "Every box catalogued", them: false }],
    ["Insurance", { us: "Up to $500 included", them: "Sold separately" }],
    ["Effort on you", { us: "Pack boxes — that's it", them: "Drive, lift, load, repeat" }],
  ] as const,

  moveIn: [
    { icon: "calendar-check" as const, title: "Book before move-in day", body: "Schedule a drop-off window and skip the chaos of arrival weekend." },
    { icon: "truck" as const, title: "We deliver to your room", body: "Your stored boxes — or new term's gear — arrive right at your residence door." },
    { icon: "package-check" as const, title: "Unpack, we recycle the boxes", body: "Settle in fast. We'll haul away the empties so your room stays clear." },
  ],

  blog: [
    { id: "summer-checklist", cat: "Moving out", read: "6 min", title: "The end-of-term move-out checklist every student needs", excerpt: "Exams are done, your lease is up, and your room looks like a tornado hit it. Here's how to pack, store, and bounce in a single afternoon.", date: "Jun 12, 2026", tone: "purple" as const, feature: true },
    { id: "pack-like-pro", cat: "Packing tips", read: "4 min", title: "How to pack a box so nothing breaks in storage", excerpt: "Heavy on the bottom, fragile in the middle, label every side. The five rules that keep your mugs in one piece.", date: "Jun 3, 2026", tone: "lime" as const },
    { id: "dorm-vs-apartment", cat: "Campus life", read: "5 min", title: "Dorm or off-campus? What changes for your storage", excerpt: "Residence move-out dates, summer subleases, and why per-box storage beats a locker for both.", date: "May 21, 2026", tone: "soft" as const },
    { id: "mattress-storage", cat: "Big items", read: "3 min", title: "Yes, we'll store your mattress — here's how we keep it fresh", excerpt: "Sealed, wrapped, and stood upright in a climate-controlled bay. What happens to the bulky stuff.", date: "May 9, 2026", tone: "purple" as const },
    { id: "moving-day-hacks", cat: "Moving out", read: "4 min", title: "7 move-in day hacks for a stress-free arrival", excerpt: "Book your delivery for the morning, unpack the essentials box first, and recycle as you go.", date: "Apr 28, 2026", tone: "lime" as const },
    { id: "what-to-store", cat: "Packing tips", read: "5 min", title: "What's actually worth storing over the summer", excerpt: "Winter coats, textbooks, and the mini-fridge: yes. That broken desk lamp: maybe let it go.", date: "Apr 15, 2026", tone: "soft" as const },
  ],

  contactReasons: [
    { icon: "package" as const, title: "Book or change a pickup", body: "Questions about scheduling, box counts, or rescheduling a delivery." },
    { icon: "dollar-sign" as const, title: "Billing & pricing", body: "Anything about monthly charges, receipts, or your payment method." },
    { icon: "graduation-cap" as const, title: "Campus partnerships", body: "Bringing Storage2U to your residence, student union, or society." },
  ],

  contactChannels: [
    { icon: "inbox" as const, label: "Email us", value: "hello@storage2u.ca", note: "We reply within a few hours" },
    { icon: "clock" as const, label: "Support hours", value: "Mon–Sat, 8 AM – 8 PM ET", note: "Extended during move-out season" },
    { icon: "map-pin" as const, label: "Head office", value: "Toronto, Ontario", note: "Serving 20+ campuses nationwide" },
  ],

  dashboard: {
    greeting: "Here's everything you've got stored with us.",
    nav: [
      { id: "storage", label: "My Storage", icon: "package" as const },
      { id: "deliveries", label: "Deliveries", icon: "truck" as const },
      { id: "billing", label: "Billing", icon: "dollar-sign" as const },
      { id: "account", label: "Account", icon: "users" as const },
    ],
    sidebarCta: {
      title: "Need to store more?",
      body: "Add boxes any time — we'll pick them up.",
      btn: "Book a pickup",
    },
    placeholders: {
      deliveries: {
        title: "Deliveries",
        body: "Track upcoming drop-offs and request new ones from your active storage cards.",
      },
      billing: {
        title: "Billing",
        body: "Your monthly per-box charges, receipts, and payment method will live here.",
      },
      account: {
        title: "Account",
        body: "Update your campus, contact info, and notification preferences.",
      },
    },
  },
} as const
