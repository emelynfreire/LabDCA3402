import { useEffect, useState } from 'react'

const VARS = ['paper', 'paper-2', 'panel', 'grid', 'grid-strong', 'ink', 'ink-2', 'ink-3', 'pen', 'pen-2', 'pole', 'amber', 'good']

function read() {
  const cs = getComputedStyle(document.documentElement)
  const o = {}
  VARS.forEach((v) => { o[v.replace('-', '')] = cs.getPropertyValue('--' + v).trim() || '#888' })
  return o
}

/** Cores do tema atual (para Three.js, que não lê variáveis CSS). */
export function useThemeColors() {
  const [c, setC] = useState(read)
  useEffect(() => {
    const update = () => setC(read())
    const mo = new MutationObserver(update)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener?.('change', update)
    return () => { mo.disconnect(); mq.removeEventListener?.('change', update) }
  }, [])
  return c
}

export function setTheme(t) {
  if (t) document.documentElement.setAttribute('data-theme', t)
  else document.documentElement.removeAttribute('data-theme')
  try { window.localStorage.setItem('dca3402-tema', t || '') } catch (e) { /* ignora */ }
}

export function initTheme() {
  try {
    const t = window.localStorage.getItem('dca3402-tema')
    if (t) document.documentElement.setAttribute('data-theme', t)
  } catch (e) { /* ignora */ }
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
