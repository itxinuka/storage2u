/* @ds-bundle: {"format":3,"namespace":"Storage2UDesignSystem_694705","components":[{"name":"Avatar","sourcePath":"components/brand/Avatar.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StorageStatusBadge","sourcePath":"components/feedback/StorageStatusBadge.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"Counter","sourcePath":"components/forms/Counter.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"StepIndicator","sourcePath":"components/navigation/StepIndicator.jsx"}],"sourceHashes":{"components/brand/Avatar.jsx":"ef5b0c4f93f9","components/brand/Logo.jsx":"3fb33f4af895","components/feedback/Badge.jsx":"0a09c23c7496","components/feedback/ProgressBar.jsx":"867f8f988df5","components/feedback/StorageStatusBadge.jsx":"1b671960fa0e","components/forms/Button.jsx":"60db3929e6bd","components/forms/Chip.jsx":"70da1ef0fed3","components/forms/Counter.jsx":"d8c4c6ab2bed","components/forms/Input.jsx":"f5429d12a415","components/layout/Card.jsx":"54c35457c83a","components/navigation/StepIndicator.jsx":"710d9cb4d5cb","ui_kits/_shared/icons.jsx":"ad3883df286c","ui_kits/admin/AdminConsole.jsx":"50428f7062f9","ui_kits/booking/BookingFlow.jsx":"b699f1c9abd7","ui_kits/dashboard/Dashboard.jsx":"79f09b00bbbb","ui_kits/marketing/MarketingSite.jsx":"c44b07928935"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.Storage2UDesignSystem_694705 = window.Storage2UDesignSystem_694705 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Avatar.jsx
try { (() => {
/**
 * Storage2U Avatar — round avatar with image or initials fallback on a soft
 * lavender/purple chip. Sizes scale the font automatically.
 */
function Avatar({
  name = "",
  src = null,
  size = 40,
  tone = "purple",
  style = {}
}) {
  const initials = name.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();
  const tones = {
    purple: {
      bg: "var(--brand-primary)",
      fg: "#fff"
    },
    lime: {
      bg: "var(--brand-accent)",
      fg: "var(--on-accent)"
    },
    soft: {
      bg: "var(--purple-100)",
      fg: "var(--purple-700)"
    }
  };
  const t = tones[tone] || tones.purple;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-pill)",
      background: src ? "transparent" : t.bg,
      color: t.fg,
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: size * 0.4,
      overflow: "hidden",
      flexShrink: 0,
      userSelect: "none",
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
/**
 * Storage2U Logo — a text wordmark: "Storage" in ink + "2U" in the brand color.
 * `mark` renders the compact "2U" tile (text-based, no external glyph).
 */
function Logo({
  size = 32,
  variant = "full",
  onColor = false,
  style = {}
}) {
  const accent = onColor ? "var(--brand-accent)" : "var(--brand-primary)";
  const tile = /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: size * 0.32,
      background: onColor ? "rgba(255,255,255,0.16)" : "var(--brand-primary)",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: 800,
      fontSize: size * 0.42,
      letterSpacing: "-0.04em",
      flexShrink: 0,
      lineHeight: 1
    }
  }, "2U");
  if (variant === "mark") return /*#__PURE__*/React.createElement("span", {
    style: style
  }, tile);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--font-sans)",
      fontWeight: 800,
      letterSpacing: "-0.03em",
      fontSize: size * 0.62,
      color: onColor ? "#fff" : "var(--text-strong)",
      lineHeight: 1,
      ...style
    }
  }, "Storage", /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent
    }
  }, "2U"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
/**
 * Storage2U Badge — small pill label. Tones use a light-tint background with
 * dark-tint text of the same hue. `solid` fills the brand color.
 */
function Badge({
  children,
  tone = "purple",
  solid = false,
  iconLeft = null,
  style = {}
}) {
  const tones = {
    purple: {
      soft: ["var(--purple-100)", "var(--purple-700)"],
      solid: ["var(--brand-primary)", "var(--on-primary)"]
    },
    lime: {
      soft: ["var(--lime-200)", "var(--lime-ink-strong)"],
      solid: ["var(--brand-accent)", "var(--on-accent)"]
    },
    neutral: {
      soft: ["var(--surface-muted)", "var(--text-body)"],
      solid: ["var(--indigo-900)", "#fff"]
    },
    success: {
      soft: ["var(--success-bg)", "var(--success-fg)"],
      solid: ["var(--success-fg)", "#fff"]
    },
    warning: {
      soft: ["var(--warning-bg)", "var(--warning-fg)"],
      solid: ["var(--warning-fg)", "#fff"]
    },
    info: {
      soft: ["var(--info-bg)", "var(--info-fg)"],
      solid: ["var(--info-fg)", "#fff"]
    },
    danger: {
      soft: ["var(--danger-bg)", "var(--danger-fg)"],
      solid: ["var(--danger-fg)", "#fff"]
    }
  };
  const [bg, fg] = (tones[tone] || tones.purple)[solid ? "solid" : "soft"];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 26,
      padding: "0 12px",
      borderRadius: "var(--radius-pill)",
      background: bg,
      color: fg,
      fontFamily: "var(--font-sans)",
      fontSize: 12.5,
      fontWeight: 700,
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
      ...style
    }
  }, iconLeft, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
/**
 * Storage2U ProgressBar — thick (12px), fully-rounded track with a lime fill to
 * signify movement and energy. Optional value label.
 */
function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  height = 12,
  style = {}
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height,
      background: "var(--surface-muted)",
      borderRadius: "var(--radius-pill)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      background: "var(--brand-accent)",
      borderRadius: "var(--radius-pill)",
      transition: "width 320ms var(--ease-out)"
    }
  })), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--text-muted)",
      fontFamily: "var(--font-sans)"
    }
  }, Math.round(pct), "%"));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StorageStatusBadge.jsx
try { (() => {
/**
 * Storage2U StorageStatusBadge — maps a booking lifecycle status to a colored
 * pill (In Storage / Picked Up / Delivered / Pending / Cancelled).
 */
const STATUS = {
  in_storage: {
    label: "In Storage",
    tone: ["var(--info-bg)", "var(--info-fg)"]
  },
  picked_up: {
    label: "Picked Up",
    tone: ["var(--surface-muted)", "var(--text-body)"]
  },
  delivered: {
    label: "Delivered",
    tone: ["var(--success-bg)", "var(--success-fg)"]
  },
  pending: {
    label: "Pending",
    tone: ["var(--warning-bg)", "var(--warning-fg)"]
  },
  scheduled: {
    label: "Scheduled",
    tone: ["var(--warning-bg)", "var(--warning-fg)"]
  },
  out_for_delivery: {
    label: "Out for Delivery",
    tone: ["var(--purple-100)", "var(--purple-700)"]
  },
  cancelled: {
    label: "Cancelled",
    tone: ["var(--danger-bg)", "var(--danger-fg)"]
  }
};
function StorageStatusBadge({
  status = "in_storage",
  style = {}
}) {
  const cfg = STATUS[status] || STATUS.in_storage;
  const [bg, fg] = cfg.tone;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 26,
      padding: "0 12px",
      borderRadius: "var(--radius-pill)",
      background: bg,
      color: fg,
      fontFamily: "var(--font-sans)",
      fontSize: 12.5,
      fontWeight: 700,
      whiteSpace: "nowrap",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: fg,
      opacity: 0.85
    }
  }), cfg.label);
}
Object.assign(__ds_scope, { StorageStatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StorageStatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Storage2U Button — extra-round, tactile. Primary is solid purple; secondary
 * is solid lime with indigo ink. Buttons "click" downward 2px on press.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      height: 40,
      padding: "0 18px",
      font: 14
    },
    md: {
      height: 48,
      padding: "0 26px",
      font: 15
    },
    lg: {
      height: 56,
      padding: "0 34px",
      font: 17
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--brand-primary)",
      color: "var(--on-primary)",
      boxShadow: "var(--shadow-sm)"
    },
    secondary: {
      background: "var(--brand-accent)",
      color: "var(--on-accent)",
      boxShadow: "var(--shadow-sm)"
    },
    outline: {
      background: "transparent",
      color: "var(--brand-primary)",
      boxShadow: "inset 0 0 0 2px var(--brand-primary)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-body)",
      boxShadow: "none"
    }
  };
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverBg = {
    primary: "var(--brand-primary-hover)",
    secondary: "var(--brand-accent-hover)",
    outline: "var(--purple-50)",
    ghost: "var(--surface-muted)"
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: fullWidth ? "100%" : "auto",
      height: s.height,
      padding: s.padding,
      border: "none",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-sans)",
      fontSize: s.font,
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      whiteSpace: "nowrap",
      transition: "background 140ms ease, transform 120ms var(--ease-squish), box-shadow 140ms ease",
      transform: press && !disabled ? "translateY(2px)" : "translateY(0)",
      ...v,
      background: hover && !disabled ? hoverBg : v.background,
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Storage2U Chip — selectable pill for filters / quick options. Selected state
 * fills purple; unselected is a soft lavender outline. Optional leading icon.
 */
