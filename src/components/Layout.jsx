import { NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { course, units, topicsOf, brDate } from '../content/course.js'
import { useProgress } from './progress.jsx'
import { setTheme } from './useTheme.js'
import { Seg } from './Controls.jsx'

function ThemeSwitch() {
  const [t, setT] = useState(() => document.documentElement.getAttribute('data-theme') || '')
  return (
    <div className="theme-toggle">
      <Seg label="Tema" value={t} onChange={(v) => { setT(v); setTheme(v) }}
        options={[{ value: '', label: 'Auto' }, { value: 'light', label: 'Claro' }, { value: 'dark', label: 'Escuro' }]} />
    </div>
  )
}

function Nav({ onNavigate }) {
  const { done } = useProgress()
  return (
    <nav aria-label="Conteúdo da disciplina" onClick={onNavigate}>
      <Link to="/" className="brand">
        <span className="brand-code">{course.code}</span>
        <span className="brand-name">{course.name}<br />{course.turma}</span>
      </Link>
      {units.map((u) => (
        <div key={u.id}>
          <div className="nav-unit">
            <NavLink to={`/unidade/${u.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{u.title}</NavLink>
            {u.exam ? <span className="when">prova {brDate(u.exam.date)}</span> : u.preview ? <span className="when">prévia</span> : null}
          </div>
          <ul className="nav-list">
            {topicsOf(u.id).map((t) => (
              <li key={t.id}>
                <NavLink to={`/topico/${t.id}`}>
                  <span className="idx">{t.n}</span>
                  <span>{t.title}</span>
                  {done[t.id] ? <span className="done" aria-label="estudado">✓</span> : <span />}
                </NavLink>
              </li>
            ))}
            {u.lista && (
              <li><NavLink to={`/lista/${u.lista}`}><span className="idx">L{u.lista}</span><span>Lista {u.lista} resolvida</span><span /></NavLink></li>
            )}
            <li><NavLink to={`/quiz/${u.id}`}><span className="idx">Q</span><span>Quiz da {u.title.toLowerCase()}</span><span /></NavLink></li>
          </ul>
        </div>
      ))}
      <ul className="nav-list nav-extra">
        <li><NavLink to="/laboratorio"><span className="idx">◎</span><span>Laboratório de simulações</span><span /></NavLink></li>
        <li><NavLink to="/formulario"><span className="idx">∑</span><span>Formulário e tabelas</span><span /></NavLink></li>
        <li><NavLink to="/sobre"><span className="idx">i</span><span>Sobre a plataforma</span><span /></NavLink></li>
      </ul>
    </nav>
  )
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" style={{ textDecoration: 'none' }}><span className="brand-code">{course.code}</span></Link>
        <button className="btn small" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? 'Fechar' : 'Conteúdo'}</button>
      </header>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={'sidebar' + (open ? ' open' : '')}>
        <Nav />
        <ThemeSwitch />
        <p className="sidebar-credit">Uma iniciativa de <a href="https://github.com/emelynfreire">{course.autora}</a></p>
      </aside>
      <main className="main" id="conteudo">{children}</main>
    </div>
  )
}
