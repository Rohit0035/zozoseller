import React, { useEffect, useMemo, useState } from "react";
import {
    Container,
    Button,
    Row,
    Col,
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem,
    Badge
} from "reactstrap";
// Assuming Link is from react-router-dom
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import DataTable from "react-data-table-component";
// Assuming 'format' is from date-fns for date formatting
import { format } from "date-fns";
import { getReportData } from "../../api/paymentAPI";

// Define the tags for the report types
const tags = ["Invoices", "Listings Reports", "Payment Reports", "Tax Reports"];

// Define the columns for the Invoices table
const invoiceColumns = [
    { name: "S.No", selector: (row) => row.index, sortable: true, width: "8%" },
    { name: "Invoice ID", selector: row => row.invoiceId },
    {
        name: "Invoice Date",
        selector: row =>
            row.invoiceDate
                ? format(new Date(row.invoiceDate), "dd-MM-yyyy hh:mm a")
                : "N/A"
    },
    { name: "Invoice Amount", selector: row => row.totalAmountDisbursed },
    { name: "Invoice Status", selector: row => row.status },
    {
        name: "Action",
        cell: row =>
            <Link
                to={`/invoice-details/${row.invoiceId}`}
                className="btn btn-success btn-sm"
            >
                <FaEye />
            </Link>
    }
];

