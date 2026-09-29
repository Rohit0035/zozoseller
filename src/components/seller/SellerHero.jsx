import React from "react";
import {
    Container,
    Row,
    Col,
    Button,
} from "reactstrap";

import {
    FaStore,
    FaArrowRight,
    FaCheckCircle,
    FaBox,
    FaChartLine,
    FaUsers,
} from "react-icons/fa";

const SellerHero = () => {
    return (
        <section className="bg-light py-4">
            <Container>
                <Row className="align-items-center py-lg-5 g-4">
                    <Col lg="6" data-aos="zoom-in">
                        <div className="mb-3">
                            <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                                <FaStore className="me-2" />
                                SELL ON ZOZO KART
                            </span>
                        </div>
                        <h1 className="fw-bold text-dark mb-3">
                            Grow Your Business With <br/>
                            <span className="st-text">
                                ZOZO KART
                            </span>
                        </h1>

                        <p className="lead text-secondary mb-4">
                            Reach more customers, showcase your products,
                            manage your orders and grow your online business
                            with ZOZO KART.
                        </p>
                        <div className="mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <FaCheckCircle className="text-success me-3" />
                                <span>
                                    Reach customers across India
                                </span>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <FaCheckCircle className="text-success me-3" />
                                <span>
                                    Easy product listing and management
                                </span>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <FaCheckCircle className="text-success me-3" />
                                <span>
                                    Manage orders from one place
                                </span>
                            </div>
                            <div className="d-flex align-items-center">
                                <FaCheckCircle className="text-success me-3" />
                                <span>
                                    Tools designed to help your business grow
                                </span>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                            <Button
                                color="primary"
                                size="lg"
                                href="/seller/register"
                                className="px-4"
                            >
                                Start Selling
                                <FaArrowRight className="ms-2" />
                            </Button>
                            <Button
                                color="outline-primary"
                                size="lg"
                                href="/seller/how-it-works"
                                className="px-4"
                            >
                                How It Works
                            </Button>
                        </div>
                        <div className="d-flex flex-wrap gap-4 text-secondary">
                            <div className="d-flex align-items-center">
                                <FaStore className="st-text me-2" />
                                <small>
                                    Easy Registration
                                </small>
                            </div>
                            <div className="d-flex align-items-center">
                                <FaBox className="st-text me-2" />
                                <small>
                                    Easy Listing
                                </small>
                            </div>
                            <div className="d-flex align-items-center">
                                <FaChartLine className="st-text me-2" />
                                <small>
                                    Business Growth
                                </small>
                            </div>
                        </div>
                    </Col>
                    <Col lg="6" data-aos="zoom-in">
                        <div className="position-relative">
                            <div className="bg-white rounded-4 shadow p-4">
                                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                                    <div>
                                        <small className="text-muted">
                                            Seller Dashboard
                                        </small>
                                        <h4 className="fw-bold mb-0">
                                            Business Overview
                                        </h4>
                                    </div>
                                    <div className="bg-warning rounded-circle p-3">
                                        <FaStore className="text-dark fs-4" />
                                    </div>
                                </div>
                                <Row className="g-3 mb-4">
                                    <Col xs="6">
                                        <div className="bg-light rounded-3 p-3">
                                            <div className="d-flex justify-content-between">
                                                <small className="text-muted">
                                                    Total Orders
                                                </small>
                                                <FaBox className="st-text" />
                                            </div>
                                            <h3 className="fw-bold mt-2 mb-1">
                                                1,248
                                            </h3>
                                            <small className="text-success">
                                                +18.5% this month
                                            </small>
                                        </div>
                                    </Col>


                                    <Col xs="6">
                                        <div className="bg-light rounded-3 p-3">
                                            <div className="d-flex justify-content-between">
                                                <small className="text-muted">
                                                    Customers
                                                </small>
                                                <FaUsers className="st-text" />
                                            </div>
                                            <h3 className="fw-bold mt-2 mb-1">
                                                8,540
                                            </h3>
                                            <small className="text-success">
                                                +24.8% this month
                                            </small>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="st-bg text-white rounded-4 p-4 mb-3">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <small className="opacity-75">
                                                Total Sales
                                            </small>
                                            <h2 className="fw-bold mt-2">
                                                ₹4,85,650
                                            </h2>
                                            <small>
                                                Growing your business with
                                                ZOZO KART
                                            </small>
                                        </div>
                                        <FaChartLine className="fs-1 opacity-75" />
                                    </div>

                                </div>

                                <div className="border rounded-3 p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-light rounded-3 p-3 me-3">
                                            <FaBox className="st-text fs-4" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1">
                                                Products Listed
                                            </h6>
                                            <small className="text-muted">
                                                Your products are available
                                                to online customers
                                            </small>
                                        </div>
                                        <h5 className="fw-bold text-success mb-0">
                                            356
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

        </section>
    );
};

export default SellerHero;