import React from 'react';
import './dashboard.css';

const MarketingDash = () => {
    // Sample dataPoints with different colors for each bar
    const dataPoints = [
        { label: "Total enquiry", y: 20, amount: "$10,000", color: "#4CAF50" },
        { label: "Quoted", y: 15, amount: "$1,500", color: "#2196F3" },
        { label: "Order Received", y: 25, amount: "$2,500", color: "#FF9800" },
        { label: "Production plan", y: 35, amount: "$9,000", color: "#9C27B0" },
        { label: "Sale", y: 45, amount: "$4,500", color: "#F44336" }
    ];
    const maxValue = Math.max(...dataPoints.map(point => point.y));

    return (
        <div className="chart-container">
            <h2>Marketing</h2>
            <div className="chart">
                {dataPoints.map((point, index) => (
                    <div 
                      key={index} 
                      className="bar" 
                      data-value={point.y} 
                      style={{ '--value': (point.y / maxValue) * 100 + '%', backgroundColor: point.color }} // Normalize height based on maxValue
                    >
                        {point.label}
                        <span className="tooltip">Amount: {point.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketingDash;
