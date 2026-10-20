import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import Scene3D, { Label } from '../components/Scene3D.jsx'
import Plot from '../components/Plot.jsx'
import { Sim, Slider, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { usePlayback, at } from './usePlayback.js'
import Transport from './Transport.jsx'
import { simulateSS } from '../lib/lti.js'
import { fmt, texNum, texComplex } from '../lib/format.js'
import { roots } from '../lib/poly.js'

// ---------------- disco com eixo torcional ----------------
function TorsionScene({ sim, pb, c }) {
  const disk = useRef(), marks = useRef()
  useFrame(() => {
    const th = at(sim.th, sim.t, pb.tRef.current)
    if (disk.current) disk.current.rotation.x = th
    if (marks.current) marks.current.children.forEach((m, k) => { m.rotation.x = (th * (k + 1)) / marks.current.children.length })
  })
  return (
    <group>
      <mesh position={[-3.3, 0, 0]}><boxGeometry args={[0.3, 2.6, 2.6]} /><meshStandardMaterial color={c.grid} /></mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-1.4, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 3.6, 16]} /><meshStandardMaterial color={c.ink3} metalness={0.5} /></mesh>
      <group ref={marks}>
        {Array.from({ length: 10 }, (_, k) => (
          <group key={k} position={[-3 + (k + 1) * 0.32, 0, 0]}>
            <mesh position={[0, 0.13, 0]}><boxGeometry args={[0.04, 0.12, 0.04]} /><meshStandardMaterial color={c.pole} /></mesh>
          </group>
        ))}
      </group>
      <Label position={[-1.6, 0.6, 0]} color={c.ink2}>eixo (rigidez K)</Label>
      <group ref={disk} position={[0.6, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[1.3, 1.3, 0.35, 48]} /><meshStandardMaterial color={c.pen} metalness={0.2} roughness={0.5} /></mesh>
        <mesh position={[0.19, 0.75, 0]}><boxGeometry args={[0.04, 1.1, 0.16]} /><meshStandardMaterial color={c.amber} /></mesh>
      </group>
      <Label position={[0.6, 1.75, 0]} color={c.ink}>J</Label>
      {/* amortecedor viscoso: pás em fluido */}
      <mesh position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.6, 0.6, 0.9, 32, 1, true]} /><meshStandardMaterial color={c.ink3} transparent opacity={0.3} side={2} /></mesh>
      <Label position={[1.6, -0.95, 0]} color={c.ink2}>atrito viscoso B</Label>
    </group>
  )
}

