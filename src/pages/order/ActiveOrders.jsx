import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Input, InputGroup, Row } from 'reactstrap';
import Select from 'react-select';
import { FaSearch } from 'react-icons/fa';

// Components
import PendingLabelsList from '../../components/activeorder/PendingLabelsList';
import PendingRTDList from '../../components/activeorder/PendingRTDList';
import PendingHandoverList from '../../components/activeorder/PendingHandoverList';
import InTransitList from '../../components/activeorder/InTransitList';
import AllOrderList from '../../components/activeorder/AllOrderList';

// API and Utils
import { GetVendorOrders } from '../../api/vendorOrderAPI';
import { showToast } from '../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';
import InLast30DaysList from '../../components/activeorder/InLast30DaysList';
import { formatDate } from 'date-fns';

const warehouseOptions = [
    { value: 'WH001', label: 'Warehouse - New York' },
    { value: 'WH002', label: 'Warehouse - Los Angeles' },
];

// UI Status Names
const FOCUS_STATUSES = {
    PENDING_LABELS: 'Pending Labels',
    PENDING_RTD: 'Pending RTD',
    PENDING_HANDOVER: 'Pending Handover',
    IN_TRANSIT: 'In Transit',
    COMPLETED: 'Completed',
    ALL: 'all'
};

// Mapping UI Status -> Actual DB Status
const STATUS_GROUPS = {
    [FOCUS_STATUSES.PENDING_LABELS]: ['Pending'],
    [FOCUS_STATUSES.PENDING_RTD]: ['Label Generated'],
    [FOCUS_STATUSES.PENDING_HANDOVER]: ['Ready To Dispatch'],
    [FOCUS_STATUSES.IN_TRANSIT]: ['Handover', 'In Transit'],
    [FOCUS_STATUSES.COMPLETED]: ['Delivered']
};

const ALL_ALLOWED_STATUSES = Object.values(STATUS_GROUPS).flat();

