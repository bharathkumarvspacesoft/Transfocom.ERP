import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, Checkbox, IconButton } from "@mui/material";
import "./purchase.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import NumbersIcon from '@mui/icons-material/Numbers';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { CheckBox } from "@material-ui/icons";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight:"bold"
    },
  },
});


export default function AddPurchaseOrder() {
  const [value, setValue] = useState(dayjs());
  const [selectedRows, setSelectedRows] = useState({});

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getindentForPO`);
      const jsonData = await response.json();
      setFilterdata(jsonData);
      
      // Reverse the data array before setting the rows
      setRows(jsonData.slice().reverse());
      setPage(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setIsLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchData();
  }, []);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    let searchdata;
  
    if (getSearch.length > 0) {
      searchdata = filterdata.filter((item) =>
        item.indentref.toLowerCase().includes(getSearch)
      );
    } else {
      searchdata = filterdata;
    }
  
    // Reverse the array to display newest entries on top
    setRows(searchdata.slice().reverse());
  
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

  const onSelect = (value, index) => {
    setSelectedRows((prevState) => ({
      ...prevState,
      [index]: value.target.checked,
    }));
  };

//  const onMakePo = async (e) => {
//   e.preventDefault();
//   let dataList = [];
//   rows.forEach((listval) => {
//     if (selectedRows[listval.id]) {
//       dataList = [...dataList, listval.id];
//     }
//   });

//   // Only navigate to "makePo" if there are selected items
//   if (dataList.length > 0) {
//     navigate("/makePo", { state: dataList });
//   }
// };
const addpo=()=>{
  navigate('/addpo')
}
const onMakePo = async (e) => {
  e.preventDefault();
  let dataList = [];
  rows.forEach((listval) => {
    if (selectedRows[listval.id]) {
      dataList = [...dataList, listval.id];
      navigate("/makePo", { state: dataList });
    }
  });

  // Check if there are any selected items with quantity > 0
  const hasValidItems = dataList.some((id) => rows.find((item) => item.id === id)?.qty > 0);

  if (hasValidItems) {
    // Send the data to the server to add the purchase order
    const response = await fetch(`${APP_BASE_PATH}/addPO`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Add the relevant data here...
      }),
    });

    const responseData = await response.json();

    // Check if the response contains a "message" key with value "POSTED"
    if (responseData.message === "POSTED") {
      // Display an alert when there are no remaining items with quantity > 0
      alert("All items have insufficient quantity in indent_details.");
    }

    // Navigate to "makePo" or handle the response accordingly
    // ...
  } else {
    alert("Please select items with quantity greater than 0.");
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
          <h4>Add Purchase Order </h4>
        </div>
        <Link to="/purchaseorder" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ backgroundColor: "#00d284" ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}}>
            Back
          </Button>
        </Link>
      </div>

      
        <div className={classes.root}>
      

          <br />
          <div style={{ height: 500, width: "100%" }}>
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
            <br />
            <TableContainer>

              <div className={classes.root}>
              <Table className="tabel">
                    <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>
                      <TableCell className="MuiTableHead-root">
                      <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />Indent Ref
                      </TableCell>
                      <TableCell className="MuiTableHead-root"><CalendarMonthIcon style={{ fontSize: "16px",marginRight:'2px' }} />Date</TableCell>
                      <TableCell className="MuiTableHead-root">
                      <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                  {rows
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((item) => {
                        return (
                          <TableRow
                          className="tabelrow"
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.code}
                          >
                            <TableCell align="center" key={item.id}>{item.id}</TableCell>
                            <TableCell align="center" key={item.d}>{item.indentref}</TableCell>
                            <TableCell align="center" key={item.i}>{item.date}</TableCell>
                            <TableCell align="center">
                              Add to PO
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
              </div>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[3, 6]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <br />
            <Button
              variant="contained"
              color="warning"
              onClick={onMakePo}
              sx={{ float: "right", marginRight: "15px", marginBottom: "10px" ,backgroundColor: "#00d284"  ,"&:hover": {
                background: "#00d284", // Set the same color as the default background
              },}}
            >
              Make PO
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={addpo}
              sx={{  marginLeft: "70%", marginBottom: "10px" ,backgroundColor: "#00d284"  ,"&:hover": {
                background: "#00d284", // Set the same color as the default background
              },}}
            >
              Make Po Without Indent
            </Button>
          </div>
        </div>
      
      </>
      )}
    </>
  );
}
