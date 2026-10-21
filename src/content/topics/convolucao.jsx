import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'
import Plot, { sample } from '../../components/Plot.jsx'

export default function Convolucao() {
  const pulse = sample((t) => (t < 0 ? 0 : t < 2 ? 1 - Math.exp(-2 * t) : Math.exp(-2 * (t - 2)) - Math.exp(-2 * t)), 0, 5, 400)
  return (
    <>
      <p>Objetivo: uma representação matemática que permita calcular a saída <M>y(t)</M> a partir da entrada <M>u(t)</M> (representação entrada–saída). Para SLIT causais e relaxados, essa representação é a integral de convolução, e o único "dado" do sistema que ela exige é a resposta ao impulso.</p>

      <h2>Funções singulares<Slide p={[6, 10]} /></h2>
      <MM>{String.raw`u_{-1}(t)=\begin{cases}1,&t\ge 0\\0,&t<0\end{cases}\qquad f'_\Delta(t)=\begin{cases}\dfrac{1}{\Delta},&0\le t<\Delta\\[4pt]0,&\text{caso contrário}\end{cases}\qquad \delta(t)=\lim_{\Delta\to 0}f'_\Delta(t)`}</MM>
      <p>O pulso <M>{"f'_\\Delta"}</M> tem área unitária; é a derivada da rampa saturada <M>{'f_\\Delta'}</M>. No limite <M>{'\\Delta\\to 0'}</M> obtém-se o impulso unitário, com as propriedades:</p>
      <ol>
        <li><M>{String.raw`\dfrac{d}{dt}u_{-1}(t)=\delta(t)`}</M></li>
        <li><M>{String.raw`\int_{-\infty}^{\infty}\delta(t-t_0)\,dt=\int_{t_0-\epsilon}^{t_0+\epsilon}\delta(t-t_0)\,dt=1,\ \forall\epsilon>0`}</M></li>
        <li><M>{String.raw`\int_{-\infty}^{t}\delta(\tau-t_0)\,d\tau=u_{-1}(t-t_0)`}</M></li>
        <li><M>{String.raw`\int_{-\infty}^{\infty}f(t)\,\delta(t-t_0)\,dt=f(t_0)`}</M>, se <M>f</M> é contínua em <M>{'t_0'}</M> (propriedade de amostragem).</li>
      </ol>

      <h2>Da soma de pulsos à integral<Slide p={[13, 20]} /></h2>
      <p>A entrada é aproximada por uma sequência de pulsos estreitos: <M>{String.raw`u(t)\approx\sum_i u(t_i)\,f'_\Delta(t-t_i)\,\Delta`}</M>. Cada hipótese sobre o sistema simplifica a representação:</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Hipótese</th><th>Consequência</th></tr></thead>
        <tbody>
          <tr><td>1. Linear (superposição)</td><td><M>{String.raw`y(t)\approx\sum_i u(t_i)\,g_\Delta(t,t_i)\,\Delta\ \xrightarrow{\Delta\to 0}\ y(t)=\int_{-\infty}^{\infty}g(t,\tau)\,u(\tau)\,d\tau`}</M></td></tr>
          <tr><td>2. Causal</td><td>entradas após <M>t</M> não afetam <M>y(t)</M>: o limite superior vira <M>t</M></td></tr>
          <tr><td>3. Relaxado em <M>{'t_0'}</M></td><td>entradas antes de <M>{'t_0'}</M> não afetam a resposta: o limite inferior vira <M>{'t_0'}</M></td></tr>
          <tr><td>4. Invariante no tempo</td><td><M>{String.raw`g(t,\tau)=g(t-\tau,0)\equiv g(t-\tau)`}</M>; tomando <M>{'t_0=0'}</M>:</td></tr>
        </tbody></table></div>
      <p>Aqui <M>{'g(t,\\tau)'}</M> é a saída no instante <M>t</M> devida a um impulso aplicado no instante <M>{'\\tau'}</M>.</p>
      <Callout tag="Integral de convolução — modelo de SLIT causal relaxado em t = 0">
        <MM>{String.raw`y(t)=g(t)*u(t)=\int_0^t g(t-\tau)\,u(\tau)\,d\tau=\int_0^t g(\tau)\,u(t-\tau)\,d\tau`}</MM>
        Conhecendo a resposta ao impulso <M>g(t)</M> e a entrada <M>{'u(t),\\ t\\ge0'}</M>, calcula-se <M>y(t)</M>.
      </Callout>

      <SimSlot name="convolucao" />

      <h2>Exercício dos slides: circuito RL<Slide p={21} /></h2>
      <Exercise id="t-conv-rl" review={['integrais', 'exp-log']} src={{ p: 21 }} num="RL" topic="Slides, aula 3"
        hint={<p>Separe em dois intervalos: enquanto <M>{'t<2'}</M> o pulso ainda está "ligado"; para <M>{'t\\ge 2'}</M> a integral só vai até <M>{'\\tau = 2'}</M>.</p>}
        steps={[
          { title: 'Montar a integral', body: <MM>{String.raw`y(t)=\int_0^t 2e^{-2(t-\tau)}\,u(\tau)\,d\tau`}</MM> },
          { title: 'Intervalo 0 ≤ t < 2', body: <><p>Aqui <M>{'u(\\tau)=1'}</M> em todo o intervalo de integração:</p><MM>{String.raw`y(t)=2e^{-2t}\int_0^t e^{2\tau}d\tau=2e^{-2t}\cdot\frac{e^{2t}-1}{2}=1-e^{-2t}`}</MM></> },
          { title: 'Intervalo t ≥ 2', body: <><p>Agora <M>{'u(\\tau)=0'}</M> para <M>{'\\tau>2'}</M>:</p><MM>{String.raw`y(t)=2e^{-2t}\int_0^2 e^{2\tau}d\tau=e^{-2t}\left(e^{4}-1\right)=e^{-2(t-2)}-e^{-2t}`}</MM></> },
          { title: 'Conferir continuidade', body: <p>Em <M>t=2</M>: <M>{'1-e^{-4}'}</M> pelos dois lados. A saída é contínua (a corrente no indutor não salta), como esperado.</p> },
        ]}
        answer={<><MM>{String.raw`y(t)=\begin{cases}1-e^{-2t},&0\le t<2\\ e^{-2(t-2)}-e^{-2t},&t\ge 2\end{cases}`}</MM><Plot height={170} xRange={[0, 5]} series={[{ ...pulse, color: 'var(--good)' }]} yLabel="y(t)" /></>}>
        <p>Circuito RL série (<M>{'R=1\\,\\Omega'}</M>, <M>{'L=0{,}5\\,\\text{H}'}</M>), relaxado em <M>t=0</M>, com resposta ao impulso <M>{'g(t)=2e^{-2t},\\ t\\ge0'}</M>. Calcule a resposta à entrada <M>{'u(t)=1\\,\\text{V}'}</M> para <M>{'0\\le t<2\\,\\text{s}'}</M> e <M>{'u(t)=0'}</M> para <M>{'t\\ge 2\\,\\text{s}'}</M>.</p>
      </Exercise>

      <h2>Entradas exponenciais e a função de transferência<Slide p={[23, 24]} /></h2>
      <p>Para a entrada exponencial <M>{'u(t)=e^{st},\\ t\\ge0'}</M>, usando a segunda forma da convolução:</p>
      <MM>{String.raw`y(t)=\int_0^{t}g(\tau)e^{s(t-\tau)}d\tau\ \to\ \left[\int_0^\infty g(\tau)e^{-s\tau}d\tau\right]e^{st}=G(s)\,e^{st}`}</MM>
      <p>A resposta de um SLIT a uma exponencial é a própria exponencial multiplicada por um número complexo <M>G(s)</M>, a <b>função de transferência</b>:</p>
      <MM>{String.raw`G(s)=\int_0^\infty g(\tau)\,e^{-s\tau}\,d\tau`}</MM>
      <p>Se a entrada puder ser escrita como combinação linear de exponenciais, a resposta sai da superposição. É exatamente essa a ideia da Transformada de Laplace, tema das próximas aulas.</p>
      <div className="note"><span className="tag">No MATLAB (slides)<Slide p={[26, 28]} /></span>Os scripts sugeridos calculam <code>impulse(G)</code> para confirmar <M>{'g(t)=2e^{-2t}'}</M>, aproximam a convolução por <code>conv(u,g)*dt</code> e comparam com <code>lsim(G,u,t)</code>. A simulação acima faz a mesma comparação numericamente (regra do trapézio).</div>
    </>
  )
}
