import { useEffect, useState } from 'react';

const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toTwoDigits = (value) => String(value).padStart(2, '0');

// Reusable time UI: input mode (before submit) and display mode (after submit).
const SetTime = ({ value, onChange, showInput = true, dayName }) => {
	const [nowMs, setNowMs] = useState(null);

	// Only run a 1s clock tick when rendering countdown/days-remaining output.
	useEffect(() => {
		if (showInput) {
			return undefined;
		}

		const timer = setInterval(() => {
			setNowMs(Date.now());
		}, 1000);

		return () => clearInterval(timer);
	}, [showInput]);

	const hasTime = Boolean(value);
	let remainingSeconds = null;
	let daysRemaining = null;

	// Compute either same-day countdown seconds OR days until the selected weekday.
	if (hasTime && nowMs !== null && dayName && DAYS_FULL.includes(dayName)) {
		const todayIndex = new Date(nowMs).getDay();
		const selectedDayIndex = DAYS_FULL.indexOf(dayName);

		if (selectedDayIndex !== todayIndex) {
			daysRemaining = (selectedDayIndex - todayIndex + 7) % 7;
		} else {
			const [hoursText, minutesText] = value.split(':');
			const hours = Number(hoursText);
			const minutes = Number(minutesText);

			if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
				const now = new Date(nowMs);
				const target = new Date(nowMs);
				target.setHours(hours, minutes, 0, 0);
				remainingSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
			}
		}
	}

	const safeSeconds = Math.max(0, remainingSeconds ?? 0);
	const hours = Math.floor(safeSeconds / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const seconds = safeSeconds % 60;
	const hasCountdown = hasTime && typeof remainingSeconds === 'number';
	const isLate = hasCountdown && remainingSeconds <= 0;
	const showDaysRemaining = hasTime && !hasCountdown && typeof daysRemaining === 'number' && daysRemaining > 0;

	// Render: time input OR countdown/LATE/days-remaining output.
	return (
		<div className="flex items-center gap-3">
			{showInput && (
				<input
					type="time"
					className="input h-14 min-w-44 rounded-lg border-gray-300 bg-white px-4 text-2xl font-semibold text-black [color-scheme:light]"
					value={value}
					onChange={onChange}
				/>
			)}

			{/* Same-day live HH:MM:SS */}
			{hasCountdown && !isLate && (
				<span className="countdown font-mono text-4xl text-white">
					<span style={{ '--value': hours }} aria-live="polite" aria-label={`${hours}`}>
						{toTwoDigits(hours)}
					</span>
					:
					<span style={{ '--value': minutes }} aria-live="polite" aria-label={`${minutes}`}>
						{toTwoDigits(minutes)}
					</span>
					:
					<span style={{ '--value': seconds, '--digits': 2 }} aria-live="polite" aria-label={`${seconds}`}>
						{toTwoDigits(seconds)}
					</span>
				</span>
			)}

			{/* Same-day timer expired */}
			{hasCountdown && isLate && <span className="font-mono text-3xl font-extrabold text-red-300">LATE</span>}

			{/* Not today's day: show distance in days */}
			{showDaysRemaining && (
				<span className="font-mono text-2xl font-bold text-yellow-200">
					{daysRemaining} {daysRemaining === 1 ? 'DAY' : 'DAYS'} REMAINING
				</span>
			)}
		</div>
	);
};

export default SetTime;
