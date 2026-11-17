
import React, { useState } from "react";
import {
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Button,
    Input,
    Alert,
    Table
} from "reactstrap";

import {
    FiInfo,
    FiEdit2,
    FiX,
    FiChevronRight
} from "react-icons/fi";

const RecommendationAdsrightbar = ({ isOpen, toggle }) => {
    const [showReview, setShowReview] = useState(false);
    const [budget, setBudget] = useState("300");
    const [bid, setBid] = useState("4.9");
    const [editBudget, setEditBudget] = useState(false);
    const [editBid, setEditBid] = useState(false);

    return (
        <Offcanvas
            isOpen={isOpen}
            toggle={toggle}
            direction="end"
            style={{ width: "600px", maxWidth: "100%" }}
        >

            <OffcanvasHeader className="border-bottom py-3">
                <div className="d-flex align-items-center justify-content-between ">

                    <div className="small">
                        <h6 className="mb-1">
                            Boost your sales (Recommendation campaigns)
                        </h6>

                        <p className="text-muted small mb-0">
                            Choose the products you want to run ads on
                        </p>
                    </div>

                    <button
                        className="btn border-0 p-0 ms-3"
                        onClick={toggle}
                    >
                        <FiX size={20} />
                    </button>

                </div>
            </OffcanvasHeader>

            <OffcanvasBody className="d-flex flex-column p-3">

                <Alert
                    color="light"
                    className="border border-primary rounded-3 d-flex align-items-center gap-3 py-3"
                >
                    <FiInfo className="text-st" size={20} />
                    <span className="small fw-semibold">
                        Maximize sales for your best performing products with targeted ads
                    </span>
                </Alert>

                <div className="border rounded-2 p-3">

                    <div className="d-flex align-items-center justify-content-between">

                        <div className="d-flex align-items-center gap-2">
                            <Input type="checkbox" defaultChecked />

                            <div
                                className="border rounded bg-light d-flex align-items-center justify-content-center"
                                style={{ width: 42, height: 42 }}
                            >
                                <span>👜</span>
                            </div>

                            <div>
                                <h6 className="mb-1">
                                    Luggage And Accessories
                                </h6>
                                <div className="small text-muted">
                                    Listings: 2
                                    <span className="ms-3">
                                        Daily Budget: ₹{budget}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            color="light"
                            outline
                            size="sm"
                            className="text-st"
                            onClick={() => setShowReview(!showReview)}
                        >
                            <FiEdit2 className="me-1" />
                            Review
                        </Button>

                    </div>

                    {showReview && (
                        <div className="mt-3">

                            <div className="d-flex align-items-center gap-2 small mb-3">
                                <span>Daily Budget: ₹</span>

                                {editBudget ? (
                                    <Input
                                        type="number"
                                        bsSize="sm"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        style={{ width: 85 }}
                                    />
                                ) : (
                                    <strong>{budget}</strong>
                                )}

                                <FiEdit2
                                    role="button"
                                    onClick={() => setEditBudget(!editBudget)}
                                />
                            </div>

                            <p className="text-muted small">
                                *Please select atleast one listing from any adgroup to launch the campaign
                            </p>

                            <Table bordered responsive className="mb-2 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="small text-muted">Product</th>
                                        <th className="small text-muted">Bid</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <Input
                                                    type="checkbox"
                                                    defaultChecked
                                                />

                                                <span className="text-st small">
                                                    Luggage
                                                </span>

                                                <FiChevronRight className="text-st" />
                                            </div>
                                        </td>

                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {editBid ? (
                                                    <Input
                                                        type="number"
                                                        bsSize="sm"
                                                        step="0.1"
                                                        value={bid}
                                                        onChange={(e) => setBid(e.target.value)}
                                                        style={{ width: 80 }}
                                                    />
                                                ) : (
                                                    <span className="small">₹{bid}</span>
                                                )}

                                                <FiEdit2
                                                    role="button"
                                                    onClick={() => setEditBid(!editBid)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-end gap-2">
                                <Button color="primary" size="sm">
                                    Save
                                </Button>

                                <Button
                                    color="secondary"
                                    outline
                                    size="sm"
                                    onClick={() => setShowReview(false)}
                                >
                                    Cancel
                                </Button>
                            </div>

                        </div>
                    )}

                </div>

                <div className="mt-auto pt-3 d-flex justify-content-end">
                    <Button color="primary">
                        Launch 1 Campaign
                    </Button>
                </div>

            </OffcanvasBody>
        </Offcanvas>
    );
};

export default RecommendationAdsrightbar;
