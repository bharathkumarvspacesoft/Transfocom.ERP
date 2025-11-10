import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Button, Grid, IconButton } from "@mui/material";
import "./enquiry.css";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import CallIcon from "@mui/icons-material/Call";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CopyrightIcon from "@mui/icons-material/Copyright";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import NumbersIcon from "@mui/icons-material/Numbers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import { formatDate } from "utils";
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
    "& .MuiTableHead-root": {
      padding: "5 px",
    },
  },
});

export default function Enquiry() {
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/addEnquiry");
  };

  const classes = useStyles();

  // get method//

  const [selectedRows, setSelectedRows] = useState({});
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getEnquiryDetails`); // Replace with your API endpoint
      const jsonData = await response.json();
      setRows(jsonData);
      console.log(jsonData);
      setSearch(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/deleteEnq/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.message === "Cannot delete item with enqstatus 5.") {
        Swal.fire({
          title: "Cannot delete item",
          text: "Item cannot be deleted first delete it from quotation.",
          icon: "warning",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "orange",
        });
      } else if (data.message === "Item Deleted Successfully!!!!") {
        Swal.fire({
          title: "Item Deleted Successfully!!!!",
          icon: "success",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        fetchData();
      } else {
        Swal.fire({
          title: "Unexpected Response",
          text: "An unexpected response was received from the server.",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error !!",
        text: `An error occurred while deleting the item. ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [serialNumber, setSerialNumber] = useState(1);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;

    const newPage = Math.min(page, Math.floor(rows.length / newRowsPerPage));

    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };

  const onSelect = (value, index) => {
    setSelectedRows((prevState) => ({
      ...prevState,
      [index]: value.target.checked,
    }));
  };

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);

  const handleFilter = (e) => {
    const inputValue = e.target.value.trim().toLowerCase(); // Convert input to lowercase

    if (inputValue === "") {
      setRows(search);
    } else {
      const filterResult = search.filter((item) => {
        const custname = item.custname ? item.custname.toLowerCase() : "";
        const contactno = item.contactno ? item.contactno.toLowerCase() : "";
        const capacity = item.capacity ? item.capacity.toLowerCase() : "";
        const cperson = item.cperson ? item.cperson.toLowerCase() : "";
        const contactperson = item.contactperson
          ? item.contactperson.toLowerCase()
          : "";
        const edate = item.edate ? item.edate.toLowerCase() : "";

        return (
          custname.includes(inputValue) ||
          contactno.includes(inputValue) ||
          capacity.includes(inputValue) ||
          cperson.includes(inputValue) ||
          contactperson.includes(inputValue) ||
          edate.includes(inputValue)
        );
      });

      setRows(filterResult.length > 0 ? filterResult : []);
    }

    setFilter(inputValue);
  };

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch(`${APP_BASE_PATH}/getEnquiryDetails`); // Replace with your API endpoint
  //     const jsonData = await response.json();
  //     setRows(jsonData);

  //     setSearch(jsonData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const addCost = async (e) => {
    e.preventDefault();
    let dataList = [];
    rows.forEach((listval) => {
      if (selectedRows[listval.id]) {
        dataList = [...dataList, listval.id];
      }
    });

    const res = await fetch(`${APP_BASE_PATH}/addcost`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataList),
    });
    const data = res.json();

    if (res.status === 400 || !data) {
      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else {
      Swal.fire({
        title: "Costing added Successfully",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });
      setSelectedRows({});
      fetchData();
    }
  };
  const formatText = (text, maxLength) => {
    const result = [];
    for (let i = 0; i < text.length; i += maxLength) {
      result.push(text.slice(i, i + maxLength));
    }
    return result.join("<br />"); // Use <br /> to insert line breaks in HTML
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={6} style={{ marginRight: "92%" }}>
            <h4>Enquiry</h4>
          </Grid>

          <Grid
            container
            item
            xs={12}
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ marginTop: "2px" }}
          ></Grid>

          <Grid container style={{ display: "flex", alignItems: "center" }}>
            <Grid item xs={6}>
              <TextField
                style={{ width: "500px", marginRight: "80px" }}
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
            <Grid item xs={6} style={{ textAlign: "right" }}>
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
                Add Enquiry
              </Button>
              <Button
                onClick={addCost}
                variant="contained"
                sx={{
                  backgroundColor: "#00d284",
                  marginTop: "5px",
                  marginRight: "5px",
                  "&:hover": {
                    background: "#00d284",
                  },
                }}
                disabled={
                  Object.keys(selectedRows).length === 0 ||
                  Object.values(selectedRows).every((val) => !val)
                }
              >
                Add Costing
              </Button>
            </Grid>
          </Grid>

          {rows.length === 0 ? (
            <p style={{ textAlign: "center", color: "red", fontSize: "20px" }}>
              No Data Found
            </p>
          ) : null}

          <Grid item xs={12}>
            <TableContainer className="table-container" component={Paper}>
              <Table size="small">
                <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <NumbersIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Sr <br /> No
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <NumbersIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Costing <br /> ID
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <CalendarMonthIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Enquiry <br /> Date
                    </TableCell>
                    <TableCell
                      style={{
                        padding: '8px',
                        color: '#000',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',        // vertical center
                        justifyContent: 'flex-start', // left align children when MUI uses flex
                        fontWeight: "bold",
                      }}
                    >
                      <ContactMailIcon style={{ fontSize: 16, marginRight: 8 }} />
                      <div>
                        Customer <br /> Name
                      </div>
                    </TableCell>

                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <PermContactCalendarIcon
                        style={{
                          fontSize: "16px",
                          marginRight: "2px",
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                      Contact Person <br />
                      Name
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <CallIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Contact No
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <BatteryCharging20Icon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Capacity
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <ElectricMeterIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Voltage <br /> Ratio
                    </TableCell>

                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <CheckCircleOutlineIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Status
                    </TableCell>

                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <AutoAwesomeIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Action
                    </TableCell>

                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        padding: "8px",
                        color: "#000000",

                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      <CopyrightIcon
                        style={{ fontSize: "16px", marginRight: "2px" }}
                      />
                      Costing
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
                          <TableCell style={{ textAlign: "center" }}>
                            {item.id}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {item.cid}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }} key={item.a}>{item.edate}</TableCell>
                          <TableCell
                            style={{ textAlign: "left" }}
                            key={item.b}
                            dangerouslySetInnerHTML={{
                              __html: formatText(item.custname, 30),
                            }}
                          ></TableCell>
                          <TableCell
                            style={{ textAlign: "left" }}
                            key={item.c}
                            dangerouslySetInnerHTML={{
                              __html: formatText(item.contactperson, 30),
                            }}
                          ></TableCell>
                          <TableCell
                            style={{ textAlign: "center" }}
                            key={item.d}
                          >
                            {item.contactno}
                          </TableCell>

                          <TableCell
                            style={{ textAlign: "center" }}
                            key={item.f}
                          >
                            {item.capacity} KVA
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }} key={item.e}>
                            {item.priratio}/{item.secratio}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }} key={item.f}>
                            {item.enqstatus === "1" ? (
                              "UNDER COSTING"
                            ) : item.enqstatus === "5" ? (
                              "QUOTED"
                            ) : item.enqstatus === "3" ? (
                              <>
                                Selected
                                <br />
                                Costing
                              </>
                            ) : (
                              ""
                            )}
                          </TableCell>

                          <TableCell style={{ textAlign: "center" }}>
                            <Link to={`/editenquiry/${item.id}`}>
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
                              onClick={() => handleDelete(item.id)}
                              sx={{
                                marginLeft: "5px",
                                padding: "8px",
                                background: "#ff0854",
                                "&:hover": {
                                  background: "#ff0854", // Set the same color as the default background
                                },
                              }}
                              disabled={item.enqstatus === "5"}
                            >
                              Delete
                            </Button>
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {item.enqstatus === "5" ||
                              item.enqstatus === "4" ? (
                              "Costing Done"
                            ) : item.enqstatus === "3" ? (
                              "Selected Costing"
                            ) : item.enqstatus === "0" ? (
                              <Checkbox
                                checked={!!selectedRows[item.id]}
                                onChange={(value) => onSelect(value, item.id)}
                              />
                            ) : null}
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
