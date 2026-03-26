import SubmitButton from './SubmitButton.jsx';
import SetTime from './settime.jsx';

const ListButtonConfig = ({ value, onChange, onSubmit, timeValue, onTimeChange }) => {
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

      <section className="mt-2 flex items-center gap-2">
        <SubmitButton onSubmit={onSubmit} />
        <SetTime value={timeValue} onChange={onTimeChange} />
      </section>


      
    </div>
  );
};

export default ListButtonConfig;