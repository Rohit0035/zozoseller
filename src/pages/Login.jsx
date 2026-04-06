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
import { Link,useNavigate } from "react-router-dom";
import LogoLg from "../assets/images/logo-lg.png";
import Loginimg from "../assets/images/common/login-img.jpg";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../components/ToastifyNotification";
import { LoginApi } from "../api/authAPI";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated) || false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);
  const sendOtp = async e => {
    e.preventDefault();
    try {
      if (!email) {
        showToast("error", "Email is required");
        return;
      }
      const data = {
        email: email
      };
      const response = await LoginApi(data);
      if (response.status == true) {
        showToast("success", response.message);
        navigate("/otp", { state: { email } }); // Redirect upon successful login
      } else {
        // setError(response.message);
        showToast("error", response.message);
      }
    } catch (error) {
      // setError(error); // Handle login errors
      showToast("error", error);
    }
  };

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
                  <h4 className="mb-0 mt-3 text-start">Login</h4>
                  <hr />
                  <Form onSubmit={sendOtp}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </FormGroup>
                    <Button className="btn btn-primary mb-3" block type="submit">
                      Send OTP
                    </Button>
                    <Link to="/sign-up">New Here? Click to Sign Up</Link>
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

export default Login;
