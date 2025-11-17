'use client'

import { getPixelColor } from '@/utils/getPixelColor'
import React, { useMemo, useRef } from 'react'

const TOTAL_ROWS = 26
const TOTAL_COLS = 19
const PIXELS_PER_ROW = 57

export const ImageCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [pixelData, setPixelData] = React.useState<number[]>([])
  const [currentFaceIndex, setCurrentFaceIndex] = React.useState<number>(0)
  const [patternScale, setPatternScale] = React.useState<number>(100)

  const activePixels = useMemo(() => {
    const rowIndex = TOTAL_ROWS - 1 - Math.floor(currentFaceIndex / TOTAL_COLS)
    const colIndex = currentFaceIndex % TOTAL_COLS

    const startIndex = rowIndex * 3 * PIXELS_PER_ROW + colIndex * 3

    return [
      startIndex,
      startIndex + 1,
      startIndex + 2,
      startIndex + 57,
      startIndex + 58,
      startIndex + 59,
      startIndex + 114,
      startIndex + 115,
      startIndex + 116,
    ]
  }, [currentFaceIndex])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Optionally resize canvas to match image dimensions
        canvas.width = img.width
        canvas.height = img.height

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        const imageDataArray = []

        for (let i = 0; i < img.height; i++) {
          for (let j = 0; j < img.width; j++) {
            const pixel = ctx.getImageData(j, i, 1, 1).data
            imageDataArray.push(getPixelColor(pixel))
          }
        }
        setPixelData(imageDataArray)
      }

      img.src = event.target?.result as string
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className='flex flex-col gap-6 lg:gap-8'>
      {pixelData.length === 0 && (
        <header className='text-center mb-4'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2'>
            Cube Art Helper
          </h1>
          <p className='text-gray-300 text-sm sm:text-base'>
            Transform your images into cube art patterns
          </p>
        </header>
      )}

      <canvas ref={canvasRef} className='hidden' />

      {pixelData.length === 0 ? (
        <div className='flex justify-center'>
          <div className='w-full max-w-md'>
            <label className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-2xl cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition-colors'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <svg
                  className='w-12 h-12 mb-4 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
                <p className='mb-2 text-sm text-gray-300'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-gray-400'>
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
              />
            </label>
          </div>
        </div>
      ) : (
        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
          {/* Full Grid Preview */}
          <div className='flex-1'>
            <div className='bg-zinc-800 rounded-2xl p-4 sm:p-6 shadow-lg'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg sm:text-xl font-semibold text-white'>
                  Full Pattern
                </h2>
                <div className='flex gap-2 items-center'>
                  <button
                    onClick={() =>
                      setPatternScale(prev => Math.max(prev - 10, 30))
                    }
                    disabled={patternScale <= 30}
                    className='px-3 py-1 bg-zinc-700 text-white rounded-lg text-sm font-medium hover:bg-zinc-600 disabled:bg-zinc-900 disabled:cursor-not-allowed transition-colors'
                    title='Zoom out'
                  >
                    −
                  </button>
                  <span className='text-sm text-gray-400 min-w-[3rem] text-center'>
                    {patternScale}%
                  </span>
                  <button
                    onClick={() =>
                      setPatternScale(prev => Math.min(prev + 10, 150))
                    }
                    disabled={patternScale >= 150}
                    className='px-3 py-1 bg-zinc-700 text-white rounded-lg text-sm font-medium hover:bg-zinc-600 disabled:bg-zinc-900 disabled:cursor-not-allowed transition-colors'
                    title='Zoom in'
                  >
                    +
                  </button>
                </div>
              </div>
              <div className='w-full flex justify-center'>
                <div
                  className='grid gap-[1px]'
                  style={{
                    gridTemplateColumns: 'repeat(57, 1fr)',
                    gridTemplateRows: 'repeat(78, 1fr)',
                    width: `min(${patternScale}%, ${
                      (570 * patternScale) / 100
                    }px)`,
                    aspectRatio: '57 / 78',
                  }}
                >
                  {pixelData.map((color, i) => (
                    <div
                      key={i}
                      className={`transition-opacity ${
                        color === 0
                          ? 'bg-white'
                          : color === 1
                          ? 'bg-red-600'
                          : color === 2
                          ? 'bg-blue-500'
                          : color === 3
                          ? 'bg-green-500'
                          : color === 4
                          ? 'bg-yellow-400'
                          : 'bg-orange-500'
                      } ${
                        activePixels.includes(i)
                          ? 'opacity-100 ring-1 ring-inset ring-cyan-400'
                          : 'opacity-40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Current Cube Face */}
          <div className='lg:w-96'>
            <div className='bg-zinc-800 rounded-2xl p-4 sm:p-6 shadow-lg sticky top-4'>
              <div className='text-center mb-6'>
                <h2 className='text-lg sm:text-xl font-semibold text-white mb-1'>
                  Current Cube
                </h2>
                <p className='text-2xl sm:text-3xl font-bold text-gray-200'>
                  {currentFaceIndex + 1}
                  <span className='text-base sm:text-lg font-normal text-gray-400'>
                    {' '}
                    / {TOTAL_ROWS * TOTAL_COLS}
                  </span>
                </p>
              </div>

              <div className='flex justify-center mb-6'>
                <div className='grid grid-cols-[repeat(3,60px)] sm:grid-cols-[repeat(3,70px)] grid-rows-[repeat(3,60px)] sm:grid-rows-[repeat(3,70px)] gap-2 p-4 bg-neutral-900 rounded-xl'>
                  {activePixels.map((pixelIndex, i) => (
                    <div
                      key={`facePixel-${i}`}
                      className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-lg shadow-md ${
                        pixelData[pixelIndex] === 0
                          ? 'bg-white'
                          : pixelData[pixelIndex] === 1
                          ? 'bg-red-600'
                          : pixelData[pixelIndex] === 2
                          ? 'bg-blue-500'
                          : pixelData[pixelIndex] === 3
                          ? 'bg-green-500'
                          : pixelData[pixelIndex] === 4
                          ? 'bg-yellow-400'
                          : 'bg-orange-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <button
                  onClick={() =>
                    setCurrentFaceIndex(prev => Math.max(prev - 1, 0))
                  }
                  disabled={currentFaceIndex === 0}
                  className='w-full px-4 py-3 bg-zinc-700 text-white rounded-xl font-medium hover:bg-zinc-600 disabled:bg-zinc-900 disabled:cursor-not-allowed transition-colors'
                >
                  ← Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentFaceIndex(prev =>
                      Math.min(prev + 1, TOTAL_ROWS * TOTAL_COLS - 1)
                    )
                  }
                  disabled={currentFaceIndex === TOTAL_ROWS * TOTAL_COLS - 1}
                  className='w-full px-4 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 disabled:bg-zinc-900 disabled:cursor-not-allowed transition-colors'
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
