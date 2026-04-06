import React, { useEffect, useState } from 'react';
import {
	Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
	Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaEdit } from 'react-icons/fa';
import { IMAGE_URL } from '../../utils/api-config';
import { buildFormData } from '../../utils/common';

const BrandDetails = ({ profileData, handleSubmit }) => {

	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	const [files, setFiles] = useState({});
	const [previews, setPreviews] = useState({});
	const [errors, setErrors] = useState({});

	const [brandData, setBrandData] = useState({
		brandName: '',
		trademarkNo: '',
		trademarkCertificate: '',
		brandApprovalLetter: '',
	});

	useEffect(() => {
		const data = profileData?.brandDetails || {};

		setBrandData(data);

		setPreviews({
			trademarkCertificate: data.trademarkCertificate ? `${IMAGE_URL}/${data.trademarkCertificate}` : '',
			brandApprovalLetter: data.brandApprovalLetter ? `${IMAGE_URL}/${data.brandApprovalLetter}` : '',
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

	const validate = () => {
		let newErrors = {};

		if (!brandData.brandName) newErrors.brandName = "Brand Name is required";
		if (!brandData.trademarkNo) newErrors.trademarkNo = "Trademark Number is required";

		if (!files.trademarkCertificate && !brandData.trademarkCertificate)
			newErrors.trademarkCertificate = "Trademark Certificate is required";

		if (!files.brandApprovalLetter && !brandData.brandApprovalLetter)
			newErrors.brandApprovalLetter = "Brand Approval Letter is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	return (
		<Card className="h-100 bg-light shadow-sm border-0">
			<CardBody>

				<div className="d-flex justify-content-between mb-2">
					<h6 className="fw-bold">Brand Details</h6>
					<Button color="link" onClick={toggle}>
						<FaEdit size={14} /> EDIT
					</Button>
				</div>

				<div className="mb-2">
					<strong>Brand Name:</strong> {brandData.brandName}
				</div>

				<div className="mb-2">
					<strong>Trademark No:</strong> {brandData.trademarkNo}
				</div>

				<div className="mb-2">
					<strong>Trademark Certificate:</strong><br />
					{previews.trademarkCertificate && <img src={previews.trademarkCertificate} width={120} alt="" />}
				</div>

				<div className="mb-2">
					<strong>Approval Letter:</strong><br />
					{previews.brandApprovalLetter && <img src={previews.brandApprovalLetter} width={120} alt="" />}
				</div>

			</CardBody>
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Edit Brand Details</ModalHeader>

				<Form>
					<ModalBody>

						<FormGroup>
							<Label>Brand Name *</Label>
							<Input
								value={brandData.brandName || ''}
								invalid={!!errors.brandName}
								onChange={(e) =>
									setBrandData({ ...brandData, brandName: e.target.value })
								}
							/>
							<div className="text-danger">{errors.brandName}</div>
						</FormGroup>

						<FormGroup>
							<Label>Trademark No *</Label>
							<Input
								value={brandData.trademarkNo || ''}
								invalid={!!errors.trademarkNo}
								onChange={(e) =>
									setBrandData({ ...brandData, trademarkNo: e.target.value })
								}
							/>
							<div className="text-danger">{errors.trademarkNo}</div>
						</FormGroup>

						<FormGroup>
							<Label>Trademark Certificate * (Only .jpg, .jpeg, .png, .pdf formats are allowed)</Label>
							<Input type="file" onChange={(e) => handleFileChange(e, 'trademarkCertificate')} accept='image/*, application/pdf'/>
							{previews.trademarkCertificate && <img src={previews.trademarkCertificate} width={100} alt="" />}
							<div className="text-danger">{errors.trademarkCertificate}</div>
						</FormGroup>

						<FormGroup>
							<Label>Brand Approval Letter * (Only .jpg, .jpeg, .png, .pdf formats are allowed)</Label>
							<Input type="file" onChange={(e) => handleFileChange(e, 'brandApprovalLetter')}  accept='image/*, application/pdf'/>
							{previews.brandApprovalLetter && <img src={previews.brandApprovalLetter} width={100} alt="" />}
							<div className="text-danger">{errors.brandApprovalLetter}</div>
						</FormGroup>

					</ModalBody>

					<ModalFooter>
						<Button
							color="primary"
							onClick={() => {
								if (!validate()) return;

								const formData = buildFormData('brandDetails', brandData);
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

export default BrandDetails;