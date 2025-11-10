import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./testing.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import { useFormik } from "formik";
import { divisionSchema } from "../../../schemas";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import EditTesting from "./EditTestingDivision";
import NumbersIcon from '@mui/icons-material/Numbers';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
import TablePagination from "@mui/material/TablePagination";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& 	.MuiTableCell-head": {
      color: "#000000",
      fontSize: "1.0em",
      fontWeight: "bold"
    },
    searchInput: {
      height: 40,
      fontSize: "0.9rem",
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

const initialValues = {
  testing: "",
};

export default function Reports() {
  const classes = useStyles();
  const [serialNumber, setSerialNumber] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [editopen, setEditOpen] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setUser({
      division: "",
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  // const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
  //   useFormik({
  //     initialValues,
  //     validationSchema: divisionSchema,
  //     onSubmit: (values) => {
  //       console.log(values);
  //       handleClose();
  //     },
  //   });

  const [user, setUser] = useState({
    division: "",
  });

  let name, value;

  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setError({ ...error, [name]: false });
    setUser({ ...user, [name]: value });
  };
  const [division, setDivision] = useState("");

  const post = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { division } = user;

    if (!division) {
      // If the division field is empty, show a SweetAlert error message
      Swal.fire({
        title: "Please enter the Testing Division!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      setIsLoading(false);
      return; // Exit the function without making the API call
    }

    try {
      const res = await fetch(`${APP_BASE_PATH}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          division,
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
          title: "Data Added Successfully!!!!",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        fetchData();
      }

      handleClose();
    } catch (error) {
      console.error("Error adding data:", error);
    }finally{
      setIsLoading(false);
    }
  };

  // // history.push("/");

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getTesting`); // Replace with your API endpoint
      const jsonData = await response.json();

      setRows(jsonData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    
    fetchData();
  }, []);

  // const handleDelete = (id) => {
  //   console.log("Deleting item with id:", id);
  //   fetch(`/deletetest/${id}`, {
  //     method: "DELETE",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       Swal.fire({
  //         title: "Item Deleted Successfully!!!!",
  //         icon: "success",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "green",
  //       });
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting item:", error);
  //     });
  // };
  const handleDelete = async (id) => {
  setIsLoading(true);
    try {
      const res2 = await fetch(`${APP_BASE_PATH}/deletetest/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res2.status === 404) {
        throw new Error("User not found");
      }

      const deletedata = await res2.json();

      Swal.fire({
        title: "User Deleted Successfully!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      }).then(() => {
        fetchData(); // Fetch data again after successful deletion
      });
    } catch (error) {
      console.error("Error deleting user:", error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the user.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    }finally{
    setIsLoading(false);
    }
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
  const onEdit = (division) => {
    setEditOpen(true);
    setUser(division);
  };
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event) => {
    const searchValue = event.target.value || ""; // Set a default empty string if event.target.value is undefined
    setSearchValue(searchValue.toLowerCase());
  };

  const filteredRows = rows.filter((item) =>
  (item.division?.toLowerCase() || "").includes(searchValue.toLowerCase()) 

);

  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 12 }}
      >
        <div className="page_header">
          <h4>Testing Division</h4>
        </div>
        <Button variant="contained" sx={{ background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      }, }} onClick={handleClickOpen}>
          Add Testing Division
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
            Add Testing Division
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-slide-description">
              <Box style={{ marginLeft: 21 }}>
                <Grid container spacing={3}>
                  <Grid item xl={12} style={{ position: "relative" }}>
                    <TextField
                      style={{ width: 500 }}
                      fullWidth
                      id="division"
                      label="Testing Division"
                      labelprope
                      name="division"
                      value={user.division}
                      onChange={handleInputs}
                      required
                    />
                    <span className="error-msg">{error.division}</span>
                  </Grid>
                </Grid>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ paddingTop: "15px" }}>
            <Button
              sx={{ background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },}}
              id="savebtnn"
              variant="contained"
              type="submit"
              onClick={post}
            // onClick={handleSubmit}
            >
              Save
            </Button>

            <Button
              onClick={handleClose}
              sx={{
               
                background: "#ff0854",
                "&:hover": {
                  background: "#ff0854", // Set the same color as the default background
                },
              }}
              id="closebtn"
              variant="contained"
            >
              close
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>

      <EditTesting
        open={editopen}
        setOpen={setEditOpen}
        division={user}
        fetchData={fetchData}
      />
      
        <div style={{width:"20%",marginLeft:"80%"}}>
         
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

            <TableContainer sx={{ maxHeight: 300 }}>
            <Table className="tabel">
                    <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }}><NumbersIcon style={{ fontSize: "16px" }} />Sr no</TableCell>
                    <TableCell align="center"><ContentPasteSearchIcon style={{ fontSize: "16px",marginRight:'2px' }} />Testing Division</TableCell>
                    <TableCell align="center"><AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item,index) => {
                      return (
                        <TableRow
                        className="tabelrow"
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={item.code}
                        >
                            <TableCell style={{ textAlign: "center" }}>{serialNumber + index}</TableCell> 
                           
                          <TableCell align="center" key={item.q}>
                            {item.division}
                          </TableCell>
                          <TableCell align="center">


                            <Button
                              variant="contained"
                              size="small"

                              onClick={() => onEdit(item)}
                              sx={{ padding: "8px", marginRight: "10px", background: "#00d284",
                              "&:hover": {
                                background: "#00d284", // Set the same color as the default background
                              }, }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"

                              onClick={() => handleDelete(item.id)}
                              sx={{ padding: "8px", marginRight: "10px", background: "#ff0854",
                              "&:hover": {
                                background: "#ff0854", // Set the same color as the default background
                              }, }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[20, 50,100]}
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
