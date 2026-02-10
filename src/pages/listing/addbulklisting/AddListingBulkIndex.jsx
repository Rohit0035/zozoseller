import React, { useState } from 'react';
import { Container, Row, Col, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import '../../../assets/styles/HorizontalStepper.css';
import SelectVerticalTabs from './SelectVerticalTabs';
import SelectBrand from './SelectBrand';
import AddProductInfo from './AddProductInfo';
import { showToast } from '../../../components/ToastifyNotification';
import { useDispatch } from 'react-redux';
import { StoreBulkProducts } from '../../../api/productAPI';
import { useNavigate } from 'react-router-dom';

const steps = [
    { label: 'SELECT VERTICAL' },
    { label: 'SELECT BRAND' },
    { label: 'ADD PRODUCT INFO' },
];

const REQUIRED_PRODUCT_FIELDS = [
  "name",
  "sku",
  "regularPrice",
  "stockQty",
  "minStockQty",
  "minOrderQuantity",
  "packageLength",
  "packageBreadth",
  "packageHeight",
  "packageWeight",
];

const AddListingBulkIndex = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        status: "ReadyForActivation",
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

    const handleFinalSubmit = async () => {
        console.log("Raw Listing Data:", listingData);
        try {
        dispatch({ type: 'loader', loader: true }); // Activate loader before API call

        /* ================= BASIC VALIDATION ================= */
        if (
            !listingData.categoryId ||
            !listingData.subCategoryOneId ||
            !listingData.subCategoryTwoId ||
            !listingData.brandId
        ) {
            showToast("error", "Category or brand information is missing.");
            return;
        }

        if (
            !listingData.bulkProducts ||
            !Array.isArray(listingData.bulkProducts) ||
            listingData.bulkProducts.length === 0
        ) {
            showToast("error", "No products uploaded.");
            return;
        }

        /* ================= PRODUCT VALIDATION ================= */
        for (let i = 0; i < listingData.bulkProducts.length; i++) {
            const product = listingData.bulkProducts[i];

            for (const field of REQUIRED_PRODUCT_FIELDS) {
            if (
                product[field] === undefined ||
                product[field] === null ||
                product[field] === ""
            ) {
                showToast(
                "error",
                `Missing ${field} in product row ${i + 1}`
                );
                return;
            }
            }

            // Optional but recommended
            if (!product.mainImage) {
            showToast(
                "error",
                `Main image is required for product row ${i + 1}`
            );
            return;
            }
        }

        /* ================= BUILD FORMDATA ================= */
        const formData = new FormData();

        listingData.bulkProducts.forEach((product, index) => {
            /* ===== CATEGORY & BRAND ===== */
            formData.append(`products[${index}][categoryId]`, listingData.categoryId);
            formData.append(`products[${index}][subCategoryOneId]`, listingData.subCategoryOneId);
            formData.append(`products[${index}][subCategoryTwoId]`, listingData.subCategoryTwoId);
            formData.append(`products[${index}][brandId]`, listingData.brandId);

            /* ===== CORE PRODUCT ===== */
            formData.append(`products[${index}][name]`, product.name);
            formData.append(`products[${index}][sku]`, product.sku);
            formData.append(`products[${index}][description]`, product.description || "");
            formData.append(`products[${index}][status]`, listingData.status || "ReadyForActivation");
            formData.append(`products[${index}][type]`, listingData.type || "simple");

            /* ===== PRICING ===== */
            formData.append(`products[${index}][regularPrice]`, product.regularPrice);
            formData.append(`products[${index}][salePrice]`, product.salePrice || "");
            formData.append(`products[${index}][productPrice]`, listingData.productPrice || "");
            formData.append(`products[${index}][comissionRate]`, listingData.comissionRate || "");
            formData.append(`products[${index}][comissionAmount]`, listingData.comissionAmount || "");

            /* ===== TAX ===== */
            formData.append(`products[${index}][gstAmount]`, listingData.gstAmount || "");
            formData.append(`products[${index}][tcsAmount]`, listingData.tcsAmount || "");
            formData.append(`products[${index}][luxuryCess]`, product.luxuryCess || "");
            formData.append(`products[${index}][taxCode]`, listingData.taxCode || "");
            formData.append(`products[${index}][hsn]`, listingData.hsn || "");
            formData.append(`products[${index}][countryOfOrigin]`, product.countryOfOrigin);

            /* ===== INVENTORY ===== */
            formData.append(`products[${index}][stockQty]`, product.stockQty);
            formData.append(`products[${index}][minStockQty]`, product.minStockQty);
            formData.append(`products[${index}][minOrderQuantity]`, product.minOrderQuantity);

            /* ===== SHIPPING ===== */
            formData.append(`products[${index}][shippingCharge]`, listingData.shippingCharge || "");
            formData.append(`products[${index}][shippingProvider]`, listingData.shippingProvider || "");

            /* ===== FULFILLMENT ===== */
            formData.append(`products[${index}][fulfillmentBy]`, listingData.fulfillmentBy || "");
            formData.append(`products[${index}][procurementType]`, listingData.procurementType || "");
            formData.append(`products[${index}][procurementSLA]`, listingData.procurementSLA || "");

            /* ===== PACKAGE DETAILS ===== */
            formData.append(`products[${index}][packageLength]`, product.packageLength);
            formData.append(`products[${index}][packageBreadth]`, product.packageBreadth);
            formData.append(`products[${index}][packageHeight]`, product.packageHeight);
            formData.append(`products[${index}][packageWeight]`, product.packageWeight);

            /* ===== MEDIA ===== */
            formData.append(`products[${index}][mainImage]`, product.mainImage);

            product.galleryImages?.forEach((img, i) => {
            formData.append(`products[${index}][galleryImages][${i}]`, img);
            });

            product.videos?.forEach((vid, i) => {
            formData.append(`products[${index}][videos][${i}]`, vid);
            });

            /* ===== LEGAL ===== */
            formData.append(
            `products[${index}][manufacturerDetails]`,
            product.manufacturerDetails || ""
            );
            formData.append(
            `products[${index}][packerDetails]`,
            product.packerDetails || ""
            );
            formData.append(
            `products[${index}][importerDetails]`,
            product.importerDetails || ""
            );
        });

        /* ================= DEBUG ================= */
        console.log("✅ FINAL FORMDATA:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        /* ================= API CALL ================= */
        // Assuming StoreProduct is your API call
        const response = await StoreBulkProducts(formData);
        if (response.success === true) {
            showToast('success', response.message);

            navigate('/listing');
            // Temporarily uncommenting for local testing feedback
            console.log("FormData contents:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

        } else {
            showToast('error', response.message);
        }
        }catch (error) {
            showToast('error', 'Failed to save product details.');
            console.error("Save error:", error);
        }finally {
            dispatch({ type: "loader", loader: false });
        }
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
                            disabled={!listingData.categoryId || !listingData.subCategoryOneId || !listingData.subCategoryTwoId || !listingData.brandId}
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