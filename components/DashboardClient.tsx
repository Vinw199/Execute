"use client";

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { TaskItem } from '@/components/TaskItem';
import { Task } from '@/types';
import { toast } from 'sonner';

interface DashboardClientProps {
  initialTasks: Task[];
  initialCompletedIds: string[];
}

export const DashboardClient = ({ initialTasks, initialCompletedIds }: DashboardClientProps) => {

  const [completedTasks, setCompletedTasks] = useState<string[]>(initialCompletedIds);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // const todayString: string = new Date().toISOString().split('T')[0];
  const todayString: string = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const todayDisplay: string = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleToggleTask = async (taskId: string): Promise<void> => {
    const isCurrentlyCompleted = completedTasks.includes(taskId);

    // 1. Optimistic Update
    setCompletedTasks((prev: string[]) =>
      isCurrentlyCompleted
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );

    // 2. Supabase Mutation
    if (!isCurrentlyCompleted) {
      const { error } = await supabase
        .from('completed_tasks')
        .insert({ task_id: taskId, completed_date: todayString });

      if (error) {
        console.error("Failed to mark task complete:", error);
        // Revert UI
        setCompletedTasks((prev: string[]) => prev.filter((id) => id !== taskId));
        // Notify User
        toast.error("Execution sync failed", {
          description: "Network or database error. Task completion reverted.",
        });
      }
    } else {
      const { error } = await supabase
        .from('completed_tasks')
        .delete()
        .match({ task_id: taskId, completed_date: todayString });

      if (error) {
        console.error("Failed to unmark task:", error);
        // Revert UI
        setCompletedTasks((prev: string[]) => [...prev, taskId]);
        // Notify User
        toast.error("Execution sync failed", {
          description: "Could not uncheck task. Database sync reverted.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">

      {/* <nav className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-black tracking-tighter text-xl uppercase">Execution.</div>
        </div>
      </nav> */}

      <nav className="h-16 flex items-center justify-center border-b border-stone-200/50">
        <div className="font-medium tracking-wide text-sm text-stone-400 uppercase">
          Execution
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          <header className="mb-10 text-center">
            <h1 className="text-xs tracking-widest text-stone-400 uppercase">
              {todayDisplay}
            </h1>
          </header>

          <div className="flex flex-col gap-6">
            {initialTasks.length > 0 ? (
              initialTasks.map((task: Task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isCompleted={completedTasks.includes(task.id)}
                  onToggle={handleToggleTask}
                />
              ))
            ) : (
              <p className="text-stone-400 font-medium italic mt-8">
                No active tasks found.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}