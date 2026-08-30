import React, { useState, useEffect } from 'react'
import EpisodeSpark from './EpisodeSpark'
import Terminal from './Terminal'

export default function SparkSandbox() {
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    setIsAppReady(true)
  }, [isAppReady])

  return (
    <div className="min-h-screen w-full gradient-purple-dark px-4 py-6 flex flex-col">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          SPARK SANDBOX
        </h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">Live Application Preview & Terminal Output</p>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-4">
        {/* Top Half - App Preview */}
        <div className="flex-1 min-h-0 rounded-xl border border-cyan-500/50 overflow-hidden bg-purple-950/40 backdrop-blur-sm">
          <div className="h-full overflow-y-auto">
            {isAppReady ? (
              <EpisodeSpark />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <span className="text-4xl block mb-2">⏳</span>
                  <span className="text-gray-400">Loading preview...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Half - Terminal */}
        <div className="flex-1 min-h-0 rounded-xl border border-green-500/50 overflow-hidden bg-gray-950/60 backdrop-blur-sm">
          <Terminal />
        </div>
      </div>
    </div>
  )
}
