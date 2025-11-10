import * as React from "react";
import { useState } from "react";
import { NavLink, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import "../quotation/quotation.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";

const Create = () => {
  const navigate = useNavigate()
    const { id } = useParams();
    const [data, setData] = useState({
        custname: "",
        pro_invrefno: "",
        pro_invdate: new Date(),
        proformaqty:"",
        
      });// Initialize with an empty object
  
    const fetchData = async () => {
      try {
        const response = await fetch(`${APP_BASE_PATH}/getNewOrderAcc/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();
        console.log("jsonData:", jsonData);
        setData(jsonData[0]);
        const uid = jsonData[0]?.uid;
        const proformaqty = jsonData[0]?.proformaqty !== null ? jsonData[0]?.proformaqty : jsonData[0]?.quantity;
        setData((prevData) => ({
          ...prevData,
          proformaqty:proformaqty
        }));
    const quot = await fetch(`${APP_BASE_PATH}/getProNumber/${uid}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then(function (response) {
              return response?.json();
            })
            .then(function (data) {
              setData((prevData) => ({
                ...prevData,
                pro_invrefno: data.quotNo,
              }));
            });
      
        
        // Update the state with the first object in the array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [id]);
    const saveProInvoice = async () => {
      try {
        const response = await fetch(`${APP_BASE_PATH}/saveProInvoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pro_invrefno: data.pro_invrefno, // Use the generated pro_invrefno
            pro_invdate: new Date(),
            oid: data.id,
            proformaqty:data.proformaqty // Use the selected pro_invdate
            // Include other data properties you want to save
          }),
        });
    
        if (response.ok) {
          // Show a success alert message
          alert("An error occurred while saving data.");
         
        } else {
          // Handle errors by showing an error alert message
          alert("Pro Invoice data saved successfully!");
          navigate("/proformaInvoice");
        }

      } catch (error) {
        console.error("Error saving Pro Invoice data:", error);
        // Handle the error here, such as showing an error alert message
        alert("An error occurred while saving data.");
      }
    };
    const handleChange = (event) => {
      console.log(event)
      const { name, value } = event.target;
      setData({
        ...data,
        [name]: value
      });
    };
    
      
    return (
      <>
        <div className="d-flex justify-content-between">
          <div className="page_header">
            <h3>Create Proforma Invoice</h3>
          </div>
          <Link to="/crearteprofoma" style={{ textDecoration: "none" }}>
            <Button variant="contained" sx={{  background: "#00d284",
          "&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} >
              Back
            </Button>
          </Link>
        </div>
        <Paper style={{ marginTop: 20 }}>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="pro_invrefno"
                  label=" Proforma Ref"
                  name="quotref"
                  autoComplete="pro_invrefno"
                  value={data.pro_invrefno || ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                />
              </Grid>
            </Grid>
            <Grid
              className="date-pick-wrp"
              item
              xs={4}
              style={{ marginTop: 5, marginLeft: 1 }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  defaultValue={dayjs(new Date())}
                  label="Date"
                  name="pro_invdate"
                 
                  format="DD/MM/YYYY"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ marginBottom: "15px",marginTop: "15px" }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="customer"
                  label="Customer Name"
                  name="customer"
                  value={data.custname || ""}
                  autoComplete="Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
  
            <Grid container spacing={2}>
              <Grid item xs={6} style={{ marginTop: "15px" }}>
              <TextField
            fullWidth
            id="capacity"
            label="Capacity"
            name="capacity"
            value={data.capacity || ""}
            InputLabelProps={{
              shrink: true,
            }}
          />
              </Grid>
              <Grid item xs={6} style={{ marginTop: "15px" }}>
                <TextField
                  fullWidth
                  id="voltageRatio"
                  label="Voltage Ratio"
                  name="voltageRatio"
                  autoComplete="off"
                  value={data.voltageratio || ""}
                  sx={{ marginBottom: "15px" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
  
            <Grid container spacing={2}>
              <Grid item xs={6} style={{ marginTop: 5 }}>
                <TextField
                  fullWidth
                  id="quantity"
                  label="Quantity"
                  name="quantity"
                  value={data.quantity || ""}
                  autoComplete="off"
                  sx={{ marginBottom: "15px" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6} style={{ marginTop: 5 }}>
                <TextField
                  fullWidth
                  id="performaqty"
                  label="Performa Invoice Quantity"
                  name="proformaqty"
                  value={data.proformaqty }
                  autoComplete="off"
                  onChange={handleChange}
                  sx={{ marginBottom: "15px" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
  
            <br />
  
            <Grid item xs={9} sm={3} style={{ marginLeft: -100, marginTop: 20 }}>
              <Button variant="contained" sx={{ background: "#00d284",
          "&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} type="submit" onClick={saveProInvoice}>
                Save
              </Button>
            </Grid>
            <Grid item xs={9} sm={3} style={{ marginTop: -35, marginLeft: 150 }}>
            <Link to="/crearteprofoma" style={{ textDecoration: "none" }}>
              <Button variant="contained"  sx={{ background: "#ff0854",
                                  "&:hover": {
                                    background: "#ff0854", // Set the same color as the default background
                                  }, }}>
                Cancel
              </Button>
              </Link>
            </Grid>
            <br />
          </Box>
        </Paper>
      </>
    );
  };
  

export default Create