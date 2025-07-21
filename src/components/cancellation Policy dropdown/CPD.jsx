import { useState } from "react";
import "./CPD.css";

// importing images
import dropIcon from "/images/interface icons/arrow icon.svg";

function CPD({ className = "" }) {
    const [isOpen, setIsOpen] = useState(false);

    const policies = [
        'If cancelled before 72 hours from pickup time',
        'If cancelled between 72 and 24 hours before pickup time',
        'If cancelled within 24 hours of pickup time',
    ];
    const deductions = [
        '25% Deduction',
        '75% Deduction',
        '100% Deduction',
    ];

    return (
        <div className={`cpd-container placeCenter-column ${isOpen ? "active" : ""} ${className}`}>
            <div className="top-part placeCenter-row" onClick={() => setIsOpen(!isOpen)}>
                <p id="title">Cancellation Policy</p>
                <button >
                    <img src={dropIcon} alt="drop-btn"
                        className={isOpen ? "rotate-icon arrow-icon" : "arrow-icon"}
                    />
                </button>
            </div>

            {isOpen && (
                <div className="cpd-dropdown placeCenter-row">
                    <div className="policy-list placeCenter-column">
                        {policies.map((policy, index) => (
                            <p key={index}>{policy}</p>
                        ))}
                    </div>
                    <div className="deduction-list placeCenter-column">
                        {deductions.map((deduction, index) => (
                            <p key={index}>{deduction}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CPD;
