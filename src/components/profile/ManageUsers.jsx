import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Table
} from 'reactstrap';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

const ManageUsers = () => {
  const [modal, setModal] = useState('');
  const toggle = (id) => setModal(modal === id ? '' : id);

  const [users, setUsers] = useState([
    { id: 1, name: 'Deepak Sharma', email: 'deepak@example.com', role: 'Admin' },
    { id: 2, name: 'Aarti Verma', email: 'aarti@example.com', role: 'Support' }
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Viewer' });
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrUpdate = () => {
    if (editIndex !== null) {
      const updated = [...users];
      updated[editIndex] = newUser;
      setUsers(updated);
    } else {
      setUsers([...users, { ...newUser, id: Date.now() }]);
    }
    setNewUser({ name: '', email: '', role: 'Viewer' });
    setEditIndex(null);
    toggle('userModal');
  };

  const handleEdit = (index) => {
    setNewUser(users[index]);
    setEditIndex(index);
    toggle('userModal');
  };

  const handleDelete = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
  };

  return (
    <div className="py-2">
      <Row>
        <Col md="12">
          <Card className="bg-light border-0">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Manage Users</h6>
                <Button color="primary" size="sm" onClick={() => {
                  setNewUser({ name: '', email: '', role: 'Viewer' });
                  setEditIndex(null);
                  toggle('userModal');
                }}>
                  <FaPlus className="me-1" /> Add User
                </Button>
              </div>
              <Table bordered hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className="text-center">
                        <Button color="link" size="sm" onClick={() => handleEdit(index)}><FaEdit /> Edit</Button>
                        <Button color="link" size="sm" className="text-danger" onClick={() => handleDelete(index)}><FaTrashAlt /> Delete</Button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit User Modal */}
      <Modal isOpen={modal === 'userModal'} toggle={() => toggle('userModal')}>
        <ModalHeader toggle={() => toggle('userModal')}>
          {editIndex !== null ? 'Edit User' : 'Add New User'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Name</Label>
              <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Role</Label>
              <Input type="select" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option>Admin</option>
                <option>Support</option>
                <option>Viewer</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddOrUpdate}>
            {editIndex !== null ? 'Update' : 'Add'}
          </Button>
          <Button color="secondary" onClick={() => toggle('userModal')}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ManageUsers;
