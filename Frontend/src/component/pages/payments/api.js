import { useState } from "react";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton,Grid } from "@mui/material";
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
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { emphasize, styled } from "@mui/material/styles";

const api = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(dayjs());
    const columns = [
  
        { field: "id", align: "center", headerName: "Sr No", width: 90 },
        { field: "customerName", headerName: "Customer", width: 220 },
        {
          field: "amount",
          headerName: "Amount",
          align: "center",
          headerAlign: "center",
          width: 160,
        },
        {
          field: "date",
          headerName: "Date",
          headerAlign: "center",
          align: "center",
          width: 150,
        },
        {
          field: "paymentMode",
          headerName: "Payment Mode",
          align: "center",
          width: 120,
        },
        {
          field: "paid",
          headerName: "Paid",
          headerAlign: "center",
          align: "center",
          width: 150,
        },
        {
          field: "action",
          headerName: "Action",
          headerAlign: "center",
          align: "center",
          width: 170,
          renderCell: () => {
            
            const handleClickOpen = () => {
             chek();
            };
            return (
              <>
                <IconButton
                  size="small"
                  title="Print"
                  color="warning"
                  onClick={handleClickOpen}
                >
                  <EditIcon />
                </IconButton>
                <IconButton size="small" title="Print" color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            );
          },
        },
      ];

      const rows = [
        {
          id: 1,
          customerName: "Yash Electrical",
          amount: "1000",
          paymentMode: "OUTDOOR",
          paid: "PRC",
          date: "2021-02-02",
        },
        {
          id: 2,
          customerName: "Shreyash Electrical",
          amount: "1000",
          paymentMode: "OUTDOOR",
          paid: "PRC",
          date: "2021-02-02",
        },
        {
          id: 3,
          customerName: "Viraj Electrical",
          amount: "1000",
          paymentMode: "OUTDOOR",
          paid: "PRC",
          date: "2021-02-02",
        },
      ];

      const useStyles = makeStyles({
        root: {
          "& .MuiDataGrid-columnHeader": {
            color: "#ed6c02",
            fontSize: "1.1em",
          },
        },
      });
      
      const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="down" ref={ref} {...props} />;
      });
      
      const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
          padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
          padding: theme.spacing(1),
        },
      }));
      
      BootstrapDialogTitle.propTypes = {
        children: PropTypes.node,
        onClose: PropTypes.func.isRequired,
      };
      
      function BootstrapDialogTitle(props) {
        const { children, onClose, ...other } = props;
      
        return (
          <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </DialogTitle>
        );
      }

      const handleChange = (newValue) => {
        setValue(newValue);
      };
    
      const navigate = useNavigate();
    
      const handleRoute = () => {
        navigate("/newPayments");
      };
      const classes = useStyles();
      
    
      
      const handleClose = () => {
        setOpen(false);
      };
  return (
    <>
    <div class="d-flex justify-content-between">
      <div className="page_header">
        <h3>Payment History</h3>
      </div>
      <Button variant="contained" color="warning" onClick={handleRoute}>
        New Payment
      </Button>
      <Link to="/payments" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="warning">
          Back
        </Button>
      </Link>
    </div>

    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        aria-describedby="alert-dialog-slide-description"
        TransitionComponent={Transition}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Add Employee
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description">
            <Box style={{ marginLeft: 25 }}>
              <Grid container spacing={3}>
                <Grid item xs={7}>
                  <TextField
                    style={{ width: 500 }}
                    fullWidth
                    id="empId"
                    placeholder="Emp ID"
                    labelprope
                    name="empId"
                    autoComplete="Date"
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    style={{ width: 500 }}
                    id="empName"
                    placeholder="Employee Name"
                    name="empName"
                    autoComplete="Date"
                  />
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={3}>
                <Grid item xs={7}>
                  <TextField
                    style={{ width: 500 }}
                    fullWidth
                    id="emailId"
                    placeholder="Email ID"
                    labelprope
                    name="emailId"
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    style={{ width: 500 }}
                    id="contactNo"
                    placeholder="Contact No"
                    name="contactNo"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            type="submit"
          
          >
            Save
          </Button>
          <Button color="warning" variant="contained">
            Print
          </Button>
          <Button color="error" variant="contained" onClick={handleClose}>
            close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>

    <Paper elevation={6} style={{ height: 600, marginTop: 15 }}>
      <div className={classes.root}>
        <div class="container text-center">
          <div class="row">
            <div class="col" id="datePicker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="From Date"
                  inputFormat="DD/MM/YYYY"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div class="col" id="enddate">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="To Date"
                  inputFormat="DD/MM/YYYY"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <div style={{ height: 400, width: "100%", marginTop: "-70px" }}>
          <TextField
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
            color="warning"
            sx={{
              marginLeft: "60rem",
              marginTop: "7px",
              marginBottom: "4px",
            }}
          />
          <br />

          <div class="d-flex justify-content-center">
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <div style={{ position: "relative", top: 300, right: 50 }}>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="standard-adornment-amount">
                    Paid
                  </InputLabel>
                  <Input
                    id="standard-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              <div style={{ position: "relative", top: 300, left: 10 }}>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="standard-adornment-amount">
                    Total
                  </InputLabel>
                  <Input
                    id="standard-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />








                </FormControl>
              </div>
              <div style={{ position: "relative", top: 300, left: 50 }}>
                <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                  <InputLabel htmlFor="standard-adornment-amount">
                    PENDING
                  </InputLabel>
                  <Input
                    id="standard-adornment-amount"
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                </FormControl>
              </div>
            </Box>
          </div>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </div>
    </Paper>
  </>
  )
}

export default api
