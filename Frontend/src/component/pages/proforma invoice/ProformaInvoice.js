import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import "./proforma.css";
import TablePagination from "@mui/material/TablePagination";
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import NumbersIcon from '@mui/icons-material/Numbers';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';


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
import { Link, NavLink } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& 	.MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight: "bold",
      align: "center",
    },
  },
});

export default function ProformaInvoice() {
  const classes = useStyles();

  // get method//

  const [isLoading, setIsLoading] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getPro`);
      const jsonData = await response.json();
      console.log('jsonData', jsonData);
      setFilterdata(jsonData); // for search data
      setOriginalData(jsonData); // store the original data

      setRows(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [serialNumber, setSerialNumber] = useState(1);

  const handlesearch = (event) => {
    const getSearch = event.target.value.toLowerCase().trim();
    if (getSearch.length > 0) {
      const searchdata = originalData.filter(
        (item) =>
          item.custname.toLowerCase().includes(getSearch) ||
          item.ref_no.toLowerCase().includes(getSearch) ||
          item.capacity.toLowerCase().includes(getSearch)
      );
      setRows(searchdata);
    } else {
      setRows(originalData); // Reset to the original data
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
    fetch(`${APP_BASE_PATH}/deleteprofoma/${id}`, {
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
              <h4>Proforma Invoice</h4>
            </div>
            <NavLink to="/crearteprofoma"><Button variant="contained" sx={{
              background: "#00d284", "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }} >
              Create Profoma Invoice
            </Button></NavLink>
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

            <div >
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
                  marginRight: "90%", // Adjust the margin-right value
                  marginBottom: "8px",
                  flexGrow: 1,
                  width: 230,// Allow the TextField to grow and fill available space

                }}
              />

              <br />
              <TableContainer>

                <div className={classes.root}>
                  <Table className="tabel" >
                    <TableHead className="tableHeader" >
                      <TableRow>
                        <TableCell className="MuiTableHead-root" align="center">  <NumbersIcon style={{ fontSize: "16px" }} />Sr  No</TableCell>
                        <TableCell className="MuiTableHead-root" align="center">
                          <ContactMailIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                          Customer <br />  Name
                        </TableCell>
                        <TableCell className="MuiTableHead-root" align="center">
                          <TextSnippetIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                          Ref<br /> Number
                        </TableCell>

                        <TableCell className="MuiTableHead-root" align="center">
                          <BatteryCharging20Icon style={{ fontSize: "14px", marginRight: '2px' }} />
                          Capacity
                        </TableCell>
                        {/* <TableCell className="MuiTableHead-root">
                        <ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Voltage Ratio
                        </TableCell>

                        <TableCell className="MuiTableHead-root">
                        <ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Testing  Div
                        </TableCell> */}
                        {/* <TableCell className="MuiTableHead-root">
                        <ContactPageIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Consumer
                        </TableCell> */}
                        <TableCell
                          className="MuiTableHead-root" align="center"

                        >
                          <CalendarMonthIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                          Date
                        </TableCell>
                        {/* <TableCell className="MuiTableHead-root">
                        Status
                        </TableCell> */}
                        <TableCell className="MuiTableHead-root " align="center">

                          <ProductionQuantityLimitsIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                          Order <br /> Acceptance Qty
                        </TableCell>
                        <TableCell className="MuiTableHead-root" align="center">

                          <ProductionQuantityLimitsIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                          Proforma<br />&nbsp;&nbsp; Invoice Qty
                        </TableCell>
                        <TableCell
                          className="MuiTableHead-root" align="center"
                        >
                          <AutoAwesomeIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item, index) => {
                          return (
                            <TableRow
                              className="tabelrow"
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={item.code}
                            >
                              <TableCell style={{ width: "1%", textAlign: "center", padding: '26px' }}>{serialNumber + index}</TableCell>

                              <TableCell align="center" key={item.a} style={{ width: "1%", textAlign: "left", padding: '26px' }}>{item.custname}</TableCell>
                              <TableCell align="center" key={item.b} style={{ width: "1%", textAlign: "center", padding: '26px' }}>{item.ref_no}</TableCell>
                              <TableCell align="center" key={item.c} style={{ width: "1%", textAlign: "center", padding: '26px' }}>{item.capacity}</TableCell>
                              {/* <TableCell key={item.d} style={{width:"1%",textAlign:"center"}}>
                                {item.priratio}/{item.secratio}V{" "}
                              </TableCell>
                              <TableCell key={item.p} style={{width:"1%",textAlign:"center"}}>
                                {item.testing_div}
                              </TableCell> */}
                              {/* <TableCell key={item.f} style={{width:"1%",textAlign:"center"}}>{item.consumer}</TableCell>
                              */}
                              <TableCell align="center" key={item.o} style={{ width: "1%", textAlign: "center", padding: '26px' }}>
                                {formatDate(item.orderacc_date)}
                              </TableCell>
                              {/* <TableCell key={item.t}style={{width:"1%",textAlign:"center"}}>{item.enquiry_status}</TableCell> */}
                              <TableCell align="center" key={item.z} style={{ width: "1%", padding: '26px' }}>{item.quantity}</TableCell>
                              <TableCell align="center" key={item.z} style={{ width: "1%", padding: '26px' }}>{item.proformaqty}</TableCell>
                              <TableCell align="center" className="wh-spc" style={{ textAlign: 'center', padding: '26px' }} >
                                <Link to={`/printprofoma/${item.id}`}> <Button
                                  size="small"
                                  variant="contained"


                                  sx={{
                                    marginLeft: "3px", padding: "8px", background: "#00cff4",
                                    color: "#fff", // Set the default text color
                                    '&:hover': {
                                      background: "#00cff4", // Change this to your desired hover background color
                                      color: "#fff", // Set the text color on hover to the same as the default text color
                                    },
                                  }}
                                >
                                  view and Print
                                </Button>
                                </Link>


                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    marginLeft: "5px", padding: "8px", background: "#ff0854",
                                    "&:hover": {
                                      background: "#ff0854", // Set the same color as the default background
                                    },
                                  }}
                                  onClick={() => handleDelete(item.pid)}

                                >
                                  Delete
                                </Button>

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

          )}

        </>
      )}
    </>
  );
}
