import React from 'react'

import { useState,useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import "../production plan/production.css";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import Swal from "sweetalert2";
import ListIcon from '@mui/icons-material/List';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import NumbersIcon from '@mui/icons-material/Numbers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReorderIcon from '@mui/icons-material/Reorder';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { formatDate } from "utils";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from 'component/commen/LoadingSpinner';
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
    "& .MuiTableCell-body": {
      padding: "8px", // Adjust the value to reduce or increase space
    },
  },
});

const IssueProductionPlanList = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let url = `${APP_BASE_PATH}/getNewreadystock`;
        if (fromDate && toDate) {
          url += `?fromDate=${fromDate.format("YYYY-MM-DD")}&toDate=${toDate.format("YYYY-MM-DD")}`;
        }
        const response = await fetch(url);
        const jsonData = await response.json();
        console.log("jsonData",jsonData)
        setRows(jsonData);
        
        setFilterdata(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fromDate, toDate]);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = (event.target.value || '').toLowerCase();
    if (!filterdata) return;
    let filteredData = filterdata;
    if (fromDate && toDate) {
      filteredData = filteredData.filter((item) => {
        const planDate = dayjs(item.plan_date);
        return planDate.isSameOrAfter(fromDate) && planDate.isSameOrBefore(toDate);
      });
    }
    if (getSearch) {
      filteredData = filteredData.filter((item) => {
        const lowercaseSearch = getSearch.toLowerCase();
        return (
          (item.custname && item.custname.toLowerCase().includes(lowercaseSearch)) ||
          (item.capacity && item.capacity.toString().toLowerCase().includes(lowercaseSearch)) ||
          (item.qty && item.qty.toString().toLowerCase().includes(lowercaseSearch))
        );
      });
    }
    setRows(filteredData);
    setQuery(getSearch);
  };

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [newFieldValue, setNewFieldValue] = useState("");
  const [quantityList, setQuantityList] = useState([]);

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
let remaingqty

  const handleQuantityChange = (id, value) => {
    // Check if the input value is an integer
    if (!Number.isInteger(Number(value))) {
      // If it's not an integer, show an alert message and don't update the state
      Swal.fire({
        title: "Invalid Quantity",
        text: "Quantity should be an integer.",
        icon: "error",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      return;
    }
  
    const quantityValue = parseInt(value, 10);
    remaingqty=quantityValue
    // Find the row with the given id
    const item = rows.find(row => row.id === id);
  
    // Calculate the sum of total_qty_in_production and the inserting quantity
    const totalSum =  quantityValue  + item.remaningredyqty;
  console.log("totalSum",totalSum)
    // Check if the sum is greater than the available quantity
    // if (totalSum > rows[index].qty-rows[index].readyqty) {
    //   Swal.fire({
    //     title: "Invalid Quantity",
    //     text: "Quantity in production cannot exceed the Order quantity.",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //     animation: "true",
    //     confirmButtonColor: "red",
    //   });
    //   return;
    // }
    if (totalSum > item.qty) {
      Swal.fire({
        title: "Invalid Quantity",
        text: "Quantity in production cannot exceed the Remaning Order quantity.",
        icon: "error",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      return;
    }
    // If it's an integer and within the valid range, update the quantity list state
    setQuantityList(prevState => ({
      ...prevState,
      [id]: quantityValue,
    }));
  };
  
  const addtoProduction = async (e) => {
    e.preventDefault();
    const dataList = Object.entries(selectedRows).reduce((acc, [id, isSelected]) => {
      if (isSelected && quantityList[id] !== undefined) {
        // Find the item from rows using the id
        const item = rows.find(row => row.id === parseInt(id, 10));
        if (item) {
          // Push the item into the dataList with prod_plan_id and qty
          acc.push({ id: item.prod_plan_id, qty: quantityList[id],remaingqty });
        }
      }
      return acc;
    }, []);
    if (dataList.length === 0) {
      Swal.fire({
        title: "No data to send",
        text: "Please select rows and provide quantities.",
        icon: "warning",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "yellow",
      });
      setIsLoading(false);
      return;
    }
  
    const res = await fetch(`${APP_BASE_PATH}/addreadystockqty/${dataList[0].id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataList),
    });
    const data = res.json();

    if (res.status === 400 || !data) {
      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    }  else if(res.status === 401 || !data){
      
      Swal.fire({
        title: "Quantity is Mandatory",
        icon: "error",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      return;
    
  }else {
      Swal.fire({
        title: "Data added Successfully",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });
      navigate(-1);
    }
  };
 console.log(rows)

  const handleFromDateChange = (newValue) => {
    setFromDate(newValue);
  };
  const handleToDateChange = (newValue) => {
    setToDate(newValue);
  };

  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      <div
        className="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <h4 className="page_header">New Ready Stock</h4>
        <Link to="/readystocklist" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{background: "#00d284",
                              "&:hover": {
                                background: "#00d284", // Set the same color as the default background
                              }, }}>
            Back
          </Button>
        </Link>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 24, marginBottom: 16 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="From Date"
              inputFormat="DD/MM/YYYY"
              value={fromDate}
              sx={{ background: '#e4e9f0', minWidth: 150 }}
              onChange={handleFromDateChange}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="To Date"
              inputFormat="DD/MM/YYYY"
              value={toDate}
              sx={{ background: '#e4e9f0', minWidth: 150 }}
              onChange={handleToDateChange}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </LocalizationProvider>
          <TextField
            className="Search"
            placeholder="Search..."
            value={query}
            onChange={handlesearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
          />
        </div>
      </div>

      <Paper elevation={6} style={{ height: 550, marginTop: '1%' ,padding:'14px'}}>
        <div className={classes.root}>
          <div style={{ height: 350, width: "100%" }}>
      
            <br />
            <br />
            <TableContainer>

              <div >
              <Table className="tabel">
                    <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root">  <NumbersIcon style={{ fontSize: "16px" }} />Sr No</TableCell>
                      {/* <TableCell className="MuiTableHead-root"> <ListIcon style={{ fontSize: "16px" }} />
                        Order<br /> Quantity
                      </TableCell> */}
                      <TableCell className="MuiTableHead-root"> <ReorderIcon style={{ fontSize: "16px" }} />Production <br />Quantity</TableCell>
                      <TableCell className="MuiTableHead-root"> <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />Issued <br/> <span style={{marginLeft:'17px' }}>BOM</span> <br /><span style={{marginLeft:'15px' }}> Quantity</span></TableCell>
                      <TableCell className="MuiTableHead-root"> <TextSnippetIcon style={{ fontSize: "16px",marginRight:'2px' }} />Ready<br/>  <span style={{marginLeft:'17px' }}>Stock</span> <br /><span style={{marginLeft:'15px' }}>Quantity</span> </TableCell>
                      <TableCell className="MuiTableHead-root">   <ListIcon style={{ fontSize: "16px" }} /> Quantity</TableCell>
                      <TableCell className="MuiTableHead-root"> <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} />Customer</TableCell>
                      <TableCell className="MuiTableHead-root">  <BatteryCharging20Icon style={{ fontSize: "16px",marginRight:'2px' }} />Capacity</TableCell>
                      <TableCell className="MuiTableHead-root"> <TextFieldsIcon style={{ fontSize: "16px",marginRight:'2px' }} />Type</TableCell>
                      <TableCell
                        className="MuiTableHead-root"
                       
                      >    <ContentPasteSearchIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                        Tapping
                      </TableCell>
                      {/* <TableCell className="MuiTableHead-root">    <ContentPasteSearchIcon style={{ fontSize: "16px",marginRight:'2px' }} />Testing <br />Div</TableCell> */}
                      {/* <TableCell className="MuiTableHead-root">   <CalendarMonthIcon style={{ fontSize: "16px",marginRight:'2px' }} />Date</TableCell> */}
                      <TableCell className="MuiTableHead-root"> <ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} />Voltage <br />Ratio</TableCell>
                      <TableCell className="MuiTableHead-root"><AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action</TableCell>

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
                            key={item.id}
                          >
                            <TableCell style={{textAlign:'center'}} key={item.id}>{index + 1}</TableCell>

                            <TableCell style={{textAlign:'center'}} key={item.a}>{item.qty}</TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.a}>{item.remaningredyqty}</TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.a}>{item.readyqty}</TableCell>
                            <TableCell>
                              <TextField
                                value={quantityList[item.id] || ""}
                                onChange={(e) =>
                                  handleQuantityChange(item.id, e.target.value)
                                }
                              />
                            </TableCell>
                            {/* <TableCell key={item.a}>{item.ref_no}</TableCell> */}
                            <TableCell key={item.b}>{item.custname}</TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.c}>{item.capacity}</TableCell>
                            <TableCell key={item.d}>
                              {item.type === 1
                                ? "OUTDOOR"
                                : item.type === 2
                                  ? "INDOOR"
                                  : item.type === 3
                                  ? "OUTDOOR/INDOOR" 
                                  : ""}
                            </TableCell>
                            <TableCell key={item.x}>
                              {item.typetaping}
                            </TableCell>
                            {/* <TableCell key={item.e}>
                              {item.testing_div}
                            </TableCell> */}
                            {/* <TableCell key={item.e}>
                              {formatDate(item.orderacc_date)}
                            </TableCell> */}
                            <TableCell key={item.e}>
                              {item.priratio}/{item.secratio}V
                            </TableCell>
                            <TableCell>
                              <Link to={`/issueProductionPlanDet?id=${item.id}`}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    padding: "8px",
                                    background: "#00cff4",
                                    "&:hover": {
                                      background: "#00cff4",
                                    },
                                  }}
                                >
                                  View
                                </Button>
                              </Link>
                              &nbsp;&nbsp;
                              {/* <Checkbox
                                checked={!!selectedRows[item.id]}
                                onChange={(value) => onSelect(value, item.id)}
                              /> */}
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
          </div>
        </div>
        <Link
          style={{
            textDecoration: "none",
            float: "right",
            position: "relative",
            top: 100,
            right: 30,
          }}
        >
          <Button onClick={addtoProduction} variant="contained" sx={{  background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      }, }}>
            Add To List
          </Button>
        </Link>
      </Paper>
      </>
      )}
    </>
  )
}

export default IssueProductionPlanList