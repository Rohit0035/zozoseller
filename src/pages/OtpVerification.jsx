import React, { useState, useRef, useEffect } from "react";
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
  Label
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import LogoLg from "../assets/images/logo-lg.png";
import Loginimg from "../assets/images/common/login-img.jpg";
import { useDispatch } from "react-redux";
import { showToast } from "../components/ToastifyNotification";
import { LOGIN_SUCCESS } from "../reducers/authReducer";
import {sellerVerifyLoginOtp} from '../api/sellerAPI'

const OtpVerification = () => {

  const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [otp, setOtp] = useState(["", "", "", "", "", ""]); // State for 4 inputs

    const location = useLocation();

    const emailOrPhone = location.state?.emailOrPhone || '';

    useEffect(() => {
      console.log('emailOrPhone',emailOrPhone);
        if(!emailOrPhone){
            navigate('/sign-in')
        }
    }, [emailOrPhone])

    const handleInputChange = (value, index) => {
        if (value.length > 1) return; // Ensure single character input

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus on the next input if value is entered and index < 3
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
        const pasteData = e.clipboardData.getData("text").slice(0, 6); // Get up to 4 characters
        const newOtp = [...otp];
        for (let i = 0; i < pasteData.length; i++) {
            if (i < 6) {
                newOtp[i] = pasteData[i];
            }
        }
        setOtp(newOtp);

        // Optionally, move focus to the last filled input
        const lastFilledIndex = pasteData.length - 1;
        if (lastFilledIndex < 6) {
            const nextInput = document.getElementById(`otp-${lastFilledIndex}`);
            if (nextInput) nextInput.focus();
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            const data = {
                emailOrPhone: emailOrPhone,
                otp: otp.join(""),
            }
            if(!otp.join("")){
                showToast('error','Otp is required')
                return;
            }
            const response = await sellerVerifyLoginOtp(data); // Make sure login function returns token

            if (response.success == true) {
                showToast('success', response.message)
                localStorage.setItem('token', response.token); // Store token in localStorage
                // localStorage.setItem('user', JSON.stringify(response.data.customer));
                dispatch({ type: LOGIN_SUCCESS, payload: { response } }); // Dispatch LOGIN_SUCCESS action

                navigate('/'); // Redirect upon successful login
                // navigate('/verify-otp'); // Redirect upon successful login
            } else {
                // setError(response.message);
                showToast('error', response.message)
            }

        } catch (error) {
            // setError(error); // Handle login errors
            showToast('error', error)
        }
    };
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={9}>
          <Card>
            <CardBody>
              {/* OTP Form Section */}
              <Row>
                <Col md="6" className="d-none d-md-block">
                  <img src={Loginimg} alt="" width="100%" />
                </Col>
                <Col md="6">
                  <img src={LogoLg} alt="" width={200} className="pb-5" />
                  <h4 className="mb-0 mt-3 text-start">Verify OTP</h4>
                  <hr />
                  <Form onSubmit={verifyOtp}>
                    <FormGroup>
                      <Label>Enter 6-digit OTP</Label>
                      <div className="d-flex gap-2 mb-3">
                        {otp.map((digit, index) =>
                          <Input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={e =>
                              handleInputChange(e.target.value, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            style={{
                              width: "45px",
                              height: "50px",
                              fontSize: "1.5rem",
                              textAlign: "center"
                            }}
                            id={`otp-${index}`}
                          />
                        )}
                      </div>
                    </FormGroup>
                    <Button className="btn btn-primary" block type="submit">
                      Verify OTP
                    </Button>
                  </Form>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OtpVerification;
