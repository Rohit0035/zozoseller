import React, { useState } from 'react';
import '../../../assets/styles/selectVertical.css';
import { Col, Row } from 'reactstrap';
import SearchComponent from '../../../components/SearchComponent';

const data = {
    "Automobile": {
        "RTO": {
            "Two Wheeler": {
                "Motorcycle": {
                    "Scooter & Moped": {
                        description:
                            "Scooter moped is a lightweight two-wheeled motor vehicle designed for short-distance travel, offering convenience, fuel efficiency, and ease of use—especially in urban areas.",
                        allowed: false,
                    },
                    "Electric Vehicles": null,
                },
            },
            "Vehicle Accessories": null,
            "Vehicle Insurance": null,
        },
    },
    "Automotive Care & Accessories": null,
    "Automotive Safety & Security": null,
    "Automotive Spares": null,
    "Baby Care": null,
    "Books & Media": null,
};

const SelectVerticalTabs = () => {
    const [selected, setSelected] = useState({
        level1: "Automobile",
        level2: "RTO",
        level3: "Two Wheeler",
        level4: "Motorcycle",
        level5: "Scooter & Moped",
    });

    const renderLevel = (items, levelKey, nextLevelKey) => {
        if (!items) return null;

        const keys = Object.keys(items);
        return (
            <div className="vertical-tab-column">
                {keys.map((key) => (
                    <div
                        key={key}
                        className={`vertical-tab-item ${selected[levelKey] === key ? 'active' : ''
                            }`}
                        onClick={() => {
                            setSelected((prev) => {
                                const updated = { ...prev };
                                updated[levelKey] = key;
                                if (nextLevelKey) delete updated[nextLevelKey];
                                return updated;
                            });
                        }}
                    >
                        {key}
                    </div>
                ))}
            </div>
        );
    };

    const selectedData =
        data[selected.level1]?.[selected.level2]?.[selected.level3]?.[selected.level4]?.[selected.level5];

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
                {/* Level 1 */}
                {renderLevel(data, 'level1', 'level2')}
                {renderLevel(data[selected.level1], 'level2', 'level3')}
                {renderLevel(
                    data[selected.level1]?.[selected.level2],
                    'level3',
                    'level4'
                )}
                {renderLevel(
                    data[selected.level1]?.[selected.level2]?.[selected.level3],
                    'level4',
                    'level5'
                )}
                {renderLevel(
                    data[selected.level1]?.[selected.level2]?.[selected.level3]?.[selected.level4],
                    'level5',
                    null
                )}

                {/* Right Content */}
                <div className="vertical-tab-details">
                    <div className="vertical-tab-info">
                        <p className="vertical-tab-info-title">VERTICAL &nbsp;
                            <strong>{selected.level5}</strong>
                        </p>
                        <p className="vertical-tab-info-desc">{selectedData?.description}</p>
                    </div>

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
                </div>
            </div>
        </>
    );
};

export default SelectVerticalTabs;
