# Storage2U — Operations Dashboard: Cursor / Claude Handoff

This package rebuilds the **internal operations dashboard** (`ops.html`) as a real,
staff-only surface inside the production app (Next.js 16 + React 19, shadcn/ui,
Clerk, Stripe, Supabase, lucide-react).

The prototype is the **visual + interaction spec**. Don't copy the prototype's
plain `<script type="text/babel">` setup — port each view to the real component
stack, wire it to Supabase, and gate it behind Clerk staff auth.

---

## 1. Files to give Claude

**The design / interaction spec (this prototype):**
- `ops.html` — page shell + script load order
- `app/Ops.jsx` — sidebar nav, Schedule view, driver-shift + assign dispatch modals
- `app/OpsShared.jsx` — shared primitives: `SearchBar`, `FilterTabs`, `OrderStatus`, `Drawer` (side panel), `Modal`, `OrderDetail`, `PageHead`, `EmptyState`
- `app/OpsOrders.jsx` — Orders list + order-detail side panel
- `app/OpsCustomers.jsx` — Customers list + customer side panel (their orders)
- `app/OpsWarehouse.jsx` — Warehouse selector, Holdings/Orders tabs, add-warehouse modal
- `app/data.js` — **the data model** (shapes for orders, customers, warehouses, drivers, staff, schedule + the `opsHelpers` cost/line-item logic)
- `app/site.css` — all layout classes (`.dash-*`, `.ops-*`, `.ord-*`, `.cust-*`, `.wh-*`, `.nav-item`, `.bottom-nav`, responsive rules)

**The brand (already in your repo):**
- The Storage2U design tokens + components (purple/lime, extra-round). Point Claude at your existing `DESIGN.md` + shadcn theme so the rebuild uses your real components, not the prototype's DS bundle.

> Tip: give Claude `app/data.js` and `app/OpsShared.jsx` FIRST — they define the
> data contract and the reusable panel/modal components everything else depends on.

---

## 2. The data model (point Claude here)

The prototype's `window.S2U.ops` is the shape your Supabase schema should map to:

- **orders** — `{ id, customer, uni, type: 'pickup'|'delivery', status, boxes, items, sched, monthly }`
  - `status`: `scheduled | in_storage | out_for_delivery | delivered | cancelled`
  - `placedDates[id]` → when the order was placed (move onto the order row in real schema)
- **line items / cost** — `opsHelpers.lines(order)` derives box/item rows + per-unit price; `total(order)` sums them. In production this should be **real order_items rows**, not derived.
- **customers** — `{ id, name, email, uni, phone, status: 'active'|'past', boxes, monthly, since }`
- **warehouses** — `{ id, name, city, capacity, units, boxes, serves: [campus], holdings: [...] }`
  - `holdings[]` — `{ customer, uni, boxes, items, bay, since }` (bay = barcode/location, Clutter-style)
  - "orders in a warehouse" = orders whose campus ∈ `warehouse.serves`
- **schedule** — today's stops `{ id, time, customer, type, uni, address, boxes, driver, status }`
- **drivers** (on shift) — `{ id, name, van, stops, done, status: 'on_route'|'loading'|'available' }`
- **staff** (roster to add to a shift) — `{ id, name, role, phone }`

---

## 3. Prompts for Cursor (run in order)

Five scoped prompts beat one giant one — Cursor stays accurate and you can review
each PR. Paste the **design files above into the project** first so Claude can read them.

### Prompt 0 — Orientation (run once)
```
We're building an internal Operations dashboard for Storage2U staff. I've added a
working design prototype under /prototype (ops.html + app/*.jsx + app/site.css +
app/data.js). Read app/data.js and app/OpsShared.jsx first — they define the data
model and the reusable Drawer/Modal/SearchBar/OrderStatus/OrderDetail components.

Rebuild this prototype in OUR stack: Next.js 16 App Router, React 19, our shadcn/ui
components, and the Storage2U brand from DESIGN.md (vibrant purple + lime, extra-round).
Use lucide-react for icons. Do NOT use the prototype's _ds_bundle.js or babel script
tags — port the JSX to real TSX components using our design system.

Match the prototype's layout, spacing, and interactions exactly. Confirm the plan and
the route/folder structure before writing code. Don't build the views yet.
```

