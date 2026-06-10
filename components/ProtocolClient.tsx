"use client";

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Task } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Plus, Archive, RefreshCw, Pencil, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProtocolClientProps {
  initialTasks: Task[];
}

export const ProtocolClient = ({ initialTasks }: ProtocolClientProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  // Form State
  const [title, setTitle] = useState('');
  const [whyText, setWhyText] = useState('');
  const [goalText, setGoalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline Editing State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editWhyText, setEditWhyText] = useState('');
  const [editGoalText, setEditGoalText] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // Derived state for our tabs
  const activeTasks = tasks.filter(t => t.is_active !== false);
  const archivedTasks = tasks.filter(t => t.is_active === false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const newTaskData = {
      title,
      why_text: whyText || null,
      goal_text: goalText || null,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTaskData)
      .select()
      .single();

    if (!error && data) {
      setTasks(prev => [data as Task, ...prev]);
      setTitle('');
      setWhyText('');
      setGoalText('');

      // Notify user
      toast.success("Directive Added", {
        description: "New task added to your protocol.",
      });
    } else {
      console.error("Failed to create task:", error);

      // Notify user
      toast.error("Failed to add directive", {
        description: "Database sync failed.",
      });
    }

    setIsSubmitting(false);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditWhyText(task.why_text || '');
    setEditGoalText(task.goal_text || '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditWhyText('');
    setEditGoalText('');
  };

  const handleUpdateTask = async (taskId: string) => {
    if (!editTitle.trim()) return;

    const updatedTaskData = {
      title: editTitle,
      why_text: editWhyText || null,
      goal_text: editGoalText || null,
    };

    // Optimistic Update
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedTaskData } : t));
    setEditingTaskId(null); // Close form instantly

    // Supabase Mutation
    const { error } = await supabase
      .from('tasks')
      .update(updatedTaskData)
      .eq('id', taskId);

    if (error) {
      console.error("Failed to update task:", error);
      // Revert on failure
      setTasks(previousTasks);

      // Notify User
      toast.error("Failed to update task", {
        description: "Changes reverted due to sync error.",
      });
    } else {
      // Notify User
      toast.success("Task Updated");
    }
  };


  const handleToggleArchive = async (taskId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_active: newStatus } : t));

    // Supabase Mutation
    const { error } = await supabase
      .from('tasks')
      .update({ is_active: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error("Failed to update status:", error);
      // Revert on failure
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_active: currentStatus } : t));
      
      // Notify User
      toast.error("Action failed", {
        description: "Status change reverted.",
      });
    } else {
      // Notify User
      toast.success(newStatus ? "Task Restored" : "Task Archived");
    }
  };

  return (
    <div>
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium">
            <ArrowLeft size={18} />
            Back to Execution
          </Link>
          <div className="font-black tracking-tighter text-xl uppercase">Protocol.</div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* The Creation Engine */}
        <section className="mb-16">
          <h2 className="text-2xl font-black tracking-tight uppercase mb-6">New Directive</h2>
          <form onSubmit={handleCreateTask} className="space-y-4 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div>
              <input
                type="text"
                placeholder="Task Title (e.g., 100 Shadow Swings)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 py-2 text-lg font-medium focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <textarea
                placeholder="The Why (Optional)"
                value={whyText}
                onChange={(e) => setWhyText(e.target.value)}
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded p-3 text-sm min-h-[100px] focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 resize-none transition-colors"
              />
              <textarea
                placeholder="End Goal (Optional)"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded p-3 text-sm min-h-[100px] focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 resize-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold uppercase tracking-wider py-3 rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Committing...' : <><Plus size={18} /> Add to Protocol</>}
            </button>
          </form>
        </section>

        {/* The Master Roster */}
        <section>
          <div className="flex items-center gap-6 border-b border-zinc-200 dark:border-zinc-800 mb-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'active' ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
            >
              Active Roster ({activeTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'archived' ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
            >
              Archived ({archivedTasks.length})
            </button>
          </div>

          <div className="space-y-4">
            {(activeTab === 'active' ? activeTasks : archivedTasks).map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">

                {editingTaskId === task.id ? (
                  /* --- INLINE EDIT FORM --- */
                  <div className="w-full space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-1 text-lg font-medium focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
                      placeholder="Task Title"
                      autoFocus
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <textarea
                        value={editWhyText}
                        onChange={(e) => setEditWhyText(e.target.value)}
                        className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm min-h-[80px] focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 resize-none transition-colors"
                        placeholder="The Why (Optional)"
                      />
                      <textarea
                        value={editGoalText}
                        onChange={(e) => setEditGoalText(e.target.value)}
                        className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm min-h-[80px] focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 resize-none transition-colors"
                        placeholder="End Goal (Optional)"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateTask(task.id)}
                        disabled={!editTitle.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                      >
                        <Check size={14} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- STANDARD READ-ONLY VIEW --- */
                  <>
                    <div>
                      <h3 className={`font-medium text-lg ${task.is_active === false ? 'text-zinc-500' : ''}`}>{task.title}</h3>
                      <div className="flex gap-4 mt-1">
                        {task.why_text && <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Has Why</span>}
                        {task.goal_text && <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Has Goal</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                      {task.is_active !== false && (
                        <button
                          onClick={() => startEditing(task)}
                          className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                          title="Edit Task"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleArchive(task.id, task.is_active ?? true)}
                        className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        title={task.is_active !== false ? "Archive Task" : "Restore Task"}
                      >
                        {task.is_active !== false ? <Archive size={18} /> : <RefreshCw size={18} />}
                      </button>
                    </div>
                  </>
                )}

              </div>
            ))}

            {/* {(activeTab === 'active' ? activeTasks : archivedTasks).map((task) => (
              <div key={task.id} className="flex items-start justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                <div>
                  <h3 className={`font-medium text-lg ${task.is_active === false ? 'text-zinc-500' : ''}`}>{task.title}</h3>
                  <div className="flex gap-4 mt-1">
                    {task.why_text && <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Has Why</span>}
                    {task.goal_text && <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Has Goal</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleArchive(task.id, task.is_active ?? true)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  title={task.is_active !== false ? "Archive Task" : "Restore Task"}
                >
                  {task.is_active !== false ? <Archive size={18} /> : <RefreshCw size={18} />}
                </button>
              </div>
            ))} */}

            {(activeTab === 'active' && activeTasks.length === 0) && (
              <p className="text-zinc-500 italic">Your active protocol is empty.</p>
            )}
            {(activeTab === 'archived' && archivedTasks.length === 0) && (
              <p className="text-zinc-500 italic">No archived tasks.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}