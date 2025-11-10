import * as React from "react";
import { useState } from "react";
import { Button, IconButton, Grid, TextField } from "@mui/material";
import "./addstock.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import Autocomplete from "@mui/material/Autocomplete";
import { Link } from "react-router-dom";
import ListIcon from '@mui/icons-material/List';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import NumbersIcon from '@mui/icons-material/Numbers';
import DescriptionIcon from '@mui/icons-material/Description';
import ReorderIcon from '@mui/icons-material/Reorder';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import { set } from "date-fns";

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight:'bold',
      fontSize: "1em",
      align: "center",
    },
  },
});

export default function AddStock() {
  const classes = useStyles();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const uid = userData ? Number(userData.id) : 1;
  console.log("Frontend - uid:", uid);
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
  const [optionList, setOptionList] = useState([]);
  const [button, setButton] = useState(false);
  const navigate = useNavigate();

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
  };

  const handleDelete = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
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
            uid: uid,
            date: formattedDate,
          }
        : key === "quantity" || key === "rate"
        ? { amount: (data.quantity || 0) * (data.rate || 0) }
        : {}),
    };
    setRows(dataList);
  };

  const addStock = async (e) => {
    e.preventDefault();
    console.log("Rows:", rows);
    setButton(true);

    const isEmpty = rows.some((row) => {
      const itemCode = (row.code && row.code.item_code || '').trim();
      const description = (row.description || '').trim();
      const qty = (row.qty || '').trim();
      return !itemCode || !description || !qty;
    });

    console.log("isEmpty:", isEmpty);

    if (isEmpty) {
      Swal.fire({
        title: "Please fill in all fields",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "orange",
      });
      setButton(false);
      return;
    }

    const res = await fetch(`${APP_BASE_PATH}/addStock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    });

    if (res.status === 400) {
      const errorData = await res.text();
      console.log("Server validation error:", errorData);
      Swal.fire({
        title: "Server validation error",
        text: errorData,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      setButton(false);
    } else {
      const data = await res.text();
      console.log("Successful response data:", data);
      setRows([
        {
          SrNo: "",
          itemCode: "",
          description: "",
          unit: "",
          quantity: "",
          action: "",
        },
      ]);
      Swal.fire({
        title: "Data Added Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
      setButton(false);
    }
  };
  
  
  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          {/* <h4>Add Stock</h4> */}
          <h4>Material Inward</h4>
        </div>
      </div>
      <Paper elevation={6} style={{ position: "relative", marginTop: 0,padding:'14px' }}>
        <TableContainer>
          <div>
            <div className={classes.root}>
            <Table className="tabel">
                    <TableHead className="tableHeader">
                  <TableRow>
                    <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>
                    <TableCell className="MuiTableHead-root">
                    <DynamicFormIcon style={{ fontSize: "16px",marginRight:'2px' }} />Item Code
                    </TableCell>
                    <TableCell className="MuiTableHead-root">
                    <DescriptionIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Description
                    </TableCell>
                    <TableCell className="MuiTableHead-root"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                    <TableCell className="MuiTableHead-root">
                    <ReorderIcon style={{ fontSize: "16px" }} />Quantity
                    </TableCell>
                    <TableCell className="MuiTableHead-root"><AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow   className="tabelrow" key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">
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
                      <TableCell align="center">
                        <input
                          type="text"
                          name="description"
                          value={row.description}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <input type="text" name="unit" value={row.unit} />
                      </TableCell>
                      <TableCell align="center">
                        <input
                          type="text"
                          name="qty"
                          value={row.qty || ""}
                          onChange={({ target }) =>
                            onDataChange(target.value, "qty", index)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          title="Delete"
                         sx={{color:'#ff0854'}}
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
            sx={{ float: "right", marginRight: "15px", marginBottom: "10px", backgroundColor: "#00d284"  ,"&:hover": {
              background: "#00d284", // Set the same color as the default background
            },}}
          >
            Add Row
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
                sx={{backgroundColor: "#00d284"  ,"&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },}}
                onClick={addStock}
                type="submit"
                disabled={button}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={8} sm={4}>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{background: "#ff0854",
                                    "&:hover": {
                                      background: "#ff0854", // Set the same color as the default background
                                    },}}>
                Cancel
              </Button>
              </Link>
            </Grid>
          </Grid>
        </TableContainer>
      </Paper>
    </>
  );
}
