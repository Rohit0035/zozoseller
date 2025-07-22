import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  Col,
  Row
} from "reactstrap";
import { RiArrowDropDownLine } from "react-icons/ri";

const demoInTransitOrders = [
  {
    id: 1,
    orderId: "TR-4001",
    productInfo: "iPhone 14 - 128GB - Black",
    amount: "$799",
    trackingId: "TRK123456",
    status: "In Transit"
  },
  {
    id: 2,
    orderId: "TR-4002",
    productInfo: "Galaxy S23 - 256GB - Grey",
    amount: "$699",
    trackingId: "TRK123457",
    status: "In Transit"
  },
  {
    id: 3,
    orderId: "TR-4003",
    productInfo: "MacBook Air - 13 inch",
    amount: "$999",
    trackingId: "TRK123458",
    status: "Out for Delivery"
  },
  {
    id: 4,
    orderId: "TR-4004",
    productInfo: "Dell XPS 15",
    amount: "$850",
    trackingId: "TRK123459",
    status: "In Transit"
  }
];

const allColumns = [
  { name: "Order ID", selector: row => row.orderId, sortable: true },
  {
    name: "Product Information",
    selector: row => row.productInfo,
    sortable: true
  },
  { name: "Amount", selector: row => row.amount, sortable: true, right: true },
  { name: "Tracking ID", selector: row => row.trackingId, sortable: true },
  { name: "Status", selector: row => row.status, sortable: true }
];

const presets = {
  "Default View": allColumns.map(col => col.name),
  "Full View": allColumns.map(col => col.name)
};

const InTransitList = ({ orders }) => {
  const [visibleColumns, setVisibleColumns] = useState(presets["Default View"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "orderId",
    order: "desc"
  });

  const filteredData = orders
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
    setDropdownOpen(false);
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
    <div>
      <Row className="mt-2">
        <Col md="6" className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Order ID, Product Info, Status"
            style={{ maxWidth: "250px" }}
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </Col>
        <Col md="6">
          <div className="d-flex align-items-end justify-content-end">
            {/* Sort Dropdown */}
            <div className="position-relative me-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                Sort By <RiArrowDropDownLine size={20} />
              </button>
              {sortDropdownOpen &&
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{ width: "180px", zIndex: 1000 }}
                >
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("orderId")}
                  >
                    Order ID
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("trackingId")}
                  >
                    Tracking ID
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={() => handleSortSelect("amount")}
                  >
                    Amount
                  </div>
                </div>}
            </div>

            {/* Customize Columns */}
            <div className="position-relative me-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Customize Columns <RiArrowDropDownLine size={20} />
              </button>
              {dropdownOpen &&
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    zIndex: 1000
                  }}
                >
                  <strong className="px-2 d-block">Select Columns</strong>
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
                      className="dropdown-item text-primary"
                      onClick={() => applyPreset("Full View")}
                    >
                      Full View
                    </div>
                  </div>
                </div>}
            </div>

            {/* Export CSV */}
            <CSVLink
              data={selectedRows.length ? selectedRows : filteredData}
              filename="in_transit_orders.csv"
              className="btn btn-primary btn-sm"
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

export default InTransitList;
