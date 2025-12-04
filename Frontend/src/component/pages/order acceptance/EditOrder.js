import React from "react";
import { useState, useEffect } from "react";
import "./order.css";
import { v4 as uuidv4 } from "uuid";
import { Grid, Paper, InputAdornment, IconButton } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, NavLink } from "react-router-dom";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { APP_BASE_PATH } from "Host/endpoint";
import { useRef } from "react";
import { set } from "date-fns";

const EditOrder = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    ostatus: "",
    custname: "",
    consumer_address: "",
    address: "",
    testing_div: "",
    type: "",
    quantity: "",
    advance: "",
    ponum: "",
    OAcomment: "",
    podate: "",
    basicrate: "",
    gstno: "",
  });
  const [button, setButton] = useState(false);
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqData = await fetch(`${APP_BASE_PATH}/editOrder/${id}`);
        const resData = await reqData.json();
        console.log(resData);
        setData(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = (e) => {
    if (e.target.name === "type") {
      setData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (data.fileflag) {
      setSelectedFile(data.fileflag); // Set the selected file based on data.fileflag
    }
  }, [data.fileflag]);

  const handleFile = (e) => {
    const file = e.target.files[0].name;
    setData({ ...data, poFile: file });
    setSelectedFile(file);
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

  const handleSubmit = async (e) => {
    setButton(true);
    e.preventDefault();
    const {
      ostatus,
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
      gstno,
    } = data;

    const editInputvalue = {
      id,
      ostatus,
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
      gstno,
    };

    try {
      const res = await fetch(`${APP_BASE_PATH}/updateOrderAcceptance/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editInputvalue),
      });
      setButton(false);

      const resjson = await res.json();
      if (res.status === 400 || !resjson) {
        Swal.fire({
          title: "Please Fill Data!!!!",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "red",
        });
      } else {
        Swal.fire({
          title: "Data Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        }).then(() => {
          navigate("/orderAcceptance"); // Redirect to the order acceptance page
        });
      }
    } catch {
      setButton(false);
      Swal.fire({
        title: "Data Updated Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
      if (data.poFile) {
        const formData = new FormData();

        const fileName = `${Date.now()}-${id}-${data.poFile || "unknown"}`;
        formData.append("file", data.poFile);
        formData.append("poid", id);
        formData.append("fileName", fileName);

        fetch(`${APP_BASE_PATH}/upload`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            navigate(-1);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        navigate(-1);
      }
    }
    finally {
      setButton(false);
    }
  };

  const onClose = () => {
    navigate(-1);
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

  return (
    <>
      <div class="d-flex justify-content-between">
        <div className="page_header">
          <h4>Update Order</h4>
        </div>
        <Link to="/orderAcceptance" style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ background: "#28a745" }}>
            Back
          </Button>
        </Link>
      </div>

      <Paper elevation={10}>
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl style={{ width: "100%" }}>
                  <InputLabel id="demo-select-small">Status</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    label="Status"
                    placeholder="Status"
                    name="ostatus"
                    value={data.ostatus}
                    onChange={handleEdit}
                  >
                    <MenuItem value={1}>Accept</MenuItem>
                    <MenuItem value={2}>Cancel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: "100%" }}
                  fullWidth
                  label="Customer Name"
                  id="customer"
                  name="custname"
                  value={data.custname}
                  onChange={handleEdit}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: "100%" }}
                  label="Address"
                  id="contactPerson"
                  name="consumer_address"
                  value={data.address}
                  onChange={handleEdit}
                  disabled
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <TextField
                  style={{ width: "100%" }}
                  label="Address"
                  id="contactPerson"
                  name="consumer_address"
                  value={data.address}
                  onChange={handleEdit}
                  disabled
                  multiline
                  minRows={3}
                  maxRows={3}
                // helperText="Maximum 3 lines allowed, with up to 50 characters per line."
                // FormHelperTextProps={{
                //   style: { color: "red" }, // 🔴 red helper text
                // }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="gstno"
                  label="GST No"
                  name="gstno"
                  value={data.gstno}
                  disabled
                />
              </Grid>
            </Grid>
            <br />
            <Button variant="contained" sx={{ background: "#28a745" }}>
              Same As Above
            </Button>
            <br />
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  id="consumer"
                  name="consumer"
                  value={data.consumer}
                  onChange={handleEdit}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  id="consumer_address"
                  name="consumer_address"
                  value={data.consumer_address}
                  onChange={handleEdit}
                   multiline
                />
              </Grid> */}
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  id="consumer_address"
                  name="consumer_address"
                  value={data.consumer_address}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n");
                    if (lines.length <= 3) {
                      handleEdit(e); // Allow only if 3 or fewer lines
                    }
                  }}
                  multiline
                  rows={3} // Keeps field visually 3 lines high
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  id="consumer_address"
                  name="consumer_address"
                  value={data.consumer_address}
                  onChange={(e) => {
                    let lines = e.target.value.split("\n");

                    // Limit lines to 3
                    if (lines.length > 3) {
                      lines = lines.slice(0, 3);
                    }

                    // Limit each line to 50 characters
                    lines = lines.map(line => line.slice(0, 50));

                    // Update value
                    handleEdit({
                      target: { name: e.target.name, value: lines.join("\n") }
                    });
                  }}
                  multiline
                  minRows={3}
                  maxRows={3} // Fix height to 3 lines
                  helperText="Maximum 3 lines allowed, with up to 50 characters per line."
                  FormHelperTextProps={{
                    style: { color: "red" }, // 🔴 red helper text
                  }}
                  inputProps={{
                    maxLength: 153, // safeguard (3 × ~51 incl. newline)
                  }}
                />
              </Grid>


            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Testing Div (Optional)"
                  id="testing_div"
                  name="testing_div"
                  value={data.testing_div}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl style={{ width: "100%" }}>
                  <InputLabel id="demo-select-small">Type</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="type"
                    name="type"
                    label="Type"
                    value={data.type}
                    onChange={handleEdit} // Pass the entire event object here
                    defaultValue={data.type}

                  >
                    <MenuItem value={1}>OUTDOOR</MenuItem>
                    <MenuItem value={2}>INDOOR</MenuItem>
                    <MenuItem value={3}>OUTDOOR/INDOOR</MenuItem>

                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  z
                  id="quantity"
                  name="quantity"
                  value={data.quantity}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Advance Rs."
                  id="advance"
                  name="advance"
                  value={data.advance}
                  onChange={handleEdit}
                />
                <div>
                  Amount in words: {NumberToWords(Number(data.advance))}
                </div>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="ponum"
                  label="P O No (Optional)"
                  name="ponum"
                  value={data.ponum}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  id="OAcomment"
                  label="OA comment (Optional)"
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

                    handleEdit({
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
              <Grid className="date-pick-wrp" item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="P O Date"
                    name="qdate"
                    value={data.podate ? dayjs(data.podate) : null}
                    onChange={handleDate}
                    format="DD/MM/YYYY"
                    slotProps={{
                      field: {
                        clearable: true,
                        onClear: handleClearDate
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="basicrate"
                  label="Basic Rate (Optional)"
                  name="basicrate"
                  value={data.basicrate}
                  onChange={handleEdit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TextField
                    fullWidth
                    label="P O File"
                    value={selectedFile || "No file is selected"}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={1} sx={6}>
              <Grid style={{ paddingLeft: "20%" }} sx={12}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="success"
                    type="submit"
                    style={{ marginRight: "12px", background: "#28a745" }}
                    disabled={button}
                  >
                    Update
                  </Button>

                  <NavLink to="/orderAcceptance">
                    {" "}
                    <Button onClick={onClose} variant="contained" color="error">
                      Close
                    </Button>
                  </NavLink>

                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginLeft: "12px", background: "#28a745" }}
                    onClick={() => inputRef.current.click()}
                  >
                    Edit PO File
                  </Button>
                  <input
                    style={{ display: "none" }}
                    accept="image/*"
                    multiple
                    type="file"
                    name="poFile"
                    onChange={handleFile}
                    ref={inputRef}
                  />
                </div>
              </Grid>
            </Grid>
            <br />
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default EditOrder;
