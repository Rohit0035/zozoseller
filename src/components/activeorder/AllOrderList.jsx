import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import { RiArrowDropDownLine } from "react-icons/ri";

import { QRCodeCanvas } from "qrcode.react";
import { generateShippingLabels, UpdateVendorOrderPackageDetails, UpdateVendorOrderStatus } from "../../api/vendorOrderAPI";
import { useDispatch } from "react-redux";
import QRCode from "qrcode";
import { Document, pdf, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdf from "./InvoicePdf";
import MultiInvoicePdf from "./MultipleInvoicePdf";

import axios from "axios";
import { FaFileInvoice, FaQrcode, FaShippingFast } from "react-icons/fa";
import { showToast } from "../ToastifyNotification";

const AllOrderList = ({ orders, fetchOrders,ALL_ALLOWED_STATUSES }) => {
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  // ✅ NEW: Label Modal
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [packageData, setPackageData] = useState({});

  // ================= QR =================
  const getQrData = (row) =>
    JSON.stringify({
      orderUniqueId: row.orderUniqueId,
      subOrderUniqueId: row.subOrderUniqueId,
      skuNo: row.skuNo,
    });

  const downloadQR = async (row) => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    const { createRoot } = await import("react-dom/client");
    const root = createRoot(div);

    root.render(<QRCodeCanvas value={getQrData(row)} size={150} />);

    setTimeout(() => {
      const canvas = div.querySelector("canvas");
      const link = document.createElement("a");

      link.download = `${row.orderUniqueId}_${row.skuNo}_qr.png`;
      link.href = canvas.toDataURL();
      link.click();

      root.unmount();
      div.remove();
    }, 300);
  };

  const generateQr = async (value) => {
    return await QRCode.toDataURL(value);
  };

  // ================= BULK INVOICE =================
  const handleBulkInvoiceDownload = async () => {
    if (!selectedRows.length) return;

    dispatch({ type: "loader", loader: true });

    try {
      const enrichedRows = await Promise.all(
        selectedRows.map(async (row) => ({
          ...row,
          order: {
            ...row.order,
            qr: await generateQr(
              row.order?.orderId?.orderUniqueId || ""
            ),
          },
        }))
      );

      const blob = await pdf(
        <MultiInvoicePdf orders={enrichedRows} />
      ).toBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "all_invoices.pdf";
      link.click();
    } finally {
      dispatch({ type: "loader", loader: false });
    }
  };

  // ================= LABEL LOGIC =================
  const openLabelModal = () => {
    const init = {};
    selectedRows.forEach((row) => {
      init[row.id] = {
        length: row.order?.packageDetails?.length || 0,
        breadth: row.order?.packageDetails?.breadth || 0,
        height: row.order?.packageDetails?.height || 0,
        weight: row.order?.packageDetails?.weight || 0,
      };
    });

    setPackageData(init);
    setShowLabelModal(true);
  };

  const handlePackageChange = (id, field, value) => {
    setPackageData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const updateSinglePackage = async (orderId) => {
    const pkg = packageData[orderId];

    if (!pkg?.length || !pkg?.breadth || !pkg?.height || !pkg?.weight) {
      return showToast("error", "Fill all fields");
    }

    dispatch({ type: "loader", loader: true });

    try {
      const res = await UpdateVendorOrderPackageDetails({
        orderId,
        length: pkg.length,
        breadth: pkg.breadth,
        height: pkg.height,
        weight: pkg.weight,
      });

      if (res.success) {
        showToast("success", res.message);
        fetchOrders({orderStatus: ALL_ALLOWED_STATUSES});
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: "loader", loader: false });
    }
  };

  const handleGenerateLabels = async () => {
    const validOrders = selectedRows.filter(
      (row) => !row.order.label_url
    );

    const alreadyGenerated = selectedRows.filter(
      (row) => row.order.label_url
    );

    if (!validOrders.length) {
      return showToast("error", "All selected orders already have labels");
    }

    if (alreadyGenerated.length) {
      showToast(
        "warning",
        `${alreadyGenerated.length} orders skipped (labels already exist)`
      );
    }
    
    const payload = {
      orders: selectedRows.map((row) => ({
        orderId: row.id,
        packageDetails: packageData[row.id],
      })),
    };

    for (let item of payload.orders) {
      const p = item.packageDetails;
      if (!p.length || !p.breadth || !p.height || !p.weight) {
        return showToast("error", "Fill all fields");
      }
    }

    dispatch({ type: "loader", loader: true });

    try {
      const res = await generateShippingLabels(payload);

      if (res.success) {
        showToast("success", res.message);
        setShowLabelModal(false);
        setSelectedRows([]);
        fetchOrders({orderStatus: ALL_ALLOWED_STATUSES});
      }
      else {
        showToast("error", res.message);
      }
    } finally {
      dispatch({ type: "loader", loader: false });
    }
  };

  // ================= TABLE =================
  const allColumns = [
    { name: "S.No", selector: (row) => row.index, width: "8%" },
    { name: "Order ID", selector: (row) => row.orderUniqueId },
    { name: "Sub Order ID", selector: (row) => row.subOrderUniqueId },
    { name: "Date", selector: (row) => row.date },
    { name: "Product Info", selector: (row) => row.productInfo },
    { name: "SKU No", selector: (row) => row.skuNo },
    { name: "Qty", selector: (row) => row.quantity },
    { name: "Amount", selector: (row) => row.amount },
    { name: "Status", selector: (row) => row.status },

    {
      name: "QR",
      cell: (row) =>
        (row.status === "Pending") && (
          <button
            className="btn btn-sm btn-success"
            onClick={() => downloadQR(row)}
          >
            <FaQrcode /> QR
          </button>
        ),
    },

    {
      name: "Invoice",
      cell: (row) => {
        if (row.status == "Label Generated") {
          const [qr, setQr] = React.useState(null);
  
          React.useEffect(() => {
            generateQr(row.order?.orderId?.orderUniqueId || "").then(setQr);
          }, []);
  
          return (
            <PDFDownloadLink
              document={
                qr && (
                  <Document>
                    <InvoicePdf order={{ ...row.order, qr }} />
                  </Document>
                )
              }
              fileName={`invoice_${row.orderUniqueId}.pdf`}
              className="btn btn-dark btn-sm"
            >
              <FaFileInvoice /> Invoice
            </PDFDownloadLink>
          );
        }
      },
    },
    {
      name: "Shipping Label",
      cell: (row) => (
        row.order?.label_url ? (
          <a
            href={row.order.label_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-info"
          >
            <FaShippingFast /> Label
          </a>
        ) : (
          <span className="badge bg-secondary">Not Generated</span>
        )
      ),
    },
  ];

  // ================= CUSTOMIZE COLUMNS =================
  const presets = {
    "Default View": allColumns.map((col) => col.name),
  };

  const [visibleCols, setVisibleCols] = useState(presets["Default View"]);

  const toggleColumn = (colName) => {
    setVisibleCols((prev) =>
      prev.includes(colName)
        ? prev.filter((c) => c !== colName)
        : [...prev, colName]
    );
  };

  const applyPreset = (preset) => {
    setVisibleCols(presets[preset]);
    setDropdownOpen(false);
  };

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  // ================= FILTER =================
  const filteredData = orders.filter(
    (item) =>
      item.orderUniqueId
        ?.toLowerCase()
        .includes(filterText.toLowerCase()) ||
      item.productInfo
        ?.toLowerCase()
        .includes(filterText.toLowerCase())
  );

  const columnsToShow = allColumns.filter((col) =>
    visibleCols.includes(col.name)
  );

  // ================= UI =================
  return (
    <div>
      <Row className="mt-2">
        <Col md="6">
          <input
            className="form-control"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Col>

        <Col md="6">
          <div className="d-flex justify-content-end">

            {/* ✅ NEW Generate Labels */}
            <button
              className="btn btn-warning btn-sm me-2"
              disabled={!selectedRows.length}
              onClick={openLabelModal}
            >
              Generate Labels
            </button>

            <button
              className="btn btn-success btn-sm me-2"
              disabled={!selectedRows.length}
              onClick={handleBulkInvoiceDownload}
            >
              Download Invoices
            </button>

            {/* Customize Columns */}
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
                  {allColumns.map((col) => (
                    <label key={col.name} className="dropdown-item">
                      <input
                        type="checkbox"
                        checked={visibleCols.includes(col.name)}
                        onChange={() => toggleColumn(col.name)}
                      />
                      {col.name}
                    </label>
                  ))}
                  <hr />
                  <div onClick={() => applyPreset("Default View")}>
                    Reset
                  </div>
                </div>
              )}
            </div>

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

      <Card>
        <CardBody>
          <DataTable
            columns={columnsToShow}
            data={filteredData}
            pagination
            selectableRows
            onSelectedRowsChange={handleRowSelected}
          />
        </CardBody>
      </Card>

      {/* ✅ MODAL */}
      <Modal isOpen={showLabelModal} size="lg">
        <ModalHeader toggle={() => setShowLabelModal(false)}>
          Package Details
        </ModalHeader>

        <ModalBody>
          {selectedRows.map((row) => {
            const pkg = packageData[row.id] || {};

            return (
              <div key={row.id} className="border rounded p-3 mb-3 bg-light">

                {/* ✅ ORDER DETAILS */}
                <div className="mb-2">
                  <strong>Order ID:</strong> {row.orderUniqueId} <br />
                  <strong>Sub Order:</strong> {row.subOrderUniqueId} <br />
                  <strong>Product:</strong> {row.productInfo} <br />
                  <strong>SKU:</strong> {row.skuNo} <br />
                  <strong>Qty:</strong> {row.quantity}
                </div>

                {/* ✅ PACKAGE INPUTS */}
                <Row>
                  <Col md="3">
                    <label className="form-label">Length (in cm)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Length"
                      value={pkg['length'] || ""}
                      onChange={(e) =>
                        handlePackageChange(row.id, "length", e.target.value)
                      }
                    />
                  </Col>
                  <Col md="3">
                    <label className="form-label">Breadth (in cm)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="breadth"
                      value={pkg['breadth'] || ""}
                      onChange={(e) =>
                        handlePackageChange(row.id, "breadth", e.target.value)
                      }
                    />
                  </Col>
                  <Col md="3">
                    <label className="form-label">Height (in cm)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="height"
                      value={pkg['height'] || ""}
                      onChange={(e) =>
                        handlePackageChange(row.id, "height", e.target.value)
                      }
                    />
                  </Col>
                  <Col md="3">
                    <label className="form-label">Weight (in kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="weight"
                      value={pkg['weight'] || ""}
                      onChange={(e) =>
                        handlePackageChange(row.id, "weight", e.target.value)
                      }
                    />
                  </Col>
                </Row>

                {/* ✅ UPDATE BUTTON PER ORDER */}
                <div className="mt-2 text-end">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => updateSinglePackage(row.id)}
                  >
                    Update Package
                  </button>
                </div>
              </div>
            );
          })}
        </ModalBody>

        <ModalFooter>
          <Button onClick={() => setShowLabelModal(false)}>Cancel</Button>
          <Button color="warning" onClick={handleGenerateLabels}>
            Process Labels
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AllOrderList;