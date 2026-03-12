import { useState } from 'react';
import GreenButton from "../GreenButton.jsx";
import RedButton from "../RedButton.jsx";

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
        <ul className="flex gap-2 bg-[#1B2851] p-2 overflow-x-auto">
            {dayLetters.map((day) => {
                const isSelected = selectedDays.includes(day.key);
                const ButtonComponent = isSelected ? RedButton : GreenButton;

                return (
                    <li key={day.key}>
                        <ButtonComponent text={day.label} onClick={() => toggleDay(day.key)} />
                    </li>
                );
            })}
        </ul>
	);
};

export default MultiSelectButton;
