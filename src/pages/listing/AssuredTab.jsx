
import React, { useState } from "react";

import {
    Row,
    Col,
    Card,
    CardBody,
    Badge,
    Button,
    ButtonGroup,
    Progress
} from "reactstrap";

import {
    FiShield,
    FiInfo
} from "react-icons/fi";


const AssuredTab = () => {

    const [activeCriteria, setActiveCriteria] = useState("listing");

    const assuredData = {

        status: "Not-Satisfied",

        fulfillment: "Seller Only",

        listingLevel: {
            count: "4/4",

            criteria: [
                {
                    title: "Listing Quality",
                    value: "Good",
                    color: "success"
                },
                {
                    title: "Listing Rating",
                    value: "NA",
                    color: "secondary"
                },
                {
                    title: "Product Rating",
                    value: "NA",
                    color: "secondary"
                },
                {
                    title: "DDMM Returns",
                    value: "NA",
                    color: "secondary"
                }
            ]
        },

        sellerLevel: {
            count: "3/4",

            fbf: {
                title: "Listings in FBF",
                status: "Not Satisfied",

                criteria: [
                    {
                        title: "Seller Score",
                        value: "NA",
                        type: "score"
                    }
                ]
            },

            nonFbf: {
                title: "Listings not in FBF",
                status: "Not Satisfied",

                criteria: [
                    {
                        title: "Scale of Business",
                        value: 31,
                        max: 50,
                        unit: "Units",
                        type: "scale"
                    },
                    {
                        title: "Seller Score",
                        value: "NA",
                        type: "score"
                    },
                    {
                        title: "30D Seller Cancellations",
                        value: 0,
                        max: 1.5,
                        unit: "%",
                        type: "percentage"
                    },
                    {
                        title: "90D Seller Cancellations",
                        value: 0,
                        max: 1.5,
                        unit: "%",
                        type: "percentage"
                    }
                ]
            }
        }
    };


    const CriteriaCard = ({ item }) => {

        return (

            <Card className="border rounded-4 shadow-none h-100">

                <CardBody className="p-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <span className="small">
                            {item.title}
                        </span>

                        <FiInfo
                            size={13}
                            className="text-secondary"
                        />

                    </div>

                    <hr className="my-2" />

                    {item.type === "score" && (

                        <div className="bg-light rounded-3 text-center p-3">

                            <span className="small">
                                {item.value}
                            </span>

                        </div>

                    )}


                    {item.type === "scale" && (

                        <div className="pt-2">

                            <div className="text-center mb-2">

                                <Badge color="danger">
                                    {item.value} {item.unit}
                                </Badge>

                            </div>

                            <div className="d-flex justify-content-between align-items-center">

                                <small className="text-secondary">
                                    0
                                </small>

                                <div className="flex-grow-1 mx-2">

                                    <Progress
                                        value={(item.value / item.max) * 100}
                                        color="danger"
                                        style={{ height: "5px" }}
                                    />

                                </div>

                                <small className="text-secondary">
                                    {item.max}
                                </small>

                            </div>

                        </div>

                    )}


                    {item.type === "percentage" && (

                        <div className="pt-2">

                            <div className="text-center mb-2">

                                <Badge color="success">
                                    {item.value} {item.unit}
                                </Badge>

                            </div>

                            <div className="d-flex justify-content-between align-items-center">

                                <small className="text-secondary">
                                    0
                                </small>

                                <div className="flex-grow-1 mx-2">

                                    <Progress
                                        value={
                                            item.max > 0
                                                ? (item.value / item.max) * 100
                                                : 0
                                        }
                                        color="success"
                                        style={{ height: "5px" }}
                                    />

                                </div>

                                <small className="text-secondary">
                                    {item.max}%
                                </small>

                            </div>

                        </div>

                    )}


                    {!item.type && (

                        <div className="text-center py-2">

                            <Badge color={item.color}>
                                {item.value}
                            </Badge>

                        </div>

                    )}

                </CardBody>

            </Card>

        );

    };


    return (

        <div className="bg-light rounded-3 p-3">


            <Row className="align-items-center g-3 mb-4">

                <Col xs="12" md="5">

                    <div className="d-flex align-items-center flex-wrap gap-2">

                        <FiShield
                            size={18}
                            className="text-primary"
                        />

                        <span className="fw-semibold">
                            'F-Assured' Criteria
                        </span>

                        <Badge color="danger">
                            {assuredData.status}
                        </Badge>

                    </div>

                    <div className="small mt-2">
                        (Fulfillment By: {assuredData.fulfillment})
                    </div>

                </Col>


                <Col xs="12" md="7">

                    <ButtonGroup className="w-100">

                        <Button
                            color="light"
                            className={
                                activeCriteria === "listing"
                                    ? "border-primary bg-primary-subtle"
                                    : "border bg-white"
                            }
                            onClick={() => setActiveCriteria("listing")}
                        >

                            <span className="small">
                                Listing-level Criteria
                            </span>

                            <Badge color="secondary" className="ms-2">
                                {assuredData.listingLevel.count}
                            </Badge>

                        </Button>


                        <Button
                            color="light"
                            className={
                                activeCriteria === "seller"
                                    ? "border-primary bg-primary-subtle"
                                    : "border bg-white"
                            }
                            onClick={() => setActiveCriteria("seller")}
                        >

                            <span className="small">
                                Seller-level Criteria
                            </span>

                            <Badge color="secondary" className="ms-2">
                                {assuredData.sellerLevel.count}
                            </Badge>

                        </Button>

                    </ButtonGroup>

                </Col>

            </Row>


            {activeCriteria === "listing" && (

                <Row className="g-3">

                    {assuredData.listingLevel.criteria.map((item, index) => (

                        <Col xs="12" sm="6" lg="4" key={index}>

                            <CriteriaCard item={item} />

                        </Col>

                    ))}

                </Row>

            )}


            {activeCriteria === "seller" && (

                <>

                    <div className="mb-4">

                        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">

                            <span className="small fw-semibold">
                                {assuredData.sellerLevel.fbf.title}
                            </span>

                            <Badge color="danger">
                                {assuredData.sellerLevel.fbf.status}
                            </Badge>

                        </div>


                        <Row className="g-3">

                            {assuredData.sellerLevel.fbf.criteria.map(
                                (item, index) => (

                                    <Col xs="12" sm="6" lg="4" key={index}>

                                        <CriteriaCard item={item} />

                                    </Col>

                                )
                            )}

                        </Row>

                    </div>


                    <div>

                        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">

                            <span className="small fw-semibold">
                                {assuredData.sellerLevel.nonFbf.title}
                            </span>

                            <Badge color="danger">
                                {assuredData.sellerLevel.nonFbf.status}
                            </Badge>

                        </div>


                        <Row className="g-3">

                            {assuredData.sellerLevel.nonFbf.criteria.map(
                                (item, index) => (

                                    <Col xs="12" sm="6" lg="4" key={index}>

                                        <CriteriaCard item={item} />

                                    </Col>

                                )
                            )}

                        </Row>

                    </div>

                </>

            )}

        </div>

    );

};

export default AssuredTab;
