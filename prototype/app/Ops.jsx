// Storage2U — internal operations dashboard (staff). Exposes window.OpsDashboard.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Badge, Logo, Avatar } = DS;
  const Icon = window.Icon;
  const O = window.S2U.ops;

  const NAV = [
    { id: "schedule", label: "Schedule", icon: "calendar-days" },
    { id: "orders", label: "Orders", icon: "inbox" },
    { id: "customers", label: "Customers", icon: "users" },
    { id: "warehouses", label: "Warehouses", icon: "archive" },
  ];

  function typeBadge(type) {
    return type === "pickup"
      ? <Badge tone="purple">Pickup</Badge>
      : <Badge tone="lime" solid>Delivery</Badge>;
  }
  function statusBadge(s) {
    if (s === "done") return <Badge tone="success" iconLeft={<Icon name="circle-check" size={12} color="var(--success-fg)" />}>Completed</Badge>;
    if (s === "out") return <Badge tone="purple" solid>Out for delivery</Badge>;
    return <Badge tone="neutral">Scheduled</Badge>;
  }
  function driverStatus(s) {
    if (s === "on_route") return <Badge tone="purple" solid>On route</Badge>;
    if (s === "loading") return <Badge tone="neutral">Loading</Badge>;
    return <Badge tone="success">Available</Badge>;
  }

  function Sidebar({ active, setActive }) {
    return (
      <aside className="dash-side">
        <div className="brand"><a href="index.html" style={{ textDecoration: "none" }}><Logo size={28} /></a></div>
        <div style={{ padding: "0 10px 10px" }}><Badge tone="neutral" iconLeft={<Icon name="map-pin" size={12} color="var(--text-muted)" />}>{O.hub}</Badge></div>
        {NAV.map((n) => (
          <button key={n.id} className={"nav-item" + (active === n.id ? " on" : "")} onClick={() => setActive(n.id)}>
            <Icon name={n.icon} size={19} color={active === n.id ? "var(--brand-primary)" : "var(--text-muted)"} />
            {n.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="nav-item" onClick={() => (window.location.href = "index.html")}>
          <Icon name="log-out" size={19} color="var(--text-muted)" /> Sign out
        </button>
      </aside>
    );
  }

  function StatTile({ s }) {
    return (
      <Card padding={22}>
        <div className="stat-tile">
          <span className="k"><Icon name={s.icon} size={15} color="var(--brand-primary)" /> {s.k}</span>
          <span className="v">{s.v}</span>
          <span className="s">{s.s}</span>
        </div>
      </Card>
    );
  }

  function Content({ filter, setFilter }) {
    const { PageHead, Modal, useForceUpdate } = window.OpsUI;
    const force = useForceUpdate();
    const rows = O.schedule.filter((o) => filter === "all" ? true : o.type === filter);

    const [assignFor, setAssignFor] = React.useState(null); // schedule row being assigned
    const [addShift, setAddShift] = React.useState(false);

    const VANS = ["Van 01", "Van 02", "Van 03", "Van 04", "Van 05", "Van 07"];

    function assign(driver) {
      if (assignFor) { assignFor.driver = driver; setAssignFor(null); force(); }
    }
    function addToShift(staff) {
      const usedVans = O.drivers.map((d) => d.van);
      const van = VANS.find((v) => !usedVans.includes(v)) || ("Van " + (O.drivers.length + 1));
      O.drivers.push({ id: staff.id, name: staff.name, van, stops: 0, done: 0, status: "available" });
      force();
    }

    return (
      <div className="dash-content">
        <PageHead title="Operations" sub={`${O.today} · ${O.hub}`}>
          <Button variant="secondary" iconLeft={<Icon name="plus" size={17} color="var(--on-accent)" />}>New order</Button>
        </PageHead>

        <div className="grid grid-4" style={{ gap: 16, marginBottom: 40 }}>
          {O.stats.map((s) => <StatTile key={s.k} s={s} />)}
        </div>

        {/* Today's schedule */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <h2 className="section-label" style={{ margin: 0 }}>Today's schedule</h2>
            <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)" }}>
              {[["all", "All"], ["pickup", "Pickups"], ["delivery", "Deliveries"]].map(([id, label]) => {
                const on = filter === id;
                return (
                  <button key={id} onClick={() => setFilter(id)} style={{
                    padding: "7px 16px", border: "none", cursor: "pointer", borderRadius: "var(--radius-pill)",
                    fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700,
                    background: on ? "var(--surface-card)" : "transparent",
                    color: on ? "var(--brand-primary)" : "var(--text-muted)",
                    boxShadow: on ? "var(--shadow-sm)" : "none",
                  }}>{label}</button>
                );
              })}
            </div>
          </div>
          <Card padding={0} style={{ overflow: "hidden" }}>
            <div className="ops-head">
              <span>Time</span><span>Customer</span><span>Type</span><span>Campus / address</span><span>Boxes</span><span>Driver</span><span style={{ textAlign: "right" }}>Status</span>
            </div>
            {rows.map((o) => (
              <div key={o.id} className="ops-row">
                <span className="ops-time">{o.time}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{o.customer}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>#{o.id}</div>
                </div>
                <span className="ops-cell">{typeBadge(o.type)}</span>
                <div className="ops-cell ops-addr">
                  <span style={{ fontWeight: 700, color: "var(--text-strong)" }}>{o.uni}</span>
                  <span style={{ color: "var(--text-muted)" }}> · {o.address}</span>
                </div>
                <span className="ops-cell" style={{ fontSize: 13.5, fontWeight: 600 }}>{o.boxes}</span>
                <span className="ops-cell">
                  {o.driver === "Unassigned"
                    ? <button onClick={() => setAssignFor(o)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "none", cursor: "pointer", borderRadius: "var(--radius-pill)", background: "var(--purple-50)", color: "var(--brand-primary)", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 700 }}><Icon name="plus" size={13} color="var(--brand-primary)" /> Assign</button>
                    : <Badge tone="neutral" iconLeft={<Icon name="truck" size={12} color="var(--text-muted)" />}>{o.driver}</Badge>}
                </span>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>{statusBadge(o.status)}</div>
              </div>
            ))}
          </Card>
        </section>

        {/* Drivers + upcoming */}
        <div className="ops-split">
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <h2 className="section-label" style={{ margin: 0 }}>Drivers on shift ({O.drivers.length})</h2>
              <Button variant="outline" size="sm" onClick={() => setAddShift(true)} iconLeft={<Icon name="plus" size={15} color="var(--brand-primary)" />}>Add to shift</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {O.drivers.map((d) => {
                const pct = d.stops ? Math.round((d.done / d.stops) * 100) : 0;
                return (
                  <Card key={d.id} padding={18} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Avatar name={d.name === "—" ? "Van" : d.name} size={42} tone={d.status === "available" ? "soft" : "purple"} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{d.van}</span>
                        {driverStatus(d.status)}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                        {d.name === "—" ? "Unassigned" : d.name}{d.stops ? ` · ${d.done}/${d.stops} stops` : ""}
                      </div>
                      {d.stops > 0 && (
                        <div style={{ height: 6, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)", overflow: "hidden", marginTop: 8 }}>
                          <div style={{ height: "100%", width: pct + "%", background: "var(--brand-primary)", borderRadius: "var(--radius-pill)" }} />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="section-label">Next few days</h2>
            <Card padding={0} style={{ overflow: "hidden" }}>
              {O.upcoming.map((u, i) => (
                <div key={u.date} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderTop: i === 0 ? "none" : "1px solid var(--border-soft)" }}>
                  <span className="icon-tile soft" style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)" }}><Icon name="calendar-days" size={18} color="var(--brand-primary)" /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-strong)" }}>{u.date}</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{u.pickups} pickups · {u.deliveries} deliveries</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--brand-primary)" }}>{u.boxes} boxes</span>
                </div>
              ))}
            </Card>
            <Card tone="primary" padding={20} style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 14.5, fontWeight: 800 }}>Move-out week is busy</span>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>92 boxes booked tomorrow. Consider scheduling a 4th van.</span>
            </Card>
          </section>
        </div>

        {/* Assign driver to a delivery/pickup */}
        <Modal open={!!assignFor} onClose={() => setAssignFor(null)} title="Assign driver"
          subtitle={assignFor ? `#${assignFor.id} · ${assignFor.customer} · ${assignFor.time}` : ""}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {O.drivers.filter((d) => d.van !== "—").map((d) => (
              <button key={d.id} onClick={() => assign(d.van)} style={{ textAlign: "left", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", padding: 14, borderRadius: "var(--radius-md)", background: "var(--surface-card)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={d.name === "—" ? "Van" : d.name} size={40} tone={d.status === "available" ? "soft" : "purple"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-strong)" }}>{d.van}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{d.name === "—" ? "Unassigned" : d.name} · {d.stops ? `${d.stops - d.done} stops left` : "available"}</div>
                </div>
                {driverStatus(d.status)}
              </button>
            ))}
          </div>
        </Modal>

        {/* Add a staff member to today's shift */}
        <Modal open={addShift} onClose={() => setAddShift(false)} title="Add to today's shift"
          subtitle="Put a driver or mover on shift and give them a van.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {O.staff.filter((s) => !O.drivers.some((d) => d.id === s.id)).map((s) => (
              <div key={s.id} style={{ padding: 14, borderRadius: "var(--radius-md)", background: "var(--surface-card)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={s.name} size={40} tone="soft" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-strong)" }}>{s.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{s.role} · {s.phone}</div>
                </div>
                <Button variant="primary" size="sm" onClick={() => addToShift(s)} iconLeft={<Icon name="plus" size={14} />}>Add</Button>
              </div>
            ))}
            {O.staff.filter((s) => !O.drivers.some((d) => d.id === s.id)).length === 0 && (
              <div style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "8px 0", textAlign: "center" }}>Everyone's already on shift.</div>
            )}
          </div>
        </Modal>
      </div>
    );
  }

  function OpsDashboard() {
    const [active, setActive] = React.useState("schedule");
    const [filter, setFilter] = React.useState("all");
    const view = {
      schedule: <Content filter={filter} setFilter={setFilter} />,
      orders: <window.OpsOrders />,
      customers: <window.OpsCustomers />,
      warehouses: <window.OpsWarehouse />,
    }[active];
    return (
      <div className="dash-shell">
        <Sidebar active={active} setActive={setActive} />
        <div className="dash-main">
          <header className="dash-top">
            <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
              <a href="index.html" style={{ textDecoration: "none" }}><Logo size={26} /></a>
              <Avatar name="Storage2U Ops" size={36} />
            </div>
          </header>
          {view}
        </div>

        <nav className="bottom-nav">
          {NAV.slice(0, 4).map((n) => (
            <a key={n.id} className={active === n.id ? "on" : ""} onClick={() => setActive(n.id)} style={{ cursor: "pointer" }}>
              <Icon name={n.icon} size={20} color={active === n.id ? "var(--brand-primary)" : "var(--text-muted)"} />
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    );
  }

  window.OpsDashboard = OpsDashboard;
})();
