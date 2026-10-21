// Gera referências da plataforma (ou de uma simulação) em ABNT, APA e BibTeX.
import { course } from '../content/course.js'

const MESES_ABNT = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

const pad = (n) => String(n).padStart(2, '0')
export const acessoABNT = (d) => `${d.getDate()} ${MESES_ABNT[d.getMonth()]} ${d.getFullYear()}`
const acessoAPA = (d) => `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const simUrl = (key) => `${course.site}#/laboratorio?sim=${key}`

/**
 * Cada formato devolve { text, html } — html só com <b>/<i> para mostrar o destaque
 * tipográfico que a norma pede (negrito na ABNT, itálico na APA).
 */
export function referencia(formato, { sim = null, data = new Date() } = {}) {
  const { titulo, ano, site } = course
  const url = sim ? simUrl(sim.key) : site
  if (formato === 'abnt') {
    const todo = [`<b>${titulo}</b>`, titulo]
    const fim = `Natal, ${ano}. Disponível em: ${url}. Acesso em: ${acessoABNT(data)}.`
    if (sim) {
      const t = `FREIRE, Emelyn Clementino. ${sim.title}. In: FREIRE, Emelyn Clementino. `
      return { html: `${t}${todo[0]}. ${fim}`, text: `${t}${todo[1]}. ${fim}` }
    }
    const t = 'FREIRE, Emelyn Clementino. '
    return { html: `${t}${todo[0]}. ${fim}`, text: `${t}${todo[1]}. ${fim}` }
  }
  if (formato === 'apa') {
    const rec = `Recuperado em ${acessoAPA(data)}, de ${url}`
    if (sim) {
      const t = `Freire, E. C. (${ano}). `
      return {
        html: `${t}<i>${sim.title}</i> [Simulação interativa]. ${titulo}. ${rec}`,
        text: `${t}${sim.title} [Simulação interativa]. ${titulo}. ${rec}`,
      }
    }
    const tt = titulo
    return { html: `Freire, E. C. (${ano}). <i>${tt}</i> [Aplicação web]. ${rec}`, text: `Freire, E. C. (${ano}). ${tt} [Aplicação web]. ${rec}` }
  }
  // BibTeX (@misc funciona em qualquer estilo; biblatex aceita urldate)
  const key = sim ? `freire${ano}${sim.key.toLowerCase()}` : `freire${ano}plataforma`
  const title = sim ? `${sim.title} [Simulação interativa]` : titulo
  const lines = [
    `@misc{${key},`,
    `  author       = {Freire, Emelyn Clementino},`,
    `  title        = {{${title}}},`,
    ...(sim ? [`  howpublished = {Simulação da ${titulo}},`] : []),
    `  year         = {${ano}},`,
    `  url          = {${url}},`,
    `  urldate      = {${iso(data)}},`,
    `  note         = {Código-fonte: ${course.repo}. Acesso em: ${acessoABNT(data)}}`,
    `}`,
  ]
  const text = lines.join('\n')
  return { text, html: text.replace(/&/g, '&amp;').replace(/</g, '&lt;') }
}

/** Citação no texto (autor-data) */
export const citacaoTexto = { abnt: [`(FREIRE, ${course.ano})`, `Freire (${course.ano})`], apa: [`(Freire, ${course.ano})`, `Freire (${course.ano})`] }
