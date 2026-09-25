import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  FormFeedback,
  Alert
} from "reactstrap";
import { showToast } from "../components/ToastifyNotification";
// ADD ChangePasswordApi TO YOUR authAPI.js FILE
import { ChangePasswordApi } from "../api/authAPI"; 

const ChangePassword = () => {
  // Form states
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation & Error states
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------
  // VALIDATION LOGIC
  // ---------------------------------------------------------
  const validate = () => {
    let newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current Password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = "New password cannot be the same as the current password";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      setIsLoading(true);
      const payload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      const response = await ChangePasswordApi(payload);

      if (response.status === true) {
        showToast("success", response.message || "Password changed successfully!");
        // Clear form on success
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setApiError(response.message);
        showToast("error", response.message);
      }
    } catch (error) {
      const errorMsg = error?.message || "An error occurred while changing password";
      setApiError(errorMsg);
      showToast("error", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to handle input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
    if (apiError) setApiError("");
  };

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-white border-bottom-0 pt-4 pb-0">
        <h4 className="mb-0">Change Password</h4>
        <p className="text-muted small">Update your account password securely.</p>
      </CardHeader>
      
      <CardBody>
        {apiError && <Alert color="danger">{apiError}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          {/* Current Password Field */}
          <FormGroup className="mb-3">
            <Label for="currentPassword">Current Password</Label>
            <div className="position-relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={formData.currentPassword}
                invalid={!!errors.currentPassword}
                style={{ paddingRight: "40px" }}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              />
              <span
                onClick={() => setShowCurrent(!showCurrent)}
                className="position-absolute"
                style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 10 }}
              >
                {showCurrent ? "🙈" : "👁️"}
              </span>
            </div>
            {errors.currentPassword && <FormFeedback className="d-block">{errors.currentPassword}</FormFeedback>}
          </FormGroup>

          {/* New Password Field */}
          <FormGroup className="mb-3">
            <Label for="newPassword">New Password</Label>
            <div className="position-relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.newPassword}
                invalid={!!errors.newPassword}
                style={{ paddingRight: "40px" }}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="position-absolute"
                style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 10 }}
              >
                {showNew ? "🙈" : "👁️"}
              </span>
            </div>
            {errors.newPassword && <FormFeedback className="d-block">{errors.newPassword}</FormFeedback>}
          </FormGroup>

          {/* Confirm Password Field */}
          <FormGroup className="mb-4">
            <Label for="confirmPassword">Confirm New Password</Label>
            <div className="position-relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                invalid={!!errors.confirmPassword}
                style={{ paddingRight: "40px" }}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="position-absolute"
                style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", zIndex: 10 }}
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
            {errors.confirmPassword && <FormFeedback className="d-block">{errors.confirmPassword}</FormFeedback>}
          </FormGroup>

          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ChangePassword;