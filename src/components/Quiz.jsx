import { useMemo, useState } from 'react'
import { useProgress } from './progress.jsx'

function shuffle(arr, seed) {
  const a = arr.slice()
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * questions: [{ q: nó, options: [nó...], correct: índice, explain: nó, topic }]
 */
export default function Quiz({ unit, questions }) {
  const { saveQuiz, quiz } = useProgress()
  const [round, setRound] = useState(1)
  const order = useMemo(() => shuffle(questions.map((_, i) => i), round * 7919 + 13), [questions, round])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState([])
  const [finished, setFinished] = useState(false)

  const q = questions[order[idx]]
  const best = quiz[unit]

  function pick(i) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.correct) setScore((s) => s + 1)
    else setWrong((w) => [...w, order[idx]])
  }
  function next() {
    if (idx + 1 >= questions.length) {
      setFinished(true)
      saveQuiz(unit, score, questions.length)
    } else {
      setIdx(idx + 1)
      setPicked(null)
    }
  }
  function restart() {
    setRound((r) => r + 1)
    setIdx(0); setPicked(null); setScore(0); setWrong([]); setFinished(false)
  }

  if (finished) {
    const pct = Math.round((100 * score) / questions.length)
    return (
      <div className="quiz-q">
        <h3 style={{ marginTop: 0 }}>Você acertou {score} de {questions.length} ({pct}%)</h3>
        <p>{pct >= 85 ? 'Domínio sólido desta unidade. Vale testar-se nas listas resolvendo sem abrir os passos.' : pct >= 60 ? 'Bom caminho. Revise os tópicos das questões que errou e refaça o quiz.' : 'Volte aos tópicos indicados abaixo, use as simulações e refaça o quiz em seguida.'}</p>
        {wrong.length > 0 && (
          <>
            <h4>Tópicos para revisar</h4>
            <ul>{[...new Set(wrong.map((w) => questions[w].topic).filter(Boolean))].map((t) => <li key={t}>{t}</li>)}</ul>
            <h4>Questões que você errou, com a resposta correta</h4>
            {wrong.map((w) => {
              const wq = questions[w]
              return (
                <div key={w} className="quiz-review">
                  <div>{wq.q}</div>
                  <div className="answer" style={{ margin: '.4rem 0' }}>
                    <span className="tag">Resposta correta: {'abcde'[wq.correct]})</span>
                    <div>{wq.options[wq.correct]}</div>
                  </div>
                  <div><b className="ui" style={{ fontSize: '.92rem' }}>Explicação: </b>{wq.explain}</div>
                </div>
              )
            })}
          </>
        )}
        <div className="btn-row"><button className="btn primary" onClick={restart}>Refazer o quiz em outra ordem</button></div>
      </div>
    )
  }

  return (
    <div>
      <div className="progress-line">Questão {idx + 1} de {questions.length} · acertos: {score}{best ? ` · melhor resultado: ${best.best}/${best.total}` : ''}</div>
      <div className="quiz-progress"><div style={{ width: `${(100 * idx) / questions.length}%` }} /></div>
      <div className="quiz-q">
        {q.topic && <div className="ex-topic">{q.topic}</div>}
        <div style={{ fontSize: '1.05rem' }}>{q.q}</div>
        <div className="quiz-opts">
          {q.options.map((o, i) => {
            let cls = 'quiz-opt'
            if (picked !== null) {
              if (i === q.correct) cls += ' correct'
              else if (i === picked) cls += ' wrong'
            }
            return (
              <button key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>
                <span className="letter">{'abcde'[i]})</span><span>{o}</span>
              </button>
            )
          })}
        </div>
        {picked !== null && (
          <div className="quiz-feedback">
            {picked === q.correct ? (
              <p className="answer-key"><span className="verdict ok">Correto.</span></p>
            ) : (
              <>
                <p className="answer-key"><span className="verdict no">Ainda não.</span> Você marcou a alternativa <b>{'abcde'[picked]})</b>.</p>
                <div className="answer" style={{ margin: '.4rem 0 .6rem' }}>
                  <span className="tag">Resposta correta: {'abcde'[q.correct]})</span>
                  <div>{q.options[q.correct]}</div>
                </div>
              </>
            )}
            <div><b className="ui" style={{ fontSize: '.92rem' }}>Explicação: </b>{q.explain}</div>
            <div className="btn-row"><button className="btn primary" onClick={next}>{idx + 1 >= questions.length ? 'Ver resultado' : 'Próxima questão'}</button></div>
          </div>
        )}
      </div>
    </div>
  )
}
