// Revisão de pré-requisitos (Cálculo, Álgebra, números complexos e Álgebra Linear)
const alg = () => import('./algebra.jsx')
const calc = () => import('./calculo.jsx')
const cpx = () => import('./complexos.jsx')
const al = () => import('./algebra-linear.jsx')
const pick = (f, name) => () => f().then((m) => ({ default: m[name] }))

export const AREAS = ['Álgebra e pré-cálculo', 'Cálculo', 'Números complexos', 'Álgebra Linear']

export const REVIEW = {
  polinomios: { area: 'Álgebra e pré-cálculo', title: 'Raízes de polinômios', desc: 'Bhaskara, discriminante, completar quadrado, Briot–Ruffini e divisão de polinômios.', load: pick(alg, 'Polinomios') },
  fracoes: { area: 'Álgebra e pré-cálculo', title: 'Frações parciais (a álgebra)', desc: 'Igualar coeficientes, método do "tampar" e frações com quadrático irredutível.', load: pick(alg, 'Fracoes') },
  'sistemas-lineares': { area: 'Álgebra e pré-cálculo', title: 'Sistemas lineares', desc: 'Substituição, eliminação, regra de Cramer e igualar coeficientes.', load: pick(alg, 'SistemasLineares') },
  trigonometria: { area: 'Álgebra e pré-cálculo', title: 'Trigonometria e amplitude–fase', desc: 'Radianos, arco-cosseno e A cos ωt + B sen ωt = R cos(ωt − φ).', load: pick(alg, 'Trigonometria') },
  'exp-log': { area: 'Álgebra e pré-cálculo', title: 'Exponencial e logaritmo', desc: 'Propriedades, 63% em uma constante de tempo, isolar ξ no sobressinal.', load: pick(alg, 'ExpLog') },
  derivadas: { area: 'Cálculo', title: 'Derivadas', desc: 'Regras do produto, do quociente e da cadeia; derivar exponenciais e senoides.', load: pick(calc, 'Derivadas') },
  integrais: { area: 'Cálculo', title: 'Integrais', desc: 'Integral de exponenciais, integral imprópria, por partes e a variável muda da convolução.', load: pick(calc, 'Integrais') },
  limites: { area: 'Cálculo', title: 'Limites', desc: 'Teoremas do valor inicial e final, ε na tabela de Routh, exponencial contra polinômio.', load: pick(calc, 'Limites') },
  taylor: { area: 'Cálculo', title: 'Série de Taylor e derivadas parciais', desc: 'Reta e plano tangente: a base da linearização.', load: pick(calc, 'Taylor') },
  'edo-basico': { area: 'Cálculo', title: 'O que é uma EDO', desc: 'Ordem, condições iniciais, conferir uma solução e por que tentar e^{st}.', load: pick(calc, 'EdoBasico') },
  complexos: { area: 'Números complexos', title: 'Números complexos', desc: 'Formas retangular e polar, módulo, argumento (atan2), produto e divisão.', load: pick(cpx, 'Complexos') },
  euler: { area: 'Números complexos', title: 'Fórmula de Euler', desc: 'e^{jθ} = cos θ + j sen θ e por que pares conjugados dão senoides reais.', load: pick(cpx, 'Euler') },
  matrizes: { area: 'Álgebra Linear', title: 'Operações com matrizes e inversa', desc: 'Produto linha × coluna, inversa 2 × 2 e o cálculo de C(sI − A)⁻¹B.', load: pick(al, 'Matrizes') },
  determinante: { area: 'Álgebra Linear', title: 'Determinante', desc: '2 × 2, 3 × 3 por cofatores, significado de área/volume e det = 0.', load: pick(al, 'Determinante') },
  autovalores: { area: 'Álgebra Linear', title: 'Autovalores e autovetores', desc: 'det(λI − A) = 0, encontrar autovetores e o que eles significam.', load: pick(al, 'Autovalores') },
  posto: { area: 'Álgebra Linear', title: 'Posto de uma matriz', desc: 'Linhas e colunas independentes, escalonamento e o teste PBH.', load: pick(al, 'Posto') },
}

// pré-requisitos sugeridos para cada tópico da disciplina
export const TOPIC_PREREQS = {
  classificacao: ['integrais', 'derivadas'],
  convolucao: ['integrais', 'exp-log'],
  edo: ['edo-basico', 'derivadas'],
  'metodo-classico': ['edo-basico', 'polinomios', 'complexos', 'sistemas-lineares', 'derivadas'],
  laplace: ['integrais', 'complexos', 'euler', 'fracoes', 'limites'],
  'edo-laplace': ['fracoes', 'polinomios', 'complexos', 'trigonometria'],
  'funcao-transferencia': ['polinomios', 'fracoes'],
  linearizacao: ['taylor', 'derivadas'],
  'diagrama-blocos': ['fracoes'],
  estabilidade: ['polinomios', 'limites', 'determinante'],
  'regime-transitorio': ['exp-log', 'polinomios', 'trigonometria'],
  'espaco-estados': ['matrizes', 'determinante', 'autovalores', 'fracoes'],
  controlabilidade: ['posto', 'autovalores', 'matrizes'],
  'sistemas-eletricos': ['derivadas', 'integrais'],
  'mecanicos-translacao': ['derivadas', 'edo-basico'],
  'mecanicos-rotacao': ['derivadas', 'edo-basico'],
  eletromecanicos: ['sistemas-lineares', 'limites'],
  fluidicos: ['taylor', 'matrizes'],
}
