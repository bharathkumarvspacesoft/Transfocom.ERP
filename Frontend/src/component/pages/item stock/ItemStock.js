import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@mui/material/TextField";
import "./item.css";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#ed6c02",
      fontSize: "1em",
    },
  },
});

export default function TotalStock() {
  const classes = useStyles();
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getstock`); // Replace with your API endpoint
        const jsonData = await response.json();
        setIsLoading(false);

        setSearch(jsonData);

        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
          item.storename.toLowerCase().includes(e.target.value) ||
          item.contactno.toLowerCase().includes(e.target.value)
      );
      if (filterResult.length > 0) {
        setRows(filterResult);
      } else {
        Swal.fire({
          title: "No Data Found",

          timer: 1000,
        });
      }
    }
    setFilter(e.target.value);
  };

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  return (
    <>
      <div class="d-flex justify-content-between" style={{position:"relative",bottom:12}}>
        <div className="page_header">
          <h4 style={{ fontFamily: " 'Roboto', sans-serif" }}>Item  Stock</h4>
        </div>
      </div>
      <Paper elevation={6} style={{ height: 500, marginTop: 0 }}>
      {rows.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color:'red',
              fontSize:'1.4em',
              fontFamily:'roboto'
            }}
          >
            <p>No records found.</p>
          </div>
        ) : (
        <div className={classes.root}>
          <br />
          <div style={{ height: 400, width: "100%", marginTop: "-10px" }}>
            <TextField
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
              variant="standard"
              color="warning"
              sx={{
                marginLeft: "55rem",
                marginTop: "5px",
                marginBottom: "4px",
                width:356
              }}
            />
            <br />
            <TableContainer>
              {isLoading && (
                <div id="spinner">
                  {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                  <CircularProgress color="warning" loading={isLoading} />
                </div>
              )}
              <div className={classes.root}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="MuiTableHead-root">Sr No</TableCell>

                      <TableCell className="MuiTableHead-root">
                        Item Code
                      </TableCell>
                      <TableCell className="MuiTableHead-root"> Qty</TableCell>
                      <TableCell className="MuiTableHead-root">
                        {" "}
                        Store Name
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
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.code}
                          >
                            <TableCell key={item.id}>{item.id}</TableCell>
                            <TableCell key={item.d}>
                              {item.material_description}
                            </TableCell>
                            <TableCell key={item.i}>{item.qty}</TableCell>
                            <TableCell key={item.t}>
                              {item.store_name}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5,10]}
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
      </Paper>
    </>
  );
}
