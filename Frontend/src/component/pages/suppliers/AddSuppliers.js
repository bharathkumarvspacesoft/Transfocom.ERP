import { React, useState } from "react";
import "./suppliers.css";
import { Grid, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { addSupplierSchema } from "../../../schemas";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";


const initialValues = {
  supplier: "",
  email: "",
  contact: "",
  address: "",
};
const AddSuppliers = () => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: addSupplierSchema,
      onSubmit: (values, action) => {
        console.log(values);
        action.resetForm();
      },
    });



  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactno, setContactno] = useState("");
  const [address, setAddress] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(`${APP_BASE_PATH}/getsupplier`); // Replace with your API endpoint
      const jsonData = await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const addSuppliers = async (e) => {
    e.preventDefault();

    // Check if any of the fields are empty
    if (!values.supplier || !values.email || !values.contact || !values.address) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
      });
      return;
    }

    const res = await fetch(`${APP_BASE_PATH}/addSuppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.supplier,
        email: values.email,
        contactno: values.contact,
        address: values.address,
        curdate: new Date(),
      }),
    });
    const data = await res.json();

    if (res.status === 400 || !data) {
      console.log("Added!!!!");
    } else {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Supplier added successfully!",
      });
      fetchData();
    }
  };

  return (
    <>
      <div class="d-flex justify-content-between">
        <div className="page_header">
          <h3>Add Supplier</h3>
        </div>
        <Link to="/suppliers" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="warning">
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={10}>
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "95%",

            marginLeft: "2rem",
          }}
        >
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xl={12} sm={3.5}>
                <TextField
                  style={{ width: 500 }}
                  fullWidth
                  label="Supplier Name"
                  id="name"
                 
                  labelprope
                  name="name"
                  autoComplete="Date"
                  onChange={(e) => setName(e.target.value)}
                  data={values.supplier}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                  required
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
                  autoComplete="Date"
                  onChange={(e) => setEmail(e.target.value)}
                  data={values.email}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact No"
                  id="contactno"
                  
                  name="contactno"
                  autoComplete="Date"
                  data={values.contact}
                  onChange={(e) => setContactno(e.target.value)}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>
            </Grid>
            <br />

            <Grid container spacing={3}>
              <Grid item xl={12} sm={3.5}>
                <TextField
                  fullWidth
                  label="Address"
                  id="address"
                  
                  name="address"
                  autoComplete="Date"
                  data={values.address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={handleBlur}
                  onSubmit={handleSubmit}
                />
              </Grid>
            </Grid>
            <br />

            <Grid
              container
              spacing={-50}
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
                  color="success"
                  onClick={addSuppliers}
                  type="submit"
                  style={{ position: "relative", left: -240 }}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={8} sm={4}>
                <Button
                  variant="contained"
                  color="error"
                  style={{ position: "relative", left: -200 }}
                >
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

export default AddSuppliers;
