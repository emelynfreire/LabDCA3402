import { course } from '../content/course.js'
import { useProgress } from '../components/progress.jsx'

export default function Sobre() {
  const { reset } = useProgress()
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">{course.code} · {course.turma}</div>
        <h1>Sobre a plataforma</h1>
      </header>
      <h2>Iniciativa</h2>
      <p>Esta plataforma é uma iniciativa de <b>{course.autora}</b>, criada para a disciplina {course.code} – {course.name}, do {course.dept}, ministrada pelo {course.professor}.</p>

      <h2>Motivação</h2>
      <p>A disciplina reúne muitos conceitos abstratos — convolução, plano s, polos e zeros, espaço de estados — que costumam ficar mais claros quando dá para <i>ver</i> o que acontece. A plataforma foi pensada com três objetivos:</p>
      <ul>
        <li><b>Contribuir para reduzir os índices de reprovação</b> da disciplina, oferecendo um lugar organizado para estudar cada aula, com a teoria, as listas resolvidas passo a passo e quizzes de fixação.</li>
        <li><b>Tornar o aluno mais ativo no próprio aprendizado</b>: em vez de só ler, ele mexe nos parâmetros, prevê o resultado, confere nas simulações e se testa.</li>
        <li><b>Mostrar em 3D o que acontece nos circuitos, nos estados e nas transformações</b>, porque visualizar a dinâmica é parte central de entendê-la.</li>
      </ul>
      <p>É um material aberto: qualquer estudante pode usá-lo, e o código fica no GitHub para que outras turmas também aproveitem.</p>

      <h2>De onde vem o conteúdo</h2>
      <ul>
        <li>Os textos das Unidades 1 e 2 resumem os slides e as listas do professor, que autorizou a disponibilização do material. Os PDFs estão no site e cada seção cita a página correspondente (“slides, p. N”), para facilitar a conferência.</li>
        <li>Os gabaritos das listas foram conferidos por cálculo simbólico.</li>
        <li>As simulações reproduzem, de forma interativa, as sugestões de simulação em MATLAB dos slides, além de visualizações 3D criadas para esta plataforma.</li>
        <li>O material da Unidade 3 ainda será disponibilizado pelo professor; até lá, os tópicos dessa unidade trazem uma prévia baseada na bibliografia da disciplina.</li>
      </ul>
      <div className="warn"><span className="tag">Material de apoio, não oficial</span>A plataforma não substitui as aulas nem as orientações do professor. Em caso de divergência, vale o que foi apresentado em sala. Encontrou um erro? Abra uma issue no repositório do GitHub.</div>
      <h2>Referências</h2>
      <ul>
        <li>B. P. Lathi. <i>Linear Systems and Signals</i>. 2ª ed. Oxford University Press, 2005.</li>
        <li>A. A. D. Medeiros. <i>Apostila de Modelagem e Análise de Sistemas Dinâmicos</i>. UFRN, 2003.</li>
        <li>M. C. M. M. Campos e H. Teixeira. <i>Controles típicos de equipamentos e processos industriais</i>. Blucher, 2015.</li>
        <li>C. E. T. Dórea. <i>Enciclopédia de Automática: Controle e Automação</i>, vol. 1, 2007.</li>
      </ul>
      <h2>Seu progresso</h2>
      <p>Tópicos estudados, exercícios marcados e resultados dos quizzes ficam guardados apenas neste navegador. Nada é enviado para servidor algum.</p>
      <div className="btn-row"><button className="btn" onClick={() => { if (window.confirm('Apagar todo o progresso salvo neste navegador?')) reset() }}>Apagar meu progresso</button></div>
    </div>
  )
}
