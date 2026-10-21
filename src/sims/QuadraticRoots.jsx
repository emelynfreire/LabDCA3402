import { useMemo, useState } from 'react'
import { Sim, Slider, Readout } from '../components/Controls.jsx'
import { M, MM } from '../components/Tex.jsx'
import Plot, { sample } from '../components/Plot.jsx'
import SPlane from '../components/SPlane.jsx'
import { inverseLaplaceFn } from '../lib/poly.js'
import { fmt, texNum } from '../lib/format.js'

const PRESETS = [
  { label: 's² + 5s + 6', b: 5, c: 6 },
  { label: 's² + 4s + 4', b: 4, c: 4 },
  { label: 's² + 4s + 13', b: 4, c: 13 },
  { label: 's² + 6s + 25', b: 6, c: 25 },
  { label: 's² + 4', b: 0, c: 4 },
  { label: 's² + s − 2', b: 1, c: -2 },
]

export default function QuadraticRoots() {
  const [b, setB] = useState(4)
  const [c, setC] = useState(13)
  const D = b * b - 4 * c
  const alpha = -b / 2
  const beta = Math.sqrt(Math.abs(D)) / 2
  const roots = D >= 0 ? [{ kind: 'pole', re: alpha + beta, im: 0 }, { kind: 'pole', re: alpha - beta, im: 0 }] : [{ kind: 'pole', re: alpha, im: beta }]
  const lim = Math.max(4, Math.ceil(Math.abs(alpha) + beta + 1))
  const par = useMemo(() => sample((x) => x * x + b * x + c, -lim, lim / 2, 300), [b, c, lim])
  // caminho das raízes quando c varia (b fixo)
  const trace = useMemo(() => {
    const up = [], dn = []
    for (let k = 0; k <= 200; k++) {
      const cc = -10 + (k / 200) * 50
      const d = b * b - 4 * cc
      if (d >= 0) { up.push([-b / 2 + Math.sqrt(d) / 2, 0]); dn.push([-b / 2 - Math.sqrt(d) / 2, 0]) } else { up.push([-b / 2, Math.sqrt(-d) / 2]); dn.push([-b / 2, -Math.sqrt(-d) / 2]) }
    }
    return [up, dn]
  }, [b])
  const stable = b > 0 && c > 0
  const wn = c > 0 ? Math.sqrt(c) : null
  const xi = c > 0 ? b / (2 * Math.sqrt(c)) : null
  const cls = !stable ? (c <= 0 || b < 0 ? 'instável' : 'marginal (oscila sem decair)') : D > 1e-9 ? 'sobreamortecido (ξ > 1)' : Math.abs(D) <= 1e-9 ? 'crítico (ξ = 1)' : 'subamortecido (ξ < 1)'
  const step = useMemo(() => (Math.abs(c) > 1e-9 ? sample(inverseLaplaceFn([c], [1, b, c, 0]), 0, 8, 400) : null), [b, c])
  const bt = texNum(b), ct = texNum(c)
  return (
    <Sim title="Raízes de s² + bs + c: Bhaskara, completar quadrado e amortecimento" sub="o discriminante decide a forma da resposta">
      <div className="sim-body">
        <div>
          <Plot height={220} xRange={[-lim, lim / 2]} xLabel="σ (eixo real)" yLabel="p(σ)" hLines={[{ y: 0, dash: '0' }]}
            series={[{ ...par, color: 'var(--pen)', width: 2.2 }]}
            markers={D >= 0 ? [{ x: alpha + beta, y: 0, label: 'raiz' }, { x: alpha - beta, y: 0 }] : [{ x: alpha, y: c - b * b / 4, label: 'vértice acima de 0: sem raiz real', color: 'var(--amber)' }]} />
          <ol className="steps">
            <li><span className="step-title">Discriminante</span><M>{`\\Delta = b^2 - 4c = ${bt}^2 - 4\\cdot ${ct} = ${texNum(D)}`}</M> {D > 0 ? '> 0: duas raízes reais distintas.' : Math.abs(D) < 1e-9 ? '= 0: raiz real dupla.' : '< 0: par de raízes complexas conjugadas.'}</li>
            <li><span className="step-title">Bhaskara</span><M>{D >= 0 ? `s = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2} = \\dfrac{${texNum(-b)} \\pm ${texNum(Math.sqrt(D))}}{2} \\Rightarrow s_1 = ${texNum(alpha + beta)},\\ s_2 = ${texNum(alpha - beta)}` : `s = \\dfrac{-b \\pm j\\sqrt{-\\Delta}}{2} = \\dfrac{${texNum(-b)} \\pm j${texNum(Math.sqrt(-D))}}{2} = ${texNum(alpha)} \\pm j${texNum(beta)}`}</M></li>
            <li><span className="step-title">Completar o quadrado (útil na transformada inversa)</span><M>{`s^2 + ${bt}s + ${ct} = \\left(s ${alpha < 0 ? '+' : '-'} ${texNum(Math.abs(alpha))}\\right)^2 ${c - b * b / 4 >= 0 ? '+' : '-'} ${texNum(Math.abs(c - b * b / 4))}`}</M>{D < 0 && <> — forma <M>{'(s-\\alpha)^2+\\beta^2'}</M> da tabela, com <M>{`\\beta = ${texNum(beta)}`}</M>.</>}</li>
          </ol>
        </div>
        <div className="sim-controls">
          <Slider label="b (coef. de s)" value={b} min={-3} max={10} step={0.1} onChange={setB} />
          <Slider label="c (termo constante)" value={c} min={-6} max={30} step={0.1} onChange={setC} />
          <div className="btn-row">{PRESETS.map((p) => <button key={p.label} className="btn small ghost" onClick={() => { setB(p.b); setC(p.c) }}>{p.label}</button>)}</div>
          <SPlane roots={roots} editable={false} xr={[-lim, Math.max(2, lim / 3)]} yr={[-lim, lim]} size={270} extra={[{ kind: 'trace', pts: trace[0] }, { kind: 'trace', pts: trace[1] }]} />
          <p className="small muted">Pontilhado: caminho das raízes quando só <M>c</M> varia. Elas se encontram em <M>{'-b/2'}</M> (Δ = 0) e então sobem na vertical.</p>
          <Readout items={[['Δ', fmt(D)], ['ωn = √c', wn ? fmt(wn) : '—'], ['ξ = b/(2√c)', xi !== null ? fmt(xi) : '—'], ['resposta', cls]]} />
        </div>
      </div>
      <div className="sim-foot">
        {step && <Plot height={150} xRange={[0, 8]} yLabel="degrau" series={[{ ...step, color: 'var(--amber)' }]} hLines={stable ? [{ y: 1 }] : []} yRange={stable ? undefined : [-3, 3]} />}
        <p>Comparando com <M>{'s^2+2\\xi\\omega_ns+\\omega_n^2'}</M>: <M>{'\\Delta = 4\\omega_n^2(\\xi^2-1)'}</M>. Logo <b>Δ &gt; 0 ⇔ ξ &gt; 1</b> (sobreamortecido), <b>Δ = 0 ⇔ ξ = 1</b> (crítico) e <b>Δ &lt; 0 ⇔ ξ &lt; 1</b> (subamortecido). O sinal do discriminante que se estuda no ensino médio decide a forma da resposta do sistema.</p>
      </div>
    </Sim>
  )
}
