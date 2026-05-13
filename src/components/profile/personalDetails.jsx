import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { FaEdit } from "react-icons/fa";
import { buildFormData } from "../../utils/common";

const PersonalDetails = ({ profileData, handleSubmit }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [errors, setErrors] = useState({});

  // PERSONAL DETAILS STATE
  const [personal, setPersonal] = useState({
    vendorUniqueId: "",
    firstName: "",
    lastName: "",
    email: "",
    alternateEmail: "",
    phone: "",
    alternatePhone: ""
  });

  // LOAD DATA
  useEffect(
    () => {
      if (profileData) {
        setPersonal({
          vendorUniqueId: profileData.vendorUniqueId || "",
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: profileData.email || "",
          alternateEmail: profileData.alternateEmail || "",
          phone: profileData.phone || "",
          alternatePhone: profileData.alternatePhone || ""
        });
      }
    },
    [profileData]
  );

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!personal.firstName) newErrors.firstName = "First Name required";
    if (!personal.lastName) newErrors.lastName = "Last Name required";
    if (!personal.email) newErrors.email = "Email required";
    if (!personal.phone) newErrors.phone = "Phone required";
    // if (!personal.vendorUniqueId)
    //   newErrors.vendorUniqueId = "Vendor ID required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SAVE
  const handleSave = () => {
    if (!validate()) return;

    const formData = buildFormData("personalDetails", personal);

    handleSubmit(formData);
    toggle();
  };

  return (
    <Card className="h-100 bg-light shadow-sm border-0">
      <CardBody>
        <div className="d-flex justify-content-between mb-2">
          <h6 className="fw-bold">Personal Details</h6>
          <Button color="link" onClick={toggle}>
            <FaEdit size={14} /> EDIT
          </Button>
        </div>

        <div>
          <strong>First Name:</strong> {personal.firstName}
        </div>
        <div>
          <strong>Last Name:</strong> {personal.lastName}
        </div>
        <div>
          <strong>Email:</strong> {personal.email}
        </div>
        <div>
          <strong>Alternate Email:</strong> {personal.alternateEmail}
        </div>
        <div>
          <strong>Phone:</strong> {personal.phone}
        </div>
        <div>
          <strong>Alternate Phone:</strong> {personal.alternatePhone}
        </div>
        <div>
          <strong>Vendor ID:</strong> {personal.vendorUniqueId}
          <small>
            {!personal.vendorUniqueId &&
              "Please update the personal details to generate the vendor ID"}
          </small>
        </div>
      </CardBody>

      {/* MODAL */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Personal Details</ModalHeader>

        <Form>
          <ModalBody>
            <FormGroup>
              <Label>First Name *</Label>
              <Input
                value={personal.firstName}
                invalid={!!errors.firstName}
                onChange={e =>
                  setPersonal({ ...personal, firstName: e.target.value })}
              />
              <div className="text-danger">
                {errors.firstName}
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Last Name *</Label>
              <Input
                value={personal.lastName}
                invalid={!!errors.lastName}
                onChange={e =>
                  setPersonal({ ...personal, lastName: e.target.value })}
              />
              <div className="text-danger">
                {errors.lastName}
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Email *</Label>
              <Input
                readOnly
                type="email"
                value={personal.email}
                invalid={!!errors.email}
                onChange={e =>
                  setPersonal({ ...personal, email: e.target.value })}
              />
              <div className="text-danger">
                {errors.email}
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Alternate Email</Label>
              <Input
                type="email"
                value={personal.alternateEmail}
                onChange={e =>
                  setPersonal({ ...personal, alternateEmail: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone *</Label>
              <Input
                value={personal.phone}
                invalid={!!errors.phone}
                onChange={e =>
                  setPersonal({ ...personal, phone: e.target.value })}
              />
              <div className="text-danger">
                {errors.phone}
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Alternate Phone</Label>
              <Input
                value={personal.alternatePhone}
                onChange={e =>
                  setPersonal({ ...personal, alternatePhone: e.target.value })}
              />
            </FormGroup>

            {/* <FormGroup>
              <Label>Vendor Unique ID</Label>
              <Input
                value={personal.vendorUniqueId}
                onChange={e =>
                  setPersonal({ ...personal, vendorUniqueId: e.target.value })}
              />
              {errors.vendorUniqueId &&
                <div className="text-danger">
                  {errors.vendorUniqueId}
                </div>}
            </FormGroup> */}
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Card>
  );
};

export default PersonalDetails;
