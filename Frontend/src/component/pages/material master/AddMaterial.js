import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import { APP_BASE_PATH } from "Host/endpoint";
import { set } from "date-fns";

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontSize: "1em",
      align: "center",
      fontWeight: 'bold'
    },
  },
});

export default function AddMaterial() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const uid = userData ? Number(userData.id) : 1; // Ensure uid is a valid number
  const [rows, setRows] = useState([
    {
      item_code: "",
      material_description: "",
      unit: "",
      rate: "",
      uid: uid,
      store_id: "",
    },
  ]);
  const [units, setUnits] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [button, setButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setButton(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getUnits`); // Replace with your API endpoint
        const jsonData = await response.json();
        setIsLoading(false);
        setButton(false);
        setUnits(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await fetch(`${APP_BASE_PATH}/getStores`); // Replace with your API endpoint
        const jsonData = await response.json();
        setIsLoading(false);
        setButton(false);
        setStores(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        item_code: "",
        material_description: "",
        rate: "",
        unit: "",
        uid: uid, // Ensure new rows have the correct uid
        store_id: "",
      },
    ]);
  };

  const handleInput = (e, index) => {
    const { name, value } = e.target;
    const materials = [...rows];
    materials[index] = { ...materials[index], [name]: value };
    setRows([...materials]);
  };

  const handleDelete = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  const classes = useStyles();
  const addMaterial = async (e) => {
    e.preventDefault();

    // Check if there is at least one row with non-empty fields
    const hasNonEmptyRow = rows.some(
      (row) =>
        row.item_code.trim() !== "" &&
        row.material_description.trim() !== "" &&
        row.unit.trim() !== "" &&
        row.store_id.trim() !== "" &&
        row.rate.trim() !== ""
    );

    if (!hasNonEmptyRow) {
      Swal.fire({
        title: "Please Fill Data!!!!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      return; // Stop the request if no non-empty rows
    }

    // Continue with the POST request
    const res = await fetch(`${APP_BASE_PATH}/addmaterial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rows),
    });

    if (res.status === 200) {
      const data = await res.text();
      if (data === "POSTED") {
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        navigate(-1);
      } else {
        Swal.fire({
          title: "Error adding data. Please try again later.",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      }
    } else {
      const errorData = await res.json();
      const errorMessage = errorData.error || "An error occurred. Please try again later.";

      Swal.fire({
        title: errorMessage,
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
        <div className="page_header">
          <h4>Add Material</h4>
        </div>
        <Link to="/materialmaster" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{
            backgroundColor: "#00d284", marginBottom: "10px", "&:hover": {
              background: "#00d284", // Set the same color as the default background
            },
          }}>
            Back
          </Button>
        </Link>
      </div>
      <br />
      <Paper elevation={8} style={{ marginTop: -25, padding: '14px' }}>
        {isLoading && (
          <div id="spinner">
            <CircularProgress color="warning" loading={isLoading} />
          </div>
        )}
        <TableContainer>
          <div className={classes.root}>
            <Table className="tabel">
              <TableHead className="tableHeader">
                <TableRow>
                  <TableCell className="MuiTableHead-root">Item code</TableCell>
                  <TableCell className="MuiTableHead-root">
                    Item Description (Size)
                  </TableCell>
                  <TableCell className="MuiTableHead-root">Rate</TableCell>
                  <TableCell className="MuiTableHead-root">Unit</TableCell>
                  <TableCell className="MuiTableHead-root">
                    Store Name
                  </TableCell>
                  <TableCell className="MuiTableHead-root">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow className="tabelrow" key={index}>
                    <TableCell>
                      <input
                        type="text"
                        value={row.item_code}
                        name="item_code"
                        onChange={(e) => handleInput(e, index)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={row.material_description}
                        name="material_description"
                        onChange={(e) => handleInput(e, index)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={row.rate}
                        name="rate"
                        onChange={(e) => handleInput(e, index)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="input-group mb-3">
                        <select
                          className="custom-select"
                          id="inputGroupSelect01"
                          name="unit"
                          onChange={(e) => handleInput(e, index)}
                          value={row.unit}
                          style={{
                            width: 150,
                            height: 28,
                            position: "relative",
                            top: "10",
                          }}
                        >
                          <option value="">Select Unit</option>
                          {units.map(({ unit, id }) => (
                            <option key={id} value={id}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="input-group mb-3">
                        <select
                          className="custom-select"
                          id="inputGroupSelect01"
                          style={{
                            width: 150,
                            height: 28,
                            position: "relative",
                            top: "10",
                          }}
                          name="store_id"
                          value={row.store_id}
                          onChange={(e) => handleInput(e, index)}
                        >
                          <option value="">Select Store</option>
                          {stores.map(({ store_name, id }) => (
                            <option key={id} value={id}>
                              {store_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        title="Delete"
                        sx={{ color: "#ff0854" }}
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
          <Button
            variant="contained"
            onClick={handleAddRow}
            sx={{ float: "right", marginRight: "15px", marginBottom: "10px", background: "#00d284", "&:hover": { background: "#00d284" } }}
          >
            Add Row
          </Button>
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
            <Button
              onClick={addMaterial}
              variant="contained"
              color="success"
              type="submit"
              style={{ marginRight: "10px", background: "#00d284", "&:hover": { background: "#00d284" } }}
              disabled={button}
            >
              Save
            </Button>
            <Link to="/materialmaster">
              <Button variant="contained" sx={{
                background: "#ff0854",
                "&:hover": { background: "#ff0854" },
              }}>
                Cancel
              </Button>
            </Link>
          </Grid>
        </TableContainer>
      </Paper>
    </>
  );
}
