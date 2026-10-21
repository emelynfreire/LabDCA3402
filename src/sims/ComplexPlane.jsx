import { useRef, useState } from 'react'
import { Sim, Seg, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { C, cadd, csub, cmul, cdiv, cabs, carg, cconj } from '../lib/complex.js'
import { fmt, texComplex, texNum } from '../lib/format.js'

const deg = (r) => (r * 180) / Math.PI

function polarTex(z) {
  return `${texNum(cabs(z))}\\,e^{j${texNum(carg(z))}}`
}

/** Plano complexo em SVG com pontos arrastáveis e vetores. */
function Plane({ range, points = [], vectors = [], arcs = [], onDrag, size = 420 }) {
  const ref = useRef(null)
  const drag = useRef(null)
  const W = size, H = size, m = 22
  const [x0, x1, y0, y1] = range
  const sx = (x) => m + ((x - x0) / (x1 - x0)) * (W - 2 * m)
  const sy = (y) => H - m - ((y - y0) / (y1 - y0)) * (H - 2 * m)
  const ix = (px) => x0 + ((px - m) / (W - 2 * m)) * (x1 - x0)
  const iy = (py) => y0 + ((H - m - py) / (H - 2 * m)) * (y1 - y0)
  const loc = (e) => {
    const r = ref.current.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]
  }
  const step = Math.max(1, Math.round((x1 - x0) / 10))
  const ticks = (a, b) => { const o = []; for (let v = Math.ceil(a / step) * step; v <= b; v += step) o.push(v); return o }
  const arrow = (a, b, color, w = 2.2, dash) => {
    const [ax, ay, bx, by] = [sx(a.re), sy(a.im), sx(b.re), sy(b.im)]
    const ang = Math.atan2(by - ay, bx - ax)
    const len = Math.hypot(bx - ax, by - ay)
    const h = Math.min(9, len * 0.4)
    return (
      <g>
        <line x1={ax} y1={ay} x2={bx} y2={by} stroke={color} strokeWidth={w} strokeDasharray={dash} />
        {len > 4 && <path d={`M${bx},${by} L${bx - h * Math.cos(ang - 0.4)},${by - h * Math.sin(ang - 0.4)} L${bx - h * Math.cos(ang + 0.4)},${by - h * Math.sin(ang + 0.4)}Z`} fill={color} />}
      </g>
    )
  }
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', touchAction: 'none', userSelect: 'none' }}
      onPointerMove={(e) => {
        if (!drag.current) return
        const [px, py] = loc(e)
        let re = ix(px), im = iy(py)
        re = Math.round(re * 4) / 4; im = Math.round(im * 4) / 4
        onDrag?.(drag.current, C(Math.max(x0, Math.min(x1, re)), Math.max(y0, Math.min(y1, im))))
      }}
      onPointerUp={() => { drag.current = null }} onPointerLeave={() => { drag.current = null }}
      role="img" aria-label="Plano complexo">
      <rect x={m} y={m} width={W - 2 * m} height={H - 2 * m} fill="var(--paper)" stroke="var(--grid-strong)" />
      {ticks(x0, x1).map((v) => <line key={'gx' + v} x1={sx(v)} x2={sx(v)} y1={m} y2={H - m} stroke="var(--grid)" />)}
      {ticks(y0, y1).map((v) => <line key={'gy' + v} y1={sy(v)} y2={sy(v)} x1={m} x2={W - m} stroke="var(--grid)" />)}
      <line x1={m} x2={W - m} y1={sy(0)} y2={sy(0)} stroke="var(--ink-2)" />
      <line y1={m} y2={H - m} x1={sx(0)} x2={sx(0)} stroke="var(--ink-2)" />
      {ticks(x0, x1).filter((v) => v !== 0).map((v) => <text key={'tx' + v} x={sx(v)} y={sy(0) + 13} fontSize="10" textAnchor="middle" fill="var(--ink-3)" fontFamily="var(--font-ui)">{v}</text>)}
      {ticks(y0, y1).filter((v) => v !== 0).map((v) => <text key={'ty' + v} x={sx(0) - 4} y={sy(v) + 3} fontSize="10" textAnchor="end" fill="var(--ink-3)" fontFamily="var(--font-ui)">{v}j</text>)}
      <text x={W - m - 2} y={sy(0) - 5} fontSize="11" textAnchor="end" fill="var(--ink-2)" fontFamily="var(--font-ui)">Re</text>
      <text x={sx(0) + 5} y={m + 12} fontSize="11" fill="var(--ink-2)" fontFamily="var(--font-ui)">Im</text>
      {arcs.map((a, i) => {
        const r = a.r
        const N = 40
        const pts = Array.from({ length: N + 1 }, (_, k) => { const t = a.from + ((a.to - a.from) * k) / N; return `${sx(a.c.re + r * Math.cos(t))},${sy(a.c.im + r * Math.sin(t))}` })
        return <polyline key={'a' + i} points={pts.join(' ')} fill="none" stroke={a.color} strokeWidth="1.6" />
      })}
      {vectors.map((v, i) => <g key={'v' + i}>{arrow(v.from || C(0, 0), v.to, v.color, v.w, v.dash)}
        {v.label && <text x={sx((v.from?.re || 0) * 0.45 + v.to.re * 0.55) + 6} y={sy((v.from?.im || 0) * 0.45 + v.to.im * 0.55) - 6} fontSize="11.5" fill={v.color} fontFamily="var(--font-ui)" fontWeight="600">{v.label}</text>}</g>)}
      {points.map((p, i) => (
        <g key={'p' + i} onPointerDown={(e) => { if (p.drag) { e.preventDefault(); drag.current = p.id; ref.current.setPointerCapture?.(e.pointerId) } }} style={{ cursor: p.drag ? 'grab' : 'default' }}>
          <circle cx={sx(p.z.re)} cy={sy(p.z.im)} r="14" fill="transparent" />
          {p.kind === 'pole'
            ? <g stroke={p.color || 'var(--pole)'} strokeWidth={p.sel ? 3.4 : 2.4} strokeLinecap="round">
              <line x1={sx(p.z.re) - 6} x2={sx(p.z.re) + 6} y1={sy(p.z.im) - 6} y2={sy(p.z.im) + 6} />
              <line x1={sx(p.z.re) - 6} x2={sx(p.z.re) + 6} y1={sy(p.z.im) + 6} y2={sy(p.z.im) - 6} />
            </g>
            : p.kind === 'zero'
              ? <circle cx={sx(p.z.re)} cy={sy(p.z.im)} r="6" fill="var(--panel)" stroke="var(--pen)" strokeWidth="2.4" />
              : <circle cx={sx(p.z.re)} cy={sy(p.z.im)} r={p.drag ? 7 : 5} fill={p.color} stroke="var(--panel)" strokeWidth="2" />}
          {p.label && <text x={sx(p.z.re) + 9} y={sy(p.z.im) - 9} fontSize="12.5" fill={p.color || 'var(--ink)'} fontFamily="var(--font-ui)" fontWeight="700">{p.label}</text>}
        </g>
      ))}
    </svg>
  )
}

