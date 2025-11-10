import * as React from "react";
import { useState, useEffect } from "react";
import { Button, IconButton, Grid, Box, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import "./costing1.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
// import { DatePicker } from "@mui/x-date-pickers";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import { FormControl } from "@mui/base";
import LoadingSpinner from "component/commen/LoadingSpinner";
import { DatePicker } from "@mui/x-date-pickers";

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight: "bold",
      fontSize: "1em",
      align: "center",
    },
  },
});

export default function EditCosting1() {

  const [optionlist, setOptionlist] = useState([]);
  const [data, setData] = useState({
    id: "",
    costing_date: "",
    oltctext: "",
    accessories: "",
    labourcharges: "",
    miscexpense: "",
    quantity: "",
    rate: "",
    amount: "",
    description: "",
    unit: "",
  });

  const [deletedItems, setDeletedItems] = useState([]);

  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editCosting1/${id}`); // Replace with your API endpoint
        const resData = await reqData.json();
        setData(resData);
        console.log("data", resData);
        const parsedDate = dayjs(resData.costing_date, "DD-MM-YYYY");
        setValue(parsedDate);
        setRows(resData.materialList || []);
        handleItemCode({ target: { value: "c" } });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);
  const handleDateChange = (newValue) => {
    setValue(newValue);

    // Format the date as per the backend's expected format
    const formattedDate = newValue.format("DD-MM-YYYY"); // Adjust the format as needed

    setData({ ...data, costing_date: formattedDate });
  };
  const handleEdit = (e) => {
    console.log("Event:", e);
    console.log("Updated State:", {
      ...data,
      [e.target.name]: e.target.value.toUpperCase(),
    });

    setData({
      ...data,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const {
      costingname,
      costing_date,
      oltctext,
      accessories,
      labourcharges,
      miscexpense,
      eid,
    } = data;

    const editInputvalue = {
      materialList: rows,
      costingname: costingname,
      costing_date: costing_date,
      oltctext: oltctext,
      accessories: accessories,
      labourcharges: labourcharges,
      miscexpense: miscexpense,
      eid,
      uid: "1",
      deletedItems,
    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateCosting1/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editInputvalue),
      });

      const resjson = await res.json();
      if (res.status === 400 || !resjson) {
        Swal.fire({
          title: "Please Fill Data!!!!",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }
    } catch {
      Swal.fire({
        title: "Data Updated Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const [rows, setRows] = useState([
    {
      SrNo: "",
      code: null,
      description: "",
      unit: "",
      quantity: "",
      rate: "",
      amount: "",
      mid: "",
    },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        itemCode: "",
        description: "",
        unit: "",
        quantity: "",
        rate: "",
        amount: "",
      },
    ]);
    console.log("Updated Rows After Adding:", rows); // Add this line
  };

  const handleitemCodeChange = (newValue, key, index) => {
    const newRows = [...rows];

    newRows[index] = {
      ...newRows[index],
      [key]: newValue,
      description: newValue?.material_description || "",
      unit: newValue?.unit || "",
      rate: newValue?.rate || "",
      mid: newValue?.id || "", // Update mid based on the selected item's id
    };

    setRows(newRows);
  };

  const classes = useStyles();

  const handleDelete = (id, index) => {
    const filterItems = [...rows];
    filterItems.splice(index, 1);
    setRows([...filterItems]);
    if (id) {
      setDeletedItems((prev) => [...prev, id]);
    }
    console.log("Updated Rows After Deletion:", filterItems); // Add this line
  };

  const [value, setValue] = useState(dayjs());

  const onDataChange = (value, key, index) => {
    console.log("jijiji", rows);
    let dataList = [...rows];
    let data = {
      ...dataList[index],
      [key]: value,
    };
    dataList[index] = {
      ...data,
      ...(key === "code"
        ? {
          code: value,
          description: value?.material_description || "",
          rate: value?.rate || "",
          unit: value?.unit || "",

          amount: (data.quantity || 0) * (data.rate || 0), // Calculate the amount based on quantity and rate
        }
        : key === "quantity" || key === "rate"
          ? { amount: (data.quantity || 0) * (data.rate || 0) } // Calculate the amount if quantity or rate is updated
          : {}),
    };
    console.log("hiiiii", dataList);
    setRows(dataList);
  };
  const handleItemCode = ({ target }) => {
    const inputValue = target.value;

    // Fetch item code options based on inputValue
    fetch(`${APP_BASE_PATH}/autoItemCode/${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("hoooo", data);
        setOptionlist(data || []);
      });
  };

  const [totalAddition, setTotalAddition] = useState(0);
  useEffect(() => {
    let amountTotal = 0;
    let accessoriesTotal = 0;
    let labourchargesTotal = 0;
    let miscexpenseTotal = 0;

    for (const row of rows) {
      const amount = parseFloat(row.amount) || 0;
      amountTotal += amount;
    }

    accessoriesTotal = parseFloat(data.accessories) || 0;
    labourchargesTotal = parseFloat(data.labourcharges) || 0;
    miscexpenseTotal = parseFloat(data.miscexpense) || 0;

    // console.log("Amount Total:", amountTotal);
    // console.log("Accessories Total:", accessoriesTotal);
    // console.log("Labour Charges Total:", labourchargesTotal);
    // console.log("Misc Expense Total:", miscexpenseTotal);

    // Calculate the addition of all totals
    const totalAddition =
      amountTotal + accessoriesTotal + labourchargesTotal + miscexpenseTotal;
    // console.log("Total Addition:", totalAddition);

    setTotalAddition(totalAddition);
  }, [rows, data]);

  const { priratio, secratio, capacity } = state || {};

  const handleExportItems = () => {
    const exportData = rows
      .filter(row => row.code || row.description || row.quantity)
      .map(row => ({
        itemCode: row.code?.item_code || "",
        mid: row.mid || "",
        description: row.description || "",
        unit: row.unit || "",
        quantity: row.quantity || "",
        rate: row.rate || "",
        amount: row.amount || ""
      }));

    if (exportData.length === 0) {
      Swal.fire({
        title: "No Items to Export",
        text: "Please add items before exporting.",
        icon: "warning",
        confirmButtonColor: "#ff0854"
      });
      return;
    }

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `costing_items_${dayjs().format("DD-MM-YYYY_HHmmss")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Swal.fire({
      title: "Export Successful!",
      text: `${exportData.length} items exported successfully.`,
      icon: "success",
      confirmButtonColor: "#00d284"
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
              <h4>Update Costing</h4>
            </div>
            <Link to="/costing1">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#00d284",
                  "&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },
                }}
              >
                Back
              </Button>
            </Link>
          </div>
          <Paper
            elevation={6}
            style={{ position: "relative", marginTop: 10, padding: "14px" }}
          >
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
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <Grid
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                  container
                  spacing={1}
                >
                  {/* <div style={{ paddingTop: "15px" }}>
                {priratio ? (
                  <label>
                    {capacity},{priratio}/{secratio}
                  </label>
                ) : null}
              </div> */}
                  <TextField
                    style={{ width: "570px", margin: "0 10px" }}
                    fullWidth
                    id="customer"
                    label="Costing Name"
                    name="costingname" // Make sure the name matches the state field
                    value={
                      data.costingname === null
                        ? data.selectedcosting
                        : data.costingname || ""
                    }
                    onChange={handleEdit}
                    disabled={true}
                  />

                  {/* <TextField
                style={{ width: "170px", margin: "0 10px" }}
                fullWidth
                id="customer"
                label="OLTC"
                labelprope
                name="oltctext"
                value={data.oltctext}
                onChange={handleEdit}
                disabled
              /> */}
                  {/* <TextField
                style={{ width: "270px" }}
                fullWidth
                id="customer"
                label="Costing Date"
                labelprope
                name="costing_date"
                value={data.costing_date}
                onChange={handleEdit}
              /> */}
                  <FormControl style={{ marginLeft: 30, width: 170 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Costing Date"
                        name="costing_date"
                        format="DD-MM-YYYY"
                        value={value} // Convert the data.costing_date to Dayjs object
                        onChange={(newValue) => handleDateChange(newValue)}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
              </Box>
            </Box>

            <TableContainer style={{ marginTop: "8px" }}>
              <div className={classes.root}>
                <Table className="tabel">
                  <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root">Sr No</TableCell>
                      <TableCell className="MuiTableHead-root">
                        Item Code
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        DB Item Id
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        Description
                      </TableCell>
                      <TableCell className="MuiTableHead-root">Unit</TableCell>
                      <TableCell className="MuiTableHead-root">
                        Quantity
                      </TableCell>
                      <TableCell className="MuiTableHead-root">Rate</TableCell>
                      <TableCell className="MuiTableHead-root">
                        Amount
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow className="tabelrow" key={index}>
                        <TableCell align="center">
                          {/* <input
                        type="text"
                        name="SrNo"
                        style={{ width: 40 }}
                        values={row.SrNo}
                        value={data.id}
                        onChange={(event) => handleClick(event, index)}
                      /> */}
                          {index + 1}
                        </TableCell>
                        <TableCell align="center">
                          {/* <input
                        type="text"
                        style={{ width: 90 }}
                        name="item_code"
                        values={row.itemCode}
                        value={data.item_code}
                        onChange={(event) => handleitemCodeChange(event, index)}
                      /> */}

                          <Autocomplete
                            value={row.code}
                            onChange={(event, newValue) => {
                              handleitemCodeChange(newValue, "itemCode", index);
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id={`item-code ${index}`}
                            options={optionlist}
                            getOptionLabel={(option) => option.item_code}
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
                        <TableCell align="center">
                          <p className="border rounded px-2 py-1 bg-gray-100">
                            {row.mid}
                          </p>
                        </TableCell>
                        <TableCell align="center">
                          {/* <input
                        type="text"
                        name="material_description"
                        values={row.description}
                        value={data.material_description}
                        onChange={(event) =>
                          handledescriptionChange(event, index)
                        }
                      /> */}

                          <input
                            type="text"
                            name="description"
                            value={row.description}
                            onChange={(event) =>
                              onDataChange(
                                event.target.value,
                                "description",
                                index
                              )
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          {/* <input
                        type="text"
                        name="unit"
                        style={{ width: 90 }}
                        values={row.unit}
                        value={data.unit}
                        onChange={(event) => handleunitChange(event, index)}
                        onTimeUpdate={handleEdit}
                      /> */}

                          <input
                            type="text"
                            name="unit"
                            style={{ width: 90 }}
                            value={row.unit}
                            onChange={(event) =>
                              onDataChange(event.target.value, "unit", index)
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          {/* <input
                        type="text"
                        name="quantity"
                        values={row.quantity}
                        value={data.quantity}
                        onChange={(event) => handlequantityChange(event, index)}
                      /> */}

                          <input
                            type="text"
                            name="quantity"
                            value={row.quantity}
                            // onChange={(e) => setQuantity(e.target.value)}
                            // onChange={(event) => handlequantityChange(event, index)}
                            onChange={(event) =>
                              onDataChange(
                                event.target.value,
                                "quantity",
                                index
                              )
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          {/* <input
                        type="text"
                        name="rate"
                        values={row.rate}
                        value={data.rate}
                        onChange={(event) => handlequantityChange(event, index)}
                      /> */}

                          {/* <input
                        type="text"
                        name="Rate"
                        value={row.rate}
                        // onChange={(e) => setRate(e.target.value)}
                        // onChange={(event) => handlequantityChange(event, index)}
                        onChange={(event) =>
                          onDataChange(event.target.value, "rate", index)
                        }
                      /> */}
                          <input
                            type="text"
                            name="Rate"
                            value={row.rate}
                            onChange={(event) =>
                              onDataChange(event.target.value, "rate", index)
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          {/* <input
                        type="text"
                        name="amount"
                        values={row.amount}
                        value={data.amount}
                        onChange={(event) => handlequantityChange(event, index)}
                      /> */}
                          <input type="text" name="Amount" value={row.amount} />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            title="Delete"
                            style={{ color: "#ff0854" }}
                            onClick={() => handleDelete(row.id, index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                variant="contained"
                onClick={handleAddRow}
                sx={{
                  float: "right",
                  marginRight: "15px",
                  marginTop: "10px",
                  background: "#00d284",
                  "&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },
                }}
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                onClick={handleExportItems}
                startIcon={<FileDownloadIcon />}
                sx={{
                  float: "right",
                  marginRight: "15px",
                  marginTop: "10px",
                  background: "#2196f3",
                  "&:hover": {
                    background: "#1976d2",
                  },
                }}
              >
                Export Items
              </Button>

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
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="customer"
                        label="Accessories"
                        labelprope
                        name="accessories"
                        value={data.accessories}
                        onChange={handleEdit}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="customer"
                        label="Labour charges"
                        labelprope
                        name="labourcharges"
                        value={data.labourcharges}
                        onChange={handleEdit}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="customer"
                        label="Misc Expense& Overheads"
                        labelprope
                        name="miscexpense"
                        value={data.miscexpense}
                        onChange={handleEdit}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="Type Of Taping Switch"
                        label="Type Of Taping Switch"
                        name="Type Of Taping Switch"
                        value={
                          data.tapingSwitch?.toLowerCase() === "nottaping"
                            ? "NO TAPPING"
                            : `${data.tapingSwitch?.toUpperCase() ?? ""} :- ${data.typetapping ?? ""}`
                        }
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <br />
              <Grid
                container
                spacing={-108}
                sx={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginLeft: "33rem",
                  marginBottom: "9px",
                  display: "flex",
                  width: "22%",
                }}
              >
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="success"
                  type="submit"
                  style={{
                    marginRight: "12px",
                    background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },
                  }}
                >
                  Update
                </Button>
                <Link to="/costing1">
                  <Button
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
                </Link>
              </Grid>
              <strong
                style={{
                  marginLeft: "70%",
                  fontSize: "1.4em",
                  fontFamily: "roboto",
                }}
              >
                Total Addition: {totalAddition}
              </strong>
            </TableContainer>
          </Paper>
        </>
      )}
    </>
  );
}
