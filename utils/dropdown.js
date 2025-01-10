//dropdown
"use client"
import { Select } from "antd";
import Label from "./Label";
import { ErrorText } from "@/utils/ErrorText";

const Dropdown = ({
    readOnly = false,
    searchBy,
    fieldName,
    error = false,
    secondSearchBy = "",
    label = "",
    options = [],
    placeholder = "Select",
    dropdownValues,
    setDropdownValues,
    clearError // New prop to clear the error
}) => {
    const showedOptions = options.map(option => ({
        value: option[searchBy],
        label: option[searchBy] || option[secondSearchBy],
        fullOption: option, // Store the full option object
    }));

    const handleChange = (value, option) => {
        const selectedOption = showedOptions.find(opt => opt?.value === value)?.fullOption;

        if (selectedOption) {
            setDropdownValues(prevValues => ({
                ...prevValues,
                [fieldName]: selectedOption,
            }));
            if (clearError) {
                clearError(fieldName); // Clear error when an option is selected
            }
        }
    };

    return (
        <div className={`select-tag w-full ${label && 'flex flex-col'}`}>
            {label && <Label text={label} customClass="" />}
            <Select
                disabled={readOnly}
                showSearch
                style={{ width: '100%' }}
                placeholder={placeholder}
                optionFilterProp={searchBy}
                filterOption={(input, option) => {
                    const optionLabel = option.label ? String(option.label).toLowerCase() : '';
                    return optionLabel.indexOf(input.toLowerCase()) >= 0;
                }}
                options={showedOptions}
                onChange={handleChange}
                className="select-custom"
                status={error ? "error" : ''}
                value={
                    dropdownValues?.[fieldName]?.[searchBy]
                        ? dropdownValues?.[fieldName]?.[searchBy]
                        : dropdownValues?.[searchBy]
                            ? dropdownValues?.[searchBy]
                            : typeof dropdownValues === 'string'
                                ? dropdownValues
                                : null
                }
            />
            {error && <ErrorText errText={"Please select an option"} />}
        </div>
    );
};

export default Dropdown;


//call
const [dropdownValue, setDropdownValue] = useState(null);
  const pops = [{ name: "Days" }, { name: "Week" }, { name: "Month" }];
  const clearError = (fieldName) => {
    setDropdownErr((prevErr) => ({
      ...prevErr,
      [`${fieldName}Err`]: false, // Clear error for the specific dropdown
    }));
  };
  const [dropdownErr, setDropdownErr] = useState({
    popErr: false,
  });

  const onSubmit = (data) => {
    if (!dropdownValue?.pop?.name) {
      console.log("test");
      setDropdownErr((prevErr) => ({
        ...prevErr,
        popErr: true,
      }));
    }
    console.log(data);
  };

const handleDeleteModal = () => {
    setOpenDeleteModal(true);
    triggerToast('Password reset Successfully done.', 'failed')
    setModalContent(
      React.cloneElement(<DeleteModalContent setOpen={setOpenDeleteModal} />, {
        key: new Date().getTime(),
      })
    );
  };

    <Dropdown
            setDropdownValues={setDropdownValue}
            dropdownValues={dropdownValue}
            options={pops || []}
            searchBy={"name"}
            label={"Select Value"}
            fieldName="pop"
            clearError={clearError}
            error={dropdownErr?.popErr}
          />
