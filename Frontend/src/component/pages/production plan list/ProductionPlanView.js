import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {TextareaAutosize} from "@mui/base/TextareaAutosize";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import "./productionlist.css";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
const type = {
  1: "OUTDOOR",
  2: "INDOOR",
  3: "OUTDOOR/INDOOR",
};

const ProductionPlanListDetails = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getproductinlist/` + id); 
      const jsonData = await response.json();
      
      console.log(jsonData);
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const formatDate = new Date(data.orderacc_date);
  const day = formatDate.getDate().toString().padStart(2, '0');
  const month = (formatDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const year = formatDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`; // This formats the date to DD-MM-YYYY
   
  //const formatDate = new Date(data.orderacc_date).toDateString('en-GB')
  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      <div class="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
      
        <div className="page_header">
          <h4>Production plan List details</h4>
        </div>
        <Link to="/productionPlanList" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ backgroundColor: "#00d284" ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} >
            Back
          </Button>
        </Link>
      </div>
      <Paper elevation={10}style={{ position: "relative", bottom: 52 }} >
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            columns={12}
            style={{ marginTop: 50, display: "flex", justifyContent: "center" }}
          >
            <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
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
            <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
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
                autoComplete="Date"
              />
            </Grid>
            <Grid item xs={4} style={{ marginTop: 5 }}>
              <TextField
                fullWidth
                id="Address*"
                label="Address*"
                labelprope
                name="Address*"
                value={data.address}
                InputLabelProps={{
                  shrink: true,
                }}
                autoComplete="Date"
              />
            </Grid>
            <Grid item xs={4} style={{ marginTop: 5 }}>
              <TextField
                fullWidth
                id="Capacity*"
                label="Capacity*"
                labelprope
                name="Capacity*"
                value={data.capacity}
                InputLabelProps={{
                  shrink: true,
                }}
                autoComplete="Date"
                
              />
            </Grid>

            <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
  <TextField
    fullWidth
    id="Type"
    label="Type"
    name="Type"
    value={
      data.type === 1 ? 'OUTDOOR' :
      data.type === 2 ? 'INDOOR' :
      data.type === 3 ?'OUTDOOR/INDOOR':
      'Undifined'
    }
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
                id="Consumer Type "
                label="Consumer Type "
                labelprope
                name="Consumer Type "
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
            <Grid item xs={4} style={{ marginTop: 5 }}>
            <TextField
                fullWidth
                id="
                Type Of Taping Switch"
                label="
                Type Of Taping Switch"
                labelprope
                name="
                Type Of Taping Switch"
                value={data.tapingSwitch == "nottaping" ? 'No Tapping' : `${data.tapingSwitch}:-${data.typetaping}`}
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
            <Grid item xs={4} >
             
              <TextField
                fullWidth
                id="Transportation"
                label="Transportation"
                labelprope
                name="Transportation "
                value={data.transport}
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
                autoComplete="Date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
            <TextField
                fullWidth
                id="Consumer"
                label="Order Date"
                labelprope
                name="Consumer"
                value={formattedDate}
                autoComplete="Date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
             
            </Grid>
            <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
              <TextField
                fullWidth
                id="Status"
                label="Status"
                labelprope
                name="Status"
               
                value={
                  data.ostatus === 1 ? 'Accept' :
                  data.ostatus === 2 ? 'Reject' :
                 
                  'Undifined'
                }
                autoComplete="Date"
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
                autoComplete="Date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <br/>
      </Paper>
      </>
      )}
    </>
  );
};

export default ProductionPlanListDetails;
