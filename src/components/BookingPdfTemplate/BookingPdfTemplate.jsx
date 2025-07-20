import "./BookingPdfTemplate.css";

import React, { forwardRef } from "react";



const BookingPdfTemplate = forwardRef(function BookingPdfTemplate(
    { booking, vehicle, user, pricing, pickup, status },
    ref
) {
    return (
        <div ref={ref} className="pdf-template-container">
            <header className="pdf-header">
                <img src="/path/to/your/logo.svg" alt="E2R Logo" className="logo" />
                <h1>Booking Confirmation</h1>
            </header>

            <section className="pdf-section">
                <h2>🏍️ Vehicle</h2>
                <p><strong>{vehicle.name}</strong></p>
                <p>Quantity: {booking.quantity}</p>
            </section>

            <section className="pdf-section">
                <h2>📅 Dates & Times</h2>
                <p>From: {pickup.fromDate} at {pickup.fromTime}</p>
                <p>To: {pickup.toDate} at {pickup.toTime}</p>
            </section>

            <section className="pdf-section">
                <h2>💳 Payment</h2>
                <p>Amount Paid: ₹{pricing.subTotal}</p>
                <p>Status: {status}</p>
            </section>

            <section className="pdf-section">
                <h2>📍 Pickup Location</h2>
                <p>{vehicle.owner} shop</p>
                <a href={pickup.shopLocation}>{pickup.shopLocation}</a>
            </section>

            <footer className="pdf-footer">
                <p>Thank you for choosing Easy2Ride!</p>
            </footer>
        </div>
    );
});

export default BookingPdfTemplate;
