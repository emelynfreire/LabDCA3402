import { useMemo, useState } from 'react'
import { Line } from '@react-three/drei'
import { Sim, Seg } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import Plot from '../components/Plot.jsx'
import Scene3D, { Axis, Label } from '../components/Scene3D.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { residue, polymul, trim } from '../lib/poly.js'
import { cexp, cmul, cscale } from '../lib/complex.js'
import { texNum, texPoly, texComplex, fmt } from '../lib/format.js'

const PRESETS = [
  { label: '(2s+3)/(s²+4s+3), degrau', num: [2, 3], den: [1, 4, 3], u: 'degrau', src: 'slides 8, p. 20' },
  { label: '(s+0,5)/(s+1,5)², degrau', num: [1, 0.5], den: [1, 3, 2.25], u: 'degrau', src: 'slides 8, p. 22' },
  { label: '150/(s²+12s+100), degrau', num: [150], den: [1, 12, 100], u: 'degrau', src: 'slides 8, p. 24' },
  { label: '4/[s(s+2)], degrau', num: [4], den: [1, 2, 0], u: 'degrau', src: 'slides 8, p. 26' },
  { label: '10/[(s+1)(s²+4s+13)], degrau', num: [10], den: [1, 5, 17, 13], u: 'degrau', src: 'Lista 1, q. 20' },
  { label: '50/[(s²+2s+5)(s+10)], degrau', num: [50], den: [1, 12, 25, 50], u: 'degrau', src: 'Lista 2, q. 13' },
  { label: '24/[(s+6)(s²+2s+4)], degrau', num: [24], den: [1, 8, 16, 24], u: 'degrau', src: 'Lista 2, q. 12' },
]
const COLORS = ['var(--pole)', 'var(--good)', 'var(--amber)', 'var(--pen-2)', 'var(--ink-2)', '#8a5ac2']
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1))

function modeFn({ p, m, coefs }) {
  const complex = Math.abs(p.im) > 1e-9
  return (t) => {
    let acc = 0
    const e = cexp(cscale(p, t))
    for (let k = 0; k < m; k++) {
      const pw = m - k - 1
      const v = cmul(coefs[k], e).re * (Math.pow(t, pw) / fact(pw))
      acc += complex ? 2 * v : v
    }
    return acc
  }
}

function modeTex({ p, m, coefs }) {
  const complex = Math.abs(p.im) > 1e-9
  const parts = []
  for (let k = 0; k < m; k++) {
    const pw = m - k - 1
    const tp = pw === 0 ? '' : pw === 1 ? 't\\,' : `\\tfrac{t^{${pw}}}{${fact(pw)}}`
    const ex = Math.abs(p.re) < 1e-9 ? '' : `e^{${Math.abs(Math.abs(p.re) - 1) < 1e-9 ? (p.re < 0 ? '-' : '') : texNum(p.re)}t}`
    const cf = coefs[k]
    if (complex) {
      const A = 2 * cf.re, B = -2 * cf.im
      if (Math.abs(A) > 1e-9) parts.push({ c: A, b: `${tp}${ex}\\cos ${texNum(p.im)}t` })
      if (Math.abs(B) > 1e-9) parts.push({ c: B, b: `${tp}${ex}\\,\\operatorname{sen} ${texNum(p.im)}t` })
    } else if (Math.abs(cf.re) > 1e-9) parts.push({ c: cf.re, b: `${tp}${ex}` })
  }
  if (!parts.length) return '0'
  return parts.map((q, i) => `${q.c < 0 ? '-' : i ? '+' : ''}${q.b && Math.abs(Math.abs(q.c) - 1) < 1e-9 ? '' : texNum(Math.abs(q.c))}${q.b}`).join(' ')
}

function Layers({ data, tEnd, c }) {
  const yAll = data.modes.flatMap((md) => md.y).concat(data.sum)
  const ymax = Math.max(0.5, ...yAll.map(Math.abs))
  const sx = (t) => (t / tEnd) * 8 - 4
  const sy = (v) => (v / ymax) * 2
  const nM = data.modes.length
  const z = (k) => (k - nM / 2) * 1.1 - 0.6
  const cols = [c.pole, c.good, c.amber, c.pen2, c.ink2, '#8a5ac2']
  return (
    <group>
      {data.modes.map((md, k) => (
        <group key={k}>
          <Line points={data.t.map((t, i) => [sx(t), sy(md.y[i]), z(k)])} color={cols[k % cols.length]} lineWidth={2.2} />
          <Line points={[[-4, 0, z(k)], [4, 0, z(k)]]} color={c.grid} lineWidth={1} />
          <Label position={[-4.6, 0.2, z(k)]} color={cols[k % cols.length]} size={11}>{md.name}</Label>
        </group>
      ))}
      <Line points={data.t.map((t, i) => [sx(t), sy(data.sum[i]), z(nM) + 0.4])} color={c.pen} lineWidth={3.6} />
      <Line points={[[-4, 0, z(nM) + 0.4], [4, 0, z(nM) + 0.4]]} color={c.ink3} lineWidth={1} />
      <Label position={[-4.6, 0.2, z(nM) + 0.4]} color={c.pen} size={12}>y(t) = soma</Label>
      <Axis from={[-4, 0, z(nM) + 1]} to={[4.4, 0, z(nM) + 1]} color={c.ink2} label="t" />
    </group>
  )
}

