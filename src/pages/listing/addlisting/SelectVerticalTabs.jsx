import React, { useState } from 'react';
import '../../../assets/styles/selectVertical.css';
import { Button, Col, Row } from 'reactstrap';
import SearchComponent from '../../../components/SearchComponent';
import CategoryImg from '../../../assets/images/common/cate-common.png'

const data = {
    "Automobile": {
        image: CategoryImg,
        children: {
            "RTO": {
                "Vehicle Registration": { description: "Registration Info", allowed: false },
                "Vehicle Charges": { description: "Charges Info", allowed: true },
            },
            "Two Wheeler": {
                "Motorcycle": { description: "Motorcycle Info", allowed: false },
                "Scooter & Moped": { description: "Scooter Info", allowed: true },
            },
            "Vehicle Accessories": {
                "Battery Chargers": { description: "Battery Charger Info", allowed: false },
            },
            "Vehicle Insurance": {
                "Motor Insurance": { description: "Insurance Info", allowed: true },
            },
        }
    },
    "Automotive Care & Accessories": {
        image: CategoryImg,
        children: null
    },
    "Automotive Safety & Security": {
        image: CategoryImg,
        children: null
    },
    "Automotive Spares": {
        image: CategoryImg,
        children: null
    },
    "Baby Care": {
        image: CategoryImg,
        children: null
    },
    "Books & Media": {
        image: CategoryImg,
        children: null
    },
};

const SelectVerticalTabs = () => {
    const [selected, setSelected] = useState({
        level1: "Automobile",
        level2: null,
        level3: null,
    });

    const renderLevel = (items, levelKey, nextLevelKey) => {
        if (!items) return null;
        const keys = Object.keys(items);
        return (
            <div className="vertical-tab-column">
                {keys.map((key) => {
                    const isLevel1 = levelKey === "level1";
                    const imageUrl = isLevel1 ? items[key]?.image : null;

                    return (
                        <div
                            key={key}
                            className={`vertical-tab-item ${selected[levelKey] === key ? 'active' : ''}`}
                            onClick={() => {
                                setSelected((prev) => {
                                    const updated = { ...prev };
                                    updated[levelKey] = key;
                                    if (nextLevelKey) delete updated[nextLevelKey];
                                    return updated;
                                });
                            }}
                        >
                            <div className='d-flex'>
                                <div className='imgbox'>
                                    {isLevel1 && imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt={key}
                                            style={{ width: 24, height: 24, marginRight: 8 }}
                                        />
                                    )}
                                </div>
                                <div className='imgbox'>
                                    {key}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const selectedData = data[selected.level1]?.children?.[selected.level2]?.[selected.level3];

    return (
        <>
            <Row className='mb-4'>
                <Col md="12" className='mb-2'>
                    <h5 className='mb-0'>Select The Vertical For Your Product</h5>
                    <small>You can use the Search or Browse options</small>
                </Col>
                <Col md="4">
                    <SearchComponent placeholder="Search Verticals..." />
                </Col>
            </Row>

            <div className="vertical-tab-wrapper">
                {renderLevel(data, 'level1', 'level2')}
                {renderLevel(data[selected.level1]?.children, 'level2', 'level3')}
                {renderLevel(data[selected.level1]?.children?.[selected.level2], 'level3', null)}

                <div className="vertical-tab-details">
                    <Row>
                        <Col md="12">
                            <div className="vertical-tab-info">
                                <p className="vertical-tab-info-title">
                                    VERTICAL &nbsp;<strong>{selected.level3}</strong>
                                </p>
                                <p className="vertical-tab-info-desc">{selectedData?.description}</p>
                            </div>
                        </Col>

                        {selected.level1 && selected.level2 && selected.level3 ? (
                            <>
                                <Col md="6" style={{ borderRight: '1px solid #ccc' }}>
                                    <div className='broder-right'>
                                        <p style={{ fontSize: '12px' }}>
                                            Bike Clutch Covers are protective casings that encase the clutch
                                            assembly of a motorcycle. They prevent dust and debris from entering
                                            the clutch mechanism, ensuring smooth performance and enhancing the
                                            longevity of the system.
                                        </p>
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className='text-center'>
                                        <p>Please select a brand to start selling in this vertical.</p>
                                        <Button className='btn btn-primary btn-sm'>Select Brand</Button>
                                    </div>
                                </Col>
                            </>
                        ) : (
                            <Col md="12">
                                {!selectedData?.allowed && (
                                    <div className="vertical-tab-blocked">
                                        <p className="error-icon">❌</p>
                                        <p className="error-msg">You are not allowed to sell in this vertical.</p>
                                        <div className="warning-msg">
                                            ⚠️ Additional details are required from you to sell under this vertical. Kindly reach out to Seller Support.
                                        </div>
                                        <a href="#" className="back-link">Back to My Listings</a>
                                    </div>
                                )}
                            </Col>
                        )}
                    </Row>
                </div>
            </div>
        </>
    );
};

export default SelectVerticalTabs;
