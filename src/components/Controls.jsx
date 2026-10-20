import { fmt } from '../lib/format.js'
import { M } from './Tex.jsx'

export function Slider({ label, tex, value, min, max, step = 0.01, onChange, unit = '', digits = 3, log = false }) {
  const toPos = (v) => (log ? Math.log10(v) : v)
  const fromPos = (p) => (log ? Math.pow(10, p) : p)
  return (
    <div className="slider">
      <label>{tex ? <M>{tex}</M> : label}</label>
      <input
        type="range"
        aria-label={label || tex}
        min={toPos(min)} max={toPos(max)} step={log ? (toPos(max) - toPos(min)) / 200 : step}
        value={toPos(value)}
        onChange={(e) => onChange(fromPos(parseFloat(e.target.value)))}
      />
      <output>{fmt(value, digits)}{unit && ' ' + unit}</output>
    </div>
  )
}

export function Seg({ options, value, onChange, label }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value
        const l = typeof o === 'string' ? o : o.label
        return (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{l}</button>
        )
      })}
    </div>
  )
}

export function Readout({ items }) {
  return (
    <div className="readout">
      {items.map(([k, v], i) => (
        <div key={i}><span>{k}</span><b>{v}</b></div>
      ))}
    </div>
  )
}

/** Moldura de simulação ("instrumento") */
export function Sim({ title, sub, children, foot, id, className = '' }) {
  return (
    <section className={'sim breakout ' + className} id={id}>
      <div className="sim-head">
        <span className="sim-title">{title}</span>
        {sub && <span className="sim-sub">{sub}</span>}
      </div>
      {children}
      {foot && <div className="sim-foot">{foot}</div>}
    </section>
  )
}

export function Callout({ kind = 'def', tag, children }) {
  return (
    <div className={kind}>
      {tag && <span className="tag">{tag}</span>}
      {children}
    </div>
  )
}
