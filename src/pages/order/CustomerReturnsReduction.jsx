import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaList, FaTools, FaCheckCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { GetVendorOrders } from '../../api/vendorOrderAPI';
import { showToast } from '../../components/ToastifyNotification';

const returnReductionData = [
    {
        id: 1,
        returnId: 'RRD1001',
        orderId: 'ORD2001',
        customerName: 'Aman Singh',
        contact: '9998877665',
        product: 'Bluetooth Speaker',
        sku: 'BT-SPKR-BOOM100',
        reason: 'Sound not clear',
        frequency: 4,
        returnDate: '2024-06-20',
        actionTaken: 'QA Review',
        preventiveMeasure: 'Test before dispatch',
        status: 'Resolved'
    },
    {
        id: 2,
        returnId: 'RRD1002',
        orderId: 'ORD2002',
        customerName: 'Pooja Sharma',
        contact: '9876543210',
        product: 'Wireless Mouse',
        sku: 'LOGI-MSE-WLS',
        reason: 'Stopped working',
        frequency: 7,
        returnDate: '2024-06-18',
        actionTaken: 'Supplier Notified',
        preventiveMeasure: 'Changed batch',
        status: 'Resolved'
    },
    {
        id: 3,
        returnId: 'RRD1003',
        orderId: 'ORD2003',
        customerName: 'Rohit Mehra',
        contact: '9123456789',
        product: 'LED Monitor',
        sku: 'LED-MON-24',
        reason: 'Dead on arrival',
        frequency: 2,
        returnDate: '2024-06-15',
        actionTaken: 'Packaging Changed',
        preventiveMeasure: 'Double foam wrap',
        status: 'In Progress'
    }
];

// Column definitions
const columns = [
    { name: 'Return ID', selector: row => row.returnId, sortable: true },
    { name: 'Order ID', selector: row => row.orderId, sortable: true },
    { name: 'Customer Name', selector: row => row.customerName, sortable: true },
    { name: 'Contact', selector: row => row.contact },
    { name: 'Product', selector: row => row.product, sortable: true },
    { name: 'SKU', selector: row => row.sku },
    { name: 'Return Reason', selector: row => row.reason },
    { name: 'Frequency', selector: row => row.frequency, sortable: true },
    { name: 'Return Date', selector: row => row.returnDate, sortable: true },
    { name: 'Action Taken', selector: row => row.actionTaken },
    { name: 'Preventive Measure', selector: row => row.preventiveMeasure },
    {
        name: 'Status',
        selector: row => row.status,
        cell: row => (
            <span className={`badge ${row.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'}`}>
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

const CustomerReturnsReduction = () => {
    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'date', order: 'desc' });
    const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const dispatch = useDispatch();

  const fetchOrders = async (data) => {
      dispatch({ type: 'loader', loader: true })
  
      try {
        const response = await GetVendorOrders(data); // Make sure login function returns token
        console.log(response);
        if (response.success == true) {
          showToast('success', response.message)
          const formattedData = response.data.map((item, index) => ({
            index: index + 1,
            id: item._id,
            returnId: item.orderId?.returnId,
            orderId: item.orderId?.orderUniqueId,
            customerName: item.orderId?.userId?.name,
            contact: item.orderId?.userId?.phone,
            product: item.orderItems[0]?.productId?.name,
            sku: item.orderItems[0]?.productVariationId?.sku,
            reason: item.returnReason || 'N/A',
            frequency: item.returnFrequency || 'N/A',
            returnDate: item.returnDate || 'N/A',
            actionTaken: item.actionTaken || 'N/A',
            preventiveMeasure: item.preventiveMeasure || 'N/A',
            status: item.orderStatus,
          }));
          setData(formattedData);
          setFilteredData(formattedData);
        } else {
          // setError(response.message);
          showToast('error', response.message)
        }
      } catch (error) {
        // setError(error); // Handle login errors
        showToast('error', error)
      } finally {
        dispatch({ type: 'loader', loader: false })
      }
    }
  
    useEffect(() => {
      fetchOrders();
    }, []);

    const applyPreset = (preset) => {
        setVisibleColumns(presets[preset]);
        setDropdownOpen(false);
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const columnsToShow = columns.filter(col => visibleColumns.includes(col.name));

    const counters = [
        {
            title: 'Total Returns Analyzed',
            count: data.length,
            icon: <FaList size={30} color="#fff" />,
            bgColor: '#6c757d',
            textColor: '#fff'
        },
        {
            title: 'Resolved Issues',
            count: data.filter(o => o.status === 'Resolved').length,
            icon: <FaCheckCircle size={30} color="#fff" />,
            bgColor: '#28a745',
            textColor: '#fff'
        },
        {
            title: 'Improvements Made',
            count: data.filter(o => o.actionTaken !== '').length,
            icon: <FaTools size={30} color="#fff" />,
            bgColor: '#007bff',
            textColor: '#fff'
        }
    ];

    return (
        <div>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem><h5>Customer Returns Reduction</h5></BreadcrumbItem>
                        <BreadcrumbItem active>Dashboard</BreadcrumbItem>
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
                        placeholder="Search by name, product, reason..."
                        style={{ maxWidth: '280px' }}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Col>

                <Col md="6" className="d-flex justify-content-end">
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
                        data={selectedRows.length ? selectedRows : filteredData}
                        filename="return_reduction_data.csv"
                        className="btn btn-primary btn-sm text-white"
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

export default CustomerReturnsReduction;
