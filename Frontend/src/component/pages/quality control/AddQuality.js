import * as React from "react";
import { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import TablePagination from "@mui/material/TablePagination";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import NumbersIcon from "@mui/icons-material/Numbers";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
  },
});

export default function AddMaterialInward() {
  const [value, setValue] = useState(dayjs());

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${APP_BASE_PATH}/getmaterialForquantityInward`
        ); // Replace with your API endpoint
        const jsonData = await response.json();

        setRows(jsonData);
        console.log(rows);
        setSearch(jsonData);
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
          item.poref?.toLowerCase().includes(e.target.value) ||
          item.miref?.toLowerCase().includes(e.target.value) ||
          item.podate?.toLowerCase().includes(e.target.value) ||
          item.custname?.toLowerCase().includes(e.target.value)
      );
      setRows(filterResult);
    }
    setFilter(e.target.value);
  };

  const [serialNumber, setSerialNumber] = useState(1);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.min(page, Math.floor(rows.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };

  const onInward = (id, miid) => {
    navigate(`/addqualitycontrolinward?id=${id}&miid=${miid}`);
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
              <h4>Add Quality Control Inward</h4>
            </div>
            <Link to="/qualityControl" style={{ textDecoration: "none" }}>
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
            <br />
            <div>
              <TextField
                className="Search"
                label="Search..."
                style={{
                  width: "15%",
                  marginBottom: "10px",
                  marginRight: "90%",
                }}
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
                          PO Ref
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <TextSnippetIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          MI Ref
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <CalendarMonthIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          PO Date
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <ContactMailIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Suppler Name
                        </TableCell>

                        <TableCell className="MuiTableHead-root">
                          <AutoAwesomeIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />{" "}
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
                              <TableCell align="center" key={item.id}>
                                {serialNumber + index}
                              </TableCell>
                              <TableCell align="center" key={item.i}>
                                {item.poref}
                              </TableCell>
                              <TableCell align="center" key={item.i}>
                                {item.miref}
                              </TableCell>
                              <TableCell align="center" key={item.d}>
                                {item.podate}
                              </TableCell>
                              <TableCell align="center" key={item.u}>
                                {item.suppname}
                              </TableCell>

                              <TableCell align="center">
                                <Button
                                  onClick={() => onInward(item.id, item.miid)}
                                >
                                  Inward
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
          </div>
        </>
      )}
    </>
  );
}
