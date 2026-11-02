import { M, MM } from '../components/Tex.jsx'
import Exercise from '../components/Exercise.jsx'
import { Callout } from '../components/Controls.jsx'
import Plot, { sample } from '../components/Plot.jsx'

const s = (title, body, review) => ({ title, body, review })
const src = (p) => ({ file: 'lista-3.pdf', p, label: `enunciado: Lista 3, p. ${p}` })

function Formulario() {
  return (
    <div className="note"><span className="tag">Formulário da lista</span>
      <p style={{ margin: '.2rem 0' }}>Modelo: <M>{String.raw`\dot x=Ax+Bu,\ y=Cx+Du`}</M>. Função de transferência: <M>{String.raw`G(s)=C(sI-A)^{-1}B+D`}</M>; os polos de <M>G</M> são autovalores de <M>A</M>.</p>
      <p style={{ margin: '.2rem 0' }}>Controlabilidade: <M>{String.raw`\mathcal C=[B\ \ AB\ \cdots\ A^{n-1}B]`}</M>, controlável ⇔ posto <M>n</M>. Observabilidade: <M>{String.raw`\mathcal O=[C;\ CA;\ \cdots;\ CA^{n-1}]`}</M>, observável ⇔ posto <M>n</M>. PBH: <M>{String.raw`\operatorname{posto}[A-\lambda I\ \ B]=n`}</M> e <M>{String.raw`\operatorname{posto}\begin{bmatrix}A-\lambda I\\ C\end{bmatrix}=n`}</M> para todo autovalor <M>{'\\lambda'}</M>.</p>
      <p style={{ margin: '.2rem 0' }}>Transição: <M>{String.raw`\Phi(t)=e^{At}=\mathcal L^{-1}\{(sI-A)^{-1}\}`}</M>; <M>{String.raw`x(t)=\Phi(t)x(0)+\int_0^t\Phi(t-\tau)Bu(\tau)\,d\tau`}</M>; para impulso, <M>{String.raw`x(t)=\Phi(t)[x(0)+B]`}</M>.</p>
    </div>
  )
}

