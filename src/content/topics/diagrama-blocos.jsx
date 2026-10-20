import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'

export default function DiagramaBlocos() {
  return (
    <>
      <p>Sistemas de controle são compostos por vários subsistemas (controlador, atuador, processo, sensor). O diagrama de blocos representa graficamente as interconexões entre eles, junto com as relações matemáticas entre os sinais.</p>
      <p>Na representação linear, cada subsistema é um modelo LIT na forma de função de transferência — por exemplo, controlador <M>C(s)</M>, atuador <M>{'G_a(s)'}</M>, processo <M>{'G_p(s)'}</M>, sensor <M>H(s)</M> e uma perturbação <M>W(s)</M>. O comportamento global é dado pela função de transferência de malha fechada <M>{'G_{mf}(s)=Y(s)/R(s)'}</M>, obtida manipulando o diagrama.</p>

      <h2>Elementos e estruturas principais<Slide p={[7, 12]} /></h2>
      <ul>
        <li><b>Bloco</b>: <M>{'Y(s)=G(s)U(s)'}</M>.</li>
        <li><b>Somador</b>: soma algébrica dos sinais, com o sinal indicado em cada entrada, ex.: <M>{'E=U_1+U_2-U_3'}</M>.</li>
        <li><b>Ponto de derivação</b>: o mesmo sinal segue por dois caminhos.</li>
      </ul>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Estrutura</th><th>Equivalente</th><th>Dedução</th></tr></thead>
        <tbody>
          <tr><td>Série</td><td><M>{'G_1G_2'}</M></td><td><M>{'Y=G_2Y_1=G_2G_1U'}</M></td></tr>
          <tr><td>Paralelo</td><td><M>{'G_1+G_2-G_3'}</M></td><td>soma das saídas dos ramos, com os sinais do somador</td></tr>
          <tr><td>Realimentação negativa</td><td><M>{'\\dfrac{G}{1+GH}'}</M></td><td><M>{'Y=G(R-HY)\\Rightarrow(1+GH)Y=GR'}</M></td></tr>
          <tr><td>Realimentação positiva</td><td><M>{'\\dfrac{G}{1-GH}'}</M></td><td><M>{'Y=G(R+HY)'}</M></td></tr>
        </tbody></table></div>
      <Callout tag="Regra para guardar">A função de transferência de malha fechada é a função de transferência direta <M>G(s)</M> dividida por 1 mais o ganho de malha <M>G(s)H(s)</M> (realimentação negativa).</Callout>

      <h2>Movimentação de somadores e derivações<Slide p={[14, 16]} /></h2>
      <p>O objetivo é substituir gradativamente estruturas conhecidas por blocos equivalentes até restar um único bloco (Tabela 2.4 da apostila de Medeiros e Maitelli). Quando uma estrutura está "embaralhada", movem-se somadores ou pontos de derivação através de blocos, compensando o ramo afetado:</p>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Transformação</th><th>Compensação no ramo deslocado</th></tr></thead>
        <tbody>
          <tr><td>Somador movido para <b>antes</b> de um bloco G</td><td>o sinal que entra lateralmente passa por <M>{'1/G'}</M></td></tr>
          <tr><td>Somador movido para <b>depois</b> de um bloco G</td><td>o sinal lateral passa por <M>G</M></td></tr>
          <tr><td>Derivação movida para <b>antes</b> de um bloco G</td><td>o ramo derivado recebe <M>G</M></td></tr>
          <tr><td>Derivação movida para <b>depois</b> de um bloco G</td><td>o ramo derivado recebe <M>{'1/G'}</M></td></tr>
        </tbody></table></div>
      <p>Em todos os casos a ideia é preservar o sinal original: se ele atravessaria <M>G</M> e não atravessa mais, ganha um <M>G</M>; se não atravessaria e passa a atravessar, ganha um <M>{'1/G'}</M>.</p>

      <h2>Exemplo 1 dos slides<Slide p={[17, 21]} /></h2>
      <p>No primeiro exemplo, o caminho direto tem o controlador <M>C</M> em paralelo com um ramo unitário subtraído (estrutura paralela <M>{'C-1'}</M>), seguido de <M>G</M>, com realimentação unitária negativa:</p>
      <MM>{String.raw`G_1=C-1\ \ \xrightarrow{\text{série}}\ \ G_2=(C-1)G\ \ \xrightarrow{\text{realimentação}}\ \ G_{mf}=\frac{(C-1)G}{1+(C-1)G}`}</MM>

      <h2>Exemplo 2 dos slides<Slide p={[22, 29]} /></h2>
      <SimSlot name="blocos" />

      <h2>Malha fechada e posição dos polos</h2>
      <p>Fechar a malha muda os polos: para <M>{'G_p=\\frac{K}{s(s+4)}'}</M> com realimentação unitária, <M>{'T(s)=\\frac{K}{s^2+4s+K}'}</M>. O ganho escolhe onde ficam os polos — e, portanto, a forma da resposta. Essa ideia reaparece em estabilidade (Routh com ganho) e no projeto por especificações (Lista 2).</p>
      <SimSlot name="realimentacao" />
    </>
  )
}
