import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight:'bold',
      fontSize: "1em",
    },
  },
});

export default function ViewGrn() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const convertDateFormat = (dateString) => {
    const [month, day, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };
  const [poref, setPoref] = useState("");
  const fetchData = async () => {
    try {
        const response = await fetch(`${APP_BASE_PATH}/viewgrn/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await response.json();
        // console.log("jsonData:", jsonData); // Log the jsonData to the console
  
        if (jsonData && jsonData.length > 0) {
          setSupplier(jsonData[0].custname || "");
          setPoref(jsonData[0].poref || "");
  
          // Assuming the date field is in the format "MM/DD/YYYY"
          const formattedDate = convertDateFormat(jsonData[0].date);
          // console.log("Formatted date:", formattedDate);
          setDate(formattedDate || "");
        }
  
        setData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
  

  useEffect(() => {
    fetchData();
  }, [id]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.floor(page * rowsPerPage / newRowsPerPage); // Calculate the new page number
    setRowsPerPage(newRowsPerPage);
    setPage(newPage); // Update the current page to the new page number
  };
  const getSerialNumber = (index) => {
    return index + 1 + page * rowsPerPage;
  };

  
  
  
  
  return (
    <>
      <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
        <div className="page_header">
          <h4 style={{ fontFamily: " 'Roboto', sans-serif" }}>View GRN</h4>
        </div>
        
        <Link to="/grn" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{backgroundColor: "#00d284" ,"&:hover": {
            background: "#00d284", // Set the same color as the default background
          },}} >
            Back
          </Button>
        </Link>
      </div>
      <Paper elevation={6} style={{
        height: rowsPerPage === 5 ? 510 : 870,
        position: "relative",
        bottom: 49,
        overflow: "auto",
        margin: "1rem",
        marginTop: '60px',
        padding:'14px' // Added margin here
      }}>
        <div className={classes.root}>
          <br />
          <div style={{ height: 400, width: "100%" }}>
           
            <br />
            {isLoading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <p>Loading...</p>
              </div>
            ) : (
              <>
          <TextField
           className="Search"
              placeholder="Supplier Name"
              variant="outlined"
              size="small"
              
              sx={{
                marginLeft: "1rem",
                marginTop: "5px",
                marginBottom: "4px",
                width: 356,
              }}
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
            <TextField
             className="Search"
              placeholder="poref"
              variant="outlined"
              size="small"
              sx={{
                marginLeft: "1rem",
                marginTop: "5px",
                marginBottom: "4px",
                width: 356,
              }}
              value={poref}
              onChange={(e) => setPoref(e.target.value)}
            />
            <TextField
             className="Search"
              type="date"
              variant="outlined"
              size="small"
              sx={{
                marginLeft: "1rem",
                marginTop: "5px",
                marginBottom: "4px",
                width: 356,
              }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
                <TableContainer>
                <Table className="tabel">
                    <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableCell-head" align="center">Sr No</TableCell>
                        <TableCell className="MuiTableCell-head" align="center">Item Code</TableCell>
                        <TableCell className="MuiTableCell-head" align="center">Description</TableCell>
                        <TableCell className="MuiTableCell-head" align="center">Unit</TableCell>
                        <TableCell className="MuiTableCell-head" align="center">Quantity</TableCell>
                        

                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data
                        .filter((row) =>
                          row.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.material_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (row.bomid?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase())||(row.qty?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow  className="tabelrow" key={row.poMasterId}>
                             <TableCell align="center">{getSerialNumber(index)}</TableCell>
                            <TableCell align="center">{row.item_code}</TableCell>
                            <TableCell align="center">{row.material_description}</TableCell>
                            <TableCell align="center">{row.unit}</TableCell>
                            <TableCell align="center">{row.qty}</TableCell>
                            
                          </TableRow>
                        ))}
                    </TableBody>

                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
             
          </div>
    
        </div>
      </Paper>
    </>
  );
}
