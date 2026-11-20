
import React, { useState } from "react";

import {
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Badge,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Alert,
    Progress,
    UncontrolledTooltip,
    Input
} from "reactstrap";

import {
    FiMonitor,
    FiInfo,
    FiSearch,
    FiStar,
    FiTrendingUp,
    FiTruck,
    FiChevronDown,
    FiChevronUp,
    FiAlertCircle,
    FiCheckCircle,
    FiExternalLink,
    FiPackage,
    FiHelpCircle,
    FiShield,
    FiBarChart2,
} from "react-icons/fi";

import { FaRegCreditCard } from "react-icons/fa";

import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import Proimg from "../../assets/images/seller/pro-1.jpg";
import { Link } from "react-router-dom";
import FbfSettlementCard from "./FbfSettlementCard";
import QualityTab from "./QualityTab";
import AssuredTab from "./AssuredTab";


// --------------------------------------------------
// Reusable Components
// --------------------------------------------------

const CardTitle = ({ children, right }) => (
    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <h6 className="mb-0 fw-semibold small">{children}</h6>
        {right}
    </div>
);

const InfoRow = ({ label, value, icon }) => (
    <div className="d-flex justify-content-between align-items-center border-bottom py-3 small">
        <span className="text-secondary">
            {icon}
            <span className="ms-2">{label}</span>
        </span>
        <span className="fw-semibold text-dark">{value}</span>
    </div>
);

const HistoryRow = ({ date, oldPrice, newPrice, source }) => (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom py-3 small">

        <span className="text-secondary">{date}</span>

        <div className="d-flex align-items-center gap-2">
            <span className="text-secondary text-decoration-line-through">
                {oldPrice}
            </span>

            <span className="fw-semibold">{newPrice}</span>

            <Badge color="success" pill>
                <FiTrendingUp size={10} />
            </Badge>
        </div>

        <span className="text-secondary">{source}</span>

        <span className="fw-semibold">ZIPRAVEL</span>
    </div>
);


// --------------------------------------------------
// Settlement & Price Tab
// --------------------------------------------------

