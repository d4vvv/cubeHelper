'use client'

import { getPixelColor } from '@/utils/getPixelColor'
import React, { useMemo, useRef } from 'react'

const TOTAL_ROWS = 26
const TOTAL_COLS = 19
const PIXELS_PER_ROW = 57

export const ImageCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [pixelData, setPixelData] = React.useState<number[]>([])
  const [currentFaceIndex, setCurrentFaceIndex] = React.useState<number>(0)

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
    <div className='flex gap-20 h-full items-center'>
      <div>
        {pixelData.length === 0 && (
          <input type='file' accept='image/*' onChange={handleImageUpload} />
        )}
        <canvas
          ref={canvasRef}
          style={{ border: '1px solid #ccc', marginTop: 10, display: 'none' }}
        />
      </div>
      <div className='grid grid-cols-[repeat(57,10px)] grid-rows-[repeat(78,10px)]'>
        {pixelData.map((color, i) => (
          <div
            key={i}
            className={`w-[10px] h-[10px] border border-gray-800 box-content ${
              color === 0
                ? 'bg-white'
                : color === 1
                ? 'bg-red-600'
                : color === 2
                ? 'bg-blue-500'
                : color === 3
                ? 'bg-green-500'
                : color === 4
                ? 'bg-yellow-300'
                : 'bg-orange-500'
            } ${activePixels.includes(i) ? 'opacity-100' : 'opacity-50'}`}
          />
        ))}
      </div>
      <div className='flex flex-col items-center justify-center h-full grow'>
        <div className='text-lg font-bold mb-4'>
          Cube {currentFaceIndex + 1} / {TOTAL_ROWS * TOTAL_COLS}
        </div>
        <div className='grid grid-cols-[repeat(3,60px)] grid-rows-[repeat(3,60px)] gap-1'>
          {activePixels.map((pixelIndex, i) => (
            <div
              key={`facePixel-${i}`}
              className={`w-[60px] h-[60px]  box-content ${
                pixelData[pixelIndex] === 0
                  ? 'bg-white'
                  : pixelData[pixelIndex] === 1
                  ? 'bg-red-600'
                  : pixelData[pixelIndex] === 2
                  ? 'bg-blue-500'
                  : pixelData[pixelIndex] === 3
                  ? 'bg-green-500'
                  : pixelData[pixelIndex] === 4
                  ? 'bg-yellow-300'
                  : 'bg-orange-500'
              }`}
            />
          ))}
        </div>
        <div className='mt-8 flex flex-col gap-4'>
          <button
            onClick={() => {
              setCurrentFaceIndex(prev => prev + 1)
            }}
            className='px-4 py-2 bg-orange-500 cursor-pointer hover:bg-orange-700 transition-all text-white rounded'
          >
            Next Face
          </button>
          <button
            onClick={() => {
              setCurrentFaceIndex(prev => Math.max(prev - 1, 0))
            }}
            className='px-4 py-2 bg-orange-500 cursor-pointer hover:bg-orange-700 transition-all text-white rounded w-60'
          >
            Previous Face
          </button>
        </div>
      </div>
    </div>
  )
}
