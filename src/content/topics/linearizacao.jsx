import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function Linearizacao() {
  return (
    <>
      <p>Quase todo sistema físico é não linear em alguma medida, mas as ferramentas da disciplina (convolução, Laplace, função de transferência, Routh) exigem modelos lineares. A linearização resolve esse impasse: perto de um ponto de operação, o comportamento não linear é bem aproximado por um modelo linear nos <b>desvios</b> em relação a esse ponto.</p>

      <h2>Ponto de operação (equilíbrio)</h2>
      <p>Considere <M>{'\\dot x=f(x,u)'}</M>. Um ponto de equilíbrio <M>{'(\\bar x,\\bar u)'}</M> satisfaz <M>{'f(\\bar x,\\bar u)=0'}</M>: com a entrada constante <M>{'\\bar u'}</M>, o estado fica parado em <M>{'\\bar x'}</M>. Definem-se os desvios</p>
      <MM>{String.raw`\delta x=x-\bar x,\qquad \delta u=u-\bar u`}</MM>

      <h2>Série de Taylor de 1ª ordem</h2>
      <p>Expandindo <M>f</M> em torno do equilíbrio e desprezando os termos de ordem 2 ou superior:</p>
      <MM>{String.raw`f(x,u)\approx \underbrace{f(\bar x,\bar u)}_{=0}+\frac{\partial f}{\partial x}\Big|_{(\bar x,\bar u)}\delta x+\frac{\partial f}{\partial u}\Big|_{(\bar x,\bar u)}\delta u`}</MM>
      <Callout tag="Modelo linearizado">
        <MM>{String.raw`\delta\dot x=a\,\delta x+b\,\delta u,\qquad a=\frac{\partial f}{\partial x}\Big|_{(\bar x,\bar u)},\quad b=\frac{\partial f}{\partial u}\Big|_{(\bar x,\bar u)}`}</MM>
        Para vários estados, <M>a</M> e <M>b</M> viram as matrizes jacobianas <M>{'A=\\partial f/\\partial x'}</M> e <M>{'B=\\partial f/\\partial u'}</M> — a mesma estrutura dos modelos em espaço de estados.
      </Callout>
      <p>O modelo vale apenas para desvios pequenos: quanto maior o desvio, mais pesam os termos desprezados.</p>

      <h2>Exemplo: tanque com saída livre (aula 4)<Slide file="04-equacoes-diferenciais.pdf" p={[6, 7]} label="aula 4, p. 6–7" /></h2>
      <p>O modelo não linear dos slides é <M>{String.raw`A\dot y=u-a\sqrt{2gy}`}</M>, ou seja, <M>{String.raw`f(y,u)=\frac{1}{A}\left(u-a\sqrt{2gy}\right)`}</M>.</p>
      <ol>
        <li><b>Equilíbrio</b>: <M>{String.raw`f(\bar y,\bar u)=0\Rightarrow \bar u=a\sqrt{2g\bar y}`}</M> (vazão de entrada igual à de saída).</li>
        <li><b>Derivadas</b>: <M>{String.raw`\frac{\partial f}{\partial y}=-\frac{a\sqrt{2g}}{2A\sqrt{\bar y}}`}</M> e <M>{String.raw`\frac{\partial f}{\partial u}=\frac1A`}</M>.</li>
        <li><b>Modelo nos desvios</b>: definindo a resistência hidráulica linearizada <M>{String.raw`R=\frac{2\sqrt{\bar y}}{a\sqrt{2g}}`}</M>,</li>
      </ol>
      <MM>{String.raw`A\,\delta\dot y=\delta u-\frac{\delta y}{R}\quad\Longrightarrow\quad \frac{\delta Y(s)}{\delta U(s)}=\frac{R}{ARs+1}`}</MM>
      <p>Um sistema de 1ª ordem com constante de tempo <M>{'T=AR'}</M>, que depende do ponto de operação: com o tanque mais cheio, <M>R</M> cresce e a resposta fica mais lenta.</p>

      <SimSlot name="tanque" />

      <Exercise id="t-lin-1" src={{ file: '04-equacoes-diferenciais.pdf', p: 17, label: 'aula 4, p. 17' }} num="Ex." topic="Com os parâmetros da Simulação 3 dos slides (A = 15, a = 0,2, g = 1000)"
        steps={[
          { title: 'Vazão de equilíbrio', body: <MM>{String.raw`\bar u=a\sqrt{2g\bar y}=0{,}2\sqrt{2\cdot1000\cdot20}=0{,}2\cdot200=40`}</MM> },
          { title: 'Resistência linearizada', body: <MM>{String.raw`R=\frac{2\sqrt{20}}{0{,}2\sqrt{2000}}=\frac{8{,}944}{8{,}944}=1`}</MM> },
          { title: 'Função de transferência', body: <MM>{String.raw`\frac{\delta Y}{\delta U}=\frac{R}{ARs+1}=\frac{1}{15s+1}`}</MM> },
          { title: 'Interpretação', body: <p>Um degrau <M>{'\\delta u=4'}</M> (10% de <M>{'\\bar u'}</M>) leva o nível a <M>{'\\bar y+\\delta y\\approx 24'}</M>, com <M>{'t_{ss}(2\\%)\\approx 4T=60'}</M> s. O modelo não linear dá <M>{'(44/0{,}2)^2/2000=24{,}2'}</M>: erro pequeno para um desvio pequeno.</p> },
        ]}
        answer={<p><M>{'\\bar u=40'}</M>, <M>{'R=1'}</M>, <M>{'\\delta Y/\\delta U=1/(15s+1)'}</M>.</p>}>
        <p>Linearize o tanque em torno de <M>{'\\bar y=20'}</M>: calcule <M>{'\\bar u'}</M>, a resistência linearizada e a função de transferência dos desvios.</p>
      </Exercise>

      <h2>Outro exemplo clássico: pêndulo</h2>
      <p>Para um pêndulo de comprimento <M>l</M> e massa <M>m</M> com torque <M>u</M>: <M>{String.raw`ml^2\ddot\theta=-mgl\sen\theta+u`}</M>. Em torno de <M>{'\\bar\\theta=0'}</M> (pendurado), <M>{'\\sen\\theta\\approx\\theta'}</M> e <M>{String.raw`ml^2\ddot\theta+mgl\,\theta=u`}</M>: um oscilador estável. Em torno de <M>{'\\bar\\theta=\\pi'}</M> (invertido), <M>{'\\sen\\theta\\approx-\\delta\\theta'}</M> e o sinal do termo muda: <M>{String.raw`ml^2\delta\ddot\theta-mgl\,\delta\theta=\delta u`}</M>, com um polo no semiplano direito. O mesmo sistema não linear gera modelos lineares com propriedades opostas, dependendo do ponto de operação.</p>
    </>
  )
}
