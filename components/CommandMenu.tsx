"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  Search, 
  CheckSquare, 
  ListTodo, 
  Eye, 
  User, 
  LogOut,
  Command
} from "lucide-react";

type CommandAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
};

export const CommandMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // Handle Keyboard Shortcuts (Cmd+K / Ctrl+K to open, Esc to close)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle Custom Event from MenuTrigger
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-command-menu", handleOpen);
    
    return () => {
      window.removeEventListener("open-command-menu", handleOpen);
    };
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const actions: CommandAction[] = [
    {
      id: "execution",
      label: "Execution Dashboard",
      icon: <CheckSquare size={16} />,
      onSelect: () => router.push("/protected"),
    },
    {
      id: "protocol",
      label: "Manage Protocol",
      icon: <ListTodo size={16} />,
      onSelect: () => router.push("/protected/protocol"),
    },
    {
      id: "vision",
      label: "Vision Board",
      icon: <Eye size={16} />,
      onSelect: () => router.push("/protected/vision"),
    },
    {
      id: "profile",
      label: "User Profile",
      icon: <User size={16} />,
      onSelect: () => router.push("/protected/profile"),
    },
    {
      id: "logout",
      label: "Log Out",
      icon: <LogOut size={16} />,
      onSelect: handleLogout,
    },
  ];

  const filteredActions = actions.filter((action) =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const executeAction = (action: CommandAction) => {
    setIsOpen(false);
    action.onSelect();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Area */}
        <div className="flex items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <Search className="mr-3 h-5 w-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="hidden rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 sm:inline-flex items-center gap-1">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="py-6 text-center text-sm text-zinc-500">
              No results found.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => executeAction(action)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                >
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.icon}
                  </span>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
           <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
             <Command size={12} /> Navigation Menu
           </span>
        </div>
      </div>
    </div>
  );
};