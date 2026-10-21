import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function EspacoEstados() {
  return (
    <>
      <h2>Estado e variáveis de estado<Slide p={4} /></h2>
      <p>O <b>estado</b> de um sistema é um conjunto de números tais que, conhecidos esses números, as funções de entrada e as equações da dinâmica, determinam-se o estado futuro e a saída. Ele é descrito pelas variáveis de estado <M>{'[x_1(t),\\dots,x_n(t)]'}</M>; o espaço <M>n</M>-dimensional formado por elas é o <b>espaço de estados</b>, e <M>n</M> é a ordem do sistema. Cada estado é um ponto nesse espaço.</p>

      <h2>Exemplo 9: circuito RLC<Slide p={[5, 8]} /></h2>
      <p>Fonte de corrente <M>i(t)</M> alimentando um capacitor <M>C</M> em paralelo com o ramo série <M>L</M>–<M>R</M>; saída <M>{'v_o=Ri_L'}</M>. Uma escolha comum para circuitos RLC passivos é a tensão no capacitor e a corrente no indutor, <M>{'x_1=v_C'}</M> e <M>{'x_2=i_L'}</M>: elas descrevem a energia armazenada, e seus valores iniciais resumem a energia inicial. Em redes RLC passivas, o número de variáveis de estado é o número de armazenadores de energia independentes.</p>
      <MM>{String.raw`i=C\dot v_C+i_L\Rightarrow\dot x_1=-\frac1Cx_2+\frac1Ci,\qquad v_C=L\dot i_L+Ri_L\Rightarrow\dot x_2=\frac1Lx_1-\frac RLx_2,\qquad v_o=Rx_2`}</MM>
      <MM>{String.raw`\begin{bmatrix}\dot x_1\\\dot x_2\end{bmatrix}=\begin{bmatrix}0&-\frac1C\\[2pt]\frac1L&-\frac RL\end{bmatrix}\begin{bmatrix}x_1\\x_2\end{bmatrix}+\begin{bmatrix}\frac1C\\[2pt]0\end{bmatrix}i,\qquad y=\begin{bmatrix}0&R\end{bmatrix}\begin{bmatrix}x_1\\x_2\end{bmatrix}`}</MM>
      <p>A dinâmica fica descrita por EDOs de 1ª ordem: a derivada de cada variável de estado é função dos estados e das entradas; a saída também é função dos estados.</p>
      <p>As variáveis de estado <b>não são únicas</b>: qualquer combinação linear delas serve, mas preferem-se variáveis com significado físico e mensuráveis. No Exemplo 10 dos slides, com <M>{'x_1^*=v_C'}</M> e <M>{'x_2^*=v_L=x_1-Rx_2'}</M>, chega-se a outro modelo do mesmo circuito, com saída <M>{'v_o=x_1^*-x_2^*'}</M>.</p>

      <h2>Forma geral e forma matricial (SLIT)<Slide p={[9, 13]} /></h2>
      <MM>{String.raw`\begin{cases}\dot{\mathbf x}=\mathbf f(\mathbf x,\mathbf u,t)&\text{equação de estados}\\ \mathbf y=\mathbf g(\mathbf x,\mathbf u,t)&\text{equação de saída}\end{cases}\qquad\xrightarrow{\text{SLIT}}\qquad\begin{cases}\dot{\mathbf x}=A\mathbf x+B\mathbf u\\ \mathbf y=C\mathbf x+D\mathbf u\end{cases}`}</MM>
      <p><M>A</M> é <M>{'n\\times n'}</M>; <M>B</M>, <M>{'n\\times m'}</M> (vetor coluna se há uma entrada); <M>C</M>, <M>{'p\\times n'}</M> (vetor linha se há uma saída); <M>D</M>, <M>{'p\\times m'}</M> — frequentemente nula, quando a entrada não afeta diretamente a saída. Para sistemas invariantes, <M>f</M> e <M>g</M> não dependem explicitamente do tempo.</p>

      <SimSlot name="estados" initial="massa" />

      <p>A matriz <M>A</M> é uma transformação: os autovetores são as direções que ela só estica. Compare as retas verdes daqui com as trajetórias acima.</p>
      <SimSlot name="matriz" />
      <h2>Solução da equação de estados<Slide p={[14, 15]} /></h2>
      <MM>{String.raw`s\mathbf X(s)-\mathbf x(0)=A\mathbf X(s)+B\mathbf U(s)\ \Rightarrow\ \mathbf X(s)=\Phi(s)\mathbf x(0)+\Phi(s)B\mathbf U(s),\qquad \Phi(s)=(sI-A)^{-1}`}</MM>
      <p>A matriz de transição de estados é <M>{String.raw`\Phi(t)=\mathcal L^{-1}\{(sI-A)^{-1}\}=e^{At}`}</M>, com a exponencial matricial <M>{String.raw`e^{At}=I+At+\frac{A^2t^2}{2!}+\dots`}</M>. No tempo:</p>
      <MM>{String.raw`\mathbf x(t)=\Phi(t)\mathbf x(0)+\int_0^t\Phi(t-\tau)B\mathbf u(\tau)\,d\tau`}</MM>
      <p>Na prática, costuma-se evitar essa integral e resolver diretamente por Laplace.</p>

      <h3>Teorema de Cayley–Hamilton<Slide p={[16, 17]} /></h3>
      <p>Toda matriz satisfaz sua equação característica: se <M>{'c(\\lambda)=\\det(\\lambda I-A)=\\lambda^n+\\alpha_1\\lambda^{n-1}+\\dots+\\alpha_n'}</M>, então <M>{'c(A)=0'}</M>. Consequência: qualquer função matricial <M>f(A)</M> é um polinômio de grau menor que <M>n</M>, <M>{'p(A)=a_1A^{n-1}+\\dots+a_nI'}</M>, com coeficientes obtidos de <M>{'f(\\lambda_i)=p(\\lambda_i)'}</M> nos autovalores (e das derivadas, para autovalores múltiplos).</p>
      <Exercise id="t-ee-12" review={['autovalores', 'sistemas-lineares', 'matrizes']} src={{ p: [18, 19] }} num="12" topic="Exemplo ilustrativo 12 dos slides"
        steps={[
          { title: 'Autovalores', body: <MM>{String.raw`\det(\lambda I-A)=(\lambda+1)^2(\lambda+0{,}5)=0\ \Rightarrow\ \lambda_1=-0{,}5,\ \lambda_2=\lambda_3=-1`}</MM> },
          { title: 'Condições', body: <><p>Com <M>{'f(\\lambda)=e^{\\lambda t}'}</M> e <M>{'p(\\lambda)=a_1\\lambda^2+a_2\\lambda+a_3'}</M>, o autovalor duplo exige também a derivada (em <M>{'\\lambda'}</M>):</p><MM>{String.raw`\begin{cases}e^{-0{,}5t}=0{,}25a_1-0{,}5a_2+a_3\\ e^{-t}=a_1-a_2+a_3\\ te^{-t}=-2a_1+a_2\end{cases}`}</MM></> },
          { title: 'Coeficientes', body: <MM>{String.raw`a_1=4e^{-0{,}5t}-4e^{-t}-2te^{-t},\quad a_2=8e^{-0{,}5t}-8e^{-t}-3te^{-t},\quad a_3=4e^{-0{,}5t}-3e^{-t}-te^{-t}`}</MM> },
        ]}
        answer={<MM>{String.raw`e^{At}=a_1A^2+a_2A+a_3I=\begin{bmatrix}e^{-t}&0{,}5te^{-t}&0\\0&e^{-t}&0\\2e^{-0{,}5t}-2e^{-t}&4e^{-0{,}5t}-4e^{-t}-te^{-t}&e^{-0{,}5t}\end{bmatrix}`}</MM>}>
        <p>Calcule <M>{'e^{At}'}</M> por Cayley–Hamilton para <M>{String.raw`A=\begin{bmatrix}-1&0{,}5&0\\0&-1&0\\1&1&-0{,}5\end{bmatrix}`}</M>.</p>
      </Exercise>

      <Exercise id="t-ee-13" review={['matrizes', 'fracoes']} src={{ p: [21, 23] }} num="13" topic="Exemplo ilustrativo 13 dos slides"
        steps={[
          { title: 'Matrizes numéricas', body: <MM>{String.raw`A=\begin{bmatrix}0&-400\\25&-250\end{bmatrix},\quad B=\begin{bmatrix}400\\0\end{bmatrix},\quad C=\begin{bmatrix}0&10\end{bmatrix},\quad \mathbf x(0)=\begin{bmatrix}1\\0\end{bmatrix},\quad U(s)=\frac{0{,}1}{s}`}</MM> },
          { title: 'Matriz de transição', body: <MM>{String.raw`\Phi(s)=(sI-A)^{-1}=\frac{1}{s^2+250s+10\,000}\begin{bmatrix}s+250&-400\\25&s\end{bmatrix}`}</MM> },
          { title: 'Estado', body: <MM>{String.raw`\mathbf X(s)=\Phi(s)\mathbf x(0)+\Phi(s)B\,U(s)=\frac{1}{s(s^2+250s+10\,000)}\begin{bmatrix}s^2+290s+10\,000\\25s+1000\end{bmatrix}`}</MM> },
          { title: 'Saída', body: <MM>{String.raw`Y(s)=C\mathbf X(s)=\frac{250s+10\,000}{s(s+50)(s+200)}=\frac1s+\frac{1/3}{s+50}-\frac{4/3}{s+200}`}</MM> },
        ]}
        answer={<><MM>{String.raw`v_o(t)=1+\tfrac13e^{-50t}-\tfrac43e^{-200t}\approx1+0{,}33e^{-50t}-1{,}33e^{-200t}`}</MM>
          <div className="warn"><span className="tag">Diferença em relação ao slide</span>O slide traz o último coeficiente como −0,8<Slide p={23} />. Pelas frações parciais, o resíduo em <M>{'s=-200'}</M> é <M>{String.raw`\frac{250(-200)+10\,000}{(-200)(-150)}=-\frac43`}</M>. Uma checagem: <M>{'v_o(0)=Ri_L(0)=0'}</M>, e de fato <M>{'1+\\frac13-\\frac43=0'}</M>. Confirme com o professor qual valor ele considera.</div>
          <p>Cada autovalor de <M>A</M> (−50 e −200) gera um termo exponencial na saída; o de maior módulo decai mais rápido.</p></>}>
        <p>Resolva a equação de estado do RLC com <M>{'C=2{,}5\\,\\text{mF}'}</M>, <M>{'L=40\\,\\text{mH}'}</M>, <M>{'R=10\\,\\Omega'}</M>, <M>{'i(t)=0{,}1\\,\\text{A}'}</M>, <M>{'i_L(0)=0'}</M> e <M>{'v_C(0)=1\\,\\text{V}'}</M>, por Laplace.</p>
      </Exercise>

      <h2>Do espaço de estados para a função de transferência<Slide p={[24, 25]} /></h2>
      <MM>{String.raw`G(s)=C(sI-A)^{-1}B+D=\frac{C\,\mathrm{adj}(sI-A)\,B+D\det(sI-A)}{\det(sI-A)}`}</MM>
      <p>O denominador é a equação característica de <M>A</M>: <b>os autovalores de <M>A</M> são os polos de <M>G(s)</M></b> (salvo cancelamentos, como se verá em controlabilidade e observabilidade).</p>
      <p>Exemplo 15 dos slides: <M>{String.raw`A=\begin{bmatrix}0&1\\-2&-3\end{bmatrix},\ B=\begin{bmatrix}0{,}5\\0{,}5\end{bmatrix},\ C=\begin{bmatrix}1&0\end{bmatrix}`}</M> ⇒ <M>{String.raw`G(s)=\frac{\begin{bmatrix}1&0\end{bmatrix}\begin{bmatrix}s+3&1\\-2&s\end{bmatrix}\begin{bmatrix}0{,}5\\0{,}5\end{bmatrix}}{s^2+3s+2}=\frac{0{,}5s+2}{s^2+3s+2}`}</M>, polos −1 e −2.</p>

      <h2>Da função de transferência para o espaço de estados<Slide p={[26, 38]} /></h2>
      <p>Não há realização única. Para <M>{String.raw`G(s)=\frac{b_1s^{n-1}+\dots+b_{n-1}s+b_n}{s^n+a_1s^{n-1}+\dots+a_n}`}</M>:</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Forma</th><th>Matrizes</th><th>Uso</th></tr></thead>
        <tbody>
          <tr><td>Canônica controlável</td><td><M>{String.raw`A=\begin{bmatrix}0&1&\cdots&0\\\vdots&&\ddots&\vdots\\0&0&\cdots&1\\-a_n&-a_{n-1}&\cdots&-a_1\end{bmatrix},\ B=\begin{bmatrix}0\\\vdots\\0\\1\end{bmatrix},\ C=\begin{bmatrix}b_n&\cdots&b_1\end{bmatrix}`}</M></td><td>alocação de polos; se só <M>{'b_n\\ne0'}</M>, os estados são <M>{'y,\\dot y,\\dots,y^{(n-1)}'}</M></td></tr>
          <tr><td>Canônica observável</td><td><M>{String.raw`A=\begin{bmatrix}0&\cdots&0&-a_n\\1&\cdots&0&-a_{n-1}\\\vdots&\ddots&&\vdots\\0&\cdots&1&-a_1\end{bmatrix},\ B=\begin{bmatrix}b_n\\\vdots\\b_1\end{bmatrix},\ C=\begin{bmatrix}0&\cdots&0&1\end{bmatrix}`}</M></td><td>projeto de observadores</td></tr>
          <tr><td>Canônica de Jordan</td><td>polos distintos: <M>{String.raw`A=\mathrm{diag}(-p_1,\dots,-p_n),\ B=\begin{bmatrix}1&\cdots&1\end{bmatrix}^T,\ C=\begin{bmatrix}c_1&\cdots&c_n\end{bmatrix}`}</M>, com <M>{'c_i'}</M> das frações parciais</td><td>modos desacoplados; polos múltiplos geram 1s na supradiagonal de <M>A</M> e 0s em <M>B</M></td></tr>
        </tbody></table></div>
      <p>Funções com mais zeros que polos são não causais (a divisão polinomial mostra que a saída dependeria de derivadas da entrada) e não têm significado físico. Com <b>grau do numerador igual ao do denominador</b>, divide-se: <M>{"G(s)=c_0+G'(s)"}</M>, com <M>{'b_i=c_i-c_0a_i'}</M>; realiza-se <M>{"G'(s)"}</M> e faz-se <M>{'D=c_0'}</M>.</p>
      <Exercise id="t-ee-16" review={['polinomios', 'fracoes']} src={{ p: [39, 41] }} num="16" topic="Exemplo ilustrativo 16 dos slides"
        steps={[
          { title: 'Divisão e frações parciais', body: <MM>{String.raw`G(s)=0{,}5+\frac{s^2+3}{s^3+4s^2+5s+2}=0{,}5+\frac{s^2+3}{(s+1)^2(s+2)}=0{,}5+\frac{4}{(s+1)^2}-\frac{6}{s+1}+\frac{7}{s+2}`}</MM> },
          { title: 'Forma controlável', body: <MM>{String.raw`\dot{\mathbf x}=\begin{bmatrix}0&1&0\\0&0&1\\-2&-5&-4\end{bmatrix}\mathbf x+\begin{bmatrix}0\\0\\1\end{bmatrix}u,\quad y=\begin{bmatrix}3&0&1\end{bmatrix}\mathbf x+0{,}5u`}</MM> },
          { title: 'Forma observável', body: <MM>{String.raw`\dot{\mathbf x}=\begin{bmatrix}0&0&-2\\1&0&-5\\0&1&-4\end{bmatrix}\mathbf x+\begin{bmatrix}3\\0\\1\end{bmatrix}u,\quad y=\begin{bmatrix}0&0&1\end{bmatrix}\mathbf x+0{,}5u`}</MM> },
          { title: 'Forma de Jordan', body: <MM>{String.raw`\dot{\mathbf x}=\begin{bmatrix}-1&1&0\\0&-1&0\\0&0&-2\end{bmatrix}\mathbf x+\begin{bmatrix}0\\1\\1\end{bmatrix}u,\quad y=\begin{bmatrix}4&-6&7\end{bmatrix}\mathbf x+0{,}5u`}</MM> },
        ]}
        answer={<p>As três realizações têm a mesma função de transferência e os mesmos autovalores (−1, −1, −2), embora as matrizes sejam diferentes.</p>}>
        <p>Encontre as realizações controlável, observável e de Jordan de <M>{String.raw`G(s)=\frac{0{,}5s^3+3s^2+2{,}5s+4}{s^3+4s^2+5s+2}`}</M>.</p>
      </Exercise>
    </>
  )
}
