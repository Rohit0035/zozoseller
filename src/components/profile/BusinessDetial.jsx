import React, { useState } from 'react';
import {
  Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaCheckCircle, FaEdit, FaChevronRight } from 'react-icons/fa';

const BusinessDetial = () => {
  const [modal, setModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const toggle = () => setModal(!modal);

  const [businessData, setBusinessData] = useState({
    businessName: 'AZSM ENTERPRISES',
    tan: 'Not Available',
    gstin: '07BXOPM8831M1ZN',
    address: 'AZSM ENTERPRISES, TAJPUR PAHARI, BADARPUR',
    signature: 'Done',
    businessType: 'Proprietorship',
    pan: 'BXOPM8831M',
    addressProof: 'Not Available',
    state: 'Delhi',
  });

  return (
    <Row className="g-3">
      {/* Business Details Card */}
      <Col md="4">
        <Card className="h-100 bg-light shadow-sm border-0">
          <CardBody>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h6 className="fw-bold">Business Details</h6>
              <Button color="link" className="p-0" onClick={toggle}><FaEdit size={14} /> EDIT</Button>
            </div>
            <small className="text-muted">Business Name</small>
            <p className="mb-2">{businessData.businessName} <FaCheckCircle className="text-success ms-1" /></p>

            <small className="text-muted">TAN</small>
            <p className="mb-2">{businessData.tan}</p>

            <small className="text-muted">GSTIN / Provisional ID Number</small>
            <p className="mb-2">{businessData.gstin} <FaCheckCircle className="text-success ms-1" /></p>

            <small className="text-muted">Registered business address</small>
            <p className="mb-2">{businessData.address}</p>

            {showMore && (
              <>
                <small className="text-muted">Signature</small>
                <p className="mb-2">{businessData.signature} <FaCheckCircle className="text-success ms-1" /></p>

                <small className="text-muted">Business Type</small>
                <p className="mb-2">{businessData.businessType}</p>

                <small className="text-muted">PAN</small>
                <p className="mb-2">{businessData.pan} <FaCheckCircle className="text-success ms-1" /></p>

                <small className="text-muted">Address Proof</small>
                <p className="mb-2">{businessData.addressProof}</p>

                <small className="text-muted">State</small>
                <p className="mb-2">{businessData.state}</p>
              </>
            )}

            <div
              className="border-top pt-2 text-primary"
              style={{ cursor: 'pointer', fontSize: '14px' }}
              onClick={() => setShowMore(prev => !prev)}
            >
              {showMore ? 'Less' : 'More'}
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Bank Details Card */}
      <Col md="4">
        <Card className="h-100 bg-light shadow-sm border-0">
          <CardBody>
            <h6 className="fw-bold mb-2">Bank Details</h6>
            <p className="mb-3">
              As a part of manage profile improvement, bank details are moved to new page,
              click below button to go to bank details.
            </p>
            <Button color="link" className="p-0 text-primary" style={{ fontSize: '14px' }}>
              Go to Bank Details
            </Button>
          </CardBody>
        </Card>
      </Col>

      {/* GST Details Card */}
      <Col md="4">
        <Card className="h-100 bg-light shadow-sm border-0">
          <CardBody>
            <h6 className="fw-bold mb-3">GST Details</h6>
            <div className="border rounded p-2 d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold text-success d-flex align-items-center">
                  Verification Status <FaCheckCircle className="ms-2" />
                </div>
                <small className="text-muted">All GSTINs verifications are complete</small>
              </div>
              <FaChevronRight className="text-muted" />
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Modal for Editing Business Details */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Business Details</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Business Name</Label>
              <Input value={businessData.businessName} onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>TAN</Label>
              <Input value={businessData.tan} onChange={(e) => setBusinessData({ ...businessData, tan: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>GSTIN</Label>
              <Input value={businessData.gstin} onChange={(e) => setBusinessData({ ...businessData, gstin: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Registered Business Address</Label>
              <Input value={businessData.address} onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Save</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Row>
  );
};

export default BusinessDetial;
