import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { FaList, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa'; // Removed unused FaExclamationCircle
import { GetVendorOrders } from '../../api/vendorOrderAPI';
import { showToast } from '../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';

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
            <span className={`badge ${row.refundStatus === 'Refunded' ? 'bg-success' : (row.refundStatus === 'Pending' ? 'bg-warning text-dark' : 'bg-secondary')}`}>
                {row.refundStatus}
            </span>
        )
    },
    { name: 'Channel', selector: row => row.channel, sortable: true },
];

// Preset column views
const presets = {
    'Default View': ['Order ID', 'Customer Name', 'Product', 'Date', 'Status', 'Refund Status'],
    'Full View': allColumns.map(col => col.name),
};

// Map sort field names to keys in the data object
const sortFieldMap = {
    'Date': 'createdAtTimestamp', // Use timestamp for accurate date sort
    'Amount': 'amount',
    'Customer Name': 'customerName',
};


const CancelOrder = () => {
    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    // Changed initial sort field to reflect the property name
    const [sortConfig, setSortConfig] = useState({ field: 'date', order: 'desc' });
    const [data, setData] = useState([]); // Stores raw API data
    
    // filteredData is now calculated using useMemo
    // const [filteredData, setFilteredData] = useState([]); // Removed this, using useMemo now

    const dispatch = useDispatch();

    const fetchOrders = async () => { // Removed `data` argument as we'll filter for cancelled orders
        dispatch({ type: 'loader', loader: true })
    
        try {
            // Assuming orderStatus = 'Cancelled' or 'Returned' is needed for this page
            const response = await GetVendorOrders({ orderStatus: ['Cancelled', 'Returned', 'Refunded'] }); 
            
            if (response.success === true) {
                showToast('success', response.message)
                
                const formattedData = response.data.map((item, index) => ({
                    index: index + 1,
                    id: item._id,
                    orderId: item.orderId?.orderUniqueId,
                    customerName: item.orderId?.userId?.name || 'N/A',
                    contact: item.orderId?.userId?.phone || 'N/A',
                    product: item.orderItems[0]?.productId?.name || 'N/A',
                    sku: item.orderItems[0]?.productVariationId?.sku || 'N/A',
                    amount: item.total || 0,
                    reason: item.returnReason || 'N/A', // Assuming reason for cancellation/return is stored here
                    date: new Date(item.createdAt).toLocaleDateString(), // Formatted date for display
                    createdAtTimestamp: new Date(item.createdAt).getTime(), // Timestamp for sorting
                    status: item.orderStatus,
                    refundStatus: item.refundStatus || (item.orderStatus === 'Cancelled' ? 'Pending' : 'N/A'), // Set default Refunded status
                    channel: item.orderId?.channel || 'N/A',
                }));
                
                setData(formattedData);
            } else {
                showToast('error', response.message)
            }
        } catch (error) {
            showToast('error', error.toString())
        } finally {
            dispatch({ type: 'loader', loader: false })
        }
    }
    
    useEffect(() => {
        fetchOrders();
    }, []);

    // --- NEW: Combined Filtered and Sorted Data Logic ---
    const filteredAndSortedData = useMemo(() => {
        let currentData = data;

        // 1. Filtering Logic
        if (filterText) {
            const lowerCaseFilter = filterText.toLowerCase();
            currentData = currentData.filter(item =>
                Object.values(item).some(val =>
                    val !== null && val !== undefined && val.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }

        // 2. Sorting Logic
        if (sortConfig.field) {
            const sortKey = sortFieldMap[sortConfig.field] || sortConfig.field;
            
            currentData.sort((a, b) => {
                const valA = a[sortKey];
                const valB = b[sortKey];

                if (valA === undefined || valA === null) return sortConfig.order === 'desc' ? 1 : -1;
                if (valB === undefined || valB === null) return sortConfig.order === 'desc' ? -1 : 1;

                if (typeof valA === 'string') {
                    return sortConfig.order === 'desc' 
                        ? valB.localeCompare(valA) 
                        : valA.localeCompare(valB);
                } else {
                    return sortConfig.order === 'desc' ? (valB - valA) : (valA - valB);
                }
            });
        }
        
        return currentData;
    }, [data, filterText, sortConfig]);
    // --- END: Filtered and Sorted Data Logic ---


    const toggleColumn = (colName) => {
        setVisibleColumns(prev =>
            prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
        );
    };

    const applyPreset = (preset) => {
        setVisibleColumns(presets[preset]);
        setDropdownOpen(false);
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const handleSortSelect = (field, order = 'desc') => {
        setSortConfig({ field, order });
        setSortDropdownOpen(false);
    };

    const columnsToShow = allColumns.filter(col => visibleColumns.includes(col.name));

    // --- NEW: Updated Counter Logic ---
    const counters = useMemo(() => [
        { title: 'All Cancellations', count: data.length, icon: <FaList size={30} color="#fff" />, bgColor: '#6c757d', textColor: '#fff' },
        { title: 'Refunded', count: data.filter(o => o.refundStatus === 'Refunded').length, icon: <FaCheckCircle size={30} color="#fff" />, bgColor: '#28a745', textColor: '#fff' },
        { title: 'Refund Pending', count: data.filter(o => o.refundStatus === 'Pending').length, icon: <FaHourglassHalf size={30} color="#fff" />, bgColor: '#ffc107', textColor: '#000' },
    ], [data]);
    // --- END: Updated Counter Logic ---

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

            <hr />

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

            <hr />

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
                                    {/* Using keys that map to the data for sorting */}
                                    <div className="dropdown-item" onClick={() => handleSortSelect('Date')}>Date</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('Amount')}>Amount</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('Customer Name')}>Customer Name</div>
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
                            data={selectedRows.length ? selectedRows : filteredAndSortedData}
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
                                data={filteredAndSortedData}
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