import React, { useState } from 'react';
import {
    Card, CardBody, Button, ListGroup, ListGroupItem,
    Row, Col, Modal, ModalBody
} from 'reactstrap';
import {
    FaRocket, FaTshirt, FaFire, FaSearch, FaStar, FaVideo
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import { Link } from 'react-router-dom';

const DashboardCards = () => {
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
        <div className="">
            <Row>
                {/* What's New Card */}
                <Col md="4">
                    <Card className="flex-fill h-100 border-0">
                        <CardBody>
                            <div className="d-flex align-items-center mb-3">
                                <FaRocket className="me-2 text-dark" />
                                <h5 className="mb-0">What's New</h5>
                            </div>
                            <hr />
                            <div className='d-flex'>
                                <p>Your New Tier is Here!</p>
                                <Button color="success" outline className="ms-auto" size="sm">
                                    Check Now
                                </Button>
                            </div>
                            <div className="mt-3 p-3 border rounded text-center bg-light">
                                <strong>New tier from 1st June!</strong>
                                <p className="mb-0 small">Check key metrics and benefits to grow your business</p>
                                <div className="d-flex justify-content-center gap-2 mt-2">
                                    <span className="badge bg-warning text-dark">G</span>
                                    <span className="badge bg-secondary">S</span>
                                    <span className="badge bg-bronze text-dark">B</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                {/* Selection Insights */}
                <Col md="4">
                    <Card className="flex-fill h-100  border-0">
                        <CardBody>
                            <div className="d-flex align-items-center mb-3">
                                <FaSearch className="me-2 text-dark" />
                                <h5 className="mb-0">Selection Insights</h5>
                            </div>
                            <hr />
                            <ListGroup flush>
                                <ListGroupItem tag={Link} to="/fashion-trends" className="d-flex align-items-center justify-content-between" action>
                                    <span><FaTshirt className="me-2 text-info" />Fashion Trends</span>
                                    <span>{'>'}</span>
                                </ListGroupItem>

                                <ListGroupItem tag={Link} to="/dhamaka-selection" className="d-flex align-items-center justify-content-between" action>
                                    <span><FaFire className="me-2 text-danger" />Dhamaka Selection</span>
                                    <span>{'>'}</span>
                                </ListGroupItem>

                                <ListGroupItem tag={Link} to="/search-trends" className="d-flex align-items-center justify-content-between" action>
                                    <span><FaSearch className="me-2 text-warning" />Search Trends</span>
                                    <span>{'>'}</span>
                                </ListGroupItem>

                                <ListGroupItem tag={Link} to="/bestsellers" className="d-flex align-items-center justify-content-between" action>
                                    <span><FaStar className="me-2 text-primary" />Bestsellers</span>
                                    <span>{'>'}</span>
                                </ListGroupItem>
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>

                {/* Video Guides with Swiper */}
                <Col md="4">
                    <Card className="flex-fill h-100  border-0">
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0"><FaVideo className="me-1 text-dark" /> Video Guides</h5>
                                <span className="text-muted small">1 / 4</span>
                            </div>
                            <hr />

                            <Swiper modules={[Autoplay, Pagination, Navigation]} spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }}
                                navigation={true} autoplay={{ delay: 3000 }}>
                                <SwiperSlide>
                                    <div
                                        className="border p-2 rounded cursor-pointer"
                                        onClick={() => handleVideoClick('https://www.youtube.com/watch?v=ScsH0mFVpB4')}
                                    >
                                        <Row>
                                            <Col>
                                                <img src="https://i.ytimg.com/vi_webp/ScsH0mFVpB4/maxresdefault.webp" alt="Video 1" className="img-fluid mb-2" />
                                            </Col>
                                            <Col>
                                                <span className="badge bg-warning text-dark me-2">Quality</span>
                                                <p className="mb-0 small">Know about Prohibited and Restricted Items</p>
                                            </Col>
                                        </Row>
                                    </div>
                                </SwiperSlide>

                                <SwiperSlide>
                                    <div
                                        className="border p-2 rounded cursor-pointer"
                                        onClick={() => handleVideoClick('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                                    >
                                        <img src="https://via.placeholder.com/300x100?text=Video+2" alt="Video 2" className="img-fluid mb-2" />
                                        <span className="badge bg-warning text-dark me-2">Orders</span>
                                        <p className="mb-0 small">Why my pick-up is not done?</p>
                                    </div>
                                </SwiperSlide>
                            </Swiper>

                            <Button color="link" size="sm" className="mt-2 p-0">▶ View More</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

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
        </div>
    );
};

export default DashboardCards;
