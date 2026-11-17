
import React, { useState } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { FaBullhorn, FaArrowRight } from "react-icons/fa";
import RecommendationAdsrightbar from "./RecommendationAdsrightbar";

const AdsRecommendation = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Card
                className="border-0 rounded-3 mb-3 bg-light"
            >
                <CardBody className="p-3">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">

                        <div className="flex-grow-1 w-100">

                            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                <FaBullhorn size={12} className="text-st" />

                                <span className="text-st fw-semibold" style={{ fontSize: "11px" }}>
                                    Ads Recommendation
                                </span>

                                <span className="text-muted" style={{ fontSize: "12px" }}>
                                    Best quality products curated to deliver assured ROI
                                </span>
                            </div>

                            <div className="fw-semibold text-dark" style={{ fontSize: "12px" }}>
                                1 New Boost Sale Recommendations like Luggage And Accessories
                            </div>
                        </div>

                        <div className="d-flex justify-content-start justify-content-md-end w-100 w-md-auto">
                            <Button
                                color="link"
                                onClick={() => setIsOpen(true)}
                                className="text-st text-decoration-none p-0 d-flex align-items-center gap-2 fw-semibold"
                                style={{ fontSize: "12px", whiteSpace: "nowrap" }}
                            >
                                Review &amp; Launch
                                <FaArrowRight size={15} />
                            </Button>
                        </div>

                    </div>
                </CardBody>
            </Card>
            <RecommendationAdsrightbar
                isOpen={isOpen}
                toggle={() => setIsOpen(false)}
            />
        </>

    );
};

export default AdsRecommendation;
