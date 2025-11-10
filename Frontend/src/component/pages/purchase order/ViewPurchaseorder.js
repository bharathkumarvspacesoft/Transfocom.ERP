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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { APP_BASE_PATH } from "Host/endpoint";
import ListIcon from '@mui/icons-material/List';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import NumbersIcon from '@mui/icons-material/Numbers';
import DescriptionIcon from '@mui/icons-material/Description';
import ReorderIcon from '@mui/icons-material/Reorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LoadingSpinner from "component/commen/LoadingSpinner";
const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: 'bold',
      fontSize: "1em",
    },
  },
});

export default function ViewPurchaseorder() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const convertDateFormat = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const [poref, setPoref] = useState("");
  // const fetchData = async () => {
  //   setIsLoading(true)
  //   try {
  //       const response = await fetch(`${APP_BASE_PATH}/viewpurchase/${id}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const jsonData = await response.json();
  //       // console.log("jsonData:", jsonData); // Log the jsonData to the console
  // console.log("jsonData[0].date",jsonData[0].date)
  //       if (jsonData && jsonData.length > 0) {
  //         setSupplier(jsonData[0].custname || "");
  //         setPoref(jsonData[0].poref || "");

  //         // Assuming the date field is in the format "MM/DD/YYYY"
  //         const formattedDate = convertDateFormat(jsonData[0].date);
  //         // console.log("Formatted date:", formattedDate);
  //         setDate(jsonData[0].date || "");
  //       }

  //       setData(jsonData);

  //     } catch (error) {
  //       console.error("Error fetching data:", error);

  //     }finally{
  //       setIsLoading(false)
  //     }
  //   };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/viewpurchase/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
      console.log("Raw Data:", jsonData);

      if (jsonData && jsonData.length > 0) {
        setSupplier(jsonData[0].custname || "");
        setPoref(jsonData[0].poref || "");

        const formattedDate = convertDateFormat(jsonData[0].date);
        setDate(formattedDate || "");
      }

      // ✅ Group by itemid and sum qty
      const grouped = Object.values(
        jsonData.reduce((acc, item) => {
          const key = item.itemid;

          if (!acc[key]) {
            // initialize this item
            acc[key] = { ...item };
          } else {
            // sum qty if same itemid appears again
            acc[key].qty = Number(acc[key].qty) + Number(item.qty);
          }
          return acc;
        }, {})
      );

      console.log("Grouped Data:", grouped);
      setData(grouped);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);

  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.floor(page * rowsPerPage / newRowsPerPage); // Calculate the new page number
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); // Update the current page to the new page number
  };
  const getSerialNumber = (index) => {
    return index + 1 + page * rowsPerPage;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Calculate the total quantity
      const totalQuantity = data.reduce((total, row) => total + row.qty, 0);
      const totalAmount = data.reduce(
        (total, row) => total + (Number(row.qty) * Number(row.rates || 0)),
        0
      );


      printWindow.document.write(`
        <html>
          <head>
            <title>Purchase Order</title>
            <style>
              /* Add any custom styles for printing here */
              /* For example, you can hide the search bar and other elements not needed in the print */
              .search-bar-container, .MuiTablePagination-root {
                display: none;
              }
              /* Add table border styles */
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              h3 {
                text-align: center;
              }
              p.center-align {
                text-align: center;
              }
              thead th[colspan="7"] {
                text-align: center;
              }
            </style>
          </head>
          <body>
            <h3>STATIC ELECTRICALS PUNE</h3>
            <p class="center-align" >S.No.229/2/2,Behind Wipro Phase-1,Hinjewadi,Pune 411057 <br>
              Phone-020-22933059,8007771691</p>
            <p>Supplier Name: ${supplier}</p>
            <p>PO.NO: ${poref}</p>
            <p>Date: ${date}</p>
            
            <table>
              <thead>
                <tr>
                  <th colspan="7" class="center-align">An ISO 9001:2015 Certified Company</th>
                </tr>
                <tr>
                  <th colspan="7" class="center-align">PURCHASE ORDER</th>
                </tr>
                <tr>
                  <th>To</th>
                  <th colspan="5"></th>
                  <th ></th>
                </tr>
                <tr>
                  <th>Sr No</th>  
                 
                  <th>Item Code</th>
                  <th>Description</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Rates</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${data
          .map((row, index) => `
                    <tr>
                      <td>${index + 1}</td>
                     
                      <td>${row.item_code}</td>
                      <td>${row.material_description}</td>
                      <td>${row.unit}</td>
                      <td>${row.qty}</td>
                      <td>${row.rates}</td>
                      <td>${(row.qty * row.rates)}</td>
                    </tr>
                  `)
          .join("")}
                <!-- Add total quantity row here -->
                <tr>
                  <th colspan="2"></th>
                  <th>Total Quantity:</th>
                  <th></th>
                  <th>${totalQuantity}</th> <!-- Display the total quantity -->
                  <th></th>
                   <th>${totalAmount}</th>
                </tr>
                <!-- Add terms & conditions row here -->
                <tr>
                  <td colspan="8">
                    Terms & Conditions:-<br>
                    1) GST :- As applicable<br>
                    2) Packing :- Included<br>
                    3) Transport :- Done by us<br>
                    4) Delivery Schedule :- Immediate<br>
                    5) Payment Term's :- 1 month PDC<br>
                    6) Other Instruction :- Test Certificate should accompany the material
                  </td>
                </tr>
                <tr>
                <td colspan="2">
                Range-Thergaon,</br>
                Division-Pune-IV.</br>
                COMMISSIONERATE-PUNE.</br>
                Terrif Heading No.85041090</br>
                GST No-27ABEFS1957R1ZD
                
                </td>
                <td colspan="6"style="margin-Left:"20";>
                For Static Electricals Pune<br><br><br><br><br><br>

                Authorised Signatory
                </td>
              </tr>
              
              </tbody>
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
              <h4 style={{ fontFamily: " 'Roboto', sans-serif" }}>View PO</h4>
            </div>

            <Link to="/purchaseOrder" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{
                backgroundColor: "#00d284", marginRight: "12px", "&:hover": {
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
            padding: '14px' // Added margin here
          }}>
            <div className={classes.root}>
              <br />
              <div style={{ height: 400, width: "100%" }}>

                <br />

                <>
                  <TextField
                    className="Search"
                    placeholder="Supplier Name"
                    variant="outlined"
                    size="small"
                    color="warning"

                    sx={{
                      marginLeft: "1rem",
                      marginTop: "5px",
                      marginBottom: "4px",
                      width: 356,
                    }}
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                  <TextField
                    className="Search"
                    placeholder="poref"
                    size="small"
                    variant="outlined"
                    color="warning"
                    sx={{
                      marginLeft: "1rem",
                      marginTop: "5px",
                      marginBottom: "4px",
                      width: 356,
                    }}
                    value={poref}
                    onChange={(e) => setPoref(e.target.value)}
                  />
                  <TextField
                    className="Search"
                    size="small"
                    variant="outlined"
                    color="warning"
                    sx={{
                      marginLeft: "1rem",
                      marginTop: "5px",
                      marginBottom: "4px",
                      width: 356,
                    }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <TableContainer>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell className="MuiTableCell-head" align="center"><NumbersIcon style={{ fontSize: "16px", marginRight: '2px' }} />Sr No</TableCell>
                          <TableCell className="MuiTableCell-head" align="center"><DynamicFormIcon style={{ fontSize: "16px", marginRight: '2px' }} />Database Item Id</TableCell>

                          <TableCell className="MuiTableCell-head" align="center"><DynamicFormIcon style={{ fontSize: "16px", marginRight: '2px' }} />Item Code</TableCell>
                          <TableCell className="MuiTableCell-head" align="center"><DescriptionIcon style={{ fontSize: "16px", marginRight: '2px' }} />Description</TableCell>
                          <TableCell className="MuiTableCell-head" align="center"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                          <TableCell className="MuiTableCell-head" align="center"><ReorderIcon style={{ fontSize: "16px" }} />Quantity</TableCell>
                          <TableCell className="MuiTableCell-head" align="center"><AttachMoneyIcon style={{ fontSize: "16px" }} />Rates</TableCell>
                          <TableCell className="MuiTableCell-head" align="center"><AttachMoneyIcon style={{ fontSize: "16px" }} />Total</TableCell>


                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data
                          .filter((row) =>
                            row.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.itemid?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.material_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (row.bomid?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase()) || (row.qty?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <TableRow className="tabelrow" key={row.poMasterId}>
                              <TableCell align="center">{getSerialNumber(index)}</TableCell>
                              <TableCell align="center">{row.itemid}</TableCell>
                              <TableCell align="center">{row.item_code}</TableCell>
                              <TableCell align="center">{row.material_description}</TableCell>
                              <TableCell align="center">{row.unit}</TableCell>
                              <TableCell align="center">{row.qty}</TableCell>
                              <TableCell align="center">{row.rates}</TableCell>
                              <TableCell align="center">{row.rates * row.qty}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>

                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>

                <Button variant="contained" sx={{
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
