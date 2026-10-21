import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function FuncaoTransferencia() {
  return (
    <>
      <h2>Definição<Slide p={[5, 8]} /></h2>
      <p>Aplicando Laplace à EDO linear <b>com condições iniciais nulas</b>:</p>
      <MM>{String.raw`\left(s^n+a_1s^{n-1}+\dots+a_n\right)Y(s)=\left(b_0s^m+b_1s^{m-1}+\dots+b_m\right)U(s)`}</MM>
      <Callout tag="Duas definições equivalentes">
        <p style={{ margin: '.2rem 0' }}><b>1.</b> <M>{'G(s)=\\dfrac{Y(s)}{U(s)}'}</M>, com condições iniciais nulas.</p>
        <p style={{ margin: '.2rem 0' }}><b>2.</b> <M>{'G(s)=\\mathcal L\\{g(t)\\}'}</M>, sendo <M>g(t)</M> a resposta ao impulso — pois, para o sistema relaxado, <M>{'y=g*u\\Rightarrow Y(s)=G(s)U(s)'}</M>.</p>
      </Callout>

      <h2>Funções de transferência racionais<Slide p={[10, 11]} /></h2>
      <MM>{String.raw`G(s)=\frac{B(s)}{A(s)}=\frac{b_0s^m+\dots+b_m}{s^n+a_1s^{n-1}+\dots+a_n},\qquad A(s)\ \text{é o polinômio característico}`}</MM>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Graus</th><th>Classificação</th></tr></thead>
        <tbody>
          <tr><td><M>{'m<n'}</M></td><td>estritamente própria</td></tr>
          <tr><td><M>{'m=n'}</M></td><td>biprópria</td></tr>
          <tr><td><M>{'m\\le n'}</M></td><td>própria (inclui os dois casos acima)</td></tr>
          <tr><td><M>{'m>n'}</M></td><td>imprópria — não é fisicamente realizável</td></tr>
        </tbody></table></div>
      <p>O <b>grau relativo</b> é <M>{'g=n-m'}</M>.</p>

      <h2>Polos e zeros<Slide p={13} /></h2>
      <p>Polos são as raízes de <M>A(s)</M> (<M>{'|G(p)|=\\infty'}</M>); zeros são as raízes de <M>B(s)</M> (<M>{'G(z)=0'}</M>).</p>
      <Exercise id="t-ft-circ" review={['fracoes']} src={{ p: [14, 16] }} num="Ex." topic="Slides, aula 8 — FT de um circuito"
        steps={[
          { title: 'Equações do circuito', body: <><p>Malha: <M>{'u=2{,}5y+\\dot y+v'}</M>. Nó (capacitor de 1 F em paralelo com 2 Ω): <M>{'y=\\frac{v}{2}+\\dot v'}</M>.</p></> },
          { title: 'Laplace com CI nulas', body: <MM>{String.raw`U=(s+2{,}5)Y+V,\qquad Y=(s+0{,}5)V\ \Rightarrow\ V=\frac{Y}{s+0{,}5}`}</MM> },
          { title: 'Eliminar V', body: <MM>{String.raw`U=(s+2{,}5)Y+\frac{Y}{s+0{,}5}=\frac{s^2+3s+2{,}25}{s+0{,}5}\,Y`}</MM> },
        ]}
        answer={<><MM>{String.raw`G(s)=\frac{Y(s)}{U(s)}=\frac{s+0{,}5}{s^2+3s+2{,}25}`}</MM><p>Polo duplo em −1,5 e zero em −0,5.</p></>}>
        <p>No circuito com fonte <M>u(t)</M>, resistor de 2,5 Ω e indutor de 1 H em série, seguidos de um capacitor de 1 F em paralelo com um resistor de 2 Ω, a saída é a corrente <M>y(t)</M> na malha e <M>v(t)</M> é a tensão no capacitor. Determine <M>G(s)=Y(s)/U(s)</M>, seus polos e zeros.</p>
      </Exercise>

      <h2>Resposta usando a função de transferência<Slide p={[18, 27]} /></h2>
      <p>Com o sistema em repouso: <M>{'Y(s)=G(s)U(s)'}</M>, e <M>{'y(t)=\\mathcal L^{-1}\\{Y(s)\\}'}</M> por frações parciais. Os exemplos dos slides, todos com degrau unitário:</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>G(s)</th><th>Polos</th><th>y(t)</th></tr></thead>
        <tbody>
          <tr><td><M>{'\\frac{2s+3}{s^2+4s+3}'}</M></td><td>−1, −3</td><td><M>{'\\underbrace{1}_{u(t)}\\underbrace{-0{,}5e^{-t}-0{,}5e^{-3t}}_{\\text{polos}}'}</M></td></tr>
          <tr><td><M>{'\\frac{s+1/2}{s^2+3s+9/4}'}</M></td><td>−1,5 (duplo)</td><td><M>{'\\frac29+\\frac69te^{-1{,}5t}-\\frac29e^{-1{,}5t}'}</M></td></tr>
          <tr><td><M>{'\\frac{150}{s^2+12s+100}'}</M></td><td><M>{'-6\\pm j8'}</M></td><td><M>{'1{,}5+1{,}875e^{-6t}\\cos(8t+2{,}5)'}</M></td></tr>
          <tr><td><M>{'\\frac{4}{s(s+2)}'}</M></td><td>0, −2</td><td><M>{'\\underbrace{2t-1}_{p_1\\text{ e }u(t)}+\\underbrace{e^{-2t}}_{p_2}'}</M></td></tr>
        </tbody></table></div>
      <p>No último caso, o polo de <M>G</M> em <M>s=0</M> coincide com o polo da entrada degrau: <M>Y(s)</M> tem polo duplo em 0 e aparece o termo <M>t</M>, uma "combinação" entre entrada e sistema.</p>

      <SimSlot name="poles" initial="reais" />

      <p>Na simulação abaixo, a resposta é separada nos termos de cada polo, como nas frações parciais: veja cada termo e a soma.</p>
      <SimSlot name="modal" />
      <h2>Relação entre polos e resposta<Slide p={29} /></h2>
      <p>Em geral, a resposta de um SLIT é composta de um termo associado à entrada e de uma combinação linear de termos associados aos polos de <M>G(s)</M>:</p>
      <ul>
        <li><M>{'e^{p_it},\\ te^{p_it},\\ \\dots,\\ t^{m_i-1}e^{p_it}'}</M> para polos reais <M>{'p_i'}</M> de multiplicidade <M>{'m_i'}</M>;</li>
        <li><M>{'e^{\\alpha_lt}\\cos(\\beta_lt+\\theta_0),\\ \\dots,\\ t^{m_l-1}e^{\\alpha_lt}\\cos(\\beta_lt+\\theta_{m_l-1})'}</M> para polos complexos <M>{'\\alpha_l\\pm j\\beta_l'}</M>.</li>
      </ul>
      <p>Na simulação acima, arraste um polo para a direita do eixo imaginário e veja o termo correspondente crescer sem limite.</p>
    </>
  )
}
