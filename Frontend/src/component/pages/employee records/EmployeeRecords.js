import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./employee.css";
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
import Slide from "@mui/material/Slide";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/material";
import Swal from "sweetalert2";
import { useState } from "react";
import { useEffect } from "react";
import { APP_BASE_PATH } from "Host/endpoint";
import MailIcon from '@mui/icons-material/Mail';
import CallIcon from '@mui/icons-material/Call';
import PersonIcon from '@mui/icons-material/Person';
import NumbersIcon from '@mui/icons-material/Numbers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


const useStyles = makeStyles({
  root: {
    "& .MuiDataGrid-columnHeader": {
      fontWeight:'bold',
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

export default function EmployeeRecords() {
  const columns = [
    {
      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: "Sr No",headerClassName: 'custom-header-class',
      flex:1,
      renderHeader: () => <>  <NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} /> SR No</>
    },
    {
      field: "name",
      headerName: "Employee Name",
      headerAlign: "center",
      align: "center",headerClassName: 'custom-header-class',
      flex:1,
      renderHeader: () => <>  <PersonIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Employee Name</>
    },
    {
      field: "email",
      headerName: "	Email",
      align: "center",headerClassName: 'custom-header-class',
      headerAlign: "center",
      flex:1,
      renderHeader: () => <>  <MailIcon style={{ fontSize: "16px",marginRight:'2px' }}/> Email</>
    },
    {
      field: "contactno",
      headerName: "	Contact No",
      align: "center",headerClassName: 'custom-header-class',
      headerAlign: "center",
      flex:1,
      renderHeader: () => <>  <CallIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Contact No</>
    },
  
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",headerClassName: 'custom-header-class',
      flex:1,
      renderHeader: () => <>  <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Action</>,
      renderCell: (params) => {
        return (
          <>
            
                                    <Button
                                    onClick={() => handleEditClick(params)}
                                      variant="contained"
                                      sx={{
                                        padding: "5px",
                                        background: "#00d284",
                                        "&:hover": {
                                          background: "#00d284", 
                                        },
                                      }}
                                    >
                                      Edit
                                    </Button>
            &nbsp;&nbsp;
            <Button
                                    size="small"
                                    onClick={() => handleDelete(params.row.id)}
                                    title="Delete"
                                    variant="contained"
                                    sx={{
                                    
                                      background: "#ff0854",
                                      "&:hover": {
                                        background: "#ff0854", // Set the same color as the default background
                                      },
                                    }}
                                  >
                                    Delete
                                  </Button>
          </>
        );
      },
    },
  ];
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [values, setValues] = useState({});
  const [rows, setRows] = useState([]);
  const [isEdit,setIsedit]= useState(false)

  
  const fetchData = async () => {
    try {
      const response = await fetch(`${APP_BASE_PATH}/getemployee`); // Replace with your API endpoint
      const jsonData = await response.json();
  
      // Sort the data based on the "id" field in ascending order
      const sortedData = jsonData.sort((a, b) => a.id - b.id);
  
      // Reverse the sorted data to have the latest entries at the top
      const reversedData = sortedData.reverse();
  
      // Add a new property "srNo" starting with 1 and incrementing by 1
      const dataWithSrNo = reversedData.map((entry, index) => ({
        ...entry,
        srNo: index + 1,
      }));
  
      setRows(dataWithSrNo);
      setSearch(dataWithSrNo);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  
  
    useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async (id) => {
    
    const res = await fetch(`${APP_BASE_PATH}/deletemp/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
   
    const deletedata = await res.text();
    if (res.status === 404 || !deletedata) {
      console.log("error");
    } else {
      Swal.fire({
        title: "Item Deleted Successfully!!!!",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });
      fetchData();
    }
  };

  const [filter, setFilter] = useState("");
  const[editdata,setEditdata]=useState(null)
  const [search, setSearch] = useState([]);
  const handleEditClick = (params) => {
    setIsedit(true)
    setEditdata(params.row.id)
    
    setValues({
      emp_id:params.row.emp_id,
      name:params.row.name,
      email:params.row.email,
      contactno:params.row.contactno
    })
    handleClickOpen()
    // You can add your edit logic here, such as opening a dialog for editing
  };
  const handleFilter = (e) => {
    const inputValue = e.target.value.toLowerCase(); 
    if (inputValue === "") {
      setRows(search);
    } else {
      const filterResult = search.filter((item) => {
        const emp_id = item.emp_id?.toLowerCase();
        const name = item.name?.toLowerCase();
        const email = item.email?.toLowerCase();
        const contactno = item.contactno?.toLowerCase();
        return emp_id?.includes(inputValue) || name?.includes(inputValue)||email?.includes(inputValue)||contactno?.includes(inputValue);
      });
  
      if (filterResult.length > 0) {
        setRows(filterResult);
      } else {
       
        console.log("No Data Found");
      }
    }
    setFilter(inputValue); 
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const resetState = () => {
    setValues({
      emp_id: '',
      name: '',
      email: '',
      contactno: '',
    });
  };
  const handleClose = () => {
    setIsedit(false)
    setOpen(false);
   
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async () => {
  let apiEndpoint = `${APP_BASE_PATH}/addemployee`;
  let successMessage = "Data Added Successfully";

  if (isEdit) {
    apiEndpoint = `${APP_BASE_PATH}/updateemployee/${editdata}`;
    successMessage = "Data Updated Successfully";
  }

  const res = await fetch(apiEndpoint, {
    method: isEdit ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  try {
    const data = await res.text(); // Use text() instead of json()
    console.log('Response from server:', data);

    if (res.status === 400 || !data) {
      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else {
      Swal.fire({
        title: successMessage,
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });
      resetState()
      fetchData()
      handleClose();
    }
  } catch (error) {
    console.error('Error handling non-JSON response:', error);
    // Handle the error or troubleshoot the server response
  }
};


  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Employee Records</h4>
        </div>
        <Button variant="contained" sx={{ background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      },}}  onClick={handleClickOpen}>
          New Employee
        </Button>
      </div>
      <form>
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
                        id="emp_id"
                        label="Emp ID"
                        labelprope
                        name="emp_id"
                        value={values.emp_id}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        style={{ width: 500 }}
                        id="name"
                        label="Employee Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={3}>
                    <Grid item xs={7}>
                      <TextField
                        style={{ width: 500 }}
                        fullWidth
                        id="email"
                        label="Email ID"
                        labelprope
                        name="email"
                        autoComplete="Date"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        style={{ width: 500 }}
                        id="contactno"
                        label="Contact No"
                        name="contactno"
                        autoComplete="Date"
                        value={values.contactno}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button
  sx={{
    background: "#00d284",
    "&:hover": {
      background: "#00d284",
    },
  }}
  variant="contained"
  type="submit"
  onClick={handleSubmit}
>
  {isEdit ? "Edit" : "Save"}
</Button>

             
              <Button sx={{
                                    
                                    background: "#ff0854",
                                    "&:hover": {
                                      background: "#ff0854", // Set the same color as the default background
                                    },
                                  }}variant="contained" onClick={handleClose}>
                close
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </div>

        
          <div className={classes.root}>
            <div style={{ height: 400, width: "100%" }}>
              {/* <TextField
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
                variant="standard"
                color="warning"
                sx={{
                  marginLeft: "55rem",
                  marginTop: "7px",
                  marginBottom: "4px",
                  width: 356,
                }}
              /> */}
              <br />
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
          </div>
       
      </form>
    </>
  );
}
