import { useMemo, useState } from 'react'
import { ReviewChips } from './Review.jsx'
import Slide from './SlideRef.jsx'

const CW = 240, CH = 104 // tamanho da célula da grade
const NW = 176, NH = 58  // tamanho do nó
const OX = 34            // margem à esquerda (laços de retorno)

function center(n) { return [OX + n.x * CW + CW / 2, n.y * CH + CH / 2] }
function half(n) { return n.type === 'decision' ? [NW / 2 + 6, NH / 2 + 10] : [NW / 2, NH / 2] }

// laço de retorno (sai pela lateral do nó de origem)
const b4 = (pts) => Math.abs(pts[0][1] - pts[1][1]) < 1 && pts[2][1] < pts[1][1]

function route(a, b) {
  const [ax, ay] = center(a), [bx, by] = center(b)
  const [aw, ah] = half(a), [bw, bh] = half(b)
  if (b.y > a.y) {
    if (Math.abs(bx - ax) < 1) return [[ax, ay + ah], [bx, by - bh]]
    // sai pela lateral (decisões) ou por baixo
    if (a.type === 'decision') {
      const sx = ax + Math.sign(bx - ax) * aw
      return [[sx, ay], [bx, ay], [bx, by - bh]]
    }
    const my = ay + ah + (by - bh - (ay + ah)) / 2
    return [[ax, ay + ah], [ax, my], [bx, my], [bx, by - bh]]
  }
  if (b.y === a.y) {
    const s = Math.sign(bx - ax)
    return [[ax + s * aw, ay], [bx - s * bw, by]]
  }
  // volta para cima: mesma coluna contorna pela esquerda; coluna diferente, pela direita
  if (Math.abs(bx - ax) < 1) {
    const xl = Math.min(ax - aw, bx - bw) - 20
    return [[ax - aw, ay], [xl, ay], [xl, by], [bx - bw, by]]
  }
  const xr = Math.max(ax + aw, bx + bw) + 20
  return [[ax + aw, ay], [xr, ay], [xr, by], [bx + bw, by]]
}

function Node({ n, state, onClick }) {
  const [cx, cy] = center(n)
  const cls = 'fnode ' + n.type + ' ' + state
  const shape = n.type === 'decision'
    ? <polygon points={`${cx},${cy - NH / 2 - 10} ${cx + NW / 2 + 6},${cy} ${cx},${cy + NH / 2 + 10} ${cx - NW / 2 - 6},${cy}`} />
    : <rect x={cx - NW / 2} y={cy - NH / 2} width={NW} height={NH} rx={n.type === 'start' || n.type === 'end' ? NH / 2 : 5} />
  const tw = n.type === 'decision' ? NW - 30 : NW - 14
  return (
    <g className={cls} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }} aria-label={n.label}>
      {shape}
      <foreignObject x={cx - tw / 2} y={cy - NH / 2} width={tw} height={NH}>
        <div xmlns="http://www.w3.org/1999/xhtml" className="fnode-text">{n.label}</div>
      </foreignObject>
    </g>
  )
}

/**
 * Fluxograma interativo.
 * flow = { nodes: [{ id, type, label, x, y, detail, review, slide }], edges: [{ from, to, label }] }
 */
export default function Flowchart({ flow }) {
  const byId = useMemo(() => Object.fromEntries(flow.nodes.map((n) => [n.id, n])), [flow])
  const start = flow.nodes.find((n) => n.type === 'start') || flow.nodes[0]
  const [path, setPath] = useState([start.id])
  const [view, setView] = useState(start.id)
  const cur = path[path.length - 1]
  const outs = flow.edges.filter((e) => e.from === cur)
  const visitedEdges = new Set(path.slice(1).map((id, i) => path[i] + '>' + id))
  const cols = Math.max(...flow.nodes.map((n) => n.x)) + 1
  const rows = Math.max(...flow.nodes.map((n) => n.y)) + 1
  const W = OX + cols * CW + 30, H = rows * CH
  const go = (to) => { setPath([...path, to]); setView(to) }
  const back = () => { if (path.length > 1) { const p = path.slice(0, -1); setPath(p); setView(p[p.length - 1]) } }
  const restart = () => { setPath([start.id]); setView(start.id) }
  const shown = byId[view]

  return (
    <div className="flow">
      <div className="flow-chart">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, maxWidth: '100%', minWidth: Math.min(W, 560), height: 'auto' }} role="img" aria-label={flow.title}>
          <defs>
            <marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="var(--ink-3)" /></marker>
            <marker id="fa-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="var(--pen)" /></marker>
          </defs>
          {flow.edges.map((e, i) => {
            const pts = route(byId[e.from], byId[e.to])
            const on = visitedEdges.has(e.from + '>' + e.to)
            const vertical = pts.length === 2 && Math.abs(pts[0][0] - pts[1][0]) < 1
            const [lx, ly] = vertical ? [pts[0][0] + 20, pts[0][1] + 15]
              : pts.length === 4 && b4(pts) ? [pts[0][0] + (pts[1][0] < pts[0][0] ? -16 : 16), pts[0][1] - 6]
              : [(pts[0][0] + pts[1][0]) / 2, pts[0][1] - 6]
            return (
              <g key={i}>
                <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={on ? 'var(--pen)' : 'var(--ink-3)'} strokeWidth={on ? 2.6 : 1.4} markerEnd={`url(#${on ? 'fa-on' : 'fa'})`} />
                {e.label && <text x={lx} y={ly} fontSize="12" fontFamily="var(--font-ui)" fontWeight="700" fill={on ? 'var(--pen)' : 'var(--ink-2)'} textAnchor="middle" className="flabel">{e.label}</text>}
              </g>
            )
          })}
          {flow.nodes.map((n) => (
            <Node key={n.id} n={n} state={(n.id === cur ? 'cur ' : path.includes(n.id) ? 'done ' : '') + (n.id === view ? 'viewing' : '')} onClick={() => setView(n.id)} />
          ))}
        </svg>
      </div>
      <div className="flow-panel">
        <div className="flow-step-kind">{shown.type === 'decision' ? 'Pergunta' : shown.type === 'start' ? 'Início' : shown.type === 'end' ? 'Resultado' : 'Etapa'}{shown.slide && <Slide file={shown.slide.file} p={shown.slide.p} label={shown.slide.label} />}</div>
        <h4 style={{ marginTop: '.2rem' }}>{shown.label}</h4>
        {shown.detail && <div className="flow-detail">{shown.detail}</div>}
        {shown.review && <ReviewChips keys={shown.review} label="Revisar o básico:" />}
        {view !== cur && <p className="small muted">Você está vendo uma etapa fora do caminho atual. <button className="btn small ghost" onClick={() => setView(cur)}>Voltar à etapa atual</button></p>}
        {view === cur && (
          <div className="btn-row">
            {outs.map((e) => <button key={e.to} className="btn small primary" onClick={() => go(e.to)}>{e.label || 'Próxima etapa'} →</button>)}
            {!outs.length && <span className="small muted">Fim do fluxo.</span>}
          </div>
        )}
        <div className="btn-row">
          <button className="btn small ghost" disabled={path.length < 2} onClick={back}>Voltar uma etapa</button>
          <button className="btn small ghost" onClick={restart}>Recomeçar</button>
        </div>
        <p className="small muted">Clique em qualquer caixa do fluxograma para ler a explicação dela.</p>
      </div>
    </div>
  )
}