function Chip({
  children,
  selected = false,
  onClick,
  iconLeft = null,
  as = "button",
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Tag = as;
  const interactive = as === "button" || !!onClick;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      height: 38,
      padding: "0 16px",
      borderRadius: "var(--radius-pill)",
      border: "none",
      boxShadow: selected ? "none" : "inset 0 0 0 1.5px var(--border-soft)",
      background: selected ? "var(--brand-primary)" : hover && interactive ? "var(--purple-50)" : "transparent",
      color: selected ? "var(--on-primary)" : "var(--text-body)",
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 600,
      cursor: interactive ? "pointer" : "default",
      whiteSpace: "nowrap",
      transition: "background 140ms ease, box-shadow 140ms ease",
      ...style
    }
  }, rest), iconLeft, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Counter.jsx
try { (() => {
/**
 * Storage2U Counter — round stepper for box counts. Minus/plus circles flank a
 * large tabular number. Disabled circles dim at the min/max bounds.
 */
function Counter({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  unit = "boxes",
  unitSingular = "box",
  caption = null
}) {
  const set = n => {
    const clamped = Math.max(min, Math.min(max, n));
    onChange && onChange(clamped);
  };
  const label = value === 1 ? unitSingular : unit;
  const circle = disabled => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: "var(--radius-pill)",
    border: "2px solid var(--border-soft)",
    background: "var(--surface-card)",
    color: "var(--text-strong)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 0,
    transition: "transform 120ms var(--ease-squish), background 140ms ease, border-color 140ms ease"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Decrease",
    disabled: value <= min,
    onClick: () => set(value - 1),
    style: circle(value <= min)
  }, "\u2013"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      minWidth: 70
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 44,
      fontWeight: 800,
      color: "var(--text-strong)",
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)",
      fontWeight: 500
    }
  }, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Increase",
    disabled: value >= max,
    onClick: () => set(value + 1),
    style: circle(value >= max)
  }, "+")), caption && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "var(--text-muted)",
      margin: 0
    }
  }, caption));
}
Object.assign(__ds_scope, { Counter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Counter.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Storage2U Input — oversized, fully-rounded field with a 2px stroke that turns
 * purple on focus. Optional leading icon. Uses inner stroke, not shadow.
 */
function Input({
  iconLeft = null,
  size = "md",
  invalid = false,
  style = {},
  wrapperStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    md: 52,
    lg: 56
  };
  const h = heights[size] || heights.md;
  const borderColor = invalid ? "var(--danger-fg)" : focus ? "var(--brand-primary)" : "var(--border-soft)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      ...wrapperStyle
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 18,
      top: "50%",
      transform: "translateY(-50%)",
      display: "inline-flex",
      color: focus ? "var(--brand-primary)" : "var(--text-muted)",
      pointerEvents: "none",
      transition: "color 140ms ease"
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      width: "100%",
      height: h,
      padding: iconLeft ? "0 20px 0 46px" : "0 20px",
      borderRadius: "var(--radius-pill)",
      border: "none",
      boxShadow: `inset 0 0 0 2px ${borderColor}`,
      background: "var(--surface-card)",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      fontWeight: 500,
      color: "var(--text-strong)",
      outline: "none",
      transition: "box-shadow 140ms ease",
      ...style
    }
  })));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Storage2U Card — pillowy white surface with a soft purple-tinted shadow and
 * extra-round corners. `interactive` adds a hover lift. `tone="primary"` makes a
 * filled purple card (e.g. the highlighted pricing plan).
 */
