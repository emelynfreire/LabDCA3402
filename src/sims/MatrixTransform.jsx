import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { Sim, Seg, Readout, Slider } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import Scene3D, { Axis, Label } from '../components/Scene3D.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { usePlayback } from './usePlayback.js'
import { det, eig, rank, nullVector, charpoly } from '../lib/linalg.js'
import { fmt, texNum, texPoly } from '../lib/format.js'

const P2 = [
  { label: 'Ex. 15 (aula 12)', A: [[0, 1], [-2, -3]] },
  { label: 'Não controlável (aula 13)', A: [[4, -10], [3, -7]] },
  { label: 'Sela (aula 13)', A: [[0, 1], [2, -1]] },
  { label: 'Diagonal', A: [[2, 0], [0, 0.5]] },
  { label: 'Cisalhamento', A: [[1, 1], [0, 1]] },
  { label: 'Rotação 90°', A: [[0, -1], [1, 0]] },
  { label: 'Singular (posto 1)', A: [[1, 2], [0.5, 1]] },
]
const P3 = [
  { label: 'Forma controlável −1, −2, −3', A: [[0, 1, 0], [0, 0, 1], [-6, -11, -6]] },
  { label: 'Ex. 12 (aula 12)', A: [[-1, 0.5, 0], [0, -1, 0], [1, 1, -0.5]] },
  { label: 'Diagonal', A: [[2, 0, 0], [0, 1, 0], [0, 0, 0.5]] },
  { label: 'Posto 2 (achata)', A: [[1, 0, 1], [0, 1, 1], [1, 1, 2]] },
  { label: 'Rotação em z', A: [[0, -1, 0], [1, 0, 0], [0, 0, 1]] },
]

const lerpM = (A, t) => A.map((r, i) => r.map((v, j) => (1 - t) * (i === j ? 1 : 0) + t * v))
const mv = (A, x) => A.map((r) => r.reduce((s, a, j) => s + a * x[j], 0))
const bm = (A) => `\\begin{bmatrix}${A.map((r) => r.map((v) => texNum(v)).join(' & ')).join('\\\\')}\\end{bmatrix}`

function realEig(A) {
  const n = A.length
  const ls = eig(A)
  const out = []
  ls.forEach((l) => {
    if (Math.abs(l.im) > 1e-7) return
    if (out.some((o) => Math.abs(o.l - l.re) < 1e-6)) return
    const Mx = A.map((r, i) => r.map((v, j) => v - (i === j ? l.re : 0)))
    out.push({ l: l.re, v: nullVector(Mx) })
  })
  return { all: ls, real: out, n }
}

function MatrixInput({ A, setA }) {
  return (
    <div className="mat-input" style={{ gridTemplateColumns: `repeat(${A.length}, 1fr)` }}>
      {A.map((r, i) => r.map((v, j) => (
        <input key={i + '_' + j} type="number" step="0.5" value={v} aria-label={`a${i + 1}${j + 1}`}
          onChange={(e) => { const B = A.map((rr) => rr.slice()); B[i][j] = parseFloat(e.target.value) || 0; setA(B) }} />
      )))}
    </div>
  )
}

