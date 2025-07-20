import "./glowBtn.css";

function GlowBtn({
    width = "",
    height = "",
    color = "#555555",
    text = "button",
    className = "",
    onClick,
    glow = "true",
    blur = "10px",
    spread = "0px",
    borderRadius = "15px",
    disabled = false,
    loading = { state: false, text: "Loading", loadColor: "#fff" },
    style = {}
}) {

    const isLoading = loading.state;

    return (
        <button
            onClick={onClick}
            className={`glow-btn ${className}`}
            disabled={disabled}
            style={{
                width: `${width}`,
                height: `${height}`,
                borderRadius: `${borderRadius}`,
                backgroundColor: color,
                boxShadow: glow === "true" ? `0px 0px ${blur} ${spread} ${color}` : "none",
                opacity: disabled ? 0.5 : 1, // Reduce opacity when disabled
                cursor: disabled ? "not-allowed" : "pointer", //Change cursor when disabled
                ...style //Merge additional styles passed via props
            }}
        >
            {isLoading ? (
                <div className="glow-btn-loading">
                    <span style={{ marginRight: "8px" }}>{loading.text || "Loading"}</span>
                    <div className="glow-btn-spinner" style={{ "--load-color": loading.loadColor }}></div>
                </div>
            ) : (
                text
            )}
        </button>
    );
}

export default GlowBtn;