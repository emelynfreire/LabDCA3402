import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function Eletromecanicos() {
  return (
    <>
      <p>Sistemas eletromecânicos acoplam um subsistema elétrico a um mecânico. O exemplo central é o motor de corrente contínua controlado pela armadura.</p>
      <h2>Motor CC</h2>
      <p>Dois fenômenos fazem o acoplamento:</p>
      <ul>
        <li><b>Torque eletromagnético</b> proporcional à corrente de armadura: <M>{'T=K_t\\,i'}</M>.</li>
        <li><b>Força contraeletromotriz</b> proporcional à velocidade: <M>{'e_b=K_b\\,\\omega'}</M>. Em unidades do SI, <M>{'K_t=K_b'}</M>.</li>
      </ul>
      <MM>{String.raw`\underbrace{L\frac{di}{dt}+Ri+K_b\,\omega=v}_{\text{malha da armadura}}\qquad\underbrace{J\frac{d\omega}{dt}+B\omega=K_t\,i}_{\text{eixo}}`}</MM>
      <p>Em Laplace, eliminando <M>I(s)</M>:</p>
      <MM>{String.raw`\frac{\Omega(s)}{V(s)}=\frac{K_t}{(Ls+R)(Js+B)+K_tK_b},\qquad\frac{\Theta(s)}{V(s)}=\frac{1}{s}\cdot\frac{\Omega(s)}{V(s)}`}</MM>
      <Callout tag="Simplificação comum">Quando a constante elétrica <M>{'L/R'}</M> é bem menor que a mecânica <M>{'J/B'}</M>, despreza-se <M>L</M>:
        <MM>{String.raw`\frac{\Omega(s)}{V(s)}\approx\frac{K_m}{T_ms+1},\qquad K_m=\frac{K_t}{RB+K_tK_b},\quad T_m=\frac{RJ}{RB+K_tK_b}`}</MM>
        É uma aproximação por polo dominante, como na aula 11.</Callout>
      <SimSlot name="motor" />
      <h2>Espaço de estados</h2>
      <p>Com <M>{'x_1=i'}</M>, <M>{'x_2=\\omega'}</M> e <M>{'x_3=\\theta'}</M>:</p>
      <MM>{String.raw`\dot{\mathbf x}=\begin{bmatrix}-\frac RL&-\frac{K_b}{L}&0\\\frac{K_t}{J}&-\frac BJ&0\\0&1&0\end{bmatrix}\mathbf x+\begin{bmatrix}\frac1L\\0\\0\end{bmatrix}v`}</MM>
      <Exercise id="t-u3-mot" num="Ex." topic="Velocidade em regime"
        steps={[
          { title: 'Valor final', body: <MM>{String.raw`\omega_\infty=\lim_{s\to0}s\,\frac{\Omega(s)}{V(s)}\cdot\frac{V_0}{s}=\frac{K_t}{RB+K_tK_b}V_0`}</MM> },
          { title: 'Números', body: <MM>{String.raw`\omega_\infty=\frac{0{,}5}{1\cdot0{,}05+0{,}25}\cdot12=\frac{0{,}5}{0{,}3}\cdot12=20\ \text{rad/s}`}</MM> },
        ]}
        answer={<p>20 rad/s (≈ 191 rpm). Confira na simulação com os valores padrão.</p>}>
        <p>Com <M>{'R=1\\,\\Omega'}</M>, <M>{'K_t=K_b=0{,}5'}</M>, <M>{'B=0{,}05'}</M> e um degrau de 12 V, qual a velocidade em regime?</p>
      </Exercise>
    </>
  )
}
