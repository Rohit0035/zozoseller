import React, { useState, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Form,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Otp = () => {
  const [otp, setOtp] = useState(Array(5).fill(''));
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Just navigate to /success page on submit
    navigate('/success');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <CardBody>
              <h4 className="mb-4 text-center">Enter OTP</h4>
              <Form onSubmit={handleSubmit} className="text-center">
                <div className="d-flex justify-content-center gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="text-center"
                      style={{ width: '45px', fontSize: '1.5rem' }}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      innerRef={(el) => (inputRefs.current[index] = el)}
                    />
                  ))}
                </div>
                <Button color="success" block type="submit">
                  Verify OTP
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Otp;
