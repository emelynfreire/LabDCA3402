import { M, MM } from '../../components/Tex.jsx'
import { RSec, Passos, Check, Usos } from '../../components/Review.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Plot, { sample } from '../../components/Plot.jsx'

export function Derivadas() {
  return (
    <>
      <Usos>Aplicar <M>{'\\dot y(0)'}</M> no método clássico, os coeficientes <M>{'D_k'}</M> das raízes múltiplas, o polinômio auxiliar <M>{'dP/ds'}</M> de Routh, a linearização e a modelagem (velocidade, corrente no capacitor).</Usos>
      <RSec title="Tabela e regras">
        <div className="tbl-wrap"><table className="tbl small">
          <tbody>
            <tr><td><M>{'\\frac{d}{dt}t^n=nt^{n-1}'}</M></td><td><M>{'\\frac{d}{dt}e^{at}=ae^{at}'}</M></td><td><M>{'\\frac{d}{dt}\\operatorname{sen}\\omega t=\\omega\\cos\\omega t'}</M></td><td><M>{'\\frac{d}{dt}\\cos\\omega t=-\\omega\\operatorname{sen}\\omega t'}</M></td></tr>
          </tbody></table></div>
        <MM>{String.raw`\text{produto: }(fg)'=f'g+fg' \qquad \text{quociente: }\left(\frac fg\right)'=\frac{f'g-fg'}{g^2} \qquad \text{cadeia: }\frac{d}{dt}f(g(t))=f'(g(t))\,g'(t)`}</MM>
      </RSec>
      <RSec title="Derivar uma solução para aplicar ẏ(0)">
        <Passos titulo="y = eᵗ + C₁e⁻²ᵗ sen 3t + C₂e⁻²ᵗ cos 3t (slides 5, p. 28)" steps={[
          { title: 'Regra do produto no 2º termo', body: <MM>{String.raw`\frac{d}{dt}\left(e^{-2t}\operatorname{sen}3t\right)=-2e^{-2t}\operatorname{sen}3t+e^{-2t}\cdot3\cos3t=e^{-2t}(3\cos3t-2\operatorname{sen}3t)`}</MM> },
          { title: 'Idem no 3º termo', body: <MM>{String.raw`\frac{d}{dt}\left(e^{-2t}\cos3t\right)=e^{-2t}(-3\operatorname{sen}3t-2\cos3t)`}</MM> },
          { title: 'Avaliar em t = 0', body: <p><M>{'e^0=1,\\ \\operatorname{sen}0=0,\\ \\cos0=1'}</M> ⇒ <M>{'\\dot y(0)=1+3C_1-2C_2'}</M>.</p> },
        ]} resposta={<p>Com <M>{'\\dot y(0)=0'}</M> e <M>{'C_2=-1'}</M>: <M>{'C_1=-1'}</M>.</p>} />
      </RSec>
      <RSec title="Derivar em s (raízes múltiplas)">
        <Passos titulo="D₁ de (−s² + 23)/[(s − 3)(s + 2)²] (slides 7, p. 9)" steps={[
          { title: 'Tirar o fator repetido', body: <p><M>{'(s+2)^2Y=\\frac{-s^2+23}{s-3}'}</M>.</p> },
          { title: 'Regra do quociente', body: <MM>{String.raw`\frac{d}{ds}\frac{-s^2+23}{s-3}=\frac{(-2s)(s-3)-(-s^2+23)(1)}{(s-3)^2}=\frac{-s^2+6s-23}{(s-3)^2}`}</MM> },
          { title: 'Avaliar em s = −2', body: <MM>{String.raw`\frac{-4-12-23}{25}=-\frac{39}{25}=-1{,}56`}</MM> },
        ]} resposta={<M>{'D_1=-1{,}56'}</M>} />
      </RSec>
      <Check q={<>Derive <M>{'te^{-t}'}</M>.</>}><p>Produto: <M>{'e^{-t}+t(-e^{-t})=(1-t)e^{-t}'}</M>. Zera em <M>t=1</M>: é onde a resposta da Lista 1, questão 10, atinge o pico.</p></Check>
    </>
  )
}

