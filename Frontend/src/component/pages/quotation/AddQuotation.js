import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, Grid, IconButton } from "@mui/material";
import "./quotation.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
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
  },
});

export default function Quotation() {
  const classes = useStyles();

  // get method//

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getEnquiryForAdd`); // Replace with your API endpoint
        const jsonData = await response.json();
        setSearch(jsonData);
        setIsLoading(false);
        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setRows(search);
    } else {
      const filterResult = search.filter(
        (item) =>
          item.custname?.toLowerCase().includes(e.target.value) ||
          item.contactno?.toLowerCase().includes(e.target.value) ||
          item.capacity?.toLowerCase().includes(e.target.value) ||
          item.cperson?.toLowerCase().includes(e.target.value) ||
          item.edate?.toLowerCase().includes(e.target.value) ||
          item.priratio?.toLowerCase().includes(e.target.value) ||
          item.secratio?.toLowerCase().includes(e.target.value)
      );
      if (filterResult.length > 0) {
        setRows(filterResult);
      } else {
        window.alert("Data Not Found");
      }
    }
    setFilter(e.target.value);
  };

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
          <Grid item xs={6} style={{ marginRight: "85%" }}>
            <h4>New Quotation</h4>
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
              <Link to="/quotation" style={{ textDecoration: "none" }}>
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
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TableContainer className="table-container" component={Paper}>
              <Table size="small">
                <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Sr No
                    </TableCell>

                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Enquiry Date
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Customer Name
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Contact Person Name
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Contact No
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Capacity
                    </TableCell>
                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Voltage Ratio
                    </TableCell>

                    <TableCell
                      className="MuiTableHead-root"
                      style={{
                        color: "#000000",
                        align: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Action
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
                          <TableCell align="center" key={item.id}>
                            {index + 1}
                          </TableCell>
                          <TableCell align="center" key={item.a}>
                            {item.edate}
                          </TableCell>
                          <TableCell align="center" key={item.b}>
                            {item.custname}
                          </TableCell>
                          <TableCell align="center" key={item.c}>
                            {item.contactperson}
                          </TableCell>
                          <TableCell align="center" key={item.d}>
                            {item.contactno}
                          </TableCell>

                          <TableCell align="center" key={item.f}>
                            {item.capacity}KVA
                          </TableCell>
                          <TableCell align="center" key={item.e}>
                            {item.priratio}/{item.secratio}V
                          </TableCell>
                          <TableCell align="center">
                            <Link to={`/NewQuotation/${item.id}`}>
                              <Button
                                variant="contained"
                                sx={{
                                  background: "#00d284",
                                  "&:hover": {
                                    background: "#00d284", // Set the same color as the default background
                                  },
                                }}
                              >
                                Add Quotation
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
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
          </Grid>
        </Grid>
      )}
    </>
  );
}
