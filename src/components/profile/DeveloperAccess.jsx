import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Table, Button, Nav, NavItem, NavLink, TabContent, TabPane,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import classnames from 'classnames';

const DeveloperAccess = () => {
  const [activeTab, setActiveTab] = useState('self');
  const [modalOpen, setModalOpen] = useState(false);

  const [accessList, setAccessList] = useState({
    self: [],
    thirdParty: []
  });

  const [formData, setFormData] = useState({
    accessName: '',
    description: '',
    domain: '',
    expiry: '',
    apiKey: 'XYZ1234',
    status: 'Active',
    secret: '********'
  });

  const toggleModal = () => {
    setFormData({
      accessName: '',
      description: '',
      domain: '',
      expiry: '',
      apiKey: 'XYZ1234',
      status: 'Active',
      secret: '********'
    });
    setModalOpen(!modalOpen);
  };

  const handleAddAccess = () => {
    const newEntry = {
      ...formData,
      createdOn: new Date().toLocaleDateString()
    };
    setAccessList({
      ...accessList,
      [activeTab]: [...accessList[activeTab], newEntry]
    });
    toggleModal();
  };

  const renderTable = (tab) => (
    <Table bordered responsive hover className="mb-0">
      <thead className="table-light">
        <tr>
          <th>Access Name</th>
          <th>Description</th>
          <th>Website Domain</th>
          <th>Created On</th>
          <th>Expiry</th>
          <th>API Key</th>
          <th>Status</th>
          <th>Secret</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {accessList[tab].length === 0 ? (
          <tr>
            <td colSpan="9" className="text-center text-muted">No data to display</td>
          </tr>
        ) : (
          accessList[tab].map((entry, i) => (
            <tr key={i}>
              <td>{entry.accessName}</td>
              <td>{entry.description}</td>
              <td>{entry.domain}</td>
              <td>{entry.createdOn}</td>
              <td>{entry.expiry}</td>
              <td>{entry.apiKey}</td>
              <td>{entry.status}</td>
              <td>{entry.secret}</td>
              <td>
                <Button color="link" size="sm" className="text-danger" onClick={() => {
                  const updated = accessList[tab].filter((_, idx) => idx !== i);
                  setAccessList({ ...accessList, [tab]: updated });
                }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  return (
    <div className="py-2">
      <Row>
        <Col md="12">
          <Card className="bg-light">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Developer Access</h6>
                <Button color="primary" size="sm" onClick={toggleModal}>
                  Create New Access
                </Button>
              </div>

              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 'self' })}
                    onClick={() => setActiveTab('self')}
                    style={{ cursor: 'pointer' }}
                  >
                    Self Access
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === 'thirdParty' })}
                    onClick={() => setActiveTab('thirdParty')}
                    style={{ cursor: 'pointer' }}
                  >
                    Third Party Access
                  </NavLink>
                </NavItem>
              </Nav>

              {activeTab === 'self' && (
                <Alert color="danger" className="mt-3">
                  ⚠️ Do not share the self access client details with any 3rd party partner(s).
                  It is meant strictly for self seller use. Violations will lead to account deactivation.
                </Alert>
              )}

              <TabContent activeTab={activeTab} className="mt-2">
                <TabPane tabId="self">{renderTable('self')}</TabPane>
                <TabPane tabId="thirdParty">{renderTable('thirdParty')}</TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal: Create Access */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Create New Access</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Access Name</Label>
              <Input value={formData.accessName} onChange={(e) => setFormData({ ...formData, accessName: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Website Domain</Label>
              <Input value={formData.domain} onChange={(e) => setFormData({ ...formData, domain: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Expiry Date</Label>
              <Input type="date" value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddAccess}>Save</Button>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DeveloperAccess;
