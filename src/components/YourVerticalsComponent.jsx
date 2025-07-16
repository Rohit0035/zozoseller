import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

const YourVerticalsComponent = ({ data, onSelectCategory }) => {
  return (
    <div className="p-3">
      <h5 className="mb-3">Your Verticals</h5>
      <Row>
        {Object.keys(data).map((category) => (
          <Col md="3" sm="6" xs="12" key={category} className="mb-3">
            <Card className="category-card" onClick={() => onSelectCategory(category)}>
              <CardBody className="text-center">
                <strong>{category}</strong>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default YourVerticalsComponent;
