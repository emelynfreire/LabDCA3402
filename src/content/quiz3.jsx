import Quiz from '../components/Quiz.jsx'
import { M } from '../components/Tex.jsx'

const T = { el: 'Sistemas elétricos', mt: 'Mecânicos translacionais', mr: 'Mecânicos rotacionais', em: 'Eletromecânicos', fl: 'Fluídicos' }

const questions = [
  { topic: T.el, q: <p>A impedância de um capacitor no domínio <M>s</M> (CI nulas) é:</p>,
    options: [<M>{'Cs'}</M>, <M>{'\\frac{1}{Cs}'}</M>, <M>{'C'}</M>, <M>{'\\frac{s}{C}'}</M>],
    correct: 1, explain: <p><M>{'i=C\\dot v\\Rightarrow I=CsV\\Rightarrow Z=V/I=1/(Cs)'}</M>.</p> },
  { topic: T.el, q: <p>No RLC série com saída no capacitor, <M>{'\\xi'}</M> vale:</p>,
    options: [<M>{'\\frac{R}{2}\\sqrt{\\frac{C}{L}}'}</M>, <M>{'\\frac{1}{\\sqrt{LC}}'}</M>, <M>{'RC'}</M>, <M>{'\\frac{L}{R}'}</M>],
    correct: 0, explain: <p>De <M>{'LCs^2+RCs+1'}</M>: <M>{'\\omega_n=1/\\sqrt{LC}'}</M> e <M>{'2\\xi\\omega_n=R/L'}</M>.</p> },
  { topic: T.mt, q: <p>Na analogia força–tensão, a massa corresponde a:</p>,
    options: [<>resistência</>, <>capacitância</>, <>indutância</>, <>inverso da indutância</>],
    correct: 2, explain: <p><M>{'m\\ddot x+b\\dot x+kx=f'}</M> ↔ <M>{'L\\ddot q+R\\dot q+q/C=e'}</M>: <M>{'m\\leftrightarrow L'}</M>, <M>{'b\\leftrightarrow R'}</M>, <M>{'k\\leftrightarrow1/C'}</M>.</p> },
  { topic: T.mt, q: <p>Um sistema com duas massas e duas molas tem, em geral, FT com denominador de grau:</p>,
    options: [<>2</>, <>3</>, <>4</>, <>6</>],
    correct: 2, explain: <p>Quatro armazenadores de energia (duas massas, duas molas) ⇒ quatro estados.</p> },
  { topic: T.mr, q: <p>Num par de engrenagens com <M>{'N_1=10'}</M> e <M>{'N_2=50'}</M>, uma inércia <M>{'J_2'}</M> no eixo 2 aparece no eixo 1 como:</p>,
    options: [<M>{'5J_2'}</M>, <M>{'J_2/5'}</M>, <M>{'J_2/25'}</M>, <M>{'25J_2'}</M>],
    correct: 2, explain: <p><M>{'J_2(N_1/N_2)^2=J_2/25'}</M>: a redução faz a carga parecer mais leve para o motor.</p> },
  { topic: T.em, q: <p>No motor CC, a força contraeletromotriz é proporcional a:</p>,
    options: [<>corrente de armadura</>, <>velocidade angular</>, <>torque de carga</>, <>tensão aplicada</>],
    correct: 1, explain: <p><M>{'e_b=K_b\\omega'}</M>. É por isso que a corrente cai à medida que o motor acelera.</p> },
  { topic: T.em, q: <p>Desprezar a indutância de armadura do motor CC transforma <M>{'\\Omega(s)/V(s)'}</M> em:</p>,
    options: [<>um sistema de 1ª ordem</>, <>um integrador puro</>, <>um sistema de 3ª ordem</>, <>um ganho puro</>],
    correct: 0, explain: <p><M>{'\\frac{K_t}{R(Js+B)+K_tK_b}'}</M>: um polo só. É uma aproximação por polo dominante.</p> },
  { topic: T.fl, q: <p>Num tanque com saída laminar, <M>{'H(s)/Q_{in}(s)'}</M> é:</p>,
    options: [<M>{'\\frac{R}{ARs+1}'}</M>, <M>{'\\frac{1}{As}'}</M>, <M>{'\\frac{A}{Rs+1}'}</M>, <M>{'AR'}</M>],
    correct: 0, explain: <p><M>{'A\\dot h=q_{in}-h/R'}</M>: 1ª ordem com constante de tempo <M>{'AR'}</M>, o análogo do circuito RC.</p> },
]

export default function Quiz3() {
  return <Quiz unit={3} questions={questions} />
}
