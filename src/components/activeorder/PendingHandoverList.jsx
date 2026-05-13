import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { Card, CardBody, Col, Row } from "reactstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
import { UpdateVendorOrderStatus } from "../../api/vendorOrderAPI";
import { useDispatch } from "react-redux";

// ✅ Columns with Action
const allColumns = handleSingleHandover => [
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

  { name: "Handover Date", selector: row => row.handoverDate, sortable: true },

  { name: "Status", selector: row => row.status, sortable: true },

  {
    name: "Action",
    cell: row =>
      <button
        className="btn btn-sm btn-success"
        disabled={row.status === "Handover Completed"}
        onClick={() => handleSingleHandover(row.id)}
      >
        Mark Dispatch
      </button>
  }
];

const PendingHandoverList = ({
  orders = [],
  fetchOrders,
  ALL_ALLOWED_STATUSES
}) => {
  const dispatch = useDispatch();

  const [visibleColumns, setVisibleColumns] = useState(
    allColumns(() => {}).map(col => col.name)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [sortConfig, setSortConfig] = useState({
    field: "orderId",
    order: "desc"
  });

  // ================= HANDLERS =================

  const handleSingleHandover = async id => {
    dispatch({ type: "loader", loader: true });

    try {
      const res = await UpdateVendorOrderStatus({
        id,
        status: "In Transit"
      });

      if (res.success) {
        fetchOrders({
          orderStatus: ALL_ALLOWED_STATUSES
        });
      }
    } finally {
      dispatch({ type: "loader", loader: false });
    }
  };

  const handleBulkHandover = async () => {
    if (!selectedRows.length) return;

    dispatch({ type: "loader", loader: true });

    try {
      await Promise.all(
        selectedRows.map(row =>
          UpdateVendorOrderStatus({
            id: row.id,
            status: "In Transit"
          })
        )
      );

      fetchOrders({
        orderStatus: ALL_ALLOWED_STATUSES
      });
      setSelectedRows([]); // clear selection after update
    } finally {
      dispatch({ type: "loader", loader: false });
    }
  };

  // ================= FILTER + SORT =================

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
      return valA > valB ? 1 : -1;
    });

  const toggleColumn = colName => {
    setVisibleColumns(
      prev =>
        prev.includes(colName)
          ? prev.filter(c => c !== colName)
          : [...prev, colName]
    );
  };

  const handleRowSelected = state => {
    setSelectedRows(state.selectedRows);
  };

  const columnsToShow = allColumns(handleSingleHandover).filter(col =>
    visibleColumns.includes(col.name)
  );

  // ================= UI =================

  return (
    <div>
      <Row className="mt-2">
        <Col md="6">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </Col>

        <Col md="6">
          <div className="d-flex justify-content-end">
            {/* Columns */}
            <div className="position-relative me-2">
              <button
                className="btn btn-warning btn-sm me-2"
                disabled={!selectedRows.length}
                onClick={handleBulkHandover}
              >
                Mark Dispatch ({selectedRows.length})
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Customize Columns <RiArrowDropDownLine size={20} />
              </button>

              {dropdownOpen &&
                <div
                  className="position-absolute bg-white border p-2 shadow"
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    zIndex: 1000
                  }}
                >
                  {allColumns(() => {}).map(col =>
                    <label key={col.name}>
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.name)}
                        onChange={() => toggleColumn(col.name)}
                      />
                      {col.name}
                    </label>
                  )}
                </div>}
            </div>

            {/* ✅ Bulk Handover */}

            {/* CSV */}
            <CSVLink
              data={selectedRows.length ? selectedRows : filteredData}
              filename="pending_handover.csv"
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

export default PendingHandoverList;
