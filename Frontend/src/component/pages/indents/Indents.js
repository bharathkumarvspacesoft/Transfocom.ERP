import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { IconButton } from "@mui/material";
import Swal from "sweetalert2";
import "./indents.css";
import TablePagination from "@mui/material/TablePagination";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@mui/material/Button";
import { formatDate } from "utils";
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

export default function Suppliers() {
  const [value, setValue] = useState(dayjs());
  const classes = useStyles();
  const navigate = useNavigate()
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState(1);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getindent`); // Replace with your API endpoint
      const jsonData = await response.json();
      setFilterdata(jsonData);

      setRows(jsonData.slice().reverse()); // Reverse the data array before setting the rows
      setPage(0); // Set the page to the first page of the table (newest entries on top)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      const searchdata = rows.filter((item) =>
        (item.indentref?.toLowerCase().includes(getSearch))

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
  const handleViewIndent = (id) => {
    // Navigate to the '/ViewIndents' page with the clicked indent ID as a URL parameter
    navigate(`/viewIndents/${id}`);
  };
  const reversedData = data.slice().reverse();
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
              <h4>Indents</h4>
            </div>
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


              <br />
              <div >
                <TextField
                  className="Search"
                  style={{ width: "15%", marginBottom: '10px', marginRight: '90%' }}
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

                />
                <br />
                <TableContainer>

                  <div className={classes.root}>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell className="MuiTableHead-root" align="center">
                            <NumbersIcon style={{ fontSize: "14px" }} />Sr No</TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <TextSnippetIcon style={{ fontSize: "14px", marginRight: '2px' }} /> Costing ID
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <TextSnippetIcon style={{ fontSize: "14px", marginRight: '2px' }} /> Costing Name
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <TextSnippetIcon style={{ fontSize: "14px", marginRight: '2px' }} /> Indent Ref
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <CalendarMonthIcon style={{ fontSize: "14px", marginRight: '2px' }} />Date</TableCell>

                          <TableCell className="MuiTableHead-root" align="center">
                            <AutoAwesomeIcon style={{ fontSize: "14px", marginRight: '2px' }} /> Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((item, index) => {
                            return (
                              <TableRow
                                className="tabelrow"
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={item.code}
                              >
                                <TableCell style={{ textAlign: 'center' }}>{serialNumber + index}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.i}>{item.cid}</TableCell>
                                <TableCell style={{ textAlign: 'left' }} key={item.c}>
                                  {item.selectedcosting?.split(',').map((part, index) => (
                                    <>
                                      {part}
                                      {index < item.selectedcosting.split(',').length - 1 && ','}
                                      {index === 2 && <br />}
                                    </>
                                  ))}
                                </TableCell>                                <TableCell style={{ textAlign: 'center' }} key={item.i}>{item.indentref}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.d}>{item.date}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                  <Link to={`/viewIndent/${item.id}`}>
                                    <Button
                                      size="small"
                                      variant="contained"

                                      sx={{
                                        padding: "8px", background: "#00cff4",
                                        "&:hover": {
                                          background: "#00cff4", // Set the same color as the default background
                                        },
                                      }}
                                    >
                                      View
                                    </Button>
                                  </Link>
                                  <Link to={`/editIndents/${item.id}`}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        marginLeft: "5px",
                                        padding: "8px",
                                        background: "#00d284",
                                        "&:hover": {
                                          background: "#00d284", // Set the same color as the default background
                                        },
                                      }}>

                                      Edit
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
          )}

        </>
      )}
    </>
  );
}
