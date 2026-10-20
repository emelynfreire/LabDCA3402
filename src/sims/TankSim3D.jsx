import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import Scene3D, { Label } from '../components/Scene3D.jsx'
import Plot from '../components/Plot.jsx'
import { Sim, Slider, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { usePlayback, at } from './usePlayback.js'
import Transport from './Transport.jsx'
import { fmt, texNum } from '../lib/format.js'

// parâmetros da Simulação 3 dos slides (aula 4): A = 15, a = 0,2, g = 1000
const Aa = 15, a = 0.2, g = 1000
const k = a * Math.sqrt(2 * g)

function simulate(y0, du, tEnd) {
  const u0 = k * Math.sqrt(y0)
  const u = u0 + du
  const Rl = (2 * Math.sqrt(y0)) / k // resistência linearizada
  const N = 1500, dt = tEnd / N
  const T = [], Yn = [], Yl = [], Qn = []
  let yn = y0, dy = 0
  const fn = (y) => (u - k * Math.sqrt(Math.max(y, 0))) / Aa
  const fl = (d) => (du - d / Rl) / Aa
  for (let i = 0; i <= N; i++) {
    T.push(i * dt); Yn.push(yn); Yl.push(y0 + dy); Qn.push(k * Math.sqrt(Math.max(yn, 0)))
    const k1 = fn(yn), k2 = fn(yn + dt / 2 * k1), k3 = fn(yn + dt / 2 * k2), k4 = fn(yn + dt * k3)
    yn += dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    const l1 = fl(dy), l2 = fl(dy + dt / 2 * l1), l3 = fl(dy + dt / 2 * l2), l4 = fl(dy + dt * l3)
    dy += dt / 6 * (l1 + 2 * l2 + 2 * l3 + l4)
  }
  return { t: T, yn: Yn, yl: Yl, q: Qn, u0, u, Rl, tau: Aa * Rl }
}

function Tank({ x, sim, series, pb, ymax, c, label, color }) {
  const water = useRef(), outflow = useRef()
  const H = 3.6
  useFrame(() => {
    const y = at(series, sim.t, pb.tRef.current)
    const h = Math.max(0.02, Math.min(H, (y / ymax) * H))
    if (water.current) { water.current.scale.y = h; water.current.position.y = h / 2 }
    if (outflow.current) { const r = 0.04 + 0.1 * Math.sqrt(Math.max(y, 0) / ymax); outflow.current.scale.set(r / 0.1, 1, r / 0.1) }
  })
  const inR = 0.04 + 0.1 * Math.min(1, sim.u / (k * Math.sqrt(ymax)))
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, H / 2, 0]}>
        <cylinderGeometry args={[1, 1, H, 40, 1, true]} />
        <meshStandardMaterial color={c.ink3} transparent opacity={0.18} side={2} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1, 40]} /><meshStandardMaterial color={c.grid} /></mesh>
      <mesh ref={water} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.97, 0.97, 1, 40]} />
        <meshStandardMaterial color={color} transparent opacity={0.75} />
      </mesh>
      {/* vazão de entrada */}
      <mesh position={[-0.3, H + 0.4, 0]}><cylinderGeometry args={[inR, inR, H + 0.8, 12]} /><meshStandardMaterial color={color} transparent opacity={0.45} /></mesh>
      {/* orifício e jato de saída */}
      <mesh position={[1.25, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.12, 0.12, 0.5, 12]} /><meshStandardMaterial color={c.ink3} /></mesh>
      <mesh ref={outflow} position={[1.6, -0.5, 0]}><cylinderGeometry args={[0.1, 0.1, 1.2, 12]} /><meshStandardMaterial color={color} transparent opacity={0.55} /></mesh>
      <Label position={[0, H + 1.6, 0]} color={c.ink}>{label}</Label>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <Label key={f} position={[-1.35, f * H, 0]} color={c.ink3} size={10}>{fmt(f * ymax, 3)}</Label>
      ))}
    </group>
  )
}

