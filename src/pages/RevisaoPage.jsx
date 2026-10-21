import { Link, useParams } from 'react-router-dom'
import { REVIEW, AREAS, TOPIC_PREREQS } from '../content/review/index.js'
import { ReviewCard } from '../components/Review.jsx'
import { topicById } from '../content/course.js'

export default function RevisaoPage() {
  const { k } = useParams()
  if (k) {
    const meta = REVIEW[k]
    if (!meta) return <div className="page"><h1>Revisão não encontrada</h1><p><Link to="/revisao">Ver todas as revisões</Link></p></div>
    const usedIn = Object.entries(TOPIC_PREREQS).filter(([, ks]) => ks.includes(k)).map(([t]) => topicById(t)).filter(Boolean)
    const sameArea = Object.entries(REVIEW).filter(([kk, v]) => v.area === meta.area && kk !== k)
    return (
      <div className="page">
        <header className="page-head">
          <div className="kicker"><Link to="/revisao">Revisão de pré-requisitos</Link> · {meta.area}</div>
          <h1>{meta.title}</h1>
          <p className="lead">{meta.desc}</p>
        </header>
        <ReviewCard k={k} />
        {usedIn.length > 0 && (
          <>
            <h2>Tópicos da disciplina que usam isto</h2>
            <ul>{usedIn.map((t) => <li key={t.id}><Link to={`/topico/${t.id}`}>{t.title}</Link></li>)}</ul>
          </>
        )}
        <h3>Outras revisões de {meta.area}</h3>
        <ul>{sameArea.map(([kk, v]) => <li key={kk}><Link to={`/revisao/${kk}`}>{v.title}</Link></li>)}</ul>
      </div>
    )
  }
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Para quem já cursou Cálculo e Álgebra Linear e quer relembrar</div>
        <h1>Revisão de pré-requisitos</h1>
        <p className="lead">O conteúdo de Cálculo, Álgebra, números complexos e Álgebra Linear que os exercícios da disciplina usam, com exemplos tirados das próprias aulas e listas, resolvidos passo a passo.</p>
      </header>
      <div className="tip"><span className="tag">Como usar</span>Não é preciso ler tudo antes. Nas listas e nos tópicos, cada exercício tem botões "Precisa revisar o básico antes?" que abrem a revisão certa ali mesmo, sem sair da questão.</div>
      {AREAS.map((a) => (
        <section key={a}>
          <h2>{a}</h2>
          <div className="lab-list">
            {Object.entries(REVIEW).filter(([, v]) => v.area === a).map(([k, v]) => (
              <Link key={k} to={`/revisao/${k}`}><b>{v.title}</b><span>{v.desc}</span></Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
