import GreenButton from "../GreenButton.jsx";
import RedButton from "../RedButton.jsx";

// button to select days 
const MultiSelectButton = ({ selectedDays, onToggleDay }) => {
	const dayLetters = [
		{ key: 'Sun', label: 'Sun' },
		{ key: 'Mon', label: 'Mon' },
		{ key: 'Tue', label: 'Tue' },
		{ key: 'Wed', label: 'Wed' },
		{ key: 'Thu', label: 'Thu' },
		{ key: 'Fri', label: 'Fri' },
		{ key: 'Sat', label: 'Sat' },
	];
	// map days to buttons, green if selected, red if not
	return (
		<ul className="flex flex-nowrap gap-2 p-2 overflow-x-auto">
            {dayLetters.map((day) => {
                const isSelected = selectedDays.includes(day.key);
                const ButtonComponent = isSelected ? GreenButton : RedButton;

                return (
					<li key={day.key} className="shrink-0">
						<ButtonComponent text={day.label} onClick={() => onToggleDay(day.key)} />
                    </li>
                );
            })}
        </ul>
	);
};

export default MultiSelectButton;
