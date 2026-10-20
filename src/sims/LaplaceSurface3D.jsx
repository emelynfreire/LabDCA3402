import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import Scene3D, { Axis, Label } from '../components/Scene3D.jsx'
import SPlane, { expandRoots } from '../components/SPlane.jsx'
import Plot from '../components/Plot.jsx'
import { Sim } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { fromRoots, cpolyval, polyval } from '../lib/poly.js'
import { cabs, cdiv, C } from '../lib/complex.js'
import { texPoly } from '../lib/format.js'

const SR = [-6, 2], WR = [-6, 6]
const mapX = (s) => ((s - SR[0]) / (SR[1] - SR[0])) * 8 - 5 // σ → x
const mapZ = (w) => -(((w - WR[0]) / (WR[1] - WR[0])) * 8 - 4) // ω → z
const HS = 1.1 // escala de altura (log10)

function SurfaceMesh({ num, den, c }) {
  const geo = useMemo(() => {
    const n = 110
    const pos = [], col = [], idx = []
    const cLo = new THREE.Color(c.paper2), cMid = new THREE.Color(c.pen), cHi = new THREE.Color(c.pole)
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
      const sg = SR[0] + (i / n) * (SR[1] - SR[0])
      const w = WR[0] + (j / n) * (WR[1] - WR[0])
      const v = cabs(cdiv(cpolyval(num, C(sg, w)), cpolyval(den, C(sg, w))))
      const h = Math.max(-1.6, Math.min(2, Math.log10(v + 1e-12)))
      pos.push(mapX(sg), h * HS, mapZ(w))
      const k = (h + 1.6) / 3.6
      const cc = k < 0.5 ? cLo.clone().lerp(cMid, k * 2) : cMid.clone().lerp(cHi, (k - 0.5) * 2)
      col.push(cc.r, cc.g, cc.b)
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const a = i * (n + 1) + j, b = a + 1, d = a + n + 1, e = d + 1
      idx.push(a, b, d, b, e, d)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
  }, [num.join(), den.join(), c.pen, c.pole, c.paper2])

  const slice = useMemo(() => {
    const pts = []
    for (let j = 0; j <= 300; j++) {
      const w = WR[0] + (j / 300) * (WR[1] - WR[0])
      const v = cabs(cdiv(cpolyval(num, C(0, w)), cpolyval(den, C(0, w))))
      const h = Math.max(-1.6, Math.min(2, Math.log10(v + 1e-12)))
      pts.push([mapX(0), h * HS + 0.02, mapZ(w)])
    }
    return pts
  }, [num.join(), den.join()])

  return (
    <group>
      <mesh geometry={geo}><meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.7} /></mesh>
      <mesh geometry={geo}><meshBasicMaterial color={c.ink} wireframe transparent opacity={0.06} /></mesh>
      <Line points={slice} color={c.amber} lineWidth={3.2} />
      {/* plano σ = 0 (eixo jω) */}
      <mesh position={[mapX(0), 0.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8, 4.4]} />
        <meshBasicMaterial color={c.amber} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Axis from={[-5, -1.8, 0]} to={[3.4, -1.8, 0]} color={c.ink2} label="σ" />
      <Axis from={[mapX(0), -1.8, 4.2]} to={[mapX(0), -1.8, -4.4]} color={c.ink2} label="jω" />
      <Label position={[mapX(0) + 0.3, 2.6, -4]} color={c.amber}>|G(jω)|</Label>
    </group>
  )
}

export default function LaplaceSurface3D() {
  const c = useThemeColors()
  const [roots, setRoots] = useState([{ kind: 'pole', re: -1, im: 3 }, { kind: 'pole', re: -3, im: 0 }, { kind: 'zero', re: -2, im: 0 }])
  const poles = expandRoots(roots, 'pole'), zeros = expandRoots(roots, 'zero')
  const den = fromRoots(poles)
  const numR = fromRoots(zeros)
  const K = Math.abs(polyval(numR, 0)) > 1e-9 && Math.abs(polyval(den, 0)) > 1e-9 ? polyval(den, 0) / polyval(numR, 0) : 1
  const num = numR.map((v) => v * K)
  const freq = useMemo(() => {
    const w = [], m = []
    for (let i = 0; i <= 400; i++) {
      const ww = (i / 400) * 6
      w.push(ww)
      m.push(cabs(cdiv(cpolyval(num, C(0, ww)), cpolyval(den, C(0, ww)))))
    }
    return { x: w, y: m }
  }, [num.join(), den.join()])

  function add(kind) {
    if (kind === 'zero' && zeros.length >= poles.length - 1) return
    if (poles.length >= 6 && kind === 'pole') return
    setRoots([...roots, { kind, re: kind === 'pole' ? -2 : -0.5, im: kind === 'pole' ? 1.5 : 0 }])
  }
  function remove(kind) {
    const i = roots.map((r) => r.kind).lastIndexOf(kind)
    if (i < 0) return
    const next = roots.filter((_, k) => k !== i)
    if (expandRoots(next, 'pole').length < 1) return
    while (expandRoots(next, 'zero').length >= expandRoots(next, 'pole').length) next.splice(next.map((r) => r.kind).lastIndexOf('zero'), 1)
    setRoots(next)
  }

  return (
    <Sim title="Superfície |G(s)| sobre o plano s" sub="polos são picos, zeros são vales · escala logarítmica">
      <div className="sim-body">
        <div>
          <Scene3D camera={[7.5, 6, 7]} target={[-1, 0, 0]} height={430}>
            <SurfaceMesh num={num} den={den} c={c} />
          </Scene3D>
        </div>
        <div className="sim-controls">
          <SPlane roots={roots} onChange={setRoots} xr={SR} yr={WR} size={290} />
          <div className="btn-row">
            <button className="btn small" onClick={() => add('pole')}>+ polo</button>
            <button className="btn small" onClick={() => add('zero')}>+ zero</button>
            <button className="btn small ghost" onClick={() => remove('pole')}>− polo</button>
            <button className="btn small ghost" onClick={() => remove('zero')}>− zero</button>
          </div>
          <Plot height={150} xRange={[0, 6]} xLabel="ω (rad/s)" yLabel="|G(jω)|" series={[{ ...freq, color: 'var(--amber)' }]} />
        </div>
      </div>
      <div className="sim-foot">
        <p><M>{`G(s) = \\dfrac{${texPoly(num)}}{${texPoly(den)}}`}</M>. Em cada polo <M>{'|G(p)| = \\infty'}</M> e em cada zero <M>{'G(z) = 0'}</M>, como na definição dos slides. A curva laranja é a interseção da superfície com o plano <M>{'\\sigma = 0'}</M>: o módulo <M>{'|G(j\\omega)|'}</M>. Aproxime um par de polos do eixo <M>{'j\\omega'}</M> e veja o pico da curva crescer.</p>
      </div>
    </Sim>
  )
}
