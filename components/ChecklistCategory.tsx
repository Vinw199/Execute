import { Task, Category } from "@/types";
import { TaskItem } from "./TaskItem";

interface ChecklistCategoryProps {
  title: Category;
  tasks: Task[];
  completedTasks: string[];
  onToggleTask: (id: string) => void;
}

export const ChecklistCategory: React.FC<ChecklistCategoryProps> = ({ title, tasks, completedTasks, onToggleTask }) => {
  const categoryTasks = tasks.filter(t => t.category === title);
  const completedCount = categoryTasks.filter(t => completedTasks.includes(t.id)).length;

  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-2 border-b-2 border-zinc-900 dark:border-zinc-100 pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">{title}</h2>
        <span className="text-sm font-medium text-zinc-500">
          {completedCount} / {categoryTasks.length}
        </span>
      </div>
      <div className="flex flex-col">
        {categoryTasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            isCompleted={completedTasks.includes(task.id)}
            onToggle={onToggleTask}
          />
        ))}
      </div>
    </div>
  );
};