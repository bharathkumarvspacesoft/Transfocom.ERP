import { useState, useEffect, useCallback } from "react";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Box, Button, IconButton } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import "./challan.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import NumbersIcon from '@mui/icons-material/Numbers';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { formatDate } from "utils";

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
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      align: "center",
      fontWeight: "bold",
    },
  },
});

export default function Challan() {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleRoute = () => {
    navigate("/NewChallan");
  };
  const [serialNumber, setSerialNumber] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getchallanlist`); // Replace with your API endpoint
      const jsonData = await response.json();
      console.log(jsonData)
      console.log("Fetched Data:", jsonData); // Log the complete data
      setFilteredData(jsonData);
      // setRows(jsonData);
      setRows(Array.isArray(jsonData) ? jsonData : []);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [filteredData, setFilteredData] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(
    (event) => {
      const { value: searchValue } = event.target;
      setQuery(searchValue);

      if (searchValue.length > 0) {
        const searchData = rows.filter(
          (item) =>
            item.challan_no.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.custname.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.po_no.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredData(searchData);
      } else {
        setFilteredData(filteredData);
      }
    },
    [filteredData, rows]
  );

  const handleDelete = (id) => {
    fetch(`${APP_BASE_PATH}/deleteChallan/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Challan cannot be deleted as it exists in the invoice table") {
          Swal.fire({
            title: "Deletion Not Allowed",
            text: "This challan cannot be deleted because it exists in the invoice.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "orange",
          });
        } else {
          Swal.fire({
            title: "Item Deleted Successfully!",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "green",
          });
          fetchData(); // Refresh data after successful deletion
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      });
  };

  // const formatDate = (date) => {
  //   return dayjs(date).format("DD-MMM-YYYY");
  // };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            className="d-flex justify-content-between"
            style={{ position: "relative", bottom: 13 }}
          >
            <div className="page_header">
              <h4>Challan</h4>
            </div>
            <Button variant="contained" sx={{
              background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }} onClick={handleRoute}>
              New Challan
            </Button>
          </div>

          <br />

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
              <div style={{ height: 400, width: "100%" }}>

                <br />
                <TableContainer>


                  <div className={classes.root}>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell align="center">
                            <NumbersIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Sr  <br />
                            No
                          </TableCell>
                          <TableCell align="center">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Challan  <br />
                            No
                          </TableCell>

                          <TableCell align="center">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            OA  <br />
                            No
                          </TableCell>

                          <TableCell align="center">
                            <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Prod  <br />
                            Plan  <br />
                            No
                          </TableCell>
                          <TableCell align="center">
                            <CalendarMonthIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Challan  <br />
                            Date
                          </TableCell>
                          <TableCell align="center">
                            <CalendarMonthIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Challan  <br />
                            Qty
                          </TableCell>
                          <TableCell align="center">
                            <CalendarMonthIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Rem <br />
                            Challan  <br />
                            Qty
                          </TableCell>
                          <TableCell align="center">
                            <CalendarMonthIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Invoice  <br />
                            Qty
                          </TableCell>
                          <TableCell align="center">
                            <PersonIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Buyer  <br />
                            Name
                          </TableCell>
                          <TableCell align="center">
                            <PersonIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Consumer <br />
                            Name
                          </TableCell>
                          <TableCell align="center">
                            <ConfirmationNumberIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            PO  <br />
                            NO
                          </TableCell>
                          <TableCell align="center">
                            <CalendarMonthIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            PO  <br />
                            DATE
                          </TableCell>
                          <TableCell align="center">
                            <AutoAwesomeIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => {
                          return (
                            <TableRow
                              className="tabelrow"
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={item.id} // Use item.id instead of item.code
                            >
                              <TableCell style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>{item.challan_no}</TableCell>

                              <TableCell style={{ textAlign: 'center' }}>{item.ref_no}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>{item.wo_no}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>{item.chdate}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>{item.challan_qty}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>{item.remainingqty}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>{item.invoice_qty}</TableCell>
                              <TableCell sx={{ textAlign: 'left', padding: '8px' }}>
                                <Box
                                  sx={{
                                    display: 'block',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'anywhere',
                                    maxWidth: '200px', // ✅ required for wrapping — adjust as needed
                                    textAlign: 'left',
                                  }}
                                >
                                  {item.custname}
                                </Box>
                              </TableCell>

                              <TableCell sx={{ textAlign: 'left', padding: '8px' }}>
                                <Box
                                  sx={{
                                    display: 'block',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'anywhere',
                                    maxWidth: '200px', // adjust
                                    textAlign: 'left',
                                  }}
                                >
                                  {item.consumer}
                                </Box>
                              </TableCell>

                              <TableCell style={{ textAlign: 'center' }}>{item.po_no ? item.po_no : "-"}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                {item.po_date ? formatDate(item.po_date) : "-"}
                              </TableCell>                              <TableCell style={{ textAlign: 'center' }}>
                                {/* <div className="action-buttons"> */}
                                <Link to={`/EditChallan/${item.id}`}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      padding: "8px",
                                      background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      },
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
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
                                </Button>
                                <Button
                                  component={Link}
                                  to={`/printchallan/${item.id}`}
                                  variant="contained"
                                  sx={{
                                    marginLeft: "5px",
                                    padding: "8px",
                                    background: "#00cff4",
                                    "&:hover": {
                                      background: "#00cff4", // Set the same color as the default background
                                    },
                                  }}
                                >
                                  View and print
                                </Button>
                                {/* </div> */}
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
