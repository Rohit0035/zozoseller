import React, { useState } from 'react';
import {
    Container,
    Nav,
    NavItem,
    NavLink,
    Button,
    Row,
    Col,
    Input,
    Badge,
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import { FaPlus, FaFilter } from 'react-icons/fa';
import classnames from 'classnames';
import DataTable from 'react-data-table-component';
import OffInnerComponent from './OffInnerComponent';

const tabs = ['Requested Reports', 'Scheduled Reports'];
const tags = ['All', 'Fulfilment Reports', 'Invoices', 'Listings reports', 'Payment Reports', 'Tax Reports'];

const dummyData = [
    {
        type: 'Invoices',
        subtype: 'GSTR-1',
        dateRange: '01 Jul - 31 Jul',
        requestedDate: '10 Jul',
        status: 'Completed',
        requestType: 'Monthly',
        generationDate: '11 Jul',
        action: 'Download'
    }
];

const columns = [
    { name: 'Type', selector: row => row.type },
    { name: 'Sub Type', selector: row => row.subtype },
    { name: 'Date Range', selector: row => row.dateRange },
    { name: 'Requested Date', selector: row => row.requestedDate },
    { name: 'Status', selector: row => row.status },
    { name: 'Report Request Type', selector: row => row.requestType },
    { name: 'Generation Date', selector: row => row.generationDate },
    { name: 'Action', selector: row => row.action }
];

const ReportCentre = () => {
    const [activeTab, setActiveTab] = useState('Requested Reports');
    const [activeTag, setActiveTag] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleTab = tab => {
        if (tab !== activeTab) setActiveTab(tab);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const filteredData =
        activeTag === 'All' ? dummyData : dummyData.filter(item => item.type === activeTag);

    return (
        <>
            <Row>
                <Col md='6'>
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Report Centre</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Payment
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6">
                    <div className='d-flex justify-content-end '>
                        <Button color="primary" className='btn btn-primary' onClick={toggleSidebar}>
                            <FaPlus className="me-1" /> REQUEST NEW REPORT
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Top Tabs */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-4">
                    {tabs.map(tab => (
                        <div key={tab} className="text-center">
                            <Nav pills>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === tab })}
                                        onClick={() => toggleTab(tab)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {tab} <Badge color="light" className="ms-1 text-dark">0</Badge>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>
                    ))}
                </div>

            </div>

            {/* Tag Filters */}
            <div className="mb-3 d-flex flex-wrap gap-2">
                {tags.map(tag => (
                    <Button
                        key={tag}
                        outline
                        color={activeTag === tag ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setActiveTag(tag)}
                    >
                        {tag}
                    </Button>
                ))}
            </div>

            {/* Subtype Filter */}
            <Row className="mb-3">
                <Col md="3">
                    <Input type="select">
                        <option>All Subtypes</option>
                        <option>GSTR-1</option>
                        <option>Sales Report</option>
                    </Input>
                </Col>
            </Row>

            {/* Data Table */}
            <Card className="shadow-sm">
                <CardBody>
                    {filteredData.length === 0 ? (
                        <div className="text-center py-5">
                            <h6 className="mb-2">Request Your First Report!</h6>
                            <p className="text-muted">
                                You can request reports like GSTR return report, Sales Report, TDS
                            </p>
                            <Button color="primary" onClick={toggleSidebar}>
                                <FaPlus className="me-1" /> REQUEST NEW REPORT
                            </Button>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            noHeader
                            className="border rounded"
                        />
                    )}
                </CardBody>
            </Card>

            {/* Offcanvas Sidebar */}
            <Offcanvas isOpen={isSidebarOpen} toggle={toggleSidebar} direction="end"  className="w-50">
                <OffcanvasHeader toggle={toggleSidebar}>Request New Report</OffcanvasHeader>
                <OffcanvasBody>
                   <OffInnerComponent/>
                </OffcanvasBody>
            </Offcanvas> 
        </>
    );
};

export default ReportCentre;
