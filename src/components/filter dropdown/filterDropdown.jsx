import "./filterDropdown.css";
import { useState } from "react";



// importing images
import filterIcon from "/images/interface icons/filter icon.svg";
import closeIcon from "/images/interface icons/close icon.svg";




function FilterDropdown() {

    const [showFilter, setShowFilter] = useState(false);

    const [selectedOption, setSelectedOption] = useState("");
    const options = ["Price", "Mileage", "Petrol", "EVs", "Scooter", "Motorbike", "None"];

    return (
        <div className="filter-dropdown" >
            <img onClick={() => setShowFilter(!showFilter)} className={showFilter ? "filter-dropdown-icon-hide" : "filter-dropdown-icon"} src={filterIcon} alt="filter-dropdown" />


            <div className={showFilter ? "filter-dropdown-container fd-active" : "filter-dropdown-container"}>
                <div className="fd-top-section">
                    <p>Filter By</p>
                    <div className="fd-close-btn" onClick={() => setShowFilter(!showFilter)}>
                        <img src={closeIcon} alt="" />
                    </div>
                </div>
                <div className="fd-bottom-section placeCenter-column">
                    {options.map((option) => (
                        <label
                            key={option}
                            className={`filter-label ${selectedOption === option ? "fd-active" : ""}`}
                            onClick={() => setSelectedOption(option)}
                        >
                            {option}
                            <input
                                type="radio"
                                name="filter-option"
                                value={option}
                                checked={selectedOption === option}
                                onChange={() => setSelectedOption(option)}
                            />
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FilterDropdown;