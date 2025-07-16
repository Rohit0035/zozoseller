import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Col, Nav, Row } from 'reactstrap';
import UpcomingPayments from './UpcomingPayments';

const PaymentIndex = () => {
    return (
        <>
            <Row>
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Payments Overview</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Payment
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6">
                    <div className='d-flex justify-content-end justify-content-md-end'>
                        <Link to="/settlement-dashboard" className='btn btn-primary btn-sm'>Search Order Settlements</Link>
                    </div>
                </Col>
            </Row>

            <Row>
                <Nav className='bg-danger bg-opacity-10 px-2 py-2'>
                    Your payment is blocked as your bank account is not verified. Please verify the same to start receiving the payments.<Link to="/">Verify Now</Link>
                </Nav>
            </Row>

             <Row className='mt-3'>
               <Col md="12">
                  <UpcomingPayments/>
               </Col>
            </Row>
        </>
    );
};

export default PaymentIndex;
