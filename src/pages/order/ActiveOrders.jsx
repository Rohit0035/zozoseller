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
import InLast30DaysList from '../../components/activeorder/InLast30DaysList';
import UpcomingOrderList from '../../components/activeorder/UpcomingOrderList';
import ToAcceptList from '../../components/activeorder/ToAcceptList';

// API and Utils
import { GetVendorOrders } from '../../api/vendorOrderAPI';
import { showToast } from '../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';
import { formatDate } from 'date-fns';

const warehouseOptions = [
    { value: 'WH001', label: 'Warehouse - New York' },
    { value: 'WH002', label: 'Warehouse - Los Angeles' },
];

// UI Status Names
const FOCUS_STATUSES = {
    TO_ACCEPT: 'To Accept',
    PENDING_LABELS: 'Pending Labels',
    PENDING_RTD: 'Pending RTD',
    PENDING_HANDOVER: 'Pending Handover',
    IN_TRANSIT: 'In Transit',
    COMPLETED: 'Completed',
    UPCOMING_ORDER: 'Upcoming Order',
    ALL: 'all'
};

// Mapping UI Status -> Actual DB Status
const STATUS_GROUPS = {
    [FOCUS_STATUSES.TO_ACCEPT]: ['To Accept'],
    [FOCUS_STATUSES.PENDING_LABELS]: ['Pending Labels'],
    [FOCUS_STATUSES.PENDING_RTD]: ['Label Generated'],
    [FOCUS_STATUSES.PENDING_HANDOVER]: ['Ready To Dispatch'],
    [FOCUS_STATUSES.IN_TRANSIT]: ['Handover', 'In Transit'],
    [FOCUS_STATUSES.COMPLETED]: ['Delivered'],
    [FOCUS_STATUSES.UPCOMING_ORDER]: ['Upcoming Order']
};

const ALL_ALLOWED_STATUSES = Object.values(STATUS_GROUPS).flat();

