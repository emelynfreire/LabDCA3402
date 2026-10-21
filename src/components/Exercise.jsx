import { useState } from 'react'
import { useProgress } from './progress.jsx'
import Slide from './SlideRef.jsx'
import { ReviewChips } from './Review.jsx'

/**
 * Exercício com solução revelada passo a passo.
 * steps: [{ title, body }]; answer: nó React com a resposta final
 */
export default function Exercise({ id, num, topic, children, steps = [], answer, hint, src, review }) {
  const [shown, setShown] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const { exercises, markExercise } = useProgress()
  const status = exercises[id]
  const all = shown >= steps.length
  return (
    <article className="ex" id={id}>
      <div className="ex-head">
        <span className="ex-num">{num}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {(topic || src) && <div className="ex-topic">{topic}{src && <Slide file={src.file} p={src.p} label={src.label} />}</div>}
          <div className="ex-statement">{children}</div>
        </div>
      </div>
      {review && <ReviewChips keys={review} />}
      {shown > 0 && (
        <ol className="steps">
          {steps.slice(0, shown).map((s, i) => (
            <li key={i}>
              {s.title && <span className="step-title">{s.title}</span>}
              {s.body}
              {s.review && <ReviewChips keys={s.review} label="Revisar:" />}
            </li>
          ))}
        </ol>
      )}
      {all && shown > 0 && answer && (
        <div className="answer"><span className="tag">Resposta</span>{answer}</div>
      )}
      {showHint && hint && <div className="tip"><span className="tag">Dica</span>{hint}</div>}
      <div className="btn-row">
        {!all && (
          <button className="btn primary small" onClick={() => setShown((n) => n + 1)}>
            {shown === 0 ? 'Ver o primeiro passo' : `Próximo passo (${shown + 1} de ${steps.length})`}
          </button>
        )}
        {!all && shown < steps.length - 1 && <button className="btn small ghost" onClick={() => setShown(steps.length)}>Mostrar a solução completa</button>}
        {all && shown > 0 && <button className="btn small ghost" onClick={() => setShown(0)}>Ocultar solução</button>}
        {hint && !showHint && shown === 0 && <button className="btn small ghost" onClick={() => setShowHint(true)}>Pedir uma dica</button>}
        <span style={{ flex: 1 }} />
        <button className="btn small ghost" aria-pressed={status === 'ok'} onClick={() => markExercise(id, status === 'ok' ? null : 'ok')}
          style={status === 'ok' ? { borderColor: 'var(--good)', color: 'var(--good)' } : undefined}>
          {status === 'ok' ? '✓ Resolvi sozinho' : 'Marcar como resolvido'}
        </button>
        <button className="btn small ghost" aria-pressed={status === 'rev'} onClick={() => markExercise(id, status === 'rev' ? null : 'rev')}
          style={status === 'rev' ? { borderColor: 'var(--amber)', color: 'var(--amber)' } : undefined}>
          {status === 'rev' ? '↺ Revisar depois' : 'Revisar depois'}
        </button>
      </div>
    </article>
  )
}
