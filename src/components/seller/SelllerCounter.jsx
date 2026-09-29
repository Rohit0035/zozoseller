import React, { useEffect, useState } from "react";

const SellerCounter = () => {
    const counters = [
        {
            value: 14,
            suffix: " Lakh+",
            label: "Seller community",
        },
        {
            value: 24,
            suffix: "×7",
            label: "Online Business",
        },
        {
            value: 7,
            suffix: "",
            label: "days* payment",
        },
        {
            value: 19000,
            suffix: "+",
            label: "Pincodes served",
        },
    ];

    const [startCounter, setStartCounter] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("seller-counter");

            if (!section) return;

            const rect = section.getBoundingClientRect();

            if (rect.top < window.innerHeight * 0.85) {
                setStartCounter(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const AnimatedNumber = ({ value, suffix }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!startCounter) return;

            let start = 0;
            const duration = 1200;
            const increment = value / (duration / 30);

            const timer = setInterval(() => {
                start += increment;

                if (start >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 30);

            return () => clearInterval(timer);
        }, [startCounter, value]);

        return (
            <>
                {count.toLocaleString("en-IN")}
                {suffix}
            </>
        );
    };

    return (
        <section
            id="seller-counter"
            className="py-5 bg-white"
            style={{
                borderRadius: "0 0 12px 12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
            }}
        >
            <div className="container-fluid px-4">
                <div className="row align-items-center text-center">
                    {counters.map((item, index) => (
                        <div
                            key={index}
                            className="col-6 col-md-3 py-2  py-4 "
                            data-aos="zoom-in"
                            style={{
                                borderRight:
                                    index !== counters.length - 1
                                        ? "1px solid #d9e5f2"
                                        : "none",
                            }}
                        >
                            <div
                                className="fw-bold st-text"
                                style={{
                                    fontSize: "30px",
                                    lineHeight: "1",
                                    marginBottom: "5px",
                                }}
                            >
                                <AnimatedNumber
                                    value={item.value}
                                    suffix={item.suffix}
                                />
                            </div>

                            <div
                                className="text-dark"
                                style={{
                                    fontSize: "14px",
                                    lineHeight: "1.2",
                                }}
                            >
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SellerCounter;
