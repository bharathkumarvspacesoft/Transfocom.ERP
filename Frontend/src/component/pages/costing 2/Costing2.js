import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import "./costing2.css";
import { useNavigate, Link } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import ModeFanOffIcon from '@mui/icons-material/ModeFanOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NumbersIcon from '@mui/icons-material/Numbers';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Swal from "sweetalert2";

import { useEffect, useState } from "react";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: 'bold',
      fontSize: "1em",
    },
  },
});

export default function Costing1() {
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/AddCosting2");
  };
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const [serialNumber, setSerialNumber] = useState(1);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getcosting2`); // Replace with your API endpoint
      const jsonData = await response.json();

      setIsLoading(false);
      setFilterdata(jsonData); // for search data
      setRows(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleDelete = async (id) => {
    const res2 = await fetch(`${APP_BASE_PATH}/deleteCosting2/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const deletedata = await res2.json();
    if (res2.status === 404 || !deletedata) {
      console.log("error");
    } else {
      Swal.fire({
        title: "Item Deleted Successfully!!!!",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });
      fetchData();
    }
  };

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      const searchdata = rows.filter(
        (item) =>
          (item.custname?.toLowerCase().includes(getSearch)) ||
          (item.quotref?.toLowerCase().includes(getSearch)) ||
          (item.capacity?.toLowerCase().includes(getSearch))
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
    setRowsPerPage(+event.target.value);
    setPage(1);
  };
  // const handleDelete = (id) => {
  //   fetch(`/deleteCosting2/${id}`, {
  //     method: "DELETE",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       Swal.fire({
  //         title: "Item Deleted Successfully!!!!",
  //         icon: "success",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "green",
  //       });
  //     })
  //     .catch((error) => {
  //       Swal.fire({
  //         title: "Error !!!!",
  //         icon: "error",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "red",
  //       });
  //     });
  // };
  function TableCellWithPopup({ item }) {
    const [showPopup, setShowPopup] = useState(false);
  
    const handleMouseEnter = () => {
      if (item.typetaping.length > 20) {
        setShowPopup(true);
      }
    };
  
    const handleMouseLeave = () => {
      setShowPopup(false);
    };
  
    return (
      <TableCell className="table-cell" key={item.c}>
        <div
          className="popup"
          title={showPopup ? item.typetaping : ''}
          style={{ top: '20px', left: '5px' }} // Adjust the position as needed
        >
          {item.typetaping}
        </div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          {item.typetaping.length > 20 ? (
            item.typetaping.substring(0, 20) + '...'
          ) : (
            item.typetaping
          )}
        </div>
      </TableCell>
    );
  }

  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Costing 2</h4>
        </div>
        <Button variant="contained" sx={{  backgroundColor: "#00d284"  ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          }, }} onClick={handleRoute}>
          Add Costing
        </Button>
      </div>

      <Paper elevation={6}
        style={{
          height: rowsPerPage === 5 ? 500 : 870,
          position: "relative",
          bottom: 49,
          overflow: "auto",
          margin: "1rem",
          marginTop: '60px',
          padding:'14px' // Added margin here
        }}
      >
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
            <div style={{ width: "100%" }}>
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
                 width:220,
                  marginBottom: "8px",
                  
                }}
              />
              <TableContainer>
                {isLoading && (
                  <div id="spinner">
                    <CircularProgress color="warning" loading={isLoading} />
                  </div>
                )}
                <div className={classes.root}>
                <Table className="tabel">
                <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>
                        <TableCell className="MuiTableHead-root">
                        <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Costing Name 
                        </TableCell>
                        <TableCell className="MuiTableHead-root"> <BatteryCharging20Icon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Capacity
                        </TableCell>
                        <TableCell className="MuiTableHead-root multiline-header">   <ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  Voltage<br />Ratio
</TableCell>
{/* <TableCell className="MuiTableHead-root multiline-header"><TextFieldsIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  Type
</TableCell>
<TableCell className="MuiTableHead-root multiline-header"><ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  Consumer<br />Type
</TableCell>
<TableCell className="MuiTableHead-root multiline-header">
<ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  Vector<br />Group
</TableCell>
<TableCell className="MuiTableHead-root multiline-header">

<ModeFanOffIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  Cooling<br />Type
</TableCell>


                        <TableCell
                          className="MuiTableHead-root"
                         
                        > <ContentPasteSearchIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Tapping
                        </TableCell> */}
                      

                        <TableCell
                          className="MuiTableHead-root "
                         
                        >  <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />
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
                        .map((item,index) => {
                          return (
                            <TableRow
                            className="tabelrow"
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={item.code}
                            >
                                <TableCell align="center">{serialNumber + index}</TableCell> 
                                <TableCell key={item.b}>
  {item.costingname !== null
    ? item.costingname
    : item.selectedcosting !== null
    ? item.selectedcosting
    : 'Costing Name is not selected'}
</TableCell>
                              <TableCell align="center" key={item.a}>{item.capacity}</TableCell>
                              <TableCell align="center" key={item.h}>
                                {item.priratio}/{item.secratio}
                              </TableCell>
                              {/* <TableCell key={item.g}>{item.type}</TableCell>
                              <TableCell key={item.f}>
                                {item.consumertype}
                              </TableCell>
                              <TableCell key={item.e}>
                                {item.vectorgroup}
                              </TableCell>
                              <TableCell key={item.d}>
                                {item.typecolling}
                              </TableCell>
                              <TableCellWithPopup item={item} /> */}
                             

                              <TableCell
                                style={{
                                  whiteSpace: "nowrap",
                                  paddingLeft: "6px",
                                }}
                              >
                                 <Link to={`/EditCosting2/${item.id}`} state={item}>
                                  <Button size="small" variant="contained"   sx={{
                                     marginLeft: "5px",
                                      padding: "5px",
                                      background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      },
                                    }} >
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    marginLeft: "5px",
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
                               
                                <Link to={`/View2/${item.id}`} state={item}>
                                  <Button size="small" variant="contained" sx={{
                                      marginLeft: "5px",
                                      padding: "5px",
                                      background: "#00cff4",
                                      "&:hover": {
                                        background: "#00cff4", // Set the same color as the default background
                                      },
                                    }} >
                                   view and Print
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
        )}
      </Paper>
    </>
  );
}
