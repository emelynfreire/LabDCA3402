import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import Scene3D, { Label } from '../components/Scene3D.jsx'
import Plot from '../components/Plot.jsx'
import { Sim, Slider, Seg, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { usePlayback, at } from './usePlayback.js'
import Transport from './Transport.jsx'
import { fmt, texNum, texComplex } from '../lib/format.js'
import { roots } from '../lib/poly.js'

// ---------- simulação numérica (RK4) ----------
function makeInput(kind, E, w) {
  switch (kind) {
    case 'pulso': return (t) => (t >= 0.5 && t < 0.5 + Math.PI / w * 2 ? E : 0)
    case 'seno': return (t) => E * Math.sin(w * t)
    case 'quadrada': return (t) => (Math.floor((t * w) / Math.PI) % 2 === 0 ? E : -E)
    default: return (t) => (t >= 0 ? E : 0)
  }
}

function simulate({ mode, R, L, C, input, v0, i0, tEnd }) {
  const N = 1200
  const dt = tEnd / N
  const T = [], V = [], I = [], U = []
  let v = v0, i = mode === 'RLC' ? i0 : 0
  const f = (t, v, i) => {
    const e = input(t)
    if (mode === 'RC') return [(e - v) / (R * C), 0]
    return [i / C, (e - R * i - v) / L]
  }
  const sub = 8
  const h = dt / sub
  for (let k = 0; k <= N; k++) {
    const t = k * dt
    const e = input(t)
    T.push(t); V.push(v); U.push(e)
    I.push(mode === 'RC' ? (e - v) / R : i)
    for (let s = 0; s < sub; s++) {
      const tt = t + s * h
      const k1 = f(tt, v, i)
      const k2 = f(tt + h / 2, v + (h / 2) * k1[0], i + (h / 2) * k1[1])
      const k3 = f(tt + h / 2, v + (h / 2) * k2[0], i + (h / 2) * k2[1])
      const k4 = f(tt + h, v + h * k3[0], i + h * k3[1])
      v += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0])
      i += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])
    }
  }
  return { t: T, v: V, i: I, u: U }
}

// ---------- geometria do circuito ----------
const X = 3.2, Z = 1.7
const corners = [[-X, 0, Z], [-X, 0, -Z], [X, 0, -Z], [X, 0, Z]]
const segLen = [2 * Z, 2 * X, 2 * Z, 2 * X]
const P = segLen.reduce((a, b) => a + b, 0)
function pathPos(s) {
  s = ((s % P) + P) % P
  for (let k = 0; k < 4; k++) {
    if (s <= segLen[k]) {
      const a = corners[k], b = corners[(k + 1) % 4]
      const w = s / segLen[k]
      return [a[0] + (b[0] - a[0]) * w, 0.12, a[2] + (b[2] - a[2]) * w]
    }
    s -= segLen[k]
  }
  return corners[0]
}

class Helix extends THREE.Curve {
  constructor(x0, x1, r, turns, z) { super(); Object.assign(this, { x0, x1, r, turns, z }) }
  getPoint(u, target = new THREE.Vector3()) {
    const a = u * this.turns * Math.PI * 2
    return target.set(this.x0 + (this.x1 - this.x0) * u, 0.35 + this.r * Math.sin(a), this.z + this.r * Math.cos(a))
  }
}

