import { M, MM } from '../components/Tex.jsx'
import Exercise from '../components/Exercise.jsx'
import Plot, { sample } from '../components/Plot.jsx'
import { inverseLaplaceFn, polymul } from '../lib/poly.js'

const s = (title, body) => ({ title, body })

function Formulario() {
  return (
    <div className="note"><span className="tag">Formulário da lista</span>
      <p style={{ margin: '.2rem 0' }}>1ª ordem: <M>{String.raw`G=\frac{K}{Ts+1}`}</M>, polo <M>{'-1/T'}</M>, <M>{String.raw`y=K(1-e^{-t/T})`}</M>, <M>{'t_{ss}=3T'}</M> (5%), <M>{'4T'}</M> (2%).</p>
      <p style={{ margin: '.2rem 0' }}>2ª ordem: <M>{String.raw`G=\frac{K\omega_n^2}{s^2+2\xi\omega_ns+\omega_n^2}`}</M>, polos <M>{String.raw`-\xi\omega_n\pm j\omega_d`}</M>, <M>{String.raw`\omega_d=\omega_n\sqrt{1-\xi^2}`}</M>; <M>{String.raw`M_p=e^{-\xi\pi/\sqrt{1-\xi^2}}`}</M>, <M>{String.raw`t_p=\pi/\omega_d`}</M>, <M>{String.raw`t_r=(\pi-\beta)/\omega_d`}</M>, <M>{String.raw`\beta=\arccos\xi`}</M>, <M>{String.raw`t_{ss}=3/(\xi\omega_n)`}</M> (5%), <M>{String.raw`4/(\xi\omega_n)`}</M> (2%).</p>
    </div>
  )
}

const step = (num, den, tEnd) => sample(inverseLaplaceFn(num, [...den, 0]), 0, tEnd, 500)

