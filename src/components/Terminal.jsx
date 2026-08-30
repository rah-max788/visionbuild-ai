import React, { useState, useEffect } from 'react'

const TERMINAL_LINES = [
  '> VISIONBUILD AI TERMINAL v1.0.0',
  '> ================================',
  '> Initializing AI Compute Core...',
  '> 🧠 Neural Networks: ONLINE',
  '> 💾 Database Cluster: CONNECTED',
  '> 🌐 API Gateway: ACTIVE',
  '> Compiling Episode Spark...\n',
  '> const App = () => {',
  '>   return <InteractiveStory />',
  '> }',
  '> \n> 🚀 Deployment Status: LIVE',
  '> ✓ All systems operational',
  '> [████��███████████████] 100%',
  '> Ready for user interaction...\n',
  '> Listening on port 5173',
  '> Press Ctrl+C to stop',
]

export default function Terminal() {
  const [displayedLines, setDisplayedLines] = useState([])
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (lineIndex < TERMINAL_LINES.length) {
      const timer = setTimeout(() => {
        setDisplayedLines([...displayedLines, TERMINAL_LINES[lineIndex]])
        setLineIndex(lineIndex + 1)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [lineIndex, displayedLines])

  return (
    <div className="w-full h-full bg-gray-950 border-t border-green-500/30 flex flex-col">
      {/* Terminal Header */}
      <div className="border-b border-green-500/30 p-3 bg-gray-900/80 backdrop-blur-sm">
        <h3 className="text-sm font-mono font-bold text-green-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          SYSTEM TERMINAL
        </h3>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
        {displayedLines.map((line, index) => (
          <div
            key={index}
            className={`terminal-line text-green-400 whitespace-pre-wrap break-words ${
              index === displayedLines.length - 1 ? 'animate-pulse' : ''
            }`}
          >
            {line}
          </div>
        ))}
        {lineIndex < TERMINAL_LINES.length && (
          <div className="terminal-line text-green-400 animate-pulse">▌</div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="border-t border-green-500/30 p-3 bg-gray-900/80 backdrop-blur-sm">
        <p className="text-xs text-green-500 font-mono">root@visionbuild-ai:~#</p>
      </div>
    </div>
  )
}
