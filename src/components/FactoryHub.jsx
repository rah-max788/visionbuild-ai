import React, { useState } from 'react'

export default function FactoryHub() {
  const [isInitiating, setIsInitiating] = useState(false)
  const [aiComputeActive] = useState(2847)
  const [appsShipped] = useState(156)

  const handleInitiate = () => {
    setIsInitiating(true)
    setTimeout(() => {
      setIsInitiating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen w-full gradient-purple-dark px-4 py-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          FACTORY HUB
        </h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">AI Software Manufacturing</p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-md mx-auto mb-12">
        {/* AI Compute Active */}
        <div className="mb-6 p-6 rounded-2xl bg-purple-900/40 border border-purple-700/60 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">AI Compute Active</div>
          <div className="text-5xl font-black text-cyan-400 mb-2 animate-pulse-glow">
            {aiComputeActive.toLocaleString()}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Apps Shipped */}
        <div className="mb-8 p-6 rounded-2xl bg-purple-900/40 border border-purple-700/60 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Apps Shipped</div>
          <div className="text-5xl font-black text-purple-400 mb-2">
            {appsShipped.toLocaleString()}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Big Glowing Button */}
      <div className="max-w-md mx-auto">
        <button
          onClick={handleInitiate}
          disabled={isInitiating}
          className={`w-full py-6 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 text-gray-950 ${
            isInitiating
              ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-95'
              : 'bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 hover:scale-105 glow-cyan'
          }`}
        >
          {isInitiating ? (
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block animate-spin">⚡</span>
              Initiating AI Architect...
            </div>
          ) : (
            'Initiate AI Architect'
          )}
        </button>
        <p className="text-center text-gray-500 text-xs mt-4 uppercase tracking-widest">Click to spawn new AI instance</p>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-10 right-4 opacity-20 text-6xl">🤖</div>
      <div className="fixed bottom-32 left-4 opacity-20 text-6xl">💾</div>
    </div>
  )
}
