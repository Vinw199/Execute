"use client";

import { Task } from "@/types";
import { useState } from "react";
import { Circle, CheckCircle2 } from 'lucide-react';

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
    <div className="group">
      <div className="flex items-start py-3 group">
        {/* Checkbox: Dedicated interaction zone */}
        <button 
          onClick={() => onToggle(task.id)}
          className="mt-0.5 mr-4 flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
          aria-label={isCompleted ? "Mark task incomplete" : "Mark task complete"}
        >
          {/* {isCompleted ? <CheckSquare size={24} className="text-zinc-400 dark:text-zinc-600" /> : <Square size={24} />} */}
          {isCompleted ? (
            <CheckCircle2 size={22} strokeWidth={1.5} className="text-stone-400" />
          ) : (
            <Circle size={22} strokeWidth={1.5} />
          )}
        </button>

        {/* Task Text: Expands accordion */}
        <div 
          className={`flex-grow select-none ${hasDetails ? 'cursor-pointer' : ''}`}
          onClick={handleToggleExpand}
          aria-expanded={isExpanded}
        >

          <div className="flex justify-between items-center">
            <span className={`text-[17px] transition-all duration-300 ${isCompleted ? 'line-through text-stone-400' : 'text-stone-700'}`}>
              {task.title}
            </span>
          </div>

          {/* Progressive Disclosure: The "Why" and "Goal" */}

          {hasDetails && !isCompleted && (
            <div 
              className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                {/* The subtle left border mimics a marginalia note */}
                <div className="ml-1 pl-4 border-l-[1.5px] border-stone-200 flex flex-col gap-1.5 py-1 mb-2">
                  {task.why_text && (
                    <p className="text-[15px] text-stone-500 italic leading-relaxed">
                      {task.why_text}
                    </p>
                  )}
                  {task.goal_text && (
                    <p className="text-[12px] text-stone-400 font-medium tracking-widest uppercase mt-1">
                      Target: {task.goal_text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};