// Critério de Routh–Hurwitz com os dois casos especiais vistos em aula
import { polyder } from './poly.js'

const EPS = 1e-6

/**
 * coefs: [a0, a1, ..., an] (potências decrescentes)
 * Retorna { rows: [{ power, values, note }], first: [], changes, events: [] }
 * Os valores com ε são avaliados numericamente com ε = 1e-6 (o sinal é o que importa).
 */
export function routh(coefsIn) {
  const coefs = coefsIn.slice()
  const n = coefs.length - 1
  const width = Math.ceil((n + 1) / 2)
  const rows = []
  const events = []
  const r0 = [], r1 = []
  for (let i = 0; i <= n; i += 2) r0.push(coefs[i])
  for (let i = 1; i <= n; i += 2) r1.push(coefs[i])
  while (r0.length < width) r0.push(0)
  while (r1.length < width) r1.push(0)
  rows.push({ power: n, values: r0, note: '' })
  if (n >= 1) rows.push({ power: n - 1, values: r1, note: '' })
  let epsUsed = false
  for (let k = 2; k <= n; k++) {
    const a = rows[k - 2].values
    const b = rows[k - 1].values.slice()
    const scale = Math.max(1, ...b.map(Math.abs), ...a.map(Math.abs))
    // linha inteira nula -> polinômio auxiliar
    if (b.every((v) => Math.abs(v) < 1e-9 * scale)) {
      const prev = rows[k - 2]
      const deg = prev.power
      const aux = []
      prev.values.forEach((v, i) => {
        const pw = deg - 2 * i
        if (pw >= 0) {
          aux.push(v)
          if (pw > 0) aux.push(0)
        }
      })
      const d = polyder(aux)
      const repl = []
      for (let i = 0; i < d.length; i += 2) repl.push(d[i])
      while (repl.length < width) repl.push(0)
      rows[k - 1] = { power: rows[k - 1].power, values: repl, note: 'linha nula substituída por dP/ds', aux }
      events.push({ type: 'zero-row', power: rows[k - 1].power, aux })
      k--
      continue
    }
    if (Math.abs(b[0]) < 1e-9 * scale) {
      b[0] = EPS
      rows[k - 1] = { ...rows[k - 1], values: b, note: 'zero na 1ª coluna substituído por ε', eps: true }
      events.push({ type: 'eps', power: rows[k - 1].power })
      epsUsed = true
    }
    const next = []
    for (let j = 0; j < width; j++) {
      const a2 = a[j + 1] ?? 0
      const b2 = b[j + 1] ?? 0
      next.push((b[0] * a2 - a[0] * b2) / b[0])
    }
    rows.push({ power: n - k, values: next.map((v) => (Math.abs(v) < 1e-12 ? 0 : v)), note: '' })
  }
  const first = rows.map((r) => r.values[0])
  let changes = 0
  for (let i = 1; i < first.length; i++) if (Math.sign(first[i]) !== Math.sign(first[i - 1]) && first[i] !== 0 && first[i - 1] !== 0) changes++
  return { rows, first, changes, events, epsUsed }
}
