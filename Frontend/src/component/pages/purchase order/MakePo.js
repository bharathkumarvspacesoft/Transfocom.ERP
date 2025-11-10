import * as React from "react";
import { useState } from "react";
import { Button, IconButton, Grid, TextField, Box, Checkbox, FormControlLabel } from "@mui/material";
import "./purchase.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import CircularProgress from "@mui/material/CircularProgress";
import ListIcon from '@mui/icons-material/List';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import NumbersIcon from '@mui/icons-material/Numbers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import ReorderIcon from '@mui/icons-material/Reorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SearchIcon from '@mui/icons-material/Search';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "../../commen/LoadingSpinner";
import { DatePicker } from "@mui/x-date-pickers";

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      color: "#000000",
      fontSize: "1em",
      align: "center",
      fontWeight: "bold",
    },
  },
});

export default function AddStock() {
  const classes = useStyles();
  const { state } = useLocation();
  const [rows, setRows] = useState([
    {
      SrNo: "",
      code: null,
      description: "",
      unit: "",
      quantity: "",
      rate: "",
      action: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [custname, setCustname] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [podate, setPoDate] = useState(dayjs());
  const [optionList, setOptionList] = useState([]);
  const [optionsave, setOptionsave] = useState(false);
  const navigate = useNavigate();

  // New state for search and checkbox filter
  const [searchText, setSearchText] = useState("");
  const [selectFilteredItems, setSelectFilteredItems] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getindentMaterial`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(state),
        });

        const jsonData = await response.json();
        console.log("JSON", jsonData)
        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getsupplier`);
        const jsonData = await response.json();

        setSuppliers(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);

      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter rows based on search text - prioritize items that start with search text
  const filteredRows = rows
    .filter((row) => {
      if (!searchText) return row.qty !== 0;
      
      const searchLower = searchText.toLowerCase();
      return (
        row.qty !== 0 &&
        (
          (row.indentref?.toLowerCase() || "").includes(searchLower) ||
          (row.itemid?.toString() || "").includes(searchLower) ||
          (row.code?.item_code?.toLowerCase() || "").includes(searchLower) ||
          (row.description?.toLowerCase() || "").includes(searchLower) ||
          (row.unit?.toLowerCase() || "").includes(searchLower)
        )
      );
    })
    .sort((a, b) => {
      if (!searchText) return 0;
      
      const searchLower = searchText.toLowerCase();
      
      // Check if any field starts with the search text
      const aStartsWith = 
        (a.indentref?.toLowerCase() || "").startsWith(searchLower) ||
        (a.itemid?.toString() || "").startsWith(searchLower) ||
        (a.code?.item_code?.toLowerCase() || "").startsWith(searchLower) ||
        (a.description?.toLowerCase() || "").startsWith(searchLower) ||
        (a.unit?.toLowerCase() || "").startsWith(searchLower);
      
      const bStartsWith = 
        (b.indentref?.toLowerCase() || "").startsWith(searchLower) ||
        (b.itemid?.toString() || "").startsWith(searchLower) ||
        (b.code?.item_code?.toLowerCase() || "").startsWith(searchLower) ||
        (b.description?.toLowerCase() || "").startsWith(searchLower) ||
        (b.unit?.toLowerCase() || "").startsWith(searchLower);
      
      // Items that start with search text come first
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });

  // Handle checkbox to select all filtered items
  const handleSelectFilteredItems = (checked) => {
    setSelectFilteredItems(checked);
    
    if (checked) {
      // Get indices of filtered rows in the original rows array
      const updatedRows = rows.map((row) => {
        // Check if this row is in the filtered results
        const isInFiltered = filteredRows.some((filteredRow) => 
          filteredRow.indentref === row.indentref && 
          filteredRow.itemid === row.itemid
        );
        
        if (isInFiltered) {
          return { ...row, isChecked: true };
        }
        return row;
      });
      setRows(updatedRows);
    } else {
      // Uncheck all filtered items
      const updatedRows = rows.map((row) => {
        const isInFiltered = filteredRows.some((filteredRow) => 
          filteredRow.indentref === row.indentref && 
          filteredRow.itemid === row.itemid
        );
        
        if (isInFiltered) {
          return { ...row, isChecked: false };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SrNo: "",
        itemCode: "",
        description: "",
        unit: "",
        quantity: "",
        rate: "",
        action: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    const updatedData = rows.filter((item, i) => i !== index);
    setRows(updatedData);
  };

  const handleItemCode = ({ target }) => {
    fetch(`${APP_BASE_PATH}/autoItemCode/${target.value}`)
      .then((response) => response.json())
      .then((data) => {
        setOptionList(data || []);
      });
  };

  const onDataChange = (value, key, index) => {
    let dataList = [...rows];
    let data = {
      ...dataList[index],
      [key]: value,
    };
    const curdate = new Date();
    const formattedDate = curdate.toLocaleDateString("en-GB");
    dataList[index] = {
      ...data,
      ...(key === "code"
        ? {
          itemid: value?.id,
          description: value?.material_description || "",
          unit: value?.unit || "",
          uid: 1,
          date: formattedDate,
        }
        : key === "quantity" || key === "rate"
          ? { amount: (data.quantity || 0) * (data.rate || 0) }
          : {}),
    };
    setRows(dataList);
  };

  const onSupplier = (value) => {
    setSupplier(value);
    setCustname(suppliers.find(({ id }) => id === value)?.name || "");
  };

  const handleSelectAll = () => {
    const updatedRows = rows.map((row) => ({
      ...row,
      isChecked: true,
    }));
    setRows(updatedRows);
  };

  const handleDeselectAll = () => {
    const updatedRows = rows.map((row) => ({
      ...row,
      isChecked: false,
    }));
    setRows(updatedRows);
  };

  const addStock = async (e) => {
    e.preventDefault();
    setOptionsave(true)
    if (!supplier) {
      setOptionsave(false)
      alert("Please select Supplier");
      return;
    }

    const selectedItems = rows.filter((row) => row.isChecked);
    console.log("selectedItems", selectedItems);

    if (selectedItems.length === 0) {
      setOptionsave(false)
      alert("Please select at least one item");
      return;
    }

    const hasInvalidRate = selectedItems.some(
      (row) =>
        row.rate === null ||
        row.rate === undefined ||
        String(row.rate).trim() === "" ||
        isNaN(Number(row.rate)) ||
        Number(row.rate) <= 0
    );

    console.log("hasInvalidRate", hasInvalidRate);

    if (hasInvalidRate) {
      setOptionsave(false)
      alert("Please enter valid rates for all selected items.");
      return;
    }

    const params = {
      podate,
      custname,
      indentid: state[0],
      uid: rows[0].uid,
      inwardflag: 0,
      supplierid: supplier,
      indents: selectedItems,
    };

    setIsLoading(true);

    try {
      const response = await fetch(`${APP_BASE_PATH}/addPO`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error in API response:", errorMessage);

        Swal.fire({
          title: 'Error',
          text: errorMessage || 'An error occurred while processing your request.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: 'red',
        });

        setIsLoading(false);
        return;
      }

      const textResponse = await response.text();
      console.log("Data from server:", textResponse);

      if (textResponse === "POSTED") {
        Swal.fire({
          title: 'Data Added Successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: 'green',
        }).then(() => {
          navigate("/purchaseorder");
        });
      } else {
        console.log("Unexpected response:", textResponse);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred while processing your request.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'red',
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
              <h4>Add Purchase Order</h4>
            </div>
          </div>
          <Paper elevation={6} style={{ position: "relative", marginTop: 0, padding: '14px' }}>
            <Box
              sx={{
                marginTop: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "95%",
                marginLeft: "2rem",
              }}
            >
              <Box component="form" noValidate sx={{ mt: 3, width: '100%' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={2.4}>
                    <FormControl fullWidth>
                      <InputLabel id="supplier">Select Supplier</InputLabel>
                      <Select
                        labelId="supplier"
                        id="supplier"
                        label="Supplier"
                        name="supplier"
                        value={supplier}
                        onChange={(e) => onSupplier(e.target.value)}
                      >
                        {suppliers.map(({ id, name }) => (
                          <MenuItem key={id} value={id}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="PO Date"
                          format="DD-MM-YYYY"
                          value={podate}
                          onChange={(newValue) => setPoDate(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={podate ? dayjs(podate).format('DD-MM-YYYY') : ''}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4.2}>
                    <TextField
                      fullWidth
                      label="Search Items"
                      variant="outlined"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search by indent ref, item code, description..."
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectFilteredItems}
                          onChange={(e) => handleSelectFilteredItems(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Select all filtered items"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <TableContainer style={{ marginTop: '8px' }}>
              <div>
                <div className={classes.root}>
                  <Table className="tabel">
                    <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px", marginRight: '2px' }} />Sr No</TableCell>
                        <TableCell className="MuiTableHead-root">Checkbox</TableCell>
                        <TableCell className="MuiTableHead-root">
                          <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />Indent Ref No
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <TextSnippetIcon style={{ fontSize: "16px", marginRight: '2px' }} />DataBase item Id
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <DynamicFormIcon style={{ fontSize: "16px", marginRight: '2px' }} />Item Code
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <DescriptionIcon style={{ fontSize: "16px", marginRight: '2px' }} /> Description
                        </TableCell>
                        <TableCell className="MuiTableHead-root"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                        <TableCell className="MuiTableHead-root">
                          <ReorderIcon style={{ fontSize: "16px" }} />Quantity
                        </TableCell>
                        <TableCell className="MuiTableHead-root"><AttachMoneyIcon style={{ fontSize: "16px" }} />Rate</TableCell>
                        <TableCell className="MuiTableHead-root"><AutoAwesomeIcon style={{ fontSize: "16px", marginRight: '2px' }} />Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRows.map((row, displayIndex) => {
                        // Find the actual index in the original rows array
                        const actualIndex = rows.findIndex((r) => 
                          r.indentref === row.indentref && r.itemid === row.itemid
                        );
                        
                        return (
                          <TableRow className="tabelrow" key={actualIndex}>
                            <TableCell style={{ textAlign: 'center' }}>{displayIndex + 1}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={row.isChecked || false}
                                onChange={(e) => {
                                  onDataChange(e.target.checked, "isChecked", actualIndex);
                                }}
                              />
                            </TableCell>

                            <TableCell>{row.indentref}</TableCell>
                            <TableCell>{row.itemid}</TableCell>

                            <TableCell>
                              <Autocomplete
                                value={row.code}
                                onChange={(event, newValue) => {
                                  onDataChange(newValue, "code", actualIndex);
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                id="item-code"
                                options={optionList}
                                getOptionLabel={(option) => {
                                  return option.item_code;
                                }}
                                renderOption={(props, option) => (
                                  <li {...props}>{option.item_code}</li>
                                )}
                                sx={{ width: 200 }}
                                freeSolo
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label=""
                                    onChange={(e) => handleItemCode(e)}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                name="description"
                                value={row.description}
                                disabled={row.qty === 0}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                name="unit"
                                value={row.unit}
                                disabled={row.qty === 0}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                name="qty"
                                value={row.qty || ""}
                                onChange={({ target }) => {
                                  const cleanedValue = target.value.replace(/[^0-9.]/g, '');
                                  const validValue = cleanedValue.replace(/(\..*)\./g, '$1');
                                  onDataChange(validValue, "qty", actualIndex);
                                }}
                                disabled={row.qty === 0}
                              />
                            </TableCell>

                            <TableCell>
                              <input
                                type="text"
                                name="rate"
                                value={row.rate || ""}
                                onChange={({ target }) => {
                                  const cleanedValue = target.value.replace(/[^0-9.]/g, '');
                                  const validValue = cleanedValue.replace(/(\..*)\./g, '$1');
                                  onDataChange(validValue, "rate", actualIndex);
                                }}
                                disabled={row.qty === 0}
                              />
                            </TableCell>

                            <TableCell>
                              <IconButton
                                size="small"
                                title="Delete"
                                sx={{ color: "#ff0854" }}
                                onClick={() => handleDelete(actualIndex)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <br />
              <Button
                variant="contained"
                onClick={handleAddRow}
                sx={{
                  float: "right", marginRight: "15px", marginBottom: "10px", background: "#00d284",
                  "&:hover": {
                    background: "#00d284",
                  },
                }}
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSelectAll}
                sx={{ marginBottom: "10px", marginRight: "15px" }}
              >
                Select All
              </Button >
              <Button
                variant="contained"
                color="primary"
                onClick={handleDeselectAll}
                sx={{ marginBottom: "10px", marginRight: "15px" }}
              >
                Deselect All
              </Button>
              <br />
              <br />
              <Grid
                container
                spacing={-108}
                sx={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginLeft: "26rem",
                  marginBottom: "9px",
                }}
              >
                <Grid item xs={8} sm={4}>
                  <Button
                    variant="contained"
                    sx={{
                      background: "#00d284",
                      "&:hover": {
                        background: "#00d284",
                      },
                    }}
                    onClick={addStock}
                    type="submit"
                    disabled={optionsave}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item xs={8} sm={4}>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="contained"
                    sx={{
                      background: "#ff0854",
                      "&:hover": {
                        background: "#ff0854",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </TableContainer>
          </Paper>
        </>
      )}
    </>
  );
}