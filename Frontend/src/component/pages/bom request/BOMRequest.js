
import { useState, useEffect } from "react";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./bomreq.css";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";

import NumbersIcon from '@mui/icons-material/Numbers';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PersonIcon from '@mui/icons-material/Person';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import LoadingSpinner from '../../commen/LoadingSpinner';

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

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: 'bold',
      fontSize: "1em",
    },
  },
});

const bomType = {
  1: "bom1",
  2: "bom2",
};

export default function BomRequest() {
  const [value, setValue] = useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const [serialNumber, setSerialNumber] = useState(1);
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/addBomRequest");
  };

  const classes = useStyles();

  const [data, setData] = useState([]);

  // const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getbomrequest`); // Replace with your API endpoint
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
          item.bomref.toLowerCase().includes(getSearch) ||
          item.wo_no.toLowerCase().includes(getSearch) ||
          item.testing_div.toLowerCase().includes(getSearch) ||
          item.qty.toLowerCase().includes(getSearch) ||
          (typeof item.priratio === 'string' && typeof item.secratio === 'string' && `${item.priratio}/${item.secratio}V`.toLowerCase().includes(getSearch))
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
    setRowsPerPage(+event.target.value);
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
              <h4>Bom Request</h4>
            </div>
            <Button variant="contained" sx={{
              backgroundColor: "#00d284", marginRight: '14px', "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }} onClick={handleRoute}>
              New BOM Request
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


              <div style={{ height: 400 }}>


                <TableContainer>

                  <div className={classes.root}>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell className="MuiTableHead-root" align="center"><NumbersIcon style={{ fontSize: "16px", marginRight: '2px' }} />Sr No</TableCell>

                          <TableCell
                            className="MuiTableHead-root" align="center"

                          >
                            <TextSnippetIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            BOM <br /> &nbsp;&nbsp;Ref NO
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root" align="center"

                          >
                            <TextSnippetIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            PROD <br /> &nbsp; Ref No
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root" align="center"

                          >
                            <PersonIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Customer<br /> &nbsp; Name
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <BatteryCharging20Icon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Capacity
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <BatteryCharging20Icon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Costing ID
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <BatteryCharging20Icon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Costing Name
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center"><TextFieldsIcon style={{ fontSize: "14px", marginRight: '2px' }} />Type</TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <ContentPasteSearchIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Testing <br /> &nbsp; Div
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root" align="center"

                          >
                            <CalendarMonthIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Date
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <ElectricMeterIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Voltage <br /> &nbsp;Ratio
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <ProductionQuantityLimitsIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Qty
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <AutoAwesomeIcon style={{ fontSize: "14px", marginRight: '2px' }} />
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
                                <TableCell style={{ textAlign: "center" }}>{serialNumber + index}</TableCell>

                                <TableCell key={item.i} style={{ width: "1%", textAlign: "center" }}>{item.bomref}</TableCell>
                                <TableCell key={item.d} style={{ width: "1%", textAlign: "center" }}>{item.wo_no}</TableCell>
                                <TableCell key={item.q} style={{ width: "1%", textAlign: "left" }}> {item.custname}</TableCell>
                                <TableCell key={item.r} style={{ width: "1%", textAlign: "center" }}>{item.capacity}</TableCell>
                                <TableCell key={item.r} style={{ width: "1%", textAlign: "center" }}>{item.cid}</TableCell>
                                <TableCell key={item.r} style={{ width: "1%", textAlign: "center" }}> <div className="customer-name" style={{
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
                                <TableCell key={item.s} style={{ width: "1%" }}>{item.type == 1 ? "OUTDOOR" : item.type == 2 ? "INDOOR" : item.type == 3 ? "OUTDOOR-INDOOR" : ""}</TableCell>
                                <TableCell key={item.t} style={{ width: "1%", textAlign: "center" }}>
                                  {item.testing_div}
                                </TableCell>
                                <TableCell key={item.u} style={{ width: "1%", textAlign: "center" }}>
                                  {formatDate(item.orderacc_date)}
                                </TableCell>
                                <TableCell key={item.v} style={{ width: "1%", textAlign: "center" }}>
                                  {item.priratio}/{item.secratio}V
                                </TableCell>
                                <TableCell key={item.w} style={{ width: "1%", textAlign: "center" }}>{item.qty}</TableCell>






                                <TableCell style={{ textAlign: 'center' }} className="wh-spc" sx={{ marginBottom: 0 }}>
                                  {parseInt(item.bomtype) === 1 ? (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      sx={{
                                        backgroundColor: "#00d284", "&:hover": {
                                          background: "#00d284", // Set the same color as the default background
                                        },
                                      }}
                                      disabled
                                    >
                                      BOM1
                                    </Button>
                                  ) :
                                    //  parseInt(item.bomtype) === 2 ? (
                                    //   <Button
                                    //     variant="contained"
                                    //     size="small"
                                    //     sx={{
                                    //       backgroundColor: "#00d284"  ,"&:hover": {
                                    //         background: "#00d284", // Set the same color as the default background
                                    //       },
                                    //     }}
                                    //     disabled
                                    //   >
                                    //     BOM2
                                    //   </Button>
                                    // ) : 
                                    (
                                      <>
                                        <Link to={`/bom1Request?id=${item.id}`}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            sx={{
                                              backgroundColor: "#00d284", "&:hover": {
                                                background: "#00d284", // Set the same color as the default background
                                              },
                                            }}
                                          >
                                            BOM1
                                          </Button>
                                        </Link>
                                        {/* <Link to={`/bom2Request?id=${item.id}`}>
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#00d284"  ,"&:hover": {
              background: "#00d284", // Set the same color as the default background
            },
          }}
        >
          BOM2
        </Button>
      </Link> */}
                                      </>
                                    )}
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
