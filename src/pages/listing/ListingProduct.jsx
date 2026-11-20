import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import {
    Button, Col, Row, UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledTooltip,
    UncontrolledPopover,
    PopoverHeader,
    PopoverBody,
    Input,
    Label

} from 'reactstrap'; // Assuming you still want reactstrap Col and Row
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch } from 'react-redux'; // Import useDispatch
import { showToast } from '../../components/ToastifyNotification'; // Import showToast
import { BulkDeleteProduct, DeleteProduct, GetProducts } from '../../api/productAPI'; // Import GetProducts API call
import { formatDateWithTime } from '../../utils/dateFormatter';
import { Link } from 'react-router-dom';
import { FaPencil, FaVideo } from 'react-icons/fa6';
import {
    FaPencilAlt,
    FaExternalLinkAlt,
    FaEllipsisV,
    FaEdit,
    FaTimes,
    FaStar
} from 'react-icons/fa';

import Swal from 'sweetalert2';
import ProImg from "../../assets/images/seller/pro-1.jpg"
import ZozolistFilter from '../../components/ZozolistFilter';
import EditListingSidebar from "../listing/EditListingSidebar";
import ListDropUpload from './ListDropUpload';
import ListDropActions from './ListDropActions';
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import AddListingVideoOffcanvas from "./AddListingVideoOffcanvas";
import { GoVideo } from "react-icons/go";
import ListingDetailsSidebar from "./ListingDetailsSidebar";




