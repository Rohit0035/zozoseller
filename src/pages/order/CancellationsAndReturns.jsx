import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  Col,
  Row,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  FaList,
  FaHourglassHalf,
  FaCheckCircle
} from "react-icons/fa";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import { showToast } from "../../components/ToastifyNotification";
import { GetVendorOrders } from "../../api/vendorOrderAPI";

// --- Helper function for Date Formatting ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    return date.toLocaleDateString();
};

// --- Column definitions (kept as is) ---

// Columns for cancellation orders
const cancelColumns = [
  { name: "Order ID", selector: row => row.orderId, sortable: true },
  { name: "Customer Name", selector: row => row.customerName, sortable: true },
  { name: "Contact", selector: row => row.contact, sortable: true },
  { name: "Product", selector: row => row.product, sortable: true },
  { name: "SKU", selector: row => row.sku, sortable: true },
  {
    name: "Amount (₹)",
    selector: row => row.amount,
    sortable: true,
    right: true
  },
  {
    name: "Reason for Cancellation",
    selector: row => row.reason,
    sortable: false
  },
  { name: "Date", selector: row => formatDate(row.date), sortable: true, id: 'date' },
  {
    name: "Status",
    selector: row => row.status,
    sortable: true,
    cell: row =>
      <span className="badge bg-danger">
        {row.status}
      </span>
  },
  {
    name: "Refund Status",
    selector: row => row.refundStatus,
    sortable: true,
    cell: row =>
      <span
        className={`badge ${row.refundStatus === "Processed"
          ? "bg-success"
          : "bg-warning text-dark"}`}
      >
        {row.refundStatus}
      </span>
  },
  { name: "Channel", selector: row => row.channel, sortable: true }
];

// Columns for logistics returns
const returnColumns = [
  { name: "Return ID", selector: row => row.returnId, sortable: true },
  { name: "Order ID", selector: row => row.orderId, sortable: true },
  { name: "Customer Name", selector: row => row.customerName, sortable: true },
  { name: "Contact", selector: row => row.contact, sortable: true },
  { name: "Product", selector: row => row.product, sortable: true },
  { name: "SKU", selector: row => row.sku, sortable: true },
  {
    name: "Amount (₹)",
    selector: row => row.amount,
    sortable: true,
    right: true
  },
  { name: "Return Reason", selector: row => row.returnReason, sortable: false },
  { name: "Return Date", selector: row => formatDate(row.returnDate), sortable: true, id: 'returnDate' },
  {
    name: "Logistics Partner",
    selector: row => row.logisticsPartner,
    sortable: true
  },
  {
    name: "Tracking Number",
    selector: row => row.trackingNumber,
    sortable: true
  },
  {
    name: "Return Status",
    selector: row => row.returnStatus,
    sortable: true,
    cell: row => {
      let badgeClass = "bg-secondary";
      if (row.returnStatus === "Delivered") badgeClass = "bg-success";
      else if (row.returnStatus === "In Transit")
        badgeClass = "bg-info text-white";
      else if (row.returnStatus === "Pending Pickup")
        badgeClass = "bg-warning text-dark";
      else if (row.returnStatus === "Cancelled") badgeClass = "bg-danger"; // Should be rare here
      return (
        <span className={`badge ${badgeClass}`}>
          {row.returnStatus}
        </span>
      );
    }
  },
  {
    name: "Refund Status",
    selector: row => row.refundStatus,
    sortable: true,
    cell: row =>
      <span
        className={`badge ${row.refundStatus === "Processed"
          ? "bg-success"
          : "bg-warning text-dark"}`}
      >
        {row.refundStatus}
      </span>
  }
];

// Presets for columns toggle
const cancelPresets = {
  "Default View": ["Order ID", "Customer Name", "Product", "Date", "Status"],
  "Full View": cancelColumns.map(col => col.name)
};
const returnPresets = {
  "Default View": [
    "Return ID",
    "Order ID",
    "Customer Name",
    "Product",
    "Return Date",
    "Return Status"
  ],
  "Full View": returnColumns.map(col => col.name)
};

