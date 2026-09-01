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
	Form,
	FormGroup,
	Label,
	Input
} from "reactstrap";
import { FaEdit } from "react-icons/fa";
import { buildFormData } from "../../utils/common";
import { GetCities, GetStates } from "../../api/sellerProfileAPI";

const COUNTRY_ID = "101";

const ADDRESS_TYPES = [
	{
		key: "billingAddress",
		title: "Billing Address",
		sameCheckbox: null
	},
	{
		key: "pickupAddress",
		title: "Pickup Address",
		sameCheckbox: "billing"
	},
	{
		key: "otherPickupAddress",
		title: "Other Pickup Address",
		sameCheckbox: "pickup"
	},
	{
		key: "returnPickupAddress",
		title: "Return Pickup Address",
		sameCheckbox: null
	}
];

const createEmptyAddress = () => ({
	companyName: "",
	address1: "",
	address2: "",
	mobile: "",
	country: "India",
	country_id: COUNTRY_ID,
	city: "",
	city_id: "",
	state: "",
	state_id: "",
	pincode: "",
	ithinkAddressId: ""
});

const AddressForm = ({
	type,
	title,
	address,
	states,
	cities,
	errors,
	updateAddress,
	handleStateChange,
	handleCityChange
}) => {
	const addressErrors = errors[type] || {};

	return (
		<FormGroup className="mb-4">
			<h6>{title} *</h6>

			{/* Company Name */}
			<label className="mt-2">Company Name</label>

			<Input
				placeholder="Company Name"
				value={address.companyName || ""}
				onChange={(e) =>
					updateAddress(type, "companyName", e.target.value)
				}
			/>

			{addressErrors.companyName && (
				<div className="text-danger">
					{addressErrors.companyName}
				</div>
			)}

			{/* Address Line 1 */}
			<label className="mt-2">Address Line 1</label>

			<Input
				placeholder="Address Line 1"
				value={address.address1 || ""}
				onChange={(e) =>
					updateAddress(type, "address1", e.target.value)
				}
			/>

			{addressErrors.address1 && (
				<div className="text-danger">
					{addressErrors.address1}
				</div>
			)}

			{/* Address Line 2 */}
			<label className="mt-2">Address Line 2</label>

			<Input
				placeholder="Address Line 2"
				value={address.address2 || ""}
				onChange={(e) =>
					updateAddress(type, "address2", e.target.value)
				}
			/>

			{addressErrors.address2 && (
				<div className="text-danger">
					{addressErrors.address2}
				</div>
			)}

			{/* Mobile Number */}
			<label className="mt-2">Mobile Number</label>
			<Input
				placeholder="Mobile Number"
				value={address.mobile || ""}
				onChange={(e) =>
					updateAddress(type, "mobile", e.target.value)
				}
			/>

			{addressErrors.mobile && (
				<div className="text-danger">
					{addressErrors.mobile}
				</div>
			)}

			<Row className="mt-2">

				{/* State */}
				<Col md={4}>
					<label>State *</label>

					<Input
						type="select"
						value={address.state_id || ""}
						onChange={(e) =>
							handleStateChange(type, e.target.value)
						}
					>
						<option value="">Select State</option>

						{states.map((state) => (
							<option key={state.id} value={state.id}>
								{state.state_name}
							</option>
						))}
					</Input>

					{addressErrors.state && (
						<div className="text-danger">
							{addressErrors.state}
						</div>
					)}
				</Col>

				{/* City */}
				<Col md={4}>
					<label>City *</label>

					<Input
						type="select"
						value={address.city_id || ""}
						disabled={!address.state_id}
						onChange={(e) =>
							handleCityChange(type, e.target.value)
						}
					>
						<option value="">
							{address.state_id
								? "Select City"
								: "Select State First"}
						</option>

						{(cities[type] || []).map((city) => (
							<option key={city.id} value={city.id}>
								{city.city_name}
							</option>
						))}
					</Input>

					{addressErrors.city && (
						<div className="text-danger">
							{addressErrors.city}
						</div>
					)}
				</Col>

				{/* Pincode */}
				<Col md={4}>
					<label>Pincode *</label>

					<Input
						placeholder="Pincode"
						value={address.pincode || ""}
						onChange={(e) =>
							updateAddress(type, "pincode", e.target.value)
						}
					/>

					{addressErrors.pincode && (
						<div className="text-danger">
							{addressErrors.pincode}
						</div>
					)}
				</Col>

			</Row>
		</FormGroup>
	);
};

