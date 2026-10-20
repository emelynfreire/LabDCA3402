import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import Scene3D, { Axis, Label } from '../components/Scene3D.jsx'
import Plot from '../components/Plot.jsx'
import { Sim, Seg, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { usePlayback } from './usePlayback.js'
import Transport from './Transport.jsx'
import { fmt } from '../lib/format.js'

const G = {
  rl: { tex: 'g(t)=2e^{-2t}', f: (t) => (t >= 0 ? 2 * Math.exp(-2 * t) : 0), label: '2e^(−2t) (circuito RL)' },
  e2: { tex: 'g(t)=e^{-2t}', f: (t) => (t >= 0 ? Math.exp(-2 * t) : 0), label: 'e^(−2t)' },
  e1: { tex: 'g(t)=e^{-t}', f: (t) => (t >= 0 ? Math.exp(-t) : 0), label: 'e^(−t)' },
}
const U = {
  pulso02: { tex: 'u(t)=1,\\ 0\\le t<2', f: (t) => (t >= 0 && t < 2 ? 1 : 0), label: 'pulso 0–2 s' },
  degrau: { tex: 'u(t)=u_{-1}(t)', f: (t) => (t >= 0 ? 1 : 0), label: 'degrau' },
  pulso13: { tex: 'u(t)=u_{-1}(t-1)-u_{-1}(t-3)', f: (t) => (t >= 1 && t < 3 ? 1 : 0), label: 'pulso 1–3 s' },
  exp: { tex: 'u(t)=e^{-t}', f: (t) => (t >= 0 ? Math.exp(-t) : 0), label: 'e^(−t)' },
}
const closed = {
  'rl|pulso02': String.raw`y(t)=\begin{cases}1-e^{-2t}, & 0\le t<2\\ e^{-2(t-2)}-e^{-2t}, & t\ge 2\end{cases}`,
  'e2|degrau': String.raw`y(t)=\tfrac{1}{2}\left(1-e^{-2t}\right)`,
  'e1|pulso13': String.raw`y(t)=\begin{cases}0, & t<1\\ 1-e^{-(t-1)}, & 1\le t<3\\ (1-e^{-2})\,e^{-(t-3)}, & t\ge 3\end{cases}`,
  'e1|exp': String.raw`y(t)=t\,e^{-t}\ \text{(polo duplo em } s=-1)`,
  'rl|degrau': String.raw`y(t)=1-e^{-2t}`,
  'e1|degrau': String.raw`y(t)=1-e^{-t}`,
}

const T = 6
const N = 240

function convolve(g, u) {
  const dt = T / N
  const ts = [], ys = []
  for (let i = 0; i <= N; i++) {
    const t = i * dt
    let acc = 0
    for (let j = 0; j <= i; j++) {
      const w = j === 0 || j === i ? 0.5 : 1
      acc += w * g(t - j * dt) * u(j * dt)
    }
    ts.push(t); ys.push(acc * dt)
  }
  return { t: ts, y: ys }
}

// superfície z = g(t − τ) u(τ) no plano (τ, t)
function Surface({ g, u, pb, conv, c, hmax }) {
  const S = 6 / T
  const H = 2.2 / hmax
  const geom = useMemo(() => {
    const n = 90
    const pos = [], col = [], idx = []
    const cLow = new THREE.Color(c.paper2), cHigh = new THREE.Color(c.pen)
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
      const t = (i / n) * T, tau = (j / n) * T
      const z = tau <= t ? g(t - tau) * u(tau) : 0
      pos.push(tau * S - 3, z * H, t * S - 3)
      const cc = cLow.clone().lerp(cHigh, Math.min(1, z / hmax))
      col.push(cc.r, cc.g, cc.b)
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const a = i * (n + 1) + j, b = a + 1, d = a + n + 1, e = d + 1
      idx.push(a, d, b, b, d, e)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    return geo
  }, [g, u, c.pen, c.paper2, hmax])

  const slice = useRef()
  const sliceLine = useRef()
  const ymax = Math.max(...conv.y, 1e-6)
  const yScale = 2.2 / ymax
  const yCurve = conv.t.map((t, i) => [3.25, conv.y[i] * yScale, t * S - 3])

  useFrame(() => {
    const t = pb.tRef.current
    if (slice.current) slice.current.position.z = t * S - 3
    if (sliceLine.current) {
      const pts = []
      for (let k = 0; k <= 80; k++) {
        const tau = (k / 80) * t
        pts.push(tau * S - 3, g(t - tau) * u(tau) * H + 0.01, t * S - 3)
      }
      // linha da fatia: atualiza a geometria
      sliceLine.current.geometry.setPositions(pts)
    }
  })

  return (
    <group>
      <mesh geometry={geom}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.8} transparent opacity={0.92} />
      </mesh>
      <mesh ref={slice} rotation={[0, 0, 0]} position={[0, 1.1, -3]}>
        <planeGeometry args={[6, 2.6]} />
        <meshBasicMaterial color={c.amber} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Line ref={sliceLine} points={[[-3, 0, -3], [-3, 0, -3]]} color={c.pole} lineWidth={3} />
      <Line points={yCurve} color={c.good} lineWidth={2.5} />
      <Axis from={[-3, 0, -3]} to={[3.4, 0, -3]} color={c.ink2} label="τ" />
      <Axis from={[-3, 0, -3]} to={[-3, 0, 3.4]} color={c.ink2} label="t" />
      <Axis from={[-3, 0, -3]} to={[-3, 2.6, -3]} color={c.ink2} label="g(t−τ)u(τ)" />
      <Label position={[3.3, 2.5, 2.6]} color={c.good}>y(t) = área da fatia</Label>
    </group>
  )
}

