import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Layout from './components/Layout.jsx'
import { ProgressProvider } from './components/progress.jsx'
import Home from './pages/Home.jsx'

const TopicPage = lazy(() => import('./pages/TopicPage.jsx'))
const UnitPage = lazy(() => import('./pages/UnitPage.jsx'))
const ListaPage = lazy(() => import('./pages/ListaPage.jsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'))
const LabPage = lazy(() => import('./pages/LabPage.jsx'))
const Formulario = lazy(() => import('./pages/Formulario.jsx'))
const Sobre = lazy(() => import('./pages/Sobre.jsx'))
const RevisaoPage = lazy(() => import('./pages/RevisaoPage.jsx'))
const FluxosPage = lazy(() => import('./pages/FluxosPage.jsx'))
const CitarPage = lazy(() => import('./pages/CitarPage.jsx'))

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ProgressProvider>
        <ScrollTop />
        <Layout>
          <Suspense fallback={<div className="loading">Carregando…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/unidade/:id" element={<UnitPage />} />
              <Route path="/topico/:id" element={<TopicPage />} />
              <Route path="/lista/:n" element={<ListaPage />} />
              <Route path="/quiz/:u" element={<QuizPage />} />
              <Route path="/laboratorio" element={<LabPage />} />
              <Route path="/formulario" element={<Formulario />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/revisao" element={<RevisaoPage />} />
              <Route path="/revisao/:k" element={<RevisaoPage />} />
              <Route path="/fluxos" element={<FluxosPage />} />
              <Route path="/fluxos/:id" element={<FluxosPage />} />
              <Route path="/citar" element={<CitarPage />} />
              <Route path="*" element={<div className="page"><h1>Página não encontrada</h1><p>Use o menu lateral para escolher um tópico.</p></div>} />
            </Routes>
          </Suspense>
        </Layout>
      </ProgressProvider>
    </HashRouter>
  )
}
