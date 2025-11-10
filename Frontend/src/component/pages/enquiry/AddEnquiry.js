import {
  Autocomplete,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  styled,
  Typography,
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
import { set } from "date-fns";

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

const New = () => {
  const [value, setValue] = useState(dayjs());
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleDateChange = (newValue) => {
    const formattedDate = dayjs(newValue).format("DD-MM-YYYY");
    setValue(newValue);
    // Also update the state that holds the formatted date value
    setEdate(formattedDate);
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    handelClose,
  } = useFormik({
    initialValues,
    validationSchema: enquirySchema,
    onSubmit: (values, action) => {
      console.log({
        ...values,
        dateEnquiry: dayjs(value).format("DD-MM-YYYY"),
        frequency: 50,
      });
      action.resetForm();
      handelClose();
    },
  });
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState(false)
  const [custname, setCustname] = useState("");
  const [contactperson, setContactperson] = useState("");
  const [desg, setDesg] = useState("");
  const [email, setEmail] = useState("");
  const [gstno, setGstno] = useState("");
  const [contactno, setContactno] = useState("");
  const [altcontactno, setAltcontactno] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setcurrency] = useState("INR");
  const [edate, setEdate] = useState(getDate());
  const [capacity, setCapacity] = useState("");
  const [frequency, setFrequency] = useState(50);
  const [type, setType] = useState("1");
  const [phase, setPhase] = useState("3");
  const [hvvoltage, setHvvoltage] = useState("Delta Connected");
  const [consumertype, setConsumertype] = useState("");
  const [lvvoltage, setLvvoltage] = useState("Star Connected");
  const [areaofdispatch, setAreaofdispatch] = useState("");
  const [vectorgroup, setVectorgroup] = useState("Dyn11");
  const [matofwind, setMatofwind] = useState("");
  const [typecolling, setTypecolling] = useState("ONAN");
  const [costingDesign, setCostingDesign] = useState("D1");
  const [selectedCostingName, setSelectedCostingName] = useState("");

  const [options, setOptions] = useState([]);
  const [comment, setComment] = useState("");
  const [voltageratio, setVoltageratio] = useState("");
  const [core, setCore] = useState("CRGO");
  const [secratio, setSecratio] = useState(433);
  const [priratio, setPriratio] = useState(22000);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState([]);
  const [optionlist, setOptionlist] = useState([]);
  const [costingIDs, setCostingIDs] = useState([]);
  const [selectedCostingID, setSelectedCostingID] = useState("");
  const [typetaping, setTypetaping] = useState(
    "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
  );
  const [tapingSwitch, setTapingSwitch] = useState("octc");
  const [showDropdown, setShowDropdown] = useState(false);
  const [otherTypetaping, setOtherTypetaping] = useState("");

  const handleRadioChange = (event) => {
    // if(tapingSwitch == 'notapping'){
    //   setTypetaping('No Tapping')
    // }
    setTapingSwitch(event.target.value);
    setShowDropdown(
      event.target.value === "oltc" || event.target.value === "octc"
    );
    setTypetaping(""); // Reset typetaping value when radio changes
  };

  const handleDropdownChange = (value) => {
    setTypetaping(value);
    setShowDropdown(false); // Close dropdown after selection
  };

  const handleClearSelection = () => {
    setTypetaping("");
    setShowDropdown(true); // Show dropdown again after clearing selection
  };
  useEffect(() => {
    setIsLoading(true);
    const fetchCostingIDs = async () => {
      try {
        const response = await fetch(`${APP_BASE_PATH}/getcostingmaster`); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();

          setCostingIDs(data);
          console.log("data ", data);
        } else {
          console.error("Failed to fetch costing IDs");
        }
      } catch (error) {
        console.error("Error fetching costing IDs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCostingIDs();
  }, []);
  console.log(altcontactno, "mmmmmmmmmm");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData ? userData.id : null;

  // Now you can use userId in your enquirypage component
  console.log(userId);

  const fetchData = async () => {
    try {
      const response = await fetch(`${APP_BASE_PATH}/getEnquiryDetails`); // Replace with your API endpoint
      const jsonData = await response.json();
      setRows(jsonData);

      setSearch(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const isValidContactNo = (contactNo) => {
    // Regular expression for a 10-digit phone number
    const regex = /^\d{10}$/;
    return regex.test(contactNo);
  };
  const addEnq = async (e) => {
    console.log("clicked", custname,
      contactperson,
      desg,
      email,
      gstno,
      contactno,
      altcontactno,
      address,
      currency,
      capacity,
      type,
      hvvoltage,
      consumertype,
      lvvoltage,
      areaofdispatch,
      vectorgroup,
      matofwind,
      typecolling,
      typetaping,
      comment,
      voltageratio,
      core,
      secratio,
      priratio,
      userId,
      selectedCostingName,
      otherTypetaping,
      tapingSwitch,
      frequency,
      phase,
      costingDesign, // Add this line
    );
    console.log("costingDesign", costingDesign);

    console.log("tapingSwitch", tapingSwitch);

    setLoading(true);
    setButton(true)
    e.preventDefault();
    try {
      if (
        // Other required field checks...
        !isValidContactNo(contactno)
      ) {
        Swal.fire({
          title: "Please enter a valid 10-digit contact number",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (email && !validateEmail(email)) {
        Swal.fire({
          title: "Please enter a valid email",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!custname) {
        Swal.fire({
          title: "Please enter customer name",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!contactperson) {
        Swal.fire({
          title: "Please enter contact person!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!contactno) {
        Swal.fire({
          title: "Please enter contact number!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!address) {
        Swal.fire({
          title: "Please enter address!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!currency) {
        Swal.fire({
          title: "Please select currency!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!edate) {
        Swal.fire({
          title: "Please select date of enquiry!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }

      if (!capacity || isNaN(capacity) || Number(capacity) <= 0) {
        Swal.fire({
          title: "Please enter a valid capacity",
          icon: "error",
          confirmButtonText: "OK",
          animation: true,
          confirmButtonColor: "red",
        });
        return;
      }

      // if (!capacity) {
      //   Swal.fire({
      //     title: "Please enter capacity",
      //     icon: "error",
      //     confirmButtonText: "OK",
      //     animation: "true",
      //     confirmButtonColor: "red",
      //   });
      //   return;
      // }
      if (!type) {
        Swal.fire({
          title: "Please select type!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!hvvoltage) {
        Swal.fire({
          title: "Please enter Hv!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!consumertype) {
        Swal.fire({
          title: "Please select consumertype!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!lvvoltage) {
        Swal.fire({
          title: "Please enter    Lv!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!vectorgroup) {
        Swal.fire({
          title: "Please enter vectorgroup!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!matofwind) {
        Swal.fire({
          title: "Please select material of winding!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!typecolling) {
        Swal.fire({
          title: "Please enter typw of cooling!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!priratio) {
        Swal.fire({
          title: "Please enter priratio!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!priratio) {
        Swal.fire({
          title: "Please enter priratio!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!secratio) {
        Swal.fire({
          title: "Please enter secratio!",
          icon: "error",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!core) {
        Swal.fire({
          title: "Please enter core!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!frequency) {
        Swal.fire({
          title: "Please enter frequency!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      if (!phase) {
        Swal.fire({
          title: "Please enter phase!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        return;
      }
      const voltageratio = `${priratio}/${secratio}`;
      const formattedEdate = dayjs(value).format("DD-MM-YYYY");


      const res = await fetch(`${APP_BASE_PATH}/addEnq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          custname,
          contactperson,
          desg,
          email,
          gstno,
          contactno,
          altcontactno,
          address,
          currency,
          edate: formattedEdate,
          capacity,
          type,
          hvvoltage,
          consumertype,
          lvvoltage,
          areaofdispatch,
          vectorgroup,
          matofwind,
          typecolling,
          typetaping,
          comment,
          voltageratio,
          core,
          secratio,
          enqstatus: 0,
          priratio,
          uid: userId,
          costingName: selectedCostingName,
          otherTypetaping,
          tapingSwitch,
          frequency,
          phase,
          costingDesign, // Add this line
        }),
      });
      const textResponse = await res.text(); // Use text() instead of json()

      console.log("Data from server:", textResponse);

      if (res.status === 400) {
        // Check the text response for specific conditions
        if (textResponse.includes("validationErrors")) {
          const data = JSON.parse(textResponse);
          const validationErrorMessages = data.validationErrors.join("\n");
          Swal.fire({
            title: validationErrorMessages,
            icon: "error",
            confirmButtonText: "OK",
            animation: "true",
            confirmButtonColor: "red",
          });
        } else if (textResponse.includes("error")) {
          const data = JSON.parse(textResponse);
          Swal.fire({
            title: data.error,
            icon: "error",
            confirmButtonText: "OK",
            animation: "true",
            confirmButtonColor: "red",
          });
        } else {
          Swal.fire({
            title: "Something went wrong!",
            icon: "error",
            confirmButtonText: "OK",
            animation: "true",
            confirmButtonColor: "red",
          });
        }
      } else {
        // Handle success
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        navigate(-1);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `An error occurred`,
        icon: "error",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
      setButton(false)
    }
  };
  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email.trim());
  };

  // const addQuote = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const formattedEdate = dayjs(value).format("DD-MM-YYYY");

  //   try {
  //     const res = await fetch(`${APP_BASE_PATH}/addEnq`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         custname,
  //         contactperson,
  //         desg,
  //         email,
  //         contactno,
  //         altcontactno,
  //         address,
  //         currency,
  //         edate: formattedEdate,
  //         capacity,
  //         type,
  //         hvvoltage,
  //         consumertype,
  //         lvvoltage,
  //         areaofdispatch,
  //         vectorgroup,
  //         matofwind,
  //         typecolling,
  //         typetaping,
  //         tapingSwitch,
  //         comment,
  //         voltageratio,
  //         core,
  //         secratio,
  //         priratio,
  //         frequency,
  //         phase,
  //       }),
  //     });

  //     if (res.status === 400) {

  //     } else {
  //       Swal.fire({
  //         title: "Data Added Successfully",
  //         icon: "success",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "green",
  //       });
  //     }

  //     const data = await res.json();
  //     navigate(`/NewQuotation/${data.insertId}`);
  //   } catch (error) {
  //     console.error("Error:", error);

  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
  const handleDateChanges = (newValue) => {
    const formattedDate = newValue
      ? dayjs(newValue).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY");
    setValue(newValue);
    setEdate(formattedDate);
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Add Enquiry</h4>
        </div>
        <Link to="/enquiry" style={{ textDecoration: "none" }}>
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
            alignItems: "center",
            width: "95%",
            marginLeft: "5rem",
          }}
        >
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={7} sm={3.5}>
                <Autocomplete
                  id="custname"
                  options={options}
                  getOptionLabel={(option) => option.custname}
                  style={{ width: 300 }}
                  freeSolo
                  onChange={(event, newValue) => {
                    if (newValue !== null) {
                      handleBuyer(newValue.custname.trim());
                      setAddress(newValue.address || "");
                      setContactno(newValue.contactno || "");
                      setDesg(newValue.desg || "");
                      setEmail(newValue.email || "");
                      setContactperson(newValue.cperson || "");
                      setGstno(newValue.gstno || "");
                      setDesg(newValue.desg || "");
                      setAltcontactno(newValue.altcontactno || "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      style={{ width: "25.3vw" }}
                      {...params}
                      label="Customer Name"
                      fullWidth
                      required
                      name="custname"
                      value={custname}
                      onChange={(e) => {
                        const trimmedInput = e.target.value.trim();
                        setCustname(trimmedInput);
                        handleBuyer(trimmedInput);
                      }}
                      onBlur={handleBlur}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  required
                  id="contact"
                  name="contactPerson"
                  autoComplete="Date"
                  onChange={(e) => setContactperson(e.target.value)}
                  value={contactperson}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  label="Designation (Optional)"
                  id="desg"
                  name="desg"
                  autoComplete="Date"
                  onChange={(e) => setDesg(e.target.value)}
                  // className={
                  //   errors.designation && touched.designation ? "error" : null
                  // }
                  value={desg}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  label="Email (Optional)"
                  id="email"
                  name="email"
                  autoComplete="Date"
                  onChange={(e) => setEmail(e.target.value)}
                  // className={errors.email && touched.email ? "error" : null}
                  value={email}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  label="GST NO"
                  id="gstno"
                  name="gstno"
                  onChange={(e) => setGstno(e.target.value)}
                  value={gstno}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  label="Contact No"
                  id="contactno"
                  name="contactno"
                  autoComplete="Date"
                  onChange={(e) => setContactno(e.target.value)}
                  // className={errors.contact && touched.contact ? "error" : null}
                  value={contactno}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 10);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  label="Alt.Contact No. (Optional)"
                  id="altcontactno"
                  name="altcontactno"
                  autoComplete="Date"
                  onChange={(e) => setAltcontactno(e.target.value)}
                  value={altcontactno}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 10);
                  }}
                />
              </Grid>

              {/* <Grid item xs={7} sm={3.5}>
                <ResizableTextField
                  fullWidth
                  required
                  label="Address"
                  multiline
                  id="address"
                  name="address"
                  onChange={(e) => setAddress(e.target.value)}
                  // className={errors.address && touched.address ? "error" : null}
                  value={address}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid> */}

              <Grid item xs={7} sm={3.5}>
                <ResizableTextField
                  fullWidth
                  required
                  label="Address"
                  multiline
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => {
                    let lines = e.target.value.split("\n");

                    // Limit to max 3 lines
                    if (lines.length > 3) {
                      lines = lines.slice(0, 3);
                    }

                    // Limit each line to 50 characters
                    lines = lines.map(line => line.slice(0, 50));

                    setAddress(lines.join("\n")); // Update with trimmed value
                  }}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  minRows={3}
                  maxRows={3}
                  helperText="Maximum 3 lines allowed, with up to 50 characters per line."
                  FormHelperTextProps={{
                    style: { color: "red" }, // 🔴 red helper text
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    maxLength: 153, // safeguard
                  }}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "25.4vw", textAlign: "left" }}>
                  <InputLabel id="demo-select-small">Currency</InputLabel>
                  <Select
                    label="Currency"
                    labelId="demo-select-small"
                    id="currency"
                    required
                    name="currency"
                    value={currency}
                    onChange={(e) => setcurrency(e.target.value)}
                  >
                    <MenuItem value={"INR"}>INR(Indian Rupee)</MenuItem>
                    <MenuItem value={"USD"}>USD (US Dollar)</MenuItem>
                    <MenuItem value={"IDR"}>IDR(Indonesian Rupiah)</MenuItem>
                    <MenuItem value={"EUR"}>EUR (Euro)</MenuItem>
                    <MenuItem value={"AUD"}>AUD(Australian Dollar)</MenuItem>
                    <MenuItem value={"IRR"}>IRR (Iranian Rial)</MenuItem>
                    <MenuItem value={"CAD"}>CAD(Canadian Dollar)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "25.4vw" }}>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{
                      minWidth: 396,
                    }}
                  >
                    <DatePicker
                      label="Date of Enquiry"
                      format="DD-MM-YYYY"
                      required
                      name="edate"
                      onChange={(newValue) => handleDateChange(newValue)}
                      value={value} // Make sure to set the value prop
                      id="edate"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  label="Capacity KVA"
                  id="capacity"
                  name="capacity"
                  autoComplete="Date"
                  onChange={(e) => setCapacity(e.target.value)}
                  data={values.capacity}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "25.4vw", textAlign: "left" }}>
                  <InputLabel id="demo-select-small">Type</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="type"
                    name="type"
                    required
                    label="Type"
                    data={type}
                    onChange={(e) => setType(e.target.value)}
                    onBlur={handleBlur}
                    onSubmit={handleSubmit}
                    defaultValue={type}
                  >
                    <MenuItem value={"1"}>OUTDOOR</MenuItem>
                    <MenuItem value={"2"}>INDOOR</MenuItem>
                    <MenuItem value={"3"}>OUTDOOR-INDOOR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  label="HV "
                  id="hvvoltage"
                  name="hvvoltage"
                  onChange={(e) => setHvvoltage(e.target.value)}
                  autoComplete="Date"
                  data={values.hv}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  value={hvvoltage}
                  onSubmit={handleSubmit}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "26vw", textAlign: "left" }}>
                  <InputLabel label="type">Consumer Type</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    required
                    label={
                      <div>
                        Consumer Type
                        <span style={{ color: "red" }}>*</span>
                      </div>
                    }
                    id="consumertype"
                    name="consumertype"
                    onChange={(e) => setConsumertype(e.target.value)}
                    data={values.consumerType}
                    onBlur={handleBlur}
                    onSubmit={handleSubmit}
                  >
                    <MenuItem value={"HT"}>HT</MenuItem>
                    <MenuItem value={"LT"}>LT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  style={{ width: "26vw" }}
                  fullWidth
                  required
                  label="LV"
                  id="lvvoltage"
                  name="lvvoltage"
                  autoComplete="Date"
                  onChange={(e) => setLvvoltage(e.target.value)}
                  // className={errors.lv && touched.lv ? "error" : null}
                  data={values.lv}
                  // onChange={handleChange}
                  value={lvvoltage}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  label="Area of Dispatch (optional)"
                  id="areaofdispatch"
                  name="areaofdispatch"
                  onChange={(e) => setAreaofdispatch(e.target.value)}
                  // className={
                  //   errors.areaDispatch && touched.areaDispatch ? "error" : null
                  // }
                  autoComplete="Date"
                  data={values.areaDispatch}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  label="Vector Group"
                  id="vectorgroup"
                  name="vectorgroup"
                  autoComplete="Date"
                  onChange={(e) => setVectorgroup(e.target.value)}
                  // className={errors.vector && touched.vector ? "error" : null}
                  data={values.vector}
                  // onChange={handleChange}
                  value={vectorgroup}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "26vw", textAlign: "left" }}>
                  <InputLabel id="demo-select-small">
                    Material of Winding
                  </InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="matofwind"
                    required
                    label="Material of Winding"
                    name="matofwind"
                    onChange={(e) => setMatofwind(e.target.value)}
                    // className={
                    //   errors.materialWinding && touched.materialWinding
                    //     ? "error"
                    //     : null
                    // }
                    data={values.materialWinding}
                    // onChange={handleChange}
                    onBlur={handleBlur}
                    onSubmit={handleSubmit}
                  >
                    <MenuItem value={"Copper"}>Copper</MenuItem>
                    <MenuItem value={"Aluminium"}>Aluminium</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  label="Type of Cooling"
                  id="typecolling"
                  name="typecolling"
                  autoComplete="Date"
                  onChange={(e) => setTypecolling(e.target.value)}
                  // className={errors.cooling && touched.cooling ? "error" : null}
                  data={values.cooling}
                  // onChange={handleChange}
                  value={typecolling}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  style={{ width: "26vw" }}
                  fullWidth
                  required
                  label="Primary Voltage V"
                  id="priratio"
                  name="priratio"
                  autoComplete="Date"
                  onChange={(e) => setPriratio(e.target.value)}
                  // className={
                  //   errors.primaryVoltage && touched.primaryVoltage
                  //     ? "error"
                  //     : null
                  // }
                  value={priratio}
                  data={values.primaryVoltage}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  label="Core"
                  id="core"
                  name="core"
                  autoComplete="Date"
                  onChange={(e) => setCore(e.target.value)}
                  // className={errors.core && touched.core ? "error" : null}
                  data={values.core}
                  value={core}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  required
                  label="Secondary Voltage V"
                  id="secratio"
                  name="secratio"
                  autoComplete="Date"
                  // className={
                  //   errors.secVoltage && touched.secVoltage ? "error" : null
                  // }
                  data={values.secVoltage}
                  onChange={(e) => setSecratio(e.target.value)}
                  value={secratio}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <div>
                  <TextField
                    fullWidth
                    multiline
                    label="Comment (optional)"
                    id="comment"
                    style={{ width: "26vw" }}
                    name="comment"
                    autoComplete="Date"
                    value={comment}
                    onChange={(e) => {
                      let value = e.target.value;
                      let lines = value.split("\n");
                      if (lines.length > 3) {
                        lines = lines.slice(0, 3);
                      }
                      lines = lines.map((line) => line.slice(0, 40));
                      setComment(lines.join("\n"));
                    }}
                    onBlur={handleBlur}
                    onSubmit={handleSubmit}
                    inputProps={{
                      maxLength: 122, // 40 chars * 3 lines + 2 newline characters
                    }}
                    minRows={3}
                    maxRows={3}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#f90000ff",
                      marginTop: "4px",
                    }}
                  >
                    Note: Maximum 3 lines allowed, with up to 40 characters per line.
                  </p>
                </div>
              </Grid>

              {/* <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  label="Comment (optional)"
                  id="comment"
                  style={{ width: "26vw" }}
                  name="comment"
                  autoComplete="Date"
                  onChange={(e) => setComment(e.target.value)}
                  // className={errors.comment && touched.comment ? "error" : null}
                  data={values.comment}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid> */}
              {/* <Grid item xs={7} sm={3.5}>
  <TextField
    fullWidth
    required
    label="Type of Taping Switch"
    id="typetaping"
    name="typetaping"
    autoComplete="off"
    value={tapingSwitch === 'notapping' ? 'No Tapping' : typetaping}
    select={showDropdown && (tapingSwitch === 'oltc' || tapingSwitch === 'octc')}
    disabled={tapingSwitch === 'notapping'}
    InputProps={{
      endAdornment: typetaping && (tapingSwitch === 'oltc' || tapingSwitch === 'octc') && (
        <IconButton onClick={handleClearSelection} edge="end">
          <ClearIcon />
        </IconButton>
      ),
    }}
    onChange={(e) => setTypetaping(e.target.value)}
  >
    {showDropdown && (tapingSwitch === 'oltc' || tapingSwitch === 'octc') && (
      <>
        {tapingSwitch === 'oltc' && (
          <>
            <MenuItem value="type1" onClick={() => handleDropdownChange("℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer")}>℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer</MenuItem>
            <MenuItem value="type2" onClick={() => handleDropdownChange("℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer")}>℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer</MenuItem>
            <MenuItem value="other" onClick={() => handleDropdownChange("other")}>Other OLTC</MenuItem>
            
          </>
        )}
        {tapingSwitch === 'octc' && (
          <>
            <MenuItem value="option3" onClick={() => handleDropdownChange("℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer")}>℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer</MenuItem>
            <MenuItem value="option4" onClick={() => handleDropdownChange("℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer")}>℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer</MenuItem>
            <MenuItem value="others" onClick={() => handleDropdownChange("others")}>Other OCTC</MenuItem>
            
          </>
        )}
      </>
    )}
  </TextField>

  

  <FormControl component="fieldset">
    <RadioGroup aria-label="taping-switch" name="taping-switch" value={tapingSwitch} onChange={handleRadioChange} row>
      
      <FormControlLabel value="octc" control={<Radio />} label="OCTC" />
      <FormControlLabel value="oltc" control={<Radio />} label="OLTC" />
      <FormControlLabel value="nottaping" control={<Radio />} label="No Taping" />
    </RadioGroup>
  </FormControl>
</Grid> */}
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  label="Frequency *"
                  id="frequency"
                  name="frequency"
                  autoComplete="Date"
                  onChange={(e) => setFrequency(e.target.value)}
                  value={frequency}
                  data={values.frequency}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "26vw", textAlign: "left" }}>
                  <InputLabel id="demo-select-small">Phase *</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="phase"
                    label="Number of Phase"
                    name="phase"
                    onChange={(e) => setPhase(e.target.value)}
                    value={phase}
                    onBlur={handleBlur}
                    onSubmit={handleSubmit}
                  >
                    <MenuItem value={"1"}>1Phase</MenuItem>
                    <MenuItem value={"3"}>3Phase</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <FormControl style={{ width: "26vw", textAlign: "left" }}>
                  <InputLabel id="costing-design-label">Costing Design *</InputLabel>
                  <Select
                    labelId="costing-design-label"
                    id="costingDesign"
                    label="Costing Design *"
                    name="costingDesign"
                    value={costingDesign}
                    onChange={(e) => setCostingDesign(e.target.value)}
                    required
                  >
                    <MenuItem value="D1">D1</MenuItem>
                    <MenuItem value="D2">D2</MenuItem>
                    <MenuItem value="D3">D3</MenuItem>
                    <MenuItem value="D4">D4</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={7} sm={7}>
                <TextField
                  fullWidth
                  required
                  label="Type of Taping Switch"
                  id="typetaping"
                  name="typetaping"
                  autoComplete="off"
                  value={
                    tapingSwitch === "nottaping" ? "No Taping" : typetaping
                  }
                  select={
                    showDropdown &&
                    (tapingSwitch === "oltc" || tapingSwitch === "octc")
                  }
                  disabled={tapingSwitch === "nottaping"}
                  InputProps={{
                    endAdornment: typetaping &&
                      (tapingSwitch === "oltc" || tapingSwitch === "octc") && (
                        <IconButton onClick={handleClearSelection} edge="end">
                          <ClearIcon />
                        </IconButton>
                      ),
                  }}
                  onChange={(e) => setTypetaping(e.target.value)}
                >
                  {showDropdown &&
                    (tapingSwitch === "oltc" || tapingSwitch === "octc") && (
                      <>
                        {tapingSwitch === "oltc" && (
                          <>
                            <MenuItem
                              value="type1"
                              onClick={() =>
                                handleDropdownChange(
                                  "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
                                )
                              }
                            >
                              ℅ H. V. variation of +10℅ to -10℅ in equal steps
                              of 1.25℅ On load tap changer
                            </MenuItem>
                            <MenuItem
                              value="type2"
                              onClick={() =>
                                handleDropdownChange(
                                  "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
                                )
                              }
                            >
                              ℅ H. V. variation of +5℅ to -15℅ in equal steps of
                              1.25℅ On load tap changer
                            </MenuItem>
                            <MenuItem
                              value="other"
                              onClick={() => handleDropdownChange("other")}
                            >
                              Other OLTC
                            </MenuItem>
                            {/* Add other dropdown options here */}
                          </>
                        )}
                        {tapingSwitch === "octc" && (
                          <>
                            <MenuItem
                              value="option3"
                              onClick={() =>
                                handleDropdownChange(
                                  "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
                                )
                              }
                            >
                              ℅ H. V. variation of +2.5℅ to -5℅ in equal steps
                              of 2.5℅ Off circuit tap changer
                            </MenuItem>
                            <MenuItem
                              value="option4"
                              onClick={() =>
                                handleDropdownChange(
                                  "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
                                )
                              }
                            >
                              ℅ H. V. variation of +5℅ to -10℅ in equal steps of
                              2.5℅ Off circuit tap changer
                            </MenuItem>
                            <MenuItem
                              value="others"
                              onClick={() => handleDropdownChange("others")}
                            >
                              Other OCTC
                            </MenuItem>
                            {/* Add other dropdown options here */}
                          </>
                        )}
                      </>
                    )}
                </TextField>

                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="taping-switch"
                    name="taping-switch"
                    value={tapingSwitch}
                    onChange={handleRadioChange}
                    row
                  >
                    <FormControlLabel
                      value="octc"
                      control={<Radio />}
                      label="OCTC"
                    />
                    <FormControlLabel
                      value="oltc"
                      control={<Radio />}
                      label="OLTC"
                    />
                    <FormControlLabel
                      value="nottaping"
                      control={<Radio />}
                      label="No Taping"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={7} sm={3.5}>
                {tapingSwitch === "octc" && typetaping === "others" && (
                  <TextField
                    fullWidth
                    label="Other Type of Taping Switch"
                    value={otherTypetaping}
                    onChange={(e) => setOtherTypetaping(e.target.value)}
                  />
                )}
                {tapingSwitch === "oltc" && typetaping === "other" && (
                  <TextField
                    fullWidth
                    label="Other Type of Taping Switch"
                    value={otherTypetaping}
                    onChange={(e) => setOtherTypetaping(e.target.value)}
                  />
                )}
              </Grid>


              {/* <Grid item xs={7} sm={3.5}>
              <FormControl style={{ width: "25vw" }}>
  <InputLabel id="demo-select-small">
    Select a Costing 
  </InputLabel>
  <Select
    fullWidth
    label="Select a Costing 1"
    id="selectcosting"
    name="selectcosting"
    value={selectedCostingName}
    onChange={(e) => {
      const selectedName = e.target.value;
      setSelectedCostingName(selectedName);
    }}
  >
    <MenuItem value="">Select a Costing 1</MenuItem>
    {costingIDs.map((item) => (
      <MenuItem key={item.id} value={item.costingname}>
        {item.costingname}
      </MenuItem>
    ))}
  </Select>
</FormControl>

              </Grid> */}
            </Grid>
            <br />
            <br />
            <Grid
              sx={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={addEnq}
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
            <br />
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default New;
