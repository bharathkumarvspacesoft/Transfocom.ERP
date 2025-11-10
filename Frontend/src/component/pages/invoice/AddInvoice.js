import { Autocomplete, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import "./invoice.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { APP_BASE_PATH } from "Host/endpoint";
import { DatePicker } from "@mui/x-date-pickers";
import LoadingSpinner from "component/commen/LoadingSpinner";

const AddInvoice = () => {
  const { search } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const navigate = useNavigate();
  const [taxesvalue, setTaxesvalue] = useState({
    cgst: "",
    sgst: "",
    cgsttype: "",
    sgsttype: "",
    igsttype: "",
  });
  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const userId = parsedUserData.id || ""; // Extract id or default to an empty string

  const [user, setUser] = useState({
    invoice_no: "",
    inv_date: new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      })
      .replace(/\//g, "-"),
    challan_id: "",
    buyerName: "",
    buyer_id: "",
    customeraddress: "",
    consignee_cat: "",
    gstNo: "",
    po_no: "",
    po_date: "",
    vehicle_no: "",

    grand_total: "",
    advance: "",
    net_total: "",
    date_issue: "",
    time_issue: "",
    date_removal: "",
    time_removal: "",
    uid: userId,
    by_road: "",
    buyer_addr: "",
    consign_addr: "",
    roundoff: "",
    consigneename: "",
    orderacceptance_id: "",
    remainingadvance: "",
    oa_id: "",
    qty: "",
  });
  const id = new URLSearchParams(search).get("id");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getChallanDetail/` + id); // Replace with your API endpoint
        const jsonData = await response.json();
        console.log(jsonData, "hhhhhhhhhhhhhhhhhhh");

        // setTaxesvalue({
        //   cgst: parseInt(jsonData.tax_cgst),
        //   sgst: parseInt(jsonData.tax_sgst),
        //   cgsttype: jsonData.tax_cgsttype,
        //   sgsttype: jsonData.tax_sgsttype
        // })

        setTaxesvalue({
          cgst: parseInt(jsonData.tax_cgst),
          sgst: parseInt(jsonData.tax_sgst),
          igst: parseInt(jsonData.tax_igst || 0), // Add this line
          cgsttype: jsonData.tax_cgsttype,
          sgsttype: jsonData.tax_sgsttype,
          igsttype: jsonData.tax_igsttype || "Exclusive", // Add this line
        });
        setUser((prevDta) => ({ ...prevDta, ...jsonData }));
        // setRows(jsonData?.detailList || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
      try {
        setIsLoading(true);
        const response = await fetch(`${APP_BASE_PATH}/getInvoiceNumber`); // Replace with your API endpoint
        const jsonData = await response.json();

        setUser((prevDta) => ({
          ...prevDta,
          invoice_no: jsonData.invoiceNumber,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputs = (e) => {
    let name, values;
    name = e.target.name;
    values = e.target.value;

    setUser({
      ...user,
      [name]: values,

      consigneename: name === "consigneename" ? values : user.custname,
      vehicle_no: name === "buyerName" ? values : user.vehicle,
      consign_addr: name === "consign_addr" ? values : user.buyer_address,
      desc: name === "desc" ? values : user.desc,
    });
  };

  const handleBuyer = ({ target }) => {
    fetch(`${APP_BASE_PATH}/autoCustomer/${target.value}`)
      .then((response) => response.json())
      .then((data) => {
        setOptionList(data || []);
      });
  };

  const handlDateChange = (value, name) => {
    let formattedTime = value;

    // Format time if it's not an empty string and the input is not a date
    if (formattedTime !== "" && !name.includes("date")) {
      // Check if the input is a valid Date object
      if (
        Object.prototype.toString.call(value) === "[object Date]" &&
        !isNaN(value)
      ) {
        formattedTime = value.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      }
    }

    setUser((prev) => ({
      ...prev,
      [name]: name.includes("date")
        ? value.toLocaleDateString("en-GB")
        : formattedTime,
    }));
  };

  const formatDate = (date) => {
    return dayjs(date).format("DD-MM-YYYY");
  };

  const addNewInvoice = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("user data before submission:", user);

    const advance = parseFloat(user.advance);
    // user.remainingadvance !== null
    //   ? parseFloat(user.remainingadvance)
    //   : parseFloat(user.advance);

    // Perform subtraction to get net total


    const net_total = grand_total - advance;

    // Update user state with net total
    setUser({
      ...user,
      net_total: net_total.toFixed(2), // Ensure net total has 2 decimal places
    });

    try {
      const res = await fetch(`${APP_BASE_PATH}/addNewInvoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          basic_total: basic_total,
          buyerName: user.buyerName,
          vehicle_no: user.vehicle,
          customeraddress: user.buyer_address,
          uid: user.uid,
          buyer_addr: user.buyer_address,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          roundoff: roundoff,
          grand_total: grand_total,
          advance: advance,

          net_total: net_total.toFixed(2),
          detailList: {
            desc: user.desc,
            plan_id: user.plan_id,
            qty: user.qty,
            rate: user.rate,
            amt: basic_total,
            hsn: user.hsn,
          },
        }),
      });

      console.log("API URL:", `${APP_BASE_PATH}/addNewInvoice`);

      if (res.status === 200) {
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });
        navigate("/invoice");
      } else {
        const data = await res.json();
        Swal.fire({
          title: "Error",
          text: data.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "consignee"
        ? {
          consignee_id: value?.id,
          consigneename: value?.custname,
          consign_addr: value?.address,
        }
        : {}),
    }));
  };

  const basic_total = Number(user.qty) * Number(user.rate) || 0;
  let cgst = 0,
    sgst = 0,
    igst = 0;
  let roundedCgst = 0,
    roundedSgst = 0,
    roundedIgst = 0;

  const gstNumber = user.gstNo || ""; // Ensure GST number exists
  const gstRegex = /^27[A-Z0-9]+$/i; // FIXED: Correct regex for Maharashtra

  // Convert tax values properly
  const cgstRate = Number(taxesvalue.cgst) || 0;
  const sgstRate = Number(taxesvalue.sgst) || 0;

  // Debugging
  // console.log("Basic Total:", basic_total);
  // console.log("CGST Rate:", cgstRate, "SGST Rate:", sgstRate);
  // console.log(
  //   "CGST Type:",
  //   taxesvalue.cgsttype,
  //   "SGST Type:",
  //   taxesvalue.sgsttype
  // );
  // console.log(
  //   "GST Number:",
  //   gstNumber,
  //   "Matches Maharashtra?:",
  //   gstRegex.test(gstNumber)
  // );

  // If GST number is blank or matches Maharashtra (27), apply CGST+SGST logic
  if (!gstNumber || gstRegex.test(gstNumber)) {
    // console.log("Applying CGST & SGST");

    if (
      taxesvalue.cgsttype?.trim().toLowerCase() === "exclusive" &&
      cgstRate > 0
    ) {
      cgst = (basic_total * cgstRate) / 100;
    }
    if (
      taxesvalue.sgsttype?.trim().toLowerCase() === "exclusive" &&
      sgstRate > 0
    ) {
      sgst = (basic_total * sgstRate) / 100;
    }
    igst = 0;
  } else {
    console.log("Applying IGST");

    if (
      taxesvalue.cgsttype?.trim().toLowerCase() === "exclusive" &&
      cgstRate > 0
    ) {
      igst = (basic_total * (cgstRate + sgstRate)) / 100;
    }
    cgst = 0;
    sgst = 0;
  }

  // Round tax values
  roundedCgst = Math.round(cgst * 100) / 100;
  roundedSgst = Math.round(sgst * 100) / 100;
  roundedIgst = Math.round(igst * 100) / 100;

  // Calculate final amounts
  const roundedBasicTotal = Math.round(basic_total * 100) / 100;
  const roundoff = Math.floor(
    roundedBasicTotal + roundedCgst + roundedSgst + roundedIgst
  );
  const grand_total = roundoff.toFixed(2);

  // Calculate net total
  // const net_total =
  //   grand_total -
  //   (user.remainingadvance !== null
  //     ? parseFloat(user.remainingadvance)
  //     : parseFloat(user.advance));
  const net_total = grand_total - parseFloat(user.advance)

  // Update state
  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      net_total: net_total.toFixed(2),
    }));
  }, [net_total, setUser]);

  // // Debugging output
  // console.log("Calculated CGST:", roundedCgst);
  // console.log("Calculated SGST:", roundedSgst);
  // console.log("Calculated IGST:", roundedIgst);
  // console.log("Grand Total:", grand_total);
  // console.log("Net Total:", net_total);

  const handledelete = () => {
    navigate("/invoice");
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
              <h4>Add Invoice</h4>
            </div>
            <Link to="/newinvoice" style={{ textDecoration: "none" }}>
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
          <Paper elevation={6} style={{ position: "relative", bottom: 20 }}>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "95%",
                marginLeft: "5rem",
              }}
            >
              <Box component="form" noValidate sx={{ mt: 3, mr: 7 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="invoice_no"
                      label="Invoice Number"
                      labelprope
                      name="invoice_no"
                      value={user.invoice_no}
                      onChange={handleInputs}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Invoice Date"
                          name="inv_date"
                          format="DD-MM-YYYY"
                          defaultValue={dayjs(new Date())} // onChange={handleDateChange}
                          onChange={(e) => handlDateChange(e.$d, "inv_date")}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="lastName"
                      label="Customer / Buyer Name"
                      name="buyerName" // Change 'commodity_name' to 'buyerName'
                      autoComplete="Date"
                      value={user.buyername} // Change 'commodity_name' to 'buyerName'
                      onChange={handleInputs}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="consignee"
                      label="Customer / Buyer Address"
                      name="customeraddress"
                      autoComplete="Date"
                      value={user.buyeraddress}
                      onChange={handleInputs}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="buyer_addr"
                      label="Consumer name"
                      name="consigneename"
                      value={user.custname}
                      onChange={handleInputs}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="modeoftransport"
                      label="GST No"
                      name="modeoftransport"
                      value={user.gstNo}
                      onChange={handleInputs}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="consign_addr"
                      label="Consumer Address (Optional)"
                      name="consign_addr"
                      value={user.buyer_address}
                      onChange={handleInputs}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="consignee_cat"
                      label="Challan NO "
                      name="consignee_cat"
                      value={user.challan_no}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="consignee_cat"
                      label="Challan Date "
                      name="consignee_cat"
                      value={user.chdate}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="po_no"
                      label="PO Number (Optional)"
                      name="po_no"
                      value={user.po_no}
                      onChange={handleInputs}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="po_date"
                      label=" po_date"
                      name="po_date"
                      value={formatDate(user.po_date)}
                      onChange={handleInputs}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="by_road"
                      label="By Road"
                      name="by_road"
                      value={user.by_road}
                      onChange={handleInputs}
                    />
                  </Grid> */}
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id="vehicle_no"
                      label="Vehicle Registration Number"
                      name="vehicle_no"
                      autoComplete="Date"
                      value={user.vehicle}
                      onChange={handleInputs}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true, // Add the readOnly attribute
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label="Date Of Issue"
                          name="date_issue"
                          inputFormat="DD-MMM-YYYY"
                          onChange={(e) => handlDateChange(e.$d, "date_issue")}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker
                          label="Time of Issue"
                          name="time_issue"
                          onChange={(e) =>
                            handlDateChange(
                              e && e.$d ? `${e.$H}:${e.$m}` : "", // Check if e and e.$d are not null
                              "time_issue"
                            )
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          label="Date of Removal"
                          name="date_removal"
                          inputFormat="DD-MMM-YYYY"
                          onChange={(e) =>
                            handlDateChange(e.$d, "date_removal")
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker
                          label="Time of Removal"
                          name="time_removal"
                          onChange={(e) =>
                            handlDateChange(
                              e && e.$d ? `${e.$H}:${e.$m}` : "", // Check if e and e.$d are not null
                              "time_removal"
                            )
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                </Grid>

                <br />
                <div class="form-group row">
                  <table
                    id="myTable"
                    className="table table-responsive-sm table-bordered table-sm inventory"
                    style={{ width: "96%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "7%", border: "1px solid black" }}>
                          Sr No
                        </th>
                        <th style={{ width: "30%", border: "1px solid black" }}>
                          Description
                        </th>
                        <th style={{ width: "20%", border: "1px solid black" }}>
                          HSN
                        </th>
                        <th style={{ width: "10%", border: "1px solid black" }}>
                          Quantity
                        </th>
                        <th style={{ width: "15%", border: "1px solid black" }}>
                          Rate/Unit
                        </th>
                        <th style={{ width: "25%", border: "1px solid black" }}>
                          Amount(Rs)
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        id="details"
                        name="details1"
                        class="table-striped detls"
                      >
                        <td style={{ border: "1px solid black" }}>{1}</td>
                        <td style={{ border: "1px solid black" }}>
                          {user.desc}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          <input
                            type="text"
                            name="hsn"
                            value={user.hsn}
                            onChange={handleInputs}
                          />
                        </td>

                        <td style={{ border: "1px solid black" }}>
                          {user.qty}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {user.rate}
                        </td>
                        <td
                          style={{ border: "1px solid black" }}
                          name="amt"
                          class="amount"
                        >
                          {user.qty * user.rate}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table
                    className="table table-responsive-sm table-bordered table-sm"
                    style={{ width: "96%", borderCollapse: "collapse" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{ width: "5%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        ></td>
                        <td
                          style={{ width: "20%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "10%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "15%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "25%", border: "1px solid black" }}
                        ></td>
                      </tr>

                      <tr>
                        <td
                          style={{ width: "7%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          Total Basic
                        </td>
                        <td style={{ border: "1px solid black" }}></td>
                        <td style={{ border: "1px solid black" }}></td>
                        <td style={{ border: "1px solid black" }}></td>
                        <td style={{ border: "1px solid black" }}>
                          {basic_total}
                        </td>
                      </tr>

                      {/* CGST row */}
                      <tr>
                        <td
                          style={{ width: "7%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          C.GST {taxesvalue.cgst}%
                        </td>
                        <td
                          style={{ width: "20%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "10%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "15%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "25%", border: "1px solid black" }}
                          id="basictotal"
                          name="basictotal"
                        >
                          {cgst}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ width: "5%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          S.GST {taxesvalue.sgst}%
                        </td>
                        <td
                          style={{ width: "20%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "10%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "15%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "25%", border: "1px solid black" }}
                          id="basictotal"
                          name="basictotal"
                        >
                          {sgst}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ width: "5%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          I.GST
                        </td>
                        <td
                          style={{ width: "20%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "10%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "15%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "25%", border: "1px solid black" }}
                          id="basictotal"
                          name="basictotal"
                        >
                          {igst}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ width: "5%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          Round Off
                        </td>
                        <td
                          style={{ width: "20%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "10%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "15%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "25%", border: "1px solid black" }}
                          id="basictotal"
                          name="basictotal"
                        >
                          {/* {roundoff} */} 0
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ width: "5%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          Grand Total
                        </td>
                        <td
                          style={{ width: "20%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "10%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "15%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "25%", border: "1px solid black" }}
                          id="basictotal"
                          name="basictotal"
                        >
                          {grand_total}
                        </td>
                      </tr>
                      {user.advance < 0 ? (
                        <tr>
                          <td style={{ width: "5%", border: "1px solid black" }}></td>
                          <td
                            style={{
                              width: "30%",
                              textAlign: "right",
                              border: "1px solid black",
                            }}
                          >
                            Previous Invoice Balance
                          </td>
                          <td style={{ width: "20%", border: "1px solid black" }}></td>
                          <td style={{ width: "10%", border: "1px solid black" }}></td>
                          <td style={{ width: "15%", border: "1px solid black" }}></td>
                          <td
                            style={{ width: "25%", border: "1px solid black" }}
                            id="basictotal"
                            name="basictotal"
                          >
                            {Math.abs(user.advance)}
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td style={{ width: "5%", border: "1px solid black" }}></td>
                          <td
                            style={{
                              width: "30%",
                              textAlign: "right",
                              border: "1px solid black",
                            }}
                          >
                            Advance
                          </td>
                          <td style={{ width: "20%", border: "1px solid black" }}></td>
                          <td style={{ width: "10%", border: "1px solid black" }}></td>
                          <td style={{ width: "15%", border: "1px solid black" }}></td>
                          <td
                            style={{ width: "25%", border: "1px solid black" }}
                            id="basictotal"
                            name="basictotal"
                          >
                            {user.advance}
                          </td>
                        </tr>
                      )}



                      <tr>
                        <td
                          style={{ width: "5%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{
                            width: "30%",
                            textAlign: "right",
                            border: "1px solid black",
                          }}
                        >
                          Net Total
                        </td>
                        <td
                          style={{ width: "20%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "10%", border: "1px solid black" }}
                        ></td>
                        <td
                          style={{ width: "15%", border: "1px solid black" }}
                        ></td>
                        <td style={{ width: "25%", border: "1px solid black" }}>
                          {user.net_total}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    class="table table-responsive-sm table-bordered table-striped table-sm"
                    style={{ width: "90%" }}
                  >
                    <tr>
                      <td>
                        <p style={{ fontSize: 15 }}>
                          {" "}
                          1) The item which is despatched to you directly or
                          through a third party, the company reserves the right
                          to take back the item against any delay/non payment.
                        </p>
                        <p style={{ fontSize: 17, position: "absolute" }}>
                          <b>Subject to Pune Jurisdiction Only</b>
                          <br />
                          Received the above items in good condition.
                        </p>
                        <br />
                        <br />
                        <br />
                        <p style={{ fontSize: 17, position: "absolute" }}>
                          Receivers Signature And Stamp :
                          __________________________________
                        </p>
                      </td>

                      <td colspan="2">
                        <center>
                          <p style={{ fontSize: 27 }}>
                            For <b>Static Electricals Pune</b>
                          </p>
                          <br />
                          <br />
                          <br />
                          <br /> <br />
                          <br />
                          <p style={{ fontSize: 20 }}>Authorised Signatory</p>
                        </center>{" "}
                      </td>
                    </tr>{" "}
                  </table>
                </div>

                <br />
                <br />
                <Grid
                  container
                  spacing={-101}
                  sx={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginLeft: "21rem",
                  }}
                >
                  <Grid item xs={9} sm={3}>
                    <Button
                      variant="contained"
                      sx={{
                        background: "#00d284",
                        "&:hover": {
                          background: "#00d284", // Set the same color as the default background
                        },
                      }}
                      onClick={addNewInvoice}
                      type="submit"
                      disabled={isLoading}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item xs={9} sm={3}>
                    <Link to="/newinvoice" style={{ textDecoration: "none" }}>
                      <Button
                        variant="contained"
                        onClick={handledelete}
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
                </Grid>
                <br />
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default AddInvoice;