const ActiveOrders = () => {
    const dispatch = useDispatch();

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedStat, setSelectedStat] = useState(FOCUS_STATUSES.PENDING_LABELS);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [orderStatusData, setOrderStatusData] = useState(
        Object.keys(STATUS_GROUPS).reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {})
    );

    const handleChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const handleCounterClick = (statName) => {
        setSelectedStat(statName);
    };

    const getCounterClass = (item) => {
        return `mb-2 border rounded py-2 px-2 ${
            selectedStat === item ? 'border-primary bg-light' : ''
        }`;
    };

    const renderSelectedComponent = () => {
        switch (selectedStat) {
            case FOCUS_STATUSES.PENDING_LABELS:
                return (
                    <PendingLabelsList
                        orders={orderStatusData[FOCUS_STATUSES.PENDING_LABELS]}
                        fetchOrders={fetchOrders}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );

            case FOCUS_STATUSES.PENDING_RTD:
                return (
                    <PendingRTDList
                        orders={orderStatusData[FOCUS_STATUSES.PENDING_RTD]}
                        fetchOrders={fetchOrders}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );

            case FOCUS_STATUSES.PENDING_HANDOVER:
                return (
                    <PendingHandoverList
                        orders={orderStatusData[FOCUS_STATUSES.PENDING_HANDOVER]}
                        fetchOrders={fetchOrders}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );

            case FOCUS_STATUSES.IN_TRANSIT:
                return (
                    <InTransitList
                        orders={orderStatusData[FOCUS_STATUSES.IN_TRANSIT]}
                        fetchOrders={fetchOrders}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );

            case FOCUS_STATUSES.COMPLETED:
                return (
                    <InLast30DaysList
                        orders={orderStatusData[FOCUS_STATUSES.COMPLETED]}
                        title="Completed Orders"
                        fetchOrders={fetchOrders}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );

            default:
                return null;
        }
    };

    const fetchOrders = async (query = {}) => {
        dispatch({ type: 'loader', loader: true });

        try {
            const response = await GetVendorOrders(query);

            if (response.success) {
                showToast('success', response.message);

                const formattedData = response.data.map((item, index) => ({
                    index: index + 1,
                    id: item._id,
                    orderUniqueId: item.orderId?.orderUniqueId,
                    subOrderUniqueId: item.subOrderUniqueId,
                    skuNo:
                        item.orderItems[0]?.productVariationId?.sku ||
                        item.orderItems[0]?.productId?.sku,
                    productInfo: item.orderItems[0]?.productId?.name,
                    quantity: item.orderItems[0]?.quantity,
                    amount: item.total.toFixed(2),
                    status: item.orderStatus,
                    vendorId: item.vendorId?._id,
                    vendorName: item.vendorId?.name,
                    date: formatDate(item.createdAt, 'DD-MM-YYYY'),
                    warehouseId: item.warehouseId?._id,
                    order: item
                }));

                // Only active orders
                const focusOrders = formattedData.filter(order =>
                    ALL_ALLOWED_STATUSES.includes(order.status)
                );

                setData(focusOrders);

                // Group by status
                const groupedData = Object.keys(STATUS_GROUPS).reduce((acc, key) => {
                    acc[key] = focusOrders.filter(order =>
                        STATUS_GROUPS[key].includes(order.status)
                    );
                    return acc;
                }, {});

                setOrderStatusData(groupedData);
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', error.toString());
        } finally {
            dispatch({ type: 'loader', loader: false });
        }
    };

    // Search + warehouse filter
    useEffect(() => {
        let temp = [...data];

        if (searchTerm) {
            temp = temp.filter(
                item =>
                    item.orderUniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.subOrderUniqueId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedWarehouse) {
            temp = temp.filter(
                item => item.warehouseId === selectedWarehouse.value
            );
        }

        setFilteredData(temp);

        const groupedData = Object.keys(STATUS_GROUPS).reduce((acc, key) => {
            acc[key] = temp.filter(order =>
                STATUS_GROUPS[key].includes(order.status)
            );
            return acc;
        }, {});

        setOrderStatusData(groupedData);
    }, [searchTerm, selectedWarehouse, data]);

    useEffect(() => {
        fetchOrders({
            orderStatus: ALL_ALLOWED_STATUSES,
            fulfillmentBy: 'Seller'
        });
    }, []);

    const counterValues = useMemo(() => {
        return Object.fromEntries(
            Object.entries(orderStatusData).map(([key, value]) => [key, value.length])
        );
    }, [orderStatusData]);

    const orderGroups = [
        FOCUS_STATUSES.PENDING_LABELS,
        FOCUS_STATUSES.PENDING_RTD,
        FOCUS_STATUSES.PENDING_HANDOVER,
        FOCUS_STATUSES.IN_TRANSIT,
        FOCUS_STATUSES.COMPLETED
    ];

    return (
        <>
            <Row>
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>My Order</h5>
                        </BreadcrumbItem>
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
                                styles={{
                                    option: (provided) => ({
                                        ...provided,
                                        fontSize: '14px'
                                    })
                                }}
                            />
                        </Col>

                        <Col md="3" className='mb-1'>
                            <Link
                                to="/fbz-order"
                                className='btn btn-primary w-100 px-1'
                            >
                                View FBZ Orders
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <hr />

            {/* Status Counters */}
            <Row className='mt-3'>
                {orderGroups.map((item) => (
                    <Col md="2" key={item}>
                        <div
                            className={getCounterClass(item)}
                            onClick={() => handleCounterClick(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h5 className='mb-0'>{counterValues[item] || 0}</h5>
                            <small style={{ fontSize: '12px' }}>{item}</small>
                        </div>
                    </Col>
                ))}
            </Row>

            <hr />

            {/* List Section */}
            {selectedStat && (
                <Row className='mt-2'>
                    <Col md="12">
                        {selectedStat === FOCUS_STATUSES.ALL ? (
                            <AllOrderList
                                orders={filteredData}
                                fetchOrders={fetchOrders}
                                ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                                title="All Orders"
                            />
                        ) : (
                            renderSelectedComponent()
                        )}
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ActiveOrders;