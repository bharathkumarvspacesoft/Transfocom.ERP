import { useState, useEffect } from "react";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import { useNavigate, Link, NavLink } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import TablePagination from "@mui/material/TablePagination";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./quality.css";
import { makeStyles } from "@material-ui/core/styles";
import NumbersIcon from '@mui/icons-material/Numbers';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight:'bold',
      fontSize: "1em",
    },
  },
});

export default function QualityPlan() {
  const [value, setValue] = useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/addqualityControl");
  };

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getquality_inward`); // Replace with your API endpoint
        const jsonData = await response.json();

        
        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
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
        Swal.fire({
          title: "No Data Found",

          timer: 1000,
        });
      }
    }
    setFilter(e.target.value);
  };
  const [serialNumber, setSerialNumber] = useState(1);
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
  

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/deletequantityInward/${id}`, {
        method: "DELETE",
      });
  
      // Log the response to check if it's successful
      console.log("Delete API Response:", response);
  
      if (response.ok) {
        // Update the UI state by removing the item with the specified id
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  
        Swal.fire({
          title: "Item Deleted Successfully!!!!",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
      } else {
        // Handle the case when the delete request is not successful
        console.error("Delete API Request failed.");
        // You can show an error message to the user here if needed.
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error !!!!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    }finally
    {
      setIsLoading(false);
    }
  };
   
  // const handleDelete = async (id) => {
  //   try {
  //     const response = await fetch(`${APP_BASE_PATH}/deletequantityInward/${id}`, {
  //       method: "DELETE",
  //     });
  
  //     // Log the response to check if it's successful
  //     console.log("Delete API Response:", response);
  
  //     if (response.ok) {
  //       // Update the UI state by removing the item with the specified id
  //       setRows((prevRows) => prevRows.filter((item) => item.qualitycontrolinward_id != id));
  
  //       Swal.fire({
  //         title: "Item Deleted Successfully!!!!",
  //         icon: "success",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "green",
  //       });
  //     } else {
  //       // Handle the case when the delete request is not successful
  //       console.error("Delete API Request failed.");
  //       // You can show an error message to the user here if needed.
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     Swal.fire({
  //       title: "Error !!!!",
  //       icon: "error",
  //       iconHtml: "",
  //       confirmButtonText: "OK",
  //       animation: "true",
  //       confirmButtonColor: "red",
  //     });
  //   }
  // };
  
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
          <h4>Quality Control</h4>
        </div>
        <Button variant="contained" sx={{ backgroundColor: "#00d284",marginRight:'14px' ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}}  onClick={handleRoute}>
          Add New
        </Button>
      </div>

           {rows.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color:'red',
              fontSize:'1.4em',
              fontFamily:'roboto'
            }}
          >
            <p>No records found.</p>
          </div>
        ) : (
        <div className={classes.root}>
       
          <div style={{ height: 400, width: "100%" }}>
           
            <br />
            <TableContainer>
            
              <div className={classes.root}>
              <Table className="tabel">
                    <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root" align="center"><NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>

                      <TableCell className="MuiTableHead-root" align="center">
                      <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />Material Inward Ref
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                      <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />PO Ref NO
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                      <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} />Supplier
                      </TableCell>
                    
                      <TableCell className="MuiTableHead-root" align="center">
                      <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                  {rows
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((item, index) => {
    console.log("Item object:", item);
    return (
      <TableRow
      className="tabelrow"
        hover
        role="checkbox"
        tabIndex={-1}
        key={`${item.qualitycontrolinward_id}-${index}`}
      >
        <TableCell style={{textAlign:'center'}}>{serialNumber + index}</TableCell>
        <TableCell style={{textAlign:'center'}}>{item.qcref}</TableCell>
        <TableCell style={{textAlign:'center'}}>{item.poref}</TableCell>
        <TableCell style={{textAlign:'left'}}>{item.supplier_name}</TableCell>
        <TableCell style={{textAlign:'center'}}>
        <Link to={`/viewqualitycontrol/${item.poid}/${item.miid}`}>
                    <Button
                      size="small"
                      variant="contained"
                 
                      sx={{ padding: "8px", background: "#00cff4",
                      "&:hover": {
                        background: "#00cff4", // Set the same color as the default background
                      }, }}
                    >
                      View
                    </Button>
                  </Link>
                  {/* <Button
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
                                </Button> */}
        
        </TableCell>
      </TableRow>
    );
  })}

                  </TableBody>
                </Table>
              </div>
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
        </div>
        )}
      
      </>
      )}
    </>
  );
}
