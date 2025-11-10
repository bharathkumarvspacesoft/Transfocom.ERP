import * as React from "react";
import Paper from "@material-ui/core/Paper";
import "./costing1.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import CallIcon from '@mui/icons-material/Call';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CopyrightIcon from '@mui/icons-material/Copyright';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NumbersIcon from '@mui/icons-material/Numbers';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Button } from "@mui/material";

import { useEffect, useState } from "react";
import { formatDate } from "utils";
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

export default function Costing1() {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getcostingid`); // Replace with your API endpoint
      const jsonData = await response.json();
    
      console.log(jsonData)
      
      setSearch(jsonData);
      setRows(jsonData.slice().reverse()); 
      setPage(0); 
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
        (item) =>
          item.custname.toLowerCase().includes(e.target.value) ||
          item.contactno.toLowerCase().includes(e.target.value)||
          item.capacity.toLowerCase().includes(e.target.value)||
          item.contactperson.toLowerCase().includes(e.target.value)||
          item.edate.toLowerCase().includes(e.target.value)
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
          <h4>Add Costing 1</h4>
        </div>
        <Link to="/costing1" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{backgroundColor: "#00d284", marginRight: "12px"  ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} >
            Back
          </Button>
        </Link>
      </div>
      
        <div className={classes.root}>
          <div style={{ height: 400, width: "100%" }}>
           
            <br></br>
            <TableContainer>
              
              <div className={classes.root}>
              <Table className="tabel">
                    <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root"> <NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>

                      <TableCell className="MuiTableHead-root"> <CalendarMonthIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Enquiry Date
                      </TableCell>
                      <TableCell className="MuiTableHead-root">  <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Customer Name
                      </TableCell>
                      <TableCell className="MuiTableHead-root"> <PermContactCalendarIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Contact Person Name
                      </TableCell>
                      <TableCell className="MuiTableHead-root">  <CallIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Contact No
                      </TableCell>
                      <TableCell className="MuiTableHead-root"> <BatteryCharging20Icon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Capacity
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                      <ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Voltage Ratio
                      </TableCell>

                      <TableCell className="MuiTableHead-root"> <CopyrightIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Costing
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item) => {
                        return (
                          <TableRow
                          className="tabelrow"
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.code}
                          >
                            <TableCell align="center" key={item.i}>{item.id}</TableCell>
                            <TableCell align="center" key={item.f}>
                              {item.edate}
                            </TableCell>
                            <TableCell align="center" key={item.e}>{item.custname}</TableCell>
                            <TableCell align="center" key={item.c}>
                              {item.contactperson}
                            </TableCell>
                            <TableCell align="center" key={item.b}>{item.contactno}</TableCell>
                            <TableCell align="center" key={item.a}>{item.capacity}</TableCell>
                            <TableCell align="center" key={item.d}>
                              {item.priratio}/{item.secratio}V
                            </TableCell>

                            <TableCell align="center">
                              <Link
                                to={`/Addcosting?eid=${item.id}`}
                                style={{ textDecoration: "none" }}
                                state={item}
                              >
                                <Button
                                  style={{ whiteSpace: "nowrap" }}
                                  variant="contained"
                                  sx={{backgroundColor: "#00d284", marginBottom: "10px"  ,"&:hover": {
                                    background: "#00d284", // Set the same color as the default background
                                  },}} 
                                >
                                  Add Costing
                                </Button>
                              </Link>
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
    
      </>
      )}
    </>
  );
}
