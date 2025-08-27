// sidebarMenu.js
import {
  FaHome,
  FaCube,
  FaLayerGroup,
  FaLifeRing,
  FaList,
  FaDatabase,
  FaPaypal
} from "react-icons/fa";
import { FaHandDots } from "react-icons/fa6";
import { GrOrderedList } from "react-icons/gr";
import { IoIosMore } from "react-icons/io";
import { FaCreditCard } from "react-icons/fa";

const sidebarMenu = [
  // {
  //     icon: <FaHome />,
  //     label: 'Home',
  //     submenu: [
  //         {
  //             label: 'Default',
  //             path: '/test'
  //         },
  //         {
  //             label: 'Advanced',
  //             path: '/',
  //             children: [
  //                 { label: 'Analytics', path: '//advanced/analytics' },
  //                 { label: 'Sales', path: '//advanced/sales' }
  //             ]
  //         }
  //     ]
  // },

  {
    icon: <FaHome />,
    label: "Home",
    path: "/"
  },
  {
    icon: <FaList />,
    label: "Listings",
    submenu: [
      { label: "My Listings", path: "/listing" },
      { label: "Add New Listings", path: "/addlisting" },
      { label: "Rack Approval Requests", path: "/trackapprovalrequests" }
      // { label: 'My Audits', path: '/myaudits' },
      // { label: 'Selection Insights', path: '/' },
      // { label: 'Fashion Trends', path: '/' },
    ]
  },
  {
    icon: <FaDatabase />,
    label: "Inventory ",
    submenu: [
      { label: "Inventory Health", path: "/inventory" },
      { label: "Flipkart Warehouse Onboarding", path: "/warehouse" }
    ]
  },
  {
    icon: <GrOrderedList />,
    label: "Order ",
    submenu: [
      { label: "Active Orders", path: "/activeorder" },
      { label: "Returns", path: "/return-order" },
      { label: "Cancellations", path: "/cancel-order" },
      // { label: 'Insights', path: '/base/insights' },
      {
        label: "Customer Returns Reduction",
        path: "/customer-return-reduction"
      },
      {
        label: "Cancellations & Logistics Returns",
        path: "/returncancellogistic"
      }
    ]
  },
  {
    icon: <FaCreditCard />,
    label: "Payments",
    submenu: [
      { label: "Payments Overview", path: "/payments-overview" },
      { label: "Previous Payments", path: "/previous-payment" },
      { label: "Search Order Settlements", path: "/settlement-dashboard" },
      { label: "Invoices", path: "/invoices" },
      { label: "Statements", path: "/statements" },
      { label: "Services Transaction History", path: "/service-transaction" }
      // { label: 'Seller Protection Fund (SPF)', path: '/' }
    ]
  },
  // {
  //     icon: <FaDatabase />,
  //     label: 'Growth',
  //     submenu: [
  //         { label: 'Flipkart Nxt Insights', path: '/' },
  //         { label: 'Advertising Recommendation', path: '/' },
  //         { label: 'Price Recommendations', path: '/' },
  //         { label: 'Flipkart Promotions', path: '/' },
  //         { label: 'Flipkart Growth Plans', path: '/' },
  //         { label: 'Rewards', path: '/' },
  //         { label: 'Product Quality', path: '/' },
  //         { label: 'Returns', path: '/' },
  //         { label: 'Cancellations', path: '/' },
  //         { label: 'Selection Insights', path: '/' },
  //         { label: 'Growth Central', path: '/' },
  //         { label: 'My Freebies', path: '/' }
  //     ]
  // },
  {
    icon: <IoIosMore />,
    label: "More",
    submenu: [
      // {
      //     label: 'Advertising',
      //     path: '/'
      // },
      {
        label: "Report",
        path: "/",
        children: [{ label: "Repurt center", path: "/report-center" }]
      },
      {
        label: "Partner Services",
        path: "/",
        children: [
          // { label: 'All Services', path: '/' },
          // { label: 'My Service', path: '/my-service' },
          { label: "Help", path: "/help" }
        ]
      }
    ]
  }
];

export default sidebarMenu;
