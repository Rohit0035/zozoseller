import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import ProductPhotos from './ProductPhotos';
import ProductDetails from './ProductDetails';

const AddProductInfo = ({ listingData, onListingDataChange }) => { // Receive props from parent
    return (
        <>
            <h6 className="mb-3 fw-bold">Please fill all mandatory attributes to preview title</h6>
            <Row>
                <Col md={6}>
                    <ProductPhotos
                        listingData={listingData} // Pass listingData to ProductPhotos
                        onListingDataChange={onListingDataChange} // Pass the update handler
                    />
                </Col>
                <Col md={6}>
                    <ProductDetails
                        listingData={listingData} // Pass listingData to ProductDetails
                        onListingDataChange={onListingDataChange} // Pass the update handler
                    />
                </Col>
            </Row>
        </>
    );
};

export default AddProductInfo;