function Card({
  children,
  tone = "default",
  interactive = false,
  padding = 28,
  radius = "var(--radius-lg)",
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    default: {
      background: "var(--surface-card)",
      color: "var(--text-body)"
    },
    sunken: {
      background: "var(--surface-sunken)",
      color: "var(--text-body)"
    },
    primary: {
      background: "var(--brand-primary)",
      color: "var(--on-primary)"
    },
    inverse: {
      background: "var(--surface-inverse)",
      color: "var(--on-inverse)"
    }
  };
  const t = tones[tone] || tones.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: radius,
      padding,
      background: t.background,
      color: t.color,
      boxShadow: interactive && hover ? "var(--shadow-lg)" : "var(--shadow-sm)",
      transform: interactive && hover ? "translateY(-3px)" : "none",
      transition: "transform 200ms var(--ease-squish), box-shadow 200ms ease",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StepIndicator.jsx
try { (() => {
/**
 * Storage2U StepIndicator — horizontal wizard tracker. Completed nodes fill
 * purple with a check; the active node fills lime; upcoming nodes are outlined.
 */
function StepIndicator({
  steps = [],
  current = 1,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Progress",
    style: {
      width: "100%",
      ...style
    }
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      listStyle: "none",
      margin: 0,
      padding: 0
    }
  }, steps.map((step, i) => {
    const id = step.id ?? i + 1;
    const isDone = current > id;
    const isActive = current === id;
    const isLast = i === steps.length - 1;
    const node = isDone ? {
      bg: "var(--brand-primary)",
      fg: "var(--on-primary)",
      ring: "var(--brand-primary)"
    } : isActive ? {
      bg: "var(--brand-accent)",
      fg: "var(--on-accent)",
      ring: "var(--brand-accent)"
    } : {
      bg: "var(--surface-card)",
      fg: "var(--text-muted)",
      ring: "var(--border-soft)"
    };
    return /*#__PURE__*/React.createElement("li", {
      key: id,
      style: {
        display: "flex",
        alignItems: "center",
        flex: isLast ? "0 0 auto" : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: "var(--radius-pill)",
        background: node.bg,
        color: node.fg,
        boxShadow: `inset 0 0 0 2px ${node.ring}`,
        fontFamily: "var(--font-sans)",
        fontSize: 15,
        fontWeight: 700,
        transition: "all 180ms var(--ease-squish)"
      }
    }, isDone ? "✓" : id), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        color: isActive ? "var(--lime-ink-strong)" : isDone ? "var(--brand-primary)" : "var(--text-muted)"
      }
    }, step.label)), !isLast && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 3,
        margin: "0 8px",
        marginBottom: 26,
        borderRadius: "var(--radius-pill)",
        background: isDone ? "var(--brand-primary)" : "var(--border-soft)",
        transition: "background 180ms ease"
      }
    }));
  })));
}
Object.assign(__ds_scope, { StepIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StepIndicator.jsx", error: String((e && e.message) || e) }); }

// ui_kits/_shared/icons.jsx
try { (() => {
// Storage2U UI kits — shared Lucide icon set (real Lucide 24×24 stroke paths).
// Exposes window.Icon — <Icon name="package" size={20} />
(function () {
  const P = {
    package: ['m7.5 4.27 9 5.15', 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'm3.3 7 8.7 5 8.7-5', 'M12 22V12'],
    'package-check': ['m16 16 2 2 4-4', 'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14', 'M16.5 9.4 7.55 4.24', 'm3.3 7 8.7 5 8.7-5', 'M12 22V12'],
    truck: ['M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', 'M15 18H9', 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14', {
      c: [17, 18, 2]
    }, {
      c: [7, 18, 2]
    }],
    'calendar-check': ['M8 2v4', 'M16 2v4', {
      r: [3, 4, 18, 18, 2]
    }, 'M3 10h18', 'm9 16 2 2 4-4'],
    'calendar-days': ['M8 2v4', 'M16 2v4', {
      r: [3, 4, 18, 18, 2]
    }, 'M3 10h18', 'M8 14h.01', 'M12 14h.01', 'M16 14h.01', 'M8 18h.01', 'M12 18h.01', 'M16 18h.01'],
    calendar: ['M8 2v4', 'M16 2v4', {
      r: [3, 4, 18, 18, 2]
    }, 'M3 10h18'],
    'map-pin': ['M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0', {
      c: [12, 10, 3]
    }],
    check: ['M20 6 9 17l-5-5'],
    'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
    'chevron-right': ['m9 18 6-6-6-6'],
    'chevron-left': ['m15 18-6-6 6-6'],
    star: ['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'],
    plus: ['M5 12h14', 'M12 5v14'],
    minus: ['M5 12h14'],
    search: [{
      c: [11, 11, 8]
    }, 'm21 21-4.3-4.3'],
    zap: ['M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'],
    'graduation-cap': ['M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z', 'M22 10v6', 'M6 12.5V16a6 3 0 0 0 12 0v-3.5'],
    'circle-check': ['M21.801 10A10 10 0 1 1 17 3.335', 'm9 11 3 3L22 4'],
    'shield-check': ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'],
    clock: [{
      c: [12, 12, 10]
    }, 'M12 6v6l4 2'],
    box: ['M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'm3.3 7 8.7 5 8.7-5', 'M12 22V12'],
    archive: [{
      r: [2, 4, 20, 5, 1]
    }, 'M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9', 'M10 13h4'],
    'archive-x': [{
      r: [2, 4, 20, 5, 1]
    }, 'M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9', 'm9.5 13 5 5', 'm14.5 13-5 5'],
    'log-out': ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
    'panels-top-left': [{
      r: [3, 3, 18, 18, 2]
    }, 'M3 9h18', 'M9 21V9'],
    users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', {
      c: [9, 7, 4]
    }, 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
    inbox: ['M22 12h-6l-2 3h-4l-2-3H2', 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
    menu: ['M4 12h16', 'M4 6h16', 'M4 18h16'],
    x: ['M18 6 6 18', 'm6 6 12 12'],
    'dollar-sign': ['M12 2v20', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
    sparkles: ['M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z']
  };
  function Icon({
    name,
    size = 20,
    color = 'currentColor',
    strokeWidth = 2,
    style = {},
    ...rest
  }) {
    const items = P[name] || [];
    const children = items.map((it, i) => {
      if (typeof it === 'string') return React.createElement('path', {
        key: i,
        d: it
      });
      if (it.c) return React.createElement('circle', {
        key: i,
        cx: it.c[0],
        cy: it.c[1],
        r: it.c[2]
      });
      if (it.r) return React.createElement('rect', {
        key: i,
        x: it.r[0],
        y: it.r[1],
        width: it.r[2],
        height: it.r[3],
        rx: it.r[4]
      });
      return null;
    });
    return React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: {
        display: 'block',
        flexShrink: 0,
        ...style
      },
      ...rest
    }, children);
  }
  window.Icon = Icon;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/_shared/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminConsole.jsx
try { (() => {
// Storage2U — Admin console (operations). Exposes window.AdminConsole.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const {
    Button,
    Card,
    Badge,
    StorageStatusBadge,
    Logo
  } = DS;
  const Icon = window.Icon;
  const STATS = [{
    label: "Upcoming pickups",
    value: 14,
    icon: "calendar-check",
    tone: "var(--brand-primary)",
    bg: "var(--purple-100)"
  }, {
    label: "Pending deliveries",
    value: 6,
    icon: "truck",
    tone: "var(--lime-ink-strong)",
    bg: "var(--lime-200)"
  }, {
    label: "Items in storage",
    value: 1284,
    icon: "box",
    tone: "var(--info-fg)",
    bg: "var(--info-bg)"
  }];
  const PICKUPS0 = [{
    id: "b1",
    name: "Maya Chen",
    address: "812 S Forest Ave, Apt 4, Ann Arbor",
    time: "9:00 AM",
    boxes: 11
  }, {
    id: "b2",
    name: "Jordan Lee",
    address: "1015 Church St, Ann Arbor",
    time: "10:30 AM",
    boxes: 4
  }, {
    id: "b3",
    name: "Sam Park",
    address: "523 Packard St, Ann Arbor",
    time: "1:00 PM",
    boxes: 22
  }, {
    id: "b4",
    name: "Riley Diaz",
    address: "1400 Hill St, Ann Arbor",
    time: "3:15 PM",
    boxes: 7
  }];
  const DELIVERIES = [{
    id: "d1",
    name: "Alex Kim",
    date: "May 24, 2026",
    address: "705 Tappan Ave, Ann Arbor"
  }, {
    id: "d2",
    name: "Taylor Brooks",
    address: "330 E Liberty St, Ann Arbor",
    date: "May 25, 2026"
  }, {
    id: "d3",
    name: "Priya Nair",
    address: "611 Catherine St, Ann Arbor",
    date: "May 26, 2026"
  }];
  function Sidebar() {
    const items = [["panels-top-left", "Overview", true], ["inbox", "Bookings", false], ["users", "Customers", false], ["archive", "Inventory", false]];
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 240,
        flexShrink: 0,
        borderRight: "1px solid var(--border-soft)",
        background: "var(--surface-card)",
        display: "flex",
        flexDirection: "column",
        padding: "22px 16px",
        minHeight: "100vh"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 8px 22px"
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: 28
    })), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, items.map(([icon, label, active]) => /*#__PURE__*/React.createElement("a", {
      key: label,
      href: "#",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "11px 13px",
        borderRadius: "var(--radius-md)",
        textDecoration: "none",
        background: active ? "var(--purple-100)" : "transparent",
        color: active ? "var(--brand-primary)" : "var(--text-body)",
        fontSize: 14.5,
        fontWeight: active ? 700 : 600
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18,
      color: active ? "var(--brand-primary)" : "var(--text-muted)"
    }), label))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "11px 13px",
        color: "var(--text-muted)",
        fontSize: 14,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "log-out",
      size: 18,
      color: "var(--text-muted)"
    }), " Sign out"));
  }
  function StatCard({
    s
  }) {
    return /*#__PURE__*/React.createElement(Card, {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 52,
        height: 52,
        borderRadius: "var(--radius-md)",
        background: s.bg,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 24,
      color: s.tone
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-muted)"
      }
    }, s.label), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "2px 0 0",
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-strong)"
      }
    }, s.value.toLocaleString())));
  }
  function AdminConsole() {
    const [pickups, setPickups] = React.useState(PICKUPS0);
    const [done, setDone] = React.useState({});
    const mark = id => setDone(d => ({
      ...d,
      [id]: true
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        fontFamily: "var(--font-sans)",
        background: "var(--bg-app)",
        minHeight: "100vh"
      }
    }, /*#__PURE__*/React.createElement(Sidebar, null), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        height: 64,
        borderBottom: "1px solid var(--border-soft)",
        background: "var(--surface-card)",
        display: "flex",
        alignItems: "center",
        padding: "0 32px"
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontSize: 18,
        fontWeight: 800,
        color: "var(--text-strong)"
      }
    }, "Operations Overview"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, "Ann Arbor hub"), /*#__PURE__*/React.createElement(Badge, {
      tone: "lime",
      solid: true
    }, "May 23, 2026"))), /*#__PURE__*/React.createElement("main", {
      style: {
        padding: "28px 32px 64px",
        maxWidth: 1100
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 18,
        marginBottom: 36
      }
    }, STATS.map(s => /*#__PURE__*/React.createElement(StatCard, {
      key: s.label,
      s: s
    }))), /*#__PURE__*/React.createElement("section", {
      style: {
        marginBottom: 36
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 17,
        fontWeight: 800,
        color: "var(--text-strong)"
      }
    }, "Today's pickups"), /*#__PURE__*/React.createElement(Badge, {
      tone: "purple"
    }, pickups.length)), /*#__PURE__*/React.createElement(Card, {
      padding: 0,
      style: {
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.2fr 2fr 0.8fr 0.6fr auto",
        gap: 16,
        padding: "12px 22px",
        background: "var(--surface-sunken)",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--text-muted)"
      }
    }, /*#__PURE__*/React.createElement("span", null, "Customer"), /*#__PURE__*/React.createElement("span", null, "Address"), /*#__PURE__*/React.createElement("span", null, "Pickup time"), /*#__PURE__*/React.createElement("span", null, "# boxes"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: "right"
      }
    }, "Action")), pickups.map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      style: {
        display: "grid",
        gridTemplateColumns: "1.2fr 2fr 0.8fr 0.6fr auto",
        gap: 16,
        alignItems: "center",
        padding: "14px 22px",
        borderTop: i === 0 ? "none" : "1px solid var(--border-soft)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-body)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, p.address), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-body)"
      }
    }, p.time), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-body)"
      }
    }, p.boxes), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, done[p.id] ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 12,
        color: "var(--success-fg)",
        strokeWidth: 3
      })
    }, "Picked up") : /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      size: "sm",
      onClick: () => mark(p.id)
    }, "Mark picked up")))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 17,
        fontWeight: 800,
        color: "var(--text-strong)"
      }
    }, "Pending delivery requests"), /*#__PURE__*/React.createElement(Badge, {
      tone: "purple"
    }, DELIVERIES.length)), /*#__PURE__*/React.createElement(Card, {
      padding: 0,
      style: {
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr 2fr auto",
        gap: 16,
        padding: "12px 22px",
        background: "var(--surface-sunken)",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--text-muted)"
      }
    }, /*#__PURE__*/React.createElement("span", null, "Customer"), /*#__PURE__*/React.createElement("span", null, "Requested date"), /*#__PURE__*/React.createElement("span", null, "Delivery address"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: "right"
      }
    }, "Action")), DELIVERIES.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr 2fr auto",
        gap: 16,
        alignItems: "center",
        padding: "14px 22px",
        borderTop: i === 0 ? "none" : "1px solid var(--border-soft)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, d.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-body)"
      }
    }, d.date), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-body)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, d.address), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "truck",
        size: 15,
        color: "var(--brand-primary)"
      })
    }, "Out for delivery")))))))));
  }
  window.AdminConsole = AdminConsole;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminConsole.jsx", error: String((e && e.message) || e) }); }

