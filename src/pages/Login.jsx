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
import { LoginApi, VerifyLoginOtpApi } from "../api/authAPI";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // View state: 1 = Email/Password, 2 = OTP Verification
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Validation & Error states
  const [errors, setErrors] = useState({ email: "", password: "", otp: "" });
  const [apiError, setApiError] = useState(""); // State for showing API errors

  // Lockout Timer States (No localStorage)
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated) || false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // ---------------------------------------------------------
  // TIMER LOGIC FOR LOCKOUT
  // ---------------------------------------------------------
  useEffect(() => {
    if (!lockoutEndTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = lockoutEndTime - now;

      if (distance <= 0) {
        // Timer finished
        clearInterval(interval);
        setLockoutEndTime(null);
        setTimeLeft(0);
        setApiError("");
      } else {
        setTimeLeft(distance);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutEndTime]);

  // Format milliseconds into MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
  };

  // ---------------------------------------------------------
  // VALIDATION LOGIC (Untouched)
  // ---------------------------------------------------------
  const validateLogin = () => {
    let isValid = true;
    let newErrors = { email: "", password: "", otp: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
  // STEP 1: Handle Login (Email & Password)
  // ---------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError(""); // Clear previous errors on new submission

    if (!validateLogin()) return;

    try {
      const data = {
        email: email,
        password: password,
      };
      
      const response = await LoginApi(data);
      if (response.status === true) {
        showToast("success", response.message || "OTP sent successfully");
        setStep(2); 
      } else {
        // DETECT LOCKOUT: Check if backend sends lockUntil or a "locked" message
        if (response.lockUntil || (response.message && response.message.toLowerCase().includes("locked"))) {
          let endTime;
          if (response.lockUntil) {
            endTime = new Date(response.lockUntil).getTime();
          } else {
            // Fallback: extract minutes from string (e.g., "locked for 30 minutes")
            const numbers = response.message.match(/\d+/);
            const minutes = numbers ? parseInt(numbers[0], 10) : 30; // default to 30 mins
            endTime = Date.now() + minutes * 60 * 1000;
          }
          setLockoutEndTime(endTime);
          setApiError(""); // Clear normal API error since we show timer
          showToast("error", "Account locked due to too many failed attempts");
        } else {
          // Normal invalid credentials error
          setApiError(response.message);
          showToast("error", response.message);
        }
      }
    } catch (error) {
      const errorMsg = error?.message || "An error occurred during login";
      setApiError(errorMsg);
      showToast("error", errorMsg);
    }
  };

  // ---------------------------------------------------------
  // STEP 2: Handle OTP Verification
  // ---------------------------------------------------------
  const handleInputChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;
    if (value.length > 1) return; 

    setErrors({ ...errors, otp: "" }); 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); 
    if (!pasteData) return;

    setErrors({ ...errors, otp: "" });

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) {
        newOtp[i] = pasteData[i];
      }
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
      const data = {
        email: email,
        otp: otpString,
      };

      const response = await VerifyLoginOtpApi(data);

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
      const errorMsg = error?.message || "An error occurred during verification";
      setApiError(errorMsg);
      showToast("error", errorMsg);
    }
  };

  // Determine if inputs should be disabled
  const isLocked = !!lockoutEndTime;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={9}>
          <Card>
            <CardBody>
              <Row>
                {/* Left side Image */}
                <Col md="6" className="d-none d-md-block">
                  <img src={Loginimg} alt="Login" width="100%" />
                </Col>

                {/* Right side Forms */}
                <Col md="6">
                  <img src={LogoLg} alt="Logo" width={200} className="pb-5" />
                  
                  {step === 1 ? (
                    /* ---------------- LOGIN FORM ---------------- */
                    <>
                      <h4 className="mb-0 mt-3 text-start">Login</h4>
                      <hr />
                      
                      {/* --- TIMER / API Error Alert --- */}
                      {isLocked ? (
                        <Alert color="danger" className="text-center">
                          Account is locked. Try again in <strong>{formatTime(timeLeft)}</strong>
                        </Alert>
                      ) : apiError ? (
                        <Alert color="danger" className="text-start">
                          {apiError}
                        </Alert>
                      ) : null}

                      <Form onSubmit={handleLogin} noValidate>
                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            invalid={!!errors.email}
                            disabled={isLocked}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors({ ...errors, email: "" });
                              if (apiError) setApiError(""); // Clear api error on typing
                            }}
                          />
                          {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
                        </FormGroup>

                        <FormGroup className="mt-3">
                          <Label for="password">Password</Label>
                          <div className="position-relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={password}
                              invalid={!!errors.password}
                              disabled={isLocked}
                              style={{ paddingRight: "40px" }}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors({ ...errors, password: "" });
                                if (apiError) setApiError(""); // Clear api error on typing
                              }}
                            />
                            <span
                              onClick={() => !isLocked && setShowPassword(!showPassword)}
                              className="position-absolute"
                              style={{
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: isLocked ? "not-allowed" : "pointer",
                                opacity: isLocked ? 0.5 : 1,
                                zIndex: 10,
                              }}
                            >
                              {showPassword ? "🙈" : "👁️"}
                            </span>
                          </div>
                          {errors.password && <FormFeedback className="d-block">{errors.password}</FormFeedback>}
                        </FormGroup>

                        <Button 
                          className="btn btn-primary mb-3 mt-3" 
                          block 
                          type="submit"
                          disabled={isLocked}
                        >
                          Login & Send OTP
                        </Button>
                        <div className="d-flex justify-content-between">
                          <Link to="/forgot-password">Forgot Password?</Link>
                          <Link to="/sign-up">New Here? Sign Up</Link>
                        </div>
                      </Form>
                    </>
                  ) : (
                    /* ---------------- OTP FORM ---------------- */
                    <>
                      <h4 className="mb-0 mt-3 text-start">Verify OTP</h4>
                      <p className="text-muted small">Code sent to {email}</p>
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
                                disabled={isLocked} // Disable OTP inputs if locked
                                onChange={(e) => {
                                  handleInputChange(e.target.value, index);
                                  if (apiError) setApiError(""); // Clear api error on typing
                                }}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
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
                        <Button className="btn btn-primary mt-3" block type="submit" disabled={isLocked}>
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
                            Back to Login
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

export default Login;