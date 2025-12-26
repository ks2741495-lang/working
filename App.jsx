import React, { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, addMonths, subMonths } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, BarChart3, Settings2, Trash2 } from 'lucide-react';
import HabitTable from './components/HabitTable';
import Dashboard from './components/Dashboard';
import HabitModal from './components/HabitModal';
import { getMonthWeeks } from './utils/dateUtils';
import './App.css';

const STORAGE_KEY = 'habit-tracker-data';

const DEFAULT_HABITS = [
  { id: '1', name: 'Wake up at 6AM', emoji: '⏰', completions: {}, createdAt: new Date().toISOString() },
  { id: '2', name: 'Drink 3L Water', emoji: '💧', completions: {}, createdAt: new Date().toISOString() },
  { id: '3', name: 'Gym Workout', emoji: '🏋️‍♂️', completions: {}, createdAt: new Date().toISOString() },
  { id: '4', name: 'Meditation', emoji: '🧘', completions: {}, createdAt: new Date().toISOString() },
  { id: '5', name: 'Read 10 Pages', emoji: '📚', completions: {}, createdAt: new Date().toISOString() }
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const weeks = useMemo(() => getMonthWeeks(currentDate), [currentDate]);

  const addHabit = (name, emoji) => {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      emoji,
      completions: {},
      createdAt: new Date().toISOString()
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (id, name, emoji) => {
    setHabits(habits.map(h => h.id === id ? { ...h, name, emoji } : h));
  };

  const deleteHabit = (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const toggleCompletion = (habitId, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newCompletions = { ...h.completions };
        if (newCompletions[dateKey]) {
          delete newCompletions[dateKey];
        } else {
          newCompletions[dateKey] = true;
        }
        return { ...h, completions: newCompletions };
      }
      return h;
    }));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <span className="bg-indigo-600 text-white p-1 rounded-lg">✨</span>
              HabitFlow
            </h1>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 font-medium min-w-[140px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </span>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showDashboard
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                } shadow-sm`}
            >
              <BarChart3 size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Habit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6">
        {showDashboard ? (
          <Dashboard habits={habits} currentDate={currentDate} weeks={weeks} />
        ) : (
          <HabitTable
            habits={habits}
            weeks={weeks}
            currentDate={currentDate}
            onToggle={toggleCompletion}
            onEdit={(h) => { setEditingHabit(h); setIsModalOpen(true); }}
            onDelete={deleteHabit}
          />
        )}
      </main>

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingHabit(null); }}
        onSave={(name, emoji) => {
          if (editingHabit) {
            updateHabit(editingHabit.id, name, emoji);
          } else {
            addHabit(name, emoji);
          }
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        initialData={editingHabit}
      />
    </div>
  );
}

export default App;
