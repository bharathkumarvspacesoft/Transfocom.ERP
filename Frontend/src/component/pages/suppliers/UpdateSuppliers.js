import React from "react";
import "./suppliers.css";
import { Grid, Paper, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { updateSchema } from "../../../schemas";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const UpdateSuppliers = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    contactno: "",
    address: "",
  });

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editsuppliers/+${id}`); // Replace with your API endpoint
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
      email: data.email,
      contactno: data.contactno,
      address: data.address,
    };

    console.log(editInputvalue);

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateSupplier/` + id, {
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

  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Update Suppliers</h4>
        </div>
        <Link to="/suppliers" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{backgroundColor: "#00d284" ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} >
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={10} style={{ marginTop: -12 }}>
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
                  id="itemCode"
                  label="Supplier Name"
                  labelprope
                  name="name"
                  value={data.name}
                  onChange={handleEdit}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="description"
                  label="Email ID"
                  name="email"
                  value={data.email}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="description"
                  label="Contact No"
                  name="contactno"
                  value={data.contactno}
                  onChange={handleEdit}
                />
              </Grid>
            </Grid>
            <br />

            <Grid container spacing={3}>
              <Grid item xl={12} sm={6}>
                <TextField
                  fullWidth
                  id="description"
                  label="Address"
                  name="address"
                  value={data.address}
                  onChange={handleEdit}
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
                  onClick={handleSubmit}
                  type="submit"
                  style={{ position: "relative", left: -290 ,backgroundColor: "#00d284", marginBottom: "10px"  ,"&:hover": {
                    background: "#00d284", // Set the same color as the default background
                  },}}
                >
                  Update
                </Button>
              </Grid>
              <Grid item xs={8} sm={4}>
              <Link to="/suppliers" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="error"
                  style={{ position: "relative", left: -200, background: "#ff0854",
                  "&:hover": {
                    background: "#ff0854", // Set the same color as the default background
                  }, }}
                >
                  Cancel
                </Button>
                </Link>
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

export default UpdateSuppliers;