export default function ConvolutionSim() {
  const c = useThemeColors()
  const [gk, setGk] = useState('rl')
  const [uk, setUk] = useState('pulso02')
  const [view, setView] = useState('2d')
  const g = G[gk].f, u = U[uk].f
  const conv = useMemo(() => convolve(g, u), [gk, uk])
  const pb = usePlayback(T, { speed: 0.8 })
  const t = pb.t
  const taus = useMemo(() => Array.from({ length: 401 }, (_, i) => -1 + (i / 400) * (T + 1)), [])
  const gFlip = taus.map((tau) => g(t - tau))
  const uTau = taus.map((tau) => u(tau))
  const prod = taus.map((tau, i) => gFlip[i] * uTau[i])
  const idx = Math.min(N, Math.round((t / T) * N))
  const yNow = conv.y[idx]
  const hmax = Math.max(...taus.map((tau) => g(0) * u(tau)), 0.1)
  const key = gk + '|' + uk

  return (
    <Sim title="Integral de convolução: rebater, deslocar, multiplicar, integrar" sub={view === '2d' ? 'g(t − τ) desliza sobre u(τ)' : 'cada fatia t = constante tem área y(t)'}>
      <div className="sim-body">
        <div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Seg label="Visualização" value={view} onChange={setView} options={[{ value: '2d', label: 'Animação 2D' }, { value: '3d', label: 'Superfície 3D' }]} />
          </div>
          {view === '2d' ? (
            <>
              <Plot height={210} xRange={[-1, T]} xLabel="τ (s)" yLabel="no instante t" vLines={[{ x: t, color: 'var(--pole)', dash: '3 3' }]}
                series={[
                  { x: taus, y: prod, color: 'var(--good)', fill: 'var(--good)', fillOpacity: 0.3, width: 1, label: 'g(t−τ)·u(τ)  (área = y(t))' },
                  { x: taus, y: uTau, color: 'var(--ink-2)', width: 2, label: 'u(τ)' },
                  { x: taus, y: gFlip, color: 'var(--pen)', width: 2.2, label: 'g(t−τ) – rebatida e deslocada' },
                ]} />
              <Plot height={180} xRange={[0, T]} yLabel="y(t)"
                series={[{ x: conv.t, y: conv.y, color: 'var(--grid-strong)', width: 1.5, dash: '4 4' }, { x: conv.t.slice(0, idx + 1), y: conv.y.slice(0, idx + 1), color: 'var(--good)', width: 2.4, label: 'y(t) = g(t) * u(t)' }]}
                markers={[{ x: t, y: yNow, color: 'var(--good)' }]} />
            </>
          ) : (
            <Scene3D camera={[7, 5.5, 6]} target={[0, 0.6, 0]} height={430}>
              <Surface g={g} u={u} pb={pb} conv={conv} c={c} hmax={hmax} />
            </Scene3D>
          )}
          <Transport pb={pb} tEnd={T} />
        </div>
        <div className="sim-controls">
          <h4>Resposta ao impulso</h4>
          <div className="btn-row">{Object.entries(G).map(([k, v]) => <button key={k} className="btn small" aria-pressed={gk === k} style={gk === k ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => setGk(k)}>{v.label}</button>)}</div>
          <h4>Entrada</h4>
          <div className="btn-row">{Object.entries(U).map(([k, v]) => <button key={k} className="btn small" aria-pressed={uk === k} style={uk === k ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => setUk(k)}>{v.label}</button>)}</div>
          <Readout items={[['t', `${fmt(t, 2)} s`], ['y(t) numérico', fmt(yNow, 4)]]} />
          <p className="small muted" style={{ marginTop: '.8rem' }}><M>{G[gk].tex}</M>, <M>{U[uk].tex}</M></p>
          {closed[key] && <p className="small"><M>{closed[key]}</M></p>}
        </div>
      </div>
      <div className="sim-foot">
        <p><M>{String.raw`y(t) = \int_0^t g(t-\tau)\,u(\tau)\,d\tau`}</M>: para cada instante <M>t</M>, a resposta ao impulso é rebatida (<M>{'\\tau \\to -\\tau'}</M>), deslocada de <M>t</M>, multiplicada pela entrada e integrada. Só contribuem os valores de <M>{'u(\\tau)'}</M> com <M>{'0 \\le \\tau \\le t'}</M> — o sistema é causal e relaxado.</p>
      </div>
    </Sim>
  )
}
