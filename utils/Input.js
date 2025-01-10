  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();


    <FormInput
          label="Cable Requirement"
          name="a"
          register={register}
          errors={errors}
          placeholder="Input"
          type="text"
        />


            

const FormInput = ({
  disabled = false,
  label,
  name,
  register,
  errors,
  validation,
  placeholder,
  type = 'text',
  customClass = '',
  onChange // New onChange prop
}) => {
  // Register the input only once when the component mounts
  const inputProps = register(name, validation);

  // Create a handler that combines the onChange from register and the passed onChange
  const handleChange = (e) => {
    if (onChange) {
      onChange(e); // Call the custom onChange if it exists
    }
    inputProps.onChange(e); // Call the original onChange from register
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-xs leading-4 font-medium text-black-80 mb-1">
          {label}
        </label>
      )}
      <input
        disabled={disabled}
        type={type}
        placeholder={placeholder || label}
        className={`input ${errors[name] ? 'danger-border' : ''} w-full ${customClass}`}
        {...inputProps} // Spread inputProps here
        onChange={handleChange} // Use handleChange here
      />
      {errors[name] && (
        <span className="text-xs text-red-500  mt-0.5">{errors[name].message}</span>
      )}
    </div>
  );
};

export default FormInput;
