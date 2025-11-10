import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import ModeFanOffIcon from '@mui/icons-material/ModeFanOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import NumbersIcon from '@mui/icons-material/Numbers';
import "./bomreq.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from '../../commen/LoadingSpinner';
import { useState } from "react";
import { Radio } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";

const useStyles = makeStyles({
  root: {
    "& .MuiDataGrid-columnHeader": {
     fontWeight:'bold',
      fontSize: "1em",
    },
    
  },
});

export default function Bom2() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [combinedSearchQuery, setCombinedSearchQuery] = useState("");
  const navigate = useNavigate();
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const [enqId, setEnqId] = useState("");
  
  const columns = [
    { field: "id", align: "center", headerName: "Sr No", flex:1,headerClassName: 'custom-header-class',
    renderHeader: (params) => (
      <div className={`${classes.root} custom-header-class`}>
        <NumbersIcon className="custom-header-icon" />
        <span style={{ marginLeft: '4px',fontSize:'16px' }}>{"Sr No"}</span>
      </div>
    ), },
    { field: "capacity", headerName: "Capacity", width: 110,headerClassName: 'custom-header-class', 
    renderHeader: (params) => (
      <div className={`${classes.root} custom-header-class`}>
        <BatteryCharging20Icon className="custom-header-icon" />
        <span style={{ marginLeft: '4px' }}>{"Capacity"}</span>
      </div>
    ),},
    {
      field: "voltageRatio",
      headerName: "Voltage Ratio",headerClassName: 'custom-header-class',
      width: 130,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <ElectricMeterIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Voltage Ratio"}</span>
        </div>
      ),
      renderCell: ({ row }) => {
        return `${row.priratio}/${row.secratio}V`;
      },
    },
    {
      field: "type",
      headerName: "Type",headerClassName: 'custom-header-class',
      width: 130,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <TextFieldsIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Type"}</span>
        </div>
      ),
      renderCell: ({ row }) => {
        // Conditionally render based on the value of the "type" field
        if (row.type === 1) {
          return "OUTDOOR";
        } else if (row.type === 2) {
          return "INDOOR";
        } else if (row.type === 3) {
          return "OUTDOOR/INDOOR";
        } else {
          return ""; // Handle other cases if needed
        }
      },
    },
    {
      field: "consumertype",
      headerName: "Consumer Type",headerClassName: 'custom-header-class',
      align: "center",
      width: 150,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <ContactMailIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Consumer Type"}</span>
        </div>
      ),
    },
    {
      field: "vectorgroup",
      headerName: "Vector Group",headerClassName: 'custom-header-class',
      align: "center",
      width: 130,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <ElectricMeterIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Vector Group"}</span>
        </div>
      ),
    },
    {
      field: "typecolling",
      headerName: "Cooling Type",headerClassName: 'custom-header-class',
      align: "center",
      width: 130,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <ModeFanOffIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Cooling Type"}</span>
        </div>
      ),
    },
    {
      field: "typetaping",
      headerName: "Tapping",
      headerAlign: "center",
      headerClassName: "custom-header-class",
      width: 130,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <ContentPasteSearchIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Tapping"}</span>
        </div>
      ),
      renderCell: (params) => (
        <div style={{ marginLeft: '20px' }}>{params.value}</div>
      )
    },
    {
      field: "selectedcosting",
      headerAlign: "center",headerClassName: 'custom-header-class',
      align: "center",
      headerName: "Costing Name", // Change the header to "Costing Name"
      width: 150,
      renderCell: ({ row }) => (
        <span>{row.costingname !== null ? row.costingname : row.selectedcosting}</span>
      ),
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <ContactMailIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Costing Name"}</span>
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",headerClassName: 'custom-header-class',
      flex:1,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <AutoAwesomeIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Action"}</span>
        </div>
      ),
      renderCell: ({ row }) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onAdd(row)}
          >
            Add
          </Button>
        );
      },
    },
  ];

  React.useEffect(() => {
    const fetchData = async (id) => {
      setIsLoading(true);
  
      try {
        const response = await fetch(`${APP_BASE_PATH}/getcostingforbom2/${id}`); // Include the ID in the URL
        const jsonData = await response.json();
        setIsLoading(false);
        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Replace 'YOUR_ID_HERE' with the actual ID you want to fetch
    fetchData(id);
  }, []);
  

  const selectCosting = (row) => {
    setSelectedId(row.id);
    setSelectedItem(row)
  };

  // const onAdd = async (e) => {
  //   e.preventDefault();
  
  //   if (!selectedItem) {
  //     return; // No item selected, do nothing
  //   }
  
  //   const res = await fetch(`${APP_BASE_PATH}/updateBOM`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       id,
  //       costing_id: selectedId,
  //       bomtype: 2,
  //     }),
  //   });
  
  //   if (res.status === 200) {
  //     const data = await res.text();
  //  console.log("bom222", JSON.stringify(selectedItem));

  //     if (data === "Updated") {
  //       Swal.fire({
  //         title: "Data Added Successfully",
  //         text: `Item Updated: ${selectedItem.id}`, // Display the selected item
  //         icon: "success",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "green",
  //       });
  //       navigate(-1);
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
  //   } else {
  //     console.error("Error:", res.statusText);
  //   }
  // };
  const onAdd = async (row) => {
    setEnqId(row.eid);
  
    const res = await fetch(`${APP_BASE_PATH}/updateBOM`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        itemid: row.itemid,
        costing_id: row.cid,
        bomtype: 2,
        eid: row.eid,
      }),
    });
  
    // Get the response as text
    const responseText = await res.text();
    console.log("API Response Text:", responseText);
  
    if (res.status === 400) {
      // Handle the error message here
      console.error("API Error:", responseText);
      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } else {
      try {
        // Attempt to parse the response as JSON
        const data = JSON.parse(responseText);
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        });
       
      } catch (error) {
        console.error("Error parsing JSON:", error);
        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: "true",
          confirmButtonColor: "green",
        }); navigate(-1);
        // Handle the error as needed
      }
    }
  };
  const getRowId = (row) => row.srNo;

  const getRowClassName = (params) => {
    // Apply the background color #f2f2f2 to all rows
    return 'custom-row-class';
  };
  const filterRows = () => {
    if (combinedSearchQuery === "") {
      return rows;
    }
    return rows.filter((row) =>
      (typeof row.capacity === 'string' && row.capacity.toLowerCase().includes(combinedSearchQuery.toLowerCase())) ||
      (typeof row.priratio === 'string' && typeof row.secratio === 'string' && `${row.priratio}/${row.secratio}V`.toLowerCase().includes(combinedSearchQuery.toLowerCase())) ||
      (typeof row.typecolling === 'string' && row.typecolling.toLowerCase().includes(combinedSearchQuery.toLowerCase())) ||
      (typeof row.typetaping === 'string' && row.typetaping.toLowerCase().includes(combinedSearchQuery.toLowerCase())) ||
      (typeof row.type === 'string' && row.type.toLowerCase().includes(combinedSearchQuery.toLowerCase())) ||
      (typeof row.consumertype === 'string' && row.consumertype.toLowerCase().includes(combinedSearchQuery.toLowerCase())) ||
      (typeof row.vectorgroup === 'string' && row.vectorgroup.toLowerCase().includes(combinedSearchQuery.toLowerCase()))
    );
  };
  return (
    <>
    {isLoading && <LoadingSpinner/>}
      <div
        class="d-flex justify-content-between"
        style={{ position: "relative", bottom: 13 }}
      >
        <div className="page_header">
          <h4>Bom2</h4>
        </div>
        <Link to="/bomRequest">
          <Button variant="contained" sx={{  background: "#00d284",
                                      "&:hover": {
                                        background: "#00d284", // Set the same color as the default background
                                      },}} >
            Back
          </Button>
        </Link>
      </div>

      <Paper
        elevation={6}
        style={{ height: 442, position: "relative", bottom: 49 ,padding:'14px',marginTop:'45px'}}
      >
        {isLoading && (
          <div id="spinner">
            <CircularProgress color="warning" loading={isLoading} />
          </div>
        )}
        <div className={classes.root}>
          <div style={{ height: 400, width: "100%", }}>
          {/* <TextField
        placeholder="Search..." // 4. Modify placeholder text
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
        color="warning"
        sx={{
          marginLeft: "55rem",
          marginTop: "7px",
          marginBottom: "4px",
          width: 356,
        }}
        value={combinedSearchQuery} // 4. Add value and onChange for search input
        onChange={(e) => setCombinedSearchQuery(e.target.value)}
      /> */}
            <br />
            <DataGrid
  density='compact'
  rows={filterRows()}
  columns={columns}
  pagination={filterRows().length > 1} // Show pagination only when there are more than one row
  pageSize={1}
  getRowId={(row) => row.id || row.cid}
  getRowClassName={getRowClassName}
  style={{
    height: "auto", // Set a fixed height or 'auto' based on your needs
  }}
/>
          </div>
        </div>

        {/* <Button
          variant="contained"
          sx={{ backgroundColor: "#28a745"}} 
          style={{
            position: "relative",
            float: "right",
            right: 50,
            bottom: 80,
          }}
          onClick={onAdd}
        >
          Add
        </Button> */}
      </Paper>
    </>
  );
}
