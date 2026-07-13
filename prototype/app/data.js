/* Storage2U — shared content for all pages (Canadian campuses, per-box monthly pricing).
   Plain JS: load with a normal <script> before the Babel component scripts. */
window.S2U = {
  brand: {
    proofStars: 4.9,
    stats: [
      ["5,000+", "students served"],
      ["20+", "Canadian campuses"],
      ["$0", "hidden fees"],
    ],
  },

  // Per-item, billed monthly. Free pickup + delivery on campus.
  boxes: [
    {
      id: "large_box",
      name: "Large Box",
      price: 20,
      dims: '18" × 18" × 16"',
      blurb: "Books, clothes, kitchen bits — the everyday stuff.",
      popular: true,
    },
  ],

  items: [
    { id: "backpack", name: "Backpack", price: 5, icon: "backpack" },
    { id: "mirror", name: "Full Length Mirror", price: 10, icon: "mirror" },
    { id: "large_box", name: "Large Box", price: 20, icon: "box", dims: '18" × 18" × 16"' },
    { id: "carry_on", name: "Carry-On Suitcase", price: 20, icon: "suitcase" },
    { id: "duffel", name: "Duffel Bag", price: 20, icon: "duffel" },
    { id: "skis", name: "Skis / Snowboard", price: 25, icon: "skis" },
    { id: "fridge", name: "Mini Fridge", price: 25, icon: "fridge" },
    { id: "monitor", name: "Monitor / TV (boxed)", price: 25, icon: "monitor" },
    { id: "check_in", name: "Check-In Suitcase", price: 30, icon: "suitcase" },
    { id: "desk_chair", name: "Desk Chair", price: 30, icon: "desk_chair" },
    { id: "bike", name: "Bicycle", price: 40, icon: "bike" },
  ],

  steps: [
    {
      icon: "calendar-check",
      n: "01",
      title: "Book a pickup",
      body: "Tell us how many boxes you've got and pick a one-hour window. We come straight to your dorm or apartment — no hauling across campus.",
    },
    {
      icon: "shield-check",
      n: "02",
      title: "We store it safely",
      body: "Your boxes go to our secure, climate-controlled warehouse. Everything is catalogued and photographed, so you always know what's inside.",
    },
    {
      icon: "truck",
      n: "03",
      title: "We deliver it back",
      body: "New semester, new place, or just need your winter coat? Request a delivery and we bring everything back to your door.",
    },
  ],

  why: [
    { icon: "truck", title: "Free campus pickup & delivery", body: "We come to you. No moving truck, no bribing a friend with a car." },
    { icon: "shield-check", title: "Climate-controlled & insured", body: "Clean, monitored, secure storage — every box covered up to $500." },
    { icon: "dollar-sign", title: "Pay per box, monthly", body: "Only pay for what you actually store. No oversized locker you half-fill." },
    { icon: "circle-check", title: "Cancel anytime", body: "Month-to-month, no lock-in. Get your stuff back whenever you need it." },
  ],

  // Real Canadian universities, city + province.
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
  ],

  // Curated set shown as fillable logo chips in the trust strip.
  logoStrip: [
    ["ubc", "University of British Columbia", "UBC"],
    ["uoft", "University of Toronto", "U of T"],
    ["mcgill", "McGill University", "McGill"],
    ["waterloo", "University of Waterloo", "Waterloo"],
    ["queens", "Queen's University", "Queen's"],
    ["sfu", "Simon Fraser University", "SFU"],
    ["dal", "Dalhousie University", "Dalhousie"],
    ["memorial", "Memorial University", "Memorial"],
  ],

  residences: ["On-campus residence", "Off-campus apartment", "Shared house", "Other"],

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
  ],

  navLinks: ["How it works", "Compare", "Universities", "Help"],

  // ── Driver / mover app ───────────────────────────────────────────
  // ── Internal ops / staff dashboard ───────────────────────────────
  ops: {
    hub: "Vancouver hub",
    today: "Sat, Sep 19, 2026",
    stats: [
      { k: "Today's pickups", v: "9", s: "2 completed", icon: "calendar-check" },
      { k: "Today's deliveries", v: "4", s: "1 out for delivery", icon: "truck" },
      { k: "Boxes to handle", v: "78", s: "across 13 orders", icon: "box" },
      { k: "Drivers on shift", v: "3", s: "1 van available", icon: "users" },
    ],
    drivers: [
      { id: "v04", name: "Marcus Chen", van: "Van 04", stops: 6, done: 2, status: "on_route" },
      { id: "v02", name: "Dana Whitfield", van: "Van 02", stops: 5, done: 3, status: "on_route" },
      { id: "v07", name: "Aaron Patel", van: "Van 07", stops: 4, done: 0, status: "loading" },
      { id: "v01", name: "—", van: "Van 01", stops: 0, done: 0, status: "available" },
    ],
    // Today's scheduled orders (pickups + deliveries)
    schedule: [
      { id: "o1041", time: "8:00 AM", customer: "Priya Sharma", type: "pickup", uni: "UBC", address: "Totem Park, Rm 314", boxes: 6, driver: "Van 04", status: "done" },
      { id: "o1042", time: "8:45 AM", customer: "Liam O'Brien", type: "pickup", uni: "UBC", address: "5959 Student Union, Apt 7B", boxes: 4, driver: "Van 04", status: "done" },
      { id: "o1043", time: "9:30 AM", customer: "Aisha Mohammed", type: "delivery", uni: "UBC", address: "Walter Gage, Twr 2 Rm 1108", boxes: 8, driver: "Van 04", status: "out" },
      { id: "o1044", time: "9:45 AM", customer: "Chloé Bergeron", type: "pickup", uni: "SFU", address: "Hamilton Hall, Rm 220", boxes: 5, driver: "Van 02", status: "scheduled" },
      { id: "o1045", time: "10:30 AM", customer: "Noah Williams", type: "pickup", uni: "UBC", address: "2750 Acadia Rd, Unit 12", boxes: 5, driver: "Van 04", status: "scheduled" },
      { id: "o1046", time: "11:00 AM", customer: "Sofia Rossi", type: "pickup", uni: "UBC", address: "3335 Wesbrook Mall, Rm 502", boxes: 7, driver: "Unassigned", status: "scheduled" },
      { id: "o1047", time: "11:30 AM", customer: "Jayden Park", type: "delivery", uni: "SFU", address: "Shell House, Rm 110", boxes: 3, driver: "Unassigned", status: "scheduled" },
      { id: "o1048", time: "12:30 PM", customer: "Ethan Tremblay", type: "delivery", uni: "UBC", address: "6393 NW Marine Dr, Rm 208", boxes: 8, driver: "Van 04", status: "scheduled" },
      { id: "o1049", time: "1:15 PM", customer: "Maya Singh", type: "pickup", uni: "SFU", address: "Cornerstone, Rm 415", boxes: 9, driver: "Unassigned", status: "scheduled" },
    ],
    // Next few days
    upcoming: [
      { date: "Sun, Sep 20", pickups: 11, deliveries: 6, boxes: 92 },
      { date: "Mon, Sep 21", pickups: 7, deliveries: 3, boxes: 54 },
      { date: "Tue, Sep 22", pickups: 5, deliveries: 8, boxes: 71 },
    ],

    // All orders (Orders page)
    orders: [
      { id: "1049", customer: "Maya Singh", uni: "SFU", type: "pickup", status: "scheduled", boxes: 9, items: 1, sched: "Sep 19, 2026", monthly: 92 },
      { id: "1048", customer: "Ethan Tremblay", uni: "UBC", type: "delivery", status: "out_for_delivery", boxes: 8, items: 1, sched: "Sep 19, 2026", monthly: 81 },
      { id: "1043", customer: "Aisha Mohammed", uni: "UBC", type: "delivery", status: "out_for_delivery", boxes: 8, items: 2, sched: "Sep 19, 2026", monthly: 88 },
      { id: "1042", customer: "Liam O'Brien", uni: "UBC", type: "pickup", status: "in_storage", boxes: 4, items: 1, sched: "Sep 19, 2026", monthly: 51 },
      { id: "1041", customer: "Priya Sharma", uni: "UBC", type: "pickup", status: "in_storage", boxes: 6, items: 2, sched: "Sep 19, 2026", monthly: 92 },
      { id: "1038", customer: "Chloé Bergeron", uni: "SFU", type: "pickup", status: "scheduled", boxes: 5, items: 0, sched: "Sep 19, 2026", monthly: 45 },
      { id: "1034", customer: "Noah Williams", uni: "UBC", type: "pickup", status: "scheduled", boxes: 5, items: 2, sched: "Sep 19, 2026", monthly: 59 },
      { id: "1029", customer: "Sofia Rossi", uni: "UBC", type: "pickup", status: "in_storage", boxes: 7, items: 1, sched: "Sep 12, 2026", monthly: 81 },
      { id: "1021", customer: "Jayden Park", uni: "SFU", type: "delivery", status: "delivered", boxes: 3, items: 0, sched: "Sep 8, 2026", monthly: 27 },
      { id: "1018", customer: "Hannah Kim", uni: "U of T", type: "pickup", status: "in_storage", boxes: 12, items: 3, sched: "Sep 5, 2026", monthly: 134 },
      { id: "1004", customer: "Omar Haddad", uni: "McGill", type: "pickup", status: "in_storage", boxes: 6, items: 1, sched: "Aug 30, 2026", monthly: 72 },
      { id: "0997", customer: "Grace Liu", uni: "UBC", type: "delivery", status: "delivered", boxes: 4, items: 0, sched: "Aug 24, 2026", monthly: 36 },
      { id: "0985", customer: "Daniel Okafor", uni: "SFU", type: "pickup", status: "cancelled", boxes: 0, items: 0, sched: "Aug 20, 2026", monthly: 0 },
      { id: "0972", customer: "Isabella Moretti", uni: "U of T", type: "pickup", status: "in_storage", boxes: 8, items: 2, sched: "Aug 15, 2026", monthly: 96 },
    ],

    // All customers (Customers page)
    customers: [
      { id: "c1", name: "Priya Sharma", email: "priya.s@student.ubc.ca", uni: "UBC", phone: "(604) 555-0112", status: "active", boxes: 6, monthly: 92, since: "Sep 2026" },
      { id: "c2", name: "Liam O'Brien", email: "liam.ob@student.ubc.ca", uni: "UBC", phone: "(604) 555-0143", status: "active", boxes: 4, monthly: 51, since: "Sep 2026" },
      { id: "c3", name: "Aisha Mohammed", email: "aisha.m@student.ubc.ca", uni: "UBC", phone: "(604) 555-0178", status: "active", boxes: 8, monthly: 88, since: "May 2026" },
      { id: "c4", name: "Sofia Rossi", email: "sofia.r@student.ubc.ca", uni: "UBC", phone: "(604) 555-0166", status: "active", boxes: 7, monthly: 81, since: "Sep 2026" },
      { id: "c5", name: "Hannah Kim", email: "hannah.kim@mail.utoronto.ca", uni: "U of T", phone: "(416) 555-0190", status: "active", boxes: 12, monthly: 134, since: "Sep 2026" },
      { id: "c6", name: "Omar Haddad", email: "omar.h@mail.mcgill.ca", uni: "McGill", phone: "(514) 555-0123", status: "active", boxes: 6, monthly: 72, since: "Aug 2026" },
      { id: "c7", name: "Isabella Moretti", email: "isabella.m@mail.utoronto.ca", uni: "U of T", phone: "(416) 555-0155", status: "active", boxes: 8, monthly: 96, since: "Aug 2026" },
      { id: "c8", name: "Maya Singh", email: "maya.singh@sfu.ca", uni: "SFU", phone: "(778) 555-0144", status: "active", boxes: 9, monthly: 92, since: "Sep 2026" },
      { id: "c9", name: "Jayden Park", email: "jayden.park@sfu.ca", uni: "SFU", phone: "(778) 555-0188", status: "past", boxes: 0, monthly: 0, since: "Jan 2026" },
      { id: "c10", name: "Grace Liu", email: "grace.liu@student.ubc.ca", uni: "UBC", phone: "(604) 555-0177", status: "past", boxes: 0, monthly: 0, since: "Jan 2026" },
      { id: "c11", name: "Daniel Okafor", email: "daniel.o@sfu.ca", uni: "SFU", phone: "(778) 555-0199", status: "past", boxes: 0, monthly: 0, since: "Feb 2026" },
      { id: "c12", name: "Chloé Bergeron", email: "chloe.b@sfu.ca", uni: "SFU", phone: "(778) 555-0133", status: "active", boxes: 5, monthly: 45, since: "Sep 2026" },
    ],

    // Warehouses (Warehouses page) — each with holdings by customer
    warehouses: [
      {
        id: "yvr1", name: "Burnaby Facility", city: "Burnaby, BC", capacity: 72, units: 184, boxes: 1240, serves: ["UBC"],
        holdings: [
          { customer: "Priya Sharma", uni: "UBC", boxes: 6, items: 2, bay: "A-12-03", since: "Sep 19, 2026" },
          { customer: "Liam O'Brien", uni: "UBC", boxes: 4, items: 1, bay: "A-12-07", since: "Sep 19, 2026" },
          { customer: "Sofia Rossi", uni: "UBC", boxes: 7, items: 1, bay: "B-04-11", since: "Sep 12, 2026" },
          { customer: "Maya Singh", uni: "SFU", boxes: 9, items: 1, bay: "C-09-02", since: "Sep 19, 2026" },
          { customer: "Grace Liu", uni: "UBC", boxes: 4, items: 0, bay: "B-02-08", since: "Aug 24, 2026" },
        ],
      },
      {
        id: "yvr2", name: "Richmond Facility", city: "Richmond, BC", capacity: 58, units: 142, boxes: 980, serves: ["SFU"],
        holdings: [
          { customer: "Aisha Mohammed", uni: "UBC", boxes: 8, items: 2, bay: "D-01-05", since: "May 4, 2026" },
          { customer: "Chloé Bergeron", uni: "SFU", boxes: 5, items: 0, bay: "D-03-14", since: "Sep 19, 2026" },
          { customer: "Daniel Okafor", uni: "SFU", boxes: 3, items: 1, bay: "E-06-09", since: "Feb 2, 2026" },
        ],
      },
      {
        id: "yyz1", name: "Toronto Facility", city: "Etobicoke, ON", capacity: 81, units: 226, boxes: 1610, serves: ["U of T", "McGill"],
        holdings: [
          { customer: "Hannah Kim", uni: "U of T", boxes: 12, items: 3, bay: "F-10-01", since: "Sep 5, 2026" },
          { customer: "Isabella Moretti", uni: "U of T", boxes: 8, items: 2, bay: "F-10-06", since: "Aug 15, 2026" },
          { customer: "Omar Haddad", uni: "McGill", boxes: 6, items: 1, bay: "G-02-13", since: "Aug 30, 2026" },
        ],
      },
    ],

    // Staff roster available to be added to a shift (Schedule page)
    staff: [
      { id: "s1", name: "Marcus Chen", role: "Driver", phone: "(604) 555-0301" },
      { id: "s2", name: "Dana Whitfield", role: "Driver", phone: "(604) 555-0302" },
      { id: "s3", name: "Aaron Patel", role: "Driver", phone: "(604) 555-0303" },
      { id: "s4", name: "Riya Kapoor", role: "Driver", phone: "(604) 555-0304" },
      { id: "s5", name: "Tom Becker", role: "Mover", phone: "(604) 555-0305" },
      { id: "s6", name: "Nina Lopez", role: "Driver", phone: "(604) 555-0306" },
    ],

    // When each order was placed (Orders detail panel)
    placedDates: {
      "1049": "Sep 12, 2026", "1048": "Sep 10, 2026", "1043": "May 1, 2026", "1042": "Sep 9, 2026",
      "1041": "Sep 8, 2026", "1038": "Sep 6, 2026", "1034": "Sep 2, 2026", "1029": "Sep 1, 2026",
      "1021": "Aug 28, 2026", "1018": "Aug 26, 2026", "1004": "Aug 20, 2026", "0997": "Aug 14, 2026",
      "0985": "Aug 12, 2026", "0972": "Aug 5, 2026",
    },
  },

  driver: {
    name: "Marcus Chen",
    first: "Marcus",
    vehicle: "Van 04 · BD-2241",
    shift: "8:00 AM – 4:00 PM",
    day: { stops: 6, done: 2, boxes: 38, miles: "31 km", hours: "5.5 hrs" },
    stops: [
      { id: "s1", type: "pickup", status: "done", customer: "Priya Sharma", uni: "UBC", address: "2055 Lower Mall, Totem Park", room: "Rm 314", window: "8:00 – 8:30 AM", eta: "8:12 AM", dist: "—", boxes: 6, items: ["Mini Fridge", "Bicycle"], phone: "(604) 555-0112", notes: "Buzz #314. Elevator on the north side." },
      { id: "s2", type: "pickup", status: "done", customer: "Liam O'Brien", uni: "UBC", address: "5959 Student Union Blvd", room: "Apt 7B", window: "8:45 – 9:15 AM", eta: "9:02 AM", dist: "—", boxes: 4, items: ["Bicycle"], phone: "(604) 555-0143", notes: "Bike is in the storage locker, level P1." },
      { id: "s3", type: "delivery", status: "current", customer: "Aisha Mohammed", uni: "UBC", address: "6133 University Blvd, Walter Gage", room: "Tower 2, Rm 1108", window: "9:30 – 10:00 AM", eta: "9:41 AM", dist: "1.2 km", boxes: 8, items: ["TV / Monitor", "Desk chair"], phone: "(604) 555-0178", notes: "Customer requested morning delivery. Call on arrival." },
      { id: "s4", type: "pickup", status: "upcoming", customer: "Noah Williams", uni: "UBC", address: "2750 Acadia Rd", room: "Unit 12", window: "10:30 – 11:00 AM", eta: "10:38 AM", dist: "2.4 km", boxes: 5, items: ["Suitcase", "Backpack"], phone: "(604) 555-0190", notes: "Leave boxes with roommate if not home." },
      { id: "s5", type: "pickup", status: "upcoming", customer: "Sofia Rossi", uni: "UBC", address: "3335 Wesbrook Mall", room: "Rm 502", window: "11:15 – 11:45 AM", eta: "11:22 AM", dist: "1.1 km", boxes: 7, items: ["Mini-fridge"], phone: "(604) 555-0166", notes: "" },
      { id: "s6", type: "delivery", status: "upcoming", customer: "Ethan Tremblay", uni: "UBC", address: "6393 NW Marine Dr", room: "Rm 208", window: "12:30 – 1:00 PM", eta: "12:41 PM", dist: "3.0 km", boxes: 8, items: ["Desk Chair"], phone: "(604) 555-0155", notes: "Chair delivery — confirm room is clear." },
    ],
  },

  // Blog posts (student storage tips / company news)
  blog: [
    { id: "summer-checklist", cat: "Moving out", read: "6 min", title: "The end-of-term move-out checklist every student needs", excerpt: "Exams are done, your lease is up, and your room looks like a tornado hit it. Here's how to pack, store, and bounce in a single afternoon.", date: "Jun 12, 2026", tone: "purple", feature: true },
    { id: "pack-like-pro", cat: "Packing tips", read: "4 min", title: "How to pack a box so nothing breaks in storage", excerpt: "Heavy on the bottom, fragile in the middle, label every side. The five rules that keep your mugs in one piece.", date: "Jun 3, 2026", tone: "lime" },
    { id: "dorm-vs-apartment", cat: "Campus life", read: "5 min", title: "Dorm or off-campus? What changes for your storage", excerpt: "Residence move-out dates, summer subleases, and why per-box storage beats a locker for both.", date: "May 21, 2026", tone: "soft" },
    { id: "big-item-storage", cat: "Big items", read: "3 min", title: "Bikes, fridges, and skis — how we store the bulky stuff", excerpt: "Climate-controlled bays, careful wrapping, and catalogued photos. What happens to oversized gear.", date: "May 9, 2026", tone: "purple" },
    { id: "moving-day-hacks", cat: "Moving out", read: "4 min", title: "7 move-in day hacks for a stress-free arrival", excerpt: "Book your delivery for the morning, unpack the essentials box first, and recycle as you go.", date: "Apr 28, 2026", tone: "lime" },
    { id: "what-to-store", cat: "Packing tips", read: "5 min", title: "What's actually worth storing over the summer", excerpt: "Winter coats, textbooks, and the mini-fridge: yes. That broken desk lamp: maybe let it go.", date: "Apr 15, 2026", tone: "soft" },
  ],

  contactReasons: [
    { icon: "package", title: "Book or change a pickup", body: "Questions about scheduling, box counts, or rescheduling a delivery." },
    { icon: "dollar-sign", title: "Billing & pricing", body: "Anything about monthly charges, receipts, or your payment method." },
    { icon: "graduation-cap", title: "Campus partnerships", body: "Bringing Storage2U to your residence, student union, or society." },
  ],
  contactChannels: [
    { icon: "inbox", label: "Email us", value: "hello@storage2u.ca", note: "We reply within a few hours" },
    { icon: "clock", label: "Support hours", value: "Mon–Sat, 8 AM – 8 PM ET", note: "Extended during move-out season" },
    { icon: "map-pin", label: "Head office", value: "Toronto, Ontario", note: "Serving 20+ campuses nationwide" },
  ],

  // Storage2U vs traditional self-storage
  compare: [
    ["Pickup & delivery", { us: "Free, to your door", them: "You rent a van & haul it yourself" }],
    ["Pricing", { us: "Per box, monthly", them: "Fixed unit — pay for empty space" }],
    ["Contract", { us: "Month-to-month, cancel anytime", them: "Often locked into 6–12 months" }],
    ["Climate control", { us: true, them: "Extra fee, if offered" }],
    ["Inventory photos", { us: "Every box catalogued", them: false }],
    ["Insurance", { us: "Up to $500 included", them: "Sold separately" }],
    ["Effort on you", { us: "Pack boxes — that's it", them: "Drive, lift, load, repeat" }],
  ],

  // Dorm move-in service (uses the same booking flow)
  moveIn: [
    { icon: "calendar-check", title: "Book before move-in day", body: "Schedule a drop-off window and skip the chaos of arrival weekend." },
    { icon: "truck", title: "We deliver to your room", body: "Your stored boxes — or new term's gear — arrive right at your residence door." },
    { icon: "package-check", title: "Unpack, we recycle the boxes", body: "Settle in fast. We'll haul away the empties so your room stays clear." },
  ],
};

