import React, { useEffect, useState } from 'react';
import {
	Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
	Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaCheckCircle, FaEdit, FaChevronRight } from 'react-icons/fa';
import { IMAGE_URL } from '../../utils/api-config';
import { buildFormData } from '../../utils/common';

const BusinessDetial = ({ profileData, handleSubmit }) => {
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const toggle = () => setModal(!modal);
	const toggle2 = () => setModal2(!modal2);

	const [image, setImage] = useState('');
	const [imagePreview, setImagePreview] = useState(`${IMAGE_URL}${profileData?.brandDetails?.brandNameCertificate}`);

	const [businessData, setBusinessData] = useState({
		businessName: profileData?.companyName,
		tan: profileData?.tan,
		gstin: profileData?.gstin,
		address: profileData?.companyAddress,
		signature: profileData?.signature,
		businessType: profileData?.businessType,
		pan: profileData?.pan,
		addressProof: profileData?.addressProof,
		state: profileData?.state,
	});

	const [brandData, setBrandData] = useState({
		brandType: profileData?.brandDetails?.brandType || 'Own Brand',
		brandName: profileData?.brandDetails?.brandName,
		brandNameCertificate: profileData?.brandDetails?.brandNameCertificate,
	});

	useEffect(() => {
		setBusinessData({
			businessName: profileData?.companyName,
			tan: profileData?.tan,
			gstin: profileData?.gstin,
			address: profileData?.companyAddress,
			signature: profileData?.signature,
			businessType: profileData?.businessType,
			pan: profileData?.pan,
			addressProof: profileData?.addressProof,
			state: profileData?.state,
		});

		setBrandData({
			brandType: profileData?.brandDetails?.brandType || 'Own Brand',
			brandName: profileData?.brandDetails?.brandName,
			brandNameCertificate: '',
		});	
		setImagePreview(`${IMAGE_URL}/${profileData?.brandDetails?.brandNameCertificate}`);

	}, [profileData])

	const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
			setImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
			setImagePreview(`${IMAGE_URL}${profileData?.brandDetails?.brandNameCertificate}`);
        }
    };

	return (
		<Row className="g-3">
			{/* Business Details Card */}
			<Col md="4">
				<Card className="h-100 bg-light shadow-sm border-0">
					<CardBody>
						<div className="d-flex justify-content-between align-items-start mb-2">
							<h6 className="fw-bold">Business Details</h6>
							<Button color="link" className="p-0" onClick={toggle}><FaEdit size={14} /> EDIT</Button>
						</div>
						<small className="text-muted">Business Name</small>
						<p className="mb-2">{businessData.businessName} <FaCheckCircle className="text-success ms-1" /></p>

						<small className="text-muted">TAN</small>
						<p className="mb-2">{businessData.tan}</p>

						<small className="text-muted">GSTIN / Provisional ID Number</small>
						<p className="mb-2">{businessData.gstin} <FaCheckCircle className="text-success ms-1" /></p>

						<small className="text-muted">Registered business address</small>
						<p className="mb-2">{businessData.address}</p>

						{showMore && (
							<>
								<small className="text-muted">Signature</small>
								<p className="mb-2">{businessData.signature} <FaCheckCircle className="text-success ms-1" /></p>

								<small className="text-muted">Business Type</small>
								<p className="mb-2">{businessData.businessType}</p>

								<small className="text-muted">PAN</small>
								<p className="mb-2">{businessData.pan} <FaCheckCircle className="text-success ms-1" /></p>

								<small className="text-muted">Address Proof</small>
								<p className="mb-2">{businessData.addressProof}</p>

								<small className="text-muted">State</small>
								<p className="mb-2">{businessData.state}</p>
							</>
						)}

						<div
							className="border-top pt-2 text-primary"
							style={{ cursor: 'pointer', fontSize: '14px' }}
							onClick={() => setShowMore(prev => !prev)}
						>
							{showMore ? 'Less' : 'More'}
						</div>
					</CardBody>
				</Card>
			</Col>

			<Col md="4">
				<Card className="h-100 bg-light shadow-sm border-0">
					<CardBody>
						<div className="d-flex justify-content-between align-items-start mb-2">
							<h6 className="fw-bold">Brand Details</h6>
							<Button color="link" className="p-0" onClick={toggle2}><FaEdit size={14} /> EDIT</Button>
						</div>
						<small className="text-muted">Brand Type</small>
						<p className="mb-2">{brandData?.brandType} <FaCheckCircle className="text-success ms-1" /></p>

						<small className="text-muted">Brand Name</small>
						<p className="mb-2">{brandData?.brandName} <FaCheckCircle className="text-success ms-1" /></p>

						<small className="text-muted">Brand Name Certificate</small>
						{/* <p className="mb-2">{brandData?.brandNameCertificate}</p> */}
						<img src={imagePreview} className="img-fluid" alt="" width={300}/>
					</CardBody>
				</Card>
			</Col>

			{/* GST Details Card */}
			<Col md="4">
				<Card className="h-100 bg-light shadow-sm border-0">
					<CardBody>
						<h6 className="fw-bold mb-3">GST Details</h6>
						<div className="border rounded p-2 d-flex justify-content-between align-items-center">
							<div>
								<div className="fw-bold text-success d-flex align-items-center">
									Verification Status <FaCheckCircle className="ms-2" />
								</div>
								<small className="text-muted">All GSTINs verifications are complete</small>
							</div>
							<FaChevronRight className="text-muted" />
						</div>
					</CardBody>
				</Card>
			</Col>

			{/* Modal for Editing Business Details */}
			<Modal isOpen={modal} toggle={toggle}>
				<ModalHeader toggle={toggle}>Edit Business Details</ModalHeader>
				<Form>
					<ModalBody>
						<FormGroup>
							<Label>Business Name</Label>
							<Input value={businessData.businessName} onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>TAN</Label>
							<Input value={businessData.tan} onChange={(e) => setBusinessData({ ...businessData, tan: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>GSTIN</Label>
							<Input value={businessData.gstin} onChange={(e) => setBusinessData({ ...businessData, gstin: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>Registered Business Address</Label>
							<Input value={businessData.address} onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>Signature</Label>
							<Input value={businessData.signature} onChange={(e) => setBusinessData({ ...businessData, signature: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>Business Type</Label>
							<Input value={businessData.businessType} onChange={(e) => setBusinessData({ ...businessData, businessType: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>PAN</Label>
							<Input value={businessData.pan} onChange={(e) => setBusinessData({ ...businessData, pan: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>Address Proof</Label>
							<Input value={businessData.addressProof} onChange={(e) => setBusinessData({ ...businessData, addressProof: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>State</Label>
							<Input value={businessData.state} onChange={(e) => setBusinessData({ ...businessData, state: e.target.value })} />
						</FormGroup>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={() => { 
								const formData = buildFormData('businessDetails', businessData);
								handleSubmit(formData);
								toggle();
							 }}>Save</Button>
						<Button color="secondary" onClick={toggle}>Cancel</Button>
					</ModalFooter>
				</Form>
			</Modal>
			
			{/* Modal for Editing Business Details */}
			<Modal isOpen={modal2} toggle={toggle2}>
				<ModalHeader toggle={toggle2}>Edit Brand Details</ModalHeader>
				<Form>
					<ModalBody>
						<FormGroup>
							<Label>Brand Type</Label>
							<Input
								type="select"
								value={brandData?.brandType}
								onChange={(e) => setBrandData({ ...brandData, brandType: e.target.value })}
							>
								<option value="Own Brand">Own Brand</option>
								<option value="Other Brand">Other Brand</option>
							</Input>
							{/* <Input value={brandData?.brandType} onChange={(e) => setBrandData({ ...brandData, brandType: e.target.value })} /> */}
						</FormGroup>
						<FormGroup>
							<Label>Brand Name</Label>
							<Input value={brandData?.brandName} onChange={(e) => setBrandData({ ...brandData, brandName: e.target.value })} />
						</FormGroup>
						<FormGroup>
							<Label>Brand Name Certificate</Label>
							<Input 
								type='file'
								accept='image/*' 
								value={brandData?.brandNameCertificate} 
								onChange={(e) => { handleImageChange(e)}} 
							/>
						</FormGroup>
						{
							imagePreview && <img src={imagePreview} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
						}
					</ModalBody>
					<ModalFooter>
						<Button color="primary" 
							onClick={() => {
								const formData = buildFormData('brandDetails', brandData, 'brandNameCertificate', image);
								handleSubmit(formData);
								toggle2(); 
							}}>Save</Button>
						<Button color="secondary" onClick={toggle2}>Cancel</Button>
					</ModalFooter>
				</Form>
			</Modal>


		</Row>
	);
};

export default BusinessDetial;
