import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form
} from "reactstrap";
import { buildFormData } from "../../utils/common";
import { IMAGE_URL } from "../../utils/api-config";

const BankDetails = ({ profileData, handleSubmit }) => {
  const [editModal, setEditModal] = useState(false);
  const [ldcModal, setLdcModal] = useState(false);

  const toggleEditModal = () => setEditModal(!editModal);
  const toggleLdcModal = () => setLdcModal(!ldcModal);
  const [bankDetails, setBankDetails] = useState({
    bankName: profileData?.bankName,
    accountNo: profileData?.accountNo,
    ifscCode: profileData?.ifscCode,
    branchName: profileData?.branchName
  });
  const [ldcDetails, setLdcDetails] = useState(profileData?.ldcDetails);
  useEffect(() => {
    setBankDetails({
      bankName: profileData?.bankName,
      accountNo: profileData?.accountNo,
      ifscCode: profileData?.ifscCode,
      branchName: profileData?.branchName
    });
    setLdcDetails(profileData?.ldcDetails);
  }, [profileData])
  return (
    <div className="p-2">
      <Row>
        {/* Bank Account Verification */}
        <Col md="6" className="mb-3">
          <Card className="bg-light h-100" style={{ border: "unset" }}>
            <CardBody>
              <h6 className="mb-3">Bank Account Verification</h6>
              <div className="mb-2">
                <strong>Account Number:</strong> {bankDetails?.accountNo}
              </div>
              <div className="mb-3">
                <strong>IFSC Code:</strong> {bankDetails?.ifscCode}
              </div>
              <div
                className="mb-3 text-primary"
                style={{ cursor: "pointer" }}
                onClick={toggleEditModal}
              >
                <i className="fa fa-pencil mr-1" /> Edit Account Details (Faster
                and recommended)
              </div>
              <p className="text-muted">OR</p>
              <div className="mb-3">
                <strong className="text-primary" style={{ cursor: "pointer" }}>
                  Upload Cancelled Cheque, Account Statement or Passbook
                </strong>
              </div>
              <div>
                <Button color="primary" className="mr-2">
                  Submit
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* LDC Card */}
        <Col md="6" className="mb-3">
          <Card className="bg-light h-100" style={{ border: "unset" }}>
            <CardBody>
              <h6 className="mb-3 d-flex justify-content-between align-items-center">
                Claim LDC for TDS under 194O{" "}
                <span className="text-danger">ⓘ</span>
              </h6>
              <p className="text-muted">Please provide us your LDC details</p>
              <Button className="btn btn-primary" onClick={toggleLdcModal}>
                Add Details
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Edit Bank Account Modal */}
      <Modal isOpen={editModal} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>
          Edit Bank Account Details
        </ModalHeader>
        <Form>
          <ModalBody>
            <Label>Bank Name</Label>
            <Input type="text" className="mb-3" value={bankDetails?.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} />

            <Label>Account Number</Label>
            <Input type="text" className="mb-3" value={bankDetails?.accountNo} onChange={(e) => setBankDetails({ ...bankDetails, accountNo: e.target.value })} />

            <Label>IFSC Code</Label>
            <Input type="text" className="mb-3" value={bankDetails?.ifscCode} onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })} />

            <Label>Branch Name</Label>
            <Input type="text" className="mb-3" value={bankDetails?.branchName} onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => { 
                const formData = buildFormData('bankDetails', bankDetails);
								handleSubmit(formData);
                toggleEditModal() 
              }}>
              Save
            </Button>
            <Button color="secondary" onClick={toggleEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* LDC Modal */}
      <Modal isOpen={ldcModal} toggle={toggleLdcModal}>
        <ModalHeader toggle={toggleLdcModal}>Provide LDC Details</ModalHeader>
        <Form 
          onSubmit={() => {
              const formData = buildFormData('ldcDetails', ldcDetails);
              handleSubmit(formData);
              toggleLdcModal();
          }}>
        <ModalBody>
          <Label>Certificate Number</Label>
          <Input
            type="text"
            className="mb-3"
            placeholder="Enter Certificate Number"
            value={ldcDetails?.certificateNo}
            onChange={(e) => setLdcDetails({ ...ldcDetails, certificateNo: e.target.value })}
          />

          <Label>Lower Tax Rate (%)</Label>
          <Input type="number" className="mb-3" placeholder="Enter Tax Rate" 
            value={ldcDetails?.lowerTaxRate}
            onChange={(e) => setLdcDetails({ ...ldcDetails, lowerTaxRate: e.target.value })}
          />

          <Label>Validity</Label>
          <div className="d-flex mb-3">
            <Input type="date" className="mr-2" 
              value={ldcDetails?.validity?.fromDate?.slice(0,10)}
              onChange={(e) => setLdcDetails({
                ...ldcDetails,
                validity: {
                  ...ldcDetails.validity,
                  fromDate: e.target.value,
                },
              })}
            />
            <span className="mx-2">→</span>
            <Input type="date" 
              value={ldcDetails?.validity?.toDate?.slice(0,10)}
              onChange={(e) => setLdcDetails({
                ...ldcDetails,
                validity: {
                  ...ldcDetails.validity,
                  toDate: e.target.value,
                },
              })}
            />
          </div>

          <Label>Amount</Label>
          <Input type="number" className="mb-3" placeholder="Enter Amount" 
            value={ldcDetails?.amount}
            onChange={(e) => setLdcDetails({ ...ldcDetails, amount: e.target.value })}
          />

          <Label>Upload Document</Label>
          <div className="mb-3">
            <Input type="file" 
              onChange={(e) => setLdcDetails({ ...ldcDetails, document: e.target.files[0] })}
            />
          </div>
          {
            ldcDetails?.document && 
            <a href={`${IMAGE_URL}/${ldcDetails?.document}`} target="_blank">
              View Document
            </a>
          }
        </ModalBody>
        <ModalFooter>
          <Button color="primary"
          onClick={() => { 
                const formData = buildFormData('ldcDetails', ldcDetails, 'document', ldcDetails?.document);
								handleSubmit(formData);
                toggleLdcModal() 
              }}
          >
            Upload and Save
          </Button>
          <Button color="secondary" onClick={toggleLdcModal}>
            Cancel
          </Button>
        </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default BankDetails;
