import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

import {
  FaHeadset,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaStore,
  FaRocket,
  FaCircleCheck,
} from "react-icons/fa6";

const SellerContactSection = () => {
  return (
    <section className="py-5 bg-white mb-5" id="contctus">
      <Container>

        <Row className="justify-content-center text-center mb-5">
          <Col lg="8">

            <span className="badge st-bg rounded-pill px-3 py-2 mb-3">
              SELLER SUPPORT
            </span>

            <h2 className="fw-bold display-6 text-dark mb-3">
              Ready to take your business
              <br />
              <span className="st-text">
                to the next level?
              </span>
            </h2>

            <p className=" text-secondary mb-0">
              Have questions about selling on ZOZO KART? Connect with our
              seller support team and get the guidance you need to start,
              manage, and grow your online business.
            </p>

          </Col>
        </Row>

        <Row className="g-4 align-items-stretch">

          <Col lg="5">

            <Card className="h-100 border-0 shadow-sm rounded-4 st-bg text-white" data-aos="zoom-in">
              <CardBody className="p-4 p-lg-5">

                <div className="mb-4">
                  <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center p-3 fs-4 mb-3">
                    <FaHeadset />
                  </div>

                  <h3 className="fw-bold mb-3">
                    Let’s grow your business together
                  </h3>

                  <p className="text-white">
                    Whether you're new to online selling or already running
                    an established store, our seller-focused support can
                    help you understand the next steps.
                  </p>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <FaCircleCheck className="text-warning mt-1 me-3" />

                  <span>
                    Get help with seller registration
                  </span>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <FaCircleCheck className="text-warning mt-1 me-3" />

                  <span>
                    Learn how to list and manage products
                  </span>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <FaCircleCheck className="text-warning mt-1 me-3" />

                  <span>
                    Understand fulfilment and seller operations
                  </span>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <FaCircleCheck className="text-warning mt-1 me-3" />

                  <span>
                    Discover tools to grow your online business
                  </span>
                </div>

                <div className="border-top border-secondary pt-4">

                  <div className="d-flex align-items-center mb-3">
                    <FaWhatsapp className="text-warning fs-4 me-3" />

                    <div>
                      <small className="text-white d-block">
                        WhatsApp Support
                      </small>
                      <span className="fw-semibold">
                        Chat with Seller Support
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <FaPhone className="text-warning fs-5 me-3" />

                    <div>
                      <small className="text-white d-block">
                        Seller Helpline
                      </small>
                      <span className="fw-semibold">
                        Talk to our team
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <FaEnvelope className="text-warning fs-5 me-3" />

                    <div>
                      <small className="text-white d-block">
                        Email Support
                      </small>
                      <span className="fw-semibold">
                        seller@zozokart.com
                      </span>
                    </div>
                  </div>

                </div>

              </CardBody>
            </Card>

          </Col>

          <Col lg="7">

            <Card className="h-100 border-0 shadow-sm rounded-4" data-aos="zoom-in">
              <CardBody className="p-4 p-lg-5">

                <div className="d-flex align-items-center mb-4">

                  <div className="bg-warning bg-opacity-10 text-warning rounded-3 p-3 me-3 fs-4">
                    <FaStore />
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1">
                      Talk to our Seller Team
                    </h4>

                    <p className="text-secondary mb-0">
                      Share your details and we'll help you get started.
                    </p>
                  </div>

                </div>

                <Form>

                  <Row>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">
                          Full Name
                        </Label>

                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          className="rounded-3 py-2"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">
                          Business / Store Name
                        </Label>

                        <Input
                          type="text"
                          placeholder="Enter your store name"
                          className="rounded-3 py-2"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">
                          Mobile Number
                        </Label>

                        <Input
                          type="tel"
                          placeholder="Enter your mobile number"
                          className="rounded-3 py-2"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">
                          Email Address
                        </Label>

                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="rounded-3 py-2"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">
                          Product Category
                        </Label>

                        <Input type="select" className="rounded-3 py-2">
                          <option value="">
                            Select category
                          </option>
                          <option>Fashion & Apparel</option>
                          <option>Electronics</option>
                          <option>Home & Kitchen</option>
                          <option>Beauty & Personal Care</option>
                          <option>Grocery</option>
                          <option>Sports & Fitness</option>
                          <option>Other</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">
                          Current Selling Status
                        </Label>

                        <Input type="select" className="rounded-3 py-2">
                          <option value="">
                            Select status
                          </option>
                          <option>
                            New to Online Selling
                          </option>
                          <option>
                            Already Selling Online
                          </option>
                          <option>
                            Selling on Other Marketplaces
                          </option>
                          <option>
                            Existing ZOZO KART Seller
                          </option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">
                          How can we help you?
                        </Label>

                        <Input type="select" className="rounded-3 py-2">
                          <option value="">
                            Select an option
                          </option>
                          <option>Start Selling</option>
                          <option>Seller Registration</option>
                          <option>Product Listing</option>
                          <option>Order & Fulfilment</option>
                          <option>Payments & Settlement</option>
                          <option>Advertising & Promotion</option>
                          <option>Account Support</option>
                          <option>Other</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="12">
                      <FormGroup className="mb-4">
                        <Label className="fw-semibold">
                          Message
                        </Label>

                        <Input
                          type="textarea"
                          rows="4"
                          placeholder="Tell us how we can help your business..."
                          className="rounded-3"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="12">

                      <Button
                        
                        size="lg"
                        className=" btn btn-primary bg-st rounded-pill px-4 fw-semibold d-inline-flex align-items-center"
                      >
                        Contact Seller Support
                        <FaArrowRight className="ms-2" />
                      </Button>

                    </Col>

                  </Row>

                </Form>

              </CardBody>
            </Card>

          </Col>

        </Row>

      </Container>
    </section>
  );
};

export default SellerContactSection;