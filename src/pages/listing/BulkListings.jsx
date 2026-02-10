import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Row, Col, Button, Input, Badge } from 'reactstrap';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import { DeleteProduct, GetProducts } from '../../api/productAPI';
import { showToast } from '../../components/ToastifyNotification';
import { IMAGE_URL } from '../../utils/api-config';
import { formatDateWithTime } from '../../utils/dateFormatter';
import Swal from 'sweetalert2';
import { FaPencil } from 'react-icons/fa6';

const BulkListings = ({categories,statuses}) => {
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    // 🔥 Fetch BULK listings
    const fetchBulkProducts = async () => {
        dispatch({ type: 'loader', loader: true });
        try {
            const response = await GetProducts({ listingType: 'Bulk' });

            if (response.success) {
                const formatted = response.data.map((item, index) => ({
                    index: index + 1,
                    id: item._id,
                    title: item.name,
                    skuId: item.sku,
                    image: `${IMAGE_URL}/${item.images?.mainImage}`,
                    created: formatDateWithTime(item.createdAt),
                    updated: formatDateWithTime(item.updatedAt),
                    status: item.status,
                    category: item.categoryId?.name,
                }));

                setData(formatted);
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', error.message || 'Failed to fetch bulk listings');
        } finally {
            dispatch({ type: 'loader', loader: false });
        }
    };

    useEffect(() => {
        fetchBulkProducts();
    }, []);

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
                            setData(data.filter(item => item._id !== id));
                            setFilteredData(filteredData.filter(item => item._id !== id));
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

    // 🔍 Filtering
    const filteredData = data.filter(item => {
        const textMatch =
            item.title.toLowerCase().includes(filterText.toLowerCase()) ||
            item.sku.toLowerCase().includes(filterText.toLowerCase());

        const categoryMatch =
            !selectedCategory || item.category === selectedCategory;

        const statusMatch =
            !selectedStatus || item.status === selectedStatus;

        return textMatch && categoryMatch && statusMatch;
    });

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
                        <strong>SKU ID:</strong> {row.skuId}
                    </div>
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name:'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => (
                <Badge color="secondary" pill>
                    {row.status}
                </Badge>
            ),
            sortable: true,
        },
        {
            name: 'Created On',
            selector: row => row.created,
            sortable: true,
        },
        {
            name: 'Updated On',
            selector: row => row.updated,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <Link to={`/listing/edit/${row.id}`} className='btn btn-success text-white btn-sm me-1'>
                        <FaPencil />
                    </Link>
                    <Button 
                        className='btn btn-danger btn-sm'
                        onClick={() => handleDeleteClick(row.id)}
                    >
                        <FaTrash />
                    </Button>
                </>
    
            ),
        },
    ];

    return (
        <div className="p-2">
            <Row className="mb-3">
                <Col md="3">
                    <Input
                        type="text"
                        placeholder="Search Title / SKU"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Col>

                <Col md="2">
                    <Input
                        type="select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </Input>
                </Col>

                <Col md="2">
                    <Input
                        type="select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        {statuses.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </Input>
                </Col>

                <Col md="5" className="d-flex justify-content-end">
                    <CSVLink
                        data={selectedRows.length ? selectedRows : filteredData}
                        filename="bulk_listings.csv"
                        className="btn btn-primary btn-sm text-white"
                    >
                        Export CSV
                    </CSVLink>
                </Col>
            </Row>

            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                striped
                selectableRows
                onSelectedRowsChange={handleRowSelected}
            />
        </div>
    );
};

export default BulkListings;
