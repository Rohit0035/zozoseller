// FBFStatusCard.jsx (Expected Update)

import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import { BiRocket, BiBoltCircle, BiRupee } from "react-icons/bi";
import { FaStore } from "react-icons/fa";

// Accept the stats as props
const FullfillByZozokartStatusCard = ({
  totalOrders15Days = 0,
  delivered7Days = 0,
  delivered3Days = 0,
  totalValue = 0
}) => {
  // Helper function to format currency (copied from previous response)
  const formatCurrency = value => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="border rounded-3 shadow-sm ">
      <CardBody className="d-flex align-items-center gap-4 flex-wrap bg-info bg-opacity-10 py-2 px-3">
        <div className="d-flex align-items-center gap-3">
          <FaStore size={30} color="#ffcc00" />
          <div>
            <div className="fw-bold">
              {totalOrders15Days} Fullfill by Zozokart Orders received
            </div>
            <small className="text-muted">in last 15 days</small>
          </div>
        </div>

        <div className="vr d-none d-md-block" />

        <Row className="flex-grow-1 text-center text-md-start">
          <Col
            md="4"
            className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start"
          >
            <BiRocket size={20} className="text-success" />
            <span className="text-muted">
              {delivered7Days} orders delivered in last 7 days
            </span>
          </Col>
          <Col
            md="4"
            className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start"
          >
            <BiBoltCircle size={20} className="text-success" />
            <span className="text-muted">
              {delivered3Days} orders delivered in last 3 days
            </span>
          </Col>
          <Col
            md="4"
            className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start"
          >
            <BiRupee size={20} className="text-success" />
            <span className="text-muted">
              Total order value: {formatCurrency(totalValue)}
            </span>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

// If you kept the export name FBFStatusCard, use this:
export default FullfillByZozokartStatusCard;
