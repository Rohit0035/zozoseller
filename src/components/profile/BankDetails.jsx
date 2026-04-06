import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaEdit } from 'react-icons/fa';
import { IMAGE_URL } from '../../utils/api-config';
import { buildFormData } from '../../utils/common';
import { bankList } from '../../utils/data';
import { renderFilePreview } from '../../utils/filePreview';

// SAME imports as above

const BankDetails = ({ profileData, handleSubmit }) => {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});

  const [bankData, setBankData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    cancelCheque: '',
  });

  useEffect(() => {
    const data = profileData?.bankDetails || {};
    data.cancelCheque = data.cancelCheque ? `${IMAGE_URL}/${data.cancelCheque}` : ''
    setBankData(data);

    setPreviews({
      cancelCheque: data.cancelCheque ? `${IMAGE_URL}/${data.cancelCheque}` : '',
    });
  }, [profileData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ cancelCheque: file });
      setPreviews({ cancelCheque: URL.createObjectURL(file) });
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!bankData.bankName) newErrors.bankName = "Bank Name is required";
    if (!bankData.accountName) newErrors.accountName = "Account Name is required";
    if (!bankData.accountNumber) newErrors.accountNumber = "Account Number is required";
    if (!bankData.ifscCode) newErrors.ifscCode = "IFSC Code is required";

    if (!files.cancelCheque && !bankData.cancelCheque)
      newErrors.cancelCheque = "Cancel Cheque is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Card className="h-100 bg-light shadow-sm border-0">
      <CardBody>

        <div className="d-flex justify-content-between mb-2">
          <h6 className="fw-bold">Bank Details</h6>
          <Button color="link" onClick={toggle}>
            <FaEdit size={14} /> EDIT
          </Button>
        </div>

        <div className="mb-2"><strong>Bank:</strong> {bankData.bankName}</div>
        <div className="mb-2"><strong>Account Name:</strong> {bankData.accountName}</div>
        <div className="mb-2"><strong>Account No:</strong> {bankData.accountNumber}</div>
        <div className="mb-2"><strong>IFSC:</strong> {bankData.ifscCode}</div>

        <div className="mb-2">
          <strong>Cancel Cheque:</strong><br />
          {previews.cancelCheque && <img src={previews.cancelCheque} width={120} alt="" />}
        </div>

      </CardBody>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Bank Details</ModalHeader>

        <Form>
          <ModalBody>

            <FormGroup>
              <Label>Bank Name *</Label>
              <Input type='select' value={bankData.bankName || ''} invalid={!!errors.bankName}
                onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
              >
                {bankList.map((bank) => <option key={bank}>{bank}</option>)}
              </Input>
              <div className="text-danger">{errors.bankName}</div>
            </FormGroup>

            <FormGroup>
              <Label>Account Name *</Label>
              <Input value={bankData.accountName || ''} invalid={!!errors.accountName}
                onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
              />
              <div className="text-danger">{errors.accountName}</div>
            </FormGroup>

            <FormGroup>
              <Label>Account Number *</Label>
              <Input value={bankData.accountNumber || ''} invalid={!!errors.accountNumber}
                onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
              />
              <div className="text-danger">{errors.accountNumber}</div>
            </FormGroup>

            <FormGroup>
              <Label>IFSC Code *</Label>
              <Input value={bankData.ifscCode || ''} invalid={!!errors.ifscCode}
                onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value })}
              />
              <div className="text-danger">{errors.ifscCode}</div>
            </FormGroup>

            <FormGroup>
              <Label>Cancel Cheque * <small>(Only .jpg, .jpeg, .png, .pdf formats are allowed)</small></Label>
              <Input type="file" onChange={handleFileChange} accept='image/*, application/pdf' />
              <div className="text-danger">{errors.cancelCheque}</div>
              {renderFilePreview(files.cancelCheque || bankData.cancelCheque)}
            </FormGroup>

          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => {
              if (!validate()) return;

              const formData = buildFormData('bankDetails', bankData);
              if (files.cancelCheque)
                formData.append('cancelCheque', files.cancelCheque);

              handleSubmit(formData);
              toggle();
            }}>Save</Button>

            <Button onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Card>



  );
};

export default BankDetails;