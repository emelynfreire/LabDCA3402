import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import Scene3D, { Axis } from '../components/Scene3D.jsx'
import Plot from '../components/Plot.jsx'
import { Sim, Slider, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { simulateSS } from '../lib/lti.js'
import { matmul, hcat, vcat, rank, eig, nullVector, cross, normalize, transpose } from '../lib/linalg.js'
import { fmt, texNum } from '../lib/format.js'

const bm = (Mx) => `\\begin{bmatrix}${Mx.map((r) => r.map((v) => texNum(v, 3)).join(' & ')).join('\\\\')}\\end{bmatrix}`

// matriz T para "girar" o exemplo diagonal e deixá-lo menos óbvio
const Tm = [[1, 0.5, 0], [0.3, 1, 0.4], [0, -0.6, 1]]
function inv3(A) {
  const [[a, b, c], [d, e, f], [g, h, i]] = A
  const D = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
  return [[e * i - f * h, c * h - b * i, b * f - c * e], [f * g - d * i, a * i - c * g, c * d - a * f], [d * h - e * g, b * g - a * h, a * e - b * d]].map((r) => r.map((v) => v / D))
}
const Arot = matmul(matmul(Tm, [[-1, 0, 0], [0, -2, 0], [0, 0, -3]]), inv3(Tm))
const Brot = matmul(Tm, [[1], [1], [0]])

const CTRL = {
  rc: { label: 'Dois RC iguais (aula 13)', A: [[-1, 0], [0, -1]], B: [[1], [1]] },
  slide: { label: 'Exemplo não controlável', A: [[4, -10], [3, -7]], B: [[-2], [-1]] },
  ok2: { label: 'Exemplo controlável', A: [[0, 1], [2, -1]], B: [[0], [1]] },
  plano: { label: '3 estados, posto 2', A: Arot, B: Brot },
  ok3: { label: '3 estados, controlável', A: [[0, 1, 0], [0, 0, 1], [-6, -11, -6]], B: [[0], [0], [1]] },
}

function ctrbMatrix(A, B) {
  const cols = [B]
  for (let k = 1; k < A.length; k++) cols.push(matmul(A, cols[k - 1]))
  return hcat(...cols)
}

function randomInput(seed) {
  let s = seed
  const levels = []
  for (let i = 0; i < 40; i++) { s = (s * 16807) % 2147483647; levels.push(((s / 2147483647) * 2 - 1) * 2) }
  return (t) => levels[Math.min(39, Math.floor(t / 0.15))]
}

export function Controllability() {
  const c = useThemeColors()
  const [key, setKey] = useState('plano')
  const [seed, setSeed] = useState(7)
  const P = CTRL[key]
  const n = P.A.length
  const Cm = ctrbMatrix(P.A, P.B)
  const r = rank(Cm)
  const lam = eig(P.A).filter((l, i, a) => a.findIndex((q) => Math.abs(q.re - l.re) < 1e-6 && Math.abs(q.im - l.im) < 1e-6) === i)
  const pbh = lam.filter((l) => Math.abs(l.im) < 1e-9).map((l) => ({ l: l.re, r: rank(hcat(P.A.map((row, i) => row.map((v, j) => v - (i === j ? l.re : 0))), P.B)) }))
  const sims = useMemo(() => Array.from({ length: 6 }, (_, k) => simulateSS({ A: P.A, B: P.B, C: [new Array(n).fill(0)], D: [[0]] }, randomInput(seed * 31 + k * 977 + 1), 6, { dt: 0.005, every: 4 })), [key, seed])
  let mx = 1e-9
  sims.forEach((s) => s.x.forEach((x) => x.forEach((v) => { mx = Math.max(mx, Math.abs(v)) })))
  const sc = 3 / mx
  const to3 = (x) => n === 2 ? [x[0] * sc, 0, x[1] * sc] : [x[0] * sc, x[2] * sc, x[1] * sc]
  // subespaço alcançável
  const sub = useMemo(() => {
    const cols = transpose(Cm).map((v) => normalize(v))
    if (r === 1) { const v = cols.find((v) => Math.hypot(...v) > 0.5); return { kind: 'line', v } }
    if (r === 2 && n === 3) { const nrm = normalize(cross(cols[0], cols.find((v, i) => i > 0 && Math.hypot(...cross(cols[0], v)) > 1e-3) || cols[1])); return { kind: 'plane', nrm } }
    return { kind: 'full' }
  }, [key])
  const planeQuat = useMemo(() => {
    if (sub.kind !== 'plane') return null
    const nn = new THREE.Vector3(sub.nrm[0], sub.nrm[2], sub.nrm[1]).normalize()
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), nn)
  }, [sub])

  return (
    <Sim title="Controlabilidade: até onde a entrada consegue levar o estado?" sub="trajetórias a partir da origem com entradas aleatórias">
      <div className="sim-body">
        <div>
          <Scene3D camera={n === 2 ? [0.5, 7, 4.5] : [6, 4.5, 6]} height={400}>
            <Axis from={[-3.5, 0, 0]} to={[3.7, 0, 0]} color={c.ink2} label="x1" />
            <Axis from={[0, 0, -3.5]} to={[0, 0, 3.7]} color={c.ink2} label="x2" />
            {n === 3 && <Axis from={[0, -3.5, 0]} to={[0, 3.7, 0]} color={c.ink2} label="x3" />}
            {n === 2 && <gridHelper args={[7, 14, c.grid, c.grid]} />}
            {sub.kind === 'line' && <Line points={[to3(sub.v.map((v) => -v * 3 / sc)), to3(sub.v.map((v) => v * 3 / sc))].map((p) => p.map((q) => q * 1.15))} color={c.good} lineWidth={7} transparent opacity={0.35} />}
            {sub.kind === 'plane' && <mesh quaternion={planeQuat}><planeGeometry args={[7, 7]} /><meshBasicMaterial color={c.good} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
            {sims.map((s, k) => <Line key={k} points={s.x.map(to3)} color={[c.pen, c.pole, c.amber, c.pen, c.pole, c.amber][k]} lineWidth={2} />)}
          </Scene3D>
          <div className="btn-row"><button className="btn small" onClick={() => setSeed(seed + 1)}>Sortear novas entradas</button>
            <span className="small muted">{sub.kind === 'full' ? 'As trajetórias se espalham em todas as direções.' : `Todas as trajetórias ficam presas ${sub.kind === 'line' ? 'na reta' : 'no plano'} verde: a imagem da matriz de controlabilidade.`}</span></div>
        </div>
        <div className="sim-controls">
          <div className="btn-row" style={{ marginTop: 0 }}>{Object.entries(CTRL).map(([k, v]) => <button key={k} className="btn small ghost" style={key === k ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => setKey(k)}>{v.label}</button>)}</div>
          <p className="small"><M>{`A=${bm(P.A)},\\ B=${bm(P.B)}`}</M></p>
          <p className="small"><M>{`\\mathcal{C}=\\begin{bmatrix}B & AB${n === 3 ? ' & A^2B' : ''}\\end{bmatrix}=${bm(Cm)}`}</M></p>
          <Readout items={[['posto(𝒞)', `${r} de ${n}`], ['conclusão', r === n ? 'controlável' : 'não controlável'], ...pbh.map((p) => [`PBH, λ = ${fmt(p.l, 3)}`, p.r === n ? 'controlável' : 'não controlável'])]} />
        </div>
      </div>
    </Sim>
  )
}

