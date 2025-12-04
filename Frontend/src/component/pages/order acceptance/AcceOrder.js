import React, { useEffect, useState } from "react";
import "./order.css";
import { Grid, Paper } from "@mui/material";
import TextField from "@mui/material/TextField";
import { v4 as uuidv4 } from "uuid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";
import ClearIcon from '@mui/icons-material/Clear';
import { set } from "date-fns";

const AddCustomers = () => {
  const [data, setData] = useState({
    qid: "",
    orderacc_date: new Date(),
    consignor: "",
    consignee: "",
    ref_no: "",
    consumer: "",
    testing_div: "",
    consumer_address: "",
    type: "",
    quantity: "",
    advance: "",
    fileflag: "",
    ponum: "",
    OAcomment: "",
    podate: "",
    basicrate: "",
    poDate: "",
    gstno: "",
  });
  const [button, setButton] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("qid");
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    setButton(true)
    try {
      const response = await fetch(`${APP_BASE_PATH}/getQuotDetail/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      const { custname, type, address, qty, uid, cost, gstno, comment } = data;

      setData((prevData) => ({
        ...prevData,
        type: +type,
        address,
        custname,
        quantity: qty,
        basicrate: cost,
        uid,
        gstno,
        comment
      }));

      console.log("UID:", uid);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally, you can show an error message to the user here
    } finally {
      setIsLoading(false);
      setButton(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    console.log(`Setting ${name} to: ${value}`);
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFile = (e) => {
    setData({ ...data, [e.target.name]: e.target.files });
  };
  // const handleDate = (e) => {
  //   setData({ ...data, podate: e.$d });
  // };
  const handleDate = (e) => {
    setData({ ...data, podate: e ? e.$d : null });
  };

  const handleClearDate = () => {
    setData({ ...data, podate: null });
  };


  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const scales = ["", "Thousand", "Lakh", "Crore"];

  function convertLessThanOneThousand(num) {
    let words = "";

    if (num % 100 < 20 && num % 100 > 10) {
      words = teens[(num % 10) - 1];
      num = Math.floor(num / 100);
    } else {
      if (num % 10 > 0) {
        words = units[num % 10];
      }
      num = Math.floor(num / 10);

      if (num % 10 > 0) {
        words = tens[num % 10] + " " + words;
      }
      num = Math.floor(num / 10);
    }

    if (num > 0) {
      words = units[num] + " Hundred " + words;
    }

    return words.trim();
  }
  function NumberToWords(num) {
    if (num === 0) {
      return "Zero";
    }

    let words = "";
    let scaleIndex = 0;
    let chunkCount = 0;

    while (num > 0) {
      let chunk;
      if (chunkCount === 0) {
        // Handle the first chunk (last three digits)
        chunk = num % 1000;
        num = Math.floor(num / 1000);
      } else {
        // Handle subsequent chunks (two digits at a time for Indian numbering system)
        chunk = num % 100;
        num = Math.floor(num / 100);
      }

      if (chunk !== 0) {
        let chunkWords = convertLessThanOneThousand(chunk);
        words =
          chunkWords +
          (scaleIndex > 0 ? " " + scales[scaleIndex] + " " : " ") +
          words;
      }

      chunkCount++;
      scaleIndex++;
    }

    return words.trim();
  }

  // const addOrderAccp = async (e) => {
  //   e.preventDefault();

  //   const {
  //     orderacc_date,
  //     consignor,
  //     consignee,
  //     consumer,
  //     testing_div,
  //     consumer_address,
  //     type,
  //     quantity,
  //     advance,
  //     fileflag,
  //     ponum,
  //     podate,
  //     basicrate,
  //     poFile,
  //     uid,
  //   } = data;
  //   if (!orderacc_date||

  //     !consumer_address||
  //     !type||
  //     !quantity||
  //     !advance

  //     ){
  //       Swal.fire({
  //         title: "Please fill all the required fields!",
  //         icon: "error",
  //         iconHtml: "",
  //         confirmButtonText: "OK",
  //         animation: "true",
  //         confirmButtonColor: "red",
  //       });
  //       return;
  //   }else{

  //   const quot = await fetch(`${APP_BASE_PATH}/getAcceptanceNumber/${uid}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(function (response) {
  //       return response?.json();
  //     })
  //     .then(async (resp) => {
  //       const res = await fetch(`${APP_BASE_PATH}/addorderacc`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           qid: id,
  //           orderacc_date,
  //           consignor,
  //           consignee,
  //           ref_no: resp.refNo,
  //           consumer,
  //           testing_div: +testing_div,
  //           consumer_address,
  //           type: +type,
  //           quantity,
  //           advance,
  //           fileflag,
  //           ponum,
  //           podate,
  //           basicrate,
  //           ostatus: 1,
  //         }),
  //       })
  //         .then(function (response) {
  //           return response?.json();
  //         })
  //         .then(async (resp) => {
  //           Swal.fire({
  //             title: "Data Added Successfully",
  //             icon: "success",
  //             iconHtml: "",
  //             confirmButtonText: "OK",
  //             animation: "true",
  //             confirmButtonColor: "green",
  //           });
  //           if (poFile?.length) {
  //             const formData = new FormData();
  //             const fileName = `${Date.now()}-${resp.insertId}-${
  //               poFile[0].name
  //             }`;
  //             formData.append("file", poFile[0], fileName);
  //             formData.append("poid", resp.insertId);
  //             formData.append("fileName", fileName);
  //             fetch(`${APP_BASE_PATH}/upload`, {
  //               method: "POST",
  //               body: formData,
  //             })
  //               .then((response) => response.json())
  //               .then((result) => {
  //                 navigate("/orderAcceptance");
  //               })
  //               .catch((error) => {
  //                 console.error("Error:", error);
  //               });
  //           } else {
  //             navigate("/orderAcceptance");
  //           }
  //         });
  //     });
  // };
  // }
  const addOrderAccp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setButton(true);
    const {
      orderacc_date,
      consignor,
      consignee,
      consumer,
      testing_div,
      consumer_address,
      type,
      quantity,
      advance,
      fileflag,
      ponum,
      OAcomment,
      podate,
      basicrate,
      poFile,
      uid,
      gstno,
    } = data;

    if (!orderacc_date || !type || !quantity || !advance) {
      Swal.fire({
        title: "Please fill all the required fields!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
      setIsLoading(false);
      setButton(false);
      return;
    }

    try {
      // Fetch the acceptance number
      const response = await fetch(
        `${APP_BASE_PATH}/getAcceptanceNumber/${uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch acceptance number");
      }

      const resp = await response.json();

      // Add the order acceptance
      const addOrderResponse = await fetch(`${APP_BASE_PATH}/addorderacc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qid: id,
          orderacc_date,
          consignor,
          consignee,
          ref_no: resp.refNo,
          consumer,
          testing_div: +testing_div,
          consumer_address,
          type: +type,
          quantity,
          advance,
          fileflag,
          ponum,
          OAcomment,
          podate,
          basicrate,
          ostatus: 1,
          gstno,
        }),
      });

      if (!addOrderResponse.ok) {
        throw new Error("Failed to add order acceptance");
      }

      const addOrderResp = await addOrderResponse.json();

      Swal.fire({
        title: "Data Added Successfully",
        icon: "success",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "green",
      });

      // Handle file upload if necessary
      if (poFile?.length) {
        const formData = new FormData();
        const fileName = `${Date.now()}-${addOrderResp.insertId}-${poFile[0].name
          }`;
        formData.append("file", poFile[0], fileName);
        formData.append("poid", addOrderResp.insertId);
        formData.append("fileName", fileName);

        const uploadResponse = await fetch(`${APP_BASE_PATH}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        await uploadResponse.json();
      }

      navigate("/orderAcceptance");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "error",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: "true",
        confirmButtonColor: "red",
      });
    } finally {
      setIsLoading(false);
      setButton(false);
    }
  };

  const changeName = () => {
    setData((prevData) => ({
      ...prevData,
      consumer_address: prevData.address, // Corrected property name
      consumer: prevData.custname, // Corrected property name
    }));
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
              <h4>Accept Order</h4>
            </div>
            <Link to="/newOrderAcceptance" style={{ textDecoration: "none" }}>
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

          <Paper elevation={10} style={{ marginTop: -11 }}>
            <Box
              sx={{
                marginTop: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "95%",

                marginLeft: "2rem",
              }}
            >
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="customer"
                      label="Customer Name Mr./Miss/Mrs"
                      labelprope
                      name="customer"
                      value={data.custname}
                      onChange={handleInputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      multiline
                      id="contactPerson"
                      label="Address"
                      name="address"
                      value={data.address}
                      onChange={handleInputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="gstno"
                      label="GST No"
                      name="gstno"
                      value={data.gstno}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="comment"
                      label="Enquiry Comment"
                      name="comment"
                      value={data.comment}
                      disabled
                    />
                  </Grid>
                </Grid>

                <br />
                <Button
                  variant="contained"
                  onClick={changeName}
                  sx={{
                    background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },
                  }}
                >
                  Same As Above
                </Button>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="consumer"
                      label="Consumer Name"
                      name="consumer"
                      value={data.consumer}
                      onChange={handleInputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                  </Grid>
                  {/* <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="consumer_address"
                      label="Address"
                      name="consumer_address"
                      value={data.consumer_address}
                      onChange={handleInputs}
                      multiline
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid> */}
                  {/* <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="consumer_address"
                      label="Address"
                      name="consumer_address"
                      value={data.consumer_address}
                      onChange={(e) => {
                        // Count number of lines
                        const lines = e.target.value.split("\n");
                        if (lines.length <= 3) {
                          handleInputs(e); // Only update if ≤ 3 lines
                        }
                      }}
                      multiline
                      rows={3} // Fix height to 3 rows
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid> */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="consumer_address"
                      label="Address"
                      name="consumer_address"
                      value={data.consumer_address}
                      onChange={(e) => {
                        let lines = e.target.value.split("\n");

                        // Limit to max 3 lines
                        if (lines.length > 3) {
                          lines = lines.slice(0, 3);
                        }

                        // Limit each line to 50 characters
                        lines = lines.map(line => line.slice(0, 50));

                        // Send trimmed value to handler
                        handleInputs({
                          target: { name: e.target.name, value: lines.join("\n") }
                        });
                      }}
                      multiline
                      minRows={3}
                      maxRows={3} // Keep height fixed
                      helperText="Maximum 3 lines allowed, with up to 50 characters per line."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      FormHelperTextProps={{
                        style: { color: "red" }, // 🔴 red helper text
                      }}
                      inputProps={{
                        maxLength: 153, // safeguard (3 lines × ~51 incl. newline)
                      }}
                    />
                  </Grid>



                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="testing_div"
                      label="Testing Div (Optional)"
                      name="testing_div"
                      value={data.testing_div}
                      onChange={handleInputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth style={{ textAlign: "left" }}>
                      <InputLabel id="demo-select-small">Type</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="type"
                        name="type"
                        label="Type"
                        value={data.type}
                        onChange={(e) => handleInputs(e)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        defaultValue={data.type}
                      >
                        <MenuItem value={1}>OUTDOOR</MenuItem>
                        <MenuItem value={2}>INDOOR</MenuItem>
                        <MenuItem value={3}>OUTDOOR-INDOOR</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="quantity"
                      label="Quantity"
                      name="quantity"
                      value={data.quantity}
                      onChange={handleInputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="advance"
                      label="Advance Rs."
                      name="advance"
                      value={data.advance}
                      onChange={handleInputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                    <div>
                      Amount in words: {NumberToWords(Number(data.advance))}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="ponum"
                      label="P O No (Optional)"
                      name="ponum"
                      value={data.ponum}
                      onChange={handleInputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      multiline
                      id="OAcomment"
                      label="OA Comment (Optional)"
                      name="OAcomment"
                      value={data.OAcomment}
                      onChange={(e) => {
                        let lines = e.target.value.split("\n");

                        // Limit to max 4 lines
                        if (lines.length > 5) {
                          lines = lines.slice(0, 5);
                        }

                        // Limit each line to 30 characters
                        lines = lines.map(line => line.slice(0, 30));

                        handleInputs({
                          target: {
                            name: "OAcomment",
                            value: lines.join("\n")
                          }
                        });
                      }}
                      minRows={5}
                      maxRows={5}
                      helperText="Maximum 5 lines allowed, with up to 30 characters per line."
                      FormHelperTextProps={{
                        style: { color: "red" },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        maxLength: 154, // 30 * 4 + 3 newlines = safeguard
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        defaultValue={dayjs(new Date())}
                        label="PO Date"
                        name="qdate"
                        onChange={handleDate}
                        format="DD-MM-YYYY"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        sx={{
                          width: "100%", // Set the width to 100%
                        }}
                        slotProps={{
                          field: {
                            clearable: true,
                            onClear: handleClearDate
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid> */}
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={null}  // Changed from defaultValue to value with null
                        label="P O Date"
                        name="qdate"
                        onChange={handleDate}
                        format="DD-MM-YYYY"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        sx={{
                          width: "100%",
                        }}
                        slotProps={{
                          field: {
                            clearable: true,
                            onClear: handleClearDate
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      id="basicrate"
                      label="Basic Rate (Optional)"
                      name="basicrate"
                      value={data.basicrate}
                      onChange={handleInputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      style={{ width: "100%", height: "3rem" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" component="label">
                      PO File
                      <input
                        style={{
                          position: "relative",
                          left: 20,
                          width: "38vw",
                          height: "3rem",
                        }}
                        accept="image/*"
                        multiple
                        type="file"
                        name="poFile"
                        onChange={handleFile}
                      />
                    </Button>
                  </Grid>
                </Grid>

                <br />
                <Grid
                  container
                  spacing={-90}
                  sx={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    marginLeft: "21rem",
                  }}
                >
                  <Grid item xs={8} sm={4}>
                    <Button
                      variant="contained"
                      onClick={addOrderAccp}
                      type="submit"
                      sx={{
                        background: "#00cff4",
                        "&:hover": {
                          background: "#00cff4", // Set the same color as the default background
                        },
                      }}
                      disabled={button}
                    >
                      Accept
                    </Button>
                  </Grid>
                  <Grid item xs={8} sm={4}>
                    <Link
                      to="/newOrderAcceptance"
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          background: "#ff0854",
                          "&:hover": {
                            background: "#ff0854", // Set the same color as the default background
                          },
                        }}
                      >
                        Close
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

export default AddCustomers;
