import { lazy, Suspense, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProgress } from '../components/progress.jsx'
import { pdfUrl } from '../components/SlideRef.jsx'

const pdfs = { 1: { file: 'lista-1.pdf', gab: 5 }, 2: { file: 'lista-2.pdf', gab: 4 } }

const listas = {
  1: lazy(() => import('../content/lista1.jsx')),
  2: lazy(() => import('../content/lista2.jsx')),
}

export default function ListaPage() {
  const { n } = useParams()
  const L = listas[n]
  const { exercises } = useProgress()
  const count = useMemo(() => Object.entries(exercises).filter(([k, v]) => k.startsWith(`l${n}-`) && v === 'ok').length, [exercises, n])
  const rev = Object.entries(exercises).filter(([k, v]) => k.startsWith(`l${n}-`) && v === 'rev').map(([k]) => k)
  if (!L) return <div className="page"><h1>Lista não encontrada</h1></div>
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Lista de exercícios {n} · {n === '1' ? 'Unidade 1' : 'Unidade 2'}</div>
        <h1>Lista {n} resolvida passo a passo</h1>
        <p className="lead">Tente cada questão antes de abrir a solução. Revele um passo por vez: muitas vezes o primeiro já destrava o resto.</p>
        {pdfs[n] && (
          <p className="slides-line">
            <a className="btn small" href={pdfUrl(pdfs[n].file)} target="_blank" rel="noopener noreferrer">Abrir a lista do professor (PDF)</a>
            <a className="btn small ghost" href={pdfUrl(pdfs[n].file, pdfs[n].gab)} target="_blank" rel="noopener noreferrer">Gabarito oficial (p. {pdfs[n].gab})</a>
          </p>
        )}
        <p className="progress-line">{count} questões marcadas como resolvidas{rev.length ? ` · para revisar: ${rev.map((r) => r.split('-').slice(1).join('-')).join(', ')}` : ''}</p>
      </header>
      <Suspense fallback={<div className="loading">Carregando lista…</div>}>
        <L />
      </Suspense>
      <hr />
      <p>Depois da lista, <Link to={`/quiz/${n}`}>faça o quiz da unidade</Link>.</p>
    </div>
  )
}