// ui_kits/booking/BookingFlow.jsx
try { (() => {
// Storage2U — Booking wizard (5 steps + confirmation). Exposes window.BookingFlow.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const {
    Button,
    Card,
    Badge,
    Input,
    Counter,
    Chip,
    StepIndicator,
    Logo
  } = DS;
  const Icon = window.Icon;
  const STEPS = [{
    id: 1,
    label: "University"
  }, {
    id: 2,
    label: "Address"
  }, {
    id: 3,
    label: "Boxes"
  }, {
    id: 4,
    label: "Dates"
  }, {
    id: 5,
    label: "Review"
  }];
  const UNIS = [["University of Michigan", "Ann Arbor, MI"], ["Ohio State University", "Columbus, OH"], ["University of Texas", "Austin, TX"], ["UCLA", "Los Angeles, CA"], ["NYU", "New York, NY"], ["Boston University", "Boston, MA"], ["University of Florida", "Gainesville, FL"], ["Penn State", "State College, PA"], ["University of Illinois", "Champaign, IL"], ["Purdue University", "West Lafayette, IN"]];
  const PLANS = [{
    id: "starter",
    name: "Starter",
    maxBoxes: 5,
    price: 49,
    perks: ["Up to 5 boxes", "1 free pickup", "1 free delivery"]
  }, {
    id: "standard",
    name: "Standard",
    maxBoxes: 15,
    price: 89,
    perks: ["Up to 15 boxes", "1 free pickup", "Priority scheduling"]
  }, {
    id: "pro",
    name: "Pro",
    maxBoxes: 30,
    price: 149,
    perks: ["Unlimited boxes", "Free packing supplies", "Account manager"]
  }];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DOW = ["S", "M", "T", "W", "T", "F", "S"];
  function fmt(d) {
    if (!d) return "—";
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }

  // ---- Lightweight month calendar -----------------------------------------
  function MiniCalendar({
    value,
    onSelect,
    minDate,
    accent
  }) {
    const base = value || minDate || new Date();
    const [view, setView] = React.useState({
      y: base.getFullYear(),
      m: base.getMonth()
    });
    const first = new Date(view.y, view.m, 1);
    const startPad = first.getDay();
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(view.y, view.m, d));
    const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString();
    const disabled = d => minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    const shift = n => setView(v => {
      const nm = new Date(v.y, v.m + n, 1);
      return {
        y: nm.getFullYear(),
        m: nm.getMonth()
      };
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        maxWidth: 320
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => shift(-1),
      style: navBtn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 16,
      color: "var(--text-body)"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, MONTHS[view.m], " ", view.y), /*#__PURE__*/React.createElement("button", {
      onClick: () => shift(1),
      style: navBtn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      color: "var(--text-body)"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gap: 4
      }
    }, DOW.map((d, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        textAlign: "center",
        fontSize: 11,
        fontWeight: 700,
        color: "var(--text-muted)",
        padding: "4px 0"
      }
    }, d)), cells.map((d, i) => {
      if (!d) return /*#__PURE__*/React.createElement("span", {
        key: i
      });
      const sel = sameDay(d, value);
      const dis = disabled(d);
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        disabled: dis,
        onClick: () => onSelect(d),
        style: {
          height: 36,
          borderRadius: "var(--radius-pill)",
          border: "none",
          cursor: dis ? "not-allowed" : "pointer",
          background: sel ? accent ? "var(--brand-accent)" : "var(--brand-primary)" : "transparent",
          color: sel ? accent ? "var(--on-accent)" : "#fff" : dis ? "var(--outline-variant)" : "var(--text-body)",
          fontSize: 14,
          fontWeight: sel ? 700 : 500,
          fontFamily: "var(--font-sans)",
          transition: "background 120ms ease"
        }
      }, d.getDate());
    })));
  }
  const navBtn = {
    width: 34,
    height: 34,
    borderRadius: "var(--radius-pill)",
    border: "1.5px solid var(--border-soft)",
    background: "var(--surface-card)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  };
  function StepHeader({
    title,
    sub
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 24,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-strong)"
      }
    }, title), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "6px 0 0",
        fontSize: 15,
        lineHeight: 1.5,
        color: "var(--text-muted)"
      }
    }, sub));
  }
  function FooterNav({
    onBack,
    onNext,
    nextLabel = "Continue",
    nextDisabled,
    nextVariant = "secondary"
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 28,
        paddingTop: 24,
        borderTop: "1px solid var(--border-soft)"
      }
    }, onBack ? /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onBack
    }, "Back") : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement(Button, {
      variant: nextVariant,
      disabled: nextDisabled,
      onClick: onNext
    }, nextLabel));
  }

  // ---- Steps ---------------------------------------------------------------
  function StepUniversity({
    data,
    set,
    onNext
  }) {
    const [q, setQ] = React.useState("");
    const list = UNIS.filter(([n, l]) => (n + l).toLowerCase().includes(q.toLowerCase()));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepHeader, {
      title: "Which university are you at?",
      sub: "Select your school so we can confirm service availability."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Search your university...",
      value: q,
      onChange: e => setQ(e.target.value),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 18,
        color: "currentColor"
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        maxHeight: 260,
        overflowY: "auto",
        paddingRight: 4
      }
    }, list.map(([name, loc]) => {
      const sel = data.university === name;
      return /*#__PURE__*/React.createElement("button", {
        key: name,
        onClick: () => set({
          university: name
        }),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          textAlign: "left",
          cursor: "pointer",
          borderRadius: "var(--radius-md)",
          border: "none",
          background: sel ? "var(--purple-50)" : "var(--surface-card)",
          boxShadow: sel ? "inset 0 0 0 2px var(--brand-primary)" : "inset 0 0 0 1px var(--border-soft)",
          transition: "all 140ms ease"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "var(--radius-sm)",
          background: sel ? "var(--brand-primary)" : "var(--purple-100)",
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: sel ? "check" : "map-pin",
        size: 17,
        color: sel ? "#fff" : "var(--brand-primary)",
        strokeWidth: sel ? 3 : 2
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: "block",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--text-strong)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }, name), /*#__PURE__*/React.createElement("span", {
        style: {
          display: "block",
          fontSize: 12.5,
          color: "var(--text-muted)"
        }
      }, loc)));
    })), /*#__PURE__*/React.createElement(FooterNav, {
      onNext: onNext,
      nextDisabled: !data.university
    }));
  }
  function StepAddress({
    data,
    set,
    onNext,
    onBack
  }) {
    const ok = data.address && data.city && data.state && data.zip;
    const field = (key, ph, span) => /*#__PURE__*/React.createElement("div", {
      style: {
        gridColumn: span ? "1 / -1" : "auto"
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: ph,
      value: data[key] || "",
      onChange: e => set({
        [key]: e.target.value
      })
    }));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepHeader, {
      title: "Where should we pick up?",
      sub: "We'll come directly to this address on your pickup date."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14
      }
    }, field("address", "Street address", true), field("unit", "Apt / unit (optional)", true), field("city", "City"), field("state", "State"), field("zip", "ZIP code"), field("phone", "Phone number")), /*#__PURE__*/React.createElement(FooterNav, {
      onBack: onBack,
      onNext: onNext,
      nextDisabled: !ok
    }));
  }
  function StepBoxes({
    data,
    set,
    onNext,
    onBack
  }) {
    const plan = PLANS.find(p => p.id === data.plan) || PLANS[1];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepHeader, {
      title: "How many boxes do you need?",
      sub: "Choose a plan and set your box count. You can always add more later."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 12,
        marginBottom: 20
      }
    }, PLANS.map(p => {
      const sel = data.plan === p.id;
      return /*#__PURE__*/React.createElement("button", {
        key: p.id,
        onClick: () => set({
          plan: p.id,
          boxCount: Math.min(data.boxCount, p.maxBoxes)
        }),
        style: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 16,
          textAlign: "left",
          cursor: "pointer",
          borderRadius: "var(--radius-md)",
          border: "none",
          background: sel ? "var(--purple-50)" : "var(--surface-card)",
          boxShadow: sel ? "inset 0 0 0 2px var(--brand-primary)" : "inset 0 0 0 1px var(--border-soft)",
          transition: "all 140ms ease"
        }
      }, p.id === "standard" && /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          top: -10,
          left: 14
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: "lime",
        solid: true
      }, "Popular")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 15,
          fontWeight: 800,
          color: sel ? "var(--brand-primary)" : "var(--text-strong)"
        }
      }, p.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 600,
          color: "var(--text-muted)"
        }
      }, "$", p.price, "/sem")), /*#__PURE__*/React.createElement("ul", {
        style: {
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4
        }
      }, p.perks.map(perk => /*#__PURE__*/React.createElement("li", {
        key: perk,
        style: {
          fontSize: 12.5,
          color: "var(--text-muted)"
        }
      }, perk))));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: "28px 0",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface-sunken)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        borderRadius: "var(--radius-md)",
        background: "var(--brand-primary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "box",
      size: 26,
      color: "#fff"
    })), /*#__PURE__*/React.createElement(Counter, {
      value: data.boxCount,
      min: 1,
      max: plan.maxBoxes,
      onChange: n => set({
        boxCount: n
      }),
      caption: `max ${plan.maxBoxes} boxes on ${plan.name}`
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12.5,
        color: "var(--text-muted)"
      }
    }, "Each box is approx. 18\" \xD7 18\" \xD7 24\" \u2014 a standard moving box.")), /*#__PURE__*/React.createElement(FooterNav, {
      onBack: onBack,
      onNext: onNext
    }));
  }
  function StepDates({
    data,
    set,
    onNext,
    onBack
  }) {
    const [tab, setTab] = React.useState("pickup");
    const today = new Date();
    const minPickup = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    const minDelivery = data.pickupDate ? new Date(data.pickupDate.getTime() + 86400000) : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
    const ok = data.pickupDate && data.deliveryDate;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepHeader, {
      title: "Schedule pickup & delivery",
      sub: "Pick a date for us to collect your items, and choose when you want them back."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        padding: 6,
        borderRadius: "var(--radius-md)",
        background: "var(--surface-sunken)",
        marginBottom: 20
      }
    }, ["pickup", "delivery"].map(t => {
      const active = tab === t;
      const d = t === "pickup" ? data.pickupDate : data.deliveryDate;
      return /*#__PURE__*/React.createElement("button", {
        key: t,
        onClick: () => setTab(t),
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: "10px 16px",
          textAlign: "left",
          cursor: "pointer",
          borderRadius: "var(--radius-sm)",
          border: "none",
          background: active ? "var(--surface-card)" : "transparent",
          boxShadow: active ? "var(--shadow-sm)" : "none"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: active ? "var(--brand-primary)" : "var(--text-muted)"
        }
      }, t === "pickup" ? "Pickup date" : "Delivery date"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: d ? "var(--text-strong)" : "var(--text-muted)"
        }
      }, d ? d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : "Select date"));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        padding: 18,
        borderRadius: "var(--radius-lg)",
        background: "var(--surface-card)",
        boxShadow: "inset 0 0 0 1px var(--border-soft)"
      }
    }, tab === "pickup" ? /*#__PURE__*/React.createElement(MiniCalendar, {
      value: data.pickupDate,
      minDate: minPickup,
      accent: true,
      onSelect: d => {
        set({
          pickupDate: d,
          deliveryDate: undefined
        });
        setTab("delivery");
      }
    }) : /*#__PURE__*/React.createElement(MiniCalendar, {
      value: data.deliveryDate,
      minDate: minDelivery,
      onSelect: d => set({
        deliveryDate: d
      })
    })), data.pickupDate && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 16,
        padding: "12px 18px",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-sunken)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar-days",
      size: 18,
      color: "var(--brand-primary)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, "Pickup: ", fmt(data.pickupDate)), data.deliveryDate && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)"
      }
    }, " \xB7 Delivery: ", fmt(data.deliveryDate)))), /*#__PURE__*/React.createElement(FooterNav, {
      onBack: onBack,
      onNext: onNext,
      nextDisabled: !ok
    }));
  }
  function StepReview({
    data,
    onBack,
    onSubmit
  }) {
    const plan = PLANS.find(p => p.id === data.plan) || PLANS[1];
    const addr = [data.address, data.unit, data.city, data.state, data.zip].filter(Boolean).join(", ");
    const rows = [["graduation-cap", "University", data.university], ["map-pin", "Pickup address", addr], ["box", "Plan & boxes", `${plan.name} plan — ${data.boxCount} ${data.boxCount === 1 ? "box" : "boxes"}`], ["calendar", "Pickup date", fmt(data.pickupDate)], ["truck", "Delivery date", fmt(data.deliveryDate)]];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepHeader, {
      title: "Review your booking",
      sub: "Double-check everything before we confirm your pickup."
    }), /*#__PURE__*/React.createElement(Card, {
      padding: 0,
      style: {
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: 26
      }
    }, rows.map(([icon, label, value]) => /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-sunken)",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18,
      color: "var(--brand-primary)"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--text-muted)"
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 14.5,
        fontWeight: 700,
        color: "var(--text-strong)",
        marginTop: 2
      }
    }, value))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 26px",
        background: "var(--surface-sunken)"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--text-muted)"
      }
    }, "Total due today"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 26,
        fontWeight: 800,
        color: "var(--text-strong)"
      }
    }, "$", plan.price, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 400,
        color: "var(--text-muted)"
      }
    }, "/semester"))), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "circle-check",
        size: 14,
        color: "var(--success-fg)"
      })
    }, "$0 hidden fees"))), /*#__PURE__*/React.createElement("p", {
      style: {
        textAlign: "center",
        margin: "18px 0 0",
        fontSize: 12.5,
        lineHeight: 1.5,
        color: "var(--text-muted)"
      }
    }, "By confirming, you agree to the Storage2U ", /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: "var(--text-body)",
        fontWeight: 600
      }
    }, "Terms of Service"), " and ", /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: "var(--text-body)",
        fontWeight: 600
      }
    }, "Privacy Policy"), "."), /*#__PURE__*/React.createElement(FooterNav, {
      onBack: onBack,
      onNext: onSubmit,
      nextLabel: "Confirm booking"
    }));
  }
  function Confirmation({
    data,
    onReset
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "44px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 84,
        height: 84,
        borderRadius: "50%",
        background: "var(--brand-accent)",
        boxShadow: "var(--shadow-accent)",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 40,
      color: "var(--on-accent)",
      strokeWidth: 3
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        fontSize: 28,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-strong)"
      }
    }, "Booking confirmed!"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "12px auto 0",
        maxWidth: 380,
        fontSize: 15,
        lineHeight: 1.55,
        color: "var(--text-muted)"
      }
    }, "We'll email you a confirmation shortly. Our team will be at ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "var(--text-strong)"
      }
    }, data.address || "your address"), " on your pickup date."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: onReset
    }, "Book another pickup")));
  }
  const INITIAL = {
    university: "",
    address: "",
    unit: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    boxCount: 4,
    plan: "standard",
    pickupDate: undefined,
    deliveryDate: undefined
  };
  function BookingFlow() {
    const [step, setStep] = React.useState(1);
    const [data, setData] = React.useState(INITIAL);
    const [done, setDone] = React.useState(false);
    const set = f => setData(p => ({
      ...p,
      ...f
    }));
    const next = () => setStep(s => Math.min(s + 1, 5));
    const back = () => setStep(s => Math.max(s - 1, 1));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
        background: "var(--bg-app)"
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        height: 72,
        borderBottom: "1px solid var(--border-soft)",
        background: "var(--surface-card)",
        display: "flex",
        alignItems: "center",
        padding: "0 28px"
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: 32
    }), /*#__PURE__*/React.createElement("a", {
      href: "../marketing/index.html",
      style: {
        marginLeft: "auto",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-muted)",
        textDecoration: "none"
      }
    }, "Exit")), /*#__PURE__*/React.createElement("main", {
      style: {
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 24px 80px"
      }
    }, !done && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 36
      }
    }, /*#__PURE__*/React.createElement(StepIndicator, {
      steps: STEPS,
      current: step
    })), /*#__PURE__*/React.createElement(Card, {
      padding: 36
    }, done ? /*#__PURE__*/React.createElement(Confirmation, {
      data: data,
      onReset: () => {
        setData(INITIAL);
        setStep(1);
        setDone(false);
      }
    }) : step === 1 ? /*#__PURE__*/React.createElement(StepUniversity, {
      data: data,
      set: set,
      onNext: next
    }) : step === 2 ? /*#__PURE__*/React.createElement(StepAddress, {
      data: data,
      set: set,
      onNext: next,
      onBack: back
    }) : step === 3 ? /*#__PURE__*/React.createElement(StepBoxes, {
      data: data,
      set: set,
      onNext: next,
      onBack: back
    }) : step === 4 ? /*#__PURE__*/React.createElement(StepDates, {
      data: data,
      set: set,
      onNext: next,
      onBack: back
    }) : /*#__PURE__*/React.createElement(StepReview, {
      data: data,
      onBack: back,
      onSubmit: () => setDone(true)
    }))));
  }
  window.BookingFlow = BookingFlow;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/booking/BookingFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Dashboard.jsx
