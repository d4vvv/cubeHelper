import { ImageCanvas } from '@/components/ImageCanvas'

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-800 to-neutral-900'>
      <div className='container mx-auto px-4 py-6 sm:py-8 lg:py-12'>
        <ImageCanvas />
      </div>
    </div>
  )
}
