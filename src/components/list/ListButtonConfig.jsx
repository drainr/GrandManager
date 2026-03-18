import BlueButton from '../BlueButton.jsx';

const ListButtonConfig = ({ value, onChange, onSubmit }) => {
  return (
    <div className="list-input-section w-full flex-1">
      <section className="list-input-textarea-section">
        <textarea
          placeholder="HEY THERE! CLICK AND START TYPING HERE TO ADD TO YOUR TO DO LIST"
          className="list-Input text-black placeholder-gray-400"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        ></textarea>
      </section>

      {/* button for submitting the list */}
      <section className="list-input-submit-section mt-2">
        <BlueButton text="ENTER" onClick={onSubmit} />
      </section>
    </div>
  );
};

export default ListButtonConfig;