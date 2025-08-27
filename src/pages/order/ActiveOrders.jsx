import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Input, InputGroup, Row } from 'reactstrap';
import Select from 'react-select';
import { FaSearch } from 'react-icons/fa';

// Import your separate components
import PendingLabelsList from '../../components/activeorder/PendingLabelsList';
import PendingRTDList from '../../components/activeorder/PendingRTDList';
import PendingHandoverList from '../../components/activeorder/PendingHandoverList';
import InTransitList from '../../components/activeorder/InTransitList';
import PendingServicesList from '../../components/activeorder/PendingServicesList';
import CompletedOrdersList from '../../components/activeorder/PendingLabelsList';
import { GetOrders } from '../../api/orderAPI';
import { showToast } from '../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';
import { GetVendorOrders } from '../../api/vendorOrderAPI';
import AllOrderList from '../../components/activeorder/AllOrderList';

const warehouseOptions = [
    { value: 'WH001', label: 'Warehouse - New York' },
    { value: 'WH002', label: 'Warehouse - Los Angeles' },
    { value: 'WH003', label: 'Warehouse - Chicago' },
    { value: 'WH004', label: 'Warehouse - Houston' },
    { value: 'WH005', label: 'Warehouse - Miami' },
];

const ActiveOrders = () => {
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedStat, setSelectedStat] = useState('all');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState({
        Pending: [],
        'PendingRTD':[],
        'PendingHandover': [],
        'InTransit': [],
        'PendingServices': [],
        'Inlast30days': [],
        'upcomingOrder': [],
        'ProcessingQueued': [],
    });
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();

    const handleChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const handleCounterClick = (statName) => {
        setSelectedStat(statName === selectedStat ? 'all' : statName);
    };

    const renderSelectedComponent = () => {
        switch (selectedStat) {
            case 'Pending Labels':
                return <PendingLabelsList orders={orderStatusData.Pending}/>;
            case 'Pending RTD':
                return <PendingRTDList orders={orderStatusData.PendingRTD}/>;
            case 'Pending Handover':
                return <PendingHandoverList orders={orderStatusData.PendingHandover}/>;
            case 'In Transit':
                return <InTransitList orders={orderStatusData.InTransit}/>;
            case 'Pending Services':
                return <PendingServicesList orders={orderStatusData.PendingServices}/>;
            case 'In last 30 days':
                return <InTransitList orders={orderStatusData.Inlast30days}/>;
            case 'upcomingorder':
                return <PendingLabelsList orders={orderStatusData.upcomingOrder}/>;
            case 'Processing Queued':
                return <PendingLabelsList orders={orderStatusData.ProcessingQueued}/>;
            default:
                return null;
        }
    };


    const getCounterClass = (item) => {
        return `mb-2 border py-1 px-2 ${selectedStat === item ? 'border-primary bg-light' : ''}`;
    };

    const fetchOrders = async (data) => {
		dispatch({ type: 'loader', loader: true })

		try {
			const response = await GetVendorOrders(data); // Make sure login function returns token
			console.log(response);
			if (response.success == true) {
				showToast('success', response.message)
				const formattedData = response.data.map((item, index) => ({
					index: index + 1,
					id: item._id,
					orderId: item.orderId?.orderUniqueId,
					productInfo: item.orderItems[0]?.productId?.name,
					quantity: item.orderItems[0]?.quantity,
					amount: item.total,
					status: item.orderStatus,
					vendorId: item.vendorId?._id,
					vendorName: item.vendorId?.name,
				}));
				setData(formattedData);
				setFilteredData(formattedData);
                setOrderStatusData({
                    Pending: formattedData.filter(order => order.status === 'Pending'),
                    'PendingRTD': formattedData.filter(order => order.status === 'Pending RTD'),
                    'PendingHandover': formattedData.filter(order => order.status === 'Pending Handover'),
                    'InTransit': formattedData.filter(order => order.status === 'In Transit'),
                    'PendingServices': formattedData.filter(order => order.status === 'Pending Services'),
                    'Inlast30days': formattedData.filter(order => order.status === 'In last 30 days'),
                    'upcomingOrder': formattedData.filter(order => order.status === 'upcomingorder'),
                    'ProcessingQueued': formattedData.filter(order => order.status === 'Processing Queued')
                })
			} else {
				// setError(response.message);
				showToast('error', response.message)
			}
		} catch (error) {
			// setError(error); // Handle login errors
			showToast('error', error)
		} finally {
			dispatch({ type: 'loader', loader: false })
		}
	}

	useEffect(() => {
		fetchOrders();
	}, []);

    return (
        <>
            <Row>
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem><h5>My Order</h5></BreadcrumbItem>
                        <BreadcrumbItem active>Home</BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6">
                    <Row>
                        <Col md="4" className='mb-1'>
                            <InputGroup className='w-100'>
                                <Input type='search' placeholder='Search By Order ID / Order Item ID' />
                                <span className='p-2 border'>
                                    <FaSearch style={{ cursor: 'pointer' }} />
                                </span>
                            </InputGroup>
                        </Col>
                        <Col md="5" className='mb-1'>
                            <Select
                                value={selectedWarehouse}
                                onChange={handleChange}
                                options={warehouseOptions}
                                placeholder="Select Warehouse..."
                                isClearable
                                isSearchable
                                className='w-100'
                                styles={{ option: (provided) => ({ ...provided, fontSize: '14px' }) }}
                            />
                        </Col>
                        <Col md="3" className='mb-1'>
                            <Link to="/fbf-order" className='btn btn-primary w-100 px-1'>View FBF Orders</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Counter */}
            <Row className='mt-3'>
                {/* Order Processing */}
                <Col md="4">
                    <small className="mb-1">Order Processing</small>
                    <Row>
                        {['Pending Labels', 'Pending RTD', 'Pending Handover'].map((item) => (
                            <Col xs="6" sm="6" md="4" key={item} className='pe-1'>
                                <div
                                    className={`bg-info bg-opacity-10 ${getCounterClass(item)}`}
                                    onClick={() => handleCounterClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h5 className='mb-0'>0</h5>
                                    <small style={{ fontSize: '12px' }}>{item}</small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>

                {/* Dispatched Orders */}
                <Col md="3">
                    <small className="mb-1">Dispatched Orders</small>
                    <Row>
                        {['In Transit', 'Pending Services'].map((item) => (
                            <Col xs="6" sm="6" md="6" key={item}>
                                <div
                                    className={`bg-danger bg-opacity-10 ${getCounterClass(item)}`}
                                    onClick={() => handleCounterClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h5 className='mb-0'>0</h5>
                                    <small style={{ fontSize: '12px' }}>{item}</small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>

                {/* Completed / Upcoming / Processing */}
                <Col md="5">
                    <Row>
                        <Col md="4" className='mb-2'>
                            <small className="mb-1 d-block">Completed Orders</small>
                            <div
                                className={`bg-primary bg-opacity-10 ${getCounterClass('In last 30 days')}`}
                                onClick={() => handleCounterClick('In last 30 days')}
                                style={{ cursor: 'pointer' }}
                            >
                                <h5 className='mb-0'>0</h5>
                                <small style={{ fontSize: '12px' }}>In last 30 days</small>
                            </div>
                        </Col>
                        <Col md="4" className='mb-2'>
                            <small className="mb-1 d-block">Upcoming Orders</small>
                            <div
                                className={`bg-warning bg-opacity-10 ${getCounterClass('upcomingorder')}`}
                                onClick={() => handleCounterClick('upcomingorder')}
                                style={{ cursor: 'pointer' }}
                            >
                                <h5 className='mb-0'>0</h5>
                                <small style={{ fontSize: '12px' }}>---</small>
                            </div>
                        </Col>
                        <Col md="4" className='mb-2'>
                            <small className="mb-1 d-block">Orders under process..</small>
                            <div
                                className={`bg-success bg-opacity-10 ${getCounterClass('Processing Queued')}`}
                                onClick={() => handleCounterClick('Processing Queued')}
                                style={{ cursor: 'pointer' }}
                            >
                                <h5 className='mb-0'>0</h5>
                                <small style={{ fontSize: '12px' }}>Processing Queued</small>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Bottom Component Row */}
            {selectedStat && (
                <Row className='mt-2'>
                    <Col md="12">
                        {
                            selectedStat.toLowerCase() === 'all' ? <AllOrderList orders={filteredData}/>:
                            renderSelectedComponent()
                        }

                    </Col>
                </Row>
            )}
        </>
    );
};

export default ActiveOrders;