export function Integrais() {
  const area = sample((t) => Math.exp(-t), 0, 4, 200)
  return (
    <>
      <Usos>Integral de convolução, definição da Transformada de Laplace, estabilidade BIBO (<M>{'\\int|g|\\,dt<\\infty'}</M>) e modelagem (tensão no capacitor, volume no tanque).</Usos>
      <RSec title="As integrais que mais aparecem">
        <MM>{String.raw`\int e^{at}dt=\frac{e^{at}}{a}+K\qquad \int_0^t e^{a\tau}d\tau=\frac{e^{at}-1}{a}\qquad \int_0^\infty e^{-st}dt=\frac1s\ \ (\Re\{s\}>0)`}</MM>
        <p>A última é uma integral imprópria: <M>{String.raw`\lim_{T\to\infty}\frac{1-e^{-sT}}{s}=\frac1s`}</M>, pois <M>{'e^{-sT}\\to0'}</M> quando a parte real de <M>s</M> é positiva. É assim que se obtém <M>{'\\mathcal L\\{1\\}=1/s'}</M>.</p>
        <Plot height={150} xRange={[0, 4]} series={[{ ...area, color: 'var(--pen)', fill: 'var(--pen)', fillOpacity: 0.2, label: 'área sob e^(−t) de 0 a ∞ = 1' }]} />
      </RSec>
      <RSec title="Variável de integração × variável fixa (convolução)">
        <Passos titulo="y(t) = ∫₀ᵗ e^{−2(t−τ)} dτ (Lista 1, questão 8)" steps={[
          { title: 'Quem varia?', body: <p>Dentro da integral, <M>{'\\tau'}</M> varia de 0 a <M>t</M>; o <M>t</M> é fixo, como uma constante.</p> },
          { title: 'Separar a exponencial', body: <p><M>{'e^{-2(t-\\tau)}=e^{-2t}e^{2\\tau}'}</M>, e <M>{'e^{-2t}'}</M> sai da integral.</p> },
          { title: 'Integrar em τ', body: <MM>{String.raw`e^{-2t}\int_0^te^{2\tau}d\tau=e^{-2t}\cdot\frac{e^{2t}-1}{2}=\frac{1-e^{-2t}}{2}`}</MM> },
        ]} resposta={<M>{'y(t)=\\tfrac12(1-e^{-2t})'}</M>} />
      </RSec>
      <RSec title="Integração por partes">
        <MM>{String.raw`\int u\,dv=uv-\int v\,du`}</MM>
        <p>Ex.: <M>{String.raw`\mathcal L\{t\}=\int_0^\infty te^{-st}dt`}</M>. Com <M>u=t</M>, <M>{'dv=e^{-st}dt'}</M>: <M>{String.raw`\left[-\frac{t}{s}e^{-st}\right]_0^\infty+\frac1s\int_0^\infty e^{-st}dt=0+\frac{1}{s^2}`}</M>.</p>
      </RSec>
      <Check q={<>Quanto vale <M>{'\\int_0^2e^{-t}dt'}</M>?</>}><p><M>{'[-e^{-t}]_0^2=1-e^{-2}\\approx0{,}865'}</M>.</p></Check>
    </>
  )
}

export function Limites() {
  return (
    <>
      <Usos>Teoremas do valor inicial e final, o <M>{'\\varepsilon\\to0^+'}</M> da tabela de Routh, saber se um modo decai e a definição da Transformada de Laplace.</Usos>
      <RSec title="Valor final: limite com s → 0">
        <p>Para <M>{'Y(s)=\\frac{6}{s(s^2+5s+3)}'}</M>: <M>{'sY(s)=\\frac{6}{s^2+5s+3}\\xrightarrow{s\\to0}\\frac63=2'}</M>. Primeiro cancele o <M>s</M>, depois substitua.</p>
        <div className="warn"><span className="tag">Cuidado</span>O teorema só vale se <M>y(t)</M> tem limite. Na Lista 1, questão 16, <M>{'Y=\\frac{8}{s(s^2+4)}'}</M> daria <M>{'\\lim sY=2'}</M>, mas <M>{'y=2-2\\cos2t'}</M> oscila para sempre: os polos <M>{'\\pm j2'}</M> estão no eixo imaginário. Confira antes se todos os polos de <M>{'sY(s)'}</M> têm parte real negativa.</div>
      </RSec>
      <RSec title="Valor inicial: limite com s → ∞">
        <p>Divida numerador e denominador pela maior potência de <M>s</M>. Para uma função de transferência estritamente própria e entrada degrau, <M>{'y(0^+)=\\lim_{s\\to\\infty}G(s)=0'}</M>.</p>
      </RSec>
      <RSec title="Limites com ε (Routh, caso especial 1)">
        <p><M>{String.raw`\frac{6\varepsilon-9}{\varepsilon}=6-\frac{9}{\varepsilon}\xrightarrow{\varepsilon\to0^+}-\infty`}</M>: o sinal é o que importa (aqui, negativo).</p>
      </RSec>
      <RSec title="Exponencial ganha de polinômio">
        <p><M>{'t^ke^{-at}\\to0'}</M> para qualquer <M>k</M> se <M>{'a>0'}</M>. Por isso <M>{'te^{-t}'}</M> (polo duplo) ainda decai, enquanto <M>{'t\\operatorname{sen}2t'}</M> (polo duplo no eixo imaginário) cresce.</p>
      </RSec>
      <Check q={<>Valor final da resposta ao degrau de <M>{'\\frac{10}{(s+1)(s^2+4s+13)}'}</M>?</>}><p><M>{'\\lim_{s\\to0}s\\cdot\\frac{10}{s(s+1)(s^2+4s+13)}=\\frac{10}{13}'}</M>. Vale porque todos os polos estão no semiplano esquerdo.</p></Check>
    </>
  )
}

