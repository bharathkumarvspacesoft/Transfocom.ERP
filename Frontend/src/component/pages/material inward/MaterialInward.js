import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import "./materialinward.css";
import { NavLink, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import Swal from "sweetalert2";
import NumbersIcon from '@mui/icons-material/Numbers';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { formatDate } from "utils";

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

export default function MaterialInward() {
  const [value, setValue] = useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();

  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/addmaterialinward");
  };

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [serialNumber, setSerialNumber] = useState(1);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getmaterial_inward`); // Replace with your API endpoint
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
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setRows(search);
    } else {
      const filterResult = search.filter(
        (row) =>
          row.suppname.toLowerCase().includes(e.target.value) ||
          row.contactno.toLowerCase().includes(e.target.value)
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
  const handleDelete = async (id, poid) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APP_BASE_PATH}/deleteMaterialInward/${id}?poid=${poid}`,
        {
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
          {/* <h4>Material Inward</h4> */}
          <h4>GRN</h4>
        </div>
        {/* <Button variant="contained" sx={{ backgroundColor: "#00d284",marginRight:'14px' ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}}  onClick={handleRoute}>
          Add Material Inward
        </Button> */}
        <Button variant="contained" sx={{ backgroundColor: "#00d284",marginRight:'14px' ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}}  onClick={handleRoute}>
          Add GRN
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
        

          <br />
          <div style={{ height: 400, width: "100%" }}>
           
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
                      <TableCell className="MuiTableHead-root" align="center"><NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>

                      <TableCell className="MuiTableHead-root" align="center">
                      <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />Material Inward Ref
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                      <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />Purchase Order Ref
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center"><CalendarMonthIcon style={{ fontSize: "16px",marginRight:'2px' }} />Date</TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                      <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Supplier
                      </TableCell>
                       
                      <TableCell className="MuiTableHead-root" align="center">
                      <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />
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
                      .map((item,index) => {
                        return (
                          <TableRow
                          className="tabelrow"
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.code}
                          >
                            <TableCell style={{textAlign:'center'}}>{serialNumber + index}</TableCell> 
                            <TableCell style={{textAlign:'center'}} key={item.i}>{item.miref}</TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.d}>{item.poref}</TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.s}>{item.date}</TableCell>
                            <TableCell style={{textAlign:'left'}} key={item.g}>{item.name}</TableCell>
                            <TableCell style={{textAlign:'center'}}>
                            <Link to={`/viewMaterial/${item.poid}/${item.id}`}>
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
                  <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleDelete(item.id,item.poid)}
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
                            
                              {/* <IconButton
                                size="small"
                                title="Delete"
                                onClick={() => handleDelete(item.id,item.poid)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton> */}
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
