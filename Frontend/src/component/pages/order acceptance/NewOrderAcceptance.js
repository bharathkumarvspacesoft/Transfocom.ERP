import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { Button, Grid, IconButton } from "@mui/material";

import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import "./order.css";
import { Link, useNavigate } from "react-router-dom";

import TablePagination from "@mui/material/TablePagination";

import CircularProgress from "@mui/material/CircularProgress";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";
const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      fontWeight: "bold",
      align: "center",
    },
  },
});
const type = {
  1: "OUTDOOR",
  2: "INDOOR",
  3: "OUTDOOR/INDOOR",
};
export default function Orderacceptance() {
  // get method//
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getOrderAccForAdd`); // Replace with your API endpoint
        const jsonData = await response.json();
        console.log(jsonData)
        setRows(jsonData);
        setIsLoading(false); // for loading spinner
        setFilterdata(jsonData); // for search data
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      const searchdata = rows.filter(
        (item) =>
          item.custname.toLowerCase().includes(getSearch) ||
          item.quotref.toLowerCase().includes(getSearch) ||
          item.capacity.toLowerCase().includes(getSearch)||
          item.deliveryperiod.toLowerCase().includes(getSearch)||
          type[item.type].toLowerCase().includes(getSearch) || 
          item.consumertype.toLowerCase().includes(getSearch)||
          item.qty.toLowerCase().includes(getSearch)
      );
      setRows(searchdata);
    } else {
      setRows(filterdata);
    }
    setQuery(getSearch);
  };

  const onCancel = async (id, type) => {
    const res = await fetch(`${APP_BASE_PATH}/updateQuotationStatus/` + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const quot = await fetch(`${APP_BASE_PATH}/getAcceptanceNumber/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response?.json();
      })
      .then(async (resp) => {
        const param = {
          qid: id,
          orderacc_date: new Date(),
          ostatus: 2,
          consignor: "",
          consignee: "",
          ref_no: resp.refNo,
          consumer: "",
          testing_div: 1,
          consumer_address: "",
          type: type,
          quantity: "",
          advance: "",
          fileflag: "",
          ponum: "",
          podate: "",
          basicrate: "",
        };

        const res = await fetch(`${APP_BASE_PATH}/addorderacc`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(param),
        });

        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          // If response is not JSON, handle gracefully
        }
        if (!res.ok || !data || !data.success) {
          Swal.fire({
            title: "Order creation failed!",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "red",
          });
        } else {
          Swal.fire({
            title: "Order Status is Changed.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "green",
          });

          navigate(-1);
        }
      });
  };

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.min(page, Math.floor(rows.length / newRowsPerPage));
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); 
  };
  

  const classes = useStyles();

  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
       
  
        <Grid item xs={6} style={{ marginRight:'77%' }}>
          <h4>New Order Acceptance</h4>
        </Grid>
  
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ marginTop: "2px" }}
        >
         
          
        </Grid>
        
        <Grid container style={{ display: 'flex', alignItems: 'center' }}>
  <Grid item xs={6} >
    <TextField
      style={{ width: "500px", marginRight: '80px' }}
      className="Search"
      placeholder="Search..."
      value={query}
      onChange={(e) => handlesearch(e)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      variant="outlined"
      size="small"
    />
  </Grid>
  <Grid item xs={6} style={{ textAlign: 'right' }}>
  <Link to="/Orderacceptance" style={{ textDecoration: "none" }}>
      <Button variant="contained" sx={{ background: "#00d284","&:hover": {
        background: "#00d284", // Set the same color as the default background
      },}}>
        Back
      </Button>
    </Link>
    
  </Grid>
</Grid>

        
        <Grid item xs={12}>
           
              <TableContainer className="table-container" component={Paper}>
                <Table size="small">
                <TableHead className="tableHeader">
                <TableRow>
                  <TableCell className="MuiTableHead-root" style={{color: "#000000",
                      align: "center",
                      fontWeight: "bold" }}>Sr No</TableCell>

                  <TableCell
                    className="MuiTableHead-root"
                    style={{ width: 190,color: "#000000",
                      align: "center",
                      fontWeight: "bold"  }}
                  >
                    Quotation Ref<br/> No
                  </TableCell>
                  <TableCell
                    className="MuiTableHead-root"
                    style={{ width: 190,color: "#000000",
                      align: "center",
                      fontWeight: "bold"  }}
                  >
                    Customer <br/>Name
                  </TableCell>
                  <TableCell className="MuiTableHead-root" style={{color: "#000000",
                      align: "center",
                      fontWeight: "bold" }}>
                    Capacity
                  </TableCell>
                  <TableCell
                    className="MuiTableHead-root"
                    style={{ width: 110,color: "#000000",
                      align: "center",
                      fontWeight: "bold"  }}
                  >
                    Delivery<br/> Days
                  </TableCell>
                  <TableCell className="MuiTableHead-root"style={{color: "#000000",
                      align: "center",
                      fontWeight: "bold" }}>
                    Transformer<br/> Type
                  </TableCell>
                  <TableCell className="MuiTableHead-root" style={{color: "#000000",
                      align: "center",
                      fontWeight: "bold" }}>
                    Consumer<br/> Type
                  </TableCell>

                  <TableCell className="MuiTableHead-root" style={{color: "#000000",
                      align: "center",
                      fontWeight: "bold" }}>
                    Voltage<br/> Ratio
                  </TableCell>
                  <TableCell
                    className="MuiTableHead-root"
                    style={{ width: 90,color: "#000000",
                      align: "center",
                      fontWeight: "bold"  }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    className="MuiTableHead-root"
                    style={{ width: 135,color: "#000000",
                      align: "center",
                      fontWeight: "bold"  }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((item, index) => {
                    return (
                      <TableRow
                      className="tabelrow"
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={item.code}
                      >
                        <TableCell align="center" key={item.id}>{index + 1}</TableCell>
                        <TableCell align="center" key={item.a}>{item.quotref}</TableCell>
                        <TableCell align="center" key={item.b}>{item.custname}</TableCell>
                        <TableCell align="center" key={item.c}>{item.capacity}</TableCell>
                        <TableCell align="center" key={item.d}>
                          {item.deliveryperiod}
                        </TableCell>
                        <TableCell align="center" key={item.f}>
                          {type[item.type]}
                        </TableCell>
                        <TableCell align="center" key={item.e}>
                          {item.consumertype}
                        </TableCell>
                        <TableCell align="center" key={item.p}>
                          {item.priratio}/{item.secratio}V
                        </TableCell>
                        <TableCell align="center" key={item.j}>{item.qty}</TableCell>
                        <TableCell align="center"
                          style={{
                            whiteSpace: "nowrap",
                            paddingLeft: "7px",
                          }}
                        >    <Link to={`/UpdateQuotation/${item.qid}`}>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ padding: "8px",background: "#00d284",
                          "&:hover": {
                            background: "#00d284", // Set the same color as the default background
                          },}}
                        >
                          Edit
                        </Button>
                      </Link>
                          <Link to={`/AcceOrder?qid=${item.qid}`}>
                            <Button
                              size="small"
                             variant="contained"
                              
                              sx={{ padding: "8px",marginLeft:"10px",background: "#00cff4",
                              "&:hover": {
                                background: "#00cff4", // Set the same color as the default background
                              },}}
                            >
                              Accept
                            </Button>
                          </Link>
                      
                          <Button
                            size="small"
                            variant="contained"
                            
                            onClick={() => onCancel(item.qid, item.type)}
                            sx={{ padding: "8px",marginLeft:"10px",background: "#ff0854",
                            "&:hover": {
                              background: "#ff0854", // Set the same color as the default background
                            },}}
                          >
                            cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
                </Table>
               
              </TableContainer>
              <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
           
          </Grid>
        
        
      </Grid>
      )}
    </>
  );
}
