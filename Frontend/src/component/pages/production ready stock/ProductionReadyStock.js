import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import NumbersIcon from '@mui/icons-material/Numbers';
import ListIcon from '@mui/icons-material/List';
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "../production plan/production.css";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReorderIcon from '@mui/icons-material/Reorder';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { formatDate } from "utils";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      width: 220,
      fontWeight: "bold",
    },
  },
});

const ProductionReadyStock = () => {
  const [value, setValue] = useState(dayjs());
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/addreadystock");
    // navigate("/addProductionquantity");
  };
  const classes = useStyles();

  // get method//
  const [isLoading, setIsLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState(1);
  const fetchData = async () => {
    setIsLoading(true);

    try {
      let url = `${APP_BASE_PATH}/getProductionPlan`;

      if (fromDate && toDate) {
        url += `?fromDate=${fromDate.format(
          "YYYY-MM-DD"
        )}&toDate=${toDate.format("YYYY-MM-DD")}`;
      }

      const response = await fetch(url);
      const jsonData = await response.json();

      // Filter the data based on the selected date range
      const filteredData = jsonData.filter((item) => {
        const itemDate = new Date(item.plan_date); // Assuming item.plan_date is a string in "YYYY-MM-DD" format
        return itemDate >= fromDate && itemDate <= toDate;
      });


      setFilterdata(filteredData);
      setRows(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataWithoutDate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getreadystockdata`); // Replace with your API endpoint
      const jsonData = await response.json();

      if (Array.isArray(jsonData)) {
        const reversedData = [...jsonData].reverse();
        setFilterdata(reversedData);
        setRows(reversedData);
        // setFilterdata(jsonData);
        // setRows(jsonData);
      } else {
        console.error("Fetched data without date is not an array");
      }
      // setFilterdata(jsonData); // for search data
      // setRows(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchData();
    } else {
      fetchDataWithoutDate();
    }
  }, [fromDate, toDate]);
  // Rest of your code...

  const handleDelete = async (id) => {
    const res2 = await fetch(`${APP_BASE_PATH}/deletereadystock/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const deletedata = await res2.json();
    if (res2.status === 404 || !deletedata) {
      console.log("error");
    } else if (res2.status === 400) {
      Swal.fire({
        title: "Item Cannot Be Deleted!!",
        icon: "warning",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "warning",
      });
    }

    else {
      Swal.fire({
        title: "Item Deleted Successfully!!!!",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });

      // Update the filtered data and rows state after deletion
      const updatedFilteredData = filterdata.filter((item) => item.id !== id);
      setFilterdata(updatedFilteredData);
      setRows(updatedFilteredData);
    }
  };


  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.min(page, Math.floor(rows.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };


  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");
  const handlesearch = (event) => {
    const getSearch = (event.target.value || '').toLowerCase(); // Convert query to lowercase and handle null/undefined values

    if (!filterdata) {
      return; // Return early if filterdata is null or undefined
    }

    let filteredData = filterdata; // Use the already filtered data

    if (fromDate && toDate) {
      filteredData = filteredData.filter((item) => {
        const planDate = dayjs(item.plan_date);
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
          item.wo_no.toLowerCase().includes(lowercaseSearch) ||
          item.capacity.toLowerCase().includes(lowercaseSearch) ||
          item.custname.toLowerCase().includes(lowercaseSearch) ||
          (typeof item.oa_quantity === 'string' && item.oa_quantity.toLowerCase().includes(lowercaseSearch)) ||
          (typeof item.production_qty === 'string' && item.production_qty.toLowerCase().includes(lowercaseSearch)) ||
          (typeof item.type === 'string' && item.type.toLowerCase().includes(lowercaseSearch)) ||
          (typeof item.testing_div === 'string' && item.testing_div.toLowerCase().includes(lowercaseSearch)) ||
          (typeof item.plan_date === 'string' && item.plan_date.toLowerCase().includes(lowercaseSearch)) ||
          (typeof item.priratio === 'string' && typeof item.secratio === 'string' && `${item.priratio}/${item.secratio}V`.toLowerCase().includes(lowercaseSearch))
        );
      });
    }

    setRows(filteredData);
    setQuery(getSearch);
  };

  const handleFromDateChange = (newValue) => {
    setFromDate(newValue);
  };

  const handleToDateChange = (newValue) => {
    setToDate(newValue);
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
              <h4>Ready Stock</h4>
            </div>
            <Button
              variant="contained"
              sx={{
                background: "#00d284",
                "&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },
              }}
              onClick={handleRoute}
            >
              Add Ready Stock         </Button>
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
            <div >
              <div class="container">
                <div class="row">
                  <div class="col" id="date">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="From Date"
                        inputFormat="DD/MM/YYYY"
                        value={fromDate}
                        sx={{ marginLeft: "25%", background: '#e4e9f0' }}
                        onChange={handleFromDateChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                  <div class="col" id="date">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="To Date"
                        inputFormat="DD/MM/YYYY"
                        value={toDate}
                        sx={{ marginRight: "50%", background: '#e4e9f0' }}
                        onChange={handleToDateChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>

              <div style={{ width: "100%", marginTop: "-22px" }}>
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
                    marginLeft: "42rem",
                    position: "relative",
                    bottom: "19px",
                    width: 300,

                  }}
                />
                <br />
                <TableContainer>

                  <div className={classes.root}>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell className="MuiTableHead-root">
                            <NumbersIcon style={{ fontSize: "16px" }} />
                            Sr No
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            OA <br />Ref No
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            PROD <br />Ref No
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <ListIcon style={{ fontSize: "16px" }} />
                            Production <br /> Qty
                          </TableCell>
                          <TableCell style={{ fontSize: "16px", marginRight: '2px' }} className="MuiTableHead-root">

                            <ReorderIcon style={{ fontSize: "16px" }} />
                            Ready<br /> Stock <br /> Qty
                          </TableCell>

                          <TableCell style={{ fontSize: "16px", marginRight: '2px' }} className="MuiTableHead-root">
                            <ReorderIcon style={{ fontSize: "16px" }} />
                            Challan<br /> Qty
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            RM <br /> PROD <br /> Qty
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            REM <br /> BOM <br /> Qty
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <ContactMailIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Customer
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <BatteryCharging20Icon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Capacity
                          </TableCell>
                          <TableCell className="MuiTableHead-root">

                            <TextFieldsIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Type
                          </TableCell>
                          {/* <TableCell className="MuiTableHead-root">
                        <ContentPasteSearchIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Testing <br />Div
                        </TableCell> */}
                          {/* <TableCell
                          className="MuiTableHead-root"
                        >
                          <CalendarMonthIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Date
                        </TableCell> */}
                          <TableCell className="MuiTableHead-root">
                            <ElectricMeterIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Voltage<br /> Ratio
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <AutoAwesomeIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {Array.isArray(rows) && rows
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
                                <TableCell style={{ textAlign: 'center' }}>{item.ref_no}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{item.wo_no}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.a}>{item.production_qty}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.a}>{item.ready_qty}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.a}>{item.challan_qty}</TableCell>
                                <TableCell style={{ textAlign: "center" }} key={item.a}>
                                  {(item.production_qty || 0) -
                                    ((item.ready_qty || 0) + (item.challan_qty || 0) + (item.remainingbomissueqty || 0))}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }} key={item.b}>
                                  {item.remainingbomissueqty || 0}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }} key={item.b}>
                                  <div className="customer-name" style={{
                                    maxWidth: '300px',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    lineHeight: '1.4',
                                    textAlign: 'left',
                                  }}>
                                    {item.custname}
                                  </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.c}>
                                  {item.capacity}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }} key={item.d}>
                                  {item.type === 1
                                    ? "OUTDOOR"
                                    : item.type === 2
                                      ? "INDOOR"
                                      : item.type === 3
                                        ? "OUTDOOR/INDOOR"
                                        : ""}
                                </TableCell>

                                {/* <TableCell style={{textAlign:'center'}} key={item.f}>
                                {item.testing_div}
                              </TableCell> */}
                                {/* <TableCell key={item.e}>
                                {formatDate(item.plan_date)}
                              </TableCell> */}
                                <TableCell style={{ textAlign: "center" }} key={item.p}>
                                  {item.priratio}/{item.secratio}V
                                </TableCell>
                                <TableCell className="wh-spc">
                                  <Link to={`/readyStockDet?id=${item.id}`}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        padding: "8px",
                                        background: "#00cff4",
                                        "&:hover": {
                                          background: "#00cff4", // Set the same color as the default background
                                        },
                                      }}
                                    >
                                      View
                                    </Button>
                                  </Link>
                                  &nbsp;&nbsp;
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
                  rowsPerPageOptions={[15, 25]}
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
  )
}

export default ProductionReadyStock;

