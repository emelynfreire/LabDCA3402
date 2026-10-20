import { useMemo, useState } from 'react'
import Plot from '../components/Plot.jsx'
import { Sim, Seg, Slider } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { simulateTF } from '../lib/lti.js'

const grid = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)

// y' + a(t) y = u(t), RK4
function odeVar(aFn, uFn, tEnd, dt = 0.004) {
  const t = [], y = []
  let v = 0
  const f = (tt, v) => uFn(tt) - aFn(tt) * v
  for (let k = 0; k * dt <= tEnd + 1e-9; k++) {
    const tt = k * dt
    t.push(tt); y.push(v)
    const k1 = f(tt, v), k2 = f(tt + dt / 2, v + dt / 2 * k1), k3 = f(tt + dt / 2, v + dt / 2 * k2), k4 = f(tt + dt, v + dt * k3)
    v += dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
  }
  return { t, y }
}

function Memoria() {
  const [kind, setKind] = useState('degrau')
  const R = 2, C = 1
  const t = grid(0, 5, 1000)
  const x = t.map((tt) => kind === 'degrau' ? (tt >= 1 ? 1 : 0) : kind === 'pulso' ? (tt >= 1 && tt < 2 ? 1 : 0) : Math.sin(2 * tt))
  const integ = []
  let acc = 0
  x.forEach((v, i) => { if (i > 0) acc += 0.5 * (v + x[i - 1]) * (t[i] - t[i - 1]); integ.push(acc) })
  return (
    <>
      <Seg label="entrada" value={kind} onChange={setKind} options={['degrau', 'pulso', 'seno']} />
      <Plot height={250} xRange={[0, 5]} series={[
        { x: t, y: x, color: 'var(--ink-3)', dash: '5 4', label: 'x(t)' },
        { x: t, y: x.map((v) => R * v), color: 'var(--amber)', label: 'sem memória: y = R x' },
        { x: t, y: x.map((v, i) => R * v + integ[i] / C), color: 'var(--pen)', label: 'com memória: y = R x + (1/C)∫x dτ' },
      ]} />
      <p className="small">Com o pulso, a saída do sistema com memória continua diferente de zero depois que a entrada volta a zero: ela "lembra" a carga acumulada no capacitor. O sistema sem memória responde só ao valor atual de <M>x(t)</M>.</p>
    </>
  )
}

function Invariancia() {
  const [d, setD] = useState(2)
  const [sys, setSys] = useState('inv')
  const u = (tt) => (tt >= 1 && tt <= 3 ? Math.sin(2 * Math.PI * tt) : 0)
  const ud = (tt) => u(tt - d)
  const tEnd = 8
  const aFn = sys === 'inv' ? () => 2 : (tt) => 0.5 + 0.6 * tt
  const r1 = useMemo(() => odeVar(aFn, u, tEnd), [sys])
  const r2 = useMemo(() => odeVar(aFn, ud, tEnd), [sys, d])
  const shifted = r1.t.map((tt) => tt + d)
  return (
    <>
      <div className="btn-row" style={{ marginTop: 0 }}>
        <Seg label="sistema" value={sys} onChange={setSys} options={[{ value: 'inv', label: 'ẏ + 2y = u (invariante)' }, { value: 'var', label: 'ẏ + (0,5 + 0,6t) y = u (variante)' }]} />
      </div>
      <Slider label="atraso d" value={d} min={0} max={4} step={0.05} unit="s" onChange={setD} />
      <Plot height={250} xRange={[0, tEnd]} series={[
        { x: r1.t, y: r1.y, color: 'var(--ink-3)', label: 'y(t) para u(t)', width: 1.5 },
        { x: shifted, y: r1.y, color: 'var(--amber)', dash: '6 4', label: 'y(t − d): saída original atrasada' },
        { x: r2.t, y: r2.y, color: 'var(--pen)', label: 'resposta a u(t − d)' },
      ]} />
      <p className="small">{sys === 'inv' ? 'As curvas azul e laranja coincidem: atrasar a entrada apenas atrasa a saída — o sistema é invariante no tempo (coeficientes constantes).' : 'As curvas não coincidem: o coeficiente depende de t, então a mesma entrada aplicada mais tarde produz outra resposta — o sistema é variante no tempo.'}</p>
    </>
  )
}

