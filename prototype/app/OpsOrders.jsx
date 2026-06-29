// Storage2U — ops Orders view. Exposes window.OpsOrders.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Badge } = DS;
  const Icon = window.Icon;
  const O = window.S2U.ops;

  function typeBadge(type) {
    return type === "pickup"
      ? <Badge tone="purple">Pickup</Badge>
      : <Badge tone="lime" solid>Delivery</Badge>;
  }

  function OpsOrders() {
    const { SearchBar, FilterTabs, OrderStatus, PageHead, EmptyState, Drawer, OrderDetail } = window.OpsUI;
    const [q, setQ] = React.useState("");
    const [filter, setFilter] = React.useState("all");
    const [sel, setSel] = React.useState(null);

    const rows = O.orders.filter((o) => {
      const matchF = filter === "all" ? true
        : filter === "active" ? (o.status === "in_storage" || o.status === "scheduled" || o.status === "out_for_delivery")
        : o.status === filter;
      const ql = q.trim().toLowerCase();
      const matchQ = !ql || o.customer.toLowerCase().includes(ql) || o.id.includes(ql) || o.uni.toLowerCase().includes(ql);
      return matchF && matchQ;
    });

    return (
      <div className="dash-content">
        <PageHead title="Orders" sub={`${O.orders.length} total orders · ${O.hub}`}>
          <Button variant="secondary" iconLeft={<Icon name="plus" size={17} color="var(--on-accent)" />}>New order</Button>
        </PageHead>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          <SearchBar value={q} onChange={setQ} placeholder="Search by customer, order #, or campus…" />
          <FilterTabs value={filter} onChange={setFilter} options={[["all", "All"], ["active", "Active"], ["in_storage", "In storage"], ["delivered", "Delivered"], ["cancelled", "Cancelled"]]} />
        </div>

        <Card padding={0} style={{ overflow: "hidden" }}>
          <div className="ord-head">
            <span>Order</span><span>Customer</span><span>Type</span><span>Boxes</span><span>Scheduled</span><span>Monthly</span><span style={{ textAlign: "right" }}>Status</span>
          </div>
          {rows.length === 0 && <EmptyState label="No orders match your search." />}
          {rows.map((o) => (
            <div key={o.id} className="ord-row ord-click" onClick={() => setSel(o)}>
              <span className="ord-id">#{o.id}</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{o.customer}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{o.uni}</div>
              </div>
              <span className="ord-cell">{typeBadge(o.type)}</span>
              <span className="ord-cell" style={{ fontSize: 13.5, fontWeight: 600 }}>{o.boxes} boxes{o.items ? ` · ${o.items} items` : ""}</span>
              <span className="ord-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{o.sched}</span>
              <span className="ord-cell" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{o.monthly ? `$${o.monthly}/mo` : "—"}</span>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}><OrderStatus status={o.status} /><Icon name="chevron-right" size={16} color="var(--text-muted)" /></div>
            </div>
          ))}
        </Card>

        <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? `Order #${sel.id}` : ""} subtitle={sel ? `${sel.customer} · ${sel.uni}` : ""}
          footer={<div style={{ display: "flex", gap: 10 }}><Button variant="outline" fullWidth>Edit order</Button><Button variant="primary" fullWidth iconLeft={<Icon name="inbox" size={16} />}>Message</Button></div>}>
          {sel && <OrderDetail order={sel} />}
        </Drawer>
      </div>
    );
  }

  window.OpsOrders = OpsOrders;
})();
