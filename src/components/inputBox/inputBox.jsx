import "./inputBox.css";
import { useState } from "react";

// importing images
import eyeOpenIcon from "/images/interface icons/eye-open icon.svg";
import eyeCloseIcon from "/images/interface icons/eye-close icon.svg";




//the value of the input can be accessed by the variable 'inputValue'
//typeName: type of input box (text, password, email, etc.)
//labelName: label of input box
//colorValue: color of input box


function InputBox({
    typeName = "text",
    labelName = "Label",
    activeColorValue = "#000",
    defaultColorValue = "#434343",
    placeholder = " ",
    className = "",
    width,
    height = "50px",
    borderRadius,
    borderThickness,
    fontWeight,
    maxLength,
    eye,
    style = {},
    onChange,
    minSelection
}) {

    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;

        // If typeName is "tel", only allow numbers
        if (typeName === "tel") {
            // Replace any non-digit characters with empty string
            const numbersOnly = value.replace(/\D/g, '');
            setInputValue(numbersOnly);
            if (onChange) {
                onChange(numbersOnly); // Passing cleaned value to parent
            }
        } else {
            setInputValue(value);
            if (onChange) {
                onChange(value); // Passing value to parent
            }
        }
    };


    return (

        <div className={`input-box-container ${className}`}
            style={{
                "--active-color-value": activeColorValue,
                "--default-color-value": defaultColorValue,
                "--input-width": width,
                "--input-height": height,
                "--input-border-radius": borderRadius,
                "--border-thickness": borderThickness,
                "--font-weight": fontWeight,
                ...style
            }}
        >

            <div className="custom-input-box" /*(pata nahi ye idhar aana chahiye ki nahi isliye comment kiya hai ---->) style={{ "--active-color-value": activeColorValue, "--default-color-value": defaultColorValue, "--input-width": width, "--input-height": height, "--input-border-radius": borderRadius }}*/>
                <input type={eye && showPassword ? "text" : typeName}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleChange}
                    maxLength={typeName === 'tel' ? 10 : maxLength}
                    {...(typeName === "date" && minSelection
                        ? { min: minSelection }
                        : {})}
                />

                <label htmlFor="input">{labelName}</label>
            </div>


            {eye &&
                <div className="view-password-eye">
                    <button onClick={() => setShowPassword(!showPassword)}><img className="eye-icon" src={showPassword ? eyeOpenIcon : eyeCloseIcon} alt="" /></button>
                </div>
            }

        </div>
    );
}

export default InputBox;