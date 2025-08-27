import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import { FaRupeeSign, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { DateRange } from 'react-date-range';
import { format, isWithinInterval, parseISO } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { getInvoices } from '../../api/paymentAPI';

const Statements = () => {
    // State for the type filter dropdown (Prepaid, Postpaid, All)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Prepaid + Postpaid');

    // State to store all fetched invoices and filtered invoices
    const [allInvoices, setAllInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);

    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the date range dropdown and selected date range
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(), // Initial start date: June 3, 2025
            endDate: new Date(),   // Initial end date: July 3, 2025
            key: 'selection'
        }
    ]);

    // Toggle functions for dropdowns
    const toggleDropdown = () => setDropdownOpen(prev => !prev);
    const toggleDateDropdown = () => setDateDropdownOpen(prev => !prev);

    // Function to fetch all invoice data from the mock API
    const fetchAllInvoiceData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getInvoices();
            if (response.success) {
                setAllInvoices(response.data);
            }
        } catch (err) {
            console.error("Error fetching invoice data:", err);
            setError("Failed to load invoice data.");
            setAllInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    // useEffect to fetch all invoice data on component mount
    useEffect(() => {
        fetchAllInvoiceData();
    }, []); // Empty dependency array means this runs once on mount

    // useEffect to apply filters whenever allInvoices, selectedFilter, or dateRange changes
    useEffect(() => {
        // If no invoices are loaded and not currently loading, exit
        if (allInvoices.length === 0 && !loading) {
            setFilteredInvoices([]); // Clear filtered invoices if no data
            return;
        }

        let tempFilteredInvoices = [...allInvoices];

        // Apply type filter based on selectedFilter state
        if (selectedFilter !== 'Prepaid + Postpaid') {
            tempFilteredInvoices = tempFilteredInvoices.filter(invoice =>
                invoice.type === selectedFilter
            );
        }

        // Apply date range filter
        const { startDate, endDate } = dateRange[0];
        tempFilteredInvoices = tempFilteredInvoices.filter(invoice => {
            // Convert invoice.date string to a Date object for comparison
            const invoiceDate = parseISO(invoice.invoiceDate);
            // Check if the invoice date falls within the selected date range
            return isWithinInterval(invoiceDate, { start: startDate, end: endDate });
        });

        setFilteredInvoices(tempFilteredInvoices);
    }, [allInvoices, selectedFilter, dateRange, loading]); // Dependencies for re-filtering

    // Calculate total settlement amount and total sales value from the filtered invoices
    const totalSettlementAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmountDisbursed, 0);
    const totalSalesValue = filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmountDisbursed, 0);

    // Calculate the percentage of settlement amount relative to total sales value
    const percentageOfSales = totalSalesValue > 0 ? (totalSettlementAmount / totalSalesValue * 100).toFixed(2) : 0;

    // Group filtered invoices by date to display date-wise amounts
    const dateWiseAmounts = filteredInvoices.reduce((acc, invoice) => {
        // Format the invoice date to a readable string (e.g., "03 Jun 2025")
        const dateKey = format(parseISO(invoice.invoiceDate), 'dd MMM yyyy');
        // Sum amounts for each date
        acc[dateKey] = (acc[dateKey] || 0) + invoice.totalAmountDisbursed;
        return acc;
    }, {});

    return (
        <Container fluid className="p-4">
            {/* Header Row: Breadcrumb and Action Buttons */}
            <Row className="align-items-center mb-4">
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Statements (Monthly Settlement)</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Payment
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6" className="text-end d-flex justify-content-end gap-2">
                    <Button outline color="secondary">
                        View in Previous Payments <i className="ms-1 bi bi-box-arrow-up-right" />
                    </Button>
                    <Button color="primary">Download Report</Button>
                </Col>
            </Row>

            {/* Filter Row: Filter Button, Type Dropdown, Date Range Dropdown */}
            <Row className="align-items-center mb-4">
                <Col md="6" className="d-flex gap-2">
                    <Button color="light" className="d-flex align-items-center">
                        <FaFilter className="me-2" />
                    </Button>

                    {/* Dropdown for selecting invoice type (Prepaid, Postpaid, All) */}
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle color="light" caret className="d-flex align-items-center">
                            <FaRupeeSign className="me-2" />
                            {selectedFilter}
                        </DropdownToggle>
                        <DropdownMenu>
                            {['Prepaid', 'Postpaid', 'Prepaid + Postpaid'].map(option => (
                                <DropdownItem
                                    key={option}
                                    active={selectedFilter === option}
                                    onClick={() => setSelectedFilter(option)}
                                >
                                    {option}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    {/* Dropdown for selecting date range */}
                    <Dropdown isOpen={dateDropdownOpen} toggle={toggleDateDropdown}>
                        <DropdownToggle color="light" caret className="d-flex align-items-center">
                            <FaCalendarAlt className="me-2" />
                            {/* Display selected date range */}
                            {format(dateRange[0].startDate, 'dd MMM yyyy')} ⇒ {format(dateRange[0].endDate, 'dd MMM yyyy')}
                        </DropdownToggle>
                        <DropdownMenu style={{ minWidth: 'auto', padding: 0 }}>
                            {/* DateRange picker component */}
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setDateRange([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                direction="horizontal"
                            />
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>

            <hr />

            {/* Conditional Rendering: Loading, Error, or Content */}
            {loading ? (
                <p>Loading statements...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <>
                    

                    {/* Date-wise Settlement Details Section */}
                    <Row className="mb-3">
                        <Col>
                            <div className="fw-semibold border-top pt-3">Settlement Details</div>
                            {Object.keys(dateWiseAmounts).length > 0 ? (
                                <ul className="list-group mt-2">
                                    {Object.entries(dateWiseAmounts).map(([date, amount]) => (
                                        <li key={date} className="list-group-item d-flex justify-content-between align-items-center">
                                            {date}
                                            <span className="badge bg-primary rounded-pill">₹{amount.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted mt-2">No statements found for the selected filters.</p>
                            )}
                        </Col>
                    </Row>
                    {/* Total Settlement Amount Section */}
                    <Row className="mb-3">
                        <Col md="4">
                            <h6>Total Settlement Amount</h6>
                        </Col>
                        <Col md="4">
                            <h6>
                                ₹{totalSettlementAmount.toFixed(2)}{' '}
                                <span className="text-muted small">({percentageOfSales}% of Sales Value)</span>
                            </h6>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Statements;
