import React from "react";
import { useState } from "react";

import "./customer.css";
import { useFormik } from "formik";
import { customerSchema } from "../../../schemas";
import { Grid, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";

const AddCustomers = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    custname: "",
    cperson: "",
    email: "",
    contactno: "",
    altcontactno: "",
    desg: "",
    panno: "",
    gstno: "",
    address: "",
  });

  let name, value;

  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    const {
      custname,
      cperson,
      email,
      desg,
      contactno,
      altcontactno,
      address,
      gstno,
      panno,
    } = user;

    if (!validateEmail(email)) {
      Swal.fire({
        title: "Invalid Email!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      return;
    } else if (cperson === "") {
      Swal.fire({
        title: "Enter Contact Person!!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else if (custname === "") {
      Swal.fire({
        title: "Enter Name!!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else if (desg === "") {
      Swal.fire({
        title: "Enter Designation!! ",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else if (contactno === "") {
      Swal.fire({
        title: "Enter ContactNo!! ",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else if (altcontactno === "") {
      Swal.fire({
        title: "Enter Alternate ContactNo!! ",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else if (address === "") {
      Swal.fire({
        title: "Enter Address!! ",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else {
      const res = await fetch(`${APP_BASE_PATH}/addCustomer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          custname,
          cperson,
          email,
          desg,
          contactno,
          altcontactno,
          address,
          gstno,
          panno,
        }),
      });
      const data = res.json();

      if (res.status === 400 || !data) {
        Swal.fire({
          title: "Please Fill Data!!!!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      } else if (res.status === 422) {
        Swal.fire({
          title: "Customer Name Alredy Exist!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      } else {
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        navigate(-1);
      }
    }
  };

  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Add Customers</h4>
        </div>
        <Link to="/customers" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ background: "#28a745" }}>
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={10}>
        <Box
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "95%",
            marginLeft: "2rem",
          }}
        >
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: "100%" }}
                  fullWidth
                  required
                  label="Customer Name"
                  id="custname"
                  labelprope
                  name="custname"
                  value={user.custname}
                  onChange={handleInputs}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: "100%" }}
                  label="Contact Person"
                  id="cperson"
                  required
                  name="cperson"
                  value={user.cperson}
                  onChange={handleInputs}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email ID"
                  required
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputs}
                  error={!validateEmail(user.email)}
                  helperText={!validateEmail(user.email) ? "" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Designation"
                  id="desg"
                  name="desg"
                  value={user.desg}
                  onChange={handleInputs}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Contact No"
                  id="contactno"
                
                  name="contactno"
                  value={user.contactno}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 12);
                  }}
                  onChange={handleInputs}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Alternate Contact No"
                  id="altcontactno"
        
                  name="altcontactno"
                  value={user.altcontactno}
                  onInput={(e) => {
                    e.target.value = e.target.value.slice(0, 12);
                  }}
                  onChange={handleInputs}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GST No.(Optional)"
                  id="gstno"
                  name="gstno"
                  value={user.gstno}
                  onChange={handleInputs}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN No.(Optional)"
                  id="panno"
                  name="panno"
                  value={user.panno}
                  onChange={handleInputs}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xl={12} sm={12}>
                <TextField
                  fullWidth
                  required
                  label="Address"
                  id="address"
                  name="address"
                  value={user.address}
                  onChange={handleInputs}
                />
              </Grid>
            </Grid>
            <br />

            <div class="container">
              <div class="row">
                <div class="col-sm">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={addCustomer}
                    type="submit"
                    sx={{ Left: "10%", width: "40%", background: "#17a2b8" }}
                  >
                    Save
                  </Button>
                </div>

                <div class="col-sm">
                  <NavLink to="/customers">
                    {" "}
                    <Button variant="contained" color="error">
                      Cancel
                    </Button>
                  </NavLink>
                </div>
              </div>
            </div>

            <br />
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default AddCustomers;
