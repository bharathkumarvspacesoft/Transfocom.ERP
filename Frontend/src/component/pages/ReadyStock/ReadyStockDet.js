
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

const ReadyStockDet = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(search).get("id");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getProductionDetails/` + id); // Replace with your API endpoint
      const jsonData = await response.json();

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

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div class="d-flex justify-content-between">

            <div>
              <h3>Ready Stock details</h3>
            </div>
            <Link to="/readystocklist" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ background: "#28a745" }}>
                Back
              </Button>
            </Link>
          </div>
          <Paper style={{ marginTop: 20, height: 2000 }}>
            <Box sx={{ padding: '5px' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="Email"
                    label="Customer Email"
                    labelprope
                    name="Email"
                    value={data.email}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="Contact No"
                    label="Customer Contact No"
                    labelprope
                    name="Contact No"
                    value={data.contactno}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    multiline
                    id="Address"
                    label="Customer Address"
                    labelprope
                    name="Address"
                    value={data.address}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="Consumer"
                    label="Consumer Name"
                    labelprope
                    name="Consumer"
                    value={data.consumer}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    multiline
                    id="Consumer"
                    label="Consumer Address"
                    labelprope
                    name="Consumer"
                    value={data.consumer_address}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="Production Plan Qty"
                    label="Production Plan Qty"
                    labelprope
                    name="ProductionPlanQty"
                    value={data.productionqty}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="Ready Stock Qty"
                    label="Ready Stock Qty"
                    labelprope
                    name="ReadyStockQty"
                    value={data.readyqty}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="Ready Stock Qty"
                    label="Ready Stock Qty"
                    labelprope
                    name="ReadyStockQty"
                    value={data.readyqty}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="costing"
                    label="Costing Name"
                    labelprope
                    name="costing"
                    value={data.selectedcosting || data.costingname}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default ReadyStockDet;
