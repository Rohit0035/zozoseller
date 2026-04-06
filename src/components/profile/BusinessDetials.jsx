import React, { useEffect, useState } from 'react';
import {
	Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
	Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaEdit } from 'react-icons/fa';
import { IMAGE_URL } from '../../utils/api-config';
import { buildFormData } from '../../utils/common';
import { renderFilePreview } from '../../utils/filePreview';

const BusinessDetials = ({ profileData, handleSubmit }) => {

	const [modal, setModal] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const toggle = () => setModal(!modal);

	const [files, setFiles] = useState({});
	const [previews, setPreviews] = useState({});
	const [errors, setErrors] = useState({}); // ✅ NEW

	const [businessData, setBusinessData] = useState({
		businessType: '',
		businessName: '',
		gstNo: '',
		gstFile: '',
		panCard: '',
		panFile: '',
		aadharNo: '',
		aadharFront: '',
		aadharBack: '',
		proprietorImage: '',
		tanNo: '',
		cinCertificate: '',
	});

	useEffect(() => {
		const data = profileData?.businessDetails || {};

		setBusinessData({
			businessType: data.businessType,
			businessName: data.businessName,
			gstNo: data.gstNo,
			gstFile: data.gstFile ? `${IMAGE_URL}/${data.gstFile}` : '',
			panCard: data.panCard,
			panFile: data.panFile ? `${IMAGE_URL}/${data.panFile}` : '',
			aadharNo: data.aadharNo,
			aadharFront: data.aadharFront ? `${IMAGE_URL}/${data.aadharFront}` : '',
			aadharBack: data.aadharBack ? `${IMAGE_URL}/${data.aadharBack}` : '',
			proprietorImage: data.proprietorImage ? `${IMAGE_URL}/${data.proprietorImage}` : '',
			tanNo: data.tanNo,
			cinCertificate: data.cinCertificate ? `${IMAGE_URL}/${data.cinCertificate}` : '',
		});

		setPreviews({
			gstFile: data.gstFile ? `${IMAGE_URL}/${data.gstFile}` : '',
			panFile: data.panFile ? `${IMAGE_URL}/${data.panFile}` : '',
			aadharFront: data.aadharFront ? `${IMAGE_URL}/${data.aadharFront}` : '',
			aadharBack: data.aadharBack ? `${IMAGE_URL}/${data.aadharBack}` : '',
			proprietorImage: data.proprietorImage ? `${IMAGE_URL}/${data.proprietorImage}` : '',
			cinCertificate: data.cinCertificate ? `${IMAGE_URL}/${data.cinCertificate}` : '',
		});

	}, [profileData]);

	const handleFileChange = (e, field) => {
		const file = e.target.files[0];
		if (file) {
			setFiles(prev => ({ ...prev, [field]: file }));
			setPreviews(prev => ({
				...prev,
				[field]: URL.createObjectURL(file)
			}));
		}
	};

	// ✅ VALIDATION FUNCTION
	const validate = () => {
		let newErrors = {};

		if (!businessData.businessType) newErrors.businessType = "Business Type is required";
		if (!businessData.businessName) newErrors.businessName = "Business Name is required";
		if (!businessData.gstNo) newErrors.gstNo = "GST Number is required";
		if (!businessData.panCard) newErrors.panCard = "PAN Number is required";
		if (!businessData.aadharNo) newErrors.aadharNo = "Aadhar Number is required";
		
		if (!files.gstFile && !businessData.gstFile)
			newErrors.gstFile = "GST Certificate is required";

		if (!files.panFile && !businessData.panFile)
			newErrors.panFile = "PAN Card is required";

		if (!files.aadharFront && !businessData.aadharFront)
			newErrors.aadharFront = "Aadhar Front is required";

		if (!files.aadharBack && !businessData.aadharBack)
			newErrors.aadharBack = "Aadhar Back is required";
		
		if (!files.proprietorImage && !businessData.proprietorImage)
			newErrors.proprietorImage = "Proprietor Image is required";
		
		if (!businessData.tanNo && businessData.businessType === 'Private Limited') newErrors.tanNo = "TAN Number is required";
		if (!files.cinCertificate && !businessData.cinCertificate && businessData.businessType === 'Private Limited')
			newErrors.cinCertificate = "CIN Certificate is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	return (
		<Card className="h-100 bg-light shadow-sm border-0">
			<CardBody>

				<div className="d-flex justify-content-between mb-2">
					<h6 className="fw-bold">Business Details</h6>
					<Button color="link" onClick={toggle}>
						<FaEdit size={14} /> EDIT
					</Button>
				</div>

				<div className="mb-2">
					<strong>Business Type:</strong> {businessData.businessType}
				</div>

				<div className="mb-2">
					<strong>Business Name:</strong> {businessData.businessName}
				</div>

				<div className="mb-2">
					<strong>GST No:</strong> {businessData.gstNo}
				</div>

				<div className="mb-2">
					<strong>GST File:</strong><br />
					{previews.gstFile && <img src={previews.gstFile} width={120} alt="" />}
				</div>

				<div className="mb-2">
					<strong>PAN Card:</strong> {businessData.panCard}
				</div>

				<div className="mb-2">
					<strong>PAN File:</strong><br />
					{previews.panFile && <img src={previews.panFile} width={120} alt="" />}
				</div>

				{showMore && (
					<>
						<div className="mb-2">
							<strong>Aadhar No:</strong> {businessData.aadharNo}
						</div>

						<div className="mb-2">
							<strong>Aadhar Front:</strong><br />
							{previews.aadharFront && <img src={previews.aadharFront} width={120} alt="" />}
						</div>

						<div className="mb-2">
							<strong>Aadhar Back:</strong><br />
							{previews.aadharBack && <img src={previews.aadharBack} width={120} alt="" />}
						</div>

						<div className="mb-2">
							<strong>Proprietor Image:</strong><br />
							{previews.proprietorImage && <img src={previews.proprietorImage} width={120} alt="" />}
						</div>
						{
							businessData.businessType === 'Private Limited' &&
							<>
								<div className="mb-2">
									<strong>TAN No:</strong> {businessData.tanNo}
								</div>

								<div className="mb-2">
									<strong>CIN Certificate:</strong><br />
									{previews.cinCertificate && <img src={previews.cinCertificate} width={120} alt="" />}
								</div>
							</>
						}
					</>
				)}

				<div
					className="text-primary mt-2"
					style={{ cursor: 'pointer' }}
					onClick={() => setShowMore(!showMore)}
				>
					{showMore ? 'Less' : 'More'}
				</div>

			</CardBody>
			{/* EDIT MODAL */}
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Edit Business Details</ModalHeader>

				<Form>
					<ModalBody>

						<FormGroup>
							<Label>Business Type *</Label>
							<Input
								type="select"
								value={businessData.businessType || ''}
								invalid={!!errors.businessType}
								onChange={(e) =>
									setBusinessData({ ...businessData, businessType: e.target.value })
								}
								>
								<option value="">Select Business Type</option>
								<option value="Proprietorship">Proprietorship</option>
								<option value="Partnership">Partnership</option>
								<option value="LLP">LLP</option>
								<option value="Private Limited">Private Limited</option>
								<option value="Public Limited">Public Limited</option>
								<option value="Other">Other</option>
							</Input>
							<div className="text-danger">{errors.businessType}</div>
						</FormGroup>

						<FormGroup>
							<Label>Business Name *</Label>
							<Input
								value={businessData.businessName || ''}
								invalid={!!errors.businessName}
								onChange={(e) =>
									setBusinessData({ ...businessData, businessName: e.target.value })
								}
							/>
							<div className="text-danger">{errors.businessName}</div>
						</FormGroup>

						<FormGroup>
							<Label>GST No *</Label>
							<Input
								value={businessData.gstNo || ''}
								invalid={!!errors.gstNo}
								onChange={(e) =>
									setBusinessData({ ...businessData, gstNo: e.target.value })
								}
							/>
							<div className="text-danger">{errors.gstNo}</div>
						</FormGroup>

						<FormGroup>
							<Label>GST File * <small>(Only .jpg, .jpeg, .png, .pdf formats are allowed)</small></Label>
							<Input type="file" onChange={(e) => handleFileChange(e, 'gstFile')} accept='image/*,application/pdf'/>
							<div className="text-danger">{errors.gstFile}</div>
							{renderFilePreview(files.gstFile || businessData.gstFile)}
						</FormGroup>

						<FormGroup>
							<Label>PAN Card *</Label>
							<Input
								value={businessData.panCard || ''}
								invalid={!!errors.panCard}
								onChange={(e) =>
									setBusinessData({ ...businessData, panCard: e.target.value })
								}
							/>
							<div className="text-danger">{errors.panCard}</div>
						</FormGroup>

						<FormGroup>
							<Label>PAN File * <small>(Only .jpg, .jpeg, .png, .pdf formats are allowed)</small></Label>
							<Input type="file" onChange={(e) => handleFileChange(e, 'panFile')} accept='image/*,application/pdf'/>
							<div className="text-danger">{errors.panFile}</div>
							{renderFilePreview(files.panFile || businessData.panFile)}
						</FormGroup>

						<FormGroup>
							<Label>Aadhar No *</Label>
							<Input
								value={businessData.aadharNo || ''}
								invalid={!!errors.aadharNo}
								onChange={(e) =>
									setBusinessData({ ...businessData, aadharNo: e.target.value })
								}
							/>
							<div className="text-danger">{errors.aadharNo}</div>
						</FormGroup>

						<FormGroup>
							<Label>Aadhar Front * <small>(Only .jpg, .jpeg, .png, .pdf formats are allowed)</small></Label>
							<Input type="file" onChange={(e) => handleFileChange(e, 'aadharFront')} accept='image/*,application/pdf' />
							<div className="text-danger">{errors.aadharFront}</div>
							{renderFilePreview(files.aadharFront || businessData.aadharFront)}
						</FormGroup>

						<FormGroup>
							<Label>Aadhar Back * <small>(Only .jpg, .jpeg, .png, .pdf formats are allowed)</small></Label>
							<Input type="file" onChange={(e) => handleFileChange(e, 'aadharBack')} accept='image/*,application/pdf' />
							<div className="text-danger">{errors.aadharBack}</div>
							{renderFilePreview(files.aadharBack || businessData.aadharBack)}
						</FormGroup>

						<FormGroup>
							<Label>Proprietor Image * <small>(Only .jpg, .jpeg, .png formats are allowed)</small></Label>
							<Input type="file" onChange={(e) => handleFileChange(e, 'proprietorImage')}  accept='image/*'/>
							<div className="text-danger">{errors.proprietorImage}</div>
							{renderFilePreview(files.proprietorImage || businessData.proprietorImage)}
						</FormGroup>

						{businessData.businessType === 'Private Limited' && (
							<>
								<FormGroup>
									<Label>TAN No *</Label>
									<Input
										value={businessData.tanNo || ''}
										invalid={!!errors.tanNo}
										onChange={(e) =>
											setBusinessData({ ...businessData, tanNo: e.target.value })
										}
									/>
									<div className="text-danger">{errors.tanNo}</div>
								</FormGroup>

								<FormGroup>
									<Label>CIN Certificate * <small>(Only .jpg, .jpeg, .png, .pdf formats are allowed)</small></Label>
									<Input type="file" onChange={(e) => handleFileChange(e, 'cinCertificate')} accept='image/*,application/pdf' />
									<div className="text-danger">{errors.cinCertificate}</div>
									{renderFilePreview(files.cinCertificate || businessData.cinCertificate)}
								</FormGroup>
							</>
						)}

					</ModalBody>

					<ModalFooter>
						<Button
							color="primary"
							onClick={() => {
								if (!validate()) return;

								const formData = buildFormData('businessDetails', businessData);

								Object.keys(files).forEach((key) => {
									formData.append(key, files[key]);
								});

								handleSubmit(formData);
								toggle();
							}}
						>
							Save
						</Button>

						<Button onClick={toggle}>Cancel</Button>
					</ModalFooter>
				</Form>

			</Modal>
		</Card>



	);
};

export default BusinessDetials;