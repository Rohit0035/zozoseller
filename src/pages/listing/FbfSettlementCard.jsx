
import React, { useState } from "react";

import {
    Card,
    CardBody,
    Button,
    Row,
    Col,
    
} from "reactstrap";

import {
    FiArrowLeft,
    FiChevronRight,
    FiInfo,
    FiPackage,
    FiTruck,
    FiMapPin,
    FiGlobe,
    FiCheckCircle,
    FiDollarSign,
} from "react-icons/fi";

const FbfSettlementCard = ({
    onOnboard = () => { },
    onSettlementBreakup = () => { },
}) => {

    const [showBenefits, setShowBenefits] = useState(false);

    return (
        <Card className="border-0 shadow-sm mt-3 rounded-3">

            {!showBenefits ? (

                <CardBody className="p-3">

                    <h6 className="small fw-semibold mb-3">
                        Ways to Increase Your Settlement & Sales
                    </h6>

                    <div className="bg-primary-subtle rounded-3 p-3 d-flex align-items-center gap-3">

                        <div className="flex-grow-1">

                            <div className="fw-semibold text-dark small">
                                With Fulfilment by Flipkart (FBF),
                                get Better Settlement & More Orders
                            </div>

                            <div className="d-flex align-items-center gap-3 flex-wrap mt-3">

                                <Button
                                    outline
                                    color="primary"
                                    size="sm"
                                    className="fw-semibold rounded-3"
                                    onClick={onOnboard}
                                >
                                    <FiTruck size={15} className="me-1" />
                                    Onboard to FBF
                                </Button>

                                <button
                                    type="button"
                                    className="btn btn-link btn-sm text-primary text-decoration-none fw-semibold p-0 d-flex align-items-center"
                                    onClick={() => setShowBenefits(true)}
                                >
                                    See benefits
                                    <FiChevronRight size={18} />
                                </button>

                            </div>

                        </div>

                        <div
                            className="bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                                width: "85px",
                                height: "85px",
                            }}
                        >
                            <div className="position-relative">
                                <FiPackage
                                    size={43}
                                    className="text-primary"
                                    strokeWidth={1.5}
                                />

                                <FiCheckCircle
                                    size={17}
                                    className="text-success position-absolute"
                                    style={{
                                        right: "-7px",
                                        top: "-5px",
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                </CardBody>

            ) : (


                <CardBody className="p-2">


                    <div className="d-flex align-items-center gap-2 mb-3 px-1">

                        <button
                            type="button"
                            className="btn btn-link text-dark p-0 text-decoration-none"
                            onClick={() => setShowBenefits(false)}
                        >
                            <FiArrowLeft size={23} />
                        </button>

                        <h6 className="small fw-semibold mb-0">
                            Benefits of FBF - Fulfilment By Flipkart
                        </h6>

                    </div>


                    <div className="bg-success-subtle rounded-3 p-3 text-center small fw-semibold mb-3">

                        <FiTrendingIcon />

                        Up to 30% More Orders & Faster Tier Upgrade,
                        at similar Settlement

                    </div>


                    <SettlementBox
                        title="Expected Avg Settlement with Seller Fulfilment"
                        local="4%"
                        zonal="27%"
                        national="69%"
                    />


                    <SettlementBox
                        title="Expected Avg Settlement with FBF"
                        local="13%"
                        zonal="35%"
                        national="52%"
                    />

                    {/* Footer Buttons */}

                    <div className="d-flex align-items-center gap-3 flex-wrap px-1 mt-2">

                        <Button
                            color="primary"
                            size="sm"
                            className="rounded-3 fw-semibold"
                            onClick={onOnboard}
                        >
                            <FiTruck size={15} className="me-1" />
                            Onboard to FBF
                        </Button>

                        <button
                            type="button"
                            className="btn btn-link btn-sm text-primary text-decoration-none fw-semibold p-0"
                            onClick={onSettlementBreakup}
                        >
                            See FBF Settlement Breakup
                            <FiChevronRight size={15} />
                        </button>

                    </div>

                </CardBody>

            )}

        </Card>
    );
};


// Small Trending Icon

const FiTrendingIcon = () => (
    <FiDollarSign
        size={17}
        className="text-success me-1"
    />
);


// Settlement Component

const SettlementBox = ({
    title,
    local,
    zonal,
    national,
}) => {

    return (

        <div className="border rounded-3 overflow-hidden d-flex mb-3">

            <div className="flex-grow-1 p-2">

                <div className="small fw-semibold text-dark mb-3">
                    {title}
                </div>

                <Row className="g-1">

                    <Col xs="4">

                        <div className="d-flex align-items-center gap-1 small text-secondary">
                            <FiMapPin size={13} />
                            Local
                            <span className="small ms-1"> ({local} Orders)</span>

                        </div>

                        <div className="small mt-2 fw-semibold">
                            ₹0
                        </div>

                    </Col>

                    <Col xs="4">

                        <div className="d-flex align-items-center gap-1 small text-secondary">
                            <FiTruck size={13} />
                            Zonal
                            <span className="small ms-1">  ({zonal})</span>
                        </div>
                        <div className="small mt-2 fw-semibold">
                            ₹0
                        </div>

                    </Col>

                    <Col xs="4">

                        <div className="d-flex align-items-center gap-1 small text-secondary">
                            <FiGlobe size={13} />
                            National
                            <span className="small ms-1">  ({national})</span>
                        </div>

                        <div className="small mt-2 fw-semibold">
                            ₹0
                        </div>

                    </Col>

                </Row>

            </div>


            <div
                className="bg-light d-flex flex-column justify-content-center align-items-center p-2"
                style={{
                    minWidth: "85px",
                }}
            >

                <small className="text-secondary text-center">
                    On Average
                </small>

                <div className="d-flex align-items-center gap-1 mt-1">

                    <strong className="fs-6 fw-normal">
                        ₹0
                    </strong>

                    <FiInfo
                        size={16}
                        className="text-secondary"
                    />

                </div>

            </div>

        </div>

    );
};

export default FbfSettlementCard;