// ── Ops helpers (line items, totals, lookups) ─────────────────────────
window.S2U.opsHelpers = {
  // Build an itemized order breakdown from box/item counts.
  lines(o) {
    const out = [];
    const large = Math.floor(o.boxes / 4);
    const medium = o.boxes - large;
    if (medium > 0) out.push({ label: "Medium box", icon: "box", qty: medium, unit: 9 });
    if (large > 0) out.push({ label: "Large box", icon: "box", qty: large, unit: 13 });
    const itemPool = [["Mini Fridge", 25], ["Bicycle", 40], ["Backpack", 5]];
    for (let i = 0; i < o.items; i++) {
      const [label, unit] = itemPool[i % itemPool.length];
      out.push({ label, icon: "package", qty: 1, unit });
    }
    return out.map((l) => ({ ...l, subtotal: l.qty * l.unit }));
  },
  total(o) { return this.lines(o).reduce((s, l) => s + l.subtotal, 0); },
  placed(o) { return (window.S2U.ops.placedDates || {})[o.id] || "—"; },
  ordersForCustomer(name) { return window.S2U.ops.orders.filter((o) => o.customer === name); },
  ordersForWarehouse(wh) { return window.S2U.ops.orders.filter((o) => (wh.serves || []).includes(o.uni)); },
};