const ListingProduct = ({ setListingCounts, activeFilter }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);


    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    const [data, setData] = useState([]); // State to hold raw fetched data
    const [filteredData, setFilteredData] = useState([]); // State for filtered/sorted data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'sales', order: 'desc' }); // Initial sort by 'sales'

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const dispatch = useDispatch(); // Initialize useDispatch for loader

    const handleStockUpdate = (id, newQty) => {
        setData(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, stockQty: newQty }
                    : item
            )
        );
    };

    const [stockPopover, setStockPopover] = useState(false);

    const toggleStockPopover = () => {
        setStockPopover(prev => !prev);
    };

    // Columns including new fields - adjusted selectors for API data structure
    const allColumns = [
        // {
        //     name: 'S.No',
        //     cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
        //     sortable: true
        // },
        {
            name: 'Product Title',
            selector: row => row.name,
            sortable: true,
            width: '300px',
            cell: row => (
                <Link
                    to="void:javascript(0);" className='text-dark text-decoration-none'
                    onClick={() => setDetailsOpen(true)}
                >
                    <div className="d-flex align-items-center gap-2 py-2">
                        <img
                            // src={`http://localhost:5000/${row.images?.mainImage}`}
                            src={ProImg}
                            alt={row.name}
                            width="50"
                            height="50"
                            className="rounded-2"
                            style={{ objectFit: "cover" }}
                            onError={(e) => {
                                console.log("Image failed:", e.target.src);
                            }}
                        />

                        <span className="fw-medium text-line">
                            {row.name}
                        </span>
                    </div>
                </Link>

            ),
        },
        { name: 'SKU', selector: row => row.sku, sortable: true },
        { name: 'Creation Time', selector: row => row.createdAt, sortable: true },
        { name: 'Update Time', selector: row => row.updatedAt, sortable: true },
        { name: 'Sales', selector: row => row.sales || 0, sortable: true },
        { name: 'Product Details', selector: row => row.description, sortable: true },
        // { name: 'Listing Price', selector: row => row.regularPrice, sortable: true },
        {
            name: 'Listing Price',
            selector: row => row.productPrice,
            sortable: true,
            minWidth: '180px',
            cell: row => (
                <>
                    <div className="d-flex align-items-center gap-2">
                        <div>
                            <div className="fw-semibold text-dark">
                                ₹3099
                            </div>
                            <small className="text-muted">
                                Sale: ₹613.89
                            </small>
                        </div>

                        <FaPencilAlt
                            size={12}
                            className="txt-st"
                            id="listing-price-edit"
                            role="button"
                            style={{ cursor: 'pointer' }}
                        />
                    </div>

                    <UncontrolledPopover
                        trigger="click"
                        placement="right"
                        target="listing-price-edit"
                        className="border-0 shadow-sm"
                    // style={{ minWidth: '340px', maxWidth: '380px' }}
                    >
                        <PopoverHeader className="small fw-semibold">
                            Update Listing Price
                        </PopoverHeader>

                        <PopoverBody className="p-0">
                            <PerfectScrollbar
                                options={{ suppressScrollX: true }}
                                style={{ maxHeight: '400px' }}
                            >
                                <div className="p-3">
                                    <Row className="g-2">

                                        <Col xs="6">
                                            <Label className="small fw-semibold">
                                                Regular Price (₹)
                                            </Label>
                                            <Input type="number" defaultValue={3099} />
                                        </Col>

                                        <Col xs="6">
                                            <Label className="small fw-semibold">
                                                Product Price (₹)
                                            </Label>
                                            <Input type="number" defaultValue={613.89} />
                                        </Col>

                                        <Col xs="6">
                                            <Label className="small fw-semibold">
                                                Commission Rate (%)
                                            </Label>
                                            <Input type="number" defaultValue={35} />
                                        </Col>

                                        <Col xs="6">
                                            <Label className="small fw-semibold">
                                                Commission Amount (₹)
                                            </Label>
                                            <Input type="number" defaultValue={542.15} />
                                        </Col>

                                        <Col xs="6">
                                            <Label className="small fw-semibold">
                                                GST Amount (₹)
                                            </Label>
                                            <Input type="number" defaultValue={376.41} />
                                        </Col>

                                        <Col xs="6">
                                            <Label className="small fw-semibold">
                                                TCS Amount (₹)
                                            </Label>
                                            <Input type="number" defaultValue={1.55} />
                                        </Col>

                                        <Col xs="6">
                                            <Label className="small fw-semibold">
                                                Shipping Charge (₹)
                                            </Label>
                                            <Input type="number" defaultValue={15} />
                                        </Col>

                                        <Col xs="6">
                                            <Label className="small fw-semibold">
                                                Sale Price (₹)
                                            </Label>
                                            <Input type="number" defaultValue={1549} />
                                        </Col>

                                    </Row>
                                </div>
                            </PerfectScrollbar>

                            <div className="border-top p-3">
                                <Button color="primary" size="sm" block>
                                    Apply Changes
                                </Button>
                            </div>
                        </PopoverBody>
                    </UncontrolledPopover>
                </>
            ),
        },
        { name: 'Benchmark Price', selector: row => row.benchmarkPrice || 'N/A', sortable: true },
        { name: 'Final Price', selector: row => row.salePrice || 'N/A', sortable: true },
        { name: 'MRP', selector: row => row.mrp || 'N/A', sortable: true },
        // { name: 'Stock', selector: row => row.stockQty, sortable: true },

        {
            name: 'Stock',
            selector: row => row.stockQty,
            sortable: true,
            cell: row => (
                <>
                    <span className="me-1">
                        100 units{' '}
                        <FaPencilAlt
                            size={12}
                            className='txt-st '
                            id="stock-edit"
                            role="button"
                            style={{ cursor: 'pointer' }}
                        />
                    </span>

                    <UncontrolledPopover
                        trigger="click"
                        placement="right"
                        target="stock-edit"
                        className="border-0 shadow-sm"
                    >
                        <PopoverHeader className="small d-flex justify-content-between align-items-center">
                            Update Stock
                        </PopoverHeader>

                        <PopoverBody>
                            <Input
                                type="number"
                                defaultValue={100}
                                min={0}
                                max={5000}
                            />

                            <p className="mt-3 mb-3 small">
                                The maximum stock quantity you can update is 5000 units
                                per location. For MinOQ listings, the limit is
                                5000 × MinOQ, per location.
                            </p>

                            <Button color="primary" className="btn-sm">
                                Apply
                            </Button>
                        </PopoverBody>
                    </UncontrolledPopover>
                </>
            ),
        },
        { name: 'Returns', selector: row => row.returns || '0%', sortable: true },
        { name: 'New', selector: row => (row.isNew ? 'Yes' : 'No'), sortable: true },
        { name: 'Fulfillment', selector: row => row.fulfillment || 'N/A', sortable: true },
        { name: 'Procurement SLA', selector: row => row.procurementSLA || 'N/A', sortable: true },
        {
            name: 'Listing Quality',
            selector: row => row.listingQuality || 'N/A',
            sortable: true,
            cell: row => (
                <>
                    <Link
                        to="void:javascript(0);" className='text-dark text-decoration-none'
                        onClick={() => setDetailsOpen(true)}
                    >
                        Good
                        <div className='small'>
                            <FaStar className="text-warning me-1" />
                            3.8 - 0%
                        </div>
                    </Link>
                </>
            )
        },

        {
            name: 'Additional Info',
            selector: row => row.additionalInfo || 'N/A',
            sortable: false,
            cell: row => (
                <>
                    <Link
                        to="void:javascript(0);"
                        onClick={() => setVideoOpen(true)}
                        id={`videos-${row.id}`}
                        className="text-st"
                    >
                        <GoVideo size={18} />
                    </Link>
                    <UncontrolledTooltip target={`videos-${row.id}`} style={{ fontSize: "10px" }}>
                        upload video
                    </UncontrolledTooltip>
                </>
            )
        },
        { name: 'Status', selector: row => row.status || 'N/A', sortable: false },
        {
            name: 'Actions',
            width: '150px',
            cell: row => (
                row.status !== 'Deleted' ? (
                    <div className="d-flex align-items-center gap-3">

                        {/* Edit */}
                        {/* <Link
                            to="/"
                            id={`edit-${row.id}`}
                            to={`/listing/edit/${row.id}`}
                            className="text-st"
                        >
                            <FaPencilAlt />
                        </Link> */}
                        <Link
                            to="#"
                            id={`edit-${row.id}`}
                            className="text-st"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsOpen(true);
                            }}
                        >
                            <FaPencilAlt />
                        </Link>
                        <UncontrolledTooltip target={`edit-${row.id}`} style={{ fontSize: "10px" }}>
                            Edit Listing
                        </UncontrolledTooltip>

                        {/* Website */}
                        <a

                            id={`view-${row.id}`}
                            href="https://www.zozokart.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-st"
                        >
                            <FaExternalLinkAlt />
                        </a>
                        <UncontrolledTooltip target={`view-${row.id}`} style={{ fontSize: "10px" }}>
                            View on zozokart.com
                        </UncontrolledTooltip>

                        {/* Three Dot Dropdown */}
                        <UncontrolledDropdown >
                            <DropdownToggle
                                tag="span"
                                className="text-dark"
                                style={{ cursor: 'pointer' }}
                                id={`more-${row.id}`}
                            >
                                <FaEllipsisV />
                            </DropdownToggle>

                            <DropdownMenu end className="shadow small">

                                <DropdownItem onClick={() => handleEditCatalog(row)} className='small'>
                                    Edit Catalog
                                </DropdownItem>

                                <DropdownItem onClick={() => handleCopyListing(row.id)} className='small'>
                                    Copy Listing
                                </DropdownItem>

                                <DropdownItem onClick={() => handleArchiveListing(row.id)} className='small'>
                                    Archive Listing
                                </DropdownItem>

                                <DropdownItem onClick={() => handleDeactivateListing(row.id)} className='small'>
                                    Deactivate Listing
                                </DropdownItem>

                                <DropdownItem onClick={() => handleManageVariants(row.id)} className='small'>
                                    Manage Variants
                                </DropdownItem>

                                <DropdownItem onClick={() => handleCreateSettlement(row.id)} className='small'>
                                    Create Settlement plan
                                </DropdownItem>

                                <DropdownItem  onClick={() => setVideoOpen(true)} className='small'>
                                    Add Video
                                </DropdownItem>

                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledTooltip target={`more-${row.id}`}>
                            More Actions
                        </UncontrolledTooltip>

                    </div>
                ) : 'Deleted'
            ),
        },
        // Action column is omitted here as per your new demo, but you can re-add it from previous component if needed
        // { name: 'Action', selector: row => row.action, sortable: false },
    ];

    const presets = {
        'Default View': ['Product Title', 'SKU', 'Listing Price', 'Listing Quality', 'Stock', 'Additional Info', 'Actions'], // Adjusted default view
        'Full View': allColumns.map(col => col.name),
    };
    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);

    const handleDeleteClick = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                dispatch({ type: 'loader', loader: true });
                try {
                    const response = await DeleteProduct(id);
                    if (response.success) {
                        showToast('success', response.message);
                        setData(data.filter(item => item.id !== id));
                        const remainingData = data.filter(item => item.id !== id);
                        setFilteredData(remainingData);
                        updateListingCounts(remainingData);
                    } else {
                        showToast('error', response.message);
                    }
                } catch (error) {
                    console.error("Error deleting product:", error);
                    showToast('error', error.message || 'Failed to delete product');
                } finally {
                    dispatch({ type: 'loader', loader: false });
                }
            }
        });
    };

    const deleteProducts = async (ids) => {
        if (!ids.length) return;

        Swal.fire({
            title: "Delete Products?",
            text: `You are about to delete ${ids.length} products.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete them!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                dispatch({ type: 'loader', loader: true });

                try {

                    console.log(ids); // debug
                    // return;

                    const response = await BulkDeleteProduct({ ids });

                    if (response.success) {
                        showToast('success', 'Products deleted successfully');

                        const remainingData = data.filter(
                            item => !ids.includes(item.id)
                        );

                        setData(remainingData);
                        setFilteredData(remainingData);
                        setSelectedRows([]);
                        updateListingCounts(remainingData);

                    } else {
                        showToast('error', response.message);
                    }

                } catch (error) {
                    showToast('error', error.message || 'Bulk delete failed');
                } finally {
                    dispatch({ type: 'loader', loader: false });
                }
            }
        });
    };

    const handleBulkDelete = () => {
        const ids = selectedRows.map(row => row.id);
        deleteProducts(ids);
    };

    const handleDeleteCurrentPage = () => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        const pageRows = filteredData.slice(start, end);
        const ids = pageRows.map(row => row.id);

        deleteProducts(ids);
    };

    // --- API Fetching Logic ---
    const fetchProducts = async () => {
        dispatch({ type: 'loader', loader: true });
        setLoading(true);
        setError(null);
        try {
            const response = await GetProducts();
            if (response.success) {
                showToast('success', response.message);
                const formattedData = response.data.map((item, index) => ({
                    // index: index + 1,
                    id: item._id, // Keep _id for potential future actions
                    name: item.name,
                    brand: item?.brandId?.name || 'N/A',
                    sku: item?.sku || 'N/A',
                    category: item?.categoryId?.name || 'N/A',
                    subCategoryOne: item?.subCategoryOneId?.name || 'N/A',
                    subCategoryTwo: item?.subCategoryTwoId?.name || 'N/A',
                    regularPrice: item.regularPrice,
                    salePrice: item.salePrice || 'N/A',
                    stockQty: item.stockQty,
                    status: item.status,
                    vendor: item.vendorId?.email,
                    createdAt: formatDateWithTime(item.createdAt), // Assuming these fields exist in your API response
                    updatedAt: formatDateWithTime(item.updatedAt),
                    description: item.description, // Assuming 'description' is your product details
                    sales: item.sales || 0, // Placeholder if sales isn't directly from productAPI
                    mrp: item.mrp || 'N/A', // Placeholder for MRP
                    benchmarkPrice: item.benchmarkPrice || 'N/A', // Placeholder for benchmarkPrice
                    returns: item.returns || '0%', // Placeholder for returns
                    isNew: item.isNew || false, // Placeholder for isNew
                    fulfillment: item.fulfillment || 'Fulfilled by Seller', // Placeholder
                    procurementSLA: item.procurementSLA || '2 days', // Placeholder
                    listingQuality: item.listingQuality || 'High', // Placeholder
                    additionalInfo: item.additionalInfo || 'N/A', // Placeholder
                }));
                setData(formattedData);
                setFilteredData(formattedData); // Initialize filteredData with all fetched data
                updateListingCounts(formattedData);
            } else {
                showToast('error', response.message);
                setError(response.message);
            }
        } catch (error) {
            showToast('error', error.message || 'Failed to fetch products');
            setError(error.message || 'Failed to fetch products');
        } finally {
            dispatch({ type: 'loader', loader: false });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []); // Fetch products on component mount

    const updateListingCounts = (products) => {
        setListingCounts({
            All: products.length,
            Active: products.filter(item => item.status === 'Active').length,
            ReadyForActivation: products.filter(item => item.status === 'ReadyForActivation').length,
            Blocked: products.filter(item => item.status === 'Blocked').length,
            Inactive: products.filter(item => item.status === 'Inactive').length,
            Deleted: products.filter(item => item.status === 'Deleted').length,
        });
    };

    useEffect(() => {
        if (activeFilter === "All") {
            setFilteredData(data);
        }
        else if (activeFilter === "Active") {
            setFilteredData(data.filter(item => item.status === activeFilter));
        } else if (activeFilter === "Inactive") {
            setFilteredData(data.filter(item => item.status === activeFilter));
        } else if (activeFilter === "ReadyForActivation") {
            setFilteredData(data.filter(item => item.status === activeFilter));
        } else if (activeFilter === "Blocked") {
            setFilteredData(data.filter(item => item.status === activeFilter));
        } else if (activeFilter === "Deleted") {
            setFilteredData(data.filter(item => item.status === activeFilter));
        }
    }, [activeFilter]); // Fetch products on component mount



    // --- Search & Sort Logic ---
    useEffect(() => {
        let results = data.filter(item =>
            Object.values(item).some(val =>
                val !== null && val !== undefined && val.toString().toLowerCase().includes(filterText.toLowerCase())
            )
        );

        // Apply sorting
        results.sort((a, b) => {
            const field = sortConfig.field;
            let valA = a[field];
            let valB = b[field];

            // Handle numeric fields for accurate sorting
            if (typeof valA === 'string' && !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB))) {
                valA = parseFloat(valA);
                valB = parseFloat(valB);
            }

            if (valA < valB) return sortConfig.order === 'desc' ? 1 : -1;
            if (valA > valB) return sortConfig.order === 'desc' ? -1 : 1;
            return 0;
        });

        setFilteredData(results);
    }, [filterText, data, sortConfig]);


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

    // Headers for CSV export - mapping to the formatted data keys
    const csvHeaders = [
        { label: "S.No", key: "index" },
        { label: "Product Title", key: "name" },
        { label: "Creation Time", key: "createdAt" },
        { label: "Update Time", key: "updatedAt" },
        { label: "Sales", key: "sales" },
        { label: "Product Details", key: "description" },
        { label: "Listing Price", key: "regularPrice" },
        { label: "Benchmark Price", key: "benchmarkPrice" },
        { label: "Final Price", key: "salePrice" },
        { label: "MRP", key: "mrp" },
        { label: "Stock", key: "stockQty" },
        { label: "Returns", key: "returns" },
        { label: "New", key: "isNew" },
        { label: "Fulfillment", key: "fulfillment" },
        { label: "Procurement SLA", key: "procurementSLA" },
        { label: "Listing Quality", key: "listingQuality" },
        { label: "Additional Info", key: "additionalInfo" },
    ];

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const currentPageRows = filteredData.slice(start, end);
    const currentPageCount = currentPageRows.length;

    // videos upload
    const [videoOpen, setVideoOpen] = useState(false);



    return (
        <>
            <div className="">
                <Row>
                    <Col md="7" className='mb-2'>
                        {/* <input
                        type="text"
                        className="form-control"
                        placeholder="Search for FSN, Title or SKU ID"
                        style={{ maxWidth: '250px' }}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    /> */}

                        {/* zozofilter */}
                        <ZozolistFilter />

                    </Col>
                    <Col md="5">
                        <div className="d-flex align-items-end justify-content-end py-2">
                            <div className="position-relative me-2">
                                {selectedRows.length > 0 && (
                                    <>
                                        <Button
                                            className='me-2'
                                            color="danger"
                                            size="sm"
                                            onClick={handleBulkDelete}
                                        >
                                            Delete All ({selectedRows.length})
                                        </Button>
                                        <Button
                                            color="danger"
                                            size="sm"
                                            className="me-2"
                                            onClick={handleDeleteCurrentPage}
                                        >
                                            Delete Current Page ({currentPageCount})
                                        </Button>
                                    </>
                                )}
                                {/* <button className="btn btn-outline-secondary text-white btn-sm" style={{ backgroundColor: '#02339a' }} onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                                Sort By <RiArrowDropDownLine size={20} />
                            </button>
                            {sortDropdownOpen && (
                                <div
                                    className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                                    style={{ width: '200px', zIndex: 1000, cursor: 'pointer' }}
                                >
                                    <div className="dropdown-item" onClick={() => handleSortSelect('name', 'asc')}>
                                        Product Title (ASC)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('name', 'desc')}>
                                        Product Title (DESC)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('createdAt', 'desc')}>
                                        Creation Time (Newest)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('createdAt', 'asc')}>
                                        Creation Time (Oldest)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('updatedAt', 'desc')}>
                                        Update Time (Newest)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('updatedAt', 'asc')}>
                                        Update Time (Oldest)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('sales', 'desc')}>
                                        Sales (Highest)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('sales', 'asc')}>
                                        Sales (Lowest)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('stockQty', 'desc')}>
                                        Stock (Highest)
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortSelect('stockQty', 'asc')}>
                                        Stock (Lowest)
                                    </div>
                                </div>
                            )} */}
                            </div>
                            {/* Customize Columns Dropdown */}
                            <div className="position-relative me-2">
                                <button className="btn btn-outline-primary text-white btn-sm" style={{ backgroundColor: '#02339a' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                    Sort By <RiArrowDropDownLine size={20} />
                                </button>
                                {dropdownOpen && (
                                    <div
                                        className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                                        style={{ width: '280px', maxHeight: '260px', overflowY: 'auto', zIndex: 1000, cursor: 'pointer' }}
                                    >
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
                                            <div className="dropdown-item text-st" onClick={() => applyPreset('Default View')}>
                                                Default View
                                            </div>
                                            <div className="dropdown-item text-st " onClick={() => applyPreset('Full View')}>
                                                Full View
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <CSVLink
                                data={selectedRows.length ? selectedRows : filteredData}
                                headers={csvHeaders} // Use the new csvHeaders
                                style={{ backgroundColor: '#02339a' }}
                                filename="product_list.csv"
                                className="btn btn-success text-white btn-sm"
                            >
                                Download
                            </CSVLink>

                            {/* upload dropdown */}
                            <ListDropUpload />

                            {/* action dropdown */}
                            <ListDropActions />

                        </div>
                    </Col>
                </Row>
                <hr />
                {/* Responsive Table */}
                <div className="table-responsive">
                    {loading ? (
                        <p>Loading products...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>Error: {error}</p>
                    ) : (
                        <DataTable
                            columns={columnsToShow}
                            data={filteredData}
                            pagination
                            striped
                            // dense
                            selectableRows={activeFilter !== 'Deleted'}
                            onSelectedRowsChange={handleRowSelected}
                            highlightOnHover
                            progressPending={loading} // Added progressPending for DataTable
                            onChangePage={(page) => setCurrentPage(page)}
                            onChangeRowsPerPage={(newPerPage) => setRowsPerPage(newPerPage)}
                        />
                    )}
                </div>
            </div>

            <EditListingSidebar
                isOpen={isOpen}
                toggle={toggleSidebar}
            />

            {/* uploded videos */}
            <AddListingVideoOffcanvas
                isOpen={videoOpen}
                toggle={() => setVideoOpen(false)}
            />

            {/* detailsidebar */}
            <ListingDetailsSidebar
                isOpen={detailsOpen}
                toggle={() => setDetailsOpen(false)}
            />
        </>

    );
};

export default ListingProduct;