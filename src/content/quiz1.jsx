import Quiz from '../components/Quiz.jsx'
import { M } from '../components/Tex.jsx'

const T = {
  class: 'Classificação de sistemas', conv: 'Integral de convolução', edo: 'Representação por EDO', mc: 'Método clássico',
  lap: 'Transformada de Laplace', el: 'Solução de EDOs por Laplace', ft: 'Funções de transferência', intro: 'Introdução',
}

const questions = [
  { topic: T.intro, q: <p>Qual é a principal vantagem do controle em malha fechada sobre o de malha aberta?</p>,
    options: [<>Usar menos componentes</>, <>Reduzir a sensibilidade a variações de parâmetros e rejeitar perturbações</>, <>Garantir estabilidade em qualquer situação</>, <>Dispensar sensores</>],
    correct: 1, explain: <p>A realimentação compara a saída medida com a desejada e corrige desvios causados por perturbações ou mudanças de parâmetros. Ela exige mais componentes (sensor) e pode até <b>perder</b> estabilidade se mal projetada.</p> },
  { topic: T.class, q: <p>O sistema <M>{'y(t)=5u(t)-3'}</M> é:</p>,
    options: [<>linear e invariante</>, <>não linear (afim), invariante, sem memória</>, <>linear e variante</>, <>não linear e com memória</>],
    correct: 1, explain: <p>Com <M>u=0</M> a saída é −3: viola a homogeneidade. Os coeficientes são constantes (invariante) e a saída só depende de <M>u(t)</M> (sem memória).</p> },
  { topic: T.class, q: <p>Por que <M>{'\\dot y+2t\\,y=u'}</M> é variante no tempo?</p>,
    options: [<>Porque tem derivada</>, <>Porque não é linear</>, <>Porque um coeficiente depende explicitamente de t</>, <>Porque não é causal</>],
    correct: 2, explain: <p>O coeficiente <M>2t</M> muda com o tempo: a mesma entrada aplicada em instantes diferentes gera respostas diferentes. O sistema continua linear.</p> },
  { topic: T.conv, q: <p>Para um SLIT causal e relaxado em <M>t=0</M>, a saída é:</p>,
    options: [<M>{'y(t)=\\int_{-\\infty}^{\\infty}g(\\tau)u(\\tau)\\,d\\tau'}</M>, <M>{'y(t)=\\int_0^t g(t-\\tau)u(\\tau)\\,d\\tau'}</M>, <M>{'y(t)=g(t)\\,u(t)'}</M>, <M>{'y(t)=\\int_0^t g(\\tau)\\,d\\tau'}</M>],
    correct: 1, explain: <p>Linearidade leva à integral com <M>{'g(t,\\tau)'}</M>; causalidade corta o limite superior em <M>t</M>; sistema relaxado corta o inferior em 0; invariância transforma <M>{'g(t,\\tau)'}</M> em <M>{'g(t-\\tau)'}</M>.</p> },
  { topic: T.conv, q: <p>Com <M>{'g(t)=e^{-t}'}</M> e <M>{'u(t)=e^{-t}'}</M>, a convolução vale:</p>,
    options: [<M>{'e^{-2t}'}</M>, <M>{'\\tfrac12(1-e^{-2t})'}</M>, <M>{'t\\,e^{-t}'}</M>, <M>{'e^{-t}'}</M>],
    correct: 2, explain: <p><M>{'\\int_0^t e^{-(t-\\tau)}e^{-\\tau}d\\tau=e^{-t}\\int_0^t d\\tau=te^{-t}'}</M>. Em <M>s</M>: <M>{'1/(s+1)^2'}</M>, polo duplo.</p> },
  { topic: T.edo, q: <p>A ordem da EDO que modela um sistema físico está associada a:</p>,
    options: [<>número de entradas</>, <>número de elementos armazenadores de energia ou massa independentes</>, <>número de resistores</>, <>grau do numerador da FT</>],
    correct: 1, explain: <p>Cada armazenador independente (capacitor, indutor, massa, mola, tanque) introduz uma derivada — e uma condição inicial, que é parte da memória do sistema.</p> },
  { topic: T.mc, q: <p>As raízes características de uma EDO são −2 (dupla). A solução homogênea tem a forma:</p>,
    options: [<M>{'C_1e^{-2t}+C_2e^{-2t}'}</M>, <M>{'D_0te^{-2t}+D_1e^{-2t}'}</M>, <M>{'C_1e^{-2t}\\cos t+C_2e^{-2t}\\sen t'}</M>, <M>{'C\\,t^2e^{-2t}'}</M>],
    correct: 1, explain: <p>Raiz de multiplicidade 2 gera <M>{'e^{pt}'}</M> e <M>{'te^{pt}'}</M>. Somar duas vezes <M>{'e^{-2t}'}</M> não dá duas funções independentes.</p> },
  { topic: T.mc, q: <p>Em <M>{'\\ddot y+3\\dot y+2y=4'}</M>, qual é a solução particular?</p>,
    options: [<M>{'y_p=4'}</M>, <M>{'y_p=2'}</M>, <M>{'y_p=4t'}</M>, <M>{'y_p=2e^{-t}'}</M>],
    correct: 1, explain: <p>Entrada constante, tentativa constante: <M>{'2\\beta=4\\Rightarrow\\beta=2'}</M>.</p> },
  { topic: T.lap, q: <p><M>{'\\mathcal L\\{e^{-t}\\cos 2t\\}'}</M> é:</p>,
    options: [<M>{'\\frac{s}{s^2+4}'}</M>, <M>{'\\frac{s+1}{(s+1)^2+4}'}</M>, <M>{'\\frac{2}{(s+1)^2+4}'}</M>, <M>{'\\frac{s-1}{(s-1)^2+4}'}</M>],
    correct: 1, explain: <p>Deslocamento em <M>s</M>: <M>{'\\mathcal L\\{e^{s_0t}x(t)\\}=X(s-s_0)'}</M>, com <M>{'s_0=-1'}</M> e <M>{'X(s)=s/(s^2+4)'}</M>.</p> },
  { topic: T.lap, q: <p>Pelo teorema do valor final, se <M>{'Y(s)=\\frac{6}{s(s^2+5s+3)}'}</M>, então <M>{'y(\\infty)'}</M> vale:</p>,
    options: [<>0</>, <>6</>, <>2</>, <>não existe</>],
    correct: 2, explain: <p><M>{'\\lim_{s\\to0}sY(s)=6/3=2'}</M>. Vale porque os polos de <M>{'sY'}</M> estão no semiplano esquerdo (o limite no tempo existe).</p> },
  { topic: T.lap, q: <p>Para um par de polos complexos com resíduo <M>{'C=-0{,}75+j0{,}5625'}</M>, o ângulo correto de <M>C</M> é:</p>,
    options: [<>−0,64 rad</>, <>2,5 rad</>, <>0,64 rad</>, <>−2,5 rad</>],
    correct: 1, explain: <p>O ponto está no 2º quadrante (parte real negativa, imaginária positiva). <M>{'\\tan^{-1}(0{,}5625/-0{,}75)'}</M> dá −0,64 rad, que é do 4º quadrante; o atan2 corrige para 2,5 rad.</p> },
  { topic: T.el, q: <p>Ao resolver uma EDO por Laplace, as condições iniciais entram:</p>,
    options: [<>só no final, como no método clássico</>, <>na propriedade da derivada: <M>{'\\mathcal L\\{\\dot y\\}=sY-y(0^-)'}</M></>, <>na função de transferência</>, <>não entram; Laplace pressupõe CI nulas</>],
    correct: 1, explain: <p>É a transformada unilateral que embute as CI; por isso o resultado já é a resposta completa. Quem pressupõe CI nulas é a <b>função de transferência</b>.</p> },
  { topic: T.ft, q: <p>A função <M>{'G(s)=\\frac{s^3+1}{s^2+3s+2}'}</M> é:</p>,
    options: [<>estritamente própria</>, <>biprópria</>, <>imprópria, e não é fisicamente realizável</>, <>própria com grau relativo 1</>],
    correct: 2, explain: <p><M>{'m=3>n=2'}</M>: imprópria, grau relativo −1. A saída dependeria de derivadas da entrada.</p> },
  { topic: T.ft, q: <p>A resposta ao impulso de um SLIT é <M>{'g(t)=2e^{-t}-e^{-3t}'}</M>. Sua FT é:</p>,
    options: [<M>{'\\frac{s+5}{s^2+4s+3}'}</M>, <M>{'\\frac{1}{s^2+4s+3}'}</M>, <M>{'\\frac{2s-1}{s^2+4s+3}'}</M>, <M>{'\\frac{s+5}{s(s^2+4s+3)}'}</M>],
    correct: 0, explain: <p><M>{'G=\\mathcal L\\{g\\}=\\frac{2}{s+1}-\\frac{1}{s+3}=\\frac{2(s+3)-(s+1)}{(s+1)(s+3)}=\\frac{s+5}{s^2+4s+3}'}</M>.</p> },
  { topic: T.ft, q: <p>Um polo de <M>G(s)</M> em <M>{'-2\\pm j3'}</M> gera na resposta um termo do tipo:</p>,
    options: [<M>{'e^{3t}\\cos 2t'}</M>, <M>{'e^{-2t}\\cos(3t+\\theta)'}</M>, <M>{'e^{-2t}+e^{3t}'}</M>, <M>{'te^{-2t}'}</M>],
    correct: 1, explain: <p>Parte real → decaimento <M>{'e^{\\alpha t}'}</M>; parte imaginária → frequência de oscilação <M>{'\\beta'}</M>.</p> },
  { topic: T.ft, q: <p>Com <M>{'G(s)=\\frac{4}{s(s+2)}'}</M> e entrada degrau, por que aparece um termo em <M>t</M> na resposta?</p>,
    options: [<>Porque o sistema é instável no sentido de ter polo no SPD</>, <>Porque o polo de G em s = 0 coincide com o polo do degrau, formando polo duplo em Y(s)</>, <>Porque a FT é imprópria</>, <>Porque as condições iniciais não são nulas</>],
    correct: 1, explain: <p><M>{'Y=\\frac{4}{s^2(s+2)}'}</M>: o polo duplo em 0 gera <M>{'2t-1'}</M>. É a "combinação" entre entrada e sistema vista nos slides.</p> },
]

export default function Quiz1() {
  return <Quiz unit={1} questions={questions} />
}
