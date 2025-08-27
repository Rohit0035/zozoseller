import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import {
  Container, Row, Col, Button, Table, Badge, Card, CardBody, CardText
} from 'reactstrap';
import { FaCircleInfo, FaList } from 'react-icons/fa6';
import { PaymentOverview } from '../../api/paymentAPI'; // Your API call
import { showToast } from '../../components/ToastifyNotification';

const UpcomingPayments = () => {
  const [selectedDate, setSelectedDate] = useState('Total'); // Default to 'Total'
  const [allPaymentData, setAllPaymentData] = useState({}); // Stores the entire paymentTypes object from backend (keyed by date)
  const [dateButtonData, setDateButtonData] = useState([]); // Stores the dateTotals array for buttons
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Memoize the current payment types to display in the table
  const currentPaymentTypes = useMemo(() => {
    // If allPaymentData is not yet loaded, or selectedDate doesn't exist in it,
    // return an empty array or a default structure.
    return allPaymentData[selectedDate] || [];
  }, [selectedDate, allPaymentData]);

  // Calculate totals for the currently displayed table
  const getTotal = (field) => {
    return currentPaymentTypes.reduce((sum, item) => sum + item[field], 0);
  };

  const fetchPaymentOverviewData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PaymentOverview();
      if (response.success) {
        console.log("Backend Response Data:", response.data);
        setAllPaymentData(response.data.paymentTypes); // This is the object with date keys
        setDateButtonData(response.data.dateTotals); // This is the array for buttons
        // Set selectedDate to 'Total' initially after data loads
        setSelectedDate('Total');
      } else {
        showToast('error', response.message);
        setError(response.message);
      }
    } catch (err) {
      showToast('error', 'Failed to fetch payment overview. Please try again.');
      setError('Failed to fetch payment overview.');
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentOverviewData();
  }, []);

  if (loading) {
    return (
      <Container>
        <p>Loading upcoming payments...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <p className="text-danger">Error: {error}</p>
      </Container>
    );
  }

  return (
    <>
      <h6 className="d-flex align-items-center mb-3">
        <FaCircleInfo className="me-2 text-warning" />
        <strong>Upcoming Payments</strong>
        {/* You might want to get the updated time from the backend if available */}
        <small className="ms-2 text-muted">(Updated at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})</small>
      </h6>

      <div className="mb-3">
        {dateButtonData?.map(data => (
          <Button
            key={data.dateKey}
            color={selectedDate === data.dateKey ? 'primary' : 'light'}
            className="me-2 mb-2"
            onClick={() => setSelectedDate(data.dateKey)}
            // disabled={data.totalAmount === 0 && data.dateKey !== 'Rest' && data.dateKey !== 'Total'} // Disable if no amount for specific date
          >
            {data.dateKey} (₹{data.totalAmount.toFixed(2)}) {/* Format amount */}
          </Button>
        ))}
      </div>

      <p className="text-muted mb-4">
        Total amount you will receive from Zozokart (Individual upcoming + Rest payment)
      </p>

      <Row>
        <Col md={6}>
          {currentPaymentTypes.length > 0 ? (
            <Table bordered hover responsive style={{ fontSize: '12px' }}>
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
                {currentPaymentTypes.map((item, index) => (
                  <tr key={index}>
                    <td><strong>{item.type}</strong></td>
                    <td>
                      {item.details.map((d, i) => (
                        <div key={i}>{d}</div>
                      ))}
                    </td>
                    <td>{item.prepaid.toFixed(2)}</td>
                    <td>{item.postpaid.toFixed(2)}</td>
                    <td>{(item.prepaid + item.postpaid).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="fw-bold table-light">
                  <td colSpan={2}>Total</td>
                  <td>{getTotal('prepaid').toFixed(2)}</td>
                  <td>{getTotal('postpaid').toFixed(2)}</td>
                  <td>{(getTotal('prepaid') + getTotal('postpaid')).toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <Card className="text-center py-5">
                <CardBody>
                    <FaList size={36} className="mb-3 text-muted" />
                    <CardText className="text-muted">No payment data available for {selectedDate}.</CardText>
                </CardBody>
            </Card>
          )}

          <Card className="mt-4 border-danger">
            <CardBody>
              <h6 className="text-danger fw-bold mb-2">IMPORTANT INFORMATION</h6>
              <ul className="mb-0 ps-3 small">
                <li>If the payment is negative (-), wait till it turns positive to get the next payment.</li>
                <li>Update on dispatched orders may take 48hrs to show in the Upcoming Payments.</li>
                <li>Upcoming Total Payments may change due to new orders, returns, SPF, TDS claims, or service fees.</li>
              </ul>
            </CardBody>
          </Card>
        </Col>

        {/* Removed the static "No payment data available" column,
            now it's dynamically rendered within the main column based on currentPaymentTypes */}
      </Row>
    </>
  );
};

export default UpcomingPayments;