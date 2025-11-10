import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Layout/Layout";
import ViewPurchaseorder from "component/pages/purchase order/ViewPurchaseorder";
import Printprofoma from "component/pages/proforma invoice/Printprofoma";
import CreateProfoma from "component/pages/proforma invoice/CreateProfoma";
import Create from "component/pages/proforma invoice/Create";
import Login from "component/LoginPages/Login";
import ViewGrn from "component/pages/grn/ViewGrn";
import ViewQualitycontrol from "component/pages/quality control/ViewQualitycontrol";
import PrintChallan from "component/pages/challan/PrintChallan";
import TransferStockDet from "component/pages/transferStock/TransferStockDet";

const EditPurchaseOrder = lazy(() => import("../pages/purchase order/EditPurchaseOrder"));
const AddPO = lazy(() => import("../pages/purchase order/AddPo"));
const ReadyStockDet = lazy(() => import("../pages/ReadyStock/ReadyStockDet"));
const Addreadystock = lazy(() => import("../pages/ReadyStock/Addreadystock"));
const ReadyStocklist = lazy(() => import("../pages/ReadyStock/ReadyStocklist"));
const BomIssueselect = lazy(() => import("../pages/issue of bom/BomIssueselect"));
const ViewBomIssued = lazy(() => import("../pages/issue of bom/ViewBomIssued"));
const Dashboard = lazy(() => import("../dashboard/Dashboard"));
const UserMaster = lazy(() => import("../pages/user master/UserMaster"));
const EditUser = lazy(() => import("../pages/user master/EditUser"));
const CompanyProfile = lazy(() =>
  import("../pages/company profile/CompanyProfile")
);
const TestingDivision = lazy(() =>
  import("../pages/testing division/TestingDivision")
);
const EditEnquiry = lazy(() => import("../pages/enquiry/EditEnquiry"));
const Enquiry = lazy(() => import("../pages/enquiry/Enquiry"));
const AddEnquiry = lazy(() => import("../pages/enquiry/AddEnquiry"));
const Quotation = lazy(() => import("../pages/quotation/Quotation"));
const PrintQuatation = lazy(() => import("../pages/quotation/PrintQuatation"));
const AddQuotation = lazy(() => import("../pages/quotation/AddQuotation"));
const UpdateQuotation = lazy(() =>
  import("../pages/quotation/UpdateQuotation")
);
const OrderAcceptance = lazy(() =>
  import("../pages/order acceptance/OrderAcceptance")
);
const NewOrderAcceptance = lazy(() =>
  import("../pages/order acceptance/NewOrderAcceptance")
);
const ProductionPlan = lazy(() =>
  import("../pages/production plan/ProductionPlan")
);
const NewProductionPlan = lazy(() =>
  import("../pages/production plan/NewProductionPlan")
);
const ProformaInvoice = lazy(() =>
  import("../pages/proforma invoice/ProformaInvoice")
);
const Payments = lazy(() => import("../pages/payments/Payments"));
const NewPayments = lazy(() => import("../pages/payments/NewPayments"));
const DetailedPayments = lazy(() =>
  import("../pages/payments/DetailedPayments")
);
const QuotationParameters = lazy(() =>
  import("../pages/quotation parameter/QuotationParameter")
);
const Customers = lazy(() => import("../pages/customers/Customers"));
const AddCustomers = lazy(() => import("../pages/customers/AddCustomers"));
const EditCustomers = lazy(() => import("../pages/customers/EditCustomers"));
const MaterialMaster = lazy(() =>
  import("../pages/material master/MaterialMaster")
);
const AddMaterial = lazy(() => import("../pages/material master/AddMaterial"));
const UpdateMaterial = lazy(() =>
  import("../pages/material master/UpdateMaterial")
);
const Costing1 = lazy(() => import("../pages/costing 1/Costing1"));
const EditCosting1 = lazy(() => import("../pages/costing 1/EditCosting1"));
const EditCosting2 = lazy(() => import("../pages/costing 2/EditCosting2"));
const AddCosting1 = lazy(() => import("../pages/costing 1/AddCosting1"));
const Costing2 = lazy(() => import("../pages/costing 2/Costing2"));
const AddCosting2 = lazy(() => import("../pages/costing 2/AddCosting2"));
const AddCosting = lazy(() => import("../pages/costing 1/AddCosting"));
const BOM1 = lazy(() => import("../pages/bom 1/BOM1"));
const BOM2 = lazy(() => import("../pages/bom 2/BOM2"));
const Suppliers = lazy(() => import("../pages/suppliers/Suppliers"));
const AddSuppliers = lazy(() => import("../pages/suppliers/AddSuppliers"));
const UpdateSuppliers = lazy(() =>
  import("../pages/suppliers/UpdateSuppliers")
);
const Indents = lazy(() => import("../pages/indents/Indents"));
const ViewIndents = lazy(() => import("../pages/indents/ViewIndents"));
const EditIndents = lazy(() => import("../pages/indents/EditIndents"));
const PoEnquiry = lazy(() => import("../pages/po enquiry/PoEnquiry"));
const PurchaseOrder = lazy(() =>
  import("../pages/purchase order/PurchaseOrder")
);
const AddPurchaseOrder = lazy(() =>
  import("../pages/purchase order/AddPurchaseOrder")
);
const MakePo = lazy(() => import("../pages/purchase order/MakePo"));

