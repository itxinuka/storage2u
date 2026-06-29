// Storage2U — shared ops helpers (search bar, status badges). Exposes window.OpsUI.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Badge } = DS;
  const Icon = window.Icon;

  function SearchBar({ value, onChange, placeholder }) {
    return (
      <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 380 }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <Icon name="search" size={18} color="var(--text-muted)" />
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", height: 46, padding: "0 16px 0 44px", borderRadius: "var(--radius-pill)",
            border: "none", boxShadow: "inset 0 0 0 2px var(--border-soft)", background: "var(--surface-card)",
            fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 500, color: "var(--text-strong)", outline: "none",
          }}
          onFocus={(e) => (e.target.style.boxShadow = "inset 0 0 0 2px var(--brand-primary)")}
          onBlur={(e) => (e.target.style.boxShadow = "inset 0 0 0 2px var(--border-soft)")}
        />
      </div>
    );
  }

  function FilterTabs({ value, onChange, options }) {
    return (
      <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)", flexWrap: "wrap" }}>
        {options.map(([id, label]) => {
          const on = value === id;
          return (
            <button key={id} onClick={() => onChange(id)} style={{
              padding: "7px 16px", border: "none", cursor: "pointer", borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
              background: on ? "var(--surface-card)" : "transparent",
              color: on ? "var(--brand-primary)" : "var(--text-muted)",
              boxShadow: on ? "var(--shadow-sm)" : "none",
            }}>{label}</button>
          );
        })}
      </div>
    );
  }

  const STATUS = {
    scheduled: ["neutral", false, "Scheduled"],
    in_storage: ["purple", false, "In storage"],
    out_for_delivery: ["purple", true, "Out for delivery"],
    delivered: ["success", false, "Delivered"],
    cancelled: ["neutral", false, "Cancelled"],
  };
  function OrderStatus({ status }) {
    const [tone, solid, label] = STATUS[status] || STATUS.scheduled;
    return <Badge tone={tone} solid={solid}>{label}</Badge>;
  }

  function PageHead({ title, sub, children }) {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>{title}</h1>
          <p style={{ margin: "6px 0 0", fontSize: 15, color: "var(--text-muted)" }}>{sub}</p>
        </div>
        {children}
      </div>
    );
  }

  function EmptyState({ label }) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)" }}>
        <Icon name="search" size={28} color="var(--outline-variant)" style={{ margin: "0 auto 10px" }} />
        <div style={{ fontSize: 14.5, fontWeight: 600 }}>{label}</div>
      </div>
    );
  }

  // Slide-in side panel (right). Used for order detail, customer detail.
  function Drawer({ open, onClose, title, subtitle, footer, children, width = 480 }) {
    React.useEffect(() => {
      function onKey(e) { if (e.key === "Escape") onClose(); }
      if (open) document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    return (
      <>
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, zIndex: 200, background: "rgba(24,20,69,0.42)",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 220ms ease",
        }} />
        <aside style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201, width: "min(" + width + "px, 94vw)",
          background: "var(--bg-app)", boxShadow: "-18px 0 50px rgba(24,20,69,0.22)",
          transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 280ms cubic-bezier(0.34,1.2,0.64,1)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "22px 24px", borderBottom: "1px solid var(--border-soft)", background: "var(--surface-card)" }}>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>{title}</h2>
              {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--text-muted)" }}>{subtitle}</p>}
            </div>
            <button onClick={onClose} aria-label="Close" style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "var(--radius-pill)", border: "none", background: "var(--surface-sunken)", cursor: "pointer", color: "var(--text-body)" }}>
              <Icon name="x" size={20} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>{open && children}</div>
          {footer && <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-soft)", background: "var(--surface-card)" }}>{footer}</div>}
        </aside>
      </>
    );
  }

  // Centered modal dialog. Used for add-warehouse, add-driver, assign.
  function Modal({ open, onClose, title, subtitle, footer, children, width = 460 }) {
    React.useEffect(() => {
      function onKey(e) { if (e.key === "Escape") onClose(); }
      if (open) document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open) return null;
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 210, background: "rgba(24,20,69,0.42)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div onClick={(e) => e.stopPropagation()} style={{
          width: "min(" + width + "px, 96vw)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
          background: "var(--surface-card)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "22px 24px 14px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em", color: "var(--text-strong)" }}>{title}</h2>
              {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--text-muted)" }}>{subtitle}</p>}
            </div>
            <button onClick={onClose} aria-label="Close" style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-pill)", border: "none", background: "var(--surface-sunken)", cursor: "pointer", color: "var(--text-body)" }}>
              <Icon name="x" size={18} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px 20px" }}>{children}</div>
          {footer && <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border-soft)", background: "var(--surface-sunken)" }}>{footer}</div>}
        </div>
      </div>
    );
  }

  // Labelled field wrapper + plain input for modal forms.
  function ModalField({ label, children }) {
    return (
      <div style={{ marginBottom: 16 }}>
        <span style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>{label}</span>
        {children}
      </div>
    );
  }
  function TextInput(props) {
    return (
      <input {...props} style={{
        width: "100%", height: 48, padding: "0 16px", borderRadius: "var(--radius-md)", border: "none",
        boxShadow: "inset 0 0 0 2px var(--border-soft)", background: "var(--surface-card)",
        fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 500, color: "var(--text-strong)", outline: "none",
        ...(props.style || {}),
      }}
        onFocus={(e) => (e.target.style.boxShadow = "inset 0 0 0 2px var(--brand-primary)")}
        onBlur={(e) => (e.target.style.boxShadow = "inset 0 0 0 2px var(--border-soft)")}
      />
    );
  }

  // Shared order-detail body (itemized lines + cost). Used by Orders + Customers.
  function OrderDetail({ order }) {
    const H = window.S2U.opsHelpers;
    const lines = H.lines(order);
    const total = H.total(order);
    const typeLabel = order.type === "pickup" ? "Pickup" : "Delivery";
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          {order.type === "pickup" ? <Badge tone="purple">Pickup</Badge> : <Badge tone="lime" solid>Delivery</Badge>}
          <OrderStatus status={order.status} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
          {[["Customer", order.customer], ["Campus", order.uni], ["Order placed", H.placed(order)], ["Scheduled " + typeLabel.toLowerCase(), order.sched]].map(([k, v]) => (
            <div key={k}>
              <span style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)" }}>{k}</span>
              <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: "var(--text-strong)", marginTop: 2 }}>{v}</span>
            </div>
          ))}
        </div>

        <span style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Items &amp; monthly cost</span>
        <div style={{ borderRadius: "var(--radius-lg)", background: "var(--surface-card)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderTop: i ? "1px solid var(--border-soft)" : "none" }}>
              <span className="icon-tile soft" style={{ width: 38, height: 38, borderRadius: "var(--radius-sm)" }}><Icon name={l.icon} size={18} color="var(--brand-primary)" /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-strong)" }}>{l.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{l.qty} × ${l.unit}/mo</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-strong)" }}>${l.subtotal}/mo</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--surface-sunken)" }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-muted)" }}>Monthly total</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-strong)" }}>${total}<span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-muted)" }}>/mo</span></span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, color: "var(--text-muted)" }}>
          <Icon name="truck" size={15} color="var(--text-muted)" />
          <span style={{ fontSize: 12.5 }}>Assigned to {order.driver} · free pickup &amp; delivery on campus</span>
        </div>
      </div>
    );
  }

  // Force-update hook for mutating the shared ops store in place.
  function useForceUpdate() {
    const [, set] = React.useState(0);
    return React.useCallback(() => set((n) => n + 1), []);
  }

  window.OpsUI = { SearchBar, FilterTabs, OrderStatus, PageHead, EmptyState, Drawer, Modal, ModalField, TextInput, OrderDetail, useForceUpdate };
})();
