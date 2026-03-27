import { useEffect, useState } from 'react';

const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toTwoDigits = (value) => String(value).padStart(2, '0');

// Reusable time UI: input mode (before submit) and display mode (after submit).
const SetTime = ({ value, onChange, showInput = true, dayName }) => {
	const [nowMs, setNowMs] = useState(() => Date.now());

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
	const [hoursText = '', minutesText = ''] = (value || '').split(':');
	const inputHours = Number(hoursText);
	const inputMinutes = Number(minutesText);
	const hasValidTime =
		hasTime &&
		!Number.isNaN(inputHours) &&
		!Number.isNaN(inputMinutes) &&
		inputHours >= 0 &&
		inputHours <= 23 &&
		inputMinutes >= 0 &&
		inputMinutes <= 59;

	let remainingSeconds = null;
	let rawDiffSeconds = null;

	if (!showInput && hasValidTime && dayName && DAYS_FULL.includes(dayName)) {
		const now = new Date(nowMs);
		const selectedDayIndex = DAYS_FULL.indexOf(dayName);
		const dayOffset = (selectedDayIndex - now.getDay() + 7) % 7;

		const target = new Date(nowMs);
		target.setDate(now.getDate() + dayOffset);
		target.setHours(inputHours, inputMinutes, 0, 0);

		// Only if the target is today and in the past, move to next week
		if (dayOffset === 0 && target.getTime() <= now.getTime()) {
			target.setDate(target.getDate() + 7);
		}

		rawDiffSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
		remainingSeconds = Math.max(0, rawDiffSeconds);
	}

	const safeSeconds = Math.max(0, remainingSeconds ?? 0);
	const days = Math.floor(safeSeconds / 86400);
	const hours = Math.floor((safeSeconds % 86400) / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const seconds = safeSeconds % 60;
	const hasCountdown = !showInput && hasValidTime && typeof remainingSeconds === 'number';
	const isLate = hasCountdown && typeof rawDiffSeconds === 'number' && rawDiffSeconds <= 0;

	// Render: time input OR live day/hour/minute/second countdown.
	return (
		<div className="flex flex-col items-start gap-1">
			<div className="flex items-center gap-3">
				{showInput && (
					<input
						type="time"
						className="input h-14 min-w-44 rounded-lg border-gray-300 bg-white px-4 text-2xl font-semibold text-black [color-scheme:light]"
						value={value}
						onChange={onChange}
					/>
				)}

				{hasCountdown && !isLate && (
					<span className="font-mono text-sm font-bold text-yellow-200" aria-live="polite">
						{days}D {toTwoDigits(hours)}H {toTwoDigits(minutes)}M {toTwoDigits(seconds)}S
					</span>
				)}

				{isLate && <span className="font-mono text-sm font-extrabold text-red-300">LATE</span>}
			</div>
			{/* Show the exact chosen time below the countdown in 12-hour format with AM/PM */}
			{!showInput && hasValidTime && (
				<span className="text-xs text-gray-200 mt-1">
					Time set: {(() => {
						let hour = inputHours % 12 || 12;
						let minute = toTwoDigits(inputMinutes);
						let ampm = inputHours < 12 ? 'AM' : 'PM';
						return `${hour}:${minute} ${ampm}`;
					})()}
				</span>
			)}
		</div>
	);
};

export default SetTime;
