import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row, Nav, NavItem, NavLink } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaList, FaExclamationCircle, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';
import classnames from 'classnames';

// Sample cancellation orders data (same as your original)
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

// Sample logistics returns data
const logisticsReturns = [
    {
        id: 101,
        returnId: "RET1001",
        orderId: "ORD12350",
        customerName: "Alice Williams",
        contact: "9876501234",
        product: "Sony Headphones",
        sku: "SONY-HDPH-001",
        amount: 150,
        returnReason: "Damaged product",
        returnDate: "2024-06-10",
        logisticsPartner: "FedEx",
        trackingNumber: "FDX123456789",
        returnStatus: "In Transit",
        refundStatus: "Pending",
    },
    {
        id: 102,
        returnId: "RET1002",
        orderId: "ORD12351",
        customerName: "Bob Martin",
        contact: "9123409876",
        product: "Dell Monitor",
        sku: "DEL-MON-27IN",
        amount: 220,
        returnReason: "Wrong item sent",
        returnDate: "2024-06-09",
        logisticsPartner: "DHL",
        trackingNumber: "DHL987654321",
        returnStatus: "Delivered",
        refundStatus: "Processed",
    },
    {
        id: 103,
        returnId: "RET1003",
        orderId: "ORD12352",
        customerName: "Clara Oswald",
        contact: "9988123456",
        product: "Logitech Mouse",
        sku: "LOGI-MSE-BT",
        amount: 40,
        returnReason: "Not working",
        returnDate: "2024-06-11",
        logisticsPartner: "UPS",
        trackingNumber: "UPS567890123",
        returnStatus: "Pending Pickup",
        refundStatus: "Pending",
    },
];

