import React, { useState } from 'react'
import CompilationLoader from './CompilationLoader'

export default function AIBuilder() {
  const [isCompiling, setIsCompiling] = useState(false)
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState('')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCompile = () => {
    if (!image || !description) {
      alert('Please upload an image and add a description')
      return
    }
    setIsCompiling(true)
    setTimeout(() => {
      setIsCompiling(false)
    }, 8000)
  }

  if (isCompiling) {
    return <CompilationLoader />
  }

  return (
    <div className="min-h-screen w-full gradient-purple-dark px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          AI BUILDER
        </h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest">Design Your Application</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Image Upload Box */}
        <div className="mb-6">
          <label className="block mb-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Project Blueprint</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-56 px-4 py-8 border-2 border-dashed border-cyan-500/50 rounded-xl bg-purple-950/30 hover:bg-purple-950/50 hover:border-cyan-400 cursor-pointer transition-all duration-300 backdrop-blur-sm"
            >
              {image ? (
                <div className="w-full h-full relative overflow-hidden rounded-lg">
                  <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 to-transparent flex items-end">
                    <span className="text-cyan-400 text-xs font-bold px-3 py-2 uppercase">✓ Image Loaded</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📸</span>
                  <span className="text-sm text-cyan-400 font-semibold">Upload Project Blueprint</span>
                  <span className="text-xs text-gray-400 block mt-1">PNG, JPG, or GIF</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Description Input */}
        <div className="mb-8">
          <label className="block mb-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">Application Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your AI application vision here..."
            className="w-full h-32 p-4 rounded-xl bg-purple-950/50 border border-purple-700/60 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:bg-purple-950/70 transition-all duration-300 resize-none font-mono text-sm"
          />
        </div>

        {/* Compile Button */}
        <button
          onClick={handleCompile}
          className="w-full btn-glowing mb-4"
        >
          Compile Application
        </button>
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest">Start the compilation pipeline</p>
      </div>
    </div>
  )
}
