import * as React from "react";
import { useState } from "react";

import { Button, IconButton, Grid, Checkbox, FormControlLabel } from "@mui/material";
import "./issue.css";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import DescriptionIcon from '@mui/icons-material/Description';
import ListIcon from '@mui/icons-material/List';
import ReorderIcon from '@mui/icons-material/Reorder';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

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
function BomIssueselect() {
    const location = useLocation();
  
    // Check if location.state is defined before accessing its properties
    const selectedItems = location.state ? location.state.selectedItems : [];
    
    console.log("Selected Items:", selectedItems);  
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [disabledRows, setDisabledRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isIssueEnabled, setIsIssueEnabled] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  console.log("ids",id)
  
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getbomDetailselect/` + selectedItems);
        const jsonData = await response.json();
        
          const rows = [];
         jsonData.forEach(array => {
             array.forEach(item => {
                 rows.push(item); // Insert each item into the rows array
             });
         });
         
         setRows(rows);
         console.log("json",jsonData)
        console.log("data",rows)// The "itemid" field is already included in the jsonData, so you don't need to modify it here.
      
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const isAllAvailableInStore = rows.every((row) => row.stock >= row.totqty);
    setIsIssueEnabled(isAllAvailableInStore);
  }, [rows]);
  useEffect(() => {
    // Update disabledRows based on the condition
    const updatedDisabledRows = {};
    rows.forEach((row) => {
      updatedDisabledRows[row.id] = (row.stock + row.qty + row.poqty) >= row.totqty;
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
    setSelectedRows((prevState) => ({
      ...prevState,
      [index]: value.target.checked,
    }));
  };

  // const addStock = async (e) => {
  //   e.preventDefault();
  
  //   let dataList = [];
  //   // rows.forEach((listval) => {
  //   //   if (selectedRows[listval.id]) {
  //   //     // Calculate the difference between "Available in Store" and "BOI Quantity"
  //   //     let qtyToSubtract;

  //   //     // Check if BOI Quantity is greater than or equal to Stock
  //   //     if (listval.totqty > listval.stock) {
  //   //       // If BOI Quantity is greater, keep it
  //   //       qtyToSubtract =  listval.totqty - listval.stock 
  //   //     } else {
  //   //       // Otherwise, use Stock
  //   //       qtyToSubtract = listval.stock - listval.totqty;
  //   //     }
  //   rows.forEach((listval) => {
  //     if (selectedRows[listval.id]) {
  //       // Calculate the difference between "Available in Store" and "BOI Quantity"
  //       let qtyToSubtract;
  //       let insertqty
  //       let newqty
  
  //       // Check if BOI Quantity is greater than or equal to Stock
  //       if (listval.totqty > listval.stock) {
  //         // If BOI Quantity is greater, keep it
  //         qtyToSubtract = listval.totqty - listval.stock;
  //       } else {
  //         // Otherwise, use Stock
  //         qtyToSubtract = listval.stock - listval.totqty;
  //       }
  
  //       // Check if the "qty" field is not empty (you can adjust this condition as needed)
  //       if (listval.qty !== "") {
  //         // Subtract qtyToSubtract only if "qty" is not empty
  //         if(listval.qty < qtyToSubtract){
  //            insertqty= qtyToSubtract - listval.qty
  //         }else{
  //           insertqty=   listval.qty - qtyToSubtract
  //         }
          
  //       }
  //       if (listval.poqty !== "") {
  //         // Subtract qtyToSubtract only if "qty" is not empty
  //         if(listval.poqty < insertqty){
  //           newqty= insertqty - listval.poqty
  //         }else{
  //           newqty=   listval.poqty - insertqty
  //         }
          
  //       }
  
  //       dataList = [
  //         ...dataList,
  //         {
  //           uid:listval.uid,
  //           item_id: listval.itemid,
  //           itemcode: listval.item_code,
  //           materialdescription: listval.material_description,
  //           qty: newqty, // Use the calculated quantity
  //         },
  //       ];
  //     }
  //   });
  
  //   const params = {
  //     bomid: id,
  //     date: new Date().toLocaleDateString("en-GB"),
  //     uid: dataList[0].uid,
  //     iscompleted: 0,
  //     dataList,
  //   };
  
  //   try {
  //     const res = await fetch(`${APP_BASE_PATH}/addIndent/${dataList[0].uid}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(params),
  //     });
  
  //     if (res.ok) {
  //       Swal.fire({
  //         title: "Data Added Successfully",
  //         icon: "success",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "green",
  //       });
  //       navigate("/indents");
  //     } else {
  //       Swal.fire({
  //         title: "Something went wrong!",
  //         icon: "error",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "red",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error inserting data:", error);
  //     Swal.fire({
  //       title: "Something went wrong!",
  //       icon: "error",
  //       iconHtml: "",
  //       confirmButtonText: "OK",
  //       animation: "true",
  //       confirmButtonColor: "red",
  //     });
  //   }
  // };
  const addStock = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const selectedItemsExist = Object.values(selectedRows).some((value) => value);
  
    if (!selectedItemsExist) {
      Swal.fire({
        title: "Select at least one item to add indent",
        icon: "info",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "blue",
      });
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
    }finally
    {
      setIsLoading(false);
    }
  };
  
  
  const bomIssue = async () => {
    // Confirm before updating stock
    console.log("BOM Issue Clicked");
    console.log("Rows Data:", rows);
    setIsLoading(true);
    // Create an array to hold data for each row
    const dataToUpdate = [];
  
    // Iterate over each row and add relevant data to the array
    rows.forEach((row) => {
      
        dataToUpdate.push({
          id:id,
          uid: row.uid,
          item_id: row.itemid,
          boiQty: row.totqty,
          availableInStore: row.stock,
        });
     
    });
  
    console.log("Data to Update:", dataToUpdate);
  
    // Send the data array to the backend
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
        navigate('/issueOfBom')
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
      // Handle exceptions
      console.error("Error sending BOM Issue data:", error);
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
          <h4>Issue of BOM</h4>
        </div>
      </div>
      <Paper elevation={6} style={{ position: "relative", marginTop: 0,padding:'14px' }}>
        <TableContainer>
          

          <div>
            <div className={classes.root}>
            <Table className="tabel">
                    <TableHead className="tableHeader">
                  <TableRow>
                   
                    <TableCell className="MuiTableHead-root"> <DynamicFormIcon style={{ fontSize: "16px",marginRight:'2px' }} />Item Code</TableCell>
                    <TableCell className="MuiTableHead-root"> <DescriptionIcon style={{ fontSize: "16px",marginRight:'2px' }} />Item Description</TableCell>
                    <TableCell className="MuiTableHead-root"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                    <TableCell className="MuiTableHead-root"><ReorderIcon style={{ fontSize: "16px" }} />BOI Quantity</TableCell>
                    <TableCell className="MuiTableHead-root"><EventAvailableIcon style={{ fontSize: "16px" }} />Available in Store</TableCell>
                    <TableCell className="MuiTableHead-root"><ProductionQuantityLimitsIcon style={{ fontSize: "16px" }} />Indent qty</TableCell>
                    <TableCell className="MuiTableHead-root"><ProductionQuantityLimitsIcon style={{ fontSize: "16px" }} />Po qty</TableCell>
                    <TableCell className="MuiTableHead-root"> <AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />Action  <FormControlLabel
                control={<Checkbox checked={selectAll} onChange={() => setSelectAll(!selectAll)} />}
              
              /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow  className="tabelrow" key={index}>
                      <TableCell>{row.item_code}</TableCell>
                      <TableCell>{row.material_description}</TableCell>
                      <TableCell>{row.unit}</TableCell>
                      <TableCell>{row.totqty}</TableCell>
                      <TableCell>{row.stock}</TableCell>
                      <TableCell>{row.qty}</TableCell>
                      <TableCell>{row.poqty}</TableCell>
                      <TableCell>
              <IconButton
                size="small"
                title="Add Indent"
                color={row.totqty > row.stock ? "error" : "default"}
                disabled={(row.stock + row.qty + row.poqty) >= row.totqty}
                onClick={() => {
                  if (!(row.stock + row.qty + row.poqty >= row.totqty)) {
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
                    if (!(row.stock + row.qty + row.poqty >= row.totqty)) {
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
                    background: "#00d284", // Set the same color as the default background
                  },
                }}
                onClick={addStock}
                type="submit"
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
                    background: "#ff0854", // Set the same color as the default background
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
export default BomIssueselect;