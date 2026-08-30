import React from 'react'

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'factory', label: 'Factory Hub', icon: '🏭' },
    { id: 'builder', label: 'AI Builder', icon: '⚙️' },
    { id: 'sandbox', label: 'Spark Sandbox', icon: '✨' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 to-purple-950/30 border-t border-purple-700/50 backdrop-blur-md">
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-cyan-400 scale-110'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-xs font-semibold truncate">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 h-1 w-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
