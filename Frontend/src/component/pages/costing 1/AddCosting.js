import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  IconButton,
  Grid,
  Box,
  TextField,
  FormControl,
  Autocomplete,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { addStockSchema } from "../../../schemas";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaymentsIcon from "@mui/icons-material/Payments";
import NumbersIcon from "@mui/icons-material/Numbers";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ReorderIcon from "@mui/icons-material/Reorder";
import ListIcon from "@mui/icons-material/List";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";
import { DatePicker } from "@mui/x-date-pickers";
import FileUploadIcon from "@mui/icons-material/FileUpload";
const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight: "bold",
      fontSize: "1em",
      align: "center",
    },
  },
});
const initialValues = {
  SrNo: "",
  itemCode: "",
  description: "",
  unit: "",
  quantity: "",
  action: "",
};

export default function EditCosting1() {
  const [rows, setRows] = useState([
    {
      SrNo: "",
      id: "",
      itemCode: "",
      description: "",
      unit: "",
      quantity: "",
      action: "",
    },
  ]);
  const [optionlist, setOptionlist] = useState([]);
  const navigate = useNavigate();

  const { search, state } = useLocation();
  const eid = new URLSearchParams(search).get("eid");
  const handleAddRow = () => {
    const id = Math.random().toString(36).substr(2, 9);
    console.log(id);
    setRows([
      ...rows,
      {
        id,
        SrNo: "",
        itemCode: "",
        description: "",
        unit: "",
        quantity: "",
        action: "",
      },
    ]);
  };
  const [costname, setCostname] = useState([]);
  React.useEffect(() => {
    const fetchDatacostingname = async () => {
      try {
        const reqData = await fetch(
          `${APP_BASE_PATH}/fetchDatacostingname/${eid}`
        ); // Replace with your API endpoint
        const resData = await reqData.json();
        setCostname(resData);
        console.log("jijijij", resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDatacostingname();
  }, [eid]);

  // const handleItemCode = ({ target }) => {
  //   fetch(`${APP_BASE_PATH}/autoItemCode/${target.value}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setOptionlist(data || []);
  //     });
  // };

  const handleItemCode = ({ target }) => {
    const inputValue = target.value.trim();

    if (inputValue === "") {
      setOptionlist([]);
      return;
    }

    fetch(`${APP_BASE_PATH}/autoItemCode/${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        // ✅ Sort so that options starting with inputValue come first
        const sorted = (data || []).sort((a, b) => {
          const aCode = a.item_code.toLowerCase();
          const bCode = b.item_code.toLowerCase();
          const val = inputValue.toLowerCase();

          const aStarts = aCode.startsWith(val);
          const bStarts = bCode.startsWith(val);

          if (aStarts && !bStarts) return -1; // a first
          if (!aStarts && bStarts) return 1;  // b first
          return aCode.localeCompare(bCode);  // alphabetical otherwise
        });

        setOptionlist(sorted);
      });
  };


  const handleitemCodeChange = (event, index) => {
    const newRows = [...rows];
    newRows[index].itemCode = event.target.value;
    setRows(newRows);
  };

  const handledescriptionChange = (event, index) => {
    const newRows = [...rows];
    newRows[index].description = event.target.value;
    setRows(newRows);
  };

  const handleunitChange = (event, index) => {
    const newRows = [...rows];
    newRows[index].unit = event.target.value;
    setRows(newRows);
  };

  const handlequantityChange = (event, index) => {
    const newRows = [...rows];
    newRows[index].quantity = event.target.value;
    setRows(newRows);
  };
  const defaultDate = dayjs();
  const classes = useStyles();
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: addStockSchema,
      onSubmit: (values, action) => {
        console.log(values);
        action.resetForm();
      },
    });

  const handleSrNoChange = (event, index) => {
    const newRows = [...rows];
    newRows[index].SrNo = event.target.value;
    setRows(newRows);
  };

  const handleDelete = (id) => {
    const filterItems = rows.filter((row) => row.id !== id);
    setRows(filterItems);
  };

  const [value, setValue] = useState(defaultDate);

  const handleDateChange = (newValue) => {
    setValue(newValue);
  };

  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [button, setButton] = useState(false);
  const [accessories, setAccessories] = useState("");
  const [labourcharges, setLabourcharges] = useState("");
  const [miscexpense, setMiscexpence] = useState("");
  const [costing_date, setCosting_date] = useState(defaultDate);
  const [oltctext, setOltctext] = useState("");
  const [costingname, setCostingname] = useState("");
  const onDataChange = (value, key, index) => {
    let dataList = [...rows];
    let data = {
      ...dataList[index],
      [key]: value,
    };
    dataList[index] = {
      ...data,
      ...(key === "code"
        ? {
          mid: value?.id,
          id: value?.id || "",
          description: value?.material_description || "",
          unit: value?.unit || "",
          rate: value?.rate || "",
        }
        : key === "quantity" || key === "rate"
          ? { amount: (data.quantity || 0) * (data.rate || 0) }
          : {}),
    };
    setRows(dataList);
  };

  // const costing2 = async (e) => {
  //   setIsLoading(true);
  //   e.preventDefault();
  //   try {
  //     const capitalizedCostingName = costingname
  //       ? costingname.toUpperCase().replace(/\s/g, "")
  //       : null;
  //     const sanitizedCostingName = capitalizedCostingName
  //       ? capitalizedCostingName.replace(/\s+/g, " ").replace(/\n/g, "")
  //       : null;

  //     const obj = {
  //       materialList: rows,
  //       costing_date: costing_date,
  //       oltctext: oltctext,
  //       accessories: accessories,
  //       labourcharges: labourcharges,
  //       miscexpense: miscexpense,
  //       costingname:
  //         capitalizedCostingName !== null
  //           ? capitalizedCostingName
  //           : sanitizedCostingName,
  //       eid,
  //       uid: "1",
  //     };

  //     const res = await fetch(`${APP_BASE_PATH}/costing1`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(obj),
  //     });

  //     if (res.status === 400) {
  //       // This means the costingname is not unique
  //       Swal.fire({
  //         title: "Costing Name is not unique",
  //         icon: "error",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "red",
  //       });
  //     } else {
  //       const data = await res.json();
  //       if (!data) {
  //         Swal.fire({
  //           title: "Something went wrong!",
  //           icon: "error",
  //           iconHtml: "",
  //           confirmButtonText: "OK",
  //           animation: "true",
  //           confirmButtonColor: "red",
  //         });
  //       } else {
  //         Swal.fire({
  //           title: "Data Added Successfully",
  //           icon: "success",
  //           iconHtml: "",
  //           confirmButtonText: "OK",
  //           animation: "true",
  //           confirmButtonColor: "green",
  //         });
  //         navigate("/costing1");
  //       }
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: "An error occurred!",
  //       text: error.message,
  //       icon: "error",
  //       iconHtml: "",
  //       confirmButtonText: "OK",
  //       animation: "true",
  //       confirmButtonColor: "red",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const costing2 = async (e) => {
    e.preventDefault();

    // Step 2: Ask for confirmation before saving
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      html: `<strong>You cannot edit  costing name later.</strong><br>Please confirm before saving.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Save It!",
      cancelButtonText: "No, Cancel",
      confirmButtonColor: "green",
      cancelButtonColor: "#ff0854",
      allowOutsideClick: false,
    });

    if (!confirmation.isConfirmed) {
      Swal.fire({
        title: "Cancelled",
        text: "Costing save operation cancelled.",
        icon: "info",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Step 3: Continue your original logic
    setIsLoading(true);
    try {
      const capitalizedCostingName = costingname
        ? costingname.toUpperCase().replace(/\s/g, "")
        : null;
      const sanitizedCostingName = capitalizedCostingName
        ? capitalizedCostingName.replace(/\s+/g, " ").replace(/\n/g, "")
        : null;

      const obj = {
        materialList: rows,
        costing_date: costing_date,
        oltctext: oltctext,
        accessories: accessories,
        labourcharges: labourcharges,
        miscexpense: miscexpense,
        costingname:
          capitalizedCostingName !== null
            ? capitalizedCostingName
            : sanitizedCostingName,
        eid,
        uid: "1",
      };

      const res = await fetch(`${APP_BASE_PATH}/costing1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      if (res.status === 400) {
        Swal.fire({
          title: "Costing Name Already Exists",
          text: "Please choose a unique costing name.",
          icon: "error",
          confirmButtonColor: "red",
        });
      } else {
        const data = await res.json();
        if (!data) {
          Swal.fire({
            title: "Something went wrong!",
            icon: "error",
            confirmButtonColor: "red",
          });
        } else {
          Swal.fire({
            title: "Success!",
            text: "Costing data added successfully.",
            icon: "success",
            confirmButtonColor: "#00d284",
          });
          navigate("/costing1");
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { priratio, secratio, capacity } = state || {};

  const handleImportItems = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      Swal.fire({
        title: "Invalid File Type",
        text: "Please upload a JSON file.",
        icon: "error",
        confirmButtonColor: "red"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!Array.isArray(importedData) || importedData.length === 0) {
          Swal.fire({
            title: "Invalid Data",
            text: "The file does not contain valid items.",
            icon: "error",
            confirmButtonColor: "red"
          });
          return;
        }

        // ✅ Map imported data exactly like onDataChange does when key === "code"
        const newRows = importedData.map((item, index) => {
          // Recreate the value object that comes from the autocomplete API
          const value = item.itemCode ? {
            item_code: item.itemCode,
            id: item.mid, // ← This is the database ID from the API
            material_description: item.description || "",
            unit: item.unit || "",
            rate: item.rate || ""
          } : null;

          // Base row data
          const rowData = {
            id: Math.random().toString(36).substr(2, 9), // Row identifier
            SrNo: index + 1,
            code: value,
            quantity: item.quantity || "",
            amount: item.amount || ""
          };

          // ✅ Apply the EXACT same logic as onDataChange when key === "code"
          // From your code: ...(key === "code" ? { mid: value?.id, id: value?.id || "", ... } : {})
          if (value) {
            return {
              ...rowData,
              mid: value.id || "",        // ✅ mid comes from value.id
              id: value.id || "",          // ✅ Also set id field
              description: value.material_description || "",
              unit: value.unit || "",
              rate: value.rate || ""
            };
          }

          return rowData;
        });

        Swal.fire({
          title: "Import Options",
          text: "Do you want to replace existing items or append to them?",
          icon: "question",
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: "Replace",
          denyButtonText: "Append",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#00d284",
          denyButtonColor: "#2196f3",
          cancelButtonColor: "#ff0854"
        }).then((result) => {
          if (result.isConfirmed) {
            setRows(newRows);
            Swal.fire({
              title: "Items Replaced!",
              text: `${newRows.length} items imported successfully.`,
              icon: "success",
              confirmButtonColor: "#00d284"
            });
          } else if (result.isDenied) {
            setRows(prevRows => [...prevRows, ...newRows]);
            Swal.fire({
              title: "Items Appended!",
              text: `${newRows.length} items added successfully.`,
              icon: "success",
              confirmButtonColor: "#00d284"
            });
          }
        });

      } catch (error) {
        console.error("Import error:", error);
        Swal.fire({
          title: "Import Failed",
          text: "Error parsing the file. Please check the file format.",
          icon: "error",
          confirmButtonColor: "red"
        });
      }
    };

    reader.readAsText(file);
    event.target.value = null;
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleCostingNameChange = (event) => {
    console.log(event, "yesss");

    const capitalizedCostingName = event.target.value
      .toUpperCase()
      .replace(/\s/g, "");
    console.log(capitalizedCostingName, "yesss");
    handleChange({
      target: {
        name: "costingname",
        value: capitalizedCostingName,
      },
    });
  };
  React.useEffect(() => {
    let capitalCostingName = `${costname.capacity ? costname.capacity + "KVA," : ""
      }
  ${costname.voltageratio ? costname.voltageratio + "V," : ""}
  ${costname.typetaping ? costname.typetaping + "," : ""}
  ${costname.matofwind ? costname.matofwind + "," : ""}
  ${costname.consumertype ? costname.consumertype + "," : ""}
  ${costname.type ? costname.type : ""}${oltctext ? oltctext : ""}
  ${costname.costingDesign ? "," + costname.costingDesign : ""} - `;

    setCostingname(capitalCostingName);
  }, [costname, oltctext]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div class="d-flex justify-content-between">
            <div className="page_header">
              <h3>Add Costing for One Transformer</h3>
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
            style={{ position: "relative", marginTop: 20, padding: "14px" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "95%",

                marginLeft: "2rem",
              }}
            >
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    marginTop: "0px",
                  }}
                  container
                  spacing={3}
                >
                  <Box style={{ width: "570px", margin: "0 0px" }}>
                    <TextField
                      fullWidth
                      size="small"
                      id="costingName"
                      label="Costing Name"
                      name="costingname"
                      autoComplete="CostingName"
                      value={costingname}
                      onChange={(e) => setCostingname(e.target.value)}
                      onBlur={handleBlur}
                      error={touched.costingname && Boolean(errors.costingname)}
                      helperText={touched.costingname && errors.costingname}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#d32f2f", // lighter red tone
                        fontWeight: "bold",
                        marginTop: "3px",
                        marginBottom: "2px",
                        display: "block",
                        textAlign: "left",
                      }}
                    >
                      *Kindly double-check the Costing Name before saving. Once
                      saved, it cannot be modified later.
                    </Typography>
                  </Box>

                  <FormControl style={{ marginLeft: 30, width: 170 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Costing Date"
                        format="DD-MM-YYYY"
                        name="edate"
                        onChange={(e) => setCosting_date(e.$d)}
                        value={value}
                        renderInput={(params) => <TextField {...params} />}
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
                      <TableCell className="MuiTableHead-root">
                        <NumbersIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Sr No
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        {" "}
                        <DynamicFormIcon style={{ fontSize: "16px" }} />
                        Item Code
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        <DescriptionIcon style={{ fontSize: "16px" }} />
                        Database <br />item id
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        <DescriptionIcon style={{ fontSize: "16px" }} />
                        Description
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        <ListIcon style={{ fontSize: "16px" }} />
                        Unit
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        <ReorderIcon style={{ fontSize: "16px" }} />
                        Quantity
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        <AttachMoneyIcon style={{ fontSize: "16px" }} />
                        Rate
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        <PaymentsIcon style={{ fontSize: "16px" }} /> Amount
                      </TableCell>
                      <TableCell className="MuiTableHead-root">
                        {" "}
                        <AutoAwesomeIcon
                          style={{ fontSize: "16px", marginRight: "2px" }}
                        />
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow className="tabelrow" key={index}>
                        <TableCell align="center">{index + 1}</TableCell>

                        <TableCell align="center" className="fetch-input">
                          <Autocomplete
                            value={row.code}
                            onChange={(event, newValue) => {
                              onDataChange(newValue, "code", index);
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id={`item-code ${index}`}
                            options={optionlist}
                            getOptionLabel={(option) => {
                              // Value selected with enter, right from the input
                              if (typeof option === "string") {
                                return option;
                              }
                              // Add "xxx" option created dynamically
                              if (option.inputValue) {
                                return option.inputValue;
                              }
                              // Regular option
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

                        <TableCell align="center">
                          <input
                            type="text"
                            name="id"
                            value={row.code ? row.id : ""}
                            onChange={(event) =>
                              onDataChange(
                                event.target.value,
                                "id",
                                index
                              )
                            }
                          />
                        </TableCell>

                        <TableCell align="center">
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
                          <input
                            type="text"
                            name="quantity"
                            value={row.quantity}
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
                          <input type="text" name="Amount" value={row.amount} />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            title="Delete"
                            sx={{ color: "#ff0854" }}
                            onClick={() => handleDelete(row.id)}
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

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                style={{ display: "none" }}
                onChange={handleImportItems}
              />
              <Button
                variant="contained"
                onClick={handleImportClick}
                startIcon={<FileUploadIcon />}
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
                Import Items
              </Button>
              <Button
                variant="contained"
                onClick={handleAddRow}
                sx={{
                  float: "right",
                  marginRight: "15px",
                  marginTop: "10px",
                  background: "#00d284",
                  "&:hover": {
                    background: "#00d284",
                  },
                }}
              >
                Add Row
              </Button>

              <Box
                sx={{
                  marginTop: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "95%",
                }}
              >
                <Box component="form" noValidate sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="accessories"
                        label="Accessories"
                        labelprope
                        name="accessories"
                        onChange={(e) => setAccessories(e.target.value)}
                        autoComplete="Date"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="labourcharges"
                        label="Labour charges"
                        labelprope
                        name="labourcharges"
                        onChange={(e) => setLabourcharges(e.target.value)}
                        autoComplete="Date"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="miscexpense"
                        label="Misc Expense& Overheads"
                        labelprope
                        name="miscexpense"
                        onChange={(e) => setMiscexpence(e.target.value)}
                        autoComplete="Date"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        id="costingName"
                        label="Type oF Taping "
                        // name="costingname"
                        // autoComplete="CostingName"
                        value={costname.typetaping}
                        // onChange={handleCostingNameChange}
                        // onBlur={handleBlur}
                        // error={
                        //   touched.costingname && Boolean(errors.costingname)
                        // }
                        // helperText={touched.costingname && errors.costingname}
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        id="costingName"
                        label="Type oF Taping Switch"
                        name="costingname"
                        autoComplete="CostingName"
                        value={costname.tapp}
                        onChange={handleCostingNameChange}
                        onBlur={handleBlur}
                        error={
                          touched.costingname && Boolean(errors.costingname)
                        }
                        helperText={touched.costingname && errors.costingname}
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
                  marginLeft: "26rem",
                  marginBottom: "9px",
                  display: "flex",
                }}
              >
                <Button
                  variant="contained"
                  onClick={costing2}
                  type="submit"
                  disabled={button}
                  style={{
                    marginRight: "10px",
                    background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },
                  }}
                >
                  Save
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
              {/* <Typography
                variant="body2"
                sx={{ color: "#ff0854", textAlign: "center", mt: 1 , fontWeight: 'bold'}}
              >
                * Once saved, you cannot edit  the costing. Please
                double-check before saving.
              </Typography> */}
            </TableContainer>
          </Paper>
        </>
      )}
    </>
  );
}
