import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { Col, Row } from 'reactstrap'; // Assuming you still want reactstrap Col and Row
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch } from 'react-redux'; // Import useDispatch
import { showToast } from '../../components/ToastifyNotification'; // Import showToast
import { GetProducts } from '../../api/productAPI'; // Import GetProducts API call
import { formatDateWithTime } from '../../utils/dateFormatter';

const ListingProduct = ({setListingCounts,activeFilter}) => {
    const [data, setData] = useState([]); // State to hold raw fetched data
    const [filteredData, setFilteredData] = useState([]); // State for filtered/sorted data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ field: 'sales', order: 'desc' }); // Initial sort by 'sales'
  
    const dispatch = useDispatch(); // Initialize useDispatch for loader

    // Columns including new fields - adjusted selectors for API data structure
    const allColumns = [
        { name: 'S.No', selector: row => row.index, sortable: true, width: "8%" },
        { name: 'Product Title', selector: row => row.name, sortable: true }, // Changed from 'title' to 'name'
        { name: 'Creation Time', selector: row => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A', sortable: true }, // Assuming 'createdAt' from API
        { name: 'Update Time', selector: row => row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : 'N/A', sortable: true }, // Assuming 'updatedAt' from API
        { name: 'Sales', selector: row => row.sales || 0, sortable: true, right: true }, // Assuming 'sales' might come from API, default to 0
        { name: 'Product Details', selector: row => row.description, sortable: true }, // Assuming 'description' from API
        { name: 'Listing Price', selector: row => row.regularPrice, sortable: true, right: true },
        { name: 'Benchmark Price', selector: row => row.benchmarkPrice || 'N/A', sortable: true, right: true }, // Assuming benchmarkPrice might be a field
        { name: 'Final Price', selector: row => row.salePrice || 'N/A', sortable: true, right: true },
        { name: 'MRP', selector: row => row.mrp || 'N/A', sortable: true, right: true }, // Assuming mrp might be a field
        { name: 'Stock', selector: row => row.stockQty, sortable: true, right: true },
        { name: 'Returns', selector: row => row.returns || '0%', sortable: true }, // Assuming returns might be a field
        { name: 'New', selector: row => (row.isNew ? 'Yes' : 'No'), sortable: true }, // Assuming 'isNew' flag
        { name: 'Fulfillment', selector: row => row.fulfillment || 'N/A', sortable: true }, // Assuming 'fulfillment' flag
        { name: 'Procurement SLA', selector: row => row.procurementSLA || 'N/A', sortable: true }, // Assuming 'procurementSLA' field
        { name: 'Listing Quality', selector: row => row.listingQuality || 'N/A', sortable: true }, // Assuming 'listingQuality' field
        { name: 'Additional Info', selector: row => row.additionalInfo || 'N/A', sortable: false }, // Assuming 'additionalInfo' field
        // Action column is omitted here as per your new demo, but you can re-add it from previous component if needed
        // { name: 'Action', selector: row => row.action, sortable: false },
    ];

    const presets = {
        'Default View': ['Product Title', 'Sales', 'Stock'], // Adjusted default view
        'Full View': allColumns.map(col => col.name),
    };
    const [visibleColumns, setVisibleColumns] = useState(presets['Default View']);
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
                    index: index + 1,
                    _id: item._id, // Keep _id for potential future actions
                    name: item.name,
                    brand: item?.brandId?.name || 'N/A',
                    skuId: item?.skuId || 'N/A',
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
                setListingCounts({
                   active: formattedData.filter(item => item.status === 'Active').length,
                  readyForActivation: formattedData.filter(item => item.status === 'ReadyForActivation').length,
                  blocked: formattedData.filter(item => item.status === 'Blocked').length,
                  inactive: formattedData.filter(item => item.status === 'Inactive').length,
                  archived: formattedData.filter(item => item.status === 'Archived').length,
                })
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
    
    useEffect(() => {
        if(activeFilter === "Active"){
          setFilteredData(data.filter(item => item.status === activeFilter));
        }else if(activeFilter === "Inactive"){
          setFilteredData(data.filter(item => item.status === activeFilter));
        }else if(activeFilter === "ReadyForActivation"){
          setFilteredData(data.filter(item => item.status === activeFilter));
        }else if(activeFilter === "Blocked"){
          setFilteredData(data.filter(item => item.status === activeFilter));
        }else if(activeFilter === "Deleted"){
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


    return (
        <div className="">
            <Row>
                <Col md="6" className='mb-2'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for FSN, Title or SKU ID"
                        style={{ maxWidth: '250px' }}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Col>
                <Col md="6">
                    <div className="d-flex align-items-end justify-content-end">
                        <div className="position-relative me-2">
                            <button className="btn btn-outline-secondary text-white btn-sm" style={{ backgroundColor: '#02339a' }} onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                                Sort By <RiArrowDropDownLine size={20} />
                            </button>
                            {sortDropdownOpen && (
                                <div
                                    className="position-absolute bg-white border rounded shadow-sm mt-1 p-2"
                                    style={{ width: '200px', zIndex: 1000, cursor: 'pointer' }}
                                >
                                    {/* Make sure these fields exist in your formatted API data */}
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
                                    {/* Add more sort options as needed, corresponding to your API fields */}
                                </div>
                            )}
                        </div>
                        {/* Customize Columns Dropdown */}
                        <div className="position-relative me-2">
                            <button className="btn btn-outline-primary text-white btn-sm" style={{ backgroundColor: '#02339a' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                Customize Columns <RiArrowDropDownLine size={20} />
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
                                        <div className="dropdown-item text-primary" onClick={() => applyPreset('Default View')}>
                                            Default View
                                        </div>
                                        <div className="dropdown-item text-primary " onClick={() => applyPreset('Full View')}>
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
                            Export CSV
                        </CSVLink>
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
                        selectableRows
                        onSelectedRowsChange={handleRowSelected}
                        highlightOnHover
                        progressPending={loading} // Added progressPending for DataTable
                    />
                )}
            </div>
        </div>
    );
};

export default ListingProduct;