import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledTooltip
} from 'reactstrap';
import { FaInfoCircle } from 'react-icons/fa';

const StatCard = ({ title, value, tooltip, icon: Icon, id, color }) => {
  return (
    <Card className={`text-white ${color} mb-2`} style={{ border: 'none', borderRadius: '10px' }}>
      <CardBody>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-uppercase" style={{ fontSize: '13px' }}>{title}</h6>
            <h3 className="fw-bold">{value}</h3>
          </div>
          <div id={id} className="fs-3" style={{ cursor: 'pointer' }}>
            <Icon />
          </div>
        </div>
        <UncontrolledTooltip placement="top" target={id}>
          {tooltip}
        </UncontrolledTooltip>
      </CardBody>
    </Card>
  );
};

const StatsCards = () => {
  return (
    <div className="mt-4">
      <Row>
        <Col md="6" xl="3">
          <StatCard
            id="unitsTooltip"
            color="bg-primary"
            icon={FaInfoCircle}
            tooltip="Total units sold"
            title="Units Sold"
            value="₹ 0"
          />
        </Col>
        <Col md="6" xl="3">
          <StatCard
            id="salesTooltip"
            color="bg-success"
            icon={FaInfoCircle}
            tooltip="Total revenue from sales"
            title="Sales"
            value="0"
          />
        </Col>
        <Col md="6" xl="3">
          <StatCard
            id="ordersTooltip"
            color="bg-warning"
            icon={FaInfoCircle}
            tooltip="Number of new orders"
            title="New Orders"
            value="0"
          />
        </Col>
        <Col md="6" xl="3">
          <StatCard
            id="listingsTooltip"
            color="bg-danger"
            icon={FaInfoCircle}
            tooltip="Currently active listings"
            title="Active Listings"
            value="0"
          />
        </Col>
      </Row>
    </div>
  );
};

export default StatsCards;
