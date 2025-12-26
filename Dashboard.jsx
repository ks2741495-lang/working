import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, AreaChart, Area } from 'recharts';
import { format, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { TrendingUp, CheckCircle2, XCircle, Award } from 'lucide-react';

const Dashboard = ({ habits, currentDate, weeks }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const totalPotentialCompletions = habits.length * monthDays.length;
    let totalCompletions = 0;

    habits.forEach(habit => {
        Object.keys(habit.completions).forEach(dateKey => {
            const date = new Date(dateKey);
            if (isSameMonth(date, currentDate)) {
                totalCompletions++;
            }
        });
    });

    const overallPercentage = totalPotentialCompletions > 0
        ? Math.round((totalCompletions / totalPotentialCompletions) * 100)
        : 0;

    const weeklyData = weeks.map((week, index) => {
        let completed = 0;
        const totalPossible = habits.length * week.days.length;

        habits.forEach(habit => {
            week.days.forEach(day => {
                const dateKey = format(day, 'yyyy-MM-dd');
                if (habit.completions[dateKey]) completed++;
            });
        });

        const percentage = totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0;
        return {
            name: `Week ${index + 1}`,
            percentage: percentage,
            completed,
            missed: totalPossible - completed
        };
    });

    const getQuote = (pct) => {
        if (pct >= 90) return "🔥 You're an absolute legend! Perfect consistency.";
        if (pct >= 75) return "🚀 Amazing work! You're crushing your goals.";
        if (pct >= 50) return "💪 Great steady progress. Keep the momentum going!";
        if (pct >= 25) return "📈 Moving in the right direction. Small steps matter.";
        return "🌱 Every day is a new chance to start. You've got this!";
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Award size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Monthly Success</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black">{overallPercentage}%</span>
                    </div>
                    <p className="mt-4 text-indigo-100 font-medium leading-relaxed">
                        {getQuote(overallPercentage)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                        <CheckCircle2 className="text-emerald-500" size={20} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-800">{totalCompletions}</span>
                        <span className="text-slate-400 font-medium">tasks</span>
                    </div>
                    <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${overallPercentage}%` }} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Missed</span>
                        <XCircle className="text-slate-300" size={20} />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-800">{totalPotentialCompletions - totalCompletions}</span>
                        <span className="text-slate-400 font-medium">tasks</span>
                    </div>
                    <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-300 rounded-full" style={{ width: `${100 - overallPercentage}%` }} />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-600" />
                        Weekly Completion Rate
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="percentage" radius={[8, 8, 8, 8]} barSize={40}>
                                    {weeklyData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.percentage > 70 ? '#6366f1' : entry.percentage > 40 ? '#818cf8' : '#cbd5e1'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-indigo-600" />
                        Consistency Trend
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="percentage"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorPct)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
