import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import Exercise from '../../components/Exercise.jsx'
import Plot, { sample } from '../../components/Plot.jsx'

export default function MetodoClassico() {
  const ex1 = sample((t) => 4 - 10 * Math.exp(-2 * t) + 7 * Math.exp(-3 * t), 0, 4, 300)
  return (
    <>
      <p>No método clássico a solução é dividida em duas partes, <M>{'y(t)=y_h(t)+y_p(t)'}</M>: a solução homogênea <M>{'y_h'}</M> (resposta com <M>u=0</M>, que reúne todas as soluções da equação homogênea) e a solução particular <M>{'y_p'}</M>, que depende da forma da entrada.</p>

      <h2>Solução homogênea<Slide p={[7, 17]} /></h2>
      <p>Tenta-se <M>{'y=e^{st}'}</M>. Como <M>{'\\frac{d^k}{dt^k}e^{st}=s^ke^{st}'}</M>, a equação homogênea vira <M>{'A(s)e^{st}=0'}</M>, em que</p>
      <MM>{String.raw`A(s)=s^n+a_1s^{n-1}+\dots+a_{n-1}s+a_n\quad\text{(polinômio característico)}`}</MM>
      <p>e as raízes <M>{'p_1,\\dots,p_n'}</M> da equação característica <M>{'A(s)=0'}</M> definem a forma de <M>{'y_h'}</M>:</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Raízes de A(s)</th><th>Termos em y<sub>h</sub>(t)</th><th>Exemplo dos slides</th></tr></thead>
        <tbody>
          <tr><td>reais e distintas</td><td><M>{'e^{p_it}'}</M></td><td><M>{'\\ddot y+5\\dot y+6y=0'}</M>: <M>{'y_h=C_1e^{-2t}+C_2e^{-3t}'}</M></td></tr>
          <tr><td>raiz <M>{'p_i'}</M> de multiplicidade <M>{'m_i'}</M></td><td><M>{'e^{p_it},\\ te^{p_it},\\ \\dots,\\ t^{m_i-1}e^{p_it}'}</M></td><td><M>{'\\ddot y+4\\dot y+4y=0'}</M>: <M>{'y_h=D_0te^{-2t}+D_1e^{-2t}'}</M></td></tr>
          <tr><td>complexas <M>{'\\alpha\\pm j\\beta'}</M></td><td><M>{'C_1e^{\\alpha t}\\sen\\beta t+C_2e^{\\alpha t}\\cos\\beta t'}</M></td><td><M>{'\\ddot y+4\\dot y+13y=0'}</M>: <M>{'y_h=C_1e^{-2t}\\sen 3t+C_2e^{-2t}\\cos 3t'}</M></td></tr>
        </tbody></table></div>
      <p>No caso da raiz dupla, testando <M>{'y=te^{st}'}</M> obtém-se <M>{'(2s+4)e^{st}+(s^2+4s+4)te^{st}=0'}</M>, satisfeita para <M>{'s=-2'}</M>: por isso o termo <M>{'te^{-2t}'}</M> também é solução.</p>

      <h2>Solução particular<Slide p={[19, 22]} /></h2>
      <p>Tenta-se uma função com a mesma forma da entrada (entradas a partir de <M>t=0</M>):</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>u(t)</th><th>tentativa para y<sub>p</sub>(t)</th></tr></thead>
        <tbody>
          <tr><td><M>K</M> (constante)</td><td><M>{'\\beta'}</M> (constante)</td></tr>
          <tr><td><M>{'e^{at}'}</M></td><td><M>{'\\beta e^{at}'}</M></td></tr>
          <tr><td><M>{'t^me^{at}'}</M></td><td><M>{'(\\beta_mt^m+\\beta_{m-1}t^{m-1}+\\dots+\\beta_1t+\\beta_0)e^{at}'}</M></td></tr>
          <tr><td><M>{'\\cos(\\omega t+\\theta)'}</M></td><td><M>{'\\beta\\cos(\\omega t+\\phi)'}</M></td></tr>
          <tr><td><M>{'e^{at}\\cos(\\omega t+\\theta)'}</M></td><td><M>{'\\beta e^{at}\\cos(\\omega t+\\phi)'}</M></td></tr>
          <tr><td><M>{'te^{at}\\cos(\\omega t+\\theta)'}</M></td><td><M>{'\\beta_0te^{at}\\cos(\\omega t+\\phi_0)+\\beta_1e^{at}\\cos(\\omega t+\\phi_1)'}</M></td></tr>
        </tbody></table></div>
      <div className="warn"><span className="tag">Atenção</span>A tabela só vale se <M>{'y_h'}</M> não contém termos da forma da entrada. Se contém (por exemplo, entrada <M>{'e^{-t}'}</M> e raiz característica −1), multiplica-se a tentativa por <M>t</M> — é o efeito de "ressonância" que aparece na questão 10 da Lista 1.</div>
      <p>Exemplos dos slides:</p>
      <ul>
        <li><M>{'\\ddot y+5\\dot y+6y=12u,\\ u=2'}</M>: <M>{'y_p=\\beta\\Rightarrow 6\\beta=24\\Rightarrow y_p=4'}</M>.</li>
        <li><M>{'\\ddot y+4\\dot y+4y=2\\dot u+8u,\\ u=e^{3t}'}</M>: <M>{'(9+12+4)\\beta e^{3t}=(6+8)e^{3t}\\Rightarrow\\beta=14/25=0{,}56'}</M>.</li>
        <li><M>{'\\ddot y+4\\dot y+13y=18u,\\ u=e^{t}'}</M>: <M>{'(1+4+13)\\beta=18\\Rightarrow y_p=e^{t}'}</M>.</li>
      </ul>

      <h2>Solução total<Slide p={24} /></h2>
      <Callout tag="Roteiro">
        <ol style={{ margin: 0 }}>
          <li>Raízes de <M>A(s)</M> ⇒ forma de <M>{'y_h'}</M> com constantes livres.</li>
          <li>Forma da entrada ⇒ <M>{'y_p'}</M> (coeficientes por substituição).</li>
          <li><M>{'y=y_p+y_h'}</M>; as <M>n</M> constantes saem de <M>{'y(0),\\dot y(0),\\dots,y^{(n-1)}(0)'}</M>.</li>
        </ol>
      </Callout>

      <Exercise id="t-mc-1" src={{ p: 25 }} num="1" topic="Slides, aula 5 — raízes reais distintas"
        steps={[
          { title: 'Homogênea', body: <p><M>{'s^2+5s+6=(s+2)(s+3)'}</M> ⇒ <M>{'y_h=C_1e^{-2t}+C_2e^{-3t}'}</M>.</p> },
          { title: 'Particular', body: <p>Entrada constante: <M>{'6\\beta=12\\cdot 2'}</M> ⇒ <M>{'y_p=4'}</M>.</p> },
          { title: 'Condições iniciais', body: <MM>{String.raw`\begin{cases}y(0)=1:&4+C_1+C_2=1\\ \dot y(0)=-1:&-2C_1-3C_2=-1\end{cases}\ \Rightarrow\ C_1=-10,\ C_2=7`}</MM> },
        ]}
        answer={<><MM>{'y(t)=4-10e^{-2t}+7e^{-3t},\\quad t\\ge0'}</MM><Plot height={160} xRange={[0, 4]} series={[{ ...ex1, color: 'var(--pen)' }]} yLabel="y(t)" /></>}>
        <p>Resolva <M>{'\\ddot y+5\\dot y+6y=12u(t)'}</M>, com <M>{'u(t)=2,\\ t\\ge0'}</M>, <M>{'y(0)=1'}</M> e <M>{'\\dot y(0)=-1'}</M>.</p>
      </Exercise>

      <Exercise id="t-mc-2" src={{ p: 26 }} num="2" topic="Slides, aula 5 — raiz dupla"
        steps={[
          { title: 'Homogênea', body: <p><M>{'(s+2)^2'}</M> ⇒ <M>{'y_h=D_0te^{-2t}+D_1e^{-2t}'}</M>.</p> },
          { title: 'Particular', body: <p><M>{'y_p=0{,}56e^{3t}'}</M> (calculada acima).</p> },
          { title: 'y(0) = −1', body: <p><M>{'-1=0{,}56+D_1\\Rightarrow D_1=-1{,}56'}</M>.</p> },
          { title: 'ẏ(0) = 1', body: <p><M>{'\\dot y=1{,}68e^{3t}+D_0(1-2t)e^{-2t}-2D_1e^{-2t}'}</M> ⇒ <M>{'1=1{,}68+D_0+3{,}12\\Rightarrow D_0=-3{,}8'}</M>.</p> },
        ]}
        answer={<MM>{'y(t)=0{,}56e^{3t}-3{,}8te^{-2t}-1{,}56e^{-2t},\\quad t\\ge0'}</MM>}>
        <p>Resolva <M>{'\\ddot y+4\\dot y+4y=2\\dot u+8u'}</M>, com <M>{'u(t)=e^{3t}'}</M>, <M>{'y(0)=-1'}</M>, <M>{'\\dot y(0)=1'}</M>.</p>
      </Exercise>

      <Exercise id="t-mc-3" src={{ p: [27, 28] }} num="3" topic="Slides, aula 5 — raízes complexas"
        steps={[
          { title: 'Forma da solução', body: <MM>{'y(t)=e^{t}+C_1e^{-2t}\\sen 3t+C_2e^{-2t}\\cos 3t'}</MM> },
          { title: 'y(0) = 0', body: <p><M>{'0=1+C_2\\Rightarrow C_2=-1'}</M>.</p> },
          { title: 'ẏ(0) = 0', body: <><MM>{String.raw`\dot y=e^t+C_1e^{-2t}(3\cos 3t-2\sen 3t)+C_2e^{-2t}(-3\sen 3t-2\cos 3t)`}</MM><p><M>{'0=1+3C_1-2C_2=1+3C_1+2\\Rightarrow C_1=-1'}</M>.</p></> },
        ]}
        answer={<MM>{'y(t)=e^{t}-e^{-2t}\\sen 3t-e^{-2t}\\cos 3t,\\quad t\\ge0'}</MM>}>
        <p>Resolva <M>{'\\ddot y+4\\dot y+13y=18u'}</M>, com <M>{'u(t)=e^{t}'}</M>, <M>{'y(0)=0'}</M>, <M>{'\\dot y(0)=0'}</M>.</p>
      </Exercise>
    </>
  )
}
