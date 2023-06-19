
import Link from 'next/link'

export default function Home() {
  return (
    <main className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className='w-full max-w-[600px] mx-auto'>
        <h1 className='text-5xl mb-3'>The AI powered journal</h1>
        <p className='text-2xl text-white/60 mb-2'>Best app for mood tracking. Just be honest</p>
        <div>
          <Link href="/journal">
            <button className='bg-blue-600 rounded-lg px-4 py-2'>Get Started</button>
          </Link>
        </div>
      </div>
    </main>
  )
}
