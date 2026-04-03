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
                entry: item.entry || item.text || item.name || item.title || '',
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
                const taskName = typeof task === 'string'
                    ? (task.trim() || 'Untitled task')
                    : (task.entry || task.text || task.name || task.title || task.task || task.label || task.value || 'Untitled task');
                const taskTime = typeof task === 'object' && task !== null
                    ? (task.time || task.dueTime || '')
                    : '';
                const timeText = taskTime ? ` (${taskTime})` : '';
                return `${index + 1}. ${taskName}${timeText}`;
            });

            return `${day}:\n${lines.join('\n')}`;
        })
        .join('\n\n');
};