try { (() => {
// Storage2U — Customer dashboard. Exposes window.Dashboard.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const {
    Button,
    Card,
    Badge,
    StorageStatusBadge,
    Logo,
    Avatar
  } = DS;
  const Icon = window.Icon;
  const ACTIVE = [{
    id: "a1",
    university: "University of Michigan",
    pickupDate: "May 8, 2026",
    address: "812 S Forest Ave, Apt 4",
    city: "Ann Arbor, MI",
    plan: "Standard",
    boxes: 11,
    status: "in_storage"
  }, {
    id: "a2",
    university: "University of Michigan",
    pickupDate: "May 9, 2026",
    address: "1015 Church St",
    city: "Ann Arbor, MI",
    plan: "Starter",
    boxes: 4,
    status: "scheduled"
  }, {
    id: "a3",
    university: "University of Michigan",
    pickupDate: "May 6, 2026",
    address: "523 Packard St",
    city: "Ann Arbor, MI",
    plan: "Pro",
    boxes: 22,
    status: "out_for_delivery"
  }];
  const PAST = [{
    id: "p1",
    university: "University of Michigan",
    address: "812 S Forest Ave",
    pickup: "May 10, 2025",
    delivered: "Aug 24, 2025",
    plan: "Standard",
    boxes: 12,
    status: "delivered",
    total: "$89"
  }, {
    id: "p2",
    university: "University of Michigan",
    address: "1400 Hill St",
    pickup: "Dec 18, 2024",
    delivered: "Jan 12, 2025",
    plan: "Starter",
    boxes: 5,
    status: "delivered",
    total: "$49"
  }, {
    id: "p3",
    university: "University of Michigan",
    address: "705 Tappan Ave",
    pickup: "May 12, 2024",
    delivered: "—",
    plan: "Standard",
    boxes: 9,
    status: "cancelled",
    total: "$0"
  }];
  function Navbar() {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: 64,
        borderBottom: "1px solid var(--border-soft)",
        background: "var(--surface-card)",
        display: "flex",
        alignItems: "center",
        padding: "0 28px"
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: 30
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13.5,
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, "Maya Chen"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, "maya.chen@umich.edu")), /*#__PURE__*/React.createElement(Avatar, {
      name: "Maya Chen",
      size: 38
    })));
  }
  function ActiveCard({
    b,
    onRequest,
    requested
  }) {
    return /*#__PURE__*/React.createElement(Card, {
      padding: 0,
      style: {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "20px 22px 14px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14.5,
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, b.university), /*#__PURE__*/React.createElement(StorageStatusBadge, {
      status: requested ? "out_for_delivery" : b.status
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0 22px 18px"
      }
    }, /*#__PURE__*/React.createElement(Row, {
      icon: "calendar-days",
      label: "Pickup date",
      value: b.pickupDate
    }), /*#__PURE__*/React.createElement(Row, {
      icon: "map-pin",
      label: "Address",
      value: b.address,
      sub: b.city
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "9px 12px",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-sunken)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "box",
      size: 15,
      color: "var(--text-muted)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: "var(--text-muted)"
      }
    }, b.plan, " plan \xB7 ", b.boxes, " boxes"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16,
        borderTop: "1px solid var(--border-soft)",
        background: "var(--surface-sunken)"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: requested ? "outline" : "primary",
      fullWidth: true,
      disabled: requested || b.status === "out_for_delivery",
      onClick: () => onRequest(b.id),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "truck",
        size: 16,
        color: requested ? "var(--brand-primary)" : "#fff"
      })
    }, requested || b.status === "out_for_delivery" ? "Delivery requested" : "Request delivery")));
  }
  function Row({
    icon,
    label,
    value,
    sub
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 16,
      color: "var(--text-muted)",
      style: {
        marginTop: 2
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 10.5,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--text-muted)"
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 13.5,
        fontWeight: 600,
        color: "var(--text-strong)"
      }
    }, value), sub && /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 12.5,
        color: "var(--text-muted)"
      }
    }, sub)));
  }
  function SectionTitle({
    children
  }) {
    return /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "0 0 16px",
        fontSize: 12.5,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--text-muted)"
      }
    }, children);
  }
  function Dashboard() {
    const [requested, setRequested] = React.useState({});
    const onRequest = id => setRequested(r => ({
      ...r,
      [id]: true
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
        background: "var(--bg-app)"
      }
    }, /*#__PURE__*/React.createElement(Navbar, null), /*#__PURE__*/React.createElement("main", {
      style: {
        maxWidth: 1080,
        margin: "0 auto",
        padding: "36px 28px 80px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 36,
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-strong)"
      }
    }, "My Storage"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "6px 0 0",
        fontSize: 15,
        color: "var(--text-muted)"
      }
    }, "Manage your stored items and request deliveries.")), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 17,
        color: "var(--on-accent)"
      }),
      onClick: () => {
        window.location.href = "../booking/index.html";
      }
    }, "Book a pickup")), /*#__PURE__*/React.createElement("section", {
      style: {
        marginBottom: 44
      }
    }, /*#__PURE__*/React.createElement(SectionTitle, null, "Active storage"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 18
      }
    }, ACTIVE.map(b => /*#__PURE__*/React.createElement(ActiveCard, {
      key: b.id,
      b: b,
      onRequest: onRequest,
      requested: requested[b.id]
    })))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionTitle, null, "Past bookings"), /*#__PURE__*/React.createElement(Card, {
      padding: 0,
      style: {
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr auto",
        gap: 16,
        padding: "12px 22px",
        background: "var(--surface-sunken)",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--text-muted)"
      }
    }, /*#__PURE__*/React.createElement("span", null, "Location"), /*#__PURE__*/React.createElement("span", null, "Pickup"), /*#__PURE__*/React.createElement("span", null, "Delivered"), /*#__PURE__*/React.createElement("span", null, "Plan"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: "right"
      }
    }, "Status")), PAST.map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: b.id,
      style: {
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr auto",
        gap: 16,
        alignItems: "center",
        padding: "16px 22px",
        borderTop: i === 0 ? "none" : "1px solid var(--border-soft)"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13.5,
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, b.university), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, b.address)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: "var(--text-body)"
      }
    }, b.pickup), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: "var(--text-body)"
      }
    }, b.delivered), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: "var(--text-body)"
      }
    }, b.plan, " \xB7 ", b.boxes), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StorageStatusBadge, {
      status: b.status
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: "var(--text-muted)",
        minWidth: 34,
        textAlign: "right"
      }
    }, b.total))))))));
  }
  window.Dashboard = Dashboard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/MarketingSite.jsx
