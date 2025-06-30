import React, { useState } from 'react';
import {
    Card, CardBody, CardHeader,
    UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody,
    Container, Row, Col,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';

import {
    FaUserCog, FaUserTie, FaUniversity, FaBuilding,
    FaCogs, FaCalendarAlt, FaUsers, FaHandshake,
    FaNetworkWired, FaCode
} from 'react-icons/fa';
import Account from '../../components/profile/Account';
import AccountManager from '../../components/profile/AccountManager';
import BankDetails from '../../components/profile/BankDetails';
import BusinessDetial from '../../components/profile/BusinessDetial';
import Settings from '../../components/profile/Settings';
import CalendarSettings from '../../components/profile/CalendarSettings';
import ManageUsers from '../../components/profile/ManageUsers';
import ManagePartnerAccess from '../../components/profile/ManagePartnerAccess';
import ManageSessions from '../../components/profile/ManageSessions';
import DeveloperAccess from '../../components/profile/DeveloperAccess';

const ProfileIndex = () => {
    const [activeSection, setActiveSection] = useState('');

    const handleToggle = (id) => {
        setActiveSection(prev => (prev === id ? '' : id));
    };

    return (
        <>
            <Breadcrumb className='my-2'>
                <BreadcrumbItem>
                    <h5>Mange Profile</h5>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    Home
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="my-3">
                <Row className="justify-content-center">
                    <Col md="12">
                        <Card>
                            <CardBody className='p-0'>
                                <UncontrolledAccordion stayOpen open={activeSection} style={{ border: 'none' }}>
                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="1" className='' onClick={() => handleToggle("1")}>
                                            <div className='d-flex'>
                                                <FaUserCog size={20} color='#0a399c' className="me-3" />
                                                <h6 className='mb-0'>Account
                                                    <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>View your display information, pickup address, login detail and primary details</p>
                                                </h6>
                                            </div>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="1" className='p-2'>
                                            <Account />
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="2" onClick={() => handleToggle("2")}>
                                            <FaUserTie size={20} color='#0a399c' className="me-2 " />
                                            <h6 className='mb-0'>  Account Manager
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>View your account manager details</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="2" className='p-2'>
                                            <AccountManager />
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="3" onClick={() => handleToggle("3")}>
                                            <FaUniversity size={20} color='#0a399c' className="me-2" />
                                            <h6 className='mb-0'>  Bank Details
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>View your bank details</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="3" className='p-2'>
                                            <BankDetails />
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="4" onClick={() => handleToggle("4")}>
                                            <FaBuilding size={20} color='#0a399c' className="me-2" />
                                            <h6 className='mb-0'>  Business Details
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>View your business details and KYC documents</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="4" className='p-2'>
                                            <BusinessDetial />
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="5" onClick={() => handleToggle("5")}>
                                            <FaCogs size={20} color='#0a399c' className="me-2" />
                                            <h6 className='mb-0'>  Settings
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>Manage your logistics and FBF settings</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="5" className='p-2'>
                                            <Settings />
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="6" onClick={() => handleToggle("6")}>
                                            <FaCalendarAlt size={20} color='#0a399c' className="me-2" />
                                            <h6 className='mb-0'>  Calendar
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>View your working hours, Holiday list and vacation plans</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="6" className="me-2">
                                            <CalendarSettings />
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="7" onClick={() => handleToggle("7")}>
                                            <FaUsers size={20} color='#0a399c' className="me-2" />
                                            <h6 className='mb-0'>  Manage Users
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>Manage your employees, add, edit, delete roles and permissions given to access dashboard</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="7" className="py-2">
                                            <ManageUsers />
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="8" onClick={() => handleToggle("8")}>
                                            <FaHandshake size={20} color='#0a399c' className="me-2" /> 
                                            <h6 className='mb-0'> Manage Partners
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>Manage your partners, add, edit, delete roles and permissions given to access dashboard</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="8" className="py-2">
                                              <ManagePartnerAccess/>
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="9" onClick={() => handleToggle("9")}>
                                            <FaNetworkWired size={20} color='#0a399c' className="me-2" /> 
                                            <h6 className='mb-0'> Manage Sessions
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>Manage your sessions, view IP Address and delete sessions.</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="9" className='py-2'>
                                             <ManageSessions/>
                                        </AccordionBody>
                                    </AccordionItem>

                                    <AccordionItem className='mb-2 shadow-sm'>
                                        <AccordionHeader targetId="10" onClick={() => handleToggle("10")}>
                                            <FaCode size={20} color='#0a399c' className="me-2" /> 
                                             <h6 className='mb-0'> Developer Access
                                                <p style={{ fontSize: '12px' }} className='mt-0 mb-0 text-dark'>Manage the Developer access to your seller portal</p>
                                            </h6>
                                        </AccordionHeader>
                                        <AccordionBody accordionId="10" className='py-2'>
                                            <DeveloperAccess/>
                                        </AccordionBody>
                                    </AccordionItem>

                                </UncontrolledAccordion>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>

    );
};

export default ProfileIndex;
