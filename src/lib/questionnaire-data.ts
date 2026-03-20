// Dados do questionário com pesos calculados baseados nas respostas de Pernambuco/Recife
// O peso de influência ao abandono é proporcional à quantidade de respostas

export interface QuestionOption {
  text: string;
  count: number;
  // Peso normalizado (0-1) - quanto maior, maior o risco
  weight: number;
}

export interface Question {
  id: number;
  question: string;
  type: 'multiple' | 'boolean';
  options: QuestionOption[];
  // Peso da pergunta no cálculo total (baseado na proporção de respostas de risco)
  questionWeight: number;
}

// Texto de introdução do questionário
export const INTRO_TEXT = {
  title: "Na moralzinha: Conta pra gente o que tu acha! ✌️",
  paragraphs: [
    "Olá! Este questionário foi criado porque a sua opinião e a sua realidade são muito importantes para nós. Não é uma prova, não vale nota e você não precisa se identificar.",
    "O nosso objetivo é entender como é o seu dia a dia na escola e fora dela, para pensarmos juntos em formas de melhorar o ensino em Recife e garantir que ninguém precise desistir dos estudos.",
    "Seja o mais sincero(a) possível. Suas respostas são confidenciais e servem para nos ajudar a construir uma escola que faça mais sentido para a sua vida."
  ]
};

// Dados brutos das respostas
const rawData = {
  serie: {
    total: 74 + 20 + 38 + 139 + 429 + 474 + 552 + 1430 + 1962 + 1352 + 859,
    options: [
      { text: "1ª Série", count: 74 },
      { text: "2ª Série", count: 20 },
      { text: "3ª Série", count: 38 },
      { text: "4ª Série", count: 139 },
      { text: "5ª Série", count: 429 },
      { text: "6ª Série", count: 474 },
      { text: "7ª Série", count: 552 },
      { text: "8ª Série", count: 1430 },
      { text: "1º Ano", count: 1962 },
      { text: "2º Ano", count: 1352 },
      { text: "3º Ano", count: 859 }
    ]
  },
  idade: {
    total: 44 + 582 + 2770 + 3970,
    options: [
      { text: "Menos de 10", count: 44 },
      { text: "Entre 10-14", count: 582 },
      { text: "Entre 15-17", count: 2770 },
      { text: "Mais de 17", count: 3970 }
    ]
  }
};

// Função para calcular peso normalizado
function calculateNormalizedWeight(count: number, maxCount: number): number {
  return count / maxCount;
}

// Calcular o peso máximo para normalização
const maxSerieCount = Math.max(...rawData.serie.options.map(o => o.count));
const maxIdadeCount = Math.max(...rawData.idade.options.map(o => o.count));

