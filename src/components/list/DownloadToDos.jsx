import React from 'react';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 32,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 10,
        marginBottom: 18,
        textAlign: 'center',
        color: '#666',
    },
    daySection: {
        marginBottom: 14,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    dayTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#364A85',
    },
    taskRow: {
        marginLeft: 10,
        marginBottom: 5,
        fontSize: 11,
        lineHeight: 1.5,
    },
    emptyText: {
        fontSize: 10,
        color: '#888',
        marginLeft: 10,
        fontStyle: 'italic',
    },
});

const DAY_ORDER = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const formatTime = (time) => {
    if (!time) return '';

    const [hourStr, minuteStr] = time.split(':');
    const hourNum = Number(hourStr);
    const minute = minuteStr ?? '00';

    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const twelveHour = hourNum % 12 || 12;

    return `${twelveHour}:${minute} ${ampm}`;
};

const getTaskName = (task) => {
    if (typeof task === 'string') {
        const trimmed = task.trim();
        return trimmed || 'Untitled task';
    }

    if (!task || typeof task !== 'object') {
        return 'Untitled task';
    }

    const rawName = task.entry ?? task.text ?? task.name ?? task.title ?? task.task ?? task.label ?? task.value;
    if (typeof rawName === 'string' && rawName.trim()) {
        return rawName.trim();
    }

    return 'Untitled task';
};

const getTaskTime = (task) => {
    if (!task || typeof task !== 'object') return '';
    return task.time ?? task.dueTime ?? '';
};

const DownloadToDos = ({ groupedEntries = {}, listTitle = "Weekly To-Do List" }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>{listTitle}</Text>

                {DAY_ORDER.map((day) => {
                    const tasks = groupedEntries[day] || [];

                    return (
                        <View key={day} style={styles.daySection}>
                            <Text style={styles.dayTitle}>{day}</Text>

                            {tasks.length === 0 ? (
                                <Text style={styles.emptyText}>No tasks</Text>
                            ) : (
                                tasks.map((task, index) => {
                                    const taskName = getTaskName(task);
                                    const taskTime = getTaskTime(task);

                                    return (
                                        <Text key={`${day}-${index}`} style={styles.taskRow}>
                                            {index + 1}. {taskName}
                                            {taskTime ? ` - ${formatTime(taskTime)}` : ''}
                                        </Text>
                                    );
                                })
                            )}
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
};

export default DownloadToDos;