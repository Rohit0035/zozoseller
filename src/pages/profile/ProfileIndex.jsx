import React, { useEffect, useState } from "react";
import {
	Card,
	CardBody,
	UncontrolledAccordion,
	AccordionItem,
	AccordionHeader,
	AccordionBody,
	Row,
	Col,
	Breadcrumb,
	BreadcrumbItem
} from "reactstrap";
import {
	FaUserCog,
	FaUniversity,
	FaBuilding,
	FaNetworkWired,
	FaCheckCircle,
	FaBrain
} from "react-icons/fa";

import {
	GetProfileData,
	UpdateProfile
} from "../../api/sellerProfileAPI";
import { showToast } from "../../components/ToastifyNotification";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "../../reducers/authReducer";
import BusinessDetials from "../../components/profile/BusinessDetials";
import BrandDetails from "../../components/profile/BrandDetails";
import BankDetails from "../../components/profile/BankDetails";
import AddressDetails from "../../components/profile/AddressDetails";
import VendorBrands from "../../components/profile/VendorBrands";
import PersonalDetails from "../../components/profile/personalDetails";
import { FaLocationDot } from "react-icons/fa6";

const ProfileIndex = () => {
	const location = useLocation();
	const showPopup = (location.state && location.state.showPopup) || false;
	const [activeSection, setActiveSection] = useState("");
	const [loading, setLoading] = useState(false);
	const [profileData, setProfileData] = useState(null);

	const handleToggle = id => {
		setActiveSection(prev => (prev === id ? "" : id));
	};

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const isAuthenticated = useSelector(state => state.auth?.isAuthenticated) || false;

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		}
	}, [isAuthenticated]);

	const fetchProfileData = async () => {
		setLoading(true);
		try {
			const response = await GetProfileData();
			if (response.success) {
				setProfileData(response.data.user);
				dispatch({ type: SET_USER, payload: response.data.user });
			}
		} catch (err) {
			console.error("Error fetching profile data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfileData();
	}, []);

	const handleSubmit = async data => {
		console.log("data", data);
		setLoading(true);
		try {
			const response = await UpdateProfile(data);
			if (response.success) {
				showToast("success", response.message);
				// After a successful update, re-fetch profile data to show the new completion status
				fetchProfileData();
			} else {
				showToast("error", response.message);
			}
		} catch (err) {
			console.error("Error updating profile data:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (showPopup) {
			showToast("error", "Please complete your profile!");
		}
	}, [showPopup]);
	// You'll need to pass the updated handleSubmit function to the child components
	// for a seamless update experience.
	// The handleUpdate function in the child components (e.g., BusinessDetial) should call this handleSubmit.

	return (
		<div className="my-3">
			<Row className="justify-content-center">
				<Col md="12">
					<Card>
						<CardBody className="p-0">
							<UncontrolledAccordion
								stayOpen
								open={activeSection}
								style={{ border: "none" }}
							>

								{/* Business Details Section */}
								<AccordionItem className="mb-2 shadow-sm">
									<AccordionHeader targetId="businessDetails" onClick={() => handleToggle("businessDetails")}>
										<div className="d-flex align-items-center">
											<FaBuilding size={20} color="#0a399c" className="me-3" />
											<div>
												<h6 className="mb-0">Business Details</h6>
											</div>

											{profileData?.businessDetails?.updated && (
												<FaCheckCircle className="text-success ms-auto me-2" />
											)}
										</div>
									</AccordionHeader>

									<AccordionBody accordionId="businessDetails">
										<BusinessDetials
											profileData={profileData}
											handleSubmit={handleSubmit}
										/>
									</AccordionBody>
								</AccordionItem>

								{/* Bank Details Section */}
								<AccordionItem className="mb-2 shadow-sm">
									<AccordionHeader targetId="brandDetails" onClick={() => handleToggle("brandDetails")}>
										<div className="d-flex align-items-center">
											<FaBrain size={20} color="#0a399c" className="me-3" />
											<div>
												<h6 className="mb-0">Brand Details</h6>
											</div>

											{profileData?.brandDetails?.updated && (
												<FaCheckCircle className="text-success ms-auto me-2" />
											)}
										</div>
									</AccordionHeader>

									<AccordionBody accordionId="brandDetails">
										<VendorBrands />
									</AccordionBody>
								</AccordionItem>
								{/* <AccordionItem className="mb-2 shadow-sm">
									<AccordionHeader targetId="4" onClick={() => handleToggle("4")}>
										<div className="d-flex align-items-center">
											<FaBuilding size={20} color="#0a399c" className="me-3" />
											<div>
												<h6 className="mb-0">Brand Details</h6>
											</div>

											{profileData?.brandDetails?.updated && (
												<FaCheckCircle className="text-success ms-auto me-2" />
											)}
										</div>
									</AccordionHeader>

									<AccordionBody accordionId="4">
										<BrandDetails
											profileData={profileData}
											handleSubmit={handleSubmit}
										/>
									</AccordionBody>
								</AccordionItem> */}
								{/* Bank Details Section */}
								<AccordionItem className="mb-2 shadow-sm">
									<AccordionHeader targetId="bankDetails" onClick={() => handleToggle("bankDetails")}>
										<div className="d-flex align-items-center">
											<FaUniversity size={20} color="#0a399c" className="me-3" />
											<div>
												<h6 className="mb-0">Bank Details</h6>
											</div>

											{profileData?.bankDetails?.updated && (
												<FaCheckCircle className="text-success ms-auto me-2" />
											)}
										</div>
									</AccordionHeader>

									<AccordionBody accordionId="bankDetails">
										<BankDetails
											profileData={profileData}
											handleSubmit={handleSubmit}
										/>
									</AccordionBody>
								</AccordionItem>

								{/* Manage Sessions Section */}
								<AccordionItem className="mb-2 shadow-sm">
									<AccordionHeader targetId="addressDetails" onClick={() => handleToggle("addressDetails")}>
										<div className="d-flex align-items-center">
											<FaLocationDot size={20} color="#0a399c" className="me-3" />
											<div>
												<h6 className="mb-0">Address</h6>
												<p className="mb-0 text-dark" style={{ fontSize: "12px" }}>
													Manage your addresses
												</p>
											</div>

											{profileData?.addressDetails?.updated && (
												<FaCheckCircle className="text-success ms-auto me-2" />
											)}
										</div>
									</AccordionHeader>

									<AccordionBody accordionId="addressDetails">
										<AddressDetails
											profileData={profileData}
											handleSubmit={handleSubmit}
										/>
									</AccordionBody>
								</AccordionItem>
								
								{/* Manage Personal Details */}
								<AccordionItem className="mb-2 shadow-sm">
									<AccordionHeader targetId="personalDetails" onClick={() => handleToggle("personalDetails")}>
										<div className="d-flex align-items-center">
											<FaUserCog size={20} color="#0a399c" className="me-3" />
											<div>
												<h6 className="mb-0">Personal Details</h6>
												<p className="mb-0 text-dark" style={{ fontSize: "12px" }}>
													Manage your Personal Information
												</p>
											</div>

											{profileData?.personalDetails?.updated && (
												<FaCheckCircle className="text-success ms-auto me-2" />
											)}
										</div>
									</AccordionHeader>

									<AccordionBody accordionId="personalDetails">
										<PersonalDetails
											profileData={profileData}
											handleSubmit={handleSubmit}
										/>
									</AccordionBody>
								</AccordionItem>
							</UncontrolledAccordion>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ProfileIndex;
