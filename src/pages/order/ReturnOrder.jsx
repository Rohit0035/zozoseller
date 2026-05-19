import React, { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    Col,
    Row,
    Badge,
    Button
} from 'reactstrap';

import { RiArrowDropDownLine } from "react-icons/ri";
import {
    FaList,
    FaExclamationCircle,
    FaCheckCircle
} from 'react-icons/fa';

import { useDispatch } from 'react-redux';

import { showToast } from '../../components/ToastifyNotification';
import {
    GetReturnRequests,
    UpdateStatus
} from '../../api/returnRequestAPI';

// ======================
// Helper Functions
// ======================

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString();
};

// ======================
// Component
// ======================

const ReturnOrder = () => {

    const dispatch = useDispatch();

    // ======================
    // State
    // ======================

    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [sortConfig, setSortConfig] = useState({
        field: 'returnDateTimestamp',
        order: 'desc'
    });

    // ======================
    // Fetch Return Requests
    // ======================

    const fetchReturnRequests = async () => {

        dispatch({ type: 'loader', loader: true });

        try {

            const response = await GetReturnRequests();

            if (response?.success) {

                const formattedData = response.data.map((item, index) => {

                    const orderItem = item?.subOrderId?.orderItems?.[0];

                    return {
                        index: index + 1,

                        id: item?._id,

                        title:
                            orderItem?.productId?.name || 'N/A',

                        sku:
                            orderItem?.productVariationId?.sku ||
                            orderItem?.productId?.sku ||
                            'N/A',

                        category:
                            orderItem?.productId?.categoryId?.name || 'N/A',

                        customerName:
                            item?.subOrderId?.orderId?.userId?.firstName || 'N/A',

                        orderDateDisplay:
                            formatDate(item?.subOrderId?.createdAt),

                        orderDateTimestamp:
                            new Date(item?.subOrderId?.createdAt).getTime() || 0,

                        returnDateDisplay:
                            formatDate(item?.updatedAt),

                        returnDateTimestamp:
                            new Date(item?.updatedAt).getTime() || 0,

                        returnReason:
                            item?.reason || 'N/A',

                        refundStatus:
                            item?.refundStatus || 'Pending',

                        quantity:
                            orderItem?.quantity || 0,

                        amount:
                            item?.subOrderId?.total || 0,

                        status:
                            item?.status || 'Pending'
                    };
                });

                setData(formattedData);

            } else {

                showToast('error', response?.message || 'Failed to fetch return requests');
            }

        } catch (error) {

            showToast('error', error?.message || 'Something went wrong');

        } finally {

            dispatch({ type: 'loader', loader: false });
        }
    };

    useEffect(() => {
        fetchReturnRequests();
    }, []);

    // ======================
    // Handle Status Update
    // ======================

    const handleStatusUpdate = async (id, status) => {

        const confirmUpdate = window.confirm(
            `Are you sure you want to ${status} this return request?`
        );

        if (!confirmUpdate) return;

        dispatch({ type: 'loader', loader: true });

        try {

            const res = await UpdateStatus({
                id,
                status
            });

            if (res?.success) {

                showToast('success', res?.message || 'Status updated successfully');

                fetchReturnRequests();

            } else {

                showToast('error', res?.message || 'Failed to update status');
            }

        } catch (error) {

            showToast('error', error?.message || 'Something went wrong');

        } finally {

            dispatch({ type: 'loader', loader: false });
        }
    };

    // ======================
    // Columns
    // ======================

    const allColumns = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.title,
            sortable: true
        },
        {
            name: 'SKU',
            selector: row => row.sku,
            sortable: true
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true
        },
        {
            name: 'Customer Name',
            selector: row => row.customerName,
            sortable: true
        },
        {
            name: 'Order Date',
            selector: row => row.orderDateDisplay,
            sortable: true
        },
        {
            name: 'Return Date',
            selector: row => row.returnDateDisplay,
            sortable: true
        },
        {
            name: 'Reason',
            selector: row => row.returnReason,
            sortable: true
        },
        {
            name: 'Refund Status',
            selector: row => row.refundStatus,
            sortable: true,
            cell: row => (
                <Badge
                    color={
                        row.refundStatus === 'Refunded'
                            ? 'success'
                            : row.refundStatus === 'Pending'
                                ? 'warning'
                                : 'secondary'
                    }
                    pill
                >
                    {row.refundStatus}
                </Badge>
            )
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true,
            right: true
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            cell: row => `₹${row.amount}`
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <Badge
                    color={
                        row.status === 'Approved'
                            ? 'success'
                            : row.status === 'Rejected'
                                ? 'danger'
                                : 'warning'
                    }
                    pill
                >
                    {row.status}
                </Badge>
            )
        },
        {
            name: 'Action',
            cell: row => (
                <div className="d-flex gap-2">
                    <Button
                        color="success"
                        size="sm"
                        onClick={() => handleStatusUpdate(row.id, 'Approved')}
                        disabled={row.status === 'Approved'}
                    >
                        Approve
                    </Button>

                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleStatusUpdate(row.id, 'Rejected')}
                        disabled={row.status === 'Rejected'}
                    >
                        Reject
                    </Button>
                    
                    <Button
                        color="success"
                        size="sm"
                        onClick={() => handleStatusUpdate(row.id, 'QC_Passed')}
                    >
                        QC Pass
                    </Button>
                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleStatusUpdate(row.id, 'QC_Failed')}
                    >
                        QC Fail
                    </Button>
                </div>
            ),
            width: '30%'
        }
    ], []);

    // ======================
    // Presets
    // ======================

    const presets = {
        'Default View': [
            'Product',
            'SKU',
            'Customer Name',
            'Status',
            'Refund Status',
            'Action'
        ],

        'Full View': allColumns.map(col => col.name)
    };

    // ======================
    // Visible Columns
    // ======================

    const [visibleColumns, setVisibleColumns] = useState(
        presets['Default View']
    );

    const toggleColumn = (columnName) => {

        setVisibleColumns(prev =>
            prev.includes(columnName)
                ? prev.filter(col => col !== columnName)
                : [...prev, columnName]
        );
    };

    const applyPreset = (presetName) => {

        setVisibleColumns(presets[presetName]);

        setDropdownOpen(false);
    };

    // ======================
    // Filter + Sort
    // ======================

    const filteredAndSortedData = useMemo(() => {

        let currentData = [...data];

        // Search Filter

        if (filterText) {

            const lowerCaseFilter = filterText.toLowerCase();

            currentData = currentData.filter(item =>
                Object.values(item).some(value =>
                    value !== null &&
                    value !== undefined &&
                    value.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }

        // Sorting

        currentData.sort((a, b) => {

            const valA = a[sortConfig.field];
            const valB = b[sortConfig.field];

            if (typeof valA === 'string') {

                return sortConfig.order === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            return sortConfig.order === 'asc'
                ? valA - valB
                : valB - valA;
        });

        return currentData;

    }, [data, filterText, sortConfig]);

    // ======================
    // Table Columns
    // ======================

    const columnsToShow = allColumns.filter(col =>
        visibleColumns.includes(col.name)
    );

    // ======================
    // Row Selection
    // ======================

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    // ======================
    // Counters
    // ======================

    const counters = useMemo(() => [

        {
            title: 'All Returns',
            count: data.length,
            icon: <FaList size={24} />,
            bgColor: '#6c757d',
            textColor: '#fff'
        },

        {
            title: 'Pending Refunds',
            count: data.filter(
                item => item.refundStatus !== 'Refunded'
            ).length,
            icon: <FaExclamationCircle size={24} />,
            bgColor: '#dc3545',
            textColor: '#fff'
        },

        {
            title: 'Completed Refunds',
            count: data.filter(
                item => item.refundStatus === 'Refunded'
            ).length,
            icon: <FaCheckCircle size={24} />,
            bgColor: '#198754',
            textColor: '#fff'
        }

    ], [data]);

    // ======================
    // Render
    // ======================

    return (
        <div>

            {/* Breadcrumb */}

            <Row>
                <Col md="12">
                    <Breadcrumb className="my-2">
                        <BreadcrumbItem>
                            <h5>Return Orders</h5>
                        </BreadcrumbItem>

                        <BreadcrumbItem active>
                            Dashboard
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>

            <hr />

            {/* Counters */}

            <Row>

                {counters.map((item, index) => (

                    <Col
                        key={index}
                        md="4"
                        sm="6"
                        xs="12"
                        className="mb-3"
                    >
                        <Card
                            className="shadow-sm"
                            style={{
                                backgroundColor: item.bgColor,
                                color: item.textColor
                            }}
                        >
                            <CardBody className="p-2">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>
                                        <h3 className="mb-0">
                                            {item.count}
                                        </h3>

                                        <p className="mb-0 fw-bold">
                                            {item.title}
                                        </p>
                                    </div>

                                    <div>
                                        {item.icon}
                                    </div>

                                </div>

                            </CardBody>
                        </Card>
                    </Col>

                ))}

            </Row>

            <hr />

            {/* Search + Actions */}

            <Row className="mt-3">

                <Col md="6">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search product, customer or SKU"
                        style={{ maxWidth: '300px' }}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />

                </Col>

                <Col
                    md="6"
                    className="d-flex justify-content-end"
                >

                    {/* Column Dropdown */}

                    <div className="position-relative me-2">

                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            Customize Columns
                            <RiArrowDropDownLine size={20} />
                        </Button>

                        {dropdownOpen && (

                            <div
                                className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                                style={{
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    zIndex: 1000,
                                    minWidth: '220px'
                                }}
                            >

                                <strong className="d-block px-2 mb-2">
                                    Select Columns
                                </strong>

                                {allColumns.map((col, index) => (

                                    <label
                                        key={index}
                                        className="dropdown-item d-flex align-items-center"
                                    >

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

                                    <div
                                        className="dropdown-item text-primary cursor-pointer"
                                        onClick={() => applyPreset('Default View')}
                                    >
                                        Default View
                                    </div>

                                    <div
                                        className="dropdown-item text-primary cursor-pointer"
                                        onClick={() => applyPreset('Full View')}
                                    >
                                        Full View
                                    </div>

                                </div>

                            </div>
                        )}

                    </div>

                    {/* CSV Export */}

                    <CSVLink
                        data={
                            selectedRows.length
                                ? selectedRows
                                : filteredAndSortedData
                        }
                        filename="return_orders.csv"
                        className="btn btn-success btn-sm"
                    >
                        Export CSV
                    </CSVLink>

                </Col>

            </Row>

            <hr />

            {/* Table */}

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
                                highlightOnHover
                                persistTableHead
                                defaultSortFieldId={1}
                                onSelectedRowsChange={handleRowSelected}
                            />

                        </CardBody>

                    </Card>

                </Col>

            </Row>

        </div>
    );
};

export default ReturnOrder;