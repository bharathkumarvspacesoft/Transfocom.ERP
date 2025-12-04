
import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import TablePagination from "@mui/material/TablePagination";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NumbersIcon from '@mui/icons-material/Numbers';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { formatDate } from "utils";
import Swal from "sweetalert2";
import { Link, useParams } from "react-router-dom";
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

export default function PoEnquiry() {
  const [value, setValue] = useState(dayjs());
  const [serialNumber, setSerialNumber] = useState(1);
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/AddPurchaseOrder");
  };
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getPorder`); // Replace with your API endpoint
      const jsonData = await response.json();
      setFilterdata(jsonData);
     
      setRows(jsonData.slice().reverse()); // Reverse the data array before setting the rows
      setPage(0); // Set the page to the first page of the table (newest entries on top)
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setIsLoading(false);
    }
  };
    
  useEffect(() => {
    fetchData();
  }, []);
  
  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value.toLowerCase();
    if (getSearch.length > 0) {
      const searchdata = rows.filter((item) =>
        (item.poref?.toLowerCase().includes(getSearch)) ||
        (item.suppname?.toLowerCase().includes(getSearch))|| (item.podate?.toLowerCase().includes(getSearch))
      );
      setRows(searchdata);
    } else {
      setRows(filterdata);
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
    const newPage = Math.floor(page * rowsPerPage / newRowsPerPage); // Calculate the new page number
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); // Update the current page to the new page number
  };

  const handleDelete = (id) => {
    fetch(`${APP_BASE_PATH}/deletePorder/${id}`, {
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
  const [data1, setData1] = useState([]);
  const [date1, setDate1] = useState("");
  const [supplier, setSupplier] = useState("");
  const { id } = useParams();
  const [poref, setPoref] = useState("");
  const convertDateFormat = (dateString) => {
    const [month, day, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const getSerialNumber1 = (index) => {
    return index + 1;
  };

  const calculateTotalQuantity = (jsonData) => {
    const totalQuantity = jsonData.reduce((acc, item) => acc + item.qty, 0);
    return totalQuantity;
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
          <h4>PO Enquiry</h4>
        </div>
       
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
         

          <br />
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
                 width:220,
                  marginBottom: "8px",
              }}
              
            />
            <br />
            <TableContainer>
              
              <div className={classes.root}>
              <Table className="tabel">
                    <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root" align="center"><NumbersIcon style={{ fontSize: "14px",marginRight:'2px' }} />Sr No</TableCell>

                      <TableCell className="MuiTableHead-root" align="center">
                      <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />P O Ref
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                      <CalendarMonthIcon style={{ fontSize: "16px",marginRight:'2px' }} /> P O Date
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                      <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Customer
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                      <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                  {rows
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
                           <TableCell style={{textAlign:'center'}} >{serialNumber + index}</TableCell> 
                            <TableCell style={{textAlign:'center'}} key={item.y}>{item.poref}</TableCell>
                            <TableCell style={{textAlign:'center'}}  key={item.i}>{item.podate}</TableCell>
                            <TableCell style={{textAlign:'left'}} key={item.d}>{item.suppname}</TableCell>
                            <TableCell style={{textAlign:'center'}}>
                            
                              <Button
                                size="small"
                                variant="contained"
                                sx={{ marginLeft: "5px", padding: "8px",  background: "#00cff4",
                                "&:hover": {
                                  background: "#00cff4", // Set the same color as the default background
                                }, 
                              }} 
                              >
                                View and print
                              </Button>
                            
                            
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleDelete(item.id)}
                                sx={{
                                  marginLeft: "5px",
                                  padding: "8px",
                                  background: "#00d284",
                                  "&:hover": {
                                    background: "#00d284", // Set the same color as the default background
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
