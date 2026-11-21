// Shared body of /privacy and /terms: title, date, contents, sections. Each
// section keeps a stable id so other pages can link to it (/terms#refunds).

import type { ReactNode } from "react";
import { dictionaries, type Locale } from "~/lib/i18n";
import type { LegalBlock, LegalDoc } from "~/lib/legal";
import { fill } from "~/lib/site-facts";

/** **bold**, `code` and [text](href); everything else is plain text. */
function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={m.index}>{m[1]}</strong>);
    else if (m[2]) parts.push(<code key={m.index}>{m[2]}</code>);
    else {
      const href = m[4] ?? "";
      const external = /^https?:\/\//.test(href);
      parts.push(
        <a key={m.index} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {m[3]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return (
      <p>
        <Inline text={block} />
      </p>
    );
  }
  return (
    <ul>
      {block.ul.map((item) => (
        <li key={item}>
          <Inline text={item} />
        </li>
      ))}
    </ul>
  );
}

export function LegalDocument({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  const t = dictionaries[locale].legal;
  return (
    <article className="section wrap wrap--text">
      <h1 className="display-1">{doc.title}</h1>
      <p className="lede">{fill(t.effective, { date: doc.date })}</p>
      <div className="prose" style={{ marginTop: "var(--space-8)" }}>
        {doc.intro.map((block, i) => (
          <Block key={i} block={block} />
        ))}
        <nav className="toc" aria-labelledby="toc-title">
          <strong id="toc-title">{t.contents}</strong>
          <ol>
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.head}</a>
              </li>
            ))}
          </ol>
        </nav>
        {doc.sections.map((s) => (
          <section key={s.id} aria-labelledby={s.id}>
            <h2 id={s.id}>{s.head}</h2>
            {s.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