function Circuit({ sim, mode, pb, scale, c }) {
  const NP = 70
  const dots = useRef()
  const plateP = useRef(), plateN = useRef(), resistor = useRef(), field = useRef(), rings = useRef(), srcMat = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const coil = useMemo(() => new THREE.TubeGeometry(new Helix(0.5, 2.1, 0.3, 7, -Z), 220, 0.045, 8, false), [])
  const penCol = useMemo(() => new THREE.Color(c.pen), [c.pen])
  // linhas de campo do solenoide: atravessam o interior ao longo do eixo e fecham por fora
  const fieldLoops = useMemo(() => {
    const cx = 1.3, cy = 0.35, cz = -Z, half = 0.8
    const loops = []
    ;[[0.08, 0.55, 1], [0.08, 0.55, -1], [0.04, 0.9, 1], [0.04, 0.9, -1]].forEach(([inner, outer, side]) => {
      const pts = []
      for (let i = 0; i <= 20; i++) pts.push([cx - half + (2 * half * i) / 20, cy + side * inner, cz])
      for (let i = 0; i <= 40; i++) {
        const a = (i / 40) * Math.PI
        pts.push([cx + (half + 0.35) * Math.cos(a) * (i === 0 ? half / (half + 0.35) : 1), cy + side * (inner + (outer - inner) * Math.sin(a) + 0.0), cz])
      }
      pts.push([cx - half, cy + side * inner, cz])
      loops.push(pts)
    })
    return loops
  }, [])

  useFrame(() => {
    const t = pb.tRef.current
    const v = at(sim.v, sim.t, t)
    const i = at(sim.i, sim.t, t)
    const e = at(sim.u, sim.t, t)
    // carga que circulou: q = C (vC - vC0)  → deslocamento das partículas
    const q = (v - sim.v[0]) * scale.qk
    if (dots.current) {
      for (let k = 0; k < NP; k++) {
        const p = pathPos((k / NP) * P + q)
        dummy.position.set(p[0], p[1], p[2])
        const sz = 0.055 + 0.05 * Math.min(1, Math.abs(i) / scale.imax)
        dummy.scale.setScalar(sz / 0.07)
        dummy.updateMatrix()
        dots.current.setMatrixAt(k, dummy.matrix)
      }
      dots.current.instanceMatrix.needsUpdate = true
    }
    const vn = Math.max(-1, Math.min(1, v / scale.vmax))
    if (plateP.current) {
      plateP.current.emissive.set(vn >= 0 ? c.pole : c.pen)
      plateP.current.emissiveIntensity = Math.abs(vn) * 0.9
      plateN.current.emissive.set(vn >= 0 ? c.pen : c.pole)
      plateN.current.emissiveIntensity = Math.abs(vn) * 0.9
    }
    if (field.current) field.current.children.forEach((m) => { m.material.opacity = Math.abs(vn) * 0.85 })
    const inorm = Math.min(1, Math.abs(i) / scale.imax)
    if (resistor.current) resistor.current.emissiveIntensity = inorm * inorm * 1.2
    if (rings.current) rings.current.children.forEach((m, k) => {
      m.material.opacity = inorm * (0.85 - k * 0.12)
      const sc = 0.55 + 0.45 * inorm
      m.scale.set(1, sc, sc)
      m.position.set(1.3 * (1 - 1), 0.35 * (1 - sc), -Z * (1 - sc))
    })
    if (srcMat.current) srcMat.current.emissiveIntensity = Math.min(1, Math.abs(e) / scale.vmax) * 0.6
  })

  const wire = c.ink3
  const capX = X
  return (
    <group>
      {/* placa base */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[2 * X + 1.4, 0.08, 2 * Z + 1.4]} />
        <meshStandardMaterial color={c.paper2} />
      </mesh>
      {/* fios */}
      <Line points={[...corners, corners[0]].map((p) => [p[0], 0.12, p[2]])} color={wire} lineWidth={3} />
      {/* fonte e(t) */}
      <mesh position={[-X, 0.4, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 1.1, 32]} />
        <meshStandardMaterial ref={srcMat} color={c.panel} emissive={c.amber} emissiveIntensity={0.3} />
      </mesh>
      <Label position={[-X - 0.85, 0.5, 0]} color={c.ink}>e(t)</Label>
      <Label position={[-X + 0.05, 1.15, -0.35]} color={c.pole}>+</Label>
      {/* resistor */}
      <mesh position={[-1.3, 0.25, -Z]}>
        <boxGeometry args={[1.3, 0.34, 0.34]} />
        <meshStandardMaterial ref={resistor} color={'#c9a46a'} emissive={'#ff5a1f'} emissiveIntensity={0} />
      </mesh>
      {[-1.7, -1.45, -1.2, -0.95].map((x, k) => (
        <mesh key={k} position={[x, 0.25, -Z]}><boxGeometry args={[0.07, 0.36, 0.36]} /><meshStandardMaterial color={['#5b3a1a', '#111', '#c2362b', '#d4a017'][k]} /></mesh>
      ))}
      <Label position={[-1.3, 0.85, -Z]} color={c.ink}>R</Label>
      {/* indutor */}
      {mode === 'RLC' && (
        <group>
          <mesh geometry={coil}><meshStandardMaterial color={'#b87333'} metalness={0.4} roughness={0.4} /></mesh>
          <group ref={rings}>
            {fieldLoops.map((pts, k) => (
              <Line key={k} points={pts} color={c.pen} lineWidth={1.6} transparent opacity={0} />
            ))}
          </group>
          <Label position={[1.3, 1.05, -Z]} color={c.ink}>L</Label>
        </group>
      )}
      {/* capacitor */}
      <group position={[capX, 0.45, 0]}>
        <mesh position={[0, 0, -0.16]}><boxGeometry args={[1.1, 0.8, 0.06]} /><meshStandardMaterial ref={plateP} color={c.panel} emissive={c.pole} emissiveIntensity={0} metalness={0.3} /></mesh>
        <mesh position={[0, 0, 0.16]}><boxGeometry args={[1.1, 0.8, 0.06]} /><meshStandardMaterial ref={plateN} color={c.panel} emissive={c.pen} emissiveIntensity={0} metalness={0.3} /></mesh>
        <group ref={field}>
          {[-0.35, -0.12, 0.12, 0.35].flatMap((x) => [-0.22, 0.05, 0.28].map((y) => (
            <mesh key={x + '_' + y} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.26, 6]} />
              <meshBasicMaterial color={c.amber} transparent opacity={0} />
            </mesh>
          )))}
        </group>
      </group>
      <Label position={[capX + 0.95, 0.55, 0]} color={c.ink}>C · v_C</Label>
      {/* portadores de carga (sentido convencional da corrente) */}
      <instancedMesh ref={dots} args={[null, null, NP]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color={penCol} emissive={penCol} emissiveIntensity={0.35} />
      </instancedMesh>
    </group>
  )
}

