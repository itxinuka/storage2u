// Storage2U — Blog index page. Exposes window.BlogPage.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Card, Badge } = DS;
  const Icon = window.Icon;
  const D = window.S2U;

  // Map a post category to a thumbnail glyph.
  const CAT_ICON = {
    "Moving out": "truck",
    "Packing tips": "box",
    "Campus life": "graduation-cap",
    "Big items": "package",
  };

  function Thumb({ tone, icon, big }) {
    const onTone = tone === "lime" ? "var(--on-accent)" : tone === "soft" ? "var(--brand-primary)" : "#fff";
    return (
      <>
        <span style={{ position: "absolute", right: -24, top: -24, width: 120, height: 120, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.18)" }} />
        <span style={{ position: "absolute", left: -30, bottom: -40, width: 130, height: 130, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.12)" }} />
        <Icon name={icon} size={big ? 64 : 44} color={onTone} className="glyph" />
      </>
    );
  }

  function PostCard({ p }) {
    return (
      <Card interactive padding={22} style={{ display: "flex", flexDirection: "column" }}>
        <div className={"post-thumb " + p.tone}><Thumb tone={p.tone} icon={CAT_ICON[p.cat] || "box"} /></div>
        <div className="post-meta">
          <Badge tone={p.tone === "soft" ? "purple" : p.tone}>{p.cat}</Badge>
          <span>{p.read} read</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.excerpt}</p>
        <span className="more">Read article <Icon name="arrow-right" size={15} color="var(--brand-primary)" /></span>
      </Card>
    );
  }

  function BlogPage() {
    const feature = D.blog.find((p) => p.feature) || D.blog[0];
    const rest = D.blog.filter((p) => p !== feature);
    return (
      <div>
        <window.SiteNav />

        <section className="page-band">
          <div className="hero-rings">
            <span style={{ right: -90, top: -110, width: 380, height: 380 }} />
            <span style={{ left: -80, bottom: -150, width: 320, height: 320, borderColor: "rgba(255,255,255,0.12)" }} />
          </div>
          <div className="container page-band-inner">
            <p className="eyebrow">The Storage2U blog</p>
            <h1>Move-out tips, minus the stress</h1>
            <p>Packing hacks, move-in guides, and the occasional behind-the-scenes from the warehouse — written for students, by people who haul boxes for a living.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {/* Featured post */}
            <Card padding={0} style={{ overflow: "hidden", marginBottom: 44 }}>
              <div className="featured-post">
                <div className="featured-thumb">
                  <Thumb tone="purple" icon={CAT_ICON[feature.cat] || "truck"} big />
                </div>
                <div className="featured-body">
                  <div className="post-meta">
                    <Badge tone="lime" solid>Featured</Badge>
                    <span>{feature.cat} · {feature.read} read</span>
                  </div>
                  <h2>{feature.title}</h2>
                  <p>{feature.excerpt}</p>
                  <div style={{ marginTop: 22 }}>
                    <Button variant="primary" iconRight={<Icon name="arrow-right" size={17} />}>Read the guide</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Grid */}
            <div className="blog-grid">
              {rest.map((p) => <PostCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section-sm">
          <div className="container">
            <div className="cta-band">
              <div className="hero-rings" style={{ opacity: 0.4 }}>
                <span style={{ right: -80, top: -100, width: 340, height: 340 }} />
                <span style={{ left: -90, bottom: -130, width: 300, height: 300, borderColor: "rgba(255,255,255,0.12)" }} />
              </div>
              <div style={{ position: "relative" }}>
                <h2>Storage tips in your inbox</h2>
                <p>One short email a month — move-out reminders, packing tricks, and student deals. No spam, unsubscribe anytime.</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 460, margin: "0 auto" }}>
                  <input className="s2u-textarea" style={{ minHeight: 0, height: 52, flex: "1 1 220px", borderRadius: "var(--radius-pill)" }} placeholder="you@mail.utoronto.ca" />
                  <Button size="lg" style={{ background: "#fff", color: "var(--brand-primary)" }}>Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <window.SiteFooter />
      </div>
    );
  }

  window.BlogPage = BlogPage;
})();
