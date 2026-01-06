import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row, Badge, Button } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import {
  FaList, FaExclamationCircle, FaCheckCircle
} from 'react-icons/fa';
import { GetVendorOrders } from '../../api/vendorOrderAPI';
import { showToast } from '../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';

// Removed static mock data (returnOrders)

// Helper function to format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';
    return date.toLocaleDateString();
};

// Column definitions (Updated for dynamic badge/link rendering)
const allColumns = [
  { 
    name: 'Product', 
    selector: row => row.title, 
    sortable: true,
    // cell: row => <Link to={`/product/${row.productId}`}>{row.title}</Link> // Uncomment if you have product links
  },
  { name: 'SKU', selector: row => row.sku, sortable: true },
  { name: 'Category', selector: row => row.category, sortable: true },
  { name: 'Customer Name', selector: row => row.customerName, sortable: true },
  { name: 'Order Date', selector: row => row.orderDateDisplay, sortable: true },
  { name: 'Return Date', selector: row => row.returnDateDisplay, sortable: true },
  { name: 'Reason', selector: row => row.returnReason, sortable: true },
  { 
    name: 'Refund Status', 
    selector: row => row.refundStatus, 
    sortable: true,
    cell: row => (
        <Badge color={
            row.refundStatus === 'Refunded' ? 'success' : 
            (row.refundStatus === 'Pending' ? 'warning' : 'secondary')
        } pill>
            {row.refundStatus}
        </Badge>
    )
  },
  { name: 'Quantity', selector: row => row.quantity, sortable: true, right: true },
  { name: 'Amount', selector: row => row.amount, sortable: true },
  {
    name: 'Status',
    selector: row => (
      <Badge color="danger" pill>
        {row.status}
      </Badge>
    )
  },
  {
    name: 'Action',
    cell: row => (
      <Button color="info" size="sm" onClick={() => console.log('Process Return for', row.id)}>
        Process
      </Button>
    )
  }
];

const presets = {
  'Default View': ['Product', 'SKU', 'Customer Name', 'Status', 'Refund Status'], // Adjusted default view
  'Full View': allColumns.map(col => typeof col.name === 'string' ? col.name : '')
};

// Map sort field names to keys in the data object
const sortFieldMap = {
    'title': 'title',
    'Return Date': 'returnDateTimestamp', 
    'refundStatus': 'refundStatus',
};

const ReturnOrder = () => {
  const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  // Initial sort configuration now uses data keys
  const [sortConfig, setSortConfig] = useState({ field: 'Return Date', order: 'desc' });
  const [data, setData] = useState([]);
  // Removed setFilteredData, using useMemo now

  const dispatch = useDispatch();

  const fetchOrders = async () => {
      dispatch({ type: 'loader', loader: true })
  
      try {
        // ⭐ CORE CHANGE: Filter only for 'Returned' orders
        const response = await GetVendorOrders({ orderStatus: ['Returned'] }); 
        
        if (response.success === true) {
          showToast('success', response.message)
          
          const formattedData = response.data.map((item, index) => ({
            index: index + 1,
            id: item._id,
            title: item.orderItems[0]?.productId?.name || 'N/A',
            sku: item.orderItems[0]?.productVariationId?.sku || 'N/A',
            category: item.orderItems[0]?.productId?.categoryId?.name || 'N/A',
            customerName: item.orderId?.userId?.name || 'N/A',
            orderDateDisplay: formatDate(item.createdAt),
            orderDateTimestamp: new Date(item.createdAt).getTime(),
            returnDateDisplay: formatDate(item.updatedAt), // Use updatedAt as the return/update date
            returnDateTimestamp: new Date(item.updatedAt).getTime(),
            returnReason: item.returnReason || 'N/A',
            refundStatus: item.refundStatus || 'Pending', // Default to Pending if null
            quantity: item.orderItems[0]?.quantity || 0,
            amount: item.total || 0,
            status: item.orderStatus, // Should be 'Returned'
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

  // --- NEW: Combined Filtered and Sorted Data Logic using useMemo ---
  const filteredAndSortedData = useMemo(() => {
    let currentData = data;

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
        // Map the user-friendly sort field to the actual data key
        const sortKey = sortFieldMap[sortConfig.field] || sortConfig.field;
        
        currentData.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            // Handle null/undefined values
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
    setDropdownOpen(false)
  };

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const handleSortSelect = (field, order = 'desc') => {
    setSortConfig({ field, order });
    setSortDropdownOpen(false);
  };

  const columnsToShow = allColumns.filter(col => visibleColumns.includes(col.name));

  // Recalculate counters based on `data`
  const counters = useMemo(() => [
    { title: 'All Returns', count: data.length, icon: <FaList size={24} />, bgColor: '#6c757d', textColor: '#fff' },
    // Logic for Pending/Completed Refunds is now driven by the `refundStatus` field
    { title: 'Pending Refunds', count: data.filter(r => r.refundStatus !== 'Refunded').length, icon: <FaExclamationCircle size={24} />, bgColor: '#dc3545', textColor: '#fff' },
    { title: 'Completed Refunds', count: data.filter(r => r.refundStatus === 'Refunded').length, icon: <FaCheckCircle size={24} />, bgColor: '#198754', textColor: '#fff' },
  ], [data]);

  return (
    <div>
      <Row>
        <Col md="12">
          <Breadcrumb className='my-2'>
            <BreadcrumbItem><h5>Return Orders</h5></BreadcrumbItem>
            <BreadcrumbItem active>Dashboard</BreadcrumbItem>
          </Breadcrumb>
        </Col>
      </Row>
      
      <hr />

      <Row>
        {counters.map((item, index) => (
          <Col key={index} md="4" sm="6" xs="12" className="mb-3">
            <Card className="shadow-sm" style={{ backgroundColor: item.bgColor, color: item.textColor }}>
              <CardBody className='p-2'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <h3 className="mb-0">{item.count}</h3>
                    <p className="mb-0 fw-bold">{item.title}</p>
                  </div>
                  <div>{item.icon}</div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <hr />

      <Row className='mt-3'>
        <Col md="6">
          <input
            type="text"
            className="form-control"
            placeholder="Search product, customer or SKU"
            style={{ maxWidth: '250px' }}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Col>
        <Col md="6" className='d-flex justify-content-end'>
          <div className="position-relative me-2">
            <button className="btn btn-primary btn-sm" onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
              Sort By <RiArrowDropDownLine size={20} />
            </button>
            {sortDropdownOpen && (
              <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ width: '220px', zIndex: 1000 }}>
                <div className="dropdown-item" onClick={() => handleSortSelect('title')}>Product Title</div>
                <div className="dropdown-item" onClick={() => handleSortSelect('Return Date')}>Return Date</div>
                <div className="dropdown-item" onClick={() => handleSortSelect('refundStatus')}>Refund Status</div>
              </div>
            )}
          </div>

          <div className="position-relative me-2">
            <button className="btn btn-primary btn-sm" onClick={() => setDropdownOpen(!dropdownOpen)}>
              Customize Columns <RiArrowDropDownLine size={20} />
            </button>
            {dropdownOpen && (
              <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 1000 }}>
                <strong className="d-block px-2">Select Columns</strong>
                {allColumns.map(col => (
                    // Check if col.name is a string before accessing it, which it should be for valid column definitions
                  <label key={col.name || index} className="dropdown-item d-flex align-items-center">
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

          <CSVLink
            data={selectedRows.length ? selectedRows : filteredAndSortedData}
            filename="return_orders.csv"
            className="btn btn-success btn-sm"
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

export default ReturnOrder;