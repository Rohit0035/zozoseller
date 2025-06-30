import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Row, Col, Button, Badge, Input } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const demoProducts = [
    {
        id: 1,
        title: 'Bulk Gown Upload',
        sku: 'BULK001',
        image: 'https://picsum.photos/id/1018/100/60',
        updated: 'May 29, 2025, 04:08PM',
        rows: 50,
        qcProgress: 10,
        qcFailed: 2,
        pendingSellingInfo: 5,
        listingsCreated: 33,
        category: 'Ethnic wear',
        status: 'Draft',
    },
    {
        id: 2,
        title: 'Bulk Books Upload',
        sku: 'BULK002',
        image: 'https://picsum.photos/id/1015/100/60',
        updated: 'Mar 26, 2025, 05:15PM',
        rows: 100,
        qcProgress: 40,
        qcFailed: 5,
        pendingSellingInfo: 10,
        listingsCreated: 45,
        category: 'Books & media',
        status: 'Active',
    },
];

const categories = ['Clothing', 'Ethnic wear', 'Books & media'];
const statuses = ['Draft', 'Active', 'Pending'];

const columns = [
    {
        name: 'Product Detail',
        selector: row => (
            <div className="d-flex align-items-center">
                <img
                    src={row.image}
                    alt={row.title}
                    style={{ width: '25px', height: '25px', objectFit: 'cover', marginRight: '10px', borderRadius: '5px' }}
                />
                <div>
                    {row.title} <br />
                    <strong>SKU ID:</strong> {row.sku}
                </div>
            </div>
        ),
        sortable: true,
        wrap: true,
    },
    {
        name: 'Updated On',
        selector: row => row.updated,
        sortable: true,
    },
    {
        name: '# Rows',
        selector: row => row.rows,
        sortable: true,
        right: true,
    },
    {
        name: 'QC In Progress',
        selector: row => row.qcProgress,
        sortable: true,
        right: true,
    },
    {
        name: 'QC Failed',
        selector: row => row.qcFailed,
        sortable: true,
        right: true,
    },
    {
        name: 'Pending Selling Info',
        selector: row => row.pendingSellingInfo,
        sortable: true,
        right: true,
    },
    {
        name: 'Listings Created',
        selector: row => row.listingsCreated,
        sortable: true,
        right: true,
    },
    {
        name: 'Actions',
        cell: row => (
            <>
                <Link className='btn btn-success text-white btn-sm me-1'>
                    Continue
                </Link>
                <Button color="danger" size="sm">
                    <FaTrash />
                </Button>
            </>
        ),
    },
];

const BulkListings = () => {
    const [filterText, setFilterText] = useState('');
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortField, setSortField] = useState('status');
    const [sortOrder, setSortOrder] = useState('asc');

    const toggleCategoryDropdown = () => setCategoryDropdownOpen(!categoryDropdownOpen);
    const toggleStatusDropdown = () => setStatusDropdownOpen(!statusDropdownOpen);

    const handleCategoryToggle = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleStatusToggle = (status) => {
        setSelectedStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    const handleSortSelect = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    // Filter Logic
    let filteredData = demoProducts.filter((item) => {
        const textMatch = Object.values(item).some((val) =>
            val.toString().toLowerCase().includes(filterText.toLowerCase())
        );

        const categoryMatch =
            selectedCategories.length === 0 || selectedCategories.includes(item.category);

        const statusMatch =
            selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

        return textMatch && categoryMatch && statusMatch;
    });

    // Sort Logic
    filteredData.sort((a, b) => {
        if (sortOrder === 'asc') return a[sortField] > b[sortField] ? 1 : -1;
        else return a[sortField] < b[sortField] ? 1 : -1;
    });

    return (
        <div className="p-2">
            <Row className="mb-2">
                <Col md="3" className="mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Title / SKU"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Col>

                {/* Category Dropdown */}
                <Col md="2" className="mb-2">
                    <div className="position-relative">
                        <button
                            className="btn btn-outline-secondary btn-sm w-100 text-start"
                            onClick={toggleCategoryDropdown}
                            style={{ height: '38px' }}

                        >
                            Category <RiArrowDropDownLine size={20} style={{ float: 'right' }} />
                        </button>
                        {categoryDropdownOpen && (
                            <div
                                className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                                style={{ width: '100%', zIndex: 1000 }}
                            >
                                <Input type="text" placeholder="Search category" className="mb-2" />
                                {categories.map((cat) => (
                                    <label key={cat} className="dropdown-item d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => handleCategoryToggle(cat)}
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>

                {/* Status Dropdown */}
                <Col md="2" className="mb-2">
                    <div className="position-relative">
                        <button
                            className="btn btn-outline-secondary btn-sm w-100 text-start"
                            onClick={toggleStatusDropdown}
                            style={{ height: '38px' }}
                        >
                            Status <RiArrowDropDownLine size={20} style={{ float: 'right' }} />
                        </button>
                        {statusDropdownOpen && (
                            <div
                                className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                                style={{ width: '100%', zIndex: 1000 }}
                            >
                                {statuses.map((status) => (
                                    <label key={status} className="dropdown-item d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            checked={selectedStatuses.includes(status)}
                                            onChange={() => handleStatusToggle(status)}
                                        />
                                        {status}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>

                {/* Export CSV */}
                <Col md="5" className="mb-2 d-flex justify-content-end">
                    <CSVLink
                        data={selectedRows.length ? selectedRows : filteredData}
                        filename="bulk_listings.csv"
                        className="btn btn-primary text-white btn-sm"
                    >
                        Export CSV
                    </CSVLink>
                </Col>
            </Row>

            {/* Optional Sort Button */}
            {/* <Button color="info" size="sm" onClick={() => handleSortSelect('status')}>
        Sort by Status ({sortOrder.toUpperCase()})
      </Button> */}

            <div className="table-responsive">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    striped
                    // dense
                    selectableRows
                    onSelectedRowsChange={handleRowSelected}
                />
            </div>
        </div>
    );
};

export default BulkListings;
