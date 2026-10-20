import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function MecanicosTranslacao() {
  return (
    <>
      <h2>Elementos</h2>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Elemento</th><th>Força</th><th>Laplace (CI nulas)</th><th>Armazena</th></tr></thead>
        <tbody>
          <tr><td>Massa <M>m</M></td><td><M>{'f=m\\ddot x'}</M></td><td><M>{'ms^2X(s)'}</M></td><td>energia cinética <M>{'\\frac12m\\dot x^2'}</M></td></tr>
          <tr><td>Mola <M>k</M></td><td><M>{'f=k(x_1-x_2)'}</M></td><td><M>{'k\\,[X_1-X_2]'}</M></td><td>energia potencial <M>{'\\frac12k\\Delta x^2'}</M></td></tr>
          <tr><td>Amortecedor viscoso <M>b</M></td><td><M>{'f=b(\\dot x_1-\\dot x_2)'}</M></td><td><M>{'bs\\,[X_1-X_2]'}</M></td><td>— (dissipa)</td></tr>
        </tbody></table></div>
      <p>Para cada massa, desenha-se o diagrama de corpo livre e aplica-se a segunda lei de Newton: <M>{'m\\ddot x=\\sum f'}</M>. Molas e amortecedores ligados a duas massas exercem forças proporcionais ao deslocamento (ou velocidade) <b>relativo</b>.</p>

      <h2>Um grau de liberdade</h2>
      <MM>{String.raw`m\ddot x+b\dot x+kx=f(t)\quad\Rightarrow\quad\frac{X(s)}{F(s)}=\frac{1}{ms^2+bs+k},\qquad\omega_n=\sqrt{\frac km},\ \ \xi=\frac{b}{2\sqrt{km}}`}</MM>
      <SimSlot name="massamola" />

      <h2>Dois graus de liberdade</h2>
      <p>Massa <M>{'m_1'}</M> ligada à parede por <M>{'k_1'}</M> e à massa <M>{'m_2'}</M> por <M>{'k_2'}</M> e <M>{'b'}</M>; força <M>f</M> aplicada em <M>{'m_2'}</M>:</p>
      <MM>{String.raw`\begin{cases}m_1\ddot x_1=-k_1x_1+k_2(x_2-x_1)+b(\dot x_2-\dot x_1)\\ m_2\ddot x_2=f-k_2(x_2-x_1)-b(\dot x_2-\dot x_1)\end{cases}`}</MM>
      <p>Em Laplace, um sistema de duas equações algébricas; resolvendo por Cramer obtém-se, por exemplo, <M>{'X_1(s)/F(s)'}</M> com denominador de 4º grau (quatro armazenadores: duas massas, duas molas).</p>

      <Callout tag="Analogia força–tensão">
        <div className="tbl-wrap"><table className="tbl" style={{ margin: '.3rem 0 0' }}>
          <thead><tr><th>Mecânico</th><th>Elétrico (série)</th></tr></thead>
          <tbody>
            <tr><td>força <M>f</M></td><td>tensão <M>e</M></td></tr>
            <tr><td>velocidade <M>{'\\dot x'}</M></td><td>corrente <M>i</M></td></tr>
            <tr><td>massa <M>m</M></td><td>indutância <M>L</M></td></tr>
            <tr><td>amortecimento <M>b</M></td><td>resistência <M>R</M></td></tr>
            <tr><td>rigidez <M>k</M></td><td>inverso da capacitância <M>{'1/C'}</M></td></tr>
          </tbody></table></div>
        Com essa correspondência, <M>{'m\\ddot x+b\\dot x+kx=f'}</M> e <M>{'L\\ddot q+R\\dot q+q/C=e'}</M> são a mesma equação.
      </Callout>

      <Exercise id="t-u3-mt" num="Ex." topic="Modelo em espaço de estados"
        steps={[
          { title: 'Estados', body: <p><M>{'x_1=x'}</M> (posição) e <M>{'x_2=\\dot x'}</M> (velocidade), as variáveis ligadas à energia da mola e da massa.</p> },
          { title: 'Equações', body: <MM>{String.raw`\dot x_1=x_2,\qquad \dot x_2=\frac{1}{m}\left(f-kx_1-bx_2\right)`}</MM> },
          { title: 'Matrizes', body: <MM>{String.raw`A=\begin{bmatrix}0&1\\-\frac km&-\frac bm\end{bmatrix},\quad B=\begin{bmatrix}0\\\frac1m\end{bmatrix},\quad C=\begin{bmatrix}1&0\end{bmatrix}`}</MM> },
        ]}
        answer={<p>É o modelo usado nos testes de observabilidade da aula 13.</p>}>
        <p>Escreva o modelo em espaço de estados do massa–mola–amortecedor com saída na posição.</p>
      </Exercise>
    </>
  )
}
