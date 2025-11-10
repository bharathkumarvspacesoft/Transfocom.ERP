import {
  Autocomplete,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  styled,
  Typography,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Stack
} from "@mui/material";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import "./enquiry.css";
import { useFormik } from "formik";
import { enquirySchema } from "../../../schemas";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getDate } from "utils";
import { APP_BASE_PATH } from "Host/endpoint";
import { ClearIcon, DatePicker } from "@mui/x-date-pickers";
import LoadingSpinner from "../../commen/LoadingSpinner";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import axios from "axios";
import { add, set } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ResizableTextField = styled(TextField)({
  "& .MuiInputBase-root textarea": {
    resize: "vertical", // Allows vertical resizing
    overflow: "auto", // Ensures scrollbars appear if needed
  },
});

const initialValues = {
  customer: "",
  contactPerson: "",
  email: "",
  designation: "",
  contact: "",
  alternateContact: "",
  address: "",
  currency: "",
  dateEnquiry: "",
  capacity: "",
  type: "",
  consumerType: "",
  hv: "",
  lv: "",
  areaDispatch: "",
  vector: "",
  materialWinding: "",
  cooling: "",
  tapingSwitch: "",
  core: "",
  primaryVoltage: "",
  secVoltage: "",
  comment: "",
  othertapping: "",
  frequency: "",
  phase: "",
};

