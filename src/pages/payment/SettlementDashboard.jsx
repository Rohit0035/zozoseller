import React, { useState } from 'react';
import {
  Container, Input, Button, Row, Col, Nav, NavItem, NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  Breadcrumb,
  BreadcrumbItem
} from 'reactstrap';
import { FaDownload, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { Calendar } from 'react-date-range';
import { format } from 'date-fns';
import DataTable from 'react-data-table-component';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Link } from 'react-router-dom';

const mockData = {
  'Orders ₹0': [
    { id: 'O1001', item: 'Item A', amount: '₹0' },
    { id: 'O1002', item: 'Item B', amount: '₹0' }
  ],
  'MP Fee Rebate ₹0': [
    { id: 'R2001', description: 'Fee refund', amount: '₹0' }
  ],
  'Services ₹0': [
    { id: 'S3001', service: 'Storage', amount: '₹0' }
  ],
  'Protection Fund ₹0': [
    { id: 'PF4001', case: 'Refund case', amount: '₹0' }
  ],
  'Storage ₹0': [
    { id: 'ST5001', item: 'Box A', amount: '₹0' }
  ],
  'Recall ₹0': [
    { id: 'RC6001', reason: 'Defect', amount: '₹0' }
  ],
  'ADS Campaigns ₹0': [
    { id: 'AD7001', platform: 'Google', amount: '₹0' }
  ],
  'Value added services ₹0': [
    { id: 'VA8001', description: 'Premium listing', amount: '₹0' }
  ]
};

const csvFiles = {
  'Orders ₹0': 'Orders.csv',
  'MP Fee Rebate ₹0': 'MP_Fee_Rebate.csv',
  'Services ₹0': 'Services.csv',
  'Protection Fund ₹0': 'Protection_Fund.csv',
  'Storage ₹0': 'Storage.csv',
  'Recall ₹0': 'Recall.csv',
  'ADS Campaigns ₹0': 'ADS_Campaigns.csv',
  'Value added services ₹0': 'Value_added_services.csv'
};

const SettlementDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Orders ₹0');

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleDateChange = (date) => setSelectedDate(date);
  const handleTabClick = (tab) => setActiveTab(tab);

  const currentData = mockData[activeTab] || [];
  const columns = currentData.length > 0
    ? Object.keys(currentData[0]).map(key => ({
      name: key.toUpperCase(),
      selector: row => row[key],
      sortable: true
    }))
    : [];

  return (
    <>
      <Row>
        <Col md="6">
          <Breadcrumb className='my-2'>
            <BreadcrumbItem>
              <h5>Search Order Settlements</h5>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              Payment
            </BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col md="6">
          <div className='d-flex justify-content-end justify-content-md-end'>
            <Link to="/payments-overview" className='btn btn-primary btn-sm'>Back</Link>
          </div>
        </Col>
      </Row>
      <Row className="align-items-center mb-3">
        <Col md="3">
          <Input placeholder="Search by Order / Item / Recall..." />
        </Col>
        
        <Col md="3">
          <Input type="select">
            <option>Upcoming Payments</option>
            <option>Past Payments</option>
          </Input>
        </Col>
          <Col md="3">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="w-100">
            <DropdownToggle
              caret
              className="w-100 text-start bg-light text-dark border"
            >
              <FaCalendarAlt className="me-2" />
              {format(selectedDate, 'MMM dd, yyyy')}
            </DropdownToggle>
            <DropdownMenu style={{ width: '100%', minWidth: '100%' }}>
              <DropdownItem>Jul 14th</DropdownItem>
              <DropdownItem>Jul 16th</DropdownItem>
              <DropdownItem>Jul 18th</DropdownItem>
              <DropdownItem>Rest</DropdownItem>
              <DropdownItem>Total</DropdownItem>
              <DropdownItem divider />
              <div className="p-2 border-top">
                <Calendar
                  date={selectedDate}
                  onChange={handleDateChange}
                  color="#007bff"
                />
              </div>
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col md="3" className="text-end">
          <a
            href={csvFiles[activeTab]}
            download
            className="btn btn-primary"
          >
            <FaDownload className="me-2" />
            Request Download
            <FaInfoCircle className="ms-2" />
          </a>
        </Col>

      </Row>

      <Nav tabs className="mb-3 flex-wrap">
        {Object.keys(mockData).map(tab => (
          <NavItem key={tab}>
            <NavLink
              href="#"
              active={activeTab === tab}
              onClick={() => handleTabClick(tab)}
              className="text-nowrap"
            >
              {tab}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <DataTable
        columns={columns}
        data={currentData}
        pagination
        noHeader
        highlightOnHover
      />
    </>
  );
};

export default SettlementDashboard;
