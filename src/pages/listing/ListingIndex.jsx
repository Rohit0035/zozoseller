import React, { useState } from 'react';
import { FaList, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, Row, UncontrolledDropdown, UncontrolledTooltip } from 'reactstrap';
import StatsCards from '../../components/StatCard,';
import ListingProduct from './ListingProduct';

const ListingIndex = () => {

    const [videoModal, setVideoModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    const handleVideoClick = (url) => {
        setVideoUrl(url);
        setVideoModal(true);
    };

    const toggleModal = () => {
        setVideoModal(!videoModal);
    };

    return (
        <>
            <Row>
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Listings Management</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Home
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6">
                    <div className="d-flex justify-content-end justify-content-md-end">
                        <Link className="me-2" onClick={() => handleVideoClick('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}>
                            Learn about listing
                        </Link>
                        {/* <InputGroup className='me-2' style={{ maxWidth: '300px' }}>
                            <Input type="search" placeholder="Search for FSN, Title or SKU ID" />
                            <Button color='primary'>
                                <FaSearch />
                            </Button>
                        </InputGroup> */}
                        <UncontrolledDropdown>
                            <DropdownToggle caret color="" className="text-white" style={{ backgroundColor: '#02339a' }}>
                                Select Option
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Add Single Listing</DropdownItem>
                                <DropdownItem>Add Bulk Listing</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>

                </Col>
            </Row>
            {/* status card listing start */}
            <Row className='mt-3'>
                <Col xs="6" sm="3" md="4" lg="2" className="mb-2">
                    <Link className='text-decoration-none'>
                        <Card className='bg-info bg-opacity-10 p-2' style={{border:'none'}}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className='mb-0'>01</h4>
                                <span id="listTooltip" style={{ cursor: 'pointer' }}>
                                    <FaList />
                                </span>
                                <UncontrolledTooltip placement="top" target="listTooltip">
                                    View List
                                </UncontrolledTooltip>
                            </div>
                            <h5 className='fs-6'>Active Listings</h5>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="mb-2">
                    <Link className='text-decoration-none'>
                        <Card className='bg-primary bg-opacity-10 p-2'  style={{border:'none'}}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className='mb-0'>00</h4>
                                <span id="listTooltip" style={{ cursor: 'pointer' }}>
                                    <FaList />
                                </span>
                                <UncontrolledTooltip placement="top" target="listTooltip">
                                    View List
                                </UncontrolledTooltip>
                            </div>
                            <h5 className='fs-6'>Ready for Activation</h5>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="mb-2">
                    <Link className='text-decoration-none'>
                        <Card className='bg-warning bg-opacity-10 p-2'  style={{border:'none'}}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className='mb-0'>06</h4>
                                <span id="listTooltip" style={{ cursor: 'pointer' }}>
                                    <FaList />
                                </span>
                                <UncontrolledTooltip placement="top" target="listTooltip">
                                    View List
                                </UncontrolledTooltip>
                            </div>
                            <h5 className='fs-6'>Blocked Listings</h5>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="mb-2">
                    <Link className='text-decoration-none'>
                        <Card className='bg-danger bg-opacity-10 p-2'  style={{border:'none'}}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className='mb-0'>08</h4>
                                <span id="listTooltip" style={{ cursor: 'pointer' }}>
                                    <FaList />
                                </span>
                                <UncontrolledTooltip placement="top" target="listTooltip">
                                    View List
                                </UncontrolledTooltip>
                            </div>
                            <h5 className='fs-6'>Inactive Listings</h5>
                        </Card>
                    </Link>
                </Col>
                <Col xs="6" sm="3" md="4" lg="2" className="mb-2">
                    <Link className='text-decoration-none'>
                        <Card className='bg-success bg-opacity-10 p-2'  style={{border:'none'}}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className='mb-0'>01</h4>
                                <span id="listTooltip" style={{ cursor: 'pointer' }}>
                                    <FaList />
                                </span>
                                <UncontrolledTooltip placement="top" target="listTooltip">
                                    View List
                                </UncontrolledTooltip>
                            </div>
                            <h5 className='fs-'>Archived Listings</h5>
                        </Card>
                    </Link>
                </Col>
            </Row>
            {/* status card listing start */}

            {/* List start */}

            <Row className='mt-3'>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <ListingProduct />
                        </CardBody>

                    </Card>
                </Col>
            </Row>

            {/* List close */}

            {/* YouTube Video Modal */}
            <Modal isOpen={videoModal} toggle={toggleModal} size="lg" centered>
                <ModalBody className="p-0">
                    <div className="ratio ratio-16x9">
                        <iframe
                            width="100%"
                            height="400"
                            src={videoUrl.replace("watch?v=", "embed/")}
                            title="YouTube Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </ModalBody>
            </Modal>

        </>
    );
};

export default ListingIndex;
