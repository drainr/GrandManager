import { useState } from 'react';

const MultiSelectButton = () => {
	const dayLetters = [
		{ key: 'Sunday', label: 'S' },
		{ key: 'Monday', label: 'M' },
		{ key: 'Tuesday', label: 'T' },
		{ key: 'Wednesday', label: 'W' },
		{ key: 'Thursday', label: 'T' },
		{ key: 'Friday', label: 'F' },
		{ key: 'Saturday', label: 'S' },
	];
	const [selectedDays, setSelectedDays] = useState([]);

	const toggleDay = (dayKey) => {
		setSelectedDays((prevSelected) =>
			prevSelected.includes(dayKey)
				? prevSelected.filter((d) => d !== dayKey)
				: [...prevSelected, dayKey]
		);
	};

	return (
		<ul className="menu menu-horizontal flex-nowrap bg-base-200 rounded-box">
			{dayLetters.map((day) => (
				<li key={day.key}>
					<button
						type="button"
						onClick={() => toggleDay(day.key)}
						aria-pressed={selectedDays.includes(day.key)}
						className={
							selectedDays.includes(day.key)
								? 'btn btn-md px-5 py-3 text-base bg-success! border-success! text-white!'
								: 'btn btn-md px-5 py-3 text-base bg-white! border border-gray-300! text-success! hover:bg-success! hover:text-white!'
						}
					>
						{day.label}
					</button>
				</li>
			))}
		</ul>
	);
};

export default MultiSelectButton;
