import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  FormFeedback,
  Alert
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import LogoLg from "../assets/images/logo/logo.png";
import Loginimg from "../assets/images/common/login-img.jpg";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../components/ToastifyNotification";
import { LOGIN_SUCCESS } from "../reducers/authReducer";
import { SignupApi, VerifySignupOtpApi } from "../api/authAPI";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // View state: 1 = Signup Form, 2 = OTP Verification
  const [step, setStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "", // Added confirm password
  });
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Password visibility toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & Error states
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated) || false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // ---------------------------------------------------------
  // VALIDATION LOGIC
  // ---------------------------------------------------------
  const validateSignup = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = (otpString) => {
    if (!otpString || otpString.length < 6) {
      setErrors({ ...errors, otp: "Please enter the complete 6-digit OTP" });
      return false;
    }
    if (!/^\d{6}$/.test(otpString)) {
      setErrors({ ...errors, otp: "OTP must contain only numbers" });
      return false;
    }
    setErrors({ ...errors, otp: "" });
    return true;
  };

  // ---------------------------------------------------------
  // STEP 1: Handle Signup
  // ---------------------------------------------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateSignup()) return;

    try {
      // Remove confirmPassword from the payload before sending to backend
      const { confirmPassword, ...payloadData } = formData;
      const response = await SignupApi(payloadData);
      
      if (response.status === true) {
        showToast("success", response.message || "OTP sent successfully");
        setStep(2); // Switch to OTP view
      } else {
        setApiError(response.message);
        showToast("error", response.message);
      }
    } catch (error) {
      const errorMsg = error?.message || "An error occurred during sign up";
      setApiError(errorMsg);
      showToast("error", errorMsg);
    }
  };

  // ---------------------------------------------------------
  // STEP 2: Handle OTP Verification
  // ---------------------------------------------------------
  const handleOtpInputChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return; // Only allow numbers
    if (value.length > 1) return;

    setErrors({ ...errors, otp: "" });
    if (apiError) setApiError("");

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    setErrors({ ...errors, otp: "" });
    if (apiError) setApiError("");

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);

    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex < 6 && lastFilledIndex >= 0) {
      const nextInput = document.getElementById(`otp-${lastFilledIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setApiError("");
    const otpString = otp.join("");

    if (!validateOtp(otpString)) return;

    try {
      const { confirmPassword, ...payloadData } = formData;
      const payload = {
        ...payloadData, // email, phone, firstName, lastName, password
        otp: otpString,
      };

      const response = await VerifySignupOtpApi(payload);

      if (response.status === true) {
        showToast("success", response.message);
        localStorage.setItem("token", response.token);
        dispatch({ type: LOGIN_SUCCESS, payload: { response } });
        navigate("/");
      } else {
        setApiError(response.message);
        showToast("error", response.message);
      }
    } catch (error) {
      const errorMsg = error?.message || "An error occurred during OTP verification";
      setApiError(errorMsg);
      showToast("error", errorMsg);
    }
  };

  // Helper function to handle input changes and clear errors
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
    if (apiError) setApiError("");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={9}>
          <Card>
            <CardBody>
              <Row>
                {/* Left side Image */}
                <Col md="6" className="d-none d-md-block">
                  <img src={Loginimg} alt="Signup" width="100%" />
                </Col>

                {/* Right side Forms */}
                <Col md="6">
                  <img src={LogoLg} alt="Logo" width={200} className="pb-5" />
                  
                  {step === 1 ? (
                    /* ---------------- SIGNUP FORM ---------------- */
                    <>
                      <h4 className="mb-0 text-start">Sign Up</h4>
                      <hr />

                      {apiError && (
                        <Alert color="danger" className="text-start">
                          {apiError}
                        </Alert>
                      )}

                      <Form onSubmit={handleSignup} noValidate>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                type="text"
                                placeholder="First name"
                                value={formData.firstName}
                                invalid={!!errors.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                              />
                              {errors.firstName && <FormFeedback>{errors.firstName}</FormFeedback>}
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label for="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                type="text"
                                placeholder="Last name"
                                value={formData.lastName}
                                invalid={!!errors.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                              />
                              {errors.lastName && <FormFeedback>{errors.lastName}</FormFeedback>}
                            </FormGroup>
                          </Col>
                        </Row>

                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            invalid={!!errors.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                          {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
                        </FormGroup>

                        <FormGroup>
                          <Label for="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="text"
                            placeholder="10-digit phone number"
                            value={formData.phone}
                            invalid={!!errors.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                          />
                          {errors.phone && <FormFeedback>{errors.phone}</FormFeedback>}
                        </FormGroup>

                        {/* Password Field */}
                        <FormGroup>
                          <Label for="password">Password</Label>
                          <div className="position-relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              value={formData.password}
                              invalid={!!errors.password}
                              onChange={(e) => handleInputChange("password", e.target.value)}
                              style={{ paddingRight: "40px" }}
                            />
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="position-absolute"
                              style={{
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                zIndex: 10,
                              }}
                            >
                              {showPassword ? "🙈" : "👁️"}
                            </span>
                          </div>
                          {errors.password && <FormFeedback className="d-block">{errors.password}</FormFeedback>}
                        </FormGroup>

                        {/* Confirm Password Field */}
                        <FormGroup>
                          <Label for="confirmPassword">Confirm Password</Label>
                          <div className="position-relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              invalid={!!errors.confirmPassword}
                              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                              style={{ paddingRight: "40px" }}
                            />
                            <span
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="position-absolute"
                              style={{
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                zIndex: 10,
                              }}
                            >
                              {showConfirmPassword ? "🙈" : "👁️"}
                            </span>
                          </div>
                          {errors.confirmPassword && <FormFeedback className="d-block">{errors.confirmPassword}</FormFeedback>}
                        </FormGroup>

                        <Button className="btn btn-primary mb-3 mt-2" block type="submit">
                          Sign Up & Send OTP
                        </Button>
                        <Link to="/login">Already have an account? Login</Link>
                      </Form>
                    </>
                  ) : (
                    /* ---------------- OTP FORM ---------------- */
                    <>
                      <h4 className="mb-0 mt-3 text-start">Verify OTP</h4>
                      <p className="text-muted small">Code sent to {formData.email}</p>
                      <hr />

                      {apiError && (
                        <Alert color="danger" className="text-start">
                          {apiError}
                        </Alert>
                      )}

                      <Form onSubmit={verifyOtp} noValidate>
                        <FormGroup>
                          <Label>Enter 6-digit OTP</Label>
                          <div className="d-flex gap-2 mb-1">
                            {otp.map((digit, index) => (
                              <Input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                invalid={!!errors.otp}
                                onChange={(e) => handleOtpInputChange(e.target.value, index)}
                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                onPaste={handleOtpPaste}
                                style={{
                                  width: "45px",
                                  height: "50px",
                                  fontSize: "1.5rem",
                                  textAlign: "center",
                                }}
                                id={`otp-${index}`}
                              />
                            ))}
                          </div>
                          {errors.otp && <div className="text-danger small mt-1">{errors.otp}</div>}
                        </FormGroup>
                        <Button className="btn btn-primary mt-3" block type="submit">
                          Verify OTP
                        </Button>

                        <div className="text-center mt-3">
                          <span
                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                            onClick={() => {
                              setStep(1);
                              setApiError("");
                            }}
                          >
                            Back to Sign Up
                          </span>
                        </div>
                      </Form>
                    </>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;