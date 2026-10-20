import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Progresso do aluno guardado só no navegador dele (localStorage).
const KEY = 'dca3402-progresso-v1'
const Ctx = createContext(null)

function load() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* armazenamento indisponível */ }
  return { done: {}, quiz: {}, exercises: {} }
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(load)
  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) { /* ignora */ }
  }, [state])

  const toggleDone = useCallback((id) => setState((s) => ({ ...s, done: { ...s.done, [id]: !s.done[id] } })), [])
  const saveQuiz = useCallback((unit, score, total) => setState((s) => {
    const prev = s.quiz[unit]
    const best = !prev || score / total > prev.best / prev.total ? { best: score, total } : prev
    return { ...s, quiz: { ...s.quiz, [unit]: { ...best, last: score, lastTotal: total, attempts: (prev?.attempts || 0) + 1 } } }
  }), [])
  const markExercise = useCallback((id, value) => setState((s) => ({ ...s, exercises: { ...s.exercises, [id]: value } })), [])
  const reset = useCallback(() => setState({ done: {}, quiz: {}, exercises: {} }), [])

  return <Ctx.Provider value={{ ...state, toggleDone, saveQuiz, markExercise, reset }}>{children}</Ctx.Provider>
}

export const useProgress = () => useContext(Ctx)
