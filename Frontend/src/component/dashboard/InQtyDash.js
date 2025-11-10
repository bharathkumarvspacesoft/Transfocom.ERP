import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import './dashboard.css';
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const InQtyDash = () => {
   


    const dataPoints1 = [
        { label: "Bom issued", y: 10, amount: "$10,000", color: "#4CAF50" },
        { label: "Production List", y: 15, amount: "$1,500", color: "#2196F3" },
       
    
    ];
    
    const maxValue1 = Math.max(...dataPoints1.map(point => point.y));
    return (
        <>
        
        <div className="chart-containers">
             <h2 style={{marginRight:'30%'}}>In QTY and Amount</h2>
            <div className="qtychart">
                
                {dataPoints1.map((point, index) => (
                    <div 
                      key={index} 
                      className="bar" 
                      data-value={point.y} 
                      style={{ '--value': (point.y / maxValue1) * 100 + '%', backgroundColor: point.color }} // Normalize height based on maxValue
                    >
                        {point.label}
                        <span className="tooltip">Amount: {point.amount}</span>
                    </div>
                ))}
            </div>
        </div>
               
                
        </>
    );
};

export default InQtyDash;
