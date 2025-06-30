import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Table
} from 'reactstrap';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

const ManagePartnerAccess = () => {
  const [modal, setModal] = useState('');
  const toggle = (id) => setModal(modal === id ? '' : id);

  const [partners, setPartners] = useState([
    {
      id: 1,
      role: 'Catalog Manager',
      permissions: {
        uploadImages: true,
        brandApproval: true,
        partnerSearch: true
      }
    }
  ]);

  const [partnerData, setPartnerData] = useState({
    role: '',
    permissions: {
      uploadImages: false,
      brandApproval: false,
      partnerSearch: false
    }
  });

  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrUpdate = () => {
    if (editIndex !== null) {
      const updated = [...partners];
      updated[editIndex] = partnerData;
      setPartners(updated);
    } else {
      setPartners([...partners, { ...partnerData, id: Date.now() }]);
    }
    setPartnerData({
      role: '',
      permissions: {
        uploadImages: false,
        brandApproval: false,
        partnerSearch: false
      }
    });
    setEditIndex(null);
    toggle('partnerModal');
  };

  const handleEdit = (index) => {
    setPartnerData(partners[index]);
    setEditIndex(index);
    toggle('partnerModal');
  };

  const handleDelete = (index) => {
    const updated = [...partners];
    updated.splice(index, 1);
    setPartners(updated);
  };

  const handlePermissionChange = (perm) => {
    setPartnerData({
      ...partnerData,
      permissions: {
        ...partnerData.permissions,
        [perm]: !partnerData.permissions[perm]
      }
    });
  };

  return (
    <div className="py-2">
      <Row>
        <Col md="12">
          <Card className="bg-light border-0">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Manage Partner Access</h6>
                <Button color="primary" size="sm" onClick={() => {
                  setPartnerData({
                    role: '',
                    permissions: {
                      uploadImages: false,
                      brandApproval: false,
                      partnerSearch: false
                    }
                  });
                  setEditIndex(null);
                  toggle('partnerModal');
                }}>
                  <FaPlus className="me-1" /> Add Partner
                </Button>
              </div>

              <Table bordered hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Role</th>
                    <th>Upload Images</th>
                    <th>Brand/Category Approval</th>
                    <th>Partner Search</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner, index) => (
                    <tr key={partner.id}>
                      <td>{partner.role}</td>
                      <td>{partner.permissions.uploadImages ? 'Yes' : 'No'}</td>
                      <td>{partner.permissions.brandApproval ? 'Yes' : 'No'}</td>
                      <td>{partner.permissions.partnerSearch ? 'Yes' : 'No'}</td>
                      <td className="text-center">
                        <Button color="link" size="sm" onClick={() => handleEdit(index)}><FaEdit /> Edit</Button>
                        <Button color="link" size="sm" className="text-danger" onClick={() => handleDelete(index)}><FaTrashAlt /> Delete</Button>
                      </td>
                    </tr>
                  ))}
                  {partners.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">No partner roles found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Partner Modal */}
      <Modal isOpen={modal === 'partnerModal'} toggle={() => toggle('partnerModal')}>
        <ModalHeader toggle={() => toggle('partnerModal')}>
          {editIndex !== null ? 'Edit Partner Role' : 'Add Partner Role'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Role</Label>
              <Input value={partnerData.role} onChange={(e) => setPartnerData({ ...partnerData, role: e.target.value })} />
            </FormGroup>
            <FormGroup check className="mb-2">
              <Input
                type="checkbox"
                checked={partnerData.permissions.uploadImages}
                onChange={() => handlePermissionChange('uploadImages')}
              />
              <Label check>Upload images and add Listings</Label>
            </FormGroup>
            <FormGroup check className="mb-2">
              <Input
                type="checkbox"
                checked={partnerData.permissions.brandApproval}
                onChange={() => handlePermissionChange('brandApproval')}
              />
              <Label check>Apply for brand and category approval</Label>
            </FormGroup>
            <FormGroup check>
              <Input
                type="checkbox"
                checked={partnerData.permissions.partnerSearch}
                onChange={() => handlePermissionChange('partnerSearch')}
              />
              <Label check>Partner Search</Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddOrUpdate}>
            {editIndex !== null ? 'Update' : 'Add'}
          </Button>
          <Button color="secondary" onClick={() => toggle('partnerModal')}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ManagePartnerAccess;
