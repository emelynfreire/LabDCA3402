import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function Fluidicos() {
  return (
    <>
      <h2>Resistência e capacitância hidráulicas</h2>
      <p>Em sistemas de nível, as variáveis são a altura <M>h</M> e a vazão <M>q</M>. Por analogia com circuitos:</p>
      <ul>
        <li><b>Resistência</b> de uma restrição (válvula, orifício): <M>{String.raw`R=\frac{dh}{dq}`}</M>. Para escoamento turbulento, <M>{String.raw`q=a\sqrt{2gh}`}</M> é não linear e <M>R</M> só existe linearizada em torno de um ponto de operação (aula de linearização); para escoamento laminar, <M>{'q=h/R'}</M> é linear.</li>
        <li><b>Capacitância</b> de um tanque: a variação de volume por variação de altura, <M>{'C=A'}</M> (área da seção).</li>
      </ul>
      <Callout tag="Conservação de massa">
        <MM>{String.raw`A\frac{dh}{dt}=q_{in}-q_{out},\qquad q_{out}=\frac hR\ \ \Rightarrow\ \ \frac{H(s)}{Q_{in}(s)}=\frac{R}{ARs+1}`}</MM>
        Um tanque é um sistema de 1ª ordem com <M>{'T=AR'}</M> — o análogo do circuito RC.
      </Callout>
      <SimSlot name="tanque" />

      <h2>Dois tanques</h2>
      <p><b>Não interativos</b> (o primeiro descarrega livremente no segundo): a saída do tanque 1 não depende do nível do tanque 2, e as funções de transferência simplesmente se multiplicam:</p>
      <MM>{String.raw`\frac{H_2(s)}{Q_{in}(s)}=\frac{1}{A_1R_1s+1}\cdot\frac{R_2}{A_2R_2s+1}`}</MM>
      <p><b>Interativos</b> (ligados pelo fundo, <M>{'q_1=(h_1-h_2)/R_1'}</M>): o nível do tanque 2 "empurra de volta" o tanque 1:</p>
      <MM>{String.raw`\begin{cases}A_1\dot h_1=q_{in}-\dfrac{h_1-h_2}{R_1}\\[6pt] A_2\dot h_2=\dfrac{h_1-h_2}{R_1}-\dfrac{h_2}{R_2}\end{cases}\Rightarrow\ \frac{H_2(s)}{Q_{in}(s)}=\frac{R_2}{A_1A_2R_1R_2s^2+(A_1R_1+A_2R_2+A_1R_2)s+1}`}</MM>
      <p>O termo extra <M>{'A_1R_2'}</M> no coeficiente de <M>s</M> é o efeito da interação: os polos deixam de ser <M>{'-1/(A_1R_1)'}</M> e <M>{'-1/(A_2R_2)'}</M>.</p>

      <Exercise id="t-u3-fl" num="Ex." topic="Espaço de estados de dois tanques interativos"
        steps={[
          { title: 'Estados e entrada', body: <p><M>{'x_1=h_1'}</M>, <M>{'x_2=h_2'}</M>, <M>{'u=q_{in}'}</M>, <M>{'y=h_2'}</M>.</p> },
          { title: 'Matrizes', body: <MM>{String.raw`A=\begin{bmatrix}-\frac{1}{A_1R_1}&\frac{1}{A_1R_1}\\[3pt]\frac{1}{A_2R_1}&-\frac{1}{A_2R_1}-\frac{1}{A_2R_2}\end{bmatrix},\quad B=\begin{bmatrix}\frac1{A_1}\\0\end{bmatrix},\quad C=\begin{bmatrix}0&1\end{bmatrix}`}</MM> },
          { title: 'Conferência', body: <p><M>{'\\det(sI-A)'}</M>, multiplicado por <M>{'A_1A_2R_1R_2'}</M>, reproduz o denominador da função de transferência acima.</p> },
        ]}
        answer={<p>Dois estados (dois tanques, dois armazenadores), polos reais e negativos.</p>}>
        <p>Escreva o modelo em espaço de estados dos dois tanques interativos.</p>
      </Exercise>
    </>
  )
}
