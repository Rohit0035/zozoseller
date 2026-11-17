
import React, { useState } from "react";
import {
    Input,
    InputGroup,
    Button,
    Badge,
    Collapse,
    Container,
    Row,
    Col
} from "reactstrap";

import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import {
    FaSearch,
    FaMicrophone,
    FaTimes,
    FaChevronRight,
    FaChevronDown,
    FaChevronUp,
    FaShoppingCart,
    FaTag,
    FaRupeeSign,
    FaBox,
    FaAssistiveListeningSystems,
    FaList,
    FaRegFileAlt,
} from "react-icons/fa";

import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const ZozoSerach = () => {

    const [selectedScope, setSelectedScope] = useState("all");

    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showMore, setShowMore] = useState({});

    // SEARCH SUGGESTIONS
    const suggestions = [
        { title: "ZRGBS326002C", category: "SKU ID" },
        { title: "DFBHS4QKV9FSTABF", category: "FSN ID" },
        { title: "LSTBAGHRUQDDSY2C5VG9ZVTMU", category: "Listing ID" },
        { title: "OD438838796024116100", category: "Order ID" },
        { title: "Google Ads", category: "Pages" },
        { title: "My Ticket", category: "Pages" },
        { title: "I am unable to download STN and Labels", category: "Help" },
    ];

    // DUMMY PRODUCTS
    const products = [
        {
            id: 1,
            name: "ZIPRAVEL Navy Blue Travel Bag",
            sku: "ZRGBS326002C",
            fsn: "DFBHS4QKV9FSTABF",
            stock: 24,
            cost: 390,
            price: 585,
            sales: 585,
            returns: 0,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        },
        {
            id: 2,
            name: "ZIPRAVEL Navy Blue Travel Bag",
            sku: "ZRGBS326002C",
            fsn: "DFBHS4QKV9FSTABF",
            stock: 24,
            cost: 390,
            price: 585,
            sales: 585,
            returns: 0,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
        },
        {
            id: 2,
            name: "ZIPRAVEL Black Travel Backpack",
            sku: "ZRGBS326003C",
            fsn: "DFBHS4QKV9FSTABC",
            stock: 18,
            cost: 420,
            price: 699,
            sales: 1398,
            returns: 1,
            image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=300&h=300&fit=crop",
        },
        {
            id: 3,
            name: "SPORTS Running Shoes",
            sku: "SHOES326004C",
            fsn: "DFSHOES4QKV9FSTAC",
            stock: 35,
            cost: 650,
            price: 999,
            sales: 2997,
            returns: 2,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        },
        {
            id: 4,
            name: "Premium Analog Wrist Watch",
            sku: "WATCH326005C",
            fsn: "DFWATCH4QKV9FSTAD",
            stock: 12,
            cost: 850,
            price: 1499,
            sales: 4497,
            returns: 0,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        },
    ];

    const qcProducts = [
        {
            id: 1,
            name: "Unisex Black Travel Bag",
            sku: "ZRGBS326002C",
            image: products[0].image,
        },
        {
            id: 2,
            name: "Urban Pro Backpack",
            sku: "ZRGBS326003C",
            image: products[1].image,
        },
        {
            id: 3,
            name: "Navy Blue Travel Bag",
            sku: "ZRGBS326004C",
            image: products[0].image,
        },

    ];

    // FILTER SUGGESTIONS
    const filteredSuggestions = suggestions.filter((item) =>
        item.title.toLowerCase().includes(search.trim().toLowerCase())
    );

    // FILTER PRODUCTS
    const filteredProducts = products.filter((product) => {
        const value = search.trim().toLowerCase();

        return (
            product.name.toLowerCase().includes(value) ||
            product.sku.toLowerCase().includes(value) ||
            product.fsn.toLowerCase().includes(value)
        );
    });

    // SEARCH HANDLER
    const handleSearch = (value = search) => {
        if (!value.trim()) return;

        setSearch(value);
        setShowResults(true);
        setIsFocused(false);
        setShowMore({});
    };

    // CLEAR SEARCH
    const handleClear = () => {
        setSearch("");
        setShowResults(false);
        setIsFocused(false);
        setShowMore({});
    };

    // SHOW MORE / LESS
    const toggleMore = (id) => {
        setShowMore((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <section className="bg-white rounded-3 w-100">
            <Container>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="position-relative">
                            <InputGroup className=" rounded-5 overflow-hidden border-light border border-3">
                                <div className="d-flex align-items-center bg-white flex-shrink-0">
                                    <Button
                                        color="white"
                                        size="sm"
                                        onClick={() => setSelectedScope("this")}
                                        className={`border-0 rounded-0 px-3 ${selectedScope === "this"
                                                ? " text-st"
                                                : "text-secondary"
                                            }`}
                                        style={{ fontSize: "12px" }}
                                    >
                                        {selectedScope === "this" && (
                                            <span className="me-1">✓</span>
                                        )}
                                        This Page
                                    </Button>
                                    <Button
                                        color="white"
                                        size="sm"
                                        onClick={() => setSelectedScope("all")}
                                        className={`border-0 rounded-0 px-3 ${selectedScope === "all"
                                                ? " text-st"
                                                : "text-secondary"
                                            }`}
                                        style={{ fontSize: "12px" }}
                                    >
                                        {selectedScope === "all" && (
                                            <span className="me-1">✓</span>
                                        )}
                                        All Pages
                                    </Button>
                                </div>
                                <Input
                                    className="border-0 shadow-none py-2 bg-light"
                                    placeholder="Search Anything"
                                    value={search}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setSearch(value);
                                        setShowResults(false);
                                        setIsFocused(value.trim().length > 0);
                                    }}
                                    onFocus={() => {
                                        if (search.trim()) {
                                            setIsFocused(true);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }

                                        if (e.key === "Escape") {
                                            setIsFocused(false);
                                        }
                                    }}
                                />
                                {search && (
                                    <Button
                                        color="white"
                                        onClick={handleClear}
                                        title="Clear Search"
                                    >
                                        <FaTimes className="text-secondary" />
                                    </Button>
                                )}

                                <Button
                                    color="white"
                                    onClick={() => handleSearch()}
                                    title="Search"
                                >
                                    <FaSearch className="text-st" />
                                </Button>

                            </InputGroup>

                            {isFocused && search.trim().length > 0 && !showResults && (

                                <div
                                    className="position-absolute top-100 start-0 w-100 bg-white shadow rounded-4 mt-2 p-3"
                                    style={{ zIndex: 1050 }}
                                >

                                    <div className="bg-light rounded-3 p-3 mb-2">

                                        <div className="d-flex justify-content-between align-items-center mb-2">

                                            <small>
                                                Get a quick summary of
                                            </small>

                                            <Badge
                                                color="light"
                                                className="text-primary border"
                                            >
                                                <span className="text-primary">●</span>
                                                {" "}New Feature
                                            </Badge>

                                        </div>

                                        <Button
                                            color="white"
                                            className="border text-dark btn-sm"
                                            onClick={() => handleSearch("QC Status")}
                                        >
                                            QC Status
                                            <FaChevronRight className="ms-2" />
                                        </Button>

                                    </div>

                                    <PerfectScrollbar
                                        options={{
                                            suppressScrollX: true,
                                        }}
                                        style={{ height: "220px" }}
                                    >

                                        {filteredSuggestions.length > 0 ? (

                                            filteredSuggestions.map((item, index) => (

                                                <div
                                                    key={index}
                                                    role="button"
                                                    className="d-flex align-items-center justify-content-between rounded-2 px-2 py-2"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        handleSearch(item.title);
                                                    }}
                                                >

                                                    <div className="d-flex align-items-center gap-3">

                                                        <FiSearch className="text-secondary" />

                                                        <small>{item.title}</small>

                                                    </div>

                                                    <small className="text-secondary">
                                                        {item.category}
                                                    </small>

                                                </div>

                                            ))

                                        ) : (

                                            <div className="text-center py-3">
                                                <small className="text-secondary">
                                                    No suggestions found
                                                </small>
                                            </div>

                                        )}

                                    </PerfectScrollbar>

                                </div>

                            )}

                        </div>

                        {showResults && search.trim().toLowerCase() !== "qc status" && (


                            <div className=" bg-white shadow rounded-4 mt-2 p-3 hm-sch-bx" >

                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <FaShoppingCart className="text-secondary" />
                                    <strong>Your Products</strong>
                                    <Badge color="light" className="text-dark">
                                        {filteredProducts.length}
                                    </Badge>
                                </div>

                                {filteredProducts.length > 0 ? (

                                    <PerfectScrollbar
                                        options={{
                                            suppressScrollX: true,
                                        }}
                                        style={{ height: "450px" }}
                                    >

                                        {filteredProducts.map((product) => (

                                            <div
                                                key={product.id}
                                                className="border rounded-4 p-3 mb-3 bg-white"
                                            >

                                                <div className="row align-items-center">

                                                    <div className="col-3 col-sm-2">

                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="img-fluid rounded-2"
                                                        />

                                                    </div>

                                                    <div className="col-9 col-sm-10">

                                                        <div className="d-flex align-items-center justify-content-between">

                                                            <div className="overflow-hidden">

                                                                <div className="d-flex align-items-center flex-wrap gap-1 mb-1">

                                                                    <strong className="text-truncate text-line mb-0 ">
                                                                        {product.name}
                                                                    </strong>

                                                                    <Badge
                                                                        color="light"
                                                                        className="text-dark"
                                                                    >

                                                                        <span className="text-success">
                                                                            <FaRupeeSign />
                                                                            {product.cost}
                                                                        </span>

                                                                        <span className="text-primary ms-2">
                                                                            <FaTag />
                                                                            ₹{product.price}
                                                                        </span>

                                                                    </Badge>

                                                                </div>

                                                                <small className="d-block text-secondary mb-1">
                                                                    SKU: {product.sku}
                                                                </small>

                                                                <small className="d-block text-secondary">
                                                                    FSN: {product.fsn}
                                                                    {" "} Stock: {product.stock} Units
                                                                </small>

                                                            </div>
                                                            <span className="small">
                                                                <Link to="/listing" className="text-decoration-none fw-bold text-st" style={{ fontSize: "10px" }}>
                                                                    Open My Listings
                                                                    <FaChevronRight className="text-primary flex-shrink-0 ms-2" />
                                                                </Link>

                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>

                                                <hr />

                                                <div className="d-flex justify-content-between align-items-center">

                                                    <div>

                                                        <small className="text-secondary">
                                                            Sales | Last 7D (03 Nov - 09 Nov)
                                                        </small>

                                                        <div className="mt-2">

                                                            <strong className="small">
                                                                ₹{product.sales} Gross Sales
                                                            </strong>

                                                            <span className="text-secondary mx-1">
                                                                •
                                                            </span>

                                                            <strong className="small">
                                                                {product.returns} Returns
                                                            </strong>

                                                        </div>

                                                    </div>

                                                    <span className="small">
                                                        <Link to="/" className="text-decoration-none fw-bold text-st" style={{ fontSize: "10px" }}>
                                                            Open Earn More
                                                            <FaChevronRight className="text-primary flex-shrink-0 ms-2" />
                                                        </Link>

                                                    </span>

                                                </div>

                                                <Collapse isOpen={!!showMore[product.id]}>

                                                    <hr />

                                                    <div className="d-flex justify-content-between align-items-center">

                                                        <div>

                                                            <small className="text-secondary">
                                                                Traffic | Last 7D ( 04 Nov - 10 Nov )
                                                            </small>

                                                            <div className="mt-2">

                                                                <strong className="small">
                                                                    ₹{product.sales} Gross Sales
                                                                </strong>

                                                                <span className="text-secondary mx-1">
                                                                    •
                                                                </span>

                                                                <strong className="small">
                                                                    {product.returns} Returns
                                                                </strong>

                                                            </div>

                                                        </div>

                                                        <span className="small">
                                                            <Link to="/" className="text-decoration-none fw-bold text-st" style={{ fontSize: "10px" }}>
                                                                Open Traffic Report
                                                                <FaChevronRight className="text-primary flex-shrink-0 ms-2" />
                                                            </Link>

                                                        </span>
                                                        <hr />



                                                    </div>

                                                    <hr />
                                                    <div className="w-100 mt-2">
                                                        <h6 className="text-secondary small mb-0">
                                                            Useful Links
                                                        </h6>
                                                        <Link to="/" className="text-st small text-decoration">
                                                            Edit Catalog
                                                        </Link>
                                                    </div>

                                                </Collapse>

                                                {/* SHOW MORE BUTTON */}
                                                <Button
                                                    color="white"
                                                    className="border w-100 mt-3 text-dark fw-semibold small"
                                                    onClick={() => toggleMore(product.id)}
                                                >

                                                    {showMore[product.id]
                                                        ? "Show Less"
                                                        : "Show More"
                                                    }

                                                    {showMore[product.id] ? (
                                                        <FaChevronUp className="ms-2" />
                                                    ) : (
                                                        <FaChevronDown className="ms-2" />
                                                    )}

                                                </Button>

                                            </div>

                                        ))}

                                    </PerfectScrollbar>

                                ) : (

                                    <div className="text-center py-5 border rounded-3">

                                        <FaBox
                                            size={30}
                                            className="text-secondary mb-3"
                                        />

                                        <h6>No products found</h6>

                                        <small className="text-secondary">
                                            Try another SKU, FSN or product name.
                                        </small>

                                    </div>

                                )}

                            </div>




                        )}

                        {showResults && search.trim().toLowerCase() === "qc status" && (

                            <div className="bg-white shadow rounded-4 mt-2 p-3 hm-sch-bx">
                                <PerfectScrollbar
                                    options={{
                                        suppressScrollX: true,
                                    }}
                                    style={{ height: "450px" }}
                                >
                                    <div className="mb-3">

                                        <small className="text-secondary">
                                            Over the last 30 days,
                                            <strong className="text-primary ms-1">
                                                <Link to="/add-single-listing">
                                                    25+ products passed QC.
                                                </Link>

                                            </strong>
                                        </small>

                                    </div>

                                    <div className="d-flex justify-content-between px-2 mb-2">

                                        <small className="text-secondary">SKU</small>

                                        <small className="text-secondary">QC Status</small>

                                        <small className="text-secondary">Improvement</small>

                                    </div>

                                    {qcProducts.map((product) => (


                                        <div
                                            key={product.id}
                                            className="d-flex align-items-center border-top py-2 gap-2"
                                        >

                                            {/* Product */}
                                            <div className="d-flex align-items-center gap-2 flex-grow-1"
                                                style={{ minWidth: 0 }}
                                            >

                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{
                                                        width: "35px",
                                                        height: "35px",
                                                        objectFit: "contain",
                                                    }}
                                                />

                                                <div style={{ minWidth: 0 }}>

                                                    <small className="d-block text-truncate fw-semibold text-line">
                                                        {product.name}
                                                    </small>

                                                    <small className="text-secondary">
                                                        {product.sku}
                                                    </small>

                                                </div>

                                            </div>

                                            <div className="flex-shrink-0">
                                                <Link to="/add-single-listing">
                                                    <Badge
                                                        color="light"
                                                        className="text-success border"
                                                    >
                                                        QC Passed
                                                    </Badge>
                                                </Link>
                                            </div>
                                            <div
                                                className="flex-grow-1 text-end"
                                                style={{ minWidth: 0 }}
                                            >
                                                <small className="text-secondary">
                                                    <Link to="/add-single-listing" className="text-dark text-decoration-none">
                                                        No improvement needed
                                                    </Link>
                                                </small>
                                            </div>
                                        </div>

                                    ))}

                                    <div className="text-start border-top pt-2">

                                        <button
                                            className="btn btn-link btn-sm text-primary p-0 text-decoration-none small"
                                            onClick={() => toggleMore("qc")}
                                        >
                                            {showMore.qc ? "Show Less" : "Show More"}
                                        </button>

                                    </div>

                                    <div className="mt-3">

                                        {/* PAGES */}
                                        <p className="small mb-0">Pages</p>

                                        <hr className="mt-2 mb-3" />

                                        <Row>
                                            <Col lg="12">

                                                <Link
                                                    to="/"
                                                    className="text-decoration-none text-dark"
                                                >

                                                    <div className="d-flex align-items-center gap-3">

                                                        <div className="text-st">
                                                            <FaList size={16} />
                                                        </div>

                                                        <div>
                                                            <h6 className="mb-1">
                                                                Add New Listings
                                                            </h6>

                                                            <p className="small text-secondary mb-0">
                                                                Track listing creation status, QC pass/fail, and fix errors.
                                                            </p>
                                                        </div>

                                                    </div>

                                                </Link>

                                            </Col>
                                        </Row>

                                        {/* HELP CENTER */}
                                        <div className="mt-4">

                                            <div className="d-flex align-items-center gap-3 mb-2">

                                                <p className="small mb-0">
                                                    Help Center
                                                </p>

                                                <Badge
                                                    color="light"
                                                    className="text-dark rounded-pill"
                                                >
                                                    3
                                                </Badge>

                                            </div>

                                            <hr className="mt-2 mb-0" />

                                            {/* HELP LINKS */}
                                            {[
                                                "What is Catalog QC Process? and How to check the status?",
                                                "What is the QC process for Flipkart Fulfilment?",
                                                "Why did my catalogue file fail QC?"
                                            ].map((item, index) => (

                                                <Link
                                                    to="/"
                                                    key={index}
                                                    className="d-flex align-items-center justify-content-between text-decoration-none text-dark py-3 border-bottom"
                                                >

                                                    <div className="d-flex align-items-center gap-3">

                                                        <FaRegFileAlt
                                                            className="text-st"
                                                            size={16}
                                                        />

                                                        <span className="small">
                                                            {item}
                                                        </span>

                                                    </div>

                                                    <FaChevronRight
                                                        className="text-primary"
                                                        size={13}
                                                    />

                                                </Link>

                                            ))}

                                        </div>

                                    </div>
                                </PerfectScrollbar>
                            </div>

                        )}
                    </div>
                </div>
            </Container>

        </section>
    );
};

export default ZozoSerach;
