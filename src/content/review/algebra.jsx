import { M, MM } from '../../components/Tex.jsx'
import { RSec, Passos, Check, Usos } from '../../components/Review.jsx'
import { SimSlot } from '../../sims/registry.jsx'

export function Polinomios() {
  return (
    <>
      <Usos>Polinômio característico de uma EDO, denominador da função de transferência (os polos), tabela de Routh e projeto por especificações.</Usos>
      <RSec title="Grau 2: discriminante e Bhaskara">
        <MM>{String.raw`as^2+bs+c=0\quad\Rightarrow\quad s=\frac{-b\pm\sqrt{\Delta}}{2a},\qquad \Delta=b^2-4ac`}</MM>
        <ul>
          <li><M>{'\\Delta>0'}</M>: duas raízes reais distintas.</li>
          <li><M>{'\\Delta=0'}</M>: uma raiz real dupla, <M>{'-b/2a'}</M>.</li>
          <li><M>{'\\Delta<0'}</M>: par complexo <M>{String.raw`-\frac{b}{2a}\pm j\frac{\sqrt{-\Delta}}{2a}`}</M>.</li>
        </ul>
        <p>Conferência rápida (com <M>a=1</M>): a <b>soma</b> das raízes é <M>-b</M> e o <b>produto</b> é <M>c</M>. Em <M>{'s^2+5s+6'}</M>: −2 e −3 somam −5 e multiplicam 6.</p>
      </RSec>
      <RSec title="Completar o quadrado">
        <p>Transforma o quadrático na forma da tabela de Laplace <M>{'(s-\\alpha)^2+\\beta^2'}</M>:</p>
        <MM>{String.raw`s^2+bs+c=\left(s+\tfrac b2\right)^2+\left(c-\tfrac{b^2}{4}\right)\qquad\text{ex.: } s^2+4s+13=(s+2)^2+9=(s+2)^2+3^2`}</MM>
      </RSec>
      <RSec title="Grau 3 ou mais: achar uma raiz e dividir">
        <p>Teste como raiz os divisores do termo constante (com os dois sinais). Achando uma raiz <M>r</M>, divida por <M>{'(s-r)'}</M> com Briot–Ruffini e sobra um polinômio de grau menor.</p>
        <Passos titulo="Exemplo: s³ + 6s² + 11s + 6" steps={[
          { title: 'Candidatos', body: <p>Divisores de 6: <M>{'\\pm1,\\pm2,\\pm3,\\pm6'}</M>. Como todos os coeficientes são positivos, só raízes negativas são possíveis.</p> },
          { title: 'Testar s = −1', body: <p><M>{'(-1)^3+6(-1)^2+11(-1)+6=-1+6-11+6=0'}</M> ✓</p> },
          { title: 'Briot–Ruffini com r = −1', body: <><p>Baixa o primeiro coeficiente; multiplica por <M>r</M> e soma com o próximo:</p><MM>{String.raw`\begin{array}{c|cccc} -1 & 1 & 6 & 11 & 6\\ & & -1 & -5 & -6\\\hline & 1 & 5 & 6 & 0\end{array}`}</MM><p>O resto é 0 e o quociente é <M>{'s^2+5s+6'}</M>.</p></> },
          { title: 'Fatorar o quociente', body: <p><M>{'s^2+5s+6=(s+2)(s+3)'}</M>.</p> },
        ]} resposta={<M>{'s^3+6s^2+11s+6=(s+1)(s+2)(s+3)'}</M>} />
      </RSec>
      <RSec title="Divisão de polinômios">
        <p>Quando o numerador tem grau maior ou igual ao do denominador (função biprópria), divide-se antes das frações parciais. Exemplo da aula 12:</p>
        <MM>{String.raw`\frac{0{,}5s^3+3s^2+2{,}5s+4}{s^3+4s^2+5s+2}=0{,}5+\frac{(3-2)s^2+(2{,}5-2{,}5)s+(4-1)}{s^3+4s^2+5s+2}=0{,}5+\frac{s^2+3}{s^3+4s^2+5s+2}`}</MM>
        <p>O quociente 0,5 é a razão dos coeficientes líderes; o resto é o numerador menos <M>{'0{,}5\\times'}</M> o denominador.</p>
      </RSec>
      <SimSlot name="bhaskara" />
      <Check q={<>Quais são as raízes de <M>{'s^2+2s+5'}</M>?</>}><p><M>{'\\Delta=4-20=-16'}</M> ⇒ <M>{'s=\\frac{-2\\pm j4}{2}=-1\\pm j2'}</M>. Completando o quadrado: <M>{'(s+1)^2+2^2'}</M>.</p></Check>
    </>
  )
}

