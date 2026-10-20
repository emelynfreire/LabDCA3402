import { useMemo, useState } from 'react'
import SPlane, { expandRoots } from '../components/SPlane.jsx'
import Plot, { sample } from '../components/Plot.jsx'
import { Sim, Seg, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { fromRoots, polyval, polymul, inverseLaplaceFn } from '../lib/poly.js'
import { stepInfo } from '../lib/lti.js'
import { fmt, texPoly, texNum } from '../lib/format.js'

export const presets = {
  complexos: { label: '150/(s²+12s+100)', roots: [{ kind: 'pole', re: -6, im: 8 }], xr: [-10, 2], yr: [-10, 10] },
  reais: { label: '(2s+3)/(s²+4s+3)', roots: [{ kind: 'pole', re: -1, im: 0 }, { kind: 'pole', re: -3, im: 0 }, { kind: 'zero', re: -1.5, im: 0 }] },
  duplo: { label: '(s+0,5)/(s+1,5)²', roots: [{ kind: 'pole', re: -1.5, im: 0 }, { kind: 'pole', re: -1.5, im: 0 }, { kind: 'zero', re: -0.5, im: 0 }] },
  sub: { label: 'subamortecido', roots: [{ kind: 'pole', re: -1, im: 3 }] },
  instavel: { label: 'instável', roots: [{ kind: 'pole', re: 0.4, im: 2 }] },
}

function describeModes(poles) {
  // agrupa multiplicidade
  const groups = []
  poles.forEach((p) => {
    if (p.im < 0) return
    const g = groups.find((g) => Math.abs(g.re - p.re) < 1e-3 && Math.abs(g.im - p.im) < 1e-3)
    if (g) g.m++
    else groups.push({ ...p, m: 1 })
  })
  return groups.map((g) => {
    const a = texNum(g.re, 2)
    const terms = []
    for (let k = 0; k < g.m; k++) {
      const tk = k === 0 ? '' : k === 1 ? 't\\,' : `t^{${k}}`
      if (g.im > 0) terms.push(`${tk}e^{${a}t}\\cos(${texNum(g.im, 2)}t+\\theta)`)
      else terms.push(Math.abs(g.re) < 1e-9 ? (k === 0 ? '1' : tk.replace('\\,', '')) : `${tk}e^{${a}t}`)
    }
    return { g, tex: terms.join(',\\ ') }
  })
}

export default function PoleResponse({ compact = false, initial = 'sub', title = 'Polos, zeros e resposta no tempo' }) {
  const [roots, setRoots] = useState(presets[initial].roots)
  const [view, setView] = useState('degrau')
  const [range, setRange] = useState({ xr: presets[initial].xr || [-6, 2], yr: presets[initial].yr || [-5, 5] })

  const poles = expandRoots(roots, 'pole')
  const zerosL = expandRoots(roots, 'zero')
  const den = fromRoots(poles)
  const numR = fromRoots(zerosL)
  const proper = zerosL.length < poles.length
  const hasOriginPole = poles.some((p) => Math.abs(p.re) < 1e-9 && Math.abs(p.im) < 1e-9)
  const K = !hasOriginPole && Math.abs(polyval(numR, 0)) > 1e-9 ? polyval(den, 0) / polyval(numR, 0) : 1
  const num = numR.map((c) => c * K)

  const maxRe = Math.max(...poles.map((p) => p.re))
  const stable = maxRe < -1e-9
  const slow = Math.min(...poles.map((p) => Math.abs(p.re)).filter((v) => v > 1e-6), 10)
  const tEnd = stable ? Math.min(25, Math.max(3, 5 / slow)) : 8

  const data = useMemo(() => {
    if (!proper) return null
    const f = view === 'degrau' ? inverseLaplaceFn(num, polymul(den, [1, 0])) : inverseLaplaceFn(num, den)
    return sample(f, 0, tEnd, 500)
  }, [JSON.stringify(roots), view, tEnd])

  const info = data && view === 'degrau' && stable ? stepInfo(data.x, data.y) : null
  const modes = describeModes(poles)
  const yAbsMax = data ? Math.max(1.5, ...data.y.map((v) => Math.min(Math.abs(v), 50))) : 2

  function setPreset(k) {
    setRoots(presets[k].roots)
    setRange({ xr: presets[k].xr || [-6, 2], yr: presets[k].yr || [-5, 5] })
  }
  function add(kind) {
    const nPoles = poles.length
    if (kind === 'pole' && nPoles >= 6) return
    if (kind === 'zero' && zerosL.length >= nPoles - 1) return
    setRoots([...roots, { kind, re: kind === 'pole' ? -2 : -0.8, im: 0 }])
  }
  function removeLast(kind) {
    const idx = roots.map((r) => r.kind).lastIndexOf(kind)
    if (idx < 0) return
    if (kind === 'pole' && poles.length - (roots[idx].im > 0 ? 2 : 1) < 1) return
    const next = roots.filter((_, i) => i !== idx)
    // mantém a FT própria
    let z = expandRoots(next, 'zero').length
    const p = expandRoots(next, 'pole').length
    while (z >= p) { const zi = next.map((r) => r.kind).lastIndexOf('zero'); next.splice(zi, 1); z = expandRoots(next, 'zero').length }
    setRoots(next)
  }

  const plot = (
    <Plot
      height={compact ? 210 : 240}
      series={data ? [{ ...data, color: 'var(--pen)', width: 2.2 }] : []}
      xRange={[0, tEnd]}
      yRange={stable ? undefined : [-yAbsMax, yAbsMax]}
      hLines={view === 'degrau' && stable ? [{ y: 1 }] : []}
      markers={info && info.tp ? [{ x: info.tp, y: info.yf * (1 + info.Mp), label: `Mp = ${fmt(100 * info.Mp, 2)}%` }] : []}
      yLabel={view === 'degrau' ? 'y(t) ao degrau' : 'g(t) ao impulso'}
    />
  )

  if (compact) {
    return (
      <div>
        <div className="compact-grid">
          <SPlane roots={roots} onChange={setRoots} xr={range.xr} yr={range.yr} size={300} />
          {plot}
        </div>
        <div className="cap">
          <span>Arraste os polos (×). G(s) com ganho estático unitário.</span>
          <span style={{ color: stable ? 'var(--good)' : 'var(--pole)', fontWeight: 600 }}>{stable ? 'Estável' : maxRe > 1e-9 ? 'Instável' : 'Marginalmente estável'}</span>
        </div>
      </div>
    )
  }

  return (
    <Sim title={title} sub="arraste polos (×) e zeros (○) no plano s">
      <div className="sim-body">
        <div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Seg label="Entrada" value={view} onChange={setView} options={[{ value: 'degrau', label: 'Resposta ao degrau' }, { value: 'impulso', label: 'Resposta ao impulso' }]} />
          </div>
          {plot}
          <Readout items={[
            ['Estabilidade', stable ? 'BIBO-estável' : maxRe > 1e-9 ? 'instável' : 'marginal'],
            ['Valor final', info ? fmt(info.yf, 3) : '—'],
            ['Sobressinal', info ? `${fmt(100 * info.Mp, 2)}%` : '—'],
            ['t_s (2%)', info ? `${fmt(info.ts, 3)} s` : '—'],
          ]} />
        </div>
        <div className="sim-controls">
          <SPlane roots={roots} onChange={setRoots} xr={range.xr} yr={range.yr} size={320} />
          <div className="btn-row">
            <button className="btn small" onClick={() => add('pole')}>+ polo</button>
            <button className="btn small" onClick={() => add('zero')}>+ zero</button>
            <button className="btn small ghost" onClick={() => removeLast('pole')}>− polo</button>
            <button className="btn small ghost" onClick={() => removeLast('zero')}>− zero</button>
          </div>
          <div className="btn-row">
            {Object.entries(presets).map(([k, p]) => <button key={k} className="btn small ghost" onClick={() => setPreset(k)}>{p.label}</button>)}
          </div>
        </div>
      </div>
      <div className="sim-foot">
        <p><M>{`G(s) = \\dfrac{${texPoly(num, 's', 3)}}{${texPoly(den, 's', 3)}}`}</M></p>
        <p>Modos que aparecem na resposta: {modes.map((m, i) => <span key={i}>{i > 0 && '; '}<M>{m.tex}</M></span>)}.
          {' '}{stable ? 'Todos decaem, pois os polos têm parte real negativa.' : 'Há modo que não decai: o sistema não é BIBO-estável.'}</p>
      </div>
    </Sim>
  )
}
