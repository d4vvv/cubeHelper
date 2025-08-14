import { ImageCanvas } from '@/components/ImageCanvas'
import Image from 'next/image'

export default function Home() {
  return (
    <div className=' min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <ImageCanvas />
    </div>
  )
}
