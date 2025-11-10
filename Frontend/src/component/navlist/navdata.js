import DashboardIcon from "@mui/icons-material/Dashboard";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CampaignIcon from "@mui/icons-material/Campaign";
import StoreIcon from "@mui/icons-material/Store";
import ConstructionIcon from "@mui/icons-material/Construction";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";

const dashboard = {
  label: "Dashboard",
  to: "/dashboard",
  icon: <DashboardIcon />,
};
const admin = {
  label: "Admin",
  to: "/admin",
  icon: <AdminPanelSettingsIcon />,
  arrow: <ExpandMoreIcon />,
  children: [
    {
      label: "User Master",
      to: "/userMaster",
    },
    {
      label: "Company Profile",
      to: "/companyProfile",
    },
    {
      label: "Testing Division",
      to: "/testingDivision",
    },
  ],
};
const marketing = {
  label: "Marketing",
  to: "/enquiry",
  icon: <CampaignIcon />,
  arrow: <ExpandMoreIcon />,
  children: [
    {
      label: "Enquiry",
      to: "/enquiry",
    },
    {
      label: "Quotation",
      to: "/quotation",
    },
    {
      label: "Order Acceptance",
      to: "/orderAcceptance",
    },
    {
      label: "Production Plan",
      to: "/productionPlan",
    },
    {
      label: "Proforma Invoice",
      to: "/proformaInvoice",
    },
    {
      label: "Transfer Stock",
      to: "/transferstock",
    },
    {
      label: "Payments",
      to: "/payments",
    },
    {
      label: "Quotation Parameters",
      to: "/parameters",
    },
    {
      label: "Customers",
      to: "/customers",
    },
  ],
};

