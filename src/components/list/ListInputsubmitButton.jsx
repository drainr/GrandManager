// this is the enter button to append input to list

import BlueButton from '../BlueButton.jsx';

const Submit = ({ onClick }) => {
	return (
		<div className="mt-2">
			<BlueButton text="ENTER" onClick={onClick} />
		</div>
	);
};

export default Submit;
