import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./user.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { emphasize, styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Slide from "@mui/material/Slide";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import { useFormik } from "formik";
import { userMasterSchema } from "../../../schemas";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NumbersIcon from '@mui/icons-material/Numbers';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import MailIcon from '@mui/icons-material/Mail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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
import { DatePicker } from "@mui/x-date-pickers";
import '../../../App.css'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const names = [
  "MARKETING",
  "DESIGN",
  "PURCHASE",
  "STORE",
  "PRODUCTION",
  "ACCOUNTS",
  "ADMIN"
];


const useStyles = makeStyles({
  root: {
    "& 	.MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight:"bold"
    },
    
  },
});
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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

export default function UserMaster() {
  const empToTypeMapping = {
    "MARKETING": 1,
    "DESIGN": 2,
    "PURCHASE":3,
  "STORE":4,
  "PRODUCTION":5,
  "ACCOUNTS":6,
  "ADMIN":7
    // Add more mappings for other emp values as needed
  };
  const [value, setValue] = useState(dayjs());

  function handleChange1(event) {
    handleDateChange(event.$d);
  }

  function handleChange2(e) {
    handleInputs(e);
  }

  function handleChange3(event) {
    handleChanget(event);
  }

  function handleOnChange(event) {
    handleChange2(event);
    handleChange3(event);
  }

  const handleDateChange = (newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [personName, setPersonName] = React.useState([]);

  const handleChanget = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [user, setUser] = useState({
    email: "",
    contactno: "",
    dob: "",
    username: "",
    type: "",
    password: "",
    fname: "",
    lname: "",
    desg: "",
    quot_serial: "",
  });

  let name, values;
  const handleInputs = (e) => {
    // console.log(e);
    name = e.target.name;
    values = e.target.value;
  
    setUser({
      ...user,
      dob: dayjs(value).format("DD-MM-YYYY"),
      type: personName,
      [name]: values,
    });
  };
  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  
//   const addUser = async (e) => {
//     e.preventDefault();

//     // Convert quot_serial to uppercase
//     const formattedQuotSerial = user.quot_serial.toUpperCase();

//     // Check if the provided value matches the desired pattern
//     const regex = /^[A-Z]{2}\d{1}$/;
//     if (!regex.test(formattedQuotSerial)) {
//       // Show an alert for an invalid quot_serial format
//       Swal.fire({
//         title: 'Invalid quot_serial format. Please enter 2 characters and 1 number.',
//         icon: 'error',
//         iconHtml: '',
//         confirmButtonText: 'OK',
//         animation: 'true',
//         confirmButtonColor: 'red',
//       });
//       return;
//     }

//     // Extract the selected types from personName
//     const selectedEmps = personName;

//     // Use the mapping to set the corresponding types
//     const selectedTypes = selectedEmps.map((emp) => empToTypeMapping[emp]);

//     // Set the user object with the correct type and emp fields
//     const userData = {
//       ...user,
//       dob: dayjs(value).format('DD/MM/YYYY'),
//       type: selectedTypes,
//       emp: selectedEmps,
//       quot_serial: formattedQuotSerial, // Use the formatted value
//     };

//     // Perform validation and make the POST request
//     if (
//       !userData.email ||
//       !userData.contactno ||
//       !userData.dob ||
//       !userData.username ||
//       !userData.password ||
//       !userData.emp ||
//       !userData.fname ||
//       !userData.lname ||
//       !userData.desg ||
//       !userData.quot_serial
//     ) {
//       Swal.fire({
//         title: 'Please fill all required fields!',
//         icon: 'error',
//         iconHtml: '',
//         confirmButtonText: 'OK',
//         animation: 'true',
//         confirmButtonColor: 'red',
//       });
//       return;
//     }

//     if (!validateEmail(userData.email)) {
//       Swal.fire({
//         title: 'Invalid Email!',
//         icon: 'error',
//         iconHtml: '',
//         confirmButtonText: 'OK',
//         animation: 'true',
//         confirmButtonColor: 'red',
//       });
//       return;
//     }

//     const res = await fetch(`${APP_BASE_PATH}/addUser`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });

//     const textResponse = await res.text(); // Use text() instead of json()

//     console.log("Data from server:", textResponse);
    
//     if (res.status === 400 || textResponse.trim() === 'Quot_serial already exists') {
//          Swal.fire({
//         title: 'Error',
//         icon: 'error',
//         text: 'Quot_serial already exists',
//         confirmButtonText: 'OK',
//         confirmButtonColor: 'red',
//       });
//     } else if (textResponse.trim() === 'POSTED') {
//       Swal.fire({
//         title: 'Data Added Successfully',
//         icon: 'success',
//         confirmButtonText: 'OK',
//         confirmButtonColor: 'green',
//       });
//     } else {
//            Swal.fire({
//         title: 'Unexpected Response',
//         icon: 'error',
//         text: 'Unexpected response from the server',
//         confirmButtonText: 'OK',
//         confirmButtonColor: 'red',
//       });
//     }
    
//     handleClose();
//     fetchData();
    
   
// };

const addUser = async (e) => {
  e.preventDefault();

  const formattedQuotSerial = user.quot_serial.toUpperCase();

  // Regular expression to validate the format: 1 or 2 letters, optionally followed by 1 number
  const regex = /^[A-Z]{1,2}\d?$/;
  
  // Validate the formattedQuotSerial
  if (!regex.test(formattedQuotSerial)) {
    Swal.fire({
      title: "Invalid Input",
      text: "Quot Serial must contain 1 or 2 alphabets, optionally followed by 1 number.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "red",
    });
    return;
  }

  // Extract the selected types from personName
  const selectedEmps = personName;

  // Use the mapping to set the corresponding types
  const selectedTypes = selectedEmps.map((emp) => empToTypeMapping[emp]);

  // Set the user object with the correct type and emp fields
  const userData = {
    ...user,
    dob: dayjs(value).format('YYYY-MM-DD'),
    type: selectedTypes,
    emp: selectedEmps,
    quot_serial: formattedQuotSerial,
  };

  if (
    !userData.email ||
    !userData.contactno ||
    !userData.dob ||
    !userData.username ||
    !userData.password ||
    !userData.emp ||
    !userData.fname ||
    !userData.lname ||
    !userData.desg 
   
  ) {
    Swal.fire({
      title: 'Please fill all required fields!',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: 'red',
    });
    return;
  }

  if (!validateEmail(userData.email)) {
    Swal.fire({
      title: 'Invalid Email!',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: 'red',
    });
    return;
  }

  try {
    const res = await fetch(`${APP_BASE_PATH}/addUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const textResponse = await res.text(); // Use text() instead of json()

    console.log("Data from server:", textResponse);

    if (res.status === 400 || textResponse.trim() === 'Quot_serial already exists') {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Quot_serial already exists',
        confirmButtonText: 'OK',
        confirmButtonColor: 'red',
      });
    } else if (textResponse.trim() === 'POSTED') {
      Swal.fire({
        title: 'Data Added Successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: 'green',
      });
    } else {
      Swal.fire({
        title: 'Unexpected Response',
        icon: 'error',
        text: 'Unexpected response from the server',
        confirmButtonText: 'OK',
        confirmButtonColor: 'red',
      });
    }

    handleClose();
    fetchData();
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: 'Error',
      icon: 'error',
      text: 'Failed to add user',
      confirmButtonText: 'OK',
      confirmButtonColor: 'red',
    });
  }
};


  const [rows, setRows] = useState([]);
  // const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getUsermaster`); // Replace with your API endpoint
      const jsonData = await response.json();
      console.log(jsonData)
      setRows(jsonData);
      setSearch(jsonData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setRows(search);
    } else {
      const filterResult = search.filter(
        (item) =>
          item.email.toLowerCase().includes(e.target.value) ||
          item.contactno.toLowerCase().includes(e.target.value) ||
          item.dob.toLowerCase().includes(e.target.value) ||
          item.fname.toLowerCase().includes(e.target.value) ||
          item.lname.toLowerCase().includes(e.target.value) ||
          item.fullname.toLowerCase().includes(e.target.value)
      );
      if (filterResult.length > 0) {
        setRows(filterResult);
      } else {
        setRows([{ name: "No Data" }]);
      }
    }
    setFilter(e.target.value);
  };

  const handleDelete = (id) => {
    
    fetch(`${APP_BASE_PATH}/deleteUser/${id}`, {
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
        console.error("Error deleting item:", error);
      });
  };

  const [page, setPage] = useState(0);
  
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [serialNumber, setSerialNumber] = useState(1);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.min(page, Math.floor(rows.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); 
  };
  

  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    contactno: "",
    dob: "",
    username: "",
    type: "",
    password: "",
    fname: "",
    lname: "",
    desg: "",
    quot_serial: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editUser/+${id}`); // Replace with your API endpoint
        const resData = await reqData.json();
        setData(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      <div
        className="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13, }}
      >
        <div className="page_header">
          <h4>User Master</h4>
        </div>
        <Button variant="contained" sx={{  background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      }, }} onClick={handleClickOpen}>
          Add User
        </Button>
      </div>
      <br />

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
            Add User
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-slide-description">
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="fname"
                      name="fname"
                      label="First Name"
                      autoComplete="Date"
                      values={user.fname}
                      onChange={handleInputs}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      style={{ width: 260 }}
                      id="lname"
                      label="Last Name"
                      name="lname"
                      values={user.lname}
                      onChange={handleInputs}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Email ID"
                      name="email"
                      values={user.email}
                      onChange={handleInputs}
                      error={!validateEmail(user.email)}
                      helperText={!validateEmail(user.email) ? "" : ""}

                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      style={{ width: 260 }}
                      id="contactno"
                      label="Contact No"
                      name="contactno"
                      
                      value={user.contactno}
                      onInput={(e) => {
                        e.target.value = e.target.value.slice(0, 10);
                      }}
                      onChange={handleInputs}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl style={{ width: 270 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date of Birth"
                          name="dob"
                          required
                          format="DD-MM-YYYY"
                          value={value}
                          // onChange={handleDateChange}
                          values={user.dob}
                          onChange={handleChange1}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl style={{ width: 260 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        Type
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        values={user.emp}
                        onChange={handleOnChange}
                        name="emp"
                        value={personName}
                        // onChange={handleChanget}
                        input={<OutlinedInput label="Type" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {names.map((name, id) => (
                          <MenuItem key={id} value={name}>
                            <Checkbox checked={personName.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="desg"
                      label="Designation"
                      name="desg"
                      values={user.desg}
                      onChange={handleInputs}
                      autoComplete="Date"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      style={{ width: 260 }}
                      id="username"
                      label="Username "
                      name="username"
                      autoComplete="Date"
                      values={user.username}
                      onChange={handleInputs}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="password"
                      label="Password"
                      name="password"
                      values={user.password}
                      onChange={handleInputs}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      style={{ width: 260 }}
                      id="confirmPassword"
                      label="Confirm Password"
                      name="confirmPassword"
                      values={user.confirmPassword}
                      onChange={handleInputs}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="quot_serial"
                      label="Quotation Reff. Serial Number"
                      name="quot_serial"
                      values={user.quot_serial}
                      onChange={handleInputs}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },}}
              variant="contained"
              onClick={addUser}
              type="submit"
            >
              Save
            </Button>

            <Button
             sx={{ background: "#ff0854",
             "&:hover": {
               background: "#ff0854", // Set the same color as the default background
             },}}
              id="closebtn"
              variant="contained"
              onClick={handleClose}
            >
              close
            </Button>
          </DialogActions>
        </BootstrapDialog>
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
            <div >
              <TextField
               className="Search"
                label="Search..."
                value={filter}
                onChange={(e) => handleFilter(e)}
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
                 
                  marginBottom: "8px",
                  
                }}
              />

              <br />

              <TableContainer>
                
                <div className={classes.root}>
                <Table className="tabel">
                    <TableHead className="tableHeader" >
                      <TableRow>
                        <TableCell className="MuiTableHead-root" align="center" style={{width:'0.5%'}}>
                        <NumbersIcon style={{ fontSize: "14px"  }} />Sr <br /> NO</TableCell>

                        <TableCell className="MuiTableHead-root" align="center" style={{width:'0.5%'}}>
                      
                        <ContactEmergencyIcon style={{ fontSize: "14px" }} />
                          FULL <br /> NAME
                        </TableCell>
                        <TableCell className="MuiTableHead-root" align="center">
                        <MailIcon style={{ fontSize: "14px",marginRight:'2px' }} />EMAIL</TableCell>
                        <TableCell className="MuiTableHead-root" align="center">
                        <CallIcon style={{ fontSize: "14px",marginRight:'2px' }} />
                        CONTACT <br /> No
                        </TableCell>
                        <TableCell className="MuiTableHead-root" align="center">
                        <CalendarMonthIcon style={{ fontSize: "14px",marginRight:'2px' }} />DOB</TableCell>
                        <TableCell className="MuiTableHead-root" align="center">
                      
                        <SupervisorAccountIcon style={{ fontSize: "14px",marginRight:'2px' }} />
                        TYPE</TableCell>
                        <TableCell className="MuiTableHead-root" align="center">
                       
                        <PersonIcon style={{ fontSize: "14px",marginRight:'2px' }} />
                          USERNAME
                        </TableCell>
                        <TableCell className="MuiTableHead-root" align="center">
                        <AutoAwesomeIcon style={{ fontSize: "14px",marginRight:'2px' }} />
                          ACTION
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item,index) => {
                          return (
                            <TableRow
                            className="tabelrow"
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={item.code}
                            >
                                  <TableCell style={{textAlign:'center',width:'0.5%'}}>{serialNumber + index}</TableCell> 
                              <TableCell style={{textAlign:'center'}} key={item.a}>{item.fullname}</TableCell>
                              <TableCell style={{textAlign:'center'}} key={item.b}>{item.email}</TableCell>
                              <TableCell style={{textAlign:'center'}} key={item.c}>{item.contactno}</TableCell>
                              <TableCell style={{textAlign:'center'}} key={item.d}>
                                {dayjs(item.dob).format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell style={{textAlign:'center'}} key={item.e}>{item.emp}</TableCell>
                              <TableCell style={{textAlign:'center'}}  key={item.f}>{item.username}</TableCell>
                              <TableCell style={{alignItems:'center', align:'center',textAlign:'center'}}>
                               
                                <Link to={`/edituser/${item.id}`}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                   
                                    
                                    sx={{padding:"8px",marginRight:"10px",background: "#00d284",
                                    "&:hover": {
                                      background: "#00d284", // Set the same color as the default background
                                    },}}
                                  >
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleDelete(item.id)}
                                  
                                  
                                  sx={{padding:"8px",marginRight:"10px",background: "#ff0854",
                                  "&:hover": {
                                    background: "#ff0854", // Set the same color as the default background
                                  },}}
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
          </div>
        )}
      
      </>
      )}
    </>
  );
}
