import { lazy, Suspense, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { topics, topicById, units, brDate } from '../content/course.js'
import { useProgress } from '../components/progress.jsx'
import { SlideContext, pdfUrl } from '../components/SlideRef.jsx'

const modules = import.meta.glob('../content/topics/*.jsx')
const cache = {}
function getTopic(id) {
  const key = `../content/topics/${id}.jsx`
  if (!modules[key]) return null
  if (!cache[id]) cache[id] = lazy(modules[key])
  return cache[id]
}

export default function TopicPage() {
  const { id } = useParams()
  const t = topicById(id)
  const { done, toggleDone } = useProgress()
  const Content = useMemo(() => getTopic(id), [id])
  if (!t || !Content) return <div className="page"><h1>Tópico não encontrado</h1><p><Link to="/">Voltar ao início</Link></p></div>
  const u = units.find((x) => x.id === t.unit)
  const i = topics.indexOf(t)
  const prev = topics[i - 1], next = topics[i + 1]
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker"><Link to={`/unidade/${u.id}`}>{u.title}</Link> · tópico {t.n} · aula de {brDate(t.date)}</div>
        <h1>{t.title}</h1>
        {t.pdf && (
          <p className="slides-line">
            <a className="btn small" href={pdfUrl(t.pdf)} target="_blank" rel="noopener noreferrer">Abrir os slides do professor (PDF, {t.pages} p.)</a>
            <span className="muted small">Os links “slides, p. N” ao longo do texto abrem o PDF na página correspondente.</span>
          </p>
        )}
      </header>
      {u.preview && <div className="warn"><span className="tag">Material ainda não disponibilizado</span>O professor ainda vai disponibilizar o material da Unidade 3. Até lá, este texto é uma prévia baseada na bibliografia da disciplina (Lathi; apostila de Medeiros e Maitelli) e será revisto com os slides.</div>}
      {!t.slides && !u.preview && <div className="note"><span className="tag">Sobre este tópico</span>Não há slides desta aula no material recebido. O conteúdo abaixo segue a abordagem usual da disciplina e usa exemplos dos próprios slides (como o tanque da aula 4); confira com suas anotações.</div>}
      <SlideContext.Provider value={t.pdf || null}>
        <Suspense fallback={<div className="loading">Carregando conteúdo…</div>}>
          <Content />
        </Suspense>
      </SlideContext.Provider>
      <div className="mark-done btn-row">
        <button className={'btn ' + (done[t.id] ? '' : 'primary')} onClick={() => toggleDone(t.id)}>
          {done[t.id] ? '✓ Tópico marcado como estudado' : 'Marcar tópico como estudado'}
        </button>
      </div>
      <nav className="topic-nav" aria-label="Navegação entre tópicos">
        {prev ? <Link to={`/topico/${prev.id}`}><small>anterior</small>{prev.title}</Link> : <span />}
        {next ? <Link to={`/topico/${next.id}`} style={{ textAlign: 'right' }}><small>próximo</small>{next.title}</Link> : <span />}
      </nav>
    </div>
  )
}
