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
                                tasks.map((task, index) => (
                                    <Text key={`${day}-${index}`} style={styles.taskRow}>
                                        {index + 1}. {task.entry}
                                        {task.time ? ` — ${formatTime(task.time)}` : ''}
                                    </Text>
                                ))
                            )}
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
};

export default DownloadToDos;