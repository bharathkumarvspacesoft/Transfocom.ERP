import React from "react";
import { useState } from "react";
import {
  Autocomplete,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import "./challan.css";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";
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
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight: "bold",
      fontSize: "1em",
      align: "center",
    },
  },
});

const type = {
  1: "OUTDOOR",
  2: "INDOOR",
};
const NewChallan = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [redtqty, setReadyqty] = useState(0);
  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const userId = parsedUserData.id || ""; // Extract id or default to an empty string

  const [values, setValues] = useState({
    buyer: "",
    challan_no: "",
    chdate: new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      })
      .replace(/\//g, "-"),
    buyer_id: "",
    address: "",
    consumer: "",
    deliver_at: "",
    delivery_address: "",
    po_no: "",
    podate: "",
    costing_id: "",
    uid: userId,
    vehicle: "",
    orderacceptance_id: 0,
    modeoftransport: "",
  });
  const [optionList, setOptionList] = useState([]);
  const [originalCustomerList, setOriginalCustomerList] = useState([]); // ✅ new state
  const [capacityList, setCapacityList] = useState([]);
  const [rows, setRows] = useState([
    {
      plan_id: "",
      capacity: "",
      desc: "",
      qty: "",
      rate: "",
      amt: "",
      readyqty: "",
    },
  ]);
  const [custname, setCustname] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    // Early validation check
    if (!values.buyer?.custname) {
      console.warn("Cannot fetch data - no valid customer selected");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${APP_BASE_PATH}/getCapacityList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ custname: values.buyer.custname }),
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const jsonData = await response.json();
      console.log("API Response:", jsonData);

      // Handle empty or invalid response
      if (!jsonData || !Array.isArray(jsonData)) {
        throw new Error("Invalid response format from server");
      }

      // Handle API-specific error message
      if (jsonData.message === "No costing related to this name") {
        Swal.fire({
          title: "No Costing Data",
          text: "No costing information found for this customer.",
          icon: "info",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
        setCapacityList([]);
        return;
      }

      // Process successful response
      const augmentedData = jsonData.map((item, index) => ({
        ...item,
        srno: index + 1,
      }));

      setCapacityList(augmentedData);
      setReadyqty(jsonData[0]?.readyqty || 0); // Safe access with fallback

    } catch (error) {
      console.error("Data fetch failed:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch capacity data",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchDataWithoutDate = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${APP_BASE_PATH}/getreadystockdata`);
  //     const jsonData = await response.json();
  //     console.log("Fetched data without date:", jsonData);

  //     if (Array.isArray(jsonData)) {
  //       const reversedData = [...jsonData].reverse();

  //       // ✅ Extract unique customer objects (not just names)
  //       const uniqueCustomers = [];
  //       const seen = new Set();

  //       for (const item of reversedData) {
  //         if (!seen.has(item.custname)) {
  //           seen.add(item.custname);
  //           uniqueCustomers.push(item); // keeps full object for Autocomplete
  //         }
  //       }

  //       setOptionList(uniqueCustomers); // this goes into Autocomplete options
  //     } else {
  //       console.error("Fetched data without date is not an array");
  //     }

  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  // const fetchDataWithoutDate = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${APP_BASE_PATH}/getreadystockdata`);
  //     const jsonData = await response.json();
  //     console.log("Fetched data without date:", jsonData);

  //     if (Array.isArray(jsonData)) {
  //       const reversedData = [...jsonData].reverse();

  //       // Extract unique customer objects
  //       const uniqueCustomers = [];
  //       const seen = new Set();

  //       for (const item of reversedData) {
  //         if (!seen.has(item.custname)) {
  //           seen.add(item.custname);
  //           uniqueCustomers.push(item);
  //         }
  //       }

  //       // Store both original and display lists
  //       setOriginalCustomerList(uniqueCustomers);
  //       setOptionList(uniqueCustomers);

  //     } else {
  //       console.error("Fetched data without date is not an array");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const fetchDataWithoutDate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getreadystockdata`);
      const jsonData = await response.json();
      console.log("Fetched data without date:", jsonData);

      if (Array.isArray(jsonData)) {
        const reversedData = [...jsonData].reverse();

        // ✅ Only keep customers where readyqty > 0
        const filteredData = reversedData.filter(item => {
          const qty = parseInt(item.ready_qty, 10) || 0;
          return qty > 0;
        });

        // Extract unique customers
        const uniqueCustomers = [];
        const seen = new Set();

        for (const item of filteredData) {
          if (!seen.has(item.custname)) {
            seen.add(item.custname);
            uniqueCustomers.push(item);
          }
        }

        // Store both original and display lists
        setOriginalCustomerList(uniqueCustomers);
        setOptionList(uniqueCustomers);
        console.log("Unique Customers:", uniqueCustomers);

      } else {
        console.error("Fetched data without date is not an array");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchDataWithoutDate();
  }, []);



  // useEffect(() => {
  //   // Safely handle buyer state changes
  //   const handleBuyerChange = () => {
  //     if (values.buyer?.custname) {
  //       setCustname(values.buyer.custname);
  //       fetchData();
  //     } else {
  //       console.log("Buyer selection cleared - resetting data");
  //       setCapacityList([]);
  //       setReadyqty(0);
  //     }
  //   };

  //   handleBuyerChange();
  // }, [values.buyer]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        plan_id: "",
        capacity: "",
        desc: "",
        qty: "",
        rate: "",
        amt: "",
      },
    ]);
  };

  const handleDateChange = (e) => {
    setValues((prev) => ({
      ...prev,
      chdate: e.$d.toLocaleDateString("en-GB"),
    }));
  };

  const handlePODateChange = (e) => {
    setValues((prev) => ({
      ...prev,
      po_date: e.$d.toLocaleDateString("en-GB"),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    // Find the selected capacity
    console.log("capacityList", capacityList);
    const selectedCapacity = capacityList.find((item) => item.srno === value);

    // Calculate the total readyqty
    const totalReadyQty = capacityList.reduce((total, item) => {
      if (item.capacity === value) {
        return total + (parseInt(item.readyqty, 10) || 0);
      }
      return total;
    }, 0);

    setValues((prev) => ({
      ...prev,
      [name]: value,
      ...(selectedCapacity
        ? {
          ...selectedCapacity,
          po_no: selectedCapacity.ponum || "",
          po_date: selectedCapacity.podate || "",
          buyer_address: selectedCapacity.address || "",
          delivery_address: selectedCapacity.consumer_address || "",
          deliver_at: selectedCapacity.consumer_address || "",
        }
        : {}),
    }));

    // Update the 'desc' in the rows
    if (selectedCapacity) {
      const newRows = rows.map((row) => ({
        ...row,
        plan_id: selectedCapacity.prod_plan_id || "",
        capacity: selectedCapacity.capacity || "",
        costing_id: selectedCapacity.cid || "",
        rate: selectedCapacity.basicrate || "",
        desc: `Capacity: ${selectedCapacity.capacity} KVA, Voltage Ratio: ${selectedCapacity.voltageratio}, Type Cooling: ${selectedCapacity.typecolling}`,
        qty: selectedCapacity.readyqty,
        readyqty: selectedCapacity.readyqty,
      }));

      console.log("console.log(newRows)", newRows);
      console.log("console.log(rows)", rows);

      setRows(newRows);
    }
  };

  console.log("yoooo", capacityList);
  // const handleBuyer = ({ target }) => {
  //   fetch(`${APP_BASE_PATH}/autoCustomer/${target.value}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setOptionList(data || []);
  //     });
  // };

  const handleBuyer = ({ target }) => {
    const searchTerm = target.value.trim().toLowerCase();

    // If empty, clear options and skip fetch
    if (!searchTerm) {
      setOptionList([]);
      return;
    }

    fetch(`${APP_BASE_PATH}/autoCustomer/${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          setOptionList([]);
          return;
        }

        // Sort so matches starting with searchTerm come first
        const sortedData = [...data].sort((a, b) => {
          const nameA = (a.custname || "").toLowerCase();
          const nameB = (b.custname || "").toLowerCase();

          const startsWithA = nameA.startsWith(searchTerm) ? 0 : 1;
          const startsWithB = nameB.startsWith(searchTerm) ? 0 : 1;

          if (startsWithA !== startsWithB) {
            return startsWithA - startsWithB;
          }
          return nameA.localeCompare(nameB);
        });

        setOptionList(sortedData);
      });
  };

  // const handleBuyerInput = ({ target }) => {
  //   const searchTerm = target.value.trim().toLowerCase();

  //   if (!searchTerm) {
  //     setOptionList(originalCustomerList); // reset
  //     return;
  //   }

  //   // Sort so matches starting with searchTerm come first
  //   const sortedData = [...originalCustomerList].sort((a, b) => {
  //     const nameA = (a.custname || "").toLowerCase();
  //     const nameB = (b.custname || "").toLowerCase();

  //     const startsWithA = nameA.startsWith(searchTerm) ? 0 : 1;
  //     const startsWithB = nameB.startsWith(searchTerm) ? 0 : 1;

  //     if (startsWithA !== startsWithB) {
  //       return startsWithA - startsWithB;
  //     }
  //     return nameA.localeCompare(nameB);
  //   });

  //   setOptionList(sortedData);
  // };
  const fetchDataForCustomer = async (customerName) => {
    if (!customerName) {
      console.warn("Cannot fetch data - no valid customer name provided");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${APP_BASE_PATH}/getCapacityList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ custname: customerName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const jsonData = await response.json();
      console.log("Capacity API Response:", jsonData);

      if (!jsonData || !Array.isArray(jsonData)) {
        throw new Error("Invalid response format from server");
      }

      if (jsonData.message === "No costing related to this name") {
        Swal.fire({
          title: "No Costing Data",
          text: "No costing information found for this customer.",
          icon: "info",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
        setCapacityList([]);
        return;
      }

      const augmentedData = jsonData.map((item, index) => ({
        ...item,
        srno: index + 1,
      }));

      setCapacityList(augmentedData);
      setReadyqty(jsonData[0]?.readyqty || 0);

    } catch (error) {
      console.error("Data fetch failed:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch capacity data",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleBuyerInput = ({ target }) => {
    const searchTerm = target.value.trim().toLowerCase();

    if (!searchTerm) {
      setOptionList(originalCustomerList); // ✅ reset from stored list
      return;
    }

    const sortedData = [...originalCustomerList].sort((a, b) => {
      const nameA = (a.custname || "").toLowerCase();
      const nameB = (b.custname || "").toLowerCase();

      const startsWithA = nameA.startsWith(searchTerm) ? 0 : 1;
      const startsWithB = nameB.startsWith(searchTerm) ? 0 : 1;

      if (startsWithA !== startsWithB) {
        return startsWithA - startsWithB;
      }
      return nameA.localeCompare(nameB);
    });

    setOptionList(sortedData);
  };


  const onDataChange = (e, index) => {
    const { name, value } = e.target;

    const list = [...rows];
    const selectedCapacity =
      name === "capacity"
        ? capacityList.find(({ capacity, cid }) => value === capacity) || {}
        : {};

    // Initialize costing_id to the current value or 0
    const costingId =
      name === "capacity" ? selectedCapacity.cid : list[index].costing_id;

    list[index] = {
      ...list[index],
      [name]: value,
      costing_id: costingId, // Set costing_id to the appropriate value
      ...(name === "capacity"
        ? {
          ...selectedCapacity,
          rate: selectedCapacity.cost || 0,
          amt: (selectedCapacity.cost || 0) * (list[index]?.qty || 0),

          capacity: selectedCapacity.capacity,
          desc: `Capacity: ${selectedCapacity.capacity} KVA, VoltageRtio: ${selectedCapacity.voltageratio}, TypeCooling: ${selectedCapacity.typecolling}`,
        }
        : {
          amt: (list[index].rate || 0) * (value || 0),
        }),
    };

    console.log("qty", selectedCapacity.readyqty);
    // console.log("costing_id:", list[index].costing_id);

    setRows(list);
  };

  const handleDelete = (id) => {
    const filterItems = rows.filter((row) => row.id !== id);
    setRows(filterItems);
  };

  const challan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log();

    // ✅ Validate vehicle number
    if (!values.vehicle || values.vehicle.trim() === "") {
      Swal.fire({
        title: "Vehicle Number Required",
        text: "Please enter the vehicle number before saving.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff9800",
      });
      setIsLoading(false);
      return;
    }
    if (rows[0].qty > rows[0].readyqty) {
      Swal.fire({
        title:
          "Challan quantity should not be greater than ready stock quantity.",
        icon: "warning",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "warning",
      });
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${APP_BASE_PATH}/challan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          orderacceptance_id: values.oa_id,
          detailList: rows,
        }),
      });
      const data = res.json();
      console.log("jiiiiiiiiiiiiiiiiiiiii", data);
      if (res.status === 400 || !data) {
        Swal.fire({
          title: "Something went wrong!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        setIsLoading(false);
      } else {
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        navigate("/challan");
      }
    } catch (error) {
      console.error("Error fetching data:");
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };
  const handleClear = () => {
    setValues((prev) => ({
      ...prev,
      capacity: "",
    }));
  };
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            className="d-flex justify-content-between"
            style={{ position: "relative", bottom: 13 }}
          >
            <div className="page_header">
              <h4>New Challan</h4>
            </div>
            <Link to="/challan" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  background: "#00d284",
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
            style={{
              position: "relative",
              bottom: 20,
              padding: "14px",
              marginTop: "16px",
            }}
          >
            <div>
              <Box
                sx={{
                  marginTop: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "80%",
                  marginLeft: "10rem",
                }}
              >
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        {/* <Autocomplete
                          value={values.buyer}
                          onChange={(event, newValue) => {
                            if (newValue !== null) {
                              handleChange({
                                target: { value: newValue, name: "buyer" },
                              });
                            }
                          }}
                          selectOnFocus
                          clearOnBlur
                          handleHomeEndKeys
                          id="item-code"
                          options={optionList}
                          getOptionLabel={(option) => {
                            return option?.custname || "";
                          }}
                          renderOption={(props, option) => (
                            <li {...props}>{option?.custname || ""}</li>
                          )}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label="Customer"
                              onChange={(e) => handleBuyer(e)}
                            />
                          )}
                        /> */}
                        {/* <Autocomplete
                          value={values.buyer}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              handleChange({
                                target: { value: newValue, name: "buyer" },
                              });
                              // ✅ Call getCapacityList here
                              setCustname(newValue.custname);
                              fetchData();
                            }
                          }}
                          selectOnFocus
                          clearOnBlur
                          handleHomeEndKeys
                          id="item-code"
                          options={optionList}
                          getOptionLabel={(option) => option?.custname || ""}
                          renderOption={(props, option) => (
                            <li {...props}>{option?.custname || ""}</li>
                          )}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label="Customer"
                              onChange={handleBuyerInput} // ✅ local sort only
                            />
                          )}
                        /> */}
                        {/* <Autocomplete
                          value={values.buyer}
                          onChange={async (event, newValue) => {
                            if (newValue && newValue.custname) {
                              // Fetch more data for the selected customer
                              try {
                                const res = await fetch(`${APP_BASE_PATH}/autoCustomer/${newValue.custname}`);
                                const customerDetails = await res.json();
                                console.log("Selected customer details:", customerDetails);

                                // Update buyer state
                                handleChange({
                                  target: { value: newValue, name: "buyer" },
                                });

                                // Call getCapacityList (fetchData)
                                setCustname(newValue.custname);
                                fetchData();

                              } catch (err) {
                                console.error("Error fetching selected customer data", err);
                              }
                            }
                          }}
                          options={optionList}
                          getOptionLabel={(option) => option?.custname || ""}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Customer"
                              fullWidth
                              onChange={handleBuyerInput} // only sorts locally
                            />
                          )}
                        />  */}

                        <Autocomplete
                          value={values.buyer}
                          onChange={async (event, newValue) => {
                            console.log("Selected customer:", newValue);

                            if (newValue && newValue.custname) {
                              try {
                                // Update state first
                                setValues(prev => ({
                                  ...prev,
                                  buyer: newValue
                                }));

                                // Call customer details API using POST
                                console.log("Calling autoCustomer API for:", newValue.custname);
                                const res = await fetch(`${APP_BASE_PATH}/autoCustomer`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    name: newValue.custname
                                  })
                                });

                                if (res.ok) {
                                  const customerDetails = await res.json();
                                  console.log("Customer details:", customerDetails);

                                  // Update customer details in state if needed
                                  if (customerDetails && customerDetails.length > 0) {
                                    const customer = customerDetails[0];
                                    setValues(prev => ({
                                      ...prev,
                                      buyer: newValue,
                                      address: customer.address || '',
                                      buyer_id: customer.id || '',
                                    }));
                                  }
                                } else {
                                  console.error("Failed to fetch customer details:", res.status);
                                }

                                // Set customer name and fetch capacity data
                                setCustname(newValue.custname);

                                // Fetch capacity data for this customer
                                await fetchDataForCustomer(newValue.custname);

                              } catch (error) {
                                console.error("Error in customer selection:", error);
                              }
                            } else {
                              // Clear selection
                              setValues(prev => ({
                                ...prev,
                                buyer: null,
                                address: '',
                                buyer_id: ''
                              }));
                              setCustname(null);
                              setCapacityList([]);
                              setReadyqty(0);
                            }
                          }}
                          options={optionList}
                          getOptionLabel={(option) => option?.custname || ""}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Customer"
                              fullWidth
                              onChange={handleBuyerInput}
                            />
                          )}
                        />

                      </FormControl>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        id="challan_no"
                        label="Costing Name"
                        name="challan_no"
                        select
                        value={values.srno} // Set the selected capacity value
                        onChange={handleChange}
                      >
                        {capacityList
                          .filter(({ readyqty }) => readyqty !== null)
                          .map(
                            ({
                              srno,
                              id,
                              capacity,
                              voltageratio,
                              typecolling,
                              podate,
                              selectedcosting
                            }) => (
                              <MenuItem key={id} value={srno}>
                                {/* {`${srno}:-Capacity: ${capacity} KVA, VoltageRtio:${voltageratio},TypeCooling:${typecolling},  `}
                                {formatDate(podate)} */}
                                {selectedcosting}
                              </MenuItem>
                            )
                          )}
                      </TextField>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        multiline
                        id="buyer_address"
                        label="Customer Address"
                        name="buyer_address"
                        value={values.address}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="podate"
                        label="P O Date"
                        name="podate"
                        value={values.podate ? formatDate(values.podate) : ""}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="po_no"
                        label="P O NO."
                        name="po_no"
                        value={values.ponum}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="consumer"
                        label="Consumer Name(Consumer)"
                        name="consumer"
                        value={values.consumer}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        multiline
                        id="deliver_at"
                        label="Consumer Address(Deliver At)"
                        name="deliver_at"
                        onChange={handleChange}
                        value={values.deliver_at}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        multiline
                        id="delivery_address"
                        label="Delivery Address"
                        name="delivery_address"
                        value={values.consumer_address}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true, // Add the readOnly attribute
                        }}
                      />
                    </Grid>
                    {/* <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="modeoftransport"
                        label="Mode of Transport"
                        name="modeoftransport"
                        value={values.modeoftransport}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid> */}
                  </Grid>
                </Box>
              </Box>
            </div>
            <br />
            <div
              className="d-flex justify-content-center"
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
                        <TableCell className="MuiTableHead-root">
                          Sr No
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          Capacity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          Description
                        </TableCell>

                        <TableCell className="MuiTableHead-root">
                          Quantity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="input-group mb-3">
                              {/* <select
                                className="custom-select"
                                id="inputGroupSelect01"
                                style={{
                                  width: 150,
                                  height: 28,
                                  position: "relative",
                                  top: "10",
                                }}
                                name="capacity"
                                value={values.capacity}
                                onChange={(e) => onDataChange(e, index)}
                              >
                                <option selected>Choose...</option>
                                {capacityList.map(({ id, capacity }) => {
                                  return (
                                    <option key={id} value={capacity}>
                                      {capacity} KVA
                                    </option>
                                  );
                                })}
                              </select> */}
                              <select
                                className="custom-select"
                                id="inputGroupSelect01"
                                style={{
                                  width: 150,
                                  height: 28,
                                  position: "relative",
                                  top: "10",
                                }}
                                name="capacity"
                                value={values.capacity || ""} // Provide a default empty string if undefined
                                onChange={(e) => onDataChange(e, index)}
                              >
                                <option value="">Choose...</option>
                                {capacityList.map(({ id, capacity }) => {
                                  return (
                                    <option key={id} value={capacity}>
                                      {capacity} KVA
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </TableCell>
                          <TableCell>{`Capacity: ${values.capacity} KVA, VoltageRtio:${values.voltageratio},TypeCooling:${values.typecolling} `}</TableCell>
                          <TableCell>
                            <input
                              type="text"
                              name="qty"
                              value={row.qty}
                              onChange={(e) => onDataChange(e, index)}
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
              {/* <table
                className="table table-responsive-sm table-bordered table-striped table-sm"
                style={{
                  width: "75%",
                  marginLeft: 150,
                  border: "1px solid gray",
                }}
              >
                <tr style={{ borderRight: "1px solid gray" }}>
                  <td style={{ width: 55, borderLeft: "1px solid gray" }}>
                    Vehicle No :{" "}
                    <input
                      style={{ marginLeft: 30 }}
                      type="text"
                      id="vehicle"
                      onChange={handleChange}
                      name="vehicle"
                    />
                  </td>

                  <td style={{ width: "25%" }} align="right"></td>
                  <td id="totals" style={{ width: "20%" }}></td>
                </tr>
                <tr>
                  <td>
                    <p style={{ fontSize: 17 }}>
                      1) The item which is despatched to you directly or through
                      a third party, the company reserves the right to take back
                      the item against any delay/non payment.
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
              </table> */}
              <table
                className="table table-responsive-sm table-bordered table-striped table-sm"
                style={{
                  width: "75%",
                  marginLeft: 150,
                  border: "1px solid gray",
                }}
              >
                <tbody>
                  <tr style={{ borderRight: "1px solid gray" }}>
                    <td style={{ width: 55, borderLeft: "1px solid gray" }}>
                      Vehicle No :{" "}
                      <input
                        style={{ marginLeft: 30 }}
                        type="text"
                        id="vehicle"
                        onChange={handleChange}
                        name="vehicle"
                      />
                    </td>
                    <td style={{ width: "25%" }} align="right"></td>
                    <td id="totals" style={{ width: "20%" }}></td>
                  </tr>
                  <tr>
                    <td>
                      <p style={{ fontSize: 17 }}>
                        1) The item which is despatched to you directly or
                        through a third party, the company reserves the right to
                        take back the item against any delay/non payment.
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
                    <td align="" colSpan="2">
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
                  </tr>
                </tbody>
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
                  style={{
                    position: "relative",
                    left: 20,
                    background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },
                  }}
                  variant="contained"
                  onClick={challan}
                  type="submit"
                  disabled={isLoading}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={8} sm={4}>
                <Button
                  variant="contained"
                  style={{
                    position: "relative",
                    right: 10,
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
            <br />
          </Paper>
        </>
      )}
    </>
  );
};

export default NewChallan;