// Perguntas do questionário com pesos calculados
export const questions: Question[] = [
  // Pergunta 1 - Série
  {
    id: 1,
    question: "Em qual série você está?",
    type: 'multiple',
    options: rawData.serie.options.map(opt => ({
      text: opt.text,
      count: opt.count,
      weight: calculateNormalizedWeight(opt.count, maxSerieCount)
    })),
    questionWeight: 1.0
  },
  // Pergunta 2 - Idade
  {
    id: 2,
    question: "Quantos anos você tem?",
    type: 'multiple',
    options: rawData.idade.options.map(opt => ({
      text: opt.text,
      count: opt.count,
      weight: calculateNormalizedWeight(opt.count, maxIdadeCount)
    })),
    questionWeight: 1.0
  },
  // Pergunta 3 - Segurança no ambiente familiar
  {
    id: 3,
    question: "Você se sente seguro(a) e bem tratado(a) no seu ambiente familiar?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 479, weight: 0 }, // Sim = não influencia abandono
      { text: "Não", count: 6915, weight: 1 } // Não = influencia abandono
    ],
    questionWeight: 6915 / (479 + 6915) // ~0.935
  },
  // Pergunta 4 - Tempo para estudar
  {
    id: 4,
    question: "Você consegue reservar um tempo tranquilo para estudar fora da escola?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 1909, weight: 0 },
      { text: "Não", count: 5448, weight: 1 }
    ],
    questionWeight: 5448 / (5448 + 1909) // ~0.740
  },
  // Pergunta 5 - Filhos
  {
    id: 5,
    question: "Você tem filhos ou filhas?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 2714, weight: 1 },
      { text: "Não", count: 4645, weight: 0 }
    ],
    questionWeight: 2714 / (2714 + 4645) // ~0.369
  },
  // Pergunta 6 - Tarefas de casa
  {
    id: 6,
    question: "Você precisa dedicar muito tempo ajudando nas tarefas ou cuidados da casa?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 3835, weight: 1 },
      { text: "Não", count: 3522, weight: 0 }
    ],
    questionWeight: 3835 / (3835 + 3522) // ~0.521
  },
  // Pergunta 7 - Trabalho
  {
    id: 7,
    question: "Você trabalha atualmente ou sente que precisará trabalhar em breve para ajudar nas contas?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 5462, weight: 1 },
      { text: "Não", count: 1896, weight: 0 }
    ],
    questionWeight: 5462 / (5462 + 1896) // ~0.742
  },
  // Pergunta 8 - Desestímulo
  {
    id: 8,
    question: "Existe algo ou alguém que te impeça ou desestimule de continuar estudando?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 267, weight: 1 },
      { text: "Não", count: 7088, weight: 0 }
    ],
    questionWeight: 267 / (267 + 7088) // ~0.036
  },
  // Pergunta 9 - Mudanças de casa
  {
    id: 9,
    question: "Sua família costuma mudar de casa com muita frequência?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 1724, weight: 1 },
      { text: "Não", count: 5632, weight: 0 }
    ],
    questionWeight: 1724 / (1724 + 5632) // ~0.234
  },
  // Pergunta 10 - Falta de professores
  {
    id: 10,
    question: "Você sente que faltam professores com frequência na sua escola?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 776, weight: 1 },
      { text: "Não", count: 6583, weight: 0 }
    ],
    questionWeight: 776 / (776 + 6583) // ~0.105
  },
  // Pergunta 11 - Relação com professores
  {
    id: 11,
    question: "Como é sua relação com os professores? Você se sente ouvido(a) por eles?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 6661, weight: 0 },
      { text: "Não", count: 698, weight: 1 }
    ],
    questionWeight: 698 / (698 + 6661) // ~0.095
  },
  // Pergunta 12 - Relação com colegas
  {
    id: 12,
    question: "Você se sente acolhido(a) e respeitado(a) pelos seus colegas?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 6623, weight: 0 },
      { text: "Não", count: 736, weight: 1 }
    ],
    questionWeight: 736 / (736 + 6623) // ~0.100
  },
  // Pergunta 13 - Desrespeito por gênero
  {
    id: 13,
    question: "Você já se sentiu desrespeitado(a) na escola por causa do seu gênero ou orientação sexual?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 223, weight: 1 },
      { text: "Não", count: 7132, weight: 0 }
    ],
    questionWeight: 223 / (223 + 7132) // ~0.030
  },
  // Pergunta 14 - Discriminação racial
  {
    id: 14,
    question: "Você já se sentiu discriminado(a) ou maltratado(a) por causa da sua cor ou raça?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 348, weight: 1 },
      { text: "Não", count: 7011, weight: 0 }
    ],
    questionWeight: 348 / (348 + 7011) // ~0.047
  },
  // Pergunta 15 - Preconceito financeiro
  {
    id: 15,
    question: "Você já sentiu algum tipo de preconceito por causa da sua condição financeira?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 661, weight: 1 },
      { text: "Não", count: 6695, weight: 0 }
    ],
    questionWeight: 661 / (661 + 6695) // ~0.090
  },
  // Pergunta 16 - Segurança na escola
  {
    id: 16,
    question: "Você se sente seguro(a) dentro da escola e acha que o prédio está bem cuidado?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 6496, weight: 0 },
      { text: "Não", count: 862, weight: 1 }
    ],
    questionWeight: 862 / (862 + 6496) // ~0.117
  },
  // Pergunta 17 - Distância
  {
    id: 17,
    question: "A distância entre a sua casa e o colégio dificulta sua ida às aulas?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 1164, weight: 1 },
      { text: "Não", count: 6194, weight: 0 }
    ],
    questionWeight: 1164 / (1164 + 6194) // ~0.158
  },
  // Pergunta 18 - Aulas interessantes
  {
    id: 18,
    question: "Você acha as aulas e as formas de avaliação interessantes e motivadoras?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 6061, weight: 0 },
      { text: "Não", count: 1297, weight: 1 }
    ],
    questionWeight: 1297 / (1297 + 6061) // ~0.176
  },
  // Pergunta 19 - Dificuldade de vaga
  {
    id: 19,
    question: "Você teve dificuldade para conseguir vaga em uma escola pública perto de casa?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 552, weight: 1 },
      { text: "Não", count: 6807, weight: 0 }
    ],
    questionWeight: 552 / (552 + 6807) // ~0.075
  },
  // Pergunta 20 - Utilidade do aprendizado
  {
    id: 20,
    question: "Você sente que o que aprende nas aulas tem utilidade para a sua vida e seu futuro?",
    type: 'boolean',
    options: [
      { text: "Sim", count: 5978, weight: 0 },
      { text: "Não", count: 1417, weight: 1 }
    ],
    questionWeight: 1417 / (1417 + 5978) // ~0.191
  }
];

