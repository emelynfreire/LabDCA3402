import { Link, useParams } from 'react-router-dom'
import { FLOWS } from '../content/flows.jsx'
import Flowchart from '../components/Flowchart.jsx'
import { topicById } from '../content/course.js'

export default function FluxosPage() {
  const { id } = useParams()
  if (id) {
    const f = FLOWS[id]
    if (!f) return <div className="page"><h1>Fluxograma não encontrado</h1><p><Link to="/fluxos">Ver todos</Link></p></div>
    return (
      <div className="page wide">
        <header className="page-head">
          <div className="kicker"><Link to="/fluxos">Fluxogramas</Link></div>
          <h1>{f.title}</h1>
          <p className="lead">{f.desc}</p>
          <p className="small">Tópicos: {f.topics.map((t, i) => <span key={t}>{i > 0 && ' · '}<Link to={`/topico/${t}`}>{topicById(t)?.title}</Link></span>)}</p>
        </header>
        <Flowchart flow={f} />
      </div>
    )
  }
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Qual caminho seguir em cada tipo de questão</div>
        <h1>Fluxogramas</h1>
        <p className="lead">Cada fluxograma mostra a sequência de decisões e contas de um método. Use o modo guiado: responda às perguntas e o caminho vai se acendendo, com a explicação, o slide correspondente e a revisão do básico em cada etapa.</p>
      </header>
      <div className="lab-list">
        {Object.entries(FLOWS).map(([k, f]) => (
          <Link key={k} to={`/fluxos/${k}`}><b>{f.title}</b><span>{f.desc}</span></Link>
        ))}
      </div>
    </div>
  )
}

/** Fluxograma embutido num tópico */
export function FlowSlot({ id }) {
  const f = FLOWS[id]
  if (!f) return null
  return (
    <section className="sim breakout">
      <div className="sim-head"><span className="sim-title">Fluxograma: {f.title}</span><span className="sim-sub">clique nas caixas ou siga o modo guiado</span></div>
      <div style={{ padding: '.9rem' }}><Flowchart flow={f} /></div>
    </section>
  )
}
