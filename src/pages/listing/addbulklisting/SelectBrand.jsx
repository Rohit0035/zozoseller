import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Row,
  FormGroup,
  InputGroup,
} from 'reactstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AddProductInfo from './AddProductInfo';

const SelectBrand = () => {
  return (
    <>
      <Row>
        {/* Left Panel */}
        <Col md={6}>
          <Card className="mb-4">
            <CardBody>
              <h5>Check for the Brand you want to sell</h5>
              <FormGroup className="gap-2 mt-3">
                <InputGroup>
                  <Input type="text" placeholder="Enter Brand Name"  style={{minWidth:'80% !important'}}/>
                <Button color="primary">Check Brand</Button>
                </InputGroup>
              
              </FormGroup>

              <div className="bg-light p-3 mt-4 border rounded d-flex align-items-center">
                <FaCheckCircle className="text-success me-2 fs-4" />
                <span>You can start selling under this brand</span>
              </div>

              <Button className="mt-2 btn-primary btn-sm">
                Create new listing
              </Button>

              <div className="text-center my-3">
                <span className="badge bg-secondary">OR</span>
              </div>

              <p>Select one of your recently used brands from below</p>
              <Link className="text-primary fw-bold text-decoration-none">TUCUTE</Link>
            </CardBody>
          </Card>
        </Col>

        {/* Right Panel */}
        <Col md={6}>
          <Card>
            <CardBody>
              <h5>Basic brand name guidelines to follow</h5>
              <p className="text-muted">Use this quick guide to avoid brand name violation</p>

              <Card className="mb-3">
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <strong>Check the correct spelling</strong>
                      <p className="text-danger mb-1">
                        <FaTimesCircle className="me-1" /> AAdidass
                      </p>
                      <p className="text-success">
                        <FaCheckCircle className="me-1" /> Adidas
                      </p>
                    </Col>
                    <Col md={6}>
                      <strong>Use full forms</strong>
                      <p className="text-danger mb-1">
                        <FaTimesCircle className="me-1" /> CK
                      </p>
                      <p className="text-success">
                        <FaCheckCircle className="me-1" /> Calvin Klein
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <strong>Avoid extra details</strong>
                  <Row>
                    <Col md={4}>
                      <p className="text-muted mb-1">Vertical name</p>
                      <p className="text-danger mb-1">
                        <FaTimesCircle className="me-1" /> Nike Shoes
                      </p>
                      <p className="text-success">
                        <FaCheckCircle className="me-1" /> Nike
                      </p>
                    </Col>
                    <Col md={4}>
                      <p className="text-muted mb-1">Product series</p>
                      <p className="text-danger mb-1">
                        <FaTimesCircle className="me-1" /> Apple Iphones
                      </p>
                      <p className="text-success">
                        <FaCheckCircle className="me-1" /> Apple
                      </p>
                    </Col>
                    <Col md={4}>
                      <p className="text-muted mb-1">Product description</p>
                      <p className="text-danger mb-1">
                        <FaTimesCircle className="me-1" /> Sandisk 32GB
                      </p>
                      <p className="text-success">
                        <FaCheckCircle className="me-1" /> Sandisk
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SelectBrand;
