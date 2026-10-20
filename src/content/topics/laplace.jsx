import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function Laplace() {
  return (
    <>
      <h2>Da resposta exponencial à transformada<Slide p={[4, 6]} /></h2>
      <p>Para um SLIT descrito pela EDO linear, a entrada <M>{'u(t)=e^{st}'}</M> com <M>{'s=\\sigma+j\\omega'}</M> tem solução particular <M>{'y(t)=G(s)e^{st}'}</M>. Como <M>{'\\frac{d^k}{dt^k}e^{st}=s^ke^{st}'}</M>, o fator <M>{'e^{st}'}</M> cancela ao substituir na EDO:</p>
      <MM>{String.raw`G(s)=\frac{b_0s^m+b_1s^{m-1}+\dots+b_{m-1}s+b_m}{s^n+a_1s^{n-1}+\dots+a_{n-1}s+a_n}`}</MM>
      <p>Se <M>u(t)</M> puder ser escrita como combinação linear de exponenciais, <M>{'u(t)=\\int \\tilde u(s)e^{st}ds'}</M>, a superposição dá <M>y(t)</M> a partir de <M>G(s)</M>. Essa representação por exponenciais é a Transformada de Laplace.</p>

      <SimSlot name="helice" />

      <h2>Funções de variável complexa<Slide p={[7, 8]} /></h2>
      <p>Com <M>s</M> complexo, <M>G(s)</M> é em geral complexa: <M>{String.raw`G(s)=G_x+jG_y=|G(s)|e^{j\angle G(s)}`}</M>, com <M>{String.raw`|G|=\sqrt{G_x^2+G_y^2}`}</M> e <M>{String.raw`\angle G=\tan^{-1}(G_y/G_x)`}</M>.</p>
      <div className="warn"><span className="tag">Quadrante</span>O arco tangente deve considerar o quadrante (use atan2). Ex.: <M>{'-0{,}75+j0{,}5625'}</M> está no 2º quadrante, então <M>{'\\angle\\approx 2{,}5'}</M> rad, e não −0,64 rad.</div>
      <p>Para <M>{'G(s)=N(s)/D(s)'}</M>: <b>zeros</b> são os valores de <M>s</M> com <M>{'N(s)=0'}</M>; <b>polos</b>, os valores com <M>{'D(s)=0'}</M>.</p>

      <SimSlot name="superficie" />

      <h2>Definição e região de convergência<Slide p={[9, 12]} /></h2>
      <Callout tag="Transformada de Laplace bilateral">
        <MM>{String.raw`\mathcal{L}\{x(t)\}=X(s)=\int_{-\infty}^{\infty}x(t)\,e^{-st}\,dt`}</MM>
        Definida para os valores de <M>s</M> em que a integral converge: a <b>região de convergência</b> (ROC). Dentro da ROC, <M>x(t)</M> e <M>X(s)</M> se correspondem de forma biunívoca.
      </Callout>
      <p>Exemplo dos slides: <M>{'e^{at},\\ t\\ge0'}</M> e <M>{'-e^{at},\\ t\\le0'}</M> têm a mesma expressão <M>{'X(s)=\\frac{1}{s-a}'}</M>, com ROCs <M>{'\\Re\\{s\\}>a'}</M> e <M>{'\\Re\\{s\\}<a'}</M>. É a ROC que diferencia os dois sinais.</p>
      <p>A <b>transformada unilateral</b>, <M>{String.raw`X(s)=\int_{0^-}^{\infty}x(t)e^{-st}dt`}</M>, é a usada para sistemas causais: cada <M>X(s)</M> corresponde a um único sinal com <M>{'x(t)=0,\\ t<0'}</M>, e a ROC deixa de ser necessária para distinguir transformadas.</p>

      <h2>Transformadas de funções típicas<Slide p={[11, 16]} /></h2>
      <p>Pelas fórmulas de Euler, <M>{String.raw`\sen\omega_0t=\frac{e^{j\omega_0t}-e^{-j\omega_0t}}{2j}`}</M>; somando as transformadas das duas exponenciais:</p>
      <MM>{String.raw`\mathcal{L}\{\sen\omega_0t\}=\frac{1}{2j}\left[\frac{1}{s-j\omega_0}-\frac{1}{s+j\omega_0}\right]=\frac{\omega_0}{s^2+\omega_0^2}`}</MM>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>x(t), t ≥ 0</th><th>X(s)</th><th>ROC</th></tr></thead>
        <tbody>
          {[['\\delta(t)', '1', 's\\in\\mathbb C'], ['u_{-1}(t)', '1/s', '\\Re\\{s\\}>0'], ['e^{at}', '\\frac{1}{s-a}', '\\Re\\{s\\}>a'], ['t^n', '\\frac{n!}{s^{n+1}}', '\\Re\\{s\\}>0'], ['t^ne^{at}', '\\frac{n!}{(s-a)^{n+1}}', '\\Re\\{s\\}>a'], ['\\sen\\omega_0t', '\\frac{\\omega_0}{s^2+\\omega_0^2}', '\\Re\\{s\\}>0'], ['\\cos\\omega_0t', '\\frac{s}{s^2+\\omega_0^2}', '\\Re\\{s\\}>0'], ['e^{at}\\sen\\omega_0t', '\\frac{\\omega_0}{(s-a)^2+\\omega_0^2}', '\\Re\\{s\\}>a'], ['e^{at}\\cos\\omega_0t', '\\frac{s-a}{(s-a)^2+\\omega_0^2}', '\\Re\\{s\\}>a']].map((r) => <tr key={r[0]}><td><M>{r[0]}</M></td><td><M>{r[1]}</M></td><td><M>{r[2]}</M></td></tr>)}
        </tbody></table></div>

      <h2>Propriedades<Slide p={[17, 23]} /></h2>
      <div className="tbl-wrap"><table className="tbl">
        <tbody>
          <tr><td>Linearidade</td><td><M>{'\\alpha_1X_1(s)+\\alpha_2X_2(s)'}</M></td></tr>
          <tr><td>Deslocamento no tempo</td><td><M>{'\\mathcal L\\{x(t-t_0)\\}=e^{-t_0s}X(s)'}</M></td></tr>
          <tr><td>Deslocamento em s</td><td><M>{'\\mathcal L\\{e^{s_0t}x(t)\\}=X(s-s_0)'}</M></td></tr>
          <tr><td>Escala no tempo</td><td><M>{'\\mathcal L\\{x(at)\\}=\\frac{1}{|a|}X(s/a)'}</M></td></tr>
          <tr><td>Diferenciação em t (bilateral)</td><td><M>{'sX(s)'}</M></td></tr>
          <tr><td>Diferenciação em s</td><td><M>{'\\mathcal L\\{tx(t)\\}=-\\frac{dX(s)}{ds}'}</M></td></tr>
          <tr><td>Integração no tempo</td><td><M>{'\\frac{1}{s}X(s)'}</M></td></tr>
          <tr><td>Convolução</td><td><M>{'\\mathcal L\\{x_1*x_2\\}=X_1(s)X_2(s)'}</M></td></tr>
        </tbody></table></div>
      <p>Aplicações dos slides: <M>{String.raw`\mathcal L\{te^{at}\}=-\frac{d}{ds}(s-a)^{-1}=\frac{1}{(s-a)^2}`}</M>; e o pulso de área unitária <M>{String.raw`f_p(t)=\frac{1}{t_0}[u(t)-u(t-t_0)]`}</M> tem <M>{String.raw`F_p(s)=\frac{1-e^{-t_0s}}{t_0s}`}</M>.</p>
      <Callout tag="Unilateral: derivada com condições iniciais">
        <MM>{String.raw`\mathcal L\{\dot x\}=sX(s)-x(0^-),\qquad \mathcal L\{\ddot x\}=s^2X(s)-s\,x(0^-)-\dot x(0^-),\qquad \mathcal L\{x^{(n)}\}=s^nX(s)-\sum_{i=0}^{n-1}s^{i}x^{(n-i-1)}(0^-)`}</MM>
        É essa propriedade que permite resolver EDOs com condições iniciais.
      </Callout>
      <p><b>Valor inicial</b>: <M>{'x(0^+)=\\lim_{s\\to\\infty}sX(s)'}</M> (se não houver impulso em 0). <b>Valor final</b>: <M>{'\\lim_{t\\to\\infty}x(t)=\\lim_{s\\to0}sX(s)'}</M>, desde que o limite no tempo exista — dá o regime sem calcular <M>y(t)</M>.</p>
      <p>A inversa formal é <M>{String.raw`x(t)=\frac{1}{2\pi j}\int_{\sigma-j\infty}^{\sigma+j\infty}X(s)e^{st}ds`}</M>, com a reta dentro da ROC. Na prática, usa-se frações parciais.</p>

      <h2>Inversa por frações parciais<Slide p={24} /></h2>
      <p>Para <M>{'X(s)=N(s)/D(s)'}</M> com grau de <M>N</M> menor que o de <M>D</M> e <M>D</M> mônico:</p>
      <h3>Raízes distintas<Slide p={25} /></h3>
      <MM>{String.raw`X(s)=\sum_k\frac{C_k}{s-p_k},\qquad C_k=(s-p_k)X(s)\big|_{s=p_k},\qquad x(t)=\sum_kC_ke^{p_kt}`}</MM>
      <h3>Par complexo conjugado<Slide p={[27, 30]} /></h3>
      <p>Se <M>{'p_{1,2}=\\alpha_1\\pm j\\beta_1'}</M>, então <M>{'C_2=\\bar C_1'}</M> e a parcela real pode ser escrita de duas formas equivalentes:</p>
      <MM>{String.raw`\underbrace{2|C_1|e^{\alpha_1t}\cos(\beta_1t+\angle C_1)}_{\text{Abordagem 1}}=\underbrace{e^{\alpha_1t}\left[2\Re\{C_1\}\cos\beta_1t-2\Im\{C_1\}\sen\beta_1t\right]}_{\text{Abordagem 2}}`}</MM>
      <p>A primeira é compacta e mostra amplitude, decaimento e defasagem; a segunda dispensa a forma polar.</p>
      <h3>Raízes múltiplas<Slide p={33} /></h3>
      <MM>{String.raw`\frac{N(s)}{(s-p)^m}=\frac{D_0}{(s-p)^m}+\dots+\frac{D_{m-1}}{s-p},\quad D_k=\frac{1}{k!}\frac{d^k}{ds^k}\left[(s-p)^mX(s)\right]_{s=p},\quad x(t)=D_0\frac{t^{m-1}}{(m-1)!}e^{pt}+\dots+D_{m-1}e^{pt}`}</MM>

      <h2>Exemplos dos slides</h2>
      <Exercise id="t-lap-1" src={{ p: 26 }} num="1" topic="Raízes reais distintas"
        steps={[
          { title: 'Resíduos', body: <MM>{String.raw`C_1=\frac{7s+10}{(s+2)(s+5)}\Big|_{-1}=\frac{3}{4},\quad C_2=\frac{7s+10}{(s+1)(s+5)}\Big|_{-2}=\frac{4}{3},\quad C_3=\frac{7s+10}{(s+1)(s+2)}\Big|_{-5}=-\frac{25}{12}`}</MM> },
        ]}
        answer={<MM>{String.raw`x(t)=\tfrac34e^{-t}+\tfrac43e^{-2t}-\tfrac{25}{12}e^{-5t},\quad t\ge 0`}</MM>}>
        <p>Inverta <M>{String.raw`X(s)=\dfrac{7s+10}{(s+1)(s+2)(s+5)}`}</M>.</p>
      </Exercise>
      <Exercise id="t-lap-2" src={{ p: [31, 32] }} num="2" topic="Raízes complexas"
        steps={[
          { title: 'Raízes', body: <p><M>{'p_1=0'}</M> e <M>{'p_{2,3}=-6\\pm j8'}</M>.</p> },
          { title: 'Resíduos', body: <MM>{String.raw`C_1=\frac{150}{100}=1{,}5,\qquad C_2=\frac{150}{s(s+6+j8)}\Big|_{s=-6+j8}=\frac{150}{(-6+j8)(j16)}=-0{,}75+j0{,}5625`}</MM> },
          { title: 'Forma polar', body: <p><M>{'|C_2|=0{,}9375'}</M>, <M>{'\\angle C_2=\\text{atan2}(0{,}5625;\\,-0{,}75)=2{,}5'}</M> rad.</p> },
          { title: 'As duas formas', body: <MM>{String.raw`x(t)=1{,}5+1{,}875e^{-6t}\cos(8t+2{,}5)=1{,}5+e^{-6t}\left(-1{,}5\cos 8t-1{,}125\sen 8t\right)`}</MM> },
        ]}
        answer={<p>As duas expressões coincidem: <M>{'1{,}875\\cos(8t+2{,}5)=-1{,}5\\cos 8t-1{,}125\\sen 8t'}</M>.</p>}>
        <p>Inverta <M>{String.raw`X(s)=\dfrac{150}{s(s^2+12s+100)}`}</M>.</p>
      </Exercise>
      <Exercise id="t-lap-3" src={{ p: [34, 35] }} num="3" topic="Raízes múltiplas"
        steps={[
          { title: 'Expansão', body: <MM>{String.raw`\frac{8}{s(s+2)^3}=\frac{C_1}{s}+\frac{D_0}{(s+2)^3}+\frac{D_1}{(s+2)^2}+\frac{D_2}{s+2}`}</MM> },
          { title: 'Coeficientes', body: <MM>{String.raw`C_1=\frac{8}{8}=1,\quad D_0=\frac{8}{s}\Big|_{-2}=-4,\quad D_1=\frac{d}{ds}\frac{8}{s}\Big|_{-2}=-\frac{8}{s^2}\Big|_{-2}=-2,\quad D_2=\frac12\frac{d}{ds}\left(-\frac{8}{s^2}\right)\Big|_{-2}=\frac12\cdot\frac{16}{s^3}\Big|_{-2}=-1`}</MM> },
        ]}
        answer={<MM>{String.raw`x(t)=1-4\tfrac{t^2}{2}e^{-2t}-2te^{-2t}-e^{-2t}=1-2t^2e^{-2t}-2te^{-2t}-e^{-2t},\quad t\ge0`}</MM>}>
        <p>Inverta <M>{String.raw`X(s)=\dfrac{8}{s(s+2)^3}`}</M>.</p>
      </Exercise>
    </>
  )
}
