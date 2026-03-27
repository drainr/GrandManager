import SubmitButton from './SubmitButton.jsx';
import SetTime from './settime.jsx';

const ListButtonConfig = ({ value, onChange, onSubmit, timeValue, onTimeChange }) => {
  return (
    <div className="flex w-full flex-1 flex-col items-start">
      <section className="w-full">
        <textarea
          placeholder="HEY THERE! CLICK AND START TYPING HERE"
          className="block w-full rounded-xl p-5 text-left text-white bg-[#364A85] placeholder-gray-400"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        ></textarea>
      </section>

      <section className="mt-2 flex items-center gap-2">
        <SetTime value={timeValue} onChange={onTimeChange} />
        <SubmitButton onSubmit={onSubmit} />
      </section>


      
    </div>
  );
};

export default ListButtonConfig;