import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import Scene3D, { Axis, Label } from '../components/Scene3D.jsx'
import SPlane from '../components/SPlane.jsx'
import Plot, { sample } from '../components/Plot.jsx'
import { Sim, Seg } from '../components/Controls.jsx'
import { M } from '../components/Tex.jsx'
import { useThemeColors } from '../components/useTheme.js'
import { usePlayback } from './usePlayback.js'
import Transport from './Transport.jsx'
import { texNum } from '../lib/format.js'

const TMAX = 6
const SX = 7 / TMAX // escala do eixo do tempo

function Helix({ sigma, omega, pb, c, showConj }) {
  const A = (t) => Math.min(3, Math.exp(sigma * t))
  const pts = useMemo(() => Array.from({ length: 600 }, (_, i) => {
    const t = (i / 599) * TMAX
    const e = Math.exp(sigma * t)
    return [t * SX - 3.5, e * Math.cos(omega * t), e * Math.sin(omega * t)]
  }).filter((p) => Math.hypot(p[1], p[2]) < 3.2), [sigma, omega])
  const conj = pts.map(([x, y, z]) => [x, y, -z])
  const real = pts.map(([x, y]) => [x, y, 0])
  const envelope = useMemo(() => {
    const top = [], bot = []
    for (let i = 0; i < 200; i++) { const t = (i / 199) * TMAX; const a = A(t); if (a < 3.1) { top.push([t * SX - 3.5, a, 0]); bot.push([t * SX - 3.5, -a, 0]) } }
    return [top, bot]
  }, [sigma])
  const phasor = useRef(), dot = useRef(), dotR = useRef()
  useFrame(() => {
    const t = pb.tRef.current
    const e = Math.exp(sigma * t)
    const x = t * SX - 3.5, y = e * Math.cos(omega * t), z = e * Math.sin(omega * t)
    if (phasor.current) phasor.current.geometry.setPositions([x, 0, 0, x, y, z])
    if (dot.current) dot.current.position.set(x, y, z)
    if (dotR.current) dotR.current.position.set(x, y, 0)
  })
  return (
    <group>
      <Axis from={[-3.6, 0, 0]} to={[3.9, 0, 0]} color={c.ink2} label="t" />
      <Axis from={[-3.5, -2.6, 0]} to={[-3.5, 2.8, 0]} color={c.ink2} label="Re" />
      <Axis from={[-3.5, 0, -2.6]} to={[-3.5, 0, 2.8]} color={c.ink2} label="Im" />
      <mesh position={[0.05, 0, 0]}><planeGeometry args={[7.2, 5.6]} /><meshBasicMaterial color={c.pen} transparent opacity={0.05} depthWrite={false} /></mesh>
      {pts.length > 1 && <Line points={pts} color={c.pen} lineWidth={2.6} />}
      {showConj && conj.length > 1 && <Line points={conj} color={c.pen} lineWidth={1.4} dashed dashSize={0.12} gapSize={0.08} transparent opacity={0.6} />}
      {real.length > 1 && <Line points={real} color={c.pole} lineWidth={2.4} />}
      {envelope[0].length > 1 && <Line points={envelope[0]} color={c.ink3} lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />}
      {envelope[1].length > 1 && <Line points={envelope[1]} color={c.ink3} lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />}
      <Line ref={phasor} points={[[0, 0, 0], [0, 1, 0]]} color={c.amber} lineWidth={2.5} />
      <mesh ref={dot}><sphereGeometry args={[0.09, 16, 16]} /><meshStandardMaterial color={c.amber} /></mesh>
      <mesh ref={dotR}><sphereGeometry args={[0.07, 16, 16]} /><meshStandardMaterial color={c.pole} /></mesh>
      <Label position={[3.2, 2.6, 0]} color={c.pole}>Re{'{'}e^st{'}'} = e^σt cos ωt</Label>
    </group>
  )
}

export default function ExpHelix3D() {
  const c = useThemeColors()
  const [s, setS] = useState([{ kind: 'pole', re: -0.3, im: 2.5 }])
  const [conj, setConj] = useState('sim')
  const sigma = s[0].re, omega = s[0].im
  const pb = usePlayback(TMAX, { speed: 0.7 })
  const curve = useMemo(() => sample((t) => Math.exp(sigma * t) * Math.cos(omega * t), 0, TMAX, 500), [sigma, omega])
  return (
    <Sim title="A exponencial complexa eˢᵗ em 3D" sub="arraste o ponto s no plano complexo">
      <div className="sim-body">
        <div>
          <Scene3D camera={[5.5, 3.4, 6.5]} height={400}>
            <Helix sigma={sigma} omega={omega} pb={pb} c={c} showConj={conj === 'sim'} />
          </Scene3D>
          <Transport pb={pb} tEnd={TMAX} />
        </div>
        <div className="sim-controls">
          <SPlane roots={s} onChange={setS} xr={[-2, 1]} yr={[-5, 5]} size={260} />
          <div className="btn-row"><span className="small muted">Mostrar o conjugado <M>{'e^{\\bar s t}'}</M>:</span><Seg label="conjugado" value={conj} onChange={setConj} options={[{ value: 'sim', label: 'sim' }, { value: 'nao', label: 'não' }]} /></div>
          <Plot height={150} xRange={[0, TMAX]} yRange={[-2.2, 2.2]} yLabel="parte real" series={[{ ...curve, color: 'var(--pole)' }]} vLines={[{ x: pb.t, dash: '2 3' }]} />
          <p className="small"><M>{`s = ${texNum(sigma, 2)} ${omega >= 0 ? '+' : '-'} j${texNum(Math.abs(omega), 2)}`}</M></p>
        </div>
      </div>
      <div className="sim-foot">
        <p>A curva azul é <M>{String.raw`e^{st} = e^{\sigma t}\left(\cos\omega t + j\,\sen\omega t\right)`}</M>: uma espiral que gira com frequência <M>{'\\omega'}</M> enquanto o raio varia com <M>{'e^{\\sigma t}'}</M>. Somando a espiral e sua conjugada (tracejada), as partes imaginárias se cancelam e sobra o sinal real <M>{String.raw`2e^{\sigma t}\cos\omega t`}</M> (vermelho). É por isso que um par de polos complexos <M>{'\\alpha \\pm j\\beta'}</M> gera, na resposta, o termo <M>{String.raw`e^{\alpha t}\cos(\beta t + \theta)`}</M>.</p>
        <p>Com <M>{'\\sigma < 0'}</M> a espiral se fecha (modo que decai); com <M>{'\\sigma > 0'}</M> ela se abre (modo instável); com <M>{'\\omega = 0'}</M> não há rotação — é uma exponencial real.</p>
      </div>
    </Sim>
  )
}
