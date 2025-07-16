import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { FaList, FaExclamationCircle, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';

// Sample cancel order data
const cancelOrders = [
    {
        id: 1,
        orderId: "ORD12345",
        customerName: "John Doe",
        contact: "9876543210",
        product: "iPhone 14",
        sku: "APL-IPH14-128GB-BLK",
        amount: 780,
        reason: "Customer changed mind",
        date: "2024-06-15",
        status: "Cancelled",
        refundStatus: "Processed",
        channel: "Website",
    },
    {
        id: 2,
        orderId: "ORD12346",
        customerName: "Jane Smith",
        contact: "9123456780",
        product: "Galaxy S23",
        sku: "SMSNG-GS23-256GB-GRY",
        amount: 690,
        reason: "Late delivery",
        date: "2024-06-14",
        status: "Cancelled",
        refundStatus: "Pending",
        channel: "App",
    },
    {
        id: 3,
        orderId: "ORD12347",
        customerName: "Michael Johnson",
        contact: "9988776655",
        product: "MacBook Air",
        sku: "APL-MAC-AIR-13IN",
        amount: 980,
        reason: "Duplicate order",
        date: "2024-06-13",
        status: "Cancelled",
        refundStatus: "Processed",
        channel: "Website",
    },
];

// Column definitions
const allColumns = [
    { name: 'Order ID', selector: row => row.orderId, sortable: true },
    { name: 'Customer Name', selector: row => row.customerName, sortable: true },
    { name: 'Contact', selector: row => row.contact, sortable: true },
    { name: 'Product', selector: row => row.product, sortable: true },
    { name: 'SKU', selector: row => row.sku, sortable: true },
    { name: 'Amount (₹)', selector: row => row.amount, sortable: true, right: true },
    { name: 'Reason for Cancellation', selector: row => row.reason, sortable: false },
    { name: 'Date', selector: row => row.date, sortable: true },
    {
        name: 'Status',
        selector: row => row.status,
        sortable: true,
        cell: row => <span className="badge bg-danger">{row.status}</span>
    },
    {
        name: 'Refund Status',
        selector: row => row.refundStatus,
        sortable: true,
        cell: row => (
            <span className={`badge ${row.refundStatus === 'Processed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                {row.refundStatus}
            </span>
        )
    },
    { name: 'Channel', selector: row => row.channel, sortable: true },
];

// Preset column views
const presets = {
    'Default View': ['Order ID', 'Customer Name', 'Product', 'Date', 'Status'],
    'Full View': allColumns.map(col => col.name),
};

const CancelOrder = () => {
    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'date', order: 'desc' });

    const filteredData = cancelOrders
        .filter(item =>
            Object.values(item).some(val =>
                val.toString().toLowerCase().includes(filterText.toLowerCase())
            )
        )
        .sort((a, b) => {
            const field = sortConfig.field;
            const valA = a[field];
            const valB = b[field];
            if (sortConfig.order === 'desc') return valA < valB ? 1 : -1;
            else return valA > valB ? 1 : -1;
        });

    const toggleColumn = (colName) => {
        setVisibleColumns(prev =>
            prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
        );
    };

    const applyPreset = (preset) => {
        setVisibleColumns(presets[preset]);
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const handleSortSelect = (field, order = 'desc') => {
        setSortConfig({ field, order });
        setSortDropdownOpen(false);
    };

    const columnsToShow = allColumns.filter(col => visibleColumns.includes(col.name));

    const counters = [
        { title: 'All Cancelled', count: cancelOrders.length, icon: <FaList size={30} color="#fff" />, bgColor: '#6c757d', textColor: '#fff' },
        { title: 'Refund Processed', count: cancelOrders.filter(o => o.refundStatus === 'Processed').length, icon: <FaCheckCircle size={30} color="#fff" />, bgColor: '#28a745', textColor: '#fff' },
        { title: 'Refund Pending', count: cancelOrders.filter(o => o.refundStatus === 'Pending').length, icon: <FaHourglassHalf size={30} color="#fff" />, bgColor: '#ffc107', textColor: '#000' },
    ];

    return (
        <div>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Cancellations</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Orders
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>

            {/* Counters */}
            <Row>
                {counters.map((item, index) => (
                    <Col key={index} md="4" sm="6" xs="12" className="mb-3">
                        <Card className="text-start shadow-sm" style={{ backgroundColor: item.bgColor, color: item.textColor }}>
                            <CardBody className='p-2'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>
                                        <h3 className="mb-0 text-white">{item.count}</h3>
                                        <small className='text-white'>{item.title}</small>
                                    </div>
                                    <div className='text-white'>{item.icon}</div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className='mt-4'>
                <Col md="6" className='mb-2'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, product, contact..."
                        style={{ maxWidth: '250px' }}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Col>
                <Col md="6">
                    <div className="d-flex justify-content-end">
                        {/* Sort Dropdown */}
                        <div className="position-relative me-2">
                            <button className="btn btn-outline-secondary btn-sm" style={{ backgroundColor: '#02339a', color: '#fff' }} onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                                Sort By <RiArrowDropDownLine size={20} />
                            </button>
                            {sortDropdownOpen && (
                                <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ width: '200px', zIndex: 1000 }}>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('date')}>Date</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('amount')}>Amount</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('customerName')}>Customer Name</div>
                                </div>
                            )}
                        </div>

                        {/* Customize Columns */}
                        <div className="position-relative me-2">
                            <button className="btn btn-outline-primary btn-sm text-white" style={{ backgroundColor: '#02339a' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                Customize Columns <RiArrowDropDownLine size={20} />
                            </button>
                            {dropdownOpen && (
                                <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ maxHeight: '280px', overflowY: 'auto', zIndex: 1000 }}>
                                    <strong className="px-2 d-block">Customize Columns</strong>
                                    {allColumns.map(col => (
                                        <label key={col.name} className="dropdown-item d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-2"
                                                checked={visibleColumns.includes(col.name)}
                                                onChange={() => toggleColumn(col.name)}
                                            />
                                            {col.name}
                                        </label>
                                    ))}
                                    <hr />
                                    <div className="px-2">
                                        <div className="dropdown-item text-primary" onClick={() => applyPreset('Default View')}>Default View</div>
                                        <div className="dropdown-item text-primary" onClick={() => applyPreset('Full View')}>Full View</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Export CSV */}
                        <CSVLink
                            data={selectedRows.length ? selectedRows : filteredData}
                            filename="cancel_orders.csv"
                            style={{ backgroundColor: '#02339a' }}
                            className="btn btn-success btn-sm text-white"
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
                                selectableRows
                                onSelectedRowsChange={handleRowSelected}
                                highlightOnHover
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CancelOrder;
