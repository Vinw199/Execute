import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import Link from 'next/link'
import { ArrowLeft, Target, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vision',
};

export default async function VisionPage() {
  const supabase = await createClient()

  // 1. Authenticate to protect the route
  const { data: authData, error: authError } = await supabase.auth.getClaims()
  if (authError || !authData?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      
      {/* Minimalist Nav */}
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium">
            <ArrowLeft size={18} />
            Back to Execution
          </Link>
          <div className="font-black tracking-tighter text-xl uppercase">Vision.</div>
        </div>
      </nav>

      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto px-6 py-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">The June Protocol</h1>
          <p className="text-lg md:text-xl text-zinc-500 font-medium">Read during the "Before Sleep" meditation block. Prime the subconscious.</p>
        </header>

        {/* Vision Content Area */}
        <div className="space-y-12">
          
          <section className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Target className="text-zinc-400" />
              1. The 2-Year Compass
            </h2>
            <div className="space-y-6 text-lg text-zinc-700 dark:text-zinc-300">
              <div>
                <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">Professional</strong>
                <p>Secure a high-paying remote web development job and become a top-tier developer in India.</p>
              </div>
              <div>
                <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">Physical</strong>
                <p>Become the best pickleball player in India, requiring peak physical fitness and strength.</p>
              </div>
              <div>
                <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">Mental</strong>
                <p>Maintain a calm, relaxed, and courageous mental state under extreme pressure, executing with the fearless focus of Jannik Sinner.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 uppercase tracking-tight border-b-2 border-zinc-900 dark:border-zinc-100 pb-2">
              <BookOpen className="text-zinc-400" />
              2. End of June Vision
            </h2>
            <div className="space-y-6 text-lg text-zinc-700 dark:text-zinc-300">
              <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4 py-1">
                <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">The Tournament</strong>
                <p>Play and win the upcoming pickleball tournament.</p>
              </div>
              <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4 py-1">
                <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">The Physical Standard</strong>
                <p>I will present the absolute best and strongest version of myself. I will feel good, and I will look good.</p>
              </div>
              <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4 py-1">
                <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">The Professional Standard</strong>
                <p>I will be the absolute best at what I do. JS will be 2nd nature, the React practice project will be complete, and the freelance project will be finished.</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
// import { Target, BookOpen } from "lucide-react";

// export const VisionBoard: React.FC = () => (
//   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto py-8">
//     <div className="mb-12">
//       <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 mb-4 uppercase">The June Protocol</h1>
//       <p className="text-xl text-zinc-600 dark:text-zinc-400">Read during the "Before Sleep" meditation block. Prime the subconscious.</p>
//     </div>

//     <section className="mb-12 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800">
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
//         <Target className="text-zinc-400" />
//         1. The 2-Year Compass
//       </h2>
//       <div className="space-y-6 text-lg text-zinc-700 dark:text-zinc-300">
//         <div>
//           <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">Professional</strong>
//           <p>Secure a high-paying remote web development job and become a top-tier developer in India.</p>
//         </div>
//         <div>
//           <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">Physical</strong>
//           <p>Become the best pickleball player in India, requiring peak physical fitness and strength.</p>
//         </div>
//         <div>
//           <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">Mental</strong>
//           <p>Maintain a calm, relaxed, and courageous mental state under extreme pressure, executing with the fearless focus of Jannik Sinner.</p>
//         </div>
//       </div>
//     </section>

//     <section className="mb-12">
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
//         <BookOpen className="text-zinc-400" />
//         2. End of June Vision
//       </h2>
//       <div className="space-y-6 text-lg text-zinc-700 dark:text-zinc-300">
//         <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4 py-1">
//           <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">The Tournament</strong>
//           <p>Play and win the upcoming pickleball tournament.</p>
//         </div>
//         <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4 py-1">
//           <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">The Physical Standard</strong>
//           <p>I will present the absolute best and strongest version of myself. I will feel good, and I will look good.</p>
//         </div>
//         <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4 py-1">
//           <strong className="block text-zinc-900 dark:text-zinc-100 mb-1">The Professional Standard</strong>
//           <p>I will be the absolute best at what I do. JS will be 2nd nature, the React practice project will be complete, and the freelance project will be finished.</p>
//         </div>
//       </div>
//     </section>
//   </div>
// );