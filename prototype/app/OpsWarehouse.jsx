// Storage2U — ops Warehouses view. Exposes window.OpsWarehouse.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Badge, Avatar } = DS;
  const Icon = window.Icon;
  const O = window.S2U.ops;
  const H = window.S2U.opsHelpers;

  function OpsWarehouse() {
    const { SearchBar, PageHead, EmptyState, Drawer, Modal, ModalField, TextInput, OrderStatus, OrderDetail, useForceUpdate } = window.OpsUI;
    const force = useForceUpdate();
    const [selId, setSelId] = React.useState(O.warehouses[0].id);
    const [q, setQ] = React.useState("");
    const [tab, setTab] = React.useState("holdings"); // holdings | orders
    const [selOrder, setSelOrder] = React.useState(null);
    const [adding, setAdding] = React.useState(false);
    const [form, setForm] = React.useState({ name: "", city: "", serves: "" });

    const wh = O.warehouses.find((w) => w.id === selId) || O.warehouses[0];
    const ql = q.trim().toLowerCase();

    const holdings = wh.holdings.filter((h) => !ql || h.customer.toLowerCase().includes(ql) || h.uni.toLowerCase().includes(ql) || h.bay.toLowerCase().includes(ql));
    const orders = H.ordersForWarehouse(wh).filter((o) => !ql || o.customer.toLowerCase().includes(ql) || o.id.includes(ql) || o.uni.toLowerCase().includes(ql));
    const totalBoxes = wh.holdings.reduce((s, h) => s + h.boxes, 0);
    const totalItems = wh.holdings.reduce((s, h) => s + h.items, 0);

    function addWarehouse() {
      if (!form.name.trim()) return;
      const id = "wh" + (O.warehouses.length + 1);
      O.warehouses.push({
        id, name: form.name.trim(), city: form.city.trim() || "—",
        capacity: 0, units: 0, boxes: 0,
        serves: form.serves.split(",").map((s) => s.trim()).filter(Boolean),
        holdings: [],
      });
      setSelId(id); setAdding(false); setForm({ name: "", city: "", serves: "" }); force();
    }

    return (
      <div className="dash-content">
        <PageHead title="Warehouses" sub={`${O.warehouses.length} facilities · ${O.hub}`}>
          <Button variant="secondary" onClick={() => setAdding(true)} iconLeft={<Icon name="plus" size={17} color="var(--on-accent)" />}>Add warehouse</Button>
        </PageHead>

        {/* Warehouse selector */}
        <div className="wh-selector">
          {O.warehouses.map((w) => {
            const on = w.id === selId;
            return (
              <button key={w.id} className={"wh-pick" + (on ? " on" : "")} onClick={() => { setSelId(w.id); setQ(""); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="icon-tile" style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: on ? "var(--brand-primary)" : "var(--purple-100)" }}>
                    <Icon name="archive" size={20} color={on ? "#fff" : "var(--brand-primary)"} />
                  </span>
                  <div style={{ textAlign: "left", minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>{w.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{w.city}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                    <span>Capacity</span><span style={{ fontWeight: 700, color: on ? "var(--brand-primary)" : "var(--text-body)" }}>{w.capacity}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: w.capacity + "%", background: w.capacity > 78 ? "var(--warning-fg)" : "var(--brand-primary)", borderRadius: "var(--radius-pill)" }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected warehouse summary */}
        <div className="grid grid-4" style={{ gap: 16, margin: "8px 0 28px" }}>
          {[["Units occupied", wh.units, "archive"], ["Boxes stored", wh.boxes.toLocaleString(), "box"], ["Customers here", wh.holdings.length, "users"], ["Items", totalItems, "package"]].map(([k, v, icon]) => (
            <Card key={k} padding={20}>
              <div className="stat-tile">
                <span className="k"><Icon name={icon} size={15} color="var(--brand-primary)" /> {k}</span>
                <span className="v">{v}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs + search */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)" }}>
            {[["holdings", `Holdings · ${totalBoxes} boxes`], ["orders", `Orders · ${H.ordersForWarehouse(wh).length}`]].map(([id, label]) => {
              const on = tab === id;
              return (
                <button key={id} onClick={() => { setTab(id); setQ(""); }} style={{
                  padding: "7px 16px", border: "none", cursor: "pointer", borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
                  background: on ? "var(--surface-card)" : "transparent", color: on ? "var(--brand-primary)" : "var(--text-muted)",
                  boxShadow: on ? "var(--shadow-sm)" : "none",
                }}>{label}</button>
              );
            })}
          </div>
          <SearchBar value={q} onChange={setQ} placeholder={tab === "holdings" ? "Search customer, campus, or bay…" : "Search order, customer, or campus…"} />
        </div>

        {tab === "holdings" ? (
          <Card padding={0} style={{ overflow: "hidden" }}>
            <div className="wh-head">
              <span>Customer</span><span>Campus</span><span>Bay location</span><span>Boxes</span><span>Items</span><span style={{ textAlign: "right" }}>Stored since</span>
            </div>
            {holdings.length === 0 && <EmptyState label="No holdings match your search." />}
            {holdings.map((h, i) => (
              <div key={i} className="wh-row">
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <Avatar name={h.customer} size={36} tone="purple" />
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{h.customer}</span>
                </div>
                <span className="wh-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{h.uni}</span>
                <span className="wh-cell"><Badge tone="neutral" iconLeft={<Icon name="map-pin" size={12} color="var(--text-muted)" />}>{h.bay}</Badge></span>
                <span className="wh-cell" style={{ fontSize: 13.5, fontWeight: 600 }}>{h.boxes}</span>
                <span className="wh-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{h.items}</span>
                <span className="wh-cell" style={{ fontSize: 13.5, color: "var(--text-body)", textAlign: "right" }}>{h.since}</span>
              </div>
            ))}
          </Card>
        ) : (
          <Card padding={0} style={{ overflow: "hidden" }}>
            <div className="ord-head">
              <span>Order</span><span>Customer</span><span>Type</span><span>Boxes</span><span>Scheduled</span><span>Monthly</span><span style={{ textAlign: "right" }}>Status</span>
            </div>
            {orders.length === 0 && <EmptyState label="No orders at this warehouse match your search." />}
            {orders.map((o) => (
              <div key={o.id} className="ord-row ord-click" onClick={() => setSelOrder(o)}>
                <span className="ord-id">#{o.id}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{o.customer}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{o.uni}</div>
                </div>
                <span className="ord-cell">{o.type === "pickup" ? <Badge tone="purple">Pickup</Badge> : <Badge tone="lime" solid>Delivery</Badge>}</span>
                <span className="ord-cell" style={{ fontSize: 13.5, fontWeight: 600 }}>{o.boxes} boxes{o.items ? ` · ${o.items} items` : ""}</span>
                <span className="ord-cell" style={{ fontSize: 13.5, color: "var(--text-body)" }}>{o.sched}</span>
                <span className="ord-cell" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-strong)" }}>{o.monthly ? `$${o.monthly}/mo` : "—"}</span>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}><OrderStatus status={o.status} /><Icon name="chevron-right" size={16} color="var(--text-muted)" /></div>
              </div>
            ))}
          </Card>
        )}

        {/* Order detail */}
        <Drawer open={!!selOrder} onClose={() => setSelOrder(null)} title={selOrder ? `Order #${selOrder.id}` : ""} subtitle={selOrder ? `${selOrder.customer} · ${selOrder.uni}` : ""}>
          {selOrder && <OrderDetail order={selOrder} />}
        </Drawer>

        {/* Add warehouse */}
        <Modal open={adding} onClose={() => setAdding(false)} title="Add warehouse location" subtitle="Create a new storage facility and start assigning campuses to it."
          footer={<div style={{ display: "flex", gap: 10 }}><Button variant="ghost" fullWidth onClick={() => setAdding(false)}>Cancel</Button><Button variant="primary" fullWidth onClick={addWarehouse} iconLeft={<Icon name="plus" size={16} />}>Add warehouse</Button></div>}>
          <ModalField label="Facility name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Calgary Facility" /></ModalField>
          <ModalField label="City"><TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Calgary, AB" /></ModalField>
          <ModalField label="Campuses served (comma-separated)"><TextInput value={form.serves} onChange={(e) => setForm({ ...form, serves: e.target.value })} placeholder="e.g. U of A, Calgary" /></ModalField>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
            <Icon name="archive" size={15} color="var(--text-muted)" />
            <span style={{ fontSize: 12.5 }}>New facilities start empty — orders for the campuses you assign will appear here.</span>
          </div>
        </Modal>
      </div>
    );
  }

  window.OpsWarehouse = OpsWarehouse;
})();
