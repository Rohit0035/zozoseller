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
import { useSelector } from "react-redux";
import { showToast } from "../components/ToastifyNotification";
// ADD ForgotPasswordVerifyOtpApi TO YOUR authAPI.js FILE
import { ForgotPasswordSendOtpApi, ForgotPasswordVerifyOtpApi, ResetPasswordApi } from "../api/authAPI";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // View state: 1 = Email, 2 = Verify OTP, 3 = Reset Password
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
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
  // STEP 1: Send OTP to Email
  // ---------------------------------------------------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    try {
      const response = await ForgotPasswordSendOtpApi({ email });
      if (response.status === true) {
        showToast("success", response.message || "OTP sent successfully");
        setStep(2);
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      setApiError(error?.message || "An error occurred");
    }
  };

  // ---------------------------------------------------------
  // STEP 2: Verify OTP
  // ---------------------------------------------------------
  const handleOtpInputChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;
    if (value.length > 1) return;

    setErrors({});
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setApiError("");
    const otpString = otp.join("");

    if (!otpString || otpString.length < 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return;
    }

    try {
      // NOTE: Ensure you create this API function in authAPI.js
      const response = await ForgotPasswordVerifyOtpApi({ email, otp: otpString });
      
      if (response.status === true) {
        showToast("success", response.message);
        setStep(3); // Move to password step
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      setApiError(error?.message || "An error occurred during verification");
    }
  };

  // ---------------------------------------------------------
  // STEP 3: Handle Password Reset
  // ---------------------------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setApiError("");
    let newErrors = {};

    if (!password) {
      newErrors.password = "New Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        email: email,
        otp: otp.join(""), // Pass the authorized OTP
        password: password,
      };

      const response = await ResetPasswordApi(payload);

      if (response.status === true) {
        showToast("success", "Password reset successfully. Please login.");
        navigate("/login"); 
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      setApiError(error?.message || "An error occurred during password reset");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={9}>
          <Card>
            <CardBody>
              <Row>
                <Col md="6" className="d-none d-md-block">
                  <img src={Loginimg} alt="Forgot Password" width="100%" />
                </Col>

                <Col md="6">
                  <img src={LogoLg} alt="Logo" width={200} className="pb-5" />

                  {apiError && <Alert color="danger" className="text-start">{apiError}</Alert>}

                  {step === 1 && (
                    /* ---------------- STEP 1: EMAIL FORM ---------------- */
                    <>
                      <h4 className="mb-0 mt-3 text-start">Forgot Password</h4>
                      <p className="text-muted small">Enter your email to receive an OTP.</p>
                      <hr />

                      <Form onSubmit={handleSendOtp} noValidate>
                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            invalid={!!errors.email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
                        </FormGroup>

                        <Button className="btn btn-primary mb-3 mt-3" block type="submit">
                          Send OTP
                        </Button>
                        <div className="text-center mt-3">
                          <Link to="/login" style={{ textDecoration: "underline" }}>Back to Login</Link>
                        </div>
                      </Form>
                    </>
                  )}

                  {step === 2 && (
                    /* ---------------- STEP 2: VERIFY OTP FORM ---------------- */
                    <>
                      <h4 className="mb-0 mt-3 text-start">Verify OTP</h4>
                      <p className="text-muted small">Code sent to {email}</p>
                      <hr />

                      <Form onSubmit={handleVerifyOtp} noValidate>
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

                        <Button className="btn btn-primary mt-4" block type="submit">
                          Verify OTP
                        </Button>

                        <div className="text-center mt-3">
                          <span
                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                            onClick={() => { setStep(1); setApiError(""); }}
                          >
                            Back to Email
                          </span>
                        </div>
                      </Form>
                    </>
                  )}

                  {step === 3 && (
                    /* ---------------- STEP 3: RESET PASSWORD FORM ---------------- */
                    <>
                      <h4 className="mb-0 mt-3 text-start">Create New Password</h4>
                      <p className="text-muted small">Enter a strong new password.</p>
                      <hr />

                      <Form onSubmit={handleResetPassword} noValidate>
                        <FormGroup className="mt-3">
                          <Label for="password">New Password</Label>
                          <div className="position-relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              value={password}
                              invalid={!!errors.password}
                              style={{ paddingRight: "40px" }}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="position-absolute"
                              style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 10 }}
                            >
                              {showPassword ? "🙈" : "👁️"}
                            </span>
                          </div>
                          {errors.password && <FormFeedback className="d-block">{errors.password}</FormFeedback>}
                        </FormGroup>

                        <FormGroup className="mt-3">
                          <Label for="confirmPassword">Confirm Password</Label>
                          <div className="position-relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              value={confirmPassword}
                              invalid={!!errors.confirmPassword}
                              style={{ paddingRight: "40px" }}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="position-absolute"
                              style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 10 }}
                            >
                              {showConfirmPassword ? "🙈" : "👁️"}
                            </span>
                          </div>
                          {errors.confirmPassword && <FormFeedback className="d-block">{errors.confirmPassword}</FormFeedback>}
                        </FormGroup>

                        <Button className="btn btn-primary mt-4" block type="submit">
                          Reset Password
                        </Button>
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

export default ForgotPassword;