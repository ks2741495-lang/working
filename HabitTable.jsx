import { format, isSameDay, isToday, isSameMonth } from 'date-fns';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const HabitTable = ({ habits, weeks, currentDate, onToggle, onEdit, onDelete }) => {
    if (habits.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">No habits tracked yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">
                    Start by adding a new habit to track your progress throughout the month.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="sticky left-0 z-20 bg-slate-50/50 p-4 text-left border-b border-r border-slate-200 min-w-[200px]">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Habit</span>
                            </th>
                            {weeks.map((week, wIndex) => (
                                <th key={wIndex} className="p-0 border-b border-r border-slate-200 last:border-r-0">
                                    <div className="text-center py-2 bg-slate-100/50 border-b border-slate-200">
                                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Week {wIndex + 1}</span>
                                    </div>
                                    <div className="flex">
                                        {week.days.map((day, dIndex) => (
                                            <div
                                                key={dIndex}
                                                className={cn(
                                                    "flex-1 min-w-[40px] py-2 text-center flex flex-col items-center justify-center border-r border-slate-100 last:border-r-0",
                                                    !isSameMonth(day, currentDate) && "opacity-25"
                                                )}
                                            >
                                                <span className="text-[10px] font-medium text-slate-400 uppercase">{format(day, 'EEE')}</span>
                                                <span className={cn(
                                                    "text-xs font-bold mt-0.5",
                                                    isToday(day) ? "bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200" : "text-slate-700"
                                                )}>
                                                    {format(day, 'd')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 border-b border-slate-200 min-w-[80px]">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stats</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map((habit) => {
                            const totalDays = weeks.flatMap(w => w.days).length;
                            const completedDays = Object.keys(habit.completions).length;
                            const percentage = Math.round((completedDays / totalDays) * 100) || 0;

                            return (
                                <tr key={habit.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/30 p-4 border-b border-r border-slate-200 transition-colors">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{habit.emoji}</span>
                                                <span className="font-semibold text-slate-700">{habit.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEdit(habit)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(habit.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    {weeks.map((week, wIndex) => (
                                        <td key={wIndex} className="p-0 border-b border-r border-slate-200 last:border-r-0">
                                            <div className="flex h-full">
                                                {week.days.map((day, dIndex) => {
                                                    const dateKey = format(day, 'yyyy-MM-dd');
                                                    const isCompleted = habit.completions[dateKey];
                                                    const dayInMonth = isSameMonth(day, currentDate);

                                                    return (
                                                        <div
                                                            key={dIndex}
                                                            className={cn(
                                                                "flex-1 min-w-[40px] py-3 flex items-center justify-center border-r border-slate-50 last:border-r-0",
                                                                !dayInMonth && "bg-slate-50/50"
                                                            )}
                                                        >
                                                            <button
                                                                onClick={() => onToggle(habit.id, day)}
                                                                disabled={!dayInMonth}
                                                                className={cn(
                                                                    "w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center transform active:scale-90",
                                                                    isCompleted
                                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                                                                        : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm",
                                                                    !dayInMonth && "opacity-20 cursor-not-allowed scale-75"
                                                                )}
                                                            >
                                                                {isCompleted && (
                                                                    <svg className="w-4 h-4 animate-in zoom-in duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    ))}
                                    <td className="p-4 border-b border-slate-200">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
                                            <div className="w-12 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HabitTable;
