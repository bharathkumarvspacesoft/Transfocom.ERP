import { React, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./material.css";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@mui/material/TablePagination";
import Swal from "sweetalert2";
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import NumbersIcon from '@mui/icons-material/Numbers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReorderIcon from '@mui/icons-material/Reorder';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ListIcon from '@mui/icons-material/List';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Params } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiDataGrid-columnHeader": {
      color: "#000000",
      fontSize: "1em",
      align: "center",
      fontWeight: "bold"
    },
  },
});

export default function Material() {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/addmaterial");
  };
  const [serialNumber, setSerialNumber] = useState(1);

  const [isLoading, setIsLoading] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getMaterialmaster`); // Replace with your API endpoint
      const jsonData = await response.json();

      console.log('jsonData', jsonData);
      setRows(jsonData);
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

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);

  const handleFilter = (e) => {
    const inputValue = e.target.value.trim().toLowerCase();
    if (inputValue === "") {
      // If the input is empty, show all data
      setRows(search);
    } else {
      const filterResult = search.filter(
        (item) =>
          item.item_code.toLowerCase().includes(inputValue) ||
          item.material_description.toLowerCase().includes(inputValue)
      );
      if (filterResult.length > 0) {
        // If there are matching results, update the rows with filtered data
        setRows(filterResult);
      } else {
        // If no data matches the search, display a message
        Swal.fire({
          title: "No Data Found",
          timer: 1000,
        });
        // Optionally, you could reset the rows to show all data here
        // setRows(search);
      }
    }
    // Update the filter value in the state
    setFilter(inputValue);
  };


  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to the first page when rowsPerPage changes
  };

  const handleDelete = (id) => {
    fetch(`${APP_BASE_PATH}/deleteMaterial/${id}`, {
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            class="d-flex justify-content-between"
            style={{ position: "relative", bottom: 13 }}
          >
            <div className="page_header">
              <h4>Material Master</h4>
            </div>
            <Button variant="contained" sx={{
              backgroundColor: "#00d284", marginRight: '12px', "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }} onClick={handleRoute}>
              New Material
            </Button>
          </div>

          <div className={classes.root}>
            <div style={{ height: 400, width: "100%" }}>
              <TextField
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

                sx={{
                  marginRight: "65rem",
                  width: 220,
                  marginBottom: "8px",
                }}
              />
              <br />
              <TableContainer>
                {isLoading && (
                  <div id="spinner">
                    {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                    <CircularProgress loading={isLoading} />
                  </div>
                )}
                <div className={classes.root}>
                  <Table className="tabel">
                    <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "bold", fontSize: "1em" }}
                        > <NumbersIcon style={{ fontSize: "16px" }} />
                          Sr.No
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", fontSize: "1em" }}
                        >
                          <DynamicFormIcon style={{ fontSize: "16px" }} />
                          Item Code
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", fontSize: "1em" }}
                        ><ReorderIcon style={{ fontSize: "16px" }} />
                          Item Description
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", fontSize: "1em" }}
                        ><ListIcon style={{ fontSize: "16px" }} />
                          RATE</TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", fontSize: "1em" }}
                        ><ListIcon style={{ fontSize: "16px" }} />
                          Unit
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "bold", fontSize: "1em" }}
                        >
                          <StoreMallDirectoryIcon style={{ fontSize: "16px" }} />Store Name
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold", fontSize: "1em" }}><EventAvailableIcon style={{ fontSize: "16px" }} />Available in Store</TableCell>

                        <TableCell
                          style={{ fontWeight: "bold", fontSize: "1em" }}
                        ><AutoAwesomeIcon style={{ fontSize: "16px", marginRight: '2px' }} />
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
                              <TableCell >{serialNumber + index}</TableCell>
                              <TableCell key={item.a}>{item.item_code}</TableCell>
                              <TableCell key={item.b}>
                                {item.material_description}
                              </TableCell>
                              <TableCell key={item.x}>₹{item.rate}</TableCell>
                              <TableCell key={item.c}>{item.unit}</TableCell>
                              <TableCell key={item.d}>
                                {item.store_name}
                              </TableCell>
                              <TableCell >{item.stock}</TableCell>
                              <TableCell>
                                <Link to={`/UpdateMaterial/${item.id}`}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    disabled={item.costing_done === 1}

                                    sx={{
                                      padding: "5px",
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
                                  disabled={item.costing_done === 1}
                                  sx={{
                                    marginLeft: '3px',
                                    padding: "5px",
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

        </>
      )}
    </>
  );
}
