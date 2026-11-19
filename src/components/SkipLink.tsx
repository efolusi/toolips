// First focusable element on every page (rendered by app/layout.tsx): one Tab
// press moves a keyboard user past the header or the tool bar into the page.
//
// Same contract as Meridian's SkipLink (1.21.9+), which Toolips does not ship
// yet. Every page renders exactly one <main id="main" tabIndex={-1}>: without
// the tabIndex, Safari and Firefox scroll to the landmark but leave focus in
// the header, so the next Tab lands back in the navigation. Styles are
// `.tlp-skip` in app/globals.css.

export function SkipLink({ label }: { label: string }) {
  return (
    <a className="tlp-skip" href="#main">
      {label}
    </a>
  );
}
