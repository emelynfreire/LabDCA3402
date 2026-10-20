import { useMemo, useState } from 'react'
import { Sim, Slider, Readout, Seg } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import SPlane from '../components/SPlane.jsx'
import { routh } from '../lib/routh.js'
import { roots, polyadd, polymul } from '../lib/poly.js'
import { fmt, texPoly, texComplex } from '../lib/format.js'

const PRESETS = [
  { label: 'Exemplo (grau 6)', c: [1, 4, 3, 2, 1, 4, 4] },
  { label: 'Caso especial 1 (ε)', c: [1, 2, 2, 4, 11, 10] },
  { label: 'Caso especial 2 (linha nula)', c: [1, 3, 6, 12, 8] },
  { label: 'Exercício 1', c: [1, 3, 2, 6, 6, 9] },
  { label: 'Estável', c: [1, 6, 11, 6] },
]

function cell(v, row, j) {
  if (row.eps && j === 0) return 'ε'
  if (Math.abs(v) > 1e4) return v > 0 ? '→ +∞' : '→ −∞'
  return fmt(v, 4)
}

export function RouthTable({ coefs, compact }) {
  const r = useMemo(() => routh(coefs), [coefs.join()])
  return (
    <div className="tbl-wrap">
      <table className="tbl num" style={{ width: 'auto', minWidth: compact ? 0 : 320 }}>
        <tbody>
          {r.rows.map((row, i) => {
            const sgn = Math.sign(row.values[0])
            const prev = i > 0 ? Math.sign(r.rows[i - 1].values[0]) : sgn
            const change = i > 0 && sgn !== prev && sgn !== 0 && prev !== 0
            return (
              <tr key={i}>
                <th style={{ width: '3.2rem' }}><M>{`s^{${row.power}}`}</M></th>
                {row.values.map((v, j) => (
                  <td key={j} style={j === 0 ? { fontWeight: 700, color: change ? 'var(--pole)' : undefined, background: change ? 'var(--pole-soft)' : undefined } : undefined}>{cell(v, row, j)}</td>
                ))}
                <td style={{ border: 0, background: 'transparent', fontSize: '.8rem', color: 'var(--ink-3)' }}>{row.note}{change ? ' ← troca de sinal' : ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function RouthExplorer() {
  const [text, setText] = useState(PRESETS[0].c.join(', '))
  const coefs = useMemo(() => {
    const v = text.split(/[,;\s]+/).filter(Boolean).map((x) => parseFloat(x.replace(',', '.')))
    return v.length >= 2 && v.every((x) => isFinite(x)) && v[0] !== 0 ? v : null
  }, [text])
  const r = coefs ? routh(coefs) : null
  const rts = coefs ? roots(coefs) : []
  const rhp = rts.filter((z) => z.re > 1e-7).length
  const axis = rts.filter((z) => Math.abs(z.re) <= 1e-7).length
  const lim = Math.max(3, ...rts.map((z) => Math.ceil(Math.abs(z.re) + 0.5)), ...rts.map((z) => Math.ceil(Math.abs(z.im) + 0.5)))
  const editable = rts.filter((z) => z.im >= -1e-9).map((z) => ({ kind: 'pole', re: z.re, im: Math.abs(z.im) }))
  const sameSign = coefs && coefs.every((c) => Math.sign(c) === Math.sign(coefs[0]) && c !== 0)
  return (
    <Sim title="Critério de Routh–Hurwitz" sub="digite os coeficientes de A(s) em potências decrescentes">
      <div className="sim-body">
        <div>
          <label className="field" style={{ maxWidth: 420 }}><span>coeficientes a₀, a₁, …, aₙ (separados por vírgula)</span>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} aria-label="coeficientes do polinômio" /></label>
          <div className="btn-row">{PRESETS.map((p) => <button key={p.label} className="btn small ghost" onClick={() => setText(p.c.join(', '))}>{p.label}</button>)}</div>
          {coefs ? (
            <>
              <p><M>{`A(s) = ${texPoly(coefs)}`}</M></p>
              {!sameSign && <div className="warn"><span className="tag">Condição necessária violada</span>Há coeficientes nulos ou de sinais diferentes: o polinômio já não pode ser Hurwitz. A tabela mostra quantas raízes estão no SPD.</div>}
              <RouthTable coefs={coefs} />
              <Readout items={[['trocas de sinal', String(r.changes)], ['raízes no SPD (Routh)', r.events.some((e) => e.type === 'zero-row') ? `${r.changes} (+ simétricas)` : String(r.changes)], ['conclusão', rhp === 0 && axis === 0 ? 'BIBO-estável' : rhp === 0 ? 'marginalmente estável' : 'instável']]} />
              {r.events.some((e) => e.type === 'zero-row') && (
                <p className="small">Linha nula: o polinômio auxiliar <M>{`P(s) = ${texPoly(r.events.find((e) => e.type === 'zero-row').aux)}`}</M> contém raízes simétricas em relação à origem; elas são raízes de <M>A(s)</M>.</p>
              )}
            </>
          ) : <p className="warn">Digite pelo menos dois coeficientes numéricos, com o primeiro diferente de zero.</p>}
        </div>
        <div className="sim-controls">
          <SPlane roots={editable} editable={false} xr={[-lim, Math.max(1.5, lim / 2)]} yr={[-lim, lim]} size={290} />
          <p className="small">Raízes calculadas numericamente (para conferência): {rts.map((z, i) => <span key={i}>{i > 0 && '; '}<M>{texComplex(z, 4)}</M></span>)}</p>
        </div>
      </div>
    </Sim>
  )
}

/** Exemplo dos slides: ganhos estabilizantes e estabilidade relativa */
export function RouthGain() {
  const [K, setK] = useState(10)
  const [mode, setMode] = useState('abs')
  const sigma = mode === 'abs' ? 0 : 1
  // A(s) = s³ + 5s² + (K − 6)s + K ; deslocado: s = r − σ
  const A = [1, 5, K - 6, K]
  const Ashift = useMemo(() => {
    // substitui s = r − σ
    let out = [0]
    A.forEach((c, i) => {
      const pw = A.length - 1 - i
      let term = [1]
      for (let k = 0; k < pw; k++) term = polymul(term, [1, -sigma])
      out = polyadd(out, term.map((v) => v * c))
    })
    return out
  }, [K, sigma])
  const rts = roots(A)
  const ok = mode === 'abs' ? K > 7.5 : K > 18
  const editable = rts.filter((z) => z.im >= -1e-9).map((z) => ({ kind: 'pole', re: z.re, im: Math.abs(z.im) }))
  return (
    <Sim title="Ganhos estabilizantes (exemplo dos slides)" sub="malha fechada com K(s+1)/[s(s−1)(s+6)]">
      <div className="sim-body">
        <div>
          <Seg label="critério" value={mode} onChange={setMode} options={[{ value: 'abs', label: 'Estabilidade (Re < 0)' }, { value: 'rel', label: 'Estabilidade relativa (Re < −1)' }]} />
          <Slider label="ganho K" value={K} min={0} max={40} step={0.1} onChange={setK} />
          <p><M>{mode === 'abs' ? `A(s) = ${texPoly(A)}` : `\\bar A(r) = A(r-1) = ${texPoly(Ashift, 'r')}`}</M></p>
          <RouthTable coefs={Ashift} compact />
          <p className="small">{mode === 'abs' ? <>Condições da 1ª coluna: <M>{'\\frac{4K-30}{5} > 0'}</M> e <M>{'K>0'}</M> ⇒ <b>K &gt; 7,5</b>.</> : <>Condições: <M>{'K-18>0'}</M> ⇒ <b>K &gt; 18</b>.</>}</p>
        </div>
        <div className="sim-controls">
          <div style={{ position: 'relative' }}>
            <SPlane roots={editable} editable={false} xr={[-6, 2]} yr={[-6, 6]} size={290} extra={mode === 'rel' ? [{ kind: 'trace', pts: [[-1, -6], [-1, 6]], color: 'var(--amber)' }] : []} />
          </div>
          <Readout items={[['situação', ok ? (mode === 'abs' ? 'estável' : 'todos com Re < −1') : (mode === 'abs' ? 'instável' : 'não atende')], ['maior parte real', fmt(Math.max(...rts.map((z) => z.re)), 3)]]} />
        </div>
      </div>
    </Sim>
  )
}
