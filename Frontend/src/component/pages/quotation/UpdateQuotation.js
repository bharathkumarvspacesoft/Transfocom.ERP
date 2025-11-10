import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import "./quotation.css";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";
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
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";
import LoadingSpinner from "component/commen/LoadingSpinner";

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

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return (
    // <InputUnstyled
    //   slots={{ input: StyledInputElement, textarea: StyledTextareaElement }}
    //   {...props}
    //   ref={ref}
    // />

    <></>
  );
});

const initialValues = {
  enquiryName: "",
  quotationRef: "",
  quantity: "",
  delivery: "",
  cost: "",
  guaratnee: "",
  validity: "",
  reviseversion: "",
  site: "",
  remark: "",
  cgst: "",
  sgst: "",
  inclusive: "",
  exclusive: "",
};
const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const scales = ['', 'Thousand', 'Lakh', 'Crore'];

function convertLessThanOneThousand(num) {
  let words = '';

  if (num % 100 < 20 && num % 100 > 10) {
    words = teens[num % 10 - 1];
    num = Math.floor(num / 100);
  } else {
    if (num % 10 > 0) {
      words = units[num % 10];
    }
    num = Math.floor(num / 10);

    if (num % 10 > 0) {
      words = tens[num % 10] + ' ' + words;
    }
    num = Math.floor(num / 10);
  }

  if (num > 0) {
    words = units[num] + ' Hundred ' + words;
  }

  return words.trim();
}


