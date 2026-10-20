// Polinômios com coeficientes reais, em ordem decrescente de potência (como no MATLAB):
// [1, 3, 2]  ->  s^2 + 3s + 2
import { C, cadd, csub, cmul, cdiv, cabs, cscale, cexp } from './complex.js'

export function trim(p) {
  let i = 0
  while (i < p.length - 1 && Math.abs(p[i]) < 1e-14) i++
  return p.slice(i)
}

export const degree = (p) => trim(p).length - 1

export function polyval(p, x) {
  let r = 0
  for (const c of p) r = r * x + c
  return r
}

export function cpolyval(p, z) {
  let r = C(0, 0)
  for (const c of p) r = cadd(cmul(r, z), C(c, 0))
  return r
}

// polinômio com coeficientes complexos
function cpolyvalC(p, z) {
  let r = C(0, 0)
  for (const c of p) r = cadd(cmul(r, z), c)
  return r
}

export function polymul(a, b) {
  const r = new Array(a.length + b.length - 1).fill(0)
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) r[i + j] += a[i] * b[j]
  return r
}

export function polyadd(a, b) {
  const n = Math.max(a.length, b.length)
  const r = new Array(n).fill(0)
  for (let i = 0; i < a.length; i++) r[n - a.length + i] += a[i]
  for (let i = 0; i < b.length; i++) r[n - b.length + i] += b[i]
  return trim(r)
}

export const polyscale = (a, k) => a.map((c) => c * k)

export function polyder(p) {
  const n = p.length - 1
  if (n <= 0) return [0]
  return p.slice(0, -1).map((c, i) => c * (n - i))
}

// divisão polinomial: retorna { q, r }
export function polydiv(num, den) {
  num = trim(num)
  den = trim(den)
  const n = num.length - 1
  const d = den.length - 1
  if (n < d) return { q: [0], r: num.slice() }
  const r = num.slice()
  const q = new Array(n - d + 1).fill(0)
  for (let i = 0; i <= n - d; i++) {
    const coef = r[i] / den[0]
    q[i] = coef
    for (let j = 0; j <= d; j++) r[i + j] -= coef * den[j]
  }
  return { q, r: trim(r.slice(n - d + 1)) }
}

// Raízes por método de Aberth–Ehrlich (convergência robusta para graus pequenos)
export function roots(pIn) {
  const p = trim(pIn)
  const n = p.length - 1
  if (n < 1) return []
  const a = p.map((c) => c / p[0])
  // raízes nulas exatas
  let zeros = 0
  let q = a.slice()
  while (q.length > 1 && Math.abs(q[q.length - 1]) < 1e-14) {
    q.pop()
    zeros++
  }
  const m = q.length - 1
  const out = []
  for (let i = 0; i < zeros; i++) out.push(C(0, 0))
  if (m === 0) return out
  if (m === 1) return [...out, C(-q[1], 0)]
  if (m === 2) {
    const [, b, c] = q
    const disc = b * b - 4 * c
    if (disc >= 0) {
      const sq = Math.sqrt(disc)
      // forma numericamente estável
      const r1 = (-b - Math.sign(b || 1) * sq) / 2
      const r2 = r1 !== 0 ? c / r1 : (-b + Math.sign(b || 1) * sq) / 2
      return [...out, C(r1, 0), C(r2, 0)]
    }
    const sq = Math.sqrt(-disc)
    return [...out, C(-b / 2, sq / 2), C(-b / 2, -sq / 2)]
  }
  const dq = polyder(q)
  // estimativa inicial: círculo com raio de Cauchy
  const R = 1 + Math.max(...q.slice(1).map(Math.abs))
  let z = []
  for (let k = 0; k < m; k++) {
    const th = (2 * Math.PI * k) / m + 0.4
    z.push(C(R * 0.7 * Math.cos(th), R * 0.7 * Math.sin(th)))
  }
  for (let iter = 0; iter < 500; iter++) {
    let maxStep = 0
    const nz = z.slice()
    for (let k = 0; k < m; k++) {
      const pv = cpolyval(q, z[k])
      const dv = cpolyval(dq, z[k])
      if (cabs(pv) < 1e-300) continue
      const ratio = cdiv(pv, dv)
      let sum = C(0, 0)
      for (let j = 0; j < m; j++) if (j !== k) sum = cadd(sum, cdiv(C(1, 0), csub(z[k], z[j])))
      const w = cdiv(ratio, csub(C(1, 0), cmul(ratio, sum)))
      nz[k] = csub(z[k], w)
      maxStep = Math.max(maxStep, cabs(w) / (1 + cabs(z[k])))
    }
    z = nz
    if (maxStep < 1e-15) break
  }
  // limpeza: parte imaginária desprezível -> real
  z = z.map((r) => {
    const scale = 1 + cabs(r)
    return Math.abs(r.im) < 1e-7 * scale ? C(r.re, 0) : r
  })
  return [...out, ...sortRoots(z)]
}

export function sortRoots(rs) {
  return rs.slice().sort((x, y) => (Math.abs(x.re - y.re) > 1e-9 ? y.re - x.re : y.im - x.im))
}

