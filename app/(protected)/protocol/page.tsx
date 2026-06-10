import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { ProtocolClient } from '@/components/ProtocolClient'
import { Task } from '@/types'

export const metadata: Metadata = {
  title: 'System',
};

export default async function ProtocolPage() {
  const supabase = await createClient()

  // 1. Authenticate
  const { data: authData, error: authError } = await supabase.auth.getClaims()
  if (authError || !authData?.claims) {
    redirect('/auth/login')
  }

  // 2. Fetch the Master Roster (Active and Archived)
  // We order by created_at descending so the newest tasks are at the top
  const { data: tasksResponse } = await supabase
    .from('tasks')
    .select('id, title, why_text, goal_text, is_active')
    .order('created_at', { ascending: false });

  const tasks = (tasksResponse as Task[]) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      <ProtocolClient initialTasks={tasks} />
    </div>
  );
}