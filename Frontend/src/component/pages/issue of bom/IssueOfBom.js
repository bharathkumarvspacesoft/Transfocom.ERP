import { useState, useEffect } from "react";
import React from "react";
import Paper from "@material-ui/core/Paper";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./issue.css";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import NumbersIcon from "@mui/icons-material/Numbers";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PersonIcon from "@mui/icons-material/Person";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LoadingSpinner from "../../commen/LoadingSpinner";

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

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      fontSize: "1em",
    },
  },
});

export default function IssueOfBom() {
  const [value, setValue] = useState(dayjs());
  const [selectAll, setSelectAll] = useState(false);
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();
  const navigate = useNavigate();

  // const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getbom`); // Replace with your API endpoint
        const jsonData = await response.json();
        setRows(jsonData);
        console.log("bom", jsonData);

        setSearch(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState([]);
  const [serialNumber, setSerialNumber] = useState(1);
  const handleFilter = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue === "") {
      setRows(search);
    } else {
      const filterResult = search.filter((item) => {
        const wo_no = (item.wo_no || "").toString().toLowerCase(); // Add checks
        const capacity = (item.capacity || "").toString().toLowerCase(); // Add checks
        const bomref = (item.bomref || "").toString().toLowerCase(); // Add checks
        const custname = (item.custname || "").toString().toLowerCase(); // Add checks
        const orderacc_date = (item.orderacc_date || "")
          .toString()
          .toLowerCase(); // Add checks
        const testing_div = (item.testing_div || "").toString().toLowerCase(); // Add checks
        const type = (item.type || "").toString().toLowerCase(); // Add checks
        const voltageratio = (item.voltageratio || "").toString().toLowerCase();
        const qty = (item.qty || "").toString().toLowerCase();
        return (
          wo_no.includes(inputValue) ||
          voltageratio.includes(inputValue) ||
          qty.includes(inputValue) ||
          type.includes(inputValue) ||
          testing_div.includes(inputValue) ||
          capacity.includes(inputValue) ||
          custname.includes(inputValue) ||
          orderacc_date.includes(inputValue) ||
          bomref.includes(inputValue)
        );
      });
      // Handle filterResult as needed

      if (filterResult.length > 0) {
        setRows(filterResult);
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
    const newPage = Math.floor((page * rowsPerPage) / newRowsPerPage); // Calculate the new page number
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); // Update the current page to the new page number
  };
  const [selectedItems, setSelectedItems] = useState([]);
  const handleSelectAll = () => {
    if (!selectAll) {
      // Select all items where the stock is greater than or equal to totqty
      const selectedIds = rows
        .filter((item) =>
          item.result.every((rowItem) => rowItem.stock >= rowItem.totqty)
        )
        .map((item) => item.id);
      setSelectedItems(selectedIds);
    } else {
      setSelectedItems([]);
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (itemId) => {
    const selectedIndex = selectedItems.indexOf(itemId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // Item was not previously selected, so add its ID to the selection
      newSelected = newSelected.concat(selectedItems, itemId);
    } else if (selectedIndex === 0) {
      // Item is the only one selected, so clear the selection
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      // Item is the last one selected, so remove its ID from the selection
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      // Item is in the middle of the selection, so remove its ID from the selection
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
      );
    }

    setSelectedItems(newSelected);
  };
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    navigate("/bomissueslect", { state: { selectedItems: selectedItems } });
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(selectedItems);
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            class="d-flex justify-content-between"
            style={{ position: "relative", bottom: 13 }}
          >
            <div className="page_header">
              <h4>Issue Of Bom</h4>
            </div>
          </div>

          {rows.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "red",
                fontSize: "1.4em",
                fontFamily: "roboto",
              }}
            >
              <p>No records found.</p>
            </div>
          ) : (
            <div className={classes.root}>
              <div style={{ height: 400 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    className="Search"
                    label="Search..."
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
                    sx={{ width: 220 }}
                  />

                  {/* <Button
                    onClick={handleOpen}
                    variant="contained"
                    disabled={selectedItems.length == 0}
                    sx={{
                      background: "#00d284",
                      "&:hover": {
                        background: "#00d284",
                      },
                    }}
                  >
                    BOM Issue
                  </Button> */}
                </div>

                <br />

                <TableContainer>
                  <div className={classes.root}>
                    <Table className="tabel">
                      <TableHead className="tableHeader">
                        <TableRow>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <NumbersIcon style={{ fontSize: "14px" }} />
                            Sr No
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <TextSnippetIcon style={{ fontSize: "14px" }} />
                            BOM Ref
                            <br />
                            &nbsp;&nbsp;&nbsp;NO
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <TextSnippetIcon style={{ fontSize: "14px" }} />
                            PROD Ref
                            <br />
                            &nbsp;&nbsp;&nbsp;No
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <PersonIcon style={{ fontSize: "14px" }} />
                            Customer
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <BatteryCharging20Icon
                              style={{ fontSize: "14px" }}
                            />
                            KVA
                          </TableCell>
                          <TableCell className="MuiTableHead-root">
                            <BatteryCharging20Icon
                              style={{ fontSize: "14px" }}
                            />
                            Costing ID
                          </TableCell>
                          {/* <TableCell className="MuiTableHead-root">
                            <BatteryCharging20Icon
                              style={{ fontSize: "14px" }}
                            />
                            Costing name
                          </TableCell> */}
                          {/* <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <TextFieldsIcon style={{ fontSize: "14px" }} />
                            Type
                          </TableCell> */}
                          {/* <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <ContentPasteSearchIcon
                              style={{ fontSize: "14px" }}
                            />
                            Testing
                            <br />
                            &nbsp;&nbsp;Div
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <CalendarMonthIcon style={{ fontSize: "14px" }} />
                            Date
                          </TableCell> */}
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <ElectricMeterIcon style={{ fontSize: "14px" }} />
                            Voltage
                            <br />
                            &nbsp;&nbsp;&nbsp;Ratio
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <ProductionQuantityLimitsIcon
                              style={{ fontSize: "14px" }}
                            />
                            PROD<br /> QTY
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <TextSnippetIcon style={{ fontSize: "14px" }} />
                            Ready<br />Stack<br />Qty
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <TextSnippetIcon style={{ fontSize: "14px" }} />
                            Challan<br />Qty
                            <br />
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <ProductionQuantityLimitsIcon
                              style={{ fontSize: "14px" }}
                            />
                            RM<br />PROD<br /> QTY
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <ProductionQuantityLimitsIcon
                              style={{ fontSize: "14px" }}
                            />
                            Rem<br />BOM<br />Qty
                          </TableCell>
                          <TableCell
                            className="MuiTableHead-root"
                            align="center"
                          >
                            <AutoAwesomeIcon style={{ fontSize: "14px" }} />
                            Action
                            {/* <FormControlLabel
                              control={
                                <Checkbox
                                  sx={{ marginLeft: "40px" }}
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                />
                              }
                            /> */}
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
                                <TableCell style={{ textAlign: "center" }}>
                                  {serialNumber + index}
                                </TableCell>

                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.i}
                                >
                                  {item.bomref}
                                </TableCell>
                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.d}
                                >
                                  {item.wo_no}
                                  <br />
                                  {formatDate(item.orderacc_date)}

                                </TableCell>
                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.a}
                                >
                                  <div className="customer-name" style={{
                                    maxWidth: '300px',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    lineHeight: '1.4',
                                    textAlign: 'left',
                                  }}>
                                    {item.custname}
                                  </div>
                                </TableCell>
                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.b}
                                >
                                  {item.capacity}
                                </TableCell>
                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.b}
                                >
                                  {item.cid}
                                </TableCell>
                                {/* <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.b}
                                >
                                  {item.selectedCosting}
                                </TableCell> */}
                                {/* <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.c}
                                >
                                  {item.type === 1 && "OUTDOOR"}
                                  {item.type === 2 && "INDOOR"}
                                  {item.type === 3 && "OUTDOOR-INDOOR"}
                                </TableCell> */}
                                {/* <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.q}
                                >
                                  {item.testing_div}
                                </TableCell> */}
                                {/* <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.e}
                                >
                                  {formatDate(item.orderacc_date)}
                                </TableCell> */}
                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.f}
                                >
                                  {item.voltageratio}
                                </TableCell>
                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.g}
                                >
                                  {item.qty}
                                </TableCell>
                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.g}
                                >
                                  {item.readyqty || 0}
                                </TableCell>
                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.g}
                                >
                                  {item.challan_qty}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }} key={item.g}>
                                  {(item.qty || 0) - ((item.readyqty || 0) + (item.challan_qty || 0) + (item.remainingbomissueqty || 0))}
                                </TableCell>

                                <TableCell
                                  style={{ textAlign: "center" }}
                                  key={item.g}
                                >
                                  {item.remainingbomissueqty}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  {item.isissue === 1 ? (
                                    <NavLink
                                      to={`/ViewBomIssued?id=${item.id}`}
                                    >
                                      {" "}
                                      <span
                                        style={{
                                          color: "green",
                                          textAlignalign: "center",
                                        }}
                                      >
                                        BOM Issued
                                      </span>
                                    </NavLink>
                                  ) : (
                                    <NavLink
                                      to={`/BomIssue?id=${item.id}`}
                                      style={{ width: "1%" }}
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
                                        BOM Issue
                                      </Button>
                                    </NavLink>
                                  )}
                                  {/* <Checkbox
                                    align="center"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelect(item.id)}
                                    disabled={
                                      !item.result.every(
                                        (rowItem) =>
                                          rowItem.stock >= rowItem.totqty
                                      )
                                    }
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
