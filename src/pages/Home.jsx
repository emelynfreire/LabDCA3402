import { Link } from 'react-router-dom'
import { course, units, topicsOf, schedule, brDate } from '../content/course.js'
import { useProgress } from '../components/progress.jsx'
import { SimSlot } from '../sims/registry.jsx'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Home() {
  const { done, quiz } = useProgress()
  const today = todayISO()
  const nextIdx = schedule.findIndex((s) => s.date >= today)
  const upcoming = nextIdx < 0 ? schedule.slice(-5) : schedule.slice(Math.max(0, nextIdx - 2), nextIdx + 5)
  const nextExam = schedule.find((s) => s.exam && s.date >= today)
  const examUnit = nextExam ? units.find((u) => u.exam?.date === nextExam.date) : null

  return (
    <div className="page wide">
      <section className="hero">
        <div>
          <h1>Plataforma de estudos de Modelagem e Análise Linear de Sistemas</h1>
          <p className="lead">Teoria resumida a partir dos slides da disciplina, simulações em 3D que você pode manipular, as listas resolvidas passo a passo e um quiz por unidade.</p>
          <div className="btn-row">
            <Link className="btn primary" to="/topico/introducao">Começar pela Unidade 1</Link>
            {examUnit && <Link className="btn" to={`/unidade/${examUnit.id}`}>Revisar para a {examUnit.exam.label} ({brDate(nextExam.date)})</Link>}
          </div>
        </div>
        <div className="hero-panel">
          <SimSlot name="poles" compact initial="sub" />
        </div>
      </section>

      <section className="unit-grid">
        {units.map((u) => {
          const ts = topicsOf(u.id)
          const nDone = ts.filter((t) => done[t.id]).length
          const q = quiz[u.id]
          return (
            <div key={u.id} className="unit-col">
              <h3><Link to={`/unidade/${u.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{u.title}: {u.name}</Link></h3>
              <div className="progress-line">{nDone} de {ts.length} tópicos estudados{q ? ` · quiz: ${q.best}/${q.total}` : ''}</div>
              <div className="meter"><div style={{ width: `${(100 * nDone) / ts.length}%` }} /></div>
              <ol start={ts[0].n}>
                {ts.map((t) => <li key={t.id}><Link to={`/topico/${t.id}`}>{t.title}</Link>{done[t.id] && <span className="done" style={{ color: 'var(--good)' }}> ✓</span>}</li>)}
              </ol>
              <div className="links">
                {u.lista && <Link to={`/lista/${u.lista}`}>Lista {u.lista} resolvida</Link>}
                <Link to={`/quiz/${u.id}`}>Quiz</Link>
                {u.preview && <span className="muted">conteúdo prévio</span>}
              </div>
            </div>
          )
        })}
      </section>

      <hr />
      <section className="home-bottom">
        <div>
          <h2 style={{ marginTop: 0 }}>Cronograma da turma</h2>
          <ul className="timeline">
            {upcoming.map((s) => (
              <li key={s.date + s.label} className={[s.exam ? 'exam' : '', s.date < today ? 'past' : '', schedule[nextIdx] === s ? 'now' : ''].join(' ')}>
                <span className="date">{brDate(s.date)}</span>{s.label}
              </li>
            ))}
          </ul>
          <p className="small muted">Datas conforme o SIGAA. Confirme sempre os avisos do professor.</p>
        </div>
        <div>
          <h2 style={{ marginTop: 0 }}>Como estudar por aqui</h2>
          <ol>
            <li>Leia o tópico e mexa nas simulações antes de ver as fórmulas: tente prever o que vai acontecer.</li>
            <li>Na lista, tente resolver cada questão sozinho. Peça um passo de cada vez só quando travar.</li>
            <li>Faça o quiz da unidade. Ele indica quais tópicos revisar.</li>
            <li>Travou numa conta de Cálculo, Álgebra ou Álgebra Linear? Cada exercício tem botões “Revisar o básico” que abrem a revisão ali mesmo. Todas estão em <Link to="/revisao">Revisão de pré-requisitos</Link>.</li>
            <li>Na dúvida sobre qual caminho seguir numa questão, siga o <Link to="/fluxos">fluxograma do método</Link> no modo guiado.</li>
            <li>Marque os tópicos estudados: o progresso fica salvo neste navegador.</li>
          </ol>
          <p><Link to="/laboratorio">Abrir o laboratório com todas as simulações</Link> · <Link to="/formulario">Formulário</Link></p>
        </div>
      </section>
      <p className="credit">Plataforma criada por iniciativa de {course.autora}, com o objetivo de contribuir para reduzir a reprovação na disciplina e tornar o estudo mais ativo. <Link to="/sobre">Conheça a motivação</Link>. Slides e listas disponibilizados com autorização do {course.professor}. Código aberto no <a href={course.repo} target="_blank" rel="noreferrer">GitHub</a>; se usar em algum trabalho, veja <Link to="/citar">como citar</Link>.</p>
    </div>
  )
}
