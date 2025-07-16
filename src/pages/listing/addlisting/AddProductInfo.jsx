import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import ProductPhotos from './ProductPhotos';
import ProductDetails from './ProductDetails';

const AddProductInfo = () => {
  return (
    <>
      <h6 className="mb-3 fw-bold">Please fill all mandatory attributes to preview title</h6>
      <Row>
        <Col md={6}>
          <ProductPhotos />
        </Col>
        <Col md={6}>
          <ProductDetails />
        </Col>
      </Row>
    </>
  );
};

export default AddProductInfo;
