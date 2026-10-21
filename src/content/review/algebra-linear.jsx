import { M, MM } from '../../components/Tex.jsx'
import { RSec, Passos, Check, Usos } from '../../components/Review.jsx'
import { SimSlot } from '../../sims/registry.jsx'

export function Matrizes() {
  return (
    <>
      <Usos>Modelos em espaço de estados <M>{'\\dot x=Ax+Bu'}</M>, a matriz de transição <M>{'(sI-A)^{-1}'}</M> e a conversão <M>{'G(s)=C(sI-A)^{-1}B+D'}</M>.</Usos>
      <RSec title="Produto: linha × coluna">
        <p>O elemento <M>{'(i,j)'}</M> de <M>AB</M> é a linha <M>i</M> de <M>A</M> "vezes" a coluna <M>j</M> de <M>B</M>. Só existe se o número de colunas de <M>A</M> é igual ao de linhas de <M>B</M>: <M>{'(m\\times n)(n\\times p)=(m\\times p)'}</M>. Em geral <M>{'AB\\neq BA'}</M>.</p>
        <MM>{String.raw`\begin{bmatrix}0&1\\-2&-3\end{bmatrix}\begin{bmatrix}x_1\\x_2\end{bmatrix}=\begin{bmatrix}0\cdot x_1+1\cdot x_2\\-2x_1-3x_2\end{bmatrix}`}</MM>
      </RSec>
      <RSec title="Inversa 2 × 2">
        <MM>{String.raw`\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\qquad\text{(troca a diagonal, inverte o sinal da outra, divide pelo determinante)}`}</MM>
        <p>Para 3 × 3: <M>{'A^{-1}=\\frac{1}{\\det A}\\operatorname{adj}(A)'}</M>, com a adjunta formada pelos cofatores transpostos.</p>
      </RSec>
      <RSec title="Exemplo 15 da aula 12, passo a passo">
        <Passos titulo="A = [0 1; −2 −3], B = [0,5; 0,5], C = [1 0], D = 0" steps={[
          { title: 'Montar sI − A', body: <MM>{String.raw`sI-A=\begin{bmatrix}s&0\\0&s\end{bmatrix}-\begin{bmatrix}0&1\\-2&-3\end{bmatrix}=\begin{bmatrix}s&-1\\2&s+3\end{bmatrix}`}</MM> },
          { title: 'Determinante', body: <MM>{String.raw`\det(sI-A)=s(s+3)-(-1)(2)=s^2+3s+2`}</MM> },
          { title: 'Inversa', body: <MM>{String.raw`(sI-A)^{-1}=\frac{1}{s^2+3s+2}\begin{bmatrix}s+3&1\\-2&s\end{bmatrix}`}</MM> },
          { title: 'Multiplicar por C à esquerda', body: <MM>{String.raw`C(sI-A)^{-1}=\frac{1}{s^2+3s+2}\begin{bmatrix}s+3&1\end{bmatrix}`}</MM> },
          { title: 'Multiplicar por B à direita', body: <MM>{String.raw`\frac{(s+3)(0{,}5)+1\cdot(0{,}5)}{s^2+3s+2}=\frac{0{,}5s+2}{s^2+3s+2}`}</MM> },
        ]} resposta={<M>{'G(s)=\\frac{0{,}5s+2}{s^2+3s+2}'}</M>} />
      </RSec>
      <Check q={<>Inverta <M>{String.raw`\begin{bmatrix}1&2\\3&4\end{bmatrix}`}</M>.</>}><p><M>{'\\det=4-6=-2'}</M> ⇒ <M>{String.raw`-\frac12\begin{bmatrix}4&-2\\-3&1\end{bmatrix}=\begin{bmatrix}-2&1\\1{,}5&-0{,}5\end{bmatrix}`}</M>.</p></Check>
    </>
  )
}

