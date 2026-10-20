import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import Scene3D, { Label } from '../components/Scene3D.jsx'
import Plot from '../components/Plot.jsx'
import SPlane from '../components/SPlane.jsx'
import { Sim, Slider, Seg, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { usePlayback, at } from './usePlayback.js'
import Transport from './Transport.jsx'
import { fmt, texNum, texComplex } from '../lib/format.js'
import { roots } from '../lib/poly.js'

function simulate({ m, b, k, F, kind, w, x0, v0, tEnd }) {
  const N = 1500, dt = tEnd / N, sub = 6, h = dt / sub
  const f = (t) => kind === 'seno' ? F * Math.sin(w * t) : kind === 'pulso' ? (t < 0.3 ? F / 0.3 : 0) : kind === 'livre' ? 0 : F
  const T = [], Xs = [], Vs = [], U = []
  let x = x0, v = v0
  const d = (t, x, v) => [v, (f(t) - b * v - k * x) / m]
  for (let n = 0; n <= N; n++) {
    const t = n * dt
    T.push(t); Xs.push(x); Vs.push(v); U.push(f(t))
    for (let s = 0; s < sub; s++) {
      const tt = t + s * h
      const k1 = d(tt, x, v), k2 = d(tt + h / 2, x + h / 2 * k1[0], v + h / 2 * k1[1])
      const k3 = d(tt + h / 2, x + h / 2 * k2[0], v + h / 2 * k2[1]), k4 = d(tt + h, x + h * k3[0], v + h * k3[1])
      x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0])
      v += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])
    }
  }
  return { t: T, x: Xs, v: Vs, u: U }
}

class Helix extends THREE.Curve {
  constructor(turns, r) { super(); this.turns = turns; this.r = r }
  getPoint(u, target = new THREE.Vector3()) {
    const a = u * this.turns * 2 * Math.PI
    return target.set(u, this.r * Math.sin(a), this.r * Math.cos(a))
  }
}

const WALL = -3.2, REST = 0 // posição de repouso do centro do bloco
function Scene({ sim, pb, scale, c }) {
  const block = useRef(), spring = useRef(), rod = useRef(), arrow = useRef(), arrowHead = useRef()
  const helix = useMemo(() => new THREE.TubeGeometry(new Helix(9, 0.32), 300, 0.04, 8, false), [])
  useFrame(() => {
    const t = pb.tRef.current
    const x = at(sim.x, sim.t, t) * scale.k
    const u = at(sim.u, sim.t, t)
    const bx = REST + x
    if (block.current) block.current.position.x = bx
    const len = Math.max(0.3, bx - 0.6 - WALL)
    if (spring.current) { spring.current.scale.x = len; spring.current.position.x = WALL }
    if (rod.current) { rod.current.position.x = bx - 0.6 - 0.75 }
    const fl = Math.max(-2.2, Math.min(2.2, (u / scale.fmax) * 1.6))
    if (arrow.current) {
      arrow.current.visible = Math.abs(fl) > 0.02
      arrow.current.scale.x = Math.abs(fl) || 0.001
      arrow.current.position.x = bx + 0.6 + (fl >= 0 ? 0 : 0)
      arrow.current.rotation.y = fl >= 0 ? 0 : Math.PI
    }
  })
  return (
    <group>
      <mesh position={[0, -0.62, 0]}><boxGeometry args={[9, 0.12, 2.4]} /><meshStandardMaterial color={c.paper2} /></mesh>
      <mesh position={[WALL - 0.1, 0.4, 0]}><boxGeometry args={[0.2, 2.2, 2.4]} /><meshStandardMaterial color={c.grid} /></mesh>
      {/* mola k (vista superior: z = -0.45) */}
      <group position={[0, 0.35, -0.45]}>
        <mesh ref={spring} geometry={helix}><meshStandardMaterial color={c.ink2} metalness={0.5} roughness={0.35} /></mesh>
      </group>
      <Label position={[WALL + 1.2, 1.05, -0.45]} color={c.ink2}>k</Label>
      {/* amortecedor b (z = +0.45): cilindro fixo + haste móvel */}
      <mesh position={[WALL + 0.9, -0.05, 0.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.22, 0.22, 1.6, 24]} /><meshStandardMaterial color={c.ink3} transparent opacity={0.75} /></mesh>
      <mesh ref={rod} position={[0, -0.05, 0.45]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 1.5, 12]} /><meshStandardMaterial color={c.ink2} metalness={0.5} /></mesh>
      <Label position={[WALL + 0.9, -0.5, 0.95]} color={c.ink2}>b</Label>
      {/* massa */}
      <mesh ref={block} position={[REST, 0.1, 0]}>
        <boxGeometry args={[1.2, 1.3, 1.6]} />
        <meshStandardMaterial color={c.pen} metalness={0.15} roughness={0.5} />
      </mesh>
      {/* força f(t) */}
      <group ref={arrow} position={[REST + 0.6, 0.1, 0]}>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 1, 10]} /><meshStandardMaterial color={c.amber} /></mesh>
        <mesh ref={arrowHead} position={[1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.14, 0.3, 16]} /><meshStandardMaterial color={c.amber} /></mesh>
      </group>
      {/* régua de posição */}
      {[-2, -1, 0, 1, 2, 3].map((v) => (
        <group key={v}>
          <mesh position={[REST + v, -0.55, 1.3]}><boxGeometry args={[0.02, 0.02, 0.25]} /><meshBasicMaterial color={c.ink3} /></mesh>
          <Label position={[REST + v, -0.5, 1.6]} color={c.ink3} size={10}>{fmt(v / scale.k, 2)}</Label>
        </group>
      ))}
      <Label position={[REST, 1.2, 0]} color={c.ink}>m</Label>
    </group>
  )
}