const PriceTab = () => {

    const [showRateCard, setShowRateCard] = useState(false);
    const [showFees, setShowFees] = useState(true);

    return (
        <>
            <div className="bg-white border p-2 px-3 mb-3 d-flex flex-wrap align-items-center gap-3 small">

                <Badge color="primary" className="bg-primary-subtle text-st">
                    Current Pricing
                </Badge>

                <span className="text-secondary">
                    Bank Settlement: ₹390
                </span>

                <span className="text-secondary">
                    Listing Price: ₹488
                </span>

            </div>

            <Row className="g-3">

                {/* Left Side */}
                <Col xs="12" lg="6">

                    <Card className="border-0 shadow-sm">
                        <CardBody className="p-3">

                            <CardTitle>
                                Settlement to Price Calculator
                            </CardTitle>

                            <div className="d-flex align-items-center gap-2 mb-3 px-2">

                                <FaRegCreditCard size={18} />

                                <span className="small text-secondary">
                                    Bank Settlement
                                </span>

                                <Badge color="light" className="text-secondary fw-normal">
                                    Chosen by You
                                </Badge>

                                <div className="ms-auto border rounded px-3 py-1 fw-semibold small">
                                    <Input
                                        type="text"
                                        defaultValue="₹390"
                                        bsSize="sm"
                                        className="border-0 p-0 fw-semibold shadow-none"
                                        style={{ width: '50px', background: 'transparent' }}
                                    />
                                </div>

                            </div>

                            {/* Average Fees */}
                            <div className="bg-primary-subtle rounded p-3 mb-3">

                                <div
                                    role="button"
                                    onClick={() => setShowFees(!showFees)}
                                    className="d-flex align-items-center justify-content-between"
                                >

                                    <div className="d-flex align-items-center gap-2">

                                        <FiTruck />

                                        <span className="small fw-medium">
                                            Average Fees and Taxes
                                        </span>

                                        {showFees ? <FiChevronUp /> : <FiChevronDown />}

                                    </div>

                                    <span className="small text-secondary">
                                        +₹2
                                    </span>

                                </div>

                                {showFees && (
                                    <>

                                        <p className="small mt-3 mb-3">
                                            Estimated fees at a price of ₹392,
                                            based on the current rate card and
                                            order fulfilment data from 20 Sep
                                            to 19 Oct for your listings in this
                                            vertical.
                                        </p>

                                        <Row className="g-2 text-center small">

                                            <Col xs="4">
                                                <div className="bg-white rounded p-2">
                                                    <div className="text-secondary">
                                                        Local (0%)
                                                    </div>
                                                    <strong>x ₹2</strong>
                                                </div>
                                            </Col>

                                            <Col xs="4">
                                                <div className="bg-white rounded p-2">
                                                    <div className="text-secondary">
                                                        Zonal (64%)
                                                    </div>
                                                    <strong>x ₹2</strong>
                                                </div>
                                            </Col>

                                            <Col xs="4">
                                                <div className="bg-white rounded p-2">
                                                    <div className="text-secondary">
                                                        National (36%)
                                                    </div>
                                                    <strong>x ₹2</strong>
                                                </div>
                                            </Col>

                                        </Row>

                                        <div className="bg-white rounded p-2 mt-2 d-flex justify-content-between align-items-center">

                                            <small className="text-secondary">
                                                Fees and Taxes Expected Avg
                                            </small>

                                            <strong>₹2</strong>

                                        </div>

                                    </>
                                )}

                            </div>

                            {/* Rate Card */}
                            <Button
                                color="link"
                                className="p-0 small text-decoration-none fw-semibold mb-2"
                                onClick={() => setShowRateCard(!showRateCard)}
                            >
                                {showRateCard ? <FiChevronUp /> : <FiChevronDown />}
                                {" "}See Full Rate Card
                            </Button>

                            {showRateCard && (
                                <div className="border rounded p-2 mb-3">

                                    <InfoRow
                                        label="Seller Price"
                                        value="₹392"
                                    />

                                    <InfoRow
                                        label="Commission Fee"
                                        value="₹0"
                                    />

                                    <InfoRow
                                        label="Customer Logistics Fees"
                                        value="+₹96"
                                    />

                                    <InfoRow
                                        label="GST"
                                        value="₹0"
                                    />

                                    <InfoRow
                                        label="Other Fees"
                                        value="₹2"
                                    />

                                </div>
                            )}

                            <div className="px-2">

                                <InfoRow
                                    label="Seller Price"
                                    value="₹392"
                                />

                                <InfoRow
                                    label="Customer Logistics Fees"
                                    value="+₹96"
                                />

                                <div className="d-flex justify-content-between align-items-center py-3 border-bottom">

                                    <span className="small fw-semibold">
                                        <FiPackage className="me-2" />
                                        Listing Price
                                    </span>

                                    <strong>₹488</strong>

                                </div>

                            </div>

                            <Alert color="light" className="small mt-3 mb-3 py-2">
                                You can increase the settlement only 2 times
                                a day. <FiInfo />
                            </Alert>

                            <div className="text-end">
                                <Button color="primary" size="sm">
                                    Apply ₹390 as Settlement
                                </Button>
                            </div>

                        </CardBody>
                    </Card>

                    {/* Ways to Increase */}
                    <FbfSettlementCard/>

                </Col>

                {/* Right Side */}
                <Col xs="12" lg="6">

                    {/* Trends */}
                    <Card className="border-0 shadow-sm">

                        <CardBody className="p-3">

                            <CardTitle
                                right={
                                    <small className="text-muted">
                                        Last updated at 16-Nov
                                    </small>
                                }
                            >
                                Settlement and Price Trends
                            </CardTitle>

                            <div className="d-flex flex-wrap gap-3 justify-content-center small mb-3">

                                <span className="text-st">
                                    ● Avg Selling Price (₹)
                                </span>

                                <span className="text-danger">
                                    ● Avg Bank Settlement (₹)
                                </span>

                                <span className="text-success">
                                    ● Sale Period
                                </span>

                            </div>

                            <div className="border rounded p-3">

                                <div className="d-flex justify-content-between small text-muted mb-3">
                                    <span>₹300</span>
                                    <span>₹450</span>
                                </div>

                                <div
                                    className="d-flex align-items-end justify-content-around"
                                    style={{ height: "155px" }}
                                >

                                    {[75, 45, 90, 65, 100, 80, 60].map((height, index) => (

                                        <div
                                            key={index}
                                            className="bg-primary-subtle border-top border-primary rounded-top"
                                            style={{
                                                height: `${height}%`,
                                                width: "7%",
                                            }}
                                        />

                                    ))}

                                </div>

                                <div className="d-flex justify-content-between small text-muted mt-3">

                                    <span>10 Jan</span>
                                    <span>30 Jan</span>
                                    <span>20 Feb</span>
                                    <span>11 Mar</span>
                                    <span>1 Apr</span>

                                </div>

                                <Alert color="warning" className="text-center small mt-3 mb-0">

                                    <FiAlertCircle size={17} className="mb-1" />

                                    <div>
                                        Data not enough to gather trends.
                                        Please wait till you get orders or
                                        check other listings with sales data.
                                    </div>

                                </Alert>

                            </div>

                        </CardBody>
                    </Card>

                    {/* History */}
                    <Card className="border-0 shadow-sm mt-3">

                        <CardBody className="p-3">

                            <CardTitle>
                                Settlement Change History
                            </CardTitle>

                            <HistoryRow
                                date="22/10/26"
                                oldPrice="₹399"
                                newPrice="₹390"
                                source="Seller dashboard UI"
                            />

                            <HistoryRow
                                date="15/10/26"
                                oldPrice="₹403"
                                newPrice="₹399"
                                source="Seller dashboard UI"
                            />

                            <HistoryRow
                                date="30/09/26"
                                oldPrice="NA"
                                newPrice="₹403"
                                source="System Update"
                            />

                            <h6 className="small fw-semibold mt-4 mb-2">
                                Price Update History
                            </h6>

                            <p className="small text-secondary">
                                Details about the recent price changes.
                            </p>

                            <HistoryRow
                                date="13/11/26"
                                oldPrice="₹585"
                                newPrice="₹488"
                                source="Seller dashboard UI"
                            />

                        </CardBody>
                    </Card>

                </Col>

            </Row>
        </>
    );
};


