import { Grid, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./company.css";
import { useFormik } from "formik";
import { companySchema } from "../../../schemas";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const ComponyProfile = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    contact: "",
    email: "",
    telefax: "",
    website: "",
    address: "",
    accholdername: "",
    accno: "",
    branch: "",
    ifsccode: "",
    isoline: "",
  });

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editCompany/+${id}`); // Replace with your API endpoint
        const resData = await reqData.json();
        setData(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const editInputvalue = {
      name: data.name,
      contact: data.contact,
      email: data.email,
      telefax: data.telefax,
      website: data.website,
      address: data.address,
      accholdername: data.accholdername,
      branch: data.branch,
      accno: data.accno,
      ifsccode: data.ifsccode,
    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateCompany/`+ id, {
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
    }finally{
      setIsLoading(false);
    }
  };
  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      <div
        class="d-flex justify-content-between "
        style={{ position: "relative", bottom: 12 }}
      >
        <div className="page_header">
          <h4>Company Profile</h4>
        </div>
      </div>

      <Paper elevation={6}>
        <Box
          sx={{
            marginTop: -1,
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
                  id="name"
                  // defaultValue={"Static Electricals Pune"}
                  label="Company Name"
                  name="name"
                  value={data.name}
                  labelprope
                  onChange={handleEdit}
                  required
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="contact"
                  label="Contact No"
                  name="contact"
                  value={data.contact}
                  onChange={handleEdit}
                  required
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={data.email}
                  onChange={handleEdit}
                  error={!validateEmail(data.email)}
                  helperText={!validateEmail(data.email) ? "" : ""}
                  required
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="telefax"
                  label="TeleFax"
                  name="telefax"
                  value={data.telefax}
                  onChange={handleEdit}
                  required
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="website"
                  label="Website"
                  name="website"
                  value={data.website}
                  onChange={handleEdit}
                  required
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  value={data.address}
                  onChange={handleEdit}
                  required
                />
              </Grid>
            </Grid>
            <br />
            <br />
            <div>
              <h4 className="bank">Bank Details</h4>
            </div>
            <br />
            <Grid container spacing={2}>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="accholdername"
                  label="Account Holder Name"
                  name="accholdername"
                  value={data.accholdername}
                  onChange={handleEdit}
                  required
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="accno"
                  label="Account Number"
                  name="accno"
                  value={data.accno}
                  onChange={handleEdit}
                  required
                />
              </Grid>

              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="branch"
                  label=" Branch"
                  name="branch"
                  value={data.branch}
                  onChange={handleEdit}
                  required
                />
              </Grid>
              <Grid item xs={7} sm={3.5}>
                <TextField
                  fullWidth
                  id="ifsccode"
                  label="IFSC Code "
                  name="ifsccode"
                  value={data.ifsccode}
                  onChange={handleEdit}
                  required
                />
              </Grid>
              <br />
              <br />
              <Grid
                container
                spacing={-108}
                sx={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginLeft: "27rem",
                }}
              >
                <Grid item xs={8} sm={4} marginTop={20} marginLeft={-100}>
                  <Button
                    variant="contained"
                    id="updatebtn"
                    color="success"
                    onClick={handleSubmit}
                    type="submit"
                    sx={{ background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },}}
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item xs={8} sm={4} marginTop={20} marginLeft={4}>
                  <Button variant="contained" color="error" sx={{background: "#ff0854",
                                    "&:hover": {
                                      background: "#ff0854", // Set the same color as the default background
                                    },}}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
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

export default ComponyProfile;
