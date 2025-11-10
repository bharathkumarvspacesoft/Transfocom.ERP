import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton, Grid } from "@mui/material";
import "./suppliers.css";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import TablePagination from "@mui/material/TablePagination";
import { addSupplierSchema } from "../../../schemas";
import { emphasize, styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NumbersIcon from '@mui/icons-material/Numbers';
import CallIcon from '@mui/icons-material/Call';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import Swal from "sweetalert2";
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

export default function Suppliers() {
  const [user, setUser] = useState({
    email: "",
    contactno: "",
    name: "",
    address: "",
  });
  const [serialNumber, setSerialNumber] = useState(1);
  let name, values;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    values = e.target.value;

    setUser({
      ...user,
      [name]: values,
    });
  };

  const addSupplier = async (e) => {
    e.preventDefault();
    const { email, contactno, name, address } = user;

    const res = await fetch(`${APP_BASE_PATH}/addSuppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        contactno,
        name,
        address,
        curdate: new Date(),
      }),
    });
    const data = res.json();
    if (res.status === 400 || !data) {
      Swal.fire({
        title: "Please Fill Data!!!!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else {
      Swal.fire({
        title: "Data Added Successfully",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });
    }
    handleClose();
    fetchData();
  };
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/addSuppliers");
  };
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [uopen, setuOpen] = React.useState(false);
  const handleClickOpenUpdate = () => {
    setuOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setuOpen(false);
  };

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getsupplier`); // Replace with your API endpoint
      const jsonData = await response.json();
      setSearch(jsonData);

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

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setRows(search);
    } else {
      const filterResult = search.filter(
        (item) =>
          item.name.toLowerCase().includes(e.target.value) ||
          item.contactno.toLowerCase().includes(e.target.value)
      );
      if (filterResult.length > 0) {
        setRows(filterResult);
      } else {
        console.log("No Data Found");

      }
    }
    setFilter(e.target.value);
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
    fetch(`${APP_BASE_PATH}/deleteSuppliers/${id}`, {
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
              <h4>Suppliers</h4>
            </div>
            <Button variant="contained" sx={{
              backgroundColor: "#00d284", marginRight: "12px", "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }} onClick={handleClickOpen}>
              Add Suppliers
            </Button>
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
                Add Suppliers
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <DialogContentText id="alert-dialog-slide-description">
                  <Box style={{ marginLeft: 25 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={7}>
                        <TextField
                          style={{ width: 500 }}
                          fullWidth
                          id="name"
                          placeholder="Supplier Name"
                          labelprope
                          name="name"
                          value={user.name}
                          onChange={handleInputs}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          style={{ width: 500 }}
                          id="email"
                          placeholder="Email ID"
                          name="email"
                          value={user.email}
                          onChange={handleInputs}
                        />
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                      <Grid item xs={7}>
                        <TextField
                          style={{ width: 500 }}
                          fullWidth
                          id="contactno"
                          placeholder="Contact No"
                          labelprope
                          name="contactno"
                          value={user.contactno}
                          onChange={handleInputs}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          style={{ width: 500 }}
                          id="address"
                          placeholder="Address"
                          name="address"
                          value={user.address}
                          onChange={handleInputs}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  sx={{
                    padding: "5px",
                    background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },
                  }}
                  variant="contained"
                  type="submit"
                  onClick={addSupplier}
                >
                  Save
                </Button>
                <Button sx={{
                  marginLeft: "5px",
                  padding: "5px",
                  background: "#ff0854",
                  "&:hover": {
                    background: "#ff0854", // Set the same color as the default background
                  },
                }} variant="contained" onClick={handleClose}>
                  Close
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </div>

          {/* Update Supplier */}

          <div>
            <BootstrapDialog
              onClose={handleCloseUpdate}
              aria-labelledby="customized-dialog-title"
              open={uopen}
              aria-describedby="alert-dialog-slide-description"
              TransitionComponent={Transition}
            >
              <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={handleCloseUpdate}
              >
                Update Suppliers
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <DialogContentText id="alert-dialog-slide-description">
                  <Box style={{ marginLeft: 25 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={7}>
                        <TextField
                          style={{ width: 500 }}
                          fullWidth
                          id="name"
                          placeholder="Supplier Name"
                          labelprope
                          name="name"
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          style={{ width: 500 }}
                          id="email"
                          placeholder="Email ID"
                          name="email"
                        />
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3}>
                      <Grid item xs={7}>
                        <TextField
                          style={{ width: 500 }}
                          fullWidth
                          id="contactno"
                          placeholder="Contact No"
                          labelprope
                          name="contactno"
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          style={{ width: 500 }}
                          id="address"
                          placeholder="Address"
                          name="address"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button sx={{
                  padding: "5px",
                  background: "#00d284",
                  "&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },
                }} variant="contained" type="submit">
                  Save
                </Button>
                <Button sx={{

                  padding: "5px",
                  background: "#00cff4",
                  "&:hover": {
                    background: "#00cff4", // Set the same color as the default background
                  },
                }} variant="contained">
                  Print
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleCloseUpdate}
                >
                  close
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </div>



          <br />
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
              <div style={{ height: 400, width: "100%" }}>
                <TextField
                  className="Search"
                  placeholder="Search..."
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
                          <TableCell
                            className="MuiTableHead-root"
                            style={{ textAlign: "center" }}
                          ><NumbersIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Sr No
                          </TableCell>

                          <TableCell
                            className="MuiTableHead-root"
                            style={{ textAlign: "center" }}
                          ><PersonIcon style={{ fontSize: "16px", marginRight: '2px' }} />

                            Supplier Name
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            style={{ textAlign: "center" }}
                          ><CallIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Contact No
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            style={{ textAlign: "center" }}
                          ><EmailIcon style={{ fontSize: "16px", marginRight: '2px' }} />

                            Email
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            style={{ textAlign: "center" }}
                          > <AutoAwesomeIcon style={{ fontSize: "16px", marginRight: '2px' }} />
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
                                <TableCell style={{ textAlign: "center" }}>{serialNumber + index}</TableCell>

                                <TableCell
                                  key={item.d}
                                  style={{ textAlign: "left" }}
                                >
                                  {item.name}
                                </TableCell>
                                <TableCell
                                  key={item.i}
                                  style={{ textAlign: "center" }}
                                >
                                  {item.contactno}
                                </TableCell>
                                <TableCell
                                  key={item.df}
                                  style={{ textAlign: "left" }}
                                >
                                  {item.email}
                                </TableCell>

                                <TableCell style={{ textAlign: "center" }}>
                                  <Link to={`/updateSuppliers/${item.id}`}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        padding: "5px",
                                        background: "#00d284",
                                        "&:hover": {
                                          background: "#00d284", // Set the same color as the default background
                                        },
                                        marginRight: "5px",
                                      }}


                                    >
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    sx={{

                                      padding: "5px",
                                      background: "#ff0854",
                                      "&:hover": {
                                        background: "#ff0854", // Set the same color as the default background
                                      },
                                    }}

                                    onClick={() => handleDelete(item.id)}

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
