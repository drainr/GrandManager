import BlueButton from '../BlueButton.jsx';

const ListButtonConfig = ({ value, onChange, onSubmit }) => {
  return (
    <div className="w-full flex-1">
      <section>
        <textarea
          placeholder="HEY THERE! CLICK AND START TYPING HERE TO ADD TO YOUR TO DO LIST"
          className="text-white bg-[#364A85] placeholder-gray-400"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        ></textarea>
      </section>

      {/* button for submitting the list */}
      <section className="mt-2">
        <BlueButton text="ENTER" onClick={onSubmit} />
      </section>


      
    </div>
  );
};

export default ListButtonConfig;