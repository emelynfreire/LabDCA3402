import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function RegimeTransitorio() {
  return (
    <>
      <p>Controladores podem alterar o comportamento de um sistema tanto em regime permanente quanto no transitório. Esta aula define as especificações de regime transitório para sistemas de 1ª e 2ª ordem e mostra quando um sistema de ordem maior pode ser aproximado por eles.</p>

      <h2>Sistemas de 1ª ordem<Slide p={[4, 8]} /></h2>
      <MM>{String.raw`T\dot y+y=Ku\quad\Rightarrow\quad G(s)=\frac{K}{Ts+1},\qquad\text{polo em } s=-\frac1T`}</MM>
      <p>Com <M>{'T>0'}</M> o sistema é estável. Para <M>K=1</M> e degrau unitário:</p>
      <MM>{String.raw`Y(s)=\frac{1}{Ts+1}\cdot\frac1s=\frac1s-\frac{1}{s+\frac1T}\quad\Rightarrow\quad y(t)=1-e^{-t/T}`}</MM>
      <p><M>T</M> é a <b>constante de tempo</b>: a saída atinge 63,2% do valor final em <M>T</M>, 86,5% em <M>2T</M>, 95% em <M>3T</M> e 98,2% em <M>4T</M>. Daí o <b>tempo de estabilização</b>:</p>
      <MM>{String.raw`t_{ss}=3T\ \ (\text{critério de }5\%)\qquad t_{ss}=4T\ \ (\text{critério de }2\%)`}</MM>
      <p>Quanto maior <M>T</M> (polo mais perto da origem), mais lenta a resposta. Para rampa unitária:</p>
      <MM>{String.raw`Y(s)=\frac{1}{Ts+1}\cdot\frac{1}{s^2}=\frac{1}{s^2}-\frac Ts+\frac{T}{s+\frac1T}\quad\Rightarrow\quad y(t)=t-T+Te^{-t/T}`}</MM>
      <p>Em regime, a saída acompanha a rampa com <b>erro estacionário igual a T</b>.</p>
      <SimSlot name="primeira" />

      <h2>Sistemas de 2ª ordem canônicos<Slide p={[9, 19]} /></h2>
      <MM>{String.raw`\ddot y+2\xi\omega_n\dot y+\omega_n^2y=K\omega_n^2u\quad\Rightarrow\quad G(s)=\frac{K\omega_n^2}{s^2+2\xi\omega_ns+\omega_n^2}`}</MM>
      <p><M>{'\\xi'}</M> é o <b>fator de amortecimento</b> e <M>{'\\omega_n'}</M> a <b>frequência natural não amortecida</b>. Com <M>K=1</M>, há três casos:</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Caso</th><th>Polos</th><th>Resposta ao degrau unitário</th></tr></thead>
        <tbody>
          <tr><td><M>{'\\xi>1'}</M> sobreamortecido</td><td><M>{String.raw`p_{1,2}=-\xi\omega_n\pm\omega_n\sqrt{\xi^2-1}`}</M> (reais distintos)</td><td><M>{'y=1-c_1e^{p_1t}+c_2e^{p_2t}'}</M>, com <M>{String.raw`c_{1,2}=\frac{1}{2\sqrt{\xi^2-1}(\xi\mp\sqrt{\xi^2-1})}`}</M></td></tr>
          <tr><td><M>{'\\xi=1'}</M> criticamente amortecido</td><td><M>{'p_1=p_2=-\\omega_n'}</M></td><td><M>{'y=1-e^{-\\omega_nt}(1+\\omega_nt)'}</M></td></tr>
          <tr><td><M>{'\\xi<1'}</M> subamortecido</td><td><M>{String.raw`-\xi\omega_n\pm j\omega_d,\ \ \omega_d=\omega_n\sqrt{1-\xi^2}`}</M></td><td><M>{String.raw`y=1-e^{-\xi\omega_nt}\left(\cos\omega_dt+\frac{\xi}{\sqrt{1-\xi^2}}\sen\omega_dt\right)`}</M></td></tr>
        </tbody></table></div>
      <p>Os três casos são exatamente os três sinais do discriminante de <M>{'s^2+2\\xi\\omega_ns+\\omega_n^2'}</M>: </p>
      <SimSlot name="bhaskara" />
      <p><M>{'\\omega_d'}</M> é a <b>frequência natural amortecida</b>, a frequência da oscilação da saída. A forma subamortecida também se escreve <M>{String.raw`y=1-\frac{e^{-\xi\omega_nt}}{\sqrt{1-\xi^2}}\sen\!\left(\omega_dt+\tan^{-1}\frac{\sqrt{1-\xi^2}}{\xi}\right)`}</M>.</p>
      <ul>
        <li><b>Sobreamortecido</b>: quanto maior <M>{'\\xi'}</M>, mais o termo do polo mais rápido se torna desprezível; para <M>{'\\xi\\ge1{,}2'}</M> aproxima-se por 1ª ordem, <M>{String.raw`G\simeq\frac{-p_1}{s-p_1}`}</M>, com <M>{'t_{ss}\\simeq 3/|p_1|'}</M> (5%) ou <M>{'4/|p_1|'}</M> (2%).</li>
        <li><b>Crítico</b>: <M>{'t_{ss}'}</M> sai de resolver <M>{'1-e^{-\\omega_nt}(1+\\omega_nt)=0{,}95'}</M> ou <M>{'0{,}98'}</M>: <M>{'\\omega_nt_{ss}=4{,}744'}</M> (5%) e <M>{'5{,}834'}</M> (2%).</li>
      </ul>
      <p>Exceto em aplicações que não toleram oscilação, deseja-se <M>{'0{,}4\\le\\xi\\le0{,}8'}</M>: abaixo disso o sobressinal é excessivo; acima, a resposta é desnecessariamente lenta.</p>

      <h2>Medidas de desempenho (subamortecido, ganho 1)<Slide p={[20, 24]} /></h2>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Medida</th><th>Definição</th><th>Fórmula</th></tr></thead>
        <tbody>
          <tr><td>Tempo de subida <M>{'t_r'}</M></td><td>tempo para atingir o valor de regime pela 1ª vez (faz-se <M>y=1</M>)</td><td><M>{String.raw`t_r=\frac{\pi-\beta}{\omega_d},\ \ \beta=\cos^{-1}\xi`}</M></td></tr>
          <tr><td>Instante de pico <M>{'t_p'}</M></td><td>1ª solução não nula de <M>{'\\dot y=0'}</M></td><td><M>{String.raw`t_p=\frac{\pi}{\omega_d}`}</M></td></tr>
          <tr><td>Sobressinal <M>{'M_p'}</M></td><td>maior pico, medido a partir do regime: <M>{'y(t_p)-1'}</M></td><td><M>{String.raw`M_p=e^{-\xi\pi/\sqrt{1-\xi^2}}`}</M></td></tr>
          <tr><td>Tempo de estabilização <M>{'t_{ss}'}</M></td><td>a partir dele a saída fica entre <M>{'1\\pm\\epsilon'}</M></td><td><M>{String.raw`t_{ss}\simeq\frac{3}{\xi\omega_n}\ (5\%),\ \ \frac{4}{\xi\omega_n}\ (2\%)`}</M></td></tr>
        </tbody></table></div>
      <p>No plano <M>s</M>, o polo está à distância <M>{'\\omega_n'}</M> da origem, a parte real é <M>{'-\\sigma=-\\xi\\omega_n'}</M> e o ângulo com o eixo real negativo é <M>{'\\beta'}</M>, com <M>{'\\cos\\beta=\\xi'}</M>.</p>

      <SimSlot name="segunda" />

      <Exercise id="t-rt-9" review={['exp-log']} src={{ p: [25, 27] }} num="9" topic="Exemplo ilustrativo 9 dos slides"
        steps={[
          { title: 'Malha fechada', body: <MM>{String.raw`G_{MF}=\frac{g}{s(s+p)+g}=\frac{g}{s^2+ps+g}\ \Rightarrow\ \omega_n=\sqrt g,\ \ \xi=\frac{p}{2\sqrt g}`}</MM> },
          { title: 'Sobressinal < 5%', body: <p><M>{String.raw`e^{-\xi\pi/\sqrt{1-\xi^2}}<0{,}05\Rightarrow\xi>0{,}69`}</M>. Como <M>{'t_r'}</M> aumenta com <M>{'\\xi'}</M>, para a subida mais rápida usa-se o menor valor possível: <M>{'\\xi=0{,}7'}</M>.</p> },
          { title: 'Estabilização < 4 s (2%)', body: <p><M>{String.raw`\frac{4}{\xi\omega_n}<4\Rightarrow\omega_n>1{,}43`}</M>. Para o menor <M>g</M>, o menor <M>{'\\omega_n'}</M>: adota-se <M>{'\\omega_n=1{,}44'}</M>.</p> },
          { title: 'Valores de projeto', body: <MM>{String.raw`g=\omega_n^2=2{,}0736,\qquad p=2\xi\omega_n=2{,}016`}</MM> },
        ]}
        answer={<p><M>{'g\\approx2{,}07'}</M> e <M>{'p\\approx2{,}02'}</M> (mesma questão 8 da Lista 2).</p>}>
        <p>Para a malha fechada com realimentação unitária e <M>{'G(s)=\\frac{g}{s(s+p)}'}</M>, determine <M>g</M> e <M>p</M> para que o sobressinal seja inferior a 5%, o tempo de estabilização inferior a 4 s e, satisfeitas essas condições, o sistema atinja o regime o mais rápido possível com o menor ganho <M>g</M>.</p>
      </Exercise>

      <h2>Sistemas de 2ª ordem não canônicos (com zero)<Slide p={[28, 31]} /></h2>
      <p>Se houver zeros próximos dos polos dominantes, eles alteram o transitório. Nos slides, simulou-se <M>{String.raw`G(s)=\frac{(Ts+1)\,\omega_n^2}{s^2+2\xi\omega_ns+\omega_n^2}`}</M> com <M>{'\\omega_n=1'}</M>, <M>{'\\xi=0{,}2'}</M> e <M>{'\\xi=0{,}625'}</M>, para o zero em várias posições:</p>
      <div className="tbl-wrap"><table className="tbl num">
        <thead><tr><th>ξ</th><th>T</th><th>1/T = −z</th><th>z/Re(p)</th><th>Sobressinal</th><th>Subsinal</th><th>t_ss (5%)</th></tr></thead>
        <tbody>
          {[['0,2', '0', '∞', '∞', '52,7%', '–', '13,8'], ['0,2', '0,5', '2', '10', '59,7%', '–', '13,4'], ['0,2', '1', '1', '5', '79,8%', '–', '15,8'], ['0,2', '5', '0,2', '1', '355,5%', '82,7%', '21,8'], ['0,2', '−1', '−1', '−5', '70,9%', '34,7%', '17,2'],
            ['0,625', '0', '∞', '∞', '8,1%', '–', '5,17'], ['0,625', '0,16', '6,25', '10', '8,2%', '–', '5,01'], ['0,625', '0,32', '3,125', '5', '8,6%', '–', '4,86'], ['0,625', '1,6', '0,625', '1', '35,5%', '–', '4,30'], ['0,625', '−0,32', '−3,125', '−5', '8,4%', '4,0%', '5,48']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
        </tbody></table></div>
      <p className="source">Tabela reproduzida dos slides da aula 11<Slide p={31} />.</p>
      <SimSlot name="zero" />

      <h2>Sistemas de ordem superior: polos dominantes<Slide p={[32, 33]} /></h2>
      <p>Quando os polos têm partes reais bem distintas, o comportamento é dominado pelos polos mais próximos do eixo imaginário (<b>polos dominantes</b>), cuja constante de tempo é maior e gera transitórios mais duradouros. Os demais podem ser desprezados, preservando o ganho estático:</p>
      <MM>{String.raw`G(s)=\frac{K}{(s+p_1)(s+p_2)(s+p_3)(s+p_4)}\simeq\frac{K}{p_2p_3p_4\,(s+p_1)}`}</MM>
      <Exercise id="t-rt-10" review={['polinomios', 'complexos']} src={{ p: [34, 35] }} num="10" topic="Exemplo ilustrativo 10 dos slides"
        steps={[
          { title: 'Polos', body: <p><M>{'G_1'}</M>: <M>{'-6'}</M> e <M>{'-1\\pm j\\sqrt3'}</M>. <M>{'G_2'}</M>: <M>{'-1{,}5'}</M> e <M>{'-1\\pm j\\sqrt3'}</M>.</p> },
          { title: 'Razão das partes reais', body: <p><M>{'G_1'}</M>: 1 : 6, o polo real decai seis vezes mais rápido — boa aproximação. <M>{'G_2'}</M>: 1 : 1,5 — o polo real é quase tão lento quanto os complexos.</p> },
          { title: 'Aproximações com ganho preservado', body: <MM>{String.raw`G_1\simeq\frac{24}{6(s^2+2s+4)}=\frac{4}{s^2+2s+4},\qquad G_2\simeq\frac{6}{1{,}5(s^2+2s+4)}=\frac{4}{s^2+2s+4}`}</MM> },
        ]}
        answer={<p>As duas aproximações têm a mesma expressão, mas só a de <M>{'G_1'}</M> é adequada; a de <M>{'G_2'}</M> erra bastante o transitório (veja a simulação abaixo).</p>}>
        <p>Verifique a adequação de uma aproximação de ordem inferior para <M>{String.raw`G_1=\frac{24}{(s+6)(s^2+2s+4)}`}</M> e <M>{String.raw`G_2=\frac{6}{(s+1{,}5)(s^2+2s+4)}`}</M>.</p>
      </Exercise>
      <SimSlot name="dominantes" />
      <Callout kind="tip" tag="Pratique">A Lista 2 inteira é sobre esta aula. Vá para a <a href="#/lista/2">Lista 2 resolvida</a>.</Callout>
    </>
  )
}
