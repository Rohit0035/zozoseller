import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import {
  Card,
  CardBody,
  Col,
  Row
} from "reactstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaQrcode, FaFileInvoice, FaShippingFast, FaCheck } from "react-icons/fa";
import QRCode from "qrcode";
import { Document, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdf from "./InvoicePdf";
import { UpdateVendorOrderStatus } from "../../api/vendorOrderAPI";
import { useDispatch } from "react-redux";

// ✅ Keep same structure
const allColumns = () => [
  {
  name: "S.No.",
  cell: (row, index) => index + 1,
  width: "80px"
},

  { name: "Order ID", selector: row => row.orderUniqueId, sortable: true },

  {
    name: "Product Information",
    selector: row => row.productInfo,
    sortable: true
  },

  { name: "Amount", selector: row => row.amount, sortable: true, right: true },

  {
    name: "Dispatch By Date",
    selector: row => row.dispatchDate,
    sortable: true
  },

  { name: "Status", selector: row => row.status, sortable: true },
];

const presets = {
  "Default View": [
    "Order ID",
    "Product Information",
    "Amount",
    "Status"
  ]
};

const UpcomingOrderList = ({ orders, fetchOrders,ALL_ALLOWED_STATUSES }) => {
  const dispatch = useDispatch();

  const [visibleColumns, setVisibleColumns] = useState(presets["Default View"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "orderId",
    order: "desc"
  });

  // ================= FILTER + SORT =================

  const filteredData = orders
    .filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      const field = sortConfig.field;
      const valA = a[field];
      const valB = b[field];

      if (sortConfig.order === "desc") return valA < valB ? 1 : -1;
      return valA > valB ? 1 : -1;
    });

  const toggleColumn = (colName) => {
    setVisibleColumns(prev =>
      prev.includes(colName)
        ? prev.filter(c => c !== colName)
        : [...prev, colName]
    );
  };

  const columnsToShow = allColumns().filter(col => visibleColumns.includes(col.name));

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  // ================= UI =================

  return (
    <div>
      <Row className="mt-2">
        <Col md="4">
          <input
            className="form-control"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Col>

        <Col md="8">
          <div className="d-flex justify-content-end">

            {/* Columns */}
            <div className="position-relative me-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Customize Columns <RiArrowDropDownLine size={20} />
              </button>

              {dropdownOpen && (
                <div className="position-absolute bg-white border p-2 shadow" style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    zIndex: 1000
                  }}>
                  {presets["Default View"].map(col => (
                    <label key={col}>
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col)}
                        onChange={() => toggleColumn(col)}
                      />
                      {col}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* CSV */}
            <CSVLink
              data={selectedRows.length ? selectedRows : filteredData}
              filename="pending_rtd.csv"
              className="btn btn-success btn-sm"
            >
              Export CSV
            </CSVLink>
          </div>
        </Col>
      </Row>

      <hr />

      <Card>
        <CardBody>
          <DataTable
            columns={columnsToShow}
            data={filteredData}
            pagination
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            highlightOnHover
            responsive
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default UpcomingOrderList;