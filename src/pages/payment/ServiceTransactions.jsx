import React, { useEffect, useState } from 'react';
import {
    Container,
    Button,
    Row,
    Col,
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { GetAdServiceRequests } from '../../api/adServiceRequestAPI';
import { Link } from 'react-router-dom';

const sampleData = [
    {
        id: 1,
        serviceName: 'SMS Service',
        serviceDetails: 'Bulk SMS Plan',
        orderId: 'ORD123456',
        amount: '₹1000',
        status: 'Success',
        paymentDate: '12 Jul 2025',
        message: 'Paid successfully',
        mode: 'UPI'
    },
    {
        id: 2,
        serviceName: 'Ad Service',
        serviceDetails: 'Google Ads Promo',
        orderId: 'ORD654321',
        amount: '₹2500',
        status: 'Pending',
        paymentDate: '-',
        message: 'Awaiting confirmation',
        mode: 'Bank Transfer'
    },
    {
        id: 3,
        serviceName: 'Hosting',
        serviceDetails: 'VPS Cloud',
        orderId: 'ORD998877',
        amount: '₹1500',
        status: 'Failed',
        paymentDate: '10 Jul 2025',
        message: 'Bank declined',
        mode: 'Credit Card'
    }
];

const columns = [
    { name: 'Service Name', selector: row => row.serviceName },
    { name: 'Service Details', selector: row => row.serviceDetails },
    { name: 'Service Order ID', selector: row => row.orderId },
    { name: 'Amount', selector: row => row.amount },
    { name: 'Transaction Status', selector: row => row.status },
    { name: 'Payment Date', selector: row => row.paymentDate },
    { name: 'Payment Mode', selector: row => row.mode }
];

const tabs = ['All', 'Paid', 'Failed', 'Pending'];

const ServiceTransactions = () => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filteredData =
        activeTab === 'All'
            ? data
            : data.filter(item => item.status === activeTab);

    // Function to fetch payment data based on current filters
      const fetchAdServiceRequestData = async (activeTabParam, dateRangeParam) => {
        setLoading(true);
        setError(null);
        try {
          const response = await GetAdServiceRequests();
          if (response.success) {
            const formattedData = response.data.map((item)=>{
                return {
                    id: item._id,
                    serviceName: item.adPlanId?.name,
                    serviceDetails: item.adPlanId?.description,
                    orderId: item?._id,
                    amount: item.adPlanId?.price,
                    status: item.paymentStatus,
                    paymentDate: item.createdAt,
                    mode: item.method
                }
            })
            setData(formattedData);
          }
        } catch (err) {
          console.error("Error fetching payment data:", err);
          setError("Failed to load payment data.");
          setFilteredData([]);
        } finally {
          setLoading(false);
        }
      };
    
      // Initial load of months and data
      useEffect(() => {
        fetchAdServiceRequestData();
      }, []);

    return (
        <>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5>Service Transactions</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Payment
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>
            <Row>
                <Col md={10} className="mb-3 d-flex gap-2 flex-wrap">
                    {tabs.map(tab => (
                        <Button
                        key={tab}
                        outline
                        size="sm"
                        color={activeTab === tab ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab(tab)}
                        className={activeTab === tab ? 'fw-bold' : ''}
                        >
                            {tab}
                        </Button>
                    ))}
                </Col>
                <Col md={2} className='text-end'>
                    <Link to="/add-service-request" className='btn btn-primary'>Add Request</Link>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <CardBody>
                    {filteredData.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            noHeader
                            highlightOnHover
                        />
                    ) : (
                        <div className="text-center py-5">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                                alt="no data"
                                width="80"
                                className="mb-3 opacity-50"
                            />
                            <p className="text-muted mb-0">
                                No data found. You have not purchased any service.
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </>
    );
};

export default ServiceTransactions;
