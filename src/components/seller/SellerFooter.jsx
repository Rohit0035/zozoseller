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
    FaHeadset,
    FaWhatsapp,
    FaPhone,
    FaEnvelope,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaXTwitter,
    FaLocationDot,
    FaShieldHalved,
    FaTruckFast,
    FaChartLine,
} from "react-icons/fa6";
import logofoot from "../../assets/images/logo/logo-foot.png"


const SellerFooter = () => {
    return (
        <footer className="bg-dark text-white">
            <Container>

                <Row className="py-5 g-4">

                    <Col lg="4" md="6">

                        <img src={logofoot} alt="" width={150} className="mb-2" />

                        <p className="text-white-50 pe-lg-4">
                            ZOZO KART is a modern online marketplace built to connect
                            customers with sellers and help businesses reach new
                            customers through a simple and powerful digital platform.
                        </p>

                        <div className="d-flex align-items-center mb-3">
                            <FaShieldHalved className="text-warning me-3" />
                            <span className="text-white-50">
                                Secure marketplace experience
                            </span>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                            <FaTruckFast className="text-warning me-3" />
                            <span className="text-white-50">
                                Reliable order & fulfilment support
                            </span>
                        </div>

                        <div className="d-flex align-items-center">
                            <FaChartLine className="text-warning me-3" />
                            <span className="text-white-50">
                                Tools designed for seller growth
                            </span>
                        </div>

                    </Col>

                    <Col lg="2" md="6">

                        <h6 className="fw-bold mb-4">
                            Marketplace
                        </h6>

                        <ul className="list-unstyled mb-0">

                            <li className="mb-3">
                                <a
                                    href="#"
                                    className="text-white-50 text-decoration-none"
                                >
                                    Home
                                </a>
                            </li>

                            <li className="mb-3">
                                <a
                                    href="https://www.zozokart.com/"
                                    className="text-white-50 text-decoration-none"
                                >
                                    Shop Products
                                </a>
                            </li>

                            <li className="mb-3">
                                <a
                                    href="https://www.zozokart.com/"
                                    className="text-white-50 text-decoration-none"
                                >
                                    Categories
                                </a>
                            </li>





                        </ul>

                    </Col>

                    <Col lg="2" md="6">

                        <h6 className="fw-bold mb-4">
                            Sell With Us
                        </h6>

                        <ul className="list-unstyled mb-0">

                            <li className="mb-3">
                                <a
                                    href="#"
                                    className="text-white-50 text-decoration-none"
                                >
                                    Become a Seller
                                </a>
                            </li>

                            <li className="mb-3">
                                <a
                                    href="#"
                                    className="text-white-50 text-decoration-none"
                                >
                                    Seller Benefits
                                </a>
                            </li>

                            <li className="mb-3">
                                <a
                                    href="#"
                                    className="text-white-50 text-decoration-none"
                                >
                                    How It Works
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#"
                                    className="text-white-50 text-decoration-none"
                                >
                                    Seller Support
                                </a>
                            </li>
                        </ul>

                    </Col>

                    <Col lg="4" md="6">

                        <h6 className="fw-bold mb-4">
                            Need Help?
                        </h6>

                        <p className="text-white-50 mb-4">
                            Our support team is here to help customers and sellers
                            with their ZOZO KART journey.
                        </p>

                        <div className="d-flex align-items-center mb-3">
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px"
                                }}
                                className="bg-secondary bg-opacity-25 rounded-circle p-2 me-3 text-center">
                                <FaHeadset className="text-warning" />
                            </div>

                            <div>
                                <small className="text-white-50 d-block">
                                    Customer & Seller Support
                                </small>
                                <span className="fw-semibold">
                                    Get Help
                                </span>
                            </div>

                        </div>

                        <div className="d-flex align-items-center mb-3">

                            <div
                                style={{
                                    width: "40px",
                                    height: "40px"
                                }}
                                className="bg-secondary bg-opacity-25 rounded-circle p-2 me-3 text-center">
                                <FaWhatsapp className="text-warning" />
                            </div>

                            <div>
                                <small className="text-white-50 d-block">
                                    WhatsApp
                                </small>
                                <span className="fw-semibold">
                                    Chat With Us
                                </span>
                            </div>

                        </div>

                        <div className="d-flex align-items-center mb-3">

                            <div
                                style={{
                                    width: "40px",
                                    height: "40px"
                                }}
                                className="bg-secondary bg-opacity-25 rounded-circle p-2 me-3 text-center">
                                <FaEnvelope className="text-warning" />
                            </div>

                            <div>
                                <small className="text-white-50 d-block">
                                    Email
                                </small>
                                <span className="fw-semibold">
                                    support@zozokart.com
                                </span>
                            </div>

                        </div>

                        <div className="d-flex align-items-center">

                            <div
                                style={{
                                    width: "40px",
                                    height: "40px"
                                }}
                                className="bg-secondary bg-opacity-25 rounded-circle p-2 me-3 text-center">
                                <FaPhone className="text-warning" />
                            </div>

                            <div>
                                <small className="text-white-50 d-block">
                                    Seller Helpline
                                </small>
                                <span className="fw-semibold">
                                    Talk to our team
                                </span>
                            </div>

                        </div>

                    </Col>

                </Row>

                <Row className="border-top border-secondary py-4 align-items-center">

                    <Col md="7" className="mb-3 mb-md-0">

                        <div className="d-flex align-items-center text-white-50">

                            <FaLocationDot className="text-warning me-2" />

                            <span>
                                Serving customers and businesses across India
                            </span>

                        </div>

                    </Col>

                    <Col md="5">

                        <div className="d-flex justify-content-md-end gap-2">

                            <a
                                href="#"

                                className="bg-secondary bg-opacity-25 text-white rounded-circle p-2 d-flex"
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="#"
                                className="bg-secondary bg-opacity-25 text-white rounded-circle p-2 d-flex"
                            >
                                <FaInstagram />
                            </a>

                            <a
                                href="#"
                                className="bg-secondary bg-opacity-25 text-white rounded-circle p-2 d-flex"
                            >
                                <FaYoutube />
                            </a>

                            <a
                                href="#"
                                className="bg-secondary bg-opacity-25 text-white rounded-circle p-2 d-flex"
                            >
                                <FaLinkedinIn />
                            </a>

                            <a
                                href="#"
                                className="bg-secondary bg-opacity-25 text-white rounded-circle p-2 d-flex"
                            >
                                <FaXTwitter />
                            </a>

                        </div>

                    </Col>

                </Row>

            </Container>
        </footer>
    );
};

export default SellerFooter;