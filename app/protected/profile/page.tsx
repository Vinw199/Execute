import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { ProfileClient } from '@/components/ProfileClient'
import { LogOut } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()

  // 1. Authenticate using the claims pattern
  const { data: authData, error: authError } = await supabase.auth.getClaims()
  if (authError || !authData?.claims) {
    redirect('/auth/login')
  }

  // 2. Fetch full user object for metadata (Name, Directive, created_at)
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Extract metadata safely (defaults to empty strings if not set yet)
  const displayName = user?.user_metadata?.display_name || ''
  const primeDirective = user?.user_metadata?.prime_directive || ''

  // 4. Server action for secure log out
  const signOut = async () => {
    "use server"
    const supabaseActionClient = await createClient()
    await supabaseActionClient.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      <ProfileClient 
        email={user?.email || ''} 
        createdAt={user?.created_at || new Date().toISOString()}
        initialName={displayName}
        initialDirective={primeDirective}
      />
      
      {/* Logout Action Area */}
      <main className="max-w-3xl mx-auto px-6 pb-12">
        <form action={signOut}>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/50 font-bold uppercase tracking-wider px-8 py-4 rounded transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </form>
      </main>
    </div>
  );
}