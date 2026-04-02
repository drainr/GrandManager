export const groupEntriesByDay = (entries = {}) => {
    const grouped = {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
    };

    Object.values(entries).forEach((item) => {
        if (item.day && grouped[item.day]) {
            grouped[item.day].push({
                entry: item.entry || '',
                time: item.time || '',
            });
        }
    });

    return grouped;
};

export const formatExportText = (groupedEntries = {}) => {
    return Object.entries(groupedEntries)
        .map(([day, tasks]) => {
            if (!tasks.length) return `${day}:\n- No tasks`;

            const lines = tasks.map((task, index) => {
                const timeText = task.time ? ` (${task.time})` : '';
                return `${index + 1}. ${task.entry}${timeText}`;
            });

            return `${day}:\n${lines.join('\n')}`;
        })
        .join('\n\n');
};