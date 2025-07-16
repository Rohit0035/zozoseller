import React, { useState } from 'react';
import {
    Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardBody, CardTitle, CardText, Button,
    Collapse
} from 'reactstrap';
import classnames from 'classnames';
import ReportScheduler from './ReportScheduler';

const OffInnerComponent = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [isOpen, setIsOpen] = useState(false);

    const toggles = () => setIsOpen(!isOpen);


    const toggle = (tabId) => {
        if (activeTab !== tabId) setActiveTab(tabId);
    };

    return (
        <div>
            <Nav tabs className="mb-4">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' }, 'text-sm')}
                        style={{ cursor: 'pointer', fontSize: '12px' }}
                        onClick={() => toggle('1')}
                    >
                        Fulfilment Reports
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' }, 'text-sm')}
                        style={{ cursor: 'pointer', fontSize: '12px' }}
                        onClick={() => toggle('2')}
                    >
                        Invoices
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '3' }, 'text-sm')}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggle('3')}
                    >
                        Listings Reports
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '4' }, 'text-sm')}
                        style={{ cursor: 'pointer', fontSize: '12px' }}
                        onClick={() => toggle('4')}
                    >
                        Payment Reports
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '5' }, 'text-sm')}
                        style={{ cursor: 'pointer', fontSize: '12px' }}
                        onClick={() => toggle('5')}
                    >
                        Tax Reports
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <div className='bx-1'>
                        <Row>
                            <Col sm="12">
                                <div className='border-bottom py-2'>
                                    <h6 className='mb-0'>Order</h6>
                                    <p className='mt-1 mb-1'>Detailed information of all orders and evaluation of past fulfilment performance.</p>
                                    <Button onClick={toggles} style={{ marginBottom: '1rem' }} className='btn btn-primary btn-sm'>REQUEST REPORT</Button>

                                    <Collapse isOpen={isOpen} >
                                        <Card>
                                            <CardBody>
                                                <div>
                                                  <ReportScheduler/>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </div>
                            </Col>
                            <Col sm="12">
                                <div className='border-bottom py-2'>
                                    <h6 className='mb-0'>Pickup Report</h6>
                                    <p className='mt-1 mb-1'>This report will provide the handover details (picked up / re-attempt) of the orders.</p>
                                    <Button className='btn btn-primary btn-sm'>REQUEST REPORT</Button>
                                </div>
                            </Col>
                            <Col sm="12">
                                <div className='border-bottom py-2'>
                                    <h6 className='mb-0'>Returns</h6>
                                    <p className='mt-1 mb-1'>Detailed information on all returns and tracking your reverse shipments' status.</p>
                                    <Button className='btn btn-primary btn-sm'>REQUEST REPORT</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className='bx-1'>

                    </div>

                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                            <h5>Invoices</h5>
                            <p>This is the content for Invoices tab.</p>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="3">
                    <Row>
                        <Col sm="12">
                            <h5>Listings Reports</h5>
                            <p>This is the content for Listings Reports tab.</p>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="4">
                    <Row>
                        <Col sm="12">
                            <h5>Payment Reports</h5>
                            <p>This is the content for Payment Reports tab.</p>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="5">
                    <Row>
                        <Col sm="12">
                            <h5>Tax Reports</h5>
                            <p>This is the content for Tax Reports tab.</p>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </div>
    );
};

export default OffInnerComponent;
