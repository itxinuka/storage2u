// Storage2U — marketing landing page. Exposes window.Landing.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Badge, Logo, Avatar } = DS;
  const Icon = window.Icon;
  const D = window.S2U;

  const BOOK = "booking.html";

  const HEADLINES = {
    worries: { a: "Storage worries, ", lime: "gone.", b: "" },
    simple: { a: "Storage made simple — ", lime: "we pick up, you relax.", b: "" },
    room: { a: "Out of room? ", lime: "We'll take it from here.", b: "" },
  };

  // ── Navbar ────────────────────────────────────────────────────────
  function Navbar({ accent }) {
    const [open, setOpen] = React.useState(false);
    return (
      <header className="nav">
        <div className="container nav-inner">
          <a href="index.html" style={{ textDecoration: "none" }}><Logo size={32} /></a>
          <nav className="nav-links">
            {D.navLinks.map((l) => (
              <a key={l} href={"#" + l.split(" ")[0].toLowerCase()}>{l}</a>
            ))}
          </nav>
          <div className="nav-actions">
            <span className="desktop-only"><Button variant="ghost" size="sm" onClick={() => (window.location.href = "/sign-in")}>Sign in</Button></span>
            <span className="desktop-only">
              <Button variant={accent === "purple" ? "primary" : "secondary"} size="sm" onClick={() => (window.location.href = BOOK)}>Book a Pickup</Button>
            </span>
            <button className="nav-burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
              <Icon name={open ? "x" : "menu"} size={22} />
            </button>
          </div>
        </div>
        <div className={"mobile-menu" + (open ? " open" : "")} style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--border-soft)" }}>
          <div className="container" style={{ padding: "16px 28px 22px", display: "flex", flexDirection: "column", gap: 4 }}>
            {D.navLinks.map((l) => (
              <a key={l} href={"#" + l.split(" ")[0].toLowerCase()} onClick={() => setOpen(false)}
                style={{ padding: "12px 0", fontSize: 16, fontWeight: 600, color: "var(--text-body)", textDecoration: "none", borderBottom: "1px solid var(--border-soft)" }}>{l}</a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <Button variant="ghost" fullWidth onClick={() => (window.location.href = "/sign-in")}>Sign in</Button>
              <Button variant="secondary" fullWidth onClick={() => (window.location.href = BOOK)}>Book a Pickup</Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ── Hero ──────────────────────────────────────────────────────────
  function Hero({ layout, headlineKey, accent }) {
    const h = HEADLINES[headlineKey] || HEADLINES.worries;
    return (
      <section className={"hero" + (layout === "centered" ? " is-centered" : "")}>
        <div className="hero-rings">
          <span style={{ right: -120, top: -120, width: 520, height: 520 }} />
          <span style={{ right: -30, top: -40, width: 340, height: 340 }} />
          <span style={{ left: -100, bottom: -160, width: 380, height: 380, borderColor: "rgba(255,255,255,0.12)" }} />
        </div>
        <div className="container hero-inner">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="hero-pill">
                <span style={{ display: "flex", gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={13} color="var(--brand-accent)" style={{ fill: "var(--brand-accent)" }} />)}
                </span>
                Loved by 5,000+ students across 20+ Canadian campuses
              </span>
              <h1>{h.a}<span style={{ color: "var(--brand-accent)" }}>{h.lime}</span>{h.b}</h1>
              <p className="sub">Tell us how many boxes you've got. We pick them up from your dorm, store them safely, and bring them back whenever you need them — for a flat monthly fee per box.</p>
              <div className="hero-cta">
                {accent === "purple"
                  ? <Button size="lg" style={{ background: "#fff", color: "var(--brand-primary)" }} onClick={() => (window.location.href = BOOK)} iconRight={<Icon name="arrow-right" size={18} />}>Book a Pickup</Button>
                  : <Button variant="secondary" size="lg" onClick={() => (window.location.href = BOOK)} iconRight={<Icon name="arrow-right" size={18} />}>Book a Pickup</Button>}
                <Button variant="ghost" size="lg" style={{ color: "rgba(255,255,255,0.9)" }} onClick={() => scrollToId("how")}>See how it works</Button>
              </div>
              <div className="hero-stats">
                {D.brand.stats.map(([v, l]) => (
                  <div key={l}><div className="v">{v}</div><div className="l">{l}</div></div>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo">
                <image-slot id="s2u-hero" shape="rounded" radius="0" placeholder="Drop a move-out / campus photo"></image-slot>
              </div>
              <div className="hero-float" style={{ left: -18, bottom: 28 }}>
                <span className="icon-tile lime" style={{ width: 42, height: 42, borderRadius: "var(--radius-md)" }}>
                  <Icon name="package-check" size={20} color="var(--on-accent)" />
                </span>
                <div><div className="val">1,240+</div><div className="lbl">boxes stored this term</div></div>
              </div>
              <div className="hero-float" style={{ right: 16, top: 22, padding: "10px 14px" }}>
                <span className="icon-tile" style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)" }}>
                  <Icon name="truck" size={17} color="#fff" />
                </span>
                <div className="val" style={{ fontSize: 14 }}>Free pickup</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Trust strip ───────────────────────────────────────────────────
  function Trust() {
    return (
      <div className="trust">
        <div className="container" style={{ padding: "30px 28px" }}>
          <p style={{ margin: "0 0 18px", textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            On campus at 20+ Canadian universities
          </p>
          <div className="logo-strip">
            {D.logoStrip.map(([id, name, short]) => (
              <div key={id} className="logo-chip" title={name}>
                <image-slot id={"s2u-logo-" + id} shape="rounded" radius="0" placeholder={short}></image-slot>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── How it works ──────────────────────────────────────────────────
  function HowItWorks() {
    return (
      <section className="section" id="how" style={{ background: "var(--bg-app)" }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Simple process</p>
            <h2 className="h2">Storage worries gone in three steps</h2>
            <p className="lead">We handle the heavy lifting — literally — so you can focus on exams, summer plans, and actually moving out.</p>
          </div>
          <div className="grid grid-3" style={{ marginTop: 52 }}>
            {D.steps.map((s) => (
              <Card key={s.n} interactive padding={32}>
                <div className="feature">
                  <span className="step-n">{s.n}</span>
                  <span className="icon-tile"><Icon name={s.icon} size={24} color="#fff" /></span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Why Storage2U ─────────────────────────────────────────────────
  function Why() {
    return (
      <section className="section" id="help" style={{ background: "var(--surface-muted)" }}>
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Why Storage2U</p>
            <h2 className="h2">Built for student life</h2>
            <p className="lead">No vans to rent, no contracts to sign, no locker you outgrow or half-fill. Just the boxes you have, stored for as long as you need.</p>
          </div>
          <div className="grid grid-4" style={{ marginTop: 52 }}>
            {D.why.map((w) => (
              <Card key={w.title} padding={26}>
                <div className="why-card">
                  <span className="icon-tile soft"><Icon name={w.icon} size={22} color="var(--brand-primary)" /></span>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Pricing (per box / month) ─────────────────────────────────────
  // ── Comparison: Storage2U vs self-storage ─────────────────────────
  function Mark({ on }) {
    return (
      <span className={"compare-mark " + (on ? "yes" : "no")}>
        <Icon name={on ? "check" : "x"} size={13} color={on ? "#fff" : "var(--text-muted)"} strokeWidth={3} />
      </span>
    );
  }
  function Cell({ kind, val }) {
    const isBool = typeof val === "boolean";
    return (
      <div className={"compare-cell " + kind}>
        {kind === "us"
          ? <Mark on={isBool ? val : true} />
          : (isBool ? <Mark on={val} /> : <span className="compare-mark no"><Icon name="minus" size={13} color="var(--text-muted)" strokeWidth={3} /></span>)}
        <span>{isBool ? (val ? "Included" : "Not included") : val}</span>
      </div>
    );
  }
  function Comparison() {
    return (
      <section className="section" id="compare" style={{ background: "var(--bg-app)" }}>
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Why not self-storage?</p>
            <h2 className="h2">Storage2U vs. renting a unit</h2>
            <p className="lead">Traditional self-storage means a van, a contract, and a half-empty locker across town. We come to you and you pay for the boxes you actually have.</p>
          </div>
          <div className="compare" style={{ marginTop: 52 }}>
            <div className="compare-col-head" style={{ background: "transparent" }} />
            <div className="compare-col-head us">
              <span className="ttl">Storage2U</span>
              <span className="tag">On-demand · per box</span>
            </div>
            <div className="compare-col-head them">
              <span className="ttl">Self-storage unit</span>
              <span className="tag">DIY · fixed locker</span>
            </div>
            {D.compare.map(([feature, vals]) => (
              <React.Fragment key={feature}>
                <div className="compare-feature">{feature}</div>
                <Cell kind="us" val={vals.us} />
                <Cell kind="them" val={vals.them} />
              </React.Fragment>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Button size="lg" onClick={() => (window.location.href = BOOK)} iconRight={<Icon name="arrow-right" size={18} />}>Book a Pickup</Button>
          </div>
        </div>
      </section>
    );
  }

  // ── Dorm move-in (uses the same booking flow) ─────────────────────
  function MoveIn() {
    return (
      <section className="section" id="movein" style={{ background: "var(--surface-muted)" }}>
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Moving in, too</p>
              <h2 className="h2">Not just move-out — we handle move-in</h2>
              <p className="lead">Same service, other direction. Storing over the summer? We'll deliver everything to your new room on move-in day. New to campus? Ship your boxes ahead and we'll have them waiting.</p>
              <ul className="split-list">
                {D.moveIn.map((m) => (
                  <li key={m.title}>
                    <span className="icon-tile soft" style={{ width: 42, height: 42 }}><Icon name={m.icon} size={20} color="var(--brand-primary)" /></span>
                    <div className="txt">
                      <h4>{m.title}</h4>
                      <p>{m.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
                <Button size="lg" onClick={() => (window.location.href = BOOK + "?mode=delivery")} iconRight={<Icon name="arrow-right" size={18} />}>Book a move-in delivery</Button>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, color: "var(--text-muted)" }}>
                  <Icon name="circle-check" size={15} color="var(--brand-primary)" /> Same easy booking flow
                </span>
              </div>
            </div>
            <div className="split-visual">
              <div className="split-photo">
                <image-slot id="s2u-movein" shape="rounded" radius="0" placeholder="Drop a dorm move-in photo"></image-slot>
              </div>
              <div className="hero-float" style={{ right: 16, bottom: 24 }}>
                <span className="icon-tile lime" style={{ width: 40, height: 40, borderRadius: "var(--radius-md)" }}>
                  <Icon name="truck" size={19} color="var(--on-accent)" />
                </span>
                <div><div className="val">Move-in day</div><div className="lbl">delivered to your door</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Closing CTA band ──────────────────────────────────────────────
  function CtaBand() {
    return (
      <section className="section-sm" style={{ background: "var(--bg-app)" }}>
        <div className="container">
          <div className="cta-band">
            <div className="hero-rings" style={{ opacity: 0.45 }}>
              <span style={{ right: -80, top: -100, width: 360, height: 360 }} />
              <span style={{ left: -90, bottom: -140, width: 320, height: 320, borderColor: "rgba(255,255,255,0.12)" }} />
            </div>
            <div style={{ position: "relative" }}>
              <h2>Ready to clear out your room?</h2>
              <p>Book a pickup in two minutes. We'll grab your boxes, store them safely, and bring them back whenever you need them.</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Button size="lg" style={{ background: "#fff", color: "var(--brand-primary)" }} onClick={() => (window.location.href = BOOK)} iconRight={<Icon name="arrow-right" size={18} />}>Book a Pickup</Button>
                <Button variant="ghost" size="lg" style={{ color: "rgba(255,255,255,0.9)" }} onClick={() => (window.location.href = "/dashboard")}>See my storage</Button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginTop: 26, flexWrap: "wrap" }}>
                {["Free pickup & delivery", "Insured up to $500", "Cancel anytime"].map((f) => (
                  <span key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>
                    <Icon name="circle-check" size={15} color="var(--brand-accent)" /> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Universities ──────────────────────────────────────────────────
  function Universities() {
    return (
      <section className="section" id="universities" style={{ background: "var(--surface-muted)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div className="section-head">
              <p className="eyebrow">Campus coverage</p>
              <h2 className="h2">We serve your university</h2>
              <p className="lead">Storage2U runs at 20+ campuses across Canada — and we add more every semester.</p>
            </div>
            <Badge tone="purple">20+ campuses &amp; counting</Badge>
          </div>
          <div className="grid grid-4" style={{ marginTop: 40, gap: 14 }}>
            {D.universities.map(([name, loc]) => (
              <div key={name} className="uni-card">
                <span className="icon-tile soft" style={{ width: 38, height: 38, borderRadius: "var(--radius-sm)" }}>
                  <Icon name="map-pin" size={18} color="var(--brand-primary)" />
                </span>
                <div style={{ minWidth: 0 }}>
                  <p className="name">{name}</p>
                  <p className="loc">{loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Testimonials ──────────────────────────────────────────────────
  function Testimonials() {
    const tones = ["purple", "lime", "soft"];
    return (
      <section className="section" style={{ background: "var(--bg-app)" }}>
        <div className="container">
          <div className="section-head center">
            <p className="eyebrow">Student stories</p>
            <h2 className="h2">Moving out, minus the stress</h2>
          </div>
          <div className="grid grid-3" style={{ marginTop: 52 }}>
            {D.testimonials.map((t, i) => (
              <Card key={t.name} padding={30}>
                <div className="quote-card">
                  <div className="stars">
                    {[...Array(5)].map((_, j) => <Icon key={j} name="star" size={16} color="var(--brand-accent)" style={{ fill: "var(--brand-accent)" }} />)}
                  </div>
                  <blockquote>“{t.quote}”</blockquote>
                  <div className="who">
                    <Avatar name={t.name} size={42} tone={tones[i % tones.length]} />
                    <div>
                      <div className="nm">{t.name}</div>
                      <div className="mt">{t.meta}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Footer ────────────────────────────────────────────────────────
  function Footer() { return <window.SiteFooter />; }

  // ── helpers ───────────────────────────────────────────────────────
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }
  function shortUni(name) {
    const map = {
      "University of British Columbia": "UBC",
      "University of Toronto": "U of T",
      "McGill University": "McGill",
      "University of Waterloo": "Waterloo",
      "Queen's University": "Queen's",
      "Simon Fraser University": "SFU",
    };
    return map[name] || name;
  }

  // ── Page ──────────────────────────────────────────────────────────
  const TWEAKS = /*EDITMODE-BEGIN*/{
    "heroLayout": "split",
    "headline": "worries",
    "corners": "round",
    "accent": "lime"
  }/*EDITMODE-END*/;

  function Landing() {
    const [t, setTweak] = window.useTweaks(TWEAKS);
    React.useEffect(() => {
      document.documentElement.setAttribute("data-round", t.corners);
    }, [t.corners]);

    const headlineOpts = [
      { value: "worries", label: "Storage worries, gone." },
      { value: "simple", label: "Storage made simple…" },
      { value: "room", label: "We'll take it from here." },
    ];

    return (
      <div>
        <Navbar accent={t.accent} />
        <Hero layout={t.heroLayout} headlineKey={t.headline} accent={t.accent} />
        <Trust />
        <HowItWorks />
        <Why />
        <Comparison />
        <MoveIn />
        <Universities />
        <Testimonials />
        <CtaBand />
        <Footer />

        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Hero" />
          <window.TweakRadio label="Layout" value={t.heroLayout}
            options={[{ value: "split", label: "Split" }, { value: "centered", label: "Centered" }]}
            onChange={(v) => setTweak("heroLayout", v)} />
          <window.TweakSelect label="Headline" value={t.headline} options={headlineOpts}
            onChange={(v) => setTweak("headline", v)} />
          <window.TweakSection label="Style" />
          <window.TweakRadio label="Corners" value={t.corners}
            options={[{ value: "round", label: "Round" }, { value: "soft", label: "Soft" }, { value: "sharp", label: "Sharp" }]}
            onChange={(v) => setTweak("corners", v)} />
          <window.TweakRadio label="Accent" value={t.accent}
            options={[{ value: "lime", label: "Lime" }, { value: "purple", label: "Purple" }]}
            onChange={(v) => setTweak("accent", v)} />
        </window.TweaksPanel>
      </div>
    );
  }

  window.Landing = Landing;
})();
