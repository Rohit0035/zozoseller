import React, { useEffect, useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import {
    Breadcrumb, BreadcrumbItem, Col, Input, InputGroup, Row, Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from 'reactstrap';
// Assuming FBFStatusCard might need renaming, but keeping for compatibility
import FBFStatusCard from '../../components/activeorder/FBFStatusCard'; 
import classnames from 'classnames';

// Assuming you have components for order display:
import AllOrderList from '../../components/activeorder/AllOrderList'; 

// API and Toast imports (adjust paths as necessary)
import { GetVendorOrders } from '../../api/vendorOrderAPI'; 
import { showToast } from '../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';


// --- Status Definitions for Tabs ---
const ZOZOKART_TABS = {
    TODAY: '1',
    ALL: '2',
    IN_PROGRESS: '3',
    DELIVERED: '4',
    CANCELLED: '5',
};

const ZOZOKART_STATUS_MAP = {
    // These statuses will be grouped under 'In Progress'
    IN_PROGRESS: ['Pending', 'Processing', 'Shipped', 'Out For Delivery'], 
    DELIVERED: ['Delivered'],
    CANCELLED: ['Cancelled', 'Returned', 'Refunded', 'Payment Failed'], 
};
// ------------------------------------

// Helper function to get dates for comparison
const getDateNDaysAgo = (n) => {
    const date = new Date();
    date.setDate(date.getDate() - n);
    // Setting time to 00:00:00 for accurate day comparison
    date.setHours(0, 0, 0, 0); 
    return date;
};

// Renaming the component logically, but keeping FbfOrder if path requires it
const FbfOrder = () => { 
    const [activeTab, setActiveTab] = useState(ZOZOKART_TABS.TODAY);
    const [orders, setOrders] = useState([]);
    const [todayOrders, setTodayOrders] = useState([]);
    const [orderDataByTab, setOrderDataByTab] = useState({
        [ZOZOKART_TABS.ALL]: [],
        [ZOZOKART_TABS.IN_PROGRESS]: [],
        [ZOZOKART_TABS.DELIVERED]: [],
        [ZOZOKART_TABS.CANCELLED]: [],
    });
    // NEW STATE for status card props
    const [statusCardStats, setStatusCardStats] = useState({
        totalOrders15Days: 0,
        delivered7Days: 0,
        delivered3Days: 0,
        totalValue: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch(); 

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const fetchZozokartOrders = async (query = {}) => {
        dispatch({ type: 'loader', loader: true });

        // Define timeframes for stats calculation
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const sevenDaysAgo = getDateNDaysAgo(7);
        const threeDaysAgo = getDateNDaysAgo(3);
        const fifteenDaysAgo = getDateNDaysAgo(15);


        try {
            // We only need orders from the last 15 days for the status card, 
            // but fetching all FBF orders might be safer if the list view needs older data.
            // Let's optimize by fetching only orders that impact the status card or the view.
            
            const response = await GetVendorOrders({
                orderStatus: ['Pending', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded', 'Payment Failed'], 
            }); 
            
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
                    createdAt: new Date(item.createdAt), 
                    deliveredAt: item.deliveryDate ? new Date(item.deliveryDate) : null, // Assuming this field exists
                }));

                setOrders(formattedData);

                // --- 1. Calculate Status Card Stats ---
                
                // Filter orders relevant to the 15-day window for the status card
                const ordersLast15Days = formattedData.filter(order => order.createdAt >= fifteenDaysAgo);
                
                const calculatedStats = {
                    totalOrders15Days: ordersLast15Days.length,
                    totalValue: ordersLast15Days.reduce((sum, order) => sum + (order.amount || 0), 0),
                    delivered7Days: ordersLast15Days.filter(order => 
                        order.status === 'Delivered' && 
                        order.deliveredAt && 
                        order.deliveredAt >= sevenDaysAgo
                    ).length,
                    delivered3Days: ordersLast15Days.filter(order => 
                        order.status === 'Delivered' && 
                        order.deliveredAt && 
                        order.deliveredAt >= threeDaysAgo
                    ).length,
                };
                setStatusCardStats(calculatedStats);
                
                // --- 2. Data Segmentation Logic for Tabs ---

                const todayList = formattedData.filter(order => order.createdAt >= startOfToday);
                setTodayOrders(todayList);
                
                const inProgressList = formattedData.filter(order => 
                    ZOZOKART_STATUS_MAP.IN_PROGRESS.includes(order.status)
                );
                const deliveredList = formattedData.filter(order => 
                    ZOZOKART_STATUS_MAP.DELIVERED.includes(order.status)
                );
                const cancelledList = formattedData.filter(order => 
                    ZOZOKART_STATUS_MAP.CANCELLED.includes(order.status)
                );
                
                setOrderDataByTab({
                    [ZOZOKART_TABS.ALL]: formattedData,
                    [ZOZOKART_TABS.IN_PROGRESS]: inProgressList,
                    [ZOZOKART_TABS.DELIVERED]: deliveredList,
                    [ZOZOKART_TABS.CANCELLED]: cancelledList,
                });

            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', error.toString());
        } finally {
            dispatch({ type: 'loader', loader: false });
        }
    };

    useEffect(() => {
        fetchZozokartOrders();
    }, []);
    
    // Calculate counts for the tabs
    const tabCounts = useMemo(() => ({
        [ZOZOKART_TABS.TODAY]: todayOrders.length,
        [ZOZOKART_TABS.ALL]: orders.length,
        [ZOZOKART_TABS.IN_PROGRESS]: orderDataByTab[ZOZOKART_TABS.IN_PROGRESS].length,
        [ZOZOKART_TABS.DELIVERED]: orderDataByTab[ZOZOKART_TABS.DELIVERED].length,
        [ZOZOKART_TABS.CANCELLED]: orderDataByTab[ZOZOKART_TABS.CANCELLED].length,
    }), [orders.length, todayOrders.length, orderDataByTab]);


    // Placeholder component function to render the list based on the active tab
    const renderList = (tabId) => {
        let list = [];
        let title = '';

        switch (tabId) {
            case ZOZOKART_TABS.TODAY:
                list = todayOrders;
                title = 'Fullfill by Zozokart Orders Today';
                break;
            case ZOZOKART_TABS.ALL:
                list = orderDataByTab[ZOZOKART_TABS.ALL];
                title = 'All Fullfill by Zozokart Orders';
                break;
            case ZOZOKART_TABS.IN_PROGRESS:
                list = orderDataByTab[ZOZOKART_TABS.IN_PROGRESS];
                title = 'Fullfill by Zozokart Orders In Progress';
                break;
            case ZOZOKART_TABS.DELIVERED:
                list = orderDataByTab[ZOZOKART_TABS.DELIVERED];
                title = 'Fullfill by Zozokart Orders Delivered';
                break;
            case ZOZOKART_TABS.CANCELLED:
                list = orderDataByTab[ZOZOKART_TABS.CANCELLED];
                title = 'Fullfill by Zozokart Orders Cancelled/Failed';
                break;
            default:
                return <div>No data found for this tab.</div>;
        }

        if (list.length === 0) {
            return <Row><Col>No {title} found.</Col></Row>;
        }
        
        // Using the assumed AllOrderList component
        return <AllOrderList orders={list} title={title} />;
    };


    return (
        <>
            <Row>
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            {/* UPDATED: Breadcrumb title */}
                            <h5>Fullfill by Zozokart Orders</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Home</BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6">
                    <div className="d-flex justify-content-end">
                        <InputGroup className="w-50">
                            <Input 
                                type="search" 
                                placeholder="Search By Order ID / Order Item ID" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="p-2 border">
                                <FaSearch style={{ cursor: 'pointer' }} />
                            </span>
                        </InputGroup>
                    </div>
                </Col>
            </Row>
            {/* PASSING DATA TO THE STATUS CARD */}
            <FBFStatusCard 
                totalOrders15Days={statusCardStats.totalOrders15Days}
                delivered7Days={statusCardStats.delivered7Days}
                delivered3Days={statusCardStats.delivered3Days}
                totalValue={statusCardStats.totalValue}
            /> 
            
            <hr/>

            <Row className='mt-3'>
                <Col md="12">
                    <Nav tabs className="border-bottom mb-3">
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === ZOZOKART_TABS.TODAY })}
                                onClick={() => toggle(ZOZOKART_TABS.TODAY)}
                            >
                                Orders Today ({tabCounts[ZOZOKART_TABS.TODAY]})
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === ZOZOKART_TABS.ALL })}
                                onClick={() => toggle(ZOZOKART_TABS.ALL)}
                            >
                                All ({tabCounts[ZOZOKART_TABS.ALL]})
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === ZOZOKART_TABS.IN_PROGRESS })}
                                onClick={() => toggle(ZOZOKART_TABS.IN_PROGRESS)}
                            >
                                In Progress ({tabCounts[ZOZOKART_TABS.IN_PROGRESS]})
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === ZOZOKART_TABS.DELIVERED })}
                                onClick={() => toggle(ZOZOKART_TABS.DELIVERED)}
                            >
                                Delivered ({tabCounts[ZOZOKART_TABS.DELIVERED]})
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === ZOZOKART_TABS.CANCELLED })}
                                onClick={() => toggle(ZOZOKART_TABS.CANCELLED)}
                            >
                                Cancelled ({tabCounts[ZOZOKART_TABS.CANCELLED]})
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <TabContent activeTab={activeTab}>
                        <TabPane tabId={ZOZOKART_TABS.TODAY}>
                            <Row><Col>{renderList(ZOZOKART_TABS.TODAY)}</Col></Row>
                        </TabPane>
                        <TabPane tabId={ZOZOKART_TABS.ALL}>
                            <Row><Col>{renderList(ZOZOKART_TABS.ALL)}</Col></Row>
                        </TabPane>
                        <TabPane tabId={ZOZOKART_TABS.IN_PROGRESS}>
                            <Row><Col>{renderList(ZOZOKART_TABS.IN_PROGRESS)}</Col></Row>
                        </TabPane>
                        <TabPane tabId={ZOZOKART_TABS.DELIVERED}>
                            <Row><Col>{renderList(ZOZOKART_TABS.DELIVERED)}</Col></Row>
                        </TabPane>
                        <TabPane tabId={ZOZOKART_TABS.CANCELLED}>
                            <Row><Col>{renderList(ZOZOKART_TABS.CANCELLED)}</Col></Row>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </>
    );
};

export default FbfOrder;