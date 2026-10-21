import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { Sim, Slider, Seg, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import Plot, { sample } from '../components/Plot.jsx'
import Scene3D, { Axis, Label } from '../components/Scene3D.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { fmt, texNum } from '../lib/format.js'

const FUNCS = {
  raiz: { label: '√x (vazão do tanque)', tex: '\\sqrt{x}', f: (x) => Math.sqrt(Math.max(x, 0)), d1: (x) => 0.5 / Math.sqrt(x), d2: (x) => -0.25 * Math.pow(x, -1.5), dom: [0, 50], a: 20, use: 'linearização do tanque: q = a√(2gy)' },
  seno: { label: 'sen x (pêndulo)', tex: '\\operatorname{sen} x', f: Math.sin, d1: Math.cos, d2: (x) => -Math.sin(x), dom: [-Math.PI, 2 * Math.PI], a: 0, use: 'pêndulo: sen θ ≈ θ perto de θ = 0' },
  exp: { label: 'eˣ', tex: 'e^{x}', f: Math.exp, d1: Math.exp, d2: Math.exp, dom: [-3, 2.5], a: 0, use: 'e^{x} ≈ 1 + x para x pequeno' },
  quad: { label: 'x² ', tex: 'x^2', f: (x) => x * x, d1: (x) => 2 * x, d2: () => 2, dom: [-4, 4], a: 1, use: 'termos quadráticos desprezados na linearização' },
}

function Taylor1D() {
  const [k, setK] = useState('raiz')
  const F = FUNCS[k]
  const [a, setA] = useState(F.a)
  const [x, setX] = useState(F.a + (F.dom[1] - F.dom[0]) * 0.12)
  const [ord, setOrd] = useState('1')
  const choose = (kk) => { setK(kk); setA(FUNCS[kk].a); setX(FUNCS[kk].a + (FUNCS[kk].dom[1] - FUNCS[kk].dom[0]) * 0.12) }
  const fa = F.f(a), d1 = F.d1(a), d2 = F.d2(a)
  const p1 = (t) => fa + d1 * (t - a)
  const p2 = (t) => p1(t) + 0.5 * d2 * (t - a) ** 2
  const [lo, hi] = F.dom
  const lo2 = k === 'raiz' ? 0.01 : lo
  const fx = sample(F.f, lo2, hi, 400)
  const l1 = sample(p1, lo2, hi, 50)
  const l2 = sample(p2, lo2, hi, 200)
  const ys = fx.y
  const yr = [Math.min(...ys) - 0.15 * (Math.max(...ys) - Math.min(...ys)), Math.max(...ys) + 0.15 * (Math.max(...ys) - Math.min(...ys))]
  const err1 = F.f(x) - p1(x), err2 = F.f(x) - p2(x)
  return (
    <div className="sim-body">
      <div>
        <Plot height={280} xRange={[lo2, hi]} yRange={yr} xLabel="x" yLabel="f(x)"
          series={[{ ...fx, color: 'var(--pen)', width: 2.6, label: 'f(x)' }, { ...l1, color: 'var(--amber)', dash: '6 4', label: '1ª ordem (reta tangente)' }, ord === '2' && { ...l2, color: 'var(--good)', dash: '3 3', label: '2ª ordem' }].filter(Boolean)}
          markers={[{ x: a, y: fa, label: 'a', color: 'var(--pole)' }, { x, y: F.f(x), color: 'var(--pen)', r: 3 }, { x, y: p1(x), color: 'var(--amber)', r: 3 }]}
          vLines={[{ x, dash: '2 3' }]} />
        <p className="small">Distância vertical entre a curva azul e a reta, na posição <M>x</M>: é o erro da aproximação linear. Ele cresce com <M>{'(x-a)^2'}</M>, por isso o modelo linearizado só vale perto do ponto de operação.</p>
      </div>
      <div className="sim-controls">
        <div className="btn-row" style={{ marginTop: 0 }}>{Object.entries(FUNCS).map(([kk, v]) => <button key={kk} className="btn small ghost" style={kk === k ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => choose(kk)}>{v.label}</button>)}</div>
        <p className="small muted">{F.use}</p>
        <Slider label="ponto a" value={a} min={k === 'raiz' ? 1 : lo} max={hi} step={(hi - lo) / 200} onChange={setA} />
        <Slider label="avaliar em x" value={x} min={lo2} max={hi} step={(hi - lo) / 200} onChange={setX} />
        <Seg label="ordem" value={ord} onChange={setOrd} options={[{ value: '1', label: '1ª ordem' }, { value: '2', label: 'até 2ª ordem' }]} />
        <Readout items={[['f(a)', fmt(fa)], ["f'(a)", fmt(d1)], ["f''(a)", fmt(d2)], ['f(x)', fmt(F.f(x))], ['erro 1ª ordem', fmt(err1)], ord === '2' && ['erro 2ª ordem', fmt(err2)]].filter(Boolean)} />
        <p className="small"><M>{`f(x)\\approx f(a)+f'(a)(x-a) = ${texNum(fa)} ${d1 >= 0 ? '+' : '-'} ${texNum(Math.abs(d1))}\\,(x ${a >= 0 ? '-' : '+'} ${texNum(Math.abs(a))})`}</M></p>
      </div>
    </div>
  )
}

// ---------- plano tangente: duas variáveis ----------
// f(y, u) = (u − k√y)/A do tanque (A = 15, k = a√(2g) = 0,2·√2000)
const kT = 0.2 * Math.sqrt(2000), AT = 15
const fT = (y, u) => (u - kT * Math.sqrt(Math.max(y, 0))) / AT
const Y = [2, 60], U = [0, 80]
const mx = (y) => ((y - Y[0]) / (Y[1] - Y[0])) * 6 - 3
const mz = (u) => -(((u - U[0]) / (U[1] - U[0])) * 6 - 3)
const my = (f) => f * 1.1

function Surface({ y0, u0, c }) {
  const geo = useMemo(() => {
    const n = 50, pos = [], idx = [], col = []
    const lo = new THREE.Color(c.pen), hi = new THREE.Color(c.pole), mid = new THREE.Color(c.paper2)
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
      const y = Y[0] + ((Y[1] - Y[0]) * i) / n, u = U[0] + ((U[1] - U[0]) * j) / n
      const f = fT(y, u)
      pos.push(mx(y), my(f), mz(u))
      const cc = f < 0 ? mid.clone().lerp(lo, Math.min(1, -f / 2.5)) : mid.clone().lerp(hi, Math.min(1, f / 2.5))
      col.push(cc.r, cc.g, cc.b)
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const a = i * (n + 1) + j; idx.push(a, a + 1, a + n + 1, a + 1, a + n + 2, a + n + 1) }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals()
    return g
  }, [c.pen, c.pole, c.paper2])
  const f0 = fT(y0, u0)
  const fy = -kT / (2 * Math.sqrt(y0) * AT), fu = 1 / AT
  const plane = useMemo(() => {
    const pts = []
    const dy = 12, du = 16
    const corners = [[-dy, -du], [dy, -du], [dy, du], [-dy, du]]
    const v = corners.map(([a, b]) => new THREE.Vector3(mx(y0 + a), my(f0 + fy * a + fu * b), mz(u0 + b)))
    const g = new THREE.BufferGeometry().setFromPoints([v[0], v[1], v[2], v[0], v[2], v[3]])
    g.computeVertexNormals()
    return { g, edge: [...v, v[0]].map((p) => [p.x, p.y, p.z]) }
  }, [y0, u0])
  const eq = []
  for (let i = 0; i <= 60; i++) { const y = Y[0] + ((Y[1] - Y[0]) * i) / 60; eq.push([mx(y), 0.01, mz(kT * Math.sqrt(y))]) }
  return (
    <group>
      <mesh geometry={geo}><meshStandardMaterial vertexColors side={THREE.DoubleSide} transparent opacity={0.85} /></mesh>
      <mesh geometry={plane.g}><meshStandardMaterial color={c.amber} transparent opacity={0.55} side={THREE.DoubleSide} /></mesh>
      <Line points={plane.edge} color={c.amber} lineWidth={2} />
      <Line points={eq.filter((p) => p[2] >= -3.05 && p[2] <= 3.05)} color={c.good} lineWidth={2.5} />
      <mesh position={[mx(y0), my(f0), mz(u0)]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={c.pole} /></mesh>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6, 6]} /><meshBasicMaterial color={c.ink3} transparent opacity={0.08} side={THREE.DoubleSide} /></mesh>
      <Axis from={[-3, -2.6, 3]} to={[3.4, -2.6, 3]} color={c.ink2} label="nível y" />
      <Axis from={[-3, -2.6, 3]} to={[-3, -2.6, -3.4]} color={c.ink2} label="vazão u" />
      <Axis from={[-3, -2.6, 3]} to={[-3, 2.4, 3]} color={c.ink2} label="f = ẏ" />
      <Label position={[2.6, 0.3, mz(kT * Math.sqrt(55))]} color={c.good} size={11}>equilíbrios (f = 0)</Label>
    </group>
  )
}