// polinômio mônico a partir das raízes (raízes complexas devem vir em pares conjugados)
export function fromRoots(rs) {
  let p = [C(1, 0)]
  for (const r of rs) {
    const np = new Array(p.length + 1).fill(null).map(() => C(0, 0))
    for (let i = 0; i < p.length; i++) {
      np[i] = cadd(np[i], p[i])
      np[i + 1] = csub(np[i + 1], cmul(p[i], r))
    }
    p = np
  }
  return p.map((c) => (Math.abs(c.re) < 1e-12 ? 0 : c.re))
}

// agrupa raízes repetidas: [{ p, m }]
export function groupRoots(rs, tol = 1e-4) {
  const groups = []
  for (const r of rs) {
    const g = groups.find((g) => cabs(csub(g.p, r)) < tol * (1 + cabs(r)))
    if (g) {
      g.sum = cadd(g.sum, r)
      g.m++
      g.p = cscale(g.sum, 1 / g.m)
    } else groups.push({ p: r, m: 1, sum: r })
  }
  return groups.map(({ p, m }) => ({ p: Math.abs(p.im) < 1e-6 ? C(p.re, 0) : p, m }))
}

// coeficientes de Taylor de um polinômio (complexo) em torno de z0: p(z0 + h) = Σ c_k h^k
function taylorAt(pc, z0, count) {
  let coefs = pc.slice()
  const out = []
  for (let k = 0; k < count; k++) {
    if (coefs.length === 0) {
      out.push(C(0, 0))
      continue
    }
    // divisão sintética por (z - z0): resto = valor, quociente = próximos coeficientes
    const qq = []
    let acc = C(0, 0)
    for (let i = 0; i < coefs.length; i++) {
      acc = cadd(cmul(acc, z0), coefs[i])
      if (i < coefs.length - 1) qq.push(acc)
    }
    out.push(acc)
    coefs = qq
  }
  return out
}

/**
 * Expansão em frações parciais de X(s) = num(s)/den(s).
 * Retorna { direct: [coeficientes do quociente], terms: [{ p, m, coefs: [D0..D_{m-1}] }] }
 * em que o termo D_k aparece sobre (s - p)^(m-k)  (mesma convenção dos slides).
 */
export function residue(numIn, denIn) {
  const num = trim(numIn)
  const den = trim(denIn)
  const lead = den[0]
  let direct = [0]
  let N = num.map((c) => c / lead)
  const D = den.map((c) => c / lead)
  if (N.length >= D.length) {
    const { q, r } = polydiv(N, D)
    direct = q
    N = r
  }
  const groups = groupRoots(roots(D)).map(({ p, m }) => {
    if (m === 1) return { p, m }
    // refina a raiz múltipla com Newton sobre a derivada de ordem m-1 (raiz simples dela)
    let dd = D
    for (let k = 0; k < m - 1; k++) dd = polyder(dd)
    const d1 = polyder(dd)
    let z = p
    for (let it = 0; it < 30; it++) {
      const f = cpolyval(dd, z)
      const fp = cpolyval(d1, z)
      if (cabs(fp) < 1e-300) break
      const step = cdiv(f, fp)
      z = csub(z, step)
      if (cabs(step) < 1e-15 * (1 + cabs(z))) break
    }
    return { p: Math.abs(z.im) < 1e-9 ? C(z.re, 0) : z, m }
  })
  const terms = groups.map(({ p, m }, gi) => {
    // Q(s) = produto (s - p_j)^{m_j}, j != gi
    let Q = [C(1, 0)]
    groups.forEach((g, j) => {
      if (j === gi) return
      for (let k = 0; k < g.m; k++) {
        const np = new Array(Q.length + 1).fill(null).map(() => C(0, 0))
        for (let i = 0; i < Q.length; i++) {
          np[i] = cadd(np[i], Q[i])
          np[i + 1] = csub(np[i + 1], cmul(Q[i], g.p))
        }
        Q = np
      }
    })
    const Nc = N.map((c) => C(c, 0))
    const nT = taylorAt(Nc, p, m)
    const qT = taylorAt(Q, p, m)
    // divisão de séries: h = n / q
    const h = []
    for (let k = 0; k < m; k++) {
      let acc = nT[k]
      for (let j = 1; j <= k; j++) acc = csub(acc, cmul(qT[j], h[k - j]))
      h.push(cdiv(acc, qT[0]))
    }
    return { p, m, coefs: h.map(clean) }
  })
  return { direct, terms }
}

const clean = (z) => C(Math.abs(z.re) < 1e-10 ? 0 : z.re, Math.abs(z.im) < 1e-10 ? 0 : z.im)

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1))

// avaliador numérico da transformada inversa (parte estritamente própria)
export function inverseLaplaceFn(num, den) {
  const { terms } = residue(num, den)
  return (t) => {
    if (t < 0) return 0
    let acc = 0
    for (const { p, m, coefs } of terms) {
      const ept = cexp(cscale(p, t))
      for (let k = 0; k < m; k++) {
        const pw = m - k - 1
        const factor = Math.pow(t, pw) / fact(pw)
        acc += cmul(coefs[k], ept).re * factor
      }
    }
    return acc
  }
}
