import { useMemo, useState } from 'react'
import { Sim, Readout } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { polyder } from '../lib/poly.js'
import { fmt, texPoly } from '../lib/format.js'

const EPS = 1e-6
const PRESETS = [
  { label: 's³ + 5s² + 4s + 30 (instável)', c: [1, 5, 4, 30] },
  { label: 'Exemplo de grau 6 (slides)', c: [1, 4, 3, 2, 1, 4, 4] },
  { label: 'Caso ε (slides)', c: [1, 2, 2, 4, 11, 10] },
  { label: 'Linha nula (slides)', c: [1, 3, 6, 12, 8] },
  { label: 's³ + 6s² + 11s + 6 (estável)', c: [1, 6, 11, 6] },
]

function buildSteps(coefs) {
  const n = coefs.length - 1
  const width = Math.ceil((n + 1) / 2)
  const pad = (r) => { const o = r.slice(); while (o.length < width) o.push(0); return o }
  const r0 = [], r1 = []
  for (let i = 0; i <= n; i += 2) r0.push(coefs[i])
  for (let i = 1; i <= n; i += 2) r1.push(coefs[i])
  const rows = [{ power: n, v: pad(r0), eps: false }, { power: n - 1, v: pad(r1), eps: false }]
  const snap = () => rows.map((r) => ({ ...r, v: r.v.slice() }))
  const steps = [{ kind: 'init', rows: snap(), text: 'As duas primeiras linhas recebem os coeficientes alternados: a linha de sⁿ fica com a₀, a₂, a₄…; a de sⁿ⁻¹ com a₁, a₃, a₅…' }]
  for (let k = 2; k <= n; k++) {
    const a = rows[k - 2].v
    const b = rows[k - 1].v
    const scale = Math.max(1, ...a.map(Math.abs), ...b.map(Math.abs))
    if (b.every((x) => Math.abs(x) < 1e-9 * scale)) {
      const prev = rows[k - 2]
      const aux = []
      prev.v.forEach((x, i) => { const pw = prev.power - 2 * i; if (pw >= 0) { aux.push(x); if (pw > 0) aux.push(0) } })
      const d = polyder(aux)
      const repl = []
      for (let i = 0; i < d.length; i += 2) repl.push(d[i])
      rows[k - 1] = { ...rows[k - 1], v: pad(repl), aux }
      steps.push({ kind: 'zero', rows: snap(), k: k - 1, aux, d, text: 'A linha inteira deu zero (caso especial 2). Monta-se o polinômio auxiliar P(s) com a linha anterior e troca-se a linha nula pelos coeficientes de dP/ds.' })
      k--
      continue
    }
    if (Math.abs(b[0]) < 1e-9 * scale) {
      rows[k - 1].v[0] = EPS
      rows[k - 1].eps = true
      steps.push({ kind: 'eps', rows: snap(), k: k - 1, text: 'O primeiro elemento da linha é zero, mas a linha não é toda nula (caso especial 1). Troca-se o zero por ε > 0 bem pequeno e segue-se normalmente.' })
    }
    const row = { power: n - k, v: new Array(width).fill(0), eps: false, filled: 0 }
    rows.push(row)
    for (let j = 0; j < width; j++) {
      const a2 = a[j + 1] ?? 0, b2 = b[j + 1] ?? 0
      if (j > 0 && Math.abs(a2) < 1e-12 && Math.abs(b2) < 1e-12) break
      const val = (b[0] * a2 - a[0] * b2) / b[0]
      row.v[j] = Math.abs(val) < 1e-12 ? 0 : val
      row.filled = j + 1
      steps.push({ kind: 'cell', rows: snap(), k, j, used: [[k - 2, 0], [k - 2, j + 1], [k - 1, 0], [k - 1, j + 1]], vals: { a0: a[0], a2, b0: b[0], b2 }, epsB: rows[k - 1].eps, val })
    }
  }
  const first = rows.map((r) => r.v[0])
  let changes = 0
  const changeAt = []
  for (let i = 1; i < first.length; i++) if (first[i] !== 0 && first[i - 1] !== 0 && Math.sign(first[i]) !== Math.sign(first[i - 1])) { changes++; changeAt.push(i) }
  steps.push({ kind: 'end', rows: snap(), changes, changeAt, zeroRow: steps.some((s) => s.kind === 'zero') })
  return steps
}

const show = (v, isEps) => (isEps ? 'ε' : Math.abs(v) > 1e4 ? (v > 0 ? '+∞' : '−∞') : fmt(v, 4))
const texv = (v, isEps) => (isEps ? '\\varepsilon' : Math.abs(v) > 1e4 ? (v > 0 ? '+\\infty' : '-\\infty') : fmt(v, 4).replace(',', '{,}').replace('−', '-'))

