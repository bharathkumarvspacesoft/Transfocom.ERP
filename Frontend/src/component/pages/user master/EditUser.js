import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Checkbox, Grid, ListItemText, Paper, Typography, TextField, Box, Button, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl } from "@mui/base";
import dayjs from "dayjs";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState({
    email: "",
    contactno: "",
    dob: "",
    username: "",
    type: [],
    password: "",
    fname: "",
    lname: "",
    desg: "",
    quot_serial: "",
    emp: [], // Change this to an array
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/edituser/${id}`); // Replace with your API endpoint
        const resData = await reqData.json();
        console.log(resData)
        const typesArray = resData.type ? resData.type.split(',') : [];
        const empArray = resData.emp ? resData.emp.split(',') : [];
        setData(prevData => ({
          ...prevData,
          ...resData,
          type: typesArray,
          emp: getEmpValuesFromKeys(typesArray),
        }));
        console.log(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = (e) => {
    const { name, value } = e.target;

    if (name === "emp") {
      const selectedValues = typeof value === 'string' ? value.split(',') : value;
      setData(prevData => ({
        ...prevData,
        [name]: selectedValues,
      }));
    } else if (name === "type") {
      const selectedValues = typeof value === 'string' ? value.split(',') : value;
      setData(prevData => ({
        ...prevData,
        [name]: selectedValues,
        emp: getEmpValuesFromKeys(selectedValues), // Update emp based on selected types
      }));
    } else {
      setData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleClose = () => {
    navigate('/userMaster')
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    
    if (
      !data.email ||
      !data.contactno ||
      !data.dob ||
      !data.username ||
      !data.password ||
      !data.emp ||
      !data.fname ||
      !data.lname ||
      !data.desg 
     
    ) {
      Swal.fire({
        title: 'Please fill all required fields!',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'red',
      });
      return;
    }
  

    // Validate quot_serial format
     const quotSerialValue = data.quot_serial;
    // if (!quotSerialValue) {
    //   Swal.fire({
    //     title: "Quot_serial is required",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //     confirmButtonColor: "red",
    //   });
    //   return;
    // }

    const formattedQuotSerial = quotSerialValue.toUpperCase();
    // const regex = /^[A-Z]{2}\d$/;
    // if (!regex.test(formattedQuotSerial)) {
    //   Swal.fire({
    //     title: "Quot_serial must have 2 uppercase characters and 1 number",
    //     icon: "error",
    //     confirmButtonText: "OK",
    //     confirmButtonColor: "red",
    //   });
    //   return;
    // }

    const editInputvalue = {
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      contactno: data.contactno,
      dob: data.dob,
      username: data.username,
      type: data.type.join(','), 
      password: data.password,
      desg: data.desg,
      quot_serial: formattedQuotSerial,
      emp: data.emp.join(','),
    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateUser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editInputvalue),
      });

      if (res.status === 200) {
        Swal.fire({
          title: "Data Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });

        setTimeout(() => {
          navigate("/userMaster");
        }, 2000);
      } else if (res.status === 400) {
        const resjson = await res.json();
        if (!resjson) {
          Swal.fire({
            title: "Please Fill Data!!!!",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "red",
          });
        }
      } else {
        console.error("Error updating data. Status:", res.status);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const empToTypeMapping = {
    "1": "MARKETING",
    "2": "DESIGN",
    "3": "PURCHASE",
    "4": "STORE",
    "5": "PRODUCTION",
    "6": "ACCOUNTS",
    "7": "ADMIN",
    
  };
  const getEmpValuesFromKeys = (keys) => {
    // Log the input keys
    console.log("Input keys:", keys);
  
    // Map the keys to their corresponding values using empToTypeMapping
    const mappedValues = keys.map(key => empToTypeMapping[key] || key);
  
    // Log the resulting mapped values
    console.log("Mapped values:", mappedValues);
  
    return mappedValues;
  };
   const handleDateChange = (date) => {
      // Ensure date is a valid Dayjs object
      const dayjsDate = dayjs(date).format("YYYY-MM-DD");
      setData({ ...data, dob: dayjsDate });
      
    };
  return (
    <>
      <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
        <div className="page_header">
          <h4>Edit User</h4>
        </div>
        <Link to="/userMaster" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ background: "#00d284", "&:hover": { background: "#00d284" } }}>
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={10}>
        <Box sx={{ marginTop: 0, display: "flex", flexDirection: "column", alignItems: "center", width: "95%", marginLeft: "2rem" }}>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  label="First Name"
                  style={{ width: 478 }}
                  fullWidth
                  id="fname"
                  name="fname"
                  autoComplete="custname"
                  value={data.fname}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name "
                  style={{ width: 474, position: "relative", left: 210 }}
                  id="lname"
                  name="lname"
                  autoComplete="cperson"
                  value={data.lname}
                  onChange={handleEdit}
                />
              </Grid>
            </Grid>
            <br />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email ID"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact No"
                  id="contactno"
                  name="contactno"
                  value={data.contactno}
                  onChange={handleEdit}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl >
          <DatePicker
          sx={{width:'100%'}}
            label="Date Of Birth"
            format="DD-MM-YYYY"
            required
            name="dob"
            value={data.dob ? dayjs(data.dob) : null} 
            onChange={(date) => handleDateChange(date)}
            renderInput={(params) => <TextField {...params} />}
          />
          </FormControl>
        </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField
                  fullWidth
                  label="Type"
                  id="type"
                  name="type"
                  value={data.type}
                  onChange={handleEdit}
                  select
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => (
                      <div style={{ textAlign: "left" }}>
                        {Array.isArray(selected) ? selected.map((value) => empToTypeMapping[value] || value).join(', ') : ""}
                      </div>
                    ),
                  }}
                >
                  {Object.entries(empToTypeMapping).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      <Checkbox checked={data.type.includes(key)} />
                      <ListItemText primary={label} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  id="desg"
                  name="desg"
                  value={data.desg}
                  autoComplete="gstno"
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  id="username"
                  name="username"
                  autoComplete="panno"
                  value={data.username}
                  onChange={handleEdit}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xl={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  id="password"
                  name="password"
                  autoComplete="address"
                  value={data.password}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xl={12} sm={6}>
                <TextField
                  fullWidth
                  label="quot_serial"
                  id="quot_serial"
                  name="quot_serial"
                  value={data.quot_serial}
                  onChange={handleEdit}
                />
              </Grid>
            </Grid>
            <br />
            <Grid
              container
              spacing={-90}
              sx={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginLeft: "21rem",
              }}
            >
              <Grid item xs={8} sm={4}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ background: "#00d284", "&:hover": { background: "#00d284" } }}
                  type="submit"
                >
                  Update
                </Button>
              </Grid>
              <Grid style={{ marginLeft: "15px" }} item xs={8} sm={4}>
                <Button variant="contained" onClick={handleClose}sx={{ padding: "8px", marginRight: "10px", background: "#ff0854", "&:hover": { background: "#ff0854" } }}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
            <br />
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default EditUser;
