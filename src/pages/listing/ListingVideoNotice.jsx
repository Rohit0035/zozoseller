
import React, { useState } from "react";
import { Card, CardBody, Button } from "reactstrap";
import { FaRegPlayCircle, FaArrowRight } from "react-icons/fa";
import AddListingVideoOffcanvas from "./AddListingVideoOffcanvas";

const ListingVideoNotice = () => {
    const [videoOpen, setVideoOpen] = useState(false);
    return (
        <>
            <Card
                className="border-0 rounded-3 mb-3 mt-1 bg-light"

            >
                <CardBody className="px-3 py-2">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2">

                        <div className="d-flex align-items-start align-items-md-center flex-wrap gap-2 flex-grow-1">

                            <FaRegPlayCircle
                                size={22}
                                className="text-st flex-shrink-0"
                            />

                            <span
                                className="badge bg-primary"
                                style={{ fontSize: "11px" }}
                            >
                                New
                            </span>

                            <span className="text-secondary" style={{ fontSize: "12px" }}>
                                Increase sale and minimise returns by adding listing videos.
                                Click the video icon next to any listing to upload your video.
                            </span>
                        </div>

                        <Button
                            color="link"
                            onClick={() => setVideoOpen(true)}

                            className="text-st text-decoration-none p-0 fw-semibold d-flex align-items-center gap-2 flex-shrink-0"
                            style={{ fontSize: "12px" }}
                        >
                            Add Listing Video
                            <FaArrowRight size={13} className="d-md-none" />
                        </Button>

                    </div>
                </CardBody>
            </Card>
            {/* Listing video right offcanvas */}
            <AddListingVideoOffcanvas
                isOpen={videoOpen}
                toggle={() => setVideoOpen(false)}
            />
        </>

    );
};

export default ListingVideoNotice;
