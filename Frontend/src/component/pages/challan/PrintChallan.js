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
import dayjs from "dayjs";
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



const PrintChallan = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);


  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };
  const formatDates = (dateString) => {
    if (!dateString || dateString.trim() === '') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Check for invalid date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/fetchChallanPrint/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      const data1 = [jsonData]
      console.log('data1', data1)
      setData(data1[0]); // Make sure jsonData contains the expected data.
      console.log("API Response Data:", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [id]);

  function convertNumberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    return num; // For numbers 100+, just return the number
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.open();

    // Header content with centered styling
    const headerContent = `
      
      <!DOCTYPE  html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      
      <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
      
          <head>
      
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
      
              <title style="display:none;"></title>
      
              <meta name="author" content="STATIC ELECTRIC"/>
      
              <style type="text/css">
      
                  * {
      
                      margin: 0;
      
                      padding: 0;
      
                      text-indent: 0;
      
                  }
       
                  .s1 {
      
                      color: black;
      
                      font-family: "Times New Roman", serif;
      
                      font-style: normal;
      
                      font-weight: normal;
      
                      text-decoration: none;
      
                      font-size: 17pt;
      
                  }
       
                  p {
      
                      color: black;
      
                      font-family: Arial, sans-serif;
      
                      font-style: normal;
      
                      font-weight: normal;
      
                      text-decoration: none;
      
                      font-size: 8.5pt;
      
                      margin: 0pt;
      
                  }
       
                  .s2 {
      
                      color: black;
      
                      font-family: Arial, sans-serif;
      
                      font-style: normal;
      
                      font-weight: bold;
      
                      text-decoration: none;
      
                      font-size: 8.5pt;
      
                  }
       
                  .s3 {
      
                      color: black;
      
                      font-family: Verdana, sans-serif;
      
                      font-style: normal;
      
                      font-weight: normal;
      
                      text-decoration: underline;
      
                      font-size: 10pt;
      
                  }
       
                  .s4 {
      
                      color: black;
      
                      font-family: "Times New Roman", serif;
      
                      font-style: normal;
      
                      font-weight: bold;
      
                      text-decoration: none;
      
                      font-size: 10pt;
      
                  }
       
                  .s5 {
      
                      color: black;
      
                      font-family: Arial, sans-serif;
      
                      font-style: normal;
      
                      font-weight: bold;
      
                      text-decoration: none;
      
                      font-size: 7.5pt;
      
                  }
       
                  .s6 {
      
                      color: black;
      
                      font-family: "Times New Roman", serif;
      
                      font-style: normal;
      
                      font-weight: normal;
      
                      text-decoration: underline;
      
                      font-size: 8.5pt;
      
                  }
       
                  .s7 {
      
                      color: black;
      
                      font-family: Arial, sans-serif;
      
                      font-style: normal;
      
                      font-weight: normal;
      
                      text-decoration: none;
      
                      font-size: 10pt;
      
                  }
       
                  .s8 {
      
                      color: black;
      
                      font-family: "Comic Sans MS";
      
                      font-style: normal;
      
                      font-weight: bold;
      
                      text-decoration: none;
      
                      font-size: 10pt;
      
                  }
       
                  table, tbody {
      
                      vertical-align: top;
      
                      overflow: visible;
      
                  }
      
              </style>
      
          </head>
      
          <body>
      
          <p class="s1" style="padding-top: 3pt;  text-indent: 0pt; line-height: 19pt; text-align: center;">STATIC ELECTRICALS PUNE</p>

      
              <p style="text-indent: 0pt; line-height: 9pt; text-align: center;">S. No. 229/2/2, Behind Wipro Technologies,</p>

      
              <p  style="text-indent: 0pt; line-height: 9pt; text-align: center;">Hinjewadi, Pune 411 057.</p>
      
              <p  style="text-indent: 0pt; line-height: 9pt; text-align: center;"/>
      
              <p  style="text-indent: 0pt; line-height: 9pt; text-align: center;">Telefax: 020-22933059.</p>
      
              <p style="text-indent: 0pt; line-height: 9pt; text-align: center;">
      
                  <br/>
      
              </p>
      
              <p style="text-indent: 0pt;text-align: left;">
      
                  <br/>
      
              </p>
      
              <table style="border-collapse:collapse;margin-left:6.765pt" cellspacing="0">
      
                  <tr style="height:10pt">
      
                      <td style="width:443pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:2pt" colspan="5">
      
                          <p class="s2" style="padding-left: 135pt;padding-right: 132pt;text-indent: 0pt;line-height: 8pt;text-align: center;">An ISO 9001:2015 Certified Company</p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:58pt">
      
                      <td style="width:443pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="5">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                          <p class="s3" style="padding-left: 135pt;padding-right: 132pt;text-indent: 0pt;text-align: center;">D E L I V E R Y C H A L L A N </p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:9pt">
      
                      <td style="width:281pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="2" bgcolor="#BFBFBF">
      
                          <p class="s2" style="padding-left: 15pt;text-indent: 0pt;line-height: 8pt;text-align: left;padding-top:2pt;  margin-top: 6px;">TO: Buyer</p>
      
                      </td>
      
                      <td style="width:83pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="2" bgcolor="#BFBFBF">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                      <td style="width:79pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" bgcolor="#BFBFBF">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:57pt">
      
                      <td style="width:32pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" rowspan="3">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                      <td style="width:249pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt">
      
                          <p class="s4" style="padding-left: 1pt;text-indent: 0pt;line-height: 113%;text-align: left;">${custname}</p>
                               <p class="s4" style="padding-left: 1pt; text-indent: 0pt; line-height: 113%; text-align: left;">
  ${data[0]?.buyer_address ? data[0].buyer_address.split('\n').join(',<br>') : ""}
</p>
                      </td>
      
                      <td style="width:105pt; border-top-style:solid; border-top-width:2pt; border-left-style:solid; border-left-width:2pt" colspan="2">
    <span class="s2" style="display: flex; flex-direction: row; align-items: center;">
        <span>&nbsp;D.C.NO: </span>
        <span>${data[0]?.challan_no}</span>
    </span>
    <br/>
    <p class="s2">&nbsp;P.O.NO: ${po_no}</p>
</td>

      
                     
      
                      <td style="width:79pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt">
         <p style="text-indent: 0pt;text-align: left;">
            <p class="s2">&nbsp;Date: ${data[0]?.chdate}</p>
                <br/>
            </p>   
                ${formatDates(po_date) ? `<p class="s2">&nbsp;Date: ${formatDates(po_date)}</p>` : ''}
               <p style="text-indent: 0pt;text-align: left;">
                <br/>
              </p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:16pt">
      
                      <td style="width:249pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt">
      
      
                      </td>
      
                      <td style="width:43pt;border-left-style:solid;border-left-width:2pt ;border-bottom-style:solid;border-bottom-width:2pt;>
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                      <td style="width:40pt;border-right-style:solid;border-right-width:2pt;border-bottom-style:solid;border-bottom-width:2pt; ">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                      <td style="width:79pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt;border-bottom-style:solid;border-bottom-width:2pt">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:64pt">
      
                      <td style="width:249pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt">
        <p class="s2" style="padding-left: 2pt;text-indent: 0pt;line-height: 8pt;text-align: left;text-decoration: underline;margin-bottom: 6px;">Delivery At:-</p>
                          <p class="s4" style="padding-left: 1pt;text-indent: 0pt;line-height: 11pt;text-align: left; margin-top:"10px">${data[0]?.delivary_at_name}</p>
  
      
                      <p class="s4" style="padding-top: 1pt; padding-left: 1pt; text-indent: 0pt; line-height: 113%; text-align: left;">
            ${data[0]?.delivery_address ? data[0].delivery_address.split('\n').join(',<br>') : ""}
          </p>


                      </td>
      
                      <td style="width:43pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="4">
                    <p class="s2" style="padding-left: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;text-decoration: underline;">Order Acceptance Comment:-</p>
                    <p class="s4" style="padding-left: 1pt;text-indent: 0pt;line-height: 11pt;text-align: left;">${(data[0]?.OAcomment ?? "").split("\n").join(",<br>")}
</p>
                
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:9pt">
      
                      <td style="width:32pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" bgcolor="#BFBFBF">
      
                          <p class="s2" style="text-indent: 0pt;line-height: 8pt;text-align: right;  margin-top: 6px;">SR.NO</p>
      
                      </td>
      
                      <td style="width:332pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="3" bgcolor="#BFBFBF">
      
                          <p class="s2" style="padding-left: 124pt;padding-right: 121pt;text-indent: 0pt;line-height: 8pt;text-align: center;  margin-top: 6px;">ITEM DESCRIPTION</p>
      
                      </td>
      
                      <td style="width:79pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" bgcolor="#BFBFBF">
      
                          <p class="s2" style="padding-left: 5pt;padding-right: 2pt;text-indent: 0pt;line-height: 8pt;text-align: center;  margin-top: 6px;">QUANTITY</p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:53pt">
      
                      <td style="width:32pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                          <p class="s2" style="text-indent: 0pt;line-height: 9pt;text-align: right;"></p>
      
                      </td>
      
                      <td style="width:332pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="3" rowspan="3">
      
                          <p class="s2" style="padding-left: 1pt;text-indent: 0pt;line-height: 9pt;text-align: left;">Distribution Transformer duly tested and</p>
      
                          <p class="s2" style="padding-left: 1pt;text-indent: 0pt;text-align: left;">filled with transformer oil and supplied with silica gel breather</p>
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                          <p class="s2" style="padding-left: 1pt;padding-right: 167pt;text-indent: 0pt;line-height: 219%;text-align: left;">Capacity    :   ${capacity}   KVA </p>
                                <br/>
                          <p class="s2" style="padding-left: 1pt;padding-right: 167pt;text-indent: 0pt;line-height: 219%;text-align: left;">Voltage Ratio  :   ${voltageratio}V</p>
                                <br/>
                          <p class="s2" style="padding-left: 1pt;padding-right: 167pt;text-indent: 0pt;line-height: 219%;text-align: left;">Type       :  ${typeLabel}</p>
                          <br/>
                                                    <br/>
                                                                              <br/>
                                                                                                        <br/>
                          <p class="s2" style="padding-left: 20pt;padding-right: 167pt;text-indent: 0pt;line-height: 219%;text-align: left;">Vehicle No.:  ${vehicle || " "}</p>
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                          <p class="s2" style="padding-left: 20pt;text-indent: 0pt;text-align: left;"></p>
      
                      </td>
      
                      <td style="width:79pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:11pt">
      
                      <td style="width:32pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                    <td style="width:79pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt">
  <p class="s2" style="padding-left: 5pt;padding-right: 2pt;text-indent: 0pt;line-height: 9pt;text-align: center;">
    ${qty} No.
  </p>
</td>

<tr style="height:139pt">
  <td style="width:32pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:2pt">
    <p style="text-indent: 0pt;text-align: left;">
      <br/>
    </p>
  </td>

<td style="width:79pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt">
  <p class="s2" style="padding-left: 5pt;padding-right: 3pt;text-indent: 0pt;text-align: center;white-space: nowrap;">
    (${convertNumberToWords(qty)} No.${qty !== 1 ? '' : ''})
  </p>
</td>
      
                  </tr>
      
                  <tr style="height:9pt">
      
                      <td style="width:32pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                      <td style="width:292pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="2">
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                      </td>
      
                      <td style="width:40pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt">
      
                          <p class="s2" style="padding-right: 7pt;text-indent: 0pt;line-height: 8pt;text-align: right;">TOTAL</p>
      
                      </td>
      
                      <td style="width:79pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt">
      
                          <p class="s2" style="padding-left: 5pt;padding-right: 3pt;text-indent: 0pt;line-height: 8pt;text-align: center;">${qty} No. (${convertNumberToWords(qty)} No.)</p>
      
                      </td>
      
                  </tr>
      
                  <tr style="height:117pt">
      
                      <td style="width:281pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="2">
      
                          <p class="s5" style="padding-left: 1pt;padding-right: 16pt;text-indent: 0pt;line-height: 157%;text-align: left;">1) The item which is despatched to you directly or through a third party, the company reserves the right to take back the</p>
      
                          <p class="s5" style="padding-top: 1pt;padding-left: 3pt;text-indent: 0pt;text-align: left;">item against any delay/non payment.</p>
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                          <p class="s2" style="padding-top: 6pt;padding-left: 1pt;text-indent: 0pt;text-align: left;">Subject to Pune Jurisdiction Only</p>
      
                          <p class="s5" style="padding-top: 1pt;padding-left: 1pt;text-indent: 0pt;text-align: left;">Received the above items in good condition.</p>
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                          <p class="s2" style="padding-left: 1pt;text-indent: 0pt;text-align: left;">Receivers Signature</p>
      
                          <p class="s2" style="padding-left: 1pt;text-indent: 0pt;text-align: left;">
      
                              and          Stamp:<span class="s6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      
                          </p>
      
                      </td>
      
                      <td style="width:162pt;border-top-style:solid;border-top-width:2pt;border-left-style:solid;border-left-width:2pt;border-bottom-style:solid;border-bottom-width:2pt;border-right-style:solid;border-right-width:2pt" colspan="3">
      
                          <p class="s7" style="padding-top: 9pt;padding-left: 1pt;text-indent: 0pt;text-align: left;">
      
                              For <span class="s8">Static Electricals Pune</span>
      
                          </p>
      
                          <p style="text-indent: 0pt;text-align: left;">
      
                              <br/>
      
                          </p>
      
                          <p class="s2" style="padding-left: 37pt;text-indent: 0pt;text-align: left;margin-top:80px;">Authorised Signatory</p>
      
                      </td>
      
                  </tr>
      
              </table>
      
          </body>
      
      </html>
      
  
      `;
    printWindow.document.write(headerContent);
    printWindow.document.close();
    printWindow.print();

  }
  let capacity, deliver_at, chdate, delivery_address, vehicle, qty, po_date, po_no, custname, voltageratio, type, desc, consumer_name, consumer_address;

  console.log("Data:", data);
  if (data) {
    capacity = data[0]?.capacity;
    deliver_at = data[0]?.deliver_at;
    chdate = data[0]?.chdate;
    delivery_address = data[0]?.delivery_address;
    vehicle = data[0]?.vehicle;
    qty = data[0]?.qty;
    po_date = formatDate(data[0]?.po_date);
    po_no = data[0]?.po_no;
    custname = data[0]?.custname;
    voltageratio = data[0]?.voltageratio;
    type = data[0]?.type;
    desc = data[0]?.desc;
    consumer_name = data[0]?.delivary_at_name;
    consumer_address = data[0]?.consumer_address;

  } else {
    console.log("Data or property is undefined or does not exist.");
  }
  let typeLabel = '';
  if (type === 1) {
    typeLabel = 'OUTDOOR';
  } else if (type === 2) {
    typeLabel = 'INDOOR';
  } else if (type === 3) {
    typeLabel = 'INDOOR/OUTDOOR';

  }

  let totalQty = 0;

  if (data && Array.isArray(data) && data.length > 0) {
    for (const item of data) {
      if (data[0]?.qty) {
        totalQty += parseInt(data[0]?.qty); // Parse the qty value as an integer
      }
    }
  }

  console.log("Total Qty:", totalQty);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div class="d-flex justify-content-between">
            <div className="page_header">
              <h3>Print Challan</h3>
            </div>
            <Link to="/challan" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{
                background: "#00d284",
                "&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },
              }}>
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
                    id="custname"
                    label="customer name "
                    name="custname"
                    value={custname}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
                </Grid>
                {data && (
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="deliver_at"
                      label="deliver_at"
                      name="deliver_at"
                      value={deliver_at}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid item xs={8}>
                <TextField
                  fullWidth
                  id="dcno"
                  label="PO NO"
                  labelprope
                  name="po_no"
                  value={po_no}
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
                    id="date"
                    label="PO Date"
                    name="date"

                    value={formatDate(data[0]?.po_date)}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="capacity"
                    label="capacity"
                    name="capacity"
                    value={desc}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="custname"
                      label="consumer name "
                      name="custname"
                      value={consumer_name}
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />
                  </Grid>
                  {data && (
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="deliver_at"
                        label="consumer address"
                        name="deliver_at"
                        value={consumer_address}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  )}
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="delivery_address"
                    label="delivery_address "
                    value={delivery_address}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="quantity"
                      label="quantity "
                      name="quantity"
                      value={qty}
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}

                    />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="vehicle"
                      label="vehicle"
                      name="vehicle"
                      autoComplete="off"
                      value={vehicle}
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>

                {/* <Grid container spacing={2}>
  <Grid item xs={6} style={{ marginTop: 5}}>
    <FormControl style={{ width: '100%' }}>
      <InputLabel id="type-label">Type</InputLabel>
      <Select
        labelId="type-label"
        id="type"
        label="Type"
        name="type"
        // value={data.type || ""}
        sx={{marginBottom:"15px"}}
        
      >
        <MenuItem value={1}>OUTDOOR</MenuItem>
        <MenuItem value={2}>INDOOR</MenuItem>
        <MenuItem value={3}>INDOOR/OUTDOOR</MenuItem>
      </Select>
      
    </FormControl>
  </Grid>
 
</Grid> */}















              </Grid>



              <Grid item xs={9} sm={3} style={{ marginLeft: -100, marginTop: 20 }}>
                <Button variant="contained" sx={{
                  background: "#00d284",
                  "&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },
                }} type="submit" onClick={handlePrint} >
                  Save And Print
                </Button>
              </Grid>
              <Grid item xs={9} sm={3} style={{ marginTop: -35, marginLeft: 200 }}>
                <Link to="/challan" style={{ textDecoration: "none" }}>
                  <Button variant="contained" sx={{
                    background: "#ff0854",
                    "&:hover": {
                      background: "#ff0854", // Set the same color as the default background
                    },
                  }}>
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

export default PrintChallan;
