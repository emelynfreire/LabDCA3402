import { Link, useSearchParams } from 'react-router-dom'
import { SIMS, SimSlot } from '../sims/registry.jsx'
import { topicById, units } from '../content/course.js'

export default function LabPage() {
  const [params, setParams] = useSearchParams()
  const sel = params.get('sim')
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Todas as simulações em um só lugar</div>
        <h1>Laboratório</h1>
        <p className="lead">Escolha uma simulação. As marcadas com 3D podem ser giradas com o mouse (ou com o dedo, no celular).</p>
      </header>
      {sel && SIMS[sel] && (
        <>
          <div className="btn-row"><button className="btn small ghost" onClick={() => setParams({})}>Voltar à lista</button>
            <Link className="btn small ghost" to={`/topico/${SIMS[sel].topic}`}>Ler o tópico: {topicById(SIMS[sel].topic)?.title}</Link></div>
          <SimSlot name={sel} />
        </>
      )}
      {units.map((u) => {
        const list = Object.entries(SIMS).filter(([, s]) => topicById(s.topic)?.unit === u.id)
        if (!list.length) return null
        return (
          <section key={u.id}>
            <h2>{u.title}: {u.name}</h2>
            <div className="lab-list">
              {list.map(([k, s]) => (
                <a key={k} href={`#/laboratorio?sim=${k}`} onClick={(e) => { e.preventDefault(); setParams({ sim: k }); window.scrollTo(0, 0) }}>
                  <b>{s.title}{s.d3 ? ' · 3D' : ''}</b>
                  <span>{s.desc}</span>
                </a>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
