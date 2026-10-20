import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import Scene3D, { Axis, Label } from '../components/Scene3D.jsx'
import Plot from '../components/Plot.jsx'
import { Sim, Slider, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { usePlayback } from './usePlayback.js'
import Transport from './Transport.jsx'
import { simulateSS } from '../lib/lti.js'
import { eig, charpoly, matvec, nullVector, det } from '../lib/linalg.js'
import { fmt, texPoly, texComplex, texNum } from '../lib/format.js'

export const SS_PRESETS = {
  rlc: { label: 'Circuito RLC (Ex. 13)', A: [[0, -400], [25, -250]], B: [[400], [0]], x0: [1, 0], u: 0.1, names: ['v_C', 'i_L'], note: 'C = 2,5 mF, L = 40 mH, R = 10 Ω, i(t) = 0,1 A, v_C(0) = 1 V' },
  massa: { label: 'Massa–mola (k=2, b=0,6)', A: [[0, 1], [-2, -0.6]], B: [[0], [1]], x0: [1.5, 0], u: 0, names: ['x_1', 'x_2'], note: 'x₁ = posição, x₂ = velocidade' },
  sela: { label: 'Instável (sela)', A: [[0, 1], [2, -1]], B: [[0], [1]], x0: [0.6, -1.4], u: 0, names: ['x_1', 'x_2'], note: 'autovalores 1 e −2 (exemplo da aula 13)' },
  centro: { label: 'Oscilador (centro)', A: [[0, 1], [-4, 0]], B: [[0], [1]], x0: [1, 0], u: 0, names: ['x_1', 'x_2'], note: 'autovalores ±j2: marginalmente estável' },
  nos: { label: 'Nó estável', A: [[-1, 0], [1, -3]], B: [[1], [0]], x0: [1.5, 1.5], u: 0, names: ['x_1', 'x_2'], note: 'autovalores reais −1 e −3' },
  ordem3: { label: '3ª ordem: polos −1, −2, −3', A: [[0, 1, 0], [0, 0, 1], [-6, -11, -6]], B: [[0], [0], [1]], x0: [1, 0, 0], u: 0, names: ['x_1', 'x_2', 'x_3'], note: 'forma canônica controlável (exercício da aula 13)' },
  ex12: { label: 'Matriz do Ex. 12', A: [[-1, 0.5, 0], [0, -1, 0], [1, 1, -0.5]], B: [[0], [0], [1]], x0: [1, 1, -1], u: 0, names: ['x_1', 'x_2', 'x_3'], note: 'autovalores −0,5 e −1 (duplo)' },
}

// escala por eixo (estados podem ter ordens de grandeza diferentes, ex.: volts e ampères)
function fit(traj, n) {
  const m = new Array(n).fill(1e-9)
  traj.forEach((tr) => tr.x.forEach((x) => x.forEach((v, i) => { m[i] = Math.max(m[i], Math.abs(v)) })))
  const big = Math.max(...m)
  return m.map((v) => 3 / Math.max(v, big * 0.05))
}

function World({ P, sims, main, pb, c, scale, tEnd }) {
  const n = P.A.length
  const dot = useRef()
  const map = (x, t) => n === 2 ? [x[0] * scale[0], (t / tEnd) * 4, x[1] * scale[1]] : [x[0] * scale[0], x[2] * scale[2], x[1] * scale[1]]
  const paths = useMemo(() => sims.map((s) => s.x.map((x, i) => map(x, s.t[i]))), [sims, scale])
  const floor = useMemo(() => n === 2 ? sims.map((s) => s.x.map((x) => [x[0] * scale[0], 0.005, x[1] * scale[1]])) : [], [sims, scale])
  const field = useMemo(() => {
    if (n !== 2) return null
    const pts = []
    for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
      const x = [(i * 0.8) / scale[0], (j * 0.8) / scale[1]]
      const d = matvec(P.A, x).map((v, k) => (v + P.B[k][0] * P.u) * scale[k])
      const len = Math.hypot(d[0], d[1]) || 1
      const a = [x[0] * scale[0], 0.01, x[1] * scale[1]]
      pts.push(...a, a[0] + (d[0] / len) * 0.32, 0.01, a[2] + (d[1] / len) * 0.32)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [P, scale])
  // autovetores reais
  const eigLines = useMemo(() => {
    const ev = eig(P.A).filter((l) => Math.abs(l.im) < 1e-9)
    const uniq = ev.filter((l, i) => ev.findIndex((q) => Math.abs(q.re - l.re) < 1e-6) === i)
    return uniq.map((l) => {
      const Mx = P.A.map((r, i) => r.map((v, j) => v - (i === j ? l.re : 0)))
      const v0 = nullVector(Mx)
      const v = (() => { const w = v0.map((q, k) => q * scale[k]); const nn = Math.hypot(...w) || 1; return w.map((q) => q / nn) })()
      const L = 3.6
      return { l: l.re, pts: n === 2 ? [[-v[0] * L, 0.02, -v[1] * L], [v[0] * L, 0.02, v[1] * L]] : [[-v[0] * L, -v[2] * L, -v[1] * L], [v[0] * L, v[2] * L, v[1] * L]] }
    })
  }, [P, scale])
  useFrame(() => {
    const t = pb.tRef.current
    const dt = main.t[1] - main.t[0]
    const i = Math.min(main.t.length - 1, Math.round(t / dt))
    const p = map(main.x[i], main.t[i])
    if (dot.current) dot.current.position.set(p[0], p[1], p[2])
  })
  return (
    <group>
      {n === 2 ? <>
        <gridHelper args={[8, 16, c.grid, c.grid]} />
        <Axis from={[-4, 0, 0]} to={[4.2, 0, 0]} color={c.ink2} label={P.names[0].replace('_', '')} />
        <Axis from={[0, 0, -4]} to={[0, 0, 4.2]} color={c.ink2} label={P.names[1].replace('_', '')} />
        <Axis from={[0, 0, 0]} to={[0, 4.4, 0]} color={c.ink2} label="t" />
        {field && <lineSegments geometry={field}><lineBasicMaterial color={c.ink3} transparent opacity={0.55} /></lineSegments>}
        {floor.map((f, k) => <Line key={'f' + k} points={f} color={k === 0 ? c.pole : c.ink3} lineWidth={k === 0 ? 2 : 1} transparent opacity={k === 0 ? 0.9 : 0.4} />)}
      </> : <>
        <Axis from={[-3.6, 0, 0]} to={[3.8, 0, 0]} color={c.ink2} label="x1" />
        <Axis from={[0, 0, -3.6]} to={[0, 0, 3.8]} color={c.ink2} label="x2" />
        <Axis from={[0, -3.6, 0]} to={[0, 3.8, 0]} color={c.ink2} label="x3" />
      </>}
      {eigLines.map((e, k) => <group key={k}><Line points={e.pts} color={c.good} lineWidth={1.6} dashed dashSize={0.18} gapSize={0.1} /><Label position={e.pts[1]} color={c.good} size={11}>{`λ = ${fmt(e.l, 3)}`}</Label></group>)}
      {paths.map((p, k) => <Line key={k} points={p} color={k === 0 ? c.pen : c.ink3} lineWidth={k === 0 ? 3 : 1} transparent opacity={k === 0 ? 1 : 0.45} />)}
      <mesh ref={dot}><sphereGeometry args={[0.12, 20, 20]} /><meshStandardMaterial color={c.amber} emissive={c.amber} emissiveIntensity={0.4} /></mesh>
    </group>
  )
}

export default function StateSpace3D({ initial = 'massa', presets = Object.keys(SS_PRESETS) }) {
  const c = useThemeColors()
  const [key, setKey] = useState(initial)
  const P0 = SS_PRESETS[key]
  const [x0, setX0] = useState(P0.x0)
  const [u, setU] = useState(P0.u)
  const choose = (k) => { setKey(k); setX0(SS_PRESETS[k].x0); setU(SS_PRESETS[k].u) }
  const P = { ...P0, u }
  const n = P.A.length
  const lam = eig(P.A)
  const slow = Math.min(...lam.map((l) => Math.abs(l.re)).filter((v) => v > 1e-6), 5)
  const unstable = lam.some((l) => l.re > 1e-9)
  const tEnd = unstable ? 3 : lam.every((l) => Math.abs(l.re) < 1e-9) ? 8 : Math.min(30, 6 / slow)
  const sys = { A: P.A, B: P.B, C: [P.A.map((_, i) => (i === 0 ? 1 : 0))], D: [[0]] }
  const sims = useMemo(() => {
    const dt = tEnd / 1500
    const mainS = simulateSS(sys, () => u, tEnd, { dt, x0, every: 3 })
    const others = []
    const R = Math.max(...x0.map(Math.abs), 1)
    const count = n === 2 ? 10 : 8
    for (let k = 0; k < count; k++) {
      const a = (2 * Math.PI * k) / count
      const ic = n === 2 ? [R * Math.cos(a), R * Math.sin(a)] : [R * Math.cos(a), R * Math.sin(a), R * Math.cos(2 * a) * 0.8]
      others.push(simulateSS(sys, () => u, tEnd, { dt, x0: ic, every: 6 }))
    }
    return [mainS, ...others]
  }, [key, x0.join(), u, tEnd])
  const scale = useMemo(() => fit(sims.slice(0, 1).concat(sims.slice(1).map((s) => ({ x: s.x.map((x) => x.map((v) => v * 0.8)) }))), n), [sims])
  const pb = usePlayback(tEnd, { speed: tEnd / 8 })
  const cp = charpoly(P.A)
  const xeq = Math.abs(det(P.A)) > 1e-9 && u !== 0 ? (() => {
    // resolve A x = −B u (2x2 ou 3x3) por Cramer
    const b = P.B.map((r) => -r[0] * u)
    const D = det(P.A)
    return P.A.map((_, j) => det(P.A.map((row, i) => row.map((v, k) => (k === j ? b[i] : v)))) / D)
  })() : null

  return (
    <Sim title="Trajetórias no espaço de estados" sub={n === 2 ? 'eixos horizontais: estados · eixo vertical: tempo · chão: plano de fase' : 'trajetória no espaço (x₁, x₂, x₃)'}>
      <div className="sim-body">
        <div>
          <Scene3D camera={n === 2 ? [6, 6, 7] : [6, 4.5, 6]} target={n === 2 ? [0, 1.4, 0] : [0, 0, 0]} height={420}>
            <World P={P} sims={sims} main={sims[0]} pb={pb} c={c} scale={scale} tEnd={tEnd} />
          </Scene3D>
          <Transport pb={pb} tEnd={tEnd} />
          <Plot height={170} xRange={[0, tEnd]} vLines={[{ x: pb.t, dash: '2 3' }]} yLabel="estados"
            series={P.names.map((nm, i) => ({ x: sims[0].t, y: sims[0].x.map((x) => x[i]), color: ['var(--pen)', 'var(--pole)', 'var(--good)'][i], label: nm.replace('_', '') + '(t)' }))} />
        </div>
        <div className="sim-controls">
          <div className="btn-row" style={{ marginTop: 0 }}>{presets.map((k) => <button key={k} className="btn small ghost" style={key === k ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => choose(k)}>{SS_PRESETS[k].label}</button>)}</div>
          <p className="small"><M>{`A = \\begin{bmatrix}${P.A.map((r) => r.map((v) => texNum(v)).join(' & ')).join('\\\\')}\\end{bmatrix},\\ B = \\begin{bmatrix}${P.B.map((r) => texNum(r[0])).join('\\\\')}\\end{bmatrix}`}</M></p>
          <p className="small muted">{P.note}</p>
          <h4>Estado inicial</h4>
          {x0.map((v, i) => {
            const lim = key === 'rlc' ? 2 : 3
            return <Slider key={i} tex={`${P.names[i]}(0)`} value={v} min={-lim} max={lim} step={0.05} onChange={(nv) => { const nx = x0.slice(); nx[i] = nv; setX0(nx) }} />
          })}
          <Slider tex="u\ (\text{degrau})" value={u} min={key === 'rlc' ? -0.3 : -2} max={key === 'rlc' ? 0.3 : 2} step={key === 'rlc' ? 0.01 : 0.05} onChange={setU} />
          <Readout items={[
            ['autovalores', lam.map((l) => fmt(l.re, 3) + (Math.abs(l.im) > 1e-9 ? (l.im > 0 ? '+j' : '−j') + fmt(Math.abs(l.im), 3) : '')).join(', ')],
            ['estabilidade', unstable ? 'instável' : lam.some((l) => Math.abs(l.re) < 1e-9) ? 'marginal' : 'estável'],
            ['equilíbrio', xeq ? xeq.map((v) => fmt(v, 3)).join(', ') : u === 0 ? 'origem' : '—'],
          ]} />
        </div>
      </div>
      <div className="sim-foot">
        <p>Equação característica <M>{`\\det(\\lambda I - A) = ${texPoly(cp, '\\lambda')} = 0`}</M>. Autovalores reais têm direções próprias (retas verdes): uma condição inicial sobre elas evolui sem sair da reta, como <M>{'e^{\\lambda t}'}</M>. Autovalores complexos fazem a trajetória girar (espiral). Cada estado é um ponto; a dinâmica <M>{'\\dot x = Ax + Bu'}</M> diz para onde ele se move (setas no chão).</p>
      </div>
    </Sim>
  )
}
