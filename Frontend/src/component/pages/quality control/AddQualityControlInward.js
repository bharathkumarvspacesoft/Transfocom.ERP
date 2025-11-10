import * as React from "react";
import { useState } from "react";
import { Button, IconButton, Grid, TextField, Box } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import CircularProgress from "@mui/material/CircularProgress";
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
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import ListIcon from '@mui/icons-material/List';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import NumbersIcon from '@mui/icons-material/Numbers';
import DescriptionIcon from '@mui/icons-material/Description';
import ReorderIcon from '@mui/icons-material/Reorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LoadingSpinner from "component/commen/LoadingSpinner";
import { DatePicker } from "@mui/x-date-pickers";
const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight: 'bold',
      fontSize: "1em",
      align: "center",
    },
  },
});

export default function AddStock() {
  const classes = useStyles();
  const { state } = useLocation();
  const [rows, setRows] = useState([
    {
      SrNo: "",
      code: "",
      description: "",
      unit: "",
      quantity: "",
      action: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [custname, setCustname] = useState("");
  const [date, setPoDate] = useState(new Date().toLocaleDateString("en-GB"));
  const [optionList, setOptionList] = useState([]);
  const navigate = useNavigate();
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const miid = new URLSearchParams(search).get("miid");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {

        const response = await fetch(`${APP_BASE_PATH}/getPoDetailforqualitycontrol/${id}${miid ? `?miid=${miid}` : ''}`); // Replace with your API endpoint
        const jsonData = await response.json();
        setRows(jsonData);
        console.log("rrrrr", jsonData)
        setCustname(jsonData[0]?.custname || "");

      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (index) => {
    const filterItems = rows.splice(index, 1);
    setRows([...filterItems]);
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
          itemCode: value?.item_code || "",
          itemid: value?.id,
          description: value?.material_description || "",
          unit: value?.unit || "",
          miid: value?.miid,
          date: formattedDate,
        }
        : key === "quantity" || key === "rate"
          ? { amount: (data.quantity || 0) * (data.rate || 0) }
          : key === "accqty"
            ? { rejqty: data.materialaccqty - data.accqty }
            : {}),
    };

    dataList[index].status =
      dataList[index].accqty === dataList[index].qty ? 2 : 1;

    setRows(dataList);
  };


  const addStock = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Disable items where accqty is equal to qty
    const enabledRows = rows.map((row) => ({
      ...row,
      disabled: row.materialaccqty == 0,
    }));



    const status = 2;

    // Loop through each item
    for (const row of enabledRows) {
      // Check if accqty is not equal to qty



      // Show an alert for accqty greater than materialinwardqty
      if (parseInt(row.accqty, 10) > parseInt(row.materialaccqty, 10)) {
        Swal.fire({
          title: "Error",
          text: "Accqty should be less than or equal to GRN QTY",
          icon: "error",
        });
        setIsLoading(false);

        return; // Exit the function, don't proceed to the backend request
      }
      console.log("after accqty:", row.accqty, typeof row.accqty);
      console.log(" after materialaccqty:", row.materialaccqty, typeof row.materialaccqty);

      break;

    }

    if (
      enabledRows.some(
        (row) =>
          parseInt(row.accqty, 10) >
          parseInt(row.materialaccqty, 10)
      )
    ) {
      Swal.fire({
        title: "Error",
        text: "Accepted QTY Should Be Less Then GRN QTY",
        icon: "error",
      });
      setIsLoading(false);
      return; // Exit the function, don't proceed to the backend request
    }


    const params = {
      date,
      supplierid: enabledRows[0]?.supplierid,
      poid: id,
      uid: rows[0].uid,
      materialList: enabledRows,
      miid: enabledRows[0]?.miid, // Use enabledRows instead of rows
      status,
      ...rows,
      materialaccqty: rows.materialaccqty,

      // Set the status based on the condition
    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/addqualityInward`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const resText = await res.text(); // Use text() instead of json()

      // Handle the response based on its content
      if (resText === "POSTED") {
        // Handle the "POSTED" response
        console.log("Data Added Successfully!");

        // Swal notification for success
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });

        // Navigate to the desired location
        navigate("/qualityControl");
      } else if (res.status === 400) {
        Swal.fire({
          title: "Warning",
          text: "Accqty should be greater than 0!",
          icon: "error",
        });
      }

      else {
        // Handle other responses or errors
        console.log("Something went wrong!");

        // Swal notification for error
        Swal.fire({
          title: "Error",
          text: "Something went wrong!",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error adding data:", error);

      // Swal notification for error
      Swal.fire({
        title: "Error",
        text: "Something went wrong!",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setPoDate(dayjs(date).format("DD/MM/YYYY"));
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
              <h4>Add Quality Control</h4>
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
                {/* <Grid container spacing={2}> */}
                {/* <Grid item xs={4}> */}
                <FormControl style={{ width: 300 }}>
                  <TextField
                    label="Supplier"
                    autoFocus
                    value={custname}
                    sx={{ marginRight: '10%' }}
                    disabled
                  />
                </FormControl>
                {/* </Grid> */}
                {/* <Grid item xs={4}> */}
                <FormControl style={{ width: 300 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Inward Date"
                      format="DD-MM-YYYY"
                      name="edate"
                      onChange={(e) => handleDateChange(e.$d)}
                      id="edate"
                      defaultValue={dayjs(new Date())}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
                {/* </Grid> */}
                {/* </Grid> */}
              </Box>
            </Box>
            <TableContainer style={{ marginTop: '8px' }}>

              <div>
                <div className={classes.root}>
                  <Table className="tabel">
                    <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px" }} />Sr<br /><span style={{ marginLeft: '10px' }}>No</span></TableCell>
                        <TableCell className="MuiTableHead-root">
                          <DynamicFormIcon style={{ fontSize: "16px", marginRight: '2px' }} />DB Item Id
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <DynamicFormIcon style={{ fontSize: "16px", marginRight: '2px' }} />Item Code
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <DescriptionIcon style={{ fontSize: "16px" }} /> Description
                        </TableCell>
                        <TableCell className="MuiTableHead-root"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                        {/* <TableCell className="MuiTableHead-root">PO QTY</TableCell> */}
                        {/* <TableCell className="MuiTableHead-root">Material Inward QTY</TableCell> */}
                        <TableCell className="MuiTableHead-root"><ReorderIcon style={{ fontSize: "16px" }} />GRN<br />QTY</TableCell>
                        <TableCell className="MuiTableHead-root">
                          <DoneAllIcon style={{ fontSize: "16px" }} />  Accepted <br />QTY
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <RemoveDoneIcon style={{ fontSize: "16px" }} />  Rejected<br /> QTY
                        </TableCell>
                        {/* <TableCell className="MuiTableHead-root">Rate</TableCell> */}
                        {/* <TableCell className="MuiTableHead-root"><AutoAwesomeIcon style={{ fontSize: "16px", marginRight: '2px' }} />Action</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow className="tabelrow" key={index}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{row.itemid}</TableCell>
                          <TableCell align="center">
                            <Autocomplete

                              value={row.code} // Make sure 'row.code' is set correctly
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
                              sx={{ width: 150 }}
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
                            <input type="text" style={{ width: '50px' }} name="unit" value={row.unit} />
                          </TableCell>
                          {/* <TableCell>
                        <input
                          type="text"
                          name="qty"
                          value={row.qty}
                          onChange={({ target }) =>
                            onDataChange(target.value, "qty", index)
                          }
                          disabled={row.accqty === row.materialinwardqty}
                        />
                      </TableCell> */}
                          <TableCell align="center">
                            <input
                              type="text"
                              name="qty"
                              value={row.materialaccqty}
                              style={{ width: '50px' }}
                              onChange={({ target }) =>
                                onDataChange(target.value, "qty", index)
                              }
                              disabled={row.materialaccqty == 0}
                            />
                          </TableCell>
                          {/* <TableCell align="center">
                            <input
                              type="text"
                              name="accqty"
                              value={row.accqty}
                              onChange={({ target }) =>
                                onDataChange(target.value, "accqty", index)
                              }
                              disabled={row.materialaccqty == 0}
                            />
                          </TableCell> */}
                          <TableCell align="center">
                            <input
                              type="text"
                              name="accqty"
                              value={row.accqty || ""}
                              onChange={({ target }) => {
                                // Allow only digits and one decimal point
                                const cleanedValue = target.value.replace(/[^0-9.]/g, '');      // remove all except digits and '.'
                                const validValue = cleanedValue.replace(/(\..*)\./g, '$1');     // allow only one dot
                                onDataChange(validValue, "accqty", index);
                              }}
                              disabled={row.materialaccqty == 0}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <input
                              type="text"
                              name="rejqty"
                              value={row.rejqty}
                              onChange={({ target }) =>
                                onDataChange(target.value, "rejqty", index)
                              }
                              disabled
                            />
                          </TableCell>
                          {/* <TableCell>
                        <input
                          type="text"
                          name="rates"
                          value={row.rates}
                          onChange={({ target }) =>
                            onDataChange(target.value, "rates", index)
                          }
                          disabled={row.materialaccqty == 0}
                        />
                      </TableCell> */}
                          {/* <TableCell align="center">
                            <IconButton
                              size="small"
                              title="Delete"
                              sx={{ color: '#ff0854' }}
                              onClick={() => handleDelete(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
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
                    disabled={isLoading}
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
