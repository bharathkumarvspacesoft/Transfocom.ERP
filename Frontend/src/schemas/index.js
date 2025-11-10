import * as Yup from "yup";

export const userMasterSchema = Yup.object({
  firstName: Yup.string().required("Enter Your First Name"),
  lastName: Yup.string().min(2).max(25).required("Enter Your Last Name"),
  email: Yup.string().email().required("Enter Your Email"),
  contact: Yup.number().integer().required("Enter Your Contact Number"),
  designation: Yup.string().required("Enter Designation"),
  userName: Yup.string().min(6).required("Enter UserName"),
  password: Yup.string().min(6).required("Please enter your password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
  // type: Yup.array().min(1).max(6).required("Please Select Type"),
  // birthDate:Yup.date().required("Please Enter Birth Date"),
});

export const companySchema = Yup.object({
  company: Yup.string().min(3).max(25).required("Enter Company Name"),
  contactNo: Yup.number().integer().required("Enter Your Contact Number"),
  emailId: Yup.string().email().required("Enter Your Email"),
  ifsc: Yup.string().min(11).required("Enter IFSC Code"),
  teleFax: Yup.number().integer().required("Enter Telefax Number"),
  website: Yup.string().required("Enter Website Name"),
  address: Yup.string().required("Enter Address Name"),
  accountName: Yup.string().required("Enter Account Name"),
  branch: Yup.string().required("Enter Branch Name"),
  accountNo: Yup.number().integer().required("Enter Your Account Number"),
});

export const divisionSchema = Yup.object({
  testing: Yup.string().min(3).required("Enter Testing Division  Name"),
});

export const customerSchema = Yup.object({
  customer: Yup.string().min(2).max(25).required("Enter  Customer Name"),
  contactPerson: Yup.string()
    .min(2)
    .max(25)
    .required("Enter  Contact Person Name"),
  email: Yup.string().email().required("Enter Your Email"),
  contact: Yup.number().integer().required("Enter Your Contact Number"),
  designation: Yup.string().required("Enter Designation"),
  alternateContact: Yup.number()
    .integer()
    .required("Enter Your Alternate Contact Number"),
  gst: Yup.string(),
  pan: Yup.number(),
  address: Yup.string().required("Enter Address"),
});

export const enquirySchema = Yup.object({
  customer: Yup.string().min(2).max(25).required("Enter Customer Name"),
  contactPerson: Yup.string()
    .min(2)
    .max(25)
    .required("Enter Your Contact Person Name"),
  email: Yup.string().email(),
  contact: Yup.number().integer().required("Enter Your Contact Number"),
  designation: Yup.string(),
  alternateContact: Yup.number().integer(),
  address: Yup.string().required("Enter Address"),
  currency: Yup.string().required("Enter Currency"),
  // dateEnquiry:Yup.date()("Enter Date Of Enquiry"),
  capacity: Yup.string().required("Enter Capacity"),
  type: Yup.string().required("Enter Type "),
  hv: Yup.string().required("Enter HV "),
  lv: Yup.string().required("Enter LV "),
  consumerType: Yup.string().required("Enter Consumer Type"),
  areaDispatch: Yup.string(),
  vector: Yup.string().required("Enter Vector"),
  materialWinding: Yup.string().required("Enter Material Winding"),
  cooling: Yup.string().required("Enter Cooling"),
  tapingSwitch: Yup.string().required("Enter Taping Switch"),
  core: Yup.string().required("Enter Core"),
  primaryVoltage: Yup.string().required("Enter Primary Voltage"),
  secVoltage: Yup.string().required("Enter Secondary Voltage"),
  comment: Yup.string(),
});

export const addSupplierSchema = Yup.object({
  name: Yup.string().min(2).max(25).required("Enter Customer Name"),
  email: Yup.string().email().required("Enter Your Email"),
  contactno: Yup.number().integer().required("Enter Your Contact Number"),
  address: Yup.string().required("Enter Address"),
});

export const newChallanSchema = Yup.object({
  buyerName: Yup.string().min(3).max(25).required("Enter Buyer Name"),
  dcName: Yup.string().min(3).max(30).required("Enter Your DC Name"),
  // dcDate: Yup.date().required("Enter Your DC Date"),
  deliverAt: Yup.string().min(3).required("Enter deliverAt"),
  // poDate:Yup.date().required("Enter PO Date Number"),
  poNo: Yup.number().integer().required("Enter PO Nnmber"),
  yourAddress: Yup.string().required("Enter your Address"),
  deliveryAddress: Yup.string().required("Enter Delivery Address"),
});

export const addInvoiceSchema = Yup.object({
  invoiceNo: Yup.string().required("Enter  Customer Name"),
  dcNo: Yup.string().required("Enter  Contact Person Name"),
  buyerName: Yup.string().required("Enter Your Email"),
  consigneeName: Yup.string().required("Enter Designation"),
  buyerAdd: Yup.string(),
  consigneeAdd: Yup.string(),
  category: Yup.string(),
  modeTransport: Yup.string(),
  byRoad: Yup.string().required("Enter Address"),
  poNumber: Yup.string().required("Enter Address"),
  vehicalNo: Yup.string().required("Enter Address"),
});

export const addEmpSchema = Yup.object({
  empId: Yup.string().required("Enter Emp ID"),
  empName: Yup.string().required("Enter Emp Name"),
  emailId: Yup.string().email().required("Enter Your Email"),
  contactNo: Yup.number().integer().required("Enter contact number"),
});

export const addStockSchema = Yup.object({
  SrNo: Yup.string(),
  itemCode: Yup.string(),
  description: Yup.string(),
  unit: Yup.number().integer(),
  quantity: Yup.number().integer(),
  action: Yup.string(),
});

export const updateSchema = Yup.object({
  itemCode: Yup.string().required(),
  description: Yup.string().required(),
  unit: Yup.string().required(),
  storeName: Yup.string().required(),
});

export const AccOrderSchema = Yup.object({
  customer: Yup.string().required(),
  address: Yup.string().required(),
  unicustomerNamet: Yup.string().required(),
  Address: Yup.string().required(),
  testingDiv: Yup.string().required(),
  type: Yup.string().required(),
  quantity: Yup.string().required(),
  advance: Yup.string().required(),
  poNo: Yup.string().required(),
  poDate: Yup.string().required(),
  basicRate: Yup.string().required(),
});

export const newPaymentSchema = Yup.object({
  amount: Yup.string().required(),
  PaymentDate: Yup.string().required(),
  paymentMode: Yup.string().required(),
  rtgs: Yup.string().required(),
});

export const addQuotationSchema = Yup.object({
  enquiryName: Yup.string().required("Enter  Customer Name"),
  quotationRef: Yup.string().required("Enter  Contact Person Name"),
  quantity: Yup.string().required("Enter Your Email"),
  delivery: Yup.string().required("Enter Designation"),
  cost: Yup.string(),
  guaratnee: Yup.string(),
  validity: Yup.string(),
  reviseversion: Yup.string(),
  site: Yup.string().required("Enter Address"),
  remark: Yup.string().required("Enter Address"),
  cgst: Yup.string().required("Enter Address"),
  sgst: Yup.string().required("Enter Address"),
  inclusive: Yup.string().required("Enter Address"),
  exclusive: Yup.string().required("Enter Address"),
});

export const updateQuotationSchema = Yup.object({
  enquiryName: Yup.string().required("Enter  Customer Name"),
  quotationRef: Yup.string().required("Enter  Contact Person Name"),
  quantity: Yup.string().required("Enter Your Email"),
  delivery: Yup.string().required("Enter Designation"),
  cost: Yup.string(),
  guaratnee: Yup.string(),
  validity: Yup.string(),
  reviseversion: Yup.string(),
  site: Yup.string().required("Enter Address"),
  remark: Yup.string().required("Enter Address"),
  cgst: Yup.string().required("Enter Address"),
  sgst: Yup.string().required("Enter Address"),
  inclusive: Yup.string().required("Enter Address"),
  exclusive: Yup.string().required("Enter Address"),
});