function Linearidade() {
  const [a1, setA1] = useState(2)
  const [a2, setA2] = useState(-0.5)
  const [sys, setSys] = useState('lin')
  const tEnd = 6
  const u1 = (t) => Math.sin(t), u2 = (t) => Math.cos(2 * t)
  const resp = (uFn) => {
    if (sys === 'lin') return simulateTF([3], [1, 2], uFn, tEnd, { dt: 0.005, every: 2 })
    const t = grid(0, tEnd, 600)
    return { t, y: t.map((tt) => sys === 'quad' ? uFn(tt) ** 2 : 5 * uFn(tt) - 3) }
  }
  const r1 = resp(u1), r2 = resp(u2), rc = resp((t) => a1 * u1(t) + a2 * u2(t))
  const comb = r1.y.map((v, i) => a1 * v + a2 * r2.y[i])
  return (
    <>
      <div className="btn-row" style={{ marginTop: 0 }}>
        <Seg label="sistema" value={sys} onChange={setSys} options={[{ value: 'lin', label: 'ẏ + 2y = 3u' }, { value: 'quad', label: 'y = u²' }, { value: 'afim', label: 'y = 5u − 3' }]} />
      </div>
      <Slider tex="\alpha_1" value={a1} min={-3} max={3} step={0.1} onChange={setA1} />
      <Slider tex="\alpha_2" value={a2} min={-3} max={3} step={0.1} onChange={setA2} />
      <Plot height={250} xRange={[0, tEnd]} series={[
        { x: rc.t, y: rc.y, color: 'var(--pen)', label: 'resposta à combinação α₁u₁ + α₂u₂' },
        { x: r1.t, y: comb, color: 'var(--amber)', dash: '6 4', label: 'combinação das respostas α₁y₁ + α₂y₂' },
      ]} />
      <p className="small">{sys === 'lin' ? 'As curvas coincidem para quaisquer α₁, α₂: vale a superposição, o sistema é linear.' : sys === 'quad' ? 'As curvas diferem: (α₁u₁ + α₂u₂)² ≠ α₁u₁² + α₂u₂². Sem memória, mas não linear.' : 'O termo constante −3 quebra a homogeneidade (entrada nula não dá saída nula): o sistema é afim, portanto não linear.'}</p>
    </>
  )
}

function Amostragem() {
  const [Ts, setTs] = useState(0.08)
  const [Lv, setL] = useState(8)
  const t = grid(0, 2, 800)
  const x = t.map((tt) => Math.sin(2 * Math.PI * 2 * tt))
  const n = grid(0, 2, Math.round(2 / Ts)).map((v) => +v.toFixed(6))
  const xs = n.map((tt) => Math.sin(2 * Math.PI * 2 * tt))
  const xq = xs.map((v) => (Math.round(((v + 1) * (Lv - 1)) / 2) * 2) / (Lv - 1) - 1)
  const stairsX = [], stairsY = []
  n.forEach((tt, i) => { stairsX.push(tt, n[i + 1] ?? 2); stairsY.push(xq[i], xq[i]) })
  return (
    <>
      <Slider label="período Ts" value={Ts} min={0.02} max={0.3} step={0.005} unit="s" onChange={setTs} />
      <Slider label="níveis L" value={Lv} min={2} max={32} step={1} onChange={(v) => setL(Math.round(v))} digits={0} />
      <Plot height={250} xRange={[0, 2]} series={[
        { x: t, y: x, color: 'var(--ink-3)', label: 'contínuo', width: 1.5 },
        { pts: n.map((tt, i) => [tt, xs[i]]), color: 'var(--pen)', stem: true, label: 'discreto (amostrado)' },
        { x: stairsX, y: stairsY, color: 'var(--pole)', width: 1.8, label: 'digital (discreto + quantizado)' },
      ]} />
      <p className="small">Com <M>{'T_s'}</M> grande demais (acima de 0,25 s para este seno de 2 Hz) as amostras deixam de representar o sinal. Com poucos níveis, a quantização deforma a amplitude.</p>
    </>
  )
}

export default function ClassificationLab() {
  const [tab, setTab] = useState('lin')
  return (
    <Sim title="Laboratório de classificação de sistemas" sub="versões interativas das sugestões de simulação em MATLAB dos slides">
      <div className="sim-body single">
        <div>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Seg label="experimento" value={tab} onChange={setTab} options={[{ value: 'lin', label: 'Linearidade' }, { value: 'inv', label: 'Invariância no tempo' }, { value: 'mem', label: 'Memória' }, { value: 'amo', label: 'Amostragem e quantização' }]} />
          </div>
          {tab === 'lin' && <Linearidade />}
          {tab === 'inv' && <Invariancia />}
          {tab === 'mem' && <Memoria />}
          {tab === 'amo' && <Amostragem />}
        </div>
      </div>
    </Sim>
  )
}
