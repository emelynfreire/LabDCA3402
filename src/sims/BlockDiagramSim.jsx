import { useMemo, useState } from 'react'
import { Sim, Slider, Readout } from '../components/Controls.jsx'
import { M, MM } from '../components/Tex.jsx'
import Plot from '../components/Plot.jsx'
import SPlane from '../components/SPlane.jsx'
import { roots, inverseLaplaceFn } from '../lib/poly.js'
import { stepInfo } from '../lib/lti.js'
import { fmt, texComplex } from '../lib/format.js'

// ---------- mini-renderizador de diagramas ----------
function Block({ x, y, w = 64, h = 38, tex, hl }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="3" fill={hl ? 'var(--amber-soft)' : 'var(--panel)'} stroke={hl ? 'var(--amber)' : 'var(--ink-2)'} strokeWidth={hl ? 2 : 1.4} />
      <foreignObject x={x - w / 2} y={y - h / 2} width={w} height={h}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: 13, color: 'var(--ink)' }}><M>{tex}</M></div>
      </foreignObject>
    </g>
  )
}
function Sum({ x, y, signs = {}, hl }) {
  const r = 11
  const pos = { left: [-r - 7, -5], top: [5, -r - 3], bottom: [6, r + 11] }
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={hl ? 'var(--amber-soft)' : 'var(--panel)'} stroke={hl ? 'var(--amber)' : 'var(--ink-2)'} strokeWidth="1.4" />
      <line x1={x - r * 0.7} y1={y - r * 0.7} x2={x + r * 0.7} y2={y + r * 0.7} stroke="var(--ink-3)" />
      <line x1={x - r * 0.7} y1={y + r * 0.7} x2={x + r * 0.7} y2={y - r * 0.7} stroke="var(--ink-3)" />
      {Object.entries(signs).map(([k, s]) => <text key={k} x={x + pos[k][0]} y={y + pos[k][1]} fontSize="13" fill="var(--ink)" fontFamily="var(--font-ui)" fontWeight="700">{s}</text>)}
    </g>
  )
}
function Wire({ pts, arrow = true, hl }) {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join('')
  const [x1, y1] = pts[pts.length - 2], [x2, y2] = pts[pts.length - 1]
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const ah = 7
  return (
    <g>
      <path d={d} fill="none" stroke={hl ? 'var(--amber)' : 'var(--ink-2)'} strokeWidth="1.5" />
      {arrow && <path d={`M${x2},${y2} L${x2 - ah * Math.cos(ang - 0.4)},${y2 - ah * Math.sin(ang - 0.4)} L${x2 - ah * Math.cos(ang + 0.4)},${y2 - ah * Math.sin(ang + 0.4)}Z`} fill={hl ? 'var(--amber)' : 'var(--ink-2)'} />}
    </g>
  )
}
const Dot = ({ x, y }) => <circle cx={x} cy={y} r="3.5" fill="var(--ink-2)" />
const T = ({ x, y, children }) => <text x={x} y={y} fontSize="14" fontFamily="var(--font-ui)" fontWeight="600" fill="var(--ink)">{children}</text>

