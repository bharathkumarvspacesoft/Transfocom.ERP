import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import "./grn.css";
import Swal from "sweetalert2";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate, Link, NavLink } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@mui/material/CircularProgress";

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

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head ": {
      fontWeight:'bold',
      fontSize: "1em",
    },
  },
});

export default function GRN() {
  const [value, setValue] = useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();
  const navigate = useNavigate();
  const handleRoute = () => {
    navigate("/addgrn");
  };

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getmaterial_inward`); // Replace with your API endpoint
        const jsonData = await response.json();
        setRows(jsonData);
        setIsLoading(false);
        setSearch(jsonData);
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
          item.miref.toLowerCase().includes(e.target.value) ||
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
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  return (
    <>
      <div class="d-flex justify-content-between" style={{position:"relative",bottom:13}}>
        <div className="page_header">
          <h4>GRN</h4>
        </div>
        {/* <Button variant="contained" sx={{ backgroundColor: "#28a745"}}  onClick={handleRoute}>
          Add GRN Data
        </Button> */}
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
                  {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                  <CircularProgress color="warning" loading={isLoading} />
                </div>
              )}
              <div className={classes.root}>
              <Table className="tabel">
                    <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px" }} />Sr No</TableCell>

                      <TableCell className="MuiTableHead-root">
                      <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Material Inward Ref
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                      <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Purchase Order Ref
                      </TableCell>
                      <TableCell className="MuiTableHead-root">Date</TableCell>
                      <TableCell className="MuiTableHead-root">
                      <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} />Supplier
                      </TableCell>

                      <TableCell className="MuiTableHead-root">
                      <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action
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
                             <TableCell>{serialNumber + index}</TableCell> 
                            <TableCell key={item.d}>{item.miref}</TableCell>
                            <TableCell key={item.i}>{item.poref}</TableCell>
                            <TableCell key={item.s}>{item.date}</TableCell>
                            <TableCell style={{textAlign:"left"}} key={item.hy}>{item.name}</TableCell>
                            <TableCell>
                            <Link to={`/viewgrn/${item.id}`}>
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
                            {/* <NavLink to={`/viewgrn/${item.id}`}>
                              <IconButton
                                size="small"
                                title="View"
                                color="success"
                              >
                                <VisibilityIcon />
                              </IconButton></NavLink> */}
                             
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10]}
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
  );
}
