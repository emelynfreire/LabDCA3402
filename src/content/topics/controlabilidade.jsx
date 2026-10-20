import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'
import Exercise from '../../components/Exercise.jsx'

export default function Controlabilidade() {
  return (
    <>
      <h2>Controlabilidade<Slide p={[4, 6]} /></h2>
      <p>Refere-se à possibilidade de levar o estado de qualquer valor inicial a qualquer valor final por meio de uma entrada adequada.</p>
      <Callout tag="Definição">Um sistema é <b>controlável</b> se, para todo <M>{'\\mathbf x_0=\\mathbf x(0)'}</M>, todo <M>{'\\mathbf x_f'}</M> e qualquer intervalo finito <M>{'[0,t_f]'}</M>, existe <M>{'u(t),\\ 0\\le t\\le t_f'}</M>, tal que <M>{'\\mathbf x(t_f)=\\mathbf x_f'}</M>.</Callout>
      <p><b>Exemplos dos slides.</b> Dois ramos RC idênticos alimentados pela mesma fonte: se <M>{'x_1(0)=x_2(0)'}</M>, então <M>{'x_1(t)=x_2(t)'}</M> para todo <M>t</M>, qualquer que seja <M>u</M> — não controlável. Já no RLC série existe <M>u</M> capaz de alterar independentemente a corrente e a tensão — controlável. Nem sempre a análise física basta; daí os testes algébricos.</p>
      <h3>Teste do posto<Slide p={7} /></h3>
      <MM>{String.raw`\mathcal C=\begin{bmatrix}B&AB&A^2B&\cdots&A^{n-1}B\end{bmatrix}\qquad\text{controlável}\iff\posto(\mathcal C)=n`}</MM>
      <h3>Teste PBH (Popov–Belevitch–Hautus)<Slide p={[8, 11]} /></h3>
      <MM>{String.raw`\text{controlável}\iff\posto\begin{bmatrix}A-\lambda I&B\end{bmatrix}=n\ \ \text{para todo autovalor }\lambda\text{ de }A`}</MM>
      <p>Se o posto cai para algum <M>{'\\lambda_i'}</M>, ele é um <b>autovalor (modo) não controlável</b>.</p>
      <ul>
        <li><M>{String.raw`A=\begin{bmatrix}0&1\\2&-1\end{bmatrix},\ B=\begin{bmatrix}0\\1\end{bmatrix}`}</M>: <M>{String.raw`\mathcal C=\begin{bmatrix}0&1\\1&-1\end{bmatrix}`}</M>, <M>{'\\det=-1\\ne0'}</M> ⇒ controlável. Autovalores 1 e −2: instável, porém controlável.</li>
        <li><M>{String.raw`A=\begin{bmatrix}4&-10\\3&-7\end{bmatrix},\ B=\begin{bmatrix}-2\\-1\end{bmatrix}`}</M>: <M>{String.raw`\mathcal C=\begin{bmatrix}-2&2\\-1&1\end{bmatrix}`}</M>, <M>{'\\det=0'}</M> ⇒ não controlável. PBH: em <M>{'\\lambda_1=-1'}</M>, <M>{String.raw`\begin{bmatrix}5&-10&-2\\3&-6&-1\end{bmatrix}`}</M> tem posto 2; em <M>{'\\lambda_2=-2'}</M>, <M>{String.raw`\begin{bmatrix}6&-10&-2\\3&-5&-1\end{bmatrix}`}</M> tem posto 1 (linhas proporcionais). Logo <M>{'\\lambda_2=-2'}</M> é o modo não controlável.</li>
      </ul>
      <div className="note"><span className="tag">Consequência</span>As dinâmicas associadas a autovalores não controláveis não são afetadas pela entrada e <b>não aparecem como polos de G(s)</b>: há um cancelamento entre polo e zero.</div>
      <SimSlot name="controlabilidade" />

      <h2>Observabilidade<Slide p={[13, 19]} /></h2>
      <p>Refere-se à possibilidade de determinar o estado inicial a partir da entrada e da saída num intervalo finito.</p>
      <Callout tag="Definição">Um sistema é <b>observável</b> se, para todo estado inicial <M>{'\\mathbf x_0'}</M>, existe <M>{'[0,t_f]'}</M> finito tal que conhecer <M>u(t)</M> e <M>y(t)</M>, <M>{'0\\le t\\le t_f'}</M>, basta para determinar <M>{'\\mathbf x_0'}</M>.</Callout>
      <MM>{String.raw`\mathcal O=\begin{bmatrix}C\\CA\\CA^2\\\vdots\\CA^{n-1}\end{bmatrix},\qquad\text{observável}\iff\posto(\mathcal O)=n\iff\posto\begin{bmatrix}A-\lambda I\\C\end{bmatrix}=n\ \ \forall\lambda`}</MM>
      <ul>
        <li><b>RLC dos slides</b> (2 Ω, 1 H, 1 F, 1 Ω): <M>{String.raw`A=\begin{bmatrix}-2&0\\0&-1\end{bmatrix},\ C=\begin{bmatrix}0&1\end{bmatrix}`}</M> ⇒ <M>{String.raw`\mathcal O=\begin{bmatrix}0&1\\0&-1\end{bmatrix}`}</M>, posto 1: não observável (a saída não "enxerga" <M>{'x_1'}</M>).</li>
        <li><b>Massa–mola</b> com <M>{'x_1'}</M> posição e <M>{'x_2'}</M> velocidade: medindo a posição, <M>{'\\mathcal O=I'}</M> — observável. Medindo a velocidade, <M>{String.raw`\mathcal O=\begin{bmatrix}0&1\\-k/m&-b/m\end{bmatrix}`}</M>, observável apenas se <M>{'k\\ne0'}</M>: sem mola, nenhuma medida de velocidade revela onde a massa está.</li>
        <li><M>{String.raw`A=\begin{bmatrix}4&-10\\3&-7\end{bmatrix},\ C=\begin{bmatrix}1&-2\end{bmatrix}`}</M>: <M>{String.raw`\mathcal O=\begin{bmatrix}1&-2\\-2&4\end{bmatrix}`}</M>, <M>{'\\det=0'}</M>. PBH: <M>{'\\lambda_1=-1'}</M> dá posto 1 (a 2ª coluna é múltipla da 1ª) — modo não observável; <M>{'\\lambda_2=-2'}</M> dá posto 2.</li>
      </ul>
      <p>As dinâmicas de autovalores não observáveis não aparecem na saída nem como polos de <M>G(s)</M>.</p>
      <SimSlot name="observabilidade" />

      <h2>Exercício dos slides<Slide p={20} /></h2>
      <Exercise id="t-co-2" src={{ p: 20 }} num="2" topic="Slides, aula 13"
        steps={[
          { title: 'Matriz de controlabilidade', body: <MM>{String.raw`B=\begin{bmatrix}0\\0\\1\end{bmatrix},\ AB=\begin{bmatrix}0\\1\\-6\end{bmatrix},\ A^2B=\begin{bmatrix}1\\-6\\25\end{bmatrix}\ \Rightarrow\ \mathcal C=\begin{bmatrix}0&0&1\\0&1&-6\\1&-6&25\end{bmatrix},\ \det\mathcal C=-1`}</MM> },
          { title: 'Matriz de observabilidade', body: <MM>{String.raw`C=\begin{bmatrix}1&0&0\end{bmatrix},\ CA=\begin{bmatrix}0&1&0\end{bmatrix},\ CA^2=\begin{bmatrix}0&0&1\end{bmatrix}\ \Rightarrow\ \mathcal O=I_3`}</MM> },
          { title: 'Teste PBH', body: <p>Autovalores de <M>A</M>: raízes de <M>{'\\lambda^3+6\\lambda^2+11\\lambda+6=(\\lambda+1)(\\lambda+2)(\\lambda+3)'}</M>. Para qualquer <M>{'\\lambda'}</M>, as duas primeiras linhas de <M>{'A-\\lambda I'}</M>, <M>{'[-\\lambda\\ \\ 1\\ \\ 0]'}</M> e <M>{'[0\\ -\\lambda\\ \\ 1]'}</M>, são independentes; acrescentando <M>{'B=e_3'}</M> (ou <M>{'C=e_1^T'}</M>) o posto chega a 3. Nenhum modo perde posto.</p> },
        ]}
        answer={<p>O sistema é controlável e observável (posto 3 nos dois testes). É a forma canônica controlável de <M>{'1/(s^3+6s^2+11s+6)'}</M>, sem cancelamentos.</p>}>
        <p>Verifique se o sistema <M>{String.raw`\dot{\mathbf x}=\begin{bmatrix}0&1&0\\0&0&1\\-6&-11&-6\end{bmatrix}\mathbf x+\begin{bmatrix}0\\0\\1\end{bmatrix}u,\ y=\begin{bmatrix}1&0&0\end{bmatrix}\mathbf x`}</M> é controlável e observável, pelos critérios de posto e PBH.</p>
      </Exercise>
      <Callout kind="tip" tag="Exercício 1 dos slides">Levante os modelos de estado dos circuitos desta aula e teste-os no simulador de controlabilidade e observabilidade acima.</Callout>
    </>
  )
}