const design = {
  label: "Design",
  to: "/quotation",
  icon: <DesignServicesIcon style={{ marginRight: "10px" }} />,
  arrow: <ExpandMoreIcon style={{ marginRight: "10px" }} />,
  children: [
    {
      label: "Material Master",
      to: "/materialMaster",
    },
    {
      label: "Costing 1",
      to: "/costing1",
    },
    // {
    //   label: "Costing 2",
    //   to: "/costing2",
    // },
    {
      label: "BOM 1",
      to: "/bom1",
    },
    // {
    //   label: "BOM 2",
    //   to: "/bom2",
    // },
  ],
};
const purchase = {
  label: "Purchase",
  to: "/purchase",
  icon: <ShoppingCartIcon />,
  arrow: <ExpandMoreIcon />,
  children: [
    {
      label: "Suppliers",
      to: "/suppliers",
    },
    {
      label: "Indents",
      to: "/indents",
    },
    {
      label: "PO Enquiry",
      to: "/poEnquiry",
    },
    {
      label: "Purchase Order",
      to: "/purchaseOrder",
    },
    // {
    //   label: "Reports",
    //   to: "/purchaseReports",
    //   arrow: <ExpandMoreIcon />,
    //   sub_children: [
    //     {
    //       label: "Pending Orders",
    //       to: "/pendingOrders",
    //     },
    //   ],
    // },
  ],
};
const store = {
  label: "Store",
  to: "/store",
  icon: <StoreIcon />,
  arrow: <ExpandMoreIcon />,
  children: [
    // {
    //   label: "GRN",
    //   to: "/grn",
    // },
    {
      label: "GRN",
      to: "/materialInward",
    },
    {
      label: "Quality Control",
      to: "/qualityControl",
    },
    {
      label: "Material Inward",
      to: "/addStock",
    },

    // {
    //   label: "Material Inward",
    //   to: "/materialInward",
    // },

    {
      label: "Issue of BOM",
      to: "/issueOfBom",
    },
    {
      label: "View Ready Stock",
      to: "/readystocklist",
    },
    {
      label: "Reports",
      to: "/storeReports",
      icon: "",
      arrow: <ExpandMoreIcon />,
      sub_children: [
        {
          label: "Ready Transformers",
          to: "/readyTransformers",
        },
        {
          label: "Item Stock",
          to: "/itemStock",
        },
        {
          label: "Total Stock",
          to: "/totalStock",
        },
      ],
    },
  ],
};
const production = {
  label: "Production",
  to: "/production",
  icon: <ConstructionIcon />,
  arrow: <ExpandMoreIcon />,
  children: [
    // { // New tab
    //   label: "Issue Production Plan list",
    //   to: "/issueProductionPlanList",
    // },
    {
      label: "Production Plan List",
      to: "/productionPlanList",
    },
    {
      label: "BOM Request",
      to: "/bomRequest",
    },
    {
      label: "Ready Stock",
      to: "/productionReadyStock",
    },
    // {
    //   label: "Transfer Stock",
    //   to: "/transferstock",
    // },
  ],
};
const account = {
  label: "Accounts",
  to: "/accounts",
  icon: <AssignmentIndIcon />,
  arrow: <ExpandMoreIcon />,
  children: [
    {
      label: "Challan's",
      to: "/challan",
    },
    {
      label: "Invoice's",
      to: "/invoice",
    },
    // {
    //   label: "Reports",
    //   to: "/reports",
    // },
    // {
    //   label: "Employee Records",
    //   to: "/employeerecords",
    // },
  ],
};
// const accessMap = {
//   1: [dashboard,marketing],
//   2: [dashboard,design],
//   3:[dashboard,purchase],
//   4:[dashboard,store],
//   5:[dashboard,production],
//   6:[dashboard,account],
//   7:[dashboard,admin,marketing,design,purchase,store,production,account]
//   // 7: [marketing, admin, dashboard, design],
//   // 0:[dashboard],
//   // 1:[marketing],
//   // 2:[design],
//   // 3:[purchase],
//   // 4:[store],
//   // 5:[production],
//   // 6:[account],
//   // 7:[admin,marketing,design,purchase,store,production,account]
// };
const accessMap = {
  1: [dashboard, marketing],
  2: [dashboard, design],
  3: [dashboard, purchase],
  4: [dashboard, store],
  5: [dashboard, production],
  6: [dashboard, account],
  7: [
    dashboard,
    admin,
    marketing,
    design,
    purchase,
    store,
    production,
    account,
  ],
  8: [dashboard, marketing, design],
  9: [dashboard, marketing, design, purchase],
  10: [dashboard, marketing, design, purchase, store],
  11: [dashboard, marketing, design, purchase, store, production],
  12: [dashboard, marketing, design, purchase, store, production, account],
  13: [dashboard, marketing, purchase],
  14: [dashboard, marketing, purchase, store],
  15: [dashboard, marketing, purchase, store, production],
  16: [dashboard, marketing, purchase, store, production, account],
  17: [dashboard, marketing, store, design],
  18: [dashboard, marketing, store, production],
  19: [dashboard, marketing, store, production, account],
  20: [dashboard, marketing, production],
  21: [dashboard, marketing, production, account],
  22: [dashboard, marketing, account],
  23: [dashboard, design, purchase],
  24: [dashboard, design, store],
  25: [dashboard, design, production],
  26: [dashboard, design, account],
  27: [dashboard, purchase, store],
  28: [dashboard, purchase, production],
  29: [dashboard, purchase, account],
  30: [dashboard, store, production],
  31: [dashboard, store, account],
  32: [dashboard, production, account],
  33: [dashboard, design, purchase, store],
  34: [dashboard, design, purchase, store, production],
  35: [dashboard, design, purchase, store, production, account],
  36: [dashboard, purchase, store, production],
  37: [dashboard, purchase, store, production, account],
  38: [dashboard, store, production, account],
  39: [dashboard, design, store, production],
  40: [dashboard, design, store, production, account],
  41: [dashboard, design, purchase, store, account],
  42: [dashboard, purchase, production, account],
};

