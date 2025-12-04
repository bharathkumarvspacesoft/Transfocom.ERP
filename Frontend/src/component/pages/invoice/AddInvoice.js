import { Autocomplete, Grid, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import dayjs from "dayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Button from "@mui/material/Button";
import "./invoice.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";
import { DatePicker } from "@mui/x-date-pickers";
import LoadingSpinner from "component/commen/LoadingSpinner";

const AddInvoice = () => {
  const { search } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : {};
  const userId = parsedUserData.id || "";

  const [user, setUser] = useState({
    invoice_no: "",
    inv_date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC",
    }).replace(/\//g, "-"),
    challan_id: "", buyerName: "", buyer_id: "", customeraddress: "",
    consignee_cat: "", gstNo: "", po_no: "", po_date: "", vehicle_no: "",
    date_issue: "", time_issue: "", date_removal: "", time_removal: "",
    uid: userId, by_road: "", buyer_addr: "", consign_addr: "", consigneename: "",
    orderacceptance_id: "", remainingadvance: "", oa_id: "", qty: "",
    // GST values from backend
    basic_total: 0, cgst: 0, sgst: 0, igst: 0,
    cgst_rate: 0, sgst_rate: 0, igst_rate: 0, show_igst: false,
    grand_total: "0.00", net_total: "0.00", advance: 0, roundoff: 0,
  });

  const id = new URLSearchParams(search).get("id");

  const handledelete = () => {
    navigate("/invoice");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APP_BASE_PATH}/getChallanDetail/${id}`);
        const jsonData = await response.json();
        console.log("Fetched data:", jsonData);
        // All GST calculations come from backend - just map the data
        setUser((prev) => ({ ...prev, ...jsonData }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlDateChange = (value, name) => {
    let formattedTime = value;
    if (formattedTime !== "" && !name.includes("date")) {
      if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value)) {
        formattedTime = value.toLocaleTimeString("en-US", {
          hour: "numeric", minute: "numeric", hour12: true,
        });
      }
    }
    setUser((prev) => ({
      ...prev,
      [name]: name.includes("date") ? value.toLocaleDateString("en-GB") : formattedTime,
    }));
  };

  const formatDate = (date) => dayjs(date).format("DD-MM-YYYY");

  const addNewInvoice = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user.invoice_no) {
      Swal.fire({ title: "Error", text: "Invoice number is required!", icon: "error", confirmButtonColor: "red" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${APP_BASE_PATH}/addNewInvoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...user,
          buyerName: user.buyerName,
          vehicle_no: user.vehicle,
          customeraddress: user.buyer_address,
          buyer_addr: user.buyer_address,
          detailList: {
            desc: user.desc, plan_id: user.plan_id,
            qty: user.qty, rate: user.rate,
            amt: user.basic_total, hsn: user.hsn,
          },
        }),
      });

      if (res.status === 200) {
        Swal.fire({ title: "Data Added Successfully", icon: "success", confirmButtonColor: "green" });
        navigate("/invoice");
      } else {
        const data = await res.json();
        Swal.fire({ title: "Error", text: data.message || "Something went wrong!", icon: "error", confirmButtonColor: "red" });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ title: "Error", text: "Something went wrong!", icon: "error", confirmButtonColor: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? <LoadingSpinner /> : (
        <>
          <div className="d-flex justify-content-between" style={{ position: "relative", bottom: 13 }}>
            <div className="page_header"><h4>Add Invoice</h4></div>
            <Link to="/newinvoice" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ background: "#00d284", "&:hover": { background: "#00d284" } }}>Back</Button>
            </Link>
          </div>
          <Paper elevation={6} style={{ position: "relative", bottom: 20 }}>
            <Box sx={{ marginTop: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "95%", marginLeft: "5rem" }}>
              <Box component="form" noValidate sx={{ mt: 3, mr: 7 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField fullWidth label="Invoice Number" name="invoice_no" value={user.invoice_no} onChange={handleInputs} />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Invoice Date" format="DD-MM-YYYY" defaultValue={dayjs(new Date())} onChange={(e) => handlDateChange(e.$d, "inv_date")} />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="Customer / Buyer Name" value={user.buyername} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="Customer / Buyer Address" value={user.buyeraddress} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="Consumer name" value={user.custname} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="GST No" value={user.gstNo} disabled />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="Consumer Address (Optional)" value={user.buyer_address} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="Challan NO" value={user.challan_no} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="Challan Date" value={user.chdate} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="P O Number (Optional)" value={user.po_no} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="P O Date" value={user.po_date ? formatDate(user.po_date) : ""} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField fullWidth label="Vehicle Registration Number" value={user.vehicle} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker label="Date Of Issue" format="DD-MM-YYYY" onChange={(e) => handlDateChange(e.$d, "date_issue")} />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker label="Time of Issue" onChange={(e) => handlDateChange(e && e.$d ? `${e.$H}:${e.$m}` : "", "time_issue")} />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker label="Date of Removal" format="DD-MM-YYYY" onChange={(e) => handlDateChange(e.$d, "date_removal")} />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker label="Time of Removal" onChange={(e) => handlDateChange(e && e.$d ? `${e.$H}:${e.$m}` : "", "time_removal")} />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                </Grid>

                <br />
                {/* Invoice Details Table */}
                <div className="form-group row">
                  <table className="table table-bordered table-sm" style={{ width: "96%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ width: "7%", border: "1px solid black" }}>Sr No</th>
                        <th style={{ width: "30%", border: "1px solid black" }}>Description</th>
                        <th style={{ width: "20%", border: "1px solid black" }}>HSN</th>
                        <th style={{ width: "10%", border: "1px solid black" }}>Quantity</th>
                        <th style={{ width: "15%", border: "1px solid black" }}>Rate/Unit</th>
                        <th style={{ width: "25%", border: "1px solid black" }}>Amount(Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: "1px solid black" }}>1</td>
                        <td style={{ border: "1px solid black" }}>{user.desc}</td>
                        <td style={{ border: "1px solid black" }}>
                          <input type="text" name="hsn" value={user.hsn || ""} onChange={handleInputs} />
                        </td>
                        <td style={{ border: "1px solid black" }}>{user.qty}</td>
                        <td style={{ border: "1px solid black" }}>{user.rate}</td>
                        <td style={{ border: "1px solid black" }}>{user.basic_total}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Totals Table - GST values directly from backend */}
                  <table className="table table-responsive-sm table-bordered table-sm" style={{ width: "96%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ width: "5%", border: "1px solid black" }}></td>
                        <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}></td>
                        <td style={{ width: "20%", border: "1px solid black" }}></td>
                        <td style={{ width: "10%", border: "1px solid black" }}></td>
                        <td style={{ width: "15%", border: "1px solid black" }}></td>
                        <td style={{ width: "25%", border: "1px solid black" }}></td>
                      </tr>
                      <tr>
                        <td style={{ width: "7%", border: "1px solid black" }}></td>
                        <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>Total Basic</td>
                        <td style={{ border: "1px solid black" }}></td>
                        <td style={{ border: "1px solid black" }}></td>
                        <td style={{ border: "1px solid black" }}></td>
                        <td style={{ border: "1px solid black" }}>{user.basic_total}</td>
                      </tr>
                      <tr>
                        <td style={{ width: "7%", border: "1px solid black" }}></td>
                        <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>
                          C.GST {!user.show_igst ? `${user.cgst_rate}%` : ""}
                        </td>
                        <td style={{ width: "20%", border: "1px solid black" }}></td>
                        <td style={{ width: "10%", border: "1px solid black" }}></td>
                        <td style={{ width: "15%", border: "1px solid black" }}></td>
                        <td style={{ width: "25%", border: "1px solid black" }}>{user.cgst}</td>
                      </tr>
                      <tr>
                        <td style={{ width: "5%", border: "1px solid black" }}></td>
                        <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>
                          S.GST {!user.show_igst ? `${user.sgst_rate}%` : ""}
                        </td>
                        <td style={{ width: "20%", border: "1px solid black" }}></td>
                        <td style={{ width: "10%", border: "1px solid black" }}></td>
                        <td style={{ width: "15%", border: "1px solid black" }}></td>
                        <td style={{ width: "25%", border: "1px solid black" }}>{user.sgst}</td>
                      </tr>
                      <tr>
                        <td style={{ width: "5%", border: "1px solid black" }}></td>
                        <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>
                          I.GST {user.show_igst ? `${user.igst_rate}%` : ""}
                        </td>
                        <td style={{ width: "20%", border: "1px solid black" }}></td>
                        <td style={{ width: "10%", border: "1px solid black" }}></td>
                        <td style={{ width: "15%", border: "1px solid black" }}></td>
                        <td style={{ width: "25%", border: "1px solid black" }}>{user.igst}</td>
                      </tr>
                      <tr>
                        <td style={{ width: "5%", border: "1px solid black" }}></td>
                        <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>Round Off</td>
                        <td style={{ width: "20%", border: "1px solid black" }}></td>
                        <td style={{ width: "10%", border: "1px solid black" }}></td>
                        <td style={{ width: "15%", border: "1px solid black" }}></td>
                        <td style={{ width: "25%", border: "1px solid black" }}>0</td>
                      </tr>
                      <tr>
                        <td style={{ width: "5%", border: "1px solid black" }}></td>
                        <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>Grand Total</td>
                        <td style={{ width: "20%", border: "1px solid black" }}></td>
                        <td style={{ width: "10%", border: "1px solid black" }}></td>
                        <td style={{ width: "15%", border: "1px solid black" }}></td>
                        <td style={{ width: "25%", border: "1px solid black" }}>{user.grand_total}</td>
                      </tr>
                      {user.advance < 0 ? (
                        <tr>
                          <td style={{ width: "5%", border: "1px solid black" }}></td>
                          <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>Previous Invoice Balance</td>
                          <td style={{ width: "20%", border: "1px solid black" }}></td>
                          <td style={{ width: "10%", border: "1px solid black" }}></td>
                          <td style={{ width: "15%", border: "1px solid black" }}></td>
                          <td style={{ width: "25%", border: "1px solid black" }}>{Math.abs(user.advance)}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td style={{ width: "5%", border: "1px solid black" }}></td>
                          <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>Advance</td>
                          <td style={{ width: "20%", border: "1px solid black" }}></td>
                          <td style={{ width: "10%", border: "1px solid black" }}></td>
                          <td style={{ width: "15%", border: "1px solid black" }}></td>
                          <td style={{ width: "25%", border: "1px solid black" }}>{user.advance}</td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ width: "5%", border: "1px solid black" }}></td>
                        <td style={{ width: "30%", textAlign: "right", border: "1px solid black" }}>Net Total</td>
                        <td style={{ width: "20%", border: "1px solid black" }}></td>
                        <td style={{ width: "10%", border: "1px solid black" }}></td>
                        <td style={{ width: "15%", border: "1px solid black" }}></td>
                        <td style={{ width: "25%", border: "1px solid black" }}>{user.net_total}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Footer Table */}
                  <table
                    class="table table-responsive-sm table-bordered table-striped table-sm"
                    style={{ width: "90%" }}
                  >
                    <tr>
                      <td>
                        <p style={{ fontSize: 15 }}>
                          {" "}
                          1) The item which is despatched to you directly or
                          through a third party, the company reserves the right
                          to take back the item against any delay/non payment.
                        </p>
                        <p style={{ fontSize: 17, position: "absolute" }}>
                          <b>Subject to Pune Jurisdiction Only</b>
                          <br />
                          Received the above items in good condition.
                        </p>
                        <br />
                        <br />
                        <br />
                        <p style={{ fontSize: 17, position: "absolute" }}>
                          Receivers Signature And Stamp :
                          __________________________________
                        </p>
                      </td>

                      <td colspan="2">
                        <center>
                          <p style={{ fontSize: 27 }}>
                            For <b>Static Electricals Pune</b>
                          </p>
                          <br />
                          <br />
                          <br />
                          <br /> <br />
                          <br />
                          <p style={{ fontSize: 20 }}>Authorised Signatory</p>
                        </center>{" "}
                      </td>
                    </tr>{" "}
                  </table>
                </div>

                <br />
                <br />
                <Grid
                  container
                  spacing={-101}
                  sx={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginLeft: "21rem",
                  }}
                >
                  <Grid item xs={9} sm={3}>
                    <Button
                      variant="contained"
                      sx={{
                        background: "#00d284",
                        "&:hover": {
                          background: "#00d284", // Set the same color as the default background
                        },
                      }}
                      onClick={addNewInvoice}
                      type="submit"
                      disabled={isLoading}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item xs={9} sm={3}>
                    <Link to="/newinvoice" style={{ textDecoration: "none" }}>
                      <Button
                        variant="contained"
                        onClick={handledelete}
                        sx={{
                          background: "#ff0854",
                          "&:hover": {
                            background: "#ff0854", // Set the same color as the default background
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
                <br />
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default AddInvoice;