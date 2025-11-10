import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import print from "../../img/print.jpeg";
import "./quotation.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import InputUnstyled from "@mui/base/InputUnstyled";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

const StyledInputElement = styled("input")(
  ({ theme }) => `
  width: 320px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};


  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[500]};
    
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const StyledTextareaElement = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 810px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 3  ;
  padding: 12px;
  border-radius: 5px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[500]};
  

  &:hover {
    border-color:black;
  }

  &:focus {
    border-color: ${blue[500]};
    
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);



const PrintQuotation = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const [parameters, setParameters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const convertDateFormat = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };
  const [fromData, setFormData] = useState({
    username: '',
    contactno: ''
  })
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getQuotprint/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
      console.log("API Response Data:", jsonData);

      // Fetch quotParameter
      const quotParameterResponse = await fetch(`${APP_BASE_PATH}/getQuotParameter`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const quotParameterData = await quotParameterResponse.json();
      console.log(quotParameterData)
      setParameters(quotParameterData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem('UserName')
    const phone = localStorage.getItem('ContactNo')
    setFormData((prev) => ({
      ...prev,
      username: name,
      contactno: phone
    }));

    fetchData();
  }, [id]);

  const handleEdit = (e) => {
    if (!e) {
      return;
    }
    setData({
      ...data,
      ...(e.target.name === "temppayment"
        ? { paymentdesc: paymentMap[e.target.value] }
        : e.target.name === "tempinsp"
          ? { inspectiondesc: inspectionMap[e.target.value] }
          : e.target.name === "tempgurantee"
            ? { guranteetext: guaranteeMap[e.target.value] }
            : {}),
      [e.target.name]: e.target.value,
    });
  };
  const {
    pay_temp1,
    pay_temp2,
    pay_temp3,
    insp_temp1,
    insp_temp2,
    insp_temp3,
    ghtterms,
    gltterms,
    gspecial,
    validityterms,
  } = parameters || {};
  const paymentMap = {
    "Temp-1": pay_temp1,
    "Temp-2": pay_temp2,
    "Temp-3": pay_temp3,
  };

  const inspectionMap = {
    HT: insp_temp1,
    LT: insp_temp2,
    "Temp-3": insp_temp3,
  };

  const guaranteeMap = {
    HT: ghtterms,
    LT: gltterms,
    SPECIAL: gspecial,
  };
  const getTypeLabel = (value) => {
    switch (value) {
      case 1:
        return "Outdoor";
      case 2:
        return "Indoor";
      case 3:
        return "Indoor / Outdoor";
      default:
        return "";
    }
  };
  const formattedDate = new Date(data.qdate).toLocaleDateString('en-GB');
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  function convertLessThanOneThousand(num) {
    let words = '';

    if (num % 100 < 20 && num % 100 > 10) {
      words = teens[num % 10 - 1];
      num = Math.floor(num / 100);
    } else {
      if (num % 10 > 0) {
        words = units[num % 10];
      }
      num = Math.floor(num / 10);

      if (num % 10 > 0) {
        words = tens[num % 10] + ' ' + words;
      }
      num = Math.floor(num / 10);
    }

    if (num > 0) {
      words = units[num] + ' Hundred ' + words;
    }

    return words.trim();
  }


  function NumberToWords(num) {
    if (num === 0) {
      return 'Zero';
    }

    let words = '';
    let scaleIndex = 0;
    let chunkCount = 0;

    while (num > 0) {
      let chunk;
      if (chunkCount === 0) { // Handle the first chunk (last three digits)
        chunk = num % 1000;
        num = Math.floor(num / 1000);
      } else { // Handle subsequent chunks (two digits at a time for Indian numbering system)
        chunk = num % 100;
        num = Math.floor(num / 100);
      }

      if (chunk !== 0) {
        let chunkWords = convertLessThanOneThousand(chunk);
        words = chunkWords + (scaleIndex > 0 ? ' ' + scales[scaleIndex] + ' ' : ' ') + words;
      }

      chunkCount++;
      scaleIndex++;
    }

    return words.trim();
  }
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Format qdate to dd/mm/yy

    const footerContent = `
  <div class="page-footer" style="position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 15px; margin-top: 20px;">
    S. No. 229/2/2, Behind Rajiv Gandhi Infotech Park, Phase 1, Hinjawadi, Pune - 411057<br>
    Tel.: 020 - 22933018  Telefax.: 020 - 22933059<br>
    E-mail: sales@staticelectric.co.in 
    Website: www.staticelectric.co.in
  </div>
`;
    const printContent = `

  <div class="image-container">
    <img id="print-image" src="${print}" alt="Your Image Alt Text">
  </div>
  
`;


    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      
      <style>
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .center-text {
          text-align: center;
        }
        .center-line {
          width: 50%;
          margin: 0 auto;
        }
        @media print {
          .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
        
          }
        }
        #print-content {
          padding-bottom: 50px; 
        }
     
        @page {
          size: A4;
          margin: 10mm 20mm 20mm 20mm;
        }
        }
        .page-footer {
          position: fixed;
          bottom: 0;
          width: 100%;
          text-align: center;
          font-size: 10px;
        }
        .page-break {
          page-break-after: always;
        }
        .side{
          text-align:left;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          border: 1px solid black; /* Add a border to the entire table */
        }
        
        th, td {
          border: 1px solid black; /* Add borders to table cells */
          padding: 10px;
          text-align: left;
          
        }
        .no-border {
          border-collapse: collapse;
          border: none;
        
        }
        .no-border th,
        .no-border td {
          border: none;
          padding: 0px;
          text-align: left;
          padding-right:50px; 
          
        }
      
      </style>
    </head>
    <body>
      <div id="print-content">
        ${printContent}
      </div>
    </body>
    <body>
      <div id="print-content">
     
        <div class="header">
          <h4> Ref. No: ${data.quotref}</h4>
          <h4>Date: ${formattedDate}</h4>
        </div>
        <h4 style="margin: 0;">To,</h4>
<span style="font-weight: bold; margin: 0;">${data.custname}</span>
<h4 style="margin: 0;margin-bottom: 10px;"><span>${data.address}</span></h4>
       
       
        <div class="center-text">
          <h4 class="center-line">Kind Attn:&nbsp;&nbsp;${data.contactperson}</h4>
        </div>
        <div class="center-text">
          <h4 class="center-line" style="margin-top: 20px;">QUOTATION FOR TRANSFORMER</h4>
        </div>
      <p>We thank you for your valued inquiry and have pleasure in submitting our offer for supply of Distribution Transformer. Our offer is subject to the terms and conditions of Sale as per enclosed schedules. <br/><b>The Transformer shall be manufactured and tested as per IS: 1180 (Part-I) 2014 & as per MSEDCL Specifications<b/></p>
      <div  class="center-text ">
        <h4><b>SCHEDULE: A<b/> <h4/>
         <h4><b>PRICE AND TECHNICAL DETAILS OF TRANSFORMERS<b/> <h4/>
        </div>
        <table  class="no-border ">
        <tr>
          <th>Make:</th>
          <td style="font-weight: normal;">Static Electricals Pune</td>
        </tr>
        <tr>
          <th style="width: 150px;">Rating (KVA):</th>
          <td style="font-weight: normal;">${data.capacity}</td>
        </tr>
        <tr>
          <th>Voltage Ratio:</th>
          <td style="font-weight: normal;">${data.priratio}/${data.secratio}V</td>
        </tr>
        <tr>
          <th>Type:</th>
          <td style="font-weight: normal;">${getTypeLabel(data.type)}</td>
        </tr>
       <tr>
  <th>Quantity (Nos.):</th>
  <td style="font-weight: normal;">${String(data.qty).padStart(2, '0')}</td>
</tr>

        <tr>
          <th>No. of Phases:</th>
          <td style="font-weight: normal;">${String(data.phase).padStart(2, '0')}</td>
        </tr>
        <tr>
          <th>Frequency:</th>
          <td style="font-weight: normal;">50 Hz</td>
        </tr>
        <tr>
          <th>Core:</th>
          <td style="font-weight: normal;">${data.core}</td>
        </tr>
        <tr>
          <th>Winding:</th>
          <td style="font-weight: normal;">${data.matofwind}</td>
        </tr>
        <tr>
          <th>Cooling:</th>
          <td style="font-weight: normal;">${data.typecolling}</td>
        </tr>
        <tr>
          <th>Vector Symbol:</th>
          <td style="font-weight: normal;">${data.vectorgroup}</td>
        </tr>
        <tr>
          <th>H.V.:</th>
          <td style="font-weight: normal;">${data.hvvoltage}</td>
        </tr>
        <tr>
          <th>L.V.:</th>
          <td style="font-weight: normal;">${data.lvvoltage}</td>
        </tr>
        <tr>
          <th>Tapping:</th>
          <td style="font-weight: normal;">${data.typetaping ? data.typetaping : "No Tapping"}</td>
        </tr>
        <tr>
<th style="padding-top: 10px;">Rate In Rs For Each Transformer:</th>
<td style="font-weight: normal;">${data.capacity}KVA&nbsp;,${data.priratio}/${data.secratio}V:-&nbsp;&nbsp;Rs-&nbsp;${Number(data.cost).toLocaleString('en-IN')}/-</td>


</tr>

        <tr>
          <th></th>
          <td style="font-weight: normal;">(${NumberToWords(Number(data.cost))} Only)</td>
        </tr>
      </table>
      
      <div class="page-break"></div>
      <div id="print-content">
      ${printContent}
    </div>
         <div class="center-text ">

         <h4><b>SCHEDULE: B<b/> <h4/>
         </div>
         <div  class="center-text " style={{marginLeft:"10%"}}>
         <h4>COMMERCIAL TERMS & CONDITIONS</h4>
       </div>
       <table>
       <tr>
        <td style="font-weight: bold;">Price</td>
         <td>
         <ul style="font-weight: normal;">
           <li>C.GST  ${data.cgst}%:- ${data.cgsttype}</li>
           <li>S.GST  ${data.sgst}%:- ${data.sgsttype}</li>
           <li>Transportation: - ${data.transport}</li>
           <li>Unloading at Site:-Done By Purchaser</li>
           <li>Prices are subject to IEEMA price variation clause.</li>
         </ul>
       </td>
       </tr>
       <tr>
       <td style="font-weight: bold;">Delivery Period</td>
       <td style="font-weight: normal;">
  <ul>
    <li>${data.deliverydesc?.replace(/\*/g, data.deliveryperiod || "*") || ""}</li>
  </ul>
</td>

     </tr>
     <tr>
     <td style="font-weight: bold;">Payment</td>
    <td style="font-weight: normal;">
  <ul>
    <li>${data.paymentdesc}</li>
  </ul>
</td>

   </tr>
   <tr>
   <td style="font-weight: bold;">Inspection</td>
  <td style="font-weight: normal;">
  <ul>
    <li>${data.inspectiondesc}</li>
  </ul>
</td>

 </tr>
 <tr>
 <td style="font-weight: bold;">Guarantee</td>
<td style="font-weight: normal;">
  <ul>
    <li>${data.guranteetext?.replace(/\*/g, data.guranteeperiod || "*") || ""}</li>
  </ul>
</td>

</tr>
<tr>
 <td style="font-weight: bold;">Validity</td>
<td style="font-weight: normal;">
  <ul>
    <li>${validityterms?.replace(/\*/g, data.validityofquote || "*") || ""}</li>
  </ul>
</td>

</tr>
     </table>
     <div>
     <h3 style={{marginRight:"70%"  }}>
       For Static Electricals Pune
     </h3>
   </div>
   <div>
     <h3  style={{ marginTop: 0, marginBottom: 10 }}>
       ${fromData.username} (${fromData.contactno})
     </h3>
   </div>
   <div>
    
   </div>
  
</div> 
${footerContent}
  </body>
  </html>
  `);
    const printImage = printWindow.document.getElementById("print-image");
    if (printImage) {
      printImage.onload = () => {
        printWindow.document.close();
        printWindow.print();
      };
    } else {
      printWindow.document.close();
      printWindow.print();
    }
  };




  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div class="d-flex justify-content-between">
            <div className="page_header">
              <h3>Print Quotation</h3>
            </div>
            <Link to="/quotation" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ background: "#28a745" }}>
                Back
              </Button>
            </Link>
          </div>
          <Paper style={{ marginTop: 20 }}>
            <Box sx={{ flexGrow: 1 }}>
              <img
                id="print"
                alt="logo"
                src={print}
                style={{ marginTop: 50 }}
              ></img>
              <Grid
                container
                spacing={2}
                columns={12}
                style={{
                  marginTop: 50,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="quotref"
                    label="Quotation Ref"
                    name="quotref"
                    value={data.quotref}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="qdate"
                    label="Date"
                    name="qdate"
                    value={formattedDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={8}>
                <TextField
                  fullWidth
                  id="customer"
                  label="Customer Name"
                  labelprope
                  name="customer"
                  value={data.custname}
                  autoComplete="Date"
                  sx={{ marginBottom: "15px" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={8}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    value={data.address}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="contactPerson"
                    label="Contact Person"
                    name="contactPerson"
                    value={data.contactperson}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <div>
                  <h5 style={{ marginRight: "75%" }}>
                    Quotation For Transformer
                  </h5>
                </div>
                <Grid item xs={6}>
                  <TextField
                    fullWidth


                  />
                </Grid>
                <div>
                  <h5 style={{ marginRight: "87%" }}>
                    Schedule: A
                  </h5>
                </div>
                <div>
                  <h5 style={{ marginRight: "65%" }}>
                    Price And Technical Details For Transformers
                  </h5>
                </div>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="qft"
                    label="Compony Name"
                    sx={{ marginBottom: "15px" }}
                  />
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="capacity"
                      label="Rating (KVA)"
                      name="capacity"
                      value={data.capacity}
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="voltageRatio"
                      label="Voltage Ratio"
                      name="voltageRatio"
                      autoComplete="off"
                      value={data.voltageratio}
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <FormControl style={{ width: '100%' }}>
                      <InputLabel id="type-label">Type</InputLabel>
                      <Select
                        labelId="type-label"
                        id="type"
                        label="Type"
                        name="type"
                        value={data.type || ""}
                        sx={{ marginBottom: "15px" }}
                        onChange={handleEdit}
                        disabled
                      >
                        <MenuItem value={1}>OUTDOOR</MenuItem>
                        <MenuItem value={2}>INDOOR</MenuItem>
                        <MenuItem value={3}>INDOOR/OUTDOOR</MenuItem>
                      </Select>

                    </FormControl>
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="qty"
                      label="Quantity"
                      name="qty"
                      value={data.qty}
                      autoComplete="off"
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="noOfPhases"
                      label="No. of Phases"
                      name="noOfPhases"
                      autoComplete="off"
                      value={data.phase}
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="frequency"
                      label="Frequency"
                      name="frequency"
                      value={data.frequency}
                      autoComplete="off"
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="core"
                      label="Core"
                      name="core"
                      value={data.core}
                      autoComplete="off"
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="material"
                      label="Material"
                      name="material"
                      sx={{ marginBottom: "15px" }}
                      value={data.matofwind}
                      InputLabelProps={{
                        shrink: true,
                      }}


                    />
                  </Grid>
                </Grid>



                <Grid container spacing={2}>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="vector"
                      label="Vector"
                      name="vector"
                      value={data.vectorgroup}
                      autoComplete="off"
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />

                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="cooling"
                      label="Cooling"
                      name="cooling"
                      value={data.typecolling}
                      autoComplete="off"
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="hv"
                      label="HV"
                      name="hv"
                      value={data.hvvoltage}
                      autoComplete="off"
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="lv"
                      label="LV"
                      name="lv"
                      value={data.lvvoltage}
                      autoComplete="off"
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>


                <TextField
                  fullWidth
                  id="tapping"
                  label="Tapping"
                  name="tapping"

                  value={data.tapingSwitch == "nottaping" ? 'No Tapping' : `${data.tapingSwitch}:-${data.typetaping}`}

                  sx={{ marginBottom: "15px" }}
                  InputProps={{
                    readOnly: true, // To make it readonly and look like a plain text
                    disableUnderline: true, // To remove the underline
                  }}

                />
              </Grid>

              <br />
              <Grid item xs={9} sm={3} style={{ marginLeft: -100, marginTop: 20 }}>
                <Button variant="contained" sx={{ background: "#007bff" }} type="submit" onClick={handlePrint} >
                  Save And Print
                </Button>
              </Grid>
              <Grid item xs={9} sm={3} style={{ marginTop: -35, marginLeft: 200 }}>
                <Link to="/quotation" style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="error">
                    Cancel
                  </Button>
                </Link>
              </Grid>
              <br />
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default PrintQuotation;