function Operacoes() {
  const [z1, setZ1] = useState(C(2, 1))
  const [z2, setZ2] = useState(C(1, 1.5))
  const [op, setOp] = useState('mul')
  const res = op === 'soma' ? cadd(z1, z2) : op === 'sub' ? csub(z1, z2) : op === 'mul' ? cmul(z1, z2) : op === 'div' ? cdiv(z1, z2) : cconj(z1)
  const R = Math.max(4, Math.ceil(Math.max(cabs(z1), cabs(z2), cabs(res)) + 0.6))
  const sym = { soma: '+', sub: '-', mul: '\\cdot', div: '/', conj: '' }[op]
  const arcs = op === 'mul' || op === 'div' ? [
    { c: C(0, 0), r: 0.55, from: 0, to: carg(z1), color: 'var(--pen)' },
    { c: C(0, 0), r: 0.8, from: 0, to: carg(z2), color: 'var(--amber)' },
    { c: C(0, 0), r: 1.05, from: 0, to: carg(res), color: 'var(--pole)' },
  ] : []
  const vectors = [
    { to: z1, color: 'var(--pen)', label: 'z₁' },
    op !== 'conj' && { to: z2, color: 'var(--amber)', label: 'z₂' },
    op === 'soma' && { from: z1, to: res, color: 'var(--amber)', dash: '5 4', w: 1.6 },
    op === 'sub' && { from: z1, to: res, color: 'var(--amber)', dash: '5 4', w: 1.6 },
    { to: res, color: 'var(--pole)', w: 2.8, label: op === 'conj' ? 'z̄₁' : 'resultado' },
  ].filter(Boolean)
  const explain = {
    soma: <>Soma: parte real com parte real, imaginária com imaginária — é a regra do paralelogramo (o tracejado é <M>z_2</M> transladado).</>,
    sub: <>Subtração: <M>{'z_1 - z_2 = z_1 + (-z_2)'}</M>. O vetor de <M>z_2</M> até <M>z_1</M> tem o mesmo comprimento: é por isso que, no plano <M>s</M>, <M>{'|s_0 - p|'}</M> é a distância do polo <M>p</M> ao ponto <M>{'s_0'}</M>.</>,
    mul: <>Multiplicação: os <b>módulos multiplicam</b> e os <b>ângulos somam</b> (os três arcos). Multiplicar por <M>j</M> gira 90°.</>,
    div: <>Divisão: os <b>módulos dividem</b> e os <b>ângulos subtraem</b>. Na forma retangular, multiplica-se em cima e embaixo pelo conjugado do denominador.</>,
    conj: <>Conjugado: troca o sinal da parte imaginária (reflexo no eixo real). <M>{'z\\bar z = |z|^2'}</M> é real — é isso que "racionaliza" divisões.</>,
  }[op]
  return (
    <div className="sim-body">
      <div>
        <Plane range={[-R, R, -R, R]} onDrag={(id, z) => (id === 1 ? setZ1(z) : setZ2(z))}
          vectors={vectors} arcs={arcs}
          points={[{ id: 1, z: z1, color: 'var(--pen)', drag: true }, op !== 'conj' && { id: 2, z: z2, color: 'var(--amber)', drag: true }, { id: 3, z: res, color: 'var(--pole)' }].filter(Boolean)} />
        <p className="small muted">Arraste os pontos azul (<M>z_1</M>) e laranja (<M>z_2</M>).</p>
      </div>
      <div className="sim-controls">
        <Seg label="operação" value={op} onChange={setOp} options={[{ value: 'soma', label: 'soma' }, { value: 'sub', label: 'subtração' }, { value: 'mul', label: 'produto' }, { value: 'div', label: 'divisão' }, { value: 'conj', label: 'conjugado' }]} />
        <div className="ctable">
          <div><span className="cl">z₁</span><M>{`${texComplex(z1)} = ${polarTex(z1)}`}</M></div>
          {op !== 'conj' && <div><span className="cl">z₂</span><M>{`${texComplex(z2)} = ${polarTex(z2)}`}</M></div>}
          <div><span className="cl">resultado</span><M>{`${texComplex(res)} = ${polarTex(res)}`}</M></div>
        </div>
        <Readout items={[
          ['|z₁|', fmt(cabs(z1))], op !== 'conj' && ['|z₂|', fmt(cabs(z2))], ['|resultado|', fmt(cabs(res))],
          ['∠z₁', `${fmt(deg(carg(z1)), 3)}°`], op !== 'conj' && ['∠z₂', `${fmt(deg(carg(z2)), 3)}°`], ['∠resultado', `${fmt(deg(carg(res)), 3)}°`],
        ].filter(Boolean)} />
        <p className="small">{explain}</p>
        {(op === 'mul' || op === 'div') && <p className="small"><M>{`|z_1|${op === 'mul' ? '\\cdot' : '/'}|z_2| = ${texNum(op === 'mul' ? cabs(z1) * cabs(z2) : cabs(z1) / cabs(z2))}`}</M> e <M>{`\\angle z_1 ${op === 'mul' ? '+' : '-'} \\angle z_2 = ${texNum(op === 'mul' ? carg(z1) + carg(z2) : carg(z1) - carg(z2))}\\ \\text{rad}`}</M>{Math.abs((op === 'mul' ? carg(z1) + carg(z2) : carg(z1) - carg(z2)) - carg(res)) > 0.01 ? ' (a menos de uma volta de 2π)' : ''}.</p>}
      </div>
    </div>
  )
}