function View2D({ A, t }) {
  const Mt = lerpM(A, t)
  const W = 420, m = 10
  const R = Math.min(8, Math.max(3, Math.ceil(1.15 * Math.max(...Array.from({ length: 36 }, (_, k) => { const a = (Math.PI * k) / 36; return Math.hypot(...mv(A, [Math.cos(a), Math.sin(a)])) }), 1))))
  const s = (W - 2 * m) / (2 * R)
  const X = (x) => m + (x + R) * s, Yc = (y) => W - m - (y + R) * s
  const P = (v) => { const w = mv(Mt, v); return [X(w[0]), Yc(w[1])] }
  const lines = []
  for (let k = -R; k <= R; k++) {
    lines.push([P([k, -R]), P([k, R])]); lines.push([P([-R, k]), P([R, k])])
  }
  const circle = Array.from({ length: 73 }, (_, k) => { const a = (2 * Math.PI * k) / 72; return P([Math.cos(a), Math.sin(a)]) })
  const sq = [[0, 0], [1, 0], [1, 1], [0, 1]].map(P)
  const { real } = realEig(A)
  const samples = Array.from({ length: 12 }, (_, k) => { const a = (Math.PI * k) / 12; return [Math.cos(a), Math.sin(a)] })
  const arrow = (from, to, color, w = 2) => {
    const ang = Math.atan2(to[1] - from[1], to[0] - from[0]); const h = 7
    return <g><line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth={w} /><path d={`M${to[0]},${to[1]} L${to[0] - h * Math.cos(ang - 0.4)},${to[1] - h * Math.sin(ang - 0.4)} L${to[0] - h * Math.cos(ang + 0.4)},${to[1] - h * Math.sin(ang + 0.4)}Z`} fill={color} /></g>
  }
  const O = [X(0), Yc(0)]
  return (
    <svg viewBox={`0 0 ${W} ${W}`} style={{ width: '100%', height: 'auto' }} role="img" aria-label="Transformação linear do plano">
      <defs><clipPath id="mt2"><rect x={m} y={m} width={W - 2 * m} height={W - 2 * m} /></clipPath></defs>
      <rect x={m} y={m} width={W - 2 * m} height={W - 2 * m} fill="var(--paper)" stroke="var(--grid-strong)" />
      <g clipPath="url(#mt2)">
        {Array.from({ length: 2 * R + 1 }, (_, k) => k - R).map((k) => <g key={'g' + k}><line x1={X(k)} x2={X(k)} y1={m} y2={W - m} stroke="var(--grid)" /><line y1={Yc(k)} y2={Yc(k)} x1={m} x2={W - m} stroke="var(--grid)" /></g>)}
        {lines.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--pen)" strokeOpacity="0.35" strokeWidth={i % 2 === 0 && Math.abs(i / 2 - R) < 0.1 ? 1.8 : 1} />)}
        <polygon points={sq.map((p) => p.join(',')).join(' ')} fill="var(--amber)" fillOpacity="0.28" stroke="var(--amber)" strokeWidth="1.6" />
        <polyline points={circle.map((p) => p.join(',')).join(' ')} fill="none" stroke="var(--pole)" strokeWidth="1.8" />
        {t > 0.999 && real.map((e, i) => {
          const a = [X(-R * 2 * e.v[0]), Yc(-R * 2 * e.v[1])], b = [X(R * 2 * e.v[0]), Yc(R * 2 * e.v[1])]
          return <line key={'e' + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--good)" strokeWidth="2.4" strokeDasharray="7 4" />
        })}
        {samples.map((v, i) => arrow(O, P(v), 'var(--ink-2)', 1.2))}
        {arrow(O, P([1, 0]), 'var(--pen)', 2.6)}
        {arrow(O, P([0, 1]), 'var(--pole)', 2.6)}
      </g>
      <text x={m + 6} y={m + 16} fontSize="12" fill="var(--ink-2)" fontFamily="var(--font-ui)">t = {fmt(t, 2)}</text>
    </svg>
  )
}

function Cube({ A, t, c }) {
  const Mt = lerpM(A, t)
  const V = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map((v) => { const w = mv(Mt, v); return [w[0], w[2], -w[1]] })
  const faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]
  const geo = useMemo(() => {
    const pos = []
    faces.forEach(([a, b, cc, d]) => { [a, b, cc, a, cc, d].forEach((k) => pos.push(...V[k])) })
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g
  }, [JSON.stringify(V)])
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
  const { real } = realEig(A)
  const col = (k) => [mv(Mt, [1, 0, 0]), mv(Mt, [0, 1, 0]), mv(Mt, [0, 0, 1])][k]
  const to3 = (w) => [w[0], w[2], -w[1]]
  return (
    <group>
      <gridHelper args={[8, 16, c.grid, c.grid]} position={[0, -0.001, 0]} />
      <Axis from={[0, 0, 0]} to={[3.4, 0, 0]} color={c.ink2} label="x₁" />
      <Axis from={[0, 0, 0]} to={[0, 0, -3.4]} color={c.ink2} label="x₂" />
      <Axis from={[0, 0, 0]} to={[0, 3.4, 0]} color={c.ink2} label="x₃" />
      <mesh geometry={geo}><meshStandardMaterial color={c.amber} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      {edges.map(([a, b], i) => <Line key={i} points={[V[a], V[b]]} color={c.amber} lineWidth={1.6} />)}
      {[0, 1, 2].map((k) => <Line key={'c' + k} points={[[0, 0, 0], to3(col(k))]} color={[c.pen, c.pole, c.good][k]} lineWidth={3.2} />)}
      {[0, 1, 2].map((k) => <Label key={'l' + k} position={to3(col(k)).map((v) => v * 1.12)} color={[c.pen, c.pole, c.good][k]} size={11}>{`A·e${k + 1}`}</Label>)}
      {t > 0.999 && real.map((e, i) => {
        const L = 3.5
        const p = [e.v[0], e.v[2], -e.v[1]]
        return <group key={'e' + i}><Line points={[p.map((v) => -v * L), p.map((v) => v * L)]} color={c.ink} lineWidth={1.4} dashed dashSize={0.15} gapSize={0.1} /><Label position={p.map((v) => v * L * 1.05)} color={c.ink2} size={11}>{`λ = ${fmt(e.l, 3)}`}</Label></group>
      })}
    </group>
  )
}

