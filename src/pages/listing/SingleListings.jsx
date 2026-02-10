import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Row, Col, Button, Badge, Input } from 'reactstrap';
import { RiArrowDropDownLine } from "react-icons/ri";
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { DeleteProduct, GetProducts } from '../../api/productAPI';
import { showToast } from '../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';
import { IMAGE_URL } from '../../utils/api-config';
import { formatDate, formatDateWithTime } from '../../utils/dateFormatter';
import { FaPencil } from 'react-icons/fa6';
import Swal from 'sweetalert2';



const SingleListings = ({categories, statuses}) => {
	const [filterText, setFilterText] = useState('');
	const [selectedCategory, setSelectedCategory] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	const [sortField, setSortField] = useState('status');
	const [sortOrder, setSortOrder] = useState('asc');
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const dispatch = useDispatch();

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

	
	
	const fetchProducts = async () => {
		dispatch({ type: 'loader', loader: true });
		try {
			const response = await GetProducts({ listingTyle:"Single"});
			if (response.success) {
				showToast('success', response.message);
				const formattedData = response.data.map((item, index) => ({
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
				setData(formattedData);
				setFilteredData(formattedData); // Initialize filteredData with all fetched data
			} else {
				showToast('error', response.message);
			}
		} catch (error) {
			showToast('error', error.message || 'Failed to fetch products');
		} finally {
			dispatch({ type: 'loader', loader: false });
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []); // Fetch products on component mount

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

				{/* Export CSV */}
				<Col md="5" className="mb-2 d-flex justify-content-end">
					<CSVLink
						data={selectedRows.length ? selectedRows : filteredData}
						filename="single_listing.csv"
						className="btn btn-primary text-white btn-sm"
					>
						Export CSV
					</CSVLink>
				</Col>
				{/* <Col md="2" className="mb-2">
          <Button color="info" size="sm" onClick={() => handleSortSelect('status')}>
            Sort by Status ({sortOrder.toUpperCase()})
          </Button>
        </Col> */}
			</Row>



			{/* Data Table */}
			<div className="table-responsive">
				<DataTable
					columns={columns}
					data={filteredData}
					pagination
					striped
					// dense
					selectableRows
					// highlightOnHover
					onSelectedRowsChange={handleRowSelected}
				/>
			</div>
		</div>
	);
};

export default SingleListings;