export function Fracoes() {
  return (
    <>
      <Usos>Transformada inversa de Laplace (Unidade 1), forma de Jordan (aula 12) e simplificação de funções de malha fechada.</Usos>
      <RSec title="A ideia">
        <p>Uma fração racional com denominador fatorado pode ser escrita como soma de frações mais simples — e cada uma delas está na tabela de Laplace. É a operação inversa de "somar frações tirando o MMC".</p>
        <MM>{String.raw`\frac{1}{s+2}-\frac{1}{s+4}=\frac{(s+4)-(s+2)}{(s+2)(s+4)}=\frac{2}{(s+2)(s+4)}\qquad\text{(somar)}\qquad\longleftrightarrow\qquad\text{(decompor)}`}</MM>
      </RSec>
      <RSec title="Dois métodos para achar os coeficientes">
        <Passos titulo="10 / [(s + 2)(s + 4)] = A/(s + 2) + B/(s + 4)" steps={[
          { title: 'Método 1: igualar coeficientes', body: <><p>Multiplique tudo por <M>{'(s+2)(s+4)'}</M>:</p><MM>{String.raw`10=A(s+4)+B(s+2)=(A+B)s+(4A+2B)`}</MM><p>Iguale os coeficientes de cada potência: <M>{'A+B=0'}</M> e <M>{'4A+2B=10'}</M> ⇒ <M>{'A=5,\\ B=-5'}</M>.</p></> },
          { title: 'Método 2: "tampar" (resíduo)', body: <><p>Para achar <M>A</M>, tampe o fator <M>{'(s+2)'}</M> e substitua <M>{'s=-2'}</M> no que sobra:</p><MM>{String.raw`A=\frac{10}{s+4}\Big|_{s=-2}=\frac{10}{2}=5,\qquad B=\frac{10}{s+2}\Big|_{s=-4}=\frac{10}{-2}=-5`}</MM><p>Funciona porque, ao multiplicar por <M>{'(s+2)'}</M>, o termo de <M>B</M> fica com fator <M>{'(s+2)'}</M>, que zera em <M>{'s=-2'}</M>.</p></> },
        ]} resposta={<p><M>{'\\frac{5}{s+2}-\\frac{5}{s+4}\\ \\to\\ 5e^{-2t}-5e^{-4t}'}</M> (Lista 1, 13a).</p>} />
      </RSec>
      <RSec title="Raiz repetida">
        <p>Para <M>{'(s+1)^2'}</M> entram <b>dois</b> termos: <M>{'\\frac{D_0}{(s+1)^2}+\\frac{D_1}{s+1}'}</M>. Às vezes dá para fazer de cabeça, reescrevendo o numerador:</p>
        <MM>{String.raw`\frac{s+3}{(s+1)^2}=\frac{(s+1)+2}{(s+1)^2}=\frac{1}{s+1}+\frac{2}{(s+1)^2}\ \to\ e^{-t}+2te^{-t}`}</MM>
        <p>No caso geral, <M>{'D_0'}</M> sai do "tampar" e <M>{'D_1'}</M> da derivada (veja a revisão de derivadas).</p>
      </RSec>
      <RSec title="Quadrático irredutível sem usar números complexos">
        <p>Alternativa ao resíduo complexo: deixe o quadrático inteiro com numerador <M>{'Bs+C'}</M>.</p>
        <Passos titulo="(2s + 1) / [s(s² + 2s + 2)]  — Lista 1, 13d" steps={[
          { title: 'Forma', body: <MM>{String.raw`\frac{2s+1}{s(s^2+2s+2)}=\frac{A}{s}+\frac{Bs+C}{s^2+2s+2}`}</MM> },
          { title: 'A pelo "tampar"', body: <p><M>{'A=\\frac{2s+1}{s^2+2s+2}\\big|_{s=0}=\\frac12'}</M>.</p> },
          { title: 'Igualar coeficientes', body: <><MM>{String.raw`2s+1=\tfrac12(s^2+2s+2)+(Bs+C)s`}</MM><p><M>{'s^2'}</M>: <M>{'\\frac12+B=0\\Rightarrow B=-\\frac12'}</M>; <M>s</M>: <M>{'1+C=2\\Rightarrow C=1'}</M>.</p></> },
          { title: 'Completar o quadrado e separar', body: <MM>{String.raw`\frac{-\frac12s+1}{(s+1)^2+1}=-\frac12\cdot\frac{s+1}{(s+1)^2+1}+\frac32\cdot\frac{1}{(s+1)^2+1}`}</MM> },
          { title: 'Tabela', body: <p><M>{'\\frac{s+1}{(s+1)^2+1}\\to e^{-t}\\cos t'}</M> e <M>{'\\frac{1}{(s+1)^2+1}\\to e^{-t}\\operatorname{sen} t'}</M>.</p> },
        ]} resposta={<M>{String.raw`f(t)=\tfrac12-\tfrac12e^{-t}\cos t+\tfrac32e^{-t}\operatorname{sen} t`}</M>} />
      </RSec>
      <Check q={<>Decomponha <M>{'\\frac{1}{s(s+1)}'}</M>.</>}><p><M>{'A=\\frac{1}{s+1}\\big|_0=1'}</M>, <M>{'B=\\frac1s\\big|_{-1}=-1'}</M> ⇒ <M>{'\\frac1s-\\frac1{s+1}'}</M>, que no tempo é <M>{'1-e^{-t}'}</M>.</p></Check>
    </>
  )
}

