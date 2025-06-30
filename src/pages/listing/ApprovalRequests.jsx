import React, { useState } from 'react';
import {
    Breadcrumb, BreadcrumbItem, Col, Row, Card, CardBody, Input, Button, Badge,
    Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label
} from 'reactstrap';
import { FaList, FaExclamationCircle, FaHourglassHalf, FaCheckCircle, FaDownload } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

const ApprovalRequests = () => {
    const [filterText, setFilterText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => setModalOpen(!modalOpen);

    const counters = [
        { title: 'All Requests', count: 1, icon: <FaList size={30} color="#fff" />, bgColor: '#6c757d', textColor: '#fff' },
        { title: 'Action Required', count: 1, icon: <FaExclamationCircle size={30} color="#fff" />, bgColor: '#dc3545', textColor: '#fff' },
        { title: 'Pending', count: 0, icon: <FaHourglassHalf size={30} color="#fff" />, bgColor: '#ffc107', textColor: '#000' },
        { title: 'Approved', count: 0, icon: <FaCheckCircle size={30} color="#fff" />, bgColor: '#28a745', textColor: '#fff' },
    ];

    const demoData = [
        { id: 143434443, brand: 'Nike', vertical: 'Sportswear', status: 'Pending', comments: 'Awaiting manager approval', lastUpdated: '2025-06-28' },
        { id: 243434434, brand: 'Apple', vertical: 'Electronics', status: 'Approved', comments: 'Approved by admin', lastUpdated: '2025-06-27' },
        { id: 356576764, brand: 'Samsung', vertical: 'Electronics', status: 'Action Required', comments: 'Need clarification', lastUpdated: '2025-06-26' },
    ];

    const filteredData = demoData.filter(
        (item) =>
            item.brand.toLowerCase().includes(filterText.toLowerCase()) ||
            item.vertical.toLowerCase().includes(filterText.toLowerCase()) ||
            item.status.toLowerCase().includes(filterText.toLowerCase()) ||
            item.comments.toLowerCase().includes(filterText.toLowerCase())
    );

    const columns = [
        { name: 'Request ID', selector: row => row.id, sortable: true },
        { name: 'Brand', selector: row => row.brand, sortable: true },
        { name: 'Vertical', selector: row => row.vertical, sortable: true },
        {
            name: 'Status',
            cell: row => {
                let color = 'secondary';
                if (row.status === 'Approved') color = 'success';
                else if (row.status === 'Pending') color = 'warning';
                else if (row.status === 'Action Required') color = 'danger';
                return <Badge color={color}>{row.status}</Badge>;
            },
            sortable: true,
        },
        { name: 'Comments', selector: row => row.comments, sortable: false },
        { name: 'Last Updated On', selector: row => row.lastUpdated, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <Button className="btn btn-primary btn-sm" onClick={toggleModal}>
                    Reapply
                </Button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <>
            {/* Breadcrumb */}
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem><h5>Approval Requests</h5></BreadcrumbItem>
                        <BreadcrumbItem active>Listing</BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>

            {/* Counters */}
            <Row>
                {counters.map((item, index) => (
                    <Col key={index} md="3" sm="6" xs="12" className="mb-3">
                        <Link to="/trackapprovalrequests" className='text-decoration-none'>
                            <Card className="text-start shadow-sm" style={{ backgroundColor: item.bgColor, color: item.textColor }}>
                                <CardBody className='p-2'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div>
                                            <h3 className="text-white" style={{ color: item.textColor }}>{item.count}</h3>
                                            <h5 className="mb-1 fs-6 fw-bold text-white" style={{ color: item.textColor }}>{item.title}</h5>
                                        </div>
                                        <div>{item.icon}</div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>

            {/* Search + CSV Export */}
            <Card>
                <CardBody>
                    <Row className="align-items-center mb-3">
                        <Col md="3" sm="6" xs="12" className="mb-2">
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </Col>
                        <Col className="text-end">
                            <CSVLink data={demoData} filename="request_list.csv">
                                <Button color="success">
                                    <FaDownload className="me-1" /> Export CSV
                                </Button>
                            </CSVLink>
                        </Col>
                    </Row>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </CardBody>
            </Card>

            {/* Modal for Reapply */}
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>Apply for Brand Approval</ModalHeader>
                <ModalBody>
                    <Form>
                        {/* Brand Name */}
                        <FormGroup>
                            <Label for="brandName">Brand Name *</Label>
                            <Input type="text" id="brandName" placeholder="Enter Brand Name" />
                        </FormGroup>

                        {/* Select Document */}
                        <FormGroup>
                            <Label for="documentType">Please select the document *</Label>
                            <Input type="select" id="documentType">
                                <option>Select</option>
                                <option>Trademark Certificate</option>
                                <option>Brand Authorization Letter</option>
                            </Input>
                        </FormGroup>

                        {/* Document Upload */}
                        <FormGroup>
                            <Label>Upload Document</Label>
                            <Input type="file" />
                        </FormGroup>

                        {/* Trademark Help */}
                        <FormGroup>
                            <Label>Trademark Help</Label>
                            <p><strong>Vakilsearch:</strong> Get your Trademark Registration today!!! Trademark Registration @ Rs 999 *Gov fee additional</p>
                        </FormGroup>

                        {/* Other Details (Optional) */}
                        <hr />
                        <h6>Other brand details (Optional)</h6>

                        {/* Brand Logo */}
                        <FormGroup>
                            <Label>Brand Logo</Label>
                            <Input type="file" />
                        </FormGroup>

                        {/* Website Link */}
                        <FormGroup>
                            <Label>Brand Website Link</Label>
                            <Input type="text" placeholder="https://example.com" />
                        </FormGroup>

                        {/* Where you sell */}
                        <FormGroup>
                            <Label>Where do you sell the products of this brand currently?</Label>
                            <Input type="select">
                                <option>Select</option>
                                <option>Amazon</option>
                                <option>Flipkart</option>
                                <option>Other</option>
                            </Input>
                        </FormGroup>

                        {/* Sample MRP Tag */}
                        <FormGroup>
                            <Label>Sample MRP Tag images</Label>
                            <Input type="file" />
                        </FormGroup>

                        {/* Brand Owner */}
                        <FormGroup>
                            <Label>Are you the brand owner?</Label>
                            <Input type="select">
                                <option>Select</option>
                                <option>Yes</option>
                                <option>No</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary">Submit</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default ApprovalRequests;
