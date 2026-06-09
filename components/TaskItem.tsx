"use client";

import { Task } from "@/types";
import { useState } from "react";
import { CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, isCompleted, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Determine if there is actual progressive disclosure content to show
  const hasDetails = Boolean(task.why_text || task.goal_text);

  const handleToggleExpand = () => {
    if (hasDetails) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 overflow-hidden">
      <div className="flex items-start py-4 group">
        {/* Checkbox: Dedicated interaction zone */}
        <button 
          onClick={() => onToggle(task.id)}
          className="mt-1 mr-4 flex-shrink-0 text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors focus:outline-none"
          aria-label={isCompleted ? "Mark task incomplete" : "Mark task complete"}
        >
          {isCompleted ? <CheckSquare size={24} className="text-zinc-400 dark:text-zinc-600" /> : <Square size={24} />}
        </button>

        {/* Task Text: Expands accordion */}
        <div 
          className={`flex-grow select-none ${hasDetails ? 'cursor-pointer' : ''}`}
          onClick={handleToggleExpand}
          aria-expanded={isExpanded}
        >
          <div className="flex justify-between items-center">
            <span className={`text-lg font-medium transition-all ${isCompleted ? 'line-through text-zinc-400 dark:text-zinc-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
              {task.title}
            </span>
            {hasDetails && (
              <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            )}
          </div>

          {/* Progressive Disclosure: The "Why" and "Goal" */}
          {hasDetails && (
            <div 
              className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden text-zinc-600 dark:text-zinc-400 space-y-3 pr-8">
                {task.why_text && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-1 block">The Why</span>
                    <p className="text-sm leading-relaxed">{task.why_text}</p>
                  </div>
                )}
                {task.goal_text && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-1 block">End Goal</span>
                    <p className="text-sm leading-relaxed">{task.goal_text}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// "use client";

// import { Task } from "@/types";
// import { useState } from "react";
// import { CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';

// interface TaskItemProps {
//   task: Task;
//   isCompleted: boolean;
//   onToggle: (id: string) => void;
// }

// export const TaskItem: React.FC<TaskItemProps> = ({ task, isCompleted, onToggle }) => {
//   const [isExpanded, setIsExpanded] = useState<boolean>(false);

//   return (
//     <div className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 overflow-hidden">
//       <div className="flex items-start py-4 group">
//         {/* Checkbox: Dedicated interaction zone */}
//         <button 
//           onClick={() => onToggle(task.id)}
//           className="mt-1 mr-4 flex-shrink-0 text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors focus:outline-none"
//           aria-label={isCompleted ? "Mark task incomplete" : "Mark task complete"}
//         >
//           {isCompleted ? <CheckSquare size={24} className="text-zinc-400 dark:text-zinc-600" /> : <Square size={24} />}
//         </button>

//         {/* Task Text: Expands accordion */}
//         <div 
//           className="flex-grow cursor-pointer select-none"
//           onClick={() => setIsExpanded(!isExpanded)}
//         >
//           <div className="flex justify-between items-center">
//             <span className={`text-lg font-medium transition-all ${isCompleted ? 'line-through text-zinc-400 dark:text-zinc-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
//               {task.title}
//             </span>
//             <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
//               {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//             </span>
//           </div>

//           {/* Progressive Disclosure: The "Why" and "Goal" */}
//           <div 
//             className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
//           >
//             <div className="overflow-hidden text-zinc-600 dark:text-zinc-400 space-y-3 pr-8">
//               <div>
//                 <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-1 block">The Why</span>
//                 <p className="text-sm leading-relaxed">{task.why}</p>
//               </div>
//               <div>
//                 <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-1 block">End Goal</span>
//                 <p className="text-sm leading-relaxed">{task.goal}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };