import { useRef } from 'react'
import { fmt } from '../lib/format.js'

/**
 * Plano s interativo. roots: [{ kind: 'pole' | 'zero', re, im }] com im >= 0
 * (im > 0 representa o par conjugado). Arraste para mover; perto do eixo real ele "gruda".
 */
export default function SPlane({ roots, onChange, xr = [-6, 2], yr = [-5, 5], size = 320, height, editable = true, extra = [], showGrid = true, label = true }) {
  const svgRef = useRef(null)
  const drag = useRef(null)
  const W = size, H = height || size
  const m = 26
  const sx = (x) => m + ((x - xr[0]) / (xr[1] - xr[0])) * (W - 2 * m)
  const sy = (y) => H - m - ((y - yr[0]) / (yr[1] - yr[0])) * (H - 2 * m)
  const ix = (px) => xr[0] + ((px - m) / (W - 2 * m)) * (xr[1] - xr[0])
  const iy = (py) => yr[0] + ((H - m - py) / (H - 2 * m)) * (yr[1] - yr[0])

  function toLocal(e) {
    const r = svgRef.current.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]
  }
  function onDown(e, i, sign) {
    if (!editable) return
    e.preventDefault()
    drag.current = { i, sign }
    svgRef.current.setPointerCapture?.(e.pointerId)
  }
  function onMove(e) {
    if (!drag.current) return
    const [px, py] = toLocal(e)
    let re = Math.max(xr[0], Math.min(xr[1], ix(px)))
    let im = Math.abs(iy(py))
    im = Math.min(im, Math.max(Math.abs(yr[0]), yr[1]))
    const snap = 0.045 * (yr[1] - yr[0])
    if (im < snap) im = 0
    if (Math.abs(re) < 0.02 * (xr[1] - xr[0])) re = 0
    const next = roots.map((r, k) => (k === drag.current.i ? { ...r, re: +re.toFixed(3), im: +im.toFixed(3) } : r))
    onChange?.(next)
  }
  function onUp() { drag.current = null }

  const xt = []
  for (let v = Math.ceil(xr[0]); v <= xr[1]; v++) xt.push(v)
  const yt = []
  for (let v = Math.ceil(yr[0]); v <= yr[1]; v++) yt.push(v)
  const stepX = xr[1] - xr[0] > 14 ? 2 : 1

  const clipId = 'sp' + Math.round(W * 7 + H * 13 + xr[0] * 101 + yr[1] * 37)
  return (
    <svg ref={svgRef} className="splane" viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}
      onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} role="img" aria-label="Plano s com polos e zeros">
      <defs><clipPath id={clipId}><rect x={m} y={m} width={W - 2 * m} height={H - 2 * m} /></clipPath></defs>
      <rect x={m} y={m} width={W - 2 * m} height={H - 2 * m} fill="var(--paper)" stroke="var(--grid-strong)" />
      <rect x={sx(0)} y={m} width={Math.max(0, sx(xr[1]) - sx(0))} height={H - 2 * m} fill="var(--unstable)" />
      {showGrid && xt.map((v) => <line key={'x' + v} x1={sx(v)} x2={sx(v)} y1={m} y2={H - m} stroke="var(--grid)" />)}
      {showGrid && yt.map((v) => <line key={'y' + v} y1={sy(v)} y2={sy(v)} x1={m} x2={W - m} stroke="var(--grid)" />)}
      <line x1={m} x2={W - m} y1={sy(0)} y2={sy(0)} stroke="var(--ink-2)" />
      <line y1={m} y2={H - m} x1={sx(0)} x2={sx(0)} stroke="var(--ink-2)" />
      {xt.filter((v) => v % stepX === 0 && v !== 0).map((v) => <text key={'tx' + v} x={sx(v)} y={sy(0) + 13} fontSize="10" textAnchor="middle" fill="var(--ink-3)" fontFamily="var(--font-ui)">{fmt(v)}</text>)}
      {yt.filter((v) => v % 2 === 0 && v !== 0).map((v) => <text key={'ty' + v} x={sx(0) - 5} y={sy(v) + 3} fontSize="10" textAnchor="end" fill="var(--ink-3)" fontFamily="var(--font-ui)">{fmt(v)}j</text>)}
      {label && <>
        <text x={W - m} y={sy(0) - 6} fontSize="11" textAnchor="end" fill="var(--ink-2)" fontFamily="var(--font-ui)">σ = Re(s)</text>
        <text x={sx(0) + 6} y={m + 12} fontSize="11" fill="var(--ink-2)" fontFamily="var(--font-ui)">jω</text>
        <text x={sx(xr[0]) + 6} y={H - m - 6} fontSize="10" fill="var(--good)" fontFamily="var(--font-ui)">SPE: estável</text>
        <text x={W - m - 4} y={H - m - 6} fontSize="10" textAnchor="end" fill="var(--pole)" fontFamily="var(--font-ui)">SPD</text>
      </>}
      <g clipPath={`url(#${clipId})`}>{extra.map((e, i) => e.kind === 'trace'
        ? <polyline key={'e' + i} points={e.pts.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')} fill="none" stroke={e.color || 'var(--ink-3)'} strokeWidth="1.4" strokeDasharray="3 3" />
        : <circle key={'e' + i} cx={sx(e.re)} cy={sy(e.im)} r={e.r || 3} fill={e.color || 'var(--ink-3)'} />)}</g>
      {roots.map((r, i) => {
        const pts = r.im > 0 ? [[r.re, r.im, 1], [r.re, -r.im, -1]] : [[r.re, 0, 1]]
        return pts.map(([x, y, sg]) => (
          <g key={i + '_' + sg} className={editable ? 'pole' : ''} onPointerDown={(e) => onDown(e, i, sg)}>
            <circle cx={sx(x)} cy={sy(y)} r="13" fill="transparent" />
            {r.kind === 'pole'
              ? <g stroke="var(--pole)" strokeWidth="2.6" strokeLinecap="round">
                <line x1={sx(x) - 6} x2={sx(x) + 6} y1={sy(y) - 6} y2={sy(y) + 6} />
                <line x1={sx(x) - 6} x2={sx(x) + 6} y1={sy(y) + 6} y2={sy(y) - 6} />
              </g>
              : <circle cx={sx(x)} cy={sy(y)} r="6" fill="var(--panel)" stroke="var(--pen)" strokeWidth="2.4" />}
          </g>
        ))
      })}
    </svg>
  )
}

// converte a lista editável em lista completa de raízes complexas
export function expandRoots(list, kind) {
  const out = []
  list.filter((r) => r.kind === kind).forEach((r) => {
    if (r.im > 0) { out.push({ re: r.re, im: r.im }, { re: r.re, im: -r.im }) } else out.push({ re: r.re, im: 0 })
  })
  return out
}
