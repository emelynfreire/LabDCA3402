import { lazy, Suspense, Component } from 'react'

const L = (f, name) => lazy(() => f().then((m) => ({ default: name ? m[name] : m.default })))

// Cada simulação é carregada só quando aparece na tela (three.js é pesado).
export const SIMS = {
  poles: { C: L(() => import('./PoleResponse.jsx')), title: 'Polos, zeros e resposta no tempo', desc: 'Arraste polos e zeros no plano s e veja a resposta ao degrau e ao impulso.', topic: 'funcao-transferencia', d3: false },
  classificacao: { C: L(() => import('./ClassificationLab.jsx')), title: 'Classificação de sistemas', desc: 'Teste linearidade, invariância, memória e amostragem.', topic: 'classificacao', d3: false },
  convolucao: { C: L(() => import('./ConvolutionSim.jsx')), title: 'Integral de convolução', desc: 'Rebater, deslocar, multiplicar e integrar — em 2D e como superfície 3D.', topic: 'convolucao', d3: true },
  circuito: { C: L(() => import('./CircuitSim3D.jsx')), title: 'Circuitos RC e RLC em 3D', desc: 'Corrente fluindo, capacitor carregando e campo no indutor.', topic: 'edo', d3: true },
  massamola: { C: L(() => import('./MassSpring3D.jsx')), title: 'Massa–mola–amortecedor em 3D', desc: 'Varie m, b e k e acompanhe os polos.', topic: 'edo', d3: true },
  helice: { C: L(() => import('./ExpHelix3D.jsx')), title: 'A exponencial complexa eˢᵗ', desc: 'A espiral 3D que explica senoides amortecidas.', topic: 'laplace', d3: true },
  superficie: { C: L(() => import('./LaplaceSurface3D.jsx')), title: 'Superfície |G(s)|', desc: 'Polos como picos e zeros como vales sobre o plano s.', topic: 'laplace', d3: true },
  solver: { C: L(() => import('./LaplaceSolver.jsx')), title: 'Resolvedor de EDO por Laplace', desc: 'Transformada, frações parciais e inversa, passo a passo.', topic: 'edo-laplace', d3: false },
  tanque: { C: L(() => import('./TankSim3D.jsx')), title: 'Linearização de um tanque', desc: 'Modelo não linear × linearizado, lado a lado em 3D.', topic: 'linearizacao', d3: true },
  blocos: { C: L(() => import('./BlockDiagramSim.jsx'), 'BlockReduction'), title: 'Simplificação de diagramas de blocos', desc: 'O Exemplo 2 dos slides, etapa por etapa.', topic: 'diagrama-blocos', d3: false },
  realimentacao: { C: L(() => import('./BlockDiagramSim.jsx'), 'FeedbackGain'), title: 'Ganho em malha fechada', desc: 'Polos de K/(s² + 4s + K) conforme K varia.', topic: 'diagrama-blocos', d3: false },
  routh: { C: L(() => import('./RouthSim.jsx'), 'RouthExplorer'), title: 'Tabela de Routh–Hurwitz', desc: 'Monte a tabela de qualquer polinômio, com os casos especiais.', topic: 'estabilidade', d3: false },
  routhK: { C: L(() => import('./RouthSim.jsx'), 'RouthGain'), title: 'Ganhos estabilizantes', desc: 'Estabilidade absoluta e relativa em função de K.', topic: 'estabilidade', d3: false },
  primeira: { C: L(() => import('./RegimeSims.jsx'), 'FirstOrder'), title: 'Sistema de 1ª ordem', desc: 'Constante de tempo, degrau e rampa.', topic: 'regime-transitorio', d3: false },
  segunda: { C: L(() => import('./RegimeSims.jsx'), 'SecondOrder3D'), title: 'Sistema de 2ª ordem em 3D', desc: 'Superfície y(t, ξ), especificações e posição dos polos.', topic: 'regime-transitorio', d3: true },
  zero: { C: L(() => import('./RegimeSims.jsx'), 'ZeroEffect'), title: 'Efeito de um zero', desc: 'Sobressinal e subsinal causados por zeros.', topic: 'regime-transitorio', d3: false },
  dominantes: { C: L(() => import('./RegimeSims.jsx'), 'DominantPoles'), title: 'Polos dominantes', desc: 'Quando dá para aproximar por 2ª ordem.', topic: 'regime-transitorio', d3: false },
  estados: { C: L(() => import('./StateSpace3D.jsx')), title: 'Trajetórias no espaço de estados', desc: 'Plano de fase, autovetores e trajetórias em 3D.', topic: 'espaco-estados', d3: true },
  controlabilidade: { C: L(() => import('./ControllabilitySim.jsx'), 'Controllability'), title: 'Controlabilidade em 3D', desc: 'O subespaço que a entrada consegue alcançar.', topic: 'controlabilidade', d3: true },
  observabilidade: { C: L(() => import('./ControllabilitySim.jsx'), 'Observability'), title: 'Observabilidade', desc: 'Estados diferentes com a mesma saída.', topic: 'controlabilidade', d3: false },
  torcao: { C: L(() => import('./RotationalSims.jsx'), 'TorsionSim'), title: 'Sistema rotacional em 3D', desc: 'Inércia, mola torcional e atrito viscoso.', topic: 'mecanicos-rotacao', d3: true },
  motor: { C: L(() => import('./RotationalSims.jsx'), 'DCMotorSim'), title: 'Motor CC em 3D', desc: 'Acoplamento eletromecânico: corrente, torque e velocidade.', topic: 'eletromecanicos', d3: true },
}

class Boundary extends Component {
  constructor(p) { super(p); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  render() {
    if (this.state.err) return <div className="warn"><span className="tag">A simulação não pôde ser exibida</span>Seu navegador pode não ter WebGL ativado. Tente outro navegador ou atualize a página. ({String(this.state.err.message || this.state.err)})</div>
    return this.props.children
  }
}

export function SimSlot({ name, ...props }) {
  const S = SIMS[name]
  if (!S) return null
  const C = S.C
  return (
    <Boundary>
      <Suspense fallback={<div className="sim breakout"><div className="loading">Carregando simulação: {S.title}…</div></div>}>
        <C {...props} />
      </Suspense>
    </Boundary>
  )
}
