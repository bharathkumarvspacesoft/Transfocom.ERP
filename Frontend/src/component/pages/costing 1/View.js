import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";
import { it } from "date-fns/locale";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight: "bold"
    },
  },
});

export default function View() {
  const classes = useStyles();
  const [data, setData] = useState({ costing_date: "" });
  // Set an initial value
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${APP_BASE_PATH}/view/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();
        console.log("Fetched data:", jsonData);
        const processedData = jsonData
          .filter((item) => {
            // Check if all relevant fields are not null
            return (
              item.mid !== null &&
              item.item_code !== null &&
              item.material_description !== null &&
              item.corresponding_unit !== null &&
              item.quantity !== null &&
              item.rate !== null &&
              item.amount !== null
            );
          })
          .map((item, index) => ({
            srNo: index + 1,
            mid: item.mid,
            item_code: item.item_code,
            material_description: item.material_description,
            corresponding_unit: item.corresponding_unit,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          }));


        setFilteredData(processedData);
        setData(jsonData);

      } catch (error) {
        console.error("Error fetching data:", error);

      } finally {
        setIsLoading(false)
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []);

  // Add console.log statements here
  // Log the entire data object
  console.log("filteredData", filteredData); // Log the costing_date property

  // Now, access data.costing_date here or in other functions triggered after the state update
  // This may still be undefined here


  // Log data.costing_date here, within the same scope where it was updated



  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Then set formattedDate as the value

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.floor(page * rowsPerPage / newRowsPerPage); // Calculate the new page number
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); // Update the current page to the new page number
  };
  const getSerialNumber = (index) => {
    return index + 1 + page * rowsPerPage;
  };
  let totalAmount = 0;

  if (Array.isArray(data)) {
    for (const item of data) {
      const amount = parseFloat(item.amount) || 0;
      totalAmount += amount;
    }
  } else {
    // Handle the case where data is not an array
    console.error('data is not an array');
  }

  // Convert capacity to a float, default to 0 if it's not a valid number
  const labourcharges = parseFloat(data[0]?.labourcharges) || 0; // Convert voltageRatio to a float, default to 0 if it's not a valid number
  const miscexpense = parseFloat(data[0]?.miscexpense) || 0;
  const accessories = parseFloat(data[0]?.accessories) || 0; // Convert oltcText to a float, default to 0 if it's not a valid number

  const total = totalAmount + labourcharges + miscexpense + accessories;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Calculate the total quantity
      const totalQuantity = data.reduce((total, row) => total + row.qty, 0);

      printWindow.document.write(`
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
         <title >&nbsp;</title>
        <style type="text/css">
            * {
                margin: 0;
                padding: 0;
                text-indent: 0;
            }

            p {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 11pt;
                margin: 0pt;
            }

            .s1 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
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
                font-size: 8pt;
            }

            .s3 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 8pt;
            }

            table, tbody {
                vertical-align: top;
                overflow: visible;
            }
        </style>
    </head>
    <body>
    <p style="padding-top: 3pt; padding-bottom: 1pt; padding-left: 60pt; text-indent: 0pt; text-align: left;">
    <u>Costing Name:-&nbsp;${data[0]?.costingname}</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date. <u>${data[0]?.costing_date}</u>
  </p>
    <p style="padding-top: 3pt; padding-bottom: 1pt; padding-left: 60pt; text-indent: 0pt; text-align: left;">
    <u>Type of Tapping Switch:-&nbsp;${data[0]?.Tapping}</u>
  </p>
  
  
        <p style="padding-left: 90pt;text-indent: 0pt;line-height: 1pt;text-align: left;"/>
        <p style="text-indent: 0pt;text-align: left;">
            <br/>
        </p>
        <table style="border-collapse:collapse;margin-left:5.5pt" cellspacing="0">
            <tr style="height:14pt">
                <td style="width:44pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s1" style="padding-top: 2pt;padding-left: 7pt;padding-right: 7pt;text-indent: 0pt;line-height: 10pt;text-align: center;">Sr No</p>
                </td>
                 <td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s1" style="padding-top: 2pt;padding-left: 6pt;padding-right: 6pt;text-indent: 0pt;line-height: 10pt;text-align: center;">DATABSE ITEM ID</p>
                </td>
                <td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s1" style="padding-top: 2pt;padding-left: 6pt;padding-right: 6pt;text-indent: 0pt;line-height: 10pt;text-align: center;">ITEM Code</p>
                </td>
                <td style="width:139pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s1" style="padding-top: 2pt;padding-left: 28pt;text-indent: 0pt;line-height: 10pt;text-align: left;">ITEM Description</p>
                </td>
                <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s1" style="padding-top: 2pt;padding-left: 17pt;padding-right: 17pt;text-indent: 0pt;line-height: 10pt;text-align: center;">Unit</p>
                </td>
                <td style="width:56pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">Qty</p>
                </td>
                <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">Rate</p>
                </td>
                <td style="width:83pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
                    <p class="s1" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">Amount</p>
                </td>
            </tr>
          
           ${filteredData.map((item, index) => (`
           <tr key=${index} style="height: 12pt">
             <td style="width: 44pt; border-style: solid; border-width: 1pt">
               <p class="s2" style="padding-top: 2pt; text-indent: 0pt; line-height: 8pt; text-align: center;">${item.srNo}</p>
             </td>
               <td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
      <p class="s2" style="padding-top: 2pt;padding-left: 6pt;padding-right: 6pt;text-indent: 0pt;line-height: 8pt;text-align: center;">${item?.mid}</p>
    </td>
    <td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
      <p class="s2" style="padding-top: 2pt;padding-left: 6pt;padding-right: 6pt;text-indent: 0pt;line-height: 8pt;text-align: center;">${item?.item_code}</p>
    </td>
    <td style="width:139pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
      <p class="s2" style="padding-top: 2pt;padding-left: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;">${item?.material_description}</p>
    </td>
    <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
      <p class="s2" style="padding-top: 2pt;text-indent: 0pt;line-height: 8pt;text-align: center;">${item?.corresponding_unit}</p>
    </td>
    <td style="width:56pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
      <p class="s2" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">${item?.quantity}</p>
    </td>
    <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
      <p class="s2" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">${item?.rate}</p>
    </td>
    <td style="width:83pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
      <p class="s2" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">${item?.amount}</p>
    </td>
  </tr>
`))}

            <tr style="height:12pt">
                <td style="width:44pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:139pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-top: 2pt;padding-left: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;">Accessories</p>
                </td>
                <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                                <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:56pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:83pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">${data[0]?.accessories}</p>
                </td>
            </tr>
            <tr style="height:12pt">
                <td style="width:44pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:139pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-top: 2pt;padding-left: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;">Labour charges</p>
                </td>
                    <td style="width:139pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-top: 2pt;padding-left: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;"></p>
                </td>
                <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:56pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:83pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">${data[0]?.labourcharges}</p>
                </td>
            </tr>
            <tr style="height:12pt">
                <td style="width:44pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:139pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-top: 2pt;padding-left: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;">Misc Expense &amp;Overheads</p>
                </td>
                <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:56pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                  <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:83pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">${data[0]?.miscexpense}</p>
                </td>
            </tr>
            <tr style="height:12pt">
                <td style="width:44pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:139pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s2" style="padding-top: 2pt;padding-left: 1pt;text-indent: 0pt;line-height: 8pt;text-align: left;">Sub Total</p>
                </td>
                <td style="width:55pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:56pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
                <td style="width:83pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p class="s3" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;line-height: 8pt;text-align: right;">${total}</p>
                </td>
                   <td style="width:50pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
                    <p style="text-indent: 0pt;text-align: left;">
                        <br/>
                    </p>
                </td>
            </tr>
        </table>
      
    </body>
</html>
      `);

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
          <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
            <div className="page_header">
              <h4 style={{ fontFamily: " 'Roboto', sans-serif" }}>View Costing1</h4>
            </div>
            <Link to="/costing1" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{
                backgroundColor: "#00d284", marginRight: '15px', "&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },
              }} >
                Back
              </Button>
            </Link>
          </div>
          <Paper elevation={6} style={{
            height: rowsPerPage === 5 ? 510 : 870,
            position: "relative",
            bottom: 49,
            overflow: "auto",
            margin: "1rem",
            marginTop: '60px',
            padding: '14px'
          }}>

            <div className={classes.root}>
              <br />
              <div style={{ height: 400, width: "100%", }}>

                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <TextField
                    className="Search"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* Adornment content */}
                        </InputAdornment>
                      ),
                    }}
                    label='Costing Name'
                    variant="outlined"
                    size="small"
                    sx={{
                      marginBottom: '4px',
                      width: 440,
                    }}
                    value={data[0].costingname}
                  />
                  <div style={{ marginLeft: '10px' }}></div>
                  <TextField
                    className="Search"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* Adornment content */}
                        </InputAdornment>
                      ),
                    }}
                    label='Type of Tapping Switch'
                    variant="outlined"
                    size="small"
                    sx={{
                      marginBottom: '4px',
                      width: 600,
                    }}
                    value={data[0].Tapping}
                  />
                  <div style={{ marginLeft: '10px' }}></div>
                  <TextField
                    className="Search"
                    label="Date"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* Adornment content */}
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    size="small"
                    sx={{
                      marginBottom: '4px',
                      width: 240,
                      marginRight: '10px',  // Adjust the margin as needed
                    }}
                    value={data[0]?.costing_date}
                  />
                </div>





                <br />
                {isLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <p>Loading...</p>
                  </div>
                ) : (

                  <>

                    <TableContainer>
                      <Table className="tabel">
                        <TableHead className="tableHeader">
                          <TableRow>
                            <TableCell className="MuiTableCell-head" align="center">Sr No</TableCell>
                            <TableCell className="MuiTableCell-head" align="center">Databse Item Id</TableCell>
                            <TableCell className="MuiTableCell-head" align="center">Item Code</TableCell>
                            <TableCell className="MuiTableCell-head" align="center">Description</TableCell>
                            <TableCell className="MuiTableCell-head" align="center">Unit</TableCell>
                            <TableCell className="MuiTableCell-head" align="center">Quantity</TableCell>
                            <TableCell className="MuiTableCell-head" align="center">Rate</TableCell>
                            <TableCell className="MuiTableCell-head" align="center">Amount</TableCell>

                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData
                            .filter((row) =>
                              (row.item_code?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
                              (row.material_description?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
                              (row.unit?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
                              (row.corresponding_unit?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
                            )
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                              <TableRow className="tabelrow" key={row.indent_id}>
                                <TableCell align="center">{row.srNo}</TableCell>
                                <TableCell align="center">{row.mid}</TableCell>
                                <TableCell align="center">{row.item_code}</TableCell>
                                <TableCell align="center">{row.material_description}</TableCell>
                                <TableCell align="center">{row.corresponding_unit}</TableCell>
                                <TableCell align="center">{row.quantity}</TableCell>
                                <TableCell align="center">{row.rate}</TableCell>
                                <TableCell align="center">{row.amount}</TableCell>

                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div class="container">
                      <div class="row">
                        <div class="col-sm">
                          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">
                              Accessories
                            </InputLabel>
                            <Input
                              id="standard-adornment-amount"
                              startAdornment={
                                <InputAdornment position="start">  {data[0]?.accessories}</InputAdornment>
                              }
                            />
                          </FormControl>
                        </div>
                        <div class="col-sm">
                          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">
                              Labour Charges
                            </InputLabel>
                            <Input
                              id="standard-adornment-amount"
                              startAdornment={
                                <InputAdornment position="start">
                                  {data[0]?.labourcharges}
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </div>
                        <div class="col-sm">
                          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">
                              Misc Expence & Overheads
                            </InputLabel>
                            <Input
                              id="standard-adornment-amount"
                              startAdornment={
                                <InputAdornment position="start">
                                  {data[0]?.miscexpense}
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </div>
                        <div class="col-sm">
                          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-amount">
                              Subtotal
                            </InputLabel>
                            <Input
                              id="standard-adornment-amount"
                              startAdornment={
                                <InputAdornment position="start">
                                  {total}
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </div>
                      </div>
                    </div>

                    <TablePagination
                      rowsPerPageOptions={[5, 10]}
                      component="div"
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </>
                )}
                <Button variant="contained" sx={{
                  marginLeft: "5px",
                  padding: "5px",
                  background: "#00cff4",
                  "&:hover": {
                    background: "#00cff4", // Set the same color as the default background
                  },
                }} onClick={handlePrint}>
                  Print
                </Button>
              </div>
            </div>
          </Paper>
        </>
      )}
    </>
  );
}
