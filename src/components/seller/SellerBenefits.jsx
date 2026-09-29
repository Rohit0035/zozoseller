import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button,
} from "reactstrap";

import {
    FaBoxesPacking,
    FaBullhorn,
    FaCalendarCheck,
    FaGraduationCap,
    FaUserGear,
    FaMobileScreenButton,
    FaChartLine,
    FaArrowRight,
} from "react-icons/fa6";

const SellerBenefits = () => {
    const benefits = [
        {
            icon: <FaBoxesPacking />,
            title: "Smart Fulfilment Support",
            description:
                "Simplify storing, packing, shipping, and order delivery with reliable fulfilment support designed to help you focus on growing your business.",
        },
        {
            icon: <FaBullhorn />,
            title: "ZOZO KART Ads",
            description:
                "Put your products in front of more shoppers with promotional tools designed to increase visibility, product discovery, and sales opportunities.",
        },
        {
            icon: <FaCalendarCheck />,
            title: "Shopping Events",
            description:
                "Take advantage of seasonal campaigns, special shopping events, and promotional opportunities to reach more customers and grow your orders.",
        },
        {
            icon: <FaGraduationCap />,
            title: "Seller Learning Center",
            description:
                "Access practical guides, seller resources, product insights, and learning content to improve your listings and build a stronger online business.",
        },
        {
            icon: <FaUserGear />,
            title: "Account Growth Support",
            description:
                "Get useful insights and seller-focused support to improve product selection, pricing, catalogue quality, and overall account performance.",
        },
        {
            icon: <FaMobileScreenButton />,
            title: "ZOZO KART Seller App",
            description:
                "Stay connected with your business wherever you go. Manage products, orders, inventory, performance, and seller activities from your mobile device.",
        },
    ];

    return (
        <section className="py-5 " id="benefits">
            <Container>
                <Row className="justify-content-center text-center mb-5">
                    <Col lg="9">

                        <div className="position-relative">



                            <div className="position-relative">
                                <span className="badge st-bg rounded-pill px-3 py-2 mb-3">
                                    SELLER BENEFITS
                                </span>



                                <h2 className="fw-bold display-6 text-dark mb-3">
                                    Everything your business needs to
                                    <br />
                                    <span className="st-text">grow faster on ZOZO KART</span>
                                </h2>
                                <p className=" text-secondary mb-0">
                                    Your ZOZO KART seller account gives you access to powerful
                                    tools, resources, and seller solutions designed to help you
                                    reach more customers, manage your business, and unlock new
                                    growth opportunities.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className="g-4">
                    {benefits.map((benefit, index) => (
                        <Col
                            lg="4"
                            md="6"
                            sm="12"
                            key={index}
                        >
                            <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden" data-aos="zoom-in">
                                <CardBody className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-3 me-3 fs-4">
                                            {benefit.icon}
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">
                                                {benefit.title}
                                            </h5>
                                        </div>
                                    </div>
                                    <p className="text-secondary mb-4">
                                        {benefit.description}
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row className="mt-5">
                    <Col data-aos="zoom-in">
                        <Card className="border-0 shadow-sm rounded-4 st-bg text-white">
                            <CardBody className="p-4 p-lg-5">
                                <Row className="align-items-center">
                                    <Col
                                        md="2"
                                        className="text-center text-md-start mb-3 mb-md-0"
                                    >
                                        <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center p-4 fs-2">
                                            <FaChartLine />
                                        </div>
                                    </Col>
                                    <Col md="10">
                                        <h4 className="fw-bold mb-2">
                                            Everything you need to build a growing seller business
                                        </h4>
                                        <p className="text-white mb-0">
                                            From product visibility and fulfilment to learning,
                                            analytics, and account support — ZOZO KART gives sellers
                                            the tools to move from their first order to long-term
                                            growth.
                                        </p>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default SellerBenefits;