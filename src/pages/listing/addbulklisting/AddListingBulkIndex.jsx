import React, { useState } from 'react';
import { Container, Row, Col, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import '../../../assets/styles/HorizontalStepper.css';
import SelectVerticalTabs from './SelectVerticalTabs';
import SelectBrand from './SelectBrand';
import AddProductInfo from './AddProductInfo';
import { showToast } from '../../../components/ToastifyNotification';

const steps = [
    { label: 'SELECT VERTICAL' },
    { label: 'SELECT BRAND' },
    { label: 'ADD PRODUCT INFO' },
];

const AddListingBulkIndex = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [listingData, setListingData] = useState({
        categoryId: null,
        subCategoryOneId: null,
        subCategoryTwoId: null,
        brandId: null,
        
        mainImage: null,
        galleryImages: [],
        videos: [],
        type: null,
        
        name: "",
        sku: "",
        status: "",
        regularPrice: "",
        productPrice: "",
        comissionRate: "",
        comissionAmount: "",
        gstAmount: "",
        tcsAmount: "",
        shippingCharge: "",
        salePrice: "",
        minOrderQuantity: "",
        fulfillmentBy: "",
        procurementType: "",
        procurementSLA: "",
        stockQty: "",
        minStockQty: "",
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
        productDetails: [{ key: "", value: "" }], // The dynamic "Description *" inputs in section 3
        description: "", // The single 'Description' input in section 3
        more:'',
        type:'simple', 
        specifications: [],
        
        attributes: [],
    });

    // A more generic handler to update any part of the listingData state
    // This allows child components to update multiple fields at once if needed,
    // or just a single field.
    const handleListingDataChange = (updates) => {
        // Check if 'updates' is a function (callback from child)
        if (typeof updates === 'function') {
            // If it's a function, pass it directly to setListingData.
            // React's setState will then call this function with the current state.
            setListingData(updates);
        } else {
            // If it's an object, merge it into the existing state.
            setListingData(prevData => ({
                ...prevData,
                ...updates
            }));
        }
    };

    const handleNext = () => {
        // Validation based on the current step's required data
        if (currentStep === 0) {
            if (!listingData.categoryId || !listingData.subCategoryOneId || !listingData.subCategoryTwoId) {
                showToast('error', 'Please select all categories (Level 1, Level 2, and Level 3) before proceeding.');
                return;
            }
        }
        if (currentStep === 1) {
            if (!listingData.brandId) {
                showToast('error', 'Please select a brand before proceeding.');
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleFinalSubmit = () => {
        // Final validation before sending data to backend
        if (!listingData.categoryId || !listingData.subCategoryTwoId || !listingData.brandId ||
            !listingData.title || !listingData.description || !listingData.regularPrice || !listingData.stockQty) {
            showToast('error', 'Please complete all required product information before submitting.');
            return;
        }

        console.log("Final Listing Data for Submission:", listingData);
        // Here you would typically send `listingData` to your backend API
        // Example: await createProduct(listingData);
        showToast('success', 'Listing data submitted successfully!');
        // Optionally reset form or navigate away
        // setCurrentStep(0);
        // setListingData({ /* reset to initial state for a new listing */ });
    };

    const renderStepComponent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <SelectVerticalTabs
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        listingData={listingData} // Pass the entire listingData
                        onListingDataChange={handleListingDataChange} // Pass the handler
                    />
                );
            case 1:
                return (
                    <SelectBrand
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        listingData={listingData} // Pass the entire listingData
                        onListingDataChange={handleListingDataChange} // Pass the handler
                    />
                );
            case 2:
                return (
                    <AddProductInfo
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        listingData={listingData} // Pass the entire listingData
                        onListingDataChange={handleListingDataChange} // Pass the handler
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Add Bulk Listing</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Listings
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>
            <hr className='mt-0'/>
            <Row className="justify-content-left my-1">
                {steps.map((step, index) => (
                    <Col key={index} xs="auto" className="text-start step-wrapper">
                        <div className='d-flex'>
                            <div className={`step-circle ${currentStep === index ? 'active' : ''}`}>
                                {index + 1}
                            </div>
                            <div className={`step-label ms-2 ${currentStep === index ? 'active' : ''}`}>
                                {step.label}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
            <hr />

            <Row className="my-4">
                <Col>{renderStepComponent()}</Col>
            </Row>

            <Row className="justify-content-between mb-4">
                <Col xs="auto">
                    <Button
                        color="secondary"
                        disabled={currentStep === 0}
                        onClick={handlePrevious}
                    >
                        Previous
                    </Button>
                </Col>
                <Col xs="auto">
                    {currentStep < steps.length - 1 ? (
                        <Button
                            color="primary"
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            color="success"
                            onClick={handleFinalSubmit}
                            // Disable until all critical product details are filled
                            disabled={!listingData.title || !listingData.description || !listingData.regularPrice || !listingData.stockQty}
                        >
                            Submit Listing
                        </Button>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default AddListingBulkIndex;