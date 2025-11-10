import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import "./purchase.css";
import { NavLink, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import TablePagination from "@mui/material/TablePagination";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import NumbersIcon from '@mui/icons-material/Numbers';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { formatDate } from "utils";
import Swal from "sweetalert2";
import { Link, useParams } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: 'bold',
      fontSize: "1em",
    },
  },
});

export default function PurchaseOrder() {
  const [value, setValue] = useState(dayjs());
  const [serialNumber, setSerialNumber] = useState(1);
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/AddPurchaseOrder");
  };
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getPorder`); // Replace with your API endpoint
      const jsonData = await response.json();
      setFilterdata(jsonData);
      console.log(jsonData);

      setRows(jsonData.slice().reverse()); // Reverse the data array before setting the rows
      setPage(0); // Set the page to the first page of the table (newest entries on top)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPoGrnMap();
  }, []);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value.toLowerCase();
    if (getSearch.length > 0) {
      const searchdata = rows.filter((item) =>
        (item.poref?.toLowerCase().includes(getSearch)) ||
        (item.suppname?.toLowerCase().includes(getSearch)) || (item.podate?.toLowerCase().includes(getSearch))
      );
      setRows(searchdata);
    } else {
      setRows(filterdata);
    }
    setQuery(getSearch);
  };


  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.floor(page * rowsPerPage / newRowsPerPage); // Calculate the new page number
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); // Update the current page to the new page number
  };

  const handleDelete = (id) => {
    fetch(`${APP_BASE_PATH}/deletePorder/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          title: "Item Deleted Successfully!!!!",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        fetchData();
      })
      .catch((error) => {
        Swal.fire({
          title: "Error !!!!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      });
  };
  const [data1, setData1] = useState([]);
  const [date1, setDate1] = useState("");
  const [supplier, setSupplier] = useState("");
  const { id } = useParams();
  const [poref, setPoref] = useState("");
  // const convertDateFormat = (dateString) => {
  //   const [month, day, year] = dateString.split("/");
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   const monthName = months[parseInt(month, 10) - 1];
  //   return `${day}-${monthName}-${year}`;
  // };

  const getSerialNumber1 = (index) => {
    return index + 1;
  };

  const calculateTotalQuantity = (jsonData) => {
    const totalQuantity = jsonData.reduce((acc, item) => acc + item.qty, 0);
    return totalQuantity;
  };
  const handlePrint = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${APP_BASE_PATH}/viewpurchase1/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const jsonData1 = await response.json();
      console.log("jsonData1:", jsonData1);

      if (jsonData1 && jsonData1.length > 0) {
        // Assuming the date field is in the format "MM/DD/YYYY"
        const formattedDate = formatDate(jsonData1[0].date);
        console.log("Formatted date:", formattedDate);


        const printWindow = window.open("", "_blank");
        if (printWindow) {
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
            <p class="center-align">S.No.229/2/2,Behind Wipro Phase-1,Hinjewadi,Pune 411057 <br>
              Phone-020-22933059,8007771691</p>
            <p>Supplier Name: ${jsonData1[0].custname}</p>
            <p>PO.NO: ${jsonData1[0].poref}</p>
            <p>Date: ${formattedDate}</p>

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
                  <th colspan="4"></th>
                  <th></th>
                </tr>
                <tr>
                  <th>Sr No</th>
                  <th>Item Code</th>
                  <th>Description</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Rates</th>
                </tr>
              </thead>
              <tbody>
                ${jsonData1
              .map(
                (row, index) => `
                    <tr>
                      <td>${getSerialNumber1(index)}</td>
                      <td>${row.item_code}</td>
                      <td>${row.material_description}</td>
                      <td>${row.unit}</td>
                      <td>${row.qty}</td>
                      <td>${row.rates}</td>
                    </tr>
                  `
              )
              .join("")}
                <!-- Add total quantity row here -->
                <tr>
                  <th colspan="2"></th>
                  <th>Total Quantity:</th>
                  <th></th>
                  <th>${calculateTotalQuantity(jsonData1)}</th>
                  <th></th>
                </tr>
                <!-- Add terms & conditions row here -->
                <tr>
                  <td colspan="7">
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
                Range-Thergaon,<br>
                Division-Pune-IV.<br>
                COMMISSIONERATE-PUNE.<br>
                Terrif Heading No.85041090<br>
                GST No-27ABEFS1957R1ZD
                </td>
                <td colspan="4" style="margin-Left: 20;">
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
      } else {
        console.error("No data or invalid data in the API response.");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const [poGrnMap, setPoGrnMap] = useState({});

  const fetchPoGrnMap = async () => {
    try {
      // Fetch all POs
      const response = await fetch(`${APP_BASE_PATH}/getPorder`);
      const poList = await response.json();
      const map = {};
      // For each PO, check if it exists in GRN
      await Promise.all(
        poList.map(async (po) => {
          const grnRes = await fetch(`${APP_BASE_PATH}/viewgrn/${po.id}`);
          const grnData = await grnRes.json();
          map[po.id] = Array.isArray(grnData) && grnData.length > 0;
        })
      );
      setPoGrnMap(map);
    } catch (error) {
      // fallback: don't disable any
      setPoGrnMap({});
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            class="d-flex justify-content-between"
            style={{ position: "relative", bottom: 13 }}
          >
            <div className="page_header">
              <h4>Purchase Order</h4>
            </div>
            <Button variant="contained" sx={{
              backgroundColor: "#00d284", marginRight: "12px", "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }} onClick={handleRoute}>
              New Purchase Order
            </Button>
          </div>

          {rows.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: 'red',
                fontSize: '1.4em',
                fontFamily: 'roboto'
              }}
            >
              <p>No records found.</p>
            </div>
          ) : (
            <div className={classes.root}>

              <br />
              <div style={{ height: 400, width: "100%", }}>
                <TextField
                  className="Search"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => handlesearch(e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                  sx={{
                    marginRight: "65rem",
                    width: 220,
                    marginBottom: "8px",
                  }}
                />
                <br />
                <TableContainer>

                  <div className={classes.root}>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell className="MuiTableHead-root" align="center"><NumbersIcon style={{ fontSize: "16px", marginRight: '2px' }} />Sr No</TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />Costing ID
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />Costing Name
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />PO Ref
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <CalendarMonthIcon style={{ fontSize: "16px", marginRight: '2px' }} />  PO Date
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <ContactMailIcon style={{ fontSize: "16px", marginRight: '2px' }} /> Supplier
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <AutoAwesomeIcon style={{ fontSize: "16px", marginRight: '2px' }} />Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((item, index) => {
                            return (
                              <TableRow
                                className="tabelrow"
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={item.code}
                              >
                                <TableCell style={{ textAlign: 'center' }}>{serialNumber + index}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.y}>{item.cid}</TableCell>
                                <TableCell style={{ textAlign: 'left' }} key={item.c}>
                                  {item.selectedcosting?.split(',').map((part, index) => (
                                    <>
                                      {part}
                                      {index < item.selectedcosting.split(',').length - 1 && ','}
                                      {index === 2 && <br />}
                                    </>
                                  ))}
                                </TableCell>                                <TableCell style={{ textAlign: 'center' }} key={item.y}>{item.poref}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.i}>{item.podate}</TableCell>
                                <TableCell style={{ textAlign: 'left' }} key={item.d}>{item.suppname}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <NavLink to={`/editpurchaseorder/${item.id}`}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        marginLeft: "5px", padding: "8px",
                                        background: "#00d284",
                                        "&:hover": {
                                          background: "#00d284", // Set the same color as the default background
                                        },
                                      }}
                                    >
                                      Edit
                                    </Button></NavLink>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleDelete(item.id)}
                                    sx={{
                                      marginLeft: "5px",
                                      padding: "8px",
                                      background: "#ff0854",
                                      "&:hover": {
                                        background: "#ff0854", // Set the same color as the default background
                                      },
                                    }}
                                    disabled={poGrnMap[item.id]}
                                  >
                                    Delete
                                  </Button>

                                  <NavLink to={`/viewpurchase/${item.id}`}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        marginLeft: "5px", padding: "8px",
                                        background: "#00cff4",
                                        "&:hover": {
                                          background: "#00cff4", // Set the same color as the default background
                                        },
                                      }}
                                    >
                                      View and print
                                    </Button></NavLink>



                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[20, 50, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </div>
          )}

        </>
      )}
    </>
  );
}
