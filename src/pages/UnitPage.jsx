import { Link, useParams } from 'react-router-dom'
import { units, topicsOf } from '../content/course.js'
import { useProgress } from '../components/progress.jsx'
import { SIMS } from '../sims/registry.jsx'
import { pdfUrl } from '../components/SlideRef.jsx'

export default function UnitPage() {
  const { id } = useParams()
  const u = units.find((x) => String(x.id) === id)
  const { done, quiz } = useProgress()
  if (!u) return <div className="page"><h1>Unidade não encontrada</h1></div>
  const ts = topicsOf(u.id)
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">{u.title}</div>
        <h1>{u.name}</h1>
        <p className="lead">{u.summary}</p>
      </header>
      {u.preview && <div className="warn"><span className="tag">Conteúdo prévio</span>Os slides desta unidade ainda não foram incorporados à plataforma. Por enquanto, os textos daqui são uma prévia baseada na bibliografia da disciplina e serão revistos com os slides.</div>}
      <h2>Tópicos</h2>
      <table className="tbl">
        <thead><tr><th>#</th><th>Tópico</th><th>Simulações</th><th>Status</th></tr></thead>
        <tbody>
          {ts.map((t) => (
            <tr key={t.id}>
              <td className="num">{t.n}</td>
              <td><Link to={`/topico/${t.id}`}>{t.title}</Link></td>
              <td className="small">{Object.values(SIMS).filter((s) => s.topic === t.id).map((s) => s.title).join(', ') || '—'}</td>
              <td>{done[t.id] ? <span style={{ color: 'var(--good)' }}>estudado</span> : <span className="muted">a estudar</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ts.some((t) => t.pdf) && (
        <>
          <h2>Material do professor</h2>
          <ul>
            {ts.filter((t) => t.pdf).map((t) => <li key={t.id}><a href={pdfUrl(t.pdf)} target="_blank" rel="noopener noreferrer">Slides {t.slides}</a> <span className="muted small">({t.pages} p.)</span></li>)}
            {u.listaPdf && <li><a href={pdfUrl(u.listaPdf)} target="_blank" rel="noopener noreferrer">Lista de exercícios {u.lista} (enunciados e gabarito)</a></li>}
          </ul>
          <p className="small muted">Disponibilizado com autorização do professor.</p>
        </>
      )}
      <h2>Praticar</h2>
      <ul>
        {u.lista && <li><Link to={`/lista/${u.lista}`}>Lista {u.lista} com resolução passo a passo</Link></li>}
        <li><Link to={`/quiz/${u.id}`}>Quiz da {u.title.toLowerCase()}</Link>{quiz[u.id] ? ` — melhor resultado: ${quiz[u.id].best}/${quiz[u.id].total}` : ''}</li>
      </ul>
    </div>
  )
}
