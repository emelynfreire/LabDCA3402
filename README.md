# DCA3402 – Modelagem e Análise Linear de Sistemas · Plataforma de estudos

Plataforma de estudos para a disciplina **DCA3402 – Modelagem e Análise Linear de Sistemas** (turma T02, 2026.2) do Departamento de Engenharia de Computação e Automação da UFRN, com base no material do Prof. Anderson Luiz de Oliveira Cavalcanti.

**Iniciativa de Emelyn Clementino Freire.**

## Motivação

A plataforma foi criada para contribuir para reduzir os índices de reprovação da disciplina e para que o aluno participe ativamente do próprio aprendizado: em vez de só ler, ele manipula simulações (inclusive em 3D, para ver o que acontece nos circuitos, nos estados e nas transformações), resolve as listas com apoio passo a passo e se testa nos quizzes. O material fica aberto no GitHub Pages para que qualquer estudante possa usar.

## O que tem

- **19 tópicos** organizados pelas 3 unidades e pelo cronograma do SIGAA, com teoria resumida dos slides.
- **22 simulações interativas**, várias em 3D (Three.js):
  circuito RC/RLC com corrente fluindo, massa–mola–amortecedor, convolução como superfície 3D, a exponencial complexa e^{st} como espiral, superfície |G(s)| sobre o plano s, resposta de 2ª ordem y(t, ξ) em 3D, trajetórias no espaço de estados, subespaço controlável, tanque não linear × linearizado, sistema torcional e motor CC.
- Ferramentas: plano s com polos e zeros arrastáveis, **resolvedor de EDO por Laplace passo a passo**, tabela de **Routh–Hurwitz** com os casos especiais (ε e linha nula), simplificação de diagrama de blocos etapa por etapa.
- **Listas 1 e 2 resolvidas** com solução revelada um passo por vez (respostas conferidas por cálculo simbólico).
- **Slides e listas do professor em PDF** (disponibilizados com autorização dele), com cada seção citando a página correspondente — o link “slides, p. N” abre o PDF na página certa.
- **Quiz por unidade**: ao errar, aparece a resposta correta com a explicação; no fim, a revisão das questões erradas e os tópicos a estudar.
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

Contribuições são bem-vindas! Para propor uma alteração:

1. Faça um fork do repositório e clone-o localmente:
   ```bash
   git clone https://github.com/emelynfreire/LabDCA3402.git
   cd LabDCA3402
   ```
2. Crie uma branch para sua alteração:
   ```bash
   git checkout -b minha-alteracao
   ```
3. Instale as dependências e execute a plataforma localmente:
   ```bash
   npm install
   npm run dev
   ```
   Ou execute com Docker:
   ```bash
   docker compose up --build
   ```
4. Faça as alterações, valide a compilação e confira o resultado:
   ```bash
   npm run build
   ```
5. Registre e envie suas alterações:
   ```bash
   git add .
   git commit -m "Descreva a alteração"
   git push origin minha-alteracao
   ```
6. Abra um **Pull Request** para a branch `main`, descrevendo o que foi alterado e como a mudança foi validada.

Ao contribuir com novos tópicos, exercícios ou simulações, siga também as orientações da seção [Como adicionar conteúdo](#como-adicionar-conteudo).

> **Material do professor:** os PDFs publicados ficam em `public/material/` (com nomes curtos, usados nos links de página). A pasta `Material/` original continua no `.gitignore` só para não duplicar os arquivos no repositório; o arquivo `unidades atuais.pdf` (página do SIGAA com o link do grupo de WhatsApp) não é publicado.

## Estrutura

```
src/
  content/        conteúdo: course.js (cronograma e PDFs de cada aula), topics/*.jsx, lista1/2.jsx, quiz1/2/3.jsx
public/material/  slides e listas do professor (PDF)
  sims/           simulações (registry.jsx lista todas; carregadas sob demanda)
  components/     Plot (gráficos SVG), SPlane, Exercise, Quiz, Tex (KaTeX), Scene3D
  lib/            numérico: polinômios, raízes, frações parciais, Routh, espaço de estados
  pages/          páginas
```

### Como adicionar conteúdo

- **Novo tópico:** acrescente uma entrada em `src/content/course.js` e crie `src/content/topics/<id>.jsx`.
- **Nova questão de lista:** use o componente `<Exercise>` com `steps` (passos) e `answer`.
- **Nova questão de quiz:** acrescente um objeto `{ q, options, correct, explain, topic }` no arquivo do quiz.
- **Simulação dentro de um tópico:** `<SimSlot name="..." />` com um nome de `src/sims/registry.jsx`.
- **Citar uma página dos slides:** `<Slide p={12} />` (PDF da aula atual) ou `<Slide file="lista-1.pdf" p={3} />`. Quando chegarem os slides da Unidade 3, copie os PDFs para `public/material/` e preencha `pdf` e `pages` no tópico em `course.js`.

Fórmulas usam KaTeX: `<M>{String.raw\`G(s)=\frac{1}{s+1}\`}</M>` (inline) e `<MM>…</MM>` (destaque).

## Aviso

Material de apoio independente, não oficial. Não substitui as aulas nem as orientações do professor; em caso de divergência, vale o que foi apresentado em sala. Encontrou um erro? Abra uma *issue*.

## Referências

- B. P. Lathi. *Linear Systems and Signals*. 2ª ed. Oxford University Press, 2005.
- A. A. D. Medeiros. *Apostila de Modelagem e Análise de Sistemas Dinâmicos*. UFRN, 2003.
- M. C. M. M. Campos e H. Teixeira. *Controles típicos de equipamentos e processos industriais*. Blucher, 2015.
