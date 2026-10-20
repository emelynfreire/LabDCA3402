import Slide from '../../components/SlideRef.jsx'
import { M } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'

function LoopDiagram() {
  const box = (x, label, w = 110) => (
    <g key={label}>
      <rect x={x} y={34} width={w} height={40} rx="3" fill="var(--panel)" stroke="var(--ink-2)" />
      <text x={x + w / 2} y={59} textAnchor="middle" fontSize="13" fontFamily="var(--font-ui)" fill="var(--ink)">{label}</text>
    </g>
  )
  const arrow = (x1, y1, x2, y2) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-2)" strokeWidth="1.5" markerEnd="url(#ah)" />
  return (
    <svg viewBox="0 0 700 150" style={{ width: '100%', height: 'auto', margin: '1rem 0' }} role="img" aria-label="Diagrama de controle em malha fechada">
      <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="var(--ink-2)" /></marker></defs>
      <text x={0} y={46} fontSize="12" fontFamily="var(--font-ui)" fill="var(--ink-2)">saída</text>
      <text x={0} y={60} fontSize="12" fontFamily="var(--font-ui)" fill="var(--ink-2)">desejada</text>
      {arrow(58, 54, 118, 54)}
      <circle cx={130} cy={54} r={12} fill="var(--panel)" stroke="var(--ink-2)" />
      <text x={110} y={44} fontSize="13" fill="var(--ink)">+</text><text x={134} y={84} fontSize="15" fill="var(--ink)">−</text>
      {arrow(142, 54, 198, 54)}<text x={152} y={46} fontSize="11" fontFamily="var(--font-ui)" fill="var(--ink-2)">erro</text>
      {box(200, 'Controlador')}{arrow(310, 54, 368, 54)}
      {box(370, 'Processo')}{arrow(480, 54, 600, 54)}
      <text x={608} y={58} fontSize="12" fontFamily="var(--font-ui)" fill="var(--ink-2)">saída</text>
      <line x1={540} y1={54} x2={540} y2={122} stroke="var(--ink-2)" strokeWidth="1.5" />
      <line x1={540} y1={122} x2={480} y2={122} stroke="var(--ink-2)" strokeWidth="1.5" markerEnd="url(#ah)" />
      <rect x={370} y={104} width={110} height={36} rx="3" fill="var(--panel)" stroke="var(--ink-2)" />
      <text x={425} y={127} textAnchor="middle" fontSize="13" fontFamily="var(--font-ui)" fill="var(--ink)">Sensor</text>
      <line x1={370} y1={122} x2={130} y2={122} stroke="var(--ink-2)" strokeWidth="1.5" />
      {arrow(130, 122, 130, 68)}
      <text x={200} y={116} fontSize="11" fontFamily="var(--font-ui)" fill="var(--ink-2)">sinal de realimentação</text>
    </svg>
  )
}

