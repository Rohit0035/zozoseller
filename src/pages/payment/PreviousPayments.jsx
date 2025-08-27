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
import { FaCalendarAlt } from "react-icons/fa";
import { DateRange } from "react-date-range";
import { format, parse } from "date-fns";
import classnames from "classnames";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { getAvailableMonths, getPreviousPayments } from "../../api/paymentAPI";

// Columns for the DataTable - remain the same
const columns = [
  { name: "Payment Date", selector: row => row.date, sortable: true },
  { name: "Bank Account", selector: row => row.bank },
  { name: "Neft ID", selector: row => row.neft },
  { name: "Balance Account Type", selector: row => row.balanceType },
  { name: "Payment Amount", selector: row => row.amount }
];

const PreviousPayments = () => {
  const [availableMonths, setAvailableMonths] = useState([]);
  const [activeTab, setActiveTab] = useState(""); // Will be set dynamically
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(), // Default to current month or a sensible range
      endDate: new Date(),
      key: "selection"
    }
  ]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch available months
  const fetchAvailableMonths = async () => {
    try {
      const response = await getAvailableMonths();
      if (response.success) {
        setAvailableMonths(response.data);
        if (response.data.length > 0) {
          // Set the most recent month as active initially
          setActiveTab(response.data[0]);
          // Set default date range for the active tab
          const [monStr, yearStr] = response.data[0].split("'");
          const year = parseInt(`20${yearStr}`, 10);
          const monthMap = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
          };
          const monthNum = monthMap[monStr];
          const startOfMonth = new Date(year, monthNum, 1);
          const endOfMonth = new Date(year, monthNum + 1, 0);
          setDateRange([
            {
              startDate: startOfMonth,
              endDate: endOfMonth,
              key: "selection"
            }
          ]);
        }
      }
    } catch (err) {
      console.error("Error fetching available months:", err);
      setError("Failed to load available months.");
    }
  };

  // Function to fetch payment data based on current filters
  const fetchPaymentData = async (activeTabParam, dateRangeParam) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        month: activeTabParam,
        startDate: dateRangeParam
          ? format(dateRangeParam[0].startDate, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
        endDate: dateRangeParam
          ? format(dateRangeParam[0].endDate, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0]
      };
      const response = await getPreviousPayments(params);
      if (response.success) {
        setFilteredData(response.data);
      }
    } catch (err) {
      console.error("Error fetching payment data:", err);
      setError("Failed to load payment data.");
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of months and data
  useEffect(() => {
    fetchAvailableMonths();
  }, []);

  // Fetch data whenever activeTab or dateRange changes (when not in month tab mode)
  useEffect(
    () => {
      if (activeTab) {
        fetchPaymentData(activeTab, null);
      } else if (dateRange[0].startDate && dateRange[0].endDate) {
        // This case handles when a custom date range is applied
        // The `handleApplyFilter` already calls fetchPaymentData,
        // so this might not be strictly needed for date range,
        // but keeps the month tab logic clean.
      }
    },
    [activeTab]
  ); // Only re-fetch for activeTab changes

  const toggleTab = tab => {
    setActiveTab(tab);
    setShowDateRange(false); // Hide date picker when switching tabs
    // Set the date range picker to the selected month's range
    const [monStr, yearStr] = tab.split("'");
    const year = parseInt(`20${yearStr}`, 10);
    const monthMap = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11
    };
    const monthNum = monthMap[monStr];
    const startOfMonth = new Date(year, monthNum, 1);
    const endOfMonth = new Date(year, monthNum + 1, 0); // Last day of the month
    setDateRange([
      { startDate: startOfMonth, endDate: endOfMonth, key: "selection" }
    ]);
  };

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
            <h5>Previous Payments</h5>
          </BreadcrumbItem>
          <BreadcrumbItem active>Payment</BreadcrumbItem>
        </Breadcrumb>
      </Row>

      {/* Date Range Filter */}
      <Row className="mb-3">
        <Col md="4">
          <Button
            color="light"
            onClick={() => setShowDateRange(!showDateRange)}
          >
            <FaCalendarAlt className="me-2" />
            {`${format(dateRange[0].startDate, "dd MMM yyyy")} - ${format(
              dateRange[0].endDate,
              "dd MMM yyyy"
            )}`}
          </Button>
          {showDateRange &&
            <div
              className="bg-white shadow mt-2"
              style={{ position: "absolute", zIndex: 1000 }}
            >
              <DateRange
                editableDateInputs={true}
                onChange={item => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                months={2}
                direction="horizontal"
              />
              <div className="p-2 text-end">
                <Button color="primary" onClick={handleApplyFilter}>
                  Apply
                </Button>
              </div>
            </div>}
        </Col>
      </Row>
      <Card className="">
        <CardBody>
          {/* Tabs */}
          <Nav tabs className="mb-3">
            {availableMonths.map(month =>
              <NavItem key={month}>
                <NavLink
                  className={classnames({ active: activeTab === month })}
                  onClick={() => toggleTab(month)}
                  style={{ cursor: "pointer" }}
                >
                  {month}
                </NavLink>
              </NavItem>
            )}
          </Nav>

          {loading && <p>Loading payments...</p>}
          {error &&
            <p className="text-danger">
              {error}
            </p>}
          {!loading &&
            !error &&
            <DataTable
              columns={columns}
              data={filteredData}
              noHeader
              pagination
              highlightOnHover
              persistTableHead
              className=""
              noDataComponent="No records found."
            />}
        </CardBody>
      </Card>
    </Container>
  );
};

export default PreviousPayments;
