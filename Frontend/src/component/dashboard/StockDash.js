import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import './dashboard.css';
import InQtyDash from './InQtyDash';
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const StockDash = () => {
   


    const dataPoints = [
        { label: "Raw Material", y: 10, amount: "$10,000", color: "#4CAF50" },
        { label: "Sub Assly", y: 15, amount: "$1,500", color: "#2196F3" },
        { label: "Ready Jobs", y: 25, amount: "$2,500", color: "#FF9800" },
    
    ];
    const dataPoints1 = [
        { label: "Bom issued", y: 10, amount: "$10,000", color: "#4CAF50" },
        { label: "Production List", y: 15, amount: "$1,500", color: "#2196F3" },
       
    
    ];
    const maxValue = Math.max(...dataPoints.map(point => point.y));
    const maxValue1 = Math.max(...dataPoints1.map(point => point.y));
    return (
        <>
        
            
               
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%',marginTop:'10px' }}>              
                <div style={{ width: '550px', height: '400px' }}>
                <div className="chart-containers">
             <h2 style={{marginRight:'30%'}}>Stock</h2>
            <div className="stockchart">
                
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
                </div>
                <div style={{ width: '700px', height: '400px',marginLeft:'10%' }}>
              <InQtyDash/>
                </div>
            </div> 
            
        </>
    );
};

export default StockDash;
