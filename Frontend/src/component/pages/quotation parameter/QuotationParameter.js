import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Grid, Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { APP_BASE_PATH } from "Host/endpoint";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const QuotationParameter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [parameters, setParameters] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APP_BASE_PATH}/getQuotParameter`); // Replace with your API endpoint
      const jsonData = await response.json();
      setParameters(jsonData); // for search data
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParameters((prev) => ({ ...prev, [name]: value }));
  };

  const uodateParam = async () => {
    try {
      const res = await fetch(`${APP_BASE_PATH}/updateParameter`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameters),
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
    } catch {
      Swal.fire({
        title: "Data Updated Successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
      fetchData();
    }
  };

  const {
    quotdate,
    quottitle,
    delivery_temp1,
    pay_temp1,
    pay_temp2,
    pay_temp3,
    insp_temp1,
    insp_temp2,
    insp_temp3,
    gltterms,
    ghtterms,
    validityterms,
    gspecial,
  } = parameters;
  return (
    <Paper elevation={12}>
      <Box sx={{ width: "100%" }}>
        {isLoading && (
          <div id="spinner">
            {/* <BeatLoader color="#36D7B7" loading={isLoading} /> */}
            <CircularProgress color="warning" loading={isLoading} />
          </div>
        )}
        <br />
        <Typography sx={{ textAlign: "center", fontSize: "24px" }}>
        Quotation
        </Typography>
        <br/>
      <table style={{ marginLeft: "10%", width: "80%", border: "1px solid #ddd", borderCollapse: "collapse" }}>
  <thead>
   
  </thead>
  <tbody>
    <tr>
      <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Quotation Year</td>
      <td style={{ border: "1px solid #000000", padding: "8px" }}>
        <textarea
          class="form-control"
          aria-label="With textarea"
          value={quotdate}
          name="quotdate"
          onChange={handleChange}
          style={{border: "1px solid #000000"}}
        />
      </td>
    </tr>
    <tr>
      <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Quotation Title</td>
      <td style={{ border: "1px solid #000000", padding: "8px" }}>
        <textarea
          class="form-control"
          aria-label="With textarea"
          value={quottitle}
          name="quottitle"
          onChange={handleChange}
          style={{border: "1px solid #000000"}}
        />
      </td>
    </tr>
    <tr>
      <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Delivery Period</td>
      <td style={{ border: "1px solid #000000", padding: "8px" }}>
        <textarea
          class="form-control"
          aria-label="With textarea"
          value={delivery_temp1}
          name="delivery_temp1"
          onChange={handleChange}
          style={{border: "1px solid #000000"}}
        />
      </td>
    </tr>
  </tbody>
</table>

        <br />
        <Typography sx={{ textAlign: "center", fontSize: "24px" }}>
          Payment Terms
        </Typography>
        <br />
  

      <table style={{ marginLeft: "10%", width: "80%", border: "1px solid #ddd", borderCollapse: "collapse" }}>
      <thead>
       
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Template 1</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={pay_temp1}
              name="pay_temp1"
              onChange={handleChange}
          
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Template 2</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={pay_temp2}
          name="pay_temp2"
          onChange={handleChange}
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Template 3</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={pay_temp3}
              name="pay_temp3"
              onChange={handleChange}
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
      </tbody>
    </table>

        <br />
        <Typography sx={{ textAlign: "center", fontSize: "24px" }}>
          Inspection Terms
        </Typography>
        <br />

         <table style={{ marginLeft: "10%", width: "80%", border: "1px solid #ddd", borderCollapse: "collapse" }}>
      <thead>
       
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>HT</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={insp_temp1}
              name="insp_temp1"
              onChange={handleChange}
          
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>LT</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={insp_temp2}
              name="insp_temp2"
              onChange={handleChange}
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Template 3</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={insp_temp3}
              name="insp_temp3"
              onChange={handleChange}
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Guarantee LT Terms</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={gltterms}
                name="gltterms"
                onChange={handleChange}
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Guarantee HT Terms</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={ghtterms}
              name="ghtterms"
              onChange={handleChange}
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Guarantee Special</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={gspecial}
              name="gspecial"
              onChange={handleChange}
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #000000", padding: "8px", backgroundColor: "#f2f2f2" }}>Validity Terms</td>
          <td style={{ border: "1px solid #000000", padding: "8px" }}>
            <textarea
              class="form-control"
              aria-label="With textarea"
              value={validityterms}
              name="validityterms"
              onChange={handleChange}
              style={{border: "1px solid #000000"}}
            />
          </td>
        </tr>
      </tbody>
    </table>
        <br />
        <br />
        <Grid
          container
          spacing={-100}
          sx={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            marginLeft: "25rem",
          }}
        >
          <Grid item xs={9} sm={6}>
            <Button variant="contained" onClick={uodateParam}  sx={{background: "#00d284",
                            "&:hover": {
                              background: "#00d284", // Set the same color as the default background
                            },}}>
              Update
            </Button>
          </Grid>
          <Grid item xs={9} sm={6}>
            <Link to="/dashboard">
            <Button variant="contained"  sx={{  background: "#ff0854",
                            "&:hover": {
                              background: "#ff0854", // Set the same color as the default background
                            }, }}>
              Cancel
            </Button></Link>
          </Grid>
        </Grid>
        <br />
      </Box>
    </Paper>
  );
};

export default QuotationParameter;
