import { Link } from 'react-router-dom'
import { course, BIBLIO } from '../content/course.js'
import { useProgress } from '../components/progress.jsx'

export default function Sobre() {
  const { reset } = useProgress()
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Plataforma de estudos</div>
        <h1>Sobre a plataforma</h1>
      </header>
      <h2>Iniciativa</h2>
      <p>Esta plataforma de estudos é uma iniciativa independente de <b>{course.autora}</b>. O conteúdo tem como base a disciplina {course.code} – {course.name}, do {course.dept}, e usa os slides e as listas do {course.professor}, com a autorização dele.</p>

      <h2>Motivação</h2>
      <p>A disciplina reúne muitos conceitos abstratos — convolução, plano s, polos e zeros, espaço de estados — que costumam ficar mais claros quando dá para <i>ver</i> o que acontece. A plataforma foi pensada com três objetivos:</p>
      <ul>
        <li><b>Contribuir para reduzir os índices de reprovação</b> da disciplina, oferecendo um lugar organizado para estudar cada aula, com a teoria, as listas resolvidas passo a passo e quizzes de fixação.</li>
        <li><b>Tornar o aluno mais ativo no próprio aprendizado</b>: em vez de só ler, ele mexe nos parâmetros, prevê o resultado, confere nas simulações e se testa.</li>
        <li><b>Mostrar em 3D o que acontece nos circuitos, nos estados e nas transformações</b>, porque visualizar a dinâmica é parte central de entendê-la.</li>
      </ul>
      <p>É um material aberto: qualquer estudante pode usá-lo, e o código fica no GitHub para que outros estudantes também aproveitem.</p>

      <h2>Autoria e contribuição</h2>
      <ul>
        <li>Autora: <a href={course.autoraGithub} target="_blank" rel="noreferrer">{course.autora}</a> (github.com/emelynfreire).</li>
        <li>Repositório para contribuição: <a href={course.repo} target="_blank" rel="noreferrer">github.com/emelynfreire/LabDCA3402</a>. Correções, ideias de simulações e novos exercícios são bem-vindos por <i>issue</i> ou <i>pull request</i>.</li>
        <li>Vai usar a plataforma ou uma simulação num trabalho? Veja <Link to="/citar">Como citar e contribuir</Link>: tem a referência pronta em ABNT, APA e BibTeX e as fontes usadas na construção do site.</li>
      </ul>

      <h2>De onde vem o conteúdo</h2>
      <ul>
        <li>Os textos das Unidades 1 e 2 resumem os slides e as listas do professor, que autorizou a disponibilização do material. Os PDFs estão no site e cada seção cita a página correspondente (“slides, p. N”), para facilitar a conferência.</li>
        <li>Os gabaritos das listas foram conferidos por cálculo simbólico.</li>
        <li>As simulações reproduzem, de forma interativa, as sugestões de simulação em MATLAB dos slides, além de visualizações 3D criadas para esta plataforma.</li>
        <li>Os slides da Unidade 3 ainda não foram incorporados à plataforma; por enquanto, os tópicos dessa unidade trazem uma prévia baseada na bibliografia da disciplina.</li>
      </ul>
      <div className="warn"><span className="tag">Material de apoio, não oficial</span>A plataforma não substitui as aulas nem as orientações do professor. Em caso de divergência, vale o que foi apresentado em sala. Encontrou um erro? Abra uma <a href={`${course.repo}/issues`} target="_blank" rel="noreferrer">issue no repositório do GitHub</a>.</div>
      <h2>Referências</h2>
      <ul className="refs">{BIBLIO.map((r, i) => <li key={i} dangerouslySetInnerHTML={{ __html: r }} />)}</ul>
      <h2>Seu progresso</h2>
      <p>Tópicos estudados, exercícios marcados e resultados dos quizzes ficam guardados apenas neste navegador. Nada é enviado para servidor algum.</p>
      <div className="btn-row"><button className="btn" onClick={() => { if (window.confirm('Apagar todo o progresso salvo neste navegador?')) reset() }}>Apagar meu progresso</button></div>
    </div>
  )
}
