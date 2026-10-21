import { M, MM } from '../../components/Tex.jsx'
import { RSec, Passos, Check, Usos } from '../../components/Review.jsx'
import { SimSlot } from '../../sims/registry.jsx'

export function Complexos() {
  return (
    <>
      <Usos>Polos complexos <M>{'\\alpha\\pm j\\beta'}</M>, resíduos das frações parciais, a variável <M>{'s=\\sigma+j\\omega'}</M> e o ângulo correto com atan2.</Usos>
      <RSec title="Formas retangular e polar">
        <p>Em engenharia usa-se <M>j</M> (<M>{'j^2=-1'}</M>) para não confundir com corrente.</p>
        <MM>{String.raw`z=a+jb=r\,e^{j\theta},\qquad r=|z|=\sqrt{a^2+b^2},\qquad \theta=\angle z=\operatorname{atan2}(b,a),\qquad a=r\cos\theta,\ b=r\operatorname{sen}\theta`}</MM>
        <div className="warn"><span className="tag">atan2 × arctan</span><M>{'\\arctan(b/a)'}</M> só devolve ângulos entre −90° e 90°. Se <M>{'a<0'}</M>, some (ou subtraia) <M>{'\\pi'}</M>. O atan2 já faz isso olhando os sinais de <M>a</M> e <M>b</M>.</div>
      </RSec>
      <RSec title="Operações">
        <ul>
          <li><b>Soma</b>: <M>{'(a+jb)+(c+jd)=(a+c)+j(b+d)'}</M>.</li>
          <li><b>Produto</b>: distributiva com <M>{'j^2=-1'}</M>: <M>{'(a+jb)(c+jd)=(ac-bd)+j(ad+bc)'}</M>. Na polar: <b>módulos multiplicam, ângulos somam</b>.</li>
          <li><b>Conjugado</b>: <M>{'\\bar z=a-jb'}</M>; <M>{'z\\bar z=a^2+b^2'}</M>.</li>
          <li><b>Divisão</b>: multiplique em cima e embaixo pelo conjugado do denominador. Na polar: módulos dividem, ângulos subtraem.</li>
        </ul>
      </RSec>
      <RSec title="Exemplo do slide: resíduo complexo">
        <Passos titulo="C₂ = 150 / [(−6 + j8)(j16)] (slides 6, p. 31)" steps={[
          { title: 'Produto do denominador', body: <MM>{String.raw`(-6+j8)(j16)=-96j+128j^2=-128-96j`}</MM> },
          { title: 'Multiplicar pelo conjugado', body: <MM>{String.raw`\frac{150}{-128-96j}\cdot\frac{-128+96j}{-128+96j}=\frac{150(-128+96j)}{128^2+96^2}=\frac{-19\,200+14\,400j}{25\,600}`}</MM> },
          { title: 'Simplificar', body: <MM>{String.raw`C_2=-0{,}75+j0{,}5625`}</MM> },
          { title: 'Forma polar', body: <><MM>{String.raw`|C_2|=\sqrt{0{,}75^2+0{,}5625^2}=0{,}9375,\qquad \angle C_2=\operatorname{atan2}(0{,}5625;\,-0{,}75)=\pi-0{,}6435=2{,}498`}</MM><p>O ponto está no 2º quadrante (real negativo, imaginário positivo).</p></> },
        ]} resposta={<p><M>{'C_2=-0{,}75+j0{,}5625=0{,}9375\\,e^{j2{,}5}'}</M>, como no slide.</p>} />
      </RSec>
      <SimSlot name="complexo" />
      <Check q={<>Quanto vale <M>{'\\frac{1+j}{1-j}'}</M>?</>}><p><M>{'\\frac{(1+j)(1+j)}{(1-j)(1+j)}=\\frac{1+2j+j^2}{2}=\\frac{2j}{2}=j'}</M>. Na polar: <M>{'\\frac{\\sqrt2\\,e^{j\\pi/4}}{\\sqrt2\\,e^{-j\\pi/4}}=e^{j\\pi/2}=j'}</M>.</p></Check>
    </>
  )
}

export function Euler() {
  return (
    <>
      <Usos>A resposta de SLIT a <M>{'e^{st}'}</M>, as transformadas de seno e cosseno, e o motivo de polos complexos gerarem senoides amortecidas.</Usos>
      <RSec title="A fórmula">
        <MM>{String.raw`e^{j\theta}=\cos\theta+j\operatorname{sen}\theta\qquad\Rightarrow\qquad \cos\theta=\frac{e^{j\theta}+e^{-j\theta}}{2},\qquad \operatorname{sen}\theta=\frac{e^{j\theta}-e^{-j\theta}}{2j}`}</MM>
        <p><M>{'e^{j\\theta}'}</M> é o ponto do círculo de raio 1 no ângulo <M>{'\\theta'}</M>. Com <M>{'s=\\alpha+j\\beta'}</M>:</p>
        <MM>{String.raw`e^{st}=e^{\alpha t}e^{j\beta t}=e^{\alpha t}\left(\cos\beta t+j\operatorname{sen}\beta t\right)`}</MM>
        <p>A parte real <M>{'\\alpha'}</M> controla o crescimento ou decaimento; a parte imaginária <M>{'\\beta'}</M>, a rotação (oscilação).</p>
      </RSec>
      <RSec title="Por que o par conjugado dá um sinal real">
        <p>Os termos de um par de polos têm resíduos conjugados, e a soma de um número com seu conjugado é real:</p>
        <MM>{String.raw`Ce^{pt}+\bar C e^{\bar pt}=2\,\Re\{Ce^{pt}\}=2|C|e^{\alpha t}\cos(\beta t+\angle C)`}</MM>
      </RSec>
      <RSec title="Transformada do cosseno via Euler">
        <Passos titulo="𝓛{cos ω₀t}" steps={[
          { title: 'Escrever com exponenciais', body: <MM>{String.raw`\cos\omega_0t=\tfrac12e^{j\omega_0t}+\tfrac12e^{-j\omega_0t}`}</MM> },
          { title: 'Transformar cada uma (tabela de e^{at})', body: <MM>{String.raw`\tfrac12\cdot\frac{1}{s-j\omega_0}+\tfrac12\cdot\frac{1}{s+j\omega_0}`}</MM> },
          { title: 'Somar as frações', body: <MM>{String.raw`\frac12\cdot\frac{(s+j\omega_0)+(s-j\omega_0)}{s^2+\omega_0^2}=\frac{s}{s^2+\omega_0^2}`}</MM> },
        ]} resposta={<M>{'\\mathcal L\\{\\cos\\omega_0t\\}=\\frac{s}{s^2+\\omega_0^2}'}</M>} />
      </RSec>
      <SimSlot name="helice" />
      <Check q={<>Quanto vale <M>{'e^{j\\pi}'}</M>?</>}><p><M>{'\\cos\\pi+j\\operatorname{sen}\\pi=-1'}</M>.</p></Check>
    </>
  )
}
