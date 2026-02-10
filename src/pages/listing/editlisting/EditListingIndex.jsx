import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import '../../../assets/styles/HorizontalStepper.css';
import SelectVerticalTabs from './SelectVerticalTabs';
import SelectBrand from './SelectBrand';
import AddProductInfo from './AddProductInfo';
import { showToast } from '../../../components/ToastifyNotification';
import { useParams } from 'react-router-dom';
import { GetProductById } from '../../../api/productAPI';
import { getDefaultListingData } from '../../../utils/productInitialize';
import { parseJSON } from 'date-fns';

const steps = [
    { label: 'SELECT VERTICAL' },
    { label: 'SELECT BRAND' },
    { label: 'ADD PRODUCT INFO' },
];

const EditListingIndex = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    const [currentStep, setCurrentStep] = useState(0);
    const [listingData, setListingData] = useState(getDefaultListingData());

    useEffect(() => {
    const fetchProduct = async () => {
      try {
        // fetch product
        const prodRes = await GetProductById(id);
        if (prodRes?.success && prodRes.data) {
          const product = prodRes.data;
            // console.log(product);
          // set product data
          setListingData(product);
          setListingData({
                ...product,
                categoryId: product.categoryId?._id,
                subCategoryOneId: product.subCategoryOneId?._id,
                subCategoryTwoId: product.subCategoryTwoId?._id,
                brandId: product.brandId?._id,
                hsn: product.hsn?._id,
                productDetails: [],
            });

            console.log("listingData",product);
        } else {
          showToast('error', prodRes.message || 'Failed to fetch product details');
          // optionally navigate back
        }
      } catch (err) {
        console.error(err);
        showToast('error', 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    // Re-call fetchProduct to ensure all data is loaded
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Added setValue to dependencies for useEffect calls

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

    if (loading) return <div>Loading product...</div>;


    return (
        <>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Edit Product</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Product
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
                    ) : ""}
                </Col>
            </Row>
        </>
    );
};

export default EditListingIndex;