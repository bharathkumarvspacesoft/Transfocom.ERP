import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import "./bomreq.css";
import ModeFanOffIcon from '@mui/icons-material/ModeFanOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import NumbersIcon from '@mui/icons-material/Numbers';
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
      fontWeight: "bold",
      fontSize: "1em",
    },
    "& .custom-header-icon": {
      marginRight: '4px',
    },
  },
});

export default function Bom1() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [enqId, setEnqId] = useState("");

  const navigate = useNavigate();
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const [combinedSearchQuery, setCombinedSearchQuery] = useState("");
  const columns = [
    {
      field: "id",
      align: "center",
      headerName: "Sr No",
      headerClassName: `${classes.root} custom-header-class`,
      width: 100,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <NumbersIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px',fontSize:'16px' }}>{"Sr No"}</span>
        </div>
      ),
    },
    
    
    {
      field: "capacity",
      headerName: "Capacity",
      headerClassName: "custom-header-class",
      width: 110,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <BatteryCharging20Icon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Capacity"}</span>
        </div>
      ),
    },
    {
      field: "voltageRatio",
      headerName: "Voltage Ratio",
      headerClassName: "custom-header-class",
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
      headerName: "Type",
      headerClassName: "custom-header-class",
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
      headerName: "Consumer Type",
      align: "center",
      headerClassName: "custom-header-class",
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
      headerName: "Vector Group",
      align: "center",
      headerClassName: "custom-header-class",
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
      headerName: "Cooling Type",
      align: "center",
      headerClassName: "custom-header-class",
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
        <div style={{ marginLeft: '20px' }}>{params.value || 'NO Tapping'}</div>
      )
    },
        {
      field: "cid",
      headerName: "Costing Id",
      align: "center",
      headerClassName: "custom-header-class",
      width: 130,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <ModeFanOffIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Costing Id"}</span>
        </div>
      ),
    },
    
    {
      field: "selectedcosting",
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header-class",
      headerName: "Costing Name", // Change the header to "Costing Name"
      width: 300,
      renderHeader: (params) => (
        <div className={`${classes.root} custom-header-class`}>
          <ContactMailIcon className="custom-header-icon" />
          <span style={{ marginLeft: '4px' }}>{"Costing Name"}</span>
        </div>
      ),
      renderCell: ({ row }) => (
        <span>
          {row.costingname !== null ? row.costingname : row.selectedcosting}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      headerClassName: "custom-header-class",
      width: 137,
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
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${APP_BASE_PATH}/getcostingforbom1/${id}`
        ); // Replace with your API endpoint
        const jsonData = await response.json();
        console.log('jsonData',jsonData);
        
        setRows(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. Create a function to filter rows based on the search query
  const filterRows = () => {
    if (combinedSearchQuery === "") {
      return rows;
    }
    return rows.filter(
      (row) =>
        (typeof row.capacity === "string" &&
          row.capacity
            .toLowerCase()
            .includes(combinedSearchQuery.toLowerCase())) ||
        (typeof row.priratio === "string" &&
          typeof row.secratio === "string" &&
          `${row.priratio}/${row.secratio}V`
            .toLowerCase()
            .includes(combinedSearchQuery.toLowerCase())) ||
        (typeof row.typecolling === "string" &&
          row.typecolling
            .toLowerCase()
            .includes(combinedSearchQuery.toLowerCase())) ||
        (typeof row.typetaping === "string" &&
          row.typetaping
            .toLowerCase()
            .includes(combinedSearchQuery.toLowerCase())) ||
        (typeof row.type === "string" &&
          row.type.toLowerCase().includes(combinedSearchQuery.toLowerCase())) ||
        (typeof row.consumertype === "string" &&
          row.consumertype
            .toLowerCase()
            .includes(combinedSearchQuery.toLowerCase())) ||
        (typeof row.vectorgroup === "string" &&
          row.vectorgroup
            .toLowerCase()
            .includes(combinedSearchQuery.toLowerCase()))
    );
  };

  const selectCosting = (row) => {
    setSelectedId(row.id);
    setEnqId(row.eid);
  };

  const onAdd = async (row) => {
    setEnqId(row.eid);
    setIsLoading(true)
    try {
    const res = await fetch(`${APP_BASE_PATH}/updateBOM`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        itemid: row.itemid,
        costing_id: row.cid,
        bomtype: 1,
        eid: row.eid,
        plan_id:row.prod_plan_id
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
      setIsLoading(false)
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
        });
        navigate(-1);
        // Handle the error as needed
      }finally{
        setIsLoading(false)
      }
    }
  } catch (error) {
    console.error("Error during fetch:");
    Swal.fire({
      title: "An error occurred!",
      text: 'error',
      icon: "error",
      iconHtml: "",
      confirmButtonText: "OK",
      animation: "true",
      confirmButtonColor: "red",
    });
  }finally{
    setIsLoading(false)
  }
};
  const getRowId = (row) => row.srNo;

  const getRowClassName = (params) => {
    // Apply the background color #f2f2f2 to all rows
    return "custom-row-class";
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
          <h4>Bom1</h4>
        </div>
        <Link to="/bomRequest">
          <Button
            variant="contained"
            sx={{
              background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },
            }}
          >
            Back
          </Button>
        </Link>
      </div>

      
        {isLoading && (
          <div id="spinner">
            <CircularProgress color="warning" loading={isLoading} />
          </div>
        )}
        <div className={classes.root}>
          <div style={{ height: 400, width: "100%" }}>
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
              density="compact"
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
      
      </>
      )}
    </>
  );
}
