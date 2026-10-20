import { createContext, useContext } from 'react'

// PDF da aula atual (definido pela página do tópico)
export const SlideContext = createContext(null)

export const pdfUrl = (file, page) => `material/${file}${page ? `#page=${page}` : ''}`

/**
 * Citação de página do material do professor. Abre o PDF na página indicada.
 * <Slide p={12} />  usa o PDF da aula atual;  <Slide file="lista-1.pdf" p={3} />  usa outro arquivo.
 */
export default function Slide({ p, file, label }) {
  const ctx = useContext(SlideContext)
  const f = file || ctx
  if (!f) return null
  const pages = Array.isArray(p) ? p : [p]
  const text = label || (pages.length > 1 ? `slides, p. ${pages[0]}–${pages[pages.length - 1]}` : `slides, p. ${pages[0]}`)
  return (
    <a className="slide-ref" href={pdfUrl(f, pages[0])} target="_blank" rel="noopener noreferrer" title="Abrir o PDF do professor nesta página">
      {text}
    </a>
  )
}
