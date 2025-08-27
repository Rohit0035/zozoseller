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
  FaCheckCircle
} from "react-icons/fa";
import Account from "../../components/profile/Account";
import BankDetails from "../../components/profile/BankDetails";
import BusinessDetial from "../../components/profile/BusinessDetial";
import ManageSessions from "../../components/profile/ManageSessions";
import {
  GetSellerProfileData,
  UpdateSellerProfile
} from "../../api/sellerProfileAPI";
import { showToast } from "../../components/ToastifyNotification";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_USER } from "../../reducers/authReducer";

// Helper function to calculate completion percentage for a card
const calculateCardCompletion = (data, requiredFields) => {
  if (!data) return 0;

  let completedFields = 0;
  requiredFields.forEach(field => {
    // Handle nested fields like 'pickupAddress.pinCode'
    const parts = field.split(".");
    let value = data;
    let isFieldPresent = true;
    for (const part of parts) {
      if (value && value[part] !== undefined) {
        value = value[part];
      } else {
        isFieldPresent = false;
        break;
      }
    }

    if (isFieldPresent && value !== null && value !== "") {
      completedFields++;
    }
  });

  return Math.round(completedFields / requiredFields.length * 100);
};

const ProfileIndex = () => {
  const location = useLocation();
  const showPopup = (location.state && location.state.showPopup) || true;
  const [activeSection, setActiveSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [webSessions, setWebSessions] = useState([]);
  const [appSessions, setAppSessions] = useState([]);

  const handleToggle = id => {
    setActiveSection(prev => (prev === id ? "" : id));
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await GetSellerProfileData();
      if (response.success) {
        setProfileData(response.data.user);
        dispatch({ type: SET_USER, payload: response.data.user });
        setWebSessions(response.data.webSessions);
        setAppSessions(response.data.appSessions);
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
      const response = await UpdateSellerProfile(data);
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

  // Define the required fields for each section
  const accountFields = [
    "name",
    "email",
    "phone",
    "displayName",
    "businessDescription",
    "pickupAddress.line1",
    "pickupAddress.pinCode",
    "pickupAddress.city"
  ];
  const bankDetailsFields = ["bankName", "accountNo", "ifscCode", "branchName"];
  const businessDetailsFields = [
    "companyName",
    "tan",
    "gstin",
    "companyAddress",
    "signature",
    "businessType",
    "pan",
    "addressProof",
    "state",
    "brandDetails.brandType",
    "brandDetails.brandName",
    "brandDetails.brandNameCertificate"
  ];

  // Calculate completion percentages
  const accountCompletion = calculateCardCompletion(profileData, accountFields);
  const bankDetailsCompletion = calculateCardCompletion(
    profileData,
    bankDetailsFields
  );
  const businessDetailsCompletion = calculateCardCompletion(
    profileData,
    businessDetailsFields
  );

  // You'll need to pass the updated handleSubmit function to the child components
  // for a seamless update experience.
  // The handleUpdate function in the child components (e.g., BusinessDetial) should call this handleSubmit.

  useEffect(
    () => {
      if (showPopup) {
        showToast("error", "Please complete your profile.");
      }
    },
    [showPopup]
  );
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
                {/* Account Section */}
                <AccordionItem className="mb-2 shadow-sm">
                  <AccordionHeader
                    targetId="1"
                    onClick={() => handleToggle("1")}
                  >
                    <div className="d-flex align-items-center">
                      <FaUserCog size={20} color="#0a399c" className="me-3" />
                      <div className="d-flex flex-column">
                        <h6 className="mb-0">
                          Account
                          <p
                            style={{ fontSize: "12px" }}
                            className="mt-0 mb-0 text-dark"
                          >
                            View your display information, pickup address, login
                            detail and primary details
                          </p>
                        </h6>
                      </div>
                      {accountCompletion === 100 &&
                        <FaCheckCircle className="text-success ms-auto me-2" />}
                      <span className="text-muted" style={{ fontSize: "14px" }}>
                        {accountCompletion}% Complete
                      </span>
                    </div>
                  </AccordionHeader>
                  <AccordionBody accordionId="1" className="p-2">
                    <Account
                      profileData={profileData}
                      handleSubmit={handleSubmit}
                    />
                  </AccordionBody>
                </AccordionItem>

                {/* Bank Details Section */}
                <AccordionItem className="mb-2 shadow-sm">
                  <AccordionHeader
                    targetId="3"
                    onClick={() => handleToggle("3")}
                  >
                    <div className="d-flex align-items-center">
                      <FaUniversity
                        size={20}
                        color="#0a399c"
                        className="me-3"
                      />
                      <div className="d-flex flex-column">
                        <h6 className="mb-0">
                          Bank Details
                          <p
                            style={{ fontSize: "12px" }}
                            className="mt-0 mb-0 text-dark"
                          >
                            View your bank details
                          </p>
                        </h6>
                      </div>
                      {bankDetailsCompletion === 100 &&
                        <FaCheckCircle className="text-success ms-auto me-2" />}
                      <span className="text-muted" style={{ fontSize: "14px" }}>
                        {bankDetailsCompletion}% Complete
                      </span>
                    </div>
                  </AccordionHeader>
                  <AccordionBody accordionId="3" className="p-2">
                    <BankDetails
                      profileData={profileData}
                      handleSubmit={handleSubmit}
                    />
                  </AccordionBody>
                </AccordionItem>

                {/* Business Details Section */}
                <AccordionItem className="mb-2 shadow-sm">
                  <AccordionHeader
                    targetId="4"
                    onClick={() => handleToggle("4")}
                  >
                    <div className="d-flex align-items-center">
                      <FaBuilding size={20} color="#0a399c" className="me-3" />
                      <div className="d-flex flex-column">
                        <h6 className="mb-0">
                          Business Details
                          <p
                            style={{ fontSize: "12px" }}
                            className="mt-0 mb-0 text-dark"
                          >
                            View your business details and KYC documents
                          </p>
                        </h6>
                      </div>
                      {businessDetailsCompletion === 100 &&
                        <FaCheckCircle className="text-success ms-auto me-2" />}
                      <span className="text-muted" style={{ fontSize: "14px" }}>
                        {businessDetailsCompletion}% Complete
                      </span>
                    </div>
                  </AccordionHeader>
                  <AccordionBody accordionId="4" className="p-2">
                    <BusinessDetial
                      profileData={profileData}
                      handleSubmit={handleSubmit}
                    />
                  </AccordionBody>
                </AccordionItem>

                {/* Manage Sessions Section */}
                <AccordionItem className="mb-2 shadow-sm">
                  <AccordionHeader
                    targetId="9"
                    onClick={() => handleToggle("9")}
                  >
                    <div className="d-flex align-items-center">
                      <FaNetworkWired
                        size={20}
                        color="#0a399c"
                        className="me-3"
                      />
                      <div className="d-flex flex-column">
                        <h6 className="mb-0">
                          Manage Sessions
                          <p
                            style={{ fontSize: "12px" }}
                            className="mt-0 mb-0 text-dark"
                          >
                            Manage your sessions, view IP Address and delete
                            sessions.
                          </p>
                        </h6>
                      </div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody accordionId="9" className="py-2">
                    <ManageSessions
                      webSessions={webSessions}
                      appSessions={appSessions}
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
