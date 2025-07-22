import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Card,
  CardBody,
  Row,
  Col,
  Label,
  Input,
  Form,
  InputGroup,
  Button
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FaSearch, FaPlus, FaMinus } from "react-icons/fa";
import { showToast } from "../../../components/ToastifyNotification"; // Assuming you have this

const ProductDetails = ({ listingData, onListingDataChange }) => {
  const [open, setOpen] = useState("");
  const [detailsForm, setDetailsForm] = useState({
    skuId: "",
    listingStatus: "",
    mrp: "",
    sellingPrice: "",
    minOrderQuantity: "",
    fulfillmentBy: "",
    procurementType: "",
    procurementSLA: "",
    stock: "",
    shippingProvider: "",
    packageLength: "",
    packageBreadth: "",
    packageHeight: "",
    packageWeight: "",
    hsn: "",
    luxuryCess: "",
    taxCode: "",
    countryOfOrigin: "",
    manufacturerDetails: "",
    packerDetails: "",
    importerDetails: "",
    modelNumber: "",
    vehicleBrand: "",
    vehicleModelName: "",
    vehicleModelYear: "",
    productWeight: "",
    productWeightUnit: "",
    generalDescription: "", // The single 'Description' input in section 3
    additionalDescriptions: [""] // The dynamic "Description *" inputs in section 3
  });

  // Initialize form state from listingData prop when component mounts or listingData changes
  useEffect(
    () => {
      if (listingData.productDetails) {
        setDetailsForm(prev => ({
          ...prev,
          ...listingData.productDetails,
          // Ensure additionalDescriptions is an array and has at least one empty string if empty
          additionalDescriptions:
            listingData.productDetails.additionalDescriptions &&
            listingData.productDetails.additionalDescriptions.length > 0
              ? listingData.productDetails.additionalDescriptions
              : [""]
        }));
      }
    },
    [listingData.productDetails]
  );

  const toggle = id => {
    setOpen(open === id ? "" : id);
  };

  // Generic handler for all simple input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setDetailsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handlers for dynamic 'additionalDescriptions' array
  const handleAddAdditionalDescription = () => {
    setDetailsForm(prev => ({
      ...prev,
      additionalDescriptions: [...prev.additionalDescriptions, ""]
    }));
  };

  const handleRemoveAdditionalDescription = index => {
    setDetailsForm(prev => {
      const newDescriptions = [...prev.additionalDescriptions];
      newDescriptions.splice(index, 1);
      // Ensure there's always at least one input field
      return {
        ...prev,
        additionalDescriptions:
          newDescriptions.length > 0 ? newDescriptions : [""]
      };
    });
  };

  const handleAdditionalDescriptionChange = (index, value) => {
    setDetailsForm(prev => {
      const newDescriptions = [...prev.additionalDescriptions];
      newDescriptions[index] = value;
      return {
        ...prev,
        additionalDescriptions: newDescriptions
      };
    });
  };

  const handleSaveDetails = () => {
    // Basic validation (you'll want to make this more comprehensive)
    const mandatoryFields = [
      "skuId",
      "listingStatus",
      "mrp",
      "sellingPrice",
      "minOrderQuantity",
      "fulfillmentBy",
      "procurementType",
      "procurementSLA",
      "stock",
      "shippingProvider",
      "packageLength",
      "packageBreadth",
      "packageHeight",
      "packageWeight",
      "hsn",
      "taxCode",
      "countryOfOrigin",
      "manufacturerDetails",
      "packerDetails",
      "importerDetails",
      "modelNumber",
      "vehicleBrand",
      "vehicleModelName",
      "vehicleModelYear",
      "productWeight",
      "productWeightUnit",
      "generalDescription" // Consider if this is mandatory or if additionalDescriptions can replace it
    ];

    for (const field of mandatoryFields) {
      if (
        typeof detailsForm[field] === "string" &&
        detailsForm[field].trim() === ""
      ) {
        showToast("error", `Please fill in the mandatory field: ${field}`);
        return;
      }
      if (typeof detailsForm[field] === "number" && detailsForm[field] === "") {
        // For number inputs, an empty string is common before user input
        showToast("error", `Please fill in the mandatory field: ${field}`);
        return;
      }
    }

    // Validate additionalDescriptions (if any are expected to be filled)
    if (detailsForm.additionalDescriptions.some(desc => desc.trim() === "")) {
      // You might want a more specific rule here, e.g., if it's required to have at least one non-empty
      // showToast('error', 'Please fill all additional descriptions or remove empty ones.');
      // return;
    }

    // Pass the entire productDetails object back to the parent
    onListingDataChange({ productDetails: detailsForm });
    showToast("success", "Product details saved successfully!");
  };

  return (
    <div>
      <Accordion open={open} toggle={toggle}>
        {/* Price, Stock and Shipping Information (0/20) */}
        <AccordionItem className="border-0 shadow-sm mb-1">
          <AccordionHeader targetId="1">
            Price, Stock and Shipping Information (0/20)
          </AccordionHeader>
          <AccordionBody accordionId="1">
            <div style={{ height: "250px", overflow: "hidden" }}>
              <PerfectScrollbar options={{ suppressScrollX: true }}>
                <Form>
                  <Row className="mb-3">
                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">* Mandatory fields</Label>
                      <small className="d-block" style={{ fontSize: "12px" }}>
                        Don't want to fill these attributes? You can copy the
                        values from one of your old SKUs! Enter the SKU ID you
                        want to copy attribute values
                      </small>
                      <InputGroup className="mt-1">
                        <span className="me-1">From:</span>
                        <Input type="search" placeholder="Search for SKU ID" />
                        <span
                          className="p-2 border"
                          style={{ cursor: "pointer" }}
                        >
                          <FaSearch />
                        </span>
                      </InputGroup>
                    </Col>
                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Listing information</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className=" st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Seller SKU ID *
                        </span>
                        <Input
                          type="text" // Changed to text as SKU ID might be alphanumeric
                          placeholder="Enter SKU ID"
                          name="skuId"
                          value={detailsForm.skuId}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Col>
                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Status Details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Listing Status*
                        </span>
                        <Input
                          type="select"
                          name="listingStatus"
                          value={detailsForm.listingStatus}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Input>
                      </InputGroup>
                    </Col>
                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Price details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          MRP*
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="mrp"
                          value={detailsForm.mrp}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">INR</span>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Your selling price*
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="sellingPrice"
                          value={detailsForm.sellingPrice}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">INR</span>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Quantity (MinOQ)*
                        </span>
                        <Input
                          type="select"
                          name="minOrderQuantity"
                          value={detailsForm.minOrderQuantity}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          {/* Add more options as needed */}
                        </Input>
                      </InputGroup>
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Inventory details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Fullfilment by *
                        </span>
                        <Input
                          type="select"
                          name="fulfillmentBy"
                          value={detailsForm.fulfillmentBy}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="seller">Seller</option>
                          {/* Add other options like 'Flipkart' if applicable */}
                        </Input>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Procurement type
                        </span>
                        <Input
                          type="select"
                          name="procurementType"
                          value={detailsForm.procurementType}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="instock">Instock</option>
                          <option value="express">Express</option>
                        </Input>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Procurement SLA *
                        </span>
                        <Input
                          type="number" // Assuming SLA is a number of days
                          placeholder=""
                          name="procurementSLA"
                          value={detailsForm.procurementSLA}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">DAY</span>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Stock *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="stock"
                          value={detailsForm.stock}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      <small className="ms-auto">
                        Minimum 5 quantity required for listing visibility
                      </small>
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Shipping provider</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Shipping provider*
                        </span>
                        <Input
                          type="select"
                          name="shippingProvider"
                          value={detailsForm.shippingProvider}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="flipkart">Flipkart</option>
                          {/* Add other shipping providers */}
                        </Input>
                      </InputGroup>
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Package details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Length *
                        </span>
                        <Input
                          type="number" // Assuming dimensions are numbers
                          placeholder=""
                          name="packageLength"
                          value={detailsForm.packageLength}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">CM</span>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Breadth *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="packageBreadth"
                          value={detailsForm.packageBreadth}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">CM</span>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Height *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="packageHeight"
                          value={detailsForm.packageHeight}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">CM</span>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Weight *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="packageWeight"
                          value={detailsForm.packageWeight}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">KG</span>
                      </InputGroup>
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Tax details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          HSN *
                        </span>
                        <Input
                          type="text"
                          name="hsn"
                          value={detailsForm.hsn}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      <small>Find relevant HSN codes</small>

                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Luxury Cess
                        </span>
                        <Input
                          type="number" // Assuming percentage is a number
                          name="luxuryCess"
                          value={detailsForm.luxuryCess}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">PERCENTAGE</span>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Tax Code *
                        </span>
                        <Input
                          type="select"
                          name="taxCode"
                          value={detailsForm.taxCode}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="GST_0">GST_0</option>
                          <option value="GST_12">GST_12</option>
                          <option value="GST_18">GST_18</option>
                          <option value="GST_28">GST_28</option>
                          <option value="GST_3">GST_3</option>
                          <option value="GST_5">GST_5</option>
                          <option value="GST_APPAREL">GST_APPAREL</option>
                        </Input>
                      </InputGroup>
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Manufacturing Details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Country Of Origin*
                        </span>
                        <Input
                          type="select"
                          name="countryOfOrigin"
                          value={detailsForm.countryOfOrigin}
                          onChange={handleChange}
                        >
                          <option>Select One</option>
                          {/* ... all your country options ... */}
                          <option value="IN">India</option>
                          <option value="US">United States of America</option>
                          {/* Add more as needed */}
                        </Input>
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Manufacturer Details *
                        </span>
                        <Input
                          type="text"
                          name="manufacturerDetails"
                          value={detailsForm.manufacturerDetails}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Packer Details*
                        </span>
                        <Input
                          type="text"
                          name="packerDetails"
                          value={detailsForm.packerDetails}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Importer Details*
                        </span>
                        <Input
                          type="text"
                          name="importerDetails"
                          value={detailsForm.importerDetails}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Col>
                    <Col sm={12} className="mb-3">
                      <Button
                        className="btn btn-primary btn-sm"
                        onClick={handleSaveDetails}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </PerfectScrollbar>
            </div>
          </AccordionBody>
        </AccordionItem>

        {/* Section 2: Product Description */}
        <AccordionItem className="border-0 shadow-sm mb-1">
          <AccordionHeader targetId="2">
            Product Description (0/11)
          </AccordionHeader>
          <AccordionBody accordionId="2">
            <Row>
              <Col sm={12} className="mb-3">
                <Label className="mb-1">* Mandatory fields</Label>
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    Model Number*
                  </span>
                  <Input
                    type="text"
                    name="modelNumber"
                    value={detailsForm.modelNumber}
                    onChange={handleChange}
                  />
                </InputGroup>
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    Vehicle Brand*
                  </span>
                  <Input
                    type="select"
                    name="vehicleBrand"
                    value={detailsForm.vehicleBrand}
                    onChange={handleChange}
                  >
                    <option value="">-- Select One --</option>
                    {/* Populate with actual vehicle brands */}
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                  </Input>
                </InputGroup>
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    Vehicle Model Name*
                  </span>
                  <Input
                    type="select"
                    name="vehicleModelName"
                    value={detailsForm.vehicleModelName}
                    onChange={handleChange}
                  >
                    <option value="">-- Select One --</option>
                    {/* Populate based on selected brand */}
                    <option value="Camry">Camry</option>
                    <option value="Corolla">Corolla</option>
                  </Input>
                </InputGroup>
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    Vehicle Model Year*
                  </span>
                  <Input
                    type="select"
                    name="vehicleModelYear"
                    value={detailsForm.vehicleModelYear}
                    onChange={handleChange}
                  >
                    <option value="">-- Select One --</option>
                    {/* Populate with years */}
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                  </Input>
                </InputGroup>
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    Weight*
                  </span>
                  <Input
                    type="number"
                    name="productWeight" // Renamed from 'Weight' to avoid conflict
                    value={detailsForm.productWeight}
                    onChange={handleChange}
                  />
                  <Input
                    type="select"
                    name="productWeightUnit"
                    value={detailsForm.productWeightUnit}
                    onChange={handleChange}
                  >
                    <option value="">-- Select One --</option>
                    <option value="G">G</option>
                    <option value="KG">KG</option>
                  </Input>
                </InputGroup>
              </Col>
              <Col sm={12} className="mb-3">
                <Button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveDetails}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </AccordionBody>
        </AccordionItem>

        {/* Section 3: Additional Description (Optional) (0/17) */}
        <AccordionItem className="border-0 shadow-sm mb-1">
          <AccordionHeader targetId="3">
            Additional Description (Optional) (0/17)
          </AccordionHeader>
          <AccordionBody accordionId="3">
            <Row className="mb-3">
              <Col sm={12} className="mb-3">
                <Label className="mb-1">General</Label>
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    Description *
                  </span>
                  <Input
                    type="textarea" // Changed to textarea for multi-line description
                    name="generalDescription"
                    value={detailsForm.generalDescription}
                    onChange={handleChange}
                    rows="3"
                  />
                </InputGroup>
              </Col>
              <Col sm={12} className="mb-3">
                <Label className="mb-1">Bullet Points / Features</Label>
                <Row className="mb-3">
                  <div className="col-4">
                    <span
                      style={{ fontSize: "14px" }}
                      className="d-block w-100 me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                    >
                      Description *
                    </span>
                  </div>

                  <div className="col-8">
                    {detailsForm.additionalDescriptions.map((value, index) =>
                      <div
                        className="d-flex align-items-center mb-2"
                        key={index}
                      >
                        <Input
                          type="text"
                          value={value}
                          onChange={e =>
                            handleAdditionalDescriptionChange(
                              index,
                              e.target.value
                            )}
                          className="me-2"
                        />
                        <Button
                          color="success"
                          size="sm"
                          className="me-1"
                          onClick={handleAddAdditionalDescription}
                          disabled={
                            detailsForm.additionalDescriptions.length >= 10
                          } // Optional: Limit number of bullet points
                        >
                          <FaPlus />
                        </Button>
                        {detailsForm.additionalDescriptions.length > 1 &&
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveAdditionalDescription(index)}
                          >
                            <FaMinus />
                          </Button>}
                      </div>
                    )}
                  </div>
                </Row>
              </Col>
              <Col sm={12} className="mb-3">
                <Button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveDetails}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDetails;
