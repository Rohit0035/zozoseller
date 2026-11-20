
import React, { useState } from "react";

import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Nav,
    NavItem,
    NavLink,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
    Input,
    FormGroup
} from "reactstrap";

import {
    FiInfo,
    FiChevronLeft,
    FiChevronRight,
    FiStar,
    FiShield,
    FiPackage
} from "react-icons/fi";


const QualityTab = () => {

    // Review tab state
    const [activeReviewTab, setActiveReviewTab] = useState("negative");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);


    // Demo Listing Quality Data
    const qualityData = {
        listingQuality: "Good",
        listingAssured: "Yes",
        listingRating: "NaN",
        allReturns: "Not Enough Orders Delivered"
    };


    // Demo Customer Reviews
    const reviews = {
        negative: [
            {
                product: "ZZOZO KART Duffel Bag",
                customer: "Customer 01",
                rating: 2,
                comment: "Product quality needs improvement",
                date: "15-Nov-2026"
            },
            {
                product: "ZZOZO KART Travel Bag",
                customer: "Customer 02",
                rating: 1,
                comment: "Packaging was not satisfactory",
                date: "14-Nov-2026"
            },
            {
                product: "ZZOZO KART Backpack",
                customer: "Customer 03",
                rating: 2,
                comment: "Product description could be better",
                date: "12-Nov-2026"
            }
        ],

        positive: [
            {
                product: "ZZOZO KART Duffel Bag",
                customer: "Customer 04",
                rating: 5,
                comment: "Good product quality",
                date: "16-Nov-2026"
            },
            {
                product: "ZZOZO KART Travel Bag",
                customer: "Customer 05",
                rating: 4,
                comment: "Good design and finishing",
                date: "13-Nov-2026"
            },
            {
                product: "ZZOZO KART Backpack",
                customer: "Customer 06",
                rating: 5,
                comment: "Excellent product",
                date: "11-Nov-2026"
            }
        ]
    };


    // Active reviews
    const activeReviews = reviews[activeReviewTab];


    // Pagination calculations
    const totalPages = Math.max(
        1,
        Math.ceil(activeReviews.length / itemsPerPage)
    );

    const paginatedReviews = activeReviews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    // Change review tab
    const changeReviewTab = (tab) => {
        setActiveReviewTab(tab);
        setCurrentPage(1);
    };


    return (

        <div>

            {/* ================= QUALITY SUMMARY ================= */}

            <Card className="border rounded-3 shadow-none mb-4">

                <CardBody className="p-3">

                    <Row className="g-2 align-items-center">

                        {/* Listing Quality */}
                        <Col xs="12" md="4">

                            <div className="small fw-semibold">
                                Listing Quality
                            </div>

                            <div className="text-primary fs-5">
                                {qualityData.listingQuality}
                            </div>

                        </Col>


                        {/* Other Quality Details */}
                        <Col xs="12" md="8">

                            <Row className="g-2">

                                {/* Listing Assured */}
                                <Col xs="12" sm="4">

                                    <div className="bg-light rounded-3 p-2 h-100">

                                        <div className="small text-secondary d-flex align-items-center gap-1">

                                            Listing
                                            <FiShield className="text-primary" />
                                            Assured

                                        </div>

                                        <div className="fs-5">
                                            {qualityData.listingAssured}
                                        </div>

                                    </div>

                                </Col>


                                {/* Listing Rating */}
                                <Col xs="12" sm="4">

                                    <div className="bg-light rounded-3 p-2 h-100">

                                        <div className="small text-secondary d-flex align-items-center gap-1">

                                            Listing Rating
                                            <FiInfo />

                                        </div>

                                        <div className="fs-5">
                                            {qualityData.listingRating}
                                        </div>

                                    </div>

                                </Col>


                                {/* All Returns */}
                                <Col xs="12" sm="4">

                                    <div className="bg-light rounded-3 p-2 h-100">

                                        <div className="small text-secondary d-flex align-items-center gap-1">

                                            All Returns
                                            <FiInfo />

                                        </div>

                                        <div className="fs-6">
                                            {qualityData.allReturns}
                                        </div>

                                    </div>

                                </Col>

                            </Row>

                        </Col>

                    </Row>

                </CardBody>

            </Card>



            {/* ================= QUALITY MESSAGE ================= */}

            <div className="small text-secondary mb-4">

                Improve this listing's quality to Excellent to further
                increase its search visibility & sales

            </div>


            <hr className="my-3" />



            {/* ================= CUSTOMER REVIEW TABS ================= */}

            <Nav tabs className="mb-2">

                <NavItem>

                    <NavLink
                        href="#"
                        active={activeReviewTab === "negative"}
                        onClick={(e) => {
                            e.preventDefault();
                            changeReviewTab("negative");
                        }}
                    >
                        Negative Customer Reviews
                    </NavLink>

                </NavItem>


                <NavItem>

                    <NavLink
                        href="#"
                        active={activeReviewTab === "positive"}
                        onClick={(e) => {
                            e.preventDefault();
                            changeReviewTab("positive");
                        }}
                    >
                        Positive Customer Reviews
                    </NavLink>

                </NavItem>

            </Nav>



            {/* ================= REVIEWS TABLE ================= */}

            <Card className="border-0 rounded-0 shadow-none">

                <CardBody className="p-0">

                    {activeReviews.length > 0 ? (

                        <div className="table-responsive">

                            <Table
                                hover
                                responsive
                                className="mb-0 align-middle"
                            >

                                <thead className="table-light">

                                    <tr>
                                        <th>Product</th>
                                        <th>Customer</th>
                                        <th>Rating</th>
                                        <th>Review</th>
                                        <th>Date</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {paginatedReviews.map((review, index) => (

                                        <tr key={index}>

                                            <td>
                                                {review.product}
                                            </td>

                                            <td>
                                                {review.customer}
                                            </td>

                                            <td className="text-nowrap">

                                                <FiStar className="text-warning me-1" />

                                                {review.rating}/5

                                            </td>

                                            <td>
                                                {review.comment}
                                            </td>

                                            <td className="text-nowrap">
                                                {review.date}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </Table>

                        </div>

                    ) : (


                        /* ================= EMPTY STATE ================= */

                        <div className="bg-light text-center p-4 p-md-5">

                            <div className="d-flex justify-content-center mb-4">

                                <div className="position-relative p-3">

                                    <FiPackage
                                        size={90}
                                        className="text-secondary opacity-50"
                                    />

                                    <span className="position-absolute top-0 end-0">

                                        <FiInfo
                                            size={36}
                                            className="text-primary bg-white rounded-circle"
                                        />

                                    </span>

                                </div>

                            </div>

                            <div className="fw-semibold fs-5">

                                Unable to fetch details, re-check in 48 hours

                            </div>

                        </div>

                    )}

                </CardBody>

            </Card>



            {/* ================= PAGINATION ================= */}

            <Row className="align-items-center justify-content-between g-2 py-3">

                {/* Previous / Next */}
                <Col xs="12" sm="6">

                    <Pagination className="mb-0">

                        <PaginationItem disabled={currentPage === 1}>

                            <PaginationLink
                                onClick={() =>
                                    setCurrentPage(prev =>
                                        Math.max(1, prev - 1)
                                    )
                                }
                            >
                                <FiChevronLeft />
                            </PaginationLink>

                        </PaginationItem>


                        <PaginationItem active>

                            <PaginationLink>
                                {currentPage}
                            </PaginationLink>

                        </PaginationItem>


                        <PaginationItem disabled={currentPage >= totalPages}>

                            <PaginationLink
                                onClick={() =>
                                    setCurrentPage(prev =>
                                        Math.min(totalPages, prev + 1)
                                    )
                                }
                            >
                                <FiChevronRight />
                            </PaginationLink>

                        </PaginationItem>

                    </Pagination>

                </Col>



                {/* Items Per Page */}
                <Col
                    xs="12"
                    sm="6"
                    className="d-flex justify-content-sm-end"
                >

                    <FormGroup className="mb-0 d-flex align-items-center gap-2">

                        <span className="small text-secondary text-nowrap">
                            Items / page
                        </span>

                        <Input
                            type="select"
                            bsSize="sm"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >

                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>

                        </Input>

                    </FormGroup>

                </Col>

            </Row>

        </div>

    );

};

export default QualityTab;
