import { useState } from 'react'
import { Seg } from './Controls.jsx'
import { referencia } from '../lib/cite.js'

const FORMATOS = [
  { value: 'abnt', label: 'ABNT' },
  { value: 'apa', label: 'APA' },
  { value: 'bibtex', label: 'BibTeX' },
]

/** Referência pronta para copiar. sim = { key, title } para citar uma simulação específica. */
export default function CiteBox({ sim = null, initial = 'abnt' }) {
  const [fmt, setFmt] = useState(initial)
  const [copied, setCopied] = useState(false)
  const ref = referencia(fmt, { sim })
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = ref.text
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* sem área de transferência */ }
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="cite-box">
      <div className="cite-head">
        <Seg label="formato da referência" value={fmt} onChange={setFmt} options={FORMATOS} />
        <button className="btn small primary" onClick={copy}>{copied ? 'Copiado ✓' : 'Copiar referência'}</button>
      </div>
      {fmt === 'bibtex'
        ? <pre className="cite-text bib">{ref.text}</pre>
        : <p className="cite-text" dangerouslySetInnerHTML={{ __html: ref.html }} />}
      <p className="small muted">A data de acesso é a de hoje; ajuste para o dia em que você usou a plataforma.</p>
    </div>
  )
}
