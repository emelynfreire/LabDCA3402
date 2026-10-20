// Simulação de sistemas lineares: funções de transferência e espaço de estados
import { trim, polydiv } from './poly.js'

// Forma canônica controlável (mesma convenção dos slides): G(s) = D + (b1 s^{n-1} + ... + bn)/(s^n + a1 s^{n-1} + ... + an)
export function tf2ss(numIn, denIn) {
  const den = trim(denIn)
  const lead = den[0]
  let num = trim(numIn).map((c) => c / lead)
  const a = den.map((c) => c / lead)
  const n = a.length - 1
  let D = 0
  if (num.length > n) {
    const { q, r } = polydiv(num, a)
    D = q[q.length - 1]
    num = r
  }
  const b = new Array(n).fill(0)
  for (let i = 0; i < num.length; i++) b[n - num.length + i] = num[i] // b[0] = b1 ... b[n-1] = bn
  const A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (j === i + 1 ? 1 : 0)))
  if (n > 0) for (let j = 0; j < n; j++) A[n - 1][j] = -a[n - j]
  const B = Array.from({ length: n }, (_, i) => [i === n - 1 ? 1 : 0])
  const Cm = [Array.from({ length: n }, (_, j) => b[n - 1 - j])]
  return { A, B, C: Cm, D: [[D]] }
}

// derivada do estado
function deriv(A, B, x, u) {
  const n = x.length
  const dx = new Array(n)
  for (let i = 0; i < n; i++) {
    let s = B[i][0] * u
    for (let j = 0; j < n; j++) s += A[i][j] * x[j]
    dx[i] = s
  }
  return dx
}

export function rk4Step(A, B, x, u0, u1, dt) {
  const um = 0.5 * (u0 + u1)
  const k1 = deriv(A, B, x, u0)
  const k2 = deriv(A, B, x.map((v, i) => v + 0.5 * dt * k1[i]), um)
  const k3 = deriv(A, B, x.map((v, i) => v + 0.5 * dt * k2[i]), um)
  const k4 = deriv(A, B, x.map((v, i) => v + dt * k3[i]), u1)
  return x.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]))
}

/**
 * Simula ẋ = Ax + Bu, y = Cx + Du com u = uFn(t).
 * Retorna { t: [], y: [], x: [[...]] }
 */
export function simulateSS({ A, B, C, D }, uFn, tEnd, { dt = 0.002, x0, every = 1 } = {}) {
  const n = A.length
  let x = x0 ? x0.slice() : new Array(n).fill(0)
  const T = [], Y = [], X = []
  const steps = Math.ceil(tEnd / dt)
  const out = (t, x) => {
    const u = uFn(t)
    let y = D[0][0] * u
    for (let j = 0; j < n; j++) y += C[0][j] * x[j]
    T.push(t)
    Y.push(y)
    X.push(x.slice())
  }
  out(0, x)
  for (let k = 0; k < steps; k++) {
    const t0 = k * dt
    x = rk4Step(A, B, x, uFn(t0), uFn(t0 + dt), dt)
    if ((k + 1) % every === 0) out(t0 + dt, x)
  }
  return { t: T, y: Y, x: X }
}

export function simulateTF(num, den, uFn, tEnd, opts = {}) {
  const ss = tf2ss(num, den)
  if (ss.A.length === 0) {
    const N = opts.points || 600
    const t = Array.from({ length: N + 1 }, (_, i) => (i * tEnd) / N)
    return { t, y: t.map((tt) => ss.D[0][0] * uFn(tt)) }
  }
  return simulateSS(ss, uFn, tEnd, opts)
}

// Métricas da resposta ao degrau a partir das amostras
export function stepInfo(t, y, { tol = 0.02 } = {}) {
  const yf = y[y.length - 1]
  if (!isFinite(yf) || Math.abs(yf) < 1e-12) return null
  let imax = 0
  for (let i = 1; i < y.length; i++) if ((y[i] - y[imax]) * Math.sign(yf) > 0) imax = i
  const Mp = Math.max(0, (y[imax] - yf) / Math.abs(yf))
  // tempo de subida (0 a 100% – definição usada no curso para sistemas subamortecidos)
  let tr = null
  for (let i = 1; i < y.length; i++) if ((y[i] - yf) * Math.sign(yf) >= 0) { tr = t[i]; break }
  // tempo de subida 10–90%
  let t10 = null, t90 = null
  for (let i = 0; i < y.length; i++) {
    if (t10 === null && y[i] / yf >= 0.1) t10 = t[i]
    if (t90 === null && y[i] / yf >= 0.9) { t90 = t[i]; break }
  }
  let ts = 0
  for (let i = y.length - 1; i >= 0; i--) if (Math.abs(y[i] - yf) > tol * Math.abs(yf)) { ts = t[Math.min(i + 1, y.length - 1)]; break }
  return { yf, Mp, tp: Mp > 1e-4 ? t[imax] : null, tr, tr1090: t10 !== null && t90 !== null ? t90 - t10 : null, ts }
}

export const inputs = {
  degrau: (A = 1, t0 = 0) => (t) => (t >= t0 ? A : 0),
  pulso: (A = 1, t0 = 0, t1 = 1) => (t) => (t >= t0 && t < t1 ? A : 0),
  rampa: (k = 1) => (t) => (t >= 0 ? k * t : 0),
  seno: (A = 1, w = 1) => (t) => (t >= 0 ? A * Math.sin(w * t) : 0),
}