export default function TankSim3D() {
  const c = useThemeColors()
  const [y0, setY0] = useState(20)
  const [pct, setPct] = useState(30)
  const u0 = k * Math.sqrt(y0)
  const du = (pct / 100) * u0
  const Rl0 = (2 * Math.sqrt(y0)) / k
  const tEnd = Math.min(400, 6 * Aa * Rl0 * Math.max(1, 1 + pct / 100))
  const sim = useMemo(() => simulate(y0, du, tEnd), [y0, du, tEnd])
  const yss = (sim.u / k) ** 2
  const ymax = Math.max(yss, y0, ...sim.yl) * 1.25
  const pb = usePlayback(tEnd, { speed: tEnd / 10 })
  // curva estática q = k√y e tangente no ponto de operação
  const ys = Array.from({ length: 200 }, (_, i) => (i / 199) * ymax)
  const qs = ys.map((y) => k * Math.sqrt(y))
  const tang = ys.map((y) => u0 + (y - y0) / Rl0)

  return (
    <Sim title="Linearização: tanque com saída livre" sub="modelo não linear × modelo linearizado no ponto de operação">
      <div className="sim-body">
        <div>
          <Scene3D camera={[0, 4.5, 10]} target={[0, 1.8, 0]} height={360}>
            <Tank x={-2.3} sim={sim} series={sim.yn} pb={pb} ymax={ymax} c={c} label="não linear" color={c.pen} />
            <Tank x={2.3} sim={sim} series={sim.yl} pb={pb} ymax={ymax} c={c} label="linearizado" color={c.amber} />
          </Scene3D>
          <Transport pb={pb} tEnd={tEnd} />
          <Plot height={200} xRange={[0, tEnd]} yLabel="nível y(t)" vLines={[{ x: pb.t, dash: '2 3' }]}
            series={[{ x: sim.t, y: sim.yn, color: 'var(--pen)', label: 'não linear' }, { x: sim.t, y: sim.yl, color: 'var(--amber)', dash: '6 4', label: 'linearizado' }]} />
        </div>
        <div className="sim-controls">
          <Slider tex="\bar y\ (\text{operação})" value={y0} min={4} max={60} step={0.5} onChange={setY0} />
          <Slider label="degrau Δu (% de ū)" value={pct} min={-80} max={150} step={1} unit="%" onChange={setPct} digits={0} />
          <Plot height={190} xRange={[0, ymax]} xLabel="nível y" yLabel="vazão de saída"
            series={[{ x: ys, y: qs, color: 'var(--pen)', label: 'q = a√(2gy)' }, { x: ys, y: tang, color: 'var(--amber)', dash: '6 4', label: 'reta tangente' }]}
            markers={[{ x: y0, y: u0, color: 'var(--pole)' }]} />
          <Readout items={[['ū (equilíbrio)', fmt(u0)], ['R linearizada', fmt(sim.Rl)], ['τ = A·R', `${fmt(sim.tau)} s`], ['erro final', `${fmt(Math.abs(sim.yl[sim.yl.length - 1] - sim.yn[sim.yn.length - 1]) / Math.max(1e-6, Math.abs(yss - y0)) * 100, 2)}%`]]} />
        </div>
      </div>
      <div className="sim-foot">
        <p>Não linear: <M>{String.raw`A\dot y = u - a\sqrt{2gy}`}</M>. Expandindo <M>{String.raw`a\sqrt{2gy}`}</M> em série de Taylor em torno de <M>{'\\bar y'}</M> e mantendo o termo de 1ª ordem: <M>{String.raw`A\,\delta\dot y = \delta u - \dfrac{\delta y}{R}`}</M>, com <M>{`R = \\dfrac{2\\sqrt{\\bar y}}{a\\sqrt{2g}} = ${texNum(sim.Rl)}`}</M>. Para degraus pequenos as curvas praticamente coincidem; aumente <M>{'\\Delta u'}</M> e veja o modelo linear se afastar — a aproximação só vale perto do ponto de operação.</p>
      </div>
    </Sim>
  )
}