// Columns for cancellation orders (same as your original)
const cancelColumns = [
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

// Columns for logistics returns
const returnColumns = [
    { name: 'Return ID', selector: row => row.returnId, sortable: true },
    { name: 'Order ID', selector: row => row.orderId, sortable: true },
    { name: 'Customer Name', selector: row => row.customerName, sortable: true },
    { name: 'Contact', selector: row => row.contact, sortable: true },
    { name: 'Product', selector: row => row.product, sortable: true },
    { name: 'SKU', selector: row => row.sku, sortable: true },
    { name: 'Amount (₹)', selector: row => row.amount, sortable: true, right: true },
    { name: 'Return Reason', selector: row => row.returnReason, sortable: false },
    { name: 'Return Date', selector: row => row.returnDate, sortable: true },
    { name: 'Logistics Partner', selector: row => row.logisticsPartner, sortable: true },
    { name: 'Tracking Number', selector: row => row.trackingNumber, sortable: true },
    {
        name: 'Return Status',
        selector: row => row.returnStatus,
        sortable: true,
        cell: row => {
            let badgeClass = 'bg-secondary';
            if (row.returnStatus === 'Delivered') badgeClass = 'bg-success';
            else if (row.returnStatus === 'In Transit') badgeClass = 'bg-info text-white';
            else if (row.returnStatus === 'Pending Pickup') badgeClass = 'bg-warning text-dark';
            else if (row.returnStatus === 'Cancelled') badgeClass = 'bg-danger';
            return <span className={`badge ${badgeClass}`}>{row.returnStatus}</span>
        }
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
];

// Presets for columns toggle (for simplicity, show all columns by default)
const cancelPresets = {
    'Default View': ['Order ID', 'Customer Name', 'Product', 'Date', 'Status'],
    'Full View': cancelColumns.map(col => col.name),
};
const returnPresets = {
    'Default View': ['Return ID', 'Order ID', 'Customer Name', 'Product', 'Return Date', 'Return Status'],
    'Full View': returnColumns.map(col => col.name),
};

const CancellationsAndReturns = () => {
    const [activeTab, setActiveTab] = useState('cancellations'); // 'cancellations' or 'returns'

    // State for cancellations
    const [cancelVisibleColumns, setCancelVisibleColumns] = useState(cancelPresets['Default View']);
    const [cancelDropdownOpen, setCancelDropdownOpen] = useState(false);
    const [cancelSortDropdownOpen, setCancelSortDropdownOpen] = useState(false);
    const [cancelFilterText, setCancelFilterText] = useState('');
    const [cancelSelectedRows, setCancelSelectedRows] = useState([]);
    const [cancelSortConfig, setCancelSortConfig] = useState({ field: 'date', order: 'desc' });

    // State for returns
    const [returnVisibleColumns, setReturnVisibleColumns] = useState(returnPresets['Default View']);
    const [returnDropdownOpen, setReturnDropdownOpen] = useState(false);
    const [returnSortDropdownOpen, setReturnSortDropdownOpen] = useState(false);
    const [returnFilterText, setReturnFilterText] = useState('');
    const [returnSelectedRows, setReturnSelectedRows] = useState([]);
    const [returnSortConfig, setReturnSortConfig] = useState({ field: 'returnDate', order: 'desc' });

    // Filter & sort logic for cancellations
    const filteredCancelData = cancelOrders
        .filter(item =>
            Object.values(item).some(val =>
                val.toString().toLowerCase().includes(cancelFilterText.toLowerCase())
            )
        )
        .sort((a, b) => {
            const field = cancelSortConfig.field;
            const valA = a[field];
            const valB = b[field];
            if (cancelSortConfig.order === 'desc') return valA < valB ? 1 : -1;
            else return valA > valB ? 1 : -1;
        });

    // Filter & sort logic for returns
    const filteredReturnData = logisticsReturns
        .filter(item =>
            Object.values(item).some(val =>
                val.toString().toLowerCase().includes(returnFilterText.toLowerCase())
            )
        )
        .sort((a, b) => {
            const field = returnSortConfig.field;
            const valA = a[field];
            const valB = b[field];
            if (returnSortConfig.order === 'desc') return valA < valB ? 1 : -1;
            else return valA > valB ? 1 : -1;
        });

    // Toggle columns for cancellations
    const toggleCancelColumn = (colName) => {
        setCancelVisibleColumns(prev =>
            prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
        );
    };

    // Toggle columns for returns
    const toggleReturnColumn = (colName) => {
        setReturnVisibleColumns(prev =>
            prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
        );
    };

    // Apply presets for cancellations
    const applyCancelPreset = (preset) => {
        setCancelVisibleColumns(cancelPresets[preset]);
    };

    // Apply presets for returns
    const applyReturnPreset = (preset) => {
        setReturnVisibleColumns(returnPresets[preset]);
    };

    // Selected rows handlers
    const handleCancelRowSelected = (state) => {
        setCancelSelectedRows(state.selectedRows);
    };

    const handleReturnRowSelected = (state) => {
        setReturnSelectedRows(state.selectedRows);
    };

    // Sorting handlers
    const handleCancelSortSelect = (field, order = 'desc') => {
        setCancelSortConfig({ field, order });
        setCancelSortDropdownOpen(false);
    };

    const handleReturnSortSelect = (field, order = 'desc') => {
        setReturnSortConfig({ field, order });
        setReturnSortDropdownOpen(false);
    };

    // Columns to show
    const cancelColumnsToShow = cancelColumns.filter(col => cancelVisibleColumns.includes(col.name));
    const returnColumnsToShow = returnColumns.filter(col => returnVisibleColumns.includes(col.name));

    // Counters for cancellations
    const cancelCounters = [
        { title: 'All Cancelled', count: cancelOrders.length, icon: <FaList size={30} color="#fff" />, bgColor: '#6c757d', textColor: '#fff' },
        { title: 'Refund Processed', count: cancelOrders.filter(o => o.refundStatus === 'Processed').length, icon: <FaCheckCircle size={30} color="#fff" />, bgColor: '#28a745', textColor: '#fff' },
        { title: 'Refund Pending', count: cancelOrders.filter(o => o.refundStatus === 'Pending').length, icon: <FaHourglassHalf size={30} color="#fff" />, bgColor: '#ffc107', textColor: '#000' },
    ];

    // Counters for returns
    const returnCounters = [
        { title: 'All Returns', count: logisticsReturns.length, icon: <FaList size={30} color="#fff" />, bgColor: '#6c757d', textColor: '#fff' },
        { title: 'Returned Delivered', count: logisticsReturns.filter(o => o.returnStatus === 'Delivered').length, icon: <FaCheckCircle size={30} color="#fff" />, bgColor: '#28a745', textColor: '#fff' },
        { title: 'In Transit', count: logisticsReturns.filter(o => o.returnStatus === 'In Transit').length, icon: <FaHourglassHalf size={30} color="#fff" />, bgColor: '#17a2b8', textColor: '#fff' },
        { title: 'Refund Processed', count: logisticsReturns.filter(o => o.refundStatus === 'Processed').length, icon: <FaCheckCircle size={30} color="#fff" />, bgColor: '#28a745', textColor: '#fff' },
        { title: 'Refund Pending', count: logisticsReturns.filter(o => o.refundStatus === 'Pending').length, icon: <FaHourglassHalf size={30} color="#fff" />, bgColor: '#ffc107', textColor: '#000' },
    ];

    return (
        <div>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Cancellations & Returns</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            {activeTab === 'cancellations' ? 'Cancellations' : 'Logistics Returns'}
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>

            {/* Tabs to switch between Cancellations and Returns */}
            <Row>
                <Col md="12">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === 'cancellations' })}
                                onClick={() => setActiveTab('cancellations')}
                                style={{ cursor: 'pointer' }}
                            >
                                Cancellations
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === 'returns' })}
                                onClick={() => setActiveTab('returns')}
                                style={{ cursor: 'pointer' }}
                            >
                                Logistics Returns
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
            </Row>

            {/* Counters */}
            <Row className="mt-3">
                {(activeTab === 'cancellations' ? cancelCounters : returnCounters).map((item, index) => (
                    <Col key={index} md={activeTab === 'returns' ? "2" : "4"} sm="6" xs="12" className="mb-3">
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

            {/* Search, Sort, Customize Columns & Export CSV */}
            <Row className='mt-2 align-items-center'>
                <Col md="6" className='mb-2'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder={activeTab === 'cancellations' ? "Search by name, product, contact..." : "Search by name, product, contact, tracking..."}
                        style={{ maxWidth: '300px' }}
                        value={activeTab === 'cancellations' ? cancelFilterText : returnFilterText}
                        onChange={e => activeTab === 'cancellations' ? setCancelFilterText(e.target.value) : setReturnFilterText(e.target.value)}
                    />
                </Col>
                <Col md="6">
                    <div className="d-flex justify-content-end flex-wrap gap-2">
                        {/* Sort Dropdown */}
                        <div className="position-relative">
                            <button
                                className={`btn btn-outline-secondary btn-sm`}
                                style={{ backgroundColor: '#02339a', color: '#fff' }}
                                onClick={() => activeTab === 'cancellations' ? setCancelSortDropdownOpen(!cancelSortDropdownOpen) : setReturnSortDropdownOpen(!returnSortDropdownOpen)}
                            >
                                Sort By <RiArrowDropDownLine size={20} />
                            </button>
                            {(activeTab === 'cancellations' ? cancelSortDropdownOpen : returnSortDropdownOpen) && (
                                <div
                                    className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                                    style={{ width: '220px', zIndex: 1000 }}
                                >
                                    {(activeTab === 'cancellations' ? 
                                        [
                                            { label: 'Date', field: 'date' },
                                            { label: 'Amount', field: 'amount' },
                                            { label: 'Customer Name', field: 'customerName' },
                                        ] :
                                        [
                                            { label: 'Return Date', field: 'returnDate' },
                                            { label: 'Amount', field: 'amount' },
                                            { label: 'Customer Name', field: 'customerName' },
                                        ]
                                    ).map(({ label, field }) => (
                                        <div
                                            key={field}
                                            className="dropdown-item"
                                            onClick={() => activeTab === 'cancellations' ? handleCancelSortSelect(field) : handleReturnSortSelect(field)}
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Customize Columns */}
                        <div className="position-relative">
                            <button
                                className="btn btn-outline-primary btn-sm text-white"
                                style={{ backgroundColor: '#02339a' }}
                                onClick={() => activeTab === 'cancellations' ? setCancelDropdownOpen(!cancelDropdownOpen) : setReturnDropdownOpen(!returnDropdownOpen)}
                            >
                                Customize Columns <RiArrowDropDownLine size={20} />
                            </button>
                            {(activeTab === 'cancellations' ? cancelDropdownOpen : returnDropdownOpen) && (
                                <div
                                    className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                                    style={{ maxHeight: '280px', overflowY: 'auto', zIndex: 1000, minWidth: '220px' }}
                                >
                                    <strong className="px-2 d-block">Customize Columns</strong>
                                    {(activeTab === 'cancellations' ? cancelColumns : returnColumns).map(col => (
                                        <label key={col.name} className="dropdown-item d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-2"
                                                checked={(activeTab === 'cancellations' ? cancelVisibleColumns : returnVisibleColumns).includes(col.name)}
                                                onChange={() => activeTab === 'cancellations' ? toggleCancelColumn(col.name) : toggleReturnColumn(col.name)}
                                            />
                                            {col.name}
                                        </label>
                                    ))}
                                    <hr />
                                    <div className="px-2">
                                        <div
                                            className="dropdown-item text-primary"
                                            onClick={() => activeTab === 'cancellations' ? applyCancelPreset('Default View') : applyReturnPreset('Default View')}
                                        >
                                            Default View
                                        </div>
                                        <div
                                            className="dropdown-item text-primary"
                                            onClick={() => activeTab === 'cancellations' ? applyCancelPreset('Full View') : applyReturnPreset('Full View')}
                                        >
                                            Full View
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Export CSV */}
                        <CSVLink
                            data={activeTab === 'cancellations' ? (cancelSelectedRows.length ? cancelSelectedRows : filteredCancelData) : (returnSelectedRows.length ? returnSelectedRows : filteredReturnData)}
                            filename={activeTab === 'cancellations' ? "cancel_orders.csv" : "logistics_returns.csv"}
                            style={{ backgroundColor: '#02339a' }}
                            className="btn btn-success btn-sm text-white"
                        >
                            Export CSV
                        </CSVLink>
                    </div>
                </Col>
            </Row>

            <hr />

            {/* DataTable */}
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <DataTable
                                columns={activeTab === 'cancellations' ? cancelColumnsToShow : returnColumnsToShow}
                                data={activeTab === 'cancellations' ? filteredCancelData : filteredReturnData}
                                pagination
                                striped
                                responsive
                                selectableRows
                                onSelectedRowsChange={activeTab === 'cancellations' ? handleCancelRowSelected : handleReturnRowSelected}
                                highlightOnHover
                                persistTableHead
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CancellationsAndReturns;
