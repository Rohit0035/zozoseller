import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row, Badge, Button } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import {
  FaList, FaExclamationCircle, FaHourglassHalf, FaCheckCircle
} from 'react-icons/fa';

const returnOrders = [
  {
    id: 1,
    title: 'iPhone 14',
    sku: 'APL-IPH14-128GB-BLK',
    category: 'Smartphones',
    customerName: 'John Doe',
    orderDate: '2024-06-01',
    returnDate: '2024-06-10',
    returnReason: 'Defective product',
    refundStatus: 'Pending',
    quantity: 1,
    amount: '$780',
    status: 'Cancelled',
  },
  {
    id: 2,
    title: 'Galaxy S23',
    sku: 'SMSNG-GS23-256GB-GRY',
    category: 'Smartphones',
    customerName: 'Jane Smith',
    orderDate: '2024-06-02',
    returnDate: '2024-06-12',
    returnReason: 'Wrong item delivered',
    refundStatus: 'Refunded',
    quantity: 1,
    amount: '$690',
    status: 'Cancelled',
  }
];

const allColumns = [
  { name: 'Product', selector: row => row.title, sortable: true },
  { name: 'SKU', selector: row => row.sku, sortable: true },
  { name: 'Category', selector: row => row.category, sortable: true },
  { name: 'Customer Name', selector: row => row.customerName, sortable: true },
  { name: 'Order Date', selector: row => row.orderDate, sortable: true },
  { name: 'Return Date', selector: row => row.returnDate, sortable: true },
  { name: 'Reason', selector: row => row.returnReason, sortable: true },
  { name: 'Refund Status', selector: row => row.refundStatus, sortable: true },
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
      <Button color="danger" size="sm">
        Cancel
      </Button>
    )
  }
];

const presets = {
  'Default View': ['Product', 'SKU', 'Customer Name', 'Status'],
  'Full View': allColumns.map(col => typeof col.name === 'string' ? col.name : '')
};

const ReturnOrder = () => {
  const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: 'returnDate', order: 'desc' });

  const filteredData = returnOrders
    .filter(item =>
      Object.values(item).some(val =>
        val.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      const valA = a[sortConfig.field];
      const valB = b[sortConfig.field];
      return sortConfig.order === 'desc' ? (valA < valB ? 1 : -1) : (valA > valB ? 1 : -1);
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
    { title: 'All Returns', count: returnOrders.length, icon: <FaList size={24} />, bgColor: '#6c757d', textColor: '#fff' },
    { title: 'Pending Refunds', count: returnOrders.filter(r => r.refundStatus === 'Pending').length, icon: <FaExclamationCircle size={24} />, bgColor: '#dc3545', textColor: '#fff' },
    { title: 'Completed Refunds', count: returnOrders.filter(r => r.refundStatus === 'Refunded').length, icon: <FaCheckCircle size={24} />, bgColor: '#198754', textColor: '#fff' },
  ];

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
                <div className="dropdown-item" onClick={() => handleSortSelect('returnDate')}>Return Date</div>
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

          <CSVLink
            data={selectedRows.length ? selectedRows : filteredData}
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

export default ReturnOrder;
