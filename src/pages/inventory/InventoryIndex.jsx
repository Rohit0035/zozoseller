import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Row } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { FaList, FaExclamationCircle, FaHourglassHalf, FaCheckCircle, FaDownload } from 'react-icons/fa';


const demoInventory = [
    {
        id: 1,
        title: 'iPhone 14',
        sku: 'APL-IPH14-128GB-BLK',
        category: 'Smartphones',
        warehouseLocation: 'A1-Rack3',
        reorderLevel: 10,
        supplier: 'Apple Inc',
        created: '2024-01-10',
        updated: '2024-05-01',
        stock: 25,
        sales: 300,
        damaged: 2,
        reserved: 5,
        procurementSLA: '2 days',
        fulfillment: 'Fulfilled by Seller',
        listingPrice: 799,
        finalPrice: 780,
        mrp: 899,
        returns: '5%',
        listingQuality: 'High',
        additionalInfo: '1-year warranty',
        action: 'Edit/Delete',
    },
    {
        id: 2,
        title: 'Galaxy S23',
        sku: 'SMSNG-GS23-256GB-GRY',
        category: 'Smartphones',
        warehouseLocation: 'B2-Rack1',
        reorderLevel: 15,
        supplier: 'Samsung Electronics',
        created: '2024-02-15',
        updated: '2024-05-03',
        stock: 40,
        sales: 450,
        damaged: 1,
        reserved: 3,
        procurementSLA: '1 day',
        fulfillment: 'Fulfilled by Amazon',
        listingPrice: 699,
        finalPrice: 690,
        mrp: 799,
        returns: '3%',
        listingQuality: 'Medium',
        additionalInfo: 'Includes free case',
        action: 'Edit/Delete',
    },
    {
        id: 3,
        title: 'MacBook Air',
        sku: 'APL-MAC-AIR-13IN',
        category: 'Laptops',
        warehouseLocation: 'C1-Rack4',
        reorderLevel: 5,
        supplier: 'Apple Inc',
        created: '2023-12-05',
        updated: '2024-05-02',
        stock: 10,
        sales: 150,
        damaged: 0,
        reserved: 2,
        procurementSLA: '3 days',
        fulfillment: 'Fulfilled by Seller',
        listingPrice: 999,
        finalPrice: 980,
        mrp: 1099,
        returns: '2%',
        listingQuality: 'High',
        additionalInfo: 'Free software bundle',
        action: 'Edit/Delete',
    },
    {
        id: 4,
        title: 'Dell XPS',
        sku: 'DLL-XPS-15',
        category: 'Laptops',
        warehouseLocation: 'D3-Rack2',
        reorderLevel: 8,
        supplier: 'Dell Technologies',
        created: '2023-11-01',
        updated: '2024-05-01',
        stock: 15,
        sales: 210,
        damaged: 1,
        reserved: 4,
        procurementSLA: '2 days',
        fulfillment: 'Fulfilled by Amazon',
        listingPrice: 850,
        finalPrice: 830,
        mrp: 899,
        returns: '4%',
        listingQuality: 'High',
        additionalInfo: 'Includes backpack',
        action: 'Edit/Delete',
    },
];

const allColumns = [
    { name: 'Product Title', selector: row => row.title, sortable: true },
    { name: 'SKU', selector: row => row.sku, sortable: true },
    { name: 'Category', selector: row => row.category, sortable: true },
    { name: 'Warehouse Location', selector: row => row.warehouseLocation, sortable: true },
    { name: 'Reorder Level', selector: row => row.reorderLevel, sortable: true, right: true },
    { name: 'Supplier', selector: row => row.supplier, sortable: true },
    { name: 'Creation Time', selector: row => row.created, sortable: true },
    { name: 'Update Time', selector: row => row.updated, sortable: true },
    { name: 'Current Stock', selector: row => row.stock, sortable: true, right: true },
    { name: 'Sales', selector: row => row.sales, sortable: true, right: true },
    { name: 'Damaged', selector: row => row.damaged, sortable: true, right: true },
    { name: 'Reserved', selector: row => row.reserved, sortable: true, right: true },
    { name: 'Procurement SLA', selector: row => row.procurementSLA, sortable: true },
    { name: 'Fulfillment', selector: row => row.fulfillment, sortable: true },
    { name: 'Listing Price', selector: row => row.listingPrice, sortable: true, right: true },
    { name: 'Final Price', selector: row => row.finalPrice, sortable: true, right: true },
    { name: 'MRP', selector: row => row.mrp, sortable: true, right: true },
    { name: 'Returns', selector: row => row.returns, sortable: true },
    { name: 'Listing Quality', selector: row => row.listingQuality, sortable: true },
    { name: 'Additional Info', selector: row => row.additionalInfo, sortable: false },
    { name: 'Action', selector: row => row.action, sortable: false },
];

