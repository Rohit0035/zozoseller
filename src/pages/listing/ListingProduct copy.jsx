import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { Col, Row } from "reactstrap";
import { RiArrowDropDownLine } from "react-icons/ri";

const demoProducts = [
  {
    id: 1,
    title: "iPhone 14",
    created: "2024-01-10",
    updated: "2024-05-01",
    sales: 300,
    productDetails: "Latest Apple iPhone model",
    listingPrice: 799,
    benchmarkPrice: 850,
    finalPrice: 780,
    mrp: 899,
    stock: 25,
    returns: "5%",
    isNew: true,
    fulfillment: "Fulfilled by Seller",
    procurementSLA: "2 days",
    listingQuality: "High",
    additionalInfo: "Comes with 1 year warranty",
    action: "Edit/Delete"
  },
  {
    id: 2,
    title: "Galaxy S23",
    created: "2024-02-15",
    updated: "2024-05-03",
    sales: 450,
    productDetails: "Samsung flagship phone",
    listingPrice: 699,
    benchmarkPrice: 750,
    finalPrice: 690,
    mrp: 799,
    stock: 40,
    returns: "3%",
    isNew: false,
    fulfillment: "Fulfilled by Amazon",
    procurementSLA: "1 day",
    listingQuality: "Medium",
    additionalInfo: "Includes free case",
    action: "Edit/Delete"
  },
  {
    id: 3,
    title: "MacBook Air",
    created: "2023-12-05",
    updated: "2024-05-02",
    sales: 150,
    productDetails: "Lightweight Apple laptop",
    listingPrice: 999,
    benchmarkPrice: 1050,
    finalPrice: 980,
    mrp: 1099,
    stock: 10,
    returns: "2%",
    isNew: false,
    fulfillment: "Fulfilled by Seller",
    procurementSLA: "3 days",
    listingQuality: "High",
    additionalInfo: "Includes free software package",
    action: "Edit/Delete"
  },
  {
    id: 4,
    title: "Dell XPS",
    created: "2023-11-01",
    updated: "2024-05-01",
    sales: 210,
    productDetails: "Dell premium laptop",
    listingPrice: 850,
    benchmarkPrice: 900,
    finalPrice: 830,
    mrp: 899,
    stock: 15,
    returns: "4%",
    isNew: true,
    fulfillment: "Fulfilled by Amazon",
    procurementSLA: "2 days",
    listingQuality: "High",
    additionalInfo: "Includes free backpack",
    action: "Edit/Delete"
  }
];

// Columns including new fields
const allColumns = [
  { name: "Product Title", selector: row => row.title, sortable: true },
  { name: "Creation Time", selector: row => row.created, sortable: true },
  { name: "Update Time", selector: row => row.updated, sortable: true },
  { name: "Sales", selector: row => row.sales, sortable: true },
  {
    name: "Product Details",
    selector: row => row.productDetails,
    sortable: true
  },
  {
    name: "Listing Price",
    selector: row => row.listingPrice,
    sortable: true,
    right: true
  },
  {
    name: "Benchmark Price",
    selector: row => row.benchmarkPrice,
    sortable: true,
    right: true
  },
  {
    name: "Final Price",
    selector: row => row.finalPrice,
    sortable: true,
    right: true
  },
  { name: "MRP", selector: row => row.mrp, sortable: true, right: true },
  { name: "Stock", selector: row => row.stock, sortable: true, right: true },
  { name: "Returns", selector: row => row.returns, sortable: true },
  { name: "New", selector: row => (row.isNew ? "Yes" : "No"), sortable: true },
  { name: "Fulfillment", selector: row => row.fulfillment, sortable: true },
  {
    name: "Procurement SLA",
    selector: row => row.procurementSLA,
    sortable: true
  },
  {
    name: "Listing Quality",
    selector: row => row.listingQuality,
    sortable: true
  },
  {
    name: "Additional Info",
    selector: row => row.additionalInfo,
    sortable: false
  },
  { name: "Action", selector: row => row.action, sortable: false }
];

const presets = {
  "Default View": ["Product Title", "Sales"],
  "Full View": allColumns.map(col => col.name)
};

const ListingProduct = () => {
  const [visibleColumns, setVisibleColumns] = useState(presets["Default View"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "sales",
    order: "desc"
  });

  // Filtered & Sorted Data
  const filteredData = demoProducts
    .filter(item =>
      Object.values(item).some(val =>
        val.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      const field = sortConfig.field;
      const valA = a[field];
      const valB = b[field];
      if (sortConfig.order === "desc") return valA < valB ? 1 : -1;
      else return valA > valB ? 1 : -1;
    });

  const toggleColumn = colName => {
    setVisibleColumns(
      prev =>
        prev.includes(colName)
          ? prev.filter(c => c !== colName)
          : [...prev, colName]
    );
  };

  const applyPreset = preset => {
    setVisibleColumns(presets[preset]);
  };

  const handleRowSelected = state => {
    setSelectedRows(state.selectedRows);
  };

  const handleSortSelect = (field, order = "desc") => {
    setSortConfig({ field, order });
    setSortDropdownOpen(false);
  };

  const columnsToShow = allColumns.filter(col =>
    visibleColumns.includes(col.name)
  );

  return (
    <div className="">
      <Row>
        <Col md="6" className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search for FSN, Title or SKU ID"
            style={{ maxWidth: "250px" }}
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </Col>
        <Col md="6">
          <div className="d-flex align-items-end justify-content-end">
            <div className="position-relative me-2">
              <button
                className="btn btn-outline-secondary text-white btn-sm"
                style={{ backgroundColor: "#02339a" }}
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                Sort By <RiArrowDropDownLine size={20} />
              </button>
              {sortDropdownOpen &&
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{ width: "200px", zIndex: 1000, cursor: "pointer" }}
                >
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("title", "desc")}
                  >
                    Product Title (DESC)
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
                    onClick={() => handleSortSelect("sales")}
                  >
                    Sales (Default)
                  </div>
                </div>}
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
              {dropdownOpen &&
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{
                    width: "280px",
                    maxHeight: "260px",
                    overflowY: "auto",
                    zIndex: 1000,
                    cursor: "pointer"
                  }}
                >
                  <strong className="px-2 d-block">Customize Columns</strong>
                  {allColumns.map(col =>
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
                  )}
                  <hr />
                  <div className="px-2">
                    <div
                      className="dropdown-item text-primary"
                      onClick={() => applyPreset("Default View")}
                    >
                      Default View
                    </div>
                    <div
                      className="dropdown-item text-primary "
                      onClick={() => applyPreset("Full View")}
                    >
                      Full View
                    </div>
                  </div>
                </div>}
            </div>
            <CSVLink
              data={selectedRows.length ? selectedRows : filteredData}
              style={{ backgroundColor: "#02339a" }}
              filename="product_list.csv"
              className="btn btn-success text-white btn-sm"
            >
              Export CSV
            </CSVLink>
          </div>
        </Col>
      </Row>
      <hr />
      {/* Responsive Table */}
      <div className="table-responsive">
        <DataTable
          columns={columnsToShow}
          data={filteredData}
          pagination
          striped
          // dense
          selectableRows
          onSelectedRowsChange={handleRowSelected}
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default ListingProduct;
