import React from 'react';

import { getDatabase, ref, get } from 'firebase/database';
import { useAuth } from '../../hooks/useAuth';
import YellowButton from '../YellowButton';

const Export = () => {
  const { user } = useAuth();

  const handleExport = async () => {
    if (!user) return;
    const db = getDatabase();
    const userRef = ref(db, `lists/${user.uid}`);
    const snapshot = await get(userRef);
    const data = snapshot.exists() ? snapshot.val() : {};
    // Group entries by day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const grouped = {};
    days.forEach(day => grouped[day] = []);
    if (data.entries) {
      Object.values(data.entries).forEach(entry => {
        if (entry.day) grouped[entry.day].push(entry);
      });
    }
    // Find max lengths for alignment
    let maxTask = 4, maxTime = 4, maxTimer = 5; // headers: task, time, timer
    days.forEach(day => {
      grouped[day].forEach(entry => {
        const task = entry.text || '';
        const time = entry.time ? to12Hour(entry.time) : '';
        const timer = getTimer(entry.day, entry.time);
        if (task.length > maxTask) maxTask = task.length;
        if (time.length > maxTime) maxTime = time.length;
        if (timer.length > maxTimer) maxTimer = timer.length;
      });
    });
    // Format as requested
    let output = '';
    days.forEach((day, idx) => {
      if (grouped[day].length > 0) {
        output += ' task'.padEnd(maxTask+2) + 'time'.padEnd(maxTime+2) + 'timer'.padEnd(maxTimer+2) + '\n';
        grouped[day].forEach(entry => {
          const task = (entry.text || '').padEnd(maxTask+2);
          const time = (entry.time ? to12Hour(entry.time) : '').padEnd(maxTime+2);
          const timer = getTimer(entry.day, entry.time).padEnd(maxTimer+2);
          output += `${task}${time}${timer}\n`;
        });
        output += '\n'; // Add a new line after the header and all tasks
        if (idx < days.length - 1) {
          output += '~~~~~\n\n';
        }
      }
    });
    // Download as .txt
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_tasks_export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function to12Hour(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const hour = h % 12 || 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  function getTimer(day, time) {
    if (!day || !time) return '';
    const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const selectedDayIndex = DAYS_FULL.indexOf(day);
    if (selectedDayIndex === -1) return '';
    const dayOffset = (selectedDayIndex - now.getDay() + 7) % 7;
    const [inputHours, inputMinutes] = time.split(':').map(Number);
    const target = new Date(now);
    target.setDate(now.getDate() + dayOffset);
    target.setHours(inputHours, inputMinutes, 0, 0);
    if (dayOffset === 0 && target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 7);
    }
    let diff = Math.floor((target.getTime() - now.getTime()) / 1000);
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <YellowButton text="Export" onClick={handleExport} />
  );
}

export default Export;
