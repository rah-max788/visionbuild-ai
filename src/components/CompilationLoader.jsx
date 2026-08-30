import React, { useState, useEffect } from 'react'

const STAGES = [
  { emoji: '🧠', label: 'Logic Mapping', duration: 2000 },
  { emoji: '💻', label: 'Code Injection', duration: 2000 },
  { emoji: '🗄️', label: 'Database Provision', duration: 2000 },
  { emoji: '🚀', label: 'Live Deploy', duration: 2000 },
]

export default function CompilationLoader() {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStage >= STAGES.length) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStage((prev) => prev + 1)
          return 0
        }
        return prev + 5
      })
    }, 50)

    return () => clearInterval(interval)
  }, [currentStage])

  const isComplete = currentStage >= STAGES.length

  return (
    <div className="min-h-screen w-full gradient-purple-dark flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            COMPILING
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Building Your AI Application</p>
        </div>

        {/* Stage Container */}
        <div className="space-y-6">
          {STAGES.map((stage, index) => (
            <div key={index} className="space-y-2">
              {/* Stage Header */}
              <div className="flex items-center gap-3">
                <span className={`text-2xl transition-all duration-300 ${
                  index < currentStage ? 'scale-110' : index === currentStage ? 'animate-bounce' : 'opacity-40'
                }`}>
                  {stage.emoji}
                </span>
                <span className={`font-semibold uppercase tracking-wider text-sm transition-all duration-300 ${
                  index <= currentStage ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  {stage.label}
                </span>
                {index < currentStage && <span className="ml-auto text-green-400 font-bold">✓</span>}
              </div>

              {/* Progress Bar */}
              {index <= currentStage && (
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${
                      index < currentStage
                        ? 'w-full bg-gradient-to-r from-green-500 to-cyan-500'
                        : index === currentStage
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                        : 'w-0 bg-gray-600'
                    }`}
                    style={{ width: index === currentStage ? `${progress}%` : undefined }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-12 text-center animate-pulse">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-cyan-400 font-bold text-lg uppercase tracking-wider">Compilation Complete!</p>
            <p className="text-gray-400 text-sm mt-2">Your AI application is ready to deploy</p>
          </div>
        )}

        {/* Status */}
        <div className="mt-8 p-4 rounded-lg bg-purple-950/50 border border-purple-700/50 text-center">
          <p className="text-gray-300 text-sm">
            {isComplete ? (
              <span className="text-green-400 font-semibold">Ready for Spark Sandbox Testing</span>
            ) : (
              <span>
                Stage {currentStage + 1} of {STAGES.length}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