export function TorsionSim() {
  const c = useThemeColors()
  const [J, setJ] = useState(1)
  const [B, setB] = useState(0.4)
  const [K, setK] = useState(4)
  const [T0, setT0] = useState(2)
  const wn = Math.sqrt(K / J), xi = B / (2 * Math.sqrt(K * J))
  const tEnd = Math.min(40, Math.max(6, 6 / Math.max(0.12, xi < 1 ? xi * wn : wn * (xi - Math.sqrt(xi * xi - 1)))))
  const sim = useMemo(() => {
    const r = simulateSS({ A: [[0, 1], [-K / J, -B / J]], B: [[0], [1 / J]], C: [[1, 0]], D: [[0]] }, () => T0, tEnd, { dt: tEnd / 3000, every: 2 })
    return { t: r.t, th: r.y }
  }, [J, B, K, T0, tEnd])
  const pb = usePlayback(tEnd, { speed: tEnd / 10 })
  const p = roots([J, B, K])
  return (
    <Sim title="Sistema rotacional: inércia, mola torcional e atrito viscoso" sub="J θ̈ + B θ̇ + K θ = T(t)">
      <div className="sim-body">
        <div>
          <Scene3D camera={[2.5, 3, 6.5]} target={[-0.5, 0, 0]} height={340}>
            <TorsionScene sim={sim} pb={pb} c={c} />
          </Scene3D>
          <Transport pb={pb} tEnd={tEnd} />
          <Plot height={190} xRange={[0, tEnd]} yLabel="θ(t) (rad)" hLines={[{ y: T0 / K }]} vLines={[{ x: pb.t, dash: '2 3' }]} series={[{ x: sim.t, y: sim.th, color: 'var(--pen)', label: 'θ(t)' }]} />
        </div>
        <div className="sim-controls">
          <Slider label="inércia J" value={J} min={0.1} max={5} step={0.05} unit="kg·m²" onChange={setJ} />
          <Slider label="atrito B" value={B} min={0} max={8} step={0.05} unit="N·m·s" onChange={setB} />
          <Slider label="rigidez K" value={K} min={0.2} max={10} step={0.05} unit="N·m/rad" onChange={setK} />
          <Slider label="torque T (degrau)" value={T0} min={-4} max={4} step={0.1} unit="N·m" onChange={setT0} />
          <Readout items={[['ωn', fmt(wn)], ['ξ', fmt(xi)], ['θ final = T/K', fmt(T0 / K)]]} />
        </div>
      </div>
      <div className="sim-foot"><p><M>{`\\dfrac{\\Theta(s)}{T(s)} = \\dfrac{1}{${texNum(J)}s^2+${texNum(B)}s+${texNum(K)}}`}</M>, polos <M>{p.map((z) => texComplex(z)).join(',\\ ')}</M>. É a mesma estrutura do massa–mola–amortecedor: <M>{'m \\leftrightarrow J'}</M>, <M>{'b \\leftrightarrow B'}</M>, <M>{'k \\leftrightarrow K'}</M>, força ↔ torque. As marcas vermelhas mostram a torção crescente ao longo do eixo.</p></div>
    </Sim>
  )
}

// ---------------- motor CC ----------------
function MotorScene({ sim, pb, c }) {
  const rotor = useRef(), angle = useRef(0), last = useRef(0), glow = useRef()
  useFrame(() => {
    const t = pb.tRef.current
    const th = at(sim.th, sim.t, t)
    const i = at(sim.i, sim.t, t)
    if (rotor.current) rotor.current.rotation.x = th
    if (glow.current) glow.current.emissiveIntensity = Math.min(1, Math.abs(i) / sim.imax) * 0.9
  })
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[1.25, 1.25, 2.4, 40, 1, true]} /><meshStandardMaterial color={c.ink3} transparent opacity={0.22} side={2} /></mesh>
      {/* ímãs do estator */}
      <mesh position={[0, 1.05, 0]}><boxGeometry args={[1.8, 0.25, 0.9]} /><meshStandardMaterial color={c.pole} /></mesh>
      <mesh position={[0, -1.05, 0]}><boxGeometry args={[1.8, 0.25, 0.9]} /><meshStandardMaterial color={c.pen} /></mesh>
      <Label position={[0, 1.45, 0]} color={c.pole}>N</Label>
      <Label position={[0, -1.45, 0]} color={c.pen}>S</Label>
      <group ref={rotor}>
        <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.7, 0.7, 1.7, 24]} /><meshStandardMaterial ref={glow} color={'#b87333'} emissive={c.amber} emissiveIntensity={0} metalness={0.4} roughness={0.4} /></mesh>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <mesh key={k} rotation={[(k * Math.PI) / 3, 0, 0]} position={[0, 0, 0]}><boxGeometry args={[1.75, 0.08, 1.48]} /><meshStandardMaterial color={'#8a5a2b'} /></mesh>
        ))}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[2.2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 2.2, 16]} /><meshStandardMaterial color={c.ink2} metalness={0.6} /></mesh>
        <mesh position={[3.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.9, 0.9, 0.12, 6]} /><meshStandardMaterial color={c.pen} /></mesh>
        <mesh position={[3.28, 0.55, 0]}><boxGeometry args={[0.04, 0.5, 0.18]} /><meshStandardMaterial color={c.amber} /></mesh>
      </group>
      <Label position={[3.2, 1.25, 0]} color={c.ink}>carga J</Label>
    </group>
  )
}

