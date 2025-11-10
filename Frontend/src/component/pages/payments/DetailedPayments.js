import { useState } from "react";
import React from "react";
import { useEffect, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./payment.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import Modal from "@mui/material/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";
import { set } from "date-fns";

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

export default function DetailedPayments() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(dayjs());
  const ref = useRef();
  const [button, setButton] = useState(false);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");

  const handleRoute = () => {
    // Open the payment modal instead of navigating
    handleOpen();
  };

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  // Payment form state
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

  function handleChange1(newValue) {
    setUser({ ...user, payment_date: newValue });
  }

  // get method//
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.min(page, Math.floor(data.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setButton(true);
    try {
      const response = await fetch(
        `${APP_BASE_PATH}/getDetailedPayments/` + id
      );
      const jsonData = await response.json();

      setData(jsonData);
      // Store the main order data separately for payment submission
      if (jsonData) {
        setOrderData({
          id: jsonData.id || id,
          custname: jsonData.custname,
          ref_no: jsonData.ref_no,
        });
      }
      setIsLoading(false);
      setButton(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      setButton(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addPayment = async (e) => {
    setButton(true);
    e.preventDefault();
    const { amount, paymode, payment_date, cheque_rtgs_no } = user;

    // Check if required fields are empty
    if (!amount || !paymode || !payment_date) {
      setButton(false);
      Swal.fire({
        title: "Please Fill All Required Fields",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });

      return;
    }

    const pendingAmount = (data.total || 0) - (data.paid || 0);

    if (parseFloat(amount) > parseFloat(pendingAmount)) {
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

    // Use orderData to ensure customer and oid are included
    const payload = {
      customer: orderData?.custname || data.custname || "",
      advance: amount,
      date: new Date(),
      amount,
      paymode,
      payment_date,
      cheque_rtgs_no,
      oid: orderData?.id || data.id || id,
    };

    console.log("Payment Payload:", payload); // Debug log

    try {
      const res = await fetch(`${APP_BASE_PATH}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let resp;
      const contentType = res.headers.get("content-type");

      // Check if response is JSON or plain text
      if (contentType && contentType.includes("application/json")) {
        resp = await res.json();
      } else {
        resp = await res.text(); // Get as text if not JSON
      }

      console.log("API Response:", resp); // Debug log

      if (res.status === 400 || res.status === 500 || !res.ok) {
        setButton(false);
        setOpen(false);
        Swal.fire({
          title: "Error",
          text: typeof resp === 'object' ? resp.message : "Something went wrong. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      } else {
        setButton(false);
        setOpen(false);

        // Reset form
        setUser({
          amount: "",
          paymode: "",
          payment_date: "",
          cheque_rtgs_no: "",
        });

        // Show success message
        await Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });

        // Refresh data after success
        fetchData();
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      setButton(false);
      setOpen(false);
      Swal.fire({
        title: "Error",
        text: "Network error. Please check your connection and try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    }
  };

  const handleDelete = (id) => {
    fetch(`${APP_BASE_PATH}/deletePayment/${id}`, {
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

  const { total = 0, paid = 0, payments } = data || {};

  return (
    <>
      {/* Payment Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title page_header"
                  id="exampleModalLongTitle"
                >
                  MAKE PAYMENT
                </h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  ref={ref}
                  onClick={handleClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <h5
                className="page_header"
                style={{ position: "relative", color: "blue", padding: "0 20px" }}
              >
                Customer Name: {orderData?.custname || data.custname || "N/A"}
              </h5>
              <h5
                className="page_header"
                style={{ position: "relative", color: "blue", padding: "0 20px" }}
              >
                OA Ref Number: {orderData?.ref_no || data.ref_no || "N/A"}
              </h5>

              <div className="modal-body page_header">
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    width: "400px",
                    marginLeft: "22px",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "600" }}>Total:</span> {total}
                  </div>
                  <div>
                    <span style={{ fontWeight: "600" }}>Paid:</span> {paid}
                  </div>
                  <div>
                    <span style={{ fontWeight: "600" }}>Pending:</span>{" "}
                    {total - paid}
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={button}
                  onClick={addPayment}
                  style={{
                    background: "#00d284",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleClose}
                  style={{
                    background: "#ff0854",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <div
        className="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Payment History</h4>
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
        <Link to="/payments" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              background: "#00d284",
              "&:hover": {
                background: "#00d284",
              },
            }}
          >
            Back
          </Button>
        </Link>
      </div>

      <div className={classes.root}>
        <div className="container text-center" style={{ marginBottom: "5px" }}>
          <div className="row">
            <div className="col" id="datePicker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="From Date"
                  inputFormat="DD/MM/YYYY"
                  sx={{ marginRight: "40%", background: "#e4e9f0" }}
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="col" id="enddate">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="To Date"
                  inputFormat="DD/MM/YYYY"
                  sx={{ marginRight: "25%", background: "#e4e9f0" }}
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <div style={{ height: 400, width: "100%", marginTop: "-80px" }}>
          <TextField
            className="Search"
            placeholder="Search..."
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
              marginTop: "35px",
              marginBottom: "4px",
              width: 300,
            }}
          />
          <br />

          <TableContainer>
            {isLoading && (
              <div id="spinner">
                <CircularProgress color="warning" loading={isLoading} />
              </div>
            )}
            <div className={classes.root}>
              <Table className="tabel">
                <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell className="MuiTableHead-root">Sr No</TableCell>
                    <TableCell className="MuiTableHead-root">
                      OA Referance
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      Customer
                    </TableCell>
                    <TableCell className="MuiTableHead-root">Amount</TableCell>
                    <TableCell className="MuiTableHead-root">Date</TableCell>
                    <TableCell className="MuiTableHead-root">
                      Payment ID
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      Payment Date
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      Payment Mode
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      Invoice <br /> No
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      Invoice <br /> Amount
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                      Due Balance
                    </TableCell>
                    <TableCell className="MuiTableHead-root">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {payments?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{item.ref_no}</TableCell>
                      <TableCell align="center">{item.buyer_name}</TableCell>
                      <TableCell align="center">₹{item.advance}</TableCell>
                      <TableCell align="center">
                        {item.created_at
                          ? dayjs(item.created_at).format("DD/MMM/YYYY")
                          : ""}
                      </TableCell>
                      <TableCell align="center">{item.payment_id}</TableCell>
                      <TableCell align="center">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                            "en-GB"
                          )
                          : ""}
                      </TableCell>

                      <TableCell align="center">{item.paymode}</TableCell>
                      <TableCell align="center">{item.invoice_no}</TableCell>
                      <TableCell align="center">{item.roundoff}</TableCell>
                      <TableCell align="center">
                        {item.invoice_balance}
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            padding: "4px 8px",
                            backgroundColor: "#00d284",
                            "&:hover": { backgroundColor: "#00d284" },
                          }}
                        >
                          EDIT
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            ml: 1,
                            padding: "4px 8px",
                            backgroundColor: "#ff0854",
                            "&:hover": { backgroundColor: "#ff0854" },
                          }}
                          onClick={() => handleDelete(item.id)}
                        >
                          DELETE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-sm">
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">
                      Paid
                    </InputLabel>
                    <Input
                      id="standard-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">
                          ₹{paid}
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
                <div className="col-sm">
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">
                      Total
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
                <div className="col-sm">
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">
                      PENDING
                    </InputLabel>
                    <Input
                      id="standard-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">
                          {total - paid}
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
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