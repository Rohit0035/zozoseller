import React, { useState } from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Card, CardBody } from 'reactstrap';
import classnames from 'classnames';
import StepOneCatalog from './StepOneCatalog';
import StepQcStatus from './StepQcStatus';
import StepThreeList from './StepthreeList'
const AddProductInfo = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Row>
        {/* Left side vertical steps */}
        <Col md="2">
          <Nav vertical pills >
            <NavItem className='mb-2 border' style={{cursor:'pointer'}}>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => toggle('1')}
              >
                <strong>STEP 1</strong><br />Create your Catalog
              </NavLink>
            </NavItem>
            <NavItem className='mb-2 border' style={{cursor:'pointer'}}>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => toggle('2')}
              >
                <strong>STEP 2</strong><br />View your QC Status
              </NavLink>
            </NavItem>
            <NavItem className='mb-2 border' style={{cursor:'pointer'}}>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => toggle('3')}
              >
                <strong>STEP 3</strong><br />View your Successful Listings
              </NavLink>
            </NavItem>
          </Nav>
        </Col>

        {/* Right side content area */}
        <Col md="10">
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <h5 className="fw-bold mb-3">Create Your Catalog <i className="bi bi-info-circle text-primary" /></h5>
              <StepOneCatalog/>
            </TabPane>

            <TabPane tabId="2">
              <h5 className="fw-bold">Your QC Status</h5>
              <StepQcStatus/>
            </TabPane>

            <TabPane tabId="3">
              <h5 className="fw-bold">View your Successful Listings</h5>
               <StepThreeList/>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </>
  );
};

export default AddProductInfo;
