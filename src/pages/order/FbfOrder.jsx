import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import {
    Breadcrumb, BreadcrumbItem, Col, Input, InputGroup, Row, Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from 'reactstrap';
import FBFStatusCard from '../../components/activeorder/FBFStatusCard';
import classnames from 'classnames';


const FbfOrder = () => {

    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    return (
        <>
            <Row>
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem><h5>FBF Orders</h5></BreadcrumbItem>
                        <BreadcrumbItem active>Home</BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6">
                    <div className="d-flex justify-content-end">
                        <InputGroup className="w-50">
                            <Input type="search" placeholder="Search By Order ID / Order Item ID" />
                            <span className="p-2 border">
                                <FaSearch style={{ cursor: 'pointer' }} />
                            </span>
                        </InputGroup>
                    </div>
                </Col>
            </Row>
            <FBFStatusCard />

            <Row className='mt-3'>
                <div>
                    <Nav tabs className="border-bottom mb-3">
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => toggle('1')}
                            >
                                Orders Today (0)
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => toggle('2')}
                            >
                                All (0)
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '3' })}
                                onClick={() => toggle('3')}
                            >
                                In Progress (0)
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '4' })}
                                onClick={() => toggle('4')}
                            >
                                Delivered (0)
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '5' })}
                                onClick={() => toggle('5')}
                            >
                                Cancelled (0)
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <Row><Col>📦 No orders today.</Col></Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row><Col>📋 All orders appear here.</Col></Row>
                        </TabPane>
                        <TabPane tabId="3">
                            <Row><Col>⏳ In-progress orders shown here.</Col></Row>
                        </TabPane>
                        <TabPane tabId="4">
                            <Row><Col>✅ Delivered orders listed here.</Col></Row>
                        </TabPane>
                        <TabPane tabId="5">
                            <Row><Col>❌ Cancelled orders appear here.</Col></Row>
                        </TabPane>
                    </TabContent>
                </div>
            </Row>
        </>
    );
};

export default FbfOrder;
