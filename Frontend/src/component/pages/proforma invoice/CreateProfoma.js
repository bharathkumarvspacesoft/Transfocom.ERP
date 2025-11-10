import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import "../proforma invoice/proforma.css";
import TablePagination from "@mui/material/TablePagination";

import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { formatDate } from "utils";
import Swal from "sweetalert2";
import { Link, NavLink } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& 	.MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight: "bold",
      align: "center",
    },
  },
  tableContainer: {
    maxHeight: "calc(100vh - 90px)", // Adjust the max height as needed
  },
  narrowCell: {
    width: "5%", // Adjust the width of the narrow columns
    textAlign: "center",
  },
  wideCell: {
    width: "15%", // Adjust the width of the wide columns
  },
});

const CreateProfoma = () => {
  const classes = useStyles();

  // get method//

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getNewOrderAcccreate`); // Replace with your API endpoint
      const jsonData = await response.json();
      console.log(jsonData);
      setFilterdata(jsonData); // for search data
      setIsLoading(false);
      setRows(jsonData);
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
    const getSearch = event.target.value.toLowerCase().trim();
    if (getSearch.length > 0) {
      const searchdata = rows.filter(
        (item) =>
          item.custname.toLowerCase().includes(getSearch) ||
          item.ref_no.toLowerCase().includes(getSearch) ||
          item.capacity.toLowerCase().includes(getSearch) ||
          item.consumer.toLowerCase().includes(getSearch)
      );
      setRows(searchdata);
    } else {
      setRows(filterdata);
    }
    setQuery(getSearch);
  };

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.floor((page * rowsPerPage) / newRowsPerPage); // Calculate the new page number
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); // Update the current page to the new page number
  };
  const handleDelete = (id) => {
    fetch(`${APP_BASE_PATH}/deleteOrder/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          title: "Item Deleted Successfully!!!!",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        fetchData();
      })
      .catch((error) => {
        Swal.fire({
          title: "Error !!!!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      });
  };

  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Create Proforma Invoice</h4>
        </div>
        <NavLink to="/proformaInvoice">
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
        </NavLink>
      </div>

      <Paper
        style={{
          height: rowsPerPage === 5 ? 500 : 980,
          position: "relative",
          bottom: 49,
          overflow: "auto",
          margin: "1rem",
          marginTop: "60px",
          padding: "14px",
        }}
        className={classes.tableContainer}
      >
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
            {/* <div style={{ width: "100%" }}> */}
            {/* <TextField
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
                  width:220,
                  marginBottom: "8px",
                  
                }}
            /> */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
                  width: 220,
                  marginBottom: "8px",
                }}
              />
            </div>

            <br />
            <TableContainer>
              {isLoading && (
                <div id="spinner">
                  {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                  <CircularProgress color="warning" loading={isLoading} />
                </div>
              )}
              <div className={classes.root}>
                {/* <Table className="tabel"> */}
                <Table>
                  <TableHead className="tableHeader">
                    <TableRow>
                      {/* <TableCell className="MuiTableHead-root" >Sr No</TableCell> */}
                      <TableCell>Sr No</TableCell>
                      <TableCell>
                        Custemer <br />
                        Name
                      </TableCell>
                      <TableCell>
                        Referance
                        <br /> No
                      </TableCell>

                      <TableCell>Capacity</TableCell>
                      <TableCell>
                        Voltage
                        <br /> Ratio
                      </TableCell>

                      <TableCell>
                        Testing <br />
                        Div
                      </TableCell>
                      <TableCell>Consumer</TableCell>
                      <TableCell>Date</TableCell>

                      <TableCell>Quantity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
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
                            <TableCell
                              align="center"
                              key={item.id}
                              className={classes.narrowCell}
                            >
                              {item.id}
                            </TableCell>

                            <TableCell
                              align="center"
                              className={classes.narrowCell}
                            >
                              {item.custname}
                            </TableCell>
                            <TableCell
                              align="center"
                              key={item.b}
                              className={classes.narrowCell}
                            >
                              {item.ref_no}
                            </TableCell>
                            <TableCell
                              align="center"
                              key={item.c}
                              className={classes.narrowCell}
                            >
                              {item.capacity}
                            </TableCell>
                            <TableCell
                              align="center"
                              key={item.d}
                              className={classes.narrowCell}
                            >
                              {item.priratio}/{item.secratio}V{" "}
                            </TableCell>
                            <TableCell
                              align="center"
                              key={item.p}
                              className={classes.narrowCell}
                            >
                              {item.testing_div}
                            </TableCell>
                            <TableCell
                              align="center"
                              key={item.f}
                              className={classes.narrowCell}
                            >
                              {item.consumer}
                            </TableCell>
                            <TableCell
                              align="center"
                              key={item.o}
                              className={classes.narrowCell}
                            >
                              {formatDate(item.orderacc_date)}
                            </TableCell>
                            <TableCell
                              align="center"
                              key={item.t}
                              className={classes.narrowCell}
                            >
                              {item.quantity}
                            </TableCell>
                            <TableCell
                              align="center"
                              key={item.z}
                              className={classes.narrowCell}
                            >
                              {item.enquiry_status}
                            </TableCell>
                            <TableCell align="center" className="wh-spc">
                              <Link to={`/create/${item.id}`}>
                                {" "}
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
                                  create
                                </Button>
                              </Link>

                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  marginLeft: "5px",
                                  padding: "8px",
                                  background: "#ff0854",
                                  "&:hover": {
                                    background: "#ff0854", // Set the same color as the default background
                                  },
                                }}
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </Button>
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
          // </div>
        )}
      </Paper>
    </>
  );
};

export default CreateProfoma;
