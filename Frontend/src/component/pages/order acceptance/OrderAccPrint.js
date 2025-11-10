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


import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";
import dayjs from "dayjs";








const OrderAccPrint = () => {
  const { id } = useParams();
  console.log("id:", id);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // 
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getAccorderprint/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonData = await response.json();
      console.log(jsonData)
      setData(jsonData);
      console.log(jsonData);
      console.log("API Response Data:", jsonData);

      // Fetch quotParameter
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);



  const formattedDate1 = data.podate
    ? new Date(data.podate).toLocaleDateString("en-GB")
    : "";
  const amount = data.quantity * data.basicrate
  console.log(amount)
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

    return words;
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
  // Example usage

  const CGST = data.cgst * amount / 100
  const SGST = data.sgst * amount / 100
  const grandtotal = CGST + SGST + amount
  const nettotal = grandtotal - data.advance
  const numericAmount = nettotal;
  const amountInWords = NumberToWords(Number(numericAmount));

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.open();

    // Header content with centered styling
    const headerContent = `
    <html  xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title >&nbsp;</title>
        <style type="text/css">
            * {
                margin: 0;
                padding: 0;
                text-indent: 0;
            }

            h1 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 16pt;
            }

            h3 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 9pt;
            }

            p {
                color: black;
                font-family: Arial, sans-serif;
                font-style: italic;
                font-weight: bold;
                text-decoration: none;
                font-size: 10pt;
                margin: 0pt;
            }

            h2 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 11pt;
            }

            .s1 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 10pt;
            }

            .s2 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 9pt;
            }

            .s3 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: italic;
                font-weight: bold;
                text-decoration: none;
                font-size: 10pt;
               
            }

            table, tbody {
                vertical-align: top;
                overflow: visible;
            }
            @media print {
              .new-page-element {
                page-break-before: always;
              }
            }
            
        </style>
    </head>
    <body>
        <h1 style="padding-top: pt;text-indent: 0pt;text-align: center;">STATIC ELECTRICALS PUNE</h1>
        <h3 style="padding-top: 1pt;text-indent: 0pt;text-align: center;">Manufacturers and Repaires of Power and Distribution Transformers.</h3>
        <p style="padding-top: 2pt;text-indent: 0pt;line-height: 11pt;text-align: center;">S. No. 229/2/2, Behind Rajiv Gandhi Infotech Park, Phase 1, Hinjawadi, Pune - 411057</p>
        <p style="text-indent: 0pt;line-height: 11pt;text-align: center;">Telefax:020 - 22933059</p>
        <h2 style="padding-top: 2pt;text-align: center;">ORDER ACCEPTANCE</h2>
        
            <br/>
        
        <table style="border-collapse:collapse;margin-right:2%" cellspacing="0">
            <tr style="height:34pt">
                <td style="width:500pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="6">
                    <p class="s1" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 11pt;text-align: left;">Dear Sir,</p>
                    <p class="s1" style="padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">we are in receipt of your valuable purchase order for the following items and herby confirming the acceptance with terms &amp; conditions mentioned in this.</p>
                </td>
            </tr>
            <tr style="height:13pt">
                <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3">
                    <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;">Buyer:-&nbsp;&nbsp;${data.custname}</p>
                </td>
                <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 4pt;text-indent: -2pt;line-height: 261%;text-align: left;">Quot.Ref: PO.NO:</p>
                </td>
                <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;margin-top:8px;">${data.quotref}</p>
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                    <p class="s2" style="padding-top: 4pt;padding-left: 2pt;text-indent: 0pt;line-height: 87%;text-align: left;">${data.ponum || ''}</p>
                </td>
                <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 261%;text-align: left;">DATE:${formattedDate}  ${formattedDate1 && `DATE:${formattedDate1}`}</p>
                </td>
            </tr>
            <tr style="height:45pt">
                <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">${data.address.replace(/\n/g, "<br>")}</p>
                </td>
            </tr>
            
            <tr style="height:13pt">
                <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3">
                    <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;">GST NO:-&nbsp;&nbsp;${data.gstno}</p>
                </td>    
                  <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3">
                      <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;">  ${(data.comment ?? '').replace(/\n/g, '<br>')}&nbsp;&nbsp;</p>
                  </td>
                            
            </tr>
            <tr style="height:60pt">
                <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3">
                    <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">Consumer:- ${data.consumer || ""}</p>
                    <p class="s2" style="padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">
                ${(data.consumer_address || "").replace(/\n/g, "<br>")}           
         </p>
                </td>
                 <td style="width:238pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3">
                    <p class="s2" style="padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">
                     
                    </p>
                </td>
                
                
            </tr>
            <tr style="height:13pt">
                <td style="width:313pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3" bgcolor="#BFBFBF">
                    <p class="s2" style="padding-top: 2pt;padding-left: 100pt;padding-right: 111pt;text-indent: 0pt;line-height: 9pt;text-align: center;">ITEM DESCRIPTION</p>
                </td>
                <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s2" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 9pt;text-align: right;">QUANTITY</p>
                </td>
                <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s2" style="padding-top: 2pt;padding-left: 19pt;text-indent: 0pt;line-height: 9pt;text-align: left;">RATE</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s2" style="padding-top: 2pt;padding-left: 17pt;text-indent: 0pt;line-height: 9pt;text-align: left;">AMOUNT</p>
                </td>
            </tr>
            <tr style="height:289pt">
                <td style="width:313pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3">
                    <p class="s1" style="padding-top: 7pt;padding-left: 2pt;padding-right: 2pt;text-indent: 0pt;line-height: 130%;text-align: left;">Distribution Transformer duly tested and filled with Transformer oil and supplied with silica gel breather.</p>
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                    <p class="s2" style="padding-left: 2pt;text-indent: 0pt;text-align: left;">
                        Capacity:<span class="s1">&nbsp;${data.capacity}KVA</span>
                    </p>
                          <p class="s2" style="padding-top: 4pt;padding-left: 2pt;text-indent: 0pt;line-height: 139%;text-align: left;">
                        Voltage Ratio:<span class="s1">&nbsp;${data.voltageratio}</span>
                    </p>
                        
                    
                                        <p class="s2" style="padding-top: 4pt;padding-left: 2pt;padding-right: 195pt;text-indent: 0pt;line-height: 139%;text-align: left;">
                        Type:<span class="s1">&nbsp;${getTypeLabel(data.type)}</span>
                    </p>
                    <p class="s2" style="padding-left: 2pt;text-indent: 0pt;text-align: left;">
                        Winding Material :<span class="s1">&nbsp;${data.matofwind}</span>
                    </p>
                    <p class="s2" style="padding-top: 4pt;padding-left: 2pt;text-indent: 0pt;line-height: 139%;text-align: left;">
                        Tapings :<span class="s1">&nbsp;${data.typetaping}</span>
                    </p>
                    <p class="s2" style="padding-top: 1pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Accessories :&nbsp;${data.accessories || ''}</p>
                    <p class="s2" style="padding-top: 4pt;padding-left: 2pt;padding-right: 173pt;text-indent: 0pt;line-height: 139%;text-align: left;">
                        Transport :<span class="s1">&nbsp;${data.transport}</span>
                     
                    </p>
                    <p class="s2" style="padding-top: 4pt;padding-left: 2pt;text-indent: 0pt;line-height: 139%;text-align: left;">
                        Unloading :<span class="s1">&nbsp;${data.unloading}</span>
                    </p>
                        
                    <p class="s2" style="padding-left: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 139%;text-align: left;">
                        Payment Terms :<span class="s1">&nbsp;${data.paymentdesc}</span>
                    </p>
                    <p class="s2" style="padding-left: 2pt;text-indent: 0pt;text-align: left;">
                        Guarantee :<span class="s1">&nbsp;${data.guranteetext?.replace("*", data.guranteeperiod || "*") || ""}</span>
                    </p>
                    <p class="s2" style="padding-top: 4pt;padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">
                        Delivery Period :<span class="s1">&nbsp;${data.deliverydesc?.replace("*", data.deliveryperiod || "*") || ""}</span>
                    </p>
                </td>
                <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: center;">${data.quantity}</p>
                </td>
                <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-left: 32pt;text-indent: 0pt;text-align: left;">${data.basicrate}</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: center;">${amount}</p>
                </td>
            </tr>
            <tr style="height:14pt">
                <td style="width:313pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3" rowspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${amountInWords}</p>
                </td>
                <td style="width:112pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 40pt;padding-right: 40pt;text-indent: 0pt;line-height: 10pt;text-align: center;">TOTAL</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${amount}</p>
                </td>
            </tr>
            <tr style="height:14pt">
                <td style="width:112pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 34pt;text-indent: 0pt;line-height: 10pt;text-align: left;">C.GST ${data.cgst}%</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${CGST}</p>
                </td>
            </tr>
            <tr style="height:14pt">
                <td style="width:313pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3" rowspan="6">
                    <p class="s2" style="padding-top: 1pt;padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">Bank Details:-</p>
                    <p class="s2" style="padding-top: 1pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;">Name: Static Electricals Pune</p>
                    <p class="s2" style="padding-top: 1pt;padding-left: 2pt;padding-right: 122pt;text-indent: 0pt;line-height: 87%;text-align: left;">ICIC Bank – A/c No: 003905501942 </p>
                    <p class="s2" style="padding-top: 1pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;">Branch:ShivajiNager Branch,Ghole Road, Pune 411005</p>
                    <p class="s2" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;">RTGS / NEFT / IFSC Code: ICIC0000039</p>
                    <p class="s2" style="padding-top: 7pt;padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">GST No: 27ABEFS1957R1ZD</p>
                    <p class="s2" style="padding-top: 1pt;padding-left: 2pt;padding-right: 67pt;text-indent: 0pt;line-height: 87%;text-align: left;">Name of Commodity:ELECTRICAL TRANSFORMER.</p>
                    <p class="s2" style="padding-top: 1pt;padding-left: 2pt;padding-right: 67pt;text-indent: 0pt;line-height: 87%;text-align: left;">
                    Tariff Heading No:85042100
                        <br/>
                    </p>
                    <p class="s2" style="padding-top: 35pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">Subject to pune Jurisdiction only.</p>
                </td>
                <td style="width:112pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2" >
                    <p class="s2" style="padding-top: 2pt;padding-left: 34pt;text-indent: 0pt;line-height: 10pt;text-align: left;">S.GST ${data.sgst}%</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${SGST}</p>
                </td>
            </tr>
            <tr style="height:13pt">
                <td style="width:112pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 34pt;text-indent: 0pt;line-height: 9pt;text-align: left;">I.GST 18%</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
            </tr>
            <tr style="height:14pt">
                <td style="width:112pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 29pt;text-indent: 0pt;line-height: 10pt;text-align: left;">Grand Total.</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${grandtotal}</p>
                </td>
            </tr>
            <tr style="height:14pt">
                <td style="width:112pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 37pt;text-indent: 0pt;line-height: 10pt;text-align: left;">Advance</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${data.advance}</p>
                </td>
            </tr>
            <tr style="height:5pt">
                <td style="width:112pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                    <p class="s2" style="padding-top: 2pt;padding-left: 31pt;text-indent: 0pt;line-height: 10pt;text-align: left;">NET TOTAL</p>
                </td>
                <td style="width:75pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;"><b>${nettotal}</b></p>
                </td>
            </tr>
            <tr style="height:89pt">
                <td style="width:187pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                    <p class="s3" style="padding-left: 2pt;text-indent: 0pt;text-align: left;">For STATIC ELECTRICALS PUNE.</p>
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                    <p class="s3" style="padding-left: 2pt;text-indent: 0pt;text-align: left;  margin-top: 39pt; ">Authorised Signatory</p>
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


  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div class="d-flex justify-content-between">
            <div className="page_header">
              <h3>Order Acceptance Quotation</h3>
            </div>
            <Link to="/orderAcceptance" style={{ textDecoration: "none" }}>
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
                {/* <Grid item xs={8}>
              <TextField
                fullWidth
                id="quotref"
                label="Quotation Ref"
                name="quotref"
                autoComplete="quotref"
                value={data.quotref}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            </Grid> */}
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
                    value={dayjs(data.qdate).format('DD-MM-YYYY')}
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
                    multiline
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
                      id="quantity"
                      label="Quantity"
                      name="quantity"
                      value={data.quantity}
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
                      value="3"
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
                      id="frequency"
                      label="Frequency"
                      name="frequency"
                      value="50 HZ"
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
                <Button variant="contained" sx={{
                  background: "#00cff4",
                  "&:hover": {
                    background: "#00cff4", // Set the same color as the default background
                  },
                }} type="submit" onClick={handlePrint} >
                  Print
                </Button>
              </Grid>
              <Grid item xs={9} sm={3} style={{ marginTop: -35, marginLeft: 200 }}>
                <Link to="/orderAcceptance" style={{ textDecoration: "none" }}>
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
  )
}

export default OrderAccPrint