// ---------------- observabilidade ----------------
const OBS = {
  slide: { label: 'Exemplo não observável (aula 13)', A: [[4, -10], [3, -7]], C: [[1, -2]], x0: [0.5, -0.5] },
  rlc: { label: 'Circuito RLC (aula 13)', A: [[-2, 0], [0, -1]], C: [[0, 1]], x0: [1, 1] },
  massa0: { label: 'Massa sem mola, y = velocidade', A: [[0, 1], [0, -0.6]], C: [[0, 1]], x0: [0, 1] },
  massa: { label: 'Massa–mola, y = posição', A: [[0, 1], [-2, -0.6]], C: [[1, 0]], x0: [1, 0] },
}

export function Observability() {
  const [key, setKey] = useState('slide')
  const [alpha, setAlpha] = useState(1)
  const P = OBS[key]
  const O = vcat(P.C, matmul(P.C, P.A))
  const r = rank(O)
  // direção não observável: núcleo de O
  const nv = r < 2 ? nullVector(O.length === 2 ? O : O.slice(0, 2)) : null
  const x0b = nv ? P.x0.map((v, i) => v + alpha * nv[i]) : P.x0.map((v, i) => v + (i === 0 ? alpha : 0))
  const sys = { A: P.A, B: [[0], [0]], C: P.C, D: [[0]] }
  const s1 = useMemo(() => simulateSS(sys, () => 0, 6, { dt: 0.005, x0: P.x0, every: 4 }), [key])
  const s2 = useMemo(() => simulateSS(sys, () => 0, 6, { dt: 0.005, x0: x0b, every: 4 }), [key, alpha])
  const lam = eig(P.A).filter((l, i, a) => a.findIndex((q) => Math.abs(q.re - l.re) < 1e-6) === i)
  const pbh = lam.map((l) => ({ l: l.re, r: rank(vcat(P.A.map((row, i) => row.map((v, j) => v - (i === j ? l.re : 0))), P.C)) }))
  return (
    <Sim title="Observabilidade: a saída revela o estado inicial?" sub="dois estados iniciais diferentes, comparados pela saída">
      <div className="sim-body">
        <div>
          <Plot height={200} xRange={[0, 6]} yLabel="saída y(t)" series={[{ x: s1.t, y: s1.y, color: 'var(--pen)', width: 3, label: 'y(t) a partir de x₀' }, { x: s2.t, y: s2.y, color: 'var(--pole)', dash: '6 4', width: 2, label: 'y(t) a partir de x₀′' }]} />
          <Plot height={190} xRange={[0, 6]} yLabel="estados" series={[
            { x: s1.t, y: s1.x.map((x) => x[0]), color: 'var(--pen)', label: 'x₁ (x₀)' }, { x: s1.t, y: s1.x.map((x) => x[1]), color: 'var(--good)', label: 'x₂ (x₀)' },
            { x: s2.t, y: s2.x.map((x) => x[0]), color: 'var(--pen)', dash: '5 4', label: 'x₁ (x₀′)' }, { x: s2.t, y: s2.x.map((x) => x[1]), color: 'var(--good)', dash: '5 4', label: 'x₂ (x₀′)' },
          ]} />
        </div>
        <div className="sim-controls">
          <div className="btn-row" style={{ marginTop: 0 }}>{Object.entries(OBS).map(([k, v]) => <button key={k} className="btn small ghost" style={key === k ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => setKey(k)}>{v.label}</button>)}</div>
          <p className="small"><M>{`A=${bm(P.A)},\\ C=${bm(P.C)}`}</M></p>
          <p className="small"><M>{`\\mathcal{O}=\\begin{bmatrix}C\\\\CA\\end{bmatrix}=${bm(O)}`}</M></p>
          <Slider tex={nv ? '\\alpha\\ (x_0^\\prime = x_0 + \\alpha v)' : '\\alpha\\ (\\text{desvio em } x_1)'} value={alpha} min={-2} max={2} step={0.05} onChange={setAlpha} />
          <Readout items={[['posto(𝒪)', `${r} de 2`], ['conclusão', r === 2 ? 'observável' : 'não observável'], ...pbh.map((p) => [`PBH, λ = ${fmt(p.l, 3)}`, p.r === 2 ? 'observável' : 'não observável'])]} />
          <p className="small">{r < 2 ? <>Os estados iniciais diferem ao longo de <M>{`v = (${fmt(nv[0], 3)};\\ ${fmt(nv[1], 3)})`}</M>, o núcleo de <M>{'\\mathcal{O}'}</M>. As saídas coincidem, embora os estados sejam diferentes: olhando apenas <M>y(t)</M>, é impossível distinguir <M>{'x_0'}</M> de <M>{"x_0'"}</M>.</> : <>Estados iniciais diferentes produzem saídas diferentes: pela saída é possível reconstruir <M>{'x_0'}</M>.</>}</p>
        </div>
      </div>
    </Sim>
  )
}