export function SistemasLineares() {
  return (
    <>
      <Usos>Constantes do método clássico, ganhos em projetos (Lista 2, questões 9 a 11), igualar coeficientes nas frações parciais e na alocação de polos.</Usos>
      <RSec title="Substituição">
        <Passos titulo="C₁ + C₂ = −3 e 2C₁ + 3C₂ = 1 (slides, aula 5)" steps={[
          { title: 'Isolar uma incógnita', body: <p>Da primeira: <M>{'C_1=-3-C_2'}</M>.</p> },
          { title: 'Substituir na outra', body: <p><M>{'2(-3-C_2)+3C_2=1\\Rightarrow -6+C_2=1\\Rightarrow C_2=7'}</M>.</p> },
          { title: 'Voltar', body: <p><M>{'C_1=-3-7=-10'}</M>.</p> },
        ]} resposta={<p><M>{'C_1=-10,\\ C_2=7'}</M>; logo <M>{'y=4-10e^{-2t}+7e^{-3t}'}</M>.</p>} />
      </RSec>
      <RSec title="Regra de Cramer (2 × 2)">
        <MM>{String.raw`\begin{cases}ax+by=e\\cx+dy=f\end{cases}\quad\Rightarrow\quad x=\frac{\begin{vmatrix}e&b\\f&d\end{vmatrix}}{\begin{vmatrix}a&b\\c&d\end{vmatrix}}=\frac{ed-bf}{ad-bc},\qquad y=\frac{af-ec}{ad-bc}`}</MM>
        <p>Só funciona se <M>{'ad-bc\\neq0'}</M> (veja a revisão de determinante).</p>
      </RSec>
      <RSec title="Igualar coeficientes (alocação de polos)">
        <p>Lista 2, questão 10: a equação característica <M>{'s^2+(1+k_1k_2)s+k_1'}</M> deve ser <M>{'(s+10)^2=s^2+20s+100'}</M>. Dois polinômios são iguais quando cada coeficiente é igual:</p>
        <MM>{String.raw`k_1=100,\qquad 1+k_1k_2=20\ \Rightarrow\ k_2=\frac{19}{100}=0{,}19`}</MM>
      </RSec>
      <Check q={<>Resolva <M>{'x+y=3'}</M>, <M>{'x-y=1'}</M>.</>}><p>Somando as equações: <M>{'2x=4\\Rightarrow x=2'}</M>; daí <M>{'y=1'}</M>.</p></Check>
    </>
  )
}

