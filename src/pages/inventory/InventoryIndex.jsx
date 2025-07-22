import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  Col,
  Row,
} from "reactstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
// Removed Link from react-router-dom for counter cards as we'll use onClick
import {
  FaList,
  FaExclamationCircle,
  FaHourglassHalf,
  FaCheckCircle,
  FaDownload,
} from "react-icons/fa";
import { GetInventories } from "../../api/inventoryAPI"; // Assuming this is your API call
import { showToast } from "../../components/ToastifyNotification";
import { useDispatch } from "react-redux";

const allColumns = [
  { name: "Product Title", selector: (row) => row.title, sortable: true },
  { name: "SKU", selector: (row) => row.sku, sortable: true },
  { name: "Category", selector: (row) => row.category, sortable: true },
  {
    name: "Warehouse Location",
    selector: (row) => row.warehouseLocation,
    sortable: true,
  },
  {
    name: "Reorder Level",
    selector: (row) => row.reorderLevel,
    sortable: true,
    right: true,
  },
  { name: "Supplier", selector: (row) => row.supplier, sortable: true },
  { name: "Creation Time", selector: (row) => row.created, sortable: true },
  { name: "Update Time", selector: (row) => row.updated, sortable: true },
  {
    name: "Current Stock",
    selector: (row) => row.stock,
    sortable: true,
    right: true,
  },
  { name: "Sales", selector: (row) => row.sales, sortable: true, right: true },
  {
    name: "Damaged",
    selector: (row) => row.damaged,
    sortable: true,
    right: true,
  },
  {
    name: "Reserved",
    selector: (row) => row.reserved,
    sortable: true,
    right: true,
  },
  {
    name: "Procurement SLA",
    selector: (row) => row.procurementSLA,
    sortable: true,
  },
  { name: "Fulfillment", selector: (row) => row.fulfillment, sortable: true },
  {
    name: "Listing Price",
    selector: (row) => row.listingPrice,
    sortable: true,
    right: true,
  },
  {
    name: "Final Price",
    selector: (row) => row.finalPrice,
    sortable: true,
    right: true,
  },
  { name: "MRP", selector: (row) => row.mrp, sortable: true, right: true },
  { name: "Returns", selector: (row) => row.returns, sortable: true },
  {
    name: "Listing Quality",
    selector: (row) => row.listingQuality,
    sortable: true,
  },
  {
    name: "Additional Info",
    selector: (row) => row.additionalInfo,
    sortable: false,
  },
  { name: "Action", selector: (row) => row.action, sortable: false },
];

const presets = {
  "Default View": [
    "Product Title",
    "SKU",
    "Current Stock",
    "Sales",
    "Reorder Level",
  ],
  "Full View": allColumns.map((col) => col.name),
};