function Plano2D() {
  const c = useThemeColors()
  const [y0, setY0] = useState(20)
  const [u0, setU0] = useState(40)
  const fy = -kT / (2 * Math.sqrt(y0) * AT), fu = 1 / AT
  return (
    <div className="sim-body">
      <Scene3D camera={[6, 5, 7]} height={400}><Surface y0={y0} u0={u0} c={c} /></Scene3D>
      <div className="sim-controls">
        <Slider tex="\bar y" value={y0} min={4} max={55} step={0.5} onChange={setY0} />
        <Slider tex="\bar u" value={u0} min={5} max={75} step={0.5} onChange={setU0} />
        <div className="btn-row"><button className="btn small ghost" onClick={() => setU0(kT * Math.sqrt(y0))}>Levar ao equilíbrio (f = 0)</button></div>
        <Readout items={[['f(ȳ, ū)', fmt(fT(y0, u0))], ['∂f/∂y', fmt(fy)], ['∂f/∂u', fmt(fu)]]} />
        <p className="small">A superfície é <M>{String.raw`\dot y=f(y,u)=\frac{u-a\sqrt{2gy}}{A}`}</M> do tanque. O plano laranja é o <b>plano tangente</b> no ponto vermelho: suas inclinações nas duas direções são as derivadas parciais. Linearizar é trocar a superfície pelo plano:</p>
        <p className="small"><M>{`\\delta\\dot y \\approx ${texNum(fy)}\\,\\delta y + ${texNum(fu)}\\,\\delta u`}</M></p>
        <p className="small muted">A curva verde é onde <M>f = 0</M>: os pontos de equilíbrio possíveis. O ponto de operação precisa estar sobre ela.</p>
      </div>
    </div>
  )
}

export default function TaylorSim() {
  const [mode, setMode] = useState('1d')
  return (
    <Sim title="Série de Taylor e linearização" sub="aproximar uma função por uma reta (ou plano) perto de um ponto">
      <div style={{ padding: '.9rem .9rem 0' }}>
        <Seg label="modo" value={mode} onChange={setMode} options={[{ value: '1d', label: 'Uma variável: reta tangente' }, { value: '2d', label: 'Duas variáveis: plano tangente (3D)' }]} />
      </div>
      {mode === '1d' ? <Taylor1D /> : <Plano2D />}
    </Sim>
  )
}
