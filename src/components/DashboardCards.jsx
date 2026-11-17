
import React from "react";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Row,
  Col
} from "reactstrap";

import {
  FaRocket,
  FaChartLine,
  FaBullhorn,
  FaGift,
  FaShoppingBag,
  FaArrowRight
} from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "react-perfect-scrollbar/dist/css/styles.css";

import adsban from "../assets/images/seller/ads-sl-ads.png";

const DashboardCards = ({ dashboardData }) => {

  // Common card configuration
  const cardData = [
    {
      id: 1,
      title: "What's New",
      icon: FaRocket,
      badge: "New",
      badgeColor: "success",
      sections: [
        {
          heading: "Listing Autofill",
          description:
            "Now AI lists your catalog in half the time with automated product information.",
          points: [
            "No More Manual Filling",
            "Fewer Rejections",
            "Better Discovery"
          ]
        },
        {
          heading: "AI Product Suggestions",
          description:
            "Discover smart product recommendations to improve your catalog."
        }
      ],
      image: null,
      buttonLink: "/"
    },

    {
      id: 2,
      title: "Settlement Hub",
      icon: FaChartLine,
      sections: [
        {
          heading: "Boost New Products",
          description:
            "Get higher visibility on 6+ listings by accepting our recommendations."
        },
        {
          heading: "Settlement Overview",
          description:
            "Track your settlements and stay updated with payment information."
        }
      ],
      image: null,
      link: "/settlement-hub"
    },

    {
      id: 3,
      title: "ZOZO KART Ads",
      icon: FaBullhorn,
      badge: "Beta",
      badgeColor: "light",
      sections: [
        {
          heading: "New Boost Sale Recommendations",
          description:
            "Best quality products curated to deliver assured ROI."
        },
        {
          heading: "Auto Optimised Campaign",
          description:
            "Launch campaigns with automatic optimisation for better performance."
        }
      ],
      image: null,
    },

    {
      id: 4,
      title: "Offers",
      icon: FaGift,
      sections: [
        {
          heading: "Festive Bonanza",
          description:
            "Participate in festive offers and attract more customers."
        },
        {
          heading: "Special Seller Offers",
          description:
            "Explore exclusive promotional opportunities for your products."
        }
      ],
      image: null,
      link: "/offers"
    },

    {
      id: 5,
      title: "Selection Insights",
      icon: FaShoppingBag,
      sections: [
        {
          heading: "Product Selection Insights",
          description:
            "Understand product demand and identify new growth opportunities."
        }
      ],
      // Only one image will be shown inside this card
      image: adsban,
      imageAlt: "Selection Insights",
      imageLink: "/",
      link: "/"
    }
  ];

  // Common card styles
  const cardStyle = {
    height: "100%",
    minHeight: "260px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    border: "0",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
  };

  const headerStyle = {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "1px solid #eee",
    minHeight: "60px",
    fontWeight: "600",
    flexShrink: 0
  };

  const bodyStyle = {
    flex: 1,
    padding: "16px",
    minHeight: 0,
    overflow: "hidden"
  };

  return (
    <div className="container-fluid px-0 dashboard-cards">

      <Swiper
        modules={[Navigation]}
        spaceBetween={18}
        navigation
        grabCursor
        slidesPerView={4}
        className="dashboard-swiper"
        style={{
          width: "100%",
          paddingBottom: "15px"
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 12
          },
          400: {
            slidesPerView: 1.2,
            spaceBetween: 12
          },
          576: {
            slidesPerView: 2,
            spaceBetween: 15
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 15
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 18
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 18
          }
        }}
      >

        {cardData.map((card) => {

          const Icon = card.icon;

          return (
            <SwiperSlide
              key={card.id}
              style={{
                height: "260px",
                display: "flex"
              }}
            >

              <Card style={cardStyle}>

                <div style={headerStyle}>

                  <Icon size={18} />

                  <span>{card.title}</span>

                  {card.badge && (
                    <Badge
                      color={card.badgeColor || "light"}
                      className="text-white ms-auto"
                    >
                      {card.badge}
                    </Badge>
                  )}

                </div>

                <CardBody style={bodyStyle}>

                  <PerfectScrollbar
                    options={{
                      suppressScrollX: true,
                      wheelPropagation: false,
                      minScrollbarLength: 30
                    }}
                    style={{
                      height: "100%",
                      position: "relative"
                    }}
                  >

                    {card.sections?.map((section, index) => (

                      <div
                        key={index}
                        className="mb-3"
                      >

                        <h6 className="small fw-bold mb-1">
                          {section.heading}
                        </h6>

                        <p className="small text-secondary mb-2">
                          {section.description}
                        </p>

                        {section.points && (
                          <ul className="small ps-3 mb-2">
                            {section.points.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        )}

                      </div>

                    ))}

                    {card.image && (
                      <div className="mb-3">

                        <Link
                          to={card.imageLink || "/"}
                          className="d-block"
                        >
                          <img
                            src={card.image}
                            alt={card.imageAlt || card.title}
                            className="w-100 rounded-3"
                            style={{
                              height: "110px",
                              objectFit: "cover"
                            }}
                          />
                        </Link>

                      </div>
                    )}

                    {card.buttonText && (
                      <div className="mt-3">

                        <Link to={card.buttonLink || "/"}>
                          <Button
                            color="primary"
                            size="sm"
                          >
                            {card.buttonText}
                            {" "}
                            <FaArrowRight />
                          </Button>
                        </Link>

                      </div>
                    )}

                    {card.linkText && (
                      <div className="mt-3">

                        <Link
                          to={card.link || "/"}
                          className="small text-decoration-none"
                        >
                          {card.linkText}
                          {" "}
                          <FaArrowRight />

                        </Link>

                      </div>
                    )}

                  </PerfectScrollbar>

                </CardBody>

              </Card>

            </SwiperSlide>
          );

        })}

      </Swiper>

    </div>
  );
};

export default DashboardCards;