export { accessMap };

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Admin",
    to: "/admin",
    icon: <AdminPanelSettingsIcon />,
    arrow: <ExpandMoreIcon />,
    children: [
      {
        label: "User Master",
        to: "/userMaster",
      },
      {
        label: "Company Profile",
        to: "/companyProfile",
      },
      {
        label: "Testing Division",
        to: "/testingDivision",
      },
    ],
  },
  {
    label: "Marketing",
    to: "/enquiry",
    icon: <CampaignIcon />,
    arrow: <ExpandMoreIcon />,
    children: [
      {
        label: "Enquiry",
        to: "/enquiry",
      },
      {
        label: "Quotation",
        to: "/quotation",
      },
      {
        label: "Order Acceptance",
        to: "/orderAcceptance",
      },
      {
        label: "Production Plan",
        to: "/productionPlan",
      },
      {
        label: "Proforma Invoice",
        to: "/proformaInvoice",
      },
      {
        label: "Payments",
        to: "/payments",
      },
      {
        label: "Quotation Parameters",
        to: "/parameters",
      },
      {
        label: "Customers",
        to: "/customers",
      },
    ],
  },
  {
    label: "Design",
    to: "/quotation",
    icon: <DesignServicesIcon />,
    arrow: <ExpandMoreIcon />,
    children: [
      {
        label: "Material Master",
        to: "/materialMaster",
      },
      {
        label: "Costing 1",
        to: "/costing1",
      },
      // {
      //   label: "Costing 2",
      //   to: "/costing2",
      // },
      {
        label: "BOM 1",
        to: "/bom1",
      },
      // {
      //   label: "BOM 2",
      //   to: "/bom2",
      // },
    ],
  },
  {
    label: "Purchase",
    to: "/purchase",
    icon: <ShoppingCartIcon />,
    arrow: <ExpandMoreIcon />,
    children: [
      {
        label: "Suppliers",
        to: "/suppliers",
      },
      {
        label: "Indents",
        to: "/indents",
      },
      {
        label: "PO Enquiry",
        to: "/poEnquiry",
      },
      {
        label: "Purchase Order",
        to: "/purchaseOrder",
      },
      {
        label: "Reports",
        to: "/purchaseReports",
        arrow: <ExpandMoreIcon />,
        sub_children: [
          {
            label: "Pending Orders",
            to: "/pendingOrders",
          },
        ],
      },
    ],
  },
  {
    label: "Store",
    to: "/store",
    icon: <StoreIcon />,
    arrow: <ExpandMoreIcon />,
    children: [
      {
        label: "GRN",
        to: "/grn",
      },
      {
        label: "Ready Stock",
        to: "/readystocklist",
      },
      {
        label: "Material Inward",
        to: "/materialInward",
      },
      {
        label: "Quality Control",
        to: "/qualityControl",
      },
      {
        label: "Issue of BOM",
        to: "/issueOfBom",
      },
      {
        label: "Reports",
        to: "/storeReports",
        icon: "",
        arrow: <ExpandMoreIcon />,
        sub_children: [
          {
            label: "Ready Transformers",
            to: "/readyTransformers",
          },
          {
            label: "Item Stock",
            to: "/itemStock",
          },
          {
            label: "Total Stock",
            to: "/totalStock",
          },
        ],
      },
    ],
  },
  {
    label: "Production",
    to: "/production",
    icon: <ConstructionIcon />,
    arrow: <ExpandMoreIcon />,
    children: [
      {
        label: "Issue Production Plan list",
        to: "/issueProductionPlanList",
      },
      {
        label: "Production Plan List",
        to: "/productionPlanList",
      },
      {
        label: "BOM Request",
        to: "/bomRequest",
      },
      {
        label: "Ready Stock",
        to: "/productionReadyStock",
      },
      // {
      //   label: "Transfer Stock",
      //   to: "/transferstock",
      // },
    ],
  },
  {
    label: "Accounts",
    to: "/accounts",
    icon: <AssignmentIndIcon />,
    arrow: <ExpandMoreIcon />,
    children: [
      {
        label: "Challan's",
        to: "/challan",
      },
      {
        label: "Invoice's",
        to: "/invoice",
      },
      // {
      //   label: "Reports",
      //   to: "/reports",
      // },
      {
        label: "Employee Records",
        to: "/employeerecords",
      },
    ],
  },
];

export default navItems;
