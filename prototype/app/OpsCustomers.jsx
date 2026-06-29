// Storage2U — ops Customers view. Exposes window.OpsCustomers.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Badge, Avatar } = DS;
  const Icon = window.Icon;
  const O = window.S2U.ops;

  function OpsCustomers() {
    const { SearchBar, FilterTabs, PageHead, EmptyState, Drawer, OrderStatus, OrderDetail } = window.OpsUI;
    const H = window.S2U.opsHelpers;
    const [q, setQ] = React.useState("");
    const [filter, setFilter] = React.useState("all");
    const [sel, setSel] = React.useState(null);   // selected customer
    const [selOrder, setSelOrder] = React.useState(null); // drill into one order

    const rows = O.customers.filter((c) => {
      const matchF = filter === "all" ? true : c.status === filter;
      const ql = q.trim().toLowerCase();
      const matchQ = !ql || c.name.toLowerCase().includes(ql) || c.email.toLowerCase().includes(ql) || c.uni.toLowerCase().includes(ql);
      return matchF && matchQ;
    });
    const active = O.customers.filter((c) => c.status === "active").length;

    return (
      <div className="dash-content">
        <PageHead title="Customers" sub={`${O.customers.length} customers · ${active} active`}>
          <Button variant="secondary" iconLeft={<Icon name="plus" size={17} color="var(--on-accent)" />}>Add customer</Button>
        </PageHead>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          <SearchBar value={q} onChange={setQ} placeholder="Search by name, email, or campus…" />
          <FilterTabs value={filter} onChange={setFilter} options={[["all", "All"], ["active", "Active"], ["past", "Past"]]} />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
          <div className="cust-head">
            <span>Customer</span><span>Campus</span><span>Phone</span><span>Stored</span><span>Monthly</span><span style={{ textAlign: "right" }}>Status</span>
          </div>
          {rows.length === 0 && <EmptyState label="No customers match your search." />}
          {rows.map((c) => (
            <div key={c.id} className="cust-row ord-click" onClick={() => setSel(c)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <Avatar name={c.name} size={38} tone={c.status === "active" ? "purple" : "soft"} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.email}</div>
                </div>
              </div>
              <span className="cust-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{c.uni}</span>
              <span className="cust-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{c.phone}</span>
              <span className="cust-cell" style={{ fontSize: 13.5, fontWeight: 600 }}>{c.boxes ? `${c.boxes} boxes` : "—"}</span>
              <span className="cust-cell" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{c.monthly ? `$${c.monthly}/mo` : "—"}</span>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
                {c.status === "active"
                  ? <Badge tone="success">Active</Badge>
                  : <Badge tone="neutral">Past</Badge>}
                <Icon name="chevron-right" size={16} color="var(--text-muted)" />
              </div>
            </div>
          ))}
        </Card>

        {/* Customer detail: profile + their orders */}
        <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? sel.name : ""} subtitle={sel ? sel.uni : ""}
          footer={<div style={{ display: "flex", gap: 10 }}><Button variant="outline" fullWidth>Edit</Button><Button variant="primary" fullWidth iconLeft={<Icon name="inbox" size={16} />}>Message</Button></div>}>
          {sel && (() => {
            const orders = H.ordersForCustomer(sel.name);
            return (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <Avatar name={sel.name} size={52} tone={sel.status === "active" ? "purple" : "soft"} />
                  <div>
                    {sel.status === "active" ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">Past customer</Badge>}
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Customer since {sel.since}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
                  {[["Email", sel.email], ["Phone", sel.phone], ["Currently stored", sel.boxes ? `${sel.boxes} boxes` : "None"], ["Monthly", sel.monthly ? `$${sel.monthly}/mo` : "—"]].map(([k, v]) => (
                    <div key={k} style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)" }}>{k}</span>
                      <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "var(--text-strong)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <span style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Orders ({orders.length})</span>
                {orders.length === 0 && <div style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "8px 0" }}>No orders on record.</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {orders.map((o) => (
                    <button key={o.id} onClick={() => setSelOrder(o)} style={{ textAlign: "left", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", padding: 14, borderRadius: "var(--radius-md)", background: "var(--surface-card)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="icon-tile soft" style={{ width: 38, height: 38, borderRadius: "var(--radius-sm)" }}><Icon name={o.type === "pickup" ? "package" : "truck"} size={18} color="var(--brand-primary)" /></span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>#{o.id} · {o.type === "pickup" ? "Pickup" : "Delivery"}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{o.boxes} boxes{o.items ? ` · ${o.items} items` : ""} · {o.sched}</div>
                      </div>
                      <OrderStatus status={o.status} />
                      <Icon name="chevron-right" size={15} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </Drawer>

        {/* Drill into a single order from the customer panel */}
        <Drawer open={!!selOrder} onClose={() => setSelOrder(null)} title={selOrder ? `Order #${selOrder.id}` : ""} subtitle={selOrder ? `${selOrder.customer} · ${selOrder.uni}` : ""}>
          {selOrder && <OrderDetail order={selOrder} />}
        </Drawer>
      </div>
    );
  }

  window.OpsCustomers = OpsCustomers;
})();
