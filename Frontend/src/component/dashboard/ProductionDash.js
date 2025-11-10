import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ProductionDash = () => {
    const options1 = {
      
      animationEnabled: false,
      exportEnabled: false,
      title: {
          text: "Production",
          fontFamily: "verdana",
          fontSize: 23
      },
      axisY: {
        labelFormatter: () => " ", // Hides Y axis labels
        lineThickness: 0, 
        gridThickness: 0,
        tickLength: 0// Hides the Y axis line
    },
      axisX: {
          display: false ,
          lineThickness: 0, // Hides the Y axis line
          gridThickness: 0,
          tickLength: 0// Hides the X axis
      },
      toolTip: {
        enabled: true,  // Enables toolTip on hover
        content: "{label}: {y}"  // Customizes the toolTip content
    },
      legend: {
        verticalAlign: "top",  // Positions legend at the top
       // verticalAlign: "center",  // Positions legend at the center vertically
        horizontalAlign: "left",  // Aligns legend on the left side
        reversed: true,  // Reverses legend order
        cursor: "pointer",
        maxWidth: 120,  // Adjust the width of the legend box
        itemWrap: true, // Enables wrapping of items
        itemWidth: 120 // Sets the width for each legend item to stack vertically
    },
      data: [
          {
              type: "stackedColumn",
              name: "LV Total required",
              showInLegend: true,
              //yValueFormatString: "#,###k",
              dataPoints: [
                  { label: "630/22", y: 14 },
                  { label: "630/11", y: 12 },
                  { label: "1000/22", y: 14 },
                  { label: "200/22", y: 13 },
                  { label: "100/22", y: 13 },
                  { label: "630/11", y: 13 },
                  { label: "6300/110", y: 15 },
                  { label: "5300/210", y: 16 },
                  { label: "7300/10", y: 17 },
              
              ],
              dataPointWidth: 30 // Adjust this value for width
          },
          {
              type: "stackedColumn",
              name: "HV Total required",
              showInLegend: true,
              //yValueFormatString: "#,###k",
              dataPoints: [
                  { label: "630/22", y: 14 },
                  { label: "630/11", y: 12 },
                  { label: "1000/22", y: 14 },
                  { label: "200/22", y: 13 },
                  { label: "100/22", y: 13 },
                  { label: "630/11", y: 13 },
                  { label: "6300/110", y: 15 },
                  { label: "5300/210", y: 16 },
                  { label: "7300/10", y: 17 },
                
              ],
              dataPointWidth: 30 // Adjust this value for width
          },
          {
              type: "stackedColumn",
              name: "LV Ready",
              showInLegend: true,
              //yValueFormatString: "#,###k",
              dataPoints: [
                  { label: "630/22", y: 14 },
                  { label: "630/11", y: 12 },
                  { label: "1000/22", y: 14 },
                  { label: "200/22", y: 13 },
                  { label: "100/22", y: 13 },
                  { label: "630/11", y: 13 },
                  { label: "6300/110", y: 15 },
                  { label: "5300/210", y: 16 },
                  { label: "7300/10", y: 17 },
                
              ],
              dataPointWidth: 30 // Adjust this value for width
          },
          {
              type: "stackedColumn",
              name: "HV Ready",
              showInLegend: true,
              //yValueFormatString: "#,###k",
              dataPoints: [
                  { label: "630/22", y: 10 },
                  { label: "630/11", y: 12 },
                  { label: "1000/22", y: 14 },
                  { label: "200/22", y: 13 },
                                   { label: "100/22", y: 13 },
                  { label: "630/11", y: 13 },
                  { label: "6300/110", y: 15 },
                  { label: "5300/210", y: 16 },
                  { label: "7300/10", y: 17 },
                  
              ],
              dataPointWidth: 30 // Adjust this value for width
          },
          
       
      ]
  };



    return (
        <>
            
                <CanvasJSChart options={options1} />
                
            
        </>
    );
};

export default ProductionDash;
