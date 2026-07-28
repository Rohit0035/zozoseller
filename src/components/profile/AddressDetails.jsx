import React, { useEffect, useState } from 'react';
import {
	Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
	Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaEdit } from 'react-icons/fa';
import { IMAGE_URL } from '../../utils/api-config';
import { buildFormData } from '../../utils/common';
import { states } from '../../data/states';

// SAME imports

const AddressDetails = ({ profileData, handleSubmit }) => {

	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);
	const [sameAsBilling, setSameAsBilling] = useState(false);
	const [sameAsPickup, setSameAsPickup] = useState(false);

	const [errors, setErrors] = useState({
		billingAddress: {},
		pickupAddress: {},
		otherPickupAddress: {},
		returnPickupAddress: {}
	});
	const emptyAddress = {
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		pincode: ""
	};

	const [address, setAddress] = useState({
		billingAddress: { ...emptyAddress },
		pickupAddress: { ...emptyAddress },
		otherPickupAddress: { ...emptyAddress },
		returnPickupAddress: { ...emptyAddress }
	});

	useEffect(() => {
		setAddress({
			billingAddress:
				profileData?.addressDetails?.billingAddress || { ...emptyAddress },

			pickupAddress:
				profileData?.addressDetails?.pickupAddress || { ...emptyAddress },

			otherPickupAddress:
				profileData?.addressDetails?.otherPickupAddress || { ...emptyAddress },

			returnPickupAddress:
				profileData?.addressDetails?.returnPickupAddress || { ...emptyAddress }
		});
	}, [profileData]);

	const updateAddress = (type, field, value) => {
		setAddress(prev => ({
			...prev,
			[type]: {
				...prev[type],
				[field]: value
			}
		}));
	};

	const validate = () => {
		let newErrors = {};

		const validateAddress = (key, value) => {
			newErrors[key] = {};

			if (!value.addressLine1)
				newErrors[key].addressLine1 = "Address Line 1 is required";

			if (!value.city)
				newErrors[key].city = "City is required";

			if (!value.state)
				newErrors[key].state = "State is required";

			if (!value.pincode)
				newErrors[key].pincode = "Pincode is required";

			if (Object.keys(newErrors[key]).length === 0) {
				delete newErrors[key];
			}
		};

		validateAddress("billingAddress", address.billingAddress);
		validateAddress("pickupAddress", address.pickupAddress);
		validateAddress("otherPickupAddress", address.otherPickupAddress);
		validateAddress("returnPickupAddress", address.returnPickupAddress);

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSameAsBilling = (checked) => {
		setSameAsBilling(checked);

		if (checked) {
			setAddress(prev => ({
				...prev,
				pickupAddress: { ...prev.billingAddress }
			}));
		}
	};

	const handleSameAsPickup = (checked) => {
		setSameAsPickup(checked);

		if (checked) {
			setAddress(prev => ({
				...prev,
				otherPickupAddress: { ...prev.pickupAddress },
				returnPickupAddress: { ...prev.pickupAddress }
			}));
		}
	};

	useEffect(() => {
		if (sameAsBilling) {
			setAddress(prev => ({
				...prev,
				pickupAddress: { ...prev.billingAddress }
			}));
		}
	}, [address.billingAddress, sameAsBilling]);

	useEffect(() => {
		if (sameAsPickup) {
			setAddress(prev => ({
				...prev,
				otherPickupAddress: { ...prev.pickupAddress },
				returnPickupAddress: { ...prev.pickupAddress }
			}));
		}
	}, [address.pickupAddress]);

	return (
		<Card className="h-100 bg-light shadow-sm border-0">
			<CardBody>

				<div className="d-flex justify-content-between mb-2">
					<h6>Address Details</h6>
					<Button color="link" onClick={toggle}>
						<FaEdit size={14} /> EDIT
					</Button>
				</div>

				<div className="mb-2">
					<strong>Billing Address:</strong><br />

					{address.billingAddress.addressLine1}<br />
					{address.billingAddress.addressLine2}<br />

					{address.billingAddress.city},
					{" "}
					{address.billingAddress.state}
					{" - "}
					{address.billingAddress.pincode}
				</div>

				<div className="mb-2">
					<strong>Pickup Address:</strong><br />

					{address.pickupAddress.addressLine1}<br />
					{address.pickupAddress.addressLine2}<br />

					{address.pickupAddress.city},
					{" "}
					{address.pickupAddress.state}
					{" - "}
					{address.pickupAddress.pincode}
				</div>

				<div className="mb-2">
					<strong>Other Pickup Address:</strong><br />

					{address.otherPickupAddress.addressLine1}<br />
					{address.otherPickupAddress.addressLine2}<br />

					{address.otherPickupAddress.city},
					{" "}
					{address.otherPickupAddress.state}
					{" - "}
					{address.otherPickupAddress.pincode}
				</div>

				<div className="mb-2">
					<strong>Return Pickup Address:</strong><br />

					{address.returnPickupAddress.addressLine1}<br />
					{address.returnPickupAddress.addressLine2}<br />

					{address.returnPickupAddress.city},
					{" "}
					{address.returnPickupAddress.state}
					{" - "}
					{address.returnPickupAddress.pincode}
				</div>

			</CardBody>
			<Modal isOpen={modal} toggle={toggle} size='lg'>
				<ModalHeader toggle={toggle}>Edit Address</ModalHeader>

				<Form>
					<ModalBody>

						<FormGroup>
							<h6>Billing Address *</h6>
							<label className='mt-2'>Address Line 1</label>
							<Input
								placeholder="Address Line 1"
								value={address.billingAddress.addressLine1}
								onChange={(e) =>
									updateAddress(
										"billingAddress",
										"addressLine1",
										e.target.value
									)
								}
							/>

							{errors.billingAddress && errors.billingAddress.addressLine1 && errors.billingAddress.addressLine1.length > 0 && <div className="text-danger">{errors.billingAddress.addressLine1}</div>}
							
							<label className='mt-2'>Address Line 2</label>
							<Input	
								placeholder="Address Line 2"
								value={address.billingAddress.addressLine2}
								onChange={(e) =>
									updateAddress(
										"billingAddress",
										"addressLine2",
										e.target.value
									)
								}
							/>

							{errors.billingAddress && errors.billingAddress.addressLine2 && errors.billingAddress.addressLine2.length > 0 && <div className="text-danger">{errors.billingAddress.addressLine2}</div>}

							<Row className="mt-2">
								<Col md={4}>
									<label>City</label>
									<Input
										placeholder="City"
										value={address.billingAddress.city}
										onChange={(e) =>
											updateAddress(
												"billingAddress",
												"city",
												e.target.value
											)
										}
									/>
									{errors.billingAddress && errors.billingAddress.city && errors.billingAddress.city.length > 0 && <div className="text-danger">{errors.billingAddress.city}</div>}
								</Col>

								<Col md={4}>
									<label>State</label>
									<Input
										type="select"
										placeholder="State"
										value={address.billingAddress.state}
										onChange={(e) =>
											updateAddress(
												"billingAddress",
												"state",
												e.target.value
											)
										}
									>
										{states.map((state) => (
											<option key={state} value={state}>
												{state}
											</option>
										))}
									</Input>
									{errors.billingAddress && errors.billingAddress.state && errors.billingAddress.state.length > 0 && <div className="text-danger">{errors.billingAddress.state}</div>}
								</Col>

								<Col md={4}>
									<label>Pincode</label>
									<Input
										placeholder="Pincode"
										value={address.billingAddress.pincode}
										onChange={(e) =>
											updateAddress(
												"billingAddress",
												"pincode",
												e.target.value
											)
										}
									/>
									{errors.billingAddress && errors.billingAddress.pincode && errors.billingAddress.pincode.length > 0 && <div className="text-danger">{errors.billingAddress.pincode}</div>}
								</Col>
							</Row>
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
							<h6>Pickup Address *</h6>
							
							<label className='mt-2'>Address Line 1</label>
							<Input
								placeholder="Address Line 1"
								value={address.pickupAddress.addressLine1}
								onChange={(e) =>
									updateAddress(
										"pickupAddress",
										"addressLine1",
										e.target.value
									)
								}
							/>
							{errors.pickupAddress && errors.pickupAddress.addressLine1 && errors.pickupAddress.addressLine1.length > 0 && <div className="text-danger">{errors.pickupAddress.addressLine1}</div>}
							
							<label className='mt-2'>Address Line 2</label>
							<Input
								placeholder="Address Line 2"
								value={address.pickupAddress.addressLine2}
								onChange={(e) =>
									updateAddress(
										"pickupAddress",
										"addressLine2",
										e.target.value
									)
								}
							/>
							{errors.pickupAddress && errors.pickupAddress.addressLine2 && errors.pickupAddress.addressLine2.length > 0 && <div className="text-danger">{errors.pickupAddress.addressLine2}</div>}

							<Row className="mt-2">
								<Col md={4}>
									<label>City</label>
									<Input
										placeholder="City"
										value={address.pickupAddress.city}
										onChange={(e) =>
											updateAddress(
												"pickupAddress",
												"city",
												e.target.value
											)
										}
									/>
									{errors.pickupAddress && errors.pickupAddress.city && errors.pickupAddress.city.length > 0 && <div className="text-danger">{errors.pickupAddress.city}</div>}
								</Col>

								<Col md={4}>
									<label>State</label>
									<Input
										type="select"
										placeholder="State"
										value={address.pickupAddress.state}
										onChange={(e) =>
											updateAddress(
												"pickupAddress",
												"state",
												e.target.value
											)
										}
									>
										{states.map((state) => (
											<option key={state} value={state}>
												{state}
											</option>
										))}
									</Input>
									{errors.pickupAddress && errors.pickupAddress.state && errors.pickupAddress.state.length > 0 && <div className="text-danger">{errors.pickupAddress.state}</div>}
								</Col>

								<Col md={4}>
									<label>Pincode</label>
									<Input
										placeholder="Pincode"
										value={address.pickupAddress.pincode}
										onChange={(e) =>
											updateAddress(
												"pickupAddress",
												"pincode",
												e.target.value
											)
										}
									/>
									{errors.pickupAddress && errors.pickupAddress.pincode && errors.pickupAddress.pincode.length > 0 && <div className="text-danger">{errors.pickupAddress.pincode}</div>}
								</Col>
							</Row>
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
							<h6>Other Pickup Address *</h6>
									
							<label className='mt-2'>Address Line 1</label>
							<Input
								placeholder="Address Line 1"
								value={address.otherPickupAddress.addressLine1}
								onChange={(e) =>
									updateAddress(
										"otherPickupAddress",
										"addressLine1",
										e.target.value
									)
								}
							/>
							{errors.otherPickupAddress && errors.otherPickupAddress.addressLine1 && errors.otherPickupAddress.addressLine1.length > 0 && <div className="text-danger">{errors.otherPickupAddress.addressLine1}</div>}

							<label className='mt-2'>Address Line 2</label>
							<Input
								placeholder="Address Line 2"
								value={address.otherPickupAddress.addressLine2}
								onChange={(e) =>
									updateAddress(
										"otherPickupAddress",
										"addressLine2",
										e.target.value
									)
								}
							/>
							{errors.otherPickupAddress && errors.otherPickupAddress.addressLine2 && errors.otherPickupAddress.addressLine2.length > 0 && <div className="text-danger">{errors.otherPickupAddress.addressLine2}</div>}

							<Row className="mt-2">
								<Col md={4}>
									<label>City</label>
									<Input
										placeholder="City"
										value={address.otherPickupAddress.city}
										onChange={(e) =>
											updateAddress(
												"otherPickupAddress",
												"city",
												e.target.value
											)
										}
									/>
									{errors.otherPickupAddress && errors.otherPickupAddress.city && errors.otherPickupAddress.city.length > 0 && <div className="text-danger">{errors.otherPickupAddress.city}</div>}
								</Col>

								<Col md={4}>
									<label>State</label>
									<Input
										type="select"
										placeholder="State"
										value={address.otherPickupAddress.state}
										onChange={(e) =>
											updateAddress(
												"otherPickupAddress",
												"state",
												e.target.value
											)
										}
									>
										{states.map((state) => (
											<option key={state} value={state}>
												{state}
											</option>
										))}
									</Input>
									{errors.otherPickupAddress && errors.otherPickupAddress.state && errors.otherPickupAddress.state.length > 0 && <div className="text-danger">{errors.otherPickupAddress.state}</div>}
								</Col>

								<Col md={4}>
									<label>Pincode</label>
									<Input
										placeholder="Pincode"
										value={address.otherPickupAddress.pincode}
										onChange={(e) =>
											updateAddress(
												"otherPickupAddress",
												"pincode",
												e.target.value
											)
										}
									/>
									{errors.otherPickupAddress && errors.otherPickupAddress.pincode && errors.otherPickupAddress.pincode.length > 0 && <div className="text-danger">{errors.otherPickupAddress.pincode}</div>}
								</Col>
							</Row>
						</FormGroup>

						<FormGroup>
							<h6>Return Pickup Address *</h6>

							<label className='mt-2'>Address Line 1</label>
							<Input
								placeholder="Address Line 1"
								value={address.returnPickupAddress.addressLine1}
								onChange={(e) =>
									updateAddress(
										"returnPickupAddress",
										"addressLine1",
										e.target.value
									)
								}
							/>
							{errors.returnPickupAddress && errors.returnPickupAddress.addressLine1 && errors.returnPickupAddress.addressLine1.length > 0 && <div className="text-danger">{errors.returnPickupAddress.addressLine1}</div>}

							<label className='mt-2'>Address Line 2</label>
							<Input
								placeholder="Address Line 2"
								value={address.returnPickupAddress.addressLine2}
								onChange={(e) =>
									updateAddress(
										"returnPickupAddress",
										"addressLine2",
										e.target.value
									)
								}
							/>
							{errors.returnPickupAddress && errors.returnPickupAddress.addressLine2 && errors.returnPickupAddress.addressLine2.length > 0 && <div className="text-danger">{errors.returnPickupAddress.addressLine2}</div>}

							<Row className="mt-2">
								<Col md={4}>
									<label>City</label>
									<Input
										placeholder="City"
										value={address.returnPickupAddress.city}
										onChange={(e) =>
											updateAddress(
												"returnPickupAddress",
												"city",
												e.target.value
											)
										}
									/>
									{errors.returnPickupAddress && errors.returnPickupAddress.city && errors.returnPickupAddress.city.length > 0 && <div className="text-danger">{errors.returnPickupAddress.city}</div>}
								</Col>

								<Col md={4}>
									<label>State</label>
									<Input
										type="select"
										placeholder="State"
										value={address.returnPickupAddress.state}
										onChange={(e) =>
											updateAddress(
												"returnPickupAddress",
												"state",
												e.target.value
											)
										}
									>
										{states.map((state) => (
											<option key={state} value={state}>
												{state}
											</option>
										))}
									</Input>
									{errors.returnPickupAddress && errors.returnPickupAddress.state && errors.returnPickupAddress.state.length > 0 && <div className="text-danger">{errors.returnPickupAddress.state}</div>}
								</Col>

								<Col md={4}>
									<label>Pincode</label>
									<Input
										placeholder="Pincode"
										value={address.returnPickupAddress.pincode}
										onChange={(e) =>
											updateAddress(
												"returnPickupAddress",
												"pincode",
												e.target.value
											)
										}
									/>
									{errors.returnPickupAddress && errors.returnPickupAddress.pincode && errors.returnPickupAddress.pincode.length > 0 && <div className="text-danger">{errors.returnPickupAddress.pincode}</div>}
								</Col>
							</Row>
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