// --------------------------------------------------
// Inventory Tab
// --------------------------------------------------



const InventoryTab = () => {

    const inventoryData = [
        {
            title: "Seller Only",
            totalUnits: 30,
            locations: [
                {
                    location: "Bangalore",
                    availableUnits: 30
                }
            ]
        },
        {
            title: "Smart Only",
            totalUnits: 0,
            inwardProduct: true,
            locations: [
                {
                    location: "Bangalore",
                    availableUnits: 0
                }
            ]
        }
    ];

    return (
        <Row className="g-0 bg-light p-3">

            {inventoryData.map((card, index) => (

                <Col xs="12" lg="6" className="p-2" key={index}>

                    <Card className="border-0 rounded-0 shadow-none h-100">

                        <CardBody className="p-3">

                            <Row className="align-items-center">

                                <Col>
                                    <CardTitle tag="h6" className="mb-1 text-primary">
                                        {card.title}
                                    </CardTitle>

                                    <div className="small text-secondary">
                                        Total {card.totalUnits} {card.totalUnits === 1 ? "Unit" : "Units"}
                                    </div>
                                </Col>

                                {card.inwardProduct && (
                                    <Col xs="auto">
                                        <a
                                            href="/inventory/inward-product"
                                            className="small text-primary text-decoration-none"
                                        >
                                            Inward Product
                                        </a>
                                    </Col>
                                )}

                            </Row>

                            <hr className="my-4" />

                            {card.locations.map((item, locationIndex) => (

                                <Row
                                    key={locationIndex}
                                    className="align-items-center"
                                >

                                    <Col xs="6">
                                        <span className="small text-dark">
                                            {item.location}
                                        </span>
                                    </Col>

                                    <Col xs="6" className="text-end">
                                        <span className="small text-dark">
                                            {item.availableUnits} Unit
                                            {item.availableUnits === 1 ? "" : "s"} Available
                                        </span>
                                    </Col>

                                </Row>

                            ))}

                        </CardBody>

                    </Card>

                </Col>

            ))}

        </Row>
    );
};


