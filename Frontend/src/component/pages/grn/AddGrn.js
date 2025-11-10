import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import "./grn.css";
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
import { Link, NavLink } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import TablePagination from "@mui/material/TablePagination";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& 	.MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
  },
});

export default function AddGRN() {
  const [value, setValue] = useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getPorder`); // Replace with your API endpoint
      const jsonData = await response.json();
      setIsLoading(false);
      setRows(jsonData);
      setFilterdata(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch !== null && getSearch !== undefined) {
      const searchString = getSearch.toString().toLowerCase();
      if (searchString.length > 0) {
        const searchdata = rows.filter((item) => {
          const poref = item.poref && item.poref.toString().toLowerCase();
          const suppname =
            item.suppname && item.suppname.toString().toLowerCase();
          return (
            (poref && poref.includes(searchString)) ||
            (suppname && suppname.includes(searchString))
          );
        });
        setRows(searchdata);
      } else {
        setRows(filterdata);
      }
      setQuery(searchString);
    }
  };

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
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Add GRN</h4>
        </div>
        <Link to="/grn" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ backgroundColor: "#28a745" }}>
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={6} style={{ height: 509, marginTop: 0 }}>
        <div className={classes.root}>
          <div class="container text-center">
            <div class="row">
              <div class="col" id="datePicker">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Start Date"
                    inputFormat="DD/MM/YYYY"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div
                class="col"
                id="datePicker"
                style={{ position: "relative", right: 270 }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="End Date"
                    inputFormat="DD/MM/YYYY"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>

          <br />
          <div style={{ height: 400, width: "100%", marginTop: "-34px" }}>
            <TextField
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
              variant="standard"
              color="warning"
              sx={{
                marginLeft: "55rem",
                marginTop: "-20px",
                marginBottom: "4px",
                width: 356,
              }}
            />
            <br />
            <TableContainer>
              {isLoading && (
                <div id="spinner">
                  {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                  <CircularProgress color="warning" loading={isLoading} />
                </div>
              )}
              <div className={classes.root}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="MuiTableHead-root">Sr No</TableCell>

                      <TableCell className="MuiTableHead-root">
                        PO Ref
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        PO Date
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        Customer
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
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
                      .map((item) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.code}
                          >
                            <TableCell align="center" key={item.id}>
                              {item.id}
                            </TableCell>
                            <TableCell align="center" key={item.d}>
                              {item.poref}
                            </TableCell>
                            <TableCell align="center" key={item.i}>
                              {item.podate}
                            </TableCell>
                            <TableCell align="center" key={item.h}>
                              {item.suppname}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                title="View"
                                color="success"
                              >
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                title="Print"
                                color="info"
                              >
                                <PrintIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                title="Delete"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[3, 6]}
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
