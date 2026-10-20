import Slide from '../../components/SlideRef.jsx'
import { M, MM } from '../../components/Tex.jsx'
import { Callout } from '../../components/Controls.jsx'
import { SimSlot } from '../../sims/registry.jsx'

export default function EdoLaplace() {
  return (
    <>
      <p>A transformada unilateral converte derivadas em potências de <M>s</M> e embute as condições iniciais. A EDO vira uma equação algébrica em <M>s</M>.<Slide p={[3, 5]} /></p>
      <Callout tag="Método">
        <ol style={{ margin: 0 }}>
          <li>Aplicar Laplace aos dois lados da EDO usando a propriedade da derivada (as condições iniciais entram aqui).</li>
          <li>Substituir <M>{'U(s)=\\mathcal L\\{u(t)\\}'}</M> e as condições iniciais.</li>
          <li>Isolar <M>{'Y(s)=N(s)/D(s)'}</M>.</li>
          <li>Expandir <M>Y(s)</M> em frações parciais.</li>
          <li>Inverter termo a termo.</li>
        </ol>
        O resultado já é a resposta completa (natural + forçada), porque as condições iniciais foram embutidas na transformação.
      </Callout>

      <h2>Exemplo 1 – raízes reais distintas<Slide p={[6, 7]} /></h2>
      <p><M>{'\\ddot y+5\\dot y+6y=12u,\\ u=2,\\ y(0)=1,\\ \\dot y(0)=-1'}</M>. Com <M>{'U(s)=2/s'}</M>:</p>
      <MM>{String.raw`s^2Y-s\,y(0)-\dot y(0)+5\left[sY-y(0)\right]+6Y=12U\ \Rightarrow\ (s^2+5s+6)Y=s+4+\frac{24}{s}`}</MM>
      <MM>{String.raw`Y(s)=\frac{s^2+4s+24}{s(s+2)(s+3)}=\frac{4}{s}-\frac{10}{s+2}+\frac{7}{s+3}\ \Rightarrow\ y(t)=4-10e^{-2t}+7e^{-3t}`}</MM>
      <p>É o mesmo resultado do método clássico, agora sem precisar montar <M>{'y_h'}</M> e <M>{'y_p'}</M> separadamente.</p>

      <h2>Exemplo 2 – raízes múltiplas e derivada da entrada<Slide p={[8, 10]} /></h2>
      <p><M>{'\\ddot y+4\\dot y+4y=2\\dot u+8u,\\ u=e^{3t},\\ y(0)=-1,\\ \\dot y(0)=1'}</M>. Aqui o lado direito também é transformado com a propriedade da derivada, usando <M>{'U(s)=\\frac{1}{s-3}'}</M> e <M>{'u(0)=1'}</M>:</p>
      <MM>{String.raw`(s^2+4s+4)Y=(s+4)y(0)+\dot y(0)-2u(0)+(2s+8)U=-s-5+\frac{2s+8}{s-3}`}</MM>
      <MM>{String.raw`Y(s)=\frac{-s^2+23}{(s-3)(s+2)^2}=\frac{0{,}56}{s-3}-\frac{3{,}8}{(s+2)^2}-\frac{1{,}56}{s+2}`}</MM>
      <MM>{String.raw`y(t)=0{,}56e^{3t}-3{,}8te^{-2t}-1{,}56e^{-2t}`}</MM>
      <p>O polo em <M>{'s=3'}</M> (semiplano direito) vem da entrada <M>{'e^{3t}'}</M>, que diverge; os polos em −2 dão a parte que decai.</p>

      <h2>Exemplo 3 – raízes complexas<Slide p={[11, 13]} /></h2>
      <p><M>{'\\ddot y+2\\dot y+2y=2u,\\ u=1,\\ y(0)=\\dot y(0)=0'}</M>: <M>{String.raw`Y(s)=\frac{2}{s(s^2+2s+2)}`}</M>, com polos <M>0</M> e <M>{'-1\\pm j'}</M>.</p>
      <MM>{String.raw`C_1=1,\qquad C_2=\frac{2}{s(s+1+j)}\Big|_{s=-1+j}=\frac{2}{-2-2j}=-0{,}5+j0{,}5,\qquad |C_2|=\tfrac{\sqrt2}{2},\ \angle C_2=\tfrac{3\pi}{4}`}</MM>
      <MM>{String.raw`y(t)=1+\sqrt2\,e^{-t}\cos\!\left(t+\tfrac{3\pi}{4}\right)=1-e^{-t}\left(\cos t+\sen t\right)`}</MM>
      <p>Regime permanente <M>{'y(\\infty)=1'}</M> (ganho DC = 2/2).</p>

      <SimSlot name="solver" />

      <h2>Resumo<Slide p={14} /></h2>
      <ul>
        <li>Os polos de <M>Y(s)</M> determinam a forma de <M>y(t)</M>: reais → exponenciais; múltiplos → termos <M>{'t^ke^{pt}'}</M>; complexos → senoides amortecidas.</li>
        <li>Polos no semiplano esquerdo geram modos que decaem; no semiplano direito, modos que divergem.</li>
      </ul>
    </>
  )
}
