import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";
// import logo from "../../img/Trading School new.png";

const TransferStockDet = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fromDetails, setFromDetails] = useState([]);

  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${APP_BASE_PATH}/getTransferStockDetails/${id}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFromDetails = async () => {
    try {
      const res = await fetch(
        `${APP_BASE_PATH}/getTransferStockFromDetails/${id}`
      );
      const json = await res.json();
      setFromDetails(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFromDetails();
  }, [id]);

  return (
    <>
      <style>{`
        @media print {
          header, nav, .MuiAppBar-root, .sidebar, .navbar, .no-print {
            display: none !important;
          }

          @page {
            margin: 20mm;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
             .print-logo {
    display: block !important;
    text-align: center;
  }
        }

        .section-title {
          font-size: 18px;
          font-weight: bold;
          border-bottom: 2px solid #000;
          padding-bottom: 4px;
          margin: 30px 0 10px;
        }

        .custom-cell {
          padding: 10px 14px;
          border: 1px solid #ccc;
        }
      `}</style>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ maxWidth: "900px", margin: "auto", padding: "32px" }}>
          {/* <Box className="print-logo" sx={{ textAlign: "center", mb: 2 }}>
            <img
              src={logo}
              alt="Company Logo"
              style={{
                maxWidth: "160px",
                display: "block",
                margin: "0 auto",
              }}
            />
          </Box> */}

          {/* Header */}
          <div
            className="no-print"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Typography variant="h5">Ready Stock Details</Typography>
            <div>
              <Link
                to="/transferstock"
                style={{ textDecoration: "none", marginRight: 10 }}
              >
                <Button variant="contained" sx={{ backgroundColor: "#28a745" }}>
                  Back
                </Button>
              </Link>
              <Button variant="outlined" onClick={() => window.print()}>
                Print
              </Button>
            </div>
          </div>

          {/* Stock Info Table */}
          <div className="section-title"> Transfer Stock Information</div>
          <div style={{justifyContent:"flex-start" , textAlign:'left', fontWeight:'bold'}}>To</div>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="custom-cell">
                    <strong>Prod Plan Ref No:</strong>
                  </TableCell>
                  <TableCell className="custom-cell">
                    {data.wo_no || "—"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="custom-cell">
                    <strong>OA Ref No:</strong>
                  </TableCell>
                  <TableCell className="custom-cell">
                    {data.ref_no || "—"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="custom-cell">
                    <strong>Customer Name:</strong>
                  </TableCell>
                  <TableCell className="custom-cell">
                    {data.custname || "—"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="custom-cell">
                    <strong>Costing Name:</strong>
                  </TableCell>
                  <TableCell className="custom-cell">
                    {data.costingname || "—"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="custom-cell">
                    <strong>Production Plan Qty:</strong>
                  </TableCell>
                  <TableCell className="custom-cell">
                    {data.production_qty || "—"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="custom-cell">
                    <strong>Receive Qty:</strong>
                  </TableCell>
                  <TableCell className="custom-cell">
                    {data.recive_qty || "—"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* From Details */}
          {fromDetails.length > 0 && (
            <>
              <div className="section-title">Stock Transfer From</div>
                        <div style={{justifyContent:"flex-start" , textAlign:'left', fontWeight:'bold'}}>From</div>

              {fromDetails.map((row, idx) => (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  key={idx}
                  sx={{ marginBottom: 4 }}
                >
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="custom-cell">
                          <strong>From Customer Name:</strong>
                        </TableCell>
                        <TableCell className="custom-cell">
                          {row.from_customer_name || "—"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="custom-cell">
                          <strong>Costing:</strong>
                        </TableCell>
                        <TableCell className="custom-cell">
                          {row.costingname || "—"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="custom-cell">
                          <strong>Prod Ref No:</strong>
                        </TableCell>
                        <TableCell className="custom-cell">
                          {row.wo_no || "—"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="custom-cell">
                          <strong> Remaining Ready Quantity:</strong>
                        </TableCell>
                        <TableCell className="custom-cell">
                          {row.readyqty || "—"}
                        </TableCell>
                      </TableRow>
                      {fromDetails.length > 1 && (
                        <TableRow>
                          <TableCell className="custom-cell">
                            <strong>Transferred Quantity:</strong>
                          </TableCell>
                          <TableCell className="custom-cell">
                            {row.transfer_qty || "—"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ))}
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default TransferStockDet;
