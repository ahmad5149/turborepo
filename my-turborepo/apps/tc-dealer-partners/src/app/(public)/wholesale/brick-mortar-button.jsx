"use client";
export function BrickMortarButton() {
    return (
        <button
            style={{ borderRadius: 999 }}
            className="btn btn-info"
            onClick={() => window.open("./bma.pdf")}>
            Physical Auction Sheet
        </button>
    );
}