// --------------------------------------------------
// Buyer's Questions Tab
// --------------------------------------------------

const QuestionsTab = () => {

    const questions = [
        {
            question: "Is this bag suitable for gym and travel?",
            answer: "Yes, this duffel bag is suitable for gym, travel and everyday use.",
            date: "16-Nov-2026",
        },
        {
            question: "Does this bag have multiple compartments?",
            answer: "Yes, the bag comes with multiple storage compartments.",
            date: "14-Nov-2026",
        },
        {
            question: "Is the material waterproof?",
            answer: "The bag is made with water-resistant material.",
            date: "12-Nov-2026",
        },
    ];

    return (

        <Row className="g-3">

            <Col xs="12">

                <Card className="border-0 shadow-sm">

                    <CardBody className="p-3">

                        <CardTitle
                            right={
                                <Badge color="primary">
                                    3 Questions
                                </Badge>
                            }
                        >
                            Buyer's Questions
                        </CardTitle>

                        {questions.map((item, index) => (

                            <div key={index} className="border-bottom py-3">

                                <div className="d-flex gap-2">

                                    <FiHelpCircle className="text-st mt-1" />

                                    <div className="flex-grow-1">

                                        <div className="small fw-semibold">
                                            {item.question}
                                        </div>

                                        <small className="text-muted">
                                            Asked on {item.date}
                                        </small>

                                        <div className="bg-light rounded p-3 mt-2">

                                            <small className="fw-semibold">
                                                Seller Answer
                                            </small>

                                            <p className="small mb-0 mt-1 text-secondary">
                                                {item.answer}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </CardBody>

                </Card>

            </Col>

        </Row>

    );
};


// --------------------------------------------------
// Main Listing Details Sidebar
// --------------------------------------------------

const ListingDetailsSidebar = ({ isOpen, toggle }) => {

    const [activeTab, setActiveTab] = useState("price");

    const product = {
        name: "ZIPRAVEL Teal & Black Graphic Gym and Travel Duffel Bag Gym Duffel Bag",
        sku: "ZRGBS326002D",
        fsn: "DFBHRPFWA2HNAMB5",
    };

    const tabs = [
        { id: "price", label: "Settlement & Price" },
        { id: "inventory", label: "Inventory" },
        { id: "quality", label: "Quality" },
        { id: "assured", label: "F-Assured" },
        { id: "questions", label: "Buyer's Questions" },
    ];

    return (

        <Offcanvas
            isOpen={isOpen}
            toggle={toggle}
            direction="end"
            backdrop="static"
            className="border-0"
            style={{
                width: "90vw",
                maxWidth: "1100px",
            }}
        >

            {/* Header */}
            <OffcanvasHeader
                toggle={toggle}
                className="border-bottom py-2 px-3"
            >
                <span className="small fw-semibold">
                    Listing Details
                </span>
            </OffcanvasHeader>

            <OffcanvasBody className="p-0 overflow-hidden">

                <PerfectScrollbar
                    options={{ suppressScrollX: true }}
                    style={{
                        height: "calc(100vh - 55px)",
                    }}
                >

                    {/* Product Details */}
                    <div className="px-3 px-md-4 py-3">

                        <Row className="align-items-center g-3">

                            <Col xs="3" md="1">

                                <img
                                    src={Proimg}
                                    alt="Product"
                                    className="img-fluid rounded"
                                />

                            </Col>

                            <Col xs="9" md="10">

                                <h6 className="small fw-bold mb-1">
                                    {product.name}
                                </h6>

                                <div className="small text-secondary">

                                    <div>
                                        <strong>SKU ID:</strong> {product.sku}
                                    </div>

                                    <div>
                                        <strong>FSN ID:</strong> {product.fsn}
                                    </div>

                                </div>

                            </Col>

                            <Col xs="12" md="1" className="text-md-end">
                                <Link
                                    to="https://www.zozokart.com/"
                                    id="moniter"
                                    className="text-st"
                                >
                                    <FiMonitor size={18} className="text-st" />
                                </Link>
                                <UncontrolledTooltip target="moniter" style={{ fontSize: "10px" }}>
                                    View on zozokart.com
                                </UncontrolledTooltip>
                            </Col>
                        </Row>

                    </div>


                    {/* Seller Lens Banner */}
                    <div className="px-3 px-md-4 mb-3">

                        <div
                            className="border rounded-3 p-3"
                            style={{
                                backgroundColor: "#fffdeb",
                            }}
                        >

                            <Row className="align-items-center g-3">

                                <Col xs="12" md="2">

                                    <div className="d-flex align-items-center gap-2">

                                        <span className="bg-warning-subtle rounded p-2">
                                            <FiSearch size={22} className="text-st" />
                                        </span>

                                        <div>

                                            <div className="fw-bold small text-st">
                                                Seller Lens
                                            </div>

                                            <small className="text-secondary">
                                                by ZOZO KART
                                            </small>

                                        </div>

                                    </div>

                                </Col>

                                <Col xs="12" md="8">

                                    <div className="text-center">

                                        <div className="small fw-semibold mb-2">
                                            Improve listings with insights from top products using Seller Lens Extension on ZOZO KART
                                        </div>

                                        <div className="d-flex justify-content-center flex-wrap gap-3 small">

                                            <span>
                                                <FiSearch className="text-st me-1" />
                                                Identify top keywords
                                            </span>

                                            <span>
                                                <FiStar className="text-st me-1" />
                                                Win Buy Now
                                            </span>

                                            <span>
                                                <FiBarChart2 className="text-st me-1" />
                                                Monitor Ratings Trends
                                            </span>

                                        </div>

                                    </div>

                                </Col>

                                <Col xs="12" md="2" className="text-md-end text-center">

                                    <Button
                                        color="primary"
                                        outline
                                        size="sm"
                                    >
                                        Install <FiExternalLink />
                                    </Button>

                                </Col>

                            </Row>

                        </div>

                    </div>


                    {/* Navigation Tabs */}
                    <div className="px-3 px-md-4">

                        <Nav
                            tabs
                            className="flex-nowrap overflow-auto"
                            style={{
                                whiteSpace: "nowrap",
                            }}
                        >

                            {tabs.map((tab) => (

                                <NavItem key={tab.id}>

                                    <NavLink
                                        href="#"
                                        active={activeTab === tab.id}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveTab(tab.id);
                                        }}
                                        className={`small px-2 py-1 ${activeTab === tab.id
                                            ? "text-st fw-semibold"
                                            : "text-secondary"
                                            }`}
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        {tab.label}
                                    </NavLink>

                                </NavItem>

                            ))}

                        </Nav>

                    </div>


                    {/* Tab Content */}
                    <div
                        className="p-3 p-md-4"
                        style={{
                            backgroundColor: "#f0f0f0",
                            minHeight: "500px",
                        }}
                    >

                        <TabContent activeTab={activeTab}>

                            <TabPane tabId="price">
                                <PriceTab />
                            </TabPane>

                            <TabPane tabId="inventory">
                                <InventoryTab />
                            </TabPane>

                            <TabPane tabId="quality">
                                <QualityTab />
                            </TabPane>

                            <TabPane tabId="assured">
                                <AssuredTab />
                            </TabPane>

                            <TabPane tabId="questions">
                                <QuestionsTab />
                            </TabPane>

                        </TabContent>

                    </div>

                </PerfectScrollbar>

            </OffcanvasBody>

        </Offcanvas>

    );
};

export default ListingDetailsSidebar;
