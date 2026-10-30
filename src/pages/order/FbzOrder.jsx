import React, { useEffect, useMemo, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    Col,
    Input,
    InputGroup,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap';

import classnames from 'classnames';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import { GetVendorOrders } from '../../api/vendorOrderAPI';
import { showToast } from '../../components/ToastifyNotification';
import FBFStatusCard from '../../components/activeorder/FBFStatusCard';
import FBZOrderList from '../../components/activeorder/FbzOrderList ';

// ---------------------------------------------
// STATUS CONFIG
// ---------------------------------------------

const TAB_KEYS = {
    TODAY: 'TODAY',
    ALL: 'ALL',
    IN_PROGRESS: 'IN_PROGRESS',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
};

const STATUS_GROUPS = {
    [TAB_KEYS.IN_PROGRESS]: [
        'Pending',
        'Pending Packing',
        'Pending Labels',
        'In Transit'
    ],
    [TAB_KEYS.DELIVERED]: [
        'Delivered'
    ],
    [TAB_KEYS.CANCELLED]: [
        'Cancelled',
        'Returned',
        'Refunded',
        'Payment Failed'
    ]
};

const ALL_ALLOWED_STATUSES = Object.values(STATUS_GROUPS).flat();

// ---------------------------------------------
// HELPERS
// ---------------------------------------------

const getDateNDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
};

// ---------------------------------------------
// COMPONENT
// ---------------------------------------------