const NewTransferStock = () => {
  const [value, setValue] = useState(dayjs());
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [costingIDs, setCostingIDs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [custname, setCustname] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCosting, setSelectedCosting] = useState(null);
  const [selectedProdRef, setSelectedProdRef] = useState(null);
  const [fromCustomers, setFromCustomers] = useState([]);
  const [selectedFromCustomer, setSelectedFromCustomer] = useState(null);
  const [costingData, setCostingData] = useState([]);
  const [prodRefData, setProdRefData] = useState([]);
  const [fromProdeRefData, setFromProdRefData] = useState([]);
  const [selectedFromProdRef, setSelectedFromProdRef] = useState(null);
  const [transferCustomers, setTrasferCustomers] = useState([]);
  const [button, setButton] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setButton(true);
    const fetchCustomer = () => {
      fetch(`${APP_BASE_PATH}/getCustomerListForTransferStock`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Customer Response:", data);
          setOptions(data || []);
        })
        .catch((error) => {
          console.error("Customer Error:", error);
        });
    };

    fetchCustomer();
  }, []);

  // useEffect(() => {
  //   const fetchCostingIDs = async () => {
  //     try {
  //       const response = await fetch(
  //         `${APP_BASE_PATH}/getCostingListForTransStock/${selectedCustomer?.custname}`
  //       ); // Replace with your API endpoint
  //       if (response.ok) {
  //         const data = await response.json();
  //         setCostingData(data);
  //       } else {
  //         console.error("Failed to fetch costing IDs");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching costing IDs:", error);
  //     } finally {
  //       setIsLoading(false);
  //       setButton(false);
  //     }
  //   };

  //   if (selectedCustomer) {
  //     fetchCostingIDs();
  //   } else {
  //     setCostingData([]);
  //     setSelectedCosting(null);
  //     setSelectedProdRef(null);
  //   }
  // }, [selectedCustomer]);

  useEffect(() => {
    const fetchCostingIDs = async () => {
      try {
        const response = await fetch(
          `${APP_BASE_PATH}/getCostingListForTransStock`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ custname: selectedCustomer?.custname }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCostingData(data);
        } else {
          console.error("Failed to fetch costing IDs");
        }
      } catch (error) {
        console.error("Error fetching costing IDs:", error);
      } finally {
        setIsLoading(false);
        setButton(false);
      }
    };

    if (selectedCustomer) {
      fetchCostingIDs();
    } else {
      setCostingData([]);
      setSelectedCosting(null);
      setSelectedProdRef(null);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    const fetchProdRefNo = async () => {
      try {
        const response = await fetch(
          `${APP_BASE_PATH}/getProdRefFroTransStock`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              costingname: selectedCosting?.costingname,
              custname: selectedCustomer?.custname,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProdRefData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedCosting) {
      fetchProdRefNo();
      setSelectedProdRef(null);
      setProdRefData([]);
    } else {
      setFromCustomers([]);
      setSelectedFromCustomer(null);
      setProdRefData([]);
      setSelectedProdRef(null);
    }
  }, [selectedCosting]);

  useEffect(() => {
    const fetchFromCustomers = async () => {
      try {
        const response = await fetch(
          `${APP_BASE_PATH}/getFromCustomerListForTransferStock`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              costingname: selectedCosting?.costingname,
              custname: selectedCustomer?.custname,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFromCustomers(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedProdRef) {
      fetchFromCustomers();
    } else {
      setFromCustomers([]);
      setSelectedFromCustomer(null);
    }
  }, [selectedProdRef]);

  useEffect(() => {
    const fetchFromProdRef = async () => {
      try {
        const response = await fetch(`${APP_BASE_PATH}/getProdRefForFromCust`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            costingname: selectedCosting?.costingname,
            custname: selectedFromCustomer?.custname,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setFromProdRefData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedFromCustomer) {
      fetchFromProdRef();
      setFromProdRefData([]);
    } else {
      setFromProdRefData([]);
      setSelectedFromProdRef(null);
      // setTrasferCustomers([]);
    }
  }, [selectedFromCustomer]);

  const handleChangeFromCustomer = (value) => {
    setSelectedFromCustomer(value);
  };

  const handleQtyChange = (index, value) => {
    const newRows = [...transferCustomers];

    const parsedQty = parseInt(value, 10) || 0;

    newRows[index] = {
      ...newRows[index],
      transferQty: parsedQty,
    };

    // console.log(newRows)

    const totalQty = newRows.reduce(
      (total, item) => total + item.transferQty,
      0
    );
    // console.log("Total : ", totalQty)
    // Check if total exceeds available quantity
    if (totalQty > (selectedProdRef?.qty || 0)) {
      return;
    }

    setTrasferCustomers(newRows);
  };

  const handleChangeToCustomer = (value) => {
    if (!value) {
      setSelectedCustomer(null);
      setSelectedFromCustomer(null);
      setCostingData([]);
      setSelectedCosting(null);
      return;
    }

    setSelectedCustomer(null);
    setSelectedFromCustomer(null);
    setCostingData([]);
    setSelectedCosting(null);
    setSelectedCustomer(value);
  };

  const addTransferStock = () => {
    const newId = selectedFromProdRef?.enquiry_master_id;

    const alreadyExists = transferCustomers.some(
      (row) => row.enquiry_master_id === newId
    );

    if (alreadyExists) {
      Swal.fire({
        title: "Customer already exists",
        text: "Customer and Product already exists",
        icon: "warning",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "orange",
      });
      return;
    }

    setTrasferCustomers((prevRows) => [
      ...prevRows,
      {
        enquiry_master_id: selectedFromProdRef?.enquiry_master_id,
        custname: selectedFromProdRef?.custname,
        wo_no: selectedFromProdRef?.wo_no,
        readyqty: selectedFromProdRef?.readyqty,
        prod_plan_de_id: selectedFromProdRef?.prod_plan_de_id,
        bom_req_id: selectedFromProdRef?.bom_req_id,
        po_id: selectedFromProdRef?.po_id,
        indent_id: selectedFromProdRef?.indent_id,
        transferQty: 0,
      },
    ]);

    setSelectedFromProdRef(null);
    setSelectedFromCustomer(null);
  };

  const deleteTransferStock = (enquiryMasterIdToDelete) => {
    setTrasferCustomers((prevRows) =>
      prevRows.filter(
        (row) => row.enquiry_master_id !== enquiryMasterIdToDelete
      )
    );
  };

  const handleBuyer = (inputText) => {
    const trimmedInput = inputText.trim();
    const selectedOption = options.find(
      (option) => option.custname === trimmedInput
    );
    if (selectedOption) {
      setCustname(selectedOption.custname);
    } else {
      setCustname(trimmedInput);
    }

    fetch(`${APP_BASE_PATH}/autoCustomerforenquery/${inputText}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setOptions(data || []);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setButton(true);
      setIsLoading(true);
      const transferStock = {
        fromcust: transferCustomers,
        tocust: {
          custname: selectedCustomer?.custname,
          enquiry_master_id: selectedProdRef?.enquiry_master_id,
          qty: selectedProdRef?.qty,
          prod_plan_de_id: selectedProdRef?.prod_plan_de_id,
          bom_req_id: selectedProdRef?.bom_req_id,
        },
        costing: selectedCosting,
      };

      console.log("Trans Stock : ", transferStock);

      const response = await fetch(`${APP_BASE_PATH}/transferStock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferStock),
      });

      const data = await response.json();

      if (data?.success) {
        Swal.fire({
          title: "Stock Transfered Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/transferstock");
          }
        });
      } else {
        Swal.fire({
          title: "Stock Transfer Failed",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setButton(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Transfer Stock</h4>
        </div>
        <Link to="/transferstock" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ backgroundColor: "#28a745" }}>
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={6}>
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            width: "95%",
            marginLeft: "2rem",
            paddingY: "10px",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            {/* <Typography textAlign={"left"}>To</Typography> */}
            {/* <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Typography fontWeight="bold">To</Typography>
              <Typography>
                ({options.map((c) => c.custname).join(", ")})
              </Typography>
            </Stack> */}

            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Typography fontWeight="bold">To</Typography>
              {/* <Typography>
                ({options.map((c) => c.custname).join(", ")})
              </Typography> */}
              <Typography color="error" fontWeight="medium" fontStyle="italic">
                Tip:
                "Please select the customer and associated costing to whom you want to transfer the ready stock transformer.
                Only customers with a pending BOM Issue (i.e., raw material still needs to be issued to build the transformer) are shown here.
              </Typography>
            </Stack>


            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={3} lg={2.5}>
                <Autocomplete
                  size="small"
                  id="custname"
                  options={options}
                  getOptionLabel={(option) => option.custname}
                  freeSolo
                  value={selectedCustomer || null}
                  onChange={(event, newValue) => {
                    handleChangeToCustomer(newValue);
                  }}
                  // onChange={(event, newValue) => {
                  //   if (newValue !== null) {
                  //     handleBuyer(newValue.custname.trim());
                  //   }
                  // }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Customer Name"
                      fullWidth
                      required
                      name="custname"
                    // value={custname}
                    // onChange={(e) => {
                    //   const trimmedInput = e.target.value.trim();
                    //   setCustname(trimmedInput);
                    //   handleBuyer(trimmedInput);
                    // }}
                    // onBlur={handleBlur}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3} lg={4}>
                <Autocomplete
                  fullWidth
                  size="small"
                  id="custaddress"
                  options={costingData}
                  getOptionLabel={(option) => option.costingname}
                  value={selectedCosting || null}
                  onChange={(event, newValue) => {
                    setSelectedCosting(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Costing"
                      fullWidth
                      required
                      name="costing"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3} lg={3}>
                <Autocomplete
                  fullWidth
                  size="small"
                  id="custaddress"
                  options={prodRefData}
                  getOptionLabel={(option) => option.wo_no}
                  value={selectedProdRef || null}
                  onChange={(event, newValue) => {
                    setSelectedProdRef(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Prod Ref No."
                      fullWidth
                      required
                      name="costing"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3} lg={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Quantity"
                  value={selectedProdRef?.qty || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mt: 2, mb: 2 }} />

            {/* <Typography textAlign={"left"}>From</Typography> */}

            {/* <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Typography fontWeight="bold">From</Typography>
              <Typography>
                ({fromCustomers.map((c) => c.custname).join(", ")})
              </Typography>
            </Stack> */}

            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <Typography fontWeight="bold">From</Typography>
              {/* <Typography>
                ({fromCustomers.map((c) => c.custname).join(", ")})
              </Typography> */}
              <Typography color="error" fontWeight="medium" fontStyle="italic">
                Tip:
                "Select the customers whose transformer is available in Ready Stock and matches the selected costing."              </Typography>
            </Stack>


            <Grid container spacing={2} mt={1}>
              <Grid
                item
                md={3}
                xs={12}
                lg={2.5}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Autocomplete
                  fullWidth
                  size="small"
                  id="custaddress"
                  options={fromCustomers || []}
                  getOptionLabel={(option) => option?.custname || ""}
                  value={selectedFromCustomer || null}
                  onChange={(event, newValue) => {
                    handleChangeFromCustomer(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Customer Name"
                      fullWidth
                    // required
                    />
                  )}
                />
              </Grid>

              <Grid
                item
                md={3}
                xs={12}
                lg={4}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Autocomplete
                  fullWidth
                  size="small"
                  id="custaddress"
                  options={fromProdeRefData || []}
                  getOptionLabel={(option) => option?.wo_no || ""}
                  value={selectedFromProdRef || null}
                  onChange={(event, newValue) => {
                    setSelectedFromProdRef(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Prod Ref No."
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item md={3} xs={12} lg={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ready Qty"
                  value={selectedFromProdRef?.readyqty || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid
                item
                md={3}
                xs={12}
                lg={1}
                sx={{ display: "flex", justifyContent: "flex-start" }}
              >
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#28a745" }}
                  onClick={addTransferStock}
                  disabled={!selectedFromProdRef}
                >
                  Add
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ mt: 2, mb: 2 }} />

            <Grid mt={2}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#B3E5FC" }}>
                      <TableCell sx={{ width: "25%" }} align="center">
                        Customer Name
                      </TableCell>
                      <TableCell sx={{ width: "25%" }} align="center">
                        Prod Ref No.
                      </TableCell>
                      <TableCell sx={{ width: "25%" }} align="center">
                        Ready Qty
                      </TableCell>
                      <TableCell sx={{ width: "25%" }} align="center">
                        Transfer Qty
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transferCustomers?.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{row.custname}</TableCell>
                        <TableCell align="center">{row.wo_no}</TableCell>
                        <TableCell align="center">{row.readyqty}</TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            value={row?.transferQty || 0}
                            inputProps={{ min: 0 }}
                            onChange={(e) => {
                              handleQtyChange(index, e.target.value);
                            }}
                          />
                          <IconButton
                            aria-label="delete"
                            size="large"
                            color="error"
                            onClick={() =>
                              deleteTransferStock(row.enquiry_master_id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid
              mt={3}
              sx={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                // onClick={addEnq}
                type="submit"
                sx={{ backgroundColor: "#007bff" }}
                disabled={button}
              >
                Save
              </Button>

              <Link
                to="/enquiry"
                style={{ textDecoration: "none", marginLeft: "5px" }}
              >
                <Button variant="contained" color="error">
                  Cancel
                </Button>
              </Link>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default NewTransferStock;
