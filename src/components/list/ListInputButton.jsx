const ListInput = ({ value, onChange }) => {
  return (
    <div className="w-full flex-1">
      <textarea
        placeholder="HEY THERE! CLICK AND START TYPING HERE TO ADD TO YOUR TO DO LIST"
        className="list-Input text-black placeholder-gray-400"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      ></textarea>
    </div>
  );
};

export default ListInput;