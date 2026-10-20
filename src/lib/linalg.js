// Álgebra linear para matrizes pequenas (arrays de linhas)
import { roots } from './poly.js'

export const zeros = (r, c) => Array.from({ length: r }, () => new Array(c).fill(0))
export const eye = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)))
export const clone = (A) => A.map((r) => r.slice())

export function matmul(A, B) {
  const r = A.length, c = B[0].length, n = B.length
  const out = zeros(r, c)
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
    let s = 0
    for (let k = 0; k < n; k++) s += A[i][k] * B[k][j]
    out[i][j] = s
  }
  return out
}

export const matvec = (A, x) => A.map((row) => row.reduce((s, a, j) => s + a * x[j], 0))
export const matadd = (A, B) => A.map((r, i) => r.map((v, j) => v + B[i][j]))
export const matscale = (A, k) => A.map((r) => r.map((v) => v * k))
export const transpose = (A) => A[0].map((_, j) => A.map((r) => r[j]))
export const hcat = (...Ms) => Ms[0].map((_, i) => Ms.flatMap((M) => M[i]))
export const vcat = (...Ms) => Ms.flatMap((M) => M.map((r) => r.slice()))

// posto por eliminação gaussiana com pivoteamento parcial
export function rank(Ain, tol = 1e-9) {
  const A = clone(Ain)
  const rows = A.length, cols = A[0].length
  const scale = Math.max(1, ...A.flat().map(Math.abs))
  let r = 0
  for (let c = 0; c < cols && r < rows; c++) {
    let piv = r
    for (let i = r + 1; i < rows; i++) if (Math.abs(A[i][c]) > Math.abs(A[piv][c])) piv = i
    if (Math.abs(A[piv][c]) < tol * scale) continue
    ;[A[r], A[piv]] = [A[piv], A[r]]
    for (let i = r + 1; i < rows; i++) {
      const f = A[i][c] / A[r][c]
      for (let j = c; j < cols; j++) A[i][j] -= f * A[r][j]
    }
    r++
  }
  return r
}

export function det(Ain) {
  const A = clone(Ain)
  const n = A.length
  let d = 1
  for (let c = 0; c < n; c++) {
    let piv = c
    for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[piv][c])) piv = i
    if (Math.abs(A[piv][c]) < 1e-14) return 0
    if (piv !== c) {
      ;[A[c], A[piv]] = [A[piv], A[c]]
      d = -d
    }
    d *= A[c][c]
    for (let i = c + 1; i < n; i++) {
      const f = A[i][c] / A[c][c]
      for (let j = c; j < n; j++) A[i][j] -= f * A[c][j]
    }
  }
  return d
}

// polinômio característico det(sI - A) por Faddeev–LeVerrier: [1, a1, ..., an]
export function charpoly(A) {
  const n = A.length
  let M = zeros(n, n)
  const coefs = [1]
  let AM
  for (let k = 1; k <= n; k++) {
    // M_k = A M_{k-1} + c_{k-1} I
    AM = matmul(A, M)
    M = matadd(AM, matscale(eye(n), coefs[k - 1]))
    const AMk = matmul(A, M)
    let tr = 0
    for (let i = 0; i < n; i++) tr += AMk[i][i]
    coefs.push(-tr / k)
  }
  return coefs
}

export const eig = (A) => roots(charpoly(A))

// vetor do núcleo de (A - λI) para λ real (n = 2 ou 3)
export function nullVector(Min) {
  const n = Min.length
  if (n === 2) {
    const [[a, b], [c, d]] = Min
    if (Math.abs(a) + Math.abs(b) > Math.abs(c) + Math.abs(d)) return normalize([-b, a].every((v) => v === 0) ? [1, 0] : [-b, a])
    return normalize([-d, c].every((v) => v === 0) ? [1, 0] : [-d, c])
  }
  // n = 3: produto vetorial das duas linhas mais independentes
  const rows = Min
  let best = null, bestN = 0
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
    const v = cross(rows[i], rows[j])
    const nv = Math.hypot(...v)
    if (nv > bestN) { bestN = nv; best = v }
  }
  if (!best || bestN < 1e-10) return [1, 0, 0]
  return normalize(best)
}

export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const normalize = (v) => {
  const n = Math.hypot(...v) || 1
  return v.map((x) => x / n)
}

// exponencial matricial por escalonamento e quadratura + série de Taylor
export function expm(A, t = 1) {
  const n = A.length
  let M = matscale(A, t)
  const norm = Math.max(...M.map((r) => r.reduce((s, v) => s + Math.abs(v), 0)))
  const sPow = Math.max(0, Math.ceil(Math.log2(norm + 1e-300)) + 1)
  M = matscale(M, 1 / Math.pow(2, sPow))
  let term = eye(n)
  let sum = eye(n)
  for (let k = 1; k < 20; k++) {
    term = matscale(matmul(term, M), 1 / k)
    sum = matadd(sum, term)
  }
  for (let i = 0; i < sPow; i++) sum = matmul(sum, sum)
  return sum
}
