# Questionário de Avaliação de Risco de Abandono Escolar

![Banner](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📋 Sobre o Projeto

Sistema web interativo estilo **Duolingo** para avaliar a probabilidade de abandono escolar de alunos do **Encceja** em Pernambuco/Recife. O questionário analisa 20 fatores de risco e calcula uma probabilidade percentual baseada em dados reais coletados.

### Objetivo

Identificar estudantes em situação de risco de abandono escolar para possibilitar intervenções pedagógicas e sociais tempestivas, garantindo que nenhum aluno precise desistir dos estudos.

---

## ✨ Funcionalidades

- **Interface amigável e acolhedora** - Texto introdutório que deixa o aluno à vontade
- **Questionário interativo** - Uma pergunta por vez, estilo Duolingo
- **Cálculo inteligente de risco** - Pesos baseados em dados reais de Pernambuco/Recife
- **Feedback visual imediato** - Animações suaves ao responder
- **Resultado detalhado** - Probabilidade, nível de risco e recomendações
- **Design responsivo** - Funciona em celulares, tablets e desktops

---

## 🎯 Como Funciona

### Sistema de Pesos

O cálculo da probabilidade de abandono utiliza um sistema de pesos duplo:

#### 1. Perguntas de Múltipla Escolha (Série e Idade)
O peso de cada alternativa é proporcional à quantidade de respostas:
```
peso = quantidade_respostas / quantidade_máxima
```

**Exemplo - Série:**
| Série | Respostas | Peso |
|-------|-----------|------|
| 1º Ano | 1962 | 1.00 |
| 8ª Série | 1430 | 0.73 |
| 7ª Série | 552 | 0.28 |

#### 2. Perguntas Sim/Não
O peso é baseado na proporção de respostas "Sim" (indicador de risco):
```
peso_pergunta = respostas_sim / total_respostas
```

**Exemplo:**
| Pergunta | Sim | Não | Peso da Pergunta |
|----------|-----|-----|------------------|
| Trabalha ou precisará trabalhar | 5.462 | 1.896 | 0.742 (alto) |
| Desestímulo de alguém | 267 | 7.088 | 0.036 (baixo) |

### Níveis de Risco

| Probabilidade | Nível | Cor |
|---------------|-------|-----|
| 0% - 24% | Baixo | 🟢 Verde |
| 25% - 49% | Moderado | 🟡 Amarelo |
| 50% - 74% | Alto | 🟠 Laranja |
| 75% - 100% | Muito Alto | 🔴 Vermelho |

---

## 📊 Estrutura do Questionário

O questionário possui **20 perguntas** divididas em categorias:

### Dados Demográficos
1. Em qual série você está?
2. Quantos anos você tem?

### Ambiente Familiar
3. Você se sente seguro(a) e bem tratado(a) no seu ambiente familiar?
4. Você consegue reservar um tempo tranquilo para estudar fora da escola?

### Responsabilidades
5. Você tem filhos ou filhas?
6. Você precisa dedicar muito tempo ajudando nas tarefas ou cuidados da casa?
7. Você trabalha atualmente ou sente que precisará trabalhar em breve?

### Barreiras Externas
8. Existe algo ou alguém que te impeça ou desestimule de continuar estudando?
9. Sua família costuma mudar de casa com muita frequência?

### Ambiente Escolar
10. Você sente que faltam professores com frequência na sua escola?
11. Como é sua relação com os professores?
12. Você se sente acolhido(a) e respeitado(a) pelos seus colegas?

### Discriminação e Preconceito
13. Você já se sentiu desrespeitado(a) por causa do seu gênero ou orientação sexual?
14. Você já se sentiu discriminado(a) por causa da sua cor ou raça?
15. Você já sentiu preconceito por causa da sua condição financeira?

### Infraestrutura
16. Você se sente seguro(a) dentro da escola?
17. A distância entre sua casa e o colégio dificulta sua ida às aulas?

### Engajamento Escolar
18. Você acha as aulas interessantes e motivadoras?
19. Você teve dificuldade para conseguir vaga em uma escola pública?
20. Você sente que o que aprende tem utilidade para sua vida?

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Estilização utilitária
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI acessíveis

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css          # Estilos globais e animações
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal com o questionário
├── components/
│   └── ui/                  # Componentes shadcn/ui
└── lib/
    ├── questionnaire-data.ts # Dados, pesos e lógica do questionário
    └── utils.ts             # Utilitários
```

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm, yarn ou bun

### Passos

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd questionario-abandono-escolar

# Instale as dependências
npm install
# ou
bun install

# Execute o servidor de desenvolvimento
npm run dev
# ou
bun run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📈 Dados Estatísticos

Baseado em **7.366** respostas coletadas em Pernambuco/Recife:

### Principais Fatores de Risco Identificados

| Fator | % em Risco | Impacto |
|-------|------------|---------|
| Não se sente seguro no ambiente familiar | 93.5% | ⚠️ Alto |
| Não se sente acolhido pelos colegas | 90.0% | ⚠️ Alto |
| Não tem boa relação com professores | 90.5% | ⚠️ Alto |
| Não se sente seguro na escola | 88.3% | ⚠️ Alto |
| Aulas não são interessantes | 82.4% | ⚠️ Alto |
| Trabalha ou precisará trabalhar | 74.2% | ⚠️ Alto |

### Perfil do Aluno em Risco

Com base nos dados, o perfil típico do aluno com maior probabilidade de abandono:
- **Idade:** Mais de 17 anos
- **Série:** 1º Ano do Ensino Médio
- **Situação:** Trabalha ou precisa trabalhar
- **Ambiente:** Não se sente seguro em casa nem na escola
- **Relacionamentos:** Dificuldades com professores e colegas

---

## 🔒 Privacidade e Ética

- ✅ Questionário **anônimo** - não há identificação do aluno
- ✅ Dados **confidenciais** - não são compartilhados
- ✅ **Sem notas** - não é uma avaliação acadêmica
- ✅ Finalidade **pedagógica** - apenas para oferecer apoio

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Reportar bugs
2. Sugerir melhorias
3. Abrir pull requests

---

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato com a equipe de desenvolvimento.

---

<div align="center">

**Feito com 💚 para a educação de Recife**

</div>