export function Determinante() {
  return (
    <>
      <Usos>Polinômio característico <M>{'\\det(sI-A)'}</M>, regra de Cramer, posto de matrizes quadradas e as contas cruzadas de Routh.</Usos>
      <RSec title="2 × 2 e 3 × 3">
        <MM>{String.raw`\begin{vmatrix}a&b\\c&d\end{vmatrix}=ad-bc\qquad\qquad \det A=\sum_j(-1)^{1+j}a_{1j}M_{1j}\ \ \text{(cofatores pela 1ª linha)}`}</MM>
        <p><M>{'M_{1j}'}</M> é o determinante que sobra ao apagar a linha 1 e a coluna <M>j</M>. Escolha a linha com mais zeros.</p>
      </RSec>
      <RSec title="Significado">
        <p><M>{'|\\det A|'}</M> é o fator pelo qual <M>A</M> multiplica áreas (2D) ou volumes (3D). <M>{'\\det A=0'}</M> ⇔ a matriz "achata" o espaço ⇔ as colunas são linearmente dependentes ⇔ não há inversa. Veja na simulação abaixo.</p>
      </RSec>
      <RSec title="Polinômio característico de uma matriz 3 × 3">
        <Passos titulo="A = [0 1 0; 0 0 1; −6 −11 −6] (aula 13, exercício 2)" steps={[
          { title: 'Montar λI − A', body: <MM>{String.raw`\lambda I-A=\begin{bmatrix}\lambda&-1&0\\0&\lambda&-1\\6&11&\lambda+6\end{bmatrix}`}</MM> },
          { title: 'Cofator de a₁₁ = λ', body: <MM>{String.raw`\lambda\begin{vmatrix}\lambda&-1\\11&\lambda+6\end{vmatrix}=\lambda\left[\lambda(\lambda+6)+11\right]=\lambda^3+6\lambda^2+11\lambda`}</MM> },
          { title: 'Cofator de a₁₂ = −1 (sinal −)', body: <MM>{String.raw`-(-1)\begin{vmatrix}0&-1\\6&\lambda+6\end{vmatrix}=+\left[0-(-6)\right]=6`}</MM> },
          { title: 'a₁₃ = 0 não contribui; somar', body: <MM>{String.raw`\det(\lambda I-A)=\lambda^3+6\lambda^2+11\lambda+6=(\lambda+1)(\lambda+2)(\lambda+3)`}</MM> },
        ]} resposta={<p>Autovalores −1, −2, −3. Note que a última linha de <M>A</M> traz os coeficientes do polinômio com sinal trocado — é a forma canônica controlável.</p>} />
      </RSec>
      <SimSlot name="matriz" />
      <Check q={<>Calcule <M>{String.raw`\begin{vmatrix}4&-10\\3&-7\end{vmatrix}`}</M>.</>}><p><M>{'4(-7)-(-10)(3)=-28+30=2'}</M>.</p></Check>
    </>
  )
}