export default function MatrixTransform({ initialDim = '2', preset2 = 0, preset3 = 0 }) {
  const c = useThemeColors()
  const [dim, setDim] = useState(initialDim)
  const [A2, setA2] = useState(P2[preset2].A)
  const [A3, setA3] = useState(P3[preset3].A)
  const A = dim === '2' ? A2 : A3
  const setA = dim === '2' ? setA2 : setA3
  const pb = usePlayback(1, { loop: false, speed: 0.5 })
  const t = pb.t
  const d = det(A)
  const r = rank(A)
  const { all, real } = realEig(A)
  const cp = charpoly(A)
  return (
    <Sim title="Matriz como transformação: determinante, posto e autovetores" sub="anime a passagem da identidade I para A">
      <div className="sim-body">
        <div>
          {dim === '2' ? <View2D A={A} t={t} /> : (
            <Scene3D camera={[4.5, 4, 5.5]} target={[0.5, 0.5, -0.5]} height={420}><Cube A={A} t={t} c={c} /></Scene3D>
          )}
          <div className="btn-row">
            <button className="btn small primary" onClick={pb.restart}>Animar I → A</button>
            <Slider label="t" value={t} min={0} max={1} step={0.01} onChange={(v) => { pb.setPlaying(false); pb.seek(v) }} digits={2} />
          </div>
        </div>
        <div className="sim-controls">
          <Seg label="dimensão" value={dim} onChange={(v) => { setDim(v); pb.restart() }} options={[{ value: '2', label: '2 × 2 (plano)' }, { value: '3', label: '3 × 3 (espaço, 3D)' }]} />
          <div className="btn-row">{(dim === '2' ? P2 : P3).map((p) => <button key={p.label} className="btn small ghost" onClick={() => { setA(p.A); pb.restart() }}>{p.label}</button>)}</div>
          <h4>Matriz A (editável)</h4>
          <MatrixInput A={A} setA={setA} />
          <Readout items={[
            ['det A', fmt(d, 4)], ['posto', `${r} de ${A.length}`],
            ['autovalores', all.map((l) => fmt(l.re, 3) + (Math.abs(l.im) > 1e-7 ? (l.im > 0 ? '+j' : '−j') + fmt(Math.abs(l.im), 3) : '')).join('; ')],
          ]} />
          <p className="small"><M>{`\\det(\\lambda I - A) = ${texPoly(cp, '\\lambda')}`}</M></p>
        </div>
      </div>
      <div className="sim-foot">
        <p><b>O que observar.</b> As colunas de <M>A</M> são as imagens dos vetores da base {dim === '2' ? <>(seta azul = <M>{'Ae_1'}</M>, vermelha = <M>{'Ae_2'}</M>)</> : <>(<M>{'Ae_1, Ae_2, Ae_3'}</M>)</>}. O {dim === '2' ? 'quadrado unitário vira um paralelogramo de área' : 'cubo unitário vira um paralelepípedo de volume'} <M>{'|\\det A|'}</M> = {fmt(Math.abs(d), 4)}. {Math.abs(d) < 1e-9 ? <>Aqui <M>{'\\det A = 0'}</M>: a figura é achatada numa dimensão menor — as colunas são linearmente dependentes e o posto é {r}.</> : 'Det ≠ 0: nada é achatado, a matriz tem inversa.'}</p>
        <p>{real.length ? <>As retas verdes{dim === '3' ? ' (pretas tracejadas, no 3D)' : ''} são as direções dos <b>autovetores</b>: um vetor sobre elas só é esticado (ou encolhido, ou invertido) pelo fator <M>{'\\lambda'}</M>, sem mudar de direção — <M>{'Av=\\lambda v'}</M>. Elas aparecem ao fim da animação.</> : <>Os autovalores são complexos: nenhuma direção real fica parada, a transformação gira os vetores. No espaço de estados, isso gera trajetórias em espiral.</>}</p>
      </div>
    </Sim>
  )
}
