import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Button,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";
import DataTable from "react-data-table-component";
import { FaCalendarAlt, FaDownload, FaEye } from "react-icons/fa";
import { DateRange } from "react-date-range";
import { format, parse } from "date-fns";
import classnames from "classnames";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  getAvailableMonths,
  getInvoices,
  getPreviousPayments
} from "../../api/paymentAPI";
import { Link } from "react-router-dom";

// Columns for the DataTable - remain the same
const columns = [
  { name: "Invoice ID", selector: row => row.invoiceId },
  {
    name: "Invoice Date",
    selector: row => format(new Date(row.invoiceDate), "dd-MM-yyyy hh:mm a")
  },
  { name: "Invoice Amount", selector: row => row.totalAmountDisbursed },
  { name: "Invoice Status", selector: row => row.status },
  { name: "Action", cell: row => (
			<>
				<Link to={`/invoice-details/${row.invoiceId}`} className='btn btn-success btn-sm'>
					<FaEye />
				</Link>
			</>

		), }
];

const Invoices = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch payment data based on current filters
  const fetchInvoiceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInvoices();
      if (response.success) {
        setFilteredData(response.data);
      }
    } catch (err) {
      console.error("Error fetching invoice data:", err);
      setError("Failed to load invoice data.");
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of months and data
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const handleApplyFilter = () => {
    setActiveTab(""); // Clear active tab when custom date range is applied
    fetchPaymentData(null, dateRange); // Fetch with date range
    setShowDateRange(false);
  };

  return (
    <Container fluid>
      <Row>
        <Breadcrumb className="my-2">
          <BreadcrumbItem>
            <h5>Invoices</h5>
          </BreadcrumbItem>
          <BreadcrumbItem active>Invoices</BreadcrumbItem>
        </Breadcrumb>
      </Row>

      <Card className="">
        <CardBody>
          <DataTable
            columns={columns}
            data={filteredData}
            noHeader
            pagination
            highlightOnHover
            persistTableHead
            className=""
            noDataComponent="No records found."
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default Invoices;
