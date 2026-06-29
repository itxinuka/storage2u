// Storage2U — Contact page. Exposes window.ContactPage.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Input, Badge } = DS;
  const Icon = window.Icon;
  const D = window.S2U;

  function Field({ label, children }) {
    return (
      <div>
        <span className="field-label">{label}</span>
        {children}
      </div>
    );
  }

  function ContactForm() {
    const [sent, setSent] = React.useState(false);
    if (sent) {
      return (
        <Card padding={40} style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "var(--brand-accent)", boxShadow: "var(--shadow-accent)", marginBottom: 20 }}>
            <Icon name="check" size={34} color="var(--on-accent)" strokeWidth={3} />
          </div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-strong)" }}>Message sent!</h3>
          <p style={{ margin: "10px auto 0", maxWidth: 320, fontSize: 14.5, lineHeight: 1.55, color: "var(--text-muted)" }}>Thanks for reaching out — we'll get back to you within a few hours.</p>
          <div style={{ marginTop: 22 }}><Button variant="outline" onClick={() => setSent(false)}>Send another</Button></div>
        </Card>
      );
    }
    return (
      <Card padding={32}>
        <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div className="form-row">
            <Field label="First name"><Input placeholder="Jordan" /></Field>
            <Field label="Last name"><Input placeholder="Tremblay" /></Field>
          </div>
          <Field label="Email"><Input type="email" placeholder="you@mail.utoronto.ca" iconLeft={<Icon name="inbox" size={18} />} /></Field>
          <Field label="University"><Input placeholder="University of Toronto" iconLeft={<Icon name="graduation-cap" size={18} />} /></Field>
          <Field label="What's up?">
            <textarea className="s2u-textarea" placeholder="Tell us how we can help — pickup question, billing, campus partnership…" />
          </Field>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--text-muted)" }}>
              <Icon name="shield-check" size={15} color="var(--text-muted)" /> We'll only use this to reply to you.
            </span>
            <Button type="submit" variant="primary" iconRight={<Icon name="arrow-right" size={17} />}>Send message</Button>
          </div>
        </form>
      </Card>
    );
  }

  function ContactPage() {
    return (
      <div>
        <window.SiteNav />

        <section className="page-band">
          <div className="hero-rings">
            <span style={{ right: -90, top: -110, width: 380, height: 380 }} />
            <span style={{ left: -80, bottom: -150, width: 320, height: 320, borderColor: "rgba(255,255,255,0.12)" }} />
          </div>
          <div className="container page-band-inner">
            <p className="eyebrow">We're here to help</p>
            <h1>Get in touch</h1>
            <p>Questions about a pickup, your bill, or bringing Storage2U to your campus? Drop us a line — a real person will get back to you fast.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="contact-grid">
              <ContactForm />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {D.contactChannels.map((c) => (
                  <div key={c.label} className="channel-row">
                    <span className="icon-tile soft" style={{ width: 44, height: 44 }}><Icon name={c.icon} size={20} color="var(--brand-primary)" /></span>
                    <div>
                      <div className="lbl">{c.label}</div>
                      <div className="val">{c.value}</div>
                      <div className="note">{c.note}</div>
                    </div>
                  </div>
                ))}
                <Card tone="primary" padding={22} style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>Already a customer?</span>
                  <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>Manage pickups, request deliveries, and track your boxes from your dashboard.</span>
                  <Button variant="secondary" size="sm" onClick={() => (window.location.href = "/dashboard")} iconRight={<Icon name="arrow-right" size={16} color="var(--on-accent)" />}>Go to My Storage</Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="section-sm" style={{ background: "var(--surface-muted)" }}>
          <div className="container">
            <div className="section-head center">
              <p className="eyebrow">What can we help with?</p>
              <h2 className="h2">Reach the right team</h2>
            </div>
            <div className="grid grid-3" style={{ marginTop: 44 }}>
              {D.contactReasons.map((r) => (
                <Card key={r.title} padding={26}>
                  <div className="reason-card">
                    <span className="icon-tile soft"><Icon name={r.icon} size={22} color="var(--brand-primary)" /></span>
                    <h3>{r.title}</h3>
                    <p>{r.body}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <window.SiteFooter />
      </div>
    );
  }

  window.ContactPage = ContactPage;
})();
