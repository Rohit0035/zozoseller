import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Input,
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { FaListUl } from 'react-icons/fa';

const categoryOptions = [
    'All Services',
    'Account Management',
    'Cataloging',
    'Taxation',
    'Software Solutions',
    'Accounting'
];

const locationOptions = ['All Locations', 'Delhi', 'Mumbai', 'Bangalore'];

const statusTabs = [
    'All',
    'Active',
    'New',
    'Accepted',
    'Planned For Activation',
    'Cancelled'
];

// Sample data
const sampleData = [
    {
        id: 1,
        service: 'GST Filing',
        reference: 'REF123456',
        status: 'Accepted',
        updated: '11 Jul 2025',
        category: 'Taxation',
        location: 'Delhi'
    },
    {
        id: 2,
        service: 'Product Upload',
        reference: 'REF654321',
        status: 'Cancelled',
        updated: '10 Jul 2025',
        category: 'Cataloging',
        location: 'Mumbai'
    },
    {
        id: 3,
        service: 'Account Sync',
        reference: 'REF112233',
        status: 'Active',
        updated: '08 Jul 2025',
        category: 'Account Management',
        location: 'Delhi'
    }
];

// Table columns
const columns = [
    { name: 'Service', selector: row => row.service, sortable: true },
    { name: 'Reference No.', selector: row => row.reference },
    { name: 'Service Status', selector: row => row.status },
    { name: 'Updated', selector: row => row.updated }
];

const MyServices = () => {
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All Services');
    const [selectedLocation, setSelectedLocation] = useState('All Locations');

    const filterData = () => {
        return sampleData.filter(row => {
            const matchStatus = selectedStatus === 'All' || row.status === selectedStatus;
            const matchCategory = selectedCategory === 'All Services' || row.category === selectedCategory;
            const matchLocation = selectedLocation === 'All Locations' || row.location === selectedLocation;
            return matchStatus && matchCategory && matchLocation;
        });
    };

    const handleReset = () => {
        setSelectedStatus('All');
        setSelectedCategory('All Services');
        setSelectedLocation('All Locations');
    };

    return (
        <>
            <Row>
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Partner Services</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            My Services
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6">
                    <div className="d-flex justify-content-end justify-content-md-end">
                        <Col md="3">
                            <Input
                                type="select"
                                className='me-2'
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                            >
                                {categoryOptions.map(option => (
                                    <option key={option}>{option}</option>
                                ))}
                                
                            </Input>
                        </Col>
                        <Col md="3">
                            <Input
                                type="select"
                                className='me-2'
                                value={selectedLocation}
                                onChange={e => setSelectedLocation(e.target.value)}
                            >
                                {locationOptions.map(option => (
                                    <option key={option}>{option}</option>
                                ))}
                            </Input>
                        </Col>
                        <Col md="2">
                            <Button color="primary" onClick={handleReset}>
                                Reset
                            </Button>
                        </Col>
                    </div>
                </Col>
            </Row>

            <div className="mb-3 d-flex gap-2 flex-wrap">
                {statusTabs.map(tab => (
                    <Button
                        key={tab}
                        outline
                        color={selectedStatus === tab ? 'primary' : 'secondary'}
                        className={`rounded-pill px-3 ${selectedStatus === tab ? 'fw-bold' : ''}`}
                        onClick={() => setSelectedStatus(tab)}
                    >
                        {tab} <span className="ms-1">0</span>
                    </Button>
                ))}
            </div>

            <Row className="align-items-center mb-3">

            </Row>

            <Card>
                <CardBody>
                    {filterData().length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={filterData()}
                            noHeader
                            pagination
                            highlightOnHover
                        />
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <FaListUl size={40} className="mb-3 opacity-50" />
                            <div>No requests available</div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </>
    );
};

export default MyServices;
