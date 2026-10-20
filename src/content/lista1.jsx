import { M, MM } from '../components/Tex.jsx'
import Exercise from '../components/Exercise.jsx'
import Plot, { sample } from '../components/Plot.jsx'

const s = (title, body) => ({ title, body })

function Sec({ children }) {
  return <h2>{children}</h2>
}

export default function Lista1() {
  const q9 = sample((t) => (t < 1 ? 0 : t < 3 ? 1 - Math.exp(-(t - 1)) : Math.exp(-(t - 3)) - Math.exp(-(t - 1))), 0, 8, 400)
  const q10 = sample((t) => t * Math.exp(-t), 0, 8, 300)
  const q20 = sample((t) => 10 / 13 - Math.exp(-t) + (Math.exp(-2 * t) * (9 * Math.cos(3 * t) - 7 * Math.sin(3 * t))) / 39, 0, 6, 400)
  return (
    <>
      <p className="muted small">Conteúdo: classificação de sistemas, modelagem por EDO, resolução de EDOs (método clássico e Laplace), convolução, Transformada de Laplace e funções de transferência. Enunciados da Lista 1 do Prof. Anderson Cavalcanti; respostas conferem com o gabarito oficial.</p>

      <Sec>1. Classificação de sistemas</Sec>
      <Exercise id="l1-1" src={{ file: 'lista-1.pdf', p: 1, label: 'enunciado: Lista 1, p. 1' }} num="1" topic="Classificação"
        hint={<p>Para linearidade, teste a superposição (inclusive: entrada nula deve dar saída nula). Para invariância, compare "atrasar a entrada" com "atrasar a saída". Memória: a saída depende de instantes passados?</p>}
        steps={[
          s('a) y = 5u − 3', <p>Com <M>u=0</M>, <M>{'y=-3\\ne0'}</M>: viola a homogeneidade ⇒ <b>não linear</b> (afim). Coeficientes constantes ⇒ invariante. Só depende de <M>u(t)</M> ⇒ estático e causal.</p>),
          s('b) y = t·u(t)', <p><M>{'t(\\alpha_1u_1+\\alpha_2u_2)=\\alpha_1tu_1+\\alpha_2tu_2'}</M> ⇒ linear. Atrasando a entrada: <M>{'t\\,u(t-t_0)'}</M>; atrasando a saída: <M>{'(t-t_0)u(t-t_0)'}</M> ⇒ <b>variante</b>. Estático e causal.</p>),
          s('c) y = u(t − 2)', <p>Linear e invariante (um atraso puro). Depende da entrada 2 s antes ⇒ <b>dinâmico</b> (tem memória). Só usa o passado ⇒ causal.</p>),
          s('d) y = u²(t)', <p><M>{'(u_1+u_2)^2\\ne u_1^2+u_2^2'}</M> ⇒ não linear. Invariante, estático, causal.</p>),
          s('e) ẏ + 3y = u', <p>EDO linear de coeficientes constantes ⇒ linear e invariante; envolve derivada (memória) ⇒ dinâmico; causal.</p>),
          s('f) ẏ + 2t·y = u', <p>Linear (EDO linear), mas o coeficiente <M>2t</M> depende do tempo ⇒ <b>variante</b>; dinâmico; causal.</p>),
        ]}
        answer={<ul>
          <li>a) não linear (afim); invariante; estático; causal.</li>
          <li>b) linear; variante; estático; causal.</li>
          <li>c) linear; invariante; dinâmico; causal.</li>
          <li>d) não linear; invariante; estático; causal.</li>
          <li>e) linear; invariante; dinâmico; causal.</li>
          <li>f) linear; variante (coeficiente 2t); dinâmico; causal.</li>
        </ul>}>
        <p>Classifique cada sistema quanto a: (i) linear ou não linear; (ii) invariante ou variante no tempo; (iii) estático ou dinâmico; (iv) causal ou não causal.</p>
        <p>a) <M>{'y=5u-3'}</M> &nbsp; b) <M>{'y=tu(t)'}</M> &nbsp; c) <M>{'y=u(t-2)'}</M> &nbsp; d) <M>{'y=u^2(t)'}</M> &nbsp; e) <M>{'\\dot y+3y=u'}</M> &nbsp; f) <M>{'\\dot y+2ty=u'}</M></p>
      </Exercise>

      <Exercise id="l1-2" src={{ file: 'lista-1.pdf', p: 1, label: 'enunciado: Lista 1, p. 1' }} num="2" topic="Superposição e deslocamento no tempo"
        steps={[
          s('a) Linearidade', <p><M>{String.raw`\int_0^t[\alpha_1u_1+\alpha_2u_2]d\tau=\alpha_1\int_0^tu_1\,d\tau+\alpha_2\int_0^tu_2\,d\tau`}</M> ⇒ linear.</p>),
          s('a) Invariância', <><p>Resposta à entrada atrasada: <M>{String.raw`\int_0^tu(\tau-t_0)d\tau=\int_{-t_0}^{t-t_0}u(\sigma)d\sigma`}</M>. Saída atrasada: <M>{String.raw`y(t-t_0)=\int_0^{t-t_0}u(\sigma)d\sigma`}</M>.</p><p>Diferem pela parcela <M>{String.raw`\int_{-t_0}^{0}u(\sigma)d\sigma`}</M>: o limite inferior fixo em 0 faz com que o deslocamento da entrada não produza o mesmo deslocamento na saída ⇒ <b>variante</b>.</p></>),
          s('b) y = e^{u(t)}', <p><M>{'e^{u_1+u_2}=e^{u_1}e^{u_2}\\ne e^{u_1}+e^{u_2}'}</M> (e <M>u=0</M> dá <M>y=1</M>) ⇒ não linear. <M>{'e^{u(t-t_0)}=y(t-t_0)'}</M> ⇒ invariante.</p>),
          s('c) y = u(t) + 3u(t − 2)', <p>Soma de termos lineares ⇒ linear. Atrasando a entrada: <M>{'u(t-t_0)+3u(t-t_0-2)=y(t-t_0)'}</M> ⇒ invariante. Depende de <M>{'u(t-2)'}</M> ⇒ dinâmico.</p>),
        ]}
        answer={<p>a) linear, variante; b) não linear, invariante; c) linear, invariante, dinâmico.</p>}>
        <p>Verifique se cada sistema é linear e invariante no tempo, justificando por superposição e por deslocamento no tempo: a) <M>{String.raw`y=\int_0^tu(\tau)d\tau`}</M>; b) <M>{'y=e^{u(t)}'}</M>; c) <M>{'y=u(t)+3u(t-2)'}</M>.</p>
      </Exercise>

      <Sec>2. Modelagem por equações diferenciais</Sec>
      <Exercise id="l1-3" src={{ file: 'lista-1.pdf', p: 1, label: 'enunciado: Lista 1, p. 1' }} num="3" topic="Circuito RC série"
        steps={[
          s('Lei das malhas', <MM>{String.raw`e(t)=Ri(t)+v_C(t),\qquad i(t)=C\frac{dv_C}{dt}`}</MM>),
          s('EDO', <MM>{String.raw`RC\,\dot v_C+v_C=e(t)`}</MM>),
          s('Laplace com CI nulas', <MM>{String.raw`(RCs+1)V_C(s)=E(s)\ \Rightarrow\ G(s)=\frac{V_C(s)}{E(s)}=\frac{1}{RCs+1}`}</MM>),
        ]}
        answer={<p><M>{String.raw`RC\dot v_C+v_C=e(t)`}</M>; <M>{String.raw`G(s)=\frac{1}{RCs+1}`}</M>.</p>}>
        <p>Para o circuito RC série com entrada <M>e(t)</M> e saída <M>{'v_C(t)'}</M>, obtenha a EDO e a função de transferência <M>{'V_C(s)/E(s)'}</M>.</p>
      </Exercise>

      <Exercise id="l1-4" src={{ file: 'lista-1.pdf', p: 1, label: 'enunciado: Lista 1, p. 1' }} num="4" topic="Massa–mola–amortecedor"
        steps={[
          s('Newton', <MM>{String.raw`f-b\dot x-kx=m\ddot x\ \Rightarrow\ m\ddot x+b\dot x+kx=f(t)`}</MM>),
          s('Função de transferência', <MM>{String.raw`G(s)=\frac{X(s)}{F(s)}=\frac{1}{ms^2+bs+k}`}</MM>),
          s('b) Polos', <p><M>{'s^2+3s+2=(s+1)(s+2)'}</M> ⇒ polos reais distintos −1 e −2 ⇒ resposta <b>superamortecida</b> (<M>{'\\xi=3/(2\\sqrt2)\\approx1{,}06>1'}</M>).</p>),
        ]}
        answer={<p>a) <M>{String.raw`m\ddot x+b\dot x+kx=f`}</M>, <M>{String.raw`G=\frac{1}{ms^2+bs+k}`}</M>. b) polos −1 e −2: superamortecida.</p>}>
        <p>Um sistema massa–mola–amortecedor tem massa <M>m</M>, amortecimento <M>b</M> e rigidez <M>k</M>; entrada força <M>f(t)</M>, saída deslocamento <M>x(t)</M>. a) Escreva a EDO e <M>{'X(s)/F(s)'}</M>. b) Para <M>m=1</M>, <M>b=3</M>, <M>k=2</M>, determine os polos e classifique a resposta.</p>
      </Exercise>

      <Exercise id="l1-5" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="5" topic="Circuito RLC série"
        steps={[
          s('Lei das malhas', <MM>{String.raw`e=Ri+L\frac{di}{dt}+v_C,\qquad i=C\dot v_C\ \Rightarrow\ LC\ddot v_C+RC\dot v_C+v_C=e`}</MM>),
          s('Função de transferência', <MM>{String.raw`G(s)=\frac{1}{LCs^2+RCs+1}`}</MM>),
          s('Com L = R = C = 1', <MM>{String.raw`G(s)=\frac{1}{s^2+s+1},\qquad s=\frac{-1\pm\sqrt{1-4}}{2}=-\frac12\pm j\frac{\sqrt3}{2}`}</MM>),
        ]}
        answer={<p>Polos complexos <M>{String.raw`-\frac12\pm j\frac{\sqrt3}2`}</M>: resposta <b>subamortecida</b> (<M>{'\\xi=0{,}5'}</M>, <M>{'\\omega_n=1'}</M>).</p>}>
        <p>Para o RLC série (entrada <M>e(t)</M>, saída <M>{'v_C(t)'}</M>), obtenha a EDO e <M>{'V_C(s)/E(s)'}</M>. Para <M>L=1</M> H, <M>R=1</M> Ω e <M>C=1</M> F, determine os polos e classifique a resposta.</p>
      </Exercise>

      <Sec>3. Resolução de EDOs pelo método clássico</Sec>
      <Exercise id="l1-6a" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="6a" topic="Método clássico — 1ª ordem"
        steps={[
          s('Homogênea', <p><M>{'s+2=0\\Rightarrow y_h=Ce^{-2t}'}</M>.</p>),
          s('Particular', <p>Entrada constante: <M>{'2\\beta=4\\Rightarrow y_p=2'}</M>.</p>),
          s('Condição inicial', <p><M>{'y(0)=2+C=0\\Rightarrow C=-2'}</M>.</p>),
        ]}
        answer={<MM>{'y(t)=2-2e^{-2t}'}</MM>}>
        <p><M>{'\\dot y+2y=4,\\quad y(0)=0'}</M></p>
      </Exercise>
      <Exercise id="l1-6b" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="6b" topic="Método clássico — raízes reais distintas"
        steps={[
          s('Homogênea', <p><M>{'s^2+5s+6=(s+2)(s+3)\\Rightarrow y_h=C_1e^{-2t}+C_2e^{-3t}'}</M>.</p>),
          s('Particular', <p><M>{'6\\beta=12\\Rightarrow y_p=2'}</M>.</p>),
          s('Condições iniciais', <MM>{String.raw`\begin{cases}2+C_1+C_2=0\\-2C_1-3C_2=0\end{cases}\Rightarrow C_1=-6,\ C_2=4`}</MM>),
        ]}
        answer={<MM>{'y(t)=2-6e^{-2t}+4e^{-3t}'}</MM>}>
        <p><M>{'\\ddot y+5\\dot y+6y=12,\\quad y(0)=0,\\ \\dot y(0)=0'}</M></p>
      </Exercise>
      <Exercise id="l1-6c" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="6c" topic="Método clássico — raiz dupla"
        steps={[
          s('Homogênea', <p><M>{'(s+2)^2\\Rightarrow y_h=D_0te^{-2t}+D_1e^{-2t}'}</M>.</p>),
          s('Particular', <p><M>{'4\\beta=8\\Rightarrow y_p=2'}</M>.</p>),
          s('Condições iniciais', <p><M>{'y(0)=2+D_1=0\\Rightarrow D_1=-2'}</M>. <M>{'\\dot y(0)=D_0-2D_1=0\\Rightarrow D_0=-4'}</M>.</p>),
        ]}
        answer={<MM>{'y(t)=2-2e^{-2t}-4te^{-2t}'}</MM>}>
        <p><M>{'\\ddot y+4\\dot y+4y=8,\\quad y(0)=0,\\ \\dot y(0)=0'}</M></p>
      </Exercise>
      <Exercise id="l1-6d" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="6d" topic="Método clássico — raízes complexas"
        steps={[
          s('Homogênea', <p><M>{'s^2+2s+5=0\\Rightarrow s=-1\\pm j2'}</M> ⇒ <M>{'y_h=e^{-t}(C_1\\sen 2t+C_2\\cos 2t)'}</M>.</p>),
          s('Particular', <p><M>{'5\\beta=10\\Rightarrow y_p=2'}</M>.</p>),
          s('y(0) = 0', <p><M>{'2+C_2=0\\Rightarrow C_2=-2'}</M>.</p>),
          s('ẏ(0) = 0', <p><M>{'\\dot y(0)=-C_2+2C_1=0\\Rightarrow 2+2C_1=0\\Rightarrow C_1=-1'}</M>.</p>),
        ]}
        answer={<MM>{'y(t)=2-2e^{-t}\\cos 2t-e^{-t}\\sen 2t'}</MM>}>
        <p><M>{'\\ddot y+2\\dot y+5y=10,\\quad y(0)=0,\\ \\dot y(0)=0'}</M></p>
      </Exercise>
      <Exercise id="l1-6e" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="6e" topic="Método clássico — raiz dupla com CI não nula"
        steps={[
          s('Homogênea', <p><M>{'(s+3)^2\\Rightarrow y_h=D_0te^{-3t}+D_1e^{-3t}'}</M>.</p>),
          s('Particular', <p><M>{'9\\beta=9\\Rightarrow y_p=1'}</M>.</p>),
          s('Condições iniciais', <p><M>{'y(0)=1+D_1=2\\Rightarrow D_1=1'}</M>. <M>{'\\dot y(0)=D_0-3D_1=0\\Rightarrow D_0=3'}</M>.</p>),
        ]}
        answer={<MM>{'y(t)=1+(1+3t)e^{-3t}'}</MM>}>
        <p><M>{'\\ddot y+6\\dot y+9y=9,\\quad y(0)=2,\\ \\dot y(0)=0'}</M></p>
      </Exercise>
      <Exercise id="l1-6f" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="6f" topic="Método clássico — 3ª ordem"
        steps={[
          s('Homogênea', <p><M>{'s^3+6s^2+11s+6=(s+1)(s+2)(s+3)'}</M> (teste <M>{'s=-1'}</M> e divida) ⇒ <M>{'y_h=C_1e^{-t}+C_2e^{-2t}+C_3e^{-3t}'}</M>.</p>),
          s('Particular', <p><M>{'6\\beta=6\\Rightarrow y_p=1'}</M>.</p>),
          s('Sistema das CI', <MM>{String.raw`\begin{cases}1+C_1+C_2+C_3=0\\-C_1-2C_2-3C_3=0\\C_1+4C_2+9C_3=0\end{cases}`}</MM>),
          s('Resolver', <p>Da 2ª: <M>{'C_1=-2C_2-3C_3'}</M>. Na 3ª: <M>{'2C_2+6C_3=0\\Rightarrow C_2=-3C_3'}</M>, logo <M>{'C_1=3C_3'}</M>. Na 1ª: <M>{'1+C_3=0'}</M> ⇒ <M>{'C_3=-1,\\ C_2=3,\\ C_1=-3'}</M>.</p>),
        ]}
        answer={<MM>{'y(t)=1-3e^{-t}+3e^{-2t}-e^{-3t}'}</MM>}>
        <p><M>{'\\dddot y+6\\ddot y+11\\dot y+6y=6,\\quad y(0)=\\dot y(0)=\\ddot y(0)=0'}</M></p>
      </Exercise>

      <Sec>4. Solução de EDOs por Laplace</Sec>
      <Exercise id="l1-7a" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="7a" topic="Laplace com CI não nula"
        steps={[
          s('Transformar', <MM>{String.raw`sY-1+3Y=\frac6s\ \Rightarrow\ Y(s)=\frac{s+6}{s(s+3)}`}</MM>),
          s('Frações parciais', <MM>{String.raw`C_1=\frac{6}{3}=2,\quad C_2=\frac{-3+6}{-3}=-1\ \Rightarrow\ Y=\frac2s-\frac1{s+3}`}</MM>),
        ]}
        answer={<MM>{'y(t)=2-e^{-3t}'}</MM>}>
        <p><M>{'\\dot y+3y=6,\\quad y(0)=1'}</M></p>
      </Exercise>
      <Exercise id="l1-7b" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="7b" topic="Laplace com CI não nulas"
        steps={[
          s('Transformar', <MM>{String.raw`s^2Y-s-1+3(sY-1)+2Y=\frac2s\ \Rightarrow\ (s^2+3s+2)Y=s+4+\frac2s`}</MM>),
          s('Isolar Y', <MM>{String.raw`Y(s)=\frac{s^2+4s+2}{s(s+1)(s+2)}`}</MM>),
          s('Resíduos', <MM>{String.raw`C_1=\frac{2}{2}=1,\quad C_2=\frac{1-4+2}{(-1)(1)}=1,\quad C_3=\frac{4-8+2}{(-2)(-1)}=-1`}</MM>),
        ]}
        answer={<MM>{'y(t)=1+e^{-t}-e^{-2t}'}</MM>}>
        <p><M>{'\\ddot y+3\\dot y+2y=2,\\quad y(0)=1,\\ \\dot y(0)=1'}</M></p>
      </Exercise>
      <Exercise id="l1-7c" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="7c" topic="Laplace com polos complexos"
        steps={[
          s('Transformar', <MM>{String.raw`s^2Y-2+2sY+5Y=\frac5s\ \Rightarrow\ Y(s)=\frac{2s+5}{s(s^2+2s+5)}`}</MM>),
          s('Resíduo em s = 0', <p><M>{'C_1=5/5=1'}</M>.</p>),
          s('Resíduo em p = −1 + j2', <MM>{String.raw`C_2=\frac{2p+5}{p\,(p+1+j2)}=\frac{3+j4}{(-1+j2)(j4)}=\frac{3+j4}{-8-j4}=-0{,}5-j0{,}25`}</MM>),
          s('Abordagem 2', <MM>{String.raw`e^{-t}\left[2(-0{,}5)\cos2t-2(-0{,}25)\sen2t\right]=e^{-t}\left(-\cos2t+0{,}5\sen2t\right)`}</MM>),
        ]}
        answer={<MM>{String.raw`y(t)=1-e^{-t}\cos2t+\tfrac12e^{-t}\sen2t`}</MM>}>
        <p><M>{'\\ddot y+2\\dot y+5y=5,\\quad y(0)=0,\\ \\dot y(0)=2'}</M></p>
      </Exercise>

      <Sec>5. Integral de convolução</Sec>
      <Exercise id="l1-8" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="8" topic="Convolução com degrau"
        steps={[
          s('Integral', <MM>{String.raw`y(t)=\int_0^te^{-2(t-\tau)}\cdot1\,d\tau=e^{-2t}\int_0^te^{2\tau}d\tau=e^{-2t}\frac{e^{2t}-1}{2}`}</MM>),
        ]}
        answer={<MM>{String.raw`y(t)=\tfrac12\left(1-e^{-2t}\right)`}</MM>}>
        <p>A resposta ao impulso de um SLIT relaxado é <M>{'g(t)=e^{-2t},\\ t\\ge0'}</M>. Determine, por convolução, a resposta ao degrau unitário.</p>
      </Exercise>
      <Exercise id="l1-9" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="9" topic="Convolução com pulso deslocado"
        steps={[
          s('t < 1', <p>A entrada ainda é nula em <M>{'[0,t]'}</M>: <M>{'y=0'}</M>.</p>),
          s('1 ≤ t < 3', <MM>{String.raw`y=\int_1^te^{-(t-\tau)}d\tau=e^{-t}\left(e^{t}-e^{1}\right)=1-e^{-(t-1)}`}</MM>),
          s('t ≥ 3', <MM>{String.raw`y=\int_1^3e^{-(t-\tau)}d\tau=e^{-t}\left(e^3-e\right)=e^{-(t-3)}-e^{-(t-1)}=(1-e^{-2})e^{-(t-3)}`}</MM>),
        ]}
        answer={<><MM>{String.raw`y(t)=\begin{cases}0,&t<1\\1-e^{-(t-1)},&1\le t<3\\(1-e^{-2})\,e^{-(t-3)},&t\ge3\end{cases}`}</MM><Plot height={160} xRange={[0, 8]} series={[{ ...q9, color: 'var(--good)' }]} yLabel="y(t)" /></>}>
        <p>Com <M>{'g(t)=e^{-t}'}</M>, determine a resposta ao pulso <M>{'u(t)=u_{-1}(t-1)-u_{-1}(t-3)'}</M> nos três intervalos.</p>
      </Exercise>
      <Exercise id="l1-10" src={{ file: 'lista-1.pdf', p: 2, label: 'enunciado: Lista 1, p. 2' }} num="10" topic="Convolução: entrada e sistema com o mesmo modo"
        steps={[
          s('Integral', <MM>{String.raw`y(t)=\int_0^te^{-(t-\tau)}e^{-\tau}d\tau=e^{-t}\int_0^td\tau=te^{-t}`}</MM>),
          s('Interpretação em s', <p><M>{String.raw`Y(s)=\frac{1}{s+1}\cdot\frac{1}{s+1}=\frac{1}{(s+1)^2}`}</M>: o polo do sistema coincide com o da entrada, gerando um polo duplo e o termo <M>{'te^{-t}'}</M>.</p>),
        ]}
        answer={<><p><M>{'y(t)=te^{-t}'}</M>. Quando entrada e sistema têm o mesmo modo, surge o fator <M>t</M> (efeito de "ressonância").</p><Plot height={150} xRange={[0, 8]} series={[{ ...q10, color: 'var(--good)' }]} yLabel="y(t)" /></>}>
        <p>Com <M>{'g(t)=e^{-t}'}</M>, determine a resposta a <M>{'u(t)=e^{-t}'}</M> e comente o resultado.</p>
      </Exercise>

      <Sec>6. Transformada de Laplace</Sec>
      <Exercise id="l1-11" src={{ file: 'lista-1.pdf', p: 3, label: 'enunciado: Lista 1, p. 3' }} num="11" topic="Tabela de transformadas"
        steps={[
          s('a) 3 + 2t', <p>Linearidade: <M>{String.raw`\frac3s+\frac{2}{s^2}`}</M>.</p>),
          s('b), c), d)', <p><M>{String.raw`\frac{1}{s+4}`}</M>; <M>{String.raw`\frac{1}{(s+2)^2}`}</M> (tabela <M>{'t^ne^{at}'}</M>, n = 1); <M>{String.raw`\frac{3}{s^2+9}`}</M>.</p>),
          s('e) e^{−t}cos 2t', <p>Deslocamento em <M>s</M>: <M>{String.raw`\frac{s+1}{(s+1)^2+4}`}</M>.</p>),
          s('f) 5u₋₁(t − 2)', <p>Deslocamento no tempo: <M>{String.raw`\frac{5e^{-2s}}{s}`}</M>.</p>),
        ]}
        answer={<p>a) <M>{'3/s+2/s^2'}</M>; b) <M>{'1/(s+4)'}</M>; c) <M>{'1/(s+2)^2'}</M>; d) <M>{'3/(s^2+9)'}</M>; e) <M>{'(s+1)/[(s+1)^2+4]'}</M>; f) <M>{'5e^{-2s}/s'}</M>.</p>}>
        <p>Calcule a transformada de: a) <M>{'3+2t'}</M>; b) <M>{'e^{-4t}'}</M>; c) <M>{'te^{-2t}'}</M>; d) <M>{'\\sen 3t'}</M>; e) <M>{'e^{-t}\\cos 2t'}</M>; f) <M>{'5u_{-1}(t-2)'}</M>.</p>
      </Exercise>
      <Exercise id="l1-12" src={{ file: 'lista-1.pdf', p: 3, label: 'enunciado: Lista 1, p. 3' }} num="12" topic="Propriedades"
        steps={[
          s('a) t·sen 2t', <MM>{String.raw`-\frac{d}{ds}\frac{2}{s^2+4}=\frac{4s}{(s^2+4)^2}`}</MM>),
          s('b) t²e^{−3t}', <p>Tabela com <M>n=2</M>, <M>{'a=-3'}</M>: <M>{String.raw`\frac{2!}{(s+3)^3}=\frac{2}{(s+3)^3}`}</M>.</p>),
          s('c) Integral', <p>Integração no tempo: <M>{String.raw`\frac1s\cdot\frac{1}{s+2}=\frac{1}{s(s+2)}`}</M>.</p>),
          s('d) Escrever f com degraus', <MM>{String.raw`f(t)=\frac{1}{a^2}\left[u_{-1}(t)-2u_{-1}(t-a)+u_{-1}(t-2a)\right]`}</MM>),
          s('d) Transformar', <MM>{String.raw`F(s)=\frac{1}{a^2s}\left(1-2e^{-as}+e^{-2as}\right)=\frac{1}{a^2s}\left(1-e^{-as}\right)^2`}</MM>),
        ]}
        answer={<p>a) <M>{'4s/(s^2+4)^2'}</M>; b) <M>{'2/(s+3)^3'}</M>; c) <M>{'1/[s(s+2)]'}</M>; d) <M>{'(1-e^{-as})^2/(a^2s)'}</M>.</p>}>
        <p>Calcule: a) <M>{'\\mathcal L\\{t\\sen 2t\\}'}</M>; b) <M>{'\\mathcal L\\{t^2e^{-3t}\\}'}</M>; c) <M>{String.raw`\mathcal L\{\int_0^te^{-2\tau}d\tau\}`}</M>; d) <M>F(s)</M> para <M>{'f=1/a^2'}</M> em <M>{'[0,a)'}</M>, <M>{'-1/a^2'}</M> em <M>{'[a,2a)'}</M> e 0 depois.</p>
      </Exercise>
      <Exercise id="l1-13" src={{ file: 'lista-1.pdf', p: 3, label: 'enunciado: Lista 1, p. 3' }} num="13" topic="Inversa por frações parciais"
        steps={[
          s('a)', <p><M>{String.raw`C_1=\frac{10}{-2+4}=5`}</M>, <M>{String.raw`C_2=\frac{10}{-4+2}=-5`}</M> ⇒ <M>{'5e^{-2t}-5e^{-4t}'}</M>.</p>),
          s('b) raiz dupla', <p><M>{'(s+3)/(s+1)^2'}</M>: <M>{'D_0=(s+3)|_{-1}=2'}</M>, <M>{'D_1=\\frac{d}{ds}(s+3)=1'}</M> ⇒ <M>{'2te^{-t}+e^{-t}'}</M>.</p>),
          s('c) completar quadrado', <p><M>{String.raw`\frac{8}{(s+2)^2+4}=4\cdot\frac{2}{(s+2)^2+2^2}`}</M> ⇒ <M>{'4e^{-2t}\\sen 2t'}</M>.</p>),
          s('d) complexos', <><p><M>{'C_1=1/2'}</M>. Em <M>{'p=-1+j'}</M>: <M>{String.raw`C_2=\frac{2p+1}{p(p+1+j)}=\frac{-1+j2}{(-1+j)(j2)}=-0{,}25-j0{,}75`}</M>.</p><p>Abordagem 2: <M>{String.raw`e^{-t}[2(-0{,}25)\cos t-2(-0{,}75)\sen t]`}</M>.</p></>),
        ]}
        answer={<p>a) <M>{'5e^{-2t}-5e^{-4t}'}</M>; b) <M>{'e^{-t}+2te^{-t}'}</M>; c) <M>{'4e^{-2t}\\sen2t'}</M>; d) <M>{String.raw`\frac12-\frac12e^{-t}\cos t+\frac32e^{-t}\sen t`}</M>.</p>}>
        <p>Determine <M>{'f(t)'}</M>: a) <M>{String.raw`\frac{10}{(s+2)(s+4)}`}</M>; b) <M>{String.raw`\frac{s+3}{s^2+2s+1}`}</M>; c) <M>{String.raw`\frac{8}{s^2+4s+8}`}</M>; d) <M>{String.raw`\frac{2s+1}{s(s^2+2s+2)}`}</M>.</p>
      </Exercise>

      <Sec>7. Funções de transferência</Sec>
      <Exercise id="l1-14" src={{ file: 'lista-1.pdf', p: 3, label: 'enunciado: Lista 1, p. 3' }} num="14" topic="FT a partir da EDO"
        steps={[
          s('Laplace com CI nulas', <MM>{String.raw`(s^2+5s+6)Y=(2s+3)U\ \Rightarrow\ G(s)=\frac{2s+3}{s^2+5s+6}`}</MM>),
          s('Polos e zeros', <p>Polos: <M>{'(s+2)(s+3)=0'}</M> ⇒ −2 e −3. Zero: <M>{'2s+3=0'}</M> ⇒ −1,5.</p>),
          s('Classificação', <p><M>m=1</M>, <M>n=2</M>: estritamente própria, grau relativo 1.</p>),
        ]}
        answer={<p><M>{String.raw`G=\frac{2s+3}{s^2+5s+6}`}</M>; polos −2, −3; zero −1,5; estritamente própria (<M>g=1</M>).</p>}>
        <p>Um SLIT é descrito por <M>{'\\ddot y+5\\dot y+6y=2\\dot u+3u'}</M>. a) Determine <M>G(s)</M>. b) Determine polos e zeros e classifique <M>G(s)</M>.</p>
      </Exercise>
      <Exercise id="l1-15" src={{ file: 'lista-1.pdf', p: 3, label: 'enunciado: Lista 1, p. 3' }} num="15" topic="Classificação de FT"
        steps={[
          s('Graus', <p>a) <M>m=1,n=2</M>; b) <M>m=2,n=2</M>; c) <M>m=3,n=2</M>; d) <M>m=0,n=2</M>.</p>),
          s('Classificar', <p>a) estritamente própria, <M>g=1</M>; b) biprópria, <M>g=0</M>; c) imprópria, <M>g=-1</M>; d) estritamente própria, <M>g=2</M>.</p>),
        ]}
        answer={<p>Só a c) não é fisicamente realizável (imprópria: a saída dependeria de derivada da entrada).</p>}>
        <p>Classifique e dê o grau relativo: a) <M>{String.raw`\frac{s+1}{s^2+3s+2}`}</M>; b) <M>{String.raw`\frac{s^2+2}{s^2+3s+2}`}</M>; c) <M>{String.raw`\frac{s^3+1}{s^2+3s+2}`}</M>; d) <M>{String.raw`\frac{5}{s(s+4)}`}</M>. Quais não são realizáveis?</p>
      </Exercise>
      <Exercise id="l1-16" src={{ file: 'lista-1.pdf', p: 3, label: 'enunciado: Lista 1, p. 3' }} num="16" topic="FT a partir da resposta ao degrau"
        steps={[
          s('Transformar a resposta', <MM>{String.raw`Y(s)=\frac2s-\frac{2s}{s^2+4}=\frac{2(s^2+4)-2s^2}{s(s^2+4)}=\frac{8}{s(s^2+4)}`}</MM>),
          s('a) G e EDO', <p><M>{String.raw`G=\frac{Y}{U}=sY=\frac{8}{s^2+4}`}</M> ⇒ <M>{'\\ddot y+4y=8u'}</M>.</p>),
          s('b) Transformar com CI', <MM>{String.raw`s^2Y-s+1+4Y=\frac{8}{s+2}\ \Rightarrow\ Y=\frac{s-1}{s^2+4}+\frac{8}{(s+2)(s^2+4)}`}</MM>),
          s('b) Frações parciais', <MM>{String.raw`\frac{8}{(s+2)(s^2+4)}=\frac{1}{s+2}+\frac{-s+2}{s^2+4}\ \Rightarrow\ Y=\frac{1}{s+2}+\frac{1}{s^2+4}`}</MM>),
        ]}
        answer={<p>a) <M>{String.raw`G=\frac{8}{s^2+4}`}</M>, <M>{'\\ddot y+4y=8u'}</M>. b) <M>{String.raw`y(t)=e^{-2t}+\frac12\sen2t`}</M>.</p>}>
        <p>A resposta ao degrau de um SLIT relaxado é <M>{'y(t)=2-2\\cos 2t'}</M>. a) Determine a FT e a EDO. b) Determine a resposta a <M>{'u=e^{-2t}'}</M> com <M>{'y(0)=1'}</M> e <M>{'\\dot y(0)=-1'}</M>.</p>
      </Exercise>
      <Exercise id="l1-17" src={{ file: 'lista-1.pdf', p: 4, label: 'enunciado: Lista 1, p. 4' }} num="17" topic="Resposta com CI não nulas a partir da FT"
        steps={[
          s('EDO equivalente', <p><M>{String.raw`G=\frac{5}{s^2+10s}`}</M> ⇒ <M>{'\\ddot y+10\\dot y=5u'}</M>. A FT pressupõe CI nulas; com CI, volta-se à EDO.</p>),
          s('Transformar', <MM>{String.raw`s^2Y-s+10+10(sY-1)=\frac5s\ \Rightarrow\ (s^2+10s)Y=s+\frac5s\ \Rightarrow\ Y=\frac{s^2+5}{s^2(s+10)}`}</MM>),
          s('Frações parciais (polo duplo em 0)', <MM>{String.raw`D_0=\frac{5}{10}=\frac12,\quad D_1=\frac{d}{ds}\frac{s^2+5}{s+10}\Big|_0=-\frac{5}{100}=-\frac1{20},\quad C=\frac{100+5}{100}=\frac{21}{20}`}</MM>),
        ]}
        answer={<MM>{String.raw`y(t)=-\frac{1}{20}+\frac12t+\frac{21}{20}e^{-10t}`}</MM>}>
        <p>Com <M>{String.raw`G(s)=\frac{5}{s(s+10)}`}</M>, determine a resposta ao degrau unitário com <M>{'y(0)=1'}</M> e <M>{'\\dot y(0)=-10'}</M>.</p>
      </Exercise>
      <Exercise id="l1-18" src={{ file: 'lista-1.pdf', p: 4, label: 'enunciado: Lista 1, p. 4' }} num="18" topic="FT a partir da resposta ao impulso"
        steps={[
          s('Transformar g(t)', <MM>{String.raw`G(s)=\frac{2}{s+1}-\frac{1}{s+3}=\frac{2(s+3)-(s+1)}{(s+1)(s+3)}=\frac{s+5}{s^2+4s+3}`}</MM>),
          s('EDO', <p>Numerador ↔ entrada, denominador ↔ saída: <M>{'\\ddot y+4\\dot y+3y=\\dot u+5u'}</M>.</p>),
        ]}
        answer={<p><M>{String.raw`G=\frac{s+5}{s^2+4s+3}`}</M>; <M>{'\\ddot y+4\\dot y+3y=\\dot u+5u'}</M>.</p>}>
        <p>A resposta ao impulso de um SLIT relaxado é <M>{'g(t)=2e^{-t}-e^{-3t}'}</M>. Determine <M>G(s)</M> e a EDO.</p>
      </Exercise>
      <Exercise id="l1-19" src={{ file: 'lista-1.pdf', p: 4, label: 'enunciado: Lista 1, p. 4' }} num="19" topic="Malha fechada"
        steps={[
          s('a) FTMF', <MM>{String.raw`T(s)=\frac{G_p}{1+G_p}=\frac{K}{s^2+4s+K}`}</MM>),
          s('b) Forma pedida', <p><M>{'M_1+M_2e^{\\alpha t}+M_3te^{\\alpha t}'}</M>: <M>{'M_1'}</M> vem do degrau e <M>{'te^{\\alpha t}'}</M> exige um polo real <b>duplo</b>. Polos: <M>{'s=-2\\pm\\sqrt{4-K}'}</M> ⇒ duplo se <M>{'4-K=0'}</M>, ou seja, <M>K=4</M> (polo em −2, <M>{'\\alpha=-2'}</M>).</p>),
          s('c) Duas exponenciais reais distintas', <p>Polos reais e distintos ⇔ <M>{'4-K>0'}</M>; com <M>{'K>0'}</M>: <M>{'0<K<4'}</M>.</p>),
        ]}
        answer={<p>a) <M>{String.raw`T=\frac{K}{s^2+4s+K}`}</M>; b) <M>K=4</M>; c) <M>{'0<K<4'}</M>. Veja a simulação "Ganho em malha fechada" no tópico de diagramas de blocos.</p>}>
        <p>Sistema com realimentação unitária e <M>{String.raw`G_p=\frac{K}{s(s+4)}`}</M>, <M>{'K>0'}</M>. a) <M>{'T(s)=Y/R'}</M>. b) <M>K</M> para que a resposta ao degrau tenha a forma <M>{'M_1+M_2e^{\\alpha t}+M_3te^{\\alpha t}'}</M>. c) Para quais <M>K</M> há duas exponenciais reais distintas?</p>
      </Exercise>
      <Exercise id="l1-20" src={{ file: 'lista-1.pdf', p: 4, label: 'enunciado: Lista 1, p. 4' }} num="20" topic="Termos da resposta e seus polos"
        steps={[
          s('Montar Y(s)', <MM>{String.raw`Y(s)=\frac{10}{s(s+1)(s^2+4s+13)},\qquad \text{polos: }0,\ -1,\ -2\pm j3`}</MM>),
          s('Resíduos reais', <p><M>{String.raw`C_0=\frac{10}{13}`}</M>; <M>{String.raw`C_{-1}=\frac{10}{(-1)(1-4+13)}=-1`}</M>.</p>),
          s('Resíduo complexo', <MM>{String.raw`C=\frac{10}{p(p+1)(p+2+j3)}\Big|_{p=-2+j3}=\frac{10}{(-7-j9)(j6)}=\frac{10}{54-j42}\approx0{,}1154+j0{,}0897`}</MM>),
          s('Abordagem 2', <p><M>{'2\\Re\\{C\\}=3/13=9/39'}</M> e <M>{'-2\\Im\\{C\\}=-7/39'}</M>.</p>),
        ]}
        answer={<><MM>{String.raw`y(t)=\underbrace{\tfrac{10}{13}}_{\text{entrada (polo }s=0)}\ \underbrace{-\,e^{-t}}_{\text{polo }-1}\ +\ \underbrace{\tfrac{1}{39}e^{-2t}\left(9\cos3t-7\sen3t\right)}_{\text{polos }-2\pm j3}`}</MM><Plot height={160} xRange={[0, 6]} series={[{ ...q20, color: 'var(--pen)' }]} yLabel="y(t)" /></>}>
        <p>Com <M>{String.raw`G(s)=\frac{10}{(s+1)(s^2+4s+13)}`}</M>, determine a resposta ao degrau unitário (CI nulas) e identifique o termo associado à entrada e os termos associados a cada polo.</p>
      </Exercise>
    </>
  )
}
