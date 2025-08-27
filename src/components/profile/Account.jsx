import React, { useEffect, useState } from 'react';
import {
    Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaEdit, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import { UpdateSellerProfile } from '../../api/sellerProfileAPI';
import { showToast } from '../ToastifyNotification';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOGOUT } from '../../reducers/authReducer';
import { buildFormData } from '../../utils/common';

const Account = ({ profileData, handleSubmit }) => {
    const [modal, setModal] = useState("");
    const toggle = id => setModal(modal === id ? "" : id);

    // Individual form state for each section
    const [displayInfo, setDisplayInfo] = useState({
        displayName: profileData?.displayName,
        businessDescription:
            profileData?.businessDescription
    });

    const [pickupAddress, setPickupAddress] = useState({
        line1: profileData?.pickupAddress?.line1,
        line2: profileData?.pickupAddress?.line2,
        pinCode: profileData?.pickupAddress?.pinCode,
        city: profileData?.pickupAddress?.city,
    });

    const [contactDetails, setContactDetails] = useState({
        name: profileData?.name,
        phone: profileData?.phone,
        email: profileData?.email,
        timeSlot: profileData?.timeSlot
    });

    const [loginDetails, setLoginDetails] = useState({
        displayName: profileData?.displayName,
        phone: profileData?.phone,
        email: profileData?.email,
        password: profileData?.password
    });

    useEffect(() => {
        setDisplayInfo({
            displayName: profileData?.displayName,
            businessDescription: profileData?.businessDescription
        });

        setPickupAddress({
            line1: profileData?.pickupAddress?.line1,
            line2: profileData?.pickupAddress?.line2,
            pinCode: profileData?.pickupAddress?.pinCode,
            city: profileData?.pickupAddress?.city,
        });

        setContactDetails({
            name: profileData?.name,
            phone: profileData?.phone,
            email: profileData?.email,
            timeSlot: profileData?.timeSlot
        });

        setLoginDetails({
            displayName: profileData?.displayName,
            phone: profileData?.phone,
            email: profileData?.email,
            password: profileData?.password
        });
    }, [profileData]);

    const renderDisplayInfo = () =>
        <Col md="4" className="mb-3">
            <Card className="h-100 bg-light" style={{ border: "unset" }}>
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <h6>Display Information</h6>
                        <Button color="link" onClick={() => toggle("displayInfo")}>
                            <FaEdit size={16} /> EDIT
                        </Button>
                    </div>
                    <small className="text-muted">Display Name</small>
                    <p className="mb-1">
                        {displayInfo.displayName}{" "}
                        <FaCheckCircle className="text-success ms-1" />
                    </p>
                    <small className="text-muted">Business Description</small>
                    <p className="mb-1">
                        {displayInfo.businessDescription}{" "}
                        <FaCheckCircle className="text-success ms-1" />
                    </p>
                </CardBody>
            </Card>

            <Modal
                isOpen={modal === "displayInfo"}
                toggle={() => toggle("displayInfo")}
            >
                <Form onSubmit={() => {
                    const formData = buildFormData('displayInfo', displayInfo);
                    handleSubmit(formData);
                    toggle("displayInfo");
                }
                }>
                    <ModalHeader toggle={() => toggle("displayInfo")}>
                        Edit Display Info
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Display Name</Label>
                            <Input
                                value={displayInfo.displayName}
                                onChange={e =>
                                    setDisplayInfo({
                                        ...displayInfo,
                                        displayName: e.target.value
                                    })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Business Description</Label>
                            <Input
                                type="textarea"
                                value={displayInfo.businessDescription}
                                onChange={e =>
                                    setDisplayInfo({
                                        ...displayInfo,
                                        businessDescription: e.target.value
                                    })}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"
                            onClick={() => {
                                const formData = buildFormData('displayInfo', displayInfo);
                                handleSubmit(formData);
                                toggle("displayInfo");
                            }}
                        >
                            Save
                        </Button>
                        <Button color="secondary" onClick={() => toggle("displayInfo")}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </Col>;

    const renderPickupAddress = () =>
        <Col md="4" className="mb-3">
            <Card className="h-100 bg-light" style={{ border: "unset" }}>
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <h6>Pickup Address</h6>
                        <Button color="link" onClick={() => toggle("pickupAddress")}>
                            <FaEdit size={16} /> EDIT
                        </Button>
                    </div>
                    {Object.entries(pickupAddress).map(([key, val]) =>
                        <div key={key}>
                            <small className="text-muted">
                                {key.replace(/([A-Z])/g, " $1")}
                            </small>
                            <p className="mb-1">
                                {val} <FaCheckCircle className="text-success ms-1" />
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>

            <Modal
                isOpen={modal === "pickupAddress"}
                toggle={() => toggle("pickupAddress")}
            >
                <ModalHeader toggle={() => toggle("pickupAddress")}>
                    Edit Pickup Address
                </ModalHeader>
                <Form onSubmit={() => {
                    const formData = buildFormData('pickupAddress', pickupAddress);
                    handleSubmit(formData);
                    toggle("pickupAddress");
                }}>
                    <ModalBody>
                        <FormGroup>
                            <Label>Address Line 1</Label>
                            <Input
                                value={pickupAddress.line1}
                                onChange={e =>
                                    setPickupAddress({ ...pickupAddress, line1: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Address Line 2</Label>
                            <Input
                                value={pickupAddress.line2}
                                onChange={e =>
                                    setPickupAddress({ ...pickupAddress, line2: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>PinCode Code</Label>
                            <Input
                                value={pickupAddress.pinCode}
                                onChange={e =>
                                    setPickupAddress({ ...pickupAddress, pinCode: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>City</Label>
                            <Input
                                value={pickupAddress.city}
                                onChange={e =>
                                    setPickupAddress({ ...pickupAddress, city: e.target.value })}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {
                            const formData = buildFormData('pickupAddress', pickupAddress);
                            handleSubmit(formData);
                            toggle("pickupAddress");
                        }}>
                            Save
                        </Button>
                        <Button color="secondary" onClick={() => toggle("pickupAddress")}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </Col>;

    const renderContactDetails = () =>
        <Col md="4" className="mb-3 ">
            <Card className="h-100 bg-light" style={{ border: "unset" }}>
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <h6>Contact Details</h6>
                        <Button color="link" onClick={() => toggle("contactDetails")}>
                            <FaEdit size={16} /> EDIT
                        </Button>
                    </div>
                    <small className="text-muted">Your Name</small>
                    <p className="mb-1">
                        {contactDetails.name}{" "}
                        <FaCheckCircle className="text-success ms-1" />
                    </p>
                    <small className="text-muted">Your Mobile Number</small>
                    <p className="mb-1">
                        {contactDetails.phone}{" "}
                        <FaCheckCircle className="text-success ms-1" />
                    </p>
                    <small className="text-muted">Email Address</small>
                    <p className="mb-1">
                        {contactDetails.email}{" "}
                        <FaCheckCircle className="text-success ms-1" />
                    </p>
                    <small className="text-muted">Preferred Time Slot</small>
                    <p className="mb-1">
                        {contactDetails.timeSlot}{" "}
                        <FaCheckCircle className="text-success ms-1" />
                    </p>
                </CardBody>
            </Card>

            <Modal
                isOpen={modal === "contactDetails"}
                toggle={() => toggle("contactDetails")}
            >
                <ModalHeader toggle={() => toggle("contactDetails")}>
                    Edit Contact Details
                </ModalHeader>
                <Form onSubmit={() => {
                    const formData = buildFormData('contactDetails', contactDetails);
                    handleSubmit(formData);
                    toggle("contactDetails");
                }}>
                    <ModalBody>
                        <FormGroup>
                            <Label>Your Name</Label>
                            <Input
                                value={contactDetails.name}
                                onChange={e =>
                                    setContactDetails({
                                        ...contactDetails,
                                        name: e.target.value
                                    })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Phone</Label>
                            <Input
                                value={contactDetails.phone}
                                onChange={e =>
                                    setContactDetails({
                                        ...contactDetails,
                                        phone: e.target.value
                                    })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={contactDetails.email}
                                onChange={e =>
                                    setContactDetails({
                                        ...contactDetails,
                                        email: e.target.value
                                    })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Preferred Time Slot</Label>
                            <Input
                                value={contactDetails.timeSlot}
                                onChange={e =>
                                    setContactDetails({
                                        ...contactDetails,
                                        timeSlot: e.target.value
                                    })}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {
                            const formData = buildFormData('contactDetails', contactDetails);
                            handleSubmit(formData);
                            toggle("contactDetails");
                        }}>
                            Save
                        </Button>
                        <Button color="secondary" onClick={() => toggle("contactDetails")}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </Col>;

    const renderLoginDetails = () =>
        <Col md="4" className="mb-3">
            <Card className="h-100 bg-light" style={{ border: "unset" }}>
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <h6>Login Details</h6>
                        <Button color="link" onClick={() => toggle("loginDetails")}>
                            <FaEdit size={16} /> EDIT
                        </Button>
                    </div>
                    <small className="text-muted">Display Name</small>
                    <p className="mb-1">
                        {loginDetails.displayName}{" "}
                        <FaCheckCircle className="text-success ms-1" />
                    </p>
                    <small className="text-muted">Mobile Number</small>
                    <p className="mb-1">
                        {loginDetails.phone} <FaCheckCircle className="text-success ms-1" />
                    </p>
                    <small className="text-muted">Email</small>
                    <p className="mb-1">
                        {loginDetails.email} <FaCheckCircle className="text-success ms-1" />
                    </p>
                    <small className="text-muted">Password</small>
                    <p className="mb-1">
                        {loginDetails.password}{" "}
                        <FaCheckCircle className="text-success ms-1" />
                    </p>
                </CardBody>
            </Card>
            <Modal
                isOpen={modal === "loginDetails"}
                toggle={() => toggle("loginDetails")}
            >
                <ModalHeader toggle={() => toggle("loginDetails")}>
                    Edit Login Details
                </ModalHeader>
                <Form onSubmit={() => {
                    const formData = buildFormData('loginDetails', loginDetails);
                    handleSubmit(formData);
                    toggle("loginDetails");
                }}>
                    <ModalBody>
                        <FormGroup>
                            <Label>Display Name</Label>
                            <Input
                                value={loginDetails.displayName}
                                onChange={e =>
                                    setLoginDetails({
                                        ...loginDetails,
                                        displayName: e.target.value
                                    })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Mobile Number</Label>
                            <Input
                                value={loginDetails.phone}
                                onChange={e =>
                                    setLoginDetails({ ...loginDetails, phone: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={loginDetails.email}
                                onChange={e =>
                                    setLoginDetails({ ...loginDetails, email: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={loginDetails.password}
                                onChange={e =>
                                    setLoginDetails({
                                        ...loginDetails,
                                        password: e.target.value
                                    })}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {
                            const formData = buildFormData('loginDetails', loginDetails);
                            handleSubmit(formData);
                            toggle("loginDetails");
                        }}>
                            Save
                        </Button>
                        <Button color="secondary" onClick={() => toggle("loginDetails")}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </Col>;

    const renderDeleteAccount = () =>
        <Col md="4" className="mb-3">
            <Card className="h-100 border-none bg-light" style={{ border: "unset" }}>
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <h6 className="text-danger">Delete Account</h6>
                        <Button
                            color="link"
                            className="text-danger"
                            onClick={() => toggle("deleteAccount")}
                        >
                            <FaTrashAlt size={16} /> DELETE
                        </Button>
                    </div>
                    <ul className="mb-0">
                        <li>No actively pending orders (Forward and Return)</li>
                        <li>No pending settlements</li>
                    </ul>
                </CardBody>
            </Card>

            <Modal
                isOpen={modal === "deleteAccount"}
                toggle={() => toggle("deleteAccount")}
            >
                <ModalHeader toggle={() => toggle("deleteAccount")}>
                    Confirm Account Deletion
                </ModalHeader>
                <ModalBody>
                    <p className="text-danger fw-bold">
                        Are you sure you want to delete your account? This action cannot be
                        undone.
                    </p>
                    <p>Please make sure:</p>
                    <ul>
                        <li>You have no pending orders (forward or return).</li>
                        <li>Your account has no pending settlements.</li>
                    </ul>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        onClick={() => {
                            const formData = buildFormData('deleteAccount', {});
                            handleSubmit(formData);
                            toggle("deleteAccount");
                        }}
                    >
                        Yes, Delete My Account
                    </Button>
                    <Button color="secondary" onClick={() => toggle("deleteAccount")}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </Col>

    return (
        <div className="p-2">
            <Row>
                {renderDisplayInfo()}
                {renderPickupAddress()}
                {renderContactDetails()}
                {renderLoginDetails()}
                {renderDeleteAccount()}
            </Row>
        </div>
    );
};

export default Account;
