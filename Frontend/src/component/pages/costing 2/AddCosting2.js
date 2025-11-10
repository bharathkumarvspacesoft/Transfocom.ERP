import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import "./costing2.css";
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
import { Button, IconButton } from "@mui/material";

import { useEffect, useState } from "react";
import { formatDate } from "utils";
import { APP_BASE_PATH } from "Host/endpoint";

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getcostingid`); // Replace with your API endpoint
        const jsonData = await response.json();
        setIsLoading(false);
        setSearch(jsonData);
        setRows(jsonData.slice().reverse());
        setPage(0);
      } catch (error) {
        console.error("Error fetching data:", error);
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
          item.custname.toLowerCase().includes(e.target.value) ||
          item.contactno.toLowerCase().includes(e.target.value)||
          item.contactperson.toLowerCase().includes(e.target.value)||
          item.capacity.toLowerCase().includes(e.target.value)
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

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Add Costing 2</h4>
        </div>
        <Link to="/costing2" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{backgroundColor: "#00d284"  ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} >
            Back
          </Button>
        </Link>
      </div>
      <Paper
        elevation={6}
        style={{ height: 500, position: "relative",padding:'14px'}}
      >
        <div className={classes.root}>
          <div style={{ height: 400, width: "100%" }}>
           
            <br></br>
            <TableContainer>
              {isLoading && (
                <div id="spinner">
                  {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                  <CircularProgress color="warning" loading={isLoading} />
                </div>
              )}
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
                            <TableCell key={item.i}>{item.id}</TableCell>
                            <TableCell key={item.f}>
                              {formatDate(item.edate)}
                            </TableCell>
                            <TableCell key={item.e}>{item.custname}</TableCell>
                            <TableCell key={item.c}>
                              {item.contactperson}
                            </TableCell>
                            <TableCell key={item.b}>{item.contactno}</TableCell>
                            <TableCell key={item.a}>{item.capacity}</TableCell>
                            <TableCell key={item.d}>
                              {item.priratio}/{item.secratio}V
                            </TableCell>

                            <TableCell>
                              <Link
                                to={`/AddToCosting?eid=${item.id}`}
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
              rowsPerPageOptions={[4, 8]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </Paper>
    </>
  );
}
