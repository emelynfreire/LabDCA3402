import { useMemo, useState } from 'react'
import Plot from '../components/Plot.jsx'
import { Sim, Seg } from '../components/Controls.jsx'
import { M, MM } from '../components/Tex.jsx'
import { residue, polymul, polyadd, inverseLaplaceFn, trim } from '../lib/poly.js'
import { texPoly, texNum, texComplex } from '../lib/format.js'

const PRESETS = [
  { label: 'Slides – Ex. 1', n: 2, a: [5, 6], b: [0, 12], input: 'degrau', A: 2, p: 0, ic: [1, -1, 0] },
  { label: 'Slides – Ex. 2', n: 2, a: [4, 4], b: [2, 8], input: 'exp', A: 1, p: 3, ic: [-1, 1, 0] },
  { label: 'Slides – Ex. 3', n: 2, a: [2, 2], b: [0, 2], input: 'degrau', A: 1, p: 0, ic: [0, 0, 0] },
  { label: 'Lista 1 – 7a', n: 1, a: [3], b: [6], input: 'degrau', A: 1, p: 0, ic: [1, 0, 0] },
  { label: 'Lista 1 – 7b', n: 2, a: [3, 2], b: [0, 2], input: 'degrau', A: 1, p: 0, ic: [1, 1, 0] },
  { label: 'Lista 1 – 7c', n: 2, a: [2, 5], b: [0, 5], input: 'degrau', A: 1, p: 0, ic: [0, 2, 0] },
  { label: 'Lista 1 – 16b', n: 2, a: [0, 4], b: [0, 8], input: 'exp', A: 1, p: -2, ic: [1, -1, 0] },
  { label: 'Lista 1 – 6f', n: 3, a: [6, 11, 6], b: [0, 0, 6], input: 'degrau', A: 1, p: 0, ic: [0, 0, 0] },
]

// transformada da entrada e derivadas em t = 0
function inputData(kind, A, p) {
  switch (kind) {
    case 'exp': return { num: [A], den: [1, -p], tex: `${texNum(A)}e^{${texNum(p)}t}`, U: `\\dfrac{${texNum(A)}}{${texPoly([1, -p])}}`, d: [A, A * p, A * p * p], f: (t) => A * Math.exp(p * t), df: [(t) => A * Math.exp(p * t), (t) => A * p * Math.exp(p * t), (t) => A * p * p * Math.exp(p * t)] }
    case 'seno': return { num: [A * p], den: [1, 0, p * p], tex: `${texNum(A)}\\,\\sen(${texNum(p)}t)`, U: `\\dfrac{${texNum(A * p)}}{${texPoly([1, 0, p * p])}}`, d: [0, A * p, 0], f: (t) => A * Math.sin(p * t), df: [(t) => A * Math.sin(p * t), (t) => A * p * Math.cos(p * t), (t) => -A * p * p * Math.sin(p * t)] }
    case 'rampa': return { num: [A], den: [1, 0, 0], tex: `${texNum(A)}t`, U: `\\dfrac{${texNum(A)}}{s^2}`, d: [0, A, 0], f: (t) => A * t, df: [(t) => A * t, () => A, () => 0] }
    default: return { num: [A], den: [1, 0], tex: `${texNum(A)}`, U: `\\dfrac{${texNum(A)}}{s}`, d: [A, 0, 0], f: () => A, df: [() => A, () => 0, () => 0] }
  }
}

const dname = (k, v = 'y') => (k === 0 ? `${v}` : k === 1 ? `\\dot ${v}` : k === 2 ? `\\ddot ${v}` : `${v}^{(${k})}`)
const d0 = (k, v = 'y') => (k === 0 ? `${v}(0)` : k === 1 ? `\\dot ${v}(0)` : `\\ddot ${v}(0)`)

function odeTex(n, a, b) {
  let lhs = dname(n)
  a.forEach((c, i) => { const k = n - 1 - i; if (Math.abs(c) > 1e-12) lhs += ` ${c < 0 ? '-' : '+'} ${Math.abs(c) === 1 ? '' : texNum(Math.abs(c))}${dname(k)}` })
  let rhs = ''
  b.forEach((c, i) => { const k = b.length - 1 - i; if (Math.abs(c) > 1e-12) rhs += `${rhs ? (c < 0 ? ' - ' : ' + ') : c < 0 ? '-' : ''}${Math.abs(c) === 1 ? '' : texNum(Math.abs(c))}${dname(k, 'u')}` })
  return `${lhs} = ${rhs || '0'}`
}

