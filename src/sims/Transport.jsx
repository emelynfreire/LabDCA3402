import { fmt } from '../lib/format.js'

/** Barra de reprodução: play/pausa, reiniciar e posição no tempo */
export default function Transport({ pb, tEnd, label = 't' }) {
  return (
    <div className="btn-row" style={{ margin: '.4rem 0' }}>
      <button className="btn small" onClick={() => pb.setPlaying(!pb.playing)}>{pb.playing ? 'Pausar' : 'Reproduzir'}</button>
      <button className="btn small ghost" onClick={pb.restart}>Reiniciar</button>
      <input type="range" min={0} max={tEnd} step={tEnd / 500} value={pb.t} aria-label="posição no tempo"
        onChange={(e) => { pb.setPlaying(false); pb.seek(parseFloat(e.target.value)) }} style={{ flex: 1, minWidth: 120 }} />
      <span className="num small" style={{ minWidth: '4.5rem', textAlign: 'right' }}>{label} = {fmt(pb.t, 2)} s</span>
    </div>
  )
}