function NumberToWords(num) {
  if (num === 0) {
    return 'Zero';
  }

  let words = '';
  let scaleIndex = 0;
  let chunkCount = 0;

  while (num > 0) {
    let chunk;
    if (chunkCount === 0) { // Handle the first chunk (last three digits)
      chunk = num % 1000;
      num = Math.floor(num / 1000);
    } else { // Handle subsequent chunks (two digits at a time for Indian numbering system)
      chunk = num % 100;
      num = Math.floor(num / 100);
    }

    if (chunk !== 0) {
      let chunkWords = convertLessThanOneThousand(chunk);
      words = chunkWords + (scaleIndex > 0 ? ' ' + scales[scaleIndex] + ' ' : ' ') + words;
    }

    chunkCount++;
    scaleIndex++;
  }

  return words.trim();
}
const UpdateQuotation = () => {
  const [value, setValue] = useState(dayjs());
  const [parameters, setParameters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleDateChange = (newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  const [data, setData] = useState({
    custname: "",
    quotref: "",
    qdate: " ",
    cost: "",
    qty: "",
    deliveryperiod: "",
    guranteeperiod: "",
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
  });

  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const getparam = async () => {
    try {
      setIsLoading(true);
      const quotParameterResponse = await fetch(`/getQuotParameter`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const quotParameterData = await quotParameterResponse.json();
      console.log("parameterData", quotParameterData)
      setParameters(quotParameterData);
    } catch (error) {
      console.error("Error fetching quotation parameters:", error);

    } finally {
      setIsLoading(false);
    }
  }


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const reqData = await fetch(`${APP_BASE_PATH}/editquotation/${id}`); // Replace with your API endpoint
      const resData = await reqData.json();

      setData(resData);

      if (resData.qdate) {
        setSelectedDate(dayjs(resData.qdate));
      }
      if (resData.desDate) {
        setSelectedDate1(dayjs(resData.desDate));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
    try {
      setIsLoading(true);
      const quotResponse = await fetch(`/getQuotNumber/1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const quotData = await quotResponse.json();
      setData((prevData) => ({
        ...prevData,
        quotref: quotData.quotref,
        quot_serial: quotData.quotNo?.split("/")[3],
      }));
    } catch (error) {
      console.error("Error fetching quotation number:", error);

    } finally {
      setIsLoading(false);
    }


  };

  useEffect(() => {
    getparam()
    fetchData();

  }, [id]);

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




  const handleTaxes = (value, key) => {
    setData((data) => ({ ...data, taxes: { ...data.taxes, [key]: value } }));
  };
  const userData = JSON.parse(localStorage.getItem('userData'));
  const uid = userData ? Number(userData.id) : 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const editInputvalue = {

      uid: uid,
      ...data,
      qdate: selectedDate,
      desDate: selectedDate1.format("YYYY-MM-DD"),
    };
    try {
      const res = await fetch(`${APP_BASE_PATH}/updateQuotation/` + id, {
        method: "PUT",
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
      }
      else {  
        Swal.fire({
          title: "Data Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        })
        navigate("/quotation");
      }
    } catch {
      Swal.fire({
        title: "Data Updated Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });

      navigate(-1);
    } finally {
      setIsLoading(false);
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

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div class="d-flex justify-content-between">
            <div>
              <h3>Update Quotation</h3>
            </div>
            <Link to="/quotation" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ background: "#17a2b8" }}>
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
                  Enquiry Customer Name:  {data.custname}
                </Typography>
              </div>

            </div>

            <Box sx={{ flexGrow: 1 }}>
              <Grid
                container
                spacing={2}
                columns={12}
                style={{ marginTop: 50, display: "flex", justifyContent: "center" }}
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
                      label="Date"
                      name="qdate"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      format="DD/MM/YYYY"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </LocalizationProvider>


                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <TextField
                    fullWidth
                    id="cost"
                    label="Cost In Rs Per Transformer Without GST"
                    labelprope
                    name="cost"
                    autoComplete="cost"
                    value={data.cost}
                    type="text"
                    onChange={handleEdit}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                  <div>Amount in words: {NumberToWords(Number(data.cost * data.qty))}</div>
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
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <FormControl style={{ width: "31vw" }}>
                    <InputLabel id="demo-select-small">Guarantee Period (Months)</InputLabel>
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
                      style={{ textAlign: 'left' }}
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
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-select-small">Revise Version</InputLabel>
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
                      style={{ textAlign: 'left' }}
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
                  />
                </Grid>
                <Grid item xs={4} style={{ marginTop: 5 }}>
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

                      label="Tnt Dispatch Date"
                      name="desDate"
                      value={selectedDate1}
                      onChange={(newValue) => setSelectedDate1(newValue)}
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

                        onChange={({ target }) => handleTaxes(target.value, "cgst")}
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
                        onChange={({ target }) => handleTaxes(target.value, "sgst")}
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
                    style={{ position: "relative", bottom: 200, marginLeft: 600 }}
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
              <div style={{ textAlign: "left", marginLeft: "50px" }}>
                <h1 style={{ fontSize: 20 }}>   Schedule: B</h1>
                <h1 style={{ fontSize: 20 }}>
                  Commercial Terms And Conditions
                </h1>
              </div>

              <Box sx={{ width: "100%" }}>
                <br />
                <table style={{ marginLeft: "40px", marginRight: "40px", width: "95%", border: "1px solid black" }}>
                  <tr>
                    <td style={{ border: "1px solid black", width: "300px", backgroundColor: "#f2f2f2" }}>
                      <div class="input-group">
                        <span style={{ paddingRight: "10px" }}>
                          Price
                        </span>
                      </div>
                    </td>
                    <td style={{ border: "1px solid black", textAlign: "left", backgroundColor: "#f2f2f2" }}>
                      <ul>
                        <li>
                          <label for="floatingInput" style={{ position: "relative", left: 0 }}>
                            C.GST @ {data.taxes["cgst"]}%:- {data.taxes["cgsttype"]}
                          </label>
                        </li>
                        <li>
                          <label for="floatingInput" style={{ position: "relative", left: 0 }}>
                            S.GST @ {data.taxes["sgst"]}%:- {data.taxes["sgsttype"]}
                          </label>
                        </li>
                        <li>
                          <label for="floatingInput" style={{ position: "relative", left: 0 }}>
                            Transportation: - {data.transport}
                          </label>
                        </li>
                        <li>
                          <label for="floatingInput" style={{ position: "relative", left: 0 }}>
                            Unloading at Site:-{data.unloading}
                          </label>
                        </li>
                        <li>
                          <label for="floatingInput" style={{ position: "relative", left: 0 }}>
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
                          style={{ width: "45rem", margin: "5px", marginLeft: "20px" }}
                          fullWidth
                          value={data.deliverydesc?.replace("*", data.deliveryperiod || "*")}
                          name="deliverydesc"
                          onChange={handleEdit}
                        />
                      </Box>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid black", width: "300px", backgroundColor: "#f2f2f2" }}>
                      <div class="input-group">
                        <span style={{ paddingRight: "10px" }}>
                          Payment
                        </span>
                      </div>
                    </td>
                    <td style={{ border: "1px solid black", backgroundColor: "#f2f2f2" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          value={data.temppayment}
                          name="temppayment"
                          onChange={handleEdit}
                          sx={{ marginLeft: "45px" }}
                        >
                          <FormControlLabel value="Temp-1" control={<Radio />} label="Temp-1" />
                          <FormControlLabel value="Temp-2" control={<Radio />} label="Temp-2" />
                          <FormControlLabel value="Temp-3" control={<Radio />} label="Temp-3" />
                        </RadioGroup>
                        <Box item xs={12} style={{ width: 750 }}>
                          <TextareaAutosize
                            fullWidth
                            style={{ width: "45rem", margin: "5px", marginLeft: "23px" }}
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
                        <span style={{ paddingRight: "10px" }}>
                          Inspection
                        </span>
                      </div>
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <div class="input-group" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="tempinsp"
                          onChange={handleEdit}
                          value={data.tempinsp}
                          sx={{ marginLeft: "45px" }}
                        >
                          <FormControlLabel value="HT" control={<Radio />} label="HT" />
                          <FormControlLabel value="LT" control={<Radio />} label="LT" />
                          <FormControlLabel value="Temp-3" control={<Radio />} label="Temp-3" />
                        </RadioGroup>
                        <Box item xs={12} style={{ width: 750 }}>
                          <TextareaAutosize
                            fullWidth
                            style={{ width: "45rem", margin: "5px", marginLeft: "23px" }}
                            value={data.inspectiondesc}
                            name="inspectiondesc"
                            onChange={handleEdit}
                          />
                        </Box>
                      </div>
                    </td>

                  </tr>
                  <tr>
                    <td style={{ border: "1px solid black", width: "300px", backgroundColor: "#f2f2f2" }}>
                      <div class="input-group">
                        <span style={{ paddingRight: "10px" }}>
                          Guarantee
                        </span>
                      </div>
                    </td>
                    <td style={{ border: "1px solid black", backgroundColor: "#f2f2f2" }}>
                      <div class="input-group">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="tempgurantee"
                            onChange={handleEdit}
                            value={data.tempgurantee}
                            sx={{ marginLeft: "45px" }}
                          >
                            <FormControlLabel value="HT" control={<Radio />} label="HT" />
                            <FormControlLabel value="LT" control={<Radio />} label="LT" />
                            <FormControlLabel value="SPECIAL" control={<Radio />} label="SPECIAL" />
                          </RadioGroup>
                          <Box item xs={12} style={{ width: 750 }}>
                            <TextareaAutosize
                              fullWidth
                              style={{ width: "45rem", margin: "5px", marginLeft: "23px" }}
                              value={data.guranteetext?.replace("*", data.guranteeperiod || "*") || ""}
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
                        <span style={{ paddingRight: "10px", textAlign: "left" }}>
                          Validity
                        </span>
                      </div>
                    </td>
                    <TextareaAutosize
                      fullWidth
                      style={{ width: "45rem", marginTop: "5px", marginRight: '9%' }}
                      value={data.validityterms?.replace("*", data.validityofquote || "*") || ""}
                      name="validityterms"
                      onChange={handleEdit}
                    />

                  </tr>

                </table>



              </Box>
              <br />

              <Grid item xs={9} sm={3} style={{ marginLeft: -100, marginTop: 20 }}>
                <Button
                  variant="contained"
                  sx={{ background: "#007bff" }}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item xs={9} sm={3} style={{ marginTop: -35, marginLeft: 200 }}>
                <Link to="/quotation" style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="error">
                    Cancel
                  </Button>
                </Link>
              </Grid>
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default UpdateQuotation;
