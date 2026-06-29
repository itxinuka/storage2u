// Storage2U — shared site chrome (nav + footer) for sub-pages. Exposes
// window.SiteNav and window.SiteFooter.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const { Button, Logo } = DS;
  const Icon = window.Icon;
  const D = window.S2U;
  const BOOK = "booking.html";

  function SiteNav() {
    const [open, setOpen] = React.useState(false);
    return (
      <header className="nav">
        <div className="container nav-inner">
          <a href="index.html" style={{ textDecoration: "none" }}><Logo size={32} /></a>
          <nav className="nav-links">
            {D.navLinks.map((l) => (
              <a key={l} href={"index.html#" + l.split(" ")[0].toLowerCase()}>{l}</a>
            ))}
          </nav>
          <div className="nav-actions">
            <span className="desktop-only"><Button variant="ghost" size="sm" onClick={() => (window.location.href = "/sign-in")}>Sign in</Button></span>
            <span className="desktop-only"><Button variant="primary" size="sm" onClick={() => (window.location.href = BOOK)}>Book a Pickup</Button></span>
            <button className="nav-burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
              <Icon name={open ? "x" : "menu"} size={22} />
            </button>
          </div>
        </div>
        <div className={"mobile-menu" + (open ? " open" : "")} style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--border-soft)" }}>
          <div className="container" style={{ padding: "16px 28px 22px", display: "flex", flexDirection: "column", gap: 4 }}>
            {D.navLinks.map((l) => (
              <a key={l} href={"index.html#" + l.split(" ")[0].toLowerCase()} onClick={() => setOpen(false)}
                style={{ padding: "12px 0", fontSize: 16, fontWeight: 600, color: "var(--text-body)", textDecoration: "none", borderBottom: "1px solid var(--border-soft)" }}>{l}</a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <Button variant="ghost" fullWidth onClick={() => (window.location.href = "/sign-in")}>Sign in</Button>
              <Button variant="primary" fullWidth onClick={() => (window.location.href = BOOK)}>Book a Pickup</Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function SiteFooter() {
    const cols = [
      ["Product", [["How it works", "index.html#how"], ["Compare", "index.html#compare"], ["Move-in service", "booking.html?mode=delivery"], ["Book a pickup", BOOK]]],
      ["Company", [["About us", "#"], ["Careers", "#"], ["Blog", "blog.html"], ["Contact", "contact.html"]]],
      ["Support", [["Help centre", "contact.html"], ["Track a delivery", "/dashboard"], ["Insurance", "#"], ["Terms", "#"]]],
    ];
    return (
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo size={30} onColor />
              <p className="tagline">On-demand storage for Canadian students. We pick up, you relax.</p>
            </div>
            {cols.map(([title, links]) => (
              <div key={title}>
                <h5>{title}</h5>
                {links.map(([l, href]) => <a key={l} href={href}>{l}</a>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p>© 2026 Storage2U Technologies Inc. Made in Canada.</p>
            <p>Privacy · Terms · Cookies</p>
          </div>
        </div>
      </footer>
    );
  }

  window.SiteNav = SiteNav;
  window.SiteFooter = SiteFooter;
})();
