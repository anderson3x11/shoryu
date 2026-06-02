import Image from 'next/image'

export default function PlayerLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32">
      <div className="flex items-center gap-4">
        <span className="font-display text-5xl tracking-wider leading-none text-zinc-100">Shoryu</span>
        <Image src="/logo.png" alt="Shoryu" width={60} height={60} className="object-contain" />
      </div>
      <p className="text-zinc-400 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
    </div>
  )
}
