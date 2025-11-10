import { useRef, useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, Grid, Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import "./payment.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
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
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight: "bold",
      align: "center",
    },
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function NewPayments() {
  const navigate = useNavigate();
  const [value, setValue] = useState(dayjs());
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const ref = useRef();
  const [button, setButton] = useState(false);

  const handleDateChange = (newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();

  function handleChange1(newValue) {
    setUser({ ...user, payment_date: newValue });
  }


  const [user, setUser] = useState({
    amount: "",
    paymode: "",
    payment_date: "",
    cheque_rtgs_no: "",
  });

  const handleInputs = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };
  const addPayment = async (e) => {
    setButton(true);
    e.preventDefault();
    const { amount, paymode, payment_date, cheque_rtgs_no } = user;

    // Check if required fields are empty
    if (!amount || !paymode || !payment_date) {
      setOpen(false);
      setButton(false);
      Swal.fire({
        title: "Please Fill All Required Fields",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });

      return; // Stop further execution
    }

    const pendingAmount = (data.total || 0) - (data.paid || 0);

    if (parseFloat(amount) > parseFloat(pendingAmount)) {
      setOpen(false);
      setButton(false);
      Swal.fire({
        title: "Invalid Amount",
        text: `Entered amount (${amount}) cannot be more than pending amount (${pendingAmount}).`,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    const res = await fetch(`${APP_BASE_PATH}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: data.custname,
        advance: amount,
        date: new Date(),
        amount,
        paymode,
        payment_date,
        cheque_rtgs_no,
        oid: data.id,
      }),
    });
    const resp = res.json();

    if (res.status === 400 || !resp) {
      setOpen(false);
      setButton(false);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } else {
      setOpen(false);
      setButton(false);
      Swal.fire({
        title: "Data Added Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
      navigate("/payments");

      fetchData();
      ref.current.class = "close";
      ref.current["data-dismiss"] = "modal";
      ref.current["aria-label"] = "Close";
    }
  };

  const onPayment = (data) => {
    console.log("Payment button clicked. Data:", data);
    setData(data);
    setOpen(true);
  };
  const Close = () => {
    setOpen(false);
  };
  // get method//
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getPayments`); // Replace with your API endpoint
      const jsonData = await response.json();
      setIsLoading(false);
      setFilterdata(jsonData); // for search data
      setRows(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      const searchdata = rows.filter(
        (item) =>
          item.custname.toLowerCase().includes(getSearch) ||
          item.ref_no.toLowerCase().includes(getSearch) ||
          item.capacity.toLowerCase().includes(getSearch)
      );
      setRows(searchdata);
    } else {
      setRows(filterdata);
    }
    setQuery(getSearch);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.min(page, Math.floor(rows.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5
                  class="modal-title"
                  className="page_heaer"
                  id="exampleModalLongTitle"
                >
                  MAKE PAYMENT
                </h5>
                <button
                  type="button"
                  class="close"
                  // data-dismiss="modal"
                  aria-label="Close"
                  ref={ref}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <h5
                for="exampleInputEmail1"
                className="page_heaer"
                style={{ position: "relative", color: "blue" }}
              >
                Customer Name: {data.custname}
              </h5>
              <h5
                for="exampleInputEmail1"
                className="page_heaer"
                style={{ position: "relative", color: "blue" }}
              >
                OA Ref Number: {data.ref_no}
              </h5>

              <div class="modal-body" className="page_heaer">
                <div
                  class="d-flex"
                  style={{
                    justifyContent: "space-between",
                    width: "400px",
                    marginLeft: "22px",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "600" }}>Total:</span>{" "}
                    {data.total}
                  </div>
                  <div>
                    <span style={{ fontWeight: "600" }}>Paid:</span> {data.paid}{" "}
                  </div>
                  <div>
                    <span style={{ fontWeight: "600" }}>Pending:</span>{" "}
                    {data.total - data.paid}
                  </div>
                </div>
                <Box style={{ marginLeft: 25 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={7}>
                      <TextField
                        style={{ width: 400 }}
                        fullWidth
                        id="empId"
                        label="Amount"
                        labelprope
                        name="amount"
                        value={user.amount || ""}
                        onChange={handleInputs}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <FormControl style={{ width: 400 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            label="Payment Date"
                            name="payment_date"
                            required
                            inputFormat="DD/MM/YYYY"
                            value={user.payment_date || ""}
                            onChange={handleChange1}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={3}>
                    <Grid item xs={7}>
                      <FormControl style={{ width: 400 }}>
                        <InputLabel id="demo-select-small">
                          Payment Mode
                        </InputLabel>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          label="Payment Mode"
                          name="paymode"
                          value={user.paymode || ""}
                          onChange={handleInputs}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        >
                          <MenuItem>Select Payment Mode</MenuItem>
                          <MenuItem value={"Cash"}>Cash</MenuItem>
                          <MenuItem value={"Cheque"}>Cheque</MenuItem>
                          <MenuItem value={"NEFT/RTGS "}>NEFT/RTGS</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        style={{ width: 400 }}
                        id="contactNo"
                        label="CHEQUE/NEFT/RTGS REF No"
                        name="cheque_rtgs_no"
                        value={user.cheque_rtgs_no || ""}
                        onChange={handleInputs}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </div>
              <br />
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-success"
                  data-dismiss="modal"
                  disabled={button}
                  onClick={addPayment}
                  style={{
                    background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  class="btn btn-danger"
                  sx={{
                    background: "#ff0854",
                    "&:hover": {
                      background: "#ff0854", // Set the same color as the default background
                    },
                  }}
                  onClick={Close}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>New Payments</h4>
        </div>
        <Link to="/payments" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }}
          >
            Back
          </Button>
        </Link>
      </div>

      <div className={classes.root}>
        <div style={{ height: 400, width: "100%" }}>
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
              marginTop: "8px",
              marginBottom: "8px",
            }}
          />
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
                    <TableCell className="MuiTableHead-root">
                      <NumbersIcon style={{ fontSize: "16px" }} />
                      Sr No
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{ width: 150 }}
                    >
                      <ContactMailIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Customer
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{ width: 150 }}
                    >
                      <TextSnippetIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      OA Referance
                    </TableCell>
                    {/* <TableCell
                      className="MuiTableHead-root"
                      style={{ width: 150 }}
                    >
                      <CalendarMonthIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      OA Date
                    </TableCell> */}

                    <TableCell className="MuiTableHead-root">
                      <BatteryCharging20Icon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Capacity
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      <ElectricMeterIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Voltage Ratio
                    </TableCell>

                    <TableCell className="MuiTableHead-root">
                      <PaymentsIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Total
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      <PaidIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Paid
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      <PendingIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Pending
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{ width: 130 }}
                    >
                      <CalendarMonthIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Date
                    </TableCell>
                    {/* <TableCell className="MuiTableHead-root">
                      <LocalShippingIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Dispatch Date
                    </TableCell> */}
                    <TableCell className="MuiTableHead-root">
                      <AutoAwesomeIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => {
                      return (
                        <TableRow
                          className="tabelrow"
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={item.code}
                        >
                          <TableCell key={item.id}>{item.id}</TableCell>
                          <TableCell key={item.a}>{item.custname}</TableCell>
                          <TableCell key={item.b}>{item.ref_no}</TableCell>
                          {/* <TableCell key={item.c}>
                            {item.orderacc_date}
                          </TableCell> */}
                          <TableCell key={item.d}>{item.capacity}</TableCell>
                          <TableCell key={item.e}>
                            {item.priratio}/{item.secratio}V
                          </TableCell>
                          <TableCell key={item.f}>
                            {(parseFloat(item.total) || 0).toFixed(2)}
                          </TableCell>
                          <TableCell key={item.g}>
                            {(parseFloat(item.paid) || 0).toFixed(2)}
                          </TableCell>
                          <TableCell key={item.i}>
                            {(item.total - item.paid)?.toFixed(2)}
                          </TableCell>
                          <TableCell key={item.h}>
                            {(() => {
                              const d = new Date(item.date);
                              const day = String(d.getDate()).padStart(2, '0');
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const year = d.getFullYear();
                              return `${day}/${month}/${year}`;
                            })()}
                          </TableCell>
                          {/* <TableCell key={item.j}>
                            {item.dispatchdate}
                          </TableCell> */}
                          <TableCell>
                            <Link style={{ textDecoration: "none" }}>
                              <Button
                                variant="contained"
                                data-toggle="modal"
                                data-target="#exampleModalCenter"
                                sx={{
                                  background: "#00d284",
                                  "&:hover": {
                                    background: "#00d284", // Set the same color as the default background
                                  },
                                }}
                                onClick={() => onPayment(item)}
                              >
                                Payment
                              </Button>
                            </Link>
                            {/* <Button onClick={handleOpen}>Open modal</Button> */}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[3, 6]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
}
