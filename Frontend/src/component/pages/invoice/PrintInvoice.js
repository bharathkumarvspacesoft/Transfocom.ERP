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

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const PrintInvoice = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
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
      const response = await fetch(`${APP_BASE_PATH}/fetchinvoicePrint/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
      // const data1 = [jsonData];
      setData(jsonData); // Make sure jsonData contains the expected data.
      console.log("API Response Data:", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function numberToWordsIndian(num) {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    function convertToWords(n) {
      if (n < 20) return ones[n];
      if (n < 100)
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      if (n < 1000)
        return (
          ones[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + convertToWords(n % 100) : "")
        );
      if (n < 100000)
        return (
          convertToWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + convertToWords(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          convertToWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + convertToWords(n % 100000) : "")
        );
      return (
        convertToWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + convertToWords(n % 10000000) : "")
      );
    }

    return convertToWords(num);
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.open();

    // Header content with centered styling
    const headerContent = `
      <!DOCTYPE  html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>Invoice Print </title>
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
                font-size: 19pt;
            }

            .s2 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: italic;
                font-weight: normal;
                text-decoration: none;
                font-size: 8.5pt;
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

            .s3 {
                color: black;
                font-family: "Times New Roman", serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 10.5pt;
            }

            .s4 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 7pt;
            }

            .s5 {
                color: black;
                font-family: "Times New Roman", serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 8.5pt;
            }

            .s6 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 8pt;
            }

            .s7 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 9.5pt;
            }

            .s8 {
                color: black;
                font-family: "Times New Roman", serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 9.5pt;
            }

            .s9 {
                color: black;
                font-family: "Times New Roman", serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 9.5pt;
            }

            .s11 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 8.5pt;
            }

            .s12 {
                color: #F00;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 7.5pt;
            }

            .s13 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 7.5pt;
            }

            .s14 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 9.5pt;
            }

            .s16 {
                color: #F00;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 7pt;
            }

            .s17 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 7pt;
            }

            .s18 {
                color: #F00;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 7pt;
                vertical-align: -1pt;
            }

            .s19 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 6pt;
                vertical-align: 1pt;
            }

            .s20 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 6pt;
            }

            .s21 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 6pt;
            }

            table, tbody {
                vertical-align: top;
                overflow: visible;
            }
        </style>
    </head>
    <body>
        <p class="s1" style="padding-top: 3pt;text-indent: 0pt;text-align:center;">STATIC ELECTRICALS PUNE</p>
        <p class="s2" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">Manufacturers and Repairers of Power and Distribution Transformers.</p>
        <p style="text-indent: 0pt;text-align: left;"/>
        <p style="text-indent: 0pt;text-align: left;"/>
        <p style="text-indent: 0pt;text-align: left;"/>
        <p style="padding-top: 1pt;text-indent: 0pt;text-align: center;">S.No.229/2/2, Behind Wipro Phase-I, Hinjewadi, Tal-Mulshi, Dist-Pune, Pune-411057.</p>
        <p style="text-indent: 0pt;text-align: left;">
            <br/>
        </p>
        <table style="border-collapse:collapse;margin-left:0.965pt" cellspacing="0">
            <tr style="height:25pt">
                <td style="width:484pt;border-top-style:solid;border-top-width:2pt;padding-top:10px;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1.5pt" colspan="8">
                    <p class="s3" style="padding-left: 204pt;padding-right: 203pt;text-indent: 0pt;line-height: 11pt;text-align: center;">TAX INVOICE</p>
                </td>
            </tr>
            <tr style="height:74pt">
                <td style="width:268pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                   border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt;padding:10px 2px;" colspan="3">
                    <p class="s7" style="text-indent: 0pt;line-height: 9pt;text-align: left;">
                        DIVISION <span class="s7">Division II- Pimpri</span>
                    </p>
                    <p class="s7" style="padding-top: 1pt;padding-right: 103pt;text-indent: 0pt;line-height: 133%;text-align: left;">
                      GST No. <span style="color: red;"> 27ABEFS1957R1ZD</span></br>
                        STATE <span class="s7">MAHARASHTRA </span></br>
                        CODE.  <span class="s7">27</span>
                    </p>
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;text-align: left;">Name of Commodity: ELECTRICAL TRANSFORMER.</p>
                    <p class="s7" style="padding-top: 3pt;text-indent: 0pt;text-align: left;">
                        PAN No. <span class="s7">ABEFS1957R</span>
                    </p>
                </td>
                <td style="width:268pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;
                   border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:0.5pt;padding:10px 2px" colspan="4">
                    <p class="s7" style="text-indent: 0pt;text-align: left;">Original for Buyer/Duplicate for Transporter</p>
                    <p class="s7" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">/Triplicate for assessee</p>
                    <p class="s7" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">
                        Invoice No :<span class="s7"></span>
                        <span style=" color: #F00;">${data[0]?.invoice_no || ""}</span> 
                    </p>
                    <p class="s7" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">
                        Date:<span style=" color: #F00;">${formatDate(data[0]?.inv_date || "")} </span></br>
                        Challan No :${data[0]?.challan_no || ""} 
                    </p>
                    <p class="s7" style="padding-top: 2pt;text-indent: 0pt;text-align: left;">
                        Date:<span style=" color: #F00;">${data[0]?.chdate || ""}</span>
                    </p>
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:216pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3" bgcolor="#BFBFBF">
                    <p class="s7" style="text-indent: 0pt;line-height: 9pt;text-align: left; padding-top:5px;padding-left:2px;">Name &amp;Address of the Buyer:</p>
                </td>
                <td style="width:268pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:0.5pt" colspan="4" bgcolor="#BFBFBF">
                    <p class="s7" style="text-indent: 0pt;line-height: 9pt;text-align: left; padding-top:5px;padding-left:2px;">Name &amp;Address of the Consignee/ Shipped To :</p>
                </td>
            </tr>
            <tr style="height:44pt">
                <td style="width:216pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;
                    border-right-style:solid;border-right-width:1pt;padding-left:2px;" colspan="3">
                    <p class="s7" style="padding-top: 1pt;padding-right: 81pt;
                    text-indent: 0pt;line-height: 125%;text-align: left;"> ${data[0]?.buyername || ""} </p>
                      <p class="s7" style="text-indent: 0pt; line-height: 8pt;
                      text-align: left;">${data[0]?.buyer_addr ? data[0].buyer_addr.split("\n").join(",<br>") : ""}</p>

                </td>
                    <td style="width:268pt;border-left-style:solid;border-left-width:1pt; 
                       border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:0.5pt;padding-left:2px;" colspan="4">
                      <p class="s7" style="padding-top: 1pt;padding-right: 155pt;text-indent: 0pt; 
                        line-height: 125%;text-align: left;"> ${data[0]?.consumer || ""}
                      </p>
                      <p class="s7" style="text-indent: 0pt; text-align: left;">
                          ${data[0]?.delivery_address
        ? data[0].delivery_address.split("\n").join(",<br>")
        : ""
      }
                        </p>
                    <p class="s12" style="padding-top: 2pt;text-indent: 0pt;line-height: 8pt;text-align: left;"></p>
                </td>
            </tr>
             <tr style="height:35pt">
               <td style="width:216pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;
               border-right-width:1pt;padding:2px 2px" colspan="7">
                    <p class="s7" style="text-indent: 0pt;line-height: 9pt;text-align: left;">
                      <span class="s7">Order Acceptance Comment:-</span>
                    </p>
                    <p class="s4" style="padding-top: 1pt;padding-right: 103pt;text-indent: 0pt;line-height: 133%;text-align: left;">
                    ${(data[0]?.OAcomment ?? "").split("\n").join(",<br>")}

                    </p>
                   
                </td>
            </tr>
            
            <tr style="height:33pt">
              <td style="width:23pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;   
                  border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt;padding:2px" colspan="3">
                  <p class="s7" style="padding-right: 171pt;text-indent: 0pt;line-height: 125%;text-align: left;white-space: nowrap;">
                      STATE - MAHARASHTRA&nbsp;&nbsp; </br> CODE - 27&nbsp;&nbsp; </br> GST No.<span style="color: red;">${data[0]?.gstno
        ? data[0].gstno
        : "<span style='color: red;'>NOT REGISTERED</span>"
      }</span>

              </span>
                  </p>
              </td>
                <td style="width:268pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;
                border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt;padding:2px" colspan="4">
                    <p class="s7" style="padding-right: 171pt;text-indent: 0pt;line-height: 125%;text-align: left;">STATE - MAHARASHTRA </br> CODE - 27</p>
                    <p class="s7" style="text-indent: 0pt;line-height: 8pt;text-align: left;">
                        GST NO. <span style=" color: #F00;">NOT REGISTERED</span>
                    </p>
                </td>
            </tr>
            <tr style="height:23pt">
                <td style="width:114pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid; 
                   border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;padding:2px" colspan="2">
                    <p class="s7" style="text-indent: 0pt;text-align: left;">Category of Consignee:- 
                     ${data[0]?.consignee_cat || ""}</p>
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;">Mode of Transport:- By Road</p>
                </td>
                <td style="width:102pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;
                   border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
               <td style="width: 93pt; border-top: 1pt solid; border-left: 1pt solid; border-bottom: 1pt 
                   solid;padding:2px" colspan="3">
                    <p class="s7" style="text-indent: 0pt; text-align: left; margin: 0;">PO.No.:-
                    ${data[0]?.po_no || ""}</p>
                    <p class="s7" style="margin: 0; padding-top: 1pt; text-indent: 0pt; line-height: normal; text-align: left; white-space: nowrap;">
                        Vehicle Registration No.: ${data[0]?.vehicle_no || ""} -
                    </p>
                </td>

             
                <td style="width:142pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt;padding:2px">
                    <p class="s7" style="padding-left: 54pt;padding-right: 4pt;text-indent: 0pt;text-align: center;">Date.${formatDate(data[0]?.po_date) || ""}</p>
                    
                </td>
            </tr>
            <tr style="height:14pt">
                <td style="width:38pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt;padding-top:2px" bgcolor="#B8CCE4">
                    <p class="s14" style="padding-left: 4pt;padding-right: 3pt;text-indent: 0pt;line-height: 10pt;text-align: center;">S No</p>
                </td>
                <td style="width:182pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                padding-top:2px;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2" bgcolor="#B8CCE4">
                    <p class="s14" style="padding-left: 66pt;padding-right: 60pt;text-indent: 0pt;line-height: 10pt;text-align: center;">Description</p>
                </td>
                <td style="width:66pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                padding-top:2px;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#B8CCE4">
                    <p class="s14" style="padding-left: 10pt;padding-right: 9pt;text-indent: 0pt;line-height: 10pt;text-align: center;">HSN/SAC</p>
                </td>
                <td style="width:60pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                padding-top:2px;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#B8CCE4">
                    <p class="s14" style="padding-left: 19pt;padding-right: 18pt;text-indent: 0pt;line-height: 10pt;text-align: center;">Qty.</p>
                </td>
                <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                padding-top:2px; padding-left:10px;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#B8CCE4">
                    <p class="s14" style="text-indent: 0pt;line-height: 10pt;text-align: left;">Rate/Unit</p>
                </td>
                <td style="width:87pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                padding-top:2px;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#B8CCE4">
                    <p class="s14" style="text-indent: 0pt;line-height: 10pt;text-align: center;">Amount (Rs)</p>
                </td>
            </tr>
            <tr style="height:23pt">
                <td style="width:34pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                    <p class="s7" style="text-indent: 0pt;text-align: center;">1</p>
                </td>
                <td style="width:182pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                    <p class="s7" style="text-indent: 0pt;text-align: left;padding-left:2px">DISTRIBUTION TRANSFORMER</p>
                </td>
                <td style="width:60pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                 <td style="width:60pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt;padding-left:2px" colspan="2">
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;text-align: left;">TESTED &amp;SUPPLIED WITH SILICA GEL BREATHER</p>
                </td>                             
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                 <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s7" style="padding-top: 1pt;padding-left:2px;text-indent: 0pt;text-align: left;">
                        CAPACITY${"&nbsp;".repeat(12)}- <span style=" color: #F00;">      ${data[0]?.capacity || ""} </span>
                        KVA
                    </p>
                </td>                
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s7" style="padding-top: 1pt;padding-left: 16pt;padding-right: 15pt;text-indent: 0pt;text-align: center;">${data[0]?.hsn || ""}</p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s7" style="padding-top: 1pt;padding-left: 22pt;padding-right: 21pt;text-indent: 0pt;text-align: center;">${data[0]?.inv_det_qty || ""}</p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s7" style="padding-top: 1pt;padding-left: 13pt;text-indent: 0pt;text-align: left;">${Number(
        data[0]?.rate || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</p>
                </td>
                <td style="width:87pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s7" style="padding-top: 1pt;padding-right: 2pt;text-indent: 0pt;text-align: right;">${Number(
        data[0]?.amt || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</p>
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s7" style="padding-top: 1pt;padding-left:2px;text-indent: 0pt;text-align: left;">
                        VOLTAGE RATIO - <span style=" color: #F00;">${data[0]?.priratio || ""}</span>
                        /${data[0]?.secratio || ""} KV
                    </p>
                </td>
                 <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s7" style="padding-top: 1pt;padding-left: 22pt;padding-right: 21pt;text-indent: 0pt;text-align: center;">No.</p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
            </tr>
            <tr style="height:103pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s7" style="padding-top: 1pt;padding-left:2px;text-indent: 0pt;text-align: left;">
                        TYPE ${"&nbsp;".repeat(18)}    - <span style=" color: #F00;">${typeLabel || ""}</span>
                        
                    </p>
                </td>
             
                  <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s14" style="padding-top: 1pt;text-indent: 0pt;text-align: right;">Total Basic</p>
                </td>
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                 
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
               <td style="width:87pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;
               padding-top:2px;padding-right:5px;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                  <p class="s7" style="text-indent: 0pt;line-height: 8pt;text-align: right;">
                      ${data[0]?.basic_total
        ? new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(data[0].basic_total)
        : ""
      }
                  </p>
              </td>

            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;padding-top:2px;padding-right:5px;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s6" style="padding-top: 1pt;text-indent: 0pt;text-align: right;">C. GST ${data[0]?.quotation_cgst || ""} %</p>
                </td>
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-top-style:solid;border-top-width:1pt;padding-top:2px;
                padding-right:5px;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s6" style="padding-top: 1pt;text-indent: 0pt;text-align: right;">${Number(
        data[0]?.cgst || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</p>
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;padding-top:2px;padding-right:5px;border-right-width:1pt" colspan="2">
                    <p class="s6" style="text-indent: 0pt;text-align: right;">S. GST${data[0]?.quotation_sgst || ""} %</p>
                </td>
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-left-style:solid;border-left-width:1pt;padding-top:2px;padding-right:5px;border-right-style:solid;border-right-width:1pt">
                    <p class="s6" style="padding-top: 1pt;text-indent: 0pt;text-align: right;">${Number(
        data[0]?.sgst || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</p>
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt;padding-top:2px;padding-right:5px;" colspan="2">
                    <p class="s6" style="text-indent: 0pt;text-align: right;">I. GST</p>
                </td>
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-left-style:solid;border-left-width:1pt;padding-top:2px;padding-right:5px;border-right-style:solid;border-right-width:1pt">
                <p class="s6" style="padding-top: 1pt;text-indent: 0pt;text-align: right;">${Number(
        data[0]?.igst || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</p>
            </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;padding-top:2px;padding-right:5px;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s6" style="padding-top: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">Round off</p>
                </td>
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;padding-top:2px;padding-right:5px;border-right-width:1pt">
                <p class="s6" style="padding-top: 1pt;text-indent: 0pt;text-align: right;">0</p>
            </td>
            </tr>
            <tr style="height:12pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;padding-top:2px;padding-right:5px;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;text-align: right;">Grand Total.</p>
                </td>
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;padding-top:2px;
                padding-right:5px;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 7pt;text-align: right;">${Number(
        data[0]?.grand_total || 0
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
                  </p>
                </td>
            </tr>
            <tr style="height:12pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;padding-top:2px;padding-right:5px;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s7" style="padding-top: 2pt;text-indent: 0pt;line-height: 8pt;text-align: right;">Paid Amount</p>
                </td>
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;padding-top:2px;padding-right:5px;
                border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 7pt;text-align: right;">${data[0]?.paid_amount || ""}</p>
            </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:34pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:182pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;padding-top:2px;
                padding-right:5px;padding-bottom-2px;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">Remaining Amount.</p>
                </td>
                <td style="width:66pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:60pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:55pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:87pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;padding-top:1px;
                padding-right:5px;padding-bottom-5px;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                   <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">
                    ${(
        Number(data[0]?.grand_total || 0) - Number(data[0]?.paid_amount || 0)
      ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
                  </p>

                </td>
            </tr>
            <tr style="height:88pt">
                <td style="width:484pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="7">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
           <div style="text-align: center; width: 100%;">
           <div style="display: inline-block;">
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <span style="font-size:15px; font-weight: bold; width: 130px;">Date of Issue     :</span>
                <input type="text" value="${data[0]?.date_issue || ""}" 
                    style="margin-left: 5px; padding: 3px; border: 1px solid #ccc; border-radius: 4px; width: 90px;">
                <span style="margin-left: 10px; font-size:15px; font-weight: bold; width: 130px;">Time of Issue:</span>
                <input type="text" value="${data[0]?.time_issue || ""}" 
                    style="margin-left: 5px; padding: 3px; border: 1px solid #ccc; border-radius: 4px; width: 70px;">
            </div>
            <div style="display: flex; align-items: center;">
                <span style="font-size:15px; font-weight: bold; width: 130px;">Date of Removal:</span>
                <input type="text" value="${data[0]?.date_removal || ""}" 
                    style="margin-left: 5px; padding: 3px; border: 1px solid #ccc; border-radius: 4px; width: 90px;">
                <span style="margin-left: 10px; font-size:15px; font-weight: bold; width: 130px;">Time of Removal:</span>
                <input type="text" value="${data[0]?.time_removal || ""}" 
                    style="margin-left: 5px; padding: 3px; border: 1px solid #ccc; border-radius: 4px; width: 70px;">
            </div>
          </div>
              <p class="s7" style="padding-left: 2pt;padding-top:5px;padding-right: 84pt;text-indent: -1pt;line-height: 134%;text-align: left;">
                  Certified that the particulars given above are true and correct and the amount indicated represent the price actually charged and that there  is no few of additional consideration directly or indirectly from buyer.
              </p>
          </div> 
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:216pt;border-top-style:solid;border-top-width:1pt;padding-top:2px;padding-left:2px;border-left-style:solid;
                border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4" rowspan="2">
                  <p class="s7" style="text-indent: 0pt;text-align: left;">
                      RUPEES <span style=" color: #F00;">${numberToWordsIndian(Number(data[0]?.grand_total)) || ""} </span> Only
                  </p>
                </td>
                <td style="width:93pt;border-top-style:solid;border-top-width:1pt;border-left-style:padding-top:2px;padding-left:2px;solid;
                border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt" colspan="2">
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;"> C. GST ${data[0]?.quotation_cgst || ""} % -</p>
                </td>
               
                <td style="width:142pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;padding-top:2px;padding-left:2px;
                border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">                  
                      <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 8pt;text-align: center;">${Number(data[0]?.cgst || 0).toLocaleString("en-IN")}</p>
                </td>
            </tr>
            <tr style="height:12pt">
                <td style="width:93pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;padding-top:2px;padding-left:2px;
                border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt" colspan="2">
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;"> S. GST ${data[0]?.quotation_sgst || ""} % -</p>
                </td>               
                <td style="width:142pt;border-top-style:solid;border-top-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s7" style="padding-top: 1pt;text-indent: 0pt;line-height: 8pt;text-align: center;">${Number(data[0]?.sgst || 0).toLocaleString("en-IN")}</p>
                </td>
            </tr>
            <tr style="height:11pt">
                <td style="width:216pt;border-top-style:solid;border-top-width:1pt;padding-top:2px;padding-left:2px;border-left-style:solid;
                border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4" rowspan="2">
                    <p class="s14" style="text-indent: 0pt;line-height: 10pt;text-align: left;">I/We hereby certify that my/our registration certificate under the GST Act., 2017</p>
                    <p class="s14" style="padding-top: 5pt;padding-right: 3pt;text-indent: 0pt;line-height: 114%;text-align: left;">is in force on the date on which the sale of the goods specified in filing of return and the due tax, if any payable on the sale has been paid or shall be paid. &quot;been effected by me/us and it shallbe accounted for in the turnover of sales while invoice is made by me/us and that the transaction of sale covered by this tax invoice has this tax</p>
                </td>
                <td style="width:126pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;padding-top:5px;
                border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s14" style="padding-left: 32pt;text-indent: 0pt;line-height: 8pt;text-align: left;">Pre Authenticated</p>
                </td>
                <td style="width:142pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;padding-top:5px;border-left-width:1pt;
                border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="1">
                    <p class="s14" style="padding-left: 34pt;text-indent: 0pt;line-height: 8pt;text-align: left;">Authorised Signetory</p>
                </td>
            </tr>
            <tr style="height:44pt">
                <td style="width:126pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2" rowspan="2">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:142pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;
                border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="1" rowspan="2">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
            </tr>
            <tr style="height:50pt">
                <td style="width:216pt;border-top-style:solid;border-top-width:1pt;padding-top:2px;padding-left:2px;border-left-style:solid;border-left-width:1pt;
                border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4">
                    <p class="s14" style="padding-right: 9pt;text-indent: 0pt;line-height: 115%;text-align: justify;">
                        Terms &amp;Conditions: <span class="s14">Intrest will be recovered@24%p.a.on overdue unpaid bills •No claims regarding the quantity,quality,damages or shortages will be given unless the same notified at the time of receiveing goods</span>
                    </p>
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                    <p class="s14" style="text-indent: 0pt;line-height: 7pt;text-align: justify;padding-bottom:2px;padding-left:2px;">SUBJECT TO PUNE JURISDICTION.</p>
                </td>
            </tr>
        </table>
    </body>
</html>

      `;
    printWindow.document.write(headerContent);
    printWindow.document.close();
    printWindow.print();
  };

  let typeLabel = "";
  if (data[0]?.type === 1) {
    typeLabel = "OUTDOOR";
  } else if (data[0]?.type === 2) {
    typeLabel = "INDOOR";
  } else if (data[0]?.type === 2) {
    typeLabel = "INDOOR/OUTDOOR";
  }
  const basic_total = data[0]?.amt ? parseFloat(data[0]?.amt) : 0; // Convert to number
  let cgst = 0,
    sgst = 0,
    igst = 0;

  const gstNumber = data[0]?.gstNo || ""; // Get GST from data
  const gstRegex = /^27\d{2}[A-Z0-9]+$/i; // Maharashtra GST check (27)

  // Tax values
  const cgstRate = parseFloat(data[0]?.tax_cgst) || 0;
  const sgstRate = parseFloat(data[0]?.tax_sgst) || 0;
  const cgstType = data[0]?.tax_cgsttype || "";
  const sgstType = data[0]?.tax_sgsttype || "";
  let totalgst = 0;
  if (data[0]?.cgst == 0 || data[0]?.sgst == 0) {
    totalgst = data[0]?.igst;
  } else {
    totalgst = parseInt(data[0]?.cgst) + parseInt(data[0]?.sgst);
  }
  // Determine tax calculation type (Maharashtra = CGST+SGST, Other states = IGST)
  if (!gstNumber || gstRegex.test(gstNumber)) {
    console.log("gstNumber", gstNumber);
    // **Intra-State Transaction (Maharashtra) → Apply CGST & SGST**
    if (cgstType === "Exclusive") {
      cgst = (basic_total * cgstRate) / 100;
    }
    if (sgstType === "Exclusive") {
      sgst = (basic_total * sgstRate) / 100;
    }
    console.log(data[0]?.cgst, data[0]?.sgst);
    igst = 0; // No IGST for Maharashtra
  } else {
    // **Inter-State Transaction → Apply IGST (Sum of CGST + SGST)**
    if (cgstType === "Exclusive" && sgstType === "Exclusive") {
      igst = (basic_total * (cgstRate + sgstRate)) / 100;
    }
    cgst = 0; // No CGST/SGST for inter-state
    sgst = 0;
  }

  // Rounding values to 2 decimal places
  const roundedBasicTotal = Math.round(basic_total * 100) / 100;
  const roundedCgst = Math.round(cgst * 100) / 100;
  const roundedSgst = Math.round(sgst * 100) / 100;
  const roundedIgst = Math.round(igst * 100) / 100;

  // Grand Total Calculation
  const grand_total = Math.floor(
    roundedBasicTotal + roundedCgst + roundedSgst + roundedIgst
  );
  const net_total =
    grand_total -
    (parseFloat(data[0]?.remainingadvance) ||
      parseFloat(data[0]?.paid_amount) ||
      0);

  // **Logging for Debugging**
  console.log("Basic Total:", basic_total);
  console.log("CGST Rate:", cgstRate, "SGST Rate:", sgstRate);
  console.log("CGST Type:", cgstType, "SGST Type:", sgstType);
  console.log(
    "GST Number:",
    gstNumber,
    "Matches Maharashtra?:",
    gstRegex.test(gstNumber)
  );
  console.log("Calculated CGST:", roundedCgst);
  console.log("Calculated SGST:", roundedSgst);
  console.log("Calculated IGST:", roundedIgst);
  console.log("Grand Total:", grand_total);
  console.log("Net Total:", net_total.toFixed(2));

  const scales = ["", "Thousand", "Lakh", "Crore"];
  const words = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertLessThanOneThousand(num) {
    if (num === 0) {
      return "";
    } else if (num < 20) {
      return words[num] + " ";
    } else if (num < 100) {
      return (
        tens[Math.floor(num / 10)] + " " + convertLessThanOneThousand(num % 10)
      );
    } else {
      return (
        words[Math.floor(num / 100)] +
        " Hundred " +
        convertLessThanOneThousand(num % 100)
      );
    }
  }
  function NumberToWords(num) {
    if (num === 0) {
      return "Zero";
    }

    let words = "";
    let scaleIndex = 0;

    while (num > 0) {
      if (num % 1000 !== 0) {
        words =
          convertLessThanOneThousand(num % 1000) +
          scales[scaleIndex] +
          " " +
          words;
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return words.trim();
  }
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div class="d-flex justify-content-between">
            <div className="page_header">
              <h3>Print Invoice</h3>
            </div>
            <Link to="/invoice" style={{ textDecoration: "none" }}>
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
              ></Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="invoiceno"
                    label="Invoice Nimber "
                    name="invoiceno"
                    value={data[0]?.invoice_no}
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
                      id="invoicedate"
                      label="Invoice Date "
                      name="invoicedate"
                      value={formatDate(data[0]?.inv_date)}
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
                  id="buyername"
                  label="Buyer Name "
                  labelprope
                  name="buyername"
                  value={data[0]?.buyername}
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
                    id="customeraddress"
                    label="Customer Address"
                    name="customeraddress"
                    value={data[0]?.buyer_addr}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="consigneenaame"
                    label="Consignee Naame"
                    name="consigneenaame"
                    value={data[0]?.consumer}
                    sx={{ marginBottom: "15px" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="consigneeaddress"
                    label="Consignee Address "
                    name="consigneeaddress"
                    value={data[0]?.invoice_no}
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
                      id="consignee_cat"
                      label="Category Of Consignee "
                      name="consignee_cat"
                      value={data[0]?.consign_addr}
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 5 }}>
                    <TextField
                      fullWidth
                      id="vehicleno"
                      label="Vehicle No"
                      name="vehicleno"
                      value={data[0]?.vehicle_no}
                      sx={{ marginBottom: "15px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={9}
                sm={3}
                style={{ marginLeft: -100, marginTop: 20 }}
              >
                <Button
                  variant="contained"
                  sx={{ background: "#007bff" }}
                  type="submit"
                  onClick={handlePrint}
                >
                  Save And Print
                </Button>
              </Grid>
              <Grid
                item
                xs={9}
                sm={3}
                style={{ marginTop: -35, marginLeft: 200 }}
              >
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

export default PrintInvoice;
