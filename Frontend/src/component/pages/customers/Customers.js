import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./customer.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import MailIcon from '@mui/icons-material/Mail';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ViewComfyAltIcon from '@mui/icons-material/ViewComfyAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NumbersIcon from '@mui/icons-material/Numbers';
import CallIcon from '@mui/icons-material/Call';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HouseIcon from '@mui/icons-material/House';
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
      color: "#000000",
      fontSize: "1em",
      fontWeight: "bold",
      align: "center",
    },
  },
});

export default function Customers() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // get method//

  const [data, setData] = useState([]);
  const [records, setRecords] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getCustemermaster`); // Replace with your API endpoint
      const jsonData = await response.json();
      setRows(jsonData);

      setSearch(jsonData);
      setRows(jsonData.slice());
      setRows(jsonData.reverse()); // Reverse the data array before setting the rows
      setPage(0);
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

    if (e.target.value === "") {
      setRows(search);
    } else {
      const filterResult = search.filter((item) => {
        const email = item.email ? item.email.toLowerCase() : ""; // Null check for custname
        const contactno = item.contactno ? item.contactno.toLowerCase() : ""; // Null check for contactno
        const custname = item.custname ? item.custname.toLowerCase() : ""; // Null check for capacity
        const address = item.address ? item.address.toLowerCase() : ""; // Null check for cperson


        return (
          email.includes(inputValue) ||
          contactno.includes(inputValue) ||
          custname.includes(inputValue) ||
          address.includes(inputValue)

        );
      });

      if (filterResult.length > 0) {
        setRows(filterResult);
      } else {
        setRows([{ name: "No Data" }]);
      }
    }
    setFilter(inputValue);
  };



  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.floor(page * rowsPerPage / newRowsPerPage); // Calculate the new page number
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); // Update the current page to the new page number
  };

  const [serialNumber, setSerialNumber] = useState(1);
  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/deleteCustomers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item. Status: ${response.status}`);
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

      // Call fetchData to refresh the data
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      Swal.fire({
        title: "Error !!!!",
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
              <h4>Customers</h4>
            </div>
            <Link to="/AddCustomers">
              <Button variant="contained" sx={{
                backgroundColor: "#00d284", "&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },
              }}>
                Add Customer
              </Button>
            </Link>
          </div>


          {rows.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: 'red',
                fontSize: '1.4em',
                fontFamily: 'roboto'
              }}
            >
              <p>No records found.</p>
            </div>
          ) : (
            <div className={classes.root}>
              <div style={{ width: "100%", marginTop: "1px" }}>
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
                    width: 480,
                    marginBottom: "8px",

                  }}
                />
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
                          <TableCell className="MuiTableHead-root" align="center">
                            <NumbersIcon style={{ fontSize: "14px", padding: '2px 1px 2px 2px  ' }} />
                            Sr No
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px  ' }} >
                            <ContactMailIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Customer
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px  ' }}>
                            <PermContactCalendarIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Contact<br />Person
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px ' }}>
                            <MailIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Email
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center " style={{ padding: '2px 1px 2px 2px  ' }}>

                            <ViewComfyAltIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Designation
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px ' }}>
                            <CallIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Contact<br />No
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px ' }}>
                            <CallIcon style={{ fontSize: "14px", marginRight: '2px' }} />


                            Alternate<br />Contact
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px  ' }}>
                            <HouseIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            Address
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px  ' }}>

                            <ConfirmationNumberIcon style={{ fontSize: "14px", marginRight: '2px' }} />
                            GST<br /> No
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px ' }}>
                            <ConfirmationNumberIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            PAN<br /> No
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center" style={{ padding: '2px 1px 2px 2px ' }}>
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
                                <TableCell style={{ textAlign: 'center', width: '0.5%' }}>{serialNumber + index}</TableCell>
                                <TableCell style={{ textAlign: 'left' }} key={item.b}>{item.custname}</TableCell>
                                <TableCell style={{ textAlign: 'left' }} key={item.c}>{item.cperson}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.d}>{item.email}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.e}>{item.desg}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.g}>{item.contactno}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.f}>
                                  {item.altcontactno}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.h}>
                                  <div className="customer-name" style={{
                                    maxWidth: '300px',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    lineHeight: '1.4',
                                    textAlign: 'left'
                                  }}>

                                    {item.address}
                                  </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.i}>{item.gstno}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.j}>{item.panno}</TableCell>

                                <TableCell style={{ textAlign: 'center' }} className="wh-spc">
                                  <Link to={`/EditCustomers/${item.id}`}>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        padding: "5px", background: "#00d284",
                                        "&:hover": {
                                          background: "#00d284", // Set the same color as the default background
                                        },
                                      }}
                                      title="Edit"
                                    >
                                      Edit
                                    </Button>

                                  </Link>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      marginLeft: "5px", padding: "5px", background: "#ff0854",
                                      "&:hover": {
                                        background: "#ff0854", // Set the same color as the default background
                                      },
                                    }}

                                    title="Delete"
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
          )}

        </>
      )}
    </>
  );
}
