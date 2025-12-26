import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek, isSameMonth, eachWeekOfInterval } from 'date-fns';

export const getMonthDays = (currentDate) => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
};

export const getMonthWeeks = (currentDate) => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    // Get all weeks that have at least one day in this month
    const weeks = eachWeekOfInterval({
        start: startOfWeek(start, { weekStartsOn: 1 }),
        end: endOfWeek(end, { weekStartsOn: 1 })
    }, { weekStartsOn: 1 });

    return weeks.map(weekStart => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

        // Filter days to only include those in the current month for counting/display if needed
        // But usually for a habit tracker grid, we want the full 7 days of each week that overlaps
        return {
            start: weekStart,
            days: days
        };
    });
};

export const calculateProgress = (habit, days) => {
    if (!days || days.length === 0) return 0;
    const completed = days.filter(day => {
        const key = format(day, 'yyyy-MM-dd');
        return habit.completions && habit.completions[key];
    }).length;
    return (completed / days.length) * 100;
};
