import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Input, InputGroup, Row } from 'reactstrap';
import Select from 'react-select';
import { FaSearch } from 'react-icons/fa';

// Import your list components
// Keeping the component imports
import PendingLabelsList from '../../components/activeorder/PendingLabelsList'; 
import PendingRTDList from '../../components/activeorder/PendingRTDList';
import PendingHandoverList from '../../components/activeorder/PendingHandoverList';
import InTransitList from '../../components/activeorder/InTransitList';
import PendingServicesList from '../../components/activeorder/PendingServicesList';
import AllOrderList from '../../components/activeorder/AllOrderList';

// API and Toast imports
import { GetVendorOrders } from '../../api/vendorOrderAPI';
import { showToast } from '../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';

const warehouseOptions = [
    { value: 'WH001', label: 'Warehouse - New York' },
    { value: 'WH002', label: 'Warehouse - Los Angeles' },
    // ... rest of the options
];

// Define ACTIVE and FULFILLED standard counter keys
const FOCUS_STATUSES = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    OUT_FOR_DELIVERY: 'Out For Delivery',
    DELIVERED: 'Delivered', // ADDED: Delivered status
    ALL: 'all',
};

// List of statuses considered active/in-progress/fulfilled
const FOCUS_STATUS_KEYS = Object.values(FOCUS_STATUSES).filter(s => s !== 'all');

// List of statuses we want to EXCLUDE
const EXCLUDED_STATUSES = ['Cancelled', 'Returned', 'Refunded', 'Payment Failed'];


const ActiveOrders = () => {
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedStat, setSelectedStat] = useState(FOCUS_STATUSES.ALL); 
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    
    // UPDATED: Only include FOCUS statuses in the state
    const [orderStatusData, setOrderStatusData] = useState(
        FOCUS_STATUS_KEYS.reduce((acc, status) => {
            acc[status] = [];
            return acc;
        }, {})
    );

    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();

    const handleChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const handleCounterClick = (statName) => {
        setSelectedStat(statName === selectedStat ? FOCUS_STATUSES.ALL : statName);
    };

    const renderSelectedComponent = () => {
        // UPDATED: Map only focus statuses to components.
        switch (selectedStat) {
            case FOCUS_STATUSES.PENDING:
                return <AllOrderList orders={orderStatusData[FOCUS_STATUSES.PENDING]} title="Pending Orders"/>;
            case FOCUS_STATUSES.PROCESSING:
                return <AllOrderList orders={orderStatusData[FOCUS_STATUSES.PROCESSING]} title="Processing Orders"/>;
            case FOCUS_STATUSES.SHIPPED:
                return <AllOrderList orders={orderStatusData[FOCUS_STATUSES.SHIPPED]} title="Shipped Orders"/>;
            case FOCUS_STATUSES.OUT_FOR_DELIVERY:
                return <AllOrderList orders={orderStatusData[FOCUS_STATUSES.OUT_FOR_DELIVERY]} title="Out For Delivery Orders"/>;
            case FOCUS_STATUSES.DELIVERED:
                return <AllOrderList orders={orderStatusData[FOCUS_STATUSES.DELIVERED]} title="Delivered Orders"/>; // ADDED
            default:
                return null;
        }
    };


    const getCounterClass = (item) => {
        return `mb-2 border py-1 px-2 ${selectedStat === item ? 'border-primary bg-light' : ''}`;
    };

    const fetchOrders = async (query = {}) => {
        dispatch({ type: 'loader', loader: true })

        try {
            const response = await GetVendorOrders(query); 
            console.log(response);
            if (response.success === true) {
                showToast('success', response.message);
                
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
                    createdAt: item.createdAt, 
                }));

                // Filter data to only include FOCUS orders (Active + Delivered)
                const focusOrders = formattedData.filter(order => FOCUS_STATUS_KEYS.includes(order.status));
                
                setData(focusOrders);
                setFilteredData(focusOrders); 

                // Filter logic to use only the focus standard statuses
                const newStatusData = FOCUS_STATUS_KEYS.reduce((acc, statusName) => {
                    acc[statusName] = focusOrders.filter(order => order.status === statusName);
                    return acc;
                }, {});
                
                setOrderStatusData(newStatusData);

            } else {
                showToast('error', response.message)
            }
        } catch (error) {
            showToast('error', error.toString())
        } finally {
            dispatch({ type: 'loader', loader: false })
        }
    }

    const counterValues = useMemo(() => {
        return Object.fromEntries(
            Object.entries(orderStatusData).map(([key, value]) => [key, value.length])
        );
    }, [orderStatusData]);


    useEffect(() => {
        fetchOrders({orderStatus: ['Pending', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered']});
    }, []);

    // Split focus statuses into groups for UI layout
    const processingStatuses = [FOCUS_STATUSES.PENDING, FOCUS_STATUSES.PROCESSING];
    const dispatchedStatuses = [FOCUS_STATUSES.SHIPPED, FOCUS_STATUSES.OUT_FOR_DELIVERY];
    const fulfilledStatus = [FOCUS_STATUSES.DELIVERED];


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
                                <Input 
                                    type='search' 
                                    placeholder='Search By Order ID / Order Item ID' 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
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

            <hr/>

            {/* Counter - Showing Active Orders + Delivered */}
            <Row className='mt-3'>
                
                {/* Processing Pipeline */}
                <Col md="4">
                    <small className="mb-1">Order Processing</small>
                    <Row>
                        {processingStatuses.map((item) => (
                            <Col xs="6" sm="6" md="6" key={item} className='pe-1'>
                                <div
                                    className={`bg-info bg-opacity-10 ${getCounterClass(item)}`}
                                    onClick={() => handleCounterClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h5 className='mb-0'>{counterValues[item] || 0}</h5>
                                    <small style={{ fontSize: '12px' }}>{item}</small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>

                {/* Dispatch/Transit */}
                <Col md="4">
                    <small className="mb-1">Dispatched Orders</small>
                    <Row>
                        {dispatchedStatuses.map((item) => (
                            <Col xs="6" sm="6" md="6" key={item}>
                                <div
                                    className={`bg-danger bg-opacity-10 ${getCounterClass(item)}`}
                                    onClick={() => handleCounterClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h5 className='mb-0'>{counterValues[item] || 0}</h5>
                                    <small style={{ fontSize: '12px' }}>{item}</small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>
                
                {/* Delivered/Fulfilled */}
                <Col md="4">
                    <small className="mb-1">Fulfilled Orders</small>
                    <Row>
                        {fulfilledStatus.map((item) => (
                            <Col xs="12" sm="12" md="6" key={item}>
                                <div
                                    className={`bg-success bg-opacity-10 ${getCounterClass(item)}`}
                                    onClick={() => handleCounterClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h5 className='mb-0'>{counterValues[item] || 0}</h5>
                                    <small style={{ fontSize: '12px' }}>{item}</small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            
            <hr/>

            {/* Bottom Component Row */}
            {selectedStat && (
                <Row className='mt-2'>
                    <Col md="12">
                        {
                            selectedStat === FOCUS_STATUSES.ALL ? <AllOrderList orders={filteredData}/>:
                            renderSelectedComponent()
                        }
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ActiveOrders;