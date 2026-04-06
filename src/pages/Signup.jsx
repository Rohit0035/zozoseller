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
import { Link, useNavigate } from "react-router-dom";
import LogoLg from "../assets/images/logo-lg.png";
import Loginimg from "../assets/images/common/login-img.jpg";
import { useDispatch, useSelector } from "react-redux";
import { SignupApi } from "../api/authAPI";
import { showToast } from "../components/ToastifyNotification";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const validate = () => {
    let newErrors = {};

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await SignupApi(formData); // Make sure login function returns token
      console.log(response);
      if (response.status == true) {
        showToast('success', response.message)
        // dispatch({ type: LOGIN_SUCCESS, payload: { response } }); // Dispatch LOGIN_SUCCESS action
        navigate('/sign-up-otp-verification', { state: { name: formData.name, email: formData.email, phone: formData.phone } }); // Redirect upon successful login
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
                  <h4 className="mb-0 mt-3 text-start">Sign Up</h4>
                  <hr />
                  <Form onSubmit={e => onSubmit(e)}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={errors.name ? "is-invalid" : ""}
                      />
                      {errors.name && (
                        <div className="text-danger">{errors.name}</div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? "is-invalid" : ""}
                      />
                      {errors.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="Enter your Phone number"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className={errors.phone ? "is-invalid" : ""}
                      />
                      {errors.phone && (
                        <div className="text-danger">{errors.phone}</div>
                      )}
                    </FormGroup>

                    <Button className="btn btn-primary mb-3" block type="submit">
                      Send OTP
                    </Button>
                    <Link to="/login">Already have an account? Login</Link>
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

export default Signup;
