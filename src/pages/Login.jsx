import React, { useState, useRef } from 'react';
import {
  Container, Row, Col, Card, CardBody,
  Form, FormGroup, Input, Button, Label
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import LogoLg from '../assets/images/logo-lg.png';
import Loginimg from '../assets/images/common/login-img.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate OTP send
      setShowOtpForm(true);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length === 6) {
      localStorage.setItem('token', 'dummy-auth-token');
      navigate('/');
    } else {
      alert('Please enter a valid 6-digit OTP');
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only digit or empty
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={9}>
          <Card>
            <CardBody>
              {/* Email Form Section */}
              {!showOtpForm && (
                <Row>
                  <Col md="6" className="d-none d-md-block">
                    <img src={Loginimg} alt="" width="100%" />
                  </Col>
                  <Col md="6">
                    <img src={LogoLg} alt="" width={200} className="pb-5" />
                    <h4 className="mb-0 mt-3 text-start">Login</h4>
                    <hr />
                    <Form onSubmit={handleSendOtp}>
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </FormGroup>
                      <Button className="btn btn-primary" block type="submit">
                        Send OTP
                      </Button>
                    </Form>
                  </Col>
                </Row>
              )}

              {/* OTP Form Section */}
              {showOtpForm && (
                <Row>
                  <Col md="6" className="d-none d-md-block">
                    <img src={Loginimg} alt="" width="100%" />
                  </Col>
                  <Col md="6">
                    <img src={LogoLg} alt="" width={200} className="pb-5" />
                    <h4 className="mb-0 mt-3 text-start">Verify OTP</h4>
                    <hr />
                    <Form onSubmit={handleVerifyOtp}>
                      <FormGroup>
                        <Label>Enter 6-digit OTP</Label>
                        <div className="d-flex gap-2 mb-3">
                          {otp.map((digit, index) => (
                            <Input
                              key={index}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(e.target.value, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              innerRef={(el) => (inputsRef.current[index] = el)}
                              style={{
                                width: '45px',
                                height: '50px',
                                fontSize: '1.5rem',
                                textAlign: 'center'
                              }}
                            />
                          ))}
                        </div>
                      </FormGroup>
                      <Button className="btn btn-primary" block type="submit">
                        Verify OTP
                      </Button>
                    </Form>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
