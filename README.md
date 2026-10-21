# LabDCA3402 · Plataforma de estudos de Modelagem e Análise Linear de Sistemas

Plataforma de estudos para a disciplina **DCA3402 – Modelagem e Análise Linear de Sistemas** (turma T02, 2026.2) do Departamento de Engenharia de Computação e Automação da UFRN, com base no material do Prof. Anderson Luiz de Oliveira Cavalcanti.

**Iniciativa de [Emelyn Clementino Freire](https://github.com/emelynfreire).**

- Site: https://emelynfreire.github.io/LabDCA3402/
- Repositório (para contribuir): https://github.com/emelynfreire/LabDCA3402

## Motivação

A plataforma foi criada para contribuir para reduzir os índices de reprovação da disciplina e para que o aluno participe ativamente do próprio aprendizado: em vez de só ler, ele manipula simulações (inclusive em 3D, para ver o que acontece nos circuitos, nos estados e nas transformações), resolve as listas com apoio passo a passo e se testa nos quizzes. O material fica aberto no GitHub Pages para que qualquer estudante possa usar.

## O que tem

- **19 tópicos** organizados pelas 3 unidades e pelo cronograma do SIGAA, com teoria resumida dos slides.
- **28 simulações interativas**, várias em 3D (Three.js):
  circuito RC/RLC com corrente fluindo, massa–mola–amortecedor, convolução como superfície 3D, a exponencial complexa e^{st} como espiral, superfície |G(s)| sobre o plano s, resposta de 2ª ordem y(t, ξ) em 3D, trajetórias no espaço de estados, subespaço controlável, tanque não linear × linearizado, sistema torcional e motor CC.
- Ferramentas: plano s com polos e zeros arrastáveis, **resolvedor de EDO por Laplace passo a passo**, tabela de **Routh–Hurwitz** com os casos especiais (ε e linha nula), simplificação de diagrama de blocos etapa por etapa.
- **Listas 1 e 2 resolvidas** com solução revelada um passo por vez (respostas conferidas por cálculo simbólico).
- **Slides e listas do professor em PDF** (disponibilizados com autorização dele), com cada seção citando a página correspondente — o link “slides, p. N” abre o PDF na página certa.
- **Quiz por unidade**: ao errar, aparece a resposta correta com a explicação; no fim, a revisão das questões erradas e os tópicos a estudar.
- **Revisão de pré-requisitos** (16 cartões de Álgebra, Cálculo, números complexos e Álgebra Linear), com exemplos tirados das aulas e listas, passo a passo e teste rápido. Cada exercício tem botões "Revisar o básico" que abrem a revisão certa ali mesmo, e cada tópico mostra seus pré-requisitos no topo.
- **7 fluxogramas interativos** dos métodos (resolver EDO, frações parciais, Routh, classificar sistemas, especificações de 2ª ordem, espaço de estados, diagramas de blocos), com modo guiado, explicação de cada etapa, página do slide e revisão.
- Simulações de fundamentos: decomposição da resposta nos modos de cada polo (com camadas 3D), Routh célula por célula, plano complexo com resíduo calculado pela geometria dos polos, raízes de s² + bs + c ligadas ao amortecimento, reta e plano tangente (Taylor/linearização) e matriz como transformação em 2D e 3D (determinante, posto, autovetores).
- Formulário, progresso salvo no navegador, tema claro/escuro, layout para celular.

A Unidade 3 está marcada como **prévia**: o professor ainda vai disponibilizar o material, e até lá o texto segue a bibliografia da disciplina.

## Rodar no computador

Requer [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

Para gerar a versão final: `npm run build` (o resultado fica em `dist/`).

## Como contribuir

Contribuições são bem-vindas! Você pode ajudar a melhorar o projeto reportando problemas, sugerindo funcionalidades ou implementando melhorias.

- **Encontrou um erro?** Abra uma [issue](https://github.com/emelynfreire/LabDCA3402/issues) dizendo a página, o que está errado e, se possível, a página do slide ou da lista.
- **Tem uma ideia** de simulação, exercício ou revisão? Abra uma issue descrevendo a ideia.
- **Quer mexer no código?** Faça um *fork*, crie as alterações (veja "Como adicionar conteúdo") e envie um *pull request*.

### Regras para contribuir

1. **Explore o projeto:** consulte o código e a documentação antes de propor alterações.
2. **Identifique uma tarefa:** verifique as *Issues* existentes ou abra uma nova para discutir sua ideia antes de começar.
3. **Crie uma branch:** não faça alterações diretamente na branch `main`. Utilize uma branch com um nome descritivo.

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/nova-funcionalidade
   ```

4. **Siga o padrão do projeto:** mantenha a organização dos arquivos, o estilo do código e a compatibilidade com as funcionalidades existentes.
5. **Teste suas alterações:** verifique se o projeto continua funcionando corretamente antes de enviar sua contribuição.
6. **Faça commits descritivos:** utilize mensagens claras que indiquem o que foi alterado.

   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   ```

7. **Envie sua branch para o GitHub:**

   ```bash
   git push origin feature/nova-funcionalidade
   ```

8. **Abra um Pull Request (PR):** descreva as alterações realizadas, sua finalidade e, se necessário, inclua capturas de tela. Aguarde a revisão antes de integrar as mudanças à branch `main`.

### Diretrizes gerais

- Mantenha o código legível, organizado e documentado quando necessário.
- Evite alterações que não estejam relacionadas à proposta do Pull Request.
- Não envie senhas, tokens, chaves de API ou outros dados sensíveis.
- Respeite os direitos autorais e as licenças dos materiais utilizados.
- Seja respeitoso e colaborativo nas discussões e revisões.

Todas as contribuições estarão sujeitas à revisão e poderão ser solicitadas alterações antes da aprovação.


O projeto usa `base: './'` e rotas com `#`, então funciona com qualquer nome de repositório.

> **Material do professor:** os PDFs publicados ficam em `public/material/` (com nomes curtos, usados nos links de página). 

## Estrutura

```
src/
  content/        conteúdo: course.js (cronograma, PDFs de cada aula, autoria e links), topics/*.jsx,
                  lista1/2.jsx, quiz1/2/3.jsx, flows.jsx (fluxogramas), review/ (revisão de pré-requisitos)
  sims/           simulações (registry.jsx lista todas; carregadas sob demanda)
  components/     Plot (gráficos SVG), SPlane, Exercise, Quiz, Tex (KaTeX), Scene3D
  lib/            numérico: polinômios, raízes, frações parciais, Routh, espaço de estados;
                  cite.js gera as referências ABNT/APA/BibTeX
  pages/          páginas
public/material/  slides e listas do professor (PDF)
CITATION.cff      dados de citação lidos pelo GitHub
```

### Como adicionar conteúdo

- **Novo tópico:** acrescente uma entrada em `src/content/course.js` e crie `src/content/topics/<id>.jsx`.
- **Nova questão de lista:** use o componente `<Exercise>` com `steps` (passos) e `answer`.
- **Nova questão de quiz:** acrescente um objeto `{ q, options, correct, explain, topic }` no arquivo do quiz.
- **Simulação dentro de um tópico:** `<SimSlot name="..." />` com um nome de `src/sims/registry.jsx`.
- **Botões de revisão num exercício:** `<Exercise ... review={['complexos', 'fracoes']}>` (chaves em `src/content/review/index.js`).
- **Novo cartão de revisão:** exporte um componente em `src/content/review/*.jsx` e registre-o em `REVIEW`.
- **Novo fluxograma:** acrescente um objeto em `src/content/flows.jsx` (nós com posição `x`, `y` na grade e arestas `from`/`to`).
- **Citar uma página dos slides:** `<Slide p={12} />` (PDF da aula atual) ou `<Slide file="lista-1.pdf" p={3} />`. Quando chegarem os slides da Unidade 3, copie os PDFs para `public/material/` e preencha `pdf` e `pages` no tópico em `course.js`.

Fórmulas usam KaTeX: `<M>{String.raw\`G(s)=\frac{1}{s+1}\`}</M>` (inline) e `<MM>…</MM>` (destaque).

## Como citar

Se usar a plataforma ou uma simulação num relatório, trabalho, TCC, artigo ou apresentação, cite-a. A página **Como citar e contribuir** (`#/citar`) gera a referência em ABNT, APA e BibTeX, também para cada simulação, e explica quando citar a plataforma e quando citar a fonte original (slides do professor ou livro). No Laboratório, cada simulação aberta tem a referência pronta para copiar. O arquivo `CITATION.cff` faz o GitHub mostrar o botão **Cite this repository**.

ABNT:

> FREIRE, Emelyn Clementino. **LabDCA3402**: plataforma de estudos de Modelagem e Análise Linear de Sistemas. Natal, 2026. Disponível em: https://emelynfreire.github.io/LabDCA3402/. Acesso em: [dia mês ano].

APA:

> Freire, E. C. (2026). *LabDCA3402: Plataforma de estudos de Modelagem e Análise Linear de Sistemas* [Aplicação web]. https://emelynfreire.github.io/LabDCA3402/

Fontes usadas na construção: slides e listas do Prof. Anderson Luiz de Oliveira Cavalcanti (publicados com autorização), a bibliografia da disciplina (abaixo) e as bibliotecas livres React, React Router, Three.js, React Three Fiber/Drei, KaTeX e Vite (licença MIT), além das fontes Archivo e Source Serif 4 (SIL Open Font License).

Ferramenta de apoio: assistente de IA (Claude, Anthropic), usado como ferramenta de apoio à programação, sob concepção e direção da autora. O conteúdo está em revisão pelos autores.

## Licença

Código e textos da plataforma: [MIT](LICENSE), © 2026 Emelyn Clementino Freire. Podem ser usados, modificados e redistribuídos, desde que o aviso de copyright e o texto da licença sejam mantidos.

Os slides e as listas do Prof. Anderson Luiz de Oliveira Cavalcanti, em `public/material/`, **não** estão incluídos na licença. Eles foram publicados aqui com a autorização dele.

## Aviso

Material de apoio independente, não oficial. Não substitui as aulas nem as orientações do professor; em caso de divergência, vale o que foi apresentado em sala.

## Referências

- B. P. Lathi. *Linear Systems and Signals*. 2ª ed. Oxford University Press, 2005.
- A. A. D. Medeiros. *Apostila de Modelagem e Análise de Sistemas Dinâmicos*. UFRN, 2003.
- M. C. M. M. Campos e H. Teixeira. *Controles típicos de equipamentos e processos industriais*. Blucher, 2015.
