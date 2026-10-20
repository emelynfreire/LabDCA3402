import { M, MM } from '../components/Tex.jsx'

const pairs = [
  ['\\delta(t)', '1', 's \\in \\mathbb{C}'],
  ['u_{-1}(t)', '\\dfrac{1}{s}', '\\Re\\{s\\}>0'],
  ['e^{at}', '\\dfrac{1}{s-a}', '\\Re\\{s\\}>a'],
  ['t^n', '\\dfrac{n!}{s^{n+1}}', '\\Re\\{s\\}>0'],
  ['t^n e^{at}', '\\dfrac{n!}{(s-a)^{n+1}}', '\\Re\\{s\\}>a'],
  ['\\sen(\\omega_0 t)', '\\dfrac{\\omega_0}{s^2+\\omega_0^2}', '\\Re\\{s\\}>0'],
  ['\\cos(\\omega_0 t)', '\\dfrac{s}{s^2+\\omega_0^2}', '\\Re\\{s\\}>0'],
  ['e^{at}\\sen(\\omega_0 t)', '\\dfrac{\\omega_0}{(s-a)^2+\\omega_0^2}', '\\Re\\{s\\}>a'],
  ['e^{at}\\cos(\\omega_0 t)', '\\dfrac{s-a}{(s-a)^2+\\omega_0^2}', '\\Re\\{s\\}>a'],
]
const props = [
  ['Linearidade', '\\alpha_1x_1(t)+\\alpha_2x_2(t)', '\\alpha_1X_1(s)+\\alpha_2X_2(s)'],
  ['Deslocamento no tempo', 'x(t-t_0)\\,u_{-1}(t-t_0)', 'e^{-t_0 s}X(s)'],
  ['Deslocamento em s', 'e^{s_0t}x(t)', 'X(s-s_0)'],
  ['Escala no tempo', 'x(at)', '\\tfrac{1}{|a|}X\\!\\left(\\tfrac{s}{a}\\right)'],
  ['Derivada (unilateral)', '\\dot x(t)', 'sX(s)-x(0^-)'],
  ['Derivada segunda', '\\ddot x(t)', 's^2X(s)-s\\,x(0^-)-\\dot x(0^-)'],
  ['Multiplicação por t', 't\\,x(t)', '-\\dfrac{dX(s)}{ds}'],
  ['Integração', '\\int_{0}^{t}x(\\tau)\\,d\\tau', '\\dfrac{X(s)}{s}'],
  ['Convolução', 'x_1(t)*x_2(t)', 'X_1(s)X_2(s)'],
]

