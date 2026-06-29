// Storage2U — customer dashboard (My Storage). Exposes window.S2UDashboard.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Badge, StorageStatusBadge, Logo, Avatar } = DS;
  const Icon = window.Icon;

  const USER = { name: "Jordan Tremblay", email: "jordan.t@mail.utoronto.ca", first: "Jordan" };

  const ACTIVE = [
    { id: "a1", title: "Move-out boxes", boxes: "6 boxes", since: "Sep 19, 2026", addr: "89 Chestnut St, Room 412", cost: 54, status: "in_storage" },
    { id: "a2", title: "Textbooks & winter gear", boxes: "3 boxes", since: "Sep 19, 2026", addr: "89 Chestnut St, Room 412", cost: 27, status: "in_storage" },
    { id: "a3", title: "Summer overflow", boxes: "2 boxes", since: "May 4, 2026", addr: "1 King's College Cir", cost: 18, status: "out_for_delivery" },
  ];

  const PAST = [
    { id: "p1", title: "Summer 2025 storage", addr: "89 Chestnut St", pickup: "May 10, 2025", delivered: "Aug 28, 2025", boxes: "8 boxes", status: "delivered", total: "$72/mo" },
    { id: "p2", title: "Reading week", addr: "Chestnut Residence", pickup: "Feb 16, 2025", delivered: "Feb 24, 2025", boxes: "3 boxes", status: "delivered", total: "$27/mo" },
    { id: "p3", title: "Winter 2024", addr: "705 Spadina Ave", pickup: "Dec 15, 2024", delivered: "—", boxes: "5 boxes", status: "cancelled", total: "$0" },
  ];

  const NAV = [
    { id: "storage", label: "My Storage", icon: "package" },
    { id: "deliveries", label: "Deliveries", icon: "truck" },
    { id: "billing", label: "Billing", icon: "dollar-sign" },
    { id: "account", label: "Account", icon: "users" },
  ];

  function Sidebar({ active, setActive }) {
    return (
      <aside className="dash-side">
        <div className="brand"><a href="index.html" style={{ textDecoration: "none" }}><Logo size={28} /></a></div>
        {NAV.map((n) => (
          <button key={n.id} className={"nav-item" + (active === n.id ? " on" : "")} onClick={() => setActive(n.id)}>
            <Icon name={n.icon} size={19} color={active === n.id ? "var(--brand-primary)" : "var(--text-muted)"} />
            {n.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <Card tone="primary" padding={18} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Need to store more?</span>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.45 }}>Add boxes any time — we'll pick them up.</span>
          <Button variant="secondary" size="sm" fullWidth onClick={() => (window.location.href = "/book")}>Book a pickup</Button>
        </Card>
        <button className="nav-item" style={{ marginTop: 4 }} onClick={() => (window.location.href = "index.html")}>
          <Icon name="log-out" size={19} color="var(--text-muted)" /> Sign out
        </button>
      </aside>
    );
  }

  function StatTile({ icon, k, v, s }) {
    return (
      <Card padding={22}>
        <div className="stat-tile">
          <span className="k"><Icon name={icon} size={15} color="var(--brand-primary)" /> {k}</span>
          <span className="v">{v}</span>
          <span className="s">{s}</span>
        </div>
      </Card>
    );
  }

  function ActiveCard({ b, requested, onRequest }) {
    const status = requested ? "out_for_delivery" : b.status;
    const isOut = status === "out_for_delivery";
    return (
      <Card padding={0} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 22px 14px" }}>
          <div style={{ display: "flex", marginBottom: 12 }}><StorageStatusBadge status={status} /></div>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: "var(--text-strong)" }}>{b.title}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{b.boxes} · ${b.cost}/mo</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 22px 18px" }}>
          <Row icon="calendar-days" label="Stored since" value={b.since} />
          <Row icon="map-pin" label="Pickup address" value={b.addr} />
        </div>
        <div style={{ padding: 16, borderTop: "1px solid var(--border-soft)", background: "var(--surface-sunken)" }}>
          {isOut ? (
            <Button variant="outline" fullWidth iconLeft={<Icon name="truck" size={16} color="var(--brand-primary)" />}>Track delivery</Button>
          ) : (
            <Button variant="primary" fullWidth onClick={() => onRequest(b.id)} iconLeft={<Icon name="truck" size={16} color="#fff" />}>Request delivery</Button>
          )}
        </div>
      </Card>
    );
  }

  function Row({ icon, label, value }) {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Icon name={icon} size={16} color="var(--text-muted)" style={{ marginTop: 2 }} />
        <div>
          <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>{label}</span>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--text-strong)" }}>{value}</span>
        </div>
      </div>
    );
  }

  function Content() {
    const [requested, setRequested] = React.useState({});
    const onRequest = (id) => setRequested((r) => ({ ...r, [id]: true }));
    return (
      <div className="dash-content">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>Hi, {USER.first}</h1>
            <p style={{ margin: "6px 0 0", fontSize: 15, color: "var(--text-muted)" }}>Here's everything you've got stored with us.</p>
          </div>
          <span className="desktop-only" style={{ display: "inline-flex" }}>
            <Button variant="secondary" onClick={() => (window.location.href = "/book")} iconLeft={<Icon name="plus" size={17} color="var(--on-accent)" />}>Book a pickup</Button>
          </span>
        </div>

        <div className="grid grid-3" style={{ gap: 16, marginBottom: 40 }}>
          <StatTile icon="box" k="Boxes stored" v="11" s="across 3 pickups" />
          <StatTile icon="dollar-sign" k="Monthly total" v="$99" s="billed on the 1st" />
          <StatTile icon="truck" k="Next delivery" v="Jan 4" s="2 boxes · out for delivery" />
        </div>

        <section style={{ marginBottom: 44 }}>
          <h2 className="section-label">Active storage</h2>
          <div className="grid grid-3" style={{ gap: 18 }}>
            {ACTIVE.map((b) => <ActiveCard key={b.id} b={b} requested={requested[b.id]} onRequest={onRequest} />)}
          </div>
        </section>

        <section>
          <h2 className="section-label">Past bookings</h2>
          <Card padding={0} style={{ overflow: "hidden" }}>
            <div className="hist-head">
              <span>Booking</span><span>Pickup</span><span>Delivered</span><span>Boxes</span><span style={{ textAlign: "right" }}>Status</span>
            </div>
            {PAST.map((p) => (
              <div key={p.id} className="hist-row">
                <div>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{p.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>{p.addr}</p>
                </div>
                <span className="hist-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{p.pickup}</span>
                <span className="hist-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{p.delivered}</span>
                <span className="hist-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{p.boxes}</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
                  <StorageStatusBadge status={p.status} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-muted)", minWidth: 48, textAlign: "right" }}>{p.total}</span>
                </div>
              </div>
            ))}
          </Card>
        </section>
      </div>
    );
  }

  function S2UDashboard() {
    const [active, setActive] = React.useState("storage");
    return (
      <div className="dash-shell">
        <Sidebar active={active} setActive={setActive} />
        <div className="dash-main">
          <header className="dash-top">
            <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
              <a href="index.html" style={{ textDecoration: "none" }}><Logo size={26} /></a>
              <Avatar name={USER.name} size={36} />
            </div>
          </header>
          <Content />
        </div>

        <nav className="bottom-nav">
          {NAV.map((n) => (
            <a key={n.id} className={active === n.id ? "on" : ""} onClick={() => setActive(n.id)} style={{ cursor: "pointer" }}>
              <Icon name={n.icon} size={20} color={active === n.id ? "var(--brand-primary)" : "var(--text-muted)"} />
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    );
  }

  window.S2UDashboard = S2UDashboard;
})();
