import BlueButton from '../BlueButton.jsx';

const SubmitButton = ({ onSubmit }) => {
  return (
    <section className="mt-2">
      <BlueButton text="ENTER" onClick={onSubmit} />
    </section>
  );
};

export default SubmitButton;
