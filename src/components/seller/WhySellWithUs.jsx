import React from "react";
import {
    FiSearch,
    FiZap,
    FiTrendingUp,
    FiHeadphones,
} from "react-icons/fi";

import SellImg from "../../assets/images/seller/st-sell1.png"

const WhySellWithUs = () => {
    const benefits = [
        {
            icon: <FiSearch />,
            title: "Opportunity",
            description:
                "Reach customers across India and showcase your products to a growing online shopping audience on ZOZO KART.",
        },
        {
            icon: <FiZap />,
            title: "Ease of Doing Business",
            description:
                "Create your ZOZO KART seller account quickly with your basic business details, GST and bank information.",
        },
        {
            icon: <FiTrendingUp />,
            title: "Growth",
            description:
                "Increase your product visibility, attract new customers and grow your sales with ZOZO KART.",
        },
        {
            icon: <FiHeadphones />,
            title: "Additional Support",
            description:
                "Get seller assistance, training resources, business insights, catalogue support and more.",
        },
    ];

    return (
        <section className="py-5 bg-light" id="whysellus">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="fw-bold mb-3">
                                    Why do{" "}
                                    <span className="st-text">sellers love selling</span>{" "}
                                    on ZOZO KART?
                                </h2>
                                <p className="text-secondary mb-4">
                                    ZOZO KART helps sellers take their products online, connect with
                                    customers across India and build a growing digital business with
                                    simple and reliable seller tools.
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            {benefits.map((benefit, index) => (
                                <div
                                    className="col-md-6 mb-3"
                                    key={index}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="card border-0 shadow-sm rounded-3 h-100">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center mb-1">
                                                <span className="st-text fs-4 me-3">
                                                    {benefit.icon}
                                                </span>

                                                <h5 className="fw-bold mb-0">
                                                    {benefit.title}
                                                </h5>
                                            </div>

                                            <p className="text-secondary mb-0 mt-2">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        className="col-lg-4 text-center mt-5 mt-lg-0"
                        data-aos="zoom-in"
                    >
                        <img
                            src={SellImg}
                            alt="ZOZO KART Seller"
                            className="w-100"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhySellWithUs;
