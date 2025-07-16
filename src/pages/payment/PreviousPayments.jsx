import React, { useState } from 'react';
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
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { FaCalendarAlt } from 'react-icons/fa';
import { DateRange } from 'react-date-range';
import { format, parse } from 'date-fns';
import classnames from 'classnames';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const months = ["Jul'25", "Jun'25", "May'25", "Apr'25", "Mar'25", "Feb'25"];

const mockData = {
    "Jul'25": [
        { date: 'July 2, 2025', bank: 'ICICI', neft: 'NEFT1234', balanceType: 'Prepaid', amount: '₹1000' },
        { date: 'July 5, 2025', bank: 'SBI', neft: 'NEFT5678', balanceType: 'Postpaid', amount: '₹2500' },
    ],
    "Jun'25": [
        { date: 'June 10, 2025', bank: 'HDFC', neft: 'NEFT8910', balanceType: 'Prepaid', amount: '₹1500' }
    ],
    "May'25": [
        { date: 'May 14, 2025', bank: 'Axis', neft: 'NEFT1122', balanceType: 'Postpaid', amount: '₹1700' }
    ],
    "Apr'25": [
        { date: 'April 1, 2025', bank: 'Kotak', neft: 'NEFT4455', balanceType: 'Prepaid', amount: '₹500' }
    ],
    "Mar'25": [
        { date: 'March 14, 2025', bank: 'N/A', neft: 'N/A', balanceType: 'Prepaid', amount: '₹0 (Bank Holiday)' },
        { date: 'March 14, 2025', bank: 'N/A', neft: 'N/A', balanceType: 'Postpaid', amount: '₹0 (Bank Holiday)' }
    ],
    "Feb'25": [
        { date: 'February 28, 2025', bank: 'HDFC', neft: 'NEFT7788', balanceType: 'Prepaid', amount: '₹800' }
    ]
};

const columns = [
    { name: 'Payment Date', selector: row => row.date, sortable: true },
    { name: 'Bank Account', selector: row => row.bank },
    { name: 'Neft ID', selector: row => row.neft },
    { name: 'Balance Account Type', selector: row => row.balanceType },
    { name: 'Payment Amount', selector: row => row.amount }
];

const PreviousPayments = () => {
    const [activeTab, setActiveTab] = useState("Mar'25");
    const [showDateRange, setShowDateRange] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(2025, 2, 1),
            endDate: new Date(2025, 2, 28),
            key: 'selection'
        }
    ]);
    const [filteredData, setFilteredData] = useState(mockData[activeTab]);

    const toggleTab = (tab) => {
        setActiveTab(tab);
        setDateRange([
            {
                startDate: new Date(2025, 0, 1),
                endDate: new Date(2025, 11, 31),
                key: 'selection'
            }
        ]);
        setFilteredData(mockData[tab]);
        setShowDateRange(false);
    };

    const handleApplyFilter = () => {
        const [range] = dateRange;
        const newData = mockData[activeTab].filter(row => {
            const rowDate = parse(row.date, 'MMMM d, yyyy', new Date());
            return rowDate >= range.startDate && rowDate <= range.endDate;
        });
        setFilteredData(newData);
        setShowDateRange(false);
    };

    return (
        <>
            <Row>
                <Breadcrumb className='my-2'>
                    <BreadcrumbItem>
                        <h5>Previous Payments</h5>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        Payment
                    </BreadcrumbItem>
                </Breadcrumb>
            </Row>

            {/* Date Range Filter */}
            <Row className="mb-3">
                <Col md="4">
                    <Button color="light" onClick={() => setShowDateRange(!showDateRange)}>
                        <FaCalendarAlt className="me-2" />
                        {`${format(dateRange[0].startDate, 'dd MMM yyyy')} - ${format(dateRange[0].endDate, 'dd MMM yyyy')}`}
                    </Button>
                    {showDateRange && (
                        <div className="bg-white shadow mt-2">
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setDateRange([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                months={2}
                                direction="horizontal"
                                style={{ zIndex: '999999' }}
                            />
                            <div className="p-2 text-end">
                                <Button color="primary" onClick={handleApplyFilter}>
                                    Apply
                                </Button>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
            <Card className="">
                <CardBody>
                    {/* Tabs */}
                    <Nav tabs className="mb-3">
                        {months.map(month => (
                            <NavItem key={month}>
                                <NavLink
                                    className={classnames({ active: activeTab === month })}
                                    onClick={() => toggleTab(month)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {month}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>



                    {/* Data Table */}
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
        </>
    );
};

export default PreviousPayments;
