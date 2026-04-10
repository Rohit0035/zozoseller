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

// ✅ QR Dependencies
import { QRCodeCanvas } from "qrcode.react";
import { FaDownload } from "react-icons/fa";
import { UpdateVendorOrderStatus } from "../../api/vendorOrderAPI";
import { useDispatch } from "react-redux";

const AllOrderList = ({ orders,fetchOrders }) => {
  const dispatch = useDispatch();
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  // ✅ QR DATA
  const getQrData = (row) =>
    JSON.stringify({
      orderUniqueId: row.orderUniqueId,
      subOrderUniqueId: row.subOrderUniqueId,
      skuNo: row.skuNo,
    });

  // ✅ SINGLE QR DOWNLOAD
  const downloadQR = async (row) => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    const { createRoot } = await import("react-dom/client");
    const root = createRoot(div);

    root.render(
      <QRCodeCanvas value={getQrData(row)} size={150} />
    );

    setTimeout(() => {
      const canvas = div.querySelector("canvas");
      const link = document.createElement("a");

      link.download = `${row.orderUniqueId}_${row.skuNo}_qr.png`;
      link.href = canvas.toDataURL();
      link.click();

      root.unmount();
      div.remove();
    }, 300);

    await handleChangeOrderStatus("Processing", row.id);
  };

  const handleChangeOrderStatus = async (status, id) => {		
      dispatch({ type: 'loader', loader: true })

      try {
        const statusData = {
          status: status,
          id: id
        }
        const response = await UpdateVendorOrderStatus(statusData);

        if (response.success == true) {
          fetchOrders({orderStatus: ['Pending', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered']});
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      } finally {
        dispatch({ type: 'loader', loader: false })
      }
	};

  // ✅ TABLE COLUMNS (UPDATED WITH QR BUTTON)
  const allColumns = [
    { name: "S.No", selector: row => row.index, width: "8%" },
    { name: "Order ID", selector: row => row.orderUniqueId, width: "10%" },
    { name: "Sub Order ID", selector: row => row.subOrderUniqueId, width: "25%" },
    { name: "Product Info", selector: row => row.productInfo, width: "25%" },
    { name: "SKU No", selector: row => row.skuNo, width: "20%" },
    { name: "Amount", selector: row => row.amount, width: "10%" },
    { name: "Status", selector: row => row.status, width: "10%" },

    // ✅ NEW QR COLUMN
    {
      name: "QR",
      cell: (row) => (
        
        (row.status=="Pending" || row.status=="Processing") && 
        <button
          className="btn btn-sm btn-success"
          onClick={() => downloadQR(row)}
        >
          {row.status=="Pending" && "Download QR"}
          {row.status=="Processing" && "Re-Download QR"}
        </button>
      ),
      width: "15%",
    }
  ];

  // Default visible columns
  const presets = {
    "Default View": allColumns.map(col => col.name),
  };

  const [visibleCols, setVisibleCols] = useState(presets["Default View"]);

  const toggleColumn = colName => {
    setVisibleCols(prev =>
      prev.includes(colName)
        ? prev.filter(c => c !== colName)
        : [...prev, colName]
    );
  };

  const applyPreset = preset => {
    setVisibleCols(presets[preset]);
    setDropdownOpen(false);
  };

  const handleRowSelected = state => {
    setSelectedRows(state.selectedRows);
  };

  // ✅ FILTER
  const filteredData = orders.filter(item =>
    item.orderId?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.productInfo?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.skuNo?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.amount?.toLowerCase().includes(filterText.toLowerCase()) ||
    item.status?.toLowerCase().includes(filterText.toLowerCase())
  );

  const columnsToShow = allColumns.filter(col =>
    visibleCols.includes(col.name)
  );

  return (
    <div>
      <Row className="mt-2">
        <Col md="6" className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            style={{ maxWidth: "250px" }}
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </Col>

        <Col md="6">
          <div className="d-flex justify-content-end">
            {/* Customize Columns */}
            <div className="position-relative me-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Customize Columns <RiArrowDropDownLine size={20} />
              </button>

              {dropdownOpen && (
                <div
                  className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    zIndex: 1000
                  }}
                >
                  <strong className="px-2 d-block">Select Columns</strong>

                  {allColumns.map(col => (
                    <label
                      key={col.name}
                      className="dropdown-item d-flex align-items-center"
                    >
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={visibleCols.includes(col.name)}
                        onChange={() => toggleColumn(col.name)}
                      />
                      {col.name}
                    </label>
                  ))}

                  <hr />

                  <div
                    className="dropdown-item text-primary"
                    onClick={() => applyPreset("Default View")}
                  >
                    Reset View
                  </div>
                </div>
              )}
            </div>

            {/* CSV Export */}
            <CSVLink
              data={selectedRows.length ? selectedRows : filteredData}
              filename="orders.csv"
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
                highlightOnHover
                // selectableRows
                // onSelectedRowsChange={handleRowSelected}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AllOrderList;