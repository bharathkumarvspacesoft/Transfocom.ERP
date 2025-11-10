import React from "react";
import "./material.css";
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

const UpdateMaterial = () => {
  const [data, setData] = useState({
    item_code: "",
    material_description: "",
    rate:"",
    unit: "",
    store_id: "",
  });

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editMaterial/+${id}`); // Replace with your API endpoint
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
      id:data.id,
      item_code: data.item_code,
      material_description: data.material_description,
      rate:data.rate,
      unit: data.unit,
      store_id: data.store_id,
    
    };
  
    // Convert the editInputvalue object into an array
    // const editInputArray = Object.values(editInputvalue);
  
    console.log(editInputvalue);
  
    try {
      const res = await fetch(`${APP_BASE_PATH}/updatematerial/${id}`, {
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
          <h4>Update Material</h4>
        </div>
        <Link to="/materialmaster" style={{ textDecoration: "none" }}>
          <Button variant="contained"  sx={{ background: "#00d284",
                                    "&:hover": {
                                      background: "#00d284", // Set the same color as the default background
                                    }}}>
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
                  label="Item Code"
                  labelprope
                  name="item_code"
                  value={data.item_code}
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
                  id="description"
                  label="Item Description"
                  name="material_description"
                  value={data.material_description}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl style={{ width: 240 }}>
                  <InputLabel id="demo-select-small">Unit</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    label="Unit"
                    name="unit"
                    value={data.unit}
                    onChange={handleEdit}
                  >
                    <MenuItem value={"1"}>Nos</MenuItem>
                    <MenuItem value={"2"}>Kgs</MenuItem>
                    <MenuItem value={"3"}>Set</MenuItem>
                    <MenuItem value={"4"}>Ltr</MenuItem>
                    <MenuItem value={"5"}>Mtr</MenuItem>
                    <MenuItem value={"6"}>Pkt</MenuItem>
                    <MenuItem value={"o"}>O</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br />

            <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="rate"
                  label="Rate"
                  name="rate"
                  value={data.rate}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xl={12} sm={6}>
                <FormControl style={{ width: 240 }}>
                  <InputLabel id="demo-select-small">Store Name</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    label="Store Name"
                    name="store_id"
                    value={data.store_id}
                    onChange={handleEdit}
                  >
                    <MenuItem value={"0"}>Not Mentioned</MenuItem>
                    <MenuItem value={"1"}>Store 1</MenuItem>
                    <MenuItem value={"2"}>Phase 2 Store</MenuItem>
                    <MenuItem value={"3"}>Store 3</MenuItem>
                    <MenuItem value={"4"}>Store 4</MenuItem>
                    <MenuItem value={"5"}>Store 5</MenuItem>
                    <MenuItem value={"6"}>Store 6</MenuItem>
                    <MenuItem value={"7"}>Store 7</MenuItem>
                    <MenuItem value={"8"}>Store 8</MenuItem>
                    <MenuItem value={"9"}>Store 9</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br />

            <Grid
  container
  spacing={0}  // Change spacing to 0 or another appropriate value
  justifyContent="center"
  alignItems="center"
  sx={{
    marginLeft: "5%",
  }}
>
  <Grid item xs={8} sm={4}>
    <Button
      variant="contained"
      onClick={handleSubmit}
      type="submit"
      style={{ position: "relative",marginLeft:'30%',   width: '50%',background: "#00d284", "&:hover": { background: "#00d284" } }}
    >
      Save
    </Button>
  </Grid>
  <Grid item xs={8} sm={4}>
    <Link to="/materialMaster" style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        style={{
          position: "relative",
          background: "#ff0854",
          width: '50%',
          marginRight:'50%',
          "&:hover": { background: "#ff0854" },
        }}
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

export default UpdateMaterial;