const Y0 = 110
function Stage({ k }) {
  return (
    <svg viewBox="0 0 720 260" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label={`Etapa ${k + 1} da simplificação`}>
      <T x={4} y={Y0 + 5}>R</T>
      <T x={690} y={Y0 + 5}>Y</T>
      {k === 0 && <>
        <Wire pts={[[20, Y0], [59, Y0]]} /><Sum x={70} y={Y0} signs={{ left: '+', bottom: '−' }} />
        <Wire pts={[[81, Y0], [129, Y0]]} /><Sum x={140} y={Y0} signs={{ left: '+', bottom: '+' }} hl />
        <Wire pts={[[151, Y0], [188, Y0]]} hl /><Block x={220} y={Y0} tex="G_1" hl />
        <Wire pts={[[252, Y0], [318, Y0]]} /><Dot x={285} y={Y0} />
        <Block x={350} y={Y0} tex="G_2" /><Wire pts={[[382, Y0], [458, Y0]]} /><Dot x={420} y={Y0} />
        <Block x={490} y={Y0} tex="G_5" /><Wire pts={[[522, Y0], [589, Y0]]} /><Sum x={600} y={Y0} signs={{ left: '+', top: '+' }} />
        <Wire pts={[[611, Y0], [684, Y0]]} />
        <Wire pts={[[285, Y0], [285, 170], [252, 170]]} hl /><Block x={220} y={170} tex="G_3" hl /><Wire pts={[[188, 170], [140, 170], [140, Y0 + 11]]} hl />
        <Wire pts={[[420, Y0], [420, 228], [382, 228]]} /><Block x={350} y={228} tex="G_4" /><Wire pts={[[318, 228], [70, 228], [70, Y0 + 11]]} />
        <Wire pts={[[285, Y0], [285, 40], [458, 40]]} /><Block x={490} y={40} tex="G_6" /><Wire pts={[[522, 40], [600, 40], [600, Y0 - 11]]} />
      </>}
      {k === 1 && <>
        <Wire pts={[[20, Y0], [59, Y0]]} /><Sum x={70} y={Y0} signs={{ left: '+', bottom: '−' }} />
        <Wire pts={[[81, Y0], [140, Y0]]} /><Block x={195} y={Y0} w={110} h={44} tex="\tfrac{G_1}{1-G_1G_3}" />
        <Wire pts={[[250, Y0], [318, Y0]]} /><Dot x={285} y={Y0} />
        <Block x={350} y={Y0} tex="G_2" hl /><Wire pts={[[382, Y0], [458, Y0]]} /><Dot x={420} y={Y0} />
        <Block x={490} y={Y0} tex="G_5" /><Wire pts={[[522, Y0], [589, Y0]]} /><Sum x={600} y={Y0} signs={{ left: '+', top: '+' }} />
        <Wire pts={[[611, Y0], [684, Y0]]} />
        <Wire pts={[[420, Y0], [420, 228], [382, 228]]} /><Block x={350} y={228} tex="G_4" /><Wire pts={[[318, 228], [70, 228], [70, Y0 + 11]]} />
        <Wire pts={[[285, Y0], [285, 40], [458, 40]]} hl /><Block x={490} y={40} tex="G_6" hl /><Wire pts={[[522, 40], [600, 40], [600, Y0 - 11]]} hl />
      </>}
      {k === 2 && <>
        <Wire pts={[[20, Y0], [59, Y0]]} /><Sum x={70} y={Y0} signs={{ left: '+', bottom: '−' }} hl />
        <Wire pts={[[81, Y0], [140, Y0]]} hl /><Block x={195} y={Y0} w={110} h={44} tex="\tfrac{G_1}{1-G_1G_3}" hl />
        <Wire pts={[[250, Y0], [318, Y0]]} hl />
        <Block x={350} y={Y0} tex="G_2" hl /><Wire pts={[[382, Y0], [458, Y0]]} /><Dot x={420} y={Y0} />
        <Block x={490} y={Y0} tex="G_5" /><Wire pts={[[522, Y0], [589, Y0]]} /><Sum x={600} y={Y0} signs={{ left: '+', top: '+' }} />
        <Wire pts={[[611, Y0], [684, Y0]]} />
        <Wire pts={[[420, Y0], [420, 228], [382, 228]]} hl /><Block x={350} y={228} tex="G_4" hl /><Wire pts={[[318, 228], [70, 228], [70, Y0 + 11]]} hl />
        <Wire pts={[[420, Y0], [420, 40], [458, 40]]} /><Block x={490} y={40} tex="\tfrac{G_6}{G_2}" /><Wire pts={[[522, 40], [600, 40], [600, Y0 - 11]]} />
      </>}
      {k === 3 && <>
        <Wire pts={[[20, Y0], [130, Y0]]} /><Block x={230} y={Y0} w={200} h={50} tex="\tfrac{G_1G_2}{1-G_1G_3+G_1G_2G_4}" hl />
        <Wire pts={[[330, Y0], [420, Y0]]} /><Block x={510} y={Y0} w={170} h={50} tex="G_5+\tfrac{G_6}{G_2}" hl />
        <Wire pts={[[595, Y0], [684, Y0]]} />
      </>}
      {k === 4 && <>
        <Wire pts={[[20, Y0], [180, Y0]]} /><Block x={360} y={Y0} w={350} h={56} tex="\dfrac{G_1G_2G_5+G_1G_6}{1-G_1G_3+G_1G_2G_4}" hl />
        <Wire pts={[[535, Y0], [684, Y0]]} />
      </>}
    </svg>
  )
}

