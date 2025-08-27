import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from "reactstrap";
import { GetProducts } from "../../api/productAPI";
import { GetAdPlans } from "../../api/adPlanAPI";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../components/ToastifyNotification";
import { Link, useNavigate } from "react-router-dom";
import { StoreAdServiceRequest } from "../../api/adServiceRequestAPI";
import moment from "moment";
import LogoSm from '../../assets/images/logo.png';
import Select from "react-select";

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Running", label: "Running" },
  { value: "Completed", label: "Completed" }
];

const AddServiceRequest = () => {
  // State for fetched data
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductOptions, setSelectedProductOptions] = useState([]);
  const [adPlans, setAdPlans] = useState([]);
const navigate = useNavigate();
const user = useSelector(state => state.auth?.user) || {};
  // State for form data and validation errors
  const [formData, setFormData] = useState({
    sellerId: "",
    productIds: [],
    adPlanId: "",
    startDate: "",
    endDate: "",
    price: "",
    status: "Pending",
    keywords: "",
    paymentStatus: "Pending",
    razorpayPaymentId: "",
    razorpayOrderId: "",
    razorpaySignature: "",
    amount: "",
    currency: "",
    method: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Effect to fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, adPlansRes] = await Promise.all([
          GetProducts(),
          GetAdPlans()
        ]);

        if (productsRes.success) {
          setProductOptions(productsRes.data.map(product => ({ value: product._id, label: product.name })));
        }
        if (adPlansRes.success) setAdPlans(adPlansRes.data);
      } catch (error) {
        showToast("error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = e => {
    const { name, value, type, selectedOptions } = e.target;

    // Handle multi-select for products
    if (type === "select-multiple") {
      const selectedIds = Array.from(selectedOptions, option => option.value);
      setFormData(prevData => ({ ...prevData, [name]: selectedIds }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
    // Clear the error for the field being changed
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
  };

  useEffect(() => {
    if (selectedProductOptions.length > 0) {
      setFormData(prevData => ({
        ...prevData,
        productIds: selectedProductOptions.map(option => option.value)
      }));
    }
  }, [selectedProductOptions]);

  const handleProductChange = (selectedOptions) => {
        setSelectedProductOptions(selectedOptions);
    };

  // Basic form validation
  const validateForm = () => {
    const errors = {};
    if (formData.productIds.length === 0)
      errors.productIds = "At least one product is required.";
    if (!formData.adPlanId) errors.adPlanId = "Ad Plan is required.";
    if (!formData.startDate) errors.startDate = "Start date is required.";
    // Add other validations as needed
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ⚠️ Razorpay needs window.Razorpay script
const loadRazorpayScript = () => {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// 🟡 Fix duplicated and inconsistent `endDate` and `price` logic
useEffect(() => {
  if (formData.startDate && formData.adPlanId && adPlans.length > 0) {
    const selectedPlan = adPlans.find(plan => plan._id === formData.adPlanId);
    if (selectedPlan) {
      const startDate = moment(formData.startDate);
      const endDate = startDate.clone().add(selectedPlan.duration, "days");
      setFormData(prev => ({
        ...prev,
        endDate: endDate.format("YYYY-MM-DD"),
        price: selectedPlan.price
      }));
    }
  }
}, [formData.startDate, formData.adPlanId, adPlans]);

// 🟢 Razorpay Payment Trigger Function
const initiatePayment = async () => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    showToast("error", "Failed to load Razorpay SDK");
    return;
  }

  const selectedPlan = adPlans.find(plan => plan._id === formData.adPlanId);
  const paymentAmount = selectedPlan?.price || 0;

  const options = {
    key: "rzp_test_sbbCHuQzenmT45", // 🔁 Replace with your Razorpay key
    amount: paymentAmount * 100, // In paisa
    currency: "INR",
    name: "ZozoKart",
    description: "Payment for your service",
    image: {LogoSm}, // Replace with your logo URL
    handler: async response => {
        const updatedFormData = {
            ...formData,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            amount: paymentAmount,
            currency: "INR",
            method: "razorpay"
        };

        // Optionally update UI state (but don't wait for it)
        setFormData(updatedFormData);

        // Submit directly with the full updated form data
        await submitFormWithPayment(updatedFormData);
    },
    prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact:user?.mobile || "",
    },
    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

// 🟢 Form submission after payment success
const submitFormWithPayment = async (dataToSubmit = formData) => {
  try {
    setLoading(true);
    const response = await StoreAdServiceRequest(dataToSubmit);
    if (response.success) {
      showToast("success", "Ad service request created successfully.");
      setFormData({
        sellerId: "",
        productIds: [],
        adPlanId: "",
        startDate: "",
        endDate: "",
        price: "",
        status: "Pending",
        keywords: "",
        paymentStatus: "Pending",
        razorpayPaymentId: "",
        razorpayOrderId: "",
        razorpaySignature: "",
        amount: "",
        currency: "",
        method: ""
      });
    } else {
      setMessageType("danger");
      setMessage(response.message || "Submission failed.");
    }
  } catch (error) {
    setMessageType("danger");
    setMessage("Submission failed.");
  } finally {
    setLoading(false);
  }
};

// 🔄 Overwrite form submit to first validate and initiate payment
const handleSubmit = async e => {
  e.preventDefault();
  if (!validateForm()) {
    showToast("error", "Please fill in all required fields.");
    return;
  }
  await initiatePayment(); // 💸 Trigger Razorpay
};

  if (loading && vendors.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    < >
      <Row>
        <Col md="10">
          <Breadcrumb className="my-2">
            <BreadcrumbItem>
              <h5>Service Transactions</h5>
            </BreadcrumbItem>
            <BreadcrumbItem active>Add Service Request</BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col md="2">
          <div className="d-flex justify-content-end">
            <Link to="/service-transaction" className="btn btn-primary btn-sm">
              View All
            </Link>
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <CardBody>
          <Form className="row g-3" onSubmit={handleSubmit}>
            <Col md={6}>
              <FormGroup>
                <Label for="adPlanId">Ad Plan</Label>
                <Input
                  type="select"
                  name="adPlanId"
                  id="adPlanId"
                  value={formData.adPlanId}
                  onChange={handleChange}
                  invalid={!!formErrors.adPlanId}
                >
                  <option value="">Select Ad Plan</option>
                  {adPlans.map(plan =>
                    <option key={plan._id} value={plan._id}>
                      {plan.name}
                    </option>
                  )}
                </Input>
                {formErrors.adPlanId &&
                  <div className="text-danger">
                    {formErrors.adPlanId}
                  </div>}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="productIds">Product</Label>
                <Select
                    name="productIds"
                    options={productOptions}
                    classNamePrefix="select"
                    isMulti
                    onChange={handleProductChange}
                    value={selectedProductOptions}
                />
                {formErrors.productIds &&
                  <div className="text-danger">
                    {formErrors.productIds}
                  </div>}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  invalid={!!formErrors.startDate}
                />
                {formErrors.startDate &&
                  <div className="text-danger">
                    {formErrors.startDate}
                  </div>}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="endDate">End Date (Will be automatically calculated)</Label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  readOnly
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="price">Price (Will be automatically fetched)</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  invalid={!!formErrors.price}
                  readOnly
                />
                {formErrors.price &&
                  <div className="text-danger">
                    {formErrors.price}
                  </div>}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="keywords">Keywords (Comma separated)</Label>
                <Input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="Keywords"
                />
              </FormGroup>
            </Col>

            <Col xs={12}>
              <Button color="primary" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Col>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

export default AddServiceRequest;
