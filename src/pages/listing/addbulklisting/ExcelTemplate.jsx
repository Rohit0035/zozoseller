import React from 'react';
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { FaFileExcel, FaUpload } from 'react-icons/fa';

const ExcelTemplate = () => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Uploaded file: ${file.name}`);
      // Actual upload logic goes here
    }
  };

  return (
    <>
     {/* <h6 className="fw-bold mb-3">Create Your Catalog</h6> */}

      <Row className="justify-content-center align-items-center">
        <Col md="5" className="border p-4 text-center">
          <FaFileExcel size={24} className="mb-2 text-primary" />
          <p className="mb-2">Download the excel template to add your product details</p>
          <Button color="outline-primary">Download</Button>
        </Col>

        <Col md="1" className="text-center">
          <span>&rarr;</span>
        </Col>

        <Col md="5" className="border p-4 text-center">
          <FaUpload size={24} className="mb-2 text-primary" />
          <p className="mb-2">Upload the filled excel file with your product details</p>
          <div className="d-flex justify-content-center">
            <label className="btn btn-primary mb-0">
              Upload
              <Input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleUpload}
                hidden
              />
            </label>
          </div>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col className="text-center text-muted">
          <small>The QC process will start after the upload of your catalog.</small>
        </Col>
      </Row>
    </>
  );
};

export default ExcelTemplate;
