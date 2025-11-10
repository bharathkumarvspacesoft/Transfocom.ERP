import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import "./costing1.css";
import { useNavigate, Link } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
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
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
  },
});


export default function Costing1() {
  const [serialNumber, setSerialNumber] = useState(1);
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/AddCosting1");
  };
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${APP_BASE_PATH}/getcosting1`);
      const jsonData = await response.json();
      const filteredData = jsonData.filter(row => row.costingname !== null);


      setFilterdata(jsonData); // for search data
      setRows(filteredData);

      // Check usage for all costings
      await checkAllCostingUsage(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    // Check if costing is being used before allowing deletion
    if (costingUsage[id]) {
      Swal.fire({
        title: "Cannot Delete",
        text: "This costing is being used in an enquiry and cannot be deleted.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff0854",
      });
      return;
    }

    setIsLoading(true)
    try {
      const res2 = await fetch(`${APP_BASE_PATH}/deleteCosting/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res2.status === 404) {
        console.log("Error: Item not found");
        Swal.fire({
          title: "Error",
          text: "Item not found",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
        return;
      }

      const deletedata = await res2.json();

      if (!deletedata) {
        console.log("Error: Deletion failed");
        Swal.fire({
          title: "Error",
          text: "Deletion failed",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
        return;
      }

      Swal.fire({
        title: "Item Deleted Successfully!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });

      fetchData();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the item",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false)
    }
  };


  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");
  const [costingUsage, setCostingUsage] = useState({});

  // Function to check if a costing is being used in any enquiry
  const checkCostingUsage = async (costingId) => {
    try {
      const response = await fetch(`${APP_BASE_PATH}/checkcostingusage/${costingId}`);
      const data = await response.json();
      return data.isUsed || false;
    } catch (error) {
      console.error("Error checking costing usage:", error);
      return false;
    }
  };

  // Function to check usage for all costings
  const checkAllCostingUsage = async (costingData) => {
    const usageMap = {};
    for (const costing of costingData) {
      if (costing.id) {
        const isUsed = await checkCostingUsage(costing.id);
        usageMap[costing.id] = isUsed;
      }
    }
    setCostingUsage(usageMap);
  };

  const handlesearch = (event) => {
    const getSearch = event.target.value.toLowerCase();
    if (getSearch.length > 0) {
      const searchdata = filterdata.filter(
        (item) =>
          (item.custname?.toLowerCase().includes(getSearch)) ||
          (item.quotref?.toLowerCase().includes(getSearch)) ||
          (item.capacity?.toLowerCase().includes(getSearch))
      );
      setRows(searchdata);
    } else {
      setRows([...filterdata]);
    }
    setQuery(getSearch);
  };



  // render the rows

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.min(page, Math.floor(rows.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };



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
  // function TableCellWithPopupforcostingname({ item }) {
  //   const [showPopup, setShowPopup] = useState(false);

  //   const handleMouseEnter = () => {
  //     if (item.costingname && item.costingname.length > 1000) {
  //       setShowPopup(true);
  //     }
  //   };

  //   const handleMouseLeave = () => {
  //     setShowPopup(false);
  //   };

  //   return (
  //     <TableCell className="table-cell" key={item.c}>
  //       {/* <div
  //         className="popup"
  //         title={showPopup ? item.costingname : ''}
  //         style={{ top: '20px', left: '5px' }} // Adjust the position as needed
  //       >
  //         {item.costingname !== null ? item.costingname : item.selectedcosting}
  //       </div> */}
  //       <div
  //         onMouseEnter={handleMouseEnter}
  //         onMouseLeave={handleMouseLeave}
  //         style={{ position: 'relative', display: 'inline-block' }}
  //       >
  //         {item.costingname !== null && item.costingname.length > 1000 ? (
  //           item.costingname.substring(0, 1000) + '...'
  //         ) : (
  //           item.costingname !== null ? item.costingname : item.selectedcosting
  //         )}
  //       </div>
  //     </TableCell>
  //   );
  // }
  function TableCellWithPopupforcostingname({ item }) {
    const [showPopup, setShowPopup] = useState(false);

    const handleMouseEnter = () => {
      if (item.costingname && item.costingname.length > 1000) {
        setShowPopup(true);
      }
    };

    const handleMouseLeave = () => {
      setShowPopup(false);
    };

    // ✅ Function to insert <br /> after 3rd comma
    const formatCostingName = (text) => {
      if (!text) return "";

      const parts = text.split(",");
      if (parts.length <= 3) return text; // no need to break line

      const firstLine = parts.slice(0, 3).join(",");
      const secondLine = parts.slice(3).join(",");

      return (
        <>
          {firstLine},<br />
          {secondLine}
        </>
      );
    };

    const costingText =
      item.costingname !== null ? item.costingname : item.selectedcosting;

    const displayText =
      item.costingname !== null && item.costingname.length > 1000
        ? item.costingname.substring(0, 1000) + "..."
        : formatCostingName(costingText);

    return (
      <TableCell
        className="table-cell"
        key={item.c}
        style={{ textAlign: "left", whiteSpace: "pre-wrap" }}
      >
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: "relative", display: "inline-block" }}
        >
          {displayText}
        </div>

        {/* Optional popup (you can uncomment and style if needed) */}
        {/* {showPopup && (
        <div
          className="popup"
          style={{
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            padding: "8px",
            zIndex: 10,
            top: "20px",
            left: "5px",
            width: "300px",
            whiteSpace: "pre-wrap",
          }}
        >
          {costingText}
        </div>
      )} */}
      </TableCell>
    );
  }
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
              <h4>Costing </h4>
            </div>
            <Button variant="contained" sx={{
              backgroundColor: "#00d284", "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }} onClick={handleRoute}>
              Add Costing
            </Button>
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
                    width: 220,
                    marginBottom: "8px",

                  }}
                />
                <TableContainer>

                  <div className={classes.root}>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell className="MuiTableHead-root" align="center"><NumbersIcon style={{ fontSize: "16px", marginRight: '2px' }} />Sr No</TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <ContactMailIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Costing Id
                          </TableCell>
                          <TableCell className="MuiTableHead-root" align="center">
                            <ContactMailIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Costing Name
                          </TableCell>

                          <TableCell className="MuiTableHead-root" align="center"> <BatteryCharging20Icon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Capacity
                          </TableCell>
                          <TableCell className="MuiTableHead-root multiline-header" align="center"><ElectricMeterIcon style={{ fontSize: "16px", marginRight: '2px' }} />
                            Voltage<br />Ratio
                          </TableCell>
                          {/* <TableCell className="MuiTableHead-root multiline-header"><ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  Consumer<br />Type
</TableCell> */}
                          {/* <TableCell className="MuiTableHead-root multiline-header"><TextFieldsIcon style={{ fontSize: "16px",marginRight:'2px' }} />
  Type
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
                            className="MuiTableHead-root " align="center"

                          >  <AutoAwesomeIcon style={{ fontSize: "16px", marginRight: '2px' }} />
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
                                key={item.code} style={{ textAlign: 'center' }}
                              >
                                <TableCell style={{ textAlign: 'center' }} align="center">{serialNumber + index}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} align="center" key={item.a}>{item.id}</TableCell>
                                < TableCellWithPopupforcostingname style={{ textAlign: 'center' }} item={item} />
                                <TableCell style={{ textAlign: 'center' }} align="center" key={item.a}>{item.capacity}</TableCell>
                                <TableCell style={{ textAlign: 'center' }} key={item.h}>
                                  {item.priratio}/{item.secratio}
                                </TableCell>
                                {/* <TableCell align="center" key={item.f}>
                                {item.consumertype}
                              </TableCell> */}
                                {/* <TableCell key={item.g}>{item.type}</TableCell>
                              
                              <TableCell key={item.e}>
                                {item.vectorgroup}
                              </TableCell>
                              <TableCell key={item.d}>
                                {item.typecolling}
                              </TableCell> */}

                                <TableCell className="wh-spc" style={{ textAlign: 'center' }}>
                                  <Link to={`/EditCosting1/${item.id}`} state={item}>
                                    <Button size="small" variant="contained" sx={{
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
                                    disabled={costingUsage[item.id]}
                                    sx={{
                                      marginLeft: "5px",
                                      padding: "5px",
                                      background: costingUsage[item.id] ? "#cccccc" : "#ff0854",
                                      color: costingUsage[item.id] ? "#666666" : "white",
                                      "&:hover": {
                                        background: costingUsage[item.id] ? "#cccccc" : "#ff0854", // Set the same color as the default background
                                      },
                                      "&:disabled": {
                                        background: "#cccccc",
                                        color: "#666666",
                                      },
                                    }}
                                    onClick={() => handleDelete(item.id)}
                                    title={costingUsage[item.id] ? "Cannot delete - Costing is being used in an enquiry" : "Delete"}
                                  >
                                    Delete
                                  </Button>

                                  <Link to={`/View/${item.id}`} state={item}>
                                    <Button size="small" variant="contained" sx={{
                                      marginLeft: "5px",
                                      padding: "5px",
                                      background: "#00cff4",
                                      "&:hover": {
                                        background: "#00cff4", // Set the same color as the default background
                                      },
                                    }}>
                                      View and Print
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
