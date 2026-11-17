
import React, { useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Alert,
  Badge,
} from "reactstrap";

import {
  FiInfo,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import Proimg from "../../assets/images/seller/pro-1.jpg"

import Select from "react-select";
import PerfectScrollbar from "react-perfect-scrollbar";

const EditListingSidebar = ({ isOpen, toggle }) => {

  const [activeSection, setActiveSection] = useState("listing-information");
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    sku: "ZRBPS326007B",
    status: "Active",
    mrp: "2299",
    settlement: "875",
    fulfilment: "Seller",
    procurement: "Instock",
    sla: "1",
    stock: "20",
    shipping: "Flipkart",
    length: "50",
    breadth: "37",
    height: "9",
    weight: "1.3",
    hsn: "42029200",
    cess: "",
    taxCode: "GST_18",
    country: "India",
    manufacturer: "ZIPRAVEL MART",
    packer: "ZIPRAVEL MART",
  });

  const sections = [
    { id: "listing-information", label: "Listing Information" },
    { id: "status-details", label: "Status Details" },
    { id: "price-details", label: "Price Details" },
    { id: "inventory-details", label: "Inventory Details" },
    { id: "shipping-provider", label: "Shipping Provider" },
    { id: "package-details", label: "Package Details" },
    { id: "tax-details", label: "Tax Details" },
    { id: "manufacturing-details", label: "Manufacturing Details" },
    { id: "manage-variants", label: "Manage Variants" },
  ];

  const options = {
    status: [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
      { value: "Archived", label: "Archived" },
    ],
    fulfilment: [
      { value: "Seller", label: "Seller" },
      { value: "Flipkart", label: "Flipkart" },
    ],
    procurement: [
      { value: "Instock", label: "Instock" },
      { value: "Made to Order", label: "Made to Order" },
    ],
    shipping: [
      { value: "Flipkart", label: "Flipkart" },
      { value: "Seller", label: "Seller" },
    ],
    taxCode: [
      { value: "GST_0", label: "GST_0" },
      { value: "GST_5", label: "GST_5" },
      { value: "GST_12", label: "GST_12" },
      { value: "GST_18", label: "GST_18" },
      { value: "GST_28", label: "GST_28" },
    ],
    country: [
      { value: "India", label: "India" },
      { value: "China", label: "China" },
      { value: "United States", label: "United States" },
      { value: "Germany", label: "Germany" },
    ],
  };

 

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSectionClick = (id) => {
    setActiveSection(id);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated Listing:", formData);
    setSubmitted(true);
  };

  const Info = () => (
    <FiInfo size={13} className="text-primary" />
  );

  const renderInput = (label, name, unit = "", required = false) => (
    <FormGroup className="mb-3">
      <Row className="align-items-center">
        <Col xs="5" md="4" xl="3">
          <Label className="small mb-0 text-dark">
            {label}
            {required && <span className="text-danger"> *</span>}
          </Label>
        </Col>

        <Col xs="6" md="5" xl="4">
          <Input
            type="text"
            bsSize="sm"
            value={formData[name]}
            onChange={(e) => handleChange(name, e.target.value)}
          />
        </Col>

        <Col xs="1">
          <span className="small text-secondary">{unit}</span>
        </Col>
      </Row>
    </FormGroup>
  );

  const renderSelect = (label, name, required = false) => (
    <FormGroup className="mb-3">
      <Row className="align-items-center">
        <Col xs="5" md="4" xl="3">
          <Label className="small mb-0 text-dark">
            {label}
            {required && <span className="text-danger"> *</span>}
          </Label>
        </Col>

        <Col xs="6" md="5" xl="4">
          <Select
            options={options[name]}
            value={options[name].find(
              (item) => item.value === formData[name]
            )}
            onChange={(selected) =>
              handleChange(name, selected?.value || "")
            }
            isSearchable={false}
            className="small"
            classNamePrefix="listing-select"
          />
        </Col>

        <Col xs="1">
          <Info />
        </Col>
      </Row>
    </FormGroup>
  );

  const renderTextarea = (label, name) => (
    <FormGroup className="mb-3">
      <Row className="align-items-center">
        <Col xs="5" md="4" xl="3">
          <Label className="small mb-0">
            {label} <span className="text-danger">*</span>
          </Label>
        </Col>

        <Col xs="6" md="5" xl="4">
          <Input
            type="textarea"
            rows="2"
            bsSize="sm"
            value={formData[name]}
            onChange={(e) => handleChange(name, e.target.value)}
          />
        </Col>

        <Col xs="1">
          <Info />
        </Col>
      </Row>
    </FormGroup>
  );

  const renderTaxSelect = () => (
    <FormGroup className="mb-3">
      <Row className="align-items-center">
        <Col xs="5" md="4" xl="3">
          <Label className="small mb-0">
            Tax Code <span className="text-danger">*</span>
            <Badge color="danger" className="ms-2">
              Updated
            </Badge>
          </Label>
        </Col>

        <Col xs="6" md="5" xl="4">
          <Select
            options={options.taxCode}
            value={options.taxCode.find(
              (item) => item.value === formData.taxCode
            )}
            onChange={(selected) =>
              handleChange("taxCode", selected?.value || "")
            }
            isSearchable={false}
            className="small"
            classNamePrefix="listing-select"
          />
        </Col>

        <Col xs="1">
          <Info />
        </Col>
      </Row>
    </FormGroup>
  );

  return (
    <>
   
      <Offcanvas
        isOpen={isOpen}
  toggle={toggle}
  direction="end"
  backdrop="static"
  style={{
    width: "90vw",
    maxWidth: "750px",
  }}
      >
        <OffcanvasHeader toggle={toggle} className="border-bottom py-2">
          <span className="small fw-semibold">Edit Listing</span>
        </OffcanvasHeader>

        <div className="px-3 px-md-4 py-3 border-bottom">
          <Row className="align-items-center">
            <Col xs="2" md="1">
              <div
                className="bg-light rounded d-flex align-items-center justify-content-center"
                style={{ width: "48px", height: "48px" }}
              >
                <span className="fs-3">
                   <img src={Proimg} alt="zozokart" className="w-100 h-100" />
                </span>
              </div>
            </Col>

            <Col xs="10" md="8">
              <div className="text-primary fw-semibold small">
                ZIPRAVEL Multi-Pocket Backpack Waterproof Backpack
              </div>

              <div className="d-flex flex-wrap gap-3 text-secondary mt-1">
                <small>SKU ID: ZRBPS326007B</small>
                <small>FSN ID: BAGHRUQDDSY2C5VG</small>
                <small>LID: LSTBAGHRUQD...Y2C5VGZVTMU</small>
              </div>

              <div className="mt-2">
                <Badge
                  color="light"
                  className="border border-success text-success rounded-0 fw-normal"
                >
                  <FiCheck /> Active
                </Badge>
              </div>
            </Col>

            <Col xs="12" md="3" className="text-md-end mt-3 mt-md-0">
              <Button
                color="primary"
                size="sm"
                className="px-4"
                onClick={() =>
                  document.getElementById("listing-submit").click()
                }
              >
                Submit
              </Button>
            </Col>
          </Row>
        </div>

        <OffcanvasBody className="p-0 overflow-hidden">
          <PerfectScrollbar
            options={{ suppressScrollX: true }}
            style={{
              height: "100%",
              maxHeight: "calc(100vh - 145px)",
            }}
          >
            <Form onSubmit={handleSubmit} className="p-3 p-md-4">
              {submitted && (
                <Alert color="success" className="py-2 small">
                  Listing information updated successfully!
                </Alert>
              )}

              <Row>
                <Col xs="12" lg="9" className="pe-lg-4">

                  <section id="listing-information" className="mb-4">
                    <h6 className="small text-primary mb-4">
                      Listing Information
                    </h6>

                    {renderInput("Seller SKU ID", "sku")}
                  </section>

                  <section id="status-details" className="mb-4">
                    <h6 className="small text-primary mb-4">
                      Status Details
                    </h6>

                    {renderSelect("Listing Status", "status", true)}
                  </section>

                  <section id="price-details" className="mb-4">
                    <h6 className="small text-primary mb-4">
                      Price Details
                    </h6>

                    {renderInput("MRP", "mrp", "INR", true)}

                    {renderInput(
                      "Bank Settlement",
                      "settlement",
                      "INR",
                      true
                    )}

                    <Row>
                      <Col xs="5" md="4" xl="3" />

                      <Col xs="7" md="6" xl="5">
                        <div className="bg-light rounded p-2 small mb-2">
                          Listing Price: ₹1069{" "}
                          <a
                            href="#price-details"
                            className="text-primary"
                          >
                            See How
                          </a>

                          <div className="bg-success-subtle rounded p-1 mt-2 small">
                            Listing Price may be updated to maintain your
                            Bank Settlement
                          </div>
                        </div>

                        <div className="bg-light rounded p-2 text-secondary small">
                          You can increase the settlement only 2 times a day{" "}
                          <Info />
                        </div>
                      </Col>
                    </Row>
                  </section>

                  <section id="inventory-details" className="mb-4">
                    <h6 className="small text-primary mb-4">
                      Inventory Details
                    </h6>

                    {renderSelect("Fulfilment by", "fulfilment", true)}

                    <Row className="mb-3">
                      <Col xs="5" md="4" xl="3" />

                      <Col xs="7" md="6" xl="5">
                        <a
                          href="#inventory-details"
                          className="small text-primary text-decoration-none"
                        >
                          See how fulfilment option is chosen
                        </a>
                      </Col>
                    </Row>

                    {renderSelect(
                      "Procurement type",
                      "procurement",
                      true
                    )}

                    {renderInput(
                      "Procurement SLA",
                      "sla",
                      "DAY",
                      true
                    )}

                    {renderInput("Stock", "stock", "", true)}

                    <Row>
                      <Col xs="12" md={{ size: 8, offset: 3 }}>
                        <Alert color="primary" className="py-2 small">
                          <FiInfo className="me-2" />
                          The maximum stock quantity you can update is
                          5000 units per location. For MinQ listings,
                          the limit is 5000 x MinQ per location.
                        </Alert>
                      </Col>
                    </Row>
                  </section>

                  <section id="shipping-provider" className="mb-4">
                    <h6 className="small text-primary mb-4">
                      Shipping Provider
                    </h6>

                    {renderSelect(
                      "Shipping provider",
                      "shipping",
                      true
                    )}
                  </section>

                  <section id="package-details" className="mb-4">
                    <h6 className="small text-primary mb-4">
                      Package Details
                    </h6>

                    {renderInput("Length", "length", "cms")}
                    {renderInput("Breadth", "breadth", "cms")}
                    {renderInput("Height", "height", "cms")}
                    {renderInput("Weight", "weight", "Kgs")}
                  </section>

                  <section id="tax-details" className="mb-4">
                    <h6 className="small text-primary mb-4">
                      Tax Details
                    </h6>

                    {renderInput("HSN", "hsn", "", true)}

                    <Row className="mb-3">
                      <Col xs="5" md="4" xl="3" />

                      <Col xs="7" md="5" xl="4">
                        <a
                          href="#tax-details"
                          className="small text-primary text-decoration-none"
                        >
                          Find relevant HSN codes
                        </a>
                      </Col>
                    </Row>

                    {renderInput(
                      "Luxury Cess",
                      "cess",
                      "Percentage"
                    )}

                    {renderTaxSelect()}

                    <Row className="mb-3">
                      <Col xs="5" md="4" xl="3" />

                      <Col xs="7" md="5" xl="4">
                        <a
                          href="#tax-details"
                          className="small text-primary text-decoration-none"
                        >
                          Find relevant Tax codes
                        </a>
                      </Col>
                    </Row>

                    <Alert color="warning" className="small py-2">
                      <FiInfo className="me-2" />
                      New GST rates will apply from 22 Sep, 12:00 AM,
                      as per the available HSN. You can review and edit
                      the tax code, if required.
                    </Alert>
                  </section>

                  <section id="manufacturing-details" className="mb-4">
                    <h6 className="small text-primary mb-4">
                      Manufacturing Details
                    </h6>

                    {renderSelect("Country Of Origin", "country", true)}

                    {renderTextarea(
                      "Manufacturer Details",
                      "manufacturer"
                    )}

                    {renderTextarea("Packer Details", "packer")}
                  </section>

                  <section id="manage-variants" className="mb-5">
                    <h6 className="small fw-semibold text-dark mb-2">
                      Manage Variants
                    </h6>

                    <p className="small text-secondary">
                      You can now manage your variants from the new
                      "Manage Variants" page
                    </p>

                    <Button
                      type="button"
                      outline
                      color="primary"
                      size="sm"
                    >
                      Go to Manage Variants
                      <FiArrowRight className="ms-2" />
                    </Button>
                  </section>

                  <div className="border-top pt-3 d-flex justify-content-end">
                    <Button
                      color="primary"
                      type="submit"
                      id="listing-submit"
                    >
                      Submit
                    </Button>
                  </div>
                </Col>

                <Col lg="3" className="d-none d-lg-block">
                  <div
                    className="position-sticky border-start ps-2"
                    style={{ top: "15px" }}
                  >
                    <div className="list-group list-group-flush rounded-0">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() =>
                            handleSectionClick(section.id)
                          }
                          className={`list-group-item list-group-item-action border-0 rounded-0 py-1 px-2 small text-start ${
                            activeSection === section.id
                              ? "text-primary fw-semibold"
                              : "text-dark"
                          }`}
                        >
                          {section.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </PerfectScrollbar>
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

export default EditListingSidebar;
