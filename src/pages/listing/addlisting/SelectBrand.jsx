import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardBody,
    Col,
    Input,
    Row,
    FormGroup,
    InputGroup,
} from 'reactstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { showToast } from '../../../components/ToastifyNotification'; // Assuming you have this

const SelectBrand = ({ currentStep, setCurrentStep, listingData, onListingDataChange }) => {
    const [brandNameInput, setBrandNameInput] = useState('');
    const [checkedBrandStatus, setCheckedBrandStatus] = useState(null); // 'success', 'error', null
    const [confirmedBrandId, setConfirmedBrandId] = useState(listingData.brandId || null); // Store the ID of the brand that passed check or was selected

    // Dummy list of available brands (replace with API call)
    const availableBrands = [
        { id: 'brand_adidas', name: 'Adidas' },
        { id: 'brand_calvinklein', name: 'Calvin Klein' },
        { id: 'brand_nike', name: 'Nike' },
        { id: 'brand_apple', name: 'Apple' },
        { id: 'brand_sandisk', name: 'Sandisk' },
        { id: 'brand_tucute', name: 'TUCUTE' }, // Your example brand
    ];

    // Simulate fetching recently used brands (replace with API call)
    const [recentlyUsedBrands, setRecentlyUsedBrands] = useState([
        { id: 'brand_tucute', name: 'TUCUTE' },
        { id: 'brand_nike', name: 'Nike' }
    ]);

    // Effect to update local state if listingData.brandId changes from parent
    useEffect(() => {
        if (listingData.brandId && !confirmedBrandId) {
            setConfirmedBrandId(listingData.brandId);
            const foundBrand = availableBrands.find(b => b.id === listingData.brandId);
            if (foundBrand) {
                setBrandNameInput(foundBrand.name);
                setCheckedBrandStatus('success');
            }
        }
    }, [listingData.brandId, confirmedBrandId]); // Add confirmedBrandId to dependency array


    const handleBrandCheck = () => {
        if (!brandNameInput.trim()) {
            showToast('error', 'Please enter a brand name to check.');
            setCheckedBrandStatus(null);
            return;
        }

        // Simulate API call to check brand existence/permission
        const foundBrand = availableBrands.find(
            (b) => b.name.toLowerCase() === brandNameInput.trim().toLowerCase()
        );

        if (foundBrand) {
            setCheckedBrandStatus('success');
            setConfirmedBrandId(foundBrand.id);
            showToast('success', `You can sell under ${foundBrand.name}.`);
        } else {
            setCheckedBrandStatus('error');
            setConfirmedBrandId(null);
            showToast('error', `Brand "${brandNameInput}" not found or not allowed.`);
        }
    };

    const handleCreateNewListing = () => {
        if (confirmedBrandId) {
            // Update the parent's listingData with the selected brandId
            onListingDataChange({ brandId: confirmedBrandId });
            setCurrentStep(prev => prev + 1); // Move to the next step
        } else {
            showToast('error', 'Please check and confirm a brand first.');
        }
    };

    const handleRecentBrandSelect = (brand) => {
        setBrandNameInput(brand.name);
        setConfirmedBrandId(brand.id);
        setCheckedBrandStatus('success');
        onListingDataChange({ brandId: brand.id }); // Update parent's state immediately
        setCurrentStep(prev => prev + 1); // Move to the next step
    };

    return (
        <>
            <Row>
                {/* Left Panel */}
                <Col md={6}>
                    <Card className="mb-4">
                        <CardBody>
                            <h5>Check for the Brand you want to sell</h5>
                            <FormGroup className="gap-2 mt-3">
                                <InputGroup>
                                    <Input
                                        type="text"
                                        placeholder="Enter Brand Name"
                                        value={brandNameInput}
                                        onChange={(e) => {
                                            setBrandNameInput(e.target.value);
                                            // Reset status when input changes
                                            setCheckedBrandStatus(null);
                                            setConfirmedBrandId(null);
                                        }}
                                        style={{ minWidth: '80% !important' }}
                                    />
                                    <Button color="primary" onClick={handleBrandCheck}>
                                        Check Brand
                                    </Button>
                                </InputGroup>
                            </FormGroup>

                            {checkedBrandStatus === 'success' && (
                                <div className="bg-light p-3 mt-4 border rounded d-flex align-items-center">
                                    <FaCheckCircle className="text-success me-2 fs-4" />
                                    <span>You can start selling under this brand</span>
                                </div>
                            )}

                            {checkedBrandStatus === 'error' && (
                                <div className="bg-light p-3 mt-4 border rounded d-flex align-items-center">
                                    <FaTimesCircle className="text-danger me-2 fs-4" />
                                    <span>Brand "{brandNameInput}" is not allowed or does not exist.</span>
                                </div>
                            )}

                            {confirmedBrandId && checkedBrandStatus === 'success' && (
                                <Button className="mt-2 btn-primary btn-sm" onClick={handleCreateNewListing}>
                                    Create new listing
                                </Button>
                            )}

                            <div className="text-center my-3">
                                <span className="badge bg-secondary">OR</span>
                            </div>

                            <p>Select one of your recently used brands from below</p>
                            {recentlyUsedBrands.length > 0 ? (
                                recentlyUsedBrands.map((brand) => (
                                    <Link
                                        key={brand.id}
                                        className="text-primary fw-bold text-decoration-none me-3"
                                        onClick={() => handleRecentBrandSelect(brand)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {brand.name}
                                    </Link>
                                ))
                            ) : (
                                <p className="text-muted">No recently used brands.</p>
                            )}
                        </CardBody>
                    </Card>
                </Col>

                {/* Right Panel (Brand Guidelines - No changes needed here for state) */}
                <Col md={6}>
                    <Card>
                        <CardBody>
                            <h5>Basic brand name guidelines to follow</h5>
                            <p className="text-muted">Use this quick guide to avoid brand name violation</p>

                            <Card className="mb-3">
                                <CardBody>
                                    <Row>
                                        <Col md={6}>
                                            <strong>Check the correct spelling</strong>
                                            <p className="text-danger mb-1">
                                                <FaTimesCircle className="me-1" /> AAdidass
                                            </p>
                                            <p className="text-success">
                                                <FaCheckCircle className="me-1" /> Adidas
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <strong>Use full forms</strong>
                                            <p className="text-danger mb-1">
                                                <FaTimesCircle className="me-1" /> CK
                                            </p>
                                            <p className="text-success">
                                                <FaCheckCircle className="me-1" /> Calvin Klein
                                            </p>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <strong>Avoid extra details</strong>
                                    <Row>
                                        <Col md={4}>
                                            <p className="text-muted mb-1">Vertical name</p>
                                            <p className="text-danger mb-1">
                                                <FaTimesCircle className="me-1" /> Nike Shoes
                                            </p>
                                            <p className="text-success">
                                                <FaCheckCircle className="me-1" /> Nike
                                            </p>
                                        </Col>
                                        <Col md={4}>
                                            <p className="text-muted mb-1">Product series</p>
                                            <p className="text-danger mb-1">
                                                <FaTimesCircle className="me-1" /> Apple Iphones
                                            </p>
                                            <p className="text-success">
                                                <FaCheckCircle className="me-1" /> Apple
                                            </p>
                                        </Col>
                                        <Col md={4}>
                                            <p className="text-muted mb-1">Product description</p>
                                            <p className="text-danger mb-1">
                                                <FaTimesCircle className="me-1" /> Sandisk 32GB
                                            </p>
                                            <p className="text-success">
                                                <FaCheckCircle className="me-1" /> Sandisk
                                            </p>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default SelectBrand;