export default function Formulario() {
  return (
    <div className="page">
      <header className="page-head">
        <div className="kicker">Consulta rápida</div>
        <h1>Formulário e tabelas</h1>
        <p className="lead">As fórmulas que aparecem nos slides e nas listas, reunidas por assunto. Imprima esta página se quiser (o menu e os botões somem na impressão).</p>
      </header>

      <h2>Transformada de Laplace (t ≥ 0)</h2>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>x(t)</th><th>X(s)</th><th>ROC</th></tr></thead>
        <tbody>{pairs.map((p) => <tr key={p[0]}><td><M>{p[0]}</M></td><td><M>{p[1]}</M></td><td><M>{p[2]}</M></td></tr>)}</tbody></table></div>
      <h3>Propriedades</h3>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Propriedade</th><th>Tempo</th><th>Laplace</th></tr></thead>
        <tbody>{props.map((p) => <tr key={p[0]}><td>{p[0]}</td><td><M>{p[1]}</M></td><td><M>{p[2]}</M></td></tr>)}</tbody></table></div>
      <h3>Valor inicial e valor final</h3>
      <MM>{String.raw`x(0^+) = \lim_{s\to\infty} sX(s) \qquad\qquad \lim_{t\to\infty}x(t) = \lim_{s\to 0} sX(s)\ \ (\text{se o limite existir})`}</MM>
      <h3>Frações parciais</h3>
      <MM>{String.raw`C_k = (s-p_k)X(s)\big|_{s=p_k} \qquad D_k = \frac{1}{k!}\frac{d^k}{ds^k}\left[(s-p)^mX(s)\right]_{s=p}`}</MM>
      <p>Par complexo <M>{'\\alpha\\pm j\\beta'}</M> com resíduo <M>{'C = |C|e^{j\\angle C}'}</M>:</p>
      <MM>{String.raw`2|C|e^{\alpha t}\cos(\beta t + \angle C) = e^{\alpha t}\left[2\Re\{C\}\cos\beta t - 2\Im\{C\}\sen\beta t\right]`}</MM>

      <h2>Convolução e função de transferência</h2>
      <MM>{String.raw`y(t)=\int_0^t g(t-\tau)u(\tau)\,d\tau \qquad G(s)=\mathcal{L}\{g(t)\}=\frac{Y(s)}{U(s)}\Big|_{\text{CI nulas}}=\frac{b_0s^m+\dots+b_m}{s^n+a_1s^{n-1}+\dots+a_n}`}</MM>
      <p>Própria: <M>{'m\\le n'}</M> (estritamente: <M>{'m<n'}</M>; biprópria: <M>{'m=n'}</M>); imprópria: <M>{'m>n'}</M>, não realizável. Grau relativo <M>{'g=n-m'}</M>.</p>

      <h2>Diagramas de blocos</h2>
      <MM>{String.raw`\text{série: } G_1G_2 \qquad \text{paralelo: } G_1\pm G_2 \qquad \text{realim. negativa: } \frac{G}{1+GH} \qquad \text{positiva: } \frac{G}{1-GH}`}</MM>

      <h2>Estabilidade</h2>
      <p>BIBO-estável ⇔ <M>{'\\int_0^\\infty|g(t)|dt<\\infty'}</M> ⇔ todos os polos com parte real negativa. Routh: mesmo sinal nos coeficientes é necessário; nenhuma troca de sinal na 1ª coluna é necessário e suficiente.</p>
      <MM>{String.raw`c_1 = \frac{a_1a_2-a_0a_3}{a_1},\quad c_2 = \frac{a_1a_4-a_0a_5}{a_1},\quad d_1=\frac{c_1a_3-a_1c_2}{c_1},\ \dots`}</MM>
      <p>Estabilidade relativa (<M>{'\\Re\\{p_i\\}<-\\sigma'}</M>): aplicar Routh a <M>{'\\bar A(r)=A(r-\\sigma)'}</M>.</p>

      <h2>Resposta transitória</h2>
      <MM>{String.raw`\text{Primeira ordem: } G=\frac{K}{Ts+1},\ \ y(t)=K(1-e^{-t/T}),\ \ t_{ss}=3T\ (5\%),\ 4T\ (2\%)`}</MM>
      <MM>{String.raw`\text{Segunda ordem: } G=\frac{K\omega_n^2}{s^2+2\xi\omega_n s+\omega_n^2},\quad s=-\xi\omega_n\pm j\omega_d,\quad \omega_d=\omega_n\sqrt{1-\xi^2}`}</MM>
      <MM>{String.raw`M_p=e^{-\xi\pi/\sqrt{1-\xi^2}}\qquad t_p=\frac{\pi}{\omega_d}\qquad t_r=\frac{\pi-\beta}{\omega_d},\ \beta=\cos^{-1}\xi\qquad t_{ss}\approx\frac{3}{\xi\omega_n}\ (5\%),\ \frac{4}{\xi\omega_n}\ (2\%)`}</MM>
      <p>Criticamente amortecido: <M>{'y(t)=1-e^{-\\omega_n t}(1+\\omega_n t)'}</M>, <M>{'t_{ss}=4{,}744/\\omega_n'}</M> (5%) ou <M>{'5{,}834/\\omega_n'}</M> (2%). Faixa desejável: <M>{'0{,}4\\le\\xi\\le 0{,}8'}</M>.</p>

      <h2>Espaço de estados</h2>
      <MM>{String.raw`\dot{\mathbf x}=A\mathbf x+B\mathbf u,\quad \mathbf y=C\mathbf x+D\mathbf u \qquad \Phi(s)=(sI-A)^{-1},\ \ \Phi(t)=e^{At}=\mathcal{L}^{-1}\{\Phi(s)\}`}</MM>
      <MM>{String.raw`\mathbf x(t)=\Phi(t)\mathbf x(0)+\int_0^t\Phi(t-\tau)B\mathbf u(\tau)\,d\tau \qquad G(s)=C(sI-A)^{-1}B+D=\frac{C\,\mathrm{adj}(sI-A)B+D\det(sI-A)}{\det(sI-A)}`}</MM>
      <MM>{String.raw`\mathcal C=\begin{bmatrix}B & AB & \cdots & A^{n-1}B\end{bmatrix},\qquad \mathcal O=\begin{bmatrix}C\\ CA\\ \vdots\\ CA^{n-1}\end{bmatrix}`}</MM>
      <p>Controlável ⇔ <M>{'\\posto\\,\\mathcal C=n'}</M> ⇔ <M>{'\\posto[A-\\lambda I\\ \\ B]=n'}</M> para todo autovalor. Observável ⇔ <M>{'\\posto\\,\\mathcal O=n'}</M> ⇔ <M>{'\\posto\\begin{bmatrix}A-\\lambda I\\\\ C\\end{bmatrix}=n'}</M>.</p>
    </div>
  )
}
