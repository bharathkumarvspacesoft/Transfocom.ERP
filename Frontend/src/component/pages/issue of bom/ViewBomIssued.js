import * as React from "react";
import { useState } from "react";
import { Button, IconButton, Grid, Checkbox, FormControlLabel } from "@mui/material";
import "./issue.css";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight:'bold',
      fontSize: "1em",
      align: "center",
    },
  },
});

export default function ViewBomIssued() {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { search } = useLocation();
    const id = new URLSearchParams(search).get("id");
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${APP_BASE_PATH}/getbomDetail/` + id);
          const jsonData = await response.json();
          setRows(jsonData);
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }finally{
          setIsLoading(false);
        }
      };
      fetchData();
    }, [id]);
  
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
            <h4>BOM Issued</h4>
          </div>
          <Link to="/issueOfBom" style={{ textDecoration: "none" }}>
            <Button variant="contained" sx={{ background: "#28a745" }}>
              Back
            </Button>
          </Link>
        </div>
        <Paper elevation={6} style={{ position: "relative", marginTop: 0 }}>
          <TableContainer>
  
            <div>
              <div className={classes.root}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="MuiTableHead-root" align="center">
                        Sr. No.
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                        Item Code
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                        Item Description
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                        Unit
                      </TableCell>
                      <TableCell className="MuiTableHead-root" align="center">
                        BOI Quantity
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{row.item_code}</TableCell>
                        <TableCell align="center">{row.material_description}</TableCell>
                        <TableCell align="center">{row.unit}</TableCell>
                        <TableCell align="center">{row.totqty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TableContainer>
        </Paper>
        </>
      )}
    </>
  );
}
