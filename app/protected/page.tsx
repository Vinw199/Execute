import { redirect } from 'next/navigation'
// import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
import { DashboardClient } from '@/components/DashboardClient'
import { Task } from '@/types'

export default async function App() {
  const supabase = await createClient()

  // 1. Authenticate
  const { data: authData, error: authError } = await supabase.auth.getClaims()
  if (authError || !authData?.claims) {
    redirect('/auth/login')
  }

  // Format today's date to match PostgreSQL 'completed_date' column (YYYY-MM-DD)
  // const today = new Date().toISOString().split('T')[0];
  // 'en-CA' natively formats dates as YYYY-MM-DD
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  // 2. Execute parallel queries without the deprecated .returns()
  const [tasksResponse, completionsResponse] = await Promise.all([
    supabase
      .from('tasks')
      .select('id, title, why_text, goal_text')
      .eq('is_active', true),
    supabase
      .from('completed_tasks')
      .select('task_id')
      .eq('completed_date', today)
  ]);

  // 3. Cast the returned data to our strict interfaces
  const tasks = (tasksResponse.data as Task[]) || [];
  const completedTaskIds = (completionsResponse.data as { task_id: string }[])?.map(c => c.task_id) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* <LogoutButton /> */}
      <DashboardClient
        initialTasks={tasks}
        initialCompletedIds={completedTaskIds}
      />
    </div>
  );
}