export function DCMotorSim() {
  const c = useThemeColors()
  const [V, setV] = useState(12)
  const [R, setR] = useState(1)
  const [L, setL] = useState(0.5)
  const [Kt, setKt] = useState(0.5)
  const [J, setJ] = useState(0.1)
  const [B, setB] = useState(0.05)
  const A = [[-R / L, -Kt / L, 0], [Kt / J, -B / J, 0], [0, 1, 0]]
  const p = roots([L * J, R * J + L * B, R * B + Kt * Kt])
  const slow = Math.min(...p.map((z) => Math.abs(z.re)))
  const tEnd = Math.min(30, Math.max(2, 6 / slow))
  const sim = useMemo(() => {
    const r = simulateSS({ A, B: [[1 / L], [0], [0]], C: [[0, 1, 0]], D: [[0]] }, () => V, tEnd, { dt: Math.min(tEnd / 4000, L / R / 20), every: 4 })
    const i = r.x.map((x) => x[0])
    return { t: r.t, w: r.y, i, th: r.x.map((x) => x[2] * 0.15), imax: Math.max(...i.map(Math.abs), 1e-3) }
  }, [V, R, L, Kt, J, B, tEnd])
  const pb = usePlayback(tEnd, { speed: tEnd / 10 })
  const wss = (Kt * V) / (R * B + Kt * Kt)
  return (
    <Sim title="Motor CC controlado pela armadura" sub="circuito elétrico + rotor mecânico acoplados (rotação exibida em câmera lenta)">
      <div className="sim-body">
        <div>
          <Scene3D camera={[2.5, 3, 6.5]} target={[1, 0, 0]} height={320}>
            <MotorScene sim={sim} pb={pb} c={c} />
          </Scene3D>
          <Transport pb={pb} tEnd={tEnd} />
          <Plot height={170} xRange={[0, tEnd]} yLabel="ω (rad/s)" hLines={[{ y: wss }]} vLines={[{ x: pb.t, dash: '2 3' }]} series={[{ x: sim.t, y: sim.w, color: 'var(--pen)', label: 'velocidade ω(t)' }]} />
          <Plot height={140} xRange={[0, tEnd]} yLabel="i (A)" vLines={[{ x: pb.t, dash: '2 3' }]} series={[{ x: sim.t, y: sim.i, color: 'var(--amber)', label: 'corrente i(t)' }]} />
        </div>
        <div className="sim-controls">
          <Slider label="tensão V (degrau)" value={V} min={-24} max={24} step={0.5} unit="V" onChange={setV} />
          <Slider label="R armadura" value={R} min={0.1} max={10} step={0.05} unit="Ω" onChange={setR} />
          <Slider label="L armadura" value={L} min={0.01} max={2} step={0.01} unit="H" onChange={setL} />
          <Slider label="K = Kt = Kb" value={Kt} min={0.05} max={2} step={0.01} onChange={setKt} />
          <Slider label="inércia J" value={J} min={0.01} max={1} step={0.01} unit="kg·m²" onChange={setJ} />
          <Slider label="atrito B" value={B} min={0} max={1} step={0.005} unit="N·m·s" onChange={setB} />
          <Readout items={[['ω em regime', `${fmt(wss)} rad/s`], ['polos', p.map((z) => fmt(z.re, 3) + (Math.abs(z.im) > 1e-9 ? (z.im > 0 ? '+j' : '−j') + fmt(Math.abs(z.im), 3) : '')).join('; ')], ['pico de corrente', `${fmt(sim.imax)} A`]]} />
        </div>
      </div>
      <div className="sim-foot">
        <p><M>{String.raw`L\frac{di}{dt} + Ri + K_b\,\omega = v,\qquad J\frac{d\omega}{dt} + B\omega = K_t\, i`}</M> &nbsp;⇒&nbsp; <M>{String.raw`\frac{\Omega(s)}{V(s)} = \frac{K_t}{(Ls+R)(Js+B)+K_tK_b}`}</M>. A força contraeletromotriz <M>{'K_b\\omega'}</M> faz a corrente cair à medida que o motor acelera: veja o pico de corrente na partida.</p>
      </div>
    </Sim>
  )
}