export default function RouthStepByStep() {
  const [text, setText] = useState(PRESETS[0].c.join(', '))
  const coefs = useMemo(() => {
    const v = text.split(/[;,\s]+/).filter(Boolean).map((x) => parseFloat(x.replace(',', '.')))
    return v.length >= 3 && v.every(isFinite) && v[0] !== 0 ? v : null
  }, [text])
  const steps = useMemo(() => (coefs ? buildSteps(coefs) : []), [coefs])
  const [i, setI] = useState(0)
  const st = steps[Math.min(i, steps.length - 1)]
  const set = (t) => { setText(t); setI(0) }
  if (!coefs) {
    return (
      <Sim title="Routh–Hurwitz célula por célula" sub="">
        <div className="sim-body single"><label className="field"><span>coeficientes</span><input value={text} onChange={(e) => set(e.target.value)} /></label><p className="warn">Digite pelo menos três coeficientes, com o primeiro diferente de zero.</p></div>
      </Sim>
    )
  }
  const used = st.kind === 'cell' ? st.used : []
  const isUsed = (r, c) => used.some(([a, b]) => a === r && b === c)
  const width = st.rows[0].v.length
  return (
    <Sim title="Routh–Hurwitz célula por célula" sub={`passo ${i + 1} de ${steps.length}`}>
      <div className="sim-body">
        <div>
          <p><M>{`A(s) = ${texPoly(coefs)}`}</M></p>
          <div className="tbl-wrap">
            <table className="tbl num routh-step" style={{ width: 'auto' }}>
              <tbody>
                {st.rows.map((r, ri) => (
                  <tr key={ri}>
                    <th><M>{`s^{${r.power}}`}</M></th>
                    {r.v.map((v, ci) => {
                      const target = st.kind === 'cell' && st.k === ri && st.j === ci
                      const notYet = r.filled !== undefined && ci >= r.filled
                      const change = st.kind === 'end' && ci === 0 && st.changeAt.includes(ri)
                      const cls = target ? 'rt-target' : isUsed(ri, ci) ? 'rt-used' : change ? 'rt-change' : ''
                      return <td key={ci} className={cls}>{notYet ? '' : show(v, r.eps && ci === 0)}</td>
                    })}
                    <td className="rt-note">{(st.kind === 'zero' && st.k === ri) ? '← dP/ds' : (st.kind === 'eps' && st.k === ri) ? '← 0 vira ε' : ''}</td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, coefs.length - st.rows.length) }, (_, k) => (
                  <tr key={'e' + k} className="rt-empty"><th><M>{`s^{${coefs.length - 1 - st.rows.length - k}}`}</M></th>{Array.from({ length: width }, (_, j) => <td key={j} />)}<td className="rt-note" /></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="btn-row">
            <button className="btn small" disabled={i === 0} onClick={() => setI(i - 1)}>Passo anterior</button>
            <button className="btn small primary" disabled={i >= steps.length - 1} onClick={() => setI(i + 1)}>Próximo passo</button>
            <button className="btn small ghost" onClick={() => setI(steps.length - 1)}>Ir ao fim</button>
            <button className="btn small ghost" onClick={() => setI(0)}>Recomeçar</button>
          </div>
        </div>
        <div className="sim-controls">
          <label className="field"><span>coeficientes de A(s), potências decrescentes</span><input value={text} onChange={(e) => set(e.target.value)} /></label>
          <div className="btn-row">{PRESETS.map((p) => <button key={p.label} className="btn small ghost" onClick={() => set(p.c.join(', '))}>{p.label}</button>)}</div>
          <div className="rt-explain">
            {st.kind === 'init' && <p>{st.text}</p>}
            {st.kind === 'eps' && <p>{st.text}</p>}
            {st.kind === 'zero' && <><p>{st.text}</p><p><M>{`P(s) = ${texPoly(st.aux)}\\quad\\Rightarrow\\quad \\frac{dP}{ds} = ${texPoly(st.d)}`}</M></p><p className="small">As raízes de <M>P(s)</M> também são raízes de <M>A(s)</M> e são simétricas em relação à origem.</p></>}
            {st.kind === 'cell' && (() => {
              const { a0, a2, b0, b2 } = st.vals
              const e = st.epsB
              return (
                <>
                  <p>Cada elemento novo usa a <b>primeira coluna</b> das duas linhas de cima e a <b>coluna à direita</b> da posição que está sendo calculada (células em amarelo):</p>
                  <p><M>{`\\frac{${texv(b0, e)}\\cdot ${texv(a2)} - ${texv(a0)}\\cdot ${texv(b2)}}{${texv(b0, e)}} = ${texv(st.val)}`}</M></p>
                  <p className="small muted">É o "determinante cruzado" dividido pelo pivô: <M>{'\\frac{b_1 a_{j+1} - a_1 b_{j+1}}{b_1}'}</M>, com a linha de cima <M>a</M> e a do meio <M>b</M>.{e && ' Aqui o pivô é ε: o resultado é calculado com ε pequeno e só o sinal interessa.'}</p>
                </>
              )
            })()}
            {st.kind === 'end' && (
              <>
                <p><b>Tabela completa.</b> Primeira coluna: {st.rows.map((r) => show(r.v[0], r.eps)).join(', ')}.</p>
                <p>{st.changes === 0 ? 'Nenhuma troca de sinal na primeira coluna' : `${st.changes} troca(s) de sinal na primeira coluna (células em vermelho)`}: {st.changes === 0 ? (st.zeroRow ? 'nenhuma raiz no semiplano direito, mas houve linha nula: há raízes sobre o eixo imaginário — marginalmente estável.' : 'todas as raízes têm parte real negativa — BIBO-estável.') : `${st.changes} raiz(es) no semiplano direito — instável.`}</p>
              </>
            )}
          </div>
          {st.kind === 'end' && <Readout items={[['trocas de sinal', String(st.changes)], ['raízes no SPD', String(st.changes)]]} />}
        </div>
      </div>
    </Sim>
  )
}
