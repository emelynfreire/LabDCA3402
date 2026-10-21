import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../components/useTheme.js'

/**
 * Relógio de reprodução para animações: tRef é atualizado a cada quadro (para Three.js),
 * t (estado React) é atualizado ~20 vezes por segundo (para gráficos).
 */
export function usePlayback(tEnd, { speed = 1, loop = true, autoplay = true } = {}) {
  const tRef = useRef(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(autoplay && !prefersReducedMotion())
  const last = useRef(null)
  const lastUi = useRef(0)
  const speedRef = useRef(speed)
  speedRef.current = speed

  useEffect(() => {
    if (!playing) { last.current = null; return }
    let raf
    const tick = (now) => {
      if (last.current !== null) {
        const dt = Math.min(0.05, (now - last.current) / 1000) * speedRef.current
        let nt = tRef.current + dt
        if (nt > tEnd) {
          if (loop) nt = 0
          else { nt = tEnd; setPlaying(false); setT(tEnd) }
        }
        tRef.current = nt
        if (now - lastUi.current > 50) { lastUi.current = now; setT(nt) }
      }
      last.current = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, tEnd, loop])

  const seek = useCallback((v) => { tRef.current = v; setT(v) }, [])
  const restart = useCallback(() => { tRef.current = 0; setT(0); setPlaying(true) }, [])
  return { t, tRef, playing, setPlaying, seek, restart }
}

// interpola amostras uniformes (t[0] = 0, passo constante)
export function at(series, tArr, t) {
  if (!tArr.length) return 0
  const dt = tArr[1] - tArr[0] || 1
  const f = Math.max(0, Math.min(tArr.length - 1, t / dt))
  const i = Math.floor(f)
  const j = Math.min(tArr.length - 1, i + 1)
  const w = f - i
  return series[i] * (1 - w) + series[j] * w
}
