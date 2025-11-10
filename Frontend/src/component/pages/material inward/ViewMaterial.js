import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom"; // Import useLocation
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { APP_BASE_PATH } from "Host/endpoint";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import ListIcon from '@mui/icons-material/List';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import NumbersIcon from '@mui/icons-material/Numbers';
import DescriptionIcon from '@mui/icons-material/Description';
import ReorderIcon from '@mui/icons-material/Reorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LoadingSpinner from "component/commen/LoadingSpinner";
const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight: 'bold',
      fontSize: "1em",
    },
  },
});

export default function ViewMaterial() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { poid, id } = useParams();
  const location = useLocation(); // Use useLocation hook to get location object

  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const convertDateFormat = (dateString) => {
    if (dateString) {
      const [month, day, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }
    return ""; // Return an empty string or handle it as per your requirements
  };

  const [poref, setPoref] = useState("");
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${APP_BASE_PATH}/viewmaterialinward/${poid}${id ? `?id=${id}` : ''}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const jsonData = await response.json();

      if (jsonData && jsonData.length > 0) {
        setSupplier(jsonData[0].custname || "");
        setPoref(jsonData[0].poref || "");

        // Assuming the date field is in the format "MM/DD/YYYY"
        const formattedDate = convertDateFormat(jsonData[0]?.date);

        setDate(formattedDate || "");
      }

      console.log(jsonData);
      setData(jsonData);

    } catch (error) {
      console.error("Error fetching data:", error);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('poid:', poid);
    console.log('id:', id);

    fetchData();
  }, [id, poid]);
  // Include poid as a dependency in useEffect

  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };
  const getSerialNumber = (index) => {
    return index + 1 + page * rowsPerPage;
  };





  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
            <div className="page_header">
              {/* <h4 style={{ fontFamily: " 'Roboto', sans-serif" }}>View Material Inward</h4> */}
              <h4 style={{ fontFamily: " 'Roboto', sans-serif" }}>View GRN</h4>
            </div>

            <Link to="/materialInward" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{
                background: "#00d284",
                "&:hover": {
                  background: "#00d284", // Set the same color as the default background
                },
              }} >
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
            padding: '14px' // Added margin here
          }}>
            <div className={classes.root}>
              <br />
              <div style={{ height: 400, width: "100%" }}>


                <br />

                <TextField
                  className="Search"
                  label="Supplier Name"
                  variant="outlined"
                  size="small"

                  sx={{
                    marginLeft: "1rem",
                    marginTop: "5px",
                    marginBottom: "4px",
                    width: 356,
                  }}
                  value={data.length > 0 ? data[0].name || "" : ""}

                  onChange={(e) => setSupplier(e.target.value)}
                />
                <TextField
                  className="Search"
                  label="POref"
                  variant="outlined"
                  size="small"
                  sx={{
                    marginLeft: "1rem",
                    marginTop: "5px",
                    marginBottom: "4px",
                    width: 356,
                  }}
                  value={data.length > 0 ? data[0].poref || "" : ""}

                  onChange={(e) => setPoref(e.target.value)}
                />
                <TextField
                  label="Date"
                  className="Search"
                  variant="outlined"
                  size="small"
                  sx={{
                    marginLeft: "1rem",
                    marginTop: "5px",
                    marginBottom: "4px",
                    width: 356,
                  }}
                  value={data.length > 0 ? data[0].date || "" : ""}

                  onChange={(e) => setDate(e.target.value)}
                />
                <TableContainer>
                  <Table className="tabel">
                    <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableCell-head" align="center"><NumbersIcon style={{ fontSize: "16px", marginRight: '2px' }} />Sr No</TableCell>
                        <TableCell className="MuiTableCell-head" align="center"><DynamicFormIcon style={{ fontSize: "16px", marginRight: '2px' }} />Item Code</TableCell>
                        <TableCell className="MuiTableCell-head" align="center"><DescriptionIcon style={{ fontSize: "16px", marginRight: '2px' }} />Description</TableCell>
                        <TableCell className="MuiTableCell-head" align="center"><ListIcon style={{ fontSize: "16px" }} />Unit</TableCell>
                        <TableCell className="MuiTableCell-head" align="center"><ReorderIcon style={{ fontSize: "16px" }} />Quantity</TableCell>
                        <TableCell className="MuiTableCell-head" align="center">

                          <DoneAllIcon style={{ fontSize: "16px" }} />
                          Accept Quantity</TableCell>
                        <TableCell className="MuiTableCell-head" align="center">

                          <RemoveDoneIcon style={{ fontSize: "16px" }} />
                          Reject Quantity</TableCell>



                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data
                        .filter((row) =>
                          row.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.material_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (row.bomid?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase()) || (row.qty?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow className="tabelrow" key={row.poMasterId}>
                            <TableCell key={row.a} align="center">{getSerialNumber(index)}</TableCell>
                            <TableCell key={row.b} align="center">{row.item_code}</TableCell>
                            <TableCell key={row.c} align="center">{row.material_description}</TableCell>
                            <TableCell key={row.d} align="center">{row.unitmaster_unit}</TableCell>
                            <TableCell key={row.e} align="center">{row.qty}</TableCell>
                            <TableCell key={row.f} align="center">{row.accqty}</TableCell>
                            <TableCell key={row.g} align="center">{row.rejqty}</TableCell>

                          </TableRow>
                        ))}
                    </TableBody>

                  </Table>
                </TableContainer>
                {/* <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={data.length}       // ✅ Use the same array you render from
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0); // ✅ Reset to first page
                  }}
                />


              </div>

            </div>
          </Paper>
        </>
      )}
    </>
  );
}
