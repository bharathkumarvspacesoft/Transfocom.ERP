import React from "react";
import { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import "./challan.css";
import { makeStyles } from "@material-ui/core/styles";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import IconButton from "@mui/material/IconButton";
import { APP_BASE_PATH } from "Host/endpoint";
import { Autocomplete, MenuItem, } from "@mui/material";
import LoadingSpinner from "component/commen/LoadingSpinner";

const initialValues = {
  buyerName: "",
  dcName: "",
  dcDate: "",
  deliverAt: "",
  poDate: "",
  poNo: "",
  yourAddress: "",
  deliveryAddress: "",

};
const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight: 'bold',
      fontSize: "1em",
      align: "center",
    },
  },
});

const EditChallan = (onsave) => {

  const [rows, setRows] = useState([
    {
      SrNo: "",
      capacity: "",
      description: "",
      unit: "",
      qty: "",
      action: "",
    },
  ]);
  const [custnameOptions, setCustnameOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleAddRow = () => {
    const id = Math.random().toString(36).substr(2, 9);
    console.log(id);
    setRows([
      ...rows,
      {
        id,
        SrNo: id,
        itemCode: "",
        description: "",
        unit: "",
        qty: "",
        action: "",
      },
    ]);
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

  const [value, setValue] = useState(dayjs());
  const handleDateChange = (newValue) => {
    setValue(newValue);
  };
  const classes = useStyles();

  const handleSrNoChange = (event, index) => {
    const newRows = [...rows];
    newRows[index].SrNo = event.target.value;
    setRows(newRows);
  };

  const handleDelete = (id) => {
    const filterItems = rows.filter((row) => row.id !== id);
    setRows(filterItems);
  };
  const [redtqty, setReadyqty] = useState(0)
  const [data, setData] = useState({
    challan_no: "",
    chdate: "",
    buyer_address: "",
    deliver_at: "",
    delivery_address: "",
    po_no: "",
    po_date: "",
    custname: "",
    vehicle: "",
    capacity: "",
    desc: "",
    qty: "",
    modeoftransport: ''
  });
  const navigate = useNavigate()
  const { id } = useParams();
  const [capacityList, setCapacityList] = useState([]);
  const [optionList, setOptionList] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editChallan1/${id}`);
        const resData = await reqData.json();
        const { custname, ...otherData } = resData;

        // Parse the description to create capacityList item
        const descParts = otherData.desc.split(/[:,]/).map(part => part.trim());
        const capacityItem = {
          id: 1, // or generate unique id
          capacity: descParts[1].replace('KVA', '').trim(),
          voltageratio: descParts[3],
          typecolling: descParts[5],
          podate: otherData.po_date,
          ponum: otherData.po_no,
          address: otherData.buyer_address,
          consumer_address: otherData.delivery_address
        };

        setData({ ...otherData, custname });
        setCapacityList([capacityItem]); // Initialize with the parsed data

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = (e) => {
    const { name, value } = e.target;

    if (name === "desc") {
      // Find the selected capacity
      const selectedCapacity = capacityList.find((item) => {
        return `Capacity: ${item.capacity} KVA, Voltage Ratio: ${item.voltageratio}, Type Cooling: ${item.typecolling}` === value;
      });

      setData((prevData) => ({
        ...prevData,
        desc: value,
        qty: value,
        vehicle: value,
        // Update po_date based on the selectedCapacity's podate
        po_date: selectedCapacity ? selectedCapacity.podate : prevData.po_date,
        po_no: selectedCapacity ? selectedCapacity.ponum : prevData.po_no,
        buyer_address: selectedCapacity ? selectedCapacity.address : prevData.buyer_address,
        delivery_address: selectedCapacity ? selectedCapacity.consumer_address : prevData.delivery_address,
        capacity: selectedCapacity ? selectedCapacity.capacity : prevData.capacity,
        // You can add other properties here in a similar way
      }));
    } else {
      setData({ ...data, [name]: value });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (data.custname) {
          const response = await fetch(`${APP_BASE_PATH}/getCapacityLists/${data.custname}`);
          if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
          }
          const jsonData = await response.json();

          if (jsonData.message && jsonData.message === 'No costing related to this name') {
            // Show a sweet alert when no data is found
            Swal.fire({
              title: "No Data Found",
              text: "There is no costing related to this name.",
              icon: "info",
              confirmButtonText: "OK",
              confirmButtonColor: "#3085d6",
            });
            setIsLoading(false)
          } else {
            setReadyqty(jsonData[0].readyqty)
            setCapacityList(jsonData);
            // console.log(jsonData)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, [data.custname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    // console.log('data.qty > redtqty', data.qty, redtqty)

    const editInputvalue = {
      challan_no: data.challan_no,
      chdate: data.chdate,
      buyer_address: data.buyer_address,
      deliver_at: data.deliver_at,
      delivery_address: data.delivery_address,
      vehicle: data.vehicle,
      custname: data.custname,
      po_date: data.po_date,
      desc: data.desc,
      po_no: data.po_no,
      capacity: data.capacity,
      qty: data.qty,
      modeoftransport: data.modeoftransport
    };

    console.log(editInputvalue);

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateChallan/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editInputvalue),
      });

      const resjson = await res.json();
      if (resjson) {
        Swal.fire({
          title: "Data Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });
        navigate(-1)
      }
    } catch {
      Swal.fire({
        title: "SomeThing Went Wrong!!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false)
    }
  };
  const handleBuyer = ({ target }) => {
    fetch(`${APP_BASE_PATH}/autoCustomer/${target.value}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setOptionList(data || []);

      });
  };

  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
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
              <h4>Update Challan</h4>
            </div>
            <Link to="/challan" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{
                background: "#00d284",
                "&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },
              }} >
                Back
              </Button>
            </Link>
          </div>

          <Paper elevation={6} style={{ position: "relative", bottom: 20 }}>
            <div>
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "80%",
                  marginLeft: "10rem",
                }}
              >
                <Box component="form" noValidate sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>

                      <Autocomplete
                        value={data.custname} // Set the initial value
                        onChange={(event, newValue) => {
                          if (newValue !== null) {
                            handleEdit({ target: { value: newValue, name: "custname" } });
                          }
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="item-code"
                        options={optionList.map((option) => option.custname)} // Populate with options
                        renderOption={(props, option) => (
                          <li {...props}>{option || ""}</li>
                        )}
                        freeSolo
                        disabled
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            disabled
                            label="Consumer"
                            onChange={(e) => handleBuyer(e)}
                          />
                        )}
                      />



                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        id="challan_no"
                        label="Description"
                        name="challan_no"
                        select
                        disabled
                        value={data.desc || ''}
                        onChange={(e) => handleEdit({ target: { name: "desc", value: e.target.value } })}
                      >
                        {capacityList.map(({ id, capacity, voltageratio, typecolling, podate }) => (
                          <MenuItem
                            key={id}
                            value={`Capacity: ${capacity} KVA, Voltage Ratio: ${voltageratio}, Type Cooling: ${typecolling}`}
                          >
                            {`Capacity: ${capacity} KVA, Voltage Ratio: ${voltageratio}, Type Cooling: ${typecolling}`}
                          </MenuItem>
                        ))}
                      </TextField>




                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Deliver At"
                        id="deliverAt"
                        disabled
                        multiline               // ✅ Enables multiline display
                        minRows={3}
                        name="deliver_at"
                        autoComplete="Date"
                        value={data.deliver_at}
                        onChange={handleEdit}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="P O Date"
                        labelprope
                        id="buyerName"
                        disabled
                        name="po_date"
                        autoComplete="Date"
                        value={data.po_date ? formatDate(data.po_date) : ""}
                        onChange={handleEdit}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField

                        label="P O NO."
                        fullWidth

                        id="poNo"
                        disabled
                        name="po_no"
                        autoComplete="Number"
                        value={data.po_no}
                        onChange={handleEdit}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label=" Your Address"
                        id="yourAddress"
                        disabled
                        multiline               // ✅ Enables multiline display
                        minRows={3}
                        name="buyer_address"
                        value={data.buyer_address}
                        onChange={handleEdit}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Delivery Address"
                        id="deliveryAddress"
                        disabled
                        multiline               // ✅ Enables multiline display
                        minRows={3}
                        name="delivery_address"
                        value={data.delivery_address}
                        onChange={handleEdit}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    {/* <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Mode of Transport"
                    id="modeoftransport"
                    
                    name="modeoftransport"
                    value={data.modeoftransport}
                    onChange={handleEdit}
                    InputLabelProps={{ shrink: true }}
                   
                  />
                </Grid> */}
                  </Grid>
                </Box>
              </Box>
            </div>
            <br />
            <div
              class="d-flex justify-content-center"
              style={{
                marginLeft: 150,
                border: "1px solid gray",
                marginRight: 40,
                width: "75%",
              }}
            >
              <TableContainer>
                <div className={classes.root}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="MuiTableHead-root">Sr No</TableCell>
                        <TableCell className="MuiTableHead-root">
                          Capacity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          Description
                        </TableCell>

                        <TableCell className="MuiTableHead-root">
                          Quantity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            <input
                              type="text"
                              name="SrNo"
                              style={{ width: 50 }}
                              value={index + 1}
                              onChange={(event) => handleSrNoChange(event, index)}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              name="capacity"
                              values={row.capacity}
                              value={data.capacity}
                              onChange={(event) =>
                                handleitemCodeChange(event, index)
                              }
                              readOnly
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              name="desc"
                              value={data.desc || ''}
                              readOnly
                            />
                          </TableCell>

                          <TableCell>
                            <input
                              type="text"
                              name="qty"
                              value={data.qty} // Set the initial value to data.qty
                              onChange={(e) => {
                                handleEdit(e); // This will update data.qty as the user types
                                handlequantityChange(e, index); // You can handle the quantity change separately if needed
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              title="Delete"
                              sx={{ color: '#ff0854' }}
                              onClick={() => handleDelete(row.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <br />
                  {/* <Button
                variant="contained"
                
                onClick={handleAddRow}
                sx={{
                  float: "right",
                  marginRight: "15px",
                  marginBottom: "10px",
                   backgroundColor: "#28a745"
                }}
              >
                Add Row
              </Button> */}
                  <br />
                  <br />
                </div>
              </TableContainer>
            </div>
            <br />
            <div>
              <table
                class="table table-responsive-sm table-bordered table-striped table-sm"
                style={{ width: "75%", marginLeft: 150, border: "1px solid gray" }}
              >
                <tr style={{ borderRight: "1px solid gray" }}>
                  <td style={{ width: 55, borderLeft: "1px solid gray" }}>
                    Vehicle No :{" "}
                    <input
                      style={{ marginLeft: 30 }}


                      id="vehicle"
                      name="vehicle"
                      type="text"
                      value={data.vehicle}
                      onChange={(e) => {
                        handleEdit(e); // This will update data.qty as the user types
                        // You can handle the quantity change separately if needed
                      }}
                    />
                  </td>

                  <td style={{ width: "25%" }} align="right">

                  </td>
                  <td id="totals" style={{ width: "20%" }}></td>
                </tr>
                <tr>
                  <td>
                    <p style={{ fontSize: 17 }}>
                      1) The item which is despatched to you directly or through a
                      third party, the company reserves the right to take back the
                      item against any delay/non payment.
                    </p>
                    <p style={{ fontSize: 15 }}>
                      <b>Subject to Pune Jurisdiction Only</b>
                      <br />
                      Received the above items in good condition.
                    </p>
                    <br />
                    <br />
                    <p style={{ fontSize: 17 }}>
                      Receivers Signature And Stamp :
                      __________________________________
                    </p>
                  </td>

                  <td align="" colspan="2">
                    <center>
                      <p style={{ fontSize: 27 }}>
                        For <b>Static Electricals Pune</b>
                      </p>
                      <br />
                      <br />
                      <br />
                      <br /> <br />
                      <br />
                      <p style={{ fontSize: 22 }}>Authorised Signatory</p>
                    </center>{" "}
                  </td>
                </tr>{" "}
              </table>
            </div>
            <br />

            <Grid
              container
              spacing={-100}
              sx={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginLeft: "21rem",
              }}
            >
              <Grid item xs={8} sm={4}>
                <Button
                  style={{ position: "relative", left: 20 }}
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },
                  }}
                  type="submit"
                  disabled={isLoading}
                >
                  Update{" "}
                </Button>
              </Grid>
              <Grid item xs={8} sm={4}>
                <NavLink to={'/challan'}>
                  <Button
                    variant="contained"

                    style={{
                      position: "relative", right: 10, background: "#ff0854",
                      "&:hover": {
                        background: "#ff0854", // Set the same color as the default background
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </NavLink>
              </Grid>
            </Grid>
            <br />
          </Paper>
        </>
      )}
    </>
  );
};

export default EditChallan;
