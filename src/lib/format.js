// Formatação numérica e LaTeX (padrão brasileiro: vírgula decimal)
import { trim } from './poly.js'

export function fmt(x, digits = 3) {
  if (x === null || x === undefined || Number.isNaN(x)) return '—'
  if (!isFinite(x)) return x > 0 ? '∞' : '−∞'
  if (Math.abs(x) < 1e-10) return '0'
  const r = Number(x.toPrecision(digits + 1))
  let s = Math.abs(r) >= 1e5 || Math.abs(r) < 1e-3 ? r.toExponential(2) : String(+r.toFixed(digits))
  return s.replace('-', '−').replace('.', ',')
}

// número em LaTeX com vírgula decimal ( {,} evita espaço extra )
export function texNum(x, digits = 3) {
  return fmt(x, digits).replace(',', '{,}').replace('−', '-')
}

export function texComplex(z, digits = 3) {
  const re = Math.abs(z.re) < 1e-10 ? 0 : z.re
  const im = Math.abs(z.im) < 1e-10 ? 0 : z.im
  if (im === 0) return texNum(re, digits)
  const imPart = `j${texNum(Math.abs(im), digits)}`
  if (re === 0) return (im < 0 ? '-' : '') + imPart
  return `${texNum(re, digits)} ${im < 0 ? '-' : '+'} ${imPart}`
}

// polinômio em LaTeX
export function texPoly(pIn, v = 's', digits = 3) {
  const p = trim(pIn)
  const n = p.length - 1
  let out = ''
  p.forEach((c, i) => {
    const pw = n - i
    if (Math.abs(c) < 1e-12) return
    const sign = c < 0 ? '-' : '+'
    const a = Math.abs(c)
    const coef = Math.abs(a - 1) < 1e-12 && pw > 0 ? '' : texNum(a, digits)
    const varPart = pw === 0 ? '' : pw === 1 ? v : `${v}^{${pw}}`
    const term = coef + varPart
    out += out === '' ? (sign === '-' ? '-' : '') + term : ` ${sign} ${term}`
  })
  return out || '0'
}

export const texFrac = (num, den) => `\\dfrac{${num}}{${den}}`
