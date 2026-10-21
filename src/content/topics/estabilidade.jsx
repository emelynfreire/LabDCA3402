import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'
import { RouthTable } from '../../sims/RouthSim.jsx'

export default function Estabilidade() {
  return (
    <>
      <h2>Estabilidade BIBO<Slide p={2} /></h2>
      <Callout tag="Definição">Um sistema é <b>BIBO-estável</b> (<i>bounded input – bounded output</i>) se sua resposta forçada (estado inicial nulo) a <b>qualquer</b> entrada limitada, <M>{'|u(t)|\\le u_M<\\infty'}</M>, também é limitada.</Callout>
      <h3>Teorema 1 – resposta ao impulso<Slide p={3} /></h3>
      <p>Um SLIT causal de tempo contínuo é BIBO-estável se, e somente se, <M>{String.raw`\int_0^\infty|g(t)|\,dt\le M<\infty`}</M>.</p>
      <p>Demonstração da suficiência:</p>
      <MM>{String.raw`|y(t)|=\left|\int_0^tg(\tau)u(t-\tau)d\tau\right|\le\int_0^t|g(\tau)||u(t-\tau)|d\tau\le u_M\int_0^\infty|g(\tau)|d\tau\le u_MM<\infty`}</MM>
      <h3>Teorema 2 – polos<Slide p={[4, 5]} /></h3>
      <p>Um SLIT causal com função de transferência própria <M>G(s)</M> é BIBO-estável se, e somente se, <b>todos os polos de <M>G(s)</M> têm parte real negativa</b> (estão no semiplano esquerdo aberto — SPE). Nesse caso o polinômio característico é dito <b>Hurwitz</b>.</p>
      <p>Ideia: <M>g(t)</M> é combinação de termos <M>{'t^ke^{p_it}'}</M>, <M>{'t^ke^{\\alpha t}\\cos(\\beta t+\\theta)'}</M> e, se <M>G</M> não for estritamente própria, <M>{'\\delta(t)'}</M>. Esses termos são absolutamente integráveis se, e somente se, as partes reais dos polos são negativas.</p>
      <h3>Exemplos dos slides<Slide p={6} /></h3>
      <ul>
        <li><M>{'G(s)=\\frac{s-2}{s(s+1)}'}</M>: polo em 0 ⇒ instável. Com degrau (limitado), <M>Y(s)</M> tem polo duplo em 0 e <M>y(t)</M> contém um termo proporcional a <M>t</M>.</li>
        <li><M>{'G(s)=\\frac{s-5}{s^2+4}'}</M>: polos <M>{'\\pm j2'}</M> ⇒ instável. Com <M>{'u=\\sen 2t'}</M> (limitado), <M>y(t)</M> contém <M>{'t\\sen(2t+\\theta)'}</M>, ilimitado.</li>
      </ul>
      <div className="note"><span className="tag">Note</span>Polos no eixo imaginário não dão BIBO-estabilidade: basta uma entrada "sintonizada" com eles para a saída crescer. Esses sistemas são chamados marginalmente estáveis.</div>

      <h2>Critério de Routh–Hurwitz<Slide p={[14, 20]} /></h2>
      <p>Verifica se um polinômio tem todas as raízes no SPE sem calculá-las. Para <M>{'A(s)=a_0s^n+a_1s^{n-1}+\\dots+a_n'}</M>:</p>
      <ul>
        <li><b>Condição necessária</b>: todos os coeficientes com o mesmo sinal (e nenhum nulo).</li>
        <li><b>Montagem da tabela</b>: as duas primeiras linhas recebem os coeficientes alternados; cada nova linha vem de determinantes 2×2 das duas linhas anteriores:</li>
      </ul>
      <MM>{String.raw`\begin{array}{c|cccc} s^n & a_0 & a_2 & a_4 & \cdots\\ s^{n-1} & a_1 & a_3 & a_5 & \cdots\\ s^{n-2} & c_1 & c_2 & c_3 & \cdots\\ s^{n-3} & d_1 & d_2 & \cdots \end{array}\qquad c_1=\frac{a_1a_2-a_0a_3}{a_1},\ \ c_2=\frac{a_1a_4-a_0a_5}{a_1},\ \ d_1=\frac{c_1a_3-a_1c_2}{c_1}`}</MM>
      <Callout tag="Conclusões">
        <ul style={{ margin: 0 }}>
          <li>Todas as raízes têm parte real negativa ⇔ não há troca de sinal na 1ª coluna.</li>
          <li>O número de trocas de sinal é igual ao número de raízes no semiplano direito aberto (SPD).</li>
          <li>Um zero na 1ª coluna já indica que o sistema não é BIBO-estável (raízes no SPD ou no eixo imaginário).</li>
        </ul>
      </Callout>
      <h3>Exemplo dos slides<Slide p={[21, 27]} /></h3>
      <p><M>{'A(s)=s^6+4s^5+3s^4+2s^3+s^2+4s+4'}</M>:</p>
      <RouthTable coefs={[1, 4, 3, 2, 1, 4, 4]} />
      <p>Duas trocas de sinal (de <M>{'s^2'}</M> para <M>{'s^1'}</M> e de <M>{'s^1'}</M> para <M>{'s^0'}</M>) ⇒ duas raízes no SPD ⇒ não é BIBO-estável.</p>

      <p>Para ver de onde sai cada número da tabela, avance célula por célula:</p>
      <SimSlot name="routhPasso" />
      <h3>Caso especial 1: zero na primeira coluna<Slide p={[28, 32]} /></h3>
      <p>Se o primeiro elemento de uma linha é nulo, mas os demais não, substitui-se o zero por <M>{'\\epsilon>0'}</M> arbitrariamente pequeno, prossegue-se e analisam-se os sinais no limite <M>{'\\epsilon\\to0'}</M>. Exemplo dos slides, <M>{'s^5+2s^4+2s^3+4s^2+11s+10'}</M>:</p>
      <RouthTable coefs={[1, 2, 2, 4, 11, 10]} />
      <p>Na linha <M>{'s^2'}</M> aparece <M>{'\\frac{4\\epsilon-12}{\\epsilon}\\to-\\infty'}</M>. Duas trocas de sinal ⇒ dois polos com parte real positiva (raízes: −1,3087; −1,2407 ± j1,0375; 0,8950 ± j1,4561).</p>
      <h3>Caso especial 2: linha de zeros<Slide p={[33, 37]} /></h3>
      <p>Uma linha inteira nula indica raízes simétricas em relação à origem — fatores <M>{'(s+\\sigma)(s-\\sigma)'}</M> ou <M>{'(s+j\\omega)(s-j\\omega)'}</M> — e o sistema é instável ou marginalmente estável. A linha anterior dá o <b>polinômio auxiliar</b> <M>P(s)</M>, cujas raízes são as responsáveis; substitui-se a linha nula pelos coeficientes de <M>{'dP/ds'}</M>. Exemplo: <M>{'s^4+3s^3+6s^2+12s+8'}</M>:</p>
      <RouthTable coefs={[1, 3, 6, 12, 8]} />
      <p><M>{'P(s)=2s^2+8'}</M> ⇒ <M>{'s=\\pm j2'}</M>, sobre o eixo imaginário: marginalmente estável.</p>

      <SimSlot name="routh" />

      <h2>Exercícios dos slides<Slide p={38} /></h2>
      <Exercise id="t-est-1" review={['limites']} src={{ p: 38 }} num="1" topic="Slides, aula 10"
        steps={[
          { title: 'Primeiras linhas', body: <MM>{String.raw`s^5:\ 1\ \ 2\ \ 6\qquad s^4:\ 3\ \ 6\ \ 9`}</MM> },
          { title: 'Linha s³', body: <p><M>{'c_1=\\frac{3\\cdot2-1\\cdot6}{3}=0'}</M> e <M>{'c_2=\\frac{3\\cdot6-1\\cdot9}{3}=3'}</M>. Zero na 1ª coluna com o resto não nulo: caso especial 1, troca-se por <M>{'\\epsilon'}</M>.</p> },
          { title: 'Linhas seguintes', body: <MM>{String.raw`s^2:\ \ \frac{6\epsilon-9}{\epsilon}\to-\infty,\ \ 9\qquad s^1:\ \ 3-\frac{9\epsilon}{d_1}\to3\qquad s^0:\ \ 9`}</MM> },
          { title: 'Sinais da 1ª coluna', body: <p><M>{'1,\\ 3,\\ \\epsilon^+,\\ -\\infty,\\ 3,\\ 9'}</M>: duas trocas de sinal.</p> },
        ]}
        answer={<p>Duas raízes no SPD: o sistema é instável (raízes: −2,904; −0,705 ± j0,993; 0,657 ± j1,288).</p>}>
        <p>Verifique a estabilidade de um sistema com polinômio característico <M>{'A(s)=s^5+3s^4+2s^3+6s^2+6s+9'}</M>.</p>
      </Exercise>
      <Exercise id="t-est-2" review={['polinomios']} src={{ p: 38 }} num="2" topic="Slides, aula 10"
        steps={[
          { title: 'Tabela', body: <MM>{String.raw`\begin{array}{c|cc}s^2&a_0&a_2\\ s^1&a_1&0\\ s^0&a_2&\end{array}\qquad\left(\text{pois }\tfrac{a_1a_2-a_0\cdot0}{a_1}=a_2\right)`}</MM> },
          { title: 'Conclusão', body: <p>A 1ª coluna é <M>{'a_0,\\ a_1,\\ a_2'}</M>. Não há troca de sinal se, e somente se, os três têm o mesmo sinal.</p> },
        ]}
        answer={<p>Para polinômios de 2º grau, coeficientes de mesmo sinal são condição necessária <b>e suficiente</b> para estabilidade. A partir do 3º grau isso deixa de valer.</p>}>
        <p>Mostre que um sistema com polinômio característico <M>{'A(s)=a_0s^2+a_1s+a_2'}</M> é BIBO-estável se, e somente se, <M>{'a_0'}</M>, <M>{'a_1'}</M> e <M>{'a_2'}</M> têm o mesmo sinal.</p>
      </Exercise>

      <h2>Ganhos estabilizantes e estabilidade relativa<Slide p={[40, 47]} /></h2>
      <p>Exemplo dos slides: malha fechada com <M>{'K\\frac{s+1}{s(s-1)(s+6)}'}</M> e realimentação unitária:</p>
      <MM>{String.raw`G_{mf}(s)=\frac{K(s+1)}{s^3+5s^2+(K-6)s+K}\qquad\begin{array}{c|cc}s^3&1&K-6\\ s^2&5&K\\ s^1&\frac{4K-30}{5}&\\ s^0&K&\end{array}\ \Rightarrow\ K>7{,}5`}</MM>
      <p>Para um tempo de resposta adequado, as exponenciais precisam decair rápido: impõe-se <M>{'\\Re\\{p_i\\}<-\\sigma'}</M>. Testa-se substituindo <M>{'s=r-\\sigma'}</M> e aplicando Routh a <M>{'\\bar A(r)=A(r-\\sigma)'}</M>. Para <M>{'\\sigma=1'}</M>:</p>
      <MM>{String.raw`\bar A(r)=(r-1)^3+5(r-1)^2+(K-6)(r-1)+K=r^3+2r^2+(K-13)r+10\ \Rightarrow\ K-18>0\ \Rightarrow\ K>18`}</MM>
      <SimSlot name="routhK" />
    </>
  )
}