export default function CircuitSim3D({ initialMode = 'RLC', allowModeSwitch = true, title }) {
  const c = useThemeColors()
  const [mode, setMode] = useState(initialMode)
  const [R, setR] = useState(1)
  const [L, setL] = useState(1)
  const [Cap, setC] = useState(1)
  const [E, setE] = useState(1)
  const [kind, setKind] = useState('degrau')
  const [w, setW] = useState(1)
  const [v0, setV0] = useState(0)
  const [i0, setI0] = useState(0)

  const tau = R * Cap
  const wn = 1 / Math.sqrt(L * Cap)
  const zeta = (R / 2) * Math.sqrt(Cap / L)
  const tEnd = mode === 'RC' ? Math.min(40, Math.max(6, 7 * tau)) : Math.min(40, Math.max(8, zeta < 1 ? 7 / (zeta * wn + 0.05) : 7 * (zeta + Math.sqrt(Math.max(0, zeta * zeta - 1))) / wn))
  const input = useMemo(() => makeInput(kind, E, w), [kind, E, w])
  const sim = useMemo(() => simulate({ mode, R, L, C: Cap, input, v0, i0, tEnd }), [mode, R, L, Cap, input, v0, i0, tEnd])
  const vmax = Math.max(E, ...sim.v.map(Math.abs), 0.1)
  const imax = Math.max(...sim.i.map(Math.abs), 1e-3)
  const scale = { vmax, imax, qk: 5 / Math.max(vmax, 0.2) }
  const pb = usePlayback(tEnd, { speed: tEnd / 8 })

  const poles = mode === 'RLC' ? roots([L * Cap, R * Cap, 1]) : [{ re: -1 / tau, im: 0 }]
  const cls = mode === 'RC' ? '1ª ordem' : zeta > 1.0001 ? 'superamortecido' : zeta > 0.9999 ? 'criticamente amortecido' : 'subamortecido'
  const cursor = [{ x: pb.t, color: 'var(--ink-2)', dash: '2 3' }]

  return (
    <Sim title={title || `Circuito ${mode} série em 3D`} sub="partículas = sentido convencional da corrente · brilho = energia">
      <div className="sim-body">
        <div>
          <Scene3D camera={[0, 6.5, 6.8]}>
            <Circuit sim={sim} mode={mode} pb={pb} scale={scale} c={c} />
          </Scene3D>
          <Transport pb={pb} tEnd={tEnd} />
          <Plot height={190} xRange={[0, tEnd]} vLines={cursor} yLabel="tensão (V)"
            series={[{ x: sim.t, y: sim.u, color: 'var(--ink-3)', dash: '5 4', label: 'e(t)', width: 1.5 }, { x: sim.t, y: sim.v, color: 'var(--pen)', label: 'v_C(t)' }]} />
          <Plot height={150} xRange={[0, tEnd]} vLines={cursor} yLabel="corrente (A)" series={[{ x: sim.t, y: sim.i, color: 'var(--amber)', label: 'i(t)' }]} />
        </div>
        <div className="sim-controls">
          {allowModeSwitch && <div className="btn-row" style={{ marginTop: 0 }}><Seg label="Circuito" value={mode} onChange={setMode} options={['RC', 'RLC']} /></div>}
          <h4>Componentes</h4>
          <Slider label="R" value={R} min={0.1} max={10} step={0.05} unit="Ω" onChange={setR} />
          {mode === 'RLC' && <Slider label="L" value={L} min={0.1} max={5} step={0.05} unit="H" onChange={setL} />}
          <Slider label="C" value={Cap} min={0.05} max={5} step={0.05} unit="F" onChange={setC} />
          <h4>Entrada e(t)</h4>
          <Seg label="Entrada" value={kind} onChange={setKind} options={[{ value: 'degrau', label: 'degrau' }, { value: 'pulso', label: 'pulso' }, { value: 'seno', label: 'seno' }, { value: 'quadrada', label: 'quadrada' }]} />
          <Slider label="amplitude E" value={E} min={0.1} max={5} step={0.1} unit="V" onChange={setE} />
          {kind !== 'degrau' && <Slider label="ω (rad/s)" value={w} min={0.2} max={6} step={0.05} onChange={setW} />}
          <h4>Condições iniciais (memória)</h4>
          <Slider tex="v_C(0)" value={v0} min={-3} max={3} step={0.1} unit="V" onChange={setV0} />
          {mode === 'RLC' && <Slider tex="i_L(0)" value={i0} min={-2} max={2} step={0.05} unit="A" onChange={setI0} />}
          <Readout items={mode === 'RC'
            ? [['τ = RC', `${fmt(tau)} s`], ['polo', `${fmt(-1 / tau)}`], ['t_s (2%) ≈ 4τ', `${fmt(4 * tau)} s`]]
            : [['ωn', `${fmt(wn)} rad/s`], ['ξ', fmt(zeta)], ['resposta', cls]]} />
        </div>
      </div>
      <div className="sim-foot">
        {mode === 'RC'
          ? <p>EDO: <M>{String.raw`RC\,\dot v_C + v_C = e(t)`}</M> &nbsp;⇒&nbsp; <M>{`G(s)=\\dfrac{1}{RCs+1} = \\dfrac{1}{${texNum(tau)}s+1}`}</M>. Polo em <M>{`s=${texNum(-1 / tau)}`}</M>.</p>
          : <p>EDO: <M>{String.raw`LC\,\ddot v_C + RC\,\dot v_C + v_C = e(t)`}</M> &nbsp;⇒&nbsp; <M>{`G(s)=\\dfrac{1}{${texNum(L * Cap)}s^2+${texNum(R * Cap)}s+1}`}</M>, polos <M>{poles.map((p) => texComplex(p, 3)).join(',\\ ')}</M>.</p>}
        <p>Observe: com <M>{'v_C(0)\\neq 0'}</M> a resposta muda mesmo com a mesma entrada — as condições iniciais são a memória do sistema.</p>
      </div>
    </Sim>
  )
}