// Função para calcular a probabilidade de abandono
export function calculateDropoutProbability(answers: Record<number, string>): {
  probability: number;
  riskLevel: 'baixo' | 'moderado' | 'alto' | 'muito_alto';
  factors: { question: string; impact: number; answer: string }[];
} {
  let totalWeight = 0;
  let maxPossibleWeight = 0;
  const factors: { question: string; impact: number; answer: string }[] = [];

  for (const question of questions) {
    const answer = answers[question.id];
    if (!answer) continue;

    const selectedOption = question.options.find(opt => opt.text === answer);
    if (!selectedOption) continue;

    // Para perguntas booleanas, o peso é binário (0 ou 1) multiplicado pelo peso da pergunta
    // Para perguntas múltiplas, o peso é normalizado (0-1) multiplicado pelo peso da pergunta
    const answerWeight = selectedOption.weight * question.questionWeight;
    totalWeight += answerWeight;
    
    // Peso máximo possível para esta pergunta
    const maxOptionWeight = Math.max(...question.options.map(o => o.weight));
    maxPossibleWeight += maxOptionWeight * question.questionWeight;

    // Registrar fatores de impacto significativo
    if (selectedOption.weight > 0.5) {
      factors.push({
        question: question.question,
        impact: answerWeight,
        answer: answer
      });
    }
  }

  // Normalizar para 0-100%
  const probability = maxPossibleWeight > 0 ? (totalWeight / maxPossibleWeight) * 100 : 0;

  // Determinar nível de risco
  let riskLevel: 'baixo' | 'moderado' | 'alto' | 'muito_alto';
  if (probability < 25) {
    riskLevel = 'baixo';
  } else if (probability < 50) {
    riskLevel = 'moderado';
  } else if (probability < 75) {
    riskLevel = 'alto';
  } else {
    riskLevel = 'muito_alto';
  }

  // Ordenar fatores por impacto
  factors.sort((a, b) => b.impact - a.impact);

  return { probability: Math.round(probability * 10) / 10, riskLevel, factors };
}

// Mensagens baseadas no nível de risco
export const riskMessages = {
  baixo: {
    title: "Que bom! Você está no caminho certo! 🌟",
    message: "Seu perfil indica que você tem boas condições para continuar seus estudos. Continue assim e não desanime!"
  },
  moderado: {
    title: "Fique atento(a)! 👀",
    message: "Existem alguns fatores que podem dificultar sua permanência na escola. Que tal conversar com alguém de confiança sobre isso?"
  },
  alto: {
    title: "Precisamos conversar! 😉",
    message: "Identificamos vários fatores que podem estar dificultando seus estudos. Não enfrente isso sozinho(a) - procure apoio na sua escola!"
  },
  muito_alto: {
    title: "Você não está sozinho(a)! 💙",
    message: "Sua situação precisa de atenção especial. Procure a coordenação pedagógica da sua escola ou um assistente social. Existem formas de te ajudar!"
  }
};