export default function MassSpring3D({ title }) {
  const c = useThemeColors()
  const [m, setM] = useState(1)
  const [b, setB] = useState(0.6)
  const [k, setK] = useState(2)
  const [F, setF] = useState(1)
  const [kind, setKind] = useState('degrau')
  const [w, setW] = useState(1.4)
  const [x0, setX0] = useState(0)
  const [v0, setV0] = useState(0)

  const wn = Math.sqrt(k / m)
  const zeta = b / (2 * Math.sqrt(k * m))
  const decay = zeta < 1 ? zeta * wn : wn * (zeta - Math.sqrt(zeta * zeta - 1))
  const tEnd = Math.min(40, Math.max(8, 6 / Math.max(decay, 0.15)))
  const sim = useMemo(() => simulate({ m, b, k, F, kind, w, x0, v0, tEnd }), [m, b, k, F, kind, w, x0, v0, tEnd])
  const xmax = Math.max(...sim.x.map(Math.abs), 0.05)
  const scale = { k: 2.2 / xmax, fmax: Math.max(Math.abs(F), 0.1) * (kind === 'pulso' ? 1 / 0.3 : 1) }
  const pb = usePlayback(tEnd, { speed: tEnd / 10 })
  const poles = roots([m, b, k])
  const cls = zeta > 1.0001 ? 'superamortecido' : zeta > 0.9999 ? 'crítico' : zeta > 0 ? 'subamortecido' : 'sem amortecimento'
  const editable = poles.map((p) => ({ kind: 'pole', re: p.re, im: Math.abs(p.im) })).filter((p, i, a) => p.im === 0 || a.findIndex((q) => Math.abs(q.re - p.re) < 1e-9 && q.im > 0) === i)

  return (
    <Sim title={title || 'Massa–mola–amortecedor em 3D'} sub="m ẍ + b ẋ + k x = f(t)">
      <div className="sim-body">
        <div>
          <Scene3D camera={[0.5, 4.2, 7.2]} target={[0, 0, 0]}>
            <Scene sim={sim} pb={pb} scale={scale} c={c} />
          </Scene3D>
          <Transport pb={pb} tEnd={tEnd} />
          <Plot height={200} xRange={[0, tEnd]} vLines={[{ x: pb.t, color: 'var(--ink-2)', dash: '2 3' }]}
            hLines={kind === 'degrau' ? [{ y: F / k }] : []} yLabel="deslocamento"
            series={[{ x: sim.t, y: sim.x, color: 'var(--pen)', label: 'x(t)' }, { x: sim.t, y: sim.u.map((u) => u / k), color: 'var(--amber)', dash: '5 4', width: 1.4, label: 'f(t)/k' }]} />
        </div>
        <div className="sim-controls">
          <h4>Parâmetros</h4>
          <Slider label="massa m" value={m} min={0.2} max={5} step={0.05} unit="kg" onChange={setM} />
          <Slider label="amortecimento b" value={b} min={0} max={8} step={0.05} unit="N·s/m" onChange={setB} />
          <Slider label="rigidez k" value={k} min={0.2} max={10} step={0.05} unit="N/m" onChange={setK} />
          <h4>Força aplicada</h4>
          <Seg label="Força" value={kind} onChange={setKind} options={[{ value: 'degrau', label: 'degrau' }, { value: 'pulso', label: 'pancada' }, { value: 'seno', label: 'senoidal' }, { value: 'livre', label: 'livre' }]} />
          {kind !== 'livre' && <Slider label="amplitude F" value={F} min={-3} max={3} step={0.1} unit="N" onChange={setF} />}
          {kind === 'seno' && <Slider label="ω (rad/s)" value={w} min={0.1} max={5} step={0.02} onChange={setW} />}
          <h4>Condições iniciais</h4>
          <Slider tex="x(0)" value={x0} min={-2} max={2} step={0.05} unit="m" onChange={setX0} />
          <Slider tex="\dot x(0)" value={v0} min={-3} max={3} step={0.05} unit="m/s" onChange={setV0} />
          <div style={{ maxWidth: 260 }}>
            <SPlane roots={editable} editable={false} xr={[-Math.max(4, Math.ceil(-Math.min(...poles.map((p) => p.re)) + 1)), 1]} yr={[-4, 4]} size={260} label={false} />
          </div>
          <Readout items={[['ωn', `${fmt(wn)} rad/s`], ['ξ', fmt(zeta)], ['resposta', cls]]} />
        </div>
      </div>
      <div className="sim-foot">
        <p><M>{`\\dfrac{X(s)}{F(s)} = \\dfrac{1}{${texNum(m)}s^2 + ${texNum(b)}s + ${texNum(k)}}`}</M>, polos <M>{poles.map((p) => texComplex(p)).join(',\\ ')}</M>.
          {kind === 'seno' && <> Com entrada senoidal perto de <M>{`\\omega_n = ${texNum(wn)}`}</M> e pouco amortecimento a amplitude cresce bastante (ressonância).</>}</p>
      </div>
    </Sim>
  )
}