// ---------- resíduo geométrico ----------
const G_PRESETS = [
  { label: '150 / [s(s²+12s+100)]', K: 150, poles: [C(0, 0), C(-6, 8), C(-6, -8)], zeros: [], sel: 1, note: 'slides 6, p. 31: C₂ = −0,75 + j0,5625' },
  { label: '2 / [s(s²+2s+2)]', K: 2, poles: [C(0, 0), C(-1, 1), C(-1, -1)], zeros: [], sel: 1, note: 'slides 7, p. 12: C₂ = −0,5 + j0,5' },
  { label: '10 / [s(s+1)(s²+4s+13)]', K: 10, poles: [C(0, 0), C(-1, 0), C(-2, 3), C(-2, -3)], zeros: [], sel: 2, note: 'Lista 1, questão 20' },
  { label: '(2s+1) / [s(s²+2s+2)]', K: 2, poles: [C(0, 0), C(-1, 1), C(-1, -1)], zeros: [C(-0.5, 0)], sel: 1, note: 'Lista 1, questão 13d' },
  { label: '(7s+10) / [(s+1)(s+2)(s+5)]', K: 7, poles: [C(-1, 0), C(-2, 0), C(-5, 0)], zeros: [C(-10 / 7, 0)], sel: 0, note: 'slides 6, p. 26' },
]

