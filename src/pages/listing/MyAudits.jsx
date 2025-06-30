import React, { useState } from 'react';
import {
    Row, Col, Button, Input, DropdownToggle, DropdownMenu, DropdownItem,
    UncontrolledDropdown, Card, CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import { FaFilter, FaDownload, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';

const MyAudits = () => {
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [searchText, setSearchText] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);
    const [filteredData, setFilteredData] = useState([]);

    const auditData = [
        { id: 101, auditNumber: 'AUD-001', subcategory: 'Financial', initiated: '2025-06-01', scheduled: '2025-06-10', result: 'Passed', status: 'Open', category: 'Financial' },
        { id: 102, auditNumber: 'AUD-002', subcategory: 'Operational', initiated: '2025-06-05', scheduled: '2025-06-15', result: 'Failed', status: 'In Progress', category: 'Operational' },
        { id: 103, auditNumber: 'AUD-003', subcategory: 'Financial', initiated: '2025-06-07', scheduled: '2025-06-17', result: 'Pending', status: 'Closed', category: 'Financial' },
    ];

    const handleApply = () => {
        let filtered = auditData;

        if (statusFilter) {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        if (categoryFilter) {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        const start = dateRange[0].startDate;
        const end = dateRange[0].endDate;

        if (start && end) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.initiated);
                return itemDate >= start && itemDate <= end;
            });
        }

        if (searchText) {
            filtered = filtered.filter(item =>
                item.auditNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                item.subcategory.toLowerCase().includes(searchText.toLowerCase()) ||
                item.result.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredData(filtered);
    };

    const columns = [
        { name: 'Audit Number', selector: row => row.auditNumber, sortable: true },
        { name: 'Audit Subcategory', selector: row => row.subcategory, sortable: true },
        { name: 'Initiated', selector: row => row.initiated, sortable: true },
        { name: 'Scheduled', selector: row => row.scheduled, sortable: true },
        { name: 'Result', selector: row => row.result, sortable: true },
        {
            name: 'Action',
            cell: row => (
                <Button size="sm" color="danger">
                    <FaTrash />
                </Button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>My Audits</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Listing
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>
            {/* Filter Section */}
            <Card className='mb-3'>
                <CardBody>
                    <Row className="g-2 align-items-center">
                        {/* Status Filter */}
                        <Col md="2">
                            <UncontrolledDropdown>
                                <DropdownToggle color="light" className="w-100 text-start">
                                    <FaFilter className="me-2" /> {statusFilter || '3 Status'}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => setStatusFilter('Open')}>Open</DropdownItem>
                                    <DropdownItem onClick={() => setStatusFilter('In Progress')}>In Progress</DropdownItem>
                                    <DropdownItem onClick={() => setStatusFilter('Closed')}>Closed</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>

                        {/* Category Filter */}
                        <Col md="2">
                            <UncontrolledDropdown>
                                <DropdownToggle color="light" className="w-100 text-start">
                                    {categoryFilter || 'Category'}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => setCategoryFilter('Operational')}>Operational</DropdownItem>
                                    <DropdownItem onClick={() => setCategoryFilter('Financial')}>Financial</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>

                        {/* Date Range */}
                        <Col md="3">
                            <div>
                                <Input
                                    type="text"
                                    readOnly
                                    placeholder="Select Date Range"
                                    value={`${format(dateRange[0].startDate, 'MM/dd/yyyy')} - ${format(dateRange[0].endDate, 'MM/dd/yyyy')}`}
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                />
                                {showDatePicker && (
                                    <div style={{ position: 'absolute', zIndex: 10 }}>
                                        <DateRange
                                            editableDateInputs={true}
                                            onChange={item => setDateRange([item.selection])}
                                            moveRangeOnFirstSelection={false}
                                            ranges={dateRange}
                                        />
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* Search */}
                        <Col md="2">
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>

                        {/* Apply */}
                        <Col md="1">
                            <Button color="primary" block onClick={handleApply}>Apply</Button>
                        </Col>

                        {/* Export */}
                        <Col md="2" className="text-end">
                            <CSVLink data={filteredData.length > 0 ? filteredData : auditData} filename="my_audits.csv">
                                <Button color="success" size="sm">
                                    <FaDownload className="me-1" /> Export CSV
                                </Button>
                            </CSVLink>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            {/* Table Section */}
            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={filteredData.length > 0 ? filteredData : auditData}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        noDataComponent="No data to display"
                    />
                </CardBody>
            </Card>
        </>
    );
};

export default MyAudits;