### Prompt 1 — Shell, nav & staff auth
```
Build the ops dashboard shell at /app/ops (route group, staff-only).
- Gate the whole route behind Clerk: only users with an "ops"/"admin" role get in;
  everyone else is redirected. 
- Left sidebar nav (Schedule, Orders, Customers, Warehouses) matching app/Ops.jsx
  Sidebar — active state, hub badge, sign out. Collapse to the bottom-nav on mobile
  (see .bottom-nav in app/site.css).
- Port the shared primitives from app/OpsShared.jsx to TSX components:
  SearchBar, FilterTabs, OrderStatus badge, Drawer (right side panel), Modal,
  PageHead, EmptyState. Keep the same props and visuals.
Use the .dash-* CSS as a reference but implement with our tokens/Tailwind.
```

### Prompt 2 — Schedule + dispatch
```
Build the Schedule view (default ops landing) from app/Ops.jsx Content():
- Stat tiles (today's pickups, deliveries, boxes, drivers on shift) from live counts.
- Today's schedule table with All/Pickups/Deliveries filter; each row shows time,
  customer, type, campus/address, boxes, assigned driver, status.
- "Drivers on shift" cards with stop-progress bars + an "Add to shift" button that
  opens a Modal listing the staff roster (Supabase) not already on shift; adding
  assigns them a van and inserts a shift row.
- Unassigned stops show an "Assign" button → Modal of on-shift drivers → writes the
  assignment back to the order/stop. (Dispatch pattern: one-click assign.)
Persist add-to-shift and assignment to Supabase and revalidate.
```

### Prompt 3 — Orders + detail panel
```
Build the Orders view from app/OpsOrders.jsx:
- Full orders list, searchable by customer / order # / campus, with status filter
  tabs (All, Active, In storage, Delivered, Cancelled).
- Clicking a row opens the Drawer (right side panel) with OrderDetail
  (app/OpsShared.jsx): status, customer, campus, ORDER PLACED date, scheduled
  date, and an itemized line-item table (each box/item with qty × unit price and
  subtotal) plus the monthly total. Read real order_items from Supabase — do not
  hardcode the line math. Footer actions: Edit order, Message.
```

### Prompt 4 — Customers
```
Build the Customers view from app/OpsCustomers.jsx:
- Full customer list, searchable by name / email / campus, with All/Active/Past tabs.
- Clicking a customer opens the Drawer: profile (email, phone, currently stored,
  monthly, since) + a list of THAT customer's orders. Clicking one of their orders
  opens the same OrderDetail panel from Prompt 3 (reuse it).
```

### Prompt 5 — Warehouses
```
Build the Warehouses view from app/OpsWarehouse.jsx:
- Warehouse selector cards (name, city, capacity bar — amber when >78%).
- "Add warehouse" button → Modal (name, city, campuses served) that inserts a new
  facility in Supabase.
- Selected warehouse: summary stats + a Holdings/Orders toggle, both searchable.
  Holdings = items stored per customer with bay location; Orders = orders whose
  campus is served by this warehouse (clicking one opens OrderDetail).
```

---

## 4. Acceptance checklist
- [ ] `/app/ops` is staff-only (Clerk role gate) and 404/redirects for customers
- [ ] All four views match the prototype layout + are responsive (sidebar → bottom nav)
- [ ] Search + filters work against live data
- [ ] Order detail shows real line items, per-item cost, total, and placed date
- [ ] Customer panel lists that customer's orders and drills into order detail
- [ ] Warehouse add + holdings/orders tabs + search work
- [ ] Add-to-shift and assign-driver write to Supabase and update the UI
- [ ] Uses our shadcn components + Storage2U brand tokens (no prototype bundle)
