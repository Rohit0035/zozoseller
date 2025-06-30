import React, { useState } from 'react';
import {
  Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label
} from 'reactstrap';

const BankDetails = () => {
  const [editModal, setEditModal] = useState(false);
  const [ldcModal, setLdcModal] = useState(false);

  const toggleEditModal = () => setEditModal(!editModal);
  const toggleLdcModal = () => setLdcModal(!ldcModal);

  return (
    <div className="p-2">
      <Row>
        {/* Bank Account Verification */}
        <Col md="6" className="mb-3">
          <Card className="bg-light h-100" style={{ border: 'unset' }}>
            <CardBody>
              <h6 className="mb-3">Bank Account Verification</h6>
              <div className="mb-2"><strong>Account Number:</strong> 5799201000168</div>
              <div className="mb-3"><strong>IFSC Code:</strong> CNRB0005799</div>
              <div
                className="mb-3 text-primary"
                style={{ cursor: 'pointer' }}
                onClick={toggleEditModal}
              >
                <i className="fa fa-pencil mr-1" /> Edit Account Details (Faster and recommended)
              </div>
              <p className="text-muted">OR</p>
              <div className="mb-3">
                <strong className="text-primary" style={{ cursor: 'pointer' }}>
                  Upload Cancelled Cheque, Account Statement or Passbook
                </strong>
              </div>
              <div>
                <Button color="primary" className="mr-2">Submit</Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* LDC Card */}
        <Col md="6" className="mb-3">
          <Card className="bg-light h-100" style={{ border: 'unset' }}>
            <CardBody>
              <h6 className="mb-3 d-flex justify-content-between align-items-center">
                Claim LDC for TDS under 194O <span className="text-danger">ⓘ</span>
              </h6>
              <p className="text-muted">Please provide us your LDC details</p>
              <Button className='btn btn-primary' onClick={toggleLdcModal}>Add Details</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Edit Bank Account Modal */}
      <Modal isOpen={editModal} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Bank Account Details</ModalHeader>
        <ModalBody>
          <Label>Account Number</Label>
          <Input type="text" className="mb-3" defaultValue="5799201000168" />

          <Label>IFSC Code</Label>
          <Input type="text" className="mb-3" defaultValue="CNRB0005799" />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleEditModal}>Cancel</Button>
          <Button color="primary" onClick={toggleEditModal}>Save</Button>
        </ModalFooter>
      </Modal>

      {/* LDC Modal */}
      <Modal isOpen={ldcModal} toggle={toggleLdcModal}>
        <ModalHeader toggle={toggleLdcModal}>Provide LDC Details</ModalHeader>
        <ModalBody>
          <Label>Certificate Number</Label>
          <Input type="text" className="mb-3" placeholder="Enter Certificate Number" />

          <Label>Lower Tax Rate (%)</Label>
          <Input type="number" className="mb-3" placeholder="Enter Tax Rate" />

          <Label>Validity</Label>
          <div className="d-flex mb-3">
            <Input type="date" className="mr-2" defaultValue="2025-06-24" />
            <span className="mx-2">→</span>
            <Input type="date" defaultValue="2025-06-24" />
          </div>

          <Label>Amount</Label>
          <Input type="number" className="mb-3" placeholder="Enter Amount" />

          <Label>Upload Document</Label>
          <div className="mb-3">
            <Button outline color="primary">Select Document</Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleLdcModal}>Cancel</Button>
          <Button color="primary" disabled>Upload and Save</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default BankDetails;
