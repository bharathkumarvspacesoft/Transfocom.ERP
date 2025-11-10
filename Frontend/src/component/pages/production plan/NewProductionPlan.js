import { useState } from "react";
import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import "./production.css";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import Swal from "sweetalert2";
import ListIcon from "@mui/icons-material/List";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import NumbersIcon from "@mui/icons-material/Numbers";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ReorderIcon from "@mui/icons-material/Reorder";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
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
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
    "& .MuiTableCell-body": {
      padding: "8px", // Adjust the value to reduce or increase space
    },
  },
});

export default function NewProductionPlan() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      console.log("Fetching data from:", `${APP_BASE_PATH}/getNewprodPlan`);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getNewprodPlan`); // Replace with your API endpoint
        const jsonData = await response.json();
        console.log(jsonData);
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
      const searchdata = rows.filter((item) =>
        item.custname.toLowerCase().includes(getSearch)
      );
      setRows(searchdata);
    } else {
      Swal.fire({
        title: "No Data Found",
        timer: 1000,
      });
    }
    setQuery(getSearch);
  };

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [newFieldValue, setNewFieldValue] = useState("");
  const [quantityList, setQuantityList] = useState([]);
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

  const handleQuantityChange = (id, value) => {
    // Check if the input value is an integer
    if (!Number.isInteger(Number(value))) {
      // If it's not an integer, show an alert message and don't update the state
      Swal.fire({
        title: "Invalid Quantity",
        text: "Quantity should be an integer.",
        icon: "error",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      return;
    }

    // Convert the quantity value to an integer
    const quantityValue = parseInt(value, 10);

    // Find the row with the given id
    const item = rows.find((row) => row.id === id);

    // Calculate the sum of total_qty_in_production and the inserting quantity
    const totalSum = item.total_qty_in_production + quantityValue;

    if (totalSum > item.quantity) {
      Swal.fire({
        title: "Invalid Quantity",
        text: "Quantity in production cannot exceed the Order quantity.",
        icon: "error",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      return;
    }

    // Update the quantity list with the new value for the specific id
    setQuantityList((prevState) => ({
      ...prevState,
      [id]: quantityValue,
    }));
  };

  const addtoProduction = async (e) => {
    e.preventDefault();
    console.log(quantityList);
    setIsLoading(true);
    const dataList = Object.entries(selectedRows).reduce(
      (acc, [id, isSelected]) => {
        if (isSelected && quantityList[id] !== undefined) {
          const item = rows.find((row) => row.id === parseInt(id, 10));
          if (item) {
            acc.push({
              id: parseInt(id, 10),
              uid: item.uid,
              qty: quantityList[id],
            });
          }
        }
        return acc;
      },
      []
    );
    if (dataList.length === 0) {
      Swal.fire({
        title: "No data to send",
        text: "Please select rows and provide quantities.",
        icon: "warning",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "yellow",
      });
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${APP_BASE_PATH}/addtoProduction/${rows[0].uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataList),
        }
      );

      const data = await res.json();
      console.log(res);

      if (res.status === 400 || !data) {
        Swal.fire({
          title: "Something went wrong!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      } else if (res.status === 401 || !data) {
        Swal.fire({
          title: "Quantity is Mandatory",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        setIsLoading(false);
        return;
      } else {
        Swal.fire({
          title: "Data added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        navigate(-1);
      }
    } catch (error) {
      Swal.fire({
        title: "An error occurred!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h4 className="page_header">New Production Plan</h4>
            <Link to="/productionPlan" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  background: "#00d284",
                  "&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },
                }}
              >
                Back
              </Button>
            </Link>
          </div>

          <div className={classes.root}>
            <div style={{ height: 350, width: "100%" }}>
              <TextField
                className="Search"
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
                sx={{
                  marginRight: "65rem",
                }}
              />
              <br />
              <br />

              <TableContainer>
                <div>
                  <Table className="tabel">
                    <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <NumbersIcon style={{ fontSize: "16px" }} />
                          Sr No
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ListIcon style={{ fontSize: "16px" }} />
                          Order
                          <br /> Quantity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ReorderIcon style={{ fontSize: "16px" }} />
                          Total <br />
                          Production
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ReorderIcon style={{ fontSize: "16px" }} />
                          Costing <br />
                          Id
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ReorderIcon style={{ fontSize: "16px" }} />
                          Costing <br />
                          Name
                        </TableCell>

                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ListIcon style={{ fontSize: "16px" }} />
                          Quantity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <TextSnippetIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Ref
                          <br /> No
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ContactMailIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Customer
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <BatteryCharging20Icon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Capacity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <TextFieldsIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Type
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ContentPasteSearchIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Tapping
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ContentPasteSearchIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Testing <br />
                          Div
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <CalendarMonthIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Date
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <ElectricMeterIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Voltage <br />
                          Ratio
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
                              key={item.id}
                            >
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.id}
                              >
                                {index + 1}
                              </TableCell>

                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.a}
                              >
                                {item.quantity}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.a}
                              >
                                {item.total_qty_in_production}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.a}
                              >
                                {item.cid}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.a}
                              >
                                {item.selectedCosting}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={quantityList[item.id] || ""}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.a}
                              >
                                {item.ref_no}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.b}
                              >
                                {item.custname}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.c}
                              >
                                {item.capacity}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.d}
                              >
                                {item.type === 1
                                  ? "OUTDOOR"
                                  : item.type === 2
                                    ? "INDOOR"
                                    : item.type === 3
                                      ? "OUTDOOR/INDOOR"
                                      : ""}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.x}
                              >
                                {item.typetaping}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.e}
                              >
                                {item.testing_div}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.e}
                              >
                                {formatDate(item.orderacc_date)}
                              </TableCell>
                              <TableCell
                                style={{ textAlign: "center" }}
                                key={item.e}
                              >
                                {item.priratio}/{item.secratio}V
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                <Checkbox
                                  checked={!!selectedRows[item.id]}
                                  onChange={(value) => onSelect(value, item.id)}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </TableContainer>
              <Button
                onClick={addtoProduction}
                variant="contained"
                sx={{
                  background: "#00d284",
                  "&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },
                  // marginTop: "6%",
                  marginLeft: "90%",
                }}
              >
                Add To List
              </Button>
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

        </>
      )}
    </>
  );
}