try { (() => {
// Storage2U — Marketing site sections. Exposes window.MarketingSite.
(function () {
  const DS = window.Storage2UDesignSystem_694705;
  const {
    Button,
    Card,
    Badge,
    Logo
  } = DS;
  const Icon = window.Icon;
  const MAX = 1180;
  function Navbar({
    onBook
  }) {
    const links = ["How It Works", "Universities", "Pricing"];
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(252,248,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-soft)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: MAX,
        margin: "0 auto",
        height: 72,
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: 34
    }), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 30
      }
    }, links.map(l => /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: "var(--text-body)",
        textDecoration: "none"
      }
    }, l))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: onBook
    }, "Book a Pickup"))));
  }
  function Hero({
    onBook
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        position: "relative",
        overflow: "hidden",
        background: "var(--brand-primary)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        opacity: 0.5,
        pointerEvents: "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        right: -120,
        top: -120,
        width: 520,
        height: 520,
        borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.14)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        right: -40,
        top: -40,
        width: 340,
        height: 340,
        borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.14)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: -90,
        bottom: -150,
        width: 360,
        height: 360,
        borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.12)"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: MAX,
        margin: "0 auto",
        padding: "104px 28px 120px",
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 640,
        display: "flex",
        flexDirection: "column",
        gap: 26,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "8px 16px",
        borderRadius: "var(--radius-pill)",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 2
      }
    }, [...Array(5)].map((_, i) => /*#__PURE__*/React.createElement(Icon, {
      key: i,
      name: "star",
      size: 13,
      color: "var(--brand-accent)",
      style: {
        fill: "var(--brand-accent)"
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: "rgba(255,255,255,0.85)"
      }
    }, "Trusted by 5,000+ students across 20+ universities")), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        fontSize: 60,
        fontWeight: 800,
        lineHeight: 1.04,
        letterSpacing: "-0.03em",
        color: "#fff"
      }
    }, "Storage made simple \u2014 ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--brand-accent)"
      }
    }, "we pick up,"), " you relax."), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 19,
        lineHeight: 1.5,
        color: "rgba(255,255,255,0.78)",
        maxWidth: 520
      }
    }, "Storage2U handles all the heavy lifting. Schedule a pickup, we store your stuff safely, and deliver it back whenever you need it. Perfect for end-of-semester moves."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      onClick: onBook,
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: 18
      })
    }, "Book a Pickup"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "lg",
      style: {
        color: "rgba(255,255,255,0.85)"
      }
    }, "See how it works")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 44,
        marginTop: 22,
        paddingTop: 28,
        borderTop: "1px solid rgba(255,255,255,0.18)"
      }
    }, [["20+", "Universities"], ["5K+", "Happy students"], ["$0", "Hidden fees"]].map(([v, l]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 30,
        fontWeight: 800,
        color: "#fff"
      }
    }, v), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "rgba(255,255,255,0.6)"
      }
    }, l)))))));
  }
  const STEPS = [{
    icon: "calendar-check",
    n: "01",
    title: "Schedule Your Pickup",
    body: "Choose a pickup date and time that works for you. We come directly to your dorm or apartment — no need to haul anything across campus."
  }, {
    icon: "package-check",
    n: "02",
    title: "We Store It Safely",
    body: "Your items go to our secure, climate-controlled warehouse. Everything is catalogued and photographed so you always know what's inside."
  }, {
    icon: "truck",
    n: "03",
    title: "We Deliver It Back",
    body: "When you're ready — start of a new semester or anytime — just request a delivery and we'll bring everything back to your door."
  }];
  function HowItWorks() {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--bg-app)",
        padding: "100px 28px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: MAX,
        margin: "0 auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 560,
        marginBottom: 56
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--brand-primary)"
      }
    }, "Simple Process"), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "12px 0 0",
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-strong)"
      }
    }, "How Storage2U works"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "16px 0 0",
        fontSize: 17,
        lineHeight: 1.55,
        color: "var(--text-muted)"
      }
    }, "Three easy steps and your storage worries are gone. We handle everything so you can focus on what actually matters.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 24
      }
    }, STEPS.map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.n,
      interactive: true,
      padding: 32,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 44,
        fontWeight: 800,
        color: "var(--purple-100)",
        lineHeight: 1
      }
    }, s.n), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 52,
        height: 52,
        borderRadius: "var(--radius-md)",
        background: "var(--brand-primary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 24,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: "0 0 8px",
        fontSize: 19,
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, s.title), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14.5,
        lineHeight: 1.55,
        color: "var(--text-muted)"
      }
    }, s.body)))))));
  }
  const UNIS = [["University of Michigan", "Ann Arbor, MI"], ["Ohio State University", "Columbus, OH"], ["University of Texas", "Austin, TX"], ["UCLA", "Los Angeles, CA"], ["NYU", "New York, NY"], ["Boston University", "Boston, MA"], ["University of Florida", "Gainesville, FL"], ["Penn State", "State College, PA"]];
  function Universities() {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--surface-muted)",
        padding: "100px 28px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: MAX,
        margin: "0 auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 40,
        gap: 24,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 560
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--brand-primary)"
      }
    }, "Campus Coverage"), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "12px 0 0",
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-strong)"
      }
    }, "We serve your university"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "16px 0 0",
        fontSize: 17,
        lineHeight: 1.55,
        color: "var(--text-muted)"
      }
    }, "Storage2U is available at 20+ universities across the country \u2014 and growing every semester.")), /*#__PURE__*/React.createElement(Badge, {
      tone: "purple"
    }, "20+ universities & counting")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 14
      }
    }, UNIS.map(([name, loc]) => /*#__PURE__*/React.createElement("div", {
      key: name,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "16px 18px",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-card)",
        boxShadow: "var(--shadow-sm)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: "var(--radius-sm)",
        background: "var(--purple-100)",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 18,
      color: "var(--brand-primary)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14,
        fontWeight: 700,
        color: "var(--text-strong)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, name), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12.5,
        color: "var(--text-muted)"
      }
    }, loc)))))));
  }
  const PLANS = [{
    name: "Starter",
    price: 49,
    desc: "Perfect for students with just a few boxes to store over break.",
    popular: false,
    features: ["Up to 5 boxes or bags", "1 free pickup included", "1 free delivery included", "90-day storage period", "Item photo catalogue", "Email support"],
    cta: "Get Started"
  }, {
    name: "Standard",
    price: 89,
    desc: "Our most popular plan — plenty of space for a full dorm room.",
    popular: true,
    features: ["Up to 15 boxes or bags", "1 free pickup included", "1 free delivery included", "180-day storage period", "Item photo catalogue", "Priority scheduling", "Chat & email support"],
    cta: "Book Now"
  }, {
    name: "Pro",
    price: 149,
    desc: "For students with lots of stuff or longer storage periods.",
    popular: false,
    features: ["Unlimited boxes or bags", "2 free pickups included", "2 free deliveries included", "365-day storage period", "Item photo catalogue", "Priority scheduling", "Dedicated account manager", "Free packing supplies"],
    cta: "Book Now"
  }];
  function Pricing({
    onBook
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--bg-app)",
        padding: "100px 28px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: MAX,
        margin: "0 auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 56,
        maxWidth: 540,
        marginLeft: "auto",
        marginRight: "auto"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--brand-primary)"
      }
    }, "Transparent Pricing"), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: "12px 0 0",
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color: "var(--text-strong)"
      }
    }, "Simple, honest pricing"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "16px 0 0",
        fontSize: 17,
        lineHeight: 1.55,
        color: "var(--text-muted)"
      }
    }, "No hidden fees, no surprise charges. Pick the plan that fits your semester and book in minutes.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 24,
        alignItems: "start"
      }
    }, PLANS.map(p => /*#__PURE__*/React.createElement(Card, {
      key: p.name,
      tone: p.popular ? "primary" : "default",
      padding: 32,
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        marginTop: p.popular ? -8 : 0,
        boxShadow: p.popular ? "var(--shadow-lg)" : "var(--shadow-sm)"
      }
    }, p.popular && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: -14,
        left: "50%",
        transform: "translateX(-50%)"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "lime",
      solid: true,
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "zap",
        size: 12,
        color: "var(--on-accent)",
        style: {
          fill: "var(--on-accent)"
        }
      })
    }, "Most Popular")), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: p.popular ? "rgba(255,255,255,0.7)" : "var(--text-muted)"
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 6,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 52,
        fontWeight: 800,
        color: p.popular ? "#fff" : "var(--text-strong)",
        lineHeight: 1
      }
    }, "$", p.price), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: p.popular ? "rgba(255,255,255,0.6)" : "var(--text-muted)"
      }
    }, "/semester")), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "14px 0 24px",
        fontSize: 14,
        lineHeight: 1.5,
        color: p.popular ? "rgba(255,255,255,0.75)" : "var(--text-muted)"
      }
    }, p.desc), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flex: 1
      }
    }, p.features.map(f => /*#__PURE__*/React.createElement("li", {
      key: f,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: p.popular ? "var(--brand-accent)" : "var(--purple-100)",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12,
      color: p.popular ? "var(--on-accent)" : "var(--brand-primary)",
      strokeWidth: 3
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: p.popular ? "rgba(255,255,255,0.9)" : "var(--text-body)"
      }
    }, f)))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: p.popular ? "secondary" : "primary",
      fullWidth: true,
      onClick: onBook
    }, p.cta))))), /*#__PURE__*/React.createElement("p", {
      style: {
        textAlign: "center",
        marginTop: 36,
        fontSize: 14,
        color: "var(--text-muted)"
      }
    }, "All plans include damage protection up to $500. Need a custom quote? ", /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: "var(--brand-primary)",
        fontWeight: 700
      }
    }, "Contact us"))));
  }
  function Footer() {
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        background: "var(--surface-inverse)",
        padding: "48px 28px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: MAX,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: 30,
      onColor: true
    }), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        gap: 26
      }
    }, ["How It Works", "Universities", "Pricing", "Contact"].map(l => /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      style: {
        fontSize: 14,
        color: "rgba(255,255,255,0.6)",
        textDecoration: "none"
      }
    }, l))), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12.5,
        color: "rgba(255,255,255,0.4)"
      }
    }, "\xA9 2026 Storage2U. All rights reserved.")));
  }
  function MarketingSite({
    onBook = () => {}
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        background: "var(--bg-app)"
      }
    }, /*#__PURE__*/React.createElement(Navbar, {
      onBook: onBook
    }), /*#__PURE__*/React.createElement(Hero, {
      onBook: onBook
    }), /*#__PURE__*/React.createElement(HowItWorks, null), /*#__PURE__*/React.createElement(Universities, null), /*#__PURE__*/React.createElement(Pricing, {
      onBook: onBook
    }), /*#__PURE__*/React.createElement(Footer, null));
  }
  window.MarketingSite = MarketingSite;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/MarketingSite.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StorageStatusBadge = __ds_scope.StorageStatusBadge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Counter = __ds_scope.Counter;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StepIndicator = __ds_scope.StepIndicator;

})();
