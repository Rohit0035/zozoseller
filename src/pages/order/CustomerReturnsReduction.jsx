import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaList, FaTools, FaCheckCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { GetVendorOrders } from '../../api/vendorOrderAPI'; // API call reinstated
import { showToast } from '../../components/ToastifyNotification';

// --- Helper function for Date Formatting ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    return date.toLocaleDateString();
};

// --- Column definitions ---
const columns = [
    { name: 'Return ID', selector: row => row.returnId, sortable: true },
    { name: 'Order ID', selector: row => row.orderId, sortable: true },
    { name: 'Customer Name', selector: row => row.customerName, sortable: true },
    { name: 'Contact', selector: row => row.contact },
    { name: 'Product', selector: row => row.product, sortable: true },
    { name: 'SKU', selector: row => row.sku },
    { name: 'Return Reason', selector: row => row.reason, sortable: true },
    { name: 'Frequency', selector: row => row.frequency, sortable: true },
    { name: 'Return Date', selector: row => formatDate(row.returnDate), sortable: true, id: 'returnDate' },
    { name: 'Action Taken', selector: row => row.actionTaken },
    { name: 'Preventive Measure', selector: row => row.preventiveMeasure },
    {
        name: 'Status',
        selector: row => row.status,
        cell: row => (
            // Assuming 'Resolved' is a status logged by the vendor after taking action
            <span className={`badge ${row.status === 'Returned' ? 'bg-warning text-dark' : 'bg-success'}`}>
                {row.status}
            </span>
        )
    }
];

// View presets
const presets = {
    'Default View': ['Return ID', 'Product', 'Return Reason', 'Frequency', 'Action Taken', 'Status'],
    'Full View': columns.map(col => col.name)
};

// Map sort field names to keys in the data object
const sortFieldMap = {
    'Product': 'product',
    'Return Reason': 'reason',
    'Frequency': 'frequency',
    'Return Date': 'returnDateTimestamp', 
};


const CustomerReturnsReduction = () => {
    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'Return Date', order: 'desc' }); 
    const [data, setData] = useState([]);

    const dispatch = useDispatch();

    // The fetch logic is updated to get real data, filtered for 'Returned' status
    const fetchOrders = async () => {
        dispatch({ type: 'loader', loader: true });
        
        try {
            // ⭐ Filtering for 'Returned' orders for reduction analysis
            const response = await GetVendorOrders({ orderStatus: ['Returned'] }); 
            
            if (response.success === true) {
                showToast('success', response.message);
                
                // Map API response to the required format for reduction analysis
                const formattedData = response.data.map((item, index) => {
                    // Placeholder values for Reduction fields, as they typically come from a secondary logging system or analysis.
                    // In a real app, you would fetch or calculate these:
                    const mockActionStatus = index % 3 === 0 ? 'Resolved' : 'Returned';

                    return {
                        index: index + 1,
                        id: item._id,
                        returnId: `RET${item.orderId?.returnId || item._id.slice(-6).toUpperCase()}`,
                        orderId: item.orderId?.orderUniqueId || item.orderId?._id.slice(-6).toUpperCase() || 'N/A',
                        customerName: item.orderId?.userId?.name || 'N/A',
                        contact: item.orderId?.userId?.phone || 'N/A',
                        product: item.orderItems[0]?.productId?.name || 'N/A',
                        sku: item.orderItems[0]?.productVariationId?.sku || 'N/A',
                        reason: item.returnReason || 'Product Defective', // Using the real returnReason
                        frequency: Math.floor(Math.random() * 10) + 1, // Mock Frequency
                        returnDate: item.updatedAt,
                        returnDateTimestamp: new Date(item.updatedAt).getTime(),
                        actionTaken: mockActionStatus === 'Resolved' ? 'QA Rechecked' : 'Pending Review',
                        preventiveMeasure: mockActionStatus === 'Resolved' ? 'Updated product listing' : 'None',
                        status: mockActionStatus, // Using the mock action status for the reduction view
                    };
                });
                
                setData(formattedData);
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', error.toString());
        } finally {
            dispatch({ type: 'loader', loader: false });
        }
    };
  
    useEffect(() => {
      fetchOrders();
    }, []);


    // --- Combined Filtered and Sorted Data Logic using useMemo ---
    const filteredAndSortedData = useMemo(() => {
        let currentData = [...data]; // Create a mutable copy

        // 1. Filtering Logic (Search)
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

    const columnsToShow = columns.filter(col => visibleColumns.includes(col.name));

    const counters = useMemo(() => [
        {
            title: 'Total Returns Analyzed',
            count: data.length,
            icon: <FaList size={30} color="#fff" />,
            bgColor: '#6c757d',
            textColor: '#fff'
        },
        {
            title: 'Issues Resolved',
            count: data.filter(o => o.status === 'Resolved').length,
            icon: <FaCheckCircle size={30} color="#fff" />,
            bgColor: '#28a745',
            textColor: '#fff'
        },
        {
            title: 'Pending Review',
            count: data.filter(o => o.status === 'Returned').length,
            icon: <FaTools size={30} color="#fff" />,
            bgColor: '#007bff',
            textColor: '#fff'
        }
    ], [data]);


    return (
        <div>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem><h5>Customer Returns Reduction</h5></BreadcrumbItem>
                        <BreadcrumbItem active>Analysis Dashboard</BreadcrumbItem>
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

            <Row className='mt-4'>
                <Col md="6" className='mb-2'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, product, reason..."
                        style={{ maxWidth: '280px' }}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Col>

                <Col md="6" className="d-flex justify-content-end">
                    {/* Sort By Dropdown */}
                    <div className="position-relative me-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                            Sort By <RiArrowDropDownLine size={20} />
                        </button>
                        {sortDropdownOpen && (
                            <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ width: '220px', zIndex: 1000 }}>
                                <div className="dropdown-item" onClick={() => handleSortSelect('Return Date')}>Return Date</div>
                                <div className="dropdown-item" onClick={() => handleSortSelect('Frequency')}>Frequency (High to Low)</div>
                                <div className="dropdown-item" onClick={() => handleSortSelect('Product')}>Product Name</div>
                                <div className="dropdown-item" onClick={() => handleSortSelect('Return Reason')}>Return Reason</div>
                            </div>
                        )}
                    </div>
                    
                    {/* Customize Columns */}
                    <div className="position-relative me-2">
                        <button
                            className="btn btn-outline-primary btn-sm text-white"
                            style={{ backgroundColor: '#02339a' }}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            Customize Columns <RiArrowDropDownLine size={20} />
                        </button>
                        {dropdownOpen && (
                            <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ maxHeight: '280px', overflowY: 'auto', zIndex: 1000 }}>
                                <strong className="px-2 d-block">Customize Columns</strong>
                                {columns.map(col => (
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
                        filename="return_reduction_data.csv"
                        className="btn btn-success btn-sm text-white"
                    >
                        Export CSV
                    </CSVLink>
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

export default CustomerReturnsReduction;