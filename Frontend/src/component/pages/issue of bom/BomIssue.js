import * as React from "react";
import { useState } from "react";
import {
  Button,
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import "./issue.css";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import DescriptionIcon from "@mui/icons-material/Description";
import ListIcon from "@mui/icons-material/List";
import ReorderIcon from "@mui/icons-material/Reorder";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LoadingSpinner from "../../commen/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableHead-root": {
      fontWeight: "bold",
      fontSize: "1em",
      align: "center",
    },
  },
});

export default function AddStock() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [disabledRows, setDisabledRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isIssueEnabled, setIsIssueEnabled] = useState(false);
  const navigate = useNavigate();
  const [optionsave, setOptionsave] = useState(false);
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const [isIndentCompleted, setIsIndentCompleted] = useState(false);
  const [hasSelectedCheckbox, setHasSelectedCheckbox] = useState(false);

  console.log("jiji", id);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getbomDetail/` + id);
        const jsonData = await response.json();

        setRows(jsonData);
        console.log("data", jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const allMatch = rows.length > 0 && rows.every(row => row.totqty === row.qty);
    setIsIndentCompleted(allMatch);
  }, [rows]);

  useEffect(() => {
    const isAllAvailableInStore = rows.every((row) => row.stock >= row.totqty);
    setIsIssueEnabled(isAllAvailableInStore);
  }, [rows]);

  useEffect(() => {
    // Check if at least one checkbox is selected
    const anySelected = Object.values(selectedRows).some(value => value === true);
    setHasSelectedCheckbox(anySelected);
  }, [selectedRows]);

  useEffect(() => {
    // Update disabledRows based on the condition
    const updatedDisabledRows = {};
    rows.forEach((row) => {
      updatedDisabledRows[row.id] =
        row.stock + row.qty + row.poqty >= row.totqty;
    });
    setDisabledRows(updatedDisabledRows);

    // Select or deselect all rows based on selectAll state
    const updatedSelectedRows = {};
    rows.forEach((row) => {
      updatedSelectedRows[row.id] = selectAll && !updatedDisabledRows[row.id];
    });
    setSelectedRows(updatedSelectedRows);
  }, [selectAll, rows]);

  const onSelect = (value, index) => {
    let checkedValue;

    if (typeof value === "boolean") {
      // Called from button
      checkedValue = value;
    } else if (value && value.target) {
      // Called from checkbox
      checkedValue = value.target.checked;
    }

    setSelectedRows((prevState) => ({
      ...prevState,
      [index]: checkedValue,
    }));
  };

  const addStock = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOptionsave(true);
    const selectedItemsExist = Object.values(selectedRows).some(
      (value) => value
    );

    if (!selectedItemsExist) {
      Swal.fire({
        title: "Select at least one item to add indent",
        icon: "info",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "blue",
      });
      setOptionsave(false);
      setIsLoading(false);
      return;
    }

    let dataList = [];

    rows.forEach((listval) => {
      if (selectedRows[listval.id]) {
        let qtyToSubtract;
        let insertqty;
        let newqty;

        if (listval.totqty > listval.stock) {
          qtyToSubtract = listval.totqty - listval.stock;
        } else {
          qtyToSubtract = listval.stock - listval.totqty;
        }

        if (listval.qty !== "") {
          if (listval.qty < qtyToSubtract) {
            insertqty = qtyToSubtract - listval.qty;
          } else {
            insertqty = listval.qty - qtyToSubtract;
          }
        }
        if (listval.poqty !== "") {
          if (listval.poqty < insertqty) {
            newqty = insertqty - listval.poqty;
          } else {
            newqty = listval.poqty - insertqty;
          }
        }

        dataList = [
          ...dataList,
          {
            uid: listval.uid,
            item_id: listval.itemid,
            itemcode: listval.item_code,
            materialdescription: listval.material_description,
            qty: newqty,
          },
        ];
      }
    });

    const params = {
      bomid: id,
      date: new Date().toLocaleDateString("en-GB"),
      uid: dataList[0].uid,
      iscompleted: 0,
      dataList,
    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/addIndent/${dataList[0].uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        navigate("/indents");
      } else {
        Swal.fire({
          title: "Something went wrong!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
        setOptionsave(false);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      setOptionsave(false);
    } finally {
      setIsLoading(false);
    }
  };

  const bomIssue = async () => {
    console.log("BOM Issue Clicked");
    console.log("Rows Data:", rows);
    setIsLoading(true);
    const dataToUpdate = [];

    rows.forEach((row) => {
      dataToUpdate.push({
        id: id,
        uid: row.uid,
        item_id: row.itemid,
        boiQty: row.totqty,
        availableInStore: row.stock,
        plan_id: row.plan_id,
      });
    });

    console.log("Data to Update:", dataToUpdate);

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateBOMIssue/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (res.ok) {
        Swal.fire({
          title: "Data added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
        navigate("/issueOfBom");
      } else {
        Swal.fire({
          title: "Failed to send BOM Issue data!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      console.error("Error sending BOM Issue data:", error);
    } finally {
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
              <h4>Issue of BOM</h4>
            </div>
          </div>
          <div
            class="d-flex justify-content-between"
            style={{ position: "relative", bottom: 13 }}
          >
            <div className="page_header">
              {
                rows.length > 0 && (
                  <>
                    <p><b>Costing ID</b> {rows[0].cid}<b> &nbsp;&nbsp;&nbsp; Costing Name</b> {rows[0].selectedCosting}</p>
                  </>
                )
              }
            </div>
          </div>
          <Paper
            elevation={6}
            style={{ position: "relative", marginTop: 0, padding: "14px" }}
          >
            <TableContainer>
              <div>
                <div className={classes.root}>
                  <Table className="tabel">
                    <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <DynamicFormIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Database Item Id
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <DynamicFormIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Item Code
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <DescriptionIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Item Description
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <ListIcon style={{ fontSize: "16px" }} />
                          Unit
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <ReorderIcon style={{ fontSize: "16px" }} />
                          BOI Quantity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <EventAvailableIcon style={{ fontSize: "16px" }} />
                          Available in Store
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <ProductionQuantityLimitsIcon
                            style={{ fontSize: "16px" }}
                          />
                          Indent qty
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          <ProductionQuantityLimitsIcon
                            style={{ fontSize: "16px" }}
                          />
                          Po qty
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                          {" "}
                          <AutoAwesomeIcon
                            style={{ fontSize: "16px", marginRight: "2px" }}
                          />
                          Action{" "}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectAll}
                                onChange={() => setSelectAll(!selectAll)}
                              />
                            }
                          />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow className="tabelrow" key={index}>
                          <TableCell align="center">{row.itemid}</TableCell>
                          <TableCell align="center">{row.item_code}</TableCell>
                          <TableCell align="center">
                            {row.material_description}
                          </TableCell>
                          <TableCell align="center">{row.unit}</TableCell>
                          <TableCell align="center">{row.totqty}</TableCell>
                          <TableCell align="center">{row.stock}</TableCell>
                          <TableCell align="center">{row.qty}</TableCell>
                          <TableCell align="center">{row.poqty}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              title="Add Indent"
                              color={
                                row.totqty > row.stock ? "error" : "default"
                              }
                              disabled={
                                parseInt(row.stock) + parseInt(row.qty) + parseInt(row.poqty) >= parseInt(row.totqty)
                              }
                              onClick={() => {
                                if (
                                  !(
                                    parseInt(row.stock) + parseInt(row.qty) + parseInt(row.poqty) >= parseInt(row.totqty)
                                  )
                                ) {
                                  onSelect(!selectedRows[row.id], row.id);
                                }
                              }}
                            >
                              ADD
                            </IconButton>
                            {!disabledRows[row.id] && (
                              <Checkbox
                                checked={!!selectedRows[row.id]}
                                onChange={(value) => {
                                  if (
                                    !(
                                      parseInt(row.stock) + parseInt(row.qty) + parseInt(row.poqty) >= parseInt(row.totqty)
                                    )
                                  ) {
                                    onSelect(value, row.id);
                                  }
                                }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                      padding: "5px",
                      background: "#00d284",
                      "&:hover": {
                        background: "#00d284",
                      },
                    }}
                    onClick={addStock}
                    type="submit"
                    disabled={isIssueEnabled || optionsave || isIndentCompleted || !hasSelectedCheckbox}
                  >
                    Add Indent
                  </Button>
                </Grid>
                <Grid item xs={8} sm={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={bomIssue}
                    disabled={!isIssueEnabled}
                  >
                    BOM Issue
                  </Button>
                </Grid>
                <Grid item xs={8} sm={4}>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="contained"
                    sx={{
                      marginLeft: "5px",
                      background: "#ff0854",
                      "&:hover": {
                        background: "#ff0854",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </TableContainer>
          </Paper>
        </>
      )}
    </>
  );
}