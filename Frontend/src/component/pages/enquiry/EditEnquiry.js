import React from "react";
import {
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  styled,
  Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import "./enquiry.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { APP_BASE_PATH } from "Host/endpoint";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { ClearIcon, DatePicker } from "@mui/x-date-pickers";
import LoadingSpinner from "component/commen/LoadingSpinner";
import { use } from "react";
import { set } from "date-fns";

const ResizableTextField = styled(TextField)({
  "& .MuiInputBase-root textarea": {
    resize: "vertical",
    overflow: "auto",
  },
});

const EditEnquiry = () => {
  const [optionlist, setOptionlist] = useState([]);
  const [selectedCostingName, setSelectedCostingName] = useState("");
  const [costingIDs, setCostingIDs] = useState([]);
  const [cid, setCid] = useState("");
  const [filteredCostings, setFilteredCostings] = useState([]);
  const navigate = useNavigate();
  const [typetaping, setTypetaping] = useState("");
  const [tapingSwitch, setTapingSwitch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [costingDesign, setCostingDesign] = useState("D1");
  const [otherTypetaping, setOtherTypetaping] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [button, setButton] = useState(false);
  const [selectedCostingId, setSelectedCostingId] = useState("");
  const [data, setData] = useState({
    custname: "",
    contactperson: "",
    desg: "",
    email: "",
    contactno: "",
    altcontactno: "",
    address: "",
    currency: "",
    edate: "",
    capacity: "",
    type: "",
    hvvoltage: "",
    consumertype: "",
    lvvoltage: "",
    areaofdispatch: "",
    vectorgroup: "",
    matofwind: "",
    typecolling: "",
    typetaping: "",
    tapingSwitch: "",
    comment: "",
    voltageratio: "",
    core: "",
    secratio: "",
    priratio: "",
    frequency: "50",
    phase: "",
    costingDesign: "D1", // Add this line
  });

  const { id } = useParams();
  const [finalcosting, setFinalcosting] = useState(null);

  // Update the costing selection change handler
  const handleCostingChange = (e) => {
    const selectedName = e.target.value;
    setSelectedCostingName(selectedName);

    // Find the selected costing to get its ID
    const selectedCosting = costingsToDisplay.find(
      item => item.costingname === selectedName
    );

    if (selectedCosting) {
      setSelectedCostingId(selectedCosting.cid || selectedCosting.id);
    } else {
      setSelectedCostingId("");
    }
  };

  // Function to fetch filtered costings based on 15 parameters
  const fetchFilteredCostings = async (params) => {
    try {
      const queryParams = {
        capacity: params.capacity,
        consumertype: params.consumertype,
        type: params.type,
        hvvoltage: params.hvvoltage,
        lvvoltage: params.lvvoltage,
        vectorgroup: params.vectorgroup,
        matofwind: params.matofwind,
        typecolling: params.typecolling,
        priratio: params.priratio,
        core: params.core,
        secratio: params.secratio,
        frequency: params.frequency,
        phase: params.phase,
        tapingSwitch: params.tapingSwitch,
        typetaping: params.typetaping,
      };

      // Remove empty parameters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetch(
        `${APP_BASE_PATH}/getFilteredCostings?${queryString}`
      );
      console.log(response);


      if (response.ok) {
        const filteredData = await response.json();
        setFilteredCostings(filteredData);

        // Clear selected costing if filtered results are empty
        if (filteredData.length === 0) {
          setSelectedCostingName("");
          // If you have other state for costing, clear those too
          // setData(prev => ({ ...prev, selectedcosting: "" }));
        }

        console.log("Filtered costings:", filteredData);
      } else {
        console.error("Failed to fetch filtered costings");
        setFilteredCostings([]);
        setSelectedCostingName(""); // Clear selection on error too
      }
    } catch (error) {
      console.error("Error fetching filtered costings:", error);
      setFilteredCostings([]);
      setSelectedCostingName(""); // Clear selection on error too
    }
  };

  // Fetch all costing IDs on mount
  useEffect(() => {
    const fetchCostingIDs = async () => {
      setIsLoading(true);
      setButton(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getcostingmaster`);
        if (response.ok) {
          const data = await response.json();
          setCostingIDs(data);
          console.log("All costings:", data);
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
    fetchCostingIDs();
  }, []);

  // Fetch enquiry data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setButton(true);
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editenq/${id}`);
        const resData = await reqData.json();
        console.log("resData", resData);
        setFinalcosting(resData.final_costing);
        setCid(resData.cid)
        setData(resData);
        setTapingSwitch(resData.tapingSwitch);
        setTypetaping(resData.typetaping);
        setCostingDesign(resData.costingDesign || "D1"); // Add this line
        setShowDropdown(
          resData.tapingSwitch === "oltc" || resData.tapingSwitch === "octc"
        );

        // Fetch filtered costings based on initial data
        await fetchFilteredCostings(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setButton(false);
      }
    };

    fetchData();
  }, [id]);

  // Monitor changes to the 15 key parameters and refetch filtered costings
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // Only fetch if we have the critical parameters
      if (
        data.capacity &&
        data.type &&
        data.hvvoltage &&
        data.consumertype &&
        data.lvvoltage
      ) {
        fetchFilteredCostings({
          capacity: data.capacity,
          consumertype: data.consumertype,
          type: data.type,
          hvvoltage: data.hvvoltage,
          lvvoltage: data.lvvoltage,
          vectorgroup: data.vectorgroup,
          matofwind: data.matofwind,
          typecolling: data.typecolling,
          priratio: data.priratio,
          core: data.core,
          secratio: data.secratio,
          frequency: data.frequency,
          phase: data.phase,
          tapingSwitch: tapingSwitch,
          typetaping: typetaping,
        });
      }
    }, 500); // Debounce for 500ms to avoid too many API calls

    return () => clearTimeout(debounceTimer);
  }, [
    data.capacity,
    data.consumertype,
    data.type,
    data.hvvoltage,
    data.lvvoltage,
    data.vectorgroup,
    data.matofwind,
    data.typecolling,
    data.priratio,
    data.core,
    data.secratio,
    data.frequency,
    data.phase,
    tapingSwitch,
    typetaping,
  ]);

  useEffect(() => {
    setShowDropdown(tapingSwitch === "oltc" || tapingSwitch === "octc");
  }, [tapingSwitch]);

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setTapingSwitch(value);
    setTypetaping("");
    setShowDropdown(value === "oltc" || value === "octc");
    setData((prevData) => ({
      ...prevData,
      tapingSwitch: value,
      typetaping: "",
    }));
  };

  const handleDropdownChange = (value) => {
    setTypetaping(value);
    setData((prevData) => ({
      ...prevData,
      typetaping: value,
    }));
    setShowDropdown(false);
  };

  const handleClearSelection = () => {
    setShowDropdown(true);
    setData((prevData) => ({
      ...prevData,
      typetaping: "",
    }));
  };

  const handleEdit = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    const dayjsDate = dayjs(date);
    setData({ ...data, edate: dayjsDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setButton(true);
    const editInputvalue = {
      custname: data.custname,
      contactperson: data.contactperson,
      desg: data.desg,
      email: data.email,
      gstno: data.gstno,
      contactno: data.contactno,
      altcontactno: data.altcontactno,
      address: data.address,
      currency: data.currency,
      edate: data.edate,
      capacity: data.capacity,
      type: data.type,
      hvvoltage: data.hvvoltage,
      consumertype: data.consumertype,
      lvvoltage: data.lvvoltage,
      areaofdispatch: data.areaofdispatch,
      vectorgroup: data.vectorgroup,
      matofwind: data.matofwind,
      typecolling: data.typecolling,
      typetaping: data.typetaping,
      comment: data.comment,
      voltageratio: data.voltageratio,
      core: data.core,
      secratio: data.secratio,
      priratio: data.priratio,
      costingName: selectedCostingName || data.selectedcosting || finalcosting,
      otherTypetaping,
      tapingSwitch,
      frequency: data.frequency,
      phase: data.phase,
      costingDesign: costingDesign,
    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateEnquiry/` + id, {
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
      }).then(() => {
        navigate("/enquiry");
      });
    } finally {
      setIsLoading(false);
      setButton(false);
    }
  };

  // Determine which costings to show in dropdown
  const costingsToDisplay = filteredCostings.length > 0 ? filteredCostings : costingIDs;


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
              <h4>Edit Enquiry</h4>
            </div>
            <Link to="/enquiry" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ background: "#17a2b8" }}>
                Back
              </Button>
            </Link>
          </div>

          <Paper elevation={6} style={{ position: "relative", bottom: 15 }}>
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
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      id="custname"
                      label="Customer Name"
                      name="custname"
                      autoComplete="custname"
                      value={data.custname}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      id="contactperson"
                      label="Contact Person"
                      name="contactperson"
                      autoComplete="contactperson"
                      value={data.contactperson}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      id="desg"
                      label="Designation (Optional)"
                      name="desg"
                      autoComplete="desg"
                      value={data.desg}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Email (Optional)"
                      name="email"
                      autoComplete="email"
                      value={data.email}
                      onChange={handleEdit}
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
                      autoComplete="gstno"
                      value={data.gstno}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      id="contactno"
                      label="Contact No."
                      name="contactno"
                      autoComplete="contactno"
                      value={data.contactno}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      id="altcontactno"
                      label="Alt.Contact No. (Optional)"
                      autoComplete="altcontactno"
                      name="altcontactno"
                      value={data.altcontactno}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={7} sm={3.5}>
                    <div>
                      <ResizableTextField
                        fullWidth
                        required
                        multiline
                        id="address"
                        label="Address"
                        name="address"
                        autoComplete="address"
                        value={data.address}
                        onChange={(e) => {
                          let value = e.target.value;
                          let lines = value.split("\n");
                          if (lines.length > 3) {
                            lines = lines.slice(0, 3);
                          }
                          lines = lines.map((line) => line.slice(0, 50));
                          handleEdit({
                            target: {
                              name: e.target.name,
                              value: lines.join("\n"),
                            },
                          });
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          maxLength: 153,
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
                        Note: Maximum 3 lines allowed, with up to 50 characters
                        per line.
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <FormControl style={{ width: "26vw", textAlign: "left" }}>
                      <InputLabel id="demo-select-small">Currency</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="currency"
                        required
                        label="Currency"
                        name="currency"
                        autoComplete="currency"
                        value={data.currency}
                        onChange={handleEdit}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        <MenuItem value={"INR"}>INR(Indian Rupee)</MenuItem>
                        <MenuItem value={"USD"}>USD (US Doller)</MenuItem>
                        <MenuItem value={"IDR"}>
                          IDR(Indonesian Rupiah)
                        </MenuItem>
                        <MenuItem value={"EUR"}>EUR (Euro)</MenuItem>
                        <MenuItem value={"AUD"}>
                          AUD(Australian Doller)
                        </MenuItem>
                        <MenuItem value={"IRR"}>IRR (Iranian rial)</MenuItem>
                        <MenuItem value={"CAD"}>CAD(Canadian Dollar)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <FormControl style={{ width: "25vw" }}>
                        <DatePicker
                          fullWidth
                          label="Date of Enquiry"
                          format="DD-MM-YYYY"
                          required
                          name="edate"
                          value={
                            data.edate ? dayjs(data.edate, "DD-MM-YYYY") : null
                          }
                          onChange={(date) => handleDateChange(date)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </FormControl>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      id="capacity"
                      label="Capacity"
                      type="number"
                      name="capacity"
                      autoComplete="capacity"
                      value={data.capacity}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <FormControl style={{ width: "26vw", textAlign: "left" }}>
                      <InputLabel id="demo-select-small">Type</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="type"
                        name="type"
                        required
                        label="Type"
                        autoComplete="type"
                        value={data.type}
                        onChange={handleEdit}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                      >
                        <MenuItem value={"1"}>OUTDOOR</MenuItem>
                        <MenuItem value={"2"}>INDOOR</MenuItem>
                        <MenuItem value={"3"}>OUTDOOR/INDOOR</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      id="hvvoltage"
                      label="HV"
                      name="hvvoltage"
                      autoComplete="hvvoltage"
                      value={data.hvvoltage}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>

                  <Grid item xs={7} sm={3.5}>
                    <FormControl style={{ width: "26vw", textAlign: "left" }}>
                      <InputLabel label="Consumer Type">
                        Consumer Type
                      </InputLabel>
                      <Select
                        labelId="demo-select-small"
                        required
                        id="consumertype"
                        label="Consumer Type"
                        name="consumertype"
                        autoComplete="consumertype"
                        value={data.consumertype}
                        onChange={handleEdit}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={data.enqstatus >= 1 && data.enqstatus != 10}
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
                      id="lvvoltage"
                      label="LV"
                      name="lvvoltage"
                      autoComplete="lvvoltage"
                      value={data.lvvoltage}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      id="areaofdispatch"
                      label="Area of Dispatch (optional)"
                      name="areaofdispatch"
                      autoComplete="areaofdispatch"
                      value={data.areaofdispatch}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>

                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      id="vectorgroup"
                      label="Vector Group"
                      name="vectorgroup"
                      autoComplete="vectorgroup"
                      value={data.vectorgroup}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
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
                        autoComplete="matofwind"
                        value={data.matofwind}
                        onChange={handleEdit}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                      >
                        <MenuItem value={"Copper"}>Copper</MenuItem>
                        <MenuItem value={"Aluminium"}>Aluminium</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      id="typecolling"
                      required
                      label="Type of Colling"
                      name="typecolling"
                      autoComplete="typecolling"
                      value={data.typecolling}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>

                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      style={{ width: "26vw" }}
                      fullWidth
                      required
                      id="priratio"
                      label="Primary Voltage"
                      name="priratio"
                      autoComplete="priratio"
                      value={data.priratio}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      id="core"
                      label="Core"
                      name="core"
                      autoComplete="core"
                      value={data.core}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>

                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      id="secratio"
                      label="Secondary Voltage"
                      name="secratio"
                      autoComplete="secratio"
                      value={data.secratio}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>

                  {/* <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      id="comment"
                      label="Comment (optional)"
                      name="comment"
                      autoComplete="comment"
                      value={data.comment}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    // disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid> */}

                  <Grid item xs={7} sm={3.5}>
                    <div>
                      <TextField
                        fullWidth
                        multiline
                        id="comment"
                        label="Comment (optional)"
                        name="comment"
                        autoComplete="comment"
                        value={data.comment}
                        onChange={(e) => {
                          let value = e.target.value;
                          let lines = value.split("\n");
                          if (lines.length > 3) {
                            lines = lines.slice(0, 3);
                          }
                          lines = lines.map((line) => line.slice(0, 40));
                          handleEdit({
                            target: {
                              name: e.target.name,
                              value: lines.join("\n"),
                            },
                          });
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
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


                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      id="frequency"
                      label="Frequency"
                      name="frequency"
                      autoComplete="frequency"
                      value={data.frequency}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>

                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      id="phase"
                      label="Phase"
                      name="phase"
                      autoComplete="phase"
                      value={data.phase}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
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
                        disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        <MenuItem value="D1">D1</MenuItem>
                        <MenuItem value="D2">D2</MenuItem>
                        <MenuItem value="D3">D3</MenuItem>
                        <MenuItem value="D4">D4</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={7} sm={3.5}>
                    <TextField
                      fullWidth
                      required
                      label="Type of Taping Switch"
                      id="tapingSwitch"
                      name="tapingSwitch"
                      autoComplete="off"
                      value={
                        tapingSwitch === "nottaping"
                          ? "No Taping"
                          : `${data.tapingSwitch}`.toUpperCase() || ""
                      }
                      disabled={data.enqstatus >= 1 && data.enqstatus != 10}
                    />
                  </Grid>

                  <Grid item xs={8} sm={7}>
                    <TextField
                      fullWidth
                      required
                      label="Type of Taping Switch"
                      id="typetaping"
                      name="typetaping"
                      value={typetaping || tapingSwitch}
                      disabled={data.enqstatus >= 1}
                    />
                  </Grid>

                  {/* <Grid item xs={8} sm={7}>
                    <FormControl
                      style={{ width: "51.2vw" }}
                      disabled={filteredCostings.length === 0 || data.enqstatus == 1 || data.enqstatus == 3 || data.enqstatus == 4 || data.enqstatus == 5}
                    >
                      <InputLabel id="demo-select-small">
                        Select a Costing
                        {filteredCostings.length > 0 &&
                          ` (${filteredCostings.length} matching)`}
                      </InputLabel>
                      <Select
                        fullWidth
                        label="Select a Costing"
                        id="selectcosting"
                        name="selectcosting"
                        value={
                          selectedCostingName ||
                          data.selectedcosting ||
                          finalcosting
                        }
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          setSelectedCostingName(selectedName);
                        }}
                      >
                        <MenuItem value=" ">Select a Costing</MenuItem>
                        {costingsToDisplay.map((item) => (
                          <MenuItem key={item.id} value={item.costingname}>
                            {item.costingname}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      *Kindly double-check the Costing Name before saving. Once
                      saved, it cannot be modified later.
                    </Typography>

                    {filteredCostings.length === 0 && costingIDs.length > 0 && (
                      <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                        "The costing for this configuration has not been completed yet."
                      </Typography>
                    )}
                  </Grid> */}

                  <Grid item xs={8} sm={7}>
                    <FormControl
                      style={{ width: "51.2vw" }}
                      disabled={
                        filteredCostings.length === 0 ||
                        data.enqstatus == 1 ||
                        data.enqstatus == 3 ||
                        data.enqstatus == 4 ||
                        data.enqstatus == 5
                      }
                    >
                      <InputLabel id="demo-select-small">
                        Select a Costing
                        {filteredCostings.length > 0 &&
                          ` (${filteredCostings.length} matching)`}
                      </InputLabel>
                      <Select
                        fullWidth
                        label="Select a Costing"
                        id="selectcosting"
                        name="selectcosting"
                        value={
                          selectedCostingName ||
                          data.selectedcosting ||
                          finalcosting
                        }
                        onChange={handleCostingChange}
                      >
                        <MenuItem value=" ">Select a Costing</MenuItem>
                        {costingsToDisplay.map((item) => (
                          <MenuItem key={item.id} value={item.costingname}>
                            {item.costingname}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      *Kindly double-check the Costing Name before saving. Once
                      saved, it cannot be modified later.
                    </Typography>

                    {filteredCostings.length === 0 && costingIDs.length > 0 && (
                      <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                        "The costing for this configuration has not been completed yet."
                      </Typography>
                    )}
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
                  </Grid>{
                    data.cid && (
                      <Grid item xs={7} sm={3.5}>
                        <Typography align="right"
                          variant="body1"
                          sx={{
                            mt: 1,
                            fontWeight: 'bold',
                            color: '#1976d2'
                          }}
                        >COSTING ID {data.cid}</Typography>
                      </Grid>
                    )
                  }

                  <Grid item xs={8} sm={7}>
                    {selectedCostingId && (
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 1,
                          fontWeight: 'bold',
                          color: '#1976d2'
                        }}
                      >
                        Costing ID: {selectedCostingId}
                      </Typography>
                    )}
                  </Grid>
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
                    sx={{ background: "#007bff" }}
                    onClick={handleSubmit}
                    type="submit"
                    disabled={button}
                  >
                    Update
                  </Button>

                  <NavLink to="/enquiry">
                    <Button variant="contained" color="error">
                      Cancel
                    </Button>
                  </NavLink>
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

export default EditEnquiry;