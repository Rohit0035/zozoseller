import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import { FaRupeeSign, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';

const Statements = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Prepaid + Postpaid');

    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(2025, 5, 3), // 03 Jun 2025
            endDate: new Date(2025, 6, 3),   // 03 Jul 2025
            key: 'selection'
        }
    ]);

    const toggleDropdown = () => setDropdownOpen(prev => !prev);
    const toggleDateDropdown = () => setDateDropdownOpen(prev => !prev);

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col md="6">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Statements (Monthly Settlement)</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Payment
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
                <Col md="6" className="text-end d-flex justify-content-end gap-2">
                    <Button outline color="secondary">
                        View in Previous Payments <i className="ms-1 bi bi-box-arrow-up-right" />
                    </Button>
                    <Button color="primary">Download Report</Button>
                </Col>
            </Row>

            <Row className="align-items-center mb-4">
                <Col md="6" className="d-flex gap-2">
                    <Button color="light" className="d-flex align-items-center">
                        <FaFilter className="me-2" />
                    </Button>

                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle color="light" caret className="d-flex align-items-center">
                            <FaRupeeSign className="me-2" />
                            {selectedFilter}
                        </DropdownToggle>
                        <DropdownMenu>
                            {['Prepaid', 'Postpaid', 'Prepaid + Postpaid'].map(option => (
                                <DropdownItem
                                    key={option}
                                    active={selectedFilter === option}
                                    onClick={() => setSelectedFilter(option)}
                                >
                                    {option}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    {/* Date Range Dropdown */}
                    <Dropdown isOpen={dateDropdownOpen} toggle={toggleDateDropdown}>
                        <DropdownToggle color="light" caret className="d-flex align-items-center">
                            <FaCalendarAlt className="me-2" />
                            {format(dateRange[0].startDate, 'dd MMM yyyy')} ⇒ {format(dateRange[0].endDate, 'dd MMM yyyy')}
                        </DropdownToggle>
                        <DropdownMenu style={{ minWidth: 'auto', padding: 0 }}>
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setDateRange([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                direction="horizontal"
                            />
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>

            <hr />

            <Row className="mb-3">
                <Col md="4">
                    <h6>Total Settlement Amount</h6>
                </Col>
                <Col md="4">
                    <h6>0.00 <span className="text-muted small">(0% of Sales Value)</span></h6>
                </Col>
            </Row>

            <Row>
                <Col>
                    <div className="fw-semibold border-top pt-3">Total Settlement Amount</div>
                </Col>
            </Row>
        </>
    );
};

export default Statements;
