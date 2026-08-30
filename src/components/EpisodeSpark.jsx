import React, { useState } from 'react'

const STORY_TREE = {
  root: {
    text: "Welcome to Episode Spark AI",
    subtitle: "Choose your path in this interactive story",
    options: [
      { text: "Start Episode 1", next: "episode1" },
      { text: "Choose Your Destiny", next: "destiny" },
    ],
  },
  episode1: {
    text: "Episode 1: The Beginning",
    subtitle: "You find yourself in a digital realm...",
    options: [
      { text: "Explore the North", next: "north" },
      { text: "Explore the South", next: "south" },
      { text: "Return to Start", next: "root" },
    ],
  },
  destiny: {
    text: "The Crossroads",
    subtitle: "Your destiny awaits. Which path calls to you?",
    options: [
      { text: "Hero's Journey", next: "hero" },
      { text: "Mysterious Path", next: "mystery" },
      { text: "Back to Menu", next: "root" },
    ],
  },
  north: {
    text: "The Northern Frontier",
    subtitle: "You discover ancient AI circuits glowing in the darkness...",
    options: [
      { text: "Activate Circuits", next: "circuits" },
      { text: "Go Back", next: "episode1" },
    ],
  },
  south: {
    text: "The Southern Expanse",
    subtitle: "A vast network of data streams surrounds you...",
    options: [
      { text: "Dive into Data", next: "data" },
      { text: "Go Back", next: "episode1" },
    ],
  },
  hero: {
    text: "The Hero Ascends",
    subtitle: "You've chosen the path of courage and power...",
    options: [
      { text: "Face the Challenge", next: "challenge" },
      { text: "Choose Again", next: "destiny" },
    ],
  },
  mystery: {
    text: "The Enigma Unfolds",
    subtitle: "Secrets lie ahead in the shadows...",
    options: [
      { text: "Uncover the Truth", next: "truth" },
      { text: "Choose Again", next: "destiny" },
    ],
  },
  circuits: {
    text: "⚡ POWER SURGE ⚡",
    subtitle: "The circuits awaken! Your AI gains new abilities...",
    options: [
      { text: "Continue Adventure", next: "episode1" },
      { text: "New Game", next: "root" },
    ],
  },
  data: {
    text: "💾 DATA STREAM MASTERY 💾",
    subtitle: "You've learned to navigate the infinite data ocean...",
    options: [
      { text: "Explore More", next: "episode1" },
      { text: "New Game", next: "root" },
    ],
  },
  challenge: {
    text: "🏆 VICTORY ACHIEVED 🏆",
    subtitle: "You've conquered the ultimate challenge!",
    options: [
      { text: "Play Again", next: "root" },
      { text: "Explore Alternate Path", next: "destiny" },
    ],
  },
  truth: {
    text: "🌟 THE TRUTH IS REVEALED 🌟",
    subtitle: "You've discovered the heart of the mystery...",
    options: [
      { text: "New Journey", next: "root" },
      { text: "Different Ending", next: "destiny" },
    ],
  },
}

export default function EpisodeSpark() {
  const [currentScene, setCurrentScene] = useState('root')
  const [history, setHistory] = useState(['root'])

  const scene = STORY_TREE[currentScene]

  const handleChoice = (nextScene) => {
    setCurrentScene(nextScene)
    setHistory([...history, nextScene])
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-gray-950/50 flex flex-col">
      {/* App Header */}
      <div className="border-b border-cyan-500/30 p-4 bg-purple-950/50 backdrop-blur-sm">
        <h2 className="text-lg font-black text-cyan-400 uppercase tracking-wider">Episode Spark AI</h2>
        <p className="text-xs text-gray-400 mt-1">Interactive Choice-Based Adventure</p>
      </div>

      {/* Story Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        {/* Scene Title */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-cyan-300 mb-2">{scene.text}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{scene.subtitle}</p>
        </div>

        {/* Story Stats */}
        <div className="mb-6 p-3 rounded-lg bg-purple-950/60 border border-purple-700/50">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-gray-400">Episode</p>
              <p className="text-cyan-400 font-bold">1</p>
            </div>
            <div>
              <p className="text-gray-400">Choices Made</p>
              <p className="text-purple-400 font-bold">{history.length - 1}</p>
            </div>
            <div>
              <p className="text-gray-400">Current</p>
              <p className="text-green-400 font-bold">LIVE</p>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>
      </div>

      {/* Interactive Options */}
      <div className="p-4 border-t border-cyan-500/30 bg-purple-950/50 backdrop-blur-sm space-y-3">
        {scene.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleChoice(option.next)}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-purple-800 hover:from-cyan-600 hover:to-purple-600 border border-purple-600 hover:border-cyan-400 text-white font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}
