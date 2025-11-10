import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./payment.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import TablePagination from "@mui/material/TablePagination";
import PaidIcon from "@mui/icons-material/Paid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import PaymentsIcon from "@mui/icons-material/Payments";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PendingIcon from "@mui/icons-material/Pending";
import NumbersIcon from "@mui/icons-material/Numbers";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { formatDate } from "utils";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight: "bold",
    },
  },
});

export default function Payments() {
  const [value, setValue] = useState(dayjs());
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/newPayments");
  };
  const classes = useStyles();

  // get method//

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      let url = `${APP_BASE_PATH}/getPayments`;

      if (fromDate && toDate) {
        url += `?fromDate=${fromDate.format(
          "YYYY-MM-DD"
        )}&toDate=${toDate.format("YYYY-MM-DD")}`;
      }

      const response = await fetch(url);
      const jsonData = await response.json();

      // Filter the data based on the selected date range
      const filteredData = jsonData.filter((item) => {
        const itemDate = new Date(item.date); // Assuming item.plan_date is a string in "YYYY-MM-DD" format
        return itemDate >= fromDate && itemDate <= toDate;
      });

      setIsLoading(false);
      setFilterdata(filteredData);
      setRows(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataWithoutDate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getPayments`);
      const jsonData = await response.json();
      setIsLoading(false);
      setFilterdata(jsonData);
      setRows(jsonData);

      // setRows(jsonData.slice().reverse());
      setPage(0); // Add new data to the beginning
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchData();
    } else {
      fetchDataWithoutDate();
    }
  }, [fromDate, toDate]);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value.toLowerCase();
    let filteredData = filterdata;

    if (fromDate && toDate) {
      filteredData = filteredData.filter((item) => {
        const planDate = dayjs(item.date);
        return (
          planDate.isSameOrAfter(fromDate) && planDate.isSameOrBefore(toDate)
        );
      });
    }

    // Filter the data based on the search query
    if (getSearch) {
      filteredData = filteredData.filter((item) => {
        const lowercaseSearch = getSearch.toLowerCase();
        return (
          item.wo_no?.toLowerCase().includes(lowercaseSearch) || // Use optional chaining
          item.custname?.toLowerCase().includes(lowercaseSearch) ||
          item.ref_no?.toLowerCase().includes(lowercaseSearch) ||
          item.orderacc_date?.toLowerCase().includes(lowercaseSearch) ||
          item.capacity?.toLowerCase().includes(lowercaseSearch) ||
          item.priratio?.toLowerCase().includes(lowercaseSearch) ||
          item.secratio?.toLowerCase().includes(lowercaseSearch)
        );
      });
    }

    setRows(filteredData);

    if (filteredData.length === 0) {
      Swal.fire({
        title: "No Data Found",
        timer: 1000,
      });
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
    const newPage = Math.min(page, Math.floor(rows.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };

  const handleFromDateChange = (newValue) => {
    setFromDate(newValue);
  };

  const handleToDateChange = (newValue) => {
    setToDate(newValue);
  };
  const [serialNumber, setSerialNumber] = useState(1);
  //   return (
  //     <>
  //       <div
  //         class="d-flex justify-content-between"
  //         style={{ position: "relative", bottom: 13 }}
  //       >
  //         <div className="page_header">
  //           <h4>Payment</h4>
  //         </div>
  //         <Button variant="contained" sx={{ background: "#00d284",
  //           "&:hover": {
  //             background: "#00d284", // Set the same color as the default background
  //           },  }}onClick={handleRoute}>
  //           New Payment
  //         </Button>
  //       </div>

  //       <Paper elevation={6}
  //         style={{
  //           height: rowsPerPage === 5 ? 580 : 980,
  //           position: "relative",
  //           bottom: 30,
  //           overflow: "hidden",
  //           margin: "1rem",
  //           padding:"14px",
  //           marginTop: '70px',

  //           width: '100%',
  //           overflowX: 'hidden',
  //         }}>
  //           {rows.length === 0 ? (
  //           <div
  //             style={{
  //               display: "flex",
  //               justifyContent: "center",
  //               alignItems: "center",
  //               height: "100%",
  //               color:'red',
  //               fontSize:'1.4em',
  //               fontFamily:'roboto'
  //             }}
  //           >
  //             <p>No records found.</p>
  //           </div>
  //         ) : (
  //         <div >
  //           <div class="container" >
  //           <div class="row">
  //                 <div class="col" id="date">
  //                   <LocalizationProvider dateAdapter={AdapterDayjs}>
  //                     <DesktopDatePicker
  //  label="From Date"
  //  inputFormat="DD/MM/YYYY"
  //  value={fromDate}
  //  sx={{background:'#e4e9f0' }}
  //  onChange={handleFromDateChange}
  //  renderInput={(params) => <TextField {...params} />}
  // />
  //                  </LocalizationProvider>
  //                </div>
  //                <div class="col" id="date">
  //                   <LocalizationProvider dateAdapter={AdapterDayjs}>
  //                     <DesktopDatePicker
  //  label="To Date"
  //  inputFormat="DD/MM/YYYY"
  //  value={toDate}
  //  onChange={handleToDateChange}
  //  sx={{ marginRight: "300px",background:'#e4e9f0' }}
  //  renderInput={(params) => <TextField {...params} />}
  // />
  //                  </LocalizationProvider>
  //                </div>
  //              </div>
  //           </div>

  //           <div style={{ width: "100%", marginTop: "-22px" }}>
  //             <TextField
  //              className="Search"
  //               placeholder="Search..."
  //               value={query}
  //               onChange={(e) => handlesearch(e)}
  //               InputProps={{
  //                 startAdornment: (
  //                   <InputAdornment position="start">
  //                     <SearchIcon />
  //                   </InputAdornment>
  //                 ),
  //               }}
  //               variant="outlined"

  //                 size="small"

  //                 sx={{
  //                   marginLeft: "42rem",
  //                   position: "relative",
  //                   bottom: "19px",
  //                   width: 280,

  //                 }}
  //             />
  //             <br />
  //             <TableContainer>
  //               {isLoading && (
  //                 <div id="spinner">
  //                   {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
  //                   <CircularProgress color="warning" loading={isLoading} />
  //                 </div>
  //               )}
  //               <div className={classes.root}>
  //               <Table className="tabel">
  //                     <TableHead className="tableHeader">
  //                     <TableRow>
  //                     <TableCell className="MuiTableHead-root">
  //                     <NumbersIcon style={{ fontSize: "16px" }} />
  //   Sr No
  // </TableCell>
  // <TableCell className="MuiTableHead-root" >
  // <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Customer
  // </TableCell>
  // <TableCell className="MuiTableHead-root" >
  // <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   OA<br />Referance
  // </TableCell>
  // <TableCell className="MuiTableHead-root" >
  // <CalendarMonthIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   OA<br />Date
  // </TableCell>
  // <TableCell className="MuiTableHead-root">
  // <BatteryCharging20Icon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Capacity
  // </TableCell>
  // <TableCell className="MuiTableHead-root">
  // <ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Voltage<br />Ratio
  // </TableCell>
  // <TableCell className="MuiTableHead-root">
  // <PaymentsIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Total
  // </TableCell>
  // <TableCell className="MuiTableHead-root">
  // <PaidIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Paid
  // </TableCell>
  // <TableCell className="MuiTableHead-root" >
  // <CalendarMonthIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Date
  // </TableCell>
  // <TableCell className="MuiTableHead-root">
  // <PendingIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Pending
  // </TableCell>
  // <TableCell className="MuiTableHead-root">

  // <LocalShippingIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Dispatch<br />Date
  // </TableCell>
  // <TableCell className="MuiTableHead-root">
  // <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  //   Action
  // </TableCell>

  //                     </TableRow>
  //                   </TableHead>
  //                   <TableBody>
  //                     {rows
  //                       .slice(
  //                         page * rowsPerPage,
  //                         page * rowsPerPage + rowsPerPage
  //                       )
  //                       .map((item,index) => {
  //                         return (
  //                           <TableRow
  //                           className="tabelrow"
  //                             hover
  //                             role="checkbox"
  //                             tabIndex={-1}
  //                             key={item.code}
  //                           >
  //                               <TableCell style={{width:"5%",textAlign:"center"}}>{serialNumber + index}</TableCell>

  //                             <TableCell key={item.a} style={{width:"5%",textAlign:"center"}}>{item.custname}</TableCell>
  //                             <TableCell key={item.b} style={{width:"5%",textAlign:"center"}}>{item.ref_no}</TableCell>
  //                             <TableCell key={item.c} style={{width:"5%",textAlign:"center"}}>
  //                               {formatDate(item.orderacc_date)}
  //                             </TableCell>
  //                             <TableCell key={item.d} style={{width:"5%",textAlign:"center"}}>{item.capacity}</TableCell>
  //                             <TableCell key={item.e} style={{width:"5%",textAlign:"center"}}>
  //                               {item.priratio}/{item.secratio}V
  //                             </TableCell>
  //                             <TableCell key={item.f} style={{width:"5%",textAlign:"center"}}>
  //                               {item.total?.toFixed(2)}
  //                             </TableCell>
  //                             <TableCell key={item.g} style={{width:"5%",textAlign:"center"}}>
  //                               {item.paid?.toFixed(2)}
  //                             </TableCell>
  //                             <TableCell key={item.h} style={{width:"5%",textAlign:"center"}}>
  //                               {formatDate(item.date)}
  //                             </TableCell>
  //                             <TableCell key={item.i} style={{width:"5%",textAlign:"center"}}>
  //                               {(item.total - item.paid)?.toFixed(2)}
  //                             </TableCell>
  //                             <TableCell key={item.j} style={{width:"5%",textAlign:"center"}}>
  //                               {item.dispatchdate}
  //                             </TableCell>
  //                             <TableCell>
  //                               <Link
  //                                 to={`/detailedPayments?id=${item.id}`}
  //                                 style={{ textDecoration: "none" }}
  //                               >
  //             <Button
  //   sx={{ background: "#00d284",
  //   "&:hover": {
  //     background: "#00d284", // Set the same color as the default background
  //   },  }}
  //   variant="contained"
  // >
  //   Detailed Payment
  // </Button>

  //                               </Link>
  //                             </TableCell>
  //                           </TableRow>
  //                         );
  //                       })}
  //                   </TableBody>
  //                 </Table>
  //               </div>
  //             </TableContainer>
  //             <TablePagination
  //                 rowsPerPageOptions={[5, 10]}
  //                 component="div"
  //                 count={rows.length}
  //                 rowsPerPage={rowsPerPage}
  //                 page={page}
  //                 onPageChange={handleChangePage}
  //                 onRowsPerPageChange={handleChangeRowsPerPage}
  //               />

  //           </div>
  //         </div>
  //          )}
  //       </Paper>
  //     </>
  //   );
  return (
    <>
      <div
        className="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Payment</h4>
        </div>
        <Button
          variant="contained"
          sx={{
            background: "#00d284",
            "&:hover": {
              background: "#00d284",
            },
          }}
          onClick={handleRoute}
        >
          New Payment
        </Button>
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "red",
            fontSize: "1.4em",
            fontFamily: "roboto",
          }}
        >
          <p>No records found.</p>
        </div>
      ) : (
        <div>
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="From Date"
                    inputFormat="DD/MM/YYYY"
                    value={fromDate}
                    sx={{ background: "#e4e9f0" }}
                    onChange={handleFromDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div
                className="col"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="To Date"
                    inputFormat="DD/MM/YYYY"
                    value={toDate}
                    sx={{ background: "#e4e9f0" }}
                    onChange={handleToDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div
                className="col"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
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
                  sx={{ width: 280 }}
                />
              </div>
            </div>
          </div>
          <br />
          <TableContainer>
            {isLoading && (
              <div id="spinner">
                {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                <CircularProgress color="warning" loading={isLoading} />
              </div>
            )}
            <div className={classes.root}>
              <Table className="tabel">
                <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <NumbersIcon style={{ fontSize: "14px" }} />
                      Sr No
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <ContactMailIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      Customer
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px  " }}
                    >
                      <TextSnippetIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      OA
                      <br />
                      Referance
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <CalendarMonthIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      OA
                      <br />
                      Date
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <BatteryCharging20Icon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      Capacity<br />kva
                    </TableCell>
                    {/* <TableCell className="MuiTableHead-root" align="center" style={{padding: '2px 5px 3px 2px '}}>
                      <ElectricMeterIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                      Voltage<br />Ratio
                    </TableCell> */}
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <PaymentsIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      Total
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <PaidIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      Paid
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <CalendarMonthIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      Date
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <PendingIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      Pending
                    </TableCell>
                    {/* <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <LocalShippingIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      Dispatch
                      <br />
                      Date
                    </TableCell> */}
                    <TableCell
                      className="MuiTableHead-root"
                      align="center"
                      style={{ padding: "2px 5px 3px 2px " }}
                    >
                      <AutoAwesomeIcon
                        style={{ fontSize: "14px", marginRight: "2px" }}
                      />
                      Action
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
                          style={{ padding: "4px 42px" }}
                        >
                          <TableCell
                            style={{ width: "3%", textAlign: "center" }}
                          >
                            {serialNumber + index}
                          </TableCell>

                          <TableCell
                            key={item.a}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                              textAlign: "left"
                            }}
                          >
                            {item.custname}
                          </TableCell>
                          <TableCell
                            key={item.b}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                            }}
                          >
                            {item.ref_no}
                          </TableCell>
                          <TableCell
                            key={item.c}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                            }}
                          >
                            {formatDate(item.orderacc_date)}
                          </TableCell>
                          <TableCell
                            key={item.d}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                            }}
                          >
                            {item.capacity}
                          </TableCell>
                          {/* <TableCell key={item.e} style={{ width: "3%", textAlign: "center",padding:'4px 42px'  }}>
                            {item.priratio}/{item.secratio}V
                          </TableCell> */}
                          <TableCell
                            key={item.f}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                            }}
                          >
                            {(parseFloat(item.total) || 0).toFixed(2)}
                          </TableCell>
                          <TableCell
                            key={item.g}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                            }}
                          >
                            ₹ {(parseFloat(item.paid) || 0).toFixed(2)}
                          </TableCell>
                          <TableCell
                            key={item.h}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                            }}
                          >
                            {formatDate(item.date)}
                          </TableCell>
                          <TableCell
                            key={item.i}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                            }}
                          >
                            {(item.total - item.paid)?.toFixed(2)}
                          </TableCell>
                          {/* <TableCell
                            key={item.j}
                            style={{
                              width: "3%",
                              textAlign: "center",
                              padding: "4px 42px",
                            }}
                          >
                            {item.dispatchdate}
                          </TableCell> */}
                          <TableCell align="center">
                            <Link
                              to={`/detailedPayments?id=${item.id}`}
                              style={{
                                textDecoration: "none",
                                textAlign: "center",
                                padding: "4px 42px",
                              }}
                            >
                              <Button
                                sx={{
                                  background: "#00d284",
                                  "&:hover": {
                                    background: "#00d284", // Set the same color as the default background
                                  },
                                }}
                                variant="contained"
                              >
                                Detailed Payment
                              </Button>
                            </Link>
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
  );
}
