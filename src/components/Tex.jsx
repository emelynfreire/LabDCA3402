import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useMemo } from 'react'

const macros = {
  '\\sen': '\\operatorname{sen}',
  '\\L': '\\mathcal{L}',
  '\\Re': '\\operatorname{Re}',
  '\\Im': '\\operatorname{Im}',
  '\\posto': '\\operatorname{posto}',
}

function render(tex, display) {
  try {
    return katex.renderToString(tex, { displayMode: display, throwOnError: false, macros, strict: false, trust: false })
  } catch (e) {
    return `<code>${tex}</code>`
  }
}

/** Fórmula inline: <M>{String.raw`G(s)`}</M> */
export function M({ children }) {
  const tex = Array.isArray(children) ? children.join('') : String(children ?? '')
  const html = useMemo(() => render(tex, false), [tex])
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

/** Fórmula em destaque (bloco) */
export function MM({ children }) {
  const tex = Array.isArray(children) ? children.join('') : String(children ?? '')
  const html = useMemo(() => render(tex, true), [tex])
  return <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />
}
