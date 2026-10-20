import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function Classificacao() {
  return (
    <>
      <p>Classificar um sistema diz quais ferramentas podem ser usadas para analisá-lo. Os slides organizam a classificação em seis eixos: memória, tempo, linearidade, causalidade, natureza e tipo de sinal.</p>

      <h2>Com memória (dinâmicos) ou sem memória (instantâneos)<Slide p={[5, 7]} /></h2>
      <p>Num sistema <b>sem memória</b>, <M>y(t)</M> depende apenas de <M>x(t)</M> no mesmo instante. Num sistema <b>com memória</b>, também chamado dinâmico, <M>y(t)</M> depende de valores passados <M>{'x(\\tau),\\ \\tau<t'}</M>.</p>
      <MM>{String.raw`y(t)=Rx(t)\quad\text{(sem memória)}\qquad\qquad y(t)=Rx(t)+\frac{1}{C}\int_{-\infty}^{t}x(\tau)\,d\tau = Rx(t)+v_C(0)+\frac{1}{C}\int_0^t x(\tau)\,d\tau`}</MM>
      <p>No circuito RC, a tensão inicial do capacitor <M>{'v_C(0)'}</M> resume todo o passado da entrada: é a memória do sistema.</p>

      <h2>Invariante ou variante no tempo<Slide p={[8, 9]} /></h2>
      <p>Um sistema invariante responde da mesma maneira a uma entrada, independentemente do instante em que ela é aplicada: atrasar a entrada apenas atrasa a saída. Em síntese, tem parâmetros constantes.</p>
      <MM>{String.raw`\frac{dy(t)}{dt}+a(t)\,y(t)=0:\qquad a(t)=2\ \Rightarrow\ \text{invariante};\qquad a(t)=2(1-t)\ \Rightarrow\ \text{variante}`}</MM>

      <h2>Linear ou não linear<Slide p={[10, 14]} /></h2>
      <Callout tag="Princípio da superposição">Um sistema é linear se satisfaz simultaneamente a <b>aditividade</b> (<M>{'u_1+u_2 \\mapsto y_1+y_2'}</M>) e a <b>homogeneidade</b> (<M>{'\\alpha u \\mapsto \\alpha y'}</M>):
        <MM>{String.raw`\alpha_1u_1(t)+\alpha_2u_2(t)\ \longmapsto\ \alpha_1y_1(t)+\alpha_2y_2(t)`}</MM></Callout>
      <p><b>Exemplo linear</b> (slides): com condições iniciais nulas, <M>{'\\dot y + 2y = 3u'}</M> tem solução <M>{String.raw`y(t)=3e^{-2t}\int_{t_0}^t e^{2\lambda}u(\lambda)\,d\lambda`}</M>. Pela linearidade da integral, a resposta a <M>{'\\alpha_1u_1+\\alpha_2u_2'}</M> é <M>{'\\alpha_1y_1+\\alpha_2y_2'}</M>.</p>
      <p><b>Exemplo não linear</b>: <M>{'y=u^2'}</M>, pois <M>{'(\\alpha_1u_1+\\alpha_2u_2)^2\\neq\\alpha_1u_1^2+\\alpha_2u_2^2'}</M>. É sem memória, mas não linear.</p>
      <div className="warn"><span className="tag">Cuidado com o termo constante</span>Um sistema como <M>{'y=5u-3'}</M> parece "uma reta", mas não é linear: com <M>{'u=0'}</M> a saída é −3, o que viola a homogeneidade. Sistemas assim são chamados afins.</div>

      <h2>Causal ou não causal<Slide p={15} /></h2>
      <p>Um sistema é causal (não antecipativo) se a saída num instante não depende de entradas aplicadas depois desse instante. Para calcular <M>y(t)</M>, ele não precisa conhecer <M>{'u(\\tau)'}</M> com <M>{'\\tau>t'}</M>. Todo sistema físico é causal.</p>

      <h2>Determinístico ou estocástico; contínuo ou discreto<Slide p={[16, 19]} /></h2>
      <ul>
        <li><b>Determinístico</b>: para uma condição inicial e uma entrada há apenas uma saída possível. <b>Estocástico</b>: há comportamento aleatório (por exemplo, entradas com ruído).</li>
        <li><b>Contínuo</b>: as variáveis mudam continuamente no tempo. <b>Discreto</b>: alguma variável só é conhecida em instantes discretos. <b>Quantizado</b>: alguma variável assume um número finito de valores. <b>Digital</b>: discreto e quantizado.</li>
      </ul>
      <p>O escopo do curso inclui sistemas instantâneos ou dinâmicos, variantes ou invariantes, lineares ou não lineares, causais ou não, determinísticos ou não, de tempo contínuo ou discreto — com ênfase nos <b>lineares, invariantes no tempo e de tempo contínuo</b> (SLIT).</p>

      <p className="small muted">As simulações abaixo reproduzem as sugestões em MATLAB do fim da aula<Slide p={[22, 25]} />.</p>
      <SimSlot name="classificacao" />

      <h2>Teste rápido</h2>
      <Exercise id="t-class-1" src={{ file: 'lista-1.pdf', p: 1, label: 'Lista 1, p. 1' }} num="A" topic="Aplicação direta das definições"
        steps={[
          { title: 'Linearidade', body: <p>Para <M>{'u = \\alpha_1u_1+\\alpha_2u_2'}</M>: <M>{'y = t(\\alpha_1u_1+\\alpha_2u_2) = \\alpha_1(tu_1)+\\alpha_2(tu_2)'}</M>. Vale a superposição: <b>linear</b>.</p> },
          { title: 'Invariância', body: <p>Atrasando a entrada: <M>{'u(t-t_0)\\mapsto t\\,u(t-t_0)'}</M>. Atrasando a saída: <M>{'y(t-t_0)=(t-t_0)u(t-t_0)'}</M>. São diferentes, pois o "ganho" <M>t</M> muda com o tempo: <b>variante</b>.</p> },
          { title: 'Memória e causalidade', body: <p><M>y(t)</M> só depende de <M>u(t)</M> no mesmo instante: <b>sem memória</b> (estático) e, portanto, <b>causal</b>.</p> },
        ]}
        answer={<p>Linear, variante no tempo, estático e causal (confere com o gabarito da Lista 1, item 1b).</p>}>
        <p>Classifique <M>{'y(t)=t\\,u(t)'}</M> quanto a linearidade, invariância, memória e causalidade.</p>
      </Exercise>
    </>
  )
}
