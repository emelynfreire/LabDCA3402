import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { units } from '../content/course.js'

const quizzes = {
  1: lazy(() => import('../content/quiz1.jsx')),
  2: lazy(() => import('../content/quiz2.jsx')),
  3: lazy(() => import('../content/quiz3.jsx')),
}

export default function QuizPage() {
  const { u } = useParams()
  const Q = quizzes[u]
  const unit = units.find((x) => String(x.id) === u)
  if (!Q || !unit) return <div className="page"><h1>Quiz não encontrado</h1></div>
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">{unit.title} · {unit.name}</div>
        <h1>Quiz da {unit.title.toLowerCase()}</h1>
        <p className="lead">Questões conceituais e de cálculo rápido. Cada resposta vem com a explicação; ao final você vê quais tópicos revisar.</p>
      </header>
      {unit.preview && <div className="warn"><span className="tag">Conteúdo prévio</span>Os slides da Unidade 3 ainda não foram incorporados à plataforma. Estas questões são introdutórias, baseadas na bibliografia, e serão revistas com os slides.</div>}
      <Suspense fallback={<div className="loading">Carregando…</div>}>
        <Q />
      </Suspense>
    </div>
  )
}