export default function Introducao() {
  return (
    <>
      <p>A disciplina estuda sistemas dinâmicos lineares: como obter um modelo matemático a partir das leis físicas, como analisar as propriedades desse modelo e, mais adiante em Controle, como usá-lo para projetar controladores.</p>

      <h2>O que é um sistema<Slide p={[4, 6]} /></h2>
      <p>Sistemas processam sinais, modificando-os ou extraindo informação deles. Podem ser componentes físicos (hardware) ou um algoritmo que calcula a saída a partir da entrada (software). Um sistema físico é formado por componentes interligados, cada um caracterizado por suas relações terminais de entrada e saída, e é regido por leis de interconexão.</p>
      <p>Em circuitos elétricos, por exemplo, as relações terminais são as relações tensão–corrente de resistores, capacitores, indutores, transformadores e transistores; as leis de interconexão são as leis de Kirchhoff. Combinando essas relações obtém-se o <b>modelo matemático</b> do sistema: equações que relacionam entradas e saídas.</p>
      <Callout tag="Representação de caixa preta">Um sistema pode ser visto como um bloco com entradas <M>{'x_1(t), \\dots, x_j(t)'}</M> e saídas <M>{'y_1(t), \\dots, y_k(t)'}</M>. No exemplo do slide, a entrada <M>x(t)</M> vem de uma fonte de corrente e a saída é a soma das tensões no resistor e no capacitor.</Callout>

      <h2>Modelagem, análise e projeto<Slide p={9} /></h2>
      <p>O estudo de sistemas em Engenharia de Controle segue o método analítico:</p>
      <ol>
        <li><b>Modelagem</b>: obter as equações do sistema.</li>
        <li><b>Análise</b>: estudar propriedades a partir do modelo (estabilidade, resposta transitória, etc.).</li>
        <li><b>Projeto</b>: sintetizar controladores com base no modelo.</li>
      </ol>
      <p>Esta disciplina cobre as duas primeiras etapas.</p>

      <h2>Definições básicas<Slide p={10} /></h2>
      <p><b>Planta ou processo</b> é o sistema dinâmico cuja saída se deseja controlar; possui uma entrada manipulável e uma saída controlável observável.</p>
      <h3>Malha aberta<Slide p={[11, 12]} /></h3>
      <p>A ação de controle não depende da saída. No exemplo do tanque, ajusta-se a abertura da válvula para a vazão desejada; quando o nível do tanque cai, a vazão também cai para a mesma abertura, e nada corrige isso. Outro exemplo: dirigir um carro sem velocímetro tentando manter 80 km/h apenas pela pressão estimada no acelerador. Numa subida ou descida, a velocidade muda e o motorista não percebe.</p>
      <h3>Malha fechada<Slide p={[13, 16]} /></h3>
      <p>A saída é medida por um sensor (sinal de realimentação) e comparada com a saída desejada; a diferença é o <b>sinal de erro</b>, que alimenta o controlador.</p>
      <LoopDiagram />
      <p>A malha fechada é importante quando há <b>perturbações</b>: sinais que afetam a saída e em geral não são previsíveis (ruídos de medida são um exemplo).</p>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Vantagens da malha fechada</th><th>Desvantagens</th></tr></thead>
        <tbody><tr><td>Menor sensibilidade a variações de parâmetros; maior rejeição a distúrbios</td><td>Mais componentes; maior complexidade; possibilidade de perda de estabilidade</td></tr></tbody></table></div>
      <h3>Outros termos<Slide p={[17, 21]} /></h3>
      <ul>
        <li><b>Sistema multivariável</b>: uma variável manipulada pode influenciar mais de uma variável controlada.</li>
        <li><b>Controle regulador</b>: manter a planta perto do ponto de operação desejado apesar das perturbações (no exemplo do slide, compensar a variação da temperatura ambiente na entrada do processo).</li>
        <li><b>Controle servo</b>: fazer a saída acompanhar uma trajetória de referência com erro mínimo.</li>
      </ul>

      <h2>Um pouco de história<Slide p={[22, 27]} /></h2>
      <div className="tbl-wrap"><table className="tbl"><tbody>
        <tr><td className="num">séc. II a.C.</td><td>Relógio d'água de Ktesibios: a altura da coluna de água é regulada para manter o gotejamento constante; a válvula atua como sensor e atuador.</td></tr>
        <tr><td className="num">250 a.C.</td><td>Philon: lamparina a óleo com regulador flutuante.</td></tr>
        <tr><td className="num">1 d.C.</td><td>Heron de Alexandria publica <i>Pneumatica</i>, com reguladores flutuantes de nível.</td></tr>
        <tr><td className="num">1769</td><td>Governador centrífugo de James Watt.</td></tr>
        <tr><td className="num">1868</td><td>J. C. Maxwell modela o regulador de velocidade da máquina a vapor. Até então o controle era intuitivo e, ao buscar precisão, os sistemas ficavam oscilatórios ou instáveis.</td></tr>
        <tr><td className="num">1911–1933</td><td>Primeiro PID (Sperry); H. W. Black analisa amplificadores realimentados (1927); Nyquist e o critério de estabilidade (1932); PID pneumático da Taylor Instruments (1933).</td></tr>
        <tr><td className="num">1950–1954</td><td>PID de estado sólido (Foxboro); máquinas CNC no MIT; primeiro robô industrial (George Devol).</td></tr>
        <tr><td className="num">1970–1980</td><td>Variáveis de estado e controle ótimo; controle robusto. Depois: controle preditivo, tolerante a falhas etc.</td></tr>
      </tbody></table></div>
      <p>Ferramentas matemáticas que aparecerão ao longo do curso levam o nome de quem as criou: Newton (modelagem), Laplace (transformada), Taylor (série usada na linearização), Routh (critério de estabilidade), Bode e Nyquist.</p>
    </>
  )
}
