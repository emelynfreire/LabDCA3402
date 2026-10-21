import { useState } from 'react'
import { Link } from 'react-router-dom'
import { course, BIBLIO } from '../content/course.js'
import { SIMS } from '../sims/registry.jsx'
import CiteBox from '../components/CiteBox.jsx'
import { acessoABNT, citacaoTexto } from '../lib/cite.js'

const LIBS = [
  ['React e React DOM', 'interface', 'MIT', 'https://react.dev'],
  ['React Router', 'navegação entre páginas', 'MIT', 'https://reactrouter.com'],
  ['Three.js', 'gráficos 3D (WebGL)', 'MIT', 'https://threejs.org'],
  ['React Three Fiber e Drei', 'cenas 3D em React', 'MIT', 'https://docs.pmnd.rs/react-three-fiber'],
  ['KaTeX', 'fórmulas matemáticas', 'MIT', 'https://katex.org'],
  ['Vite', 'compilação do site', 'MIT', 'https://vitejs.dev'],
  ['Archivo e Source Serif 4', 'fontes tipográficas (Google Fonts)', 'SIL Open Font License', 'https://fonts.google.com'],
]

export default function CitarPage() {
  const simList = Object.entries(SIMS).map(([key, s]) => ({ key, title: s.title }))
  const [simKey, setSimKey] = useState('routhPasso')
  const sim = simList.find((s) => s.key === simKey)
  const hoje = acessoABNT(new Date())
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">{course.titulo} · {course.code}</div>
        <h1>Como citar e contribuir</h1>
        <p className="lead">Usou a plataforma ou uma simulação num relatório, trabalho, TCC, artigo ou apresentação? Esta página mostra quando citar, como montar a referência e quais fontes foram usadas para construir o site.</p>
      </header>

      <h2>Por que citar</h2>
      <ul>
        <li><b>Dá crédito a quem fez.</b> A plataforma é uma contribuição voluntária de {course.autora}. A citação é a forma de reconhecer esse trabalho e mostra que ele está sendo útil.</li>
        <li><b>Permite conferir.</b> Quem lê o seu trabalho consegue abrir a mesma simulação, com o mesmo exemplo, e verificar o resultado.</li>
        <li><b>Evita plágio.</b> Usar figura, texto ou código de outra pessoa sem indicar a fonte é plágio, mesmo quando o material é gratuito e aberto. No Brasil, obras intelectuais e programas de computador são protegidos por lei (Lei 9.610/1998 e Lei 9.609/1998).</li>
      </ul>

      <h2>Quando citar o quê</h2>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Situação</th><th>O que fazer</th></tr></thead>
          <tbody>
            <tr><td>Estudou pela plataforma para a prova ou para a lista</td><td>Não precisa citar nada. Bons estudos!</td></tr>
            <tr><td>Pôs uma captura de tela de uma simulação num relatório, slide ou trabalho</td><td>Cite a simulação (referência abaixo) e indique a fonte na legenda da figura.</td></tr>
            <tr><td>Gerou um gráfico novo na simulação, com seus próprios parâmetros</td><td>Na legenda: “Fonte: elaborada pelo(a) autor(a) com a simulação … (FREIRE, {course.ano})”. Inclua a referência.</td></tr>
            <tr><td>Usou a plataforma como ferramenta no trabalho (conferir cálculos, explorar um sistema)</td><td>Mencione no texto, por exemplo na metodologia, e cite a plataforma.</td></tr>
            <tr><td>Usou uma definição, fórmula ou exemplo da disciplina</td><td>Cite a <b>fonte original</b>: os slides do professor e/ou o livro. A plataforma resume esse material; ela não é a origem da teoria.</td></tr>
            <tr><td>Reaproveitou código do repositório</td><td>A licença MIT permite, desde que você mantenha o aviso de copyright e o texto da licença. Em trabalhos acadêmicos, cite também o repositório.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Referência da plataforma</h2>
      <CiteBox />
      <p>No texto, a citação fica assim: ABNT <b>{citacaoTexto.abnt[0]}</b> ou <b>{citacaoTexto.abnt[1]}</b>; APA <b>{citacaoTexto.apa[0]}</b> ou <b>{citacaoTexto.apa[1]}</b>. A referência completa vai na lista de referências, no fim do trabalho.</p>
      <p className="small muted">Usa LaTeX? Copie o formato BibTeX para o seu arquivo <code>.bib</code>. No GitHub, o botão “Cite this repository”, na página do repositório, gera as mesmas referências a partir do arquivo <code>CITATION.cff</code>.</p>

      <h2>Referência de uma simulação específica</h2>
      <p>Se você usou uma simulação em particular, cite-a pelo nome. O link da referência abre essa simulação direto no Laboratório.</p>
      <label className="field cite-select">
        <span>Simulação</span>
        <select value={simKey} onChange={(e) => setSimKey(e.target.value)}>
          {simList.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}
        </select>
      </label>
      <CiteBox sim={sim} />
      <p className="small muted">Também dá para copiar a referência no próprio <Link to="/laboratorio">Laboratório</Link>, logo abaixo da simulação aberta.</p>

      <h3>Exemplo de figura com fonte (ABNT)</h3>
      <figure className="cite-figure">
        <figcaption>Figura 1 – Resposta ao degrau de um sistema de 2ª ordem com ξ = 0,5</figcaption>
        <div className="cite-figure-img">[captura de tela da simulação]</div>
        <figcaption className="fonte">Fonte: elaborada pela autora com a simulação “Sistema de 2ª ordem em 3D” (FREIRE, {course.ano}).</figcaption>
      </figure>
      <p className="small">Pela ABNT, o título da figura fica acima dela e a fonte, abaixo. Se a imagem foi copiada sem alteração, escreva apenas “Fonte: Freire ({course.ano})”; se foi modificada, “Fonte: adaptada de Freire ({course.ano})”.</p>

      <h2>Fontes usadas na construção</h2>
      <h3>Material da disciplina</h3>
      <p>Slides e listas de exercícios do {course.professor} (DCA/UFRN), disponibilizados na plataforma com a autorização dele. Os textos das Unidades 1 e 2 resumem esse material e indicam a página de cada slide. Para citar uma aula, use o modelo:</p>
      <p className="cite-text">CAVALCANTI, Anderson Luiz de Oliveira. <b>[Título da aula]</b>. Natal: DCA/UFRN, [ano]. Notas de aula (slides) da disciplina {course.code} – {course.name}. Disponível em: [link do PDF]. Acesso em: {hoje}.</p>
      <p className="small muted">O link de cada PDF fica no topo do tópico correspondente, e o título da aula está na capa do PDF. Use o ano que estiver no PDF; se não houver, a ABNT permite indicar a data provável entre colchetes, como [2026?].</p>

      <h3>Bibliografia da disciplina</h3>
      <ul className="refs">{BIBLIO.map((r, i) => <li key={i} dangerouslySetInnerHTML={{ __html: r }} />)}</ul>

      <h3>Métodos numéricos e verificação</h3>
      <p>As simulações usam métodos numéricos clássicos implementados na própria plataforma: Runge–Kutta de 4ª ordem para as EDOs, o método de Aberth para as raízes de polinômios, a expansão em frações parciais por resíduos e a exponencial de matriz. Os gabaritos das listas foram conferidos por cálculo simbólico.</p>

      <h3>Software livre</h3>
      <div className="tbl-wrap">
        <table className="tbl small">
          <thead><tr><th>Biblioteca</th><th>Uso</th><th>Licença</th></tr></thead>
          <tbody>{LIBS.map(([n, u, l, href]) => <tr key={n}><td><a href={href} target="_blank" rel="noreferrer">{n}</a></td><td>{u}</td><td>{l}</td></tr>)}</tbody>
        </table>
      </div>

      <h3>Ferramenta de apoio</h3>
      <p>Assistente de IA (Claude, Anthropic), usado como ferramenta de apoio à programação, sob concepção e direção da autora. O conteúdo está em revisão pelos autores.</p>

      <h2>Licença</h2>
      <p>O código e os textos da plataforma estão sob a <a href={`${course.repo}/blob/main/LICENSE`} target="_blank" rel="noreferrer">licença MIT</a>: podem ser usados, modificados e redistribuídos, desde que o aviso de copyright (© {course.ano} {course.autora}) e o texto da licença sejam mantidos. Os slides e as listas do professor, em <code>public/material/</code>, <b>não</b> estão incluídos na licença. Eles são de autoria do {course.professor} e foram publicados aqui com a autorização dele.</p>

      <h2>Como contribuir</h2>
      <p>O código está aberto no GitHub: <a href={course.repo} target="_blank" rel="noreferrer">{course.repo.replace('https://', '')}</a>.</p>
      <ul>
        <li><b>Encontrou um erro?</b> Abra uma <a href={`${course.repo}/issues`} target="_blank" rel="noreferrer">issue</a> dizendo a página, o que está errado e, se possível, a página do slide ou da lista.</li>
        <li><b>Tem uma ideia</b> de simulação, exercício ou revisão? Abra uma issue descrevendo a ideia.</li>
        <li><b>Quer mexer no código?</b> Faça um <i>fork</i>, crie as alterações e envie um <i>pull request</i>. O README do repositório explica como rodar o projeto e como adicionar tópicos, simulações e revisões.</li>
      </ul>
      <p>Autora: <a href={course.autoraGithub} target="_blank" rel="noreferrer">{course.autora} (github.com/emelynfreire)</a>.</p>
    </div>
  )
}
