import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function SistemasEletricos() {
  return (
    <>
      <h2>Elementos e leis</h2>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Elemento</th><th>Relação tensão–corrente</th><th>Impedância Z(s) = V(s)/I(s), CI nulas</th><th>Armazena</th></tr></thead>
        <tbody>
          <tr><td>Resistor</td><td><M>{'v=Ri'}</M></td><td><M>R</M></td><td>— (dissipa)</td></tr>
          <tr><td>Indutor</td><td><M>{'v=L\\,\\frac{di}{dt}'}</M></td><td><M>{'Ls'}</M></td><td>energia magnética <M>{'\\frac12Li^2'}</M></td></tr>
          <tr><td>Capacitor</td><td><M>{'i=C\\,\\frac{dv}{dt}'}</M></td><td><M>{'\\frac{1}{Cs}'}</M></td><td>energia elétrica <M>{'\\frac12Cv^2'}</M></td></tr>
        </tbody></table></div>
      <p>As leis de interconexão são as de Kirchhoff: a soma das tensões numa malha é nula (LKT) e a soma das correntes num nó é nula (LKC). Como cada indutor e cada capacitor independente acrescenta um estado, a ordem do modelo é o número desses armazenadores.</p>

      <h2>Método das impedâncias</h2>
      <p>Com condições iniciais nulas, os elementos no domínio <M>s</M> se combinam como resistores: impedâncias em série somam, em paralelo combinam-se pelo inverso da soma dos inversos. Isso permite obter funções de transferência sem escrever a EDO.</p>
      <Callout tag="Divisor de tensão em s">
        <MM>{String.raw`\text{RLC série, saída no capacitor:}\quad \frac{V_C(s)}{E(s)}=\frac{\frac{1}{Cs}}{R+Ls+\frac{1}{Cs}}=\frac{1}{LCs^2+RCs+1}`}</MM>
        Comparando com a forma canônica: <M>{String.raw`\omega_n=\frac{1}{\sqrt{LC}}`}</M> e <M>{String.raw`\xi=\frac R2\sqrt{\frac CL}`}</M>.
      </Callout>

      <SimSlot name="circuito" initialMode="RC" title="Circuitos RC e RLC série em 3D" />

      <h2>Do circuito ao espaço de estados</h2>
      <p>Escolhendo como estados as tensões nos capacitores e as correntes nos indutores, cada equação de elemento armazenador vira uma equação de estado. No RLC série com <M>{'x_1=v_C'}</M>, <M>{'x_2=i'}</M>:</p>
      <MM>{String.raw`\dot x_1=\frac1Cx_2,\qquad \dot x_2=\frac1L\left(e-Rx_2-x_1\right)\quad\Rightarrow\quad A=\begin{bmatrix}0&\frac1C\\-\frac1L&-\frac RL\end{bmatrix},\ B=\begin{bmatrix}0\\\frac1L\end{bmatrix}`}</MM>

      <h2>Amplificador operacional</h2>
      <p>Com o amplificador ideal (corrente de entrada nula, tensão diferencial nula), o inversor com impedância <M>{'Z_1'}</M> na entrada e <M>{'Z_2'}</M> na realimentação tem</p>
      <MM>{String.raw`\frac{V_o(s)}{V_i(s)}=-\frac{Z_2(s)}{Z_1(s)}`}</MM>
      <p>Com <M>{'Z_1=R'}</M> e <M>{'Z_2=1/(Cs)'}</M> obtém-se um integrador, <M>{'-\\frac{1}{RCs}'}</M>; trocando-os, um derivador. Combinações de R e C realizam controladores (PI, PD, avanço e atraso), tema de Controle.</p>

      <Exercise id="t-u3-el" review={['fracoes']} num="Ex." topic="Prática com impedâncias"
        steps={[
          { title: 'Impedância do ramo paralelo', body: <MM>{String.raw`Z_p=\frac{R_2\cdot\frac{1}{Cs}}{R_2+\frac{1}{Cs}}=\frac{R_2}{R_2Cs+1}`}</MM> },
          { title: 'Divisor de tensão', body: <MM>{String.raw`\frac{V_o}{V_i}=\frac{Z_p}{R_1+Z_p}=\frac{R_2}{R_1R_2Cs+R_1+R_2}`}</MM> },
          { title: 'Forma de 1ª ordem', body: <MM>{String.raw`\frac{V_o}{V_i}=\frac{K}{Ts+1},\quad K=\frac{R_2}{R_1+R_2},\quad T=\frac{R_1R_2C}{R_1+R_2}`}</MM> },
        ]}
        answer={<p>Ganho estático do divisor resistivo e constante de tempo com o capacitor "vendo" <M>{'R_1\\parallel R_2'}</M>.</p>}>
        <p>Um resistor <M>{'R_1'}</M> alimenta um capacitor <M>C</M> em paralelo com um resistor <M>{'R_2'}</M>. Obtenha <M>{'V_o(s)/V_i(s)'}</M>, com <M>{'v_o'}</M> a tensão no capacitor.</p>
      </Exercise>
    </>
  )
}
