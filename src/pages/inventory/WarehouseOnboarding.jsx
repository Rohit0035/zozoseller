import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Breadcrumb, BreadcrumbItem, Col, Row } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch } from 'react-redux'; // Import useDispatch
import { showToast } from '../../components/ToastifyNotification'; // Assuming this path
import { GetWarehouses } from '../../api/warehouseAPI';

// Define all possible columns based on your API response structure
const allColumns = [
    { name: 'Warehouse Name', selector: row => row.name, sortable: true, wrap: true, minWidth: "150px" },
    { name: 'Location', selector: row => row.location, sortable: true, wrap: true, minWidth: "150px" },
    { name: 'Contact Person', selector: row => row.contactPerson, sortable: true, wrap: true, minWidth: "120px" },
    { name: 'Contact Number', selector: row => row.contactNumber, sortable: true, wrap: true, minWidth: "120px" },
    { name: 'Capacity', selector: row => row.capacity, sortable: true, right: true, width: "100px" },
    { name: 'Area', selector: row => row.area, sortable: true, width: "100px" },
    { name: 'Type', selector: row => row.type, sortable: true, wrap: true, minWidth: "120px" },
    { name: 'Creation Time', selector: row => new Date(row.createdAt).toLocaleString(), sortable: true, wrap: true, minWidth: "160px" }, // Assuming createdAt from API
    { name: 'Update Time', selector: row => new Date(row.updatedAt).toLocaleString(), sortable: true, wrap: true, minWidth: "160px" }, // Assuming updatedAt from API
    { name: 'Status', selector: row => row.status, sortable: true, width: "120px" },
    { name: 'Onboarding Stage', selector: row => row.onBoardingStage, sortable: true, wrap: true, minWidth: "140px" },
    { name: 'Manager Email', selector: row => row.managerEmail, sortable: true, wrap: true, minWidth: "150px" },
    { name: 'Handling SKU Count', selector: row => row.handlingSKUCount, sortable: true, right: true, width: "110px" },
    { name: 'Inventory Software', selector: row => row.inventorySoftware, sortable: true, wrap: true, minWidth: "150px" },
    { name: 'Working Hours', selector: row => row.workingHours, sortable: true, wrap: true, minWidth: "150px" },
    { name: 'Special Notes', selector: row => row.specialNotes, sortable: false, wrap: true, minWidth: "200px" },
    // Action column is not needed here as per the `ListWarehouse` example,
    // this component focuses on display and filtering.
    // If you need actions, you'd add it similarly to ListWarehouse.
];

const presets = {
    'Default View': ['Warehouse Name', 'Location', 'Status', 'Onboarding Stage'],
    'Full View': allColumns.map(col => col.name),
};

const WarehouseOnboarding = () => {
    const dispatch = useDispatch();
    const [warehouses, setWarehouses] = useState([]); // State for raw API data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'createdAt', order: 'desc' }); // Default sort by creation time

    // Fetch data from API
    const fetchWarehousesData = async () => {
        dispatch({ type: 'loader', loader: true });
        setLoading(true);
        setError(null);
        try {
            const response = await GetWarehouses();
            if (response.success && response.data) {
                // Ensure data has the keys expected by allColumns
                setWarehouses(response.data);
                showToast('success', response.message || 'Warehouses loaded successfully.');
            } else {
                showToast('error', response.message || 'Failed to fetch warehouses.');
                setError(response.message || 'Failed to fetch warehouses.');
            }
        } catch (err) {
            console.error("Error fetching warehouses:", err);
            showToast('error', 'An error occurred while fetching warehouses.');
            setError('An error occurred. Please try again later.');
        } finally {
            dispatch({ type: 'loader', loader: false });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehousesData();
    }, []); // Fetch data on component mount

    // Filter and sort logic
    const filteredAndSortedData = warehouses
        .filter(item =>
            Object.values(item).some(val =>
                val != null && val.toString().toLowerCase().includes(filterText.toLowerCase())
            )
        )
        .sort((a, b) => {
            const field = sortConfig.field;
            let valA = a[field];
            let valB = b[field];

            // Handle date sorting if necessary
            if (field === 'createdAt' || field === 'updatedAt') {
                valA = new Date(valA);
                valB = new Date(valB);
            }
            // Handle numeric sorting
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortConfig.order === 'desc' ? valB - valA : valA - valB;
            }

            // Fallback for string comparison
            if (valA < valB) return sortConfig.order === 'desc' ? 1 : -1;
            if (valA > valB) return sortConfig.order === 'desc' ? -1 : 1;
            return 0;
        });

    const toggleColumn = (colName) => {
        setVisibleColumns(prev =>
            prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
        );
    };

    const applyPreset = (preset) => {
        setVisibleColumns(presets[preset]);
        setDropdownOpen(false); // Close dropdown after applying preset
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const handleSortSelect = (field, order = 'desc') => {
        setSortConfig({ field, order });
        setSortDropdownOpen(false);
    };

    const columnsToShow = allColumns.filter(col => visibleColumns.includes(col.name));

    // Headers for CSV export
    const csvHeaders = allColumns
        .filter(col => visibleColumns.includes(col.name)) // Only export visible columns
        .map(col => ({
            label: col.name,
            key: col.selector.toString().match(/row\.(\w+)/)?.[1] || col.name.replace(/\s/g, ''), // Extract key from selector or derive
        }));

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
            <Row className="mb-3 align-items-center">
                <Col md="6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Warehouse, Location, Contact, etc."
                        style={{ maxWidth: '350px' }}
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
                                    {allColumns.filter(col => col.sortable).map(col => (
                                        <div key={col.name} className="dropdown-item" onClick={() => handleSortSelect(col.selector.toString().match(/row\.(\w+)/)?.[1] || col.name.replace(/\s/g, ''))}>
                                            {col.name} {sortConfig.field === (col.selector.toString().match(/row\.(\w+)/)?.[1] || col.name.replace(/\s/g, '')) && ` (${sortConfig.order === 'asc' ? 'Asc' : 'Desc'})`}
                                        </div>
                                    ))}
                                    <hr/>
                                    <div className="dropdown-item" onClick={() => handleSortSelect(sortConfig.field, sortConfig.order === 'asc' ? 'desc' : 'asc')}>
                                        Toggle Order ({sortConfig.order === 'asc' ? 'Desc' : 'Asc'})
                                    </div>
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
                            data={selectedRows.length ? selectedRows : filteredAndSortedData}
                            headers={csvHeaders}
                            filename={`warehouse_onboarding_list_${new Date().toISOString().slice(0, 10)}.csv`}
                            className="btn btn-success text-white btn-sm"
                            style={{ backgroundColor: '#02339a' }}
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
                    data={filteredAndSortedData}
                    pagination
                    striped
                    selectableRows
                    onSelectedRowsChange={handleRowSelected}
                    highlightOnHover
                    progressPending={loading}
                    noDataComponent={!loading && !error && <div className="text-center">No warehouses found.</div>}
                    subHeaderAlign="right"
                    subHeaderWrap
                />
            </div>
            {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
        </div>
    );
};

export default WarehouseOnboarding;