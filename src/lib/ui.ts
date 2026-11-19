// Meridian button classes for links.
//
// A link that looks like a button stays an <a>: navigation is a link. Meridian's
// buttonVariants() gives these classes, but it lives in a "use client" module,
// so a server component cannot call it. This mirrors its output for the variants
// the site uses. When Meridian 1.26.0 ships Button shape="pill", the pill shape
// arrives here too.

type Variant = "primary" | "secondary" | "ghost" | "brand";
type Size = "sm" | "md" | "lg";

export function btn(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return `ef-btn ef-btn--${variant} ef-btn--${size}${extra ? ` ${extra}` : ""}`;
}