export function Taylor() {
  return (
    <>
      <Usos>Linearização de sistemas: tanque, pêndulo, qualquer modelo não linear perto de um ponto de operação.</Usos>
      <RSec title="Uma variável">
        <MM>{String.raw`f(x)\approx f(a)+f'(a)(x-a)+\frac{f''(a)}{2}(x-a)^2+\dots`}</MM>
        <p>A linearização fica só com os dois primeiros termos: a reta tangente. Exemplos: <M>{'\\operatorname{sen}\\theta\\approx\\theta'}</M> perto de 0; <M>{'e^x\\approx1+x'}</M>; <M>{'\\sqrt x\\approx\\sqrt a+\\frac{x-a}{2\\sqrt a}'}</M>.</p>
      </RSec>
      <RSec title="Duas variáveis: derivadas parciais">
        <p><M>{'\\partial f/\\partial y'}</M> é a derivada em relação a <M>y</M> tratando <M>u</M> como constante (e vice-versa).</p>
        <MM>{String.raw`f(y,u)\approx f(\bar y,\bar u)+\frac{\partial f}{\partial y}\Big|_{(\bar y,\bar u)}\delta y+\frac{\partial f}{\partial u}\Big|_{(\bar y,\bar u)}\delta u`}</MM>
        <Passos titulo="Tanque: f(y, u) = (u − a√(2gy))/A, com A = 15, a = 0,2, g = 1000, ȳ = 20" steps={[
          { title: 'Derivada em y (u constante)', body: <MM>{String.raw`\frac{\partial f}{\partial y}=\frac1A\cdot\left(-a\sqrt{2g}\cdot\frac{1}{2\sqrt y}\right)=-\frac{a\sqrt{2g}}{2A\sqrt y}`}</MM> },
          { title: 'Números', body: <MM>{String.raw`a\sqrt{2g}=0{,}2\sqrt{2000}=8{,}944;\qquad -\frac{8{,}944}{2\cdot15\cdot\sqrt{20}}=-\frac{8{,}944}{134{,}2}=-0{,}0667`}</MM> },
          { title: 'Derivada em u', body: <p><M>{'\\partial f/\\partial u=1/A=0{,}0667'}</M>.</p> },
        ]} resposta={<p><M>{'\\delta\\dot y=-0{,}0667\\,\\delta y+0{,}0667\\,\\delta u'}</M> ⇒ <M>{'\\frac{\\delta Y}{\\delta U}=\\frac{1}{15s+1}'}</M>.</p>} />
      </RSec>
      <SimSlot name="taylor" />
      <Check q={<>Aproxime <M>{'\\sqrt{4{,}4}'}</M> pela reta tangente em <M>a=4</M>.</>}><p><M>{'2+\\frac{0{,}4}{4}=2{,}1'}</M> (valor exato 2,0976).</p></Check>
    </>
  )
}

export function EdoBasico() {
  return (
    <>
      <Usos>Toda a Unidade 1 e a modelagem da Unidade 3: os modelos dos sistemas físicos são EDOs.</Usos>
      <RSec title="O que é">
        <p>Uma equação diferencial ordinária relaciona uma função <M>y(t)</M> com suas derivadas. A <b>ordem</b> é a maior derivada que aparece. A solução não é um número, é uma <b>função</b>. Para fixá-la, uma EDO de ordem <M>n</M> precisa de <M>n</M> condições iniciais: <M>{'y(0),\\dot y(0),\\dots,y^{(n-1)}(0)'}</M>.</p>
        <p><b>Linear com coeficientes constantes</b>: <M>y</M> e suas derivadas aparecem só multiplicadas por números (sem <M>{'y^2'}</M>, <M>{'\\sqrt y'}</M>, <M>{'\\operatorname{sen}y'}</M>, nem coeficientes dependentes de <M>t</M>).</p>
      </RSec>
      <RSec title="Conferir uma solução">
        <p>Substitua na equação. Para <M>{'\\dot y+y=1'}</M> e <M>{'y=1-e^{-t}'}</M>: <M>{'\\dot y=e^{-t}'}</M>, e <M>{'e^{-t}+1-e^{-t}=1'}</M> ✓. Também <M>{'y(0)=0'}</M>.</p>
      </RSec>
      <RSec title="Por que tentar y = e^{st}">
        <p>Toda derivada de <M>{'e^{st}'}</M> é ela mesma vezes <M>s</M>: <M>{'\\frac{d^k}{dt^k}e^{st}=s^ke^{st}'}</M>. Substituindo, cada derivada vira uma potência de <M>s</M> e a EDO vira um polinômio:</p>
        <MM>{String.raw`\ddot y+5\dot y+6y=0\ \xrightarrow{\ y=e^{st}\ }\ (s^2+5s+6)e^{st}=0\ \Rightarrow\ s=-2\ \text{ou}\ s=-3`}</MM>
      </RSec>
      <RSec title="O caso mais simples">
        <p><M>{'\\dot y=-ay'}</M>: a taxa de variação é proporcional ao valor. Solução: <M>{'y=y(0)e^{-at}'}</M>. Com <M>{'a>0'}</M> decai (estável); com <M>{'a<0'}</M> cresce.</p>
      </RSec>
      <Check q={<><M>{'y=e^{-2t}'}</M> é solução de <M>{'\\dot y+2y=0'}</M>?</>}><p>Sim: <M>{'-2e^{-2t}+2e^{-2t}=0'}</M>.</p></Check>
    </>
  )
}
