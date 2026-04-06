import React, { useState, useEffect } from "react";
import {
	Card, CardBody, Button, Row, Col, Badge,
	Modal, ModalHeader, ModalBody, ModalFooter,
	Form, FormGroup, Label, Input
} from "reactstrap";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showToast } from "../ToastifyNotification";
import { IMAGE_URL } from "../../utils/api-config";
import { GetBrands } from "../../api/brandAPI";
import { GetCategories } from "../../api/categoryAPI";
import {
	GetVendorBrands,
	StoreVendorBrand,
	UpdateVendorBrand
} from "../../api/vendorBrandAPI";
import { renderFilePreview } from "../../utils/filePreview";

const VendorBrands = () => {
	const dispatch = useDispatch();

	const [vendorBrands, setVendorBrands] = useState([]);
	const [brandsList, setBrandsList] = useState([]);
	const [categories, setCategories] = useState([]);

	const [modal, setModal] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		brandType: "existing", // existing | own | other
		brandId: "",
		brandName: "",
		categoryId: "",
		trademarkNo: ""
	});

	const [files, setFiles] = useState({});

	const toggle = () => setModal(!modal);

	// ✅ Fetch data
	useEffect(() => {
		fetchVendorBrands();
		fetchCategories();
	}, []);

	const fetchVendorBrands = async () => {
		dispatch({ type: "loader", loader: true });
		try {
			const res = await GetVendorBrands();
			if (res.success) setVendorBrands(res.data);
			else showToast("error", res.message);
		} catch (err) {
			showToast("error", err);
		} finally {
			dispatch({ type: "loader", loader: false });
		}
	};

	const fetchBrands = async (data) => {
		dispatch({ type: "loader", loader: true });
		try {
			const res = await GetBrands(data);
			if (res.success) setBrandsList(res.data);
			else showToast("error", res.message);
		} catch (err) {
			showToast("error", err);
		} finally {
			dispatch({ type: "loader", loader: false });
		}
	};

	const fetchCategories = async () => {
		dispatch({ type: "loader", loader: true });
		try {
			const res = await GetCategories();
			if (res.success) setCategories(res.data);
			else showToast("error", res.message);
		} catch (err) {
			showToast("error", err);
		} finally {
			dispatch({ type: "loader", loader: false });
		}
	};

	// ➕ Add
	const openAdd = () => {
		setEditingId(null);
		setFormData({
			brandType: "existing",
			brandId: "",
			brandName: "",
			categoryId: "",
			trademarkNo: ""
		});
		setFiles({});
		toggle();
	};

	// ✏️ Edit
	const openEdit = (brand) => {
		setEditingId(brand._id);

		setFormData({
			brandType: brand.brandType || "existing",
			brandId: brand.brandId?._id || "",
			brandName: brand.brandName || "",
			categoryId: brand.categoryId?._id || "",
			trademarkNo: brand.trademarkNo,
			brandImage: brand.brandImage,
			trademarkCertificate: brand.trademarkCertificate,
			brandApprovalLetter: brand.brandApprovalLetter
		});

		fetchBrands({ categoryId: brand.categoryId?._id });
		toggle();
	};

	const handleChange = (field, value) => {
		setFormData((prev) => {
			let updated = { ...prev, [field]: value };

			// reset only relevant fields when switching type
			if (field === "brandType") {
				updated.brandId = "";
				updated.brandName = "";
			}

			return updated;
		});

		// ✅ Only reset brandImage (NOT all files)
		if (field === "brandType") {
			setFiles((prev) => ({
				...prev,
				brandImage: null // only remove logo
			}));
		}
	};

	const handleFileChange = (e, field) => {
		const file = e.target.files[0];
		if (!file) return;
		setFiles((prev) => ({ ...prev, [field]: file }));
	};

	// ✅ Validation
	const validate = () => {
		let newErrors = {};

		if (!formData.categoryId) {
			newErrors.categoryId = "Category is required";
		}

		if (formData.brandType === "existing") {
			if (!formData.brandId) {
				newErrors.brandId = "Please select a brand";
			}
		}

		if (formData.brandType === "own") {
			if (!formData.brandName) {
				newErrors.brandName = "Brand name is required";
			}
			if (!editingId && !files.brandImage) {
				newErrors.brandImage = "Brand logo is required";
			}
		}

		if (formData.brandType === "other") {
			if (!formData.brandName) {
				newErrors.brandName = "Brand name is required";
			}
		}

		if (!formData.trademarkNo) {
			newErrors.trademarkNo = "Trademark number is required";
		}

		if (!editingId) {
			if (!files.trademarkCertificate) {
				newErrors.trademarkCertificate = "Trademark certificate required";
			}
			if (!files.brandApprovalLetter) {
				newErrors.brandApprovalLetter = "Approval letter required";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// ✅ Submit
	const submitHandler = async () => {
		try {
			if (!validate()) return;

			const data = new FormData();

			Object.keys(formData).forEach((key) => {
				data.append(key, formData[key]);
			});

			Object.keys(files).forEach((key) => {
				data.append(key, files[key]);
			});

			if (editingId) {
				const res = await UpdateVendorBrand(editingId, data);
				if (res.success) {
					showToast("success", res.message);
					toggle();
					fetchVendorBrands();
				} else showToast("error", res.message);
			} else {
				const res = await StoreVendorBrand(data);
				if (res.success) {
					showToast("success", res.message);
					toggle();
					fetchVendorBrands();
				} else showToast("error", res.message);
			}
		} catch (err) {
			showToast("error", err);
		}
	};

	const getStatusColor = (status) => {
		if (status === "Approved") return "success";
		if (status === "Rejected") return "danger";
		return "warning";
	};

	return (
		<div>
			{/* Header */}
			<div className="d-flex justify-content-between mb-3">
				<h6 className="fw-bold">Vendor Brands</h6>
				<Button color="primary btn-sm" onClick={openAdd}>
					<FaPlus /> Add Brand
				</Button>
			</div>

			{/* Cards */}
			<Row>
				{vendorBrands?.map((b) => (
					<Col md={4} key={b._id}>
						<Card className="mb-3 shadow-sm">
							<CardBody>
								<div className="d-flex justify-content-between">
									<h6>{b.brandName || b.brandId?.name}</h6>
									<Badge color={getStatusColor(b.status)}>
										{b.status}
									</Badge>
								</div>

								<p><strong>Category:</strong> {b.categoryId?.name}</p>
								<p><strong>Trademark:</strong> {b.trademarkNo}</p>

								<div className="mt-2 text-end">
									<Button size="sm" onClick={() => openEdit(b)}>
										<FaEdit /> Edit
									</Button>
								</div>
							</CardBody>
						</Card>
					</Col>
				))}
			</Row>

			{/* Modal */}
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>
					{editingId ? "Edit Brand" : "Add Brand"}
				</ModalHeader>

				<Form>
					<ModalBody>

						{/* Category */}
						<FormGroup>
							<Label>Category</Label>
							<Input
								type="select"
								value={formData.categoryId}
								onChange={(e) => {
									handleChange("categoryId", e.target.value);
									fetchBrands({ categoryId: e.target.value });
								}}
								invalid={errors.categoryId}
							>
								<option value="">Select</option>
								{categories.map((c) => (
									<option key={c._id} value={c._id}>{c.name}</option>
								))}
							</Input>
							{errors.categoryId && <span className="text-danger">{errors.categoryId}</span>}
						</FormGroup>

						{/* Brand Type */}
						<FormGroup>
							<Label>Brand Type</Label>

							<div className="d-flex gap-3">
								<Input
									id="existing"
									type="radio"
									checked={formData.brandType === "existing"}
									onChange={() => handleChange("brandType", "existing")}
								/>
								<Label for="existing">Existing</Label>

								<Input
									id="own"
									type="radio"
									checked={formData.brandType === "own"}
									onChange={() => handleChange("brandType", "own")}
								/>
								<Label for="own">Own</Label>

								<Input
									id="other"
									type="radio"
									checked={formData.brandType === "other"}
									onChange={() => handleChange("brandType", "other")}
								/>
								<Label for="other">Other</Label>
							</div>
						</FormGroup>

						{/* Existing */}
						{formData.brandType === "existing" && (
							<FormGroup>
								<Label>Select Brand</Label>
								<Input
									type="select"
									value={formData.brandId}
									onChange={(e) => handleChange("brandId", e.target.value)}
									invalid={errors.brandId}
								>
									<option value="">Select</option>
									{brandsList.map((b) => (
										<option key={b._id} value={b._id}>{b.name}</option>
									))}
								</Input>
								{errors.brandId && <span className="text-danger">{errors.brandId}</span>}
							</FormGroup>
						)}

						{/* Own */}
						{formData.brandType === "own" && (
							<>
								<FormGroup>
									<Label>Brand Name</Label>
									<Input
										value={formData.brandName}
										onChange={(e) => handleChange("brandName", e.target.value)}
										invalid={errors.brandName}
									/>
									{errors.brandName && <span className="text-danger">{errors.brandName}</span>}
								</FormGroup>

								<FormGroup>
									<Label>Brand Logo * <small>(Only .jpg, .jpeg, .png format are allowed)</small></Label>
									<Input
										accept="image/*"
										type="file"
										onChange={(e) => handleFileChange(e, "brandImage")}
										invalid={errors.brandImage}
									/>
									{errors.brandImage && <span className="text-danger">{errors.brandImage}</span>}
									{renderFilePreview(
										files.brandImage ||
										(formData.brandImage && `${IMAGE_URL}/${formData.brandImage}`)
									)}
								</FormGroup>
							</>
						)}

						{/* Other */}
						{formData.brandType === "other" && (
							<FormGroup>
								<Label>Brand Name</Label>
								<Input
									value={formData.brandName}
									onChange={(e) => handleChange("brandName", e.target.value)}
									invalid={errors.brandName}
								/>
								{errors.brandName && <span className="text-danger">{errors.brandName}</span>}
							</FormGroup>
						)}

						{/* Trademark */}
						<FormGroup>
							<Label>Trademark No</Label>
							<Input
								value={formData.trademarkNo}
								onChange={(e) => handleChange("trademarkNo", e.target.value)}
								invalid={errors.trademarkNo}
							/>
							{errors.trademarkNo && <span className="text-danger">{errors.trademarkNo}</span>}
						</FormGroup>

						<FormGroup>
							<Label>Trademark Certificate * <small>(Only .jpg, .jpeg, .png, .pdf formats are allowed)</small></Label>
							<Input
								accept="image/*, application/pdf"
								type="file"
								onChange={(e) => handleFileChange(e, "trademarkCertificate")}
								invalid={errors.trademarkCertificate}
							/>
							{errors.trademarkCertificate && <span className="text-danger">{errors.trademarkCertificate}</span>}
							{renderFilePreview(
								files.trademarkCertificate ||
								(formData.trademarkCertificate && `${IMAGE_URL}/${formData.trademarkCertificate}`)
							)}
						</FormGroup>

						<FormGroup>
							<Label>Approval Letter * <small>(Only .jpg, .jpeg, .png, .pdf formats are allowed)</small></Label>
							<Input
								accept="image/*, application/pdf"
								type="file"
								onChange={(e) => handleFileChange(e, "brandApprovalLetter")}
								invalid={errors.brandApprovalLetter}
							/>
							{errors.brandApprovalLetter && <span className="text-danger">{errors.brandApprovalLetter}</span>}
							{renderFilePreview(
								files.brandApprovalLetter ||
								(formData.brandApprovalLetter && `${IMAGE_URL}/${formData.brandApprovalLetter}`)
							)}
						</FormGroup>

					</ModalBody>

					<ModalFooter>
						<Button color="primary" onClick={submitHandler}>
							Save
						</Button>
						<Button onClick={toggle}>Cancel</Button>
					</ModalFooter>
				</Form>
			</Modal>
		</div>
	);
};

export default VendorBrands;