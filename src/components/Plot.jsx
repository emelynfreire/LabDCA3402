import { useId, useMemo } from 'react'
import { fmt } from '../lib/format.js'

// escala "bonita" para os eixos
function niceStep(range, target = 6) {
  const raw = range / target
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const n = raw / mag
  const s = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10
  return s * mag
}
function ticks(min, max, target) {
  if (!(max > min)) return [min]
  const st = niceStep(max - min, target)
  const out = []
  for (let v = Math.ceil(min / st - 1e-9) * st; v <= max + 1e-9 * st; v += st) out.push(Math.abs(v) < st * 1e-9 ? 0 : v)
  return out
}

/**
 * Gráfico em SVG.
 * series: [{ x: [], y: [], color, label, dash, width, fill }]  ou  { pts: [[x, y], ...] }
 * Cores aceitam variáveis CSS (ex.: 'var(--pen)').
 */
export default function Plot({
  series = [], xRange, yRange, xLabel = 't (s)', yLabel = '', height = 240, width = 560,
  hLines = [], vLines = [], markers = [], bands = [], title, legend = true, yPad = 0.08, xTicks = 7, yTicks = 5, clip = true,
}) {
  const id = useId().replace(/:/g, '')
  const m = { l: 46, r: 12, t: 10, b: 34 }
  const W = width, H = height
  const pw = W - m.l - m.r, ph = H - m.t - m.b

  const prepared = useMemo(() => series.filter(Boolean).map((s) => {
    const pts = s.pts || (s.x || []).map((x, i) => [x, s.y[i]])
    return { ...s, pts: pts.filter((p) => isFinite(p[0]) && isFinite(p[1])) }
  }), [series])

  const [x0, x1] = useMemo(() => {
    if (xRange) return xRange
    let a = Infinity, b = -Infinity
    prepared.forEach((s) => s.pts.forEach(([x]) => { a = Math.min(a, x); b = Math.max(b, x) }))
    return isFinite(a) ? [a, b > a ? b : a + 1] : [0, 1]
  }, [xRange, prepared])

  const [y0, y1] = useMemo(() => {
    if (yRange) return yRange
    let a = Infinity, b = -Infinity
    prepared.forEach((s) => s.pts.forEach(([x, y]) => { if (x >= x0 && x <= x1) { a = Math.min(a, y); b = Math.max(b, y) } }))
    hLines.forEach((h) => { const v = typeof h === 'number' ? h : h.y; a = Math.min(a, v); b = Math.max(b, v) })
    if (!isFinite(a)) return [-1, 1]
    if (b - a < 1e-9) { a -= 1; b += 1 }
    const pad = (b - a) * yPad
    return [a - pad, b + pad]
  }, [yRange, prepared, x0, x1, hLines, yPad])

  const sx = (x) => m.l + ((x - x0) / (x1 - x0)) * pw
  const sy = (y) => m.t + (1 - (y - y0) / (y1 - y0)) * ph
  const xt = ticks(x0, x1, xTicks)
  const yt = ticks(y0, y1, yTicks)

  const pathOf = (pts) => {
    let d = ''
    let pen = false
    const lim = (y1 - y0) * 50
    for (const [x, y] of pts) {
      if (Math.abs(y - (y0 + y1) / 2) > lim) { pen = false; continue }
      d += `${pen ? 'L' : 'M'}${sx(x).toFixed(2)},${sy(y).toFixed(2)}`
      pen = true
    }
    return d
  }

  return (
    <div className="plot">
      {title && <div className="plot-title">{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title || yLabel || 'gráfico'}>
        <defs>
          <clipPath id={`c${id}`}><rect x={m.l} y={m.t} width={pw} height={ph} /></clipPath>
        </defs>
        <rect x={m.l} y={m.t} width={pw} height={ph} fill="var(--paper)" stroke="var(--grid-strong)" />
        {bands.map((b, i) => (
          <rect key={i} clipPath={`url(#c${id})`} x={sx(b.x0 ?? x0)} width={Math.max(0, sx(b.x1 ?? x1) - sx(b.x0 ?? x0))}
            y={sy(b.y1 ?? y1)} height={Math.max(0, sy(b.y0 ?? y0) - sy(b.y1 ?? y1))} fill={b.color || 'var(--pen-soft)'} opacity={b.opacity ?? 0.6} />
        ))}
        {xt.map((v) => <line key={'gx' + v} x1={sx(v)} x2={sx(v)} y1={m.t} y2={m.t + ph} stroke="var(--grid)" />)}
        {yt.map((v) => <line key={'gy' + v} y1={sy(v)} y2={sy(v)} x1={m.l} x2={m.l + pw} stroke="var(--grid)" />)}
        {y0 < 0 && y1 > 0 && <line x1={m.l} x2={m.l + pw} y1={sy(0)} y2={sy(0)} stroke="var(--ink-3)" strokeWidth="1" />}
        {x0 < 0 && x1 > 0 && <line y1={m.t} y2={m.t + ph} x1={sx(0)} x2={sx(0)} stroke="var(--ink-3)" strokeWidth="1" />}
        {xt.map((v) => <text key={'tx' + v} x={sx(v)} y={m.t + ph + 15} fontSize="11" textAnchor="middle" fill="var(--ink-2)">{fmt(v, 3)}</text>)}
        {yt.map((v) => <text key={'ty' + v} x={m.l - 6} y={sy(v) + 4} fontSize="11" textAnchor="end" fill="var(--ink-2)">{fmt(v, 3)}</text>)}
        <text x={m.l + pw} y={H - 4} fontSize="11.5" textAnchor="end" fill="var(--ink-2)">{xLabel}</text>
        {yLabel && <text x={12} y={m.t + ph / 2} fontSize="11.5" textAnchor="middle" fill="var(--ink-2)" transform={`rotate(-90 12 ${m.t + ph / 2})`}>{yLabel}</text>}
        <g clipPath={clip ? `url(#c${id})` : undefined}>
          {hLines.map((h, i) => {
            const o = typeof h === 'number' ? { y: h } : h
            return <line key={'h' + i} x1={m.l} x2={m.l + pw} y1={sy(o.y)} y2={sy(o.y)} stroke={o.color || 'var(--ink-3)'} strokeDasharray={o.dash ?? '4 4'} strokeWidth="1" />
          })}
          {vLines.map((v, i) => {
            const o = typeof v === 'number' ? { x: v } : v
            return <line key={'v' + i} y1={m.t} y2={m.t + ph} x1={sx(o.x)} x2={sx(o.x)} stroke={o.color || 'var(--ink-3)'} strokeDasharray={o.dash ?? '4 4'} strokeWidth="1" />
          })}
          {prepared.map((s, i) => s.fill ? (
            <path key={'f' + i} d={`${pathOf(s.pts)}L${sx(s.pts[s.pts.length - 1]?.[0] ?? x0)},${sy(Math.max(y0, Math.min(y1, s.fillTo ?? 0)))}L${sx(s.pts[0]?.[0] ?? x0)},${sy(Math.max(y0, Math.min(y1, s.fillTo ?? 0)))}Z`}
              fill={s.fill} opacity={s.fillOpacity ?? 0.25} stroke="none" />
          ) : null)}
          {prepared.map((s, i) => s.stem ? (
            <g key={'s' + i}>
              {s.pts.map(([x, y], k) => <g key={k}><line x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(y)} stroke={s.color} strokeWidth="1.2" /><circle cx={sx(x)} cy={sy(y)} r="2.6" fill={s.color} /></g>)}
            </g>
          ) : (
            <path key={'p' + i} d={pathOf(s.pts)} fill="none" stroke={s.color || 'var(--pen)'} strokeWidth={s.width || 2} strokeDasharray={s.dash || undefined} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {markers.map((mk, i) => (
            <g key={'m' + i}>
              <circle cx={sx(mk.x)} cy={sy(mk.y)} r={mk.r || 4} fill={mk.fill || 'var(--panel)'} stroke={mk.color || 'var(--pole)'} strokeWidth="2" />
              {mk.label && <text x={sx(mk.x) + (mk.dx ?? 7)} y={sy(mk.y) + (mk.dy ?? -7)} fontSize="11.5" fill={mk.color || 'var(--pole)'} fontWeight="600">{mk.label}</text>}
            </g>
          ))}
        </g>
      </svg>
      {legend && prepared.some((s) => s.label) && (
        <div className="legend">
          {prepared.filter((s) => s.label).map((s, i) => (
            <span key={i}><i style={{ background: s.color || 'var(--pen)', opacity: s.dash ? 0.7 : 1 }} />{s.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// amostra uma função em [a, b]
export function sample(fn, a, b, n = 400) {
  const x = [], y = []
  for (let i = 0; i <= n; i++) {
    const t = a + ((b - a) * i) / n
    x.push(t)
    y.push(fn(t))
  }
  return { x, y }
}