// termo de y(t) em LaTeX
function timeTerms(terms) {
  const parts = []
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1))
  terms.forEach(({ p, m, coefs }) => {
    if (p.im < -1e-9) return
    coefs.forEach((cf, k) => {
      const pw = m - k - 1
      const tpart = pw === 0 ? '' : pw === 1 ? 't\\,' : `\\tfrac{t^{${pw}}}{${fact(pw)}}`
      if (Math.abs(p.im) < 1e-9) {
        if (Math.abs(cf.re) < 1e-9) return
        const e = Math.abs(p.re) < 1e-9 ? '' : `e^{${Math.abs(Math.abs(p.re) - 1) < 1e-9 ? (p.re < 0 ? '-' : '') : texNum(p.re)}t}`
        const body = tpart + e
        parts.push({ c: cf.re, body: body || '' })
      } else {
        const A = 2 * cf.re, B = -2 * cf.im
        const e = Math.abs(p.re) < 1e-9 ? '' : `e^{${Math.abs(Math.abs(p.re) - 1) < 1e-9 ? (p.re < 0 ? '-' : '') : texNum(p.re)}t}`
        const w = texNum(p.im)
        if (Math.abs(A) > 1e-9) parts.push({ c: A, body: `${tpart}${e}\\cos(${w}t)` })
        if (Math.abs(B) > 1e-9) parts.push({ c: B, body: `${tpart}${e}\\,\\sen(${w}t)` })
      }
    })
  })
  if (!parts.length) return '0'
  return parts.map((pt, i) => {
    const mag = Math.abs(pt.c)
    const coef = pt.body && Math.abs(mag - 1) < 1e-9 ? '' : texNum(mag)
    const sign = pt.c < 0 ? '-' : i === 0 ? '' : '+'
    return `${sign} ${coef}${pt.body}`
  }).join(' ')
}