const PendingOrders = lazy(() =>
  import("../pages/pending orders/PendingOrders")
);
const GRN = lazy(() => import("../pages/grn/GRN"));
const AddGrn = lazy(() => import("../pages/grn/AddGrn"));
const AddStock = lazy(() => import("../pages/add stock/AddStock"));
const MaterialInward = lazy(() =>
  import("../pages/material inward/MaterialInward")
);
const AddMaterialinward = lazy(() =>
  import("../pages/material inward/AddMaterialinward")
);
const AddInward = lazy(() => import("../pages/material inward/AddInward"));
const QualityControl = lazy(() =>
  import("../pages/quality control/QualityControl")
);
const AddQuality = lazy(() => import("../pages/quality control/AddQuality"));
const IssueOfBom = lazy(() => import("../pages/issue of bom/IssueOfBom"));
const BomIssue = lazy(() => import("../pages/issue of bom/BomIssue"));
const ReadyTransformers = lazy(() =>
  import("../pages/ready transformers/ReadyTransformers")
);
const ItemStock = lazy(() => import("../pages/item stock/ItemStock"));
const TotalStock = lazy(() => import("../pages/total stock/TotalStock"));
const ProductionPlanList = lazy(() =>
  import("../pages/production plan list/ProductionPlanList")
);
const BOMRequest = lazy(() => import("../pages/bom request/BOMRequest"));
const AddBOMRequest = lazy(() => import("../pages/bom request/AddBOMRequest"));
const BOM1Request = lazy(() => import("../pages/bom request/BOM1Request"));
const BOM2Request = lazy(() => import("../pages/bom request/BOM2Request"));
const Challan = lazy(() => import("../pages/challan/Challan"));
const NewChallan = lazy(() => import("../pages/challan/NewChallan"));
const EditChallan = lazy(() => import("../pages/challan/EditChallan"));
const Invoice = lazy(() => import("../pages/invoice/Invoice"));
const NewInvoice = lazy(() => import("../pages/invoice/NewInvoice"));
const AddInvoice = lazy(() => import("../pages/invoice/AddInvoice"));
const EditInvoice = lazy(() => import("../pages/invoice/EditInvoice"));
const Reports = lazy(() => import("../pages/reports/Reports"));
const PurReport = lazy(() => import("../pages/purchase report/PurReport"));
const StoreReport = lazy(() => import("../pages/store reports/StoreReport"));
const EmployeeRecords = lazy(() =>
  import("../pages/employee records/EmployeeRecords")
);
const NewQuotation = lazy(() => import("../pages/quotation/NewQuotation"));
const PrintInvoice = lazy(()=> import("../pages/invoice/PrintInvoice"))
const AcceOrder = lazy(() => import("../pages/order acceptance/AcceOrder"));
const EditOrder = lazy(() => import("../pages/order acceptance/EditOrder"));
const AddToCosting = lazy(() => import("../pages/costing 2/AddToCosting"));
const OrderAccPrint = lazy(() => import("../pages/order acceptance/OrderAccPrint"))

