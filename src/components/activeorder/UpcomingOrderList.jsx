import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";

const demoUpcomingOrders = [
  {
    id: 1,
    orderId: 'UP-5001',
    productInfo: 'Sony WH-1000XM5 Headphones',
    amount: '$350',
    dispatchAfter: '2025-07-05',
    status: 'Scheduled',
  },
  {
    id: 2,
    orderId: 'UP-5002',
    productInfo: 'Google Pixel 7 Pro',
    amount: '$899',
    dispatchAfter: '2025-07-10',
    status: 'Pending',
  },
  {
    id: 3,
    orderId: 'UP-5003',
    productInfo: 'Apple Watch Series 9',
    amount: '$399',
    dispatchAfter: '2025-07-12',
    status: 'Scheduled',
  },
  {
    id: 4,
    orderId: 'UP-5004',
    productInfo: 'Amazon Echo Dot 5th Gen',
    amount: '$49',
    dispatchAfter: '2025-07-08',
    status: 'Pending',
  },
];

const allColumns = [
  { name: 'Order ID', selector: row => row.orderId, sortable: true },
  { name: 'Product Information', selector: row => row.productInfo, sortable: true },
  { name: 'Amount', selector: row => row.amount, sortable: true, right: true },
  { name: 'Dispatch After', selector: row => row.dispatchAfter, sortable: true },
  { name: 'Status', selector: row => row.status, sortable: true },
];

const presets = {
  'Default View': ['Order ID', 'Product Information', 'Amount', 'Dispatch After', 'Status'],
  'Minimal View': ['Order ID', 'Product Information', 'Status'],
  'Full View': allColumns.map(col => col.name),
};

const UpcomingOrderList = () => {
  const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: 'orderId', order: 'desc' });

  // Filter and sort data
  const filteredData = demoUpcomingOrders
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

  return (
    <div>
      <Row className='mt-2'>
        <Col md="6" className='mb-2'>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Order ID, Product Info, Status"
            style={{ maxWidth: '300px' }}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Col>
        <Col md="6">
          <div className="d-flex align-items-end justify-content-end">
            {/* Sort Dropdown */}
            <div className="position-relative me-2">
              <button className="btn btn-primary btn-sm" onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                Sort By <RiArrowDropDownLine size={20} />
              </button>
              {sortDropdownOpen && (
                <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ width: '180px', zIndex: 1000 }}>
                  {allColumns.map(col => (
                    <div
                      key={col.name}
                      className="dropdown-item"
                      onClick={() => handleSortSelect(col.selector.name || col.name.toLowerCase())}
                    >
                      {col.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customize Columns */}
            <div className="position-relative me-2">
              <button className="btn btn-primary btn-sm" onClick={() => setDropdownOpen(!dropdownOpen)}>
                Customize Columns <RiArrowDropDownLine size={20} />
              </button>
              {dropdownOpen && (
                <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1000 }}>
                  <strong className="px-2 d-block">Select Columns</strong>
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
                    {Object.keys(presets).map(preset => (
                      <div
                        key={preset}
                        className="dropdown-item text-primary"
                        onClick={() => applyPreset(preset)}
                      >
                        {preset}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export CSV */}
            <CSVLink
              data={selectedRows.length ? selectedRows : filteredData}
              filename="upcoming_orders.csv"
              className="btn btn-primary btn-sm"
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

export default UpcomingOrderList;
