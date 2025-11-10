import React from "react";
import { useState, useEffect } from "react";
import "./customer.css";
import { Grid, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Await, Link, NavLink, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";

const EditCustomers = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    custname: "",
    cperson: "",
    email: "",
    desg: "",
    contactno: "",
    altcontactno: "",
    address: "",
    gstno: "",
    panno: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editcust/+${id}`); // Replace with your API endpoint
        const resData = await reqData.json();
        setData(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const editInputvalue = {
      custname: data.custname,
      cperson: data.cperson,
      email: data.email,
      desg: data.desg,
      contactno: data.contactno,
      altcontactno: data.altcontactno,
      address: data.address,
      gstno: data.gstno,
      panno: data.panno,
    };

    console.log(editInputvalue);

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateCust/` + id, {
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
      });

      setTimeout(() => {
        navigate("/customers");
      }, 2000);
    }
  };

  // const handleAddress = (event) => {
  //   const value = event.target.value;
  //   setAddress(value);
  // };

  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Edit Customers</h4>
        </div>
        <Link to="/customers" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{  backgroundColor: "#00d284"  ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}}>
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
                  fullWidth
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="cperson"
                  label="Contact Person"
                  name="cperson"
                  autoComplete="cperson"
                  value={data.cperson}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <br />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email ID"
                  name="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="desg"
                  label="Designation"
                  autoComplete="desg"
                  name="desg"
                  value={data.desg}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="contactno"
                  label="Contact No"
                  autoComplete="desg"
                  name="contactno"
                  value={data.contactno}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="altcontactno"
                  label="Alternate Contact No"
                  autoComplete="altcontactno"
                  name="altcontactno"
                  value={data.altcontactno}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="gstno"
                  label="GST No.(Optional)"
                  name="gstno"
                  value={data.gstno}
                  autoComplete="gstno"
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="panno"
                  label="PAN No.(Optional)"
                  name="panno"
                  autoComplete="panno"
                  value={data.panno}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xl={12} sm={12}>
                <TextField
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                  value={data.address}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
             </Grid>
             <div class="container">
  <div class="row">
    <div class="col-sm">
    <Button
                  variant="contained"
                  onClick={handleSubmit}
                  color="success"
                  type="submit"
                  sx={{background: "#00d284",
                  "&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },}}
                >
                  Update
                </Button>
    </div>
    
    <div class="col-sm">
    <NavLink to="/customers"><Button variant="contained"sx={{background: "#ff0854",
                                  "&:hover": {
                                    background: "#ff0854", // Set the same color as the default background
                                  },}}>
                  Cancel
                </Button></NavLink>
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

export default EditCustomers;
