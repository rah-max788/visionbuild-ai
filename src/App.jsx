import React, { useState } from 'react'
import FactoryHub from './components/FactoryHub'
import AIBuilder from './components/AIBuilder'
import SparkSandbox from './components/SparkSandbox'
import BottomNav from './components/BottomNav'

export default function App() {
  const [activeTab, setActiveTab] = useState('factory')

  const renderContent = () => {
    switch (activeTab) {
      case 'factory':
        return <FactoryHub />
      case 'builder':
        return <AIBuilder />
      case 'sandbox':
        return <SparkSandbox />
      default:
        return <FactoryHub />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