const FbfOrder = () => {
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState(TAB_KEYS.TODAY);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Holds only the data for the currently active tab
    const [activeTabData, setActiveTabData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Holds global stats for the top cards and tab counters
    const [tabCounts, setTabCounts] = useState({
        [TAB_KEYS.TODAY]: 0,
        [TAB_KEYS.ALL]: 0,
        [TAB_KEYS.IN_PROGRESS]: 0,
        [TAB_KEYS.DELIVERED]: 0,
        [TAB_KEYS.CANCELLED]: 0
    });

    const [statusCardStats, setStatusCardStats] = useState({
        totalOrders15Days: 0,
        delivered7Days: 0,
        delivered3Days: 0,
        totalValue: 0
    });

    // ---------------------------------------------
    // TAB TOGGLE
    // ---------------------------------------------

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    // ---------------------------------------------
    // DATA FORMATTER
    // ---------------------------------------------
    const formatOrderData = (data) => {
        return data.map((item, index) => ({
            index: index + 1,
            id: item._id,
            orderUniqueId: item.orderId?.orderUniqueId,
            subOrderUniqueId: item.subOrderUniqueId,
            productInfo: item.orderItems?.[0]?.productId?.name,
            skuNo: item.orderItems?.[0]?.productVariationId?.sku || item.orderItems?.[0]?.productId?.sku || 'N/A',
            quantity: item.orderItems?.[0]?.quantity,
            amount: item.total || 0,
            status: item.orderStatus,
            vendorName: item.vendorId?.name,
            createdAt: new Date(item.createdAt),
            order: item
        }));
    };

    // ---------------------------------------------
    // FETCH TAB SPECIFIC DATA
    // ---------------------------------------------

    const fetchOrdersForTab = async (targetTab) => {
        dispatch({ type: 'loader', loader: true });

        try {
            // Determine which statuses to fetch from the backend
            let statusesToFetch = ALL_ALLOWED_STATUSES;
            if (STATUS_GROUPS[targetTab]) {
                statusesToFetch = STATUS_GROUPS[targetTab];
            }

            const response = await GetVendorOrders({
                orderStatus: statusesToFetch,
                fulfillmentBy: 'Zozokart'
            });

            if (response.success) {
                let formattedData = formatOrderData(response.data);

                // If "Today" tab is selected, filter the API results locally by today's date
                if (targetTab === TAB_KEYS.TODAY) {
                    const startOfToday = getDateNDaysAgo(0);
                    formattedData = formattedData.filter(order => order.createdAt >= startOfToday);
                }

                setActiveTabData(formattedData);
                
                // Keep the current tab's counter synced perfectly
                setTabCounts(prev => ({
                    ...prev,
                    [targetTab]: formattedData.length
                }));
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', error.toString());
        } finally {
            dispatch({ type: 'loader', loader: false });
        }
    };

    // ---------------------------------------------
    // INITIAL FETCH FOR COUNTERS & STATS
    // ---------------------------------------------

    useEffect(() => {
        const fetchInitialStats = async () => {
            try {
                const response = await GetVendorOrders({
                    orderStatus: ALL_ALLOWED_STATUSES,
                    fulfillmentBy: 'Zozokart'
                });

                if (response.success) {
                    const formattedData = formatOrderData(response.data);
                    
                    const startOfToday = getDateNDaysAgo(0);
                    const sevenDaysAgo = getDateNDaysAgo(7);
                    const threeDaysAgo = getDateNDaysAgo(3);
                    const fifteenDaysAgo = getDateNDaysAgo(15);

                    // 1. Set Tab Counts
                    setTabCounts({
                        [TAB_KEYS.TODAY]: formattedData.filter(o => o.createdAt >= startOfToday).length,
                        [TAB_KEYS.ALL]: formattedData.length,
                        [TAB_KEYS.IN_PROGRESS]: formattedData.filter(o => STATUS_GROUPS[TAB_KEYS.IN_PROGRESS].includes(o.status)).length,
                        [TAB_KEYS.DELIVERED]: formattedData.filter(o => STATUS_GROUPS[TAB_KEYS.DELIVERED].includes(o.status)).length,
                        [TAB_KEYS.CANCELLED]: formattedData.filter(o => STATUS_GROUPS[TAB_KEYS.CANCELLED].includes(o.status)).length
                    });

                    // 2. Set Status Card Stats
                    const last15DaysOrders = formattedData.filter(o => o.createdAt >= fifteenDaysAgo);
                    const deliveredOrders = formattedData.filter(o => STATUS_GROUPS[TAB_KEYS.DELIVERED].includes(o.status));

                    setStatusCardStats({
                        totalOrders15Days: last15DaysOrders.length,
                        delivered7Days: deliveredOrders.filter(o => o.createdAt >= sevenDaysAgo).length,
                        delivered3Days: deliveredOrders.filter(o => o.createdAt >= threeDaysAgo).length,
                        totalValue: last15DaysOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0)
                    });
                }
            } catch (error) {
                console.error("Failed to fetch initial stats", error);
            }
        };

        fetchInitialStats();
    }, []);

    // ---------------------------------------------
    // TRIGGER FETCH ON TAB CHANGE
    // ---------------------------------------------

    useEffect(() => {
        fetchOrdersForTab(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // ---------------------------------------------
    // SEARCH FILTER
    // ---------------------------------------------

    useEffect(() => {
        if (searchTerm) {
            const filtered = activeTabData.filter((item) =>
                item.orderUniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.subOrderUniqueId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(activeTabData);
        }
    }, [searchTerm, activeTabData]);

    // ---------------------------------------------
    // RENDER LIST
    // ---------------------------------------------

    const renderList = (title) => {
        return (
            <FBZOrderList
                orders={filteredData}
                title={title}
            />
        );
    };

    return (
        <>
            {/* HEADER */}
            <Row>
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Fulfillment By Zozokart</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Orders</BreadcrumbItem>
                    </Breadcrumb>
                </Col>

                <Col md="6">
                    <div className='d-flex justify-content-end'>
                        <InputGroup className='w-50'>
                            <Input
                                type='search'
                                placeholder='Search Order ID / Item ID'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className='p-2 border'>
                                <FaSearch />
                            </span>
                        </InputGroup>
                    </div>
                </Col>
            </Row>

            {/* STATUS CARDS */}
            <FBFStatusCard
                totalOrders15Days={statusCardStats.totalOrders15Days}
                delivered7Days={statusCardStats.delivered7Days}
                delivered3Days={statusCardStats.delivered3Days}
                totalValue={statusCardStats.totalValue}
            />

            <hr />

            {/* TABS */}
            <Nav tabs className='mb-3'>
                {Object.entries(TAB_KEYS).map(([key, value]) => (
                    <NavItem key={key}>
                        <NavLink
                            className={classnames({ active: activeTab === value })}
                            onClick={() => toggle(value)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Format label properly (e.g. IN_PROGRESS -> In Progress) */}
                            {value.replace('_', ' ')} ({tabCounts[value]})
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>

            {/* TAB CONTENT */}
            <TabContent activeTab={activeTab}>
                <TabPane tabId={activeTab}>
                    {renderList(`${activeTab.replace('_', ' ')} Orders`)}
                </TabPane>
            </TabContent>
        </>
    );
};

export default FbfOrder;