const InventoryIndex = () => {
  const [data, setData] = useState([]); // Stores all raw data from API
  const [filteredData, setFilteredData] = useState([]); // Stores data after text filter and active filter
  const [activeFilter, setActiveFilter] = useState("All Inventory"); // New state for counter filters
  const dispatch = useDispatch();

  // Function to apply filters based on the activeFilter state
  const applyCounterFilter = useCallback((inventoryItems, currentFilter) => {
    switch (currentFilter) {
      case "Low Stock":
        // Assuming reorderLevel is the threshold for low stock
        return inventoryItems.filter(
          (item) => item.stock <= item.reorderLevel && item.stock > 0
        );
      case "Out of Stock":
        return inventoryItems.filter((item) => item.stock === 0);
      case "Recommendations":
        // For recommendations, you want all data, so it behaves like "All Inventory"
        return inventoryItems;
      case "All Inventory":
      default:
        return inventoryItems;
    }
  }, []); // useCallback memoizes the function

  const fetchInventories = async () => {
    dispatch({ type: "loader", loader: true });

    try {
      const response = await GetInventories();
      console.log("API Response:", response);

      if (response.success === true && response.data) {
        const formattedData = response.data.map((item) => ({
          id: item._id,
          title: item.name,
          sku: item.sku,
          category: item.product?.categoryId?.name || "N/A",
          warehouseLocation: item.more || "N/A",
          reorderLevel: item.minStockQty,
          supplier: item.product?.vendorId?.name || "N/A",
          created: item.product.createdAt
            ? new Date(item.product.createdAt).toLocaleDateString()
            : "N/A",
          updated: item.product.updatedAt
            ? new Date(item.product.updatedAt).toLocaleDateString()
            : "N/A",
          stock: item.currentStock,
          sales: item.sold,
          damaged: item.adjusted,
          reserved: 0, // Placeholder
          procurementSLA: "N/A", // Placeholder
          fulfillment: "N/A", // Placeholder
          listingPrice:
            item.productVariation?.regularPrice ||
            item.product?.regularPrice ||
            "N/A",
          finalPrice:
            item.productVariation?.salePrice || item.product?.salePrice || "N/A",
          mrp:
            item.productVariation?.regularPrice ||
            item.product?.regularPrice ||
            "N/A",
          returns: `${item.returned || 0}%`,
          listingQuality: item.status,
          additionalInfo: item.description,
          action: "Edit/Delete",
        }));

        showToast(
          "success",
          response.message || "Inventories fetched successfully!"
        );
        setData(formattedData); // Set the raw fetched data
        // Initial filtering based on the default activeFilter
        setFilteredData(applyCounterFilter(formattedData, activeFilter));
      } else {
        showToast("error", response.message || "Failed to fetch inventories.");
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
      showToast(
        "error",
        "Error fetching inventories: " + (error.message || "Unknown error")
      );
    } finally {
      dispatch({ type: "loader", loader: false });
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []); // Run once on component mount

  const [visibleColumns, setVisibleColumns] = useState(presets["Default View"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "sales",
    order: "desc",
  });

  // Main useEffect for filtering and sorting
  useEffect(() => {
    // First, apply the counter filter to the raw data
    let currentDataAfterCounterFilter = applyCounterFilter(data, activeFilter);

    // Then, apply the text search filter
    let finalFilteredData = currentDataAfterCounterFilter.filter((item) =>
      Object.values(item).some(
        (val) =>
          val && val.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );

    // Finally, apply sorting
    if (sortConfig.field) {
      finalFilteredData.sort((a, b) => {
        const valA = a[sortConfig.field];
        const valB = b[sortConfig.field];

        if (typeof valA === "string" && typeof valB === "string") {
          return sortConfig.order === "desc"
            ? valB.localeCompare(valA)
            : valA.localeCompare(valB);
        }

        if (sortConfig.order === "desc") {
          return valA < valB ? 1 : -1;
        } else {
          return valA > valB ? 1 : -1;
        }
      });
    }
    setFilteredData(finalFilteredData);
  }, [filterText, sortConfig, data, activeFilter, applyCounterFilter]); // Dependencies updated

  const toggleColumn = (colName) => {
    setVisibleColumns((prev) =>
      prev.includes(colName) ? prev.filter((c) => c !== colName) : [...prev, colName]
    );
  };

  const applyPreset = (preset) => {
    setVisibleColumns(presets[preset]);
    setDropdownOpen(false);
  };

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const handleSortSelect = (field, order = "desc") => {
    setSortConfig({ field, order });
    setSortDropdownOpen(false);
  };

  const columnsToShow = allColumns.filter((col) =>
    visibleColumns.includes(col.name)
  );

  // You might want to dynamically calculate these counts based on `data` (all raw data)
  const lowStockCount = data.filter(
    (item) => item.stock <= item.reorderLevel && item.stock > 0
  ).length;
  const outOfStockCount = data.filter((item) => item.stock === 0).length;
  const allInventoryCount = data.length;
  const recommendationsCount = data.length; // Assuming recommendations show all data for now

  const counters = [
    {
      title: "All Inventory",
      count: allInventoryCount,
      icon: <FaList size={30} color="#fff" />,
      bgColor: "#6c757d",
      textColor: "#fff",
    },
    {
      title: "Low Stock",
      count: lowStockCount,
      icon: <FaExclamationCircle size={30} color="#fff" />,
      bgColor: "#dc3545",
      textColor: "#fff",
    },
    {
      title: "Out of Stock",
      count: outOfStockCount,
      icon: <FaHourglassHalf size={30} color="#fff" />,
      bgColor: "#ffc107",
      textColor: "#000",
    },
    {
      title: "Recommendations",
      count: recommendationsCount, // Display total count for recommendations as per logic
      icon: <FaCheckCircle size={30} color="#fff" />,
      bgColor: "#28a745",
      textColor: "#fff",
    },
  ];

  return (
    <div>
      <Row>
        <Col md="12">
          <Breadcrumb className="my-2">
            <BreadcrumbItem>
              <h5>Inventory</h5>
            </BreadcrumbItem>
            <BreadcrumbItem active>Home</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      {/* Inventory Summary Counters */}
      <Row>
        {counters.map((item, index) => (
          <Col key={index} md="3" sm="6" xs="12" className="mb-3">
            {/* Removed <Link> component to handle clicks directly */}
            <Card
              className="text-start shadow-sm"
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
                cursor: "pointer", // Indicate it's clickable
                border:
                  activeFilter === item.title ? "2px solid #007bff" : "none", // Highlight active filter
              }}
              onClick={() => setActiveFilter(item.title)} // Set active filter on click
            >
              <CardBody className="p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3
                      className="text-white"
                      style={{ color: item.textColor }}
                    >
                      {item.count}
                    </h3>
                    <h5
                      className="mb-1 fs-6 fw-bold text-white"
                      style={{ color: item.textColor }}
                    >
                      {item.title}
                    </h5>
                  </div>
                  <div>{item.icon}</div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md="6" className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search SKU, Product Title or Supplier"
            style={{ maxWidth: "250px" }}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Col>
        <Col md="6">
          <div className="d-flex align-items-end justify-content-end">
            {/* Sort Dropdown */}
            <div className="position-relative me-2">
              <button
                className="btn btn-outline-secondary text-white btn-sm"
                style={{ backgroundColor: "#02339a" }}
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                Sort By <RiArrowDropDownLine size={20} />
              </button>
              {sortDropdownOpen && (
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{ width: "220px", zIndex: 1000, cursor: "pointer" }}
                >
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("title")}
                  >
                    Product Title
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("created")}
                  >
                    Creation Time
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("updated")}
                  >
                    Update Time
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("stock")}
                  >
                    Current Stock
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("sales")}
                  >
                    Sales
                  </div>
                </div>
              )}
            </div>
            {/* Customize Columns Dropdown */}
            <div className="position-relative me-2">
              <button
                className="btn btn-outline-primary text-white btn-sm"
                style={{ backgroundColor: "#02339a" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Customize Columns <RiArrowDropDownLine size={20} />
              </button>
              {dropdownOpen && (
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{
                    width: "auto",
                    maxHeight: "280px",
                    overflowY: "auto",
                    zIndex: 1000,
                    cursor: "pointer",
                  }}
                >
                  <strong className="px-2 d-block">Customize Columns</strong>
                  {allColumns.map((col) => (
                    <label
                      key={col.name}
                      className="dropdown-item d-flex align-items-center"
                    >
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={visibleColumns.includes(col.name)}
                        onChange={() => toggleColumn(col.name)}
                      />
                      {col.name}
                    </label>
                  ))}
                  <hr />
                  <div className="px-2">
                    <div
                      className="dropdown-item text-primary"
                      onClick={() => applyPreset("Default View")}
                    >
                      Default View
                    </div>
                    <div
                      className="dropdown-item text-primary"
                      onClick={() => applyPreset("Full View")}
                    >
                      Full View
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* CSV Export */}
            <CSVLink
              data={selectedRows.length ? selectedRows : filteredData}
              filename="inventory_list.csv"
              style={{ backgroundColor: "#02339a" }}
              className="btn btn-success text-white btn-sm"
            >
              Export CSV
            </CSVLink>
          </div>
        </Col>
      </Row>
      <hr />

      <Row>
        <Col md="12">
          <Card>
            <CardBody>
              <DataTable
                columns={columnsToShow}
                data={filteredData}
                pagination
                striped
                responsive
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                highlightOnHover
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InventoryIndex;