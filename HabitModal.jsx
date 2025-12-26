import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EMOJIS = ['🏃', '📚', '💧', '🧘', '🥦', '✍️', '🧗', '🐕', '🎸', '🌱', '🧹', '😴', '💻', '🔋', '🍎', '🎨', '🧠', '🚲'];

const HabitModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState(EMOJIS[0]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmoji(initialData.emoji);
        } else {
            setName('');
            setEmoji(EMOJIS[0]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name, emoji);
            setName('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">
                        {initialData ? 'Edit Habit' : 'Create New Habit'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                Habit Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Morning Run"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                autoFocus
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                                Choose Emoji
                            </label>
                            <div className="grid grid-cols-6 gap-2">
                                {EMOJIS.map((e) => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => setEmoji(e)}
                                        className={`text-2xl p-2 rounded-xl border-2 transition-all ${emoji === e
                                                ? 'bg-indigo-50 border-indigo-500 scale-110 shadow-sm'
                                                : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
                        >
                            {initialData ? 'Update Habit' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitModal;
