import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaEdit } from 'react-icons/fa';
import { IMAGE_URL } from '../../utils/api-config';
import { buildFormData } from '../../utils/common';

// SAME imports

const AddressDetails = ({ profileData, handleSubmit }) => {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [sameAsPickup, setSameAsPickup] = useState(false);

  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState({
    billingAddress: '',
    pickupAddress: '',
    otherPickupAddress: '',
    returnPickupAddress: '',
  });

  useEffect(() => {
    setAddress(profileData?.addressDetails || {});
  }, [profileData]);

  const validate = () => {
    let newErrors = {};

    if (!address.billingAddress) newErrors.billingAddress = "Billing Address required";
    if (!address.pickupAddress) newErrors.pickupAddress = "Pickup Address required";
    if (!address.otherPickupAddress) newErrors.otherPickupAddress = "Other Pickup Address required";
    if (!address.returnPickupAddress) newErrors.returnPickupAddress = "Return Pickup Address required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSameAsBilling = (checked) => {
    setSameAsBilling(checked);

    if (checked) {
      setAddress(prev => ({
        ...prev,
        pickupAddress: prev.billingAddress,
      }));
    }
  };

  const handleSameAsPickup = (checked) => {
    setSameAsPickup(checked);

    if (checked) {
      setAddress(prev => ({
        ...prev,
        otherPickupAddress: prev.pickupAddress,
        returnPickupAddress: prev.pickupAddress,
      }));
    }
  };

  useEffect(() => {
    if (sameAsBilling) {
      setAddress(prev => ({
        ...prev,
        pickupAddress: prev.billingAddress,
      }));
    }
  }, [address.billingAddress]);

  useEffect(() => {
    if (sameAsPickup) {
      setAddress(prev => ({
        ...prev,
        otherPickupAddress: prev.pickupAddress,
        returnPickupAddress: prev.pickupAddress,
      }));
    }
  }, [address.pickupAddress]);

  return (
    <Card className="h-100 bg-light shadow-sm border-0">
      <CardBody>

        <div className="d-flex justify-content-between mb-2">
          <h6 className="fw-bold">Address Details</h6>
          <Button color="link" onClick={toggle}>
            <FaEdit size={14} /> EDIT
          </Button>
        </div>

        <div className="mb-2"><strong>Billing:</strong> {address.billingAddress}</div>
        <div className="mb-2"><strong>Pickup:</strong> {address.pickupAddress}</div>
        <div className="mb-2"><strong>Other Pickup:</strong> {address.otherPickupAddress}</div>
        <div className="mb-2"><strong>Return:</strong> {address.returnPickupAddress}</div>

      </CardBody>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Address</ModalHeader>

        <Form>
          <ModalBody>

            <FormGroup>
              <Label>Billing Address *</Label>
              <Input type='textarea' value={address.billingAddress || ''} invalid={!!errors.billingAddress}
                onChange={(e) => setAddress({ ...address, billingAddress: e.target.value })}
              />
              <div className="text-danger">{errors.billingAddress}</div>
            </FormGroup>
            <FormGroup check className="mb-2">
              <Input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(e) => handleSameAsBilling(e.target.checked)}
              />
              <Label check>Same as Billing Address</Label>
            </FormGroup>

            <FormGroup>
              <Label>Pickup Address *</Label>
              <Input type='textarea' disabled={sameAsBilling} value={address.pickupAddress || ''} invalid={!!errors.pickupAddress}
                onChange={(e) => setAddress({ ...address, pickupAddress: e.target.value })}
              />
              <div className="text-danger">{errors.pickupAddress}</div>
            </FormGroup>
            <FormGroup check className="mb-2">
              <Input
                type="checkbox"
                checked={sameAsPickup}
                onChange={(e) => handleSameAsPickup(e.target.checked)}
              />
              <Label check>Same as Pickup Address</Label>
            </FormGroup>

            <FormGroup>
              <Label>Other Pickup Address</Label>
              <Input type='textarea' disabled={sameAsPickup} value={address.otherPickupAddress || ''} invalid={!!errors.otherPickupAddress}
                onChange={(e) => setAddress({ ...address, otherPickupAddress: e.target.value })}
              />
              <div className="text-danger">{errors.otherPickupAddress}</div>
            </FormGroup>

            <FormGroup>
              <Label>Return Address</Label>
              <Input type='textarea' disabled={sameAsPickup} value={address.returnPickupAddress || ''} invalid={!!errors.returnPickupAddress}
                onChange={(e) => setAddress({ ...address, returnPickupAddress: e.target.value })}
              />
              <div className="text-danger">{errors.returnPickupAddress}</div>
            </FormGroup>

          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => {
              if (!validate()) return;

              const formData = buildFormData('addressDetails', address);
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

export default AddressDetails;