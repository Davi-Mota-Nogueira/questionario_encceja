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
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calculateDropoutProbability> | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    if (isTransitioning || isCalculating) return
    
    setError(null)
    setSelectedAnswer(answer)
    setIsTransitioning(true)

    const newAnswers = { ...answers, [currentQuestion.id]: answer }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setSelectedAnswer(null)
        setIsTransitioning(false)
      } else {
        try {
          setIsCalculating(true)
          const calculation = calculateDropoutProbability(newAnswers)
          setResult(calculation)
          setScreen('result')
          setIsCalculating(false)
        } catch (err) {
          setError('Erro ao calcular resultado. Tente novamente.')
          setIsCalculating(false)
          setIsTransitioning(false)
        }
      }
    }, 400)
  }

  const handleRestart = () => {
    setScreen('intro')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSelectedAnswer(null)
    setResult(null)
    setError(null)
    setIsTransitioning(false)
    setIsCalculating(false)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Tela de Introdução */}
      {screen === 'intro' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
          <Card className="w-full max-w-2xl bg-white shadow-sm rounded-2xl overflow-hidden border border-stone-200">
            <CardContent className="p-8 sm:p-12">
              {/* Ícone - simplified */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center justify-center text-5xl">
                  📚
                </div>
              </div>

              {/* Título */}
              <h1 className="text-3xl sm:text-4xl font-bold text-center text-stone-900 mb-8">
                {INTRO_TEXT.title}
              </h1>

              {/* Parágrafos - simplified */}
              <div className="space-y-4 text-stone-700 text-base leading-relaxed mb-10 max-w-lg mx-auto">
                {INTRO_TEXT.paragraphs.slice(0, 2).map((p, i) => (
                  <p key={i} className="text-wrap-default">{p}</p>
                ))}
              </div>

              {/* Botão de iniciar */}
              <div className="flex justify-center">
                <Button
                  onClick={handleStartQuestionnaire}
                  aria-label="Começar questionário"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg px-12 py-4 rounded-lg shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Começar Questionário
                </Button>
              </div>

              {/* Info */}
              <p className="text-center text-stone-500 text-sm mt-8">
                {questions.length} perguntas • ~3 minutos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tela do Questionário */}
      {screen === 'questionnaire' && currentQuestion ? (
        <div className="min-h-screen flex flex-col p-4 sm:p-6">
          {/* Header com progresso */}
          <div className="max-w-2xl mx-auto w-full mb-8">
            <div className="flex items-center justify-between text-stone-700 mb-3">
              <span className="text-sm font-medium">
                Pergunta {currentQuestionIndex + 1} de {questions.length}
              </span>
              <span className="text-sm font-medium" aria-live="polite">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              value={progress}
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso do questionário: ${Math.round(progress)}%`}
              className="h-2 bg-stone-200 rounded-full overflow-hidden"
            />
          </div>

          {/* Card da pergunta */}
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
            <Card className="bg-white shadow-sm rounded-2xl overflow-hidden border border-stone-200">
              <CardContent className="p-8 sm:p-10">
                {/* Pergunta - simplified header */}
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-wide text-stone-500 font-semibold mb-2">
                    Pergunta {currentQuestion.id} de {questions.length}
                  </p>
                </div>

                {/* Texto da pergunta */}
                <fieldset className="mb-8">
                  <legend className="text-2xl sm:text-3xl font-bold text-stone-900 mb-8 leading-relaxed text-wrap-default">
                    {currentQuestion.question}
                  </legend>

                  {/* Opções de resposta */}
                  <div className="space-y-3" role="radiogroup" aria-labelledby="question-legend">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={option.text}
                        onClick={() => handleSelectAnswer(option.text)}
                        disabled={isTransitioning || isCalculating}
                        role="radio"
                        aria-checked={selectedAnswer === option.text}
                        aria-label={`Resposta: ${option.text}`}
                        className={cn(
                          "w-full text-left p-4 sm:p-5 rounded-lg border-2 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
                          selectedAnswer === option.text
                            ? "border-teal-600 bg-teal-50 text-stone-900 shadow-sm"
                            : isTransitioning || isCalculating
                              ? "border-stone-200 bg-stone-50 opacity-40"
                              : "border-stone-200 bg-white hover:border-teal-300 hover:bg-stone-50 hover:shadow-sm active:opacity-90",
                        )}
                        style={{ 
                          animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <span className={cn(
                          "text-base sm:text-lg font-medium transition-colors duration-200 text-wrap-default",
                        selectedAnswer === option.text ? "text-stone-900" : "text-stone-700"
                        )}>
                          {option.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Error state */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm" role="alert">
                    {error}
                  </div>
                )}

                {/* Loading state */}
                {isCalculating && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-teal-600">
                    <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    <span>Calculando resultado...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : screen === 'questionnaire' ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white shadow-sm rounded-2xl overflow-hidden border border-stone-200">
            <CardContent className="p-8 sm:p-10 text-center">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Erro ao carregar pergunta</h2>
              <p className="text-stone-700 mb-8">Desculpe, houve um problema ao carregar a pergunta. Tente novamente.</p>
              <Button onClick={handleRestart} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg">
                Recomeçar Questionário
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Tela de Resultado */}
      {screen === 'result' && result && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-2xl bg-white shadow-sm rounded-2xl overflow-hidden border border-stone-200" role="region" aria-label="Resultado do questionário">
            <CardContent className="p-8 sm:p-12">
              {/* Icon - simplified, no gradient */}
              <div className="flex justify-center mb-8 text-5xl">
                {result.riskLevel === 'baixo' && '🌟'}
                {result.riskLevel === 'moderado' && '👀'}
                {result.riskLevel === 'alto' && '🤞'}
                {result.riskLevel === 'muito_alto' && '💙'}
              </div>

              {/* Probabilidade */}
              <div className="text-center mb-8">
                <p className="text-stone-600 text-sm mb-2">Probabilidade de abandono escolar</p>
                <p className={cn(
                  "text-6xl sm:text-7xl font-bold",
                  result.riskLevel === 'baixo' && "text-green-600",
                  result.riskLevel === 'moderado' && "text-yellow-600",
                  result.riskLevel === 'alto' && "text-orange-600",
                  result.riskLevel === 'muito_alto' && "text-red-600"
                )}
                aria-live="polite"
                aria-label={`${result.probability} por cento`}
                >
                  {result.probability}%
                </p>
                <p className={cn(
                  "text-lg font-semibold mt-3",
                  result.riskLevel === 'baixo' && "text-green-700",
                  result.riskLevel === 'moderado' && "text-yellow-700",
                  result.riskLevel === 'alto' && "text-orange-700",
                  result.riskLevel === 'muito_alto' && "text-red-700"
                )}>
                  Risco {result.riskLevel === 'baixo' ? 'Baixo' : 
                         result.riskLevel === 'moderado' ? 'Moderado' :
                         result.riskLevel === 'alto' ? 'Alto' : 'Muito Alto'}
                </p>
              </div>

              {/* Mensagem principal */}
              <div className="bg-stone-50 rounded-lg p-6 mb-8 border border-stone-200">
                <h3 className="font-bold text-xl text-stone-900 mb-2 text-wrap-default">
                  {riskMessages[result.riskLevel]?.title || 'Resultado'}
                </h3>
                <p className="text-stone-700 leading-relaxed text-wrap-default">
                  {riskMessages[result.riskLevel]?.message || 'Seus dados foram processados.'}
                </p>
              </div>

              {/* Fatores de impacto */}
              {result.factors && result.factors.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-bold text-lg text-stone-900 mb-4">
                    Fatores identificados
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2" role="region" aria-label="Fatores de risco identificados">
                    {result.factors.slice(0, 5).map((factor, index) => (
                      <div 
                        key={index}
                        className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                      >
                        <p className="font-medium text-stone-800 text-sm mb-1 text-wrap-default">
                          {factor.question}
                        </p>
                        <p className="text-amber-800 text-sm">
                          Resposta: <strong>{factor.answer}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendações */}
              {result.factors && result.factors.length > 0 && (
                <div className="mb-10">
                  <h4 className="font-bold text-lg text-stone-900 mb-4">
                    Recomendações
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2" role="region" aria-label="Recomendações personalizadas">
                    {result.factors.slice(0, 3).map((factor, index) => {
                      const recommendation = recommendations?.[factor.question];
                      if (!recommendation) return null;
                      return (
                        <div 
                          key={index}
                          className="bg-green-50 border border-green-200 rounded-lg p-4"
                        >
                          <p className="text-green-800 text-sm leading-relaxed text-wrap-default">
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
                  aria-label="Fazer questionário novamente"
                  variant="outline"
                  className="font-bold text-lg px-8 py-4 rounded-lg border-2 border-stone-300 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Fazer novamente
                </Button>
              </div>

              {/* Nota de confidencialidade */}
              <p className="text-center text-stone-600 text-xs mt-8">
                Este resultado é confidencial. Se precisar de ajuda, procure a coordenação da sua escola.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
