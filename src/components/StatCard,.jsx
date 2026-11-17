
import React from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledTooltip
} from "reactstrap";

import {
  FaShoppingCart,
  FaBoxes,
  FaChartLine,
  FaClipboardList,
  FaStore,
  FaEye
} from "react-icons/fa";

const StatCard = ({ title, value, tooltip, icon: Icon, id, color, lightBg }) => {
  return (
    <Card
      className="h-100 shadow-sm mb-2 bg-light"
      style={{
        // borderRadius: "14px",
        borderRight: `1px solid ${color}`,
      }}
    >
      <CardBody className="p-3">
        <div className="d-flex justify-content-between align-items-center">

          <div>
            <h6
              className="text-uppercase fw-semibold text-secondary mb-2"
              style={{
                fontSize: "12px",
                letterSpacing: "0.6px"
              }}
            >
              {title}
            </h6>

            <h2
              className="fw-bold mb-2"
              style={{
                color: "#183B65",
                fontSize: "30px",
                lineHeight: "1.3"
              }}
            >
              {value ?? 0}
            </h2>

            {/* <div className="d-flex align-items-center gap-1">
              <span
                className="rounded-circle"
                style={{
                  width: "7px",
                  height: "7px",
                  background: color
                }}
              />

              <small className="text-muted">
                View details
              </small>
            </div> */}
          </div>

          <div
            id={id}
            className="rounded-3 d-flex align-items-center justify-content-center"
            style={{
              width: "54px",
              height: "54px",
              backgroundColor: lightBg,
              color: color,
              fontSize: "23px",
              cursor: "pointer"
            }}
          >
            <Icon />
          </div>

          <UncontrolledTooltip placement="top" target={id}>
            {tooltip}
          </UncontrolledTooltip>

        </div>
      </CardBody>
    </Card>
  );
};

const StatsCards = ({ dashboardData }) => {
  return (
    <div className="mt-4">
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-6 g-1">
        <Col className="mt-0 mb-2">
          <StatCard
            id="impressions"
            icon={FaEye}
            tooltip="Impressions"
            title="Impressions"
            value={1250}
            Dotbg="#073B8A"
            color="#073B8A"
            lightBg="#EAF1FC"
          />
        </Col>

        <Col className="mt-0 mb-2">
          <StatCard
            id="todayOrders"
            icon={FaShoppingCart}
            tooltip="Today's orders"
            title="Today's Orders"
            value={dashboardData?.todayOrders}
            Dotbg="#073B8A"
            color="#073B8A"
            lightBg="#EAF1FC"
          />
        </Col>

        <Col className="mt-0 mb-2">
          <StatCard
            id="unitsTooltip"
            icon={FaBoxes}
            tooltip="Total units sold"
            title="Units Sold"
            value={dashboardData?.unitsSold}
            Dotbg="#E3A008"
            color="#073B8A"
            lightBg="#EAF1FC"
          />
        </Col>

        <Col className="mt-0 mb-2">
          <StatCard
            id="salesTooltip"
            icon={FaChartLine}
            tooltip="Total revenue from sales"
            title="Sales"
            value={dashboardData?.sales}
            Dotbg="#198754"
            color="#073B8A"
            lightBg="#EAF1FC"
          />
        </Col>

        <Col className="mt-0 mb-2">
          <StatCard
            id="ordersTooltip"
            icon={FaClipboardList}
            tooltip="Number of new orders"
            title="New Orders"
            value={dashboardData?.newOrders}
            Dotbg="#0D9488"
            color="#073B8A"
            lightBg="#EAF1FC"
          />
        </Col>

        <Col className="mt-0 mb-2">
          <StatCard
            id="listingsTooltip"
            icon={FaStore}
            tooltip="Currently active listings"
            title="Active Listings"
            value={dashboardData?.activeListings}
            Dotbg="#DC3545"
            color="#073B8A"
            lightBg="#EAF1FC"
          />
        </Col>

      </Row>
    </div>
  );
};

export default StatsCards;
