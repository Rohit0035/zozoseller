import React, { useState } from 'react';
import {
    Row,
    Col,
    Input,
    Button,
    Nav,
    NavItem,
    NavLink,
    FormGroup,
    Label,
    TabContent,
    TabPane
} from 'reactstrap';
import classnames from 'classnames';

const ReportScheduler = () => {
    const [activeTab, setActiveTab] = useState('oneTime');
    const [formData, setFormData] = useState({
        every: 1,
        frequency: '',
        startDate: '2025-07-13'
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log('Submitted:', { type: activeTab, ...formData });
        // Add actual logic here
    };

    return (
        <>
            {/* Tabs */}
            <Nav tabs className="mb-2">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'oneTime' })}
                        onClick={() => setActiveTab('oneTime')}
                        style={{ cursor: 'pointer', fontSize: '12px' }}
                    >
                        One Time Request
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'schedule' })}
                        onClick={() => setActiveTab('schedule')}
                        style={{ cursor: 'pointer', fontSize: '12px' }}
                    >
                        Schedule Report
                    </NavLink>
                </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
                <TabPane tabId="oneTime">
                    <p className="text-muted mb-4">
                       Please fill below details for one time report generation for selected duration
                    </p>
                    <Row className="g-3">
                        <Col md="12">
                            <FormGroup>
                                <Label for="every">Select Date Range</Label>
                                <Input
                                    id=""
                                    type="date"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <div className="text-end mt-4">
                        <Button color="primary" onClick={handleSubmit}>
                            SUBMIT
                        </Button>
                    </div>
                </TabPane>

                <TabPane tabId="schedule">
                    <p className="text-muted mb-4">
                        Please fill below details to automate the report generation on selected day and duration
                    </p>

                    <Row className="g-3">
                        <Col md="4">
                            <FormGroup>
                                <Label for="every">Every</Label>
                                <Input
                                    id="every"
                                    type="number"
                                    value={formData.every}
                                    onChange={e => handleChange('every', e.target.value)}
                                    min="1"
                                />
                            </FormGroup>
                        </Col>

                        <Col md="4">
                            <FormGroup>
                                <Label for="frequency">Frequency</Label>
                                <Input
                                    id="frequency"
                                    type="select"
                                    value={formData.frequency}
                                    onChange={e => handleChange('frequency', e.target.value)}
                                >
                                    <option value="">Select Frequency</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </Input>
                            </FormGroup>
                        </Col>

                        <Col md="4">
                            <FormGroup>
                                <Label for="startDate">Select Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => handleChange('startDate', e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <div className="text-end mt-4">
                        <Button color="primary" onClick={handleSubmit}>
                            SUBMIT
                        </Button>
                    </div>
                </TabPane>
            </TabContent>
        </>
    );
};

export default ReportScheduler;
