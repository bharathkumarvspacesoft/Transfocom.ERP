import React, { useState, useEffect } from 'react';

import {
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TablePagination from "@mui/material/TablePagination";
import { useLocation } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import StoreIcon from "@mui/icons-material/Store";


import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ListIcon from '@mui/icons-material/List';
import DescriptionIcon from '@mui/icons-material/Description';
import NumbersIcon from '@mui/icons-material/Numbers';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import LoadingSpinner from 'component/commen/LoadingSpinner';

const StoreReport = () => {
  const [originalRows, setOriginalRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { search } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/stockreports`);
        const jsonData = await response.json();
        // Add SR No to each row
        const rowsWithSrNo = jsonData.map((row, index) => ({ ...row, srNo: index + 1 }));
        setOriginalRows(rowsWithSrNo);
        setRows(rowsWithSrNo);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const newPage = Math.floor(page * rowsPerPage / newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
  };

  const handleFilter = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setFilter(inputValue);

    if (inputValue === "") {
      setRows(originalRows);
    } else {
      const filterResult = originalRows.filter((row) => {
        const itemCode = (row.item_code || "").toString().toLowerCase();
        const materialDescription = (row.material_description || "").toString().toLowerCase();
        const unit = (row.unit || "").toString().toLowerCase();
        const stockQty = (row.stock_qty || "").toString().toLowerCase();

        return (
          itemCode.includes(inputValue) ||
          materialDescription.includes(inputValue) ||
          unit.includes(inputValue) ||
          stockQty.includes(inputValue)
        );
      });

      setRows(filterResult);
    }
  };
  const getRowId = (row) => row.srNo;

  const getRowClassName = (params) => {
    // Apply the background color #f2f2f2 to all rows
    return 'custom-row-class';
  };
  const columns = [
    { field: 'srNo', headerName: 'SR No',headerClassName: 'custom-header-class', flex: 1 ,renderHeader: () => <>  <NumbersIcon style={{ fontSize: "16px",marginRight:'2px' }} /> SR No</>},
    { field: 'item_code', headerName: 'Item Code', flex: 1, headerClassName: 'custom-header-class', renderHeader: () => <><DynamicFormIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Item Code</> },
    { field: 'material_description', headerName: 'Item Description', flex: 1, headerClassName: 'custom-header-class',renderHeader: () => <><DescriptionIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Item Description</> },
    { field: 'unit', headerName: 'Unit', flex: 1, headerClassName: 'custom-header-class',renderHeader: () => <><ListIcon style={{ fontSize: "16px" }} /> Unit</>  },
    { field: 'store_name', headerName: 'Store Name', flex: 1, headerClassName: 'custom-header-class',renderHeader: () => <><StoreIcon style={{ fontSize: "16px" }} /> Store Name</>  },
    { field: 'stock_qty', headerName: 'Quantity', flex: 1, headerClassName: 'custom-header-class',renderHeader: () => <> <ProductionQuantityLimitsIcon style={{ fontSize: "16px",marginRight:'2px' }} /> Quantity</>  },
  ];

  

  // Calculate the height dynamically based on the number of rows
  const calculatePaperHeight = () => {
    const rowHeight = 52; // Adjust this value based on your row height
    const headerHeight = 56; // Adjust this value based on your header height
    const paginationHeight = 56; // Adjust this value based on your pagination height
    const numberOfRows = rows.length;
    const estimatedHeight = numberOfRows * rowHeight + headerHeight + paginationHeight;
    return estimatedHeight;
  };

  return (
    <>
    {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
      <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
        <div className="page_header">
          <h4>Stock</h4>
        </div>
        
      </div>
      
          <TextField
           className="Search"
            label="Search..."
            value={filter}
            onChange={(e) => handleFilter(e)}
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
        
        <div>
        
          <div style={{ height: "100%", width: '100%' }}>
          <DataGrid
              rows={rows}
              density='compact'
              columns={columns}
              loading={isLoading}
              pagination
              pageSize={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10]}
              rowCount={rows.length}
              getRowId={getRowId}
              getRowClassName={getRowClassName}
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
          </div>
        </div>
      
      </>
      )}
    </>
  );
};

export default StoreReport;
