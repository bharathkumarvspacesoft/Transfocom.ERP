import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect } from "react";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

const StyledInputElement = styled("input")(
  ({ theme }) => `
  width: 320px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};


  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[500]};
    
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
const type = {
  1: "OUTDOOR",
  2: "INDOOR",
  3: "OUTDOOR/INDOOR",
};
const status = {
  1: "Accepted",
  2: "Cancelled",
};
const StyledTextareaElement = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 810px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 3  ;
  padding: 12px;
  border-radius: 5px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[500]};
  

  &:hover {
    border-color:black;
  }

  &:focus {
    border-color: ${blue[500]};
    
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const ProductionPlanDetails = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(search).get("id");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${APP_BASE_PATH}/getProductionDetails/` + id
      ); // Replace with your API endpoint
      const jsonData = await response.json();
      console.log("jsonData", jsonData);
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div class="d-flex justify-content-between">
            {isLoading && (
              <div id="spinner">
                <CircularProgress color="warning" loading={isLoading} />
              </div>
            )}
            <div>
              <h3>Production plan details</h3>
            </div>
            <Link to="/productionPlan" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ background: "#28a745" }}>
                Back
              </Button>
            </Link>
          </div>
          <Paper style={{ marginTop: 20, height: 2000 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid
                container
                spacing={2}
                columns={12}
                style={{
                  marginTop: 50,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    // fullWidth
                    // label
                    // id="Prod Plan Ref No"
                    // label="Prod Plan Ref No"
                    // labelprope
                    // name="Prod Plan Ref No"
                    // value={data.wo_no}
                    fullWidth
                    label="Prod Plan Ref No"
                    id="Prod Plan Ref No"
                    labelprope
                    name="Prod Plan Ref No"
                    value={data.wo_no}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Prod Plan Date"
                    label="Prod Plan Date"
                    labelprope
                    name="Prod Plan Date"
                    value={data.plan_date}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Customer Name*"
                    label="Customer Name*"
                    labelprope
                    name="Customer Name*"
                    value={data.custname}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="ContactPerson*"
                    label="Contact Person*"
                    labelprope
                    name="ContactPerson*"
                    value={data.contactperson}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Designation"
                    label="Designation"
                    labelprope
                    name="Designation"
                    value={data.desg}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Email"
                    label="Email"
                    labelprope
                    name="Email"
                    value={data.email}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Contact No"
                    label="Contact No"
                    labelprope
                    name="Contact No"
                    value={data.contactno}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Alt Contact No"
                    label="Alt Contact No"
                    labelprope
                    name="Alt Contact No"
                    value={data.altcontactno}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Address"
                    label="Address"
                    labelprope
                    name="Address"
                    value={data.address}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Currency"
                    label="Currency"
                    labelprope
                    name="Currency"
                    value={data.currency}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Date Of Enquiry"
                    label="Date Of Enquiry"
                    labelprope
                    name="Date Of Enquiry"
                    value={data.edate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Capacity"
                    label="Capacity"
                    labelprope
                    name="Capacity"
                    value={data.capacity}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Type"
                    label="Type"
                    labelprope
                    name="Type"
                    value={type[data.type]}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="HV"
                    label="HV "
                    labelprope
                    name="HV"
                    value={data.hvvoltage}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Consumer Type"
                    label="Consumer Type "
                    labelprope
                    name="Consumer Type"
                    value={data.consumertype}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="LV"
                    label="LV"
                    labelprope
                    name="LV"
                    value={data.lvvoltage}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="
                Area Of Despatch"
                    label="
                Area Of Despatch"
                    labelprope
                    name="
                Area Of Despatch"
                    value={data.areaofdispatch}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Vector Group"
                    label="Vector Group"
                    labelprope
                    name="Vector Group"
                    value={data.vectorgroup}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="ContactPerson"
                    label="ContactPerson"
                    labelprope
                    name="ContactPerson"
                    value={data.contactperson}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="
                Material Of Winding"
                    label="
                Material Of Winding"
                    labelprope
                    name="
                Material Of Winding"
                    value={data.matofwind}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Type Of Cooling"
                    label="Type Of Cooling"
                    labelprope
                    name="Type Of Cooling"
                    value={data.typecolling}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {/* <Grid item xs={4} style={{ marginTop: 5 }}>
              <TextField
                fullWidth
                id="
                Type Of Taping Switch"
                label="
                Type Of Taping Switch"
                labelprope
                name="
                Type Of Taping Switch"
                value={data.tapingSwitch == "nottaping" ? 'No Tapping' : `${data.tapingSwitch}:-${data.Typetaping}`}


                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}

                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Type Of Taping Switch"
                    label="Type Of Taping Switch"
                    name="Type Of Taping Switch"
                    value={
                      data.tapingSwitch?.toLowerCase() === "nottaping"
                        ? "NO TAPPING"
                        : `${data.tapingSwitch?.toUpperCase() ?? ""} :- ${data.Typetaping ?? ""
                        }`
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Voltage Ratio"
                    label="Voltage Ratio"
                    labelprope
                    name="Voltage Ratio"
                    value={data.voltageratio}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="
                Core"
                    label="
                Core"
                    labelprope
                    name="
                Core"
                    value={data.core}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Quotation Ref"
                    label="Quotation Ref"
                    labelprope
                    name="Quotation Ref"
                    value={data.quotref}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Date"
                    label="Date"
                    labelprope
                    name="Date"
                    value={formatDate(data.qdate)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Cost In Rs"
                    label="Cost In Rs"
                    labelprope
                    name="Cost In Rs"
                    value={data.cost}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Quantity"
                    label="Quantity"
                    labelprope
                    name="Quantity"
                    value={data.qty}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Delivery Period (Days)"
                    label="Delivery Period (Days)"
                    labelprope
                    name="Delivery Period (Days)"
                    value={data.deliveryperiod}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Guaratnee Period (Months)"
                    label="Guaratnee Period (Months)"
                    labelprope
                    name="Quantity"
                    value={data.guranteeperiod}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    style={{ position: "relative" }}
                    fullWidth
                    id="Validity (Days)"
                    label="Validity (Days)"
                    labelprope
                    name="Validity (Days)"
                    value={data.validityofquote}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* <Grid item xs={8} style={{ marginTop: 8, marginLeft: 1 }}>
              <div>
                <h1 style={{ fontSize: 25, marginRight: 700, marginTop: 5 }}>
                  Taxes:-
                </h1>
              </div>
              <div
                class="d-flex justify-content-around"
                style={{ marginTop: -15 }}
              >
                <div>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ position: "relative", right: 160, top: 29 }}
                  >
                    CGST
                  </Typography>
                </div>
                <TextField
                  style={{
                    width: 150,
                    position: "relative",
                    right: 450,
                    top: 20,
                  }}
                  fullWidth
                  id="customer"
                  labelprope
                  name="customer"
                  value={data.cgst}
                />
              </div>
              <FormControl style={{ position: "relative", bottom: 28 }}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={data.cgsttype}
                >
                  <FormControlLabel
                    value="Inclusive"
                    control={<Radio />}
                    label="Inclusive"
                  />
                  <FormControlLabel
                    value="Exclusive"
                    control={<Radio />}
                    label="Exclusive"
                  />
                </RadioGroup>
              </FormControl>
              <div
                class="d-flex justify-content-around"
                style={{ marginTop: -15 }}
              >
                <div>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ position: "relative", right: 159, top: 29 }}
                  >
                    SGST
                  </Typography>
                </div>
                <TextField
                  style={{
                    width: 150,
                    position: "relative",
                    right: 450,
                    top: 20,
                  }}
                  fullWidth
                  id="customer"
                  labelprope
                  name="customer"
                  value={data.sgst}
                />
              </div>
              <FormControl style={{ position: "relative", bottom: 28 }}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={data.sgsttype}
                >
                  <FormControlLabel
                    value="Inclusive"
                    control={<Radio />}
                    label="Inclusive"
                  />
                  <FormControlLabel
                    value="Exclusive"
                    control={<Radio />}
                    label="Exclusive"
                  />
                </RadioGroup>
              </FormControl>

              <div
                class="d-flex justify-content-between"
                style={{ position: "relative", bottom: 200, marginLeft: 700 }}
              >
                <FormControl>
                  <h1 style={{ fontSize: 25, marginRight: 900, marginTop: 5 }}>
                    Transportation:-
                  </h1>
                  <br />
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={data.transport}
                  >
                    <FormControlLabel
                      value="Inclusive"
                      control={<Radio />}
                      label="Inclusive"
                    />
                    <FormControlLabel
                      value="Exclusive"
                      control={<Radio />}
                      label="Exclusive"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </Grid> */}

                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="
                UnloadingatSite"
                    label="
                Unloading at Site"
                    labelprope
                    name="
                Unloading at Site"
                    value={data.unloading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="OrderRefNo"
                    label="Order Ref No"
                    labelprope
                    name="Order Ref No"
                    value={data.ref_no}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Testing Div"
                    label="Testing Div"
                    labelprope
                    name="Testing Div"
                    value={data.testing_div}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="Consumer"
                    label="Consumer"
                    labelprope
                    name="Consumer"
                    value={data.consumer}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="order Date"
                    label="Order Date"
                    labelprope
                    name="order Date"
                    value={formatDate(data.orderacc_date)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Status"
                    label="Status"
                    labelprope
                    name="Status"
                    value={status[data.ostatus]}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="Quantity"
                    label="Quantity"
                    labelprope
                    name="Quantity"
                    value={data.quantity}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <br></br>
              </Grid>
              <div style={{ textAlign: "right", marginRight: "1rem" }}>
                <p>Costing id : {data.cid}</p>
                <p>Costing Name: {data.selectedcosting}</p>
              </div>

            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default ProductionPlanDetails;
