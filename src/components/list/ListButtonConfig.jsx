import SubmitButton from './SubmitButton.jsx';

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

      <SubmitButton onSubmit={onSubmit} />


      
    </div>
  );
};

export default ListButtonConfig;