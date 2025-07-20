import "./searchBar.css";
import { useState, useEffect } from "react";


// importing images
import closeIcon from "/images/interface icons/close icon.svg";
import searchIcon from "/images/interface icons/search icon.svg";



function SearchBar({ width, height, borderColor = "var(--greyish)", onSearch, value, showClearBtn = true, style = {} }) {
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (value !== undefined) {
            setSearchValue(value);
        }
    }, [value]);


    // Pass search value to parent component
    const handleSearch = () => {
        if (searchValue.trim() && onSearch) onSearch(searchValue);  // Call the parent's function
    };

    const clearSearch = () => {
        setSearchValue("");
        if (onSearch) onSearch("");
    }

    return (
        <div className="search-bar"
            style={{
                "--bar-width": width,
                "--bar-height": height,
                "--border-color": borderColor,
                ...style
            }}
        >
            <input type="text" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />


            {showClearBtn && (searchValue !== "") &&
                <img onClick={clearSearch} className="sb-clear-btn" src={closeIcon} alt="" />}

            <img onClick={handleSearch} src={searchIcon} alt="search" />

        </div>
    );
}

export default SearchBar;