import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import "./invoice.css";
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
import TablePagination from "@mui/material/TablePagination";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
  },
});

const NewInvoice = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleRoute = () => {
    navigate("/addInvoice");
  };

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getchallan`); // Replace with your API endpoint
        const jsonData = await response.json();
        setIsLoading(false);
        setFilterdata(jsonData);
        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
          item.challan_no.toLowerCase().includes(getSearch) ||
          item.custname.toLowerCase().includes(getSearch)
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
    setRowsPerPage(+event.target.value);
    setPage(1);
  };
  const formatDate = (date) => {
    if (!date) return "-"; // if null, undefined, or empty string
    return dayjs(date).format("DD-MM-YYYY");
  };

  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>New Invoice</h4>
        </div>
        <Link to="/invoice" style={{ textDecoration: "none" }}>
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
        <div style={{ height: 400, width: "100%" }}>
          <TableContainer>
            {isLoading && (
              <div id="spinner">
                {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                <CircularProgress color="warning" loading={isLoading} />
              </div>
            )}

            <div className={classes.root}>
              <Table className="tabel">
                <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell>Sr No</TableCell>

                    <TableCell>Challan No</TableCell>
                    <TableCell>Challan Date</TableCell>
                    <TableCell>Challan Quantity </TableCell>
                    <TableCell>Consumer Name </TableCell>
                    <TableCell>Buyer Name </TableCell>
                    <TableCell>PO NO</TableCell>
                    <TableCell>PO DATE </TableCell>


                    <TableCell>Action</TableCell>
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
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell align="center" key={item.d}>
                            {item.challan_no}
                          </TableCell>
                          <TableCell align="center" key={item.i}>
                            {item.chdate}
                          </TableCell>
                          <TableCell align="center">
                            {item.qty}
                          </TableCell>
                          <TableCell align="center">
                            {item.consumer}
                          </TableCell>
                          <TableCell align="center" key={item.a}>
                            {item.custname}
                          </TableCell>
                          <TableCell align="center" key={item.q}>
                            {item.po_no}
                          </TableCell>
                          <TableCell align="center" key={item.e}>
                            {formatDate(item.po_date)}
                          </TableCell>

                          <TableCell align="center">
                            <Link
                              to={`/addInvoice?id=${item.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <Button
                                variant="contained"
                                sx={{
                                  background: "#00d284",
                                  "&:hover": {
                                    background: "#00d284", // Set the same color as the default background
                                  },
                                }}
                              >
                                Add Invoice
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
    </>
  );
};

export default NewInvoice;
