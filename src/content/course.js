// Estrutura da disciplina conforme o cronograma da turma T02 (2026.2) no SIGAA.
export const course = {
  code: 'DCA3402',
  name: 'Modelagem e Análise Linear de Sistemas',
  turma: 'T02 · 2026.2',
  professor: 'Prof. Anderson Luiz de Oliveira Cavalcanti',
  dept: 'Departamento de Engenharia de Computação e Automação (DCA) · UFRN',
  autora: 'Emelyn Freire',
}

export const units = [
  {
    id: 1,
    title: 'Unidade 1',
    name: 'Representação de sistemas lineares',
    summary: 'Classificação, convolução, EDOs, Transformada de Laplace e funções de transferência.',
    exam: { label: '1ª avaliação', date: '2026-09-17' },
    lista: 1,
    listaPdf: 'lista-1.pdf',
  },
  {
    id: 2,
    title: 'Unidade 2',
    name: 'Análise de sistemas lineares',
    summary: 'Linearização, diagramas de blocos, estabilidade, regime transitório, espaço de estados, controlabilidade e observabilidade.',
    exam: { label: '2ª avaliação', date: '2026-10-29' },
    lista: 2,
    listaPdf: 'lista-2.pdf',
  },
  {
    id: 3,
    title: 'Unidade 3',
    name: 'Modelagem de sistemas físicos',
    summary: 'Sistemas elétricos, mecânicos (translação e rotação), eletromecânicos e fluídicos.',
    exam: null,
    preview: true,
  },
]

// slides: nome do arquivo de slides do professor correspondente (quando existe)
export const topics = [
  { id: 'introducao', unit: 1, title: 'Introdução aos sistemas dinâmicos', date: '2026-08-11', slides: '1 – introdução', pdf: '01-introducao.pdf', pages: 28 },
  { id: 'classificacao', unit: 1, title: 'Classificação de sistemas', date: '2026-08-13', slides: '2 – classificação de sistemas', pdf: '02-classificacao-sistemas.pdf', pages: 25 },
  { id: 'convolucao', unit: 1, title: 'Integral de convolução', date: '2026-08-18', slides: '3 – integral de convolução', pdf: '03-integral-convolucao.pdf', pages: 28 },
  { id: 'edo', unit: 1, title: 'Representação por equações diferenciais', date: '2026-08-20', slides: '4 – equações diferenciais', pdf: '04-equacoes-diferenciais.pdf', pages: 19 },
  { id: 'metodo-classico', unit: 1, title: 'Solução de EDOs pelo método clássico', date: '2026-08-20', slides: '5 – método clássico', pdf: '05-metodo-classico.pdf', pages: 28 },
  { id: 'laplace', unit: 1, title: 'Transformada de Laplace', date: '2026-08-25', slides: '6 – transformada de Laplace', pdf: '06-transformada-laplace.pdf', pages: 36 },
  { id: 'edo-laplace', unit: 1, title: 'Solução de EDOs por Laplace', date: '2026-09-01', slides: '7 – solução de EDO por Laplace', pdf: '07-solucao-edo-laplace.pdf', pages: 14 },
  { id: 'funcao-transferencia', unit: 1, title: 'Funções de transferência', date: '2026-09-03', slides: '8 – funções de transferência', pdf: '08-funcoes-transferencia.pdf', pages: 29 },
  { id: 'linearizacao', unit: 2, title: 'Linearização de sistemas', date: '2026-09-22', slides: null },
  { id: 'diagrama-blocos', unit: 2, title: 'Diagramas de blocos', date: '2026-09-24', slides: '9 – diagrama de blocos', pdf: '09-diagrama-blocos.pdf', pages: 29 },
  { id: 'estabilidade', unit: 2, title: 'Estabilidade BIBO e Routh–Hurwitz', date: '2026-09-29', slides: '10 – estabilidade', pdf: '10-estabilidade.pdf', pages: 47 },
  { id: 'regime-transitorio', unit: 2, title: 'Resposta de 1ª e 2ª ordem', date: '2026-10-01', slides: '11 – análise em regime transitório', pdf: '11-regime-transitorio.pdf', pages: 35 },
  { id: 'espaco-estados', unit: 2, title: 'Modelos em espaço de estados', date: '2026-10-13', slides: '12 – modelos em espaço de estados', pdf: '12-espaco-estados.pdf', pages: 41 },
  { id: 'controlabilidade', unit: 2, title: 'Controlabilidade e observabilidade', date: '2026-10-20', slides: '13 – controlabilidade e observabilidade', pdf: '13-controlabilidade-observabilidade.pdf', pages: 20 },
  { id: 'sistemas-eletricos', unit: 3, title: 'Modelagem de sistemas elétricos', date: '2026-11-03', slides: null },
  { id: 'mecanicos-translacao', unit: 3, title: 'Sistemas mecânicos translacionais', date: '2026-11-05', slides: null },
  { id: 'mecanicos-rotacao', unit: 3, title: 'Sistemas mecânicos rotacionais', date: '2026-11-12', slides: null },
  { id: 'eletromecanicos', unit: 3, title: 'Sistemas eletromecânicos', date: '2026-11-19', slides: null },
  { id: 'fluidicos', unit: 3, title: 'Sistemas fluídicos', date: '2026-11-26', slides: null },
].map((t, i) => ({ ...t, n: i + 1 }))

export const schedule = [
  { date: '2026-08-11', label: 'Introdução ao universo dos sistemas dinâmicos' },
  { date: '2026-08-13', label: 'Classificação de sistemas dinâmicos' },
  { date: '2026-08-18', label: 'Integral de convolução' },
  { date: '2026-08-20', label: 'EDO e método clássico' },
  { date: '2026-08-25', label: 'Transformada de Laplace (até 01/09)' },
  { date: '2026-09-03', label: 'Funções de transferência (até 10/09)' },
  { date: '2026-09-15', label: 'Aula de exercícios – Lista 1' },
  { date: '2026-09-17', label: '1ª avaliação', exam: true },
  { date: '2026-09-22', label: 'Linearização de sistemas' },
  { date: '2026-09-24', label: 'Diagrama de blocos' },
  { date: '2026-09-29', label: 'Estabilidade' },
  { date: '2026-10-01', label: 'Resposta de 1ª e 2ª ordem (até 08/10)' },
  { date: '2026-10-13', label: 'Espaço de estados (até 22/10)' },
  { date: '2026-10-27', label: 'Aula de exercícios – Lista 2' },
  { date: '2026-10-29', label: '2ª avaliação', exam: true },
  { date: '2026-11-03', label: 'Modelagem de sistemas elétricos' },
  { date: '2026-11-05', label: 'Sistemas mecânicos translacionais (até 10/11)' },
  { date: '2026-11-12', label: 'Sistemas mecânicos rotacionais (até 17/11)' },
  { date: '2026-11-19', label: 'Sistemas eletromecânicos (até 24/11)' },
  { date: '2026-11-26', label: 'Sistemas fluídicos (até 01/12)' },
]

export const topicById = (id) => topics.find((t) => t.id === id)
export const topicsOf = (unit) => topics.filter((t) => t.unit === unit)

export function brDate(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}`
}
