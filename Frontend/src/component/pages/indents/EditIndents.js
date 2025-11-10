import React, { useState, useEffect } from "react";
import "./indents.css";
import { Grid, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";
import { set } from "date-fns";

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight: 'bold',
      fontSize: "1em",
      align: "center",
    },
  },
});

const AddStock = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [button, setButton] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [deletedItems, setDeletedItems] = useState([]);
  const fetchData = async () => {
    setIsLoading(true);
    setButton(true);
    try {
      const reqData = await fetch(`${APP_BASE_PATH}/getaddstock/${id}`);
      const resData = await reqData.json();
      console.log(resData); // Add this line for debugging
      setData(resData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setButton(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // const handleDelete = (index) => {
  //   console.log("Deleting item at index:", index);

  //   const updatedData = [...data];
  //   updatedData.splice(index, 1); // Remove 1 item at the specified index

  //   console.log("Updated Data:", updatedData);

  //   setData(updatedData);

  //   console.log("Data after update:", data);
  // };

  const handleDelete = (index) => {
    // Create a new array without the item to be deleted
    const updatedData = data.filter((item, i) => i !== index);
    setData(updatedData);

    // Update the deleted items array
    setDeletedItems([...deletedItems, index]);
  };



  const handleEdit = (e, index) => {
    // Create a copy of the specific object being edited
    const updatedRow = { ...data[index], [e.target.name]: e.target.value };
    // Create a new array by updating the specific object in the data array
    const updatedData = [...data];
    updatedData[index] = updatedRow;
    // Update the state with the new array
    setData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setButton(true);
    try {
      // Filter out deleted items from the data array
      const updatedData = data
        .map((row, index) => ({
          ...row,
          qty: parseInt(row.qty, 10),
        }))
        .filter((_, index) => !deletedItems.includes(index));

      console.log("deletedItems:", deletedItems);
      console.log("updatedData:", updatedData);

      // Prepare the data to be sent to the server
      const editInputvalue = {
        id,
        data: updatedData,
      };

      const res = await fetch(`${APP_BASE_PATH}/updateindent/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editInputvalue),
      });

      const resText = await res.text();

      if (resText === "Updated") {
        // If the response is "Updated," it means the update was successful
        Swal.fire({
          title: "Data Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });
        navigate("/indents");
      } else {
        // Handle other response cases here
        Swal.fire({
          title: "Error Updating Data",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire({
        title: "Error Updating Data",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false);
      setButton(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            className="d-flex justify-content-between"
            style={{ position: "relative", bottom: 13 }}
          >
            <div className="page_header">
              <h4>Edit Indents</h4>
            </div>
            <Link to="/indents" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{
                background: "#00d284",
                "&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },
              }}>
                Back
              </Button>
            </Link>
          </div>
          <Paper elevation={6} style={{ position: "relative", marginTop: 0, padding: '14px' }}>
            <TableContainer>
              <div className={classes.root}>
                <Table className="tabel">
                  <TableHead className="tableHeader">
                    <TableRow>
                      <TableCell className="MuiTableHead-root">Sr No</TableCell>
                      <TableCell className="MuiTableHead-root">Item Code</TableCell>
                      <TableCell className="MuiTableHead-root">
                        Description
                      </TableCell>
                      <TableCell className="MuiTableHead-root">Unit</TableCell>
                      <TableCell className="MuiTableHead-root">Quantity</TableCell>
                      <TableCell className="MuiTableHead-root">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow className="tabelrow" key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="item_code"
                            value={row.item_code}
                            onChange={(e) => handleEdit(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="material_description"
                            value={row.material_description}
                            onChange={(e) => handleEdit(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="unit"
                            value={row.unit}
                            onChange={(e) => handleEdit(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="qty"
                            value={row.qty}
                            onChange={(e) => handleEdit(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            title="Delete"
                            sx={{ color: "#ff0854", }}
                            onClick={() => handleDelete(index)}
                          >
                            <DeleteIcon />
                          </IconButton>

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <br />
              <br />
              <Grid
                container
                spacing={-108}
                sx={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginLeft: "26rem",
                  marginBottom: "9px",
                }}
              >
                <Grid item xs={8} sm={4}>
                  <Button
                    variant="contained"
                    sx={{
                      background: "#00d284",
                      "&:hover": {
                        background: "#00d284", // Set the same color as the default background
                      },
                    }}
                    onClick={handleSubmit}
                    type="submit"
                    disabled={button} 
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item xs={8} sm={4}>
                  <Link to="/indents" style={{ textDecoration: "none" }}>
                    <Button variant="contained" sx={{
                      background: "#ff0854",
                      "&:hover": {
                        background: "#ff0854", // Set the same color as the default background
                      },
                    }}>
                      Cancel
                    </Button></Link>
                </Grid>
              </Grid>
            </TableContainer>
          </Paper>
        </>
      )}
    </>
  );
};

export default AddStock;
