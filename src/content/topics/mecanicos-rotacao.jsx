import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function MecanicosRotacao() {
  return (
    <>
      <h2>Elementos</h2>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Elemento</th><th>Torque</th><th>Laplace</th><th>Análogo translacional</th></tr></thead>
        <tbody>
          <tr><td>Inércia <M>J</M></td><td><M>{'T=J\\ddot\\theta'}</M></td><td><M>{'Js^2\\Theta'}</M></td><td>massa</td></tr>
          <tr><td>Mola torcional <M>K</M></td><td><M>{'T=K(\\theta_1-\\theta_2)'}</M></td><td><M>{'K[\\Theta_1-\\Theta_2]'}</M></td><td>mola</td></tr>
          <tr><td>Atrito viscoso <M>B</M></td><td><M>{'T=B(\\dot\\theta_1-\\dot\\theta_2)'}</M></td><td><M>{'Bs[\\Theta_1-\\Theta_2]'}</M></td><td>amortecedor</td></tr>
        </tbody></table></div>
      <p>Aplica-se a lei de Newton para rotação, <M>{'J\\ddot\\theta=\\sum T'}</M>, a cada inércia. Um disco preso a um eixo flexível, com atrito viscoso e torque aplicado:</p>
      <MM>{String.raw`J\ddot\theta+B\dot\theta+K\theta=T(t)\quad\Rightarrow\quad\frac{\Theta(s)}{T(s)}=\frac{1}{Js^2+Bs+K}`}</MM>
      <SimSlot name="torcao" />

      <h2>Engrenagens</h2>
      <p>Num par ideal (sem perdas nem folga), com <M>{'N_1'}</M> e <M>{'N_2'}</M> dentes:</p>
      <MM>{String.raw`\frac{\theta_2}{\theta_1}=\frac{N_1}{N_2},\qquad\frac{T_2}{T_1}=\frac{N_2}{N_1}\qquad(\text{potência conservada: }T_1\dot\theta_1=T_2\dot\theta_2)`}</MM>
      <Callout tag="Refletindo impedâncias">Inércia, atrito e rigidez do lado 2 aparecem no lado 1 multiplicados por <M>{'(N_1/N_2)^2'}</M>:
        <MM>{String.raw`J_{eq}=J_1+J_2\left(\frac{N_1}{N_2}\right)^2,\qquad B_{eq}=B_1+B_2\left(\frac{N_1}{N_2}\right)^2`}</MM>
        Uma redução (<M>{'N_2>N_1'}</M>) faz a carga parecer bem mais leve para o motor.</Callout>

      <Exercise id="t-u3-rot" num="Ex." topic="Inércia refletida"
        steps={[
          { title: 'Relação', body: <p><M>{'N_1/N_2=10/50=0{,}2'}</M>, logo <M>{'(N_1/N_2)^2=0{,}04'}</M>.</p> },
          { title: 'Refletir', body: <MM>{String.raw`J_{eq}=0{,}01+2\cdot0{,}04=0{,}09\ \text{kg·m}^2,\qquad B_{eq}=0{,}5\cdot0{,}04=0{,}02\ \text{N·m·s}`}</MM> },
          { title: 'Modelo no eixo do motor', body: <MM>{String.raw`\frac{\Theta_1(s)}{T_1(s)}=\frac{1}{0{,}09s^2+0{,}02s}=\frac{1}{s(0{,}09s+0{,}02)}`}</MM> },
        ]}
        answer={<p>Sem mola, há um polo na origem: a posição angular integra a velocidade (sistema não BIBO-estável em posição).</p>}>
        <p>Um motor (inércia <M>{'J_1=0{,}01'}</M>) aciona, por engrenagens de 10 e 50 dentes, uma carga com <M>{'J_2=2'}</M> e atrito <M>{'B_2=0{,}5'}</M>. Obtenha <M>{'\\Theta_1(s)/T_1(s)'}</M> no eixo do motor.</p>
      </Exercise>
    </>
  )
}
