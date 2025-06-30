import React from 'react';
import { Col, Card, CardBody } from 'reactstrap';

const AccountManager = ({ accountManager }) => {
  const renderAccountManagerDetails = () => {
    if (!accountManager) {
      return (
        <Col md="4" className="mb-3">
          <Card className="h-100 bg-light" style={{ border: 'unset' }}>
            <CardBody>
              <h6>Account Manager Details</h6>
              <p className="text-muted">No account manager is assigned for you.</p>
              <p className="mb-0">
                Become <strong>Silver</strong> or <strong>Gold</strong> seller to get one.
              </p>
            </CardBody>
          </Card>
        </Col>
      );
    }

    return (
      <>
        <Col md="4" className="mb-3">
          <Card className="h-100 bg-light" style={{ border: 'unset' }}>
            <CardBody>
              <h6>Account Manager</h6>
              <p><strong>Name:</strong> {accountManager.name}</p>
              <p><strong>Email:</strong> {accountManager.email}</p>
              <p><strong>Phone:</strong> {accountManager.phone}</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="4" className="mb-3">
          <Card className="h-100 bg-light" style={{ border: 'unset' }}>
            <CardBody>
              <h6>Manager Notes</h6>
              <p>{accountManager.notes}</p>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  };

  return (
    <div className="p-2">
      <div className="row">
        {renderAccountManagerDetails()}
      </div>
    </div>
  );
};

export default AccountManager;
