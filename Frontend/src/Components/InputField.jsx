const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  textarea,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          required
          placeholder={placeholder}
          className="
            w-full rounded-lg border border-gray-300
            px-4 py-3 text-sm resize-none
            focus:outline-none focus:ring-2
            focus:ring-indigo-500/40
          "
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="
            w-full rounded-lg border border-gray-300
            px-4 py-3 text-sm
            focus:outline-none focus:ring-2
            focus:ring-indigo-500/40
          "
        />
      )}
    </div>
  );
};

export default InputField;