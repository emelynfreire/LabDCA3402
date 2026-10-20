import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import Scene3D, { Axis, Label } from '../components/Scene3D.jsx'
import Plot, { sample } from '../components/Plot.jsx'
import SPlane from '../components/SPlane.jsx'
import { Sim, Slider, Seg, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { inverseLaplaceFn, polymul } from '../lib/poly.js'
import { stepInfo } from '../lib/lti.js'
import { fmt, texNum } from '../lib/format.js'

// resposta ao degrau normalizada (ωn = 1)
function y2(xi, t) {
  if (xi < 1e-6) return 1 - Math.cos(t)
  if (Math.abs(xi - 1) < 1e-4) return 1 - Math.exp(-t) * (1 + t)
  if (xi < 1) {
    const wd = Math.sqrt(1 - xi * xi)
    return 1 - Math.exp(-xi * t) * (Math.cos(wd * t) + (xi / wd) * Math.sin(wd * t))
  }
  const r = Math.sqrt(xi * xi - 1), p1 = -xi + r, p2 = -xi - r
  return 1 + (p2 * Math.exp(p1 * t) - p1 * Math.exp(p2 * t)) / (p1 - p2)
}

const TM = 14, XM = 2
const mx = (t) => (t / TM) * 8 - 4
const mz = (xi) => (xi / XM) * 6 - 3
const my = (y) => y * 1.4

function Surface2nd({ xi, c }) {
  const geo = useMemo(() => {
    const nt = 140, nx = 60
    const pos = [], col = [], idx = []
    const lo = new THREE.Color(c.pen), hi = new THREE.Color(c.pole), mid = new THREE.Color(c.paper2)
    for (let i = 0; i <= nx; i++) for (let j = 0; j <= nt; j++) {
      const x = (i / nx) * XM, t = (j / nt) * TM
      const y = y2(x, t)
      pos.push(mx(t), my(y), mz(x))
      const cc = y > 1 ? mid.clone().lerp(hi, Math.min(1, (y - 1) * 1.4)) : lo.clone().lerp(mid, Math.min(1, y))
      col.push(cc.r, cc.g, cc.b)
    }
    for (let i = 0; i < nx; i++) for (let j = 0; j < nt; j++) {
      const a = i * (nt + 1) + j, b = a + 1, d = a + nt + 1, e = d + 1
      idx.push(a, b, d, b, e, d)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
  }, [c.pen, c.pole, c.paper2])
  const curve = useMemo(() => Array.from({ length: 300 }, (_, j) => { const t = (j / 299) * TM; return [mx(t), my(y2(xi, t)) + 0.03, mz(xi)] }), [xi])
  const one = [[mx(0), my(1), mz(XM)], [mx(TM), my(1), mz(XM)]]
  return (
    <group>
      <mesh geometry={geo}><meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.75} /></mesh>
      <mesh geometry={geo}><meshBasicMaterial color={c.ink} wireframe transparent opacity={0.07} /></mesh>
      <Line points={curve} color={c.amber} lineWidth={4} />
      <Line points={one} color={c.ink3} lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />
      <Axis from={[-4, 0, -3]} to={[4.4, 0, -3]} color={c.ink2} label="tempo (ωn = 1)" labelOffset={[0.6, 0.2, 0]} />
      <Axis from={[-4, 0, -3]} to={[-4, 0, 3.4]} color={c.ink2} label="ξ" />
      <Axis from={[-4, 0, -3]} to={[-4, 3, -3]} color={c.ink2} label="y(t)" />
      <Label position={[-4.4, 0, mz(1)]} color={c.ink3} size={10}>ξ=1</Label>
      <Label position={[-4.4, 0, mz(0)]} color={c.ink3} size={10}>ξ=0</Label>
      <Label position={[-4.4, 0, mz(2)]} color={c.ink3} size={10}>ξ=2</Label>
    </group>
  )
}

export function SecondOrder3D() {
  const c = useThemeColors()
  const [pole, setPole] = useState([{ kind: 'pole', re: -0.6, im: 1.6 }])
  const [tol, setTol] = useState('2')
  const wd0 = pole[0].im
  const isReal = wd0 === 0
  const sigma = Math.max(isReal ? 0.1 : 0, -pole[0].re)
  const wn = Math.max(0.05, Math.hypot(sigma, wd0))
  const xi = sigma <= 0 ? 0 : sigma / wn
  // se o polo for real, interpretamos como par real (−σ e −σ·4) para manter 2ª ordem
  const den = isReal ? polymul([1, sigma], [1, sigma * 3]) : [1, 2 * xi * wn, wn * wn]
  const K = den[2]
  const xiEff = isReal ? (4 * sigma) / (2 * Math.sqrt(3 * sigma * sigma)) : xi
  const wnEff = isReal ? Math.sqrt(3) * sigma : wn
  const tEnd = Math.min(30, Math.max(4, 9 / Math.max(0.15, xiEff * wnEff)))
  const data = useMemo(() => sample(inverseLaplaceFn([K], [...den, 0]), 0, tEnd, 800), [den.join(), tEnd])
  const tolv = tol === '2' ? 0.02 : 0.05
  const info = stepInfo(data.x, data.y, { tol: tolv })
  const theo = xiEff < 1 && xiEff > 0 ? {
    Mp: Math.exp((-xiEff * Math.PI) / Math.sqrt(1 - xiEff * xiEff)),
    tp: Math.PI / (wnEff * Math.sqrt(1 - xiEff * xiEff)),
    tr: (Math.PI - Math.acos(xiEff)) / (wnEff * Math.sqrt(1 - xiEff * xiEff)),
    ts: (tol === '2' ? 4 : 3) / (xiEff * wnEff),
  } : null
  const cls = xiEff <= 0 ? 'sem amortecimento' : xiEff < 0.9999 ? 'subamortecido' : xiEff < 1.0001 ? 'criticamente amortecido' : 'sobreamortecido'
  const circle = Array.from({ length: 61 }, (_, i) => { const a = Math.PI / 2 + (i / 60) * Math.PI; return [wnEff * Math.cos(a), wnEff * Math.sin(a)] })
  return (
    <Sim title="Sistema de 2ª ordem: ξ, ωn e a resposta ao degrau" sub="arraste o polo; a superfície 3D reproduz o gráfico dos slides">
      <div className="sim-body">
        <div>
          <Scene3D camera={[6.5, 5, 7]} target={[0, 0.8, 0]} height={360}>
            <Surface2nd xi={Math.min(XM, Math.max(0, xiEff))} c={c} />
          </Scene3D>
          <Plot height={220} xRange={[0, tEnd]} yLabel="y(t)"
            bands={[{ y0: 1 - tolv, y1: 1 + tolv, color: 'var(--good-soft)', opacity: 0.8 }]}
            hLines={[{ y: 1 }]}
            vLines={[info?.tp && { x: info.tp, color: 'var(--pole)' }, info?.tr && { x: info.tr, color: 'var(--pen)' }, info && { x: info.ts, color: 'var(--good)' }].filter(Boolean)}
            series={[{ ...data, color: 'var(--amber)', width: 2.4 }]}
            markers={info?.tp ? [{ x: info.tp, y: info.yf * (1 + info.Mp), label: 'Mp', color: 'var(--pole)' }] : []} />
          <div className="legend"><span><i style={{ background: 'var(--pen)' }} />t_r (subida)</span><span><i style={{ background: 'var(--pole)' }} />t_p (pico)</span><span><i style={{ background: 'var(--good)' }} />t_ss (estabilização)</span><span><i style={{ background: 'var(--good-soft)' }} />faixa de ±{tol}%</span></div>
        </div>
        <div className="sim-controls">
          <SPlane roots={pole} onChange={setPole} xr={[-4, 0]} yr={[-4, 4]} size={270} extra={[{ kind: 'trace', pts: circle }, { kind: 'trace', pts: [[0, 0], [-sigma * 3, wd0 * 3]] }]} />
          <div className="btn-row"><span className="small muted">critério:</span><Seg label="tolerância" value={tol} onChange={setTol} options={[{ value: '2', label: '2%' }, { value: '5', label: '5%' }]} /></div>
          <Readout items={[
            ['ξ', fmt(xiEff, 3)], ['ωn', fmt(wnEff, 3)], ['classe', cls],
            ['Mp fórmula / sim.', theo ? `${fmt(100 * theo.Mp, 3)}% / ${fmt(100 * (info?.Mp ?? 0), 3)}%` : '— / ' + fmt(100 * (info?.Mp ?? 0), 2) + '%'],
            ['t_p fórmula / sim.', theo ? `${fmt(theo.tp)} / ${fmt(info?.tp)}` : '—'],
            ['t_r fórmula / sim.', theo ? `${fmt(theo.tr)} / ${fmt(info?.tr)}` : '—'],
            ['t_ss aprox. / sim.', theo ? `${fmt(theo.ts)} / ${fmt(info?.ts)}` : `— / ${fmt(info?.ts)}`],
          ]} />
        </div>
      </div>
      <div className="sim-foot">
        <p>Polos <M>{String.raw`s = -\xi\omega_n \pm j\omega_n\sqrt{1-\xi^2}`}</M>: a distância à origem é <M>{'\\omega_n'}</M> (semicírculo pontilhado) e o ângulo com o eixo real negativo é <M>{'\\beta = \\cos^{-1}\\xi'}</M> (reta pontilhada). Polos sobre a mesma reta têm o mesmo sobressinal; polos com a mesma parte real têm o mesmo <M>{'t_{ss}\\approx 4/(\\xi\\omega_n)'}</M>. Os tempos de estabilização das fórmulas são aproximações (envoltória), por isso diferem um pouco da simulação.</p>
        {isReal && <p className="small">Com o polo sobre o eixo real, a simulação usa dois polos reais (em <M>{`-${texNum(sigma)}`}</M> e <M>{`-${texNum(3 * sigma)}`}</M>) para mostrar uma resposta sobreamortecida.</p>}
      </div>
    </Sim>
  )
}

export function FirstOrder() {
  const [T, setT] = useState(2)
  const [K, setK] = useState(1)
  const [inp, setInp] = useState('degrau')
  const tEnd = Math.max(6 * T, 4)
  const y = useMemo(() => sample((t) => inp === 'degrau' ? K * (1 - Math.exp(-t / T)) : K * (t - T + T * Math.exp(-t / T)), 0, tEnd, 500), [T, K, inp])
  const marks = inp === 'degrau' ? [1, 2, 3, 4].map((n) => ({ x: n * T, y: K * (1 - Math.exp(-n)), label: `${fmt(100 * (1 - Math.exp(-n)), 3)}%`, color: 'var(--pole)' })) : []
  return (
    <Sim title="Sistema de 1ª ordem G(s) = K/(Ts + 1)" sub="constante de tempo e erro à rampa">
      <div className="sim-body">
        <div>
          <Plot height={240} xRange={[0, tEnd]} yLabel="y(t)" vLines={inp === 'degrau' ? [1, 2, 3, 4].map((n) => ({ x: n * T, dash: '2 4' })) : []}
            series={[
              inp === 'rampa' && { ...sample((t) => K * t, 0, tEnd, 50), color: 'var(--ink-3)', dash: '5 4', label: 'entrada rampa (×K)' },
              { ...y, color: 'var(--pen)', width: 2.4, label: 'y(t)' },
            ].filter(Boolean)} markers={marks} hLines={inp === 'degrau' ? [{ y: K }] : []} />
        </div>
        <div className="sim-controls">
          <Seg label="entrada" value={inp} onChange={setInp} options={[{ value: 'degrau', label: 'degrau' }, { value: 'rampa', label: 'rampa' }]} />
          <Slider label="constante T" value={T} min={0.2} max={8} step={0.05} unit="s" onChange={setT} />
          <Slider label="ganho K" value={K} min={0.2} max={5} step={0.05} onChange={setK} />
          <Readout items={inp === 'degrau'
            ? [['polo', fmt(-1 / T)], ['t_ss (5%) = 3T', `${fmt(3 * T)} s`], ['t_ss (2%) = 4T', `${fmt(4 * T)} s`]]
            : [['erro em regime', `K·T = ${fmt(K * T)}`], ['(para K = 1)', `= T = ${fmt(T)}`]]} />
        </div>
      </div>
      <div className="sim-foot">
        <p>{inp === 'degrau' ? <>Degrau: <M>{'y(t) = K(1 - e^{-t/T})'}</M>. Em <M>{'t = T'}</M> a saída atinge 63% do valor final; em <M>3T</M>, 95%; em <M>4T</M>, 98%.</> : <>Rampa unitária (K = 1): <M>{'y(t) = t - T + Te^{-t/T}'}</M>. Em regime a saída segue a rampa atrasada de <M>T</M>: o erro estacionário vale <M>T</M>.</>}</p>
      </div>
    </Sim>
  )
}

export function ZeroEffect() {
  const [xi, setXi] = useState(0.2)
  const [ratio, setRatio] = useState(5)
  const [none, setNone] = useState(false)
  const wn = 1
  const Tz = none ? 0 : 1 / (ratio * xi * wn) // 1/T = ratio · ξωn
  const num = none ? [1] : [Tz, 1]
  const data = useMemo(() => sample(inverseLaplaceFn(num, [1, 2 * xi, 1, 0]), 0, 20, 800), [xi, ratio, none])
  const base = useMemo(() => sample(inverseLaplaceFn([1], [1, 2 * xi, 1, 0]), 0, 20, 800), [xi])
  const info = stepInfo(data.x, data.y, { tol: 0.05 })
  const ymin = Math.min(...data.y)
  return (
    <Sim title="Efeito de um zero na resposta de 2ª ordem" sub="G(s) = (Ts + 1)·ωn²/(s² + 2ξωn s + ωn²), ωn = 1">
      <div className="sim-body">
        <div>
          <Plot height={240} xRange={[0, 20]} yLabel="y(t)" hLines={[{ y: 1 }]} series={[{ ...base, color: 'var(--ink-3)', dash: '5 4', label: 'canônico (sem zero)' }, { ...data, color: 'var(--pen)', width: 2.4, label: 'com zero' }]} />
        </div>
        <div className="sim-controls">
          <Seg label="ξ" value={String(xi)} onChange={(v) => setXi(parseFloat(v))} options={[{ value: '0.2', label: 'ξ = 0,2' }, { value: '0.625', label: 'ξ = 0,625' }]} />
          <Slider label="1/T ÷ ξωn" value={ratio} min={-5} max={10} step={0.5} onChange={(v) => setRatio(Math.abs(v) < 0.25 ? 0.5 : v)} />
          <div className="btn-row"><button className="btn small ghost" onClick={() => setNone(!none)}>{none ? 'Incluir o zero' : 'Remover o zero (T = 0)'}</button></div>
          <Readout items={[['zero em s =', none ? '—' : fmt(-1 / Tz)], ['sobressinal', `${fmt(100 * (info?.Mp ?? 0), 3)}%`], ['subsinal', ymin < -1e-3 ? `${fmt(-100 * ymin, 3)}%` : '—'], ['t_ss (5%)', `${fmt(info?.ts)} s`]]} />
        </div>
      </div>
      <div className="sim-foot">
        <p>Quanto mais perto o zero fica dos polos dominantes (razão pequena), maior o sobressinal. Com razão negativa o zero vai para o semiplano direito e surge um <b>subsinal</b>: a saída começa no sentido contrário. Compare com a tabela dos slides (ex.: ξ = 0,2 e razão 10 ⇒ ≈ 59,7%).</p>
      </div>
    </Sim>
  )
}

export function DominantPoles() {
  const [p, setP] = useState(6)
  const full = useMemo(() => sample(inverseLaplaceFn([4 * p], polymul([1, p], [1, 2, 4, 0])), 0, 7, 600), [p])
  const approx = useMemo(() => sample(inverseLaplaceFn([4], [1, 2, 4, 0]), 0, 7, 600), [])
  const ratio = p / 1
  return (
    <Sim title="Polos dominantes: quando a aproximação de 2ª ordem funciona" sub="G(s) = 4p/[(s + p)(s² + 2s + 4)] × 4/(s² + 2s + 4)">
      <div className="sim-body">
        <div>
          <Plot height={240} xRange={[0, 7]} yLabel="y(t)" hLines={[{ y: 1 }]} series={[{ ...approx, color: 'var(--ink-3)', dash: '5 4', label: 'aproximação 4/(s²+2s+4)' }, { ...full, color: 'var(--pen)', width: 2.4, label: '3ª ordem' }]} />
        </div>
        <div className="sim-controls">
          <Slider label="polo real em −p" value={p} min={0.5} max={20} step={0.1} onChange={setP} />
          <div className="btn-row"><button className="btn small ghost" onClick={() => setP(6)}>G₁ dos slides (p = 6)</button><button className="btn small ghost" onClick={() => setP(1.5)}>G₂ dos slides (p = 1,5)</button></div>
          <Readout items={[['razão das partes reais', `${fmt(ratio)} : 1`], ['aproximação', ratio >= 5 ? 'adequada' : ratio >= 3 ? 'razoável' : 'inadequada']]} />
        </div>
      </div>
      <div className="sim-foot"><p>Os polos complexos <M>{'-1 \\pm j\\sqrt{3}'}</M> têm parte real −1. Quando o polo real está bem mais à esquerda (regra prática: 5 vezes ou mais), sua exponencial decai rápido e a resposta fica dominada pelo par complexo. O ganho estático é preservado dividindo por <M>p</M>.</p></div>
    </Sim>
  )
}