export function Trigonometria() {
  return (
    <>
      <Usos>Respostas oscilatórias <M>{'e^{\\alpha t}\\cos(\\beta t+\\theta)'}</M>, a abordagem 1 × abordagem 2 das frações parciais, o ângulo <M>{'\\beta=\\cos^{-1}\\xi'}</M> e o tempo de subida.</Usos>
      <RSec title="Radianos e valores úteis">
        <p>Em <M>{'\\cos(\\omega t)'}</M> o argumento está em <b>radianos</b> (calculadora em RAD!). <M>{'\\pi\\ \\text{rad}=180^\\circ'}</M>.</p>
        <div className="tbl-wrap"><table className="tbl num small"><thead><tr><th>θ</th><th>0</th><th>π/6</th><th>π/4</th><th>π/3</th><th>π/2</th><th>π</th></tr></thead>
          <tbody><tr><td>cos θ</td><td>1</td><td>0,866</td><td>0,707</td><td>0,5</td><td>0</td><td>−1</td></tr><tr><td>sen θ</td><td>0</td><td>0,5</td><td>0,707</td><td>0,866</td><td>1</td><td>0</td></tr></tbody></table></div>
        <p>Arco-cosseno: <M>{'\\beta=\\cos^{-1}(0{,}6)=0{,}927\\ \\text{rad}'}</M> (Lista 2, questão 3).</p>
      </RSec>
      <RSec title="Soma de seno e cosseno = um cosseno defasado">
        <MM>{String.raw`A\cos\omega t+B\operatorname{sen}\omega t=R\cos(\omega t-\varphi),\qquad R=\sqrt{A^2+B^2},\quad \varphi=\operatorname{atan2}(B,A)`}</MM>
        <p>Vem de <M>{'\\cos(x-\\varphi)=\\cos x\\cos\\varphi+\\operatorname{sen}x\\operatorname{sen}\\varphi'}</M>: basta ter <M>{'R\\cos\\varphi=A'}</M> e <M>{'R\\operatorname{sen}\\varphi=B'}</M>.</p>
        <Passos titulo="−cos t − sen t na forma R cos(t + θ) (slides 7, p. 13)" steps={[
          { title: 'Identificar A e B', body: <p><M>{'A=-1'}</M>, <M>{'B=-1'}</M>.</p> },
          { title: 'Amplitude', body: <p><M>{'R=\\sqrt{1+1}=\\sqrt2'}</M>.</p> },
          { title: 'Fase (cuidado com o quadrante)', body: <p>O ponto <M>{'(A,B)=(-1,-1)'}</M> está no 3º quadrante: <M>{'\\varphi=\\operatorname{atan2}(-1,-1)=-\\frac{3\\pi}{4}'}</M>. Uma calculadora com <M>{'\\tan^{-1}(B/A)=\\tan^{-1}(1)'}</M> daria <M>{'\\pi/4'}</M>, errado.</p> },
        ]} resposta={<M>{String.raw`-\cos t-\operatorname{sen} t=\sqrt2\cos\!\left(t+\tfrac{3\pi}{4}\right)`}</M>} />
      </RSec>
      <Check q={<>Escreva <M>{'3\\cos2t+4\\operatorname{sen}2t'}</M> como um só cosseno.</>}><p><M>{'R=5'}</M>, <M>{'\\varphi=\\operatorname{atan2}(4,3)=0{,}927'}</M> ⇒ <M>{'5\\cos(2t-0{,}927)'}</M>.</p></Check>
    </>
  )
}

export function ExpLog() {
  return (
    <>
      <Usos>Constante de tempo, tempo de estabilização, sobressinal, decaimento dos modos e convolução com exponenciais.</Usos>
      <RSec title="Propriedades">
        <MM>{String.raw`e^{a}e^{b}=e^{a+b},\qquad \frac{e^{a}}{e^{b}}=e^{a-b},\qquad (e^{a})^{k}=e^{ka},\qquad \ln(e^{x})=x,\qquad e^{\ln x}=x`}</MM>
        <p>Exemplo da convolução: <M>{'e^{-2(t-\\tau)}=e^{-2t}e^{2\\tau}'}</M> — o fator <M>{'e^{-2t}'}</M> sai da integral em <M>{'\\tau'}</M>.</p>
      </RSec>
      <RSec title="De onde vêm 63%, 95% e 98%">
        <p>Em <M>{'y=1-e^{-t/T}'}</M>: com <M>t=T</M>, <M>{'1-e^{-1}=1-0{,}368=0{,}632'}</M>. Com <M>3T</M>: <M>{'1-e^{-3}=0{,}950'}</M>. Com <M>4T</M>: <M>{'1-e^{-4}=0{,}982'}</M>.</p>
        <p>Ao contrário: quanto tempo para faltar só 2%? <M>{'e^{-t/T}=0{,}02\\Rightarrow t=T\\ln50\\approx3{,}9T\\approx4T'}</M>.</p>
      </RSec>
      <RSec title="Isolar ξ a partir do sobressinal">
        <Passos titulo="Que ξ dá Mp = 16%? (Lista 2, questão 7)" steps={[
          { title: 'Aplicar ln dos dois lados', body: <MM>{String.raw`e^{-\xi\pi/\sqrt{1-\xi^2}}=0{,}16\ \Rightarrow\ \frac{\xi\pi}{\sqrt{1-\xi^2}}=-\ln0{,}16=1{,}833`}</MM> },
          { title: 'Elevar ao quadrado', body: <MM>{String.raw`\xi^2\pi^2=1{,}833^2(1-\xi^2)=3{,}36(1-\xi^2)`}</MM> },
          { title: 'Isolar', body: <MM>{String.raw`\xi^2=\frac{3{,}36}{\pi^2+3{,}36}=\frac{3{,}36}{13{,}23}=0{,}254\ \Rightarrow\ \xi=0{,}504`}</MM> },
        ]} resposta={<><p>Fórmula geral: <M>{String.raw`\xi=\frac{-\ln M_p}{\sqrt{\pi^2+\ln^2M_p}}`}</M>.</p></>} />
      </RSec>
      <Check q={<>Quanto vale <M>{'e^{-3}'}</M>, aproximadamente, e o que isso diz sobre um sistema de 1ª ordem em <M>{'t=3T'}</M>?</>}><p><M>{'e^{-3}\\approx0{,}05'}</M>: falta 5% para o valor final — por isso <M>{'t_{ss}=3T'}</M> no critério de 5%.</p></Check>
    </>
  )
}