export default function ModalDecomposition() {
  const c = useThemeColors()
  const [pi, setPi] = useState(4)
  const [view, setView] = useState('2d')
  const [numT, setNumT] = useState(PRESETS[4].num.join(', '))
  const [denT, setDenT] = useState(PRESETS[4].den.join(', '))
  const [u, setU] = useState('degrau')
  const parse = (s) => s.split(/[;,\s]+/).filter(Boolean).map((x) => parseFloat(x.replace(',', '.')))
  const num = parse(numT), den = parse(denT)
  const valid = num.length && den.length && num.every(isFinite) && den.every(isFinite) && trim(den).length > trim(num).length && den[0] !== 0
  const choose = (i) => { setPi(i); setNumT(PRESETS[i].num.join(', ')); setDenT(PRESETS[i].den.join(', ')); setU(PRESETS[i].u) }

  const data = useMemo(() => {
    if (!valid) return null
    const Yden = u === 'degrau' ? polymul(den, [1, 0]) : den
    const { terms } = residue(num, Yden)
    const modes = terms.filter((g) => g.p.im >= -1e-9).map((g) => {
      const isInput = u === 'degrau' && Math.abs(g.p.re) < 1e-9 && Math.abs(g.p.im) < 1e-9 && !den.slice(-1).every((v) => Math.abs(v) < 1e-12)
      const name = Math.abs(g.p.im) > 1e-9 ? `polos ${fmt(g.p.re, 3)} ± j${fmt(g.p.im, 3)}` : `${g.m > 1 ? `polo ${g.m === 2 ? 'duplo' : 'múltiplo'}` : 'polo'} ${fmt(g.p.re, 3)}${isInput ? ' (entrada)' : ''}`
      return { ...g, f: modeFn(g), tex: modeTex(g), name, isInput }
    })
    const slow = Math.min(...modes.map((md) => Math.abs(md.p.re)).filter((v) => v > 1e-6), 10)
    const tEnd = Math.min(20, Math.max(3, 6 / slow))
    const N = 400
    const t = Array.from({ length: N + 1 }, (_, i) => (i * tEnd) / N)
    modes.forEach((md) => { md.y = t.map(md.f) })
    const sum = t.map((_, i) => modes.reduce((s, md) => s + md.y[i], 0))
    return { modes, t, sum, tEnd }
  }, [numT, denT, u])

  return (
    <Sim title="Frações parciais: cada polo é um termo, a resposta é a soma" sub="decomposição de y(t) em modos">
      <div className="sim-body">
        <div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Seg label="visualização" value={view} onChange={setView} options={[{ value: '2d', label: 'Termos sobrepostos' }, { value: '3d', label: 'Camadas em 3D' }]} />
          </div>
          {data && (view === '2d' ? (
            <Plot height={300} xRange={[0, data.tEnd]} yLabel="y(t) e seus termos" hLines={[{ y: 0, dash: '0' }]}
              series={[...data.modes.map((md, k) => ({ x: data.t, y: md.y, color: COLORS[k % COLORS.length], width: 1.8, dash: '6 3', label: md.name })), { x: data.t, y: data.sum, color: 'var(--pen)', width: 3, label: 'y(t) = soma dos termos' }]} />
          ) : (
            <Scene3D camera={[6.5, 4.5, 6.5]} height={420}><Layers data={data} tEnd={data.tEnd} c={c} /></Scene3D>
          ))}
          {data && (
            <div className="tbl-wrap"><table className="tbl small">
              <thead><tr><th>modo</th><th>resíduo(s)</th><th>termo em y(t)</th></tr></thead>
              <tbody>{data.modes.map((md, k) => (
                <tr key={k}><td style={{ color: COLORS[k % COLORS.length], fontWeight: 600 }}>{md.name}</td>
                  <td><M>{md.coefs.map((cf, i) => `${md.m > 1 ? `D_{${i}}=` : 'C='}${texComplex(cf, 4)}`).join(',\\ ')}</M></td>
                  <td><M>{md.tex}</M></td></tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
        <div className="sim-controls">
          <div className="btn-row" style={{ marginTop: 0 }}>{PRESETS.map((p, i) => <button key={i} className="btn small ghost" style={i === pi ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => choose(i)}>{p.label}</button>)}</div>
          <p className="small muted">{PRESETS[pi].src}</p>
          <label className="field"><span>numerador de G(s)</span><input type="text" value={numT} onChange={(e) => setNumT(e.target.value)} /></label>
          <label className="field" style={{ marginTop: '.4rem' }}><span>denominador de G(s)</span><input type="text" value={denT} onChange={(e) => setDenT(e.target.value)} /></label>
          <div className="btn-row"><Seg label="entrada" value={u} onChange={setU} options={[{ value: 'degrau', label: 'degrau' }, { value: 'impulso', label: 'impulso' }]} /></div>
          {valid ? <p className="small"><M>{`Y(s) = \\dfrac{${texPoly(num)}}{${u === 'degrau' ? 's\\,(' + texPoly(den) + ')' : texPoly(den)}}`}</M></p>
            : <p className="warn small">Digite coeficientes numéricos com grau do numerador menor que o do denominador.</p>}
        </div>
      </div>
      <div className="sim-foot">
        <p>A expansão em frações parciais escreve <M>Y(s)</M> como soma de termos simples, um grupo por polo, e a transformada inversa é feita termo a termo. Cada curva tracejada é a contribuição de um polo; a curva azul grossa é a soma. Observe: o polo da entrada degrau (<M>s=0</M>) dá a parcela constante; polos reais dão exponenciais; polos complexos, senoides amortecidas; os polos mais à esquerda morrem primeiro — é a ideia de polos dominantes.</p>
      </div>
    </Sim>
  )
}
