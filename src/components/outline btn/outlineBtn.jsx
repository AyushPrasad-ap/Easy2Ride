import "./outlineBtn.css";

function OutlineBtn({ width = "", height = "", color = "", text = "Button", className = "", onClick, id = "", borderWeight = "2px", style = {} }) {
    return (
        <button id={id} onClick={onClick} className={`outline-btn ${className}`}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                "--border-weight": borderWeight,
                "--OB-color": `${color}`,  // passing a prop as a CSS variable (so that i can use the color prop in my CSS file)
                ...style //Merge additional styles passed via props
            }}>
            {text}</button >
    )
}

export default OutlineBtn;