const listingColumns = [
    { name: 'S.No', selector: row => row.index, sortable: true, width: "8%" },
    { name: 'Product Title', selector: row => row.name, sortable: true }, // Changed from 'title' to 'name'
    { name: 'Creation Time', selector: row => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A', sortable: true }, // Assuming 'createdAt' from API
    { name: 'Update Time', selector: row => row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : 'N/A', sortable: true }, // Assuming 'updatedAt' from API
    { name: 'Sales', selector: row => row.sales || 0, sortable: true, right: true }, // Assuming 'sales' might come from API, default to 0
    { name: 'Product Details', selector: row => row.description, sortable: true }, // Assuming 'description' from API
    { name: 'Listing Price', selector: row => row.regularPrice, sortable: true, right: true },
    { name: 'Benchmark Price', selector: row => row.benchmarkPrice || 'N/A', sortable: true, right: true }, // Assuming benchmarkPrice might be a field
    { name: 'Final Price', selector: row => row.salePrice || 'N/A', sortable: true, right: true },
    { name: 'MRP', selector: row => row.mrp || 'N/A', sortable: true, right: true }, // Assuming mrp might be a field
    { name: 'Stock', selector: row => row.stockQty, sortable: true, right: true },
    { name: 'Returns', selector: row => row.returns || '0%', sortable: true }, // Assuming returns might be a field
    { name: 'New', selector: row => (row.isNew ? 'Yes' : 'No'), sortable: true }, // Assuming 'isNew' flag
    { name: 'Fulfillment', selector: row => row.fulfillment || 'N/A', sortable: true }, // Assuming 'fulfillment' flag
    { name: 'Procurement SLA', selector: row => row.procurementSLA || 'N/A', sortable: true }, // Assuming 'procurementSLA' field
    { name: 'Listing Quality', selector: row => row.listingQuality || 'N/A', sortable: true }, // Assuming 'listingQuality' field
    { name: 'Additional Info', selector: row => row.additionalInfo || 'N/A', sortable: false }, // Assuming 'additionalInfo' field
    // Action column is omitted here as per your new demo, but you can re-add it from previous component if needed
    // { name: 'Action', selector: row => row.action, sortable: false },
];

const paymentColumns = [
    { name: "S.No", selector: (row) => row.index, sortable: true, width: "8%" },
    { name: "Payment ID", selector: (row) => row._id, sortable: true, width: "25%" },
    { name: "Transaction ID", selector: (row) => row.transactionId, sortable: true, width: "25%" },
    { name: "Amount (₹)", selector: (row) => row.amount, sortable: true, width: "20%", format: row => `₹${row.amount}` },
    { name: "Date", selector: (row) => row.paymentDate, sortable: true, width: "20%" },
];

const taxColumns = [
    { name: "S.No", selector: (row) => row.index, sortable: true, width: "8%" },
    { name: "Order ID", selector: (row) => row.orderId?.orderUniqueId, sortable: true, width: "10%" },
    { name: "Sub Order ID", selector: (row) => row._id, sortable: true, width: "10%" },
    { name: "Sub Total Amount (₹)", selector: (row) => row.subTotal, sortable: true, width: "10%", format: row => `₹${row.subTotal}` },
    { name: "Tax Amount (₹)", selector: (row) => row.tax, sortable: true, width: "10%", format: row => `₹${row.tax}` },
    { name: "Commission Amount (₹)", selector: (row) => row.commission, sortable: true, width: "10%", format: row => `₹${row.commission}` },
    { name: "Shipping Amount (₹)", selector: (row) => row.shipping, sortable: true, width: "10%", format: row => `₹${row.shipping}` },
    { name: "Amount (₹)", selector: (row) => row.total, sortable: true, width: "10%", format: row => `₹${row.total}` },
    { name: "Status", selector: (row) => row.orderStatus, sortable: true, width: "10%" },
    { name: "Payment To Vendor Status", selector: (row) => row.paymentToVendorStatus, sortable: true, width: "10%" },
    { name: "Paid To Vendor Amount", selector: (row) => row.paidToVendorAmount, sortable: true, width: "10%" },
    { name: "Date", selector: (row) => row.orderDate, sortable: true, width: "10%" },
];


const ReportCentre = () => {
    const [activeTag, setActiveTag] = useState("Invoices");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoiceData, setInvoiceData] = useState([]);
    const [listingData, setListingData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const [taxData, setTaxData] = useState([]);

    // A function to get the correct data based on the active tag
    const getFilteredData = () => {
        switch (activeTag) {
            case "Invoices":
                return invoiceData;
            case "Listings Reports":
                return listingData;
            case "Payment Reports":
                return paymentData;
            case "Tax Reports":
                return taxData;
            default:
                return [];
        }
    };

    // A function to get the correct columns based on the active tag
    const getColumns = () => {
        switch (activeTag) {
            case "Invoices":
                return invoiceColumns;
            case "Listings Reports":
                return listingColumns;
            case "Payment Reports":
                return paymentColumns;
            case "Tax Reports":
                return taxColumns;
            default:
                return [];
        }
    };

    const fetchReportData = async () => {
        setLoading(true);
        setError(null);
        try {
            // This API call should fetch all report data at once
            const response = await getReportData();
            if (response.success) {
                // Add an index to each data item and update state
                setInvoiceData((response.data.invoiceData || []).map((item, index) => ({ ...item, index: index + 1 })));
                setListingData((response.data.listingData || []).map((item, index) => ({ ...item, index: index + 1 })));
                setPaymentData((response.data.paymentData || []).map((item, index) => ({ ...item, index: index + 1 })));
                setTaxData((response.data.taxData || []).map((item, index) => ({ ...item, index: index + 1 })));
                console.log("Fetched tax data:", response.data.taxData);
            }
        } catch (err) {
            console.error("Error fetching report data:", err);
            setError("Failed to load report data.");
            // We don't need to set filteredData, as it's a derived value
        } finally {
            setLoading(false);
        }
    };

    // Initial load of data when the component mounts
    useEffect(() => {
        fetchReportData();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <>
            <Row>
                <Col md="6">
                    <Breadcrumb className="my-2">
                        <BreadcrumbItem>
                            <h5>Report Centre</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Payment</BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>

            {/* Tag Filters */}
            <div className="mb-3 d-flex flex-wrap gap-2">
                {tags.map(tag =>
                    <Button
                        key={tag}
                        outline
                        color={activeTag === tag ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setActiveTag(tag)}
                    >
                        {tag}
                    </Button>
                )}
            </div>

            {/* Data Table */}
            <Card className="shadow-sm">
                <CardBody>
                    {loading
                        ? <p>Loading reports...</p>
                        : error
                            ? <p className="text-danger">
                                {error}
                            </p>
                            : <DataTable
                                columns={getColumns()}
                                data={getFilteredData()}
                                pagination
                                noHeader
                                className="border rounded"
                            />}
                </CardBody>
            </Card>
        </>
    );
};

export default ReportCentre;