export default function LaplaceSolver() {
  const [cfg, setCfg] = useState(PRESETS[0])
  const { n, a, b, input, A, p, ic } = cfg
  const set = (patch) => setCfg((c) => ({ ...c, ...patch, label: 'personalizado' }))

  const res = useMemo(() => {
    const Apoly = [1, ...a]
    const B = trim(b.length ? b : [0])
    const m = B.length - 1
    const inp = inputData(input, A, p)
    // P0(s): termos de condição inicial do lado esquerdo
    let P0 = [0]
    for (let k = 1; k <= n; k++) {
      const coef = k === n ? 1 : a[n - 1 - k]
      if (Math.abs(coef) < 1e-14) continue
      for (let i = 0; i < k; i++) {
        const term = new Array(k - i).fill(0); term[0] = coef * ic[i] // coef * y^(i)(0) * s^{k-1-i}
        P0 = polyadd(P0, term)
      }
    }
    // Q0(s): termos de u(0) do lado direito (convenção dos slides)
    let Q0 = [0]
    for (let k = 1; k <= m; k++) {
      const coef = B[m - k]
      for (let i = 0; i < k; i++) {
        const term = new Array(k - i).fill(0); term[0] = coef * inp.d[i]
        Q0 = polyadd(Q0, term)
      }
    }
    const IC = polyadd(P0, Q0.map((v) => -v))
    const Ynum = polyadd(polymul(IC, inp.den), polymul(B, inp.num))
    const Yden = polymul(Apoly, inp.den)
    const pf = residue(Ynum, Yden)
    pf.terms = pf.terms.map((t) => ({ ...t, coefs: t.coefs.map((c) => ({ re: Math.abs(c.re) < 1e-9 ? 0 : c.re, im: Math.abs(c.im) < 1e-9 ? 0 : c.im })) }))
    const f = inverseLaplaceFn(Ynum, Yden)
    // verificação numérica: integra a EDO por RK4 (variáveis de fase)
    const tEnd = 8
    const N = 1600, dt = tEnd / N
    let x = ic.slice(0, n)
    const rhs = (t) => B.reduce((s, c, i) => s + c * inp.df[m - i](t), 0)
    const dx = (t, x) => { const out = x.slice(1); out.push(rhs(t) - a.reduce((s, c, i) => s + c * x[n - 1 - i], 0)); return out }
    const tn = [], yn = []
    for (let k = 0; k <= N; k++) {
      const t = k * dt
      if (k % 8 === 0) { tn.push(t); yn.push(x[0]) }
      const k1 = dx(t, x), k2 = dx(t + dt / 2, x.map((v, i) => v + dt / 2 * k1[i])), k3 = dx(t + dt / 2, x.map((v, i) => v + dt / 2 * k2[i])), k4 = dx(t + dt, x.map((v, i) => v + dt * k3[i]))
      x = x.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]))
    }
    const ta = Array.from({ length: 401 }, (_, i) => (i / 400) * tEnd)
    return { Apoly, B, m, inp, IC, P0, Q0, Ynum, Yden, pf, ya: ta.map(f), ta, tn, yn }
  }, [cfg])

  const { Apoly, B, m, inp, IC, Ynum, Yden, pf } = res

  // LaTeX da equação transformada
  const lhsT = (() => {
    const terms = []
    for (let k = n; k >= 0; k--) {
      const coef = k === n ? 1 : a[n - 1 - k]
      if (Math.abs(coef) < 1e-14) continue
      let t = k === 0 ? 'Y(s)' : `s${k > 1 ? `^{${k}}` : ''}Y(s)`
      const icp = []
      for (let i = 0; i < k; i++) { const pw = k - 1 - i; icp.push(`${pw === 0 ? '' : pw === 1 ? 's\\,' : `s^{${pw}}`}${d0(i)}`) }
      if (icp.length) t = `\\left[${t} - ${icp.join(' - ')}\\right]`
      terms.push(`${coef === 1 ? '' : texNum(coef)}${t}`)
    }
    return terms.join(' + ')
  })()
  const rhsT = (() => {
    const terms = []
    for (let k = m; k >= 0; k--) {
      const coef = B[m - k]
      if (Math.abs(coef) < 1e-14) continue
      let t = k === 0 ? 'U(s)' : `s${k > 1 ? `^{${k}}` : ''}U(s)`
      if (k >= 1) t = `\\left[${t} - ${k === 2 ? 's\\,u(0) - \\dot u(0)' : 'u(0)'}\\right]`
      terms.push(`${coef === 1 ? '' : texNum(coef)}${t}`)
    }
    return terms.join(' + ') || '0'
  })()

  const pfTex = pf.terms.filter((t) => t.p.im >= -1e-9).flatMap(({ p, m: mm, coefs }) => coefs.map((cf, k) => {
    const pw = mm - k
    const isZero = Math.abs(p.re) < 1e-9 && Math.abs(p.im) < 1e-9
    const base = isZero ? 's' : Math.abs(p.im) > 1e-9 ? `\\left(s - (${texComplex(p)})\\right)` : `(s ${p.re > 0 ? '-' : '+'} ${texNum(Math.abs(p.re))})`
    const den = `${base}${pw > 1 ? `^{${pw}}` : ''}`
    return { cf, den, complex: Math.abs(p.im) > 1e-9 }
  })).filter((x) => Math.hypot(x.cf.re, x.cf.im) > 1e-9)

  const icFields = Array.from({ length: n }, (_, i) => i)
  return (
    <Sim title="Resolvedor de EDO por Transformada de Laplace, passo a passo" sub="mesmo método dos slides 7 · confira suas contas">
      <div className="sim-body">
        <div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            {PRESETS.map((pr) => <button key={pr.label} className="btn small ghost" style={cfg.label === pr.label ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => setCfg(pr)}>{pr.label}</button>)}
          </div>
          <ol className="steps">
            <li><span className="step-title">EDO e entrada</span>
              <MM>{`${odeTex(n, a, B)},\\qquad u(t) = ${inp.tex},\\ t\\ge 0`}</MM>
            </li>
            <li><span className="step-title">Aplicar Laplace (as condições iniciais entram aqui)</span>
              <MM>{`${lhsT} = ${rhsT}`}</MM>
              <p className="small">com <M>{`U(s) = \\mathcal{L}\\{${inp.tex}\\} = ${inp.U}`}</M>{m > 0 && <> e, seguindo a convenção dos slides, <M>{`u(0) = ${texNum(inp.d[0])}`}</M></>}.</p>
            </li>
            <li><span className="step-title">Isolar Y(s)</span>
              <MM>{`(${texPoly(Apoly)})\\,Y(s) = ${texPoly(IC)} + (${texPoly(B)})\\,U(s)`}</MM>
              <MM>{`Y(s) = \\dfrac{${texPoly(Ynum)}}{${texPoly(Yden)}}`}</MM>
            </li>
            <li><span className="step-title">Frações parciais (resíduos)</span>
              <MM>{`Y(s) = ${pfTex.map((x, i) => {
                const val = x.complex ? `(${texComplex(x.cf)})` : texNum(x.cf.re)
                const neg = !x.complex && x.cf.re < 0
                return `${i === 0 ? (neg ? '-' : '') : neg ? ' - ' : ' + '}\\dfrac{${x.complex ? val : texNum(Math.abs(x.cf.re))}}{${x.den}}`
              }).join('') || '0'}${pfTex.some((x) => x.complex) ? ' + \\text{(conjugados)}' : ''}`}</MM>
              {pfTex.some((x) => x.complex) && <p className="small">Os polos complexos aparecem em pares conjugados; os resíduos também (<M>{'C_2 = \\bar C_1'}</M>). Usando a Abordagem 2 dos slides: <M>{String.raw`e^{\alpha t}\left[2\Re\{C\}\cos\beta t - 2\Im\{C\}\sen\beta t\right]`}</M>.</p>}
            </li>
            <li><span className="step-title">Transformada inversa</span>
              <MM>{`y(t) = ${timeTerms(pf.terms)},\\quad t \\ge 0`}</MM>
            </li>
          </ol>
          <Plot height={200} xRange={[0, 8]} yLabel="y(t)" series={[
            { x: res.ta, y: res.ya, color: 'var(--pen)', width: 2.4, label: 'y(t) por Laplace' },
            { x: res.tn, y: res.yn, color: 'var(--pole)', width: 1.6, dash: '2 4', label: 'integração numérica (RK4)' },
          ]} />
        </div>
        <div className="sim-controls">
          <h4>Ordem</h4>
          <Seg label="Ordem" value={n} onChange={(v) => set({ n: v, a: Array.from({ length: v }, (_, i) => a[i] ?? 1), b: (b.length > v ? b.slice(-v) : b) })} options={[{ value: 1, label: '1ª' }, { value: 2, label: '2ª' }, { value: 3, label: '3ª' }]} />
          <h4>Coeficientes do lado esquerdo</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.4rem' }}>
            {a.map((v, i) => (
              <label key={i} className="field"><span><M>{`a_{${i + 1}}`}</M> (<M>{dname(n - 1 - i)}</M>)</span>
                <input type="number" step="any" value={v} onChange={(e) => { const na = a.slice(); na[i] = parseFloat(e.target.value) || 0; set({ a: na }) }} /></label>
            ))}
          </div>
          <h4>Lado direito: <M>{'b_1\\dot u + b_0 u'}</M></h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.4rem' }}>
            {(n >= 2 ? [0, 1] : [1]).map((idx) => {
              const bb = b.length === 2 ? b : [0, b[b.length - 1] ?? 0]
              return (
                <label key={idx} className="field"><span>{idx === 0 ? <M>{'b_1\\ (\\dot u)'}</M> : <M>{'b_0\\ (u)'}</M>}</span>
                  <input type="number" step="any" value={bb[idx]} onChange={(e) => { const nb = bb.slice(); nb[idx] = parseFloat(e.target.value) || 0; set({ b: nb }) }} /></label>
              )
            })}
          </div>
          <h4>Entrada</h4>
          <Seg label="Entrada" value={input} onChange={(v) => set({ input: v, p: v === 'seno' ? 2 : v === 'exp' ? -1 : 0 })} options={[{ value: 'degrau', label: 'degrau' }, { value: 'exp', label: 'exponencial' }, { value: 'seno', label: 'seno' }, { value: 'rampa', label: 'rampa' }]} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.4rem', marginTop: '.4rem' }}>
            <label className="field"><span>amplitude A</span><input type="number" step="any" value={A} onChange={(e) => set({ A: parseFloat(e.target.value) || 0 })} /></label>
            {(input === 'exp' || input === 'seno') && <label className="field"><span>{input === 'exp' ? 'expoente a em e^(at)' : 'ω'}</span><input type="number" step="any" value={p} onChange={(e) => set({ p: parseFloat(e.target.value) || 0 })} /></label>}
          </div>
          <h4>Condições iniciais</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.4rem' }}>
            {icFields.map((i) => (
              <label key={i} className="field"><span><M>{d0(i)}</M></span>
                <input type="number" step="any" value={ic[i]} onChange={(e) => { const nic = ic.slice(); nic[i] = parseFloat(e.target.value) || 0; set({ ic: nic }) }} /></label>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: '1rem' }}>As duas curvas do gráfico devem coincidir: a azul vem da expressão obtida por Laplace e a vermelha da integração numérica direta da EDO.</p>
        </div>
      </div>
    </Sim>
  )
}
