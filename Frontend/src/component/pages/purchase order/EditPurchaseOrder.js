import * as React from "react";
import { useState } from "react";
import { Button, IconButton, Grid, TextField, Box } from "@mui/material";
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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "../../commen/LoadingSpinner";
import { DatePicker } from "@mui/x-date-pickers";
import { set } from "date-fns";

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

export default function EditPurchaseOrder() {
  const classes = useStyles();
  const { state } = useLocation();
  const [rows, setRows] = useState([
    {
      SrNo: "",
      code: null,
      dbid: "",
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
  const [cid, setCid] = useState("");
  const [costingName, setCostingName] = useState("");
  const [optionList, setOptionList] = useState([]);
  const [optionsave, setOptionsave] = useState(false);
  const [indent, setIndent] = useState(0)
  const { id } = useParams();
  const navigate = useNavigate();
  const editfetch = async () => {
    setIsLoading(true);
    try {
      const reqData = await fetch(`${APP_BASE_PATH}/getpodata/${id}`);
      const resData = await reqData.json();
      console.log("reqData", resData);

      setCid(resData.cid);
      setCostingName(resData.selectedcosting);
      setCustname(resData.custname);
      setIndent(resData.indentid);
      setSupplier(resData.supplierid);

      // ✅ Group materialList by itemid and sum qty
      const grouped = Object.values(
        (resData.materialList || []).reduce((acc, item) => {
          const { itemid } = item;
          if (!acc[itemid]) {
            acc[itemid] = { ...item };
          } else {
            // Add qty if same itemid found again
            acc[itemid].qty = Number(acc[itemid].qty) + Number(item.qty);
          }
          return acc;
        }, {})
      );

      setRows(grouped);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const editfetch = async () => {

  //   setIsLoading(true);
  //   try {
  //     const reqData = await fetch(`${APP_BASE_PATH}/getpodata/${id}`); // Replace with your API endpoint
  //     const resData = await reqData.json();
  //     console.log("reqData", resData)
  //     //   setPoDate(resData.podate)
  //     setCid(resData.cid)
  //     setCostingName(resData.selectedcosting)
  //     setCustname(resData.custname)
  //     setIndent(resData.indentid)
  //     setSupplier(resData.supplierid)
  //     setRows(resData.materialList || []);
  //     //   const jsonData = await response.json();
  //     //   console.log(jsonData)
  //     //   setRows(jsonData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  //   // finally{
  //   //   setIsLoading(false);
  //   // }
  //   // setIsLoading(true);
  // }
  useEffect(() => {
    const fetchData = async () => {

      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getsupplier`); // Replace with your API endpoint
        const jsonData = await response.json();

        setSuppliers(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);

      } finally {
        setIsLoading(false);
      }
    };
    editfetch()
    fetchData();
  }, []);


  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SrNo: "",
        itemCode: "",
        dbid: "",
        description: "",
        unit: "",
        quantity: "",
        rate: "",
        action: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    // Create a new array without the item to be deleted
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
          dbid: value?.itemid,
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

  const [selectedRows, setSelectedRows] = useState([]);

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

    // Filter out the selected rows
    const selectedItems = rows.filter((row) => row.isChecked);

    if (selectedItems.length === 0) {
      setOptionsave(false)
      alert("Please select at least one item");
      return;
    }

    // Check for empty or invalid rates in the selected rows
    const hasInvalidRate = selectedItems.some(
      (row) => row.rate === "" || isNaN(parseFloat(row.rate))
    );

    if (hasInvalidRate) {
      setOptionsave(false)
      alert("Please enter valid rates for all selected items.");
      return;
    }

    const params = {
      podate,
      custname,
      indentid: indent,
      uid: rows[0].uid,
      inwardflag: 0,
      supplierid: supplier,
      indents: selectedItems,
    };

    // Set loading state to true
    setIsLoading(true);

    try {
      const response = await fetch(`${APP_BASE_PATH}/editPO/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        // Handle error responses (e.g., status code 400, 500)
        const errorMessage = await response.text();
        console.error("Error in API response:", errorMessage);

        // Display a meaningful error message to the user
        Swal.fire({
          title: 'Error',
          text: errorMessage || 'An error occurred while processing your request.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: 'red',
        });

        // Set loading state to false
        setIsLoading(false);

        return;
      }

      // Parse the response as text
      const textResponse = await response.text();
      console.log("Data from server:", textResponse);

      if (textResponse === "POSTED") {
        // Handle success
        Swal.fire({
          title: 'Data Added Successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: 'green',
        }).then(() => {
          navigate("/purchaseorder");
        });
      } else {
        // Handle other cases if needed
        console.log("Unexpected response:", textResponse);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error:", error);
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred while processing your request.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'red',
      });
    } finally {
      // Set loading state to false
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
              <h4>Edit Purchase Order</h4>
            </div>
            <div>
              <p>
                costing ID : <b>{cid}</b><br />
                costing Name : <b>{costingName}</b>
              </p>
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
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  {/* <Grid item xs={4}> */}
                  <FormControl style={{ width: 300 }}>
                    <InputLabel id="supplier">Select Supplier</InputLabel>
                    <Select
                      labelId="supplier"
                      id="supplier"
                      label="Supplier"
                      name="supplier"
                      value={supplier}
                      sx={{ marginRight: '10%' }}
                      onChange={(e) => onSupplier(e.target.value)}
                    >
                      {suppliers.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* </Grid> */}
                  {/* <Grid item xs={4}> */}
                  <FormControl style={{ width: 300 }}>
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
                  {/* format="DD-MMM-YYYY" */}
                  {/* </Grid> */}
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
                          <DescriptionIcon style={{ fontSize: "16px", marginRight: '2px' }} /> DB ITEM ID
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
                      {rows
                        .filter((row) => row.qty !== 0) // Filter out rows with quantity equal to 0
                        .map((row, index) => (
                          <TableRow className="tabelrow" key={index}>
                            <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={row.isChecked || false}
                                onChange={(e) => {
                                  onDataChange(e.target.checked, "isChecked", index);
                                }}

                              />
                            </TableCell>

                            <TableCell style={{ textAlign: 'center' }}>{row.itemid}</TableCell>
                            <TableCell>
                              {/* <Autocomplete
            value={row.code}
            disabled={row.qty === 0}
            onChange={(event, newValue) => {
              onDataChange(newValue, "code", index);
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
                disabled={row.qty === 0}
              />
            )}
          /> */}


                              <Autocomplete
                                value={row.code}
                                onChange={(event, newValue) => {
                                  onDataChange(newValue, "code", index);
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
                                onChange={({ target }) => onDataChange(target.value, "qty", index)}
                                // Disable the input field if the quantity is 0
                                disabled={row.qty === 0}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                name="rate"
                                value={row.rate || ""}
                                // Disable the input field if the quantity is 0
                                disabled={row.qty === 0}
                                onChange={({ target }) => onDataChange(target.value, "rate", index)}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                title="Delete"
                                sx={{ color: "#ff0854" }}
                                onClick={() => handleDelete(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
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
                    background: "#00d284", // Set the same color as the default background
                  },
                }}
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSelectAll}
                sx={{ marginBottom: "10px", marginRight: "15px", marginBottom: "10px" }}
              >
                Select All
              </Button >
              <Button
                variant="contained"
                color="primary"
                onClick={handleDeselectAll}
                sx={{ marginBottom: "10px", marginRight: "15px", marginBottom: "10px" }}
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
                        background: "#00d284", // Set the same color as the default background
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
                        background: "#ff0854", // Set the same color as the default background
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