const ActiveOrders = () => {
    const dispatch = useDispatch();

    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedStat, setSelectedStat] = useState(FOCUS_STATUSES.TO_ACCEPT);
    
    // Data now strictly holds only the orders fetched for the active tab
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // State exclusively to manage UI counter badges globally
    const [counts, setCounts] = useState(
        Object.keys(STATUS_GROUPS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    );

    const handleChange = (selectedOption) => {
        setSelectedWarehouse(selectedOption);
    };

    const handleCounterClick = (statName) => {
        setSelectedStat(statName);
        // The change in selectedStat triggers the useEffect below to refetch data via the API
    };

    const getCounterClass = (item) => {
        return `mb-2 border rounded py-2 px-2 ${
            selectedStat === item ? 'border-primary bg-light' : ''
        }`;
    };

    // Refetch callback to pass down to child components (refreshes current tab after actions)
    const refreshCurrentTab = (query = {}) => fetchOrders(query, selectedStat);

    const renderSelectedComponent = () => {
        switch (selectedStat) {
            case FOCUS_STATUSES.TO_ACCEPT:
                return (
                    <ToAcceptList
                        orders={filteredData}
                        fetchOrders={refreshCurrentTab}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );
            case FOCUS_STATUSES.PENDING_LABELS:
                return (
                    <PendingLabelsList
                        orders={filteredData}
                        fetchOrders={refreshCurrentTab}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );
            case FOCUS_STATUSES.PENDING_RTD:
                return (
                    <PendingRTDList
                        orders={filteredData}
                        fetchOrders={refreshCurrentTab}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );
            case FOCUS_STATUSES.PENDING_HANDOVER:
                return (
                    <PendingHandoverList
                        orders={filteredData}
                        fetchOrders={refreshCurrentTab}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );
            case FOCUS_STATUSES.IN_TRANSIT:
                return (
                    <InTransitList
                        orders={filteredData}
                        fetchOrders={refreshCurrentTab}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );
            case FOCUS_STATUSES.COMPLETED:
                return (
                    <InLast30DaysList
                        orders={filteredData}
                        title="Completed Orders"
                        fetchOrders={refreshCurrentTab}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );
            case FOCUS_STATUSES.UPCOMING_ORDER:
                return (
                    <UpcomingOrderList
                        orders={filteredData}
                        title="Upcoming Orders"
                        fetchOrders={refreshCurrentTab}
                        ALL_ALLOWED_STATUSES={ALL_ALLOWED_STATUSES}
                    />
                );
            default:
                return null;
        }
    };

    // Fetches ONLY the orders for the provided targetStat
    const fetchOrders = async (query = {}, targetStat = selectedStat) => {
        dispatch({ type: 'loader', loader: true });

        try {
            const apiStatuses = targetStat === FOCUS_STATUSES.ALL 
                ? ALL_ALLOWED_STATUSES 
                : STATUS_GROUPS[targetStat];

            const finalQuery = {
                orderStatus: apiStatuses,
                fulfillmentBy: 'Seller',
                ...query
            };

            const response = await GetVendorOrders(finalQuery);

            if (response.success) {
                // showToast('success', response.message); 

                const formattedData = response.data.map((item, index) => ({
                    index: index + 1,
                    id: item._id,
                    orderUniqueId: item.orderId?.orderUniqueId,
                    subOrderUniqueId: item.subOrderUniqueId,
                    skuNo: item.orderItems[0]?.productVariationId?.sku || item.orderItems[0]?.productId?.sku,
                    productInfo: item.orderItems[0]?.productId?.name,
                    quantity: item.orderItems[0]?.quantity,
                    amount: item.total.toFixed(2),
                    status: item.orderStatus, // Important: using raw DB orderStatus
                    vendorId: item.vendorId?._id,
                    vendorName: item.vendorId?.name,
                    date: formatDate(item.createdAt, 'dd-MM-yyyy'),
                    warehouseId: item.warehouseId?._id,
                    order: item
                }));

                setData(formattedData);

                // Update the counter specifically for the active tab to keep it fresh
                if (targetStat !== FOCUS_STATUSES.ALL) {
                    setCounts(prev => ({
                        ...prev,
                        [targetStat]: formattedData.length
                    }));
                }
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', error.toString());
        } finally {
            dispatch({ type: 'loader', loader: false });
        }
    };

    // 1. Initial Mount: Silently fetch all orders just to populate the top counters
    useEffect(() => {
        const fetchInitialCounts = async () => {
            try {
                const response = await GetVendorOrders({
                    orderStatus: ALL_ALLOWED_STATUSES,
                    fulfillmentBy: 'Seller'
                });
                
                if (response.success) {
                    const groupedCounts = Object.keys(STATUS_GROUPS).reduce((acc, key) => {
                        // Check against original unformatted orderStatus
                        acc[key] = response.data.filter(order => 
                            STATUS_GROUPS[key].includes(order.orderStatus)
                        ).length;
                        return acc;
                    }, {});
                    setCounts(groupedCounts);
                }
            } catch (error) {
                console.error("Failed to fetch initial counts", error);
            }
        };

        fetchInitialCounts();
    }, []);

    // 2. Tab Change: Refetch data specifically for the selected status tab
    useEffect(() => {
        fetchOrders({}, selectedStat);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStat]);

    // Local Search + Warehouse filter applies ONLY to the active tab's data
    useEffect(() => {
        let temp = [...data];

        if (searchTerm) {
            temp = temp.filter(item =>
                item.orderUniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.subOrderUniqueId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedWarehouse) {
            temp = temp.filter(item => item.warehouseId === selectedWarehouse.value);
        }

        setFilteredData(temp);
    }, [searchTerm, selectedWarehouse, data]);

    const orderGroups = [
        FOCUS_STATUSES.TO_ACCEPT,
        FOCUS_STATUSES.PENDING_LABELS,
        FOCUS_STATUSES.PENDING_RTD,
        FOCUS_STATUSES.PENDING_HANDOVER,
        FOCUS_STATUSES.IN_TRANSIT,
        FOCUS_STATUSES.COMPLETED,
        FOCUS_STATUSES.UPCOMING_ORDER
    ];

    return (
        <>
            <Row>
                <Col md="10">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>My Order</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Home</BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="2">
                    <Col className='mb-1'>
                        <Link to="/fbz-order" className='btn btn-primary w-100 px-1'>
                            View FBZ Orders
                        </Link>
                    </Col>
                </Col>
            </Row>

            <hr />

            {/* Status Counters */}
            <Row className='mt-3'>
                {orderGroups.map((item) => (
                    <Col md="" key={item}>
                        <div
                            className={getCounterClass(item)}
                            onClick={() => handleCounterClick(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h5 className='mb-0'>{counts[item] || 0}</h5>
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
                                fetchOrders={refreshCurrentTab}
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