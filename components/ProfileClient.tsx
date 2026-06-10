"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { ArrowLeft, Save, Shield, Activity, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileClientProps {
  email: string;
  createdAt: string;
  initialName: string;
  initialDirective: string;
}

export const ProfileClient = ({ email, createdAt, initialName, initialDirective }: ProfileClientProps) => {
  // Form State
  const [name, setName] = useState(initialName);
  const [directive, setDirective] = useState(initialDirective);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [daysInArena, setDaysInArena] = useState<number>(1);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // Calculate "Time in the Arena" strictly on the client to avoid hydration mismatches
  // (Since Server timezone vs Client timezone might calculate the day boundary differently)
  useEffect(() => {
    const accountCreationDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - accountCreationDate.getTime());
    // Math.ceil ensures Day 0 is treated as Day 1
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysInArena(diffDays || 1);
  }, [createdAt]);

  const handleUpdateIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');

    // Update Supabase Auth user_metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: name,
        prime_directive: directive,
      }
    });

    if (error) {
      console.error("Failed to update identity:", error);
      setSaveStatus('error');

      // Revert to initial state on error
      setName(initialName);
      setDirective(initialDirective);

      // Notify User
      toast.error("Update failed", {
        description: "Could not save operator identity to the server.",
      });
    } else {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);

      // Notify User
      toast.success("Identity Updated", {
        description: "Operator manifest has been saved successfully.",
      });

    }
  };

  return (
    <div>
      {/* Navigation matching Protocol page */}
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium">
            <ArrowLeft size={18} />
            Back to Execution
          </Link>
          <div className="font-black tracking-tighter text-xl uppercase mr-7 sm:mr-0">Operator.</div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-16">

        {/* STAT: Time in the Arena */}
        <section className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500 mb-2">
            <Activity size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Time in the Arena</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
            DAY {daysInArena}.
          </h1>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium text-lg">
            Consistency is the only metric that matters. Keep executing.
          </p>
        </section>

        {/* SECTION: Identity / Prime Directive */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-100">
            <Shield size={20} />
            <h2 className="text-2xl font-black tracking-tight uppercase">Operator Identity</h2>
          </div>

          <form onSubmit={handleUpdateIdentity} className="space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your alias or name"
                className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 py-2 text-lg font-medium focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Prime Directive (Mantra)
              </label>
              <textarea
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                placeholder="e.g., Relentless forward motion. I am a builder."
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded p-3 text-lg font-medium min-h-[100px] focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 resize-none transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold uppercase tracking-wider px-8 py-3 rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {saveStatus === 'saving' ? 'Committing...' :
                  saveStatus === 'saved' ? 'Identity Updated' :
                    <><Save size={18} /> Update Identity</>}
              </button>
            </div>
          </form>
        </section>

        {/* SECTION: Account Credentials (Read-Only) */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-100">
            <Mail size={20} />
            <h2 className="text-2xl font-black tracking-tight uppercase">Credentials</h2>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Registered Email
            </label>
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
              {email}
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}