const presets = {
    'Default View': ['Product Title', 'SKU', 'Current Stock', 'Sales', 'Reorder Level'],
    'Full View': allColumns.map(col => col.name),
};


const InventoryIndex = () => {

    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'sales', order: 'desc' });

    const filteredData = demoInventory
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
            { title: 'All Inventory', count: 1, icon: <FaList size={30} color="#fff" />, bgColor: '#6c757d', textColor: '#fff' },
            { title: 'Low Stock', count: 1, icon: <FaExclamationCircle size={30} color="#fff" />, bgColor: '#dc3545', textColor: '#fff' },
            { title: 'Out of Stock', count: 0, icon: <FaHourglassHalf size={30} color="#fff" />, bgColor: '#ffc107', textColor: '#000' },
            { title: 'Recommendations', count: 0, icon: <FaCheckCircle size={30} color="#fff" />, bgColor: '#28a745', textColor: '#fff' },
        ];
    return (
        <div>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Inventory</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Home
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>
            {/* Inventory Summary Counters */}
            <Row>
               {counters.map((item, index) => (
                    <Col key={index} md="3" sm="6" xs="12" className="mb-3">
                        <Link to="/trackapprovalrequests" className='text-decoration-none'>
                            <Card className="text-start shadow-sm" style={{ backgroundColor: item.bgColor, color: item.textColor }}>
                                <CardBody className='p-2'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <h3 className="text-white" style={{ color: item.textColor }}>{item.count}</h3>
                                            <h5 className="mb-1 fs-6 fw-bold text-white" style={{ color: item.textColor }}>{item.title}</h5>
                                        </div>
                                        <div>{item.icon}</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

            <Row className='mt-4'>
                <Col md="6" className='mb-2'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search SKU, Product Title or Supplier"
                        style={{ maxWidth: '250px' }}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Col>
                <Col md="6">
                    <div className="d-flex align-items-end justify-content-end">
                        {/* Sort Dropdown */}
                        <div className="position-relative me-2">
                            <button className="btn btn-outline-secondary text-white btn-sm" style={{ backgroundColor: '#02339a' }} onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                                Sort By <RiArrowDropDownLine size={20} />
                            </button>
                            {sortDropdownOpen && (
                                <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ width: '220px', zIndex: 1000, cursor: 'pointer' }}>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('title')}>Product Title</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('created')}>Creation Time</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('updated')}>Update Time</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('stock')}>Current Stock</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('sales')}>Sales</div>
                                </div>
                            )}
                        </div>
                        {/* Customize Columns Dropdown */}
                        <div className="position-relative me-2">
                            <button className="btn btn-outline-primary text-white btn-sm" style={{ backgroundColor: '#02339a' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                Customize Columns <RiArrowDropDownLine size={20} />
                            </button>
                            {dropdownOpen && (
                                <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ width: '', maxHeight: '280px', overflowY: 'auto', zIndex: 1000, cursor: 'pointer' }}>
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
                        {/* CSV Export */}
                        <CSVLink
                            data={selectedRows.length ? selectedRows : filteredData}
                            filename="inventory_list.csv"
                            style={{ backgroundColor: '#02339a' }}
                            className="btn btn-success text-white btn-sm"
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

export default InventoryIndex;

