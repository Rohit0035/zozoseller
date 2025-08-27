import React, { useState } from "react";
import { Breadcrumb, BreadcrumbItem, Col, Row } from "reactstrap";
import StatsCards from "../components/StatCard,";
// import BarGraph from '../components/BarGraph';
import SimpleSwiper from "../components/SimpleSwiper";
import DashboardCards from "../components/DashboardCards";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetSellerDashboardData } from "../api/sellerAPI";

const Dashboard = () => {
  const carouselItems = [
    {
      altText: "Slide 1",
      caption: "Slide 1",
      key: 1,
      src: "https://picsum.photos/id/1011/1200/600"
    },
    {
      altText: "Slide 2",
      caption: "Slide 2",
      key: 2,
      src: "https://picsum.photos/id/1012/1200/600"
    },
    {
      altText: "Slide 3",
      caption: "Slide 3",
      key: 3,
      src: "https://picsum.photos/id/1013/1200/600"
    }
  ];

  const [dashboardData, setDashboardData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated) || false;
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated])

  const fetchDashboardData = async () => {
    dispatch({ type: "loader", loader: true });
    
    try {
      const response = await GetSellerDashboardData();
      console.log(response)
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (err) {
        console.error("Error fetching invoice data:", err);
        setDashboardData([]);
      } finally {
        dispatch({ type: "loader", loader: false });
      }
    };
  
    // Initial load of months and data
    useEffect(() => {
      fetchDashboardData();
    }, []);

  return (
    <div className="page text-start">
      <Row>
        <Col md="12">
          <div className="">
            <Row>
              <Col md="12">
                <Breadcrumb className="my-2">
                  <BreadcrumbItem>
                    <h5>Dashboard</h5>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>Today</BreadcrumbItem>
                </Breadcrumb>
                <StatsCards dashboardData={dashboardData}/>
              </Col>
              {/* <Col md="5">
                <Card>
                  <CardBody>
                    <BarGraph />
                  </CardBody>
                </Card>
              </Col> */}
            </Row>
          </div>
        </Col>

        <Col md="12">
          <div className="mt-3 p-3" style={{ backgroundColor: "#eff7ff" }}>
            <DashboardCards dashboardData={dashboardData}/>
          </div>
        </Col>

        <Col md="12" className="mt-3">
          <SimpleSwiper />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
