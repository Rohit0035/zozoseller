import React, { useState } from 'react';
import { Container, Row, Col, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import '../../../assets/styles/HorizontalStepper.css';
import SelectVerticalTabs from './SelectVerticalTabs';
import SelectBrand from './SelectBrand';
import AddProductInfo from './AddProductInfo';

const steps = [
    { label: 'SELECT VERTICAL' },
    { label: 'SELECT BRAND' },
    { label: 'ADD PRODUCT INFO' },
];

const AddListingIndex = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const renderStepComponent = () => {
        switch (currentStep) {
            case 0:
                return <SelectVerticalTabs/>;
            case 1:
                return <SelectBrand/>;
            case 2:
                return <AddProductInfo/>;
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
                            <h5>Add Single Listing</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Listings
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>
            <hr  className='mt-0'/>
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
                        onClick={() => setCurrentStep(prev => prev - 1)}
                    >
                        Previous
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button
                        color="primary"
                        disabled={currentStep === steps.length - 1}
                        onClick={() => setCurrentStep(prev => prev + 1)}
                    >
                        Next
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default AddListingIndex;
