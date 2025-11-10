import * as React from "react";
import { useState, useEffect } from "react";
import { Button, IconButton, Grid, Box, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@material-ui/core/styles";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import "./costing2.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

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

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight:'bold',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editCosting2/${id}`); // Replace with your API endpoint
        const resData = await reqData.json();
        setData(resData);
        setRows(resData.materialList || []);
        handleItemCode({ target: { value: "c" } });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
  const handleDateChange = (newValue) => {
    setValue(newValue);
  
    // Format the date as per the backend's expected format
    const formattedDate = newValue.format("YYYY-MM-DD"); // Adjust the format as needed
  
    setData({ ...data, costing_date: formattedDate });
  };
  const handleEdit = (e) => {
    console.log('Event:', e);
    console.log('Updated State:', {
      ...data,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  
    setData({
      ...data,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };
  

  const handleSubmit = async (e) => {
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
    const formattedDate = dayjs(costing_date).format("YYYY-MM-DD");
    const editInputvalue = {
      materialList: rows,
      costingname:costingname,
      costing_date: formattedDate,
      oltctext: oltctext,
      accessories: accessories,
      labourcharges: labourcharges,
      miscexpense: miscexpense,
      eid,
      uid: "1",
      deletedItems,
    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateCosting2/` + id, {
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
      action: "",
      mid:""
    },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SrNo: "",
        itemCode: "",
        description: "",
        unit: "",
        quantity: "",
        action: "",
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
      mid: newValue?.id || "",
      rate:newValue?.rate || "" // Update mid based on the selected item's id
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
            unit: value?.unit || "",
            amount: (data.quantity || 0) * (data.rate || 0), // Calculate the amount based on quantity and rate
          }
        : key === "quantity" || key === "rate"
        ? { amount: (data.quantity || 0) * (data.rate || 0) } // Calculate the amount if quantity or rate is updated
        : {}),
    };
    setRows(dataList);
  };
  
  const handleItemCode = ({ target }) => {
    const inputValue = target.value;
  
    fetch(`${APP_BASE_PATH}/autoItemCode/${inputValue}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
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
    const totalAddition = amountTotal + accessoriesTotal + labourchargesTotal + miscexpenseTotal;
    // console.log("Total Addition:", totalAddition);
  
    setTotalAddition(totalAddition);
  }, [rows, data]);
  
  const { priratio, secratio, capacity } = state || {};

  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Update Costing</h4>
        </div>
        <Link to="/costing2">
          <Button variant="contained" sx={{ backgroundColor: "#00d284"  ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}}>
            Back
          </Button>
        </Link>
      </div>
      <Paper elevation={6} style={{ position: "relative",  marginTop: 10,padding:'14px'  }}>
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
  name="costingname"  // Make sure the name matches the state field
  value={data.costingname === null ? data.selectedcosting : data.costingname || ''}
  onChange={handleEdit}
  disabled={data.costingname === null}
/>



              <TextField
                style={{ width: "170px", margin: "0 10px" }}
                fullWidth
                id="customer"
                label="OLTC"
                labelprope
                name="oltctext"
                value={data.oltctext}
                onChange={handleEdit}
              />
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
               <FormControl style={{ width: 170 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}> 
                <DesktopDatePicker
  label="Costing Date"
  name="edate"
  value={dayjs(data.costing_date)} // Convert the data.costing_date to Dayjs object
  onChange={(newValue) => handleDateChange(newValue)}
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
                  <TableCell className="MuiTableHead-root">Sr No</TableCell>
                  <TableCell className="MuiTableHead-root">Item Code</TableCell>
                  <TableCell className="MuiTableHead-root">
                    Description
                  </TableCell>
                  <TableCell className="MuiTableHead-root">Unit</TableCell>
                  <TableCell className="MuiTableHead-root">Quantity</TableCell>
                  <TableCell className="MuiTableHead-root">Rate</TableCell>
                  <TableCell className="MuiTableHead-root">Amount</TableCell>
                  <TableCell className="MuiTableHead-root">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow className="tabelrow" key={index}>
                    <TableCell>
                      {index + 1}
                    </TableCell>
                    <TableCell>
        

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
                    <TableCell>
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
                          onDataChange(event.target.value, "description", index)
                        }
                      />
                    </TableCell>
                    <TableCell>
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
                    <TableCell>
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
                          onDataChange(event.target.value, "quantity", index)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {/* <input
                        type="text"
                        name="rate"
                        values={row.rate}
                        value={data.rate}
                        onChange={(event) => handlequantityChange(event, index)}
                      /> */}

                      <input
                        type="text"
                        name="Rate"
                        value={row.rate}
                        // onChange={(e) => setRate(e.target.value)}
                        // onChange={(event) => handlequantityChange(event, index)}
                        onChange={(event) =>
                          onDataChange(event.target.value, "rate", index)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {/* <input
                        type="text"
                        name="amount"
                        values={row.amount}
                        value={data.amount}
                        onChange={(event) => handlequantityChange(event, index)}
                      /> */}
                      <input type="text" name="Amount" value={row.amount} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        title="Delete"
                        style={{color: "#ff0854"}}
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
            sx={{ float: "right", marginRight: "15px", marginTop: "10px" , background: "#00d284",
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

              marginLeft: "2rem",
            }}
          >
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    style={{ width: 300, position: "relative", right: 100 }}
                    fullWidth
                    id="customer"
                    label="Accessories"
                    labelprope
                    name="accessories"
                    value={data.accessories}
                    onChange={handleEdit}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    style={{ width: 300, position: "relative", right: 50 }}
                    fullWidth
                    id="customer"
                    label="Labour charges"
                    labelprope
                    name="labourcharges"
                    value={data.labourcharges}
                    onChange={handleEdit}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    style={{ width: 300 }}
                    fullWidth
                    id="customer"
                    label="Misc Expense& Overheads"
                    labelprope
                    name="miscexpense"
                    value={data.miscexpense}
                    onChange={handleEdit}
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
              style={{ marginRight: "12px" ,background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              }, }}
            >
              Update
            </Button>
            <Link to="/costing2">
            <Button variant="contained" sx={{ background: "#ff0854",
                                    "&:hover": {
                                      background: "#ff0854", // Set the same color as the default background
                                    },}}>
              Cancel
            </Button></Link>
        
          </Grid>
          <strong style={{marginLeft:'70%',fontSize:'1.4em',fontFamily:'roboto'}}>Total Addition: {totalAddition}</strong>
        </TableContainer>
      </Paper>
    </>
  );
}
