import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label
} from 'reactstrap';
import { FaEdit } from 'react-icons/fa';

const Settings = () => {
  const [modal, setModal] = useState('');
  const toggle = (id) => setModal(modal === id ? '' : id);

  const [thermalPrinting, setThermalPrinting] = useState(false);
  const [barcodePrinting, setBarcodePrinting] = useState(false);
  const [autoFassured, setAutoFassured] = useState(false);
  const [fbfEInvoice, setFbfEInvoice] = useState(false);

  return (
    <div className="py-2">
      <Row>
        {/* Printer Settings */}
        <Col md="4" className="mb-4">
          <Card className="bg-light h-100 border-0">
            <CardBody>
              <h6>Printer settings</h6>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-1">Enable Thermal Printing</p>
                  <small className="text-muted">{thermalPrinting ? 'Enabled' : 'Disabled'}</small>
                </div>
                <Button color="link" onClick={() => toggle('thermal')}>
                  <FaEdit size={14} /> Edit
                </Button>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-1">Seller Barcode Printing</p>
                  <small className="text-muted">{barcodePrinting ? 'Enabled' : 'Disabled'}</small>
                </div>
                <Button color="link" onClick={() => toggle('barcode')}>
                  <FaEdit size={14} /> Edit
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* F-Assured Settings */}
        <Col md="4" className="mb-4">
          <Card className="bg-light h-100 border-0">
            <CardBody>
              <h6>F-Assured Settings</h6>
              <FormGroup check>
                <Input
                  type="checkbox"
                  checked={autoFassured}
                  onChange={() => setAutoFassured(!autoFassured)}
                />{' '}
                <Label check>Automatically add eligible listings to FAssured</Label>
              </FormGroup>
              <p className="mt-2 text-muted">
                Selecting this option will always add all the eligible listings to F-Assured automatically
              </p>
            </CardBody>
          </Card>
        </Col>

        {/* FBF Invoice Settings */}
        <Col md="4" className="mb-4">
          <Card className="bg-light h-100 border-0">
            <CardBody>
              <h6>FBF invoice setting</h6>
              <p className="text-muted small">
                GSTIN has notified that from 1st January 2023 any business with turnover of over ₹5 crores must issue e-invoices for all B2B transactions.
                To support this, Flipkart has a feature <a href="#">E-Invoice Onboarding</a> for consignments & recalls.
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-0">Enable e-invoicing for FBF</p>
                  <small className="text-muted">{fbfEInvoice ? 'Enabled' : 'Disabled'}</small>
                </div>
                <Button color="link" onClick={() => toggle('fbf')}>
                  <FaEdit size={14} /> Edit
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal for Thermal Printing */}
      <Modal isOpen={modal === 'thermal'} toggle={() => toggle('thermal')}>
        <ModalHeader toggle={() => toggle('thermal')}>Thermal Printing</ModalHeader>
        <ModalBody>
          <FormGroup check>
            <Input
              type="checkbox"
              id='1'
              checked={thermalPrinting}
              onChange={() => setThermalPrinting(!thermalPrinting)}
            />{' '}
            <Label check>Enable Thermal Printing</Label>
          </FormGroup>

          <FormGroup check>
            <Input
              type="checkbox"
              id='2'
              checked={thermalPrinting}
              onChange={() => setThermalPrinting(!thermalPrinting)}
            />{' '}
            <Label check>Disable Thermal Printing</Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => toggle('thermal')}>Save</Button>
          <Button color="secondary" onClick={() => toggle('thermal')}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Modal for Barcode Printing */}
      <Modal isOpen={modal === 'barcode'} toggle={() => toggle('barcode')}>
        <ModalHeader toggle={() => toggle('barcode')}>Seller Barcode Printing</ModalHeader>
        <ModalBody>
          <FormGroup check>
            <Input
              type="checkbox"
              checked={barcodePrinting}
              onChange={() => setBarcodePrinting(!barcodePrinting)}
            />{' '}
            <Label check>Enable Barcode Printing</Label>
          </FormGroup>
           <FormGroup check>
            <Input
              type="checkbox"
              checked={barcodePrinting}
              onChange={() => setBarcodePrinting(!barcodePrinting)}
            />{' '}
            <Label check>Disable Barcode Printing</Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => toggle('barcode')}>Save</Button>
          <Button color="secondary" onClick={() => toggle('barcode')}>Cancel</Button>
        </ModalFooter>
      </Modal>

      {/* Modal for FBF */}
      <Modal isOpen={modal === 'fbf'} toggle={() => toggle('fbf')}>
        <ModalHeader toggle={() => toggle('fbf')}>Enable e-invoicing for FBF</ModalHeader>
        <ModalBody>
          <FormGroup check>
            <Input
              type="checkbox"
              checked={fbfEInvoice}
              onChange={() => setFbfEInvoice(!fbfEInvoice)}
            />{' '}
            <Label check>Enable e-invoicing for FBF</Label>
          </FormGroup>
            <FormGroup check>
            <Input
              type="checkbox"
              checked={fbfEInvoice}
              onChange={() => setFbfEInvoice(!fbfEInvoice)}
            />{' '}
            <Label check>Disable e-invoicing for FBF</Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => toggle('fbf')}>Save</Button>
          <Button color="secondary" onClick={() => toggle('fbf')}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Settings;
