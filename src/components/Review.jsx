import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { REVIEW } from '../content/review/index.js'

const cache = {}
function getCard(k) {
  if (!REVIEW[k]) return null
  if (!cache[k]) cache[k] = lazy(REVIEW[k].load)
  return cache[k]
}

/** Cartão de revisão completo (usado na página /revisao/:k e aberto dentro dos exercícios). */
export function ReviewCard({ k, inline = false, onClose }) {
  const C = getCard(k)
  const meta = REVIEW[k]
  if (!C) return null
  return (
    <section className={'review-card' + (inline ? ' inline' : '')}>
      {inline && (
        <div className="review-head">
          <span>{meta.area !== meta.title && <span className="review-area">{meta.area}</span>} {meta.title}</span>
          <span className="review-actions">
            <Link to={`/revisao/${k}`} className="small">abrir em página própria</Link>
            {onClose && <button className="btn small ghost" onClick={onClose}>Fechar</button>}
          </span>
        </div>
      )}
      <Suspense fallback={<div className="loading">Carregando revisão…</div>}>
        <C />
      </Suspense>
    </section>
  )
}

/**
 * Botões "Revisar o básico" que abrem o cartão de revisão ali mesmo, sem sair da página.
 * keys: lista de chaves de REVIEW
 */
export function ReviewChips({ keys = [], label = 'Precisa revisar o básico antes?' }) {
  const [open, setOpen] = useState(null)
  const valid = keys.filter((k) => REVIEW[k])
  if (!valid.length) return null
  return (
    <div className="review-chips">
      <div className="chip-row">
        <span className="chip-label">{label}</span>
        {valid.map((k) => (
          <button key={k} className={'chip' + (open === k ? ' on' : '')} aria-expanded={open === k} onClick={() => setOpen(open === k ? null : k)}>
            {REVIEW[k].title}
          </button>
        ))}
      </div>
      {open && <ReviewCard k={open} inline onClose={() => setOpen(null)} />}
    </div>
  )
}

/** Seção de um cartão */
export function RSec({ title, children }) {
  return (
    <div className="rsec">
      {title && <h4>{title}</h4>}
      {children}
    </div>
  )
}

/** Exemplo resolvido revelado um passo por vez (sem registro de progresso). */
export function Passos({ titulo, children, steps = [], resposta }) {
  const [n, setN] = useState(0)
  const all = n >= steps.length
  return (
    <div className="passos">
      {titulo && <div className="passos-title">{titulo}</div>}
      <div>{children}</div>
      {n > 0 && (
        <ol className="steps">
          {steps.slice(0, n).map((s, i) => (
            <li key={i}>{s.title && <span className="step-title">{s.title}</span>}{s.body}</li>
          ))}
        </ol>
      )}
      {all && n > 0 && resposta && <div className="answer"><span className="tag">Resultado</span>{resposta}</div>}
      <div className="btn-row">
        {!all && <button className="btn small primary" onClick={() => setN(n + 1)}>{n === 0 ? 'Ver o primeiro passo' : `Próximo passo (${n + 1} de ${steps.length})`}</button>}
        {!all && n < steps.length - 1 && <button className="btn small ghost" onClick={() => setN(steps.length)}>Mostrar tudo</button>}
        {all && n > 0 && <button className="btn small ghost" onClick={() => setN(0)}>Recomeçar</button>}
      </div>
    </div>
  )
}

/** Teste rápido: pergunta com resposta revelada sob demanda. */
export function Check({ q, children }) {
  const [show, setShow] = useState(false)
  return (
    <div className="check">
      <div><b className="ui">Teste rápido.</b> {q}</div>
      {show ? <div className="check-answer">{children}</div> : <button className="btn small" onClick={() => setShow(true)}>Ver resposta</button>}
    </div>
  )
}

/** "Onde aparece na disciplina" */
export function Usos({ children }) {
  return <div className="usos"><span className="tag">Onde aparece em DCA3402</span>{children}</div>
}
