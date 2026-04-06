'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  questions, 
  INTRO_TEXT, 
  calculateDropoutProbability, 
  riskMessages, 
  recommendations
} from '@/lib/questionnaire-data'

type Screen = 'intro' | 'questionnaire' | 'result'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calculateDropoutProbability> | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleStartQuestionnaire = () => {
    setScreen('questionnaire')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSelectedAnswer(null)
    setIsTransitioning(false)
  }

  const handleSelectAnswer = (answer: string) => {
    if (isTransitioning) return
    
    // Marcar a resposta selecionada
    setSelectedAnswer(answer)
    setIsTransitioning(true)

    // Salvar resposta
    const newAnswers = { ...answers, [currentQuestion.id]: answer }
    setAnswers(newAnswers)

    // Após animação, passar para próxima pergunta ou resultado
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setIsTransitioning(false)
      } else {
        // Calcular resultado
        const calculation = calculateDropoutProbability(newAnswers)
        setResult(calculation)
        setScreen('result')
      }
    }, 400)
  }

  const handleRestart = () => {
    setScreen('intro')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSelectedAnswer(null)
    setResult(null)
    setIsTransitioning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-400 via-teal-500 to-cyan-600">
      {/* Tela de Introdução */}
      {screen === 'intro' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
          <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-10">
              {/* Ícone animado */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-4xl">📚</span>
                </div>
              </div>

              {/* Título */}
              <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
                {INTRO_TEXT.title}
              </h1>

              {/* Parágrafos */}
              <div className="space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
                {INTRO_TEXT.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Botão de iniciar */}
              <div className="flex justify-center">
                <Button
                  onClick={handleStartQuestionnaire}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg px-12 py-6 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95"
                >
                  Começar Questionário 🚀
                </Button>
              </div>

              {/* Info */}
              <p className="text-center text-gray-400 text-sm mt-6">
                {questions.length} perguntas • Aproximadamente 3 minutos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tela do Questionário */}
      {screen === 'questionnaire' && currentQuestion && (
        <div className="min-h-screen flex flex-col p-4 sm:p-6">
          {/* Header com progresso */}
          <div className="max-w-2xl mx-auto w-full mb-6">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="text-sm font-medium">
                Pergunta {currentQuestionIndex + 1} de {questions.length}
              </span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-white/30 rounded-full overflow-hidden"
            />
          </div>

          {/* Card da pergunta */}
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
            <Card className={cn(
              "bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden transition-all duration-300",
              isTransitioning && "scale-[0.98]"
            )}>
              <CardContent className="p-6 sm:p-8">
                {/* Número da pergunta */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">{currentQuestion.id}</span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                      style={{ width: `${(currentQuestion.id / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Texto da pergunta */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 leading-snug">
                  {currentQuestion.question}
                </h2>

                {/* Opções de resposta */}
                <div className="space-y-3" key={currentQuestionIndex}>
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={option.text}
                      onClick={() => handleSelectAnswer(option.text)}
                      disabled={isTransitioning}
                      className={cn(
                        "w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 transform",
                        selectedAnswer === option.text
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-lg scale-[1.02]"
                          : isTransitioning 
                            ? "border-gray-200 bg-gray-50 opacity-40"
                            : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md active:scale-[0.98]",
                      )}
                      style={{ 
                        animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <span className={cn(
                        "text-base sm:text-lg font-medium transition-colors duration-200",
                        selectedAnswer === option.text ? "text-white" : "text-gray-700"
                      )}>
                        {option.text}
                      </span>
                    </button>
                  ))}
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tela de Resultado */}
      {screen === 'result' && result && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-10">
              {/* Ícone do resultado */}
              <div className={cn(
                "w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-xl mb-6",
                result.riskLevel === 'baixo' && "bg-gradient-to-br from-green-400 to-emerald-500",
                result.riskLevel === 'moderado' && "bg-gradient-to-br from-yellow-400 to-amber-500",
                result.riskLevel === 'alto' && "bg-gradient-to-br from-orange-400 to-red-500",
                result.riskLevel === 'muito_alto' && "bg-gradient-to-br from-red-500 to-rose-600"
              )}>
                <span className="text-5xl">
                  {result.riskLevel === 'baixo' && '🌟'}
                  {result.riskLevel === 'moderado' && '👀'}
                  {result.riskLevel === 'alto' && '🤞'}
                  {result.riskLevel === 'muito_alto' && '💙'}
                </span>
              </div>

              {/* Probabilidade */}
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm mb-1">Probabilidade de abandono escolar</p>
                <p className={cn(
                  "text-5xl sm:text-6xl font-bold",
                  result.riskLevel === 'baixo' && "text-emerald-500",
                  result.riskLevel === 'moderado' && "text-amber-500",
                  result.riskLevel === 'alto' && "text-orange-500",
                  result.riskLevel === 'muito_alto' && "text-red-500"
                )}>
                  {result.probability}%
                </p>
                <p className={cn(
                  "text-lg font-medium mt-2",
                  result.riskLevel === 'baixo' && "text-emerald-600",
                  result.riskLevel === 'moderado' && "text-amber-600",
                  result.riskLevel === 'alto' && "text-orange-600",
                  result.riskLevel === 'muito_alto' && "text-red-600"
                )}>
                  Risco {result.riskLevel === 'baixo' ? 'Baixo' : 
                         result.riskLevel === 'moderado' ? 'Moderado' :
                         result.riskLevel === 'alto' ? 'Alto' : 'Muito Alto'}
                </p>
              </div>

              {/* Mensagem principal */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {riskMessages[result.riskLevel].title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {riskMessages[result.riskLevel].message}
                </p>
              </div>

              {/* Fatores de impacto */}
              {result.factors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Fatores identificados
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {result.factors.slice(0, 5).map((factor, index) => (
                      <div 
                        key={index}
                        className="bg-amber-50 border border-amber-200 rounded-xl p-4"
                      >
                        <p className="font-medium text-gray-800 text-sm mb-1">
                          {factor.question}
                        </p>
                        <p className="text-amber-700 text-sm">
                          Resposta: <strong>{factor.answer}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendações */}
              {result.factors.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                    <span>💡</span> Recomendações
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {result.factors.slice(0, 3).map((factor, index) => {
                      const recommendation = recommendations[factor.question];
                      if (!recommendation) return null;
                      return (
                        <div 
                          key={index}
                          className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                        >
                          <p className="text-emerald-800 text-sm leading-relaxed">
                            {recommendation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Botão de reiniciar */}
              <div className="flex justify-center">
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="font-bold text-lg px-8 py-5 rounded-2xl border-2 hover:bg-gray-100"
                >
                  Fazer novamente 🔄
                </Button>
              </div>

              {/* Nota de confidencialidade */}
              <p className="text-center text-gray-400 text-xs mt-6">
                Este resultado é confidencial e não será compartilhado.
                Se precisar de ajuda, procure a coordenação da sua escola.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