const AddressDetails = ({ profileData, handleSubmit }) => {
	const [modal, setModal] = useState(false);

	const [sameAsBilling, setSameAsBilling] = useState(false);
	const [sameAsPickup, setSameAsPickup] = useState(false);

	const [states, setStates] = useState([]);

	const [cities, setCities] = useState({
		billingAddress: [],
		pickupAddress: [],
		otherPickupAddress: [],
		returnPickupAddress: []
	});

	const [errors, setErrors] = useState({});

	const [address, setAddress] = useState({
		billingAddress: createEmptyAddress(),
		pickupAddress: createEmptyAddress(),
		otherPickupAddress: createEmptyAddress(),
		returnPickupAddress: createEmptyAddress()
	});

	const toggle = () => {
		setModal((prev) => !prev);
	};

	// --------------------------------------------------
	// LOAD STATES
	// --------------------------------------------------

	useEffect(() => {
		const loadStates = async () => {
			try {
				const response = await GetStates(COUNTRY_ID);

				if (response?.success) {
					setStates(response.data || []);
				}
			} catch (error) {
				console.error("Failed to load states:", error);
			}
		};

		loadStates();
	}, []);

	// --------------------------------------------------
	// LOAD PROFILE ADDRESS
	// --------------------------------------------------

	useEffect(() => {
		if (!profileData?.addressDetails) return;

		const details = profileData.addressDetails;

		setAddress({
			billingAddress: {
				...createEmptyAddress(),
				...(details.billingAddress || {})
			},

			pickupAddress: {
				...createEmptyAddress(),
				...(details.pickupAddress || {})
			},

			otherPickupAddress: {
				...createEmptyAddress(),
				...(details.otherPickupAddress || {})
			},

			returnPickupAddress: {
				...createEmptyAddress(),
				...(details.returnPickupAddress || {})
			}
		});
	}, [profileData]);

	// --------------------------------------------------
	// LOAD CITIES
	// --------------------------------------------------

	const loadCities = async (type, stateId) => {
		if (!stateId) {
			setCities((prev) => ({
				...prev,
				[type]: []
			}));

			return;
		}

		try {
			const response = await GetCities(stateId);

			if (response?.success) {
				setCities((prev) => ({
					...prev,
					[type]: response.data || []
				}));
			}
		} catch (error) {
			console.error("Failed to load cities:", error);

			setCities((prev) => ({
				...prev,
				[type]: []
			}));
		}
	};

	// --------------------------------------------------
	// UPDATE ADDRESS
	// --------------------------------------------------

	const updateAddress = (type, field, value) => {
		setAddress((prev) => ({
			...prev,

			[type]: {
				...prev[type],
				[field]: value
			}
		}));
	};

	// --------------------------------------------------
	// STATE CHANGE
	// --------------------------------------------------

	const handleStateChange = (type, stateId) => {
		const selectedState = states.find(
			(state) => String(state.id) === String(stateId)
		);

		setAddress((prev) => ({
			...prev,

			[type]: {
				...prev[type],

				state_id: stateId,
				state: selectedState?.state_name || "",

				city_id: "",
				city: ""
			}
		}));

		loadCities(type, stateId);
	};

	// --------------------------------------------------
	// CITY CHANGE
	// --------------------------------------------------

	const handleCityChange = (type, cityId) => {
		const selectedCity = (cities[type] || []).find(
			(city) => String(city.id) === String(cityId)
		);

		setAddress((prev) => ({
			...prev,

			[type]: {
				...prev[type],

				city_id: cityId,
				city: selectedCity?.city_name || ""
			}
		}));
	};

	// --------------------------------------------------
	// LOAD CITIES FOR EXISTING ADDRESSES
	// --------------------------------------------------

	useEffect(() => {
		if (!states.length) return;

		Object.entries(address).forEach(([type, value]) => {
			if (value.state_id && !(cities[type] || []).length) {
				loadCities(type, value.state_id);
			}
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [states]);

	// --------------------------------------------------
	// SAME AS BILLING
	// --------------------------------------------------

	const handleSameAsBilling = (checked) => {
		setSameAsBilling(checked);

		if (checked) {
			setAddress((prev) => ({
				...prev,

				pickupAddress: {
					...prev.billingAddress,

					// Pickup has its own iThink ID
					ithinkAddressId:
						prev.pickupAddress.ithinkAddressId || ""
				}
			}));

			// Use billing cities for pickup
			setCities((prev) => ({
				...prev,

				pickupAddress: prev.billingAddress
			}));
		}
	};

	// --------------------------------------------------
	// SAME AS PICKUP
	// --------------------------------------------------

	const handleSameAsPickup = (checked) => {
		setSameAsPickup(checked);

		if (checked) {
			setAddress((prev) => ({
				...prev,

				otherPickupAddress: {
					...prev.pickupAddress,

					// Other pickup should NOT have this field
					ithinkAddressId: undefined
				},

				returnPickupAddress: {
					...prev.pickupAddress,

					// Return pickup has its own ID
					ithinkAddressId:
						prev.returnPickupAddress.ithinkAddressId || ""
				}
			}));

			setCities((prev) => ({
				...prev,

				otherPickupAddress: prev.pickupAddress,
				returnPickupAddress: prev.pickupAddress
			}));
		}
	};

	// --------------------------------------------------
	// KEEP SAME ADDRESSES UPDATED
	// --------------------------------------------------

	useEffect(() => {
		if (!sameAsBilling) return;

		setAddress((prev) => ({
			...prev,

			pickupAddress: {
				...prev.billingAddress
			}
		}));

		setCities((prev) => ({
			...prev,

			pickupAddress: prev.billingAddress
		}));
	}, [address.billingAddress, sameAsBilling]);

	useEffect(() => {
		if (!sameAsPickup) return;

		setAddress((prev) => ({
			...prev,

			otherPickupAddress: {
				...prev.pickupAddress
			},

			returnPickupAddress: {
				...prev.pickupAddress
			}
		}));

		setCities((prev) => ({
			...prev,

			otherPickupAddress: prev.pickupAddress,
			returnPickupAddress: prev.pickupAddress
		}));
	}, [address.pickupAddress, sameAsPickup]);

	// --------------------------------------------------
	// VALIDATION
	// --------------------------------------------------
	const pincodeRegex = /^[0-9]{6}$/;

	const validate = () => {
		const newErrors = {};

		Object.entries(address).forEach(([key, value]) => {
			const addressErrors = {};

			if (!value.companyName?.trim()) {
				addressErrors.companyName =
					"Company Name is required";
			}

			if (!value.address1?.trim()) {
				addressErrors.address1 =
					"Address Line 1 is required";
			}

			if (!value.mobile?.trim()) {
				addressErrors.mobile =
					"Mobile Number is required";
			}

			if (!value.state_id) {
				addressErrors.state = "State is required";
			}

			if (!value.city_id) {
				addressErrors.city = "City is required";
			}

			if (!value.pincode?.trim()) {
				addressErrors.pincode = "Pincode is required";
			} else if (!pincodeRegex.test(value.pincode)) {
				addressErrors.pincode = "Enter a valid pincode";
			}

			if (Object.keys(addressErrors).length) {
				newErrors[key] = addressErrors;
			}
		});

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	// --------------------------------------------------
	// SAVE
	// --------------------------------------------------

	const handleSave = () => {
		if (!validate()) return;

		const formData = buildFormData(
			"addressDetails",
			address
		);
		// console.log(address);
		// return
		handleSubmit(formData);

		toggle();
	};

	return (
		<Card className="h-100 bg-light shadow-sm border-0">
			<CardBody>

				{/* HEADER */}
				<div className="d-flex justify-content-between mb-2">
					<h6>Address Details</h6>

					<Button color="link" onClick={toggle}>
						<FaEdit size={14} /> EDIT
					</Button>
				</div>

				{/* ADDRESS DISPLAY */}
				{ADDRESS_TYPES.map(({ key, title }) => {
					const item = address[key];

					return (
						<div className="mb-3" key={key}>
							<strong>{title}:</strong>
							<br />

							{item.address1 && (
								<>
									{item.address1}
									<br />
								</>
							)}

							{item.address2 && (
								<>
									{item.address2}
									<br />
								</>
							)}

							{item.city && (
								<>
									{item.city}, {item.state}
									{item.pincode && ` - ${item.pincode}`}
								</>
							)}
						</div>
					);
				})}

			</CardBody>

			{/* =====================================================
          EDIT MODAL
      ===================================================== */}

			<Modal
				isOpen={modal}
				toggle={toggle}
				size="lg"
			>
				<ModalHeader toggle={toggle}>
					Edit Address
				</ModalHeader>

				<Form>
					<ModalBody>

						{/* ADDRESS FORMS */}
						{ADDRESS_TYPES.map(
							({ key, title }) => (
								<React.Fragment key={key}>

									<AddressForm
										type={key}
										title={title}
										address={address[key]}
										states={states}
										cities={cities}
										errors={errors}
										updateAddress={updateAddress}
										handleStateChange={handleStateChange}
										handleCityChange={handleCityChange}
									/>

									{/* SAME AS BILLING */}
									{key === "billingAddress" && (
										<FormGroup
											check
											className="mb-3"
										>
											<Input
												type="checkbox"
												checked={sameAsBilling}
												onChange={(e) =>
													handleSameAsBilling(
														e.target.checked
													)
												}
											/>

											<Label check>
												Same as Billing Address
											</Label>
										</FormGroup>
									)}

									{/* SAME AS PICKUP */}
									{key === "pickupAddress" && (
										<FormGroup
											check
											className="mb-3"
										>
											<Input
												type="checkbox"
												checked={sameAsPickup}
												onChange={(e) =>
													handleSameAsPickup(
														e.target.checked
													)
												}
											/>

											<Label check>
												Same as Pickup Address
											</Label>
										</FormGroup>
									)}

								</React.Fragment>
							)
						)}

					</ModalBody>

					<ModalFooter>

						<Button
							color="primary"
							onClick={handleSave}
						>
							Save
						</Button>

						<Button onClick={toggle}>
							Cancel
						</Button>

					</ModalFooter>
				</Form>
			</Modal>
		</Card>
	);
};

export default AddressDetails;