import React, { useState } from 'react';
import {
  Container, Row, Col, Button, Table, Badge, Card, CardBody, CardText
} from 'reactstrap';
import { FaCircleInfo, FaList } from 'react-icons/fa6';

const paymentDates = ['14th Jul', '16th Jul', '18th Jul', 'Rest', 'Total'];
const paymentTypes = [
  {
    type: 'Orders',
    details: ['Sales and Returns'],
    prepaid: 0,
    postpaid: 0
  },
  {
    type: 'Protection Fund',
    details: ['Order SPF', 'Non Order SPF'],
    prepaid: 0,
    postpaid: 0
  },
  {
    type: 'MP Fee Rebate',
    details: ['MP Fee Rebate (Rewards)'],
    prepaid: 0,
    postpaid: 0
  },
  {
    type: 'Services',
    details: ['Services'],
    prepaid: 0,
    postpaid: 0
  },
  {
    type: 'Tax Settlement',
    details: ['TCS Recovery', 'TDS Claims'],
    prepaid: 0,
    postpaid: 0
  }
];

const UpcomingPayments = () => {
  const [selectedDate, setSelectedDate] = useState('Total');

  const getTotal = (field) =>
    paymentTypes.reduce((sum, item) => sum + item[field], 0);

  return (
    <>
      <h6 className="d-flex align-items-center mb-3">
        <FaCircleInfo className="me-2 text-warning" />
        <strong>Upcoming Payments</strong>
        <small className="ms-2 text-muted">(Updated at 02:08 PM)</small>
      </h6>

      <div className="mb-3">
        {paymentDates.map(date => (
          <Button
            key={date}
            color={selectedDate === date ? 'primary' : 'light'}
            className="me-2 mb-2"
            onClick={() => setSelectedDate(date)}
          >
            {date} (₹0)
          </Button>
        ))}
      </div>

      <p className="text-muted mb-4">
        Total amount you will receive from Flipkart (Individual upcoming + Rest payment)
      </p>

      <Row>
        <Col md={6}>
          <Table bordered hover responsive style={{fontSize:'12px'}}>
            <thead className="table-light">
              <tr>
                <th>Payment Type</th>
                <th>Details</th>
                <th>Prepaid (₹)</th>
                <th>Postpaid (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {paymentTypes.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.type}</strong></td>
                  <td>
                    {item.details.map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </td>
                  <td>{item.prepaid}</td>
                  <td>{item.postpaid}</td>
                  <td>{item.prepaid + item.postpaid}</td>
                </tr>
              ))}
              <tr className="fw-bold table-light">
                <td colSpan={2}>Total</td>
                <td>{getTotal('prepaid')}</td>
                <td>{getTotal('postpaid')}</td>
                <td>{getTotal('prepaid') + getTotal('postpaid')}</td>
              </tr>
            </tbody>
          </Table>

          <Card className="mt-4 border-danger">
            <CardBody>
              <h6 className="text-danger fw-bold mb-2">IMPORTANT INFORMATION</h6>
              <CardText>
                <ul className="mb-0 ps-3 small">
                  <li>If the payment is negative (-), wait till it turns positive to get the next payment.</li>
                  <li>Update on dispatched orders may take 48hrs to show in the Upcoming Payments.</li>
                  <li>Upcoming Total Payments may change due to new orders, returns, SPF, TDS claims, or service fees.</li>
                </ul>
              </CardText>
            </CardBody>
          </Card>
        </Col>

        <Col md={6} className="text-center d-flex flex-column justify-content-center align-items-center border-start">
          <FaList size={36} className="mb-3 text-muted" />
          <p className="text-muted">No payment data available</p>
        </Col>
      </Row>
    </>
  );
};

export default UpcomingPayments;
