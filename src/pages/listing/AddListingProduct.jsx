


import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Breadcrumb, BreadcrumbItem, Col, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown, DropdownItem } from 'reactstrap';
import { FaListAlt, FaLayerGroup, FaThLarge } from 'react-icons/fa';
// import BulkVariantGroupings from './BulkVariantGroupings';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import SingleListings from './SingleListings';
import BulkListings from './BulkListings';
import BulkVariantGroupings from './BulkVariantGroupings';


const AddListingProduct = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (


    <>
     <Row>
        <Col md="6">
          <Breadcrumb className='my-2'>
            <BreadcrumbItem>
              <h5>Add Listing</h5>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              Listing
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col md="6">
          <div className="d-flex justify-content-end justify-content-md-end">
            <Link className="me-3 mt-2" >
               <FaBell size={18} color="#fc0" className='me-2' /> Partner Services
            </Link>
            {/* <InputGroup className='me-2' style={{ maxWidth: '300px' }}>
                            <Input type="search" placeholder="Search for FSN, Title or SKU ID" />
                            <Button color='primary'>
                                <FaSearch />
                            </Button>
                        </InputGroup> */}
            <UncontrolledDropdown>
              <DropdownToggle caret color="" className="text-white" style={{ backgroundColor: '#02339a' }}>
                Select Option
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Add Single Listing</DropdownItem>
                <DropdownItem>Add Bulk Listing</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </Col>
      </Row>
  
    <div className="">
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames('text-dark font-weight-bold', { active: activeTab === '1' })}
            onClick={() => toggle('1')}
            style={{ cursor: 'pointer' }}
          >
             Single Listings
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames('text-dark font-weight-bold', { active: activeTab === '2' })}
            onClick={() => toggle('2')}
            style={{ cursor: 'pointer' }}
          >
            Bulk Listings
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames('text-dark font-weight-bold',{ active: activeTab === '3' })}
            onClick={() => toggle('3')}
            style={{ cursor: 'pointer' }}
          >
            Bulk Variant Groupings
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab} className="mt-3">
        <TabPane tabId="1">
           <SingleListings/>
        </TabPane>
        <TabPane tabId="2">
           <BulkListings/>
        </TabPane>
        <TabPane tabId="3">
            <BulkVariantGroupings/>
        </TabPane>
      </TabContent>
    </div>
      </>
  );
};

export default AddListingProduct;