export function Autovalores() {
  return (
    <>
      <Usos>Os autovalores de <M>A</M> são os polos do sistema; os autovetores definem as direções dos modos no espaço de estados; o teste PBH e a forma de Jordan dependem deles.</Usos>
      <RSec title="Definição">
        <MM>{String.raw`Av=\lambda v,\ v\neq0\quad\Longleftrightarrow\quad (A-\lambda I)v=0\ \text{tem solução não nula}\quad\Longleftrightarrow\quad\det(\lambda I-A)=0`}</MM>
        <p>Um autovetor é uma direção que <M>A</M> apenas estica ou encolhe (fator <M>{'\\lambda'}</M>), sem girar. Atalhos para 2 × 2: <b>soma dos autovalores = traço</b> (<M>{'a_{11}+a_{22}'}</M>) e <b>produto = determinante</b>.</p>
      </RSec>
      <RSec title="Exemplo (aula 13)">
        <Passos titulo="A = [0 1; 2 −1]" steps={[
          { title: 'Equação característica', body: <MM>{String.raw`\det\begin{bmatrix}\lambda&-1\\-2&\lambda+1\end{bmatrix}=\lambda(\lambda+1)-2=\lambda^2+\lambda-2=(\lambda-1)(\lambda+2)`}</MM> },
          { title: 'Autovalores', body: <p><M>{'\\lambda_1=1'}</M> (instável) e <M>{'\\lambda_2=-2'}</M>. Conferência: soma −1 = traço; produto −2 = det.</p> },
          { title: 'Autovetor de λ₁ = 1', body: <><MM>{String.raw`(A-I)v=\begin{bmatrix}-1&1\\2&-2\end{bmatrix}\begin{bmatrix}v_1\\v_2\end{bmatrix}=0\Rightarrow v_1=v_2\Rightarrow v=\begin{bmatrix}1\\1\end{bmatrix}`}</MM><p>As duas linhas são proporcionais (o determinante é zero): sempre sobra uma equação só.</p></> },
          { title: 'Autovetor de λ₂ = −2', body: <MM>{String.raw`(A+2I)v=\begin{bmatrix}2&1\\2&1\end{bmatrix}v=0\Rightarrow v_2=-2v_1\Rightarrow v=\begin{bmatrix}1\\-2\end{bmatrix}`}</MM> },
          { title: 'Conferir', body: <p><M>{String.raw`A\begin{bmatrix}1\\-2\end{bmatrix}=\begin{bmatrix}-2\\2+2\end{bmatrix}=-2\begin{bmatrix}1\\-2\end{bmatrix}`}</M> ✓</p> },
        ]} resposta={<p>No espaço de estados, uma condição inicial sobre a reta de <M>{'(1,-2)'}</M> decai como <M>{'e^{-2t}'}</M> sem sair da reta; sobre a de <M>{'(1,1)'}</M>, cresce como <M>{'e^{t}'}</M>.</p>} />
      </RSec>
      <RSec title="Autovalores complexos">
        <p>Se <M>{'\\det(\\lambda I-A)'}</M> tem raízes complexas, não há direção real que fique parada: a matriz gira os vetores e as trajetórias viram espirais.</p>
      </RSec>
      <SimSlot name="matriz" preset2={2} />
      <Check q={<>Autovalores de <M>{String.raw`\begin{bmatrix}4&-10\\3&-7\end{bmatrix}`}</M>?</>}><p>Traço −3, determinante 2 ⇒ <M>{'\\lambda^2+3\\lambda+2=0'}</M> ⇒ −1 e −2.</p></Check>
    </>
  )
}

export function Posto() {
  return (
    <>
      <Usos>Controlabilidade (<M>{'\\operatorname{posto}[B\\ AB\\ \\cdots]=n'}</M>), observabilidade e o teste PBH.</Usos>
      <RSec title="Definição">
        <p>O posto é o número máximo de linhas (ou de colunas — dá o mesmo) linearmente independentes. Para uma matriz quadrada <M>{'n\\times n'}</M>: posto <M>n</M> ⇔ <M>{'\\det\\neq0'}</M>.</p>
        <p>Linhas <b>dependentes</b>: uma é combinação das outras (por exemplo, múltipla).</p>
      </RSec>
      <RSec title="Como calcular: escalonamento">
        <p>Zere os elementos abaixo de cada pivô com operações entre linhas; o número de linhas não nulas que sobram é o posto.</p>
        <Passos titulo="𝒞 = [0 0 1; 0 1 −6; 1 −6 25] (aula 13, exercício 2)" steps={[
          { title: 'Trocar linhas para ter pivô', body: <MM>{String.raw`\begin{bmatrix}1&-6&25\\0&1&-6\\0&0&1\end{bmatrix}`}</MM> },
          { title: 'Já está escalonada', body: <p>Três linhas não nulas, em escada ⇒ posto 3. (Equivalente: <M>{'\\det\\mathcal C=-1\\neq0'}</M>.)</p> },
        ]} resposta={<p>Posto 3 = <M>n</M>: o sistema é controlável.</p>} />
      </RSec>
      <RSec title="Reconhecer dependência de cabeça">
        <ul>
          <li><M>{String.raw`\begin{bmatrix}-2&2\\-1&1\end{bmatrix}`}</M>: a 2ª coluna é −1 × a 1ª ⇒ posto 1 (aula 13, sistema não controlável).</li>
          <li>PBH em <M>{'\\lambda_2=-2'}</M>: <M>{String.raw`\begin{bmatrix}6&-10&-2\\3&-5&-1\end{bmatrix}`}</M> — a 1ª linha é 2 × a 2ª ⇒ posto 1 &lt; 2: modo não controlável.</li>
        </ul>
      </RSec>
      <Check q={<>Qual o posto de <M>{String.raw`\begin{bmatrix}1&2&3\\2&4&6\end{bmatrix}`}</M>?</>}><p>1: a 2ª linha é o dobro da 1ª.</p></Check>
    </>
  )
}
