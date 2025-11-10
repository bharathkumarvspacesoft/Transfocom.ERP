import * as React from "react";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import "./quotation.css";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";
import { set } from "date-fns";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

const StyledInputElement = styled("input")(
  ({ theme }) => `
  width: 320px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};


  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[500]};
    
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const StyledTextareaElement = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 810px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 3  ;
  padding: 12px;
  border-radius: 5px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[500]};
  

  &:hover {
    border-color:black;
  }

  &:focus {
    border-color: ${blue[500]};
    
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
// const scales = ['', 'Thousand', 'Lakh', 'Crore'];
// const words = [
//   'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
//   'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
// ];
// const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

// function convertLessThanOneThousand(num) {
//   if (num === 0) {
//     return '';
//   } else if (num < 20) {
//     return words[num] + ' ';
//   } else if (num < 100) {
//     return tens[Math.floor(num / 10)] + ' ' + convertLessThanOneThousand(num % 10);
//   } else {
//     return words[Math.floor(num / 100)] + ' Hundred ' + convertLessThanOneThousand(num % 100);
//   }
// }

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
// Outputs: "One Thousand Two Hundred"

const NewQuotation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [parameters, setParameters] = useState({});
  const [button, setButton] = useState(false);
  const [data, setData] = useState({
    custname: "",
    quotref: "",
    qdate: new Date(),
    cost: "",
    qty: "",
    deliveryperiod: "",
    guranteeperiod: 60,
    validityofquote: "",
    taxes: {
      cgst: 9,
      sgst: 9,
      cgsttype: "Inclusive",
      sgsttype: "Inclusive",
    },
    termscondition: "",
    rversion: "",
    transport: "Inclusive",
    unloading: "Done By Purchaser",
    temppayment: "Temp-1",
    tempinsp: "HT",
    tempgurantee: "HT",
    guranteetext: "",
    inspectiondesc: "",
    paymentdesc: "",
    deliverydesc: "",
    validityterms: "",
    tempdelivery: "Temp-1",
    quot_serial: "90012",
    desDate: new Date(),
  });

  const { id } = useParams();
  const handleGuaranteePeriodChange = (event) => {
    const value = event.target.value;
    handleEdit(event);
  };
  // const fetchData = async () => {
  //   const res = await fetch(`${APP_BASE_PATH}/editenq/${id}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(function (response) {
  //       return response?.json();
  //     })
  //     .then(function (data) {
  //       console.log(data)
  //       setData((prevData) => ({ ...prevData, custname: data.custname }));
  //     });
  //     const url = `${APP_BASE_PATH}/getQuotNumber/${data?.[0]?.uid}`;
  //     console.log("Request URL:", url);

  //     const quot = await fetch(url, {

  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(function (response) {
  //       return response?.json();
  //     })
  //     .then(function (data) {
  //       setData((prevData) => ({
  //         ...prevData,
  //         quotref: data.quotNo,
  //         quot_serial: data.quotNo?.split("/")[3],

  //       }));
  //     });

  //   const quotParameter = await fetch(`${APP_BASE_PATH}/getQuotParameter`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(function (response) {
  //       return response?.json();
  //     })
  //     .then(function (data) {
  //       const { pay_temp1, ghtterms, insp_temp1, delivery_temp1 } = data;
  //       setParameters(data);
  //       setData((prevData) => ({
  //         ...prevData,
  //         guranteetext: ghtterms,
  //         inspectiondesc: insp_temp1,
  //         paymentdesc: pay_temp1,
  //         deliverydesc: delivery_temp1,
  //       }));
  //     });
  // };
  // useEffect(() => {
  //   fetchData(data);
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setButton(true);
      try {
        const firstFetch = await fetch(`${APP_BASE_PATH}/editenq/${id}`);
        const dataFromFirstFetch = await firstFetch.json();

        // Update data with the fetched data
        setData((prevData) => ({
          ...prevData,
          custname: dataFromFirstFetch.custname,
        }));

        const quotUrl = `${APP_BASE_PATH}/getQuotNumber/${dataFromFirstFetch.uid}`;
        console.log("Request URL:", quotUrl);

        const quotFetch = await fetch(quotUrl);
        const quotData = await quotFetch.json();

        setData((prevData) => ({
          ...prevData,
          quotref: quotData.quotNo,
          quot_serial: quotData.quotNo?.split("/")[3],
        }));

        const quotParameter = await fetch(`${APP_BASE_PATH}/getQuotParameter`);
        const parameterData = await quotParameter.json();

        const {
          pay_temp1,
          ghtterms,
          insp_temp1,
          delivery_temp1,
          validityterms,
        } = parameterData;

        setParameters(parameterData);

        setData((prevData) => ({
          ...prevData,
          guranteetext: ghtterms,
          inspectiondesc: insp_temp1,
          paymentdesc: pay_temp1,
          deliverydesc: delivery_temp1,
          validityterms: validityterms,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setButton(false);
      }
    };

    fetchData();
  }, [id]);

  //   const [totalcost,setTotal]=useState('')
  //   const costPerUnit = data.cost || 0; // Default to 0 if data.cost is null or undefined
  // const quantity = data.qty || 0; // Default to 0 if data.qty is null or undefined

  // // Calculate the total cost
  // const sum = costPerUnit * quantity;
  //   setTotal(sum)
  const handleEdit = (e) => {
    if (!e) {
      return;
    }
    setData({
      ...data,
      ...(e.target.name === "temppayment"
        ? { paymentdesc: paymentMap[e.target.value] }
        : e.target.name === "tempinsp"
          ? { inspectiondesc: inspectionMap[e.target.value] }
          : e.target.name === "tempgurantee"
            ? { guranteetext: guaranteeMap[e.target.value] }
            : {}),
      [e.target.name]: e.target.value,
    });
  };

  const handleDate = (e) => {
    setData({ ...data, qdate: e.$d });
  };
  const handleDate1 = (e) => {
    setData({ ...data, desDate: e.$d });
  };

  const handleTaxes = (value, key) => {
    setData((data) => ({ ...data, taxes: { ...data.taxes, [key]: value } }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setButton(true);
    e.preventDefault();
    const { cost, qty, deliveryperiod, guranteeperiod, validityofquote } = data;
    if (
      !cost ||
      !qty ||
      !deliveryperiod ||
      !guranteeperiod ||
      !validityofquote
    ) {
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
    } else {
      const editInputvalue = {
        eid: id,
        uid: data.uid,
        status: "New",
        ...data,
      };

      try {
        const res = await fetch(`${APP_BASE_PATH}/addQuotation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editInputvalue),
        });

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
            title: "Quotation Added Successfully",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "green",
          });
          navigate("/quotation");
        }
      } catch {
        Swal.fire({
          title: "Quotation Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });
        navigate("/quotation");
      } finally {
        setIsLoading(false);
        setButton(false);
      }
    }
  };
  const {
    pay_temp1,
    pay_temp2,
    pay_temp3,
    insp_temp1,
    insp_temp2,
    insp_temp3,
    ghtterms,
    gltterms,
    gspecial,
    validityterms,
  } = parameters || {};
  const paymentMap = {
    "Temp-1": pay_temp1,
    "Temp-2": pay_temp2,
    "Temp-3": pay_temp3,
  };

  const inspectionMap = {
    HT: insp_temp1,
    LT: insp_temp2,
    "Temp-3": insp_temp3,
  };

  const guaranteeMap = {
    HT: ghtterms,
    LT: gltterms,
    SPECIAL: gspecial,
  };
  const [totalcost, setTotal] = useState("");
  console.log(totalcost);
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
              <h4>Add Quotation</h4>
            </div>
            <Link to="/AddQuotation">
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
          <Paper style={{ marginTop: 1 }}>
            <div class="d-flex">
              <div class="mr-auto p-2" className="page_header">
                <Typography
                  variant="h6"
                  gutterBottom
                  autoComplete="custname"
                  onChange={handleEdit}
                  style={{ marginLeft: 171, position: "relative", top: 50 }}
                >
                  Enquiry Customer Name: {data.custname}
                </Typography>
              </div>
            </div>

            <Box sx={{ flexGrow: 1 }}>
              <Grid
                container
                spacing={2}
                columns={12}
                style={{
                  marginTop: 50,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    id="quotref"
                    label="Quotation Ref"
                    name="quotref"
                    autoComplete="quotref"
                    value={data.quotref}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                  />
                </Grid>

                <Grid
                  className="date-pick-wrp"
                  item
                  xs={4}
                  style={{ marginTop: 5, marginLeft: 1 }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      defaultValue={dayjs(new Date())}
                      label="Date"
                      name="qdate"
                      onChange={handleDate}
                      format="DD-MM-YYYY"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                {/* <Grid item xs={4} style={{ marginTop: 5 }}>
            <TextField
        fullWidth
        label="Cost In Rs Per Transformer Without GST"
        id="cost"
        name="cost"
        autoComplete="cost"
        value={data.cost}
        type="number"
        onChange={handleEdit}
        required
      />
      <div>Amount in words: {NumberToWords(Number(data.cost))}</div>

            </Grid> */}
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    label="Cost In Rs Per Transformer Without GST"
                    id="cost"
                    name="cost"
                    autoComplete="cost"
                    value={data.cost}
                    onChange={handleEdit}
                    required
                  />
                  <div>Amount in words: {NumberToWords(Number(data.cost))}</div>
                </Grid>

                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="qty"
                    label="Quantity"
                    labelprope
                    name="qty"
                    autoComplete="qty"
                    value={data.qty}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="deliveryperiod"
                    label="Total Cost"
                    labelprope
                    name="deliveryperiod"
                    autoComplete="deliveryperiod"
                    value={data.cost * data.qty || 0}
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                  <div>
                    Amount in words:{" "}
                    {NumberToWords(Number(data.cost * data.qty))}
                  </div>
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="deliveryperiod"
                    label="Delivery Period (Days)"
                    labelprope
                    name="deliveryperiod"
                    autoComplete="deliveryperiod"
                    value={data.deliveryperiod}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <FormControl style={{ width: "31vw" }}>
                    <InputLabel id="demo-select-small">
                      Guarantee Period (Months)
                    </InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="rversion"
                      label="Guarantee Period (Months)"
                      name="guranteeperiod"
                      autoComplete="guranteeperiod"
                      value={data.guranteeperiod}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      style={{ textAlign: "left" }}
                    >
                      <MenuItem value={60}>60</MenuItem>
                      <MenuItem value={18}>18</MenuItem>
                      <MenuItem value={24}>24</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="validityofquote"
                    label="Validity (Days)"
                    labelprope
                    name="validityofquote"
                    autoComplete="validityofquote"
                    value={data.validityofquote}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <FormControl style={{ width: "31vw" }}>
                    <InputLabel id="demo-select-small">
                      Revise Version
                    </InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="rversion"
                      label="Revise Version"
                      name="rversion"
                      autoComplete="rversion"
                      value={data.rversion}
                      onChange={handleEdit}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      style={{ textAlign: "left" }}
                    >
                      <MenuItem value={"R1"}>R1</MenuItem>
                      <MenuItem value={"R2"}>R2</MenuItem>
                      <MenuItem value={"R3"}>R3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="unloading"
                    label="Unloading at Site"
                    labelprope
                    name="unloading"
                    autoComplete="unloading"
                    value={data.unloading}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5, marginLeft: 1 }}>
                  <TextField
                    fullWidth
                    id="customer"
                    label="Remark"
                    labelprope
                    name="termscondition"
                    autoComplete="remark"
                    value={data.termscondition}
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid
                  className="date-pick-wrp"
                  item
                  xs={4}
                  style={{ marginTop: 5, marginLeft: 1 }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      defaultValue={dayjs(new Date())}
                      label="Tnt Dispatch Date"
                      name="desDate"
                      // value={dayjs(new Date())||null}
                      onChange={handleDate1}
                      format="DD-MM-YYYY"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={8} style={{ marginTop: 8 }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    style={{ float: "left" }}
                    className="page_header"
                  >
                    Taxes:-
                  </Typography>
                  <br />
                  <br />

                  <div class="d-flex flex-row bd-highlight mb-3">
                    <div class="p-2 bd-highlight">
                      <TextField
                        id="outlined-basic"
                        label="CGST"
                        value={data.taxes["cgst"]}
                        variant="outlined"
                        onChange={({ target }) =>
                          handleTaxes(target.value, "cgst")
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      {"(%)"}
                    </div>

                    <div class="p-2 bd-highlight">
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={data.taxes["cgsttype"]}
                          onChange={({ target }) =>
                            handleTaxes(target.value, "cgsttype")
                          }
                        >
                          <FormControlLabel
                            value="Inclusive"
                            control={<Radio />}
                            label="Inclusive"
                          />
                          <FormControlLabel
                            value="Exclusive"
                            control={<Radio />}
                            label="Exclusive"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div class="d-flex flex-row bd-highlight mb-3">
                    <div class="p-2 bd-highlight">
                      <TextField
                        id="outlined-basic"
                        label="SGST"
                        value={data.taxes["sgst"]}
                        variant="outlined"
                        onChange={({ target }) =>
                          handleTaxes(target.value, "sgst")
                        }
                      />
                      {"(%)"}
                    </div>
                    <div class="p-2 bd-highlight">
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={data.taxes["sgsttype"]}
                          onChange={({ target }) =>
                            handleTaxes(target.value, "sgsttype")
                          }
                        >
                          <FormControlLabel
                            value="Inclusive"
                            control={<Radio />}
                            label="Inclusive"
                          />
                          <FormControlLabel
                            value="Exclusive"
                            control={<Radio />}
                            label="Exclusive"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>

                  <div
                    class="d-flex justify-content-between"
                    style={{
                      position: "relative",
                      bottom: 200,
                      marginLeft: 600,
                    }}
                  >
                    <FormControl>
                      <Typography
                        variant="h5"
                        component="h2"
                        style={{ float: "left" }}
                      >
                        Transportation:-
                      </Typography>
                      <RadioGroup
                        row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="transport"
                        onChange={handleEdit}
                        value={data.transport}
                      >
                        <FormControlLabel
                          value="Inclusive"
                          control={<Radio />}
                          label="Inclusive"
                        />
                        <FormControlLabel
                          value="Exclusive"
                          control={<Radio />}
                          label="Exclusive"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
              <div style={{ textAlign: "left", marginLeft: "250px" }}>
                <h1 style={{ fontSize: 20 }}> Schedule: B</h1>
                <h1 style={{ fontSize: 20 }}>
                  Commercial Terms And Conditions
                </h1>
              </div>

              <Box sx={{ width: "100%" }}>
                <br />
                <table
                  style={{
                    marginLeft: "40px",
                    marginRight: "40px",
                    width: "95%",
                    border: "1px solid black",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        width: "300px",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      <div class="input-group">
                        <span style={{ paddingRight: "10px" }}>Price</span>
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        textAlign: "left",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      <ul>
                        <li>
                          <label
                            for="floatingInput"
                            style={{ position: "relative", left: 0 }}
                          >
                            C.GST @ {data.taxes["cgst"]}%:-{" "}
                            {data.taxes["cgsttype"]}
                          </label>
                        </li>
                        <li>
                          <label
                            for="floatingInput"
                            style={{ position: "relative", left: 0 }}
                          >
                            S.GST @ {data.taxes["sgst"]}%:-{" "}
                            {data.taxes["sgsttype"]}
                          </label>
                        </li>
                        <li>
                          <label
                            for="floatingInput"
                            style={{ position: "relative", left: 0 }}
                          >
                            Transportation: - {data.transport}
                          </label>
                        </li>
                        <li>
                          <label
                            for="floatingInput"
                            style={{ position: "relative", left: 0 }}
                          >
                            Unloading at Site:-{data.unloading}
                          </label>
                        </li>
                        <li>
                          <label
                            for="floatingInput"
                            style={{ position: "relative", left: 0 }}
                          >
                            Prices are subject to IEEMA price variation clause
                          </label>
                          .
                        </li>
                      </ul>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ border: "1px solid black", width: "300px" }}>
                      <div class="input-group">
                        <span style={{ paddingRight: "10px" }}>
                          Delivery Period
                        </span>
                      </div>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <Box item xs={12} style={{ width: 700 }}>
                        <TextareaAutosize
                          style={{
                            width: "45rem",
                            margin: "5px",
                            marginLeft: "20px",
                          }}
                          fullWidth
                          value={data.deliverydesc?.replace(
                            "*",
                            data.deliveryperiod || "*"
                          )}
                          name="deliverydesc"
                          onChange={handleEdit}
                        />
                      </Box>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        width: "300px",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      <div class="input-group">
                        <span style={{ paddingRight: "10px" }}>Payment</span>
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          value={data.temppayment}
                          name="temppayment"
                          onChange={handleEdit}
                          sx={{ marginLeft: "45px" }}
                        >
                          <FormControlLabel
                            value="Temp-1"
                            control={<Radio />}
                            label="Temp-1"
                          />
                          <FormControlLabel
                            value="Temp-2"
                            control={<Radio />}
                            label="Temp-2"
                          />
                          <FormControlLabel
                            value="Temp-3"
                            control={<Radio />}
                            label="Temp-3"
                          />
                        </RadioGroup>
                        <Box item xs={12} style={{ width: 750 }}>
                          <TextareaAutosize
                            fullWidth
                            style={{
                              width: "45rem",
                              margin: "5px",
                              marginLeft: "23px",
                            }}
                            value={data.paymentdesc}
                            name="paymentdesc"
                            onChange={handleEdit}
                          />
                        </Box>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid black", width: "300px" }}>
                      <div class="input-group">
                        <span style={{ paddingRight: "10px" }}>Inspection</span>
                      </div>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <div
                        class="input-group"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="tempinsp"
                          onChange={handleEdit}
                          value={data.tempinsp}
                          sx={{ marginLeft: "45px" }}
                        >
                          <FormControlLabel
                            value="HT"
                            control={<Radio />}
                            label="HT"
                          />
                          <FormControlLabel
                            value="LT"
                            control={<Radio />}
                            label="LT"
                          />
                          <FormControlLabel
                            value="Temp-3"
                            control={<Radio />}
                            label="Temp-3"
                          />
                        </RadioGroup>
                        <Box item xs={12} style={{ width: 750 }}>
                          <TextareaAutosize
                            fullWidth
                            style={{
                              width: "45rem",
                              margin: "5px",
                              marginLeft: "23px",
                            }}
                            value={data.inspectiondesc}
                            name="inspectiondesc"
                            onChange={handleEdit}
                          />
                        </Box>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        width: "300px",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      <div class="input-group">
                        <span style={{ paddingRight: "10px" }}>Guarantee</span>
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      <div class="input-group">
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="tempgurantee"
                            onChange={handleEdit}
                            value={data.tempgurantee}
                            sx={{ marginLeft: "45px" }}
                          >
                            <FormControlLabel
                              value="HT"
                              control={<Radio />}
                              label="HT"
                            />
                            <FormControlLabel
                              value="LT"
                              control={<Radio />}
                              label="LT"
                            />
                            <FormControlLabel
                              value="SPECIAL"
                              control={<Radio />}
                              label="SPECIAL"
                            />
                          </RadioGroup>
                          <Box item xs={12} style={{ width: 750 }}>
                            <TextareaAutosize
                              fullWidth
                              style={{
                                width: "45rem",
                                margin: "5px",
                                marginLeft: "23px",
                              }}
                              value={
                                data.guranteetext?.replace(
                                  "*",
                                  data.guranteeperiod || "*"
                                ) || ""
                              }
                              name="guranteetext"
                              onChange={handleEdit}
                            />
                          </Box>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid black", width: "100px" }}>
                      <div class="input-group">
                        <span
                          style={{ paddingRight: "10px", textAlign: "left" }}
                        >
                          Validity
                        </span>
                      </div>
                    </td>

                    <TextareaAutosize
                      fullWidth
                      style={{
                        width: "45rem",
                        marginTop: "5px",
                        marginRight: "9%",
                      }}
                      value={
                        data.validityterms?.replace(
                          "*",
                          data.validityofquote || "*"
                        ) || ""
                      }
                      name="validityterms"
                      onChange={handleEdit}
                    />
                  </tr>
                </table>
              </Box>
              <br />

              {/* <div>
            <h1 style={{ fontSize: 25, marginLeft: -600, marginTop: 5 }}>
              For Static Electricals Pune
            </h1>
          </div>
          <div>
            <h1 style={{ fontSize: 25, marginLeft: -545, marginTop: 10 }}>
              Soham Sharma1(81422222222)
            </h1>
          </div>
          <div>
            <h1 style={{ fontSize: 25, marginLeft: -820, marginTop: 10 }}>
              admin
            </h1>
          </div>
          <div>
            <h1 style={{ fontSize: 25, marginLeft: 30, marginTop: 10 }}>
              S. No. 229/2/2, Behind Rajiv Gandhi Infotech Park,
              <br /> Phase 1, Hinjawadi, Pune - 411057 <br />
              Tel. : 020 - 29512931
              <br />
              E-mail : sales@staticelectric.co.in Website :
              www.staticelectric.co.in
            </h1>
          </div>
          <br /> */}
              {/* <Grid item xs={9} sm={3} style={{ marginLeft: -100, marginTop: 20 }}>
            <Button
              variant="contained"
              color="warning"
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={9} sm={3} style={{ marginTop: -35, marginLeft: 200 }}>
           <NavLink to="/AddQuotation"> <Button variant="contained" color="error">
              Cancel
            </Button></NavLink>
          </Grid> */}
              <Grid
                item
                xs={9}
                sm={3}
                style={{ marginLeft: -100, marginTop: 20, marginLeft: 20 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    background: "#00d284",
                    "&:hover": {
                      background: "#00d284", // Set the same color as the default background
                    },
                    width: "7%",
                  }}
                  type="submit"
                  onClick={handleSubmit}
                  disabled={button}
                >
                  Save
                </Button>
                {/* </Grid> */}
                {/* <Grid item xs={9} sm={3} style={{ marginTop: -35, marginLeft: 200 }}> */}
                <Link
                  to="/AddQuotation"
                  style={{ textDecoration: "none", marginLeft: 20 }}
                >
                  <Button
                    variant="contained"
                    color="error"
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

              <br />
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default NewQuotation;
