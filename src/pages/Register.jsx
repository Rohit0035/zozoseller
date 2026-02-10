import React, { useState, useRef, use, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import LogoLg from "../assets/images/logo-lg.png";
import Loginimg from "../assets/images/common/login-img.jpg";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../api/authAPI";
import { showToast } from "../components/ToastifyNotification";
import { sellerRegistration } from "../api/sellerAPI";

const Register = () => {
  const dispatch = useDispatch();
	const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    gstin: ""
  });
	const onSubmit = async (e) => {
    e.preventDefault();
		try {
			const response = await sellerRegistration(formData); // Make sure login function returns token
			console.log(response);
			if (response.success) {
				showToast('success', response.message)
				// dispatch({ type: LOGIN_SUCCESS, payload: { response } }); // Dispatch LOGIN_SUCCESS action
				navigate('/register-otp-verification', { state: { email: formData.email,phone: formData.phone,gstin: formData.gstin } }); // Redirect upon successful login
			} else {
				// setError(response.message);
				showToast('error', response.message)
			}

		} catch (error) {
			// setError(error); // Handle login errors
			showToast('error', error)
		}
	}
  
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated) || false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={9}>
          <Card>
            <CardBody>
              {/* Email Form Section */}

              <Row>
                <Col md="6" className="d-none d-md-block">
                  <img src={Loginimg} alt="" width="100%" />
                </Col>
                <Col md="6">
                  <img src={LogoLg} alt="" width={200} className="pb-5" />
                  <h4 className="mb-0 mt-3 text-start">Register</h4>
                  <hr />
                  <Form onSubmit={e => onSubmit(e)}>
                    <FormGroup>
                      <Label for="email">Email Number</Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="Enter your email or mobile number"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="Enter your Phone number"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="gstin">GSTIN</Label>
                      <Input
                        id="gstin"
                        type="text"
                        placeholder="Enter your GSTIN"
                        value={formData.gstin}
                        onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                      />
                    </FormGroup>

                    <Button className="btn btn-primary" block type="submit">
                      Send OTP
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

export default Register;
