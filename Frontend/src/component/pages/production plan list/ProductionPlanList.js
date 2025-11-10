import { useState, useEffect } from "react";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./productionlist.css";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
import NumbersIcon from "@mui/icons-material/Numbers";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PersonIcon from "@mui/icons-material/Person";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { formatDate } from "utils";
import { APP_BASE_PATH } from "Host/endpoint";
import Button from "@mui/material/Button";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
  },
});

export default function ProductionPlanList() {
  const [value, setValue] = useState(dayjs());
  const [serialNumber, setSerialNumber] = useState(1);
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getproduction`); // Replace with your API endpoint
        const jsonData = await response.json();
        setRows(jsonData);
        setFilterdata(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      const searchdata = rows.filter(
        (item) =>
          item.capacity.toLowerCase().includes(getSearch) ||
          item.custname.toLowerCase().includes(getSearch) ||
          item.wo_no.toLowerCase().includes(getSearch)
      );
      setRows(searchdata);
    } else {
      setRows(filterdata);
    }
    setQuery(getSearch);
  };

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.floor((page * rowsPerPage) / newRowsPerPage); // Calculate the new page number
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
              <h4>Production Plan List</h4>
            </div>
          </div>

          {rows.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "red",
                fontSize: "1.4em",
                fontFamily: "roboto",
              }}
            >
              <p>No records found.</p>
            </div>
          ) : (
            <div className={classes.root}>
              <div style={{ height: 400, width: "100%" }}>
                <TextField
                  className="Search"
                  label="Search..."
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
                    width: 220,
                    marginBottom: "8px",
                  }}
                />
                <br />
                <TableContainer>
                  <div className={classes.root}>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell className="MuiTableHead-root">
                            <NumbersIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Sr No
                          </TableCell>

                          <TableCell className="MuiTableHead-root">
                            <TextSnippetIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Ref No
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <PersonIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Costing Id
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <PersonIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Costing Name
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <PersonIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Customer Name
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <BatteryCharging20Icon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Capacity
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <TextFieldsIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Type
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <ContentPasteSearchIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Testing Div
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <CalendarMonthIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Date
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <ElectricMeterIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Voltage Ratio
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <ProductionQuantityLimitsIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
                            Qty
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <AutoAwesomeIcon
                              style={{ fontSize: "16px", marginRight: "2px" }}
                            />
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
                                <TableCell style={{ textAlign: 'left' }} key={item.i}>{item.wo_no}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.i}>{item.cid}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.i}><div className="customer-name" style={{
                                  maxWidth: '180px',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  whiteSpace: 'normal',
                                  lineHeight: '1.4',
                                  textAlign: 'left',
                                }}>
                                  {item.selectedCosting}
                                </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.d}>
                                  <div className="customer-name" style={{
                                    maxWidth: '300px',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    lineHeight: '1.4',
                                     textAlign: 'left',
                                  }}>
                                    {item.custname}
                                  </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.e}>
                                  {item.capacity}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.f}>
                                  {item.type === 1
                                    ? "OUTDOOR"
                                    : item.type === 2
                                      ? "INDOOR"
                                      : "OUTDOOR/INDOOR"}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.g}>
                                  {item.testing_div}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.h}>
                                  {formatDate(item.orderacc_date)}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.j}>
                                  {item.voltageratio}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.k}>{item.qty}</TableCell>

                                <TableCell>
                                  <Link to={`/productionView?id=${item.id}`}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        padding: "8px",
                                        background: "#00cff4",
                                        "&:hover": {
                                          background: "#00cff4", // Set the same color as the default background
                                        },
                                      }}
                                    >
                                      View
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
                  rowsPerPageOptions={[10, 20]}
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
