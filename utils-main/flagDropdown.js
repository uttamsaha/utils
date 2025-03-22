import lookup from 'country-code-lookup';
import ReactFlagsSelect from "react-flags-select";
import { DownArrow } from "@/assets/icons";
import Label from './Label';

const SelectCountry = ({ setSelected, selected }) => {
    // lookup.byCountry() --- get country code
    return (
        <div className=''>
            <Label text={"Country"} />
            <div className='relative w-full border border-[var(--border-primary-color)] rounded-[6px] md:rounded-[4px] px-[7px] md:px-[10px]'>
                <ReactFlagsSelect
                    selected={selected}
                    onSelect={(value) => setSelected(value)}
                    placeholder="Select Country"
                    searchable
                    searchPlaceholder="Search countries"
                    className='hi'
                />
                <p className='absolute right-1 top-1/2 -translate-y-1/2 mt-[-2px] flex items-center justify-end pr-1'><DownArrow /></p>
            </div>
        </div>
    )
}
export default SelectCountry;

//call
<SelectCountry
          setSelected={setSelectedCountry}
          selected={selectedCountry}
        />

              const [selectedCountry, setSelectedCountry] = useState("");
