import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Row, Col, Button, Input } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const demoProducts = [
    {
        id: 1,
        title: 'T-shirt Size Group',
        sku: 'GROUP001',
        image: 'https://picsum.photos/id/1005/100/60',
        updated: 'June 15, 2025, 02:30PM',
        groupType: 'Size Set',
        products: 10,
        qcProgress: 4,
        qcFailed: 1,
        listingsCreated: 5,
        category: 'Clothing',
        status: 'Draft',
    },
    {
        id: 2,
        title: 'Shoes Color Group',
        sku: 'GROUP002',
        image: 'https://picsum.photos/id/1020/100/60',
        updated: 'June 20, 2025, 10:15AM',
        groupType: 'Color Set',
        products: 15,
        qcProgress: 6,
        qcFailed: 0,
        listingsCreated: 9,
        category: 'Ethnic wear',
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
        name: 'Group Type',
        selector: row => row.groupType,
        sortable: true,
    },
    {
        name: '# of Products',
        selector: row => row.products,
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

const BulkVariantGroupings = () => {
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

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const handleSortSelect = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
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
                        filename="bulk_variant_groupings.csv"
                        className="btn btn-primary text-white btn-sm"
                    >
                        Export CSV
                    </CSVLink>
                </Col>
            </Row>

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

export default BulkVariantGroupings;
