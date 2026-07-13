// Storage2U — booking wizard (static, navigable). Exposes window.Booking.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Badge, StepIndicator, Logo, Avatar } = DS;
  const Icon = window.Icon;
  const D = window.S2U;

  // Unified catalog for price/name lookup.
  const CATALOG = D.items;
  const get = (id) => CATALOG.find((x) => x.id === id) || {};
  const priceOf = (id) => get(id).price || 0;

  // Sample selection used across the static flow.
  const SEL = { large_box: 3, fridge: 1, bike: 1 };
  const TOTAL = Object.entries(SEL).reduce((s, [id, n]) => s + priceOf(id) * n, 0);
  const COUNT = Object.values(SEL).reduce((a, b) => a + b, 0);
  const BOX_COUNT = SEL.large_box || 0;
  const ITEM_COUNT = COUNT - BOX_COUNT;
  const ORDER = { university: "University of Toronto", residence: "On-campus residence — Chestnut", address: "89 Chestnut St, Room 412", phone: "(416) 555-0148", date: "Saturday, Sep 19", window: "Afternoon (12–4 PM)", delivery: "Sunday, Jan 4" };

  // Two directions, one wizard: move-out pickup vs. move-in delivery.
  const MODES = {
    pickup: {
      steps: ["Items", "Pickup", "Schedule", "Review", "Payment"],
      s1Title: "What are you storing?",
      s1Sub: "Add boxes and any bigger items. We'll do a final count at pickup — you only pay for what you store.",
      s1Note: "Storing something else — surfboard, instrument, monitor? Add a note at pickup and we'll price it on the spot.",
      s2Title: "Where should we pick up?",
      s2Sub: "We'll come straight to your door on pickup day — no hauling across campus.",
      addrLabel: "Room / unit & address",
      s3Title: "Pick a pickup date & time",
      s3Sub: "Choose a day and a one-hour-ish window. You can reschedule any time before pickup.",
      schedLabel: "Time window",
      reviewSub: "Quick once-over before we confirm your pickup.",
      storeLabel: "Storing",
      whereLabel: "Pickup from",
      whenLabel: "Pickup",
      showPlanned: true,
      summaryTitle: "Your pickup",
      payCta: "Pay & book pickup",
      confTitle: "You're all booked!",
      confVerb: "Our team will be at",
    },
    delivery: {
      steps: ["Items", "Deliver to", "Move-in day", "Review", "Payment"],
      s1Title: "What should we deliver?",
      s1Sub: "Your stored boxes plus anything shipped ahead — we'll bring it to your new room on move-in day.",
      s1Note: "Shipping something ahead — surfboard, instrument, monitor? Add a note and we'll handle it on move-in day.",
      s2Title: "Where's your new place?",
      s2Sub: "We'll deliver straight to your dorm or apartment on move-in day.",
      addrLabel: "New room / unit & address",
      s3Title: "Pick your move-in day",
      s3Sub: "Choose the day you're arriving and an arrival window. Reschedule any time before then.",
      schedLabel: "Arrival window",
      reviewSub: "Quick once-over before we confirm your move-in delivery.",
      storeLabel: "Delivering",
      whereLabel: "Deliver to",
      whenLabel: "Move-in day",
      showPlanned: false,
      summaryTitle: "Your move-in",
      payCta: "Pay & book delivery",
      confTitle: "Move-in booked!",
      confVerb: "We'll deliver everything to",
    },
  };

  // Local Lucide paths for catalog items the bundled Icon set doesn't carry.
  const ITEM_PATHS = {
    fridge: ["M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", "M5 10h14", "M9 6v1", "M9 14v3"],
    bike: [{ c: [18.5, 17.5, 3.5] }, { c: [5.5, 17.5, 3.5] }, { c: [15, 5, 1] }, "M12 17.5V14l-3-3 4-3 2 3h2"],
    suitcase: ["M6 6h12a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2z", "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2", "M9 11v6", "M15 11v6"],
    backpack: ["M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z", "M9 6V5a3 3 0 0 1 6 0v1", "M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4", "M8 10h8"],
    monitor: ["M4 3h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M8 21h8", "M12 17v4"],
    box: ["M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", "m3.3 7 8.7 5 8.7-5", "M12 22V12"],
  };
  function ItemIcon({ name, size = 24, color = "currentColor" }) {
    const items = ITEM_PATHS[name] || ITEM_PATHS.box;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        {items.map((it, i) => typeof it === "string"
          ? <path key={i} d={it} />
          : <circle key={i} cx={it.c[0]} cy={it.c[1]} r={it.c[2]} />)}
      </svg>
    );
  }

  // ── shared bits ───────────────────────────────────────────────────
  function StepHead({ title, sub }) {
    return (
      <div style={{ marginBottom: 26 }}>
        <h2 className="step-title">{title}</h2>
        <p className="step-sub">{sub}</p>
      </div>
    );
  }

  function StaticCounter({ n }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={counterBtn(n <= 0)}>–</span>
        <span style={{ minWidth: 22, textAlign: "center", fontSize: 20, fontWeight: 800, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{n}</span>
        <span style={counterBtn(false)}>+</span>
      </div>
    );
  }
  const counterBtn = (dis) => ({
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 38, height: 38, borderRadius: "var(--radius-pill)",
    border: "2px solid var(--border-soft)", background: "var(--surface-card)",
    color: "var(--text-strong)", fontSize: 20, fontWeight: 700, lineHeight: 0,
    opacity: dis ? 0.4 : 1,
  });

  function FakeField({ label, value, placeholder, chevron }) {
    return (
      <div>
        <span className="field-label">{label}</span>
        <div className={"fake-input" + (value ? "" : " placeholder")}>
          <span>{value || placeholder}</span>
          {chevron && <Icon name="chevron-right" size={18} color="var(--text-muted)" style={{ transform: "rotate(90deg)" }} />}
        </div>
      </div>
    );
  }

  function SummaryLine({ k, v }) {
    return <div className="summary-row"><span className="k">{k}</span><span className="v">{v}</span></div>;
  }

  function OrderSummary({ M }) {
    return (
      <aside className="book-summary">
        <Card padding={24} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "var(--text-strong)" }}>{M.summaryTitle}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CATALOG.map((b) => SEL[b.id] ? (
              <SummaryLine key={b.id} k={`${b.name} × ${SEL[b.id]}`} v={`$${priceOf(b.id) * SEL[b.id]}/mo`} />
            ) : null)}
          </div>
          <div style={{ height: 1, background: "var(--border-soft)" }} />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{BOX_COUNT} boxes · {ITEM_COUNT} items</span>
            <span style={{ fontSize: 26, fontWeight: 800, color: "var(--text-strong)" }}>${TOTAL}<span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>/mo</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: "var(--radius-md)", background: "var(--surface-sunken)" }}>
            <Icon name="truck" size={16} color="var(--brand-primary)" />
            <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Free pickup & delivery on campus</span>
          </div>
        </Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
          <Icon name="shield-check" size={15} color="var(--text-muted)" />
          <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Everything insured up to $500 · cancel anytime</span>
        </div>
      </aside>
    );
  }

  // ── steps ─────────────────────────────────────────────────────────
  function StepBoxes({ M }) {
    return (
      <div>
        <StepHead title={M.s1Title} sub={M.s1Sub} />

        <span className="field-label">Items</span>
        <div className="item-grid">
          {D.items.map((it) => {
            const n = SEL[it.id] || 0;
            return (
              <div key={it.id} className={"item-card" + (n > 0 ? " sel" : "")}>
                <span className="icon-tile soft" style={{ width: 52, height: 52 }}><ItemIcon name={it.icon} size={26} color="var(--brand-primary)" /></span>
                <div className="meta">
                  <div className="nm">{it.name}</div>
                  <div className="pr">${it.price}/mo</div>
                  {it.dims && <div className="dim" style={{ fontSize: 12, color: "var(--text-muted)" }}>{it.dims}</div>}
                </div>
                <StaticCounter n={n} />
              </div>
            );
          })}
        </div>
        <p style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 2px 0", fontSize: 13, color: "var(--text-muted)" }}>
          <Icon name="sparkles" size={15} color="var(--brand-primary)" /> {M.s1Note}
        </p>
      </div>
    );
  }

  function StepPickup({ M }) {
    return (
      <div>
        <StepHead title={M.s2Title} sub={M.s2Sub} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <FakeField label="University / campus" value={ORDER.university} chevron />
          <FakeField label="Residence type" value={ORDER.residence} chevron />
          <FakeField label={M.addrLabel} value={ORDER.address} />
          <FakeField label="Phone number" value={ORDER.phone} />
        </div>
      </div>
    );
  }

  function Calendar() {
    const dow = ["S", "M", "T", "W", "T", "F", "S"];
    const pad = 2; // Sep 2026 starts Tuesday
    const sel = 19;
    const cells = [];
    for (let i = 0; i < pad; i++) cells.push(<span key={"e" + i} className="cal-cell empty" />);
    for (let d = 1; d <= 30; d++) {
      const muted = d < 15;
      cells.push(<span key={d} className={"cal-cell" + (d === sel ? " sel" : muted ? " muted" : "")}>{d}</span>);
    }
    return (
      <Card padding={20} style={{ boxShadow: "inset 0 0 0 1px var(--border-soft)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={navBtn}><Icon name="chevron-left" size={16} color="var(--text-body)" /></span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-strong)" }}>September 2026</span>
          <span style={navBtn}><Icon name="chevron-right" size={16} color="var(--text-body)" /></span>
        </div>
        <div className="cal-grid" style={{ marginBottom: 6 }}>
          {dow.map((d, i) => <span key={i} className="cal-cell dow">{d}</span>)}
        </div>
        <div className="cal-grid">{cells}</div>
      </Card>
    );
  }
  const navBtn = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "var(--radius-pill)", border: "1.5px solid var(--border-soft)", background: "var(--surface-card)" };

  function StepSchedule({ M }) {
    const windows = [["Morning", "8–11 AM"], ["Afternoon", "12–4 PM"], ["Evening", "5–8 PM"]];
    return (
      <div>
        <StepHead title={M.s3Title} sub={M.s3Sub} />
        <Calendar />
        <span className="field-label" style={{ marginTop: 20 }}>{M.schedLabel}</span>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {windows.map(([t, h]) => {
            const on = t === "Afternoon";
            return (
              <div key={t} style={{
                display: "flex", flexDirection: "column", gap: 2, padding: "12px 18px", borderRadius: "var(--radius-md)", cursor: "pointer",
                background: on ? "var(--purple-50)" : "var(--surface-card)",
                boxShadow: on ? "inset 0 0 0 2px var(--brand-primary)" : "inset 0 0 0 1.5px var(--border-soft)",
              }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: on ? "var(--brand-primary)" : "var(--text-strong)" }}>{t}</span>
                <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{h}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function ReviewRow({ icon, label, value, sub }) {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <span className="icon-tile soft" style={{ width: 38, height: 38, borderRadius: "var(--radius-sm)" }}><Icon name={icon} size={18} color="var(--brand-primary)" /></span>
        <div style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>{label}</span>
          <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: "var(--text-strong)", marginTop: 2 }}>{value}</span>
          {sub && <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>{sub}</span>}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-primary)", cursor: "pointer" }}>Edit</span>
      </div>
    );
  }

  function StepReview({ M }) {
    return (
      <div>
        <StepHead title="Review your booking" sub={M.reviewSub} />
        <Card padding={0} style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 26 }}>
            <ReviewRow icon="box" label={M.storeLabel} value={`${BOX_COUNT} boxes · ${ITEM_COUNT} items`} sub={`${SEL.large_box} large boxes · mini fridge · bicycle`} />
            <ReviewRow icon="graduation-cap" label={M.whereLabel} value={ORDER.university} sub={ORDER.address} />
            <ReviewRow icon="calendar-days" label={M.whenLabel} value={`${ORDER.date} · ${ORDER.window}`} />
            {M.showPlanned && <ReviewRow icon="truck" label="Planned delivery" value={ORDER.delivery} sub="Reschedule any time from your dashboard" />}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 26px", background: "var(--surface-sunken)" }}>
            <div>
              <span style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Monthly total</span>
              <span style={{ fontSize: 26, fontWeight: 800, color: "var(--text-strong)" }}>${TOTAL}<span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>/mo</span></span>
            </div>
            <Badge tone="success" iconLeft={<Icon name="circle-check" size={14} color="var(--success-fg)" />}>$0 hidden fees</Badge>
          </div>
        </Card>
      </div>
    );
  }

  function StepPayment() {
    return (
      <div>
        <StepHead title="Add a payment method" sub="You're billed monthly for the boxes you store. Cancel anytime — no penalties." />
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[["Card", true], ["Apple Pay", false], ["Google Pay", false]].map(([t, on]) => (
            <div key={t} style={{
              flex: 1, textAlign: "center", padding: "12px 0", borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 700, cursor: "pointer",
              background: on ? "var(--purple-50)" : "var(--surface-card)", color: on ? "var(--brand-primary)" : "var(--text-body)",
              boxShadow: on ? "inset 0 0 0 2px var(--brand-primary)" : "inset 0 0 0 1.5px var(--border-soft)",
            }}>{t}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FakeField label="Card number" value="4242 4242 4242 4242" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FakeField label="Expiry" value="09 / 28" />
            <FakeField label="CVC" value="•••" />
          </div>
          <FakeField label="Name on card" value="Jordan Tremblay" />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, padding: "16px 20px", borderRadius: "var(--radius-lg)", background: "var(--surface-sunken)" }}>
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Billed today, then monthly</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-strong)" }}>${TOTAL}<span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>/mo</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, color: "var(--text-muted)" }}>
          <Icon name="shield-check" size={15} color="var(--text-muted)" />
          <span style={{ fontSize: 12.5 }}>Payments secured & encrypted. We never store your full card number.</span>
        </div>
      </div>
    );
  }

  function Confirmation({ M }) {
    return (
      <Card padding={44} style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 84, height: 84, borderRadius: "50%", background: "var(--brand-accent)", boxShadow: "var(--shadow-accent)", marginBottom: 24 }}>
          <Icon name="check" size={40} color="var(--on-accent)" strokeWidth={3} />
        </div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-strong)" }}>{M.confTitle}</h2>
        <p style={{ margin: "12px auto 0", maxWidth: 400, fontSize: 15, lineHeight: 1.55, color: "var(--text-muted)" }}>
          We've emailed your confirmation. {M.confVerb} <strong style={{ color: "var(--text-strong)" }}>{ORDER.address}</strong> on {ORDER.date}.
        </p>
        <Card padding={20} style={{ boxShadow: "inset 0 0 0 1px var(--border-soft)", textAlign: "left", margin: "26px auto 0", maxWidth: 420 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="icon-tile soft" style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)" }}><Icon name="calendar-days" size={18} color="var(--brand-primary)" /></span>
              <div><div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-strong)" }}>{ORDER.date}</div><div style={{ fontSize: 13, color: "var(--text-muted)" }}>{ORDER.window}</div></div>
            </div>
            <div style={{ height: 1, background: "var(--border-soft)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="icon-tile soft" style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)" }}><Icon name="box" size={18} color="var(--brand-primary)" /></span>
              <div><div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-strong)" }}>{BOX_COUNT} boxes · {ITEM_COUNT} items · ${TOTAL}/mo</div><div style={{ fontSize: 13, color: "var(--text-muted)" }}>Free pickup & delivery</div></div>
            </div>
          </div>
        </Card>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          <Button variant="primary" onClick={() => (window.location.href = "/dashboard")} iconRight={<Icon name="arrow-right" size={17} />}>Go to My Storage</Button>
          <Button variant="outline">Add to calendar</Button>
        </div>
      </Card>
    );
  }

  // ── shell ─────────────────────────────────────────────────────────
  function ModeToggle({ mode, setMode }) {
    const opts = [["pickup", "Store my stuff", "package"], ["delivery", "University move-in", "graduation-cap"]];
    return (
      <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: "var(--radius-pill)", background: "var(--surface-sunken)", marginBottom: 24, maxWidth: "100%" }}>
        {opts.map(([id, label, icon]) => {
          const on = mode === id;
          return (
            <button key={id} onClick={() => setMode(id)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", border: "none", cursor: "pointer",
              borderRadius: "var(--radius-pill)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap",
              background: on ? "var(--surface-card)" : "transparent",
              color: on ? "var(--brand-primary)" : "var(--text-muted)",
              boxShadow: on ? "var(--shadow-sm)" : "none",
            }}>
              <Icon name={icon} size={16} color={on ? "var(--brand-primary)" : "var(--text-muted)"} /> {label}
            </button>
          );
        })}
      </div>
    );
  }

  function Booking() {
    const initialMode = new URLSearchParams(window.location.search).get("mode") === "delivery" ? "delivery" : "pickup";
    const [mode, setMode] = React.useState(initialMode);
    const M = MODES[mode];
    const STEPS = M.steps.map((label, i) => ({ id: i + 1, label }));
    const [step, setStep] = React.useState(0); // 0..4 steps, 5 = confirmation
    const done = step === 5;
    const next = () => setStep((s) => Math.min(s + 1, 5));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    const body = [<StepBoxes M={M} />, <StepPickup M={M} />, <StepSchedule M={M} />, <StepReview M={M} />, <StepPayment />][step];

    return (
      <div className="book-shell">
        <header className="book-top">
          <div className="container inner">
            <a href="index.html" style={{ textDecoration: "none" }}><Logo size={30} /></a>
            <a href="index.html" style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textDecoration: "none" }}>Exit</a>
          </div>
        </header>

        {done ? (
          <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 96px" }}>
            <Confirmation M={M} />
          </main>
        ) : (
          <main className="book-main">
            {step === 0 && <ModeToggle mode={mode} setMode={setMode} />}
            <div style={{ marginBottom: 36 }}><StepIndicator steps={STEPS} current={step + 1} /></div>
            <div className="book-grid">
              <Card padding={32}>
                {body}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border-soft)" }}>
                  {step > 0 ? <Button variant="ghost" onClick={back} iconLeft={<Icon name="chevron-left" size={16} color="var(--text-body)" />}>Back</Button> : <span />}
                  {step < 4
                    ? <Button variant="primary" onClick={next} iconRight={<Icon name="arrow-right" size={17} />}>Continue</Button>
                    : <Button variant="secondary" onClick={next} iconLeft={<Icon name="check" size={17} color="var(--on-accent)" strokeWidth={3} />}>{M.payCta}</Button>}
                </div>
              </Card>
              <OrderSummary M={M} />
            </div>
          </main>
        )}
      </div>
    );
  }

  window.Booking = Booking;
})();
