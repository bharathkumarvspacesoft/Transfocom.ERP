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
import { APP_BASE_PATH } from "Host/endpoint";
import ListIcon from '@mui/icons-material/List';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import NumbersIcon from '@mui/icons-material/Numbers';
import DescriptionIcon from '@mui/icons-material/Description';
import ReorderIcon from '@mui/icons-material/Reorder';
const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "#000000",
      fontSize: "1em",
      align: "center",
      fontWeight: "bold"
    },
  },
});

export default function ItemStock() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const response = await fetch(`${APP_BASE_PATH}/getaddstock/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
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

  return (
    <>
      <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
        <div className="page_header">
          <h4 style={{ fontFamily: " 'Roboto', sans-serif" }}>View Indents</h4>
        </div>
        <Link to="/indents" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{  background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      },marginBottom:'10px' }}>
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
          <div style={{ height: 400, width: "100%"}}>
           
            <br />
            {isLoading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <p>Loading...</p>
              </div>
            ) : (
              <>
                <TableContainer>
                <Table className="tabel">
                    <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableCell-head" align="center"><NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>
                        <TableCell className="MuiTableCell-head" align="center"><DynamicFormIcon style={{ fontSize: "16px",marginRight:'2px' }} />Item Code</TableCell>
                        <TableCell className="MuiTableCell-head" align="center"><DescriptionIcon style={{ fontSize: "16px",marginRight:'2px' }} />Description</TableCell>
                        <TableCell className="MuiTableCell-head" align="center"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                        <TableCell className="MuiTableCell-head" align="center"><ReorderIcon style={{ fontSize: "16px" }} />Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data
                        .filter((row) =>
                          row.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.material_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.bomid.toString().toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow    className="tabelrow" key={row.indent_id}>
                            <TableCell align="center">{index + 1}</TableCell>
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