const CancellationsAndReturns = () => {
  const [activeTab, setActiveTab] = useState("cancellations"); // 'cancellations' or 'returns'
  const dispatch = useDispatch();

  // State for cancellations
  const [cancelVisibleColumns, setCancelVisibleColumns] = useState(
    cancelPresets["Default View"]
  );
  const [cancelDropdownOpen, setCancelDropdownOpen] = useState(false);
  const [cancelSortDropdownOpen, setCancelSortDropdownOpen] = useState(false);
  const [cancelFilterText, setCancelFilterText] = useState("");
  const [cancelSelectedRows, setCancelSelectedRows] = useState([]);
  const [cancelSortConfig, setCancelSortConfig] = useState({
    field: "Date", // Uses column name
    order: "desc"
  });
  const [cancelOrders, setCancelOrders] = useState([]); // Raw data from API, filtered for cancellations

  // State for returns
  const [returnVisibleColumns, setReturnVisibleColumns] = useState(
    returnPresets["Default View"]
  );
  const [returnDropdownOpen, setReturnDropdownOpen] = useState(false);
  const [returnSortDropdownOpen, setReturnSortDropdownOpen] = useState(false);
  const [returnFilterText, setReturnFilterText] = useState("");
  const [returnSelectedRows, setReturnSelectedRows] = useState([]);
  const [returnSortConfig, setReturnSortConfig] = useState({
    field: "Return Date", // Uses column name
    order: "desc"
  });
  const [logisticsReturns, setLogisticsReturns] = useState([]); // Raw data from API, filtered for returns

    // Helper map for sorting by column name to data key
    const sortFieldMap = {
        'Date': 'dateTimestamp',
        'Amount (₹)': 'amount',
        'Customer Name': 'customerName',
        'Return Date': 'returnDateTimestamp',
    };

    // --- API Data Fetching ---
    const fetchOrders = async (data) => {
        dispatch({ type: 'loader', loader: true })
    
        try {
          // Fetch ALL orders to manually segregate into CANCELLATIONS and RETURNS
          const response = await GetVendorOrders({ orderStatus: ['Cancelled', 'Returned','Refunded'] }); 
          
          if (response.success === true) {
            showToast('success', 'Orders data fetched successfully.');
            
            const allOrders = response.data.map((item) => {
                // Base structure for both tabs
                const baseData = {
                    id: item._id,
                    orderId: item.orderId?.orderUniqueId || `ORD${item._id.slice(-6).toUpperCase()}`,
                    customerName: item.orderId?.userId?.name || 'N/A',
                    contact: item.orderId?.userId?.phone || 'N/A',
                    product: item.orderItems[0]?.productId?.name || 'N/A',
                    sku: item.orderItems[0]?.productVariationId?.sku || 'N/A',
                    amount: item.orderItems[0]?.total || 0,
                    refundStatus: item.refundStatus || 'Pending',
                    // This status will drive the categorization:
                    returnStatus: item.returnStatus || 'N/A', 
                    channel: item.channel || 'N/A',
                    dateTimestamp: new Date(item.updatedAt || new Date()).getTime(),
                };

                // Properties specific to Cancellations view
                if (item.returnStatus === 'Cancelled') {
                    return {
                        ...baseData,
                        reason: item.returnReason || 'Customer changed mind',
                        date: item.updatedAt,
                        status: 'Cancelled',
                    };
                } 
                // Properties specific to Returns view
                else if (item.returnStatus && item.returnStatus !== 'Cancelled') {
                    return {
                        ...baseData,
                        returnId: item.orderId?.returnId || `RET${item._id.slice(-6).toUpperCase()}`,
                        returnReason: item.returnReason || 'Damaged product',
                        returnDate: item.updatedAt,
                        returnDateTimestamp: new Date(item.updatedAt || new Date()).getTime(),
                        logisticsPartner: item.logisticsPartner || 'FedEx',
                        trackingNumber: item.trackingNumber || 'N/A',
                    };
                }
                return null; // Ignore orders that are neither cancelled nor returned
            }).filter(item => item !== null);

            // Separate data based on status
            const cancellations = allOrders.filter(item => item.status === 'Cancelled');
            const returns = allOrders.filter(item => item.returnStatus !== 'Cancelled' && item.returnStatus !== 'N/A');

            setCancelOrders(cancellations);
            setLogisticsReturns(returns);
          			
          } else {
            showToast('error', response.message);
          }
        } catch (error) {
          showToast('error', error.toString());
        } finally {
          dispatch({ type: 'loader', loader: false });
        }
      }
    
      useEffect(() => {
        fetchOrders();
      }, []);

    // --- Memoized Filter and Sort Functions ---

    // 1. Filtered and Sorted Data for Cancellations
    const filteredAndSortedCancelOrders = useMemo(() => {
        let currentData = [...cancelOrders];

        // Filtering
        if (cancelFilterText) {
            const lowerCaseFilter = cancelFilterText.toLowerCase();
            currentData = currentData.filter(item =>
                Object.values(item).some(val =>
                    val !== null && val !== undefined && val.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }

        // Sorting
        if (cancelSortConfig.field) {
            const sortKey = sortFieldMap[cancelSortConfig.field] || cancelSortConfig.field.toLowerCase();
            
            currentData.sort((a, b) => {
                const valA = a[sortKey];
                const valB = b[sortKey];

                if (valA === undefined || valA === null) return cancelSortConfig.order === 'desc' ? 1 : -1;
                if (valB === undefined || valB === null) return cancelSortConfig.order === 'desc' ? -1 : 1;

                if (typeof valA === 'string') {
                    return cancelSortConfig.order === 'desc' 
                        ? valB.localeCompare(valA) 
                        : valA.localeCompare(valB);
                } else {
                    return cancelSortConfig.order === 'desc' ? (valB - valA) : (valA - valB);
                }
            });
        }
        
        return currentData;
    }, [cancelOrders, cancelFilterText, cancelSortConfig]);


    // 2. Filtered and Sorted Data for Logistics Returns
    const filteredAndSortedReturns = useMemo(() => {
        let currentData = [...logisticsReturns];

        // Filtering
        if (returnFilterText) {
            const lowerCaseFilter = returnFilterText.toLowerCase();
            currentData = currentData.filter(item =>
                Object.values(item).some(val =>
                    val !== null && val !== undefined && val.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }

        // Sorting
        if (returnSortConfig.field) {
            const sortKey = sortFieldMap[returnSortConfig.field] || returnSortConfig.field.toLowerCase();
            
            currentData.sort((a, b) => {
                const valA = a[sortKey];
                const valB = b[sortKey];

                if (valA === undefined || valA === null) return returnSortConfig.order === 'desc' ? 1 : -1;
                if (valB === undefined || valB === null) return returnSortConfig.order === 'desc' ? -1 : 1;

                if (typeof valA === 'string') {
                    return returnSortConfig.order === 'desc' 
                        ? valB.localeCompare(valA) 
                        : valA.localeCompare(valB);
                } else {
                    return returnSortConfig.order === 'desc' ? (valB - valA) : (valA - valB);
                }
            });
        }
        
        return currentData;
    }, [logisticsReturns, returnFilterText, returnSortConfig]);

  // Toggle columns for cancellations
  const toggleCancelColumn = colName => {
    setCancelVisibleColumns(
      prev =>
        prev.includes(colName)
          ? prev.filter(c => c !== colName)
          : [...prev, colName]
    );
  };

  // Toggle columns for returns
  const toggleReturnColumn = colName => {
    setReturnVisibleColumns(
      prev =>
        prev.includes(colName)
          ? prev.filter(c => c !== colName)
          : [...prev, colName]
    );
  };

  // Apply presets for cancellations
  const applyCancelPreset = preset => {
    setCancelVisibleColumns(cancelPresets[preset]);
    setCancelDropdownOpen(false);
  };

  // Apply presets for returns
  const applyReturnPreset = preset => {
    setReturnVisibleColumns(returnPresets[preset]);
    setReturnDropdownOpen(false);
  };

  // Selected rows handlers
  const handleCancelRowSelected = state => {
    setCancelSelectedRows(state.selectedRows);
  };

  const handleReturnRowSelected = state => {
    setReturnSelectedRows(state.selectedRows);
  };

  // Sorting handlers
  const handleCancelSortSelect = (field, order = "desc") => {
    setCancelSortConfig({ field, order });
    setCancelSortDropdownOpen(false);
  };

  const handleReturnSortSelect = (field, order = "desc") => {
    setReturnSortConfig({ field, order });
    setReturnSortDropdownOpen(false);
  };

  // Columns to show
  const cancelColumnsToShow = cancelColumns.filter(col =>
    cancelVisibleColumns.includes(col.name)
  );
  const returnColumnsToShow = returnColumns.filter(col =>
    returnVisibleColumns.includes(col.name)
  );

  // Counters for cancellations (using memoized data for accurate counts)
  const cancelCounters = useMemo(() => [
    {
      title: "All Cancelled",
      count: cancelOrders.length,
      icon: <FaList size={30} color="#fff" />,
      bgColor: "#6c757d",
      textColor: "#fff"
    },
    {
      title: "Refund Processed",
      count: cancelOrders.filter(o => o.refundStatus === "Processed").length,
      icon: <FaCheckCircle size={30} color="#fff" />,
      bgColor: "#28a745",
      textColor: "#fff"
    },
    {
      title: "Refund Pending",
      count: cancelOrders.filter(o => o.refundStatus === "Pending").length,
      icon: <FaHourglassHalf size={30} color="#fff" />,
      bgColor: "#ffc107",
      textColor: "#000"
    }
  ], [cancelOrders]);

  // Counters for returns (using memoized data for accurate counts)
  const returnCounters = useMemo(() => [
    {
      title: "All Returns",
      count: logisticsReturns.length,
      icon: <FaList size={30} color="#fff" />,
      bgColor: "#6c757d",
      textColor: "#fff"
    },
    {
      title: "Returned Delivered",
      count: logisticsReturns.filter(o => o.returnStatus === "Delivered")
        .length,
      icon: <FaCheckCircle size={30} color="#fff" />,
      bgColor: "#28a745",
      textColor: "#fff"
    },
    {
      title: "In Transit",
      count: logisticsReturns.filter(o => o.returnStatus === "In Transit")
        .length,
      icon: <FaHourglassHalf size={30} color="#fff" />,
      bgColor: "#17a2b8",
      textColor: "#fff"
    },
    {
      title: "Refund Processed",
      count: logisticsReturns.filter(o => o.refundStatus === "Processed")
        .length,
      icon: <FaCheckCircle size={30} color="#fff" />,
      bgColor: "#28a745",
      textColor: "#fff"
    },
    {
      title: "Refund Pending",
      count: logisticsReturns.filter(o => o.refundStatus === "Pending").length,
      icon: <FaHourglassHalf size={30} color="#fff" />,
      bgColor: "#ffc107",
      textColor: "#000"
    }
  ], [logisticsReturns]);

  return (
    <div>
      <Row>
        <Col md="12">
          <Breadcrumb className="my-2">
            <BreadcrumbItem>
              <h5>Cancellations & Returns</h5>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              {activeTab === "cancellations"
                ? "Cancellations"
                : "Logistics Returns"}
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>

      {/* Tabs to switch between Cancellations and Returns */}
      <Row>
        <Col md="12">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === "cancellations"
                })}
                onClick={() => setActiveTab("cancellations")}
                style={{ cursor: "pointer" }}
              >
                Cancellations
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "returns" })}
                onClick={() => setActiveTab("returns")}
                style={{ cursor: "pointer" }}
              >
                Logistics Returns
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>

      {/* Counters */}
      <Row className="mt-3">
        {(activeTab === "cancellations"
          ? cancelCounters
          : returnCounters).map((item, index) =>
          <Col
            key={index}
            md={activeTab === "returns" ? "2" : "4"}
            sm="6"
            xs="12"
            className="mb-3"
          >
            <Card
              className="text-start shadow-sm"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <CardBody className="p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0 text-white">
                      {item.count}
                    </h3>
                    <small className="text-white">
                      {item.title}
                    </small>
                  </div>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>

      {/* Search, Sort, Customize Columns & Export CSV */}
      <Row className="mt-2 align-items-center">
        <Col md="6" className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder={
              activeTab === "cancellations"
                ? "Search by name, product, contact..."
                : "Search by name, product, contact, tracking..."
            }
            style={{ maxWidth: "300px" }}
            value={
              activeTab === "cancellations"
                ? cancelFilterText
                : returnFilterText
            }
            onChange={e =>
              activeTab === "cancellations"
                ? setCancelFilterText(e.target.value)
                : setReturnFilterText(e.target.value)}
          />
        </Col>
        <Col md="6">
          <div className="d-flex justify-content-end flex-wrap gap-2">
            {/* Sort Dropdown */}
            <div className="position-relative">
              <button
                className={`btn btn-outline-secondary btn-sm`}
                style={{ backgroundColor: "#02339a", color: "#fff" }}
                onClick={() =>
                  activeTab === "cancellations"
                    ? setCancelSortDropdownOpen(!cancelSortDropdownOpen)
                    : setReturnSortDropdownOpen(!returnSortDropdownOpen)}
              >
                Sort By <RiArrowDropDownLine size={20} />
              </button>
              {(activeTab === "cancellations"
                ? cancelSortDropdownOpen
                : returnSortDropdownOpen) &&
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{ width: "220px", zIndex: 1000 }}
                >
                  {(activeTab === "cancellations"
                    ? [
                        { label: "Date", field: "Date" },
                        { label: "Amount", field: "Amount (₹)" },
                        { label: "Customer Name", field: "Customer Name" }
                      ]
                    : [
                        { label: "Return Date", field: "Return Date" },
                        { label: "Amount", field: "Amount (₹)" },
                        { label: "Customer Name", field: "Customer Name" }
                      ]).map(({ label, field }) =>
                    <div
                      key={field}
                      className="dropdown-item"
                      onClick={() =>
                        activeTab === "cancellations"
                          ? handleCancelSortSelect(field)
                          : handleReturnSortSelect(field)}
                    >
                      {label}
                    </div>
                  )}
                </div>}
            </div>

            {/* Customize Columns */}
            <div className="position-relative">
              <button
                className="btn btn-outline-primary btn-sm text-white"
                style={{ backgroundColor: "#02339a" }}
                onClick={() =>
                  activeTab === "cancellations"
                    ? setCancelDropdownOpen(!cancelDropdownOpen)
                    : setReturnDropdownOpen(!returnDropdownOpen)}
              >
                Customize Columns <RiArrowDropDownLine size={20} />
              </button>
              {(activeTab === "cancellations"
                ? cancelDropdownOpen
                : returnDropdownOpen) &&
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{
                    maxHeight: "280px",
                    overflowY: "auto",
                    zIndex: 1000,
                    minWidth: "220px"
                  }}
                >
                  <strong className="px-2 d-block">Customize Columns</strong>
                  {(activeTab === "cancellations"
                    ? cancelColumns
                    : returnColumns).map(col =>
                    <label
                      key={col.name}
                      className="dropdown-item d-flex align-items-center"
                    >
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={(activeTab === "cancellations"
                          ? cancelVisibleColumns
                          : returnVisibleColumns).includes(col.name)}
                        onChange={() =>
                          activeTab === "cancellations"
                            ? toggleCancelColumn(col.name)
                            : toggleReturnColumn(col.name)}
                      />
                      {col.name}
                    </label>
                  )}
                  <hr />
                  <div className="px-2">
                    <div
                      className="dropdown-item text-primary"
                      onClick={() =>
                        activeTab === "cancellations"
                          ? applyCancelPreset("Default View")
                          : applyReturnPreset("Default View")}
                    >
                      Default View
                    </div>
                    <div
                      className="dropdown-item text-primary"
                      onClick={() =>
                        activeTab === "cancellations"
                          ? applyCancelPreset("Full View")
                          : applyReturnPreset("Full View")}
                    >
                      Full View
                    </div>
                  </div>
                </div>}
            </div>

            {/* Export CSV */}
            <CSVLink
              data={
                activeTab === "cancellations"
                  ? cancelSelectedRows.length
                    ? cancelSelectedRows
                    : filteredAndSortedCancelOrders
                  : returnSelectedRows.length
                    ? returnSelectedRows
                    : filteredAndSortedReturns
              }
              filename={
                activeTab === "cancellations"
                  ? "cancel_orders.csv"
                  : "logistics_returns.csv"
              }
              style={{ backgroundColor: "#02339a" }}
              className="btn btn-success btn-sm text-white"
            >
              Export CSV
            </CSVLink>
          </div>
        </Col>
      </Row>

      <hr />

      {/* DataTable */}
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <DataTable
                columns={
                  activeTab === "cancellations"
                    ? cancelColumnsToShow
                    : returnColumnsToShow
                }
                data={
                  activeTab === "cancellations"
                    ? filteredAndSortedCancelOrders
                    : filteredAndSortedReturns
                }
                pagination
                striped
                responsive
                selectableRows
                onSelectedRowsChange={
                  activeTab === "cancellations"
                    ? handleCancelRowSelected
                    : handleReturnRowSelected
                }
                highlightOnHover
                persistTableHead
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CancellationsAndReturns;