const AddQualityControlInward = lazy(() => import("../pages/quality control/AddQualityControlInward"))
const ProductionPlanDet = lazy(() =>
  import("../pages/production plan/ProductionPlanDet")
);
const ProductionPlanView = lazy(() =>
  import("../pages/production plan list/ProductionPlanView")
);
const ViewMaterial = lazy(() =>
  import("../pages/material inward/ViewMaterial")
);
const ViewBom1 = lazy(() => import("../pages/bom 1/ViewBom1"))
const ViewBom2 = lazy(() => import("../pages/bom 2/ViewBom2"))
const View = lazy(() => import("../pages/costing 1/View"))
const View2 = lazy(() => import("../pages/costing 2/View2"))
const ProductionReadyStock = lazy(() => import("../pages/production ready stock/ProductionReadyStock"))
const Transferstock = lazy(() => import("../pages/transferStock/transferhistory"))
const NewTransferStock = lazy(() => import("../pages/transferStock/TransferStock"))
const IssueProductionPlanList = lazy(() => import("../pages/production plan list/IssueProductionPlanList"));

const CustomRoutes = () => {
  return (
    <Suspense>
      <Routes>

     

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/addpo" element={<AddPO />} />
        <Route path="/addreadystock" element={<Addreadystock/>} />
        <Route path="/readystocklist" element={<ReadyStocklist/>} />
        <Route path="/readyStockDet" element={<ReadyStockDet/>}/>
        <Route path="/userMaster" element={<UserMaster />} />
        <Route path="/editUser/:id" element={<EditUser />} />
        <Route path="/companyProfile" element={<CompanyProfile />} />
        <Route path="/testingDivision" element={<TestingDivision />} />
        <Route path="/addEnquiry" element={<AddEnquiry />} />
        <Route path="/editenquiry/:id" element={<EditEnquiry />} />
        <Route path="/quotation" element={<Quotation />} />
        <Route path="/PrintQuotation/:id" element={<PrintQuatation />} />
        <Route path="/Printinvoice/:id" element={<PrintInvoice />} />
        <Route path="/editpurchaseorder/:id" element={<EditPurchaseOrder />} />
        
        <Route path="/addQuotation" element={<AddQuotation />} />
        <Route path="/UpdateQuotation/:id" element={<UpdateQuotation />} />
        <Route path="/orderAcceptance" element={<OrderAcceptance />} />
        <Route path="/newOrderAcceptance" element={<NewOrderAcceptance />} />
        <Route path="/productionPlan" element={<ProductionPlan />} />
        <Route path="/newProductionPlan" element={<NewProductionPlan />} />
        <Route path="/bomissueslect" element={<BomIssueselect/>}/>
        <Route path="/proformaInvoice" element={<ProformaInvoice />} />
        <Route path="/crearteprofoma" element={<CreateProfoma />} />
        <Route path="/create/:id" element={<Create />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/newPayments" element={<NewPayments />} />
        <Route path="/detailedPayments" element={<DetailedPayments />} />
        <Route path="/parameters" element={<QuotationParameters />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/addCustomers" element={<AddCustomers />} />
        <Route path="/EditCustomers/:id" element={<EditCustomers />} />
        <Route path="/materialMaster" element={<MaterialMaster />} />
        <Route path="/addMaterial" element={<AddMaterial />} />
        <Route path="/UpdateMaterial/:id" element={<UpdateMaterial />} />
        <Route path="/costing1" element={<Costing1 />} />
        <Route path="/EditCosting1/:id" element={<EditCosting1 />} />
        <Route path="/EditCosting2/:id" element={<EditCosting2 />} />
        <Route path="/addCosting1" element={<AddCosting1 />} />
        <Route path="/costing2" element={<Costing2 />} />
        <Route path="/AddCosting" element={<AddCosting />} />
        <Route path="/addCosting2" element={<AddCosting2 />} />
        <Route path="/bom1" element={<BOM1 />} />
        <Route path="/bom2" element={<BOM2 />} />
        <Route path="/ViewBom1/:id" element={<ViewBom1 />} />
        <Route path="/ViewBom2/:id" element={<ViewBom2 />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/addSuppliers" element={<AddSuppliers />} />
        <Route path="/updateSuppliers/:id" element={<UpdateSuppliers />} />
        <Route path="/indents" element={<Indents />} />
        <Route path="/viewIndent/:id" element={<ViewIndents />} />
        <Route path="/viewgrn/:id" element={<ViewGrn />} />
        <Route path="/editIndents/:id" element={<EditIndents />} />
        <Route path="/viewqualitycontrol/:poid/:miid" element={<ViewQualitycontrol />} />
        <Route path="/poEnquiry" element={<PoEnquiry />} />
        <Route path="/purchaseOrder" element={<PurchaseOrder />} />
        <Route path="/addPurchaseOrder" element={<AddPurchaseOrder />} />
        <Route path="/makePo" element={<MakePo />} />
        <Route path="/pendingOrders" element={<PendingOrders />} />
        <Route path="/grn" element={<GRN />} />
        <Route path="/addgrn" element={<AddGrn />} />
        <Route path="/addStock" element={<AddStock />} />
        <Route path="/materialInward" element={<MaterialInward />} />
        <Route path="/addmaterialinward" element={<AddMaterialinward />} />
        <Route path="/addinward" element={<AddInward />} />
        <Route path="/addqualitycontrolinward" element={<AddQualityControlInward/>} />
        <Route path="/qualityControl" element={<QualityControl />} />
        <Route path="/addqualityControl" element={<AddQuality />} />
        <Route path="/issueOfBom" element={<IssueOfBom />} />
        <Route path="/BomIssue" element={<BomIssue />} />
        <Route path="/ViewBomIssued" element={<ViewBomIssued/>} />
      
        <Route path="/readyTransformers" element={<ReadyTransformers />} />
        <Route path="/itemStock" element={<ItemStock />} />
        <Route path="/totalStock" element={<TotalStock />} />
        <Route path="/productionPlanList" element={<ProductionPlanList />} />
        <Route path="/bomRequest" element={<BOMRequest />} />
        <Route path="/addBomRequest" element={<AddBOMRequest />} />
        <Route path="/bom1Request" element={<BOM1Request />} />
        <Route path="/bom2Request" element={<BOM2Request />} />
        <Route path="/challan" element={<Challan />} />
        <Route path="/newChallan" element={<NewChallan />} />
        <Route path="/EditChallan/:id" element={<EditChallan />} />
        <Route path="/printquotation" element={<PrintQuatation />} />
        <Route path="/printchallan/:id" element={<PrintChallan />} />
        <Route path="/printprofoma/:id" element={<Printprofoma />} />
        <Route path="/printorderacc/:id" element={<OrderAccPrint />} />

        <Route path="/invoice" element={<Invoice />} />
        <Route path="/newInvoice" element={<NewInvoice />} />
        <Route path="/addInvoice" element={<AddInvoice />} />
        <Route path="/editInvoice/:id" element={<EditInvoice />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/purchaseReports" element={<PurReport />} />
        <Route path="/storeReports" element={<StoreReport />} />
        <Route path="/employeeRecords" element={<EmployeeRecords />} />
        <Route path="/NewQuotation/:id" element={<NewQuotation />} />
        <Route path="/AcceOrder" element={<AcceOrder />} />
        <Route path="/editOrder/:id" element={<EditOrder />} />
        <Route path="/AddToCosting" element={<AddToCosting />} />
        <Route path="/productionDet" element={<ProductionPlanDet />} />
        <Route path="/productionView" element={<ProductionPlanView />} />
        <Route path="/viewMaterial/:poid/:id" element={<ViewMaterial />} />
        <Route path="/viewpurchase/:id" element={<ViewPurchaseorder />} />
        <Route path="/view/:id" element={<View />} />
        <Route path="/view2/:id" element={<View2 />} />

        <Route path="/productionReadyStock" element={<ProductionReadyStock />} />
        <Route path="/transferstock" element={<Transferstock/>} />
        <Route path="/transferStockDet" element={<TransferStockDet/>} />
<Route path="/newtransferstock" element={<NewTransferStock/>} />
        <Route path="/issueProductionPlanList" element={<IssueProductionPlanList />} />
        
        
      </Routes>
    </Suspense>
  );
};
export default Layout(CustomRoutes);
























