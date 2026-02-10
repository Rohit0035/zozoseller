import React from "react";
import { Row, Col } from "reactstrap";
import BulkUploadProducts from "./BulkUploadProducts";

const AddProductInfo = ({ listingData, onListingDataChange }) => {
  return (
    <Row>
      <Col md="12">
        <h5 className="fw-bold mb-3">Upload Products in Bulk</h5>

        <BulkUploadProducts
          listingData={listingData}
          onListingDataChange={onListingDataChange}
        />
      </Col>
    </Row>
  );
};

export default AddProductInfo;
