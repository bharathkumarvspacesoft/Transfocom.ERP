import Button from "@mui/material/Button";
import { Paper, TextField } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, NavLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { APP_BASE_PATH } from "Host/endpoint";
import { da } from "date-fns/locale";
const Printprofoma = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);







    const fetchData = async () => {
        try {
            const response = await fetch(`${APP_BASE_PATH}/profomainvoice/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const jsonData = await response.json();
            console.log("API Response Data:", jsonData); // Add this line
            setData(jsonData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, [id]);
    let t = "num"
    if (data.type === 1) {
        t = "OUTDOOR"
    } else if (data.type === 2) {
        t = "INDOOR"
    } else {
        t = "INDOOR/OUTDOOR"
    }
    const formattedDate1 = data.podate ? new Date(data.podate).toLocaleDateString('en-GB') : null;
    const formattedDate = new Date(data.pro_invdate).toLocaleDateString('en-GB');
    const amount = data.quantity * data.basicrate
    console.log(amount)
    function amountToWords(amount) {
        const singleDigits = [
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"
        ];

        const tensNames = [
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ];

        const teensNames = [
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"
        ];

        function convertLessThanOneThousand(num) {
            let result = "";

            if (num >= 100) {
                result += singleDigits[Math.floor(num / 100)] + " Hundred";
                num %= 100;
                if (num > 0) {
                    result += " and ";
                }
            }

            if (num >= 20) {
                result += tensNames[Math.floor(num / 10)];
                num %= 10;
                if (num > 0) {
                    result += " ";
                }
            }

            if (num > 0) {
                if (num < 10) {
                    result += singleDigits[num];
                } else {
                    result += teensNames[num - 10];
                }
            }

            return result.trim();
        }

        if (amount === 0) {
            return "Zero";
        }

        let words = "";

        if (amount >= 10000000) { // Crore (1,00,00,000)
            words += convertLessThanOneThousand(Math.floor(amount / 10000000)) + " Crore ";
            amount %= 10000000;
        }

        if (amount >= 100000) { // Lakh (1,00,000)
            words += convertLessThanOneThousand(Math.floor(amount / 100000)) + " Lakh ";
            amount %= 100000;
        }

        if (amount >= 1000) { // Thousand (1,000)
            words += convertLessThanOneThousand(Math.floor(amount / 1000)) + " Thousand ";
            amount %= 1000;
        }

        if (amount > 0) { // Remaining 0-999
            words += convertLessThanOneThousand(amount);
        }

        return words.trim();
    }


    // Example usage
    const numericAmount = amount;
    const amountInWords = amountToWords(numericAmount);
    const CGST =
        data.cgsttype === "Inclusive" || isNaN(Number(data.cgst))
            ? 0
            : (Number(data.cgst) * amount) / 100;

    const SGST =
        data.sgsttype === "Inclusive" || isNaN(Number(data.sgst))
            ? 0
            : (Number(data.sgst) * amount) / 100;
    const Igst = (Number(data.cgst) + Number(data.sgst)) || 0
    const IGST =
        data.cgsttype === "Inclusive" && data.sgsttype === "Inclusive"
            ? ((Number(data.cgst) || 0) + (Number(data.sgst) || 0)) * amount / 100
            : 0;
    console.log(data.cgst);
    console.log(data.sgst);


    console.log(IGST);

    const grandtotal = CGST + SGST + amount
    const nettotal = grandtotal - data.advance
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");

        // Calculate the total quantity


        const template = `
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
      
                  p {
                      color: black;
                      font-family: Arial, sans-serif;
                      font-style: normal;
                      font-weight: bold;
                      text-decoration: none;
                      font-size: 10pt;
                      margin: 0pt;
                  }
      
                  .s1 {
                      color: black;
                      font-family: Arial, sans-serif;
                      font-style: italic;
                      font-weight: bold;
                      text-decoration: none;
                      font-size: 10pt;
                  }
      
                  .s2 {
                      color: black;
                      font-family: Arial, sans-serif;
                      font-style: normal;
                      font-weight: normal;
                      text-decoration: none;
                      font-size: 12pt;
                  }
      
                  .s3 {
                      color: black;
                      font-family: Arial, sans-serif;
                      font-style: normal;
                      font-weight: normal;
                      text-decoration: none;
                      font-size: 10pt;
                  }
      
                  .s4 {
                      color: black;
                      font-family: Arial, sans-serif;
                      font-style: normal;
                      font-weight: bold;
                      text-decoration: none;
                      font-size: 8pt;
                  }
      
                  .s5 {
                      color: black;
                      font-family: Arial, sans-serif;
                      font-style: normal;
                      font-weight: normal;
                      text-decoration: none;
                      font-size: 9pt;
                  }
      
                  table, tbody {
                      vertical-align: top;
                      overflow: visible;
                  }
                  
              </style>
          </head>
          <body>
              <h1 style="padding-top: 3pt;text-indent: 0pt;text-align: center;">STATIC ELECTRICALS PUNE</h1>
              <p style="text-indent: 0pt;text-align: left;"/>
              <p style="padding-top: 1pt;text-indent: 0pt;text-align: center;">Manufacturer And Repaire of Power And Distribution Transformers</p>
              <p style="text-indent: 0pt;text-align: left;">
                  <br/>
              </p>
              <table style="border-collapse:collapse;" cellspacing="0">
                  <tr style="height:24pt">
                      <td style="width:500pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4">
                          <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 11pt;text-align: left;">Sr. No. 229/2/2, Behind Rajiv Gandhi Infotech Park, Phase 1, Hinjawadi, Pune  411057.</p>
                      </td>
                  </tr>
                  <tr style="height:20pt">
                      <td style="width:500pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4">
                      <p class="s2" style="padding-top: 2pt; padding-left: 187pt; padding-right: 187pt; text-indent: 0pt; text-align: center;">
                      <span style="border-bottom: 1px solid black;font-weight: bold">PROFORMA INVOICE</span>
                    </p>
                      </td>
                  </tr>
                  <tr style="height:24pt">
                      <td style="width:500pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4">
                          <p class="s3" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">Dear Sir, Following items are ready for dispatch.You are requested to release the payment according this Proforma Invoice as early as possible.</p>
                      </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left; font-size: 10pt;">Customer:-</p>
                      </td>
                      <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="4">
                          <p class="s4" style="padding-top: 2pt;padding-left: 4pt;padding-right: 15pt;text-indent: -2pt;line-height: 261%;text-align: left;">PRO.INV: PO.NO:</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="4">
                          <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;text-align: left;">${data.pro_invrefno}</p>
                          <p style="text-indent: 0pt;text-align: left;">
                              <br/>
                          </p>
                          <p class="s4" style="padding-top: 7pt;padding-left: 2pt;text-indent: 0pt;line-height: 87%;text-align: left;">${data.ponum}</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="4">
                        <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 261%;text-align: left;">
                        DATE:${formattedDate}
                        ${formattedDate1 ? ` DATE:${formattedDate1}` : ''}
                        </p>
                      </td>
                  </tr>
                  <tr style="height:50pt">
                     <td style="width:238pt;border-left-style:solid;border-left-width:1pt;border-right-style:solid;border-right-width:1pt">
                        <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 12pt;text-align: left;font-size: 10pt;">${data.custname}</p>
                        <p class="s4" style="padding-left: 2pt; text-indent: 0pt; line-height: 12pt; text-align: left;font-size: 10pt;">
                            ${data?.address ? data.address.split(',').join(',<br>') : ""}
                        </p>
                    </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:238pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s4" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">GST NO:-${data.gstno}</p>
                      </td>
                  </tr>
             
                  <tr style="height:70pt">
                     <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">   
                        <p class="s4" style="padding-top: 1pt;padding-left: 2pt;text-indent: 0pt;line-height: 12pt;text-align: left;font-size: 10pt;">Consumer: ${data.consumer}</p>
                        <p class="s4" style="padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;"></p>
                        <p class="s4" style="padding-left: 2pt; text-indent: 0pt; line-height: 12pt; text-align: left;font-size: 10pt;">
                            ${data?.consumer_address ? data.consumer_address.split(',').join(',<br>') : ""}
                        </p>
                    </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                          <p class="s4" style="padding-top: 2pt;padding-left: 71pt;text-indent: 0pt;line-height: 10pt;text-align: left;">ITEM DESCRIPTION</p>
                      </td>
                      <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                          <p class="s4" style="padding-top: 2pt;padding-left: 5pt;text-indent: 0pt;line-height: 10pt;text-align: left;">QUANTITY</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                          <p class="s4" style="padding-top: 2pt;padding-left: 35pt;padding-right: 35pt;text-indent: 0pt;line-height: 10pt;text-align: center;">RATE</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                          <p class="s4" style="padding-top: 2pt;padding-left: 28pt;text-indent: 0pt;line-height: 10pt;text-align: left;">AMOUNT</p>
                      </td>
                  </tr>
                  <tr style="height:250pt">
                      <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 7pt;padding-left: 2pt;padding-right: 47pt;text-indent: 0pt;line-height: 130%;text-align: left;">Distribution Transformer duly tested and filled with Transformer oil and supplied with silica gel breather.</p>
                          <p style="text-indent: 0pt;text-align: left;">
                              <br/>
                          </p>
                            <p class="s4" style="padding-left: 2pt;text-indent: 0pt;text-align: left;font-size: 10pt;line-height: 12pt;">Capacity :- ${data.capacity}KVA</p>
                            <p class="s4" style="padding-top: 3pt;padding-left: 2pt;padding-right: 90pt;text-indent: 0pt;line-height: 130%;text-align: left;font-size: 10pt;">Voltage Ratio :- ${data.voltageratio}V </br> Type :- ${t}</p>                      
                        </td>
                      <td style="width:62pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${Number(data.quantity || 0).toLocaleString("en-IN")}</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${Number(data.basicrate || 0).toLocaleString("en-IN")}</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${Number(amount || 0).toLocaleString("en-IN")}</p>
                      </td>
                  </tr>
                  
                  <tr style="height:14pt">
                     <td style="width:238pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2">
                        <p class="s4" style="padding-top: 3pt;padding-left: 2pt;padding-right: 5pt;text-indent: 0pt;line-height: 87%;text-align: left;font-size: 10pt;">${amountToWords(nettotal)}</p>
                    </td>
                     <td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                        <p class="s4" style="padding-top: 2pt;padding-left: 55pt;padding-right: 55pt;text-indent: 0pt;line-height: 12pt;text-align: center;font-size: 12pt;">TOTAL</p>
                        </td>
                        <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                        <p class="s4" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 12pt;text-align: right;font-size: 12pt;">${Number(amount || 0).toLocaleString("en-IN")}</p>
                    </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                          <p class="s4" style="padding-top: 2pt;padding-left: 55pt;padding-right: 55pt;text-indent: 0pt;line-height: 10pt;text-align: center;">C.GST ${data.cgsttype === "Inclusive" || data.cgst === "-" || isNaN(Number(data.cgst))
                ? ""
                : `${Number(data.cgst).toLocaleString("en-IN")}`}
                    %</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${Number(CGST || 0).toLocaleString("en-IN")}</p>
                      </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:268pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="6">
                          <p class="s5" style="padding-top: 3pt;padding-left: 2pt;padding-right: 90pt;text-indent: 0pt;line-height: 87%;text-align: left;">RANGE:THERGAON DIVISION:PUNE IV</p>
                          <p class="s5" style="padding-top: 7pt;padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;font-weight: bold;">Bank Details:-</p>
                          <p class="s5" style="padding-top: 2pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;font-weight: bold;">Name:&nbsp;&nbsp; Static Electricals Pune</p>
                          <p class="s5" style="padding-top: 2pt;padding-left: 2pt;padding-right: 47pt;text-indent: 0pt;line-height: 87%;text-align: left;font-weight: bold;">ICIC Bank – A/c No:&nbsp;&nbsp; 003905501942</p>
                                              <p class="s5" style="padding-top: 1pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;font-weight: bold;">Branch:&nbsp;&nbsp;Shivaji Nager, Pune 411005</p>
                    <p class="s5" style="padding-top: 3pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;font-weight: bold;">RTGS / NEFT / IFSC Code:&nbsp;&nbsp; ICIC0000039</p>
                    
                          
                          <p style="text-indent: 0pt;text-align: left;">
                              <br/>
                          </p>
                          <p class="s5" style="padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">COMMISSIONERATE:PUNE</p>
                          <p class="s5" style="padding-left: 2pt;padding-right: 67pt;text-indent: 0pt;line-height: 87%;text-align: left;">Central Excise.Registration Certificate GST No: </p>
                          <p class="s5" style="padding-top:3pt;padding-left: 2pt;padding-right: 67pt;text-indent: 0pt;line-height: 87%;text-align: left;">27ABEFS1957R1ZD</p>
                          <p class="s5" style="padding-top:2pt;padding-left: 2pt;text-indent: 0pt;line-height: 87%;text-align: left;">Name of Excisable Commodity:ELECTRICAL TRANSFORMER.</p>
                          <p class="s5" style="padding-top:2pt;padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left;">Tariff Heading No:85042100</p>
                          <p style="text-indent: 0pt;text-align: left;">
                              <br/>
                          </p>
                          <p class="s5" style="padding-left: 2pt;text-indent: 0pt;line-height: 9pt;text-align: left; padding-top: 90px;">Subject to Pune Jurisdiction only.</p>
                      </td>
                      <td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                          <p class="s4" style="padding-top: 2pt;padding-left: 55pt;padding-right: 55pt;text-indent: 0pt;line-height: 10pt;text-align: center;">S.GST${data.sgsttype === "Inclusive" || data.sgst === "-" || isNaN(Number(data.sgst))
                ? ""
                : `${Number(data.sgst).toLocaleString("en-IN")}`}
                        %</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${Number(SGST || 0).toLocaleString("en-IN")}</p>
                      </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                          <p class="s4" style="padding-top: 2pt;padding-left: 55pt;padding-right: 55pt;text-indent: 0pt;line-height: 10pt;text-align: center;">I.GST ${Igst}%</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${Number(IGST || 0).toLocaleString("en-IN")}</p>
                              <br/>
                          </p>
                      </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                          <p class="s4" style="padding-top: 2pt;padding-left: 51pt;text-indent: 0pt;line-height: 10pt;text-align: left;">Grand Total.</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${Number(grandtotal || 0).toLocaleString("en-IN")}</p>
                      </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                          <p class="s4" style="padding-top: 2pt;padding-left: 55pt;padding-right: 55pt;text-indent: 0pt;line-height: 10pt;text-align: center;">Advance</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${Number(data.advance || 0).toLocaleString("en-IN")}</p>
                      </td>
                  </tr>
                  <tr style="height:14pt">
                      <td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2">
                          <p class="s4" style="padding-top: 2pt;padding-left: 53pt;text-indent: 0pt;line-height: 10pt;text-align: left;">NET TOTAL</p>
                      </td>
                      <td style="width:100pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                          <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;"><b>${Number(nettotal || 0).toLocaleString("en-IN")}</b></p>
                      </td>
                  </tr>
                  <tr style="height:123pt">
                      <td style="width:262pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3">
                          <p style="text-indent: 0pt;text-align: left;">
                              <br/>
                          </p>
                          <p class="s1" style="padding-left: 2pt;text-indent: 0pt;text-align: left;">For STATIC ELECTRICALS PUNE.</p>
                          <p style="text-indent: 0pt;text-align: left;">
                              <br/>
                          </p>
                          <p class="s1" style="padding-left: 2pt; text-indent: 0pt; text-align: left; padding-top: 90px;">Authorised Signatory</p>
                      </td>
                  </tr>
              </table>
          </body>
      </html>
      
          `;

        printWindow.document.write(template);
        printWindow.document.close();
        printWindow.print();

    };
    return (
        <>
            <div class="d-flex justify-content-between">
                <div className="page_header">
                    <h3>Print ProfomaInvoice</h3>
                </div>
                <Link to="/proformaInvoice" style={{ textDecoration: "none" }}>
                    <Button variant="contained" color="warning">
                        Back
                    </Button>
                </Link>
            </div>

            <Paper style={{ marginTop: 20 }}>
                <Box sx={{ flexGrow: 1 }}>
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="pro_invrefno"
                                label=" Proforma Ref"
                                name="quotref"
                                autoComplete="pro_invrefno"
                                value={data.pro_invrefno || ""}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        className="date-pick-wrp"
                        item
                        xs={4}
                        style={{ marginTop: 5, marginLeft: 1 }}
                    >
                        <TextField
                            fullWidth
                            id="pro_invdate"
                            label="Date"
                            name="pro_invdate"
                            autoComplete="pro_invdate"
                            value={formattedDate || ""}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ marginBottom: "15px", marginTop: "15px" }}
                            disabled
                        />
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  defaultValue={dayjs(new Date())}
                  label="Date"
                  
                  name="pro_invdate"
                  value={data.pro_invdate}
                 
                  format="DD/MM/YYYY"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ marginBottom: "15px",marginTop: "15px" }}
                />
              </LocalizationProvider> */}
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="customer"
                                label="Customer Name"
                                name="customer"
                                value={data.custname || ""}
                                autoComplete="Date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6} style={{ marginTop: "15px" }}>
                            <TextField
                                fullWidth
                                id="capacity"
                                label="Capacity"
                                name="capacity"
                                value={data.capacity || ""}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} style={{ marginTop: "15px" }}>
                            <TextField
                                fullWidth
                                id="voltageRatio"
                                label="Voltage Ratio"
                                name="voltageRatio"
                                autoComplete="off"
                                value={data.voltageratio || ""}
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
                                id="quantity"
                                label="Quantity"
                                name="quantity"
                                value={data.quantity || ""}
                                autoComplete="off"
                                sx={{ marginBottom: "15px" }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>

                    <br />

                    <Grid item xs={9} sm={3} style={{ marginLeft: -100, marginTop: 20 }}>
                        <Button variant="contained" sx={{ background: "#007bff" }} onClick={handlePrint}>
                            Print
                        </Button>
                    </Grid>
                    <Grid item xs={9} sm={3} style={{ marginTop: -35, marginLeft: 200 }}>
                        <Link to="/proformaInvoice" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="error">
                                Cancel
                            </Button>
                        </Link>
                    </Grid>
                    <br />
                </Box>
            </Paper>

        </>
    )
}

export default Printprofoma