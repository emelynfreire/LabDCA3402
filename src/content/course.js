// Organização do conteúdo de Modelagem e Análise Linear de Sistemas (baseado em DCA3402/UFRN).
export const course = {
  code: 'DCA3402',
  name: 'Modelagem e Análise Linear de Sistemas',
  professor: 'Prof. Anderson Luiz de Oliveira Cavalcanti',
  dept: 'Departamento de Engenharia de Computação e Automação (DCA) · UFRN',
  autora: 'Emelyn Clementino Freire',
  autoraGithub: 'https://github.com/emelynfreire',
  repo: 'https://github.com/emelynfreire/LabDCA3402',
  site: 'https://emelynfreire.github.io/LabDCA3402/',
  titulo: 'Plataforma de estudos de Modelagem e Análise Linear de Sistemas',
  ano: 2026,
}

// Bibliografia da disciplina (plano de curso), usada em Sobre e em Como citar.
export const BIBLIO = [
  'LATHI, B. P. <i>Linear Systems and Signals</i>. 2. ed. Oxford: Oxford University Press, 2005.',
  'MEDEIROS, A. A. D. <i>Apostila de Modelagem e Análise de Sistemas Dinâmicos</i>. Natal: UFRN, 2003.',
  'CAMPOS, M. C. M. M.; TEIXEIRA, H. <i>Controles típicos de equipamentos e processos industriais</i>. São Paulo: Blucher, 2015.',
  'DÓREA, C. E. T. <i>Enciclopédia de Automática: Controle e Automação</i>. v. 1. 2007.',
]

export const units = [
  {
    id: 1,
    title: 'Unidade 1',
    name: 'Representação de sistemas lineares',
    summary: 'Classificação, convolução, EDOs, Transformada de Laplace e funções de transferência.',
    lista: 1,
    listaPdf: 'lista-1.pdf',
  },
  {
    id: 2,
    title: 'Unidade 2',
    name: 'Análise de sistemas lineares',
    summary: 'Linearização, diagramas de blocos, estabilidade, regime transitório, espaço de estados, controlabilidade e observabilidade.',
    lista: 2,
    listaPdf: 'lista-2.pdf',
  },
  {
    id: 3,
    title: 'Unidade 3',
    name: 'Modelagem de sistemas físicos',
    summary: 'Sistemas elétricos, mecânicos (translação e rotação), eletromecânicos e fluídicos.',
    preview: true,
  },
]

// slides: nome do arquivo de slides do professor correspondente (quando existe)
export const topics = [
  { id: 'introducao', unit: 1, title: 'Introdução aos sistemas dinâmicos', slides: '1 – introdução', pdf: '01-introducao.pdf', pages: 28 },
  { id: 'classificacao', unit: 1, title: 'Classificação de sistemas', slides: '2 – classificação de sistemas', pdf: '02-classificacao-sistemas.pdf', pages: 25 },
  { id: 'convolucao', unit: 1, title: 'Integral de convolução', slides: '3 – integral de convolução', pdf: '03-integral-convolucao.pdf', pages: 28 },
  { id: 'edo', unit: 1, title: 'Representação por equações diferenciais', slides: '4 – equações diferenciais', pdf: '04-equacoes-diferenciais.pdf', pages: 19 },
  { id: 'metodo-classico', unit: 1, title: 'Solução de EDOs pelo método clássico', slides: '5 – método clássico', pdf: '05-metodo-classico.pdf', pages: 28 },
  { id: 'laplace', unit: 1, title: 'Transformada de Laplace', slides: '6 – transformada de Laplace', pdf: '06-transformada-laplace.pdf', pages: 36 },
  { id: 'edo-laplace', unit: 1, title: 'Solução de EDOs por Laplace', slides: '7 – solução de EDO por Laplace', pdf: '07-solucao-edo-laplace.pdf', pages: 14 },
  { id: 'funcao-transferencia', unit: 1, title: 'Funções de transferência', slides: '8 – funções de transferência', pdf: '08-funcoes-transferencia.pdf', pages: 29 },
  { id: 'linearizacao', unit: 2, title: 'Linearização de sistemas', slides: null },
  { id: 'diagrama-blocos', unit: 2, title: 'Diagramas de blocos', slides: '9 – diagrama de blocos', pdf: '09-diagrama-blocos.pdf', pages: 29 },
  { id: 'estabilidade', unit: 2, title: 'Estabilidade BIBO e Routh–Hurwitz', slides: '10 – estabilidade', pdf: '10-estabilidade.pdf', pages: 47 },
  { id: 'regime-transitorio', unit: 2, title: 'Resposta de 1ª e 2ª ordem', slides: '11 – análise em regime transitório', pdf: '11-regime-transitorio.pdf', pages: 35 },
  { id: 'espaco-estados', unit: 2, title: 'Modelos em espaço de estados', slides: '12 – modelos em espaço de estados', pdf: '12-espaco-estados.pdf', pages: 41 },
  { id: 'controlabilidade', unit: 2, title: 'Controlabilidade e observabilidade', slides: '13 – controlabilidade e observabilidade', pdf: '13-controlabilidade-observabilidade.pdf', pages: 20 },
  { id: 'sistemas-eletricos', unit: 3, title: 'Modelagem de sistemas elétricos', slides: null },
  { id: 'mecanicos-translacao', unit: 3, title: 'Sistemas mecânicos translacionais', slides: null },
  { id: 'mecanicos-rotacao', unit: 3, title: 'Sistemas mecânicos rotacionais', slides: null },
  { id: 'eletromecanicos', unit: 3, title: 'Sistemas eletromecânicos', slides: null },
  { id: 'fluidicos', unit: 3, title: 'Sistemas fluídicos', slides: null },
].map((t, i) => ({ ...t, n: i + 1 }))


export const topicById = (id) => topics.find((t) => t.id === id)
export const topicsOf = (unit) => topics.filter((t) => t.unit === unit)

