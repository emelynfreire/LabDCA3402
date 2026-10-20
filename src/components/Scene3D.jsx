import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import { useThemeColors } from './useTheme.js'

/** Canvas 3D padrão da plataforma (câmera orbital, luzes, cor de fundo do tema). */
export default function Scene3D({ children, camera = [6, 5, 7], target = [0, 0, 0], height, hint = 'arraste para girar · role para aproximar', fov = 45, controls = true }) {
  const c = useThemeColors()
  return (
    <div className="canvas3d" style={height ? { height } : undefined}>
      <Canvas camera={{ position: camera, fov }} dpr={[1, 2]} gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <color attach="background" args={[c.paper]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 10, 6]} intensity={0.9} />
        <directionalLight position={[-6, 4, -4]} intensity={0.35} />
        {children}
        {controls && <OrbitControls target={target} makeDefault enableDamping dampingFactor={0.12} />}
      </Canvas>
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}

/** Eixo com seta e rótulo */
export function Axis({ from = [0, 0, 0], to, color, label, labelOffset = [0.25, 0.15, 0] }) {
  return (
    <group>
      <Line points={[from, to]} color={color} lineWidth={1.6} />
      {label && (
        <Html position={[to[0] + labelOffset[0], to[1] + labelOffset[1], to[2] + labelOffset[2]]} center style={{ pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color, whiteSpace: 'nowrap', fontWeight: 600 }}>{label}</span>
        </Html>
      )}
    </group>
  )
}

export function Label({ position, children, color, size = 12 }) {
  return (
    <Html position={position} center style={{ pointerEvents: 'none' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: size, color, whiteSpace: 'nowrap', fontWeight: 600 }}>{children}</span>
    </Html>
  )
}
