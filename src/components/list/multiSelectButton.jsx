import GreenButton from "../GreenButton.jsx";
import RedButton from "../RedButton.jsx";

const MultiSelectButton = ({ selectedDays, onToggleDay }) => {
	const dayLetters = [
		{ key: 'Sunday', label: 'S' },
		{ key: 'Monday', label: 'M' },
		{ key: 'Tuesday', label: 'T' },
		{ key: 'Wednesday', label: 'W' },
		{ key: 'Thursday', label: 'T' },
		{ key: 'Friday', label: 'F' },
		{ key: 'Saturday', label: 'S' },
	];

	return (
        <ul className="flex gap-2 bg-[#1B2851] p-2 overflow-x-auto">
            {dayLetters.map((day) => {
                const isSelected = selectedDays.includes(day.key);
                const ButtonComponent = isSelected ? RedButton : GreenButton;

                return (
                    <li key={day.key}>
						<ButtonComponent text={day.label} onClick={() => onToggleDay(day.key)} />
                    </li>
                );
            })}
        </ul>
	);
};

export default MultiSelectButton;
