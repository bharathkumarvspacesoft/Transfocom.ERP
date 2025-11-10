import { React, useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import "./bomreq.css";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

import NumbersIcon from "@mui/icons-material/Numbers";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PersonIcon from "@mui/icons-material/Person";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";

import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LoadingSpinner from "../../commen/LoadingSpinner";

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

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 200px)", // Adjust based on your layout
  },
  tableFooter: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "16px",
    borderTop: "1px solid rgba(224, 224, 224, 1)",
  },
});

export default function NewBomRequest() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getproduction`); // Replace with your API endpoint
        const jsonData = await response.json();

        setRows(jsonData);
        setSearch(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilter = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue === "") {
      setRows(search);
    } else {
      const filterResult = search.filter((item) => {
        const custname = item.custname?.toLowerCase();
        const capacity = item.capacity?.toLowerCase();
        const testing_div = item.capacity?.toLowerCase();
        return (
          custname?.includes(inputValue) ||
          capacity?.includes(inputValue) ||
          testing_div?.includes(inputValue)
        );
      });

      if (filterResult.length > 0) {
        setRows(filterResult);
      } else {
        console.log("No Data Found");
      }
    }
    setFilter(inputValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const onSelect = (value, index) => {
    setSelectedRows((prevState) => ({
      ...prevState,
      [index]: value.target.checked,
    }));
  };

  const addtoBOM = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let dataList = [];
    rows.forEach((listval) => {
      if (selectedRows[listval.id]) {
        dataList = [
          ...dataList,
          { plan_id: listval.id, uid: listval.uid, costing_id: listval.cid },
        ];
      }
    });
    try {
      const res = await fetch(`${APP_BASE_PATH}/addtoBOM/${dataList[0].uid}`, {
        method: "POST",
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
        setIsLoading(false);
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
        text: "error",
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
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
              <h4>Add BOM Request</h4>
            </div>
            <Link to="/bomrequest" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00d284",
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
            <div style={{ width: "100%" }}>
              <TableContainer
                component={Paper}
                className={classes.tableContainer}
              >
                {isLoading && (
                  <div id="spinner">
                    <CircularProgress color="warning" loading={isLoading} />
                  </div>
                )}
                <Table className="tabel" stickyHeader>
                  <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <NumbersIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Sr No
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <TextSnippetIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Ref No
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <PersonIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Customer
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <BatteryCharging20Icon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Costing ID
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <BatteryCharging20Icon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Costing Name
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <BatteryCharging20Icon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Capacity
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <TextFieldsIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        TypeType
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <ContentPasteSearchIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Testing Div
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <ElectricMeterIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Voltage Ratio
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
                        <ProductionQuantityLimitsIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Quantity
                      </TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                        style={{ backgroundColor: "#b3e5fc" }}
                      >
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
                      .map((item) => {
                        return (
                          <TableRow
                            className="tabelrow"
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.code}
                          >
                            <TableCell align="center" key={item.id}>
                              {item.id}
                            </TableCell>
                            <TableCell align="center" key={item.d}>
                              {item.wo_no}
                            </TableCell>
                            <TableCell align="center" key={item.i}>
                              {item.custname}
                            </TableCell>
                            <TableCell align="center" key={item.a}>
                              {item.cid}
                            </TableCell>
                            <TableCell align="center" key={item.a}>
                              {item.selectedCosting}
                            </TableCell>
                            <TableCell align="center" key={item.a}>
                              {item.capacity}
                            </TableCell>
                            <TableCell align="center" key={item.d}>
                              {item.type === 1
                                ? "OUTDOOR"
                                : item.type === 2
                                  ? "INDOOR"
                                  : item.type === 3
                                    ? "OUTDOOR-INDOOR"
                                    : ""}
                            </TableCell>
                            <TableCell align="center" key={item.e}>
                              {item.testing_div}
                            </TableCell>
                            <TableCell align="center" key={item.f}>
                              {formatDate(item.orderacc_date)}
                            </TableCell>
                            <TableCell align="center" key={item.g}>
                              {item.priratio}/{item.secratio}V
                            </TableCell>
                            <TableCell align="center" key={item.g}>
                              {item.qty}
                            </TableCell>
                            <TableCell align="center">
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

                <div className={classes.tableFooter}>
                  {/* <Button
                    variant="contained"
                    sx={{ 
                      background: "#00d284",
                      "&:hover": {
                        background: "#00d284",
                      },
                    }}
                    onClick={addtoBOM}
                  >
                    Add To List
                  </Button> */}

                  <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />

                  <Button
                    variant="contained"
                    sx={{
                      background: "#00d284",
                      "&:hover": {
                        background: "#00d284",
                      },
                    }}
                    onClick={addtoBOM}
                  >
                    Add To List
                  </Button>
                </div>
              </TableContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
