import React, { useState, useEffect, useRef } from "react"; // Import useRef
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Button // Import Button for the new buttons
} from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { getInvoiceDetails } from "../../api/paymentAPI";
import LogoLg from "../../../src/assets/images/logo-lg.png"; // Your logo import
import "./invoiceprint.css";

// Import PDF generation libraries
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvoiceDetailsPage = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref for the content to be printed/downloaded
  const invoiceContentRef = useRef(null);

  // Function to fetch invoice data
  const fetchInvoiceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInvoiceDetails({ invoiceId });
      if (response.success) {
        setInvoice(response.data);
        console.log("invoice", response.data);
      } else {
        setError(response.message || "Failed to load invoice data.");
        setInvoice(null);
      }
    } catch (err) {
      console.error("Error fetching invoice data:", err);
      setError("Failed to load invoice data: " + err.message);
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () => {
      console.log(invoiceId);
      if (invoiceId) {
        fetchInvoiceData();
      } else {
        setLoading(false);
        setError("No Invoice ID provided in URL.");
      }
    },
    [invoiceId]
  );

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Download as PDF
  const handleDownloadPdf = async () => {
    const input = invoiceContentRef.current;
    if (input) {
      try {
        const canvas = await html2canvas(input, {
          scale: 2, // Increase scale for better quality
          useCORS: true, // If images are from different origin
          logging: true // For debugging
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4"); // 'p' for portrait, 'mm' for millimeters, 'a4' size
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`invoice-${invoice.invoiceId}.pdf`);
      } catch (err) {
        console.error("Error generating PDF:", err);
        setError("Failed to generate PDF. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-8 text-center">
        {/* Removed Tailwind flex/space-x-2, replaced with simple divs for animation */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500 mx-1" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500 mx-1" />
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500 mx-1" />
        </div>
        <p className="mt-4 text-lg text-gray-600">Loading invoice details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-8 text-center">
        <p className="text-red-600 text-xl font-semibold">
          Error: {error}
        </p>
        <p className="text-gray-600 mt-2">
          Please try again later or check the Invoice ID.
        </p>
      </Container>
    );
  }

  if (!invoice) {
    return (
      <Container fluid className="py-8 text-center">
        <p className="text-gray-600 text-xl font-semibold">
          Invoice not found.
        </p>
        <p className="text-gray-500 mt-2">
          The invoice ID you provided does not exist or is invalid.
        </p>
        <Link
          to="/invoices"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Go back to Invoices List
        </Link>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-4 sm:px-6 lg:px-8 font-inter">
      {/* Breadcrumb and Action Buttons */}
      <Row className="mb-4 d-flex justify-content-between align-items-center">
        <Col xs="12" md="8">
          <Breadcrumb className="rounded-lg bg-white shadow-sm p-3">
            <BreadcrumbItem>
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-800"
              >
                Dashboard
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link
                to="/invoices"
                className="text-blue-600 hover:text-blue-800"
              >
                Invoices
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active className="text-gray-700">
              Invoice #{invoice.invoiceId}
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col xs="12" md="4" className="text-end mt-3 mt-md-0">
          <Button
            color="primary"
            onClick={handlePrint}
            className="me-2 waves-effect waves-light"
          >
            <i className="ri-printer-line align-bottom me-1" /> Print
          </Button>
          <Button
            color="success"
            onClick={handleDownloadPdf}
            className="waves-effect waves-light"
          >
            <i className="ri-download-2-line align-bottom me-1" /> Download
          </Button>
        </Col>
      </Row>

      {/* Invoice Content - This div will be converted to PDF/printed */}
      <div ref={invoiceContentRef} className="invoice-print-area">
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardBody className="p-6 p-md-8 p-lg-10">
            {/* Invoice Header */}
            {/* Replaced flex with Row and Cols for layout */}
            <Row className="justify-content-between align-items-start align-items-md-center mb-4 pb-4 border-bottom border-gray-200">
              <Col xs="12" md="6" className="mb-3 mb-md-0">
                {/* Company Logo */}
                {/* Replaced flex with d-flex and justify-content-center */}
                <div
                  className="logo-container d-flex align-items-center justify-content-center rounded-lg"
                  style={{ width: "128px", height: "48px" }}
                >
                  {LogoLg &&
                    <img
                      src={LogoLg}
                      alt="Company Logo"
                      className="h-100 w-auto object-contain"
                    />}
                  {!LogoLg &&
                    <span className="text-blue-700 font-bold text-xl">
                      LOGO
                    </span>}
                </div>
                <h1 className="h3 font-weight-bold text-gray-900 mt-3">
                  INVOICE
                </h1>
              </Col>
              <Col xs="12" md="6" className="text-end">
                <h2 className="h4 font-weight-bold text-gray-800">
                  #{invoice.invoiceId}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Date:{" "}
                  {invoice.invoiceDate
                    ? format(new Date(invoice.invoiceDate), "PPP")
                    : "N/A"}
                </p>
                <p
                  className={`text-lg font-semibold mt-2 ${invoice.status ===
                  "generated"
                    ? "text-warning"
                    : "text-success"}`}
                >
                  Status: {invoice.status}
                </p>
              </Col>
            </Row>

            {/* Sender and Recipient Details */}
            <Row className="mb-5">
              <Col md="6" className="mb-4 mb-md-0">
                <h3 className="h5 font-weight-semibold text-gray-800 mb-3 border-bottom border-primary pb-1 d-inline-block">
                  Bill From:
                </h3>
                {invoice.adminId
                  ? <div className="text-gray-700">
                      <p className="font-weight-medium mb-1">
                        {invoice.adminId.name}
                      </p>
                      {invoice.adminId.address &&
                        <p className="mb-1">
                          {invoice.adminId.address}
                        </p>}
                      {invoice.adminId.city &&
                        invoice.adminId.state &&
                        invoice.adminId.zip &&
                        <p className="mb-1">
                          {invoice.adminId.city}, {invoice.adminId.state}{" "}
                          {invoice.adminId.zip}
                        </p>}
                      <p className="mb-1">
                        Email: {invoice.adminId.email}
                      </p>
                      <p className="mb-0">
                        Phone: {invoice.adminId.phone}
                      </p>
                    </div>
                  : <p className="text-gray-600">
                      Admin details not available.
                    </p>}
              </Col>
              <Col md="6" className="text-end">
                <h3 className="h5 font-weight-semibold text-gray-800 mb-3 border-bottom border-primary pb-1 d-inline-block">
                  Bill To:
                </h3>
                {invoice.sellerId
                  ? <div className="text-gray-700">
                      <p className="font-weight-medium mb-1">
                        {invoice.sellerId.name}
                      </p>
                      {invoice.sellerId.address &&
                        <p className="mb-1">
                          {invoice.sellerId.address}
                        </p>}
                      {invoice.sellerId.city &&
                        invoice.sellerId.state &&
                        invoice.sellerId.zip &&
                        <p className="mb-1">
                          {invoice.sellerId.city}, {invoice.sellerId.state}{" "}
                          {invoice.sellerId.zip}
                        </p>}
                      <p className="mb-1">
                        Email: {invoice.sellerId.email}
                      </p>
                      <p className="mb-0">
                        Phone: {invoice.sellerId.phone}
                      </p>
                    </div>
                  : <p className="text-gray-600">
                      Seller details not available.
                    </p>}
              </Col>
            </Row>

            {/* Invoice Items Table (Reactstrap Table classes) */}
            <div className="table-responsive rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-5">
              <table className="table table-striped table-bordered mb-0">
                <thead className="bg-light">
                  <tr>
                    <th
                      scope="col"
                      className="p-3 text-start text-xs font-medium text-gray-700 text-uppercase"
                    >
                      S.No
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-start text-xs font-medium text-gray-700 text-uppercase"
                    >
                      Order Id
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-center text-xs font-medium text-gray-700 text-uppercase"
                    >
                      Order Date
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-end text-xs font-medium text-gray-700 text-uppercase"
                    >
                      Sub Total Amt
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-end text-xs font-medium text-gray-700 text-uppercase"
                    >
                      GST Amt
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-end text-xs font-medium text-gray-700 text-uppercase"
                    >
                      Commission Amt
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-end text-xs font-medium text-gray-700 text-uppercase"
                    >
                      Shipping Amt
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-end text-xs font-medium text-gray-700 text-uppercase"
                    >
                      Total Amt
                    </th>
                    <th
                      scope="col"
                      className="p-3 text-end text-xs font-medium text-gray-700 text-uppercase"
                    >
                      Total Paid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items && invoice.items.length > 0
                    ? invoice.items.map((item, index) =>
                        <tr key={index}>
                          <td className="p-3 text-nowrap text-sm text-gray-700">
                            {index + 1}
                          </td>
                          <td className="p-3 text-nowrap text-sm font-medium text-gray-900">
                            {item.orderId || "N/A"}
                          </td>
                          <td className="p-3 text-nowrap text-sm text-gray-700 text-center">
                            {item.orderCreatedAt
                              ? format(new Date(item.orderCreatedAt), "PPP")
                              : "N/A"}
                          </td>
                          <td className="p-3 text-nowrap text-sm text-gray-700 text-end">
                            ₹{(item.subOrderId?.subTotal || 0).toFixed(2)}
                          </td>
                          <td className="p-3 text-nowrap text-sm text-gray-700 text-end">
                            ₹{(item.gstAmount || 0).toFixed(2)}
                          </td>
                          <td className="p-3 text-nowrap text-sm text-gray-700 text-end">
                            ₹{(item.subOrderId?.commission || 0).toFixed(2)}
                          </td>
                          <td className="p-3 text-nowrap text-sm text-gray-700 text-end">
                            ₹{(item.subOrderId?.shipping || 0).toFixed(2)}
                          </td>
                          <td className="p-3 text-nowrap text-sm text-gray-700 text-end">
                            ₹{(item.subOrderId?.total || 0).toFixed(2)}
                          </td>
                          <td className="p-3 text-nowrap text-sm font-weight-semibold text-gray-900 text-end">
                            ₹{(item.currentPaidAmount || 0).toFixed(2)}
                          </td>
                        </tr>
                      )
                    : <tr>
                        <td
                          colSpan="5"
                          className="px-3 py-3 text-center text-sm text-gray-500"
                        >
                          No items found for this invoice.
                        </td>
                      </tr>}
                </tbody>
              </table>
            </div>

            {/* Totals Summary */}
            <Row className="justify-content-end mb-5">
              <Col md="5" lg="4">
                <div className="bg-light p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-gray-700 font-weight-medium">
                      Subtotal:
                    </span>
                    <span className="text-gray-900 font-weight-semibold">
                      ₹{invoice.totalAmountDisbursed.toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top border-primary mt-3">
                    <span className="h5 font-weight-bold text-gray-800">
                      Total Amount:
                    </span>
                    <span className="h4 font-weight-extrabold text-primary">
                      ₹{(invoice.totalAmountDisbursed || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Payment Information & Notes */}
            <Row className="mb-5">
              <Col md="12">
                <h3 className="h5 font-weight-semibold text-gray-800 mb-3 border-bottom border-primary pb-1 d-inline-block">
                  Payment Information:
                </h3>
                {invoice.paymentTransactionId
                  ? <div className="text-gray-700">
                      <p className="mb-1">
                        Amount Paid:{" "}
                        <span className="font-weight-medium">
                          ₹{(invoice.paymentTransactionId.amount || 0)
                            .toFixed(2)}
                        </span>
                      </p>
                      <p className="mb-1">
                        Bank Name:{" "}
                        <span className="font-weight-medium">
                          {invoice.paymentTransactionId.bankName || "N/A"}
                        </span>
                      </p>
                      <p className="mb-1">
                        NEFT No:{" "}
                        <span className="font-weight-medium">
                          {invoice.paymentTransactionId.neftNo || "N/A"}
                        </span>
                      </p>
                      <p className="mb-1">
                        Payment Date:{" "}
                        <span className="font-weight-medium">
                          {invoice.paymentTransactionId.paymentDate
                            ? format(
                                new Date(
                                  invoice.paymentTransactionId.paymentDate
                                ),
                                "PPP"
                              )
                            : "N/A"}
                        </span>
                      </p>
                      {invoice.paymentTransactionId &&
                        <p className="mb-0">
                          Transaction ID:{" "}
                          <span className="font-weight-medium">
                            {invoice.paymentTransactionId.transactionId ||
                              invoice.paymentTransactionId._id ||
                              "N/A"}
                          </span>
                        </p>}
                    </div>
                  : <p className="text-gray-600">
                      No payment information available yet.
                    </p>}
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <h3 className="h5 font-weight-semibold text-gray-800 mb-3 border-bottom border-primary pb-1 d-inline-block">
                  Notes:
                </h3>
                <p className="text-gray-700 bg-light p-4 rounded-lg border border-gray-200 shadow-sm">
                  {invoice.notes || "No additional notes for this invoice."}
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export default InvoiceDetailsPage;
