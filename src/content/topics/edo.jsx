import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'

export default function Edo() {
  return (
    <>
      <p>A modelagem fenomenológica — aplicar leis físicas a cada componente e às interconexões — em geral resulta em equações diferenciais. Esta aula mostra três exemplos dos slides e a forma geral da EDO linear que representa um SLIT.</p>

      <h2>Exemplos físicos</h2>
      <h3>Circuito RLC paralelo<Slide p={4} /></h3>
      <p>Com <M>v(t)</M> a tensão comum aos componentes e <M>y(t)</M> a corrente no indutor, a lei dos nós dá</p>
      <MM>{String.raw`u(t)=\frac{v(t)}{R}+y(t)+C\frac{dv(t)}{dt},\qquad v(t)=L\frac{dy(t)}{dt}\ \ \Rightarrow\ \ LC\frac{d^2y}{dt^2}+\frac{L}{R}\frac{dy}{dt}+y=u(t)`}</MM>
      <h3>Massa–mola–amortecedor<Slide p={5} /></h3>
      <p>Com <M>u(t)</M> a força externa e <M>y(t)</M> o deslocamento, a segunda lei de Newton dá</p>
      <MM>{String.raw`u(t)-b\frac{dy(t)}{dt}-ky(t)=m\frac{d^2y(t)}{dt^2}`}</MM>
      <h3>Nível de líquido em um tanque<Slide p={[6, 7]} /></h3>
      <p>Com <M>u(t)</M> a vazão de entrada, <M>y(t)</M> o nível, <M>A</M> a área do tanque e <M>a</M> a área do orifício, a vazão de saída vem de Bernoulli, <M>{String.raw`q_{out}=a\sqrt{2gy}`}</M>, e a conservação de massa dá</p>
      <MM>{String.raw`A\frac{dy(t)}{dt}=u(t)-a\sqrt{2gy(t)}\qquad\text{(EDO não linear)}`}</MM>
      <p>Esse modelo será linearizado na Unidade 2.</p>

      <Callout tag="O que os exemplos ensinam">
        <ul style={{ margin: 0 }}>
          <li>As leis físicas relacionam entrada, saída e variáveis internas.</li>
          <li>A <b>ordem da EDO</b> está associada ao número de elementos armazenadores de energia ou massa (capacitor e indutor; massa e mola; volume do tanque).</li>
          <li>As <b>condições iniciais</b> representam a memória do sistema dinâmico.</li>
        </ul>
      </Callout>

      <SimSlot name="circuito" initialMode="RLC" title="Circuito RLC série em 3D (equivalente elétrico do massa–mola)" />

      <h2>Forma geral<Slide p={10} /></h2>
      <MM>{String.raw`\frac{d^ny}{dt^n}+a_1\frac{d^{n-1}y}{dt^{n-1}}+\dots+a_{n-1}\frac{dy}{dt}+a_ny=b_0\frac{d^mu}{dt^m}+b_1\frac{d^{m-1}u}{dt^{m-1}}+\dots+b_{m-1}\frac{du}{dt}+b_mu`}</MM>
      <ul>
        <li>Para sistemas causais, <M>{'n\\ge m'}</M>.</li>
        <li>Coeficientes fixos ⇒ sistema invariante no tempo; coeficientes que dependem explicitamente de <M>t</M> ⇒ variante.</li>
        <li>EDOs lineares são modelos de sistemas lineares.</li>
      </ul>

      <h2>Calculando a resposta<Slide p={[11, 13]} /></h2>
      <p>Dada a entrada para <M>{'t\\ge0'}</M> e as condições iniciais, a EDO determina <M>y(t)</M>. Há dois caminhos no curso:</p>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Método clássico</th><th>Transformada de Laplace</th></tr></thead>
        <tbody><tr><td>solução homogênea + solução particular; condições iniciais aplicadas no final</td><td>método algébrico; as condições iniciais entram na própria transformação</td></tr></tbody></table></div>
      <p>Exemplo dos slides: <M>{'\\ddot y+4\\dot y+3y=6,\\ y(0)=1,\\ \\dot y(0)=-1'}</M>. O polinômio característico <M>{'r^2+4r+3'}</M> tem raízes −1 e −3, a solução particular para o degrau é constante, e aplicando as condições iniciais:</p>
      <MM>{String.raw`y(t)=2-2e^{-t}+e^{-3t},\quad t\ge 0`}</MM>
      <p>O próximo tópico detalha cada passo.</p>

      <SimSlot name="massamola" />
      <div className="note"><span className="tag">Comandos para estudo (slides)<Slide p={19} /></span>
        <ol style={{ margin: 0 }}>
          <li>Simule o circuito RLC para diferentes valores de R, L e C.</li>
          <li>Compare a resposta do massa–mola para amortecimento baixo, crítico e elevado (<M>{'b < 2\\sqrt{km}'}</M>, <M>{'b=2\\sqrt{km}'}</M>, <M>{'b>2\\sqrt{km}'}</M>).</li>
          <li>Altere as condições iniciais e observe como a memória do sistema afeta a resposta transitória.</li>
        </ol>
      </div>
    </>
  )
}