// Recomendações baseadas nos fatores de risco
export const recommendations: Record<string, string> = {
  "Você se sente seguro(a) e bem tratado(a) no seu ambiente familiar?": "Se você não se sente seguro em casa, é muito importante buscar ajuda. Converse com um professor de confiança ou ligue para o Disque 100 (Direitos Humanos).",
  "Você consegue reservar um tempo tranquilo para estudar fora da escola?": "Tente organizar um pequeno espaço e tempo para estudar, mesmo que seja apenas 30 minutos por dia. A biblioteca da escola ou da comunidade pode ser uma opção.",
  "Você tem filhos ou filhas?": "Existem programas de apoio a estudantes com filhos. Procure saber sobre creches próximas e auxílio-studantil na sua escola.",
  "Você precisa dedicar muito tempo ajudando nas tarefas ou cuidados da casa?": "Converse com sua família sobre a importância dos seus estudos. Talvez seja possível dividir melhor as tarefas domésticas.",
  "Você trabalha atualmente ou sente que precisará trabalhar em breve para ajudar nas contas?": "Procure programas de jovem aprendiz ou estágio que permitam conciliar trabalho e estudo. Fale com a coordenação da sua escola sobre suas opções.",
  "Existe algo ou alguém que te impeça ou desestimule de continuar estudando?": "Ninguém deve te impedir de estudar. Se está enfrentando pressões, busque apoio na escola ou na família.",
  "Sua família costuma mudar de casa com muita frequência?": "Mudanças constantes podem dificultar os estudos. Converse com a escola sobre sua situação - pode haver formas de facilitar sua permanência.",
  "Você sente que faltam professores com frequência na sua escola?": "Este é um problema estrutural. Participe do grêmio estudantil e da associação de pais e mestres para reivindicar melhorias.",
  "Como é sua relação com os professores? Você se sente ouvido(a) por eles?": "Tente se aproximar de pelo menos um professor com quem você se sinta confortável. Ter um mentor pode fazer muita diferença.",
  "Você se sente acolhido(a) e respeitado(a) pelos seus colegas?": "Se está se sentindo isolado(a), procure participar de atividades extracurriculares ou grupos de estudo. A escola pode ter projetos de integração.",
  "Você já se sentiu desrespeitado(a) na escola por causa do seu gênero ou orientação sexual?": "Ninguém deve sofrer discriminação. Denuncie situações de bullying ou preconceito na coordenação ou pelo canal de denúncias da escola.",
  "Você já se sentiu discriminado(a) ou maltratado(a) por causa da sua cor ou raça?": "A discriminação racial é crime. Busque apoio na coordenação e conheça seus direitos. O NAUE (Núcleo de Ações Afirmativas) da UFPE pode ajudar.",
  "Você já sentiu algum tipo de preconceito por causa da sua condição financeira?": "Sua condição financeira não define seu valor. Existem bolsas de estudo e auxílios disponíveis - procure a assistência estudantil.",
  "Você se sente seguro(a) dentro da escola e acha que o prédio está bem cuidado?": "Sua segurança é prioridade. Relate problemas estruturais à direção e procure participar de movimentos por melhorias na escola.",
  "A distância entre a sua casa e o colégio dificulta sua ida às aulas?": "Verifique se há transporte escolar disponível ou se a prefeitura oferece passe livre. Converse com a coordenação sobre suas opções.",
  "Você acha as aulas e as formas de avaliação interessantes e motivadoras?": "Dê feedback aos professores sobre o que funciona e o que não funciona. Participe do grêmio para propor melhorias.",
  "Você teve dificuldade para conseguir vaga em uma escola pública perto de casa?": "A Secretaria de Educação deve garantir vaga. Procure a ouvidoria se estiver sem escola. Existem centros de juventude que podem ajudar.",
  "Você sente que o que aprende nas aulas tem utilidade para a sua vida e seu futuro?": "Converse com professores sobre conectar os conteúdos à sua realidade. Projetos de extensão e cursos técnicos podem ser mais aplicados."
};
