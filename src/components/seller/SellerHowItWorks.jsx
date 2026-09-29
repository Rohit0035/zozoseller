import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

import {
  FaUserPlus,
  FaStore,
  FaBoxOpen,
  FaClipboardCheck,
  FaRocket,
} from "react-icons/fa";

const steps = [
  {
    number: 1,
    icon: <FaUserPlus />,
    title: "Register as a Seller",
    description:
      "Sign up on ZOZO KART and provide your basic business and contact details to create your seller account.",
  },
  {
    number: 2,
    icon: <FaStore />,
    title: "Set Up Your Store",
    description:
      "Complete your store profile, add business information, and configure your selling preferences.",
  },
  {
    number: 3,
    icon: <FaBoxOpen />,
    title: "List Your Products",
    description:
      "Add your products with images, descriptions, pricing, categories, and available stock.",
  },
  {
    number: 4,
    icon: <FaClipboardCheck />,
    title: "Receive & Manage Orders",
    description:
      "Get customer orders, process them efficiently, and keep track of your order fulfilment.",
  },
  {
    number: 5,
    icon: <FaRocket />,
    title: "Start Selling & Grow",
    description:
      "Start selling your products on ZOZO KART and reach more customers while growing your online business.",
  },
];

const SellerHowItWorks = () => {
  return (
    <section className="py-5 bg-light" id="howitwork">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-2">
            How It Works ZOZO KART
          </h2>
          <p className="text-secondary mb-0">
            Become a ZOZO KART seller in just a few simple steps. Set up your
            store, list products, manage orders, and start growing your
            business online.
          </p>
        </div>
        <Row className="g-4 justify-content-center">
          {steps.map((step) => (
            <Col
              key={step.number}
              xs="12"
              sm="6"
              md="4"
              lg
            >
              <Card
                data-aos="zoom-in"
                className="h-100 border-0 text-center"
                style={{
                  minHeight: "325px",
                }}
              >
                <CardBody className="d-flex flex-column align-items-center p-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#0a399c",
                      color: "#fff",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {step.number}
                  </div>
                  <div
                    className="mb-3 st-text"
                    style={{
                      fontSize: "42px",
                    }}
                  >
                    {step.icon}
                  </div>
                  <h5 className="fw-bold text-dark mb-2">
                    {step.title}
                  </h5>
                  <p className="text-secondary mb-0">
                    {step.description}
                  </p>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
};

export default SellerHowItWorks;
