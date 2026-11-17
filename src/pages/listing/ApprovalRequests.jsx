import React, { useEffect, useState } from 'react';
import {
    Breadcrumb, BreadcrumbItem, Col, Row, Card, CardBody, Input, Button, Badge,
    Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label
} from 'reactstrap';
import { FaList, FaExclamationCircle, FaHourglassHalf, FaCheckCircle, FaDownload } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../components/ToastifyNotification';
import { GetProducts } from '../../api/productAPI';
import { formatDateWithTime } from '../../utils/dateFormatter';
import { checkProfileCompletion } from '../../utils/common';

const ApprovalRequests = () => {
    const [filterText, setFilterText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const navigate = useNavigate();



    const dispatch = useDispatch();
    // --- API Fetching Logic ---
    const fetchProducts = async () => {
        dispatch({ type: 'loader', loader: true });
        try {
            const response = await GetProducts();
            if (response.success) {
                showToast('success', response.message);
                const formattedData = response.data.map((item, index) => ({
                    index: index + 1,
                    id: item._id, // Keep _id for potential future actions
                    title: item.name,
                    brand: item?.brandId?.name || 'N/A',
                    vertical: item?.categoryId?.name + '->' + item?.subCategoryOneId?.name + '->' + item?.subCategoryTwoId?.name || 'N/A',
                    status: item.status,
                    comments: item.comments || 'N/A',
                    lastUpdated: formatDateWithTime(item.updatedAt),
                }));
                setData(formattedData);
                setFilteredData(formattedData); // Initialize filteredData with all fetched data
            } else {
                showToast('error', response.message);
                setError(response.message);
            }
        } catch (error) {
            showToast('error', error.message || 'Failed to fetch products');
            setError(error.message || 'Failed to fetch products');
        } finally {
            dispatch({ type: 'loader', loader: false });
        }
    };

    useEffect(() => {
        if (isProfileComplete) {
            fetchProducts();
        }
    }, [isProfileComplete]); // Fetch products on component mount

    const toggleModal = () => setModalOpen(!modalOpen);


    const counters = [
        {
            title: "All Requests",
            count: data.length,
            icon: <FaList size={21} />,
            DotColor: "#073B8A",

            bgColor: "#073B8A",
            lightBg: "#EAF1FC"
        },
        {
            title: "Action Required",
            count: data.filter(item => item.status === "Action Required").length,
            icon: <FaExclamationCircle size={21} />,
            DotColor: "#dc3545",
            bgColor: "#073B8A",
            lightBg: "#EAF1FC"
        },
        {
            title: "Pending",
            count: data.filter(item => item.status === "Pending").length,
            icon: <FaHourglassHalf size={21} />,
            DotColor: "#E3A008",
            bgColor: "#073B8A",
            lightBg: "#EAF1FC"
        },
        {
            title: "Approved",
            count: data.filter(item => item.status === "Approved").length,
            icon: <FaCheckCircle size={21} />,
            DotColor: "#198754",
            bgColor: "#073B8A",
            lightBg: "#EAF1FC"
        }
    ];


    const columns = [
        { name: 'Request ID', selector: row => row.id, sortable: true },
        { name: 'Brand', selector: row => row.brand, sortable: true },
        { name: 'Vertical', selector: row => row.vertical, sortable: true },
        {
            name: 'Status',
            cell: row => {
                let color = 'secondary';
                if (row.status === 'Approved') color = 'success';
                else if (row.status === 'Pending') color = 'warning';
                else if (row.status === 'Action Required') color = 'danger';
                return <Badge color={color}>{row.status}</Badge>;
            },
            sortable: true,
        },
        { name: 'Comments', selector: row => row.comments, sortable: false },
        { name: 'Last Updated On', selector: row => row.lastUpdated, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <Button className="btn btn-primary btn-sm" onClick={toggleModal}>
                    Reapply
                </Button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const user = useSelector(state => state.auth.user) || '';
    useEffect(() => {
        const profileComplete = checkProfileCompletion(user);

        if (!profileComplete.isComplete) {
            navigate('/profile', { state: { showPopup: true } });
        } else {
            setIsProfileComplete(true);
        }
    }, [user, navigate]);

    // Conditional rendering check
    if (!isProfileComplete) {
        return null; // Or a loading spinner/message
    }

    return (
        <>
            {/* Breadcrumb */}
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem><h5>Approval Requests</h5></BreadcrumbItem>
                        <BreadcrumbItem active>Listing</BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>

            {/* Counters */}

            <Row className="row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-3">
                {counters.map((item, index) => (
                    <Col key={index}>
                        <Link
                            to="/trackapprovalrequests"
                            className="text-decoration-none"
                        >
                            <Card
                                className="h-100 border-0 shadow-sm bg-light"
                                style={{
                                    borderRadius: "14px",
                                    borderBottom: `3px solid ${item.bgColor}`,
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <CardBody className="p-3">
                                    <div className="d-flex justify-content-between align-items-start">

                                        <div>
                                            <div className="text-uppercase fw-semibold text-secondary mb-2"
                                                style={{
                                                    fontSize: "12px",
                                                    letterSpacing: "0.6px"
                                                }}
                                            >
                                                {item.title}
                                            </div>

                                            <h2
                                                className="fw-bold mb-2"
                                                style={{
                                                    color: "#183B65",
                                                    fontSize: "30px"
                                                }}
                                            >
                                                {item.count}
                                            </h2>

                                            <div className="d-flex align-items-center gap-1">
                                                <span
                                                    className="rounded-circle"
                                                    style={{
                                                        width: "7px",
                                                        height: "7px",
                                                        background: item.DotColor
                                                    }}
                                                />
                                                <small className="text-muted">
                                                    View details
                                                </small>
                                            </div>
                                        </div>

                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "54px",
                                                height: "54px",
                                                backgroundColor: item.lightBg,
                                                color: item.bgColor,
                                                fontSize: "23px"
                                            }}
                                        >
                                            {item.icon}
                                        </div>

                                    </div>
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>


            {/* Search + CSV Export */}
            <Card>
                <CardBody>
                    <Row className="align-items-center mb-3">
                        <Col md="3" sm="6" xs="12" className="mb-2">
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </Col>
                        <Col className="text-end">
                            <CSVLink data={filteredData} filename="request_list.csv">
                                <Button color="success">
                                    <FaDownload className="me-1" /> Export CSV
                                </Button>
                            </CSVLink>
                        </Col>
                    </Row>

                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </CardBody>
            </Card>

            {/* Modal for Reapply */}
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>Apply for Brand Approval</ModalHeader>
                <ModalBody>
                    <Form>
                        {/* Brand Name */}
                        <FormGroup>
                            <Label for="brandName">Brand Name *</Label>
                            <Input type="text" id="brandName" placeholder="Enter Brand Name" />
                        </FormGroup>

                        {/* Select Document */}
                        <FormGroup>
                            <Label for="documentType">Please select the document *</Label>
                            <Input type="select" id="documentType">
                                <option>Select</option>
                                <option>Trademark Certificate</option>
                                <option>Brand Authorization Letter</option>
                            </Input>
                        </FormGroup>

                        {/* Document Upload */}
                        <FormGroup>
                            <Label>Upload Document</Label>
                            <Input type="file" />
                        </FormGroup>

                        {/* Trademark Help */}
                        <FormGroup>
                            <Label>Trademark Help</Label>
                            <p><strong>Vakilsearch:</strong> Get your Trademark Registration today!!! Trademark Registration @ Rs 999 *Gov fee additional</p>
                        </FormGroup>

                        {/* Other Details (Optional) */}
                        <hr />
                        <h6>Other brand details (Optional)</h6>

                        {/* Brand Logo */}
                        <FormGroup>
                            <Label>Brand Logo</Label>
                            <Input type="file" />
                        </FormGroup>

                        {/* Website Link */}
                        <FormGroup>
                            <Label>Brand Website Link</Label>
                            <Input type="text" placeholder="https://example.com" />
                        </FormGroup>

                        {/* Where you sell */}
                        <FormGroup>
                            <Label>Where do you sell the products of this brand currently?</Label>
                            <Input type="select">
                                <option>Select</option>
                                <option>Amazon</option>
                                <option>Flipkart</option>
                                <option>Other</option>
                            </Input>
                        </FormGroup>

                        {/* Sample MRP Tag */}
                        <FormGroup>
                            <Label>Sample MRP Tag images</Label>
                            <Input type="file" />
                        </FormGroup>

                        {/* Brand Owner */}
                        <FormGroup>
                            <Label>Are you the brand owner?</Label>
                            <Input type="select">
                                <option>Select</option>
                                <option>Yes</option>
                                <option>No</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary">Submit</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default ApprovalRequests;