const STAGES = [
  { t: 'Diagrama original (Exemplo 2 dos slides)', d: <>O laço formado por <M>G_1</M> e <M>G_3</M> (destacado) é uma realimentação <b>positiva</b>.</> },
  { t: 'Laço interno: realimentação positiva', d: <>Substitui-se o laço por <M>{'\\frac{G_1}{1-G_1G_3}'}</M>. O ramo de <M>G_6</M> sai de um ponto <b>antes</b> de <M>G_2</M>: para separar as estruturas, ele será movido para depois de <M>G_2</M>.</> },
  { t: 'Ponto de derivação movido para depois de G₂', d: <>Ao atravessar <M>G_2</M>, o ramo derivado recebe <M>{'1/G_2'}</M>: <M>{'G_6 \\to G_6/G_2'}</M>. Agora há uma série com realimentação negativa por <M>G_4</M> (destacada) e, à direita, <M>G_5</M> em paralelo com <M>{'G_6/G_2'}</M>.</> },
  { t: 'Série + realimentação negativa; paralelo', d: <MM>{String.raw`\tilde G_1 = \frac{\frac{G_1G_2}{1-G_1G_3}}{1+\frac{G_1G_2G_4}{1-G_1G_3}} = \frac{G_1G_2}{1-G_1G_3+G_1G_2G_4},\qquad \tilde G_2 = G_5+\frac{G_6}{G_2}`}</MM> },
  { t: 'Função de transferência de malha fechada', d: <>Os dois blocos estão em série: <M>{'G_{mf} = \\tilde G_1 \\tilde G_2'}</M>. Repare que o <M>G_2</M> do denominador de <M>{'G_6/G_2'}</M> cancela com o numerador de <M>{'\\tilde G_1'}</M>.</> },
]

export function BlockReduction() {
  const [k, setK] = useState(0)
  return (
    <Sim title="Simplificação de diagrama de blocos, etapa por etapa" sub={`etapa ${k + 1} de ${STAGES.length}`}>
      <div className="sim-body single">
        <div>
          <Stage k={k} />
          <h4 style={{ marginTop: '.6rem' }}>{STAGES[k].t}</h4>
          <div>{STAGES[k].d}</div>
          <div className="btn-row">
            <button className="btn small" disabled={k === 0} onClick={() => setK(k - 1)}>Etapa anterior</button>
            <button className="btn small primary" disabled={k === STAGES.length - 1} onClick={() => setK(k + 1)}>Próxima etapa</button>
          </div>
        </div>
      </div>
    </Sim>
  )
}

/** Malha fechada da Lista 1, questão 19: Gp = K/(s(s+4)), realimentação unitária */
export function FeedbackGain() {
  const [K, setK] = useState(3)
  const poles = roots([1, 4, K])
  const trace = useMemo(() => {
    const up = [], dn = []
    for (let i = 0; i <= 200; i++) {
      const kk = (i / 200) * 30
      const r = roots([1, 4, kk])
      up.push([r[0].re, r[0].im]); dn.push([r[1].re, r[1].im])
    }
    return [up, dn]
  }, [])
  const f = inverseLaplaceFn([K], [1, 4, K, 0])
  const t = Array.from({ length: 401 }, (_, i) => (i / 400) * 6)
  const y = t.map(f)
  const info = stepInfo(t, y)
  const editable = poles.filter((p) => p.im >= -1e-9).map((p) => ({ kind: 'pole', re: p.re, im: Math.abs(p.im) }))
  const disc = 16 - 4 * K
  return (
    <Sim title="Ganho em malha fechada e posição dos polos" sub="Lista 1, questão 19: T(s) = K/(s² + 4s + K)">
      <div className="sim-body">
        <div>
          <Plot height={230} xRange={[0, 6]} yLabel="y(t) ao degrau" hLines={[{ y: 1 }]} series={[{ x: t, y, color: 'var(--pen)', width: 2.2 }]} />
          <Readout items={[['K', fmt(K)], ['polos', poles.map((p) => fmt(p.re, 2) + (Math.abs(p.im) > 1e-6 ? (p.im > 0 ? ' + j' : ' − j') + fmt(Math.abs(p.im), 2) : '')).join('; ')], ['forma', disc > 1e-6 ? 'duas exponenciais reais' : Math.abs(disc) <= 1e-6 ? 'polo duplo: t·e^(αt)' : 'oscilatória'], ['sobressinal', info ? `${fmt(100 * info.Mp, 2)}%` : '—']]} />
        </div>
        <div className="sim-controls">
          <Slider label="ganho K" value={K} min={0.2} max={30} step={0.1} onChange={(v) => setK(Math.abs(v - 4) < 0.12 ? 4 : v)} />
          <SPlane roots={editable} editable={false} xr={[-5, 1]} yr={[-6, 6]} size={280} extra={[{ kind: 'trace', pts: trace[0] }, { kind: 'trace', pts: trace[1] }]} />
          <p className="small">Os polos de malha fechada são <M>{`s = -2 \\pm \\sqrt{4-K}`}</M> (traço pontilhado). Em <M>K=4</M> eles se encontram em <M>-2</M> (polo duplo).</p>
        </div>
      </div>
    </Sim>
  )
}
