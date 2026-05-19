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

import AllOrderList from '../../components/activeorder/AllOrderList';

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
        'Processing',
        'Shipped',
        'Out For Delivery',
        'Ready To Dispatch',
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

    const [orders, setOrders] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    const [groupedOrders, setGroupedOrders] = useState({
        [TAB_KEYS.TODAY]: [],
        [TAB_KEYS.ALL]: [],
        [TAB_KEYS.IN_PROGRESS]: [],
        [TAB_KEYS.DELIVERED]: [],
        [TAB_KEYS.CANCELLED]: []
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
        setActiveTab(tab);
    };


    // ---------------------------------------------
    // FETCH ORDERS
    // ---------------------------------------------

    const fetchOrders = async () => {

        dispatch({ type: 'loader', loader: true });

        try {

            const response = await GetVendorOrders({
                orderStatus: ALL_ALLOWED_STATUSES,
                fulfillmentBy: 'Zozokart'
            });

            if (response.success) {

                const formattedData = response.data.map((item, index) => ({
                    index: index + 1,

                    id: item._id,

                    orderUniqueId: item.orderId?.orderUniqueId,

                    subOrderUniqueId: item.subOrderUniqueId,

                    productInfo:
                        item.orderItems?.[0]?.productId?.name,
                    skuNo:
                        item.orderItems?.[0]?.productVariationId?.sku || item.orderItems?.[0]?.productId?.sku || 'N/A',

                    quantity:
                        item.orderItems?.[0]?.quantity,

                    amount:
                        item.total || 0,

                    status:
                        item.orderStatus,

                    vendorName:
                        item.vendorId?.name,

                    createdAt:
                        new Date(item.createdAt),

                    order: item
                }));

                setOrders(formattedData);

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
    // INITIAL FETCH
    // ---------------------------------------------

    useEffect(() => {
        fetchOrders();
    }, []);


    // ---------------------------------------------
    // FILTER + GROUP DATA
    // ---------------------------------------------

    useEffect(() => {

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const sevenDaysAgo = getDateNDaysAgo(7);
        const threeDaysAgo = getDateNDaysAgo(3);
        const fifteenDaysAgo = getDateNDaysAgo(15);

        let filtered = [...orders];

        // SEARCH FILTER

        if (searchTerm) {

            filtered = filtered.filter((item) =>
                item.orderUniqueId
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||

                item.subOrderUniqueId
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }


        // GROUPING

        const todayOrders = filtered.filter(
            order => order.createdAt >= startOfToday
        );

        const inProgressOrders = filtered.filter(order =>
            STATUS_GROUPS[TAB_KEYS.IN_PROGRESS].includes(order.status)
        );

        const deliveredOrders = filtered.filter(order =>
            STATUS_GROUPS[TAB_KEYS.DELIVERED].includes(order.status)
        );

        const cancelledOrders = filtered.filter(order =>
            STATUS_GROUPS[TAB_KEYS.CANCELLED].includes(order.status)
        );

        setGroupedOrders({
            [TAB_KEYS.TODAY]: todayOrders,

            [TAB_KEYS.ALL]: filtered,

            [TAB_KEYS.IN_PROGRESS]: inProgressOrders,

            [TAB_KEYS.DELIVERED]: deliveredOrders,

            [TAB_KEYS.CANCELLED]: cancelledOrders
        });


        // STATUS CARD

        const last15DaysOrders = filtered.filter(
            order => order.createdAt >= fifteenDaysAgo
        );

        setStatusCardStats({

            totalOrders15Days:
                last15DaysOrders.length,

            delivered7Days:
                deliveredOrders.filter(
                    order => order.createdAt >= sevenDaysAgo
                ).length,

            delivered3Days:
                deliveredOrders.filter(
                    order => order.createdAt >= threeDaysAgo
                ).length,

            totalValue:
                last15DaysOrders.reduce(
                    (sum, order) => sum + Number(order.amount || 0),
                    0
                )
        });

    }, [orders, searchTerm]);


    // ---------------------------------------------
    // TAB COUNTS
    // ---------------------------------------------

    const tabCounts = useMemo(() => ({
        [TAB_KEYS.TODAY]:
            groupedOrders[TAB_KEYS.TODAY].length,

        [TAB_KEYS.ALL]:
            groupedOrders[TAB_KEYS.ALL].length,

        [TAB_KEYS.IN_PROGRESS]:
            groupedOrders[TAB_KEYS.IN_PROGRESS].length,

        [TAB_KEYS.DELIVERED]:
            groupedOrders[TAB_KEYS.DELIVERED].length,

        [TAB_KEYS.CANCELLED]:
            groupedOrders[TAB_KEYS.CANCELLED].length
    }), [groupedOrders]);


    // ---------------------------------------------
    // RENDER LIST
    // ---------------------------------------------

    const renderList = (tabKey, title) => {

        return (
            <FBZOrderList
                orders={groupedOrders[tabKey]}
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

                        <BreadcrumbItem active>
                            Orders
                        </BreadcrumbItem>

                    </Breadcrumb>

                </Col>


                <Col md="6">

                    <div className='d-flex justify-content-end'>

                        <InputGroup className='w-50'>

                            <Input
                                type='search'
                                placeholder='Search Order ID / Item ID'
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
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

                <NavItem>
                    <NavLink
                        className={classnames({
                            active: activeTab === TAB_KEYS.TODAY
                        })}
                        onClick={() => toggle(TAB_KEYS.TODAY)}
                    >
                        Today ({tabCounts[TAB_KEYS.TODAY]})
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        className={classnames({
                            active: activeTab === TAB_KEYS.ALL
                        })}
                        onClick={() => toggle(TAB_KEYS.ALL)}
                    >
                        All ({tabCounts[TAB_KEYS.ALL]})
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        className={classnames({
                            active: activeTab === TAB_KEYS.IN_PROGRESS
                        })}
                        onClick={() => toggle(TAB_KEYS.IN_PROGRESS)}
                    >
                        In Progress ({tabCounts[TAB_KEYS.IN_PROGRESS]})
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        className={classnames({
                            active: activeTab === TAB_KEYS.DELIVERED
                        })}
                        onClick={() => toggle(TAB_KEYS.DELIVERED)}
                    >
                        Delivered ({tabCounts[TAB_KEYS.DELIVERED]})
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        className={classnames({
                            active: activeTab === TAB_KEYS.CANCELLED
                        })}
                        onClick={() => toggle(TAB_KEYS.CANCELLED)}
                    >
                        Cancelled ({tabCounts[TAB_KEYS.CANCELLED]})
                    </NavLink>
                </NavItem>

            </Nav>


            {/* TAB CONTENT */}

            <TabContent activeTab={activeTab}>

                <TabPane tabId={TAB_KEYS.TODAY}>
                    {renderList(
                        TAB_KEYS.TODAY,
                        'Today Orders'
                    )}
                </TabPane>

                <TabPane tabId={TAB_KEYS.ALL}>
                    {renderList(
                        TAB_KEYS.ALL,
                        'All Orders'
                    )}
                </TabPane>

                <TabPane tabId={TAB_KEYS.IN_PROGRESS}>
                    {renderList(
                        TAB_KEYS.IN_PROGRESS,
                        'In Progress Orders'
                    )}
                </TabPane>

                <TabPane tabId={TAB_KEYS.DELIVERED}>
                    {renderList(
                        TAB_KEYS.DELIVERED,
                        'Delivered Orders'
                    )}
                </TabPane>

                <TabPane tabId={TAB_KEYS.CANCELLED}>
                    {renderList(
                        TAB_KEYS.CANCELLED,
                        'Cancelled Orders'
                    )}
                </TabPane>

            </TabContent>

        </>
    );
};

export default FbfOrder;