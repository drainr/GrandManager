import BlueButton from '../BlueButton.jsx';

const SubmitButton = ({ onSubmit }) => {
  return (
    <section className="flex items-center">
      <BlueButton text="ENTER" onClick={onSubmit} />
    </section>
  );
};

export default SubmitButton;
