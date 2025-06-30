import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Col, Row } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";

const demoWarehouses = [
    {
        id: 1,
        warehouseName: 'Delhi Warehouse',
        location: 'Delhi, India',
        contactPerson: 'Amit Sharma',
        contactNumber: '+91 9876543210',
        capacity: '5000 units',
        area: '3000 sq ft',
        type: 'Fulfillment Center',
        created: '2024-01-05',
        updated: '2024-05-10',
        status: 'Active',
        onboardingStage: 'Completed',
        managerEmail: 'amit@warehouse.com',
        handlingSKU: 1200,
        inventorySoftware: 'Zoho Inventory',
        workingHours: '9 AM - 6 PM',
        specialNotes: 'Temperature Controlled',
        action: 'Edit/Delete',
    },
    {
        id: 2,
        warehouseName: 'Mumbai Hub',
        location: 'Mumbai, India',
        contactPerson: 'Rohit Verma',
        contactNumber: '+91 9988776655',
        capacity: '8000 units',
        area: '4500 sq ft',
        type: 'Distribution Center',
        created: '2024-02-12',
        updated: '2024-05-15',
        status: 'Pending Approval',
        onboardingStage: 'Document Verification',
        managerEmail: 'rohit@warehouse.com',
        handlingSKU: 2500,
        inventorySoftware: 'SAP WMS',
        workingHours: '24x7',
        specialNotes: 'Handles fragile items',
        action: 'Edit/Delete',
    },
    {
        id: 3,
        warehouseName: 'Bangalore DC',
        location: 'Bangalore, India',
        contactPerson: 'Suresh Kumar',
        contactNumber: '+91 9123456789',
        capacity: '10000 units',
        area: '6000 sq ft',
        type: 'Fulfillment Center',
        created: '2023-12-01',
        updated: '2024-05-08',
        status: 'Active',
        onboardingStage: 'Completed',
        managerEmail: 'suresh@warehouse.com',
        handlingSKU: 3000,
        inventorySoftware: 'NetSuite WMS',
        workingHours: '10 AM - 7 PM',
        specialNotes: 'Near Airport',
        action: 'Edit/Delete',
    },
];

const allColumns = [
    { name: 'Warehouse Name', selector: row => row.warehouseName, sortable: true },
    { name: 'Location', selector: row => row.location, sortable: true },
    { name: 'Contact Person', selector: row => row.contactPerson, sortable: true },
    { name: 'Contact Number', selector: row => row.contactNumber, sortable: true },
    { name: 'Capacity', selector: row => row.capacity, sortable: true, right: true },
    { name: 'Area', selector: row => row.area, sortable: true },
    { name: 'Type', selector: row => row.type, sortable: true },
    { name: 'Creation Time', selector: row => row.created, sortable: true },
    { name: 'Update Time', selector: row => row.updated, sortable: true },
    { name: 'Status', selector: row => row.status, sortable: true },
    { name: 'Onboarding Stage', selector: row => row.onboardingStage, sortable: true },
    { name: 'Manager Email', selector: row => row.managerEmail, sortable: true },
    { name: 'Handling SKU Count', selector: row => row.handlingSKU, sortable: true, right: true },
    { name: 'Inventory Software', selector: row => row.inventorySoftware, sortable: true },
    { name: 'Working Hours', selector: row => row.workingHours, sortable: true },
    { name: 'Special Notes', selector: row => row.specialNotes, sortable: false },
    { name: 'Action', selector: row => row.action, sortable: false },
];

const presets = {
    'Default View': ['Warehouse Name', 'Location', 'Status', 'Onboarding Stage'],
    'Full View': allColumns.map(col => col.name),
};

const WarehouseOnboarding = () => {
    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'created', order: 'desc' });

    const filteredData = demoWarehouses
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
            <Row>
                <Breadcrumb className='my-2'>
                    <BreadcrumbItem>
                        <h5>Warehouse Onboarding</h5>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        Inventory
                    </BreadcrumbItem>
                </Breadcrumb>
            </Row>
            <Row>
                <Col md="6" className='mb-2'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Warehouse, Location, Contact"
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
                                    <div className="dropdown-item" onClick={() => handleSortSelect('warehouseName')}>Warehouse Name</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('created')}>Creation Time</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('status')}>Status</div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('onboardingStage')}>Onboarding Stage</div>
                                </div>
                            )}
                        </div>
                        {/* Customize Columns Dropdown */}
                        <div className="position-relative me-2">
                            <button className="btn btn-outline-primary text-white btn-sm" style={{ backgroundColor: '#02339a' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                Customize Columns <RiArrowDropDownLine size={20} />
                            </button>
                            {dropdownOpen && (
                                <div className="position-absolute bg-white border rounded shadow-sm mt-1 p-2" style={{ width: '240px', maxHeight: '280px', overflowY: 'auto', zIndex: 1000, cursor: 'pointer' }}>
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
                            filename="warehouse_onboarding_list.csv"
                            style={{ backgroundColor: '#02339a' }}
                            className="btn btn-success text-white btn-sm"
                        >
                            Export CSV
                        </CSVLink>
                    </div>
                </Col>
            </Row>
            <hr />
            <div className="table-responsive">
                <DataTable
                    columns={columnsToShow}
                    data={filteredData}
                    pagination
                    striped
                    selectableRows
                    onSelectedRowsChange={handleRowSelected}
                    highlightOnHover
                />
            </div>
        </div>
    );
};

export default WarehouseOnboarding;
