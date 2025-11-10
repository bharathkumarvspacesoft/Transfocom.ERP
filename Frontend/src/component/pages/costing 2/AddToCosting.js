import * as React from "react";
import { useState } from "react";
import {
  Button,
  IconButton,
  Grid,
  Box,
  TextField,
  FormControl,
  Autocomplete,
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
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentsIcon from '@mui/icons-material/Payments';
import NumbersIcon from '@mui/icons-material/Numbers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ReorderIcon from '@mui/icons-material/Reorder';
import ListIcon from '@mui/icons-material/List';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
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

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight:'bold',
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

  const handleItemCode = ({ target }) => {
    fetch(`${APP_BASE_PATH}/autoItemCode/${target.value}`)
      .then((response) => response.json())
      .then((data) => {
        setOptionlist(data || []);
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

  const [accessories, setAccessories] = useState("");
  const [labourcharges, setLabourcharges] = useState("");
  const [miscexpense, setMiscexpence] = useState("");
  const [costing_date, setCosting_date] = useState(defaultDate);
  const [oltctext, setOltctext] = useState("");

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
            description: value?.material_description || "",
            unit: value?.unit || "",
            rate:value?.rate || ""
          }
        : key === "quantity" || key === "rate"
        ? { amount: (data.quantity || 0) * (data.rate || 0) }
        : {}),
    };
    setRows(dataList);
  };

  const costing2 = async (e) => {
    e.preventDefault();
    // if (!values.costingname) {
    //   // Show an error message or handle the situation
    //   Swal.fire({
    //     title: "Costing Name is required",
    //     icon: "error",
    //     iconHtml: "",
    //     confirmButtonText: "OK",
    //     animation: "true",
    //     confirmButtonColor: "red",
    //   });
    //   return; // Stop further execution
    // }

    const capitalizedCostingName = values.costingname ? values.costingname.toUpperCase().replace(/\s/g, "") : null;
    const sanitizedCostingName = capitalCostingName.replace(/\s+/g, " ").replace(/\n/g, "");
    const obj = {
      materialList: rows,
      costing_date: costing_date,
      oltctext: oltctext,
      accessories: accessories,
      labourcharges: labourcharges,
      miscexpense: miscexpense,
      costingname: capitalizedCostingName !== null ? capitalizedCostingName : sanitizedCostingName,
      
      eid,
      uid: "1",
    };
    const res = await fetch(`${APP_BASE_PATH}/costing2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    if (res.status === 400) {
      // This means the costingname is not unique
      Swal.fire({
        title: "Costing Name is not unique",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else {
      const data = await res.json();
      if (!data) {
        Swal.fire({
          title: "Something went wrong!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      } else {
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        navigate("/costing2");
      }
    }
};
const [costname,setCostname]=useState([])
React.useEffect(() => {
  const fetchDatacostingname = async () => {
    try {
      const reqData = await fetch(`${APP_BASE_PATH}/fetchDatacostingname/${eid}`); // Replace with your API endpoint
      const resData = await reqData.json();
      setCostname(resData)
      console.log("jijijij",resData)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchDatacostingname();
}, [eid]);
  const { priratio, secratio, capacity } = state || {};
  const handleCostingNameChange = (event) => {
    const capitalizedCostingName = event.target.value.toUpperCase().replace(/\s/g, "");
    handleChange({
      target: {
        name: "costingname",
        value: capitalizedCostingName,
      },
    });
  };
  let capitalCostingName = `${costname.capacity ? costname.capacity + "KVA," : ""}
  ${costname.voltageratio ? costname.voltageratio + "V," : ""}
  ${costname.typetaping ? costname.typetaping + "," : ""}
  ${costname.matofwind ? costname.matofwind + "," : ""}
  ${costname.type ? costname.type : ""} - ${
    oltctext ? oltctext : ""
}`;
  return (
    <>
      <div class="d-flex justify-content-between">
        <div className="page_header">
          <h3>Add Costing for One Transformer</h3>
        </div>
        <Link to="/costing2">
          <Button variant="contained" sx={{backgroundColor: "#00d284" ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} >
            Back
          </Button>
        </Link>
      </div>
      <Paper elevation={6} style={{ position: "relative", marginTop: 10 ,padding:'14px'}}>
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
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: "0px",
              }}
              container
              spacing={3}
            >
              {/* <div>
                {priratio ? (
                  <label>
                    {capacity},{priratio}/{secratio}
                  </label>
                ) : null}
              </div> */}
              <TextField
  style={{ width: "570px", margin: "0 10px" }}
  fullWidth
  id="costingName"
  label="Costing Name"
  name="costingname"
  autoComplete="CostingName"
  value={values.costingname !== undefined ? values.costingname : capitalCostingName}
  onChange={handleCostingNameChange}
  onBlur={handleBlur}
  error={touched.costingname && Boolean(errors.costingname)}
  helperText={touched.costingname && errors.costingname}
/>

              <TextField
                style={{ width: "170px", margin: "0 10px" }}
                fullWidth
                id="oltctext"
                label="OLTC"
                labelprope
                name="oltctext"
                onChange={(e) => setOltctext(e.target.value)}
                autoComplete="Date"
              />
              <FormControl style={{ width: 170 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
  label="Costing Date"
  inputFormat="DD-MMM-YYYY" 
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

        <TableContainer style={{marginTop:'8px'}}>
          <div className={classes.root}>
          <Table className="tabel">
          <TableHead className="tableHeader">
                <TableRow>
                  <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>
                  <TableCell className="MuiTableHead-root"> <DynamicFormIcon style={{ fontSize: "16px" }} />Item Code</TableCell>
                  <TableCell className="MuiTableHead-root">
                  <DescriptionIcon style={{ fontSize: "16px" }} />Description
                  </TableCell>
                  <TableCell className="MuiTableHead-root"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                  <TableCell className="MuiTableHead-root"><ReorderIcon style={{ fontSize: "16px" }} />Quantity</TableCell>
                  <TableCell className="MuiTableHead-root">
                  
                  <AttachMoneyIcon style={{ fontSize: "16px" }} />Rate</TableCell>
                  <TableCell className="MuiTableHead-root">
                  
                  <PaymentsIcon style={{ fontSize: "16px" }} /> Amount</TableCell>
                  <TableCell className="MuiTableHead-root"> <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action</TableCell>
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
                        name="description"
                        value={row.description}
                        onChange={(event) =>
                          onDataChange(event.target.value, "description", index)
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
                          onDataChange(event.target.value, "quantity", index)
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
                        sx={{ color: "#ff0854",}}
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
            sx={{ float: "right", marginRight: "15px", marginTop: "10px",  background: "#00d284",
            "&:hover": {
              background: "#00d284", // Set the same color as the default background
            }, }}
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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    style={{ width: 300 }}
                    fullWidth
                    id="accessories"
                    label="Accessories"
                    labelprope
                    name="accessories"
                    onChange={(e) => setAccessories(e.target.value)}
                    autoComplete="Date"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    style={{ width: 300 }}
                    fullWidth
                    id="labourcharges"
                    label="Labour charges"
                    labelprope
                    name="labourcharges"
                    onChange={(e) => setLabourcharges(e.target.value)}
                    autoComplete="Date"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    style={{ width: 300 }}
                    fullWidth
                    id="miscexpense"
                    label="Misc Expense& Overheads"
                    labelprope
                    name="miscexpense"
                    onChange={(e) => setMiscexpence(e.target.value)}
                    autoComplete="Date"
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
              color="success"
              onClick={costing2}
              type="submit"
              style={{ marginRight: "10px", background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },}}
            >
              Save
            </Button>
            <Link to="/costing2">
            <Button variant="contained"  sx={{background: "#ff0854",
                                    "&:hover": {
                                      background: "#ff0854", // Set the same color as the default background
                                    },}}>
              Cancel
            </Button></Link>
          </Grid>
        </TableContainer>
      </Paper>
    </>
  );
}