function Residuo() {
  const [pi, setPi] = useState(0)
  const P = G_PRESETS[pi]
  const [sel, setSel] = useState(P.sel)
  const choose = (i) => { setPi(i); setSel(G_PRESETS[i].sel) }
  const p = P.poles[sel]
  const others = P.poles.filter((_, i) => i !== sel)
  const numF = P.zeros.map((z) => ({ z, v: csub(p, z) }))
  const denF = others.map((q) => ({ z: q, v: csub(p, q) }))
  let val = C(P.K, 0)
  numF.forEach((f) => { val = cmul(val, f.v) })
  denF.forEach((f) => { val = cdiv(val, f.v) })
  const lim = Math.max(3, ...P.poles.map((q) => Math.ceil(Math.max(Math.abs(q.re), Math.abs(q.im)) + 1)))
  const range = [-lim - 0.5, Math.max(1.5, lim / 3), -lim, lim]
  const colors = ['var(--amber)', 'var(--good)', 'var(--pen)', 'var(--ink-2)']
  const sumAng = numF.reduce((s, f) => s + carg(f.v), 0) - denF.reduce((s, f) => s + carg(f.v), 0)
  return (
    <div className="sim-body">
      <div>
        <Plane range={range}
          vectors={[...denF.map((f, i) => ({ from: f.z, to: p, color: colors[i % 4], label: `p − p${P.poles.indexOf(f.z) + 1}` })), ...numF.map((f) => ({ from: f.z, to: p, color: 'var(--pen)', dash: '5 3', label: 'p − z' }))]}
          points={[...P.poles.map((q, i) => ({ id: 'p' + i, z: q, kind: 'pole', sel: i === sel, label: `p${i + 1}`, color: i === sel ? 'var(--pole)' : 'var(--ink-3)' })), ...P.zeros.map((z, i) => ({ id: 'z' + i, z, kind: 'zero' }))]} />
        <p className="small muted">Cada seta liga um polo ou zero ao polo escolhido. O comprimento é o módulo de <M>{'(p-p_j)'}</M> e o ângulo com a horizontal é o argumento.</p>
      </div>
      <div className="sim-controls">
        <div className="btn-row" style={{ marginTop: 0 }}>{G_PRESETS.map((g, i) => <button key={i} className="btn small ghost" style={i === pi ? { borderColor: 'var(--pen)', color: 'var(--pen)' } : undefined} onClick={() => choose(i)}>{g.label}</button>)}</div>
        <p className="small muted">{P.note}</p>
        <div className="btn-row"><span className="small">Resíduo no polo:</span>{P.poles.map((q, i) => <button key={i} className="btn small" aria-pressed={i === sel} style={i === sel ? { borderColor: 'var(--pole)', color: 'var(--pole)' } : undefined} onClick={() => setSel(i)}>{`p${i + 1} = ${fmt(q.re, 3)}${Math.abs(q.im) > 1e-9 ? (q.im > 0 ? '+j' : '−j') + fmt(Math.abs(q.im), 3) : ''}`}</button>)}</div>
        <div className="tbl-wrap"><table className="tbl num small">
          <thead><tr><th>fator</th><th>vetor</th><th>módulo</th><th>ângulo</th></tr></thead>
          <tbody>
            <tr><td>ganho K</td><td>{fmt(P.K)}</td><td>{fmt(P.K)}</td><td>0°</td></tr>
            {numF.map((f, i) => <tr key={'n' + i}><td>× (p − z)</td><td><M>{texComplex(f.v, 3)}</M></td><td>{fmt(cabs(f.v))}</td><td>+{fmt(deg(carg(f.v)), 3)}°</td></tr>)}
            {denF.map((f, i) => <tr key={'d' + i}><td>÷ (p − p{P.poles.indexOf(f.z) + 1})</td><td><M>{texComplex(f.v, 3)}</M></td><td>{fmt(cabs(f.v))}</td><td>−{fmt(deg(carg(f.v)), 3)}°</td></tr>)}
          </tbody></table></div>
        <Readout items={[['|C|', fmt(cabs(val), 4)], ['∠C', `${fmt(carg(val), 4)} rad`], ['C (retangular)', `${fmt(val.re, 4)} ${val.im >= 0 ? '+' : '−'} j${fmt(Math.abs(val.im), 4)}`]]} />
      </div>
      <div style={{ gridColumn: '1 / -1' }} className="small">
        <p><M>{String.raw`C=(s-p)Y(s)\big|_{s=p}=K\,\frac{\prod (p-z_i)}{\prod_{j\neq k}(p-p_j)}\ \Rightarrow\ |C|=K\frac{\prod|p-z_i|}{\prod|p-p_j|},\quad \angle C=\sum\angle(p-z_i)-\sum\angle(p-p_j)`}</M></p>
        <p>Soma dos ângulos: {fmt(sumAng, 4)} rad; trazido para o intervalo (−π, π]: {fmt(carg(val), 4)} rad. Esse é o mesmo valor que o atan2 dá — por isso, no slide, o ângulo de <M>{'-0{,}75+j0{,}5625'}</M> é 2,5 rad e não −0,64 rad.</p>
      </div>
    </div>
  )
}

export default function ComplexPlane({ initial = 'ops' }) {
  const [mode, setMode] = useState(initial)
  return (
    <Sim title="Plano complexo: operações e cálculo de resíduos" sub="geometria dos números complexos">
      <div style={{ padding: '.9rem .9rem 0' }}>
        <Seg label="modo" value={mode} onChange={setMode} options={[{ value: 'ops', label: 'Operações com complexos' }, { value: 'res', label: 'Resíduo pela geometria dos polos' }]} />
      </div>
      {mode === 'ops' ? <Operacoes /> : <Residuo />}
    </Sim>
  )
}
