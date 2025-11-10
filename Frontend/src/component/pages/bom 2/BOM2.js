import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import { Button, IconButton } from "@mui/material";
import "./bom2.css";
import { useNavigate, Link } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import CommentIcon from '@mui/icons-material/Comment';
import ModeFanOffIcon from '@mui/icons-material/ModeFanOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NumbersIcon from '@mui/icons-material/Numbers';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import { useEffect, useState } from "react";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      fontWeight:'bold',
      fontSize: "1em",
    },
  },
});

export default function Costing1() {
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate("/AddCosting1");
  };
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getcosting2`); // Replace with your API endpoint
        const jsonData = await response.json();
        console.log('jsonData',jsonData)
        setFilterdata(jsonData);
        setIsLoading(false);
        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [filterdata, setFilterdata] = useState([]);
  const [query, setQuery] = useState("");

  const handlesearch = (event) => {
    const getSearch = event.target.value;
    if (getSearch.length > 0) {
      const searchdata = rows.filter((item) =>
        item.capacity.toLowerCase().includes(getSearch)
      );
      setRows(searchdata);
    } else {
      setRows(filterdata);
    }
    setQuery(getSearch);
  };

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
  function TableCellWithPopup({ item }) {
    const [showPopup, setShowPopup] = useState(false);
  
    const handleMouseEnter = () => {
      if (item.typetaping.length > 20) {
        setShowPopup(true);
      }
    };
  
    const handleMouseLeave = () => {
      setShowPopup(false);
    };
  
    return (
      <TableCell className="table-cell" key={item.c}>
        <div
          className="popup"
          title={showPopup ? item.typetaping : ''}
          style={{ top: '20px', left: '5px' }} // Adjust the position as needed
        >
          {item.typetaping}
        </div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          {item.typetaping.length > 20 ? (
            item.typetaping.substring(0, 20) + '...'
          ) : (
            item.typetaping
          )}
        </div>
      </TableCell>
    );
  }
  
  return (
    <>
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4 style={{ fontFamily: "'Roboto', sans-serif" }}>Bom 2 </h4>
        </div>
      </div>

      <Paper
        style={{
          height: rowsPerPage === 5 ? 510 : 870,
          position: "relative",
          bottom: 49,
          overflow: "auto",
          margin: "1rem",
          marginTop:'60px',
          padding:'14px' // Added margin here
        }}
      >
         {rows.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color:'red',
              fontSize:'1.4em',
              fontFamily:'roboto'
            }}
          >
            <p>No records found.</p>
          </div>
        ) : (
        <div className={classes.root}>
          <div style={{ height: 400, width: "100%" }}>
            <TextField
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
              sx={{
                marginRight: "65rem",
               width:220,
                marginBottom: "8px",
              }}
            />
            <TableContainer>
              {isLoading && (
                <div id="spinner">
                  {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
                  <CircularProgress color="warning" loading={isLoading} />
                </div>
              )}
              <div className={classes.root}>
              <Table className="tabel">
              <TableHead className="tableHeader">
                      <TableRow>
                        <TableCell className="MuiTableHead-root"><NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} />Sr No</TableCell>

                        <TableCell className="MuiTableHead-root">
                        <BatteryCharging20Icon style={{ fontSize: "16px",marginRight:'2px' }} />Capacity
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                        <ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} />  Voltage Ratio
                        </TableCell>
                        <TableCell className="MuiTableHead-root"><TextFieldsIcon style={{ fontSize: "16px",marginRight:'2px' }} />Type</TableCell>
                        <TableCell className="MuiTableHead-root">
                        <ContactMailIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Consumer Type
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                        <ElectricMeterIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Vector Group
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                        <ModeFanOffIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Cooling Type
                        </TableCell>

                        <TableCell
                          className="MuiTableHead-root"
                          
                        ><ContentPasteSearchIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Tapping
                        </TableCell>
                        <TableCell className="MuiTableHead-root">
                        
                        <CommentIcon style={{ fontSize: "16px",marginRight:'2px' }} />
                          Comment
                        </TableCell>

                        <TableCell
                          className="MuiTableHead-root"
                    
                        ><AutoAwesomeIcon style={{ fontSize: "16px",marginRight:'2px' }} />
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
                      .map((item,index) => {
                        return (
                          <TableRow
                          className="tabelrow"
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={item.code}
                          >
                            <TableCell style={{textAlign:'center'}}>{serialNumber + index}</TableCell> 
                            <TableCell style={{textAlign:'center'}} key={item.a}>{item.capacity}</TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.c}>
                            {item.priratio}/{item.secratio}
                            </TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.h}>{item.type}</TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.g}>
                              {item.consumertype}
                            </TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.b}>
                              {item.vectorgroup}
                            </TableCell>
                            <TableCell style={{textAlign:'center'}} key={item.f}>
                              {item.typecolling}
                            </TableCell>
                            <TableCellWithPopup item={item} />
                            <TableCell key={item.d}>{item.comment}</TableCell>
                            <TableCell className="wh-spc">
                            <Link to={`/viewbom2/${item.id}`}>
                                  <Button size="small" variant="contained"  sx={{
                                    marginLeft: "5px",
                                    padding: "5px",
                                    background: "#00d284",
                                    "&:hover": {
                                      background: "#00d284", // Set the same color as the default background
                                    },
                                  }} >
                                    View
                                  </Button>
                                </Link>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    marginLeft: "5px",
                                    padding: "5px",
                                    background: "#00cff4",
                                    "&:hover": {
                                      background: "#00cff4", // Set the same color as the default background
                                    },
                                  }}
                                  
                                  onClick={() => navigate(`/viewBom2/${item.id}`)}
                                >
                                  Print
                                </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
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
          </div>
        </div>
        )}
      </Paper>
    </>
  );
}
