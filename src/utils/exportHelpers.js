// src/utils/exportHelpers.js

// Group entries by day
export function groupEntriesByDay(entries) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const grouped = {};
  days.forEach(day => grouped[day] = []);
  if (entries) {
    Object.values(entries).forEach(entry => {
      if (entry.day) grouped[entry.day].push(entry);
    });
  }
  return grouped;
}

// Format grouped entries as JSON
export function formatExportJSON(entries) {
  return JSON.stringify(entries, null, 2);
}

// Format grouped entries as text (legacy)
export function formatExportText(grouped) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let maxTask = 4, maxTime = 4, maxTimer = 5;
  days.forEach(day => {
    grouped[day].forEach(entry => {
      const task = entry.text || '';
      const time = entry.time || '';
      if (task.length > maxTask) maxTask = task.length;
      if (time.length > maxTime) maxTime = time.length;
    });
  });
  let output = '';
  days.forEach((day, idx) => {
    if (grouped[day].length > 0) {
      output += ' task'.padEnd(maxTask+2) + 'time'.padEnd(maxTime+2) + 'timer'.padEnd(maxTimer+2) + '\n';
      grouped[day].forEach(entry => {
        const task = (entry.text || '').padEnd(maxTask+2);
        const time = (entry.time || '').padEnd(maxTime+2);
        output += `${task}${time}\n`;
      });
      output += '\n';
      if (idx < days.length - 1) {
        output += '~~~~~\n\n';
      }
    }
  });
  return output;
}