export default function Lista3() {
  const y14 = sample((t) => 4 / 3 - Math.exp(-t) - Math.exp(-3 * t) / 3, 0, 6, 400)
  const y15 = sample((t) => Math.cos(2 * t) + 0.5 * Math.sin(2 * t), 0, 8, 500)
  const y16 = sample((t) => t * Math.exp(-2 * t), 0, 4, 400)
  const y17 = sample((t) => -1 / 20 + t / 2 + (21 / 20) * Math.exp(-10 * t), 0, 2, 400)
  return (
    <>
      <Formulario />
      <Callout kind="tip" tag="Para acompanhar">As simulações <a href="#/laboratorio?sim=estados">Trajetórias no espaço de estados</a>, <a href="#/laboratorio?sim=controlabilidade">Controlabilidade em 3D</a>, <a href="#/laboratorio?sim=observabilidade">Observabilidade</a> e <a href="#/laboratorio?sim=matriz">Matriz como transformação</a> mostram o que as contas desta lista significam. O <a href="#/fluxos/espaco-estados">fluxograma de espaço de estados</a> resume o caminho das questões.</Callout>

      <h2>Parte 1 — Modelos em espaço de estados</h2>

      <Exercise id="l3-1" review={['edo-basico', 'matrizes', 'polinomios']} src={src(1)} num="1" topic="Forma canônica controlável a partir da EDO"
        steps={[
          s('Escolher os estados', <p>Ordem 3 ⇒ três estados: a saída e suas derivadas, <M>{String.raw`x_1=y,\ x_2=\dot y,\ x_3=\ddot y`}</M>. Então <M>{String.raw`\dot x_1=x_2`}</M>, <M>{String.raw`\dot x_2=x_3`}</M> e, isolando <M>{String.raw`\dddot y`}</M> na EDO, <M>{String.raw`\dot x_3=-6x_1-11x_2-6x_3+u`}</M>.</p>),
          s('Montar as matrizes', <MM>{String.raw`A=\begin{bmatrix}0&1&0\\0&0&1\\-6&-11&-6\end{bmatrix},\quad B=\begin{bmatrix}0\\0\\1\end{bmatrix},\quad C=\begin{bmatrix}1&0&0\end{bmatrix},\quad D=0`}</MM>),
          s('Polinômio característico', <p>Na forma companheira, a última linha traz os coeficientes com sinal trocado: <M>{String.raw`\det(sI-A)=s^3+6s^2+11s+6`}</M>. Testando <M>{'s=-1'}</M>: <M>{'-1+6-11+6=0'}</M>; dividindo, <M>{String.raw`(s+1)(s^2+5s+6)=(s+1)(s+2)(s+3)`}</M>.</p>, ['polinomios', 'determinante']),
          s('Autovalores e polos', <p>Autovalores <M>{'-1,-2,-3'}</M>. Como <M>{String.raw`G(s)=\frac{1}{s^3+6s^2+11s+6}`}</M>, os polos da FT são exatamente os autovalores de <M>A</M>: o denominador de <M>G</M> é <M>{String.raw`\det(sI-A)`}</M>.</p>, ['autovalores']),
        ]}
        answer={<p>(a) matrizes acima; (b) autovalores <M>{'-1,-2,-3'}</M>, iguais aos polos de <M>{String.raw`G(s)=\frac{1}{(s+1)(s+2)(s+3)}`}</M>.</p>}>
        <p>Para <M>{String.raw`\dddot y+6\ddot y+11\dot y+6y=u`}</M>: (a) obtenha a representação em espaço de estados na forma canônica controlável; (b) determine os autovalores de <M>A</M> e relacione-os com os polos da função de transferência.</p>
      </Exercise>

      <Exercise id="l3-2" review={['matrizes', 'polinomios']} src={src(1)} num="2" topic="Formas canônicas controlável e observável"
        hint={<p>A forma observável é a <b>transposta</b> da controlável: <M>{String.raw`A_o=A_c^T`}</M>, <M>{String.raw`B_o=C_c^T`}</M>, <M>{String.raw`C_o=B_c^T`}</M>.</p>}
        steps={[
          s('Identificar os coeficientes', <p><M>{String.raw`G=\frac{b_1s+b_2}{s^2+a_1s+a_2}`}</M> com <M>{'a_1=3,\\ a_2=2,\\ b_1=2,\\ b_2=1'}</M>.</p>),
          s('Forma controlável', <MM>{String.raw`A_c=\begin{bmatrix}0&1\\-2&-3\end{bmatrix},\ B_c=\begin{bmatrix}0\\1\end{bmatrix},\ C_c=\begin{bmatrix}b_2&b_1\end{bmatrix}=\begin{bmatrix}1&2\end{bmatrix},\ D=0`}</MM>),
          s('Forma observável (dual)', <MM>{String.raw`A_o=A_c^T=\begin{bmatrix}0&-2\\1&-3\end{bmatrix},\ B_o=C_c^T=\begin{bmatrix}1\\2\end{bmatrix},\ C_o=B_c^T=\begin{bmatrix}0&1\end{bmatrix},\ D=0`}</MM>),
          s('Mesmos autovalores', <p>Uma matriz e sua transposta têm o mesmo determinante, logo o mesmo polinômio característico: <M>{String.raw`s^2+3s+2=(s+1)(s+2)`}</M>, autovalores <M>{'-1'}</M> e <M>{'-2'}</M> nas duas.</p>, ['determinante', 'autovalores']),
          s('Conferir G(s) na controlável', <p><M>{String.raw`(sI-A_c)^{-1}B_c=\frac{1}{s^2+3s+2}\begin{bmatrix}1\\s\end{bmatrix}`}</M>, e <M>{String.raw`C_c\,(\cdot)=\frac{1+2s}{s^2+3s+2}`}</M>.</p>, ['matrizes']),
          s('Conferir G(s) na observável', <p><M>{String.raw`(sI-A_o)^{-1}=\frac{1}{s^2+3s+2}\begin{bmatrix}s+3&-2\\1&s\end{bmatrix}`}</M>; vezes <M>{'B_o'}</M>: <M>{String.raw`\frac{1}{s^2+3s+2}\begin{bmatrix}s-1\\2s+1\end{bmatrix}`}</M>; <M>{'C_o'}</M> pega a segunda linha: <M>{String.raw`\frac{2s+1}{s^2+3s+2}`}</M>.</p>),
        ]}
        answer={<p>(a) e (b) matrizes acima; (c) ambas têm autovalores <M>{'-1,-2'}</M> e reproduzem <M>{String.raw`G(s)=\frac{2s+1}{s^2+3s+2}`}</M>.</p>}>
        <p>Dada <M>{String.raw`G(s)=\frac{2s+1}{s^2+3s+2}`}</M>: (a) obtenha a realização na forma canônica controlável; (b) na forma canônica observável; (c) verifique que ambas têm os mesmos autovalores e reproduzem <M>G(s)</M>.</p>
      </Exercise>

      <Exercise id="l3-3" review={['matrizes', 'determinante', 'polinomios']} src={src(1)} num="3" topic="De espaço de estados para FT"
        steps={[
          s('sI − A e seu determinante', <p><M>{String.raw`sI-A=\begin{bmatrix}s&-1\\6&s+5\end{bmatrix}`}</M>, <M>{String.raw`\det=s(s+5)+6=s^2+5s+6`}</M>.</p>),
          s('Inversa 2 × 2', <p>Troca a diagonal, inverte o sinal da outra diagonal e divide pelo determinante: <M>{String.raw`(sI-A)^{-1}=\frac{1}{s^2+5s+6}\begin{bmatrix}s+5&1\\-6&s\end{bmatrix}`}</M>.</p>, ['matrizes']),
          s('Multiplicar por B e por C', <p><M>{String.raw`(sI-A)^{-1}B=\frac{1}{s^2+5s+6}\begin{bmatrix}1\\s\end{bmatrix}`}</M>; com <M>{String.raw`C=[1\ \ 1]`}</M>: <M>{String.raw`G(s)=\frac{s+1}{s^2+5s+6}=\frac{s+1}{(s+2)(s+3)}`}</M>.</p>),
          s('Polos e zero', <p>Polos <M>{'-2'}</M> e <M>{'-3'}</M> (autovalores de <M>A</M>); zero em <M>{'-1'}</M>, criado pela matriz <M>C</M>, que soma posição e velocidade.</p>),
        ]}
        answer={<p>(a) <M>{String.raw`G(s)=\frac{s+1}{(s+2)(s+3)}`}</M>; (b) polos <M>{'-2,-3'}</M>; zero <M>{'-1'}</M>.</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}0&1\\-6&-5\end{bmatrix}x+\begin{bmatrix}0\\1\end{bmatrix}u`}</M>, <M>{String.raw`y=[1\ \ 1]\,x`}</M>: (a) determine <M>{'G(s)=Y(s)/U(s)'}</M>; (b) identifique polos e zeros.</p>
      </Exercise>

      <Exercise id="l3-4" review={['edo-basico', 'autovalores']} src={src(1)} num="4" topic="Massa–mola–amortecedor"
        steps={[
          s('Estados', <p>Com <M>{String.raw`x_1=x`}</M> e <M>{String.raw`x_2=\dot x`}</M>: <M>{String.raw`\dot x_1=x_2`}</M> e, de <M>{String.raw`m\ddot x=F-b\dot x-kx`}</M>, <M>{String.raw`\dot x_2=-\frac km x_1-\frac bm x_2+\frac1m F`}</M>.</p>),
          s('Matrizes', <MM>{String.raw`A=\begin{bmatrix}0&1\\-k/m&-b/m\end{bmatrix},\ B=\begin{bmatrix}0\\1/m\end{bmatrix},\ C=\begin{bmatrix}1&0\end{bmatrix},\ D=0`}</MM>),
          s('Valores numéricos', <p><M>{'m=1,\\ b=3,\\ k=2'}</M>: <M>{String.raw`\det(sI-A)=s^2+3s+2=(s+1)(s+2)`}</M>, autovalores <M>{'-1'}</M> e <M>{'-2'}</M>.</p>, ['polinomios']),
          s('Estabilidade', <p>Autovalores reais e negativos ⇒ assintoticamente estável; como são reais, a resposta livre não oscila (sobreamortecido, <M>{String.raw`\xi=\frac{3}{2\sqrt2}\approx1{,}06`}</M>).</p>),
        ]}
        answer={<p>(a) matrizes acima; (b) autovalores <M>{'-1'}</M> e <M>{'-2'}</M>: estável.</p>}>
        <p>Para <M>{String.raw`m\ddot x+b\dot x+kx=F`}</M>, com entrada <M>F</M> e saída <M>x</M>: (a) com <M>{'x_1=x'}</M>, <M>{String.raw`x_2=\dot x`}</M>, escreva <M>{'(A,B,C,D)'}</M>; (b) para <M>{'m=1'}</M>, <M>{'b=3'}</M>, <M>{'k=2'}</M>, determine os autovalores de <M>A</M> e classifique a estabilidade.</p>
      </Exercise>

      <Exercise id="l3-5" review={['matrizes', 'fracoes', 'exp-log']} src={src(2)} num="5" topic="Matriz de transição de estados"
        steps={[
          s('Inversa de sI − A', <MM>{String.raw`\Phi(s)=(sI-A)^{-1}=\frac{1}{(s+1)(s+2)}\begin{bmatrix}s+3&1\\-2&s\end{bmatrix}`}</MM>, ['matrizes']),
          s('Frações parciais, elemento a elemento', <MM>{String.raw`\begin{aligned}\tfrac{s+3}{(s+1)(s+2)}&=\tfrac{2}{s+1}-\tfrac{1}{s+2} & \tfrac{1}{(s+1)(s+2)}&=\tfrac{1}{s+1}-\tfrac{1}{s+2}\\ \tfrac{-2}{(s+1)(s+2)}&=\tfrac{-2}{s+1}+\tfrac{2}{s+2} & \tfrac{s}{(s+1)(s+2)}&=\tfrac{-1}{s+1}+\tfrac{2}{s+2}\end{aligned}`}</MM>, ['fracoes']),
          s('Inversa de Laplace', <MM>{String.raw`\Phi(t)=e^{At}=\begin{bmatrix}2e^{-t}-e^{-2t}&e^{-t}-e^{-2t}\\-2e^{-t}+2e^{-2t}&-e^{-t}+2e^{-2t}\end{bmatrix},\quad t\ge0`}</MM>),
          s('Conferência rápida', <p>Em <M>{'t=0'}</M>: <M>{String.raw`\Phi(0)=\begin{bmatrix}1&0\\0&1\end{bmatrix}=I`}</M>, como deve ser. Os expoentes <M>{'-1'}</M> e <M>{'-2'}</M> são os autovalores de <M>A</M>.</p>),
        ]}
        answer={<p><M>{String.raw`\Phi(s)`}</M> e <M>{String.raw`\Phi(t)`}</M> acima.</p>}>
        <p>Para <M>{String.raw`A=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}`}</M>: (a) determine <M>{String.raw`\Phi(s)=(sI-A)^{-1}`}</M>; (b) obtenha <M>{String.raw`\Phi(t)=e^{At}`}</M>.</p>
      </Exercise>

      <h2>Parte 2 — Controlabilidade</h2>

      <Exercise id="l3-6" review={['matrizes', 'posto']} src={src(2)} num="6" topic="Matriz de controlabilidade"
        steps={[
          s('Calcular AB', <p><M>{String.raw`AB=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}\begin{bmatrix}0\\1\end{bmatrix}=\begin{bmatrix}1\\-3\end{bmatrix}`}</M>.</p>, ['matrizes']),
          s('Montar 𝒞 e o posto', <p><M>{String.raw`\mathcal C=[B\ \ AB]=\begin{bmatrix}0&1\\1&-3\end{bmatrix}`}</M>, <M>{String.raw`\det\mathcal C=0\cdot(-3)-1\cdot1=-1\ne0`}</M> ⇒ posto 2.</p>, ['determinante', 'posto']),
          s('Conclusão', <p>Posto <M>{'2=n'}</M> ⇒ controlável: a entrada consegue levar o estado a qualquer ponto do plano.</p>),
        ]}
        answer={<p><M>{String.raw`\mathcal C=\begin{bmatrix}0&1\\1&-3\end{bmatrix}`}</M>, posto 2: controlável.</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}x+\begin{bmatrix}0\\1\end{bmatrix}u`}</M>, monte <M>{String.raw`\mathcal C`}</M>, calcule o posto e conclua sobre a controlabilidade.</p>
      </Exercise>

      <Exercise id="l3-7" review={['posto', 'autovalores']} src={src(2)} num="7" topic="Teste PBH em sistema diagonal"
        steps={[
          s('Matriz de controlabilidade', <p><M>{String.raw`AB=\begin{bmatrix}-2\\0\end{bmatrix}`}</M>, <M>{String.raw`\mathcal C=\begin{bmatrix}1&-2\\0&0\end{bmatrix}`}</M>: segunda linha nula ⇒ posto 1 &lt; 2, não controlável.</p>, ['posto']),
          s('PBH para λ = −2', <p><M>{String.raw`[A+2I\ \ B]=\begin{bmatrix}0&0&1\\0&-1&0\end{bmatrix}`}</M>, posto 2 ⇒ este modo é controlável.</p>),
          s('PBH para λ = −3', <p><M>{String.raw`[A+3I\ \ B]=\begin{bmatrix}1&0&1\\0&0&0\end{bmatrix}`}</M>, posto 1 ⇒ <M>{String.raw`\lambda=-3`}</M> é o autovalor não controlável.</p>),
          s('Interpretação', <p>Com <M>A</M> diagonal, cada estado evolui sozinho. <M>{String.raw`\dot x_2=-3x_2`}</M> não recebe a entrada (o segundo elemento de <M>B</M> é zero) nem está acoplado a <M>{'x_1'}</M>: nada que se faça em <M>u</M> muda esse modo.</p>),
        ]}
        answer={<p>(a) posto 1: não controlável; (b) <M>{String.raw`\lambda=-3`}</M> é o autovalor não controlável.</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}-2&0\\0&-3\end{bmatrix}x+\begin{bmatrix}1\\0\end{bmatrix}u`}</M>: (a) monte <M>{String.raw`\mathcal C`}</M> e determine o posto; (b) use o teste PBH para identificar o autovalor não controlável.</p>
      </Exercise>

      <Exercise id="l3-8" review={['determinante', 'polinomios', 'autovalores']} src={src(2)} num="8" topic="Parâmetro que destrói a controlabilidade"
        steps={[
          s('Matriz de controlabilidade', <p><M>{String.raw`AB=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}\begin{bmatrix}1\\\alpha\end{bmatrix}=\begin{bmatrix}\alpha\\-2-3\alpha\end{bmatrix}`}</M>, <M>{String.raw`\mathcal C=\begin{bmatrix}1&\alpha\\\alpha&-2-3\alpha\end{bmatrix}`}</M>.</p>),
          s('Determinante', <p><M>{String.raw`\det\mathcal C=-2-3\alpha-\alpha^2=-(\alpha+1)(\alpha+2)`}</M>. Perde posto para <M>{String.raw`\alpha=-1`}</M> ou <M>{String.raw`\alpha=-2`}</M>.</p>, ['polinomios']),
          s('Autovetores de A', <p>Autovalores <M>{'-1'}</M> e <M>{'-2'}</M>, com autovetores <M>{String.raw`v_{-1}=\begin{bmatrix}1\\-1\end{bmatrix}`}</M> e <M>{String.raw`v_{-2}=\begin{bmatrix}1\\-2\end{bmatrix}`}</M>.</p>, ['autovalores']),
          s('α = −1', <p><M>{String.raw`B=[1;\,-1]=v_{-1}`}</M>: a entrada empurra o estado só ao longo do autovetor de <M>{'-1'}</M>, que é invariante. O modo <M>{'-2'}</M> não é alcançado. PBH: <M>{String.raw`[A+2I\ \ B]=\begin{bmatrix}2&1&1\\-2&-1&-1\end{bmatrix}`}</M>, posto 1.</p>),
          s('α = −2', <p><M>{String.raw`B=[1;\,-2]=v_{-2}`}</M>: agora o modo não controlável é <M>{'-1'}</M>. PBH: <M>{String.raw`[A+I\ \ B]=\begin{bmatrix}1&1&1\\-2&-2&-2\end{bmatrix}`}</M>, posto 1.</p>),
        ]}
        answer={<p>Não controlável para <M>{String.raw`\alpha=-1`}</M> (autovalor não controlável <M>{'-2'}</M>) e para <M>{String.raw`\alpha=-2`}</M> (autovalor não controlável <M>{'-1'}</M>).</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}x+\begin{bmatrix}1\\\alpha\end{bmatrix}u`}</M>, determine todos os <M>{'\\alpha'}</M> para os quais o sistema não é controlável e, para cada um, o autovalor não controlável (PBH).</p>
      </Exercise>

      <h2>Parte 3 — Observabilidade</h2>

      <Exercise id="l3-9" review={['matrizes', 'posto']} src={src(2)} num="9" topic="Matriz de observabilidade"
        steps={[
          s('Calcular CA', <p><M>{String.raw`CA=[1\ \ 0]\begin{bmatrix}0&1\\-2&-3\end{bmatrix}=[0\ \ 1]`}</M>.</p>, ['matrizes']),
          s('Montar 𝒪', <p><M>{String.raw`\mathcal O=\begin{bmatrix}C\\CA\end{bmatrix}=\begin{bmatrix}1&0\\0&1\end{bmatrix}`}</M>, <M>{String.raw`\det\mathcal O=1`}</M> ⇒ posto 2: observável.</p>),
          s('Interpretação', <p>A saída mede <M>{'x_1'}</M>; a derivada da saída, <M>{String.raw`\dot y=\dot x_1=x_2`}</M>, revela o outro estado.</p>),
        ]}
        answer={<p><M>{String.raw`\mathcal O=I`}</M>, posto 2: observável.</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}x`}</M>, <M>{String.raw`y=[1\ \ 0]\,x`}</M>, monte <M>{String.raw`\mathcal O`}</M>, calcule o posto e conclua sobre a observabilidade.</p>
      </Exercise>

      <Exercise id="l3-10" review={['posto', 'autovalores']} src={src(2)} num="10" topic="Teste PBH de observabilidade"
        steps={[
          s('Matriz de observabilidade', <p><M>{String.raw`CA=[0\ \ -3]`}</M>, <M>{String.raw`\mathcal O=\begin{bmatrix}0&1\\0&-3\end{bmatrix}`}</M>: primeira coluna nula ⇒ posto 1, não observável.</p>, ['posto']),
          s('PBH para λ = −2', <p><M>{String.raw`\begin{bmatrix}A+2I\\C\end{bmatrix}=\begin{bmatrix}0&0\\0&-1\\0&1\end{bmatrix}`}</M>, posto 1 ⇒ <M>{String.raw`\lambda=-2`}</M> é não observável.</p>),
          s('PBH para λ = −3', <p><M>{String.raw`\begin{bmatrix}A+3I\\C\end{bmatrix}=\begin{bmatrix}1&0\\0&0\\0&1\end{bmatrix}`}</M>, posto 2 ⇒ observável.</p>),
          s('Interpretação', <p>A saída só enxerga <M>{'x_2'}</M>; <M>{'x_1'}</M> evolui como <M>{String.raw`e^{-2t}`}</M> sem afetar <M>y</M>. É o dual da questão 7.</p>),
        ]}
        answer={<p>(a) posto 1: não observável; (b) <M>{String.raw`\lambda=-2`}</M> é o autovalor não observável.</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}-2&0\\0&-3\end{bmatrix}x`}</M>, <M>{String.raw`y=[0\ \ 1]\,x`}</M>: (a) monte <M>{String.raw`\mathcal O`}</M> e o posto; (b) use o teste PBH para identificar o autovalor não observável.</p>
      </Exercise>

      <Exercise id="l3-11" review={['determinante', 'polinomios', 'autovalores']} src={src(2)} num="11" topic="Parâmetro que destrói a observabilidade"
        steps={[
          s('Matriz de observabilidade', <p><M>{String.raw`CA=[1\ \ \gamma]\begin{bmatrix}0&1\\-2&-3\end{bmatrix}=[-2\gamma\ \ 1-3\gamma]`}</M>, <M>{String.raw`\mathcal O=\begin{bmatrix}1&\gamma\\-2\gamma&1-3\gamma\end{bmatrix}`}</M>.</p>),
          s('Determinante', <p><M>{String.raw`\det\mathcal O=1-3\gamma+2\gamma^2=(2\gamma-1)(\gamma-1)`}</M> ⇒ não observável para <M>{String.raw`\gamma=\tfrac12`}</M> ou <M>{String.raw`\gamma=1`}</M>.</p>, ['polinomios']),
          s('Qual modo some da saída', <p>Um modo é invisível quando <M>C</M> é ortogonal ao seu autovetor (<M>{'Cv=0'}</M>). Com <M>{String.raw`v_{-1}=[1;\,-1]`}</M> e <M>{String.raw`v_{-2}=[1;\,-2]`}</M>: <M>{String.raw`\gamma=\tfrac12`}</M> dá <M>{String.raw`Cv_{-2}=1-1=0`}</M>; <M>{String.raw`\gamma=1`}</M> dá <M>{String.raw`Cv_{-1}=1-1=0`}</M>.</p>, ['autovalores']),
          s('PBH', <p>Para <M>{String.raw`\gamma=\tfrac12`}</M>, <M>{String.raw`\operatorname{posto}\begin{bmatrix}A+2I\\C\end{bmatrix}=1`}</M>; para <M>{String.raw`\gamma=1`}</M>, <M>{String.raw`\operatorname{posto}\begin{bmatrix}A+I\\C\end{bmatrix}=1`}</M>.</p>),
        ]}
        answer={<p><M>{String.raw`\gamma=\tfrac12`}</M>: autovalor não observável <M>{'-2'}</M>; <M>{String.raw`\gamma=1`}</M>: autovalor não observável <M>{'-1'}</M>.</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}0&1\\-2&-3\end{bmatrix}x`}</M>, <M>{String.raw`y=[1\ \ \gamma]\,x`}</M>, determine todos os <M>{'\\gamma'}</M> para os quais o sistema não é observável e, para cada um, o autovalor não observável (PBH).</p>
      </Exercise>

      <Callout kind="tip" tag="Dualidade">Compare as questões 8 e 11: o sistema perde controlabilidade quando <M>B</M> é um autovetor (a entrada só excita um modo) e perde observabilidade quando <M>C</M> é ortogonal a um autovetor (a saída não enxerga um modo). Trocar <M>{'(A,B,C)'}</M> por <M>{'(A^T,C^T,B^T)'}</M> transforma um teste no outro.</Callout>

      <h2>Parte 4 — Análise conjunta</h2>

      <Exercise id="l3-12" review={['posto', 'autovalores', 'matrizes']} src={src(2)} num="12" topic="Duas entradas, uma saída"
        steps={[
          s('Autovalores', <p><M>{String.raw`\det(sI-A)=(s-1)(s+2)-4=s^2+s-6=(s-2)(s+3)`}</M>: <M>{String.raw`\lambda_1=2`}</M> (instável) e <M>{String.raw`\lambda_2=-3`}</M>.</p>, ['polinomios']),
          s('Controlabilidade', <p><M>{String.raw`AB=\begin{bmatrix}2&-2\\2&-2\end{bmatrix}`}</M>, <M>{String.raw`\mathcal C=[B\ \ AB]=\begin{bmatrix}1&-1&2&-2\\1&-1&2&-2\end{bmatrix}`}</M>: linhas iguais ⇒ posto 1, não controlável. As duas entradas atuam na mesma direção <M>{'[1;\\,1]'}</M>, através de <M>{'u_1-u_2'}</M>.</p>, ['posto']),
          s('Qual modo', <p><M>{'[1;\\,1]'}</M> é autovetor de <M>{'\\lambda=2'}</M> (<M>{String.raw`A[1;1]=[2;2]`}</M>). PBH: <M>{String.raw`[A-2I\ \ B]`}</M> tem posto 2 e <M>{String.raw`[A+3I\ \ B]=\begin{bmatrix}4&1&1&-1\\4&1&1&-1\end{bmatrix}`}</M> tem posto 1 ⇒ <M>{'-3'}</M> é o único não controlável. O modo instável é controlável, então o sistema pode ser estabilizado por realimentação.</p>),
          s('Observabilidade', <p><M>{String.raw`CA=[1\ \ 1]`}</M>, <M>{String.raw`\mathcal O=\begin{bmatrix}1&0\\1&1\end{bmatrix}`}</M>, <M>{String.raw`\det=1`}</M> ⇒ observável; nenhum autovalor não observável.</p>),
        ]}
        answer={<p>(a) não controlável; um autovalor não controlável, <M>{'\\lambda=-3'}</M>. (b) observável.</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}1&1\\4&-2\end{bmatrix}x+\begin{bmatrix}1&-1\\1&-1\end{bmatrix}\begin{bmatrix}u_1\\u_2\end{bmatrix}`}</M>, <M>{String.raw`y=[1\ \ 0]\,x`}</M>: (a) verifique a controlabilidade e indique os autovalores não controláveis; (b) verifique a observabilidade e indique os autovalores não observáveis.</p>
      </Exercise>

      <Exercise id="l3-13" review={['determinante', 'polinomios', 'posto']} src={src(2)} num="13" topic="Condições sobre parâmetros"
        steps={[
          s('Controlabilidade', <p><M>{String.raw`AB=\begin{bmatrix}b-1-a\\b(1-a)-1\end{bmatrix}`}</M>, <M>{String.raw`\det[B\ \ AB]=b(1-a)-1-b(b-1-a)=-(b-1)^2`}</M> ⇒ controlável ⇔ <M>{'b\\ne1'}</M>, para qualquer <M>a</M>.</p>),
          s('Observabilidade', <p><M>{String.raw`CA=[-1-c-ac\ \ \ c+1-a]`}</M>, <M>{String.raw`\det\begin{bmatrix}C\\CA\end{bmatrix}=c(c+1-a)+1+c+ac=(c+1)^2`}</M> ⇒ observável ⇔ <M>{'c\\ne-1'}</M>, para qualquer <M>a</M>.</p>),
          s('Autovalores', <p><M>{String.raw`\det(sI-A)=(s+1+a)(s-1+a)+1=(s+a)^2`}</M>: autovalor <M>{'-a'}</M> duplo. Com <M>{'a=2'}</M>, <M>{String.raw`\lambda=-2`}</M> duplo.</p>, ['polinomios']),
          s('a = 2, b = 1, c = −1', <p><M>{String.raw`A+2I=\begin{bmatrix}-1&1\\-1&1\end{bmatrix}`}</M>, <M>{String.raw`B=[1;\,1]`}</M>, <M>{String.raw`C=[-1\ \ 1]`}</M>. <M>{String.raw`[A+2I\ \ B]`}</M> e <M>{String.raw`\begin{bmatrix}A+2I\\C\end{bmatrix}`}</M> têm posto 1 ⇒ <M>{'-2'}</M> é ao mesmo tempo não controlável e não observável.</p>),
          s('O que isso significa', <p>A única direção alcançável pela entrada é <M>{'[1;\\,1]'}</M> (autovetor de <M>{'-2'}</M>), e é justamente a direção que a saída não enxerga (<M>{'C[1;1]=0'}</M>). Por isso <M>{String.raw`C(sI-A)^{-1}B=0`}</M> e a função de transferência se reduz a <M>{'G(s)=D=2'}</M>: nenhum dos modos aparece entre a entrada e a saída.</p>),
        ]}
        answer={<p>(a) controlável ⇔ <M>{'b\\ne1'}</M>; observável ⇔ <M>{'c\\ne-1'}</M> (para qualquer <M>a</M>). (b) autovalor <M>{'-2'}</M> (duplo), não controlável e não observável.</p>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}-1-a&1\\-1&1-a\end{bmatrix}x+\begin{bmatrix}1\\b\end{bmatrix}u`}</M>, <M>{String.raw`y=[c\ \ 1]\,x+2u`}</M>: (a) determine as condições sobre <M>a</M>, <M>b</M> e <M>c</M> para controlabilidade e para observabilidade; (b) para <M>{'a=2'}</M>, <M>{'b=1'}</M>, <M>{'c=-1'}</M>, determine os autovalores não controláveis e não observáveis.</p>
      </Exercise>

      <h2>Parte 5 — Resposta de sistemas em espaço de estados</h2>

      <Exercise id="l3-14" review={['matrizes', 'fracoes']} src={src(3)} num="14" topic="Resposta ao degrau"
        steps={[
          s('Função de transferência', <p>Forma companheira: <M>{String.raw`(sI-A)^{-1}B=\frac{1}{s^2+4s+3}\begin{bmatrix}1\\s\end{bmatrix}`}</M>; com <M>{String.raw`C=[4\ \ 2]`}</M>, <M>{String.raw`G(s)=\frac{2s+4}{(s+1)(s+3)}`}</M>.</p>, ['matrizes']),
          s('Saída no domínio s', <MM>{String.raw`Y(s)=\frac{2s+4}{s(s+1)(s+3)}=\frac{4/3}{s}-\frac{1}{s+1}-\frac{1/3}{s+3}`}</MM>, ['fracoes']),
          s('Resíduos', <p>Em <M>{'s=0'}</M>: <M>{'4/3'}</M>; em <M>{'s=-1'}</M>: <M>{String.raw`\frac{2}{(-1)(2)}=-1`}</M>; em <M>{'s=-3'}</M>: <M>{String.raw`\frac{-2}{(-3)(-2)}=-\frac13`}</M>.</p>),
          s('Resposta no tempo', <p><M>{String.raw`y(t)=\frac43-e^{-t}-\frac13e^{-3t}`}</M>, <M>{'t\\ge0'}</M>. Confere: <M>{'y(0)=0'}</M> e <M>{String.raw`y(\infty)=G(0)=\frac43`}</M>.</p>),
        ]}
        answer={<><p><M>{String.raw`y(t)=\frac43-e^{-t}-\frac13e^{-3t}`}</M>, <M>{'t\\ge0'}</M>.</p><Plot height={160} xRange={[0, 6]} series={[{ ...y14, color: 'var(--pen)' }]} hLines={[{ y: 4 / 3 }]} yLabel="y(t)" /></>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}0&1\\-3&-4\end{bmatrix}x+\begin{bmatrix}0\\1\end{bmatrix}u`}</M>, <M>{String.raw`y=[4\ \ 2]\,x`}</M>, determine a resposta ao degrau unitário com <M>{'x(0)=0'}</M>.</p>
      </Exercise>

      <Exercise id="l3-15" review={['matrizes', 'trigonometria', 'complexos']} src={src(3)} num="15" topic="Resposta ao impulso com estado inicial"
        steps={[
          s('Por que x(0) + B', <p>Com <M>{String.raw`u=\delta(t)`}</M>, a integral de convolução vale <M>{String.raw`\int_0^t\Phi(t-\tau)B\,\delta(\tau)\,d\tau=\Phi(t)B`}</M>. Então <M>{String.raw`x(t)=\Phi(t)[x(0)+B]`}</M>: o impulso equivale a somar <M>B</M> ao estado inicial. Aqui <M>{String.raw`x(0)+B=[1;\,1]`}</M>.</p>, ['integrais']),
          s('Φ(s)', <p><M>{String.raw`\det(sI-A)=s^2+4`}</M> (autovalores <M>{'\\pm j2'}</M>); <M>{String.raw`(sI-A)^{-1}=\frac{1}{s^2+4}\begin{bmatrix}s&1\\-4&s\end{bmatrix}`}</M>.</p>, ['complexos']),
          s('Saída', <p><M>{String.raw`Y(s)=[1\ \ 0]\frac{1}{s^2+4}\begin{bmatrix}s+1\\-4+s\end{bmatrix}=\frac{s+1}{s^2+4}=\frac{s}{s^2+4}+\frac12\cdot\frac{2}{s^2+4}`}</M>.</p>),
          s('Resposta no tempo', <p><M>{String.raw`y(t)=\cos2t+\tfrac12\operatorname{sen}2t`}</M>, <M>{'t\\ge0'}</M>. Autovalores imaginários puros: a oscilação não decai (sistema marginalmente estável).</p>, ['trigonometria']),
        ]}
        answer={<><p><M>{String.raw`y(t)=\cos2t+\tfrac12\operatorname{sen}2t`}</M>, <M>{'t\\ge0'}</M>.</p><Plot height={160} xRange={[0, 8]} series={[{ ...y15, color: 'var(--pen)' }]} hLines={[{ y: 0 }]} yLabel="y(t)" /></>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}0&1\\-4&0\end{bmatrix}x+\begin{bmatrix}0\\1\end{bmatrix}u`}</M>, <M>{String.raw`y=[1\ \ 0]\,x`}</M>, calcule a resposta ao impulso unitário com <M>{'x(0)=[1;\\,0]'}</M>.</p>
      </Exercise>

      <Exercise id="l3-16" review={['matrizes', 'fracoes', 'exp-log']} src={src(3)} num="16" topic="Autovalor duplo e escolha do estado inicial"
        steps={[
          s('Autovalores', <p><M>{String.raw`\det(sI-A)=(s+3)(s+1)+1=s^2+4s+4=(s+2)^2`}</M>: <M>{'\\lambda=-2'}</M> duplo, o que gera termos <M>{String.raw`e^{-2t}`}</M> e <M>{String.raw`te^{-2t}`}</M>.</p>, ['polinomios']),
          s('(a) Impulso: x(0) + B', <p><M>{String.raw`x(0)+B=[0;1]+[-1;1]=[-1;\,2]`}</M>. <M>{String.raw`(sI-A)^{-1}=\frac{1}{(s+2)^2}\begin{bmatrix}s+1&-1\\1&s+3\end{bmatrix}`}</M>.</p>, ['matrizes']),
          s('(a) Saída', <p><M>{String.raw`(sI-A)^{-1}\begin{bmatrix}-1\\2\end{bmatrix}=\frac{1}{(s+2)^2}\begin{bmatrix}-s-3\\2s+5\end{bmatrix}`}</M>; com <M>{String.raw`C=[-2\ \ -1]`}</M>: <M>{String.raw`Y(s)=\frac{2s+6-2s-5}{(s+2)^2}=\frac{1}{(s+2)^2}`}</M> ⇒ <M>{String.raw`y(t)=te^{-2t}`}</M>.</p>),
          s('(b) Resposta livre geral', <p>Com <M>{String.raw`x(0)=[x_1;\,x_2]`}</M> e <M>{'u=0'}</M>: <M>{String.raw`Y(s)=\frac{-2x_1-x_2}{s+2}+\frac{x_1+x_2}{(s+2)^2}`}</M>, ou seja, <M>{String.raw`y(t)=(-2x_1-x_2)e^{-2t}+(x_1+x_2)\,te^{-2t}`}</M>.</p>, ['fracoes']),
          s('(b) Eliminar o termo em te⁻²ᵗ', <p>Exige <M>{'x_1+x_2=0'}</M>. Aí <M>{String.raw`y=(-2x_1+x_1)e^{-2t}=-x_1e^{-2t}`}</M>; para <M>{String.raw`y=Me^{-2t}`}</M>, <M>{'x_1=-M'}</M> e <M>{'x_2=M'}</M>. A condição inicial escolhida está sobre o autovetor <M>{'[-1;\\,1]'}</M> de <M>{'\\lambda=-2'}</M>, por isso a resposta é uma exponencial pura.</p>),
        ]}
        answer={<><p>(a) <M>{String.raw`y(t)=te^{-2t}`}</M>; (b) <M>{String.raw`x(0)=[-M;\,M]`}</M>, com <M>{'M\\ne0'}</M>.</p><Plot height={150} xRange={[0, 4]} series={[{ ...y16, color: 'var(--pen)' }]} hLines={[{ y: 0 }]} yLabel="y(t)" /></>}>
        <p>Para <M>{String.raw`\dot x=\begin{bmatrix}-3&-1\\1&-1\end{bmatrix}x+\begin{bmatrix}-1\\1\end{bmatrix}u`}</M>, <M>{String.raw`y=[-2\ \ -1]\,x`}</M>: (a) determine a resposta ao impulso unitário com <M>{'x(0)=[0;\\,1]'}</M>; (b) determine, se possível, <M>{'x(0)'}</M> tal que a resposta livre seja <M>{String.raw`y(t)=Me^{-2t}`}</M>, com <M>{'M\\ne0'}</M>.</p>
      </Exercise>

      <Exercise id="l3-17" review={['edo-basico', 'fracoes']} src={src(3)} num="17" topic="FT com condições iniciais"
        hint={<p>A função de transferência supõe condições iniciais nulas. Volte para a EDO que ela representa e aplique Laplace com as condições dadas.</p>}
        steps={[
          s('EDO correspondente', <p><M>{String.raw`\frac{Y}{U}=\frac{5}{s^2+10s}`}</M> ⇒ <M>{String.raw`\ddot y+10\dot y=5u`}</M>.</p>),
          s('Laplace com condições iniciais', <p><M>{String.raw`[s^2Y-sy(0)-\dot y(0)]+10[sY-y(0)]=\frac5s`}</M>. Com <M>{'y(0)=1'}</M> e <M>{String.raw`\dot y(0)=-10`}</M>: <M>{String.raw`(s^2+10s)Y-s+10-10=\frac5s`}</M>.</p>, ['edo-basico']),
          s('Isolar Y(s)', <MM>{String.raw`Y(s)=\frac{s^2+5}{s^2(s+10)}=-\frac{1/20}{s}+\frac{1/2}{s^2}+\frac{21/20}{s+10}`}</MM>, ['fracoes']),
          s('Resposta no tempo', <p><M>{String.raw`y(t)=-\frac{1}{20}+\frac12t+\frac{21}{20}e^{-10t}`}</M>, <M>{'t\\ge0'}</M>. Confere: <M>{'y(0)=1'}</M> e <M>{String.raw`\dot y(0)=\frac12-\frac{21}{2}=-10`}</M>. O polo na origem (integrador) faz a saída crescer como rampa: não há valor de regime.</p>),
        ]}
        answer={<><p><M>{String.raw`y(t)=-\frac{1}{20}+\frac12t+\frac{21}{20}e^{-10t}`}</M>, <M>{'t\\ge0'}</M>.</p><Plot height={150} xRange={[0, 2]} series={[{ ...y17, color: 'var(--pen)' }]} yLabel="y(t)" /></>}>
        <p>Para <M>{String.raw`G(s)=\frac{Y(s)}{U(s)}=\frac{5}{s(s+10)}`}</M>, determine a resposta ao degrau unitário com <M>{'y(0)=1'}</M> e <M>{String.raw`\dot y(0)=-10`}</M>.</p>
      </Exercise>
    </>
  )
}
