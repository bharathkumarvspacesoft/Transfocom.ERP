import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, Grid, IconButton } from "@mui/material";
// import "./quotation.css";
import { json, Link, NavLink, useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@mui/material/TablePagination";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { formatDate } from "utils";
import { APP_BASE_PATH } from "Host/endpoint";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NumbersIcon from '@mui/icons-material/Numbers';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import CopyrightIcon from '@mui/icons-material/Copyright';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
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

export default function Quotation() {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleRoute = () => {
    navigate("/addQuotation");
  };

  // get method//

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getQuotationDetails`); // Replace with your API endpoint
      const jsonData = await response.json();
      setSearch(jsonData);
      setRows(jsonData);
      console.log(jsonData)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);

  const handleFilter = (e) => {
    const inputValue = e.target.value.trim().toLowerCase(); // Convert the input value to lowercase

    if (e.target.value === "") {
      setRows(search);
    } else {
      const filterResult = search.filter((item) => {
        const custname = item.custname ? item.custname.toLowerCase() : "";
        const selectedcosting = item.selectedcosting ? item.selectedcosting.toLowerCase() : "";

        const status = item.status ? item.status.toLowerCase() : "";
        const cost = item.cost ? item.cost.toString().toLowerCase() : "";
        const quotref = item.quotref ? item.quotref.toLowerCase() : ""; // Null check for quotref
        const capacity = item.capacity ? item.capacity.toLowerCase() : ""; // Null check for capacity
        const priratio = item.capacity ? item.priratio.toLowerCase() : "";
        const secratio = item.capacity ? item.secratio.toLowerCase() : "";
        return (
          custname.includes(inputValue) ||
          quotref.includes(inputValue) ||
          priratio.includes(inputValue) ||
          secratio.includes(inputValue) ||
          capacity.includes(inputValue) ||
          cost.includes(inputValue) ||
          status.includes(inputValue) ||
          selectedcosting.includes(inputValue)
        );
      });

      if (filterResult.length > 0) {
        setRows(filterResult);
      } else {
        Swal.fire({
          title: "No Data Found",
          timer: 1000,
        });
      }
    }
    setFilter(inputValue);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/deleteQuotation/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      Swal.fire({
        title: "Item Deleted Successfully!!!!",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });

      fetchData(); // Call the fetchData function to refresh the data
    } catch (error) {
      Swal.fire({
        title: "Error !!!!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } finally {
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
        <Grid container alignItems="center" justifyContent="center" spacing={2}>


          <Grid item xs={6} style={{ marginRight: '92%' }}>
            <h4>Quotation</h4>
          </Grid>

          <Grid
            container
            item
            xs={12}
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ marginTop: "2px" }}
          >


          </Grid>

          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={6} >
              <TextField
                style={{ width: "500px", marginRight: '80px' }}
                className="Search"
                placeholder="Search..."
                value={filter}
                onChange={(e) => handleFilter(e)}
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
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00d284",
                  "&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },
                }}
                id="addenquirybtn"
                onClick={handleRoute}
              >
                New Quotation
              </Button>
            </Grid>
          </Grid>


          <Grid item xs={12}>

            <TableContainer className="table-container" component={Paper}>
              <Table size="small">
                <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <NumbersIcon style={{ fontSize: "14px" }} />
                      Sr No
                    </TableCell>

                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <CalendarMonthIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                      Date
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <TextSnippetIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                      Quotation <br />Referance No
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <ContactMailIcon style={{ fontSize: "14px", marginRight: '2px', textAlign: 'center', justifyContent: 'center' }} />
                      Quotation<br /> QTY
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <ContactMailIcon style={{ fontSize: "14px", marginRight: '2px', textAlign: 'center', justifyContent: 'center' }} />
                      Costing<br /> ID No
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <ContactMailIcon style={{ fontSize: "14px", marginRight: '2px', textAlign: 'center', justifyContent: 'center' }} />
                      Costing<br /> Name
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <ContactMailIcon style={{ fontSize: "14px", marginRight: '2px', textAlign: 'center', justifyContent: 'center' }} />
                      Customer <br /> Name
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <BatteryCharging20Icon style={{ fontSize: "14px", marginRight: '2px' }} />
                      Capacity
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <CopyrightIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                      Cost
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <CheckCircleOutlineIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                      Status
                    </TableCell>
                    {/* <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <StarOutlineIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                      Version
                    </TableCell> */}
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold"
                    }}>
                      <ElectricMeterIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                      Voltage <br /> &nbsp; &nbsp; &nbsp; Ratio
                    </TableCell>
                    <TableCell className="MuiTableHead-root" style={{
                      color: "#000000",

                      align: "center",
                      fontWeight: "bold", textAlign: 'center'
                    }}>
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
                          <TableCell style={{ textAlign: 'center', width: '10px' }} key={item.id}>{index + 1}</TableCell>
                          <TableCell key={item.a}>
                            {formatDate(item.qdate)}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }} key={item.b}>{item.quotref}</TableCell>
                          <TableCell style={{ textAlign: 'center' }} key={item.c}>
                            {item.qty}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }} key={item.c}>
                            {item.cid}
                          </TableCell>
                          <TableCell style={{ textAlign: 'left' }} key={item.c}>
                            {item.selectedcosting?.split(',').map((part, index) => (
                              <>
                                {part}
                                {index < item.selectedcosting.split(',').length - 1 && ','}
                                {index === 2 && <br />}
                              </>
                            ))}
                          </TableCell>

                          <TableCell style={{ textAlign: 'left' }} key={item.c}>
                            <div className="customer-name" style={{
                              maxWidth: '300px',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              lineHeight: '1.4'
                            }}>
                              {item.custname}
                            </div>
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }} key={item.d}>
                            {item.capacity}
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }} key={item.e}>₹{item.cost}</TableCell>
                          <TableCell style={{ textAlign: 'center' }} key={item.f}>{item.status}</TableCell>
                          {/* <TableCell style={{ textAlign: 'center' }} key={item.e}>
                            {item.rversion}
                          </TableCell> */}
                          <TableCell style={{ textAlign: 'center' }} key={item.e}>
                            {item.priratio}/{item.secratio}V
                          </TableCell>
                          <TableCell className="wh-spc" style={{ textAlign: 'center' }}>
                            <Button
                              variant="contained"
                              disabled={!!item.order_id}
                              component={Link}
                              to={`/UpdateQuotation/${item.qid}`}
                              sx={{
                                padding: "5px",
                                background: "#00d284",
                                "&:hover": {
                                  background: "#00d284",
                                },
                              }}
                            >
                              Edit
                            </Button>

                            <Button
                              size="small"
                              onClick={() => handleDelete(item.qid)}
                              title="Delete"
                              variant="contained"
                              disabled={!!item.order_id}
                              sx={{
                                marginLeft: "5px",
                                padding: "5px",
                                background: "#ff0854",
                                "&:hover": {
                                  background: "#ff0854", // Set the same color as the default background
                                },
                              }}
                            >
                              Delete
                            </Button>

                            <NavLink to={`/printquotation/${item.qid}`}>
                              <Button
                                variant="contained"
                                sx={{
                                  marginLeft: "5px",
                                  padding: "5px",
                                  background: "#00cff4",
                                  "&:hover": {
                                    background: "#00cff4", // Set the same color as the default background
                                  },
                                }}
                              >
                                Print
                              </Button>
                            </NavLink>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>

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

          </Grid>


        </Grid>
      )}
    </>
  );
}