export default function Lista2() {
  const q2 = sample((t) => (t < 10 ? 25 : 25 + 10 * (1 - Math.exp(-(t - 10) / 5))), 0, 50, 400)
  const q3 = step([25], [1, 6, 25], 3)
  const g1 = step([24], polymul([1, 6], [1, 2, 4]), 7)
  const g1a = step([4], [1, 2, 4], 7)
  const g2 = step([6], polymul([1, 1.5], [1, 2, 4]), 7)
  return (
    <>
      <Formulario />

      <h2>Parte 1 — Sistemas de 1ª ordem</h2>
      <Exercise id="l2-1" src={{ file: 'lista-2.pdf', p: 1, label: 'enunciado: Lista 2, p. 1' }} num="1" topic="1ª ordem"
        steps={[
          s('Forma padrão', <p><M>{String.raw`G=\frac{4}{2s+1}`}</M> já está na forma <M>{String.raw`\frac{K}{Ts+1}`}</M>: <M>K=4</M>, <M>T=2</M> s; polo em <M>{'s=-1/T=-0{,}5'}</M>.</p>),
          s('Resposta ao degrau', <MM>{String.raw`Y(s)=\frac{4}{s(2s+1)}=\frac4s-\frac{4}{s+0{,}5}\ \Rightarrow\ y(t)=4\left(1-e^{-t/2}\right)`}</MM>),
          s('Valor final e estabilização', <p><M>{'y(\\infty)=4'}</M> (teorema do valor final: <M>{'\\lim_{s\\to0}sY=G(0)=4'}</M>). <M>{'t_{ss}=4T=8'}</M> s (2%); <M>{'3T=6'}</M> s (5%).</p>),
        ]}
        answer={<p>Ganho DC 4; polo −0,5; <M>T=2</M> s; <M>{'y=4(1-e^{-t/2})'}</M>; <M>{'y(\\infty)=4'}</M>; <M>{'t_{ss}'}</M> = 8 s (2%) e 6 s (5%).</p>}>
        <p>Para <M>{String.raw`G(s)=\frac{4}{2s+1}`}</M>: (a) ganho estático, polo e constante de tempo; (b) resposta ao degrau unitário; (c) valor final; (d) tempo de estabilização pelos critérios de 2% e 5%.</p>
      </Exercise>

      <Exercise id="l2-2" src={{ file: 'lista-2.pdf', p: 1, label: 'enunciado: Lista 2, p. 1' }} num="2" topic="Identificação de 1ª ordem a partir do gráfico"
        hint={<p>Trabalhe com as <b>variações</b>: ΔΘ e ΔV. A constante de tempo é medida a partir do instante do degrau.</p>}
        steps={[
          s('Ganho', <p><M>{String.raw`K=\frac{\Delta\Theta}{\Delta V}=\frac{35-25}{40-0}=0{,}25\ ^\circ\text{C/V}`}</M>.</p>),
          s('Constante de tempo', <p>63% da variação: <M>{'25+0{,}63\\cdot10=31{,}3\\,^\\circ\\text{C}'}</M>, lido em <M>{'t\\approx15'}</M> s. Como o degrau foi em <M>t=10</M> s, <M>{'T=15-10=5'}</M> s.</p>),
          s('Função de transferência', <MM>{String.raw`G(s)=\frac{\Theta(s)}{V(s)}=\frac{0{,}25}{5s+1}`}</MM>),
          s('Estabilização', <p><M>{'t_{ss}=4T=20'}</M> s após o degrau (no gráfico, em <M>{'t\\approx30'}</M> s).</p>),
        ]}
        answer={<><p>(a) <M>{String.raw`G=\frac{0{,}25}{5s+1}`}</M>; (b) 20 s.</p><Plot height={170} xRange={[0, 50]} yRange={[23, 37]} series={[{ ...q2, color: 'var(--pen)' }]} hLines={[{ y: 31.3 }, { y: 35 }]} vLines={[{ x: 15 }, { x: 30, color: 'var(--good)' }]} yLabel="Θ (°C)" /></>}>
        <p>Um chuveiro tem a temperatura controlada pela tensão na resistência. Aplicou-se um degrau de 0 V para 40 V em <M>t=10</M> s; a água parte de 25 °C e estabiliza em 35 °C, passando por 31,3 °C em <M>t=15</M> s. Considerando o sistema de 1ª ordem: (a) obtenha <M>{'G(s)=\\Theta(s)/V(s)'}</M>; (b) determine o tempo de estabilização (2%) após o degrau.</p>
      </Exercise>

      <h2>Parte 2 — Sistemas de 2ª ordem: caracterização</h2>
      <Exercise id="l2-3" src={{ file: 'lista-2.pdf', p: 2, label: 'enunciado: Lista 2, p. 2' }} num="3" topic="Parâmetros e especificações"
        steps={[
          s('Comparar com a forma canônica', <p><M>{'\\omega_n^2=25\\Rightarrow\\omega_n=5'}</M>; <M>{'2\\xi\\omega_n=6\\Rightarrow\\xi=0{,}6'}</M> ⇒ subamortecido.</p>),
          s('ωd e polos', <p><M>{String.raw`\omega_d=5\sqrt{1-0{,}36}=4`}</M>; polos <M>{'-\\xi\\omega_n\\pm j\\omega_d=-3\\pm j4'}</M>.</p>),
          s('Sobressinal e pico', <p><M>{String.raw`M_p=e^{-0{,}6\pi/0{,}8}=e^{-2{,}356}\approx9{,}5\%`}</M>; <M>{String.raw`t_p=\pi/4\approx0{,}785`}</M> s.</p>),
          s('Subida e estabilização', <p><M>{'\\beta=\\arccos0{,}6=0{,}927'}</M> rad ⇒ <M>{String.raw`t_r=\frac{\pi-0{,}927}{4}\approx0{,}554`}</M> s. <M>{String.raw`t_{ss}=\frac{4}{3}\approx1{,}33`}</M> s (2%).</p>),
        ]}
        answer={<><p><M>{'\\omega_n=5'}</M>, <M>{'\\xi=0{,}6'}</M>, <M>{'\\omega_d=4'}</M>, polos <M>{'-3\\pm j4'}</M>, subamortecido; <M>{'M_p\\approx9{,}5\\%'}</M>, <M>{'t_p\\approx0{,}785'}</M> s, <M>{'t_r\\approx0{,}554'}</M> s, <M>{'t_{ss}\\approx1{,}33'}</M> s.</p><Plot height={160} xRange={[0, 3]} series={[{ ...q3, color: 'var(--pen)' }]} hLines={[{ y: 1 }]} vLines={[{ x: 0.554, color: 'var(--pen)' }, { x: 0.785, color: 'var(--pole)' }]} yLabel="y(t)" /></>}>
        <p>Dado <M>{String.raw`G(s)=\frac{25}{s^2+6s+25}`}</M>, determine <M>{'\\omega_n'}</M>, <M>{'\\xi'}</M>, <M>{'\\omega_d'}</M>, os polos, a classificação e, para o degrau, <M>{'M_p'}</M>, <M>{'t_p'}</M>, <M>{'t_r'}</M> e <M>{'t_{ss}'}</M> (2%).</p>
      </Exercise>

      <Exercise id="l2-4" src={{ file: 'lista-2.pdf', p: 2, label: 'enunciado: Lista 2, p. 2' }} num="4" topic="Classificação pelo amortecimento"
        steps={[
          s('ωn comum', <p>Nos três, <M>{'\\omega_n^2=16\\Rightarrow\\omega_n=4'}</M>, e <M>{'\\xi=\\frac{\\text{coef. de }s}{2\\cdot4}'}</M>.</p>),
          s('(a)', <p><M>{'\\xi=10/8=1{,}25>1'}</M>: sobreamortecido; <M>{'s^2+10s+16=(s+2)(s+8)'}</M>.</p>),
          s('(b)', <p><M>{'\\xi=8/8=1'}</M>: criticamente amortecido; <M>{'(s+4)^2'}</M>.</p>),
          s('(c)', <p><M>{'\\xi=4/8=0{,}5'}</M>: subamortecido; <M>{String.raw`s=-2\pm j\sqrt{16-4}=-2\pm j2\sqrt3`}</M>.</p>),
        ]}
        answer={<p>(a) sobreamortecido, −2 e −8; (b) crítico, −4 (duplo); (c) subamortecido, <M>{'-2\\pm j2\\sqrt3'}</M>.</p>}>
        <p>Classifique e indique os polos: (a) <M>{String.raw`\frac{16}{s^2+10s+16}`}</M>; (b) <M>{String.raw`\frac{16}{s^2+8s+16}`}</M>; (c) <M>{String.raw`\frac{16}{s^2+4s+16}`}</M>.</p>
      </Exercise>

      <Exercise id="l2-5" src={{ file: 'lista-2.pdf', p: 2, label: 'enunciado: Lista 2, p. 2' }} num="5" topic="FT a partir dos polos"
        steps={[
          s('Denominador', <p><M>{'(s+2-j4)(s+2+j4)=(s+2)^2+16=s^2+4s+20'}</M>.</p>),
          s('Ganho unitário', <p>Sem zeros e <M>{'G(0)=1'}</M>: numerador 20 ⇒ <M>{String.raw`G=\frac{20}{s^2+4s+20}`}</M>.</p>),
          s('ωn e ξ', <p><M>{String.raw`\omega_n=\sqrt{20}=2\sqrt5\approx4{,}47`}</M>; <M>{String.raw`\xi=\frac{2}{\omega_n}=\frac1{\sqrt5}\approx0{,}447`}</M>.</p>),
          s('Especificações', <p><M>{'M_p\\approx20{,}8\\%'}</M>; <M>{'t_p=\\pi/\\omega_d=\\pi/4\\approx0{,}785'}</M> s (<M>{'\\omega_d'}</M> é a parte imaginária, 4); <M>{'t_{ss}=4/(\\xi\\omega_n)=4/2=2'}</M> s.</p>),
        ]}
        answer={<p><M>{String.raw`G=\frac{20}{s^2+4s+20}`}</M>; <M>{'\\omega_n\\approx4{,}47'}</M>, <M>{'\\xi\\approx0{,}447'}</M>; <M>{'M_p\\approx20{,}8\\%'}</M>, <M>{'t_p\\approx0{,}785'}</M> s, <M>{'t_{ss}=2'}</M> s.</p>}>
        <p>Um sistema de 2ª ordem sem zeros e ganho estático unitário tem polos em <M>{'-2\\pm j4'}</M>. (a) Escreva <M>G(s)</M>. (b) Determine <M>{'\\omega_n'}</M> e <M>{'\\xi'}</M>. (c) Calcule <M>{'M_p'}</M>, <M>{'t_p'}</M> e <M>{'t_{ss}'}</M> (2%).</p>
      </Exercise>

      <h2>Parte 3 — Projeto por especificações</h2>
      <Exercise id="l2-6" src={{ file: 'lista-2.pdf', p: 2, label: 'enunciado: Lista 2, p. 2' }} num="6" topic="Malha fechada com polo instável em malha aberta"
        steps={[
          s('Malha fechada', <MM>{String.raw`T(s)=\frac{K}{(s+a)(s-1)+K}=\frac{K}{s^2+(a-1)s+(K-a)}`}</MM>),
          s('(a) Valores numéricos', <p><M>{'s^2+0{,}6s+16'}</M>: <M>{'\\omega_n=4'}</M>, <M>{'\\xi=0{,}6/8=0{,}075'}</M> ⇒ <M>{String.raw`M_p=e^{-0{,}075\pi/\sqrt{1-0{,}075^2}}\approx79\%`}</M>.</p>),
          s('(b) Efeito de K', <p><M>{String.raw`\omega_n=\sqrt{K-a}`}</M> e <M>{String.raw`\xi=\frac{a-1}{2\omega_n}`}</M>. Diminuir <M>K</M> reduz <M>{'\\omega_n'}</M>, aumenta <M>{'\\xi'}</M> e reduz o sobressinal. Em contrapartida o sistema fica mais lento: o tempo de subida aumenta. (É preciso manter <M>{'K>a'}</M> para a estabilidade.)</p>),
        ]}
        answer={<p>(a) <M>{'\\omega_n=4'}</M>, <M>{'\\xi=0{,}075'}</M>, <M>{'M_p\\approx79\\%'}</M>. (b) Reduzir <M>K</M> (mantendo <M>{'K>a'}</M>): menor <M>{'M_p'}</M>, maior <M>{'t_r'}</M>.</p>}>
        <p>Malha fechada com realimentação unitária e <M>{String.raw`G(s)=\frac{K}{(s+a)(s-1)}`}</M>. (a) Para <M>{'K=17{,}6'}</M> e <M>{'a=1{,}6'}</M>, determine <M>{'\\omega_n'}</M>, <M>{'\\xi'}</M> e <M>{'M_p'}</M>. (b) Mantendo <M>a</M>, como reajustar <M>K</M> para diminuir o sobressinal? Qual o efeito no tempo de subida?</p>
      </Exercise>

      <Exercise id="l2-7" src={{ file: 'lista-2.pdf', p: 2, label: 'enunciado: Lista 2, p. 2' }} num="7" topic="Faixa de ganho por especificações"
        steps={[
          s('Malha fechada', <MM>{String.raw`T(s)=\frac{K_p}{s^2+4s+(3+K_p)}\ \Rightarrow\ \omega_n=\sqrt{3+K_p},\ \ \xi=\frac{2}{\omega_n}`}</MM>),
          s('Subamortecido', <p><M>{'\\xi<1\\Rightarrow\\omega_n>2\\Rightarrow K_p>1'}</M>.</p>),
          s('Mp ≤ 16%', <p><M>{'M_p\\le0{,}16\\Rightarrow\\xi\\ge0{,}504'}</M> ⇒ <M>{'\\omega_n\\le3{,}97'}</M> ⇒ <M>{'3+K_p\\le15{,}75'}</M> ⇒ <M>{'K_p\\le12{,}75'}</M>.</p>),
          s('tr ≤ 1,8 s', <p><M>{'1{,}8/\\omega_n\\le1{,}8\\Rightarrow\\omega_n\\ge1'}</M>, sempre satisfeito (já temos <M>{'\\omega_n>2'}</M>).</p>),
          s('(b) Estabilização', <p><M>{'t_{ss}=4/(\\xi\\omega_n)=4/2=2'}</M> s: <M>{'\\xi\\omega_n=2'}</M> é fixo (metade do coeficiente de <M>s</M>), então não depende de <M>{'K_p'}</M>.</p>),
        ]}
        answer={<p>(a) <M>{'1<K_p\\le12{,}75'}</M>. (b) Qualquer <M>{'K_p'}</M> da faixa dá <M>{'t_{ss}=2'}</M> s: a parte real dos polos é sempre −2.</p>}>
        <p>Com realimentação unitária, <M>{'K_p'}</M> em série com <M>{String.raw`\frac{1}{s^2+4s+3}`}</M>. Deseja-se resposta subamortecida com <M>{'M_p\\le16\\%'}</M> e <M>{'t_r\\le1{,}8'}</M> s (adote <M>{'t_r\\approx1{,}8/\\omega_n'}</M>). (a) Faixa de <M>{'K_p'}</M>. (b) Qual <M>{'K_p'}</M> dá o menor tempo de estabilização?</p>
      </Exercise>

      <Exercise id="l2-8" src={{ file: 'lista-2.pdf', p: 2, label: 'enunciado: Lista 2, p. 2' }} num="8" topic="Projeto de g e p (Exemplo ilustrativo 9)"
        steps={[
          s('Malha fechada', <p><M>{String.raw`\frac{g}{s^2+ps+g}`}</M> ⇒ <M>{String.raw`\omega_n=\sqrt g`}</M>, <M>{String.raw`\xi=\frac{p}{2\sqrt g}`}</M>.</p>),
          s('Sobressinal', <p><M>{'M_p<5\\%\\Rightarrow\\xi>0{,}69'}</M>; o menor <M>{'\\xi'}</M> admissível dá o menor <M>{'t_r'}</M>: <M>{'\\xi=0{,}7'}</M>.</p>),
          s('Estabilização', <p><M>{'4/(\\xi\\omega_n)<4\\Rightarrow\\omega_n>1{,}43'}</M>; para o menor <M>g</M>, <M>{'\\omega_n=1{,}44'}</M>.</p>),
          s('Resultado', <p><M>{'g=\\omega_n^2\\approx2{,}07'}</M>; <M>{'p=2\\xi\\omega_n\\approx2{,}02'}</M>.</p>),
        ]}
        answer={<p><M>{'g\\approx2{,}07'}</M> e <M>{'p\\approx2{,}02'}</M>.</p>}>
        <p>Com realimentação unitária e <M>{String.raw`G=\frac{g}{s(s+p)}`}</M>, determine <M>g</M> e <M>p</M> para: sobressinal &lt; 5%; <M>{'t_{ss}<4'}</M> s (2%); e, atendidas essas, o menor <M>{'t_r'}</M> com o menor <M>g</M>.</p>
      </Exercise>

      <Exercise id="l2-9" src={{ file: 'lista-2.pdf', p: 2, label: 'enunciado: Lista 2, p. 2' }} num="9" topic="Realimentação de velocidade"
        steps={[
          s('Malha interna', <MM>{String.raw`\frac{G_p}{1+K_rG_p}=\frac{100}{0{,}2s+1+100K_r}=\frac{500}{s+5+500K_r}`}</MM>),
          s('Com o integrador', <MM>{String.raw`\frac{500}{s+5+500K_r}\cdot\frac{1}{20s}=\frac{25}{s(s+5+500K_r)}`}</MM>),
          s('Malha externa', <MM>{String.raw`\frac{Y}{R}=\frac{25K}{s^2+(5+500K_r)s+25K}\ \Rightarrow\ \omega_n=\sqrt{25K},\ \ 2\xi\omega_n=5+500K_r`}</MM>),
          s('Especificações', <p><M>{'M_p=20\\%\\Rightarrow\\xi\\approx0{,}456'}</M>. <M>{'t_{ss}=4/(\\xi\\omega_n)=1\\Rightarrow\\xi\\omega_n=4'}</M> ⇒ <M>{'\\omega_n\\approx8{,}77'}</M>.</p>),
          s('Ganhos', <p><M>{'25K=\\omega_n^2\\approx76{,}9\\Rightarrow K\\approx3{,}08'}</M>. <M>{'5+500K_r=2\\xi\\omega_n=8\\Rightarrow K_r=0{,}006'}</M>.</p>),
        ]}
        answer={<p><M>{'K\\approx3{,}08'}</M> e <M>{'K_r=0{,}006'}</M>.</p>}>
        <p>No sistema com <M>{String.raw`G_p=\frac{100}{1+0{,}2s}`}</M> seguido de <M>{String.raw`\frac{1}{20s}`}</M>, ganho <M>K</M> na malha externa (realimentação unitária) e realimentação <M>{'K_r'}</M> tomada na saída de <M>{'G_p'}</M>, escolha <M>K</M> e <M>{'K_r'}</M> para sobressinal de 20% e <M>{'t_{ss}=1'}</M> s (2%).</p>
      </Exercise>

      <h2>Parte 4 — Alocação de polos com realimentação</h2>
      <Exercise id="l2-10" src={{ file: 'lista-2.pdf', p: 3, label: 'enunciado: Lista 2, p. 3' }} num="10" topic="Dois polos em −10"
        steps={[
          s('Sinais', <p>Seja <M>V</M> o sinal antes do integrador: <M>{String.raw`V=\frac{k_1}{s+1}E`}</M>, <M>{String.raw`C=\frac Vs\Rightarrow V=sC`}</M>, e <M>{'E=R-(C+k_2V)=R-C(1+k_2s)'}</M>.</p>),
          s('Equação característica', <MM>{String.raw`s(s+1)C=k_1\left[R-C(1+k_2s)\right]\ \Rightarrow\ \frac CR=\frac{k_1}{s^2+(1+k_1k_2)s+k_1}`}</MM>),
          s('Impor (s + 10)²', <p><M>{'s^2+20s+100'}</M>: <M>{'k_1=100'}</M> e <M>{'1+100k_2=20\\Rightarrow k_2=0{,}19'}</M>.</p>),
        ]}
        answer={<p><M>{'k_1=100'}</M>, <M>{'k_2=0{,}19'}</M>.</p>}>
        <p>Determine <M>{'k_1'}</M> e <M>{'k_2'}</M> para que a malha fechada tenha dois polos em <M>{'s=-10'}</M>. O caminho direto é <M>{String.raw`\frac{k_1}{s+1}`}</M> seguido de <M>{String.raw`\frac1s`}</M>; o ramo <M>{'k_2'}</M> realimenta o sinal antes do integrador, somado à realimentação unitária da saída.</p>
      </Exercise>
      <Exercise id="l2-11" src={{ file: 'lista-2.pdf', p: 3, label: 'enunciado: Lista 2, p. 3' }} num="11" topic="Duas realimentações negativas"
        steps={[
          s('Malha interna', <MM>{String.raw`\frac{G_2}{1+G_2},\quad G_2=\frac{K}{0{,}5s+1}`}</MM>),
          s('Malha externa', <MM>{String.raw`\frac YU=\frac{G_1G_2}{1+G_2+G_1G_2},\quad G_1=\frac{1}{0{,}2s+1}`}</MM>),
          s('Equação característica', <MM>{String.raw`(0{,}2s+1)(0{,}5s+1)+K(0{,}2s+1)+K=0{,}1s^2+(0{,}7+0{,}2K)s+(1+2K)=0`}</MM>),
          s('Parte real −6,5', <p><M>{String.raw`-\frac{0{,}7+0{,}2K}{2\cdot0{,}1}=-6{,}5\Rightarrow0{,}7+0{,}2K=1{,}3\Rightarrow K=3`}</M>. Conferindo: <M>{'s^2+13s+70'}</M> ⇒ <M>{'s=-6{,}5\\pm j5{,}27'}</M>, de fato complexos.</p>),
        ]}
        answer={<p><M>K=3</M>.</p>}>
        <p>No diagrama com <M>{String.raw`\frac{1}{0{,}2s+1}`}</M> e <M>{String.raw`\frac{K}{0{,}5s+1}`}</M> em série, cada um com realimentação negativa unitária da saída <M>Y</M> (a interna em torno do segundo bloco), calcule <M>K</M> para que os polos de malha fechada sejam complexos com parte real −6,5.</p>
      </Exercise>

      <h2>Parte 5 — Polos dominantes</h2>
      <Exercise id="l2-12" src={{ file: 'lista-2.pdf', p: 3, label: 'enunciado: Lista 2, p. 3' }} num="12" topic="Adequação da aproximação"
        steps={[
          s('Polos', <p><M>{'G_1'}</M>: −6 e <M>{'-1\\pm j\\sqrt3'}</M> (razão das partes reais 6 : 1). <M>{'G_2'}</M>: −1,5 e <M>{'-1\\pm j\\sqrt3'}</M> (1,5 : 1).</p>),
          s('Conclusão', <p>Para <M>{'G_1'}</M> a aproximação é adequada; para <M>{'G_2'}</M> não, pois o polo real está próximo dos dominantes.</p>),
          s('Aproximação de G₁', <MM>{String.raw`G_1\approx\frac{24}{6(s^2+2s+4)}=\frac{4}{s^2+2s+4}\quad(\text{ganho estático }=1\text{, preservado})`}</MM>),
          s('Especificações', <p><M>{'\\omega_n=2'}</M>, <M>{'\\xi=0{,}5'}</M> ⇒ <M>{'M_p\\approx16{,}3\\%'}</M>; <M>{String.raw`t_p=\pi/(2\cdot0{,}866)\approx1{,}81`}</M> s.</p>),
        ]}
        answer={<><p>(a) adequada para <M>{'G_1'}</M>, inadequada para <M>{'G_2'}</M>; (b) <M>{String.raw`\frac{4}{s^2+2s+4}`}</M>; (c) <M>{'\\omega_n=2'}</M>, <M>{'\\xi=0{,}5'}</M>, <M>{'M_p\\approx16{,}3\\%'}</M>, <M>{'t_p\\approx1{,}81'}</M> s.</p>
          <Plot height={170} xRange={[0, 7]} series={[{ ...g1a, color: 'var(--ink-3)', dash: '5 4', label: 'aproximação' }, { ...g1, color: 'var(--pen)', label: 'G₁' }, { ...g2, color: 'var(--pole)', label: 'G₂' }]} hLines={[{ y: 1 }]} yLabel="y(t)" /></>}>
        <p>Para <M>{String.raw`G_1=\frac{24}{(s+6)(s^2+2s+4)}`}</M> e <M>{String.raw`G_2=\frac{6}{(s+1{,}5)(s^2+2s+4)}`}</M>: (a) identifique os polos e justifique se a aproximação de 2ª ordem é adequada; (b) escreva a aproximação preservando o ganho estático; (c) estime <M>{'\\omega_n'}</M>, <M>{'\\xi'}</M>, <M>{'M_p'}</M> e <M>{'t_p'}</M>.</p>
      </Exercise>
      <Exercise id="l2-13" src={{ file: 'lista-2.pdf', p: 3, label: 'enunciado: Lista 2, p. 3' }} num="13" topic="Polos dominantes de 3ª ordem"
        steps={[
          s('Polos', <p><M>{'s^2+2s+5=0\\Rightarrow-1\\pm j2'}</M> (dominantes) e <M>{'-10'}</M>, dez vezes mais afastado do eixo imaginário: sua exponencial decai muito mais rápido.</p>),
          s('Aproximação', <p>Dividindo por 10 para manter <M>{'G(0)=1'}</M>: <M>{String.raw`G\approx\frac{5}{s^2+2s+5}`}</M>.</p>),
          s('Especificações', <p><M>{'\\omega_n=\\sqrt5\\approx2{,}24'}</M>, <M>{'\\xi=1/\\sqrt5\\approx0{,}447'}</M>, <M>{'\\omega_d=2'}</M>: <M>{'M_p\\approx20{,}8\\%'}</M>, <M>{'t_p=\\pi/2\\approx1{,}57'}</M> s, <M>{'t_{ss}=4/1=4'}</M> s.</p>),
        ]}
        answer={<p>Dominantes <M>{'-1\\pm j2'}</M>; <M>{String.raw`G\approx\frac{5}{s^2+2s+5}`}</M>; <M>{'M_p\\approx20{,}8\\%'}</M>, <M>{'t_p\\approx1{,}57'}</M> s, <M>{'t_{ss}=4'}</M> s.</p>}>
        <p>Para <M>{String.raw`G(s)=\frac{50}{(s^2+2s+5)(s+10)}`}</M>: (a) identifique os polos e os dominantes, justificando por que o polo real pode ser desprezado; (b) escreva a aproximação de 2ª ordem com ganho estático unitário; (c) estime <M>{'M_p'}</M>, <M>{'t_p'}</M> e <M>{'t_{ss}'}</M> (2%).</p>
      </Exercise>
    </>
  )
}
