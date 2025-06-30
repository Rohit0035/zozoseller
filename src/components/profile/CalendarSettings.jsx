import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input
} from 'reactstrap';
import { FaTrashAlt } from 'react-icons/fa';

const CalendarSettings = () => {
  const [modal, setModal] = useState('');
  const toggle = (id) => setModal(modal === id ? '' : id);

  const [holidays, setHolidays] = useState([
    { date: '2025-08-15', reason: 'National Holiday' },
    { date: '2025-10-02', reason: 'National Holiday' },
    { date: '2025-01-26', reason: 'National Holiday' }
  ]);

  const [newHoliday, setNewHoliday] = useState({
    from: '', to: '', reason: '', comment: ''
  });

  const [workingHours, setWorkingHours] = useState({
    from: '11:00', fromPeriod: 'AM', to: '07:00', toPeriod: 'PM'
  });

  const [weeklyOff, setWeeklyOff] = useState('Sunday');

  const handleAddHoliday = () => {
    if (newHoliday.from && newHoliday.reason) {
      setHolidays([...holidays, { date: newHoliday.from, reason: newHoliday.reason }]);
      setNewHoliday({ from: '', to: '', reason: '', comment: '' });
      toggle('vacation');
    }
  };

  const handleDeleteHoliday = (index) => {
    const updated = [...holidays];
    updated.splice(index, 1);
    setHolidays(updated);
  };

  return (
    <div className="py-2">
      <Row>
        {/* Vacation Plan */}
        <Col md="4" className="mb-4">
          <Card className="bg-light h-100 border-0">
            <CardBody>
              <div className="d-flex justify-content-between">
                <h6>Vacation plan</h6>
                <Button size="sm" outline color="primary" onClick={() => toggle('vacation')}>ADD HOLIDAY</Button>
              </div>
              {holidays.map((holiday, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mt-2 border-bottom pb-1">
                  <div>
                    <small className="text-muted">{holiday.reason}</small>
                    <div>{new Date(holiday.date).toDateString()}</div>
                  </div>
                  <Button size="sm" color="link" className="text-danger" onClick={() => handleDeleteHoliday(index)}>
                    <FaTrashAlt /> Delete
                  </Button>
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>

        {/* Working Hours */}
        <Col md="4" className="mb-4">
          <Card className="bg-light h-100 border-0">
            <CardBody>
              <div className="d-flex justify-content-between">
                <h6>Working hours</h6>
                <Button size="sm" outline color="primary" onClick={() => toggle('working')}>EDIT</Button>
              </div>
              <small className="text-muted">Working time</small>
              <div className="fw-bold">
                {workingHours.from} {workingHours.fromPeriod} to {workingHours.to} {workingHours.toPeriod}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Weekly Off */}
        <Col md="4" className="mb-4">
          <Card className="bg-light h-100 border-0">
            <CardBody>
              <div className="d-flex justify-content-between">
                <h6>Weekly Off</h6>
                <Button size="sm" outline color="primary" onClick={() => toggle('weekly')}>EDIT</Button>
              </div>
              <small className="text-muted">Weekly Off</small>
              <div className="fw-bold">{weeklyOff}</div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Vacation Modal */}
      <Modal isOpen={modal === 'vacation'} toggle={() => toggle('vacation')}>
        <ModalHeader toggle={() => toggle('vacation')}>Add Holiday</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>From date*</Label>
              <Input type="date" value={newHoliday.from} onChange={(e) => setNewHoliday({ ...newHoliday, from: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>To date*</Label>
              <Input type="date" value={newHoliday.to} onChange={(e) => setNewHoliday({ ...newHoliday, to: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Reason*</Label>
              <Input value={newHoliday.reason} onChange={(e) => setNewHoliday({ ...newHoliday, reason: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Comment</Label>
              <Input value={newHoliday.comment} onChange={(e) => setNewHoliday({ ...newHoliday, comment: e.target.value })} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddHoliday}>Save</Button>
          <Button color="secondary" onClick={() => toggle('vacation')}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Working Hours Modal */}
      <Modal isOpen={modal === 'working'} toggle={() => toggle('working')}>
        <ModalHeader toggle={() => toggle('working')}>Edit Working Hours</ModalHeader>
        <ModalBody>
          <Form inline>
            <FormGroup className="me-3">
              <Label>From</Label>
              <Input
                type="time"
                value={workingHours.from}
                onChange={(e) => setWorkingHours({ ...workingHours, from: e.target.value })}
              />
            </FormGroup>
            <FormGroup className="me-3">
              <Label>AM/PM</Label>
              <Input
                type="select"
                value={workingHours.fromPeriod}
                onChange={(e) => setWorkingHours({ ...workingHours, fromPeriod: e.target.value })}
              >
                <option>AM</option>
                <option>PM</option>
              </Input>
            </FormGroup>
            <FormGroup className="me-3">
              <Label>To</Label>
              <Input
                type="time"
                value={workingHours.to}
                onChange={(e) => setWorkingHours({ ...workingHours, to: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>AM/PM</Label>
              <Input
                type="select"
                value={workingHours.toPeriod}
                onChange={(e) => setWorkingHours({ ...workingHours, toPeriod: e.target.value })}
              >
                <option>AM</option>
                <option>PM</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => toggle('working')}>Save</Button>
          <Button color="secondary" onClick={() => toggle('working')}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Weekly Off Modal */}
      <Modal isOpen={modal === 'weekly'} toggle={() => toggle('weekly')}>
        <ModalHeader toggle={() => toggle('weekly')}>Select Weekly Off</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Weekly Off</Label>
            <Input type="select" value={weeklyOff} onChange={(e) => setWeeklyOff(e.target.value)}>
              <option>Sunday</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => toggle('weekly')}>Save</Button>
          <Button color="secondary" onClick={() => toggle('weekly')}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CalendarSettings;
