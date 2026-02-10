import React, { useState, useEffect, useCallback } from 'react';
import '../../../assets/styles/selectVertical.css';
import { Button, Col, Row } from 'reactstrap';
import SearchComponent from '../../../components/SearchComponent';
import CategoryImg from '../../../assets/images/common/cate-common.png';
import { GetCategories } from '../../../api/categoryAPI';
import { GetSubCategoriesOne } from '../../../api/subCategoryOneAPI';
import { GetSubCategoriesTwo } from '../../../api/subCategoryTwoAPI';
import { showToast } from '../../../components/ToastifyNotification';
import { IMAGE_URL } from '../../../utils/api-config';

const SelectVerticalTabs = ({ currentStep, setCurrentStep, listingData, onListingDataChange }) => {
    const [categoryData, setCategoryData] = useState({});
    const [selected, setSelected] = useState({
        level1: null,
        level2: null,
        level3: null,
    });

    // --- Helper Functions ---
    const findKeyById = (obj, idToFind) => {
        if (!obj || !idToFind) return null;
        return Object.keys(obj).find(key => obj[key]?.id === idToFind);
    };

    const findLevel2KeyById = (level1Data, idToFind) => {
        if (!level1Data?.childrenIds || !idToFind) return null;
        return Object.keys(level1Data.childrenIds).find(key => level1Data.childrenIds[key] === idToFind);
    };

    // --- API Fetchers ---
    const fetchCategories = async () => {
        try {
            const response = await GetCategories();
            if (response.success) {
                const formatted = {};
                response.data.forEach((cat) => {
                    formatted[cat.name] = {
                        image: CategoryImg,
                        id: cat._id,
                        children: null,
                    };
                });
                setCategoryData(formatted);

                // If in EDIT MODE: Find Level 1 Key
                if (listingData.categoryId) {
                    const l1Key = findKeyById(formatted, listingData.categoryId);
                    if (l1Key) setSelected(prev => ({ ...prev, level1: l1Key }));
                } else {
                    // Default for New Entry
                    const defaultKey = Object.keys(formatted)[0];
                    setSelected((prev) => ({ ...prev, level1: defaultKey }));
                }
            }
        } catch (error) {
            showToast('error', 'Failed to fetch categories');
        }
    };

    const fetchSubCategoryOne = useCallback(async (catId, l1Key) => {
        try {
            const response = await GetSubCategoriesOne({ categoryId: catId });
            if (response.success) {
                setCategoryData(prev => {
                    const updated = { ...prev };
                    const children = {};
                    const childrenIds = {};
                    response.data.forEach((item) => {
                        children[item.name] = null;
                        childrenIds[item.name] = item._id;
                    });
                    updated[l1Key] = { ...updated[l1Key], children, childrenIds };
                    return updated;
                });

                // If EDIT MODE: Auto-select Level 2
                if (listingData.subCategoryOneId) {
                    const l2Key = Object.keys(listingData).length > 0 ? 
                        response.data.find(item => item._id === listingData.subCategoryOneId)?.name : null;
                    if (l2Key) setSelected(prev => ({ ...prev, level2: l2Key }));
                }
            }
        } catch (error) { console.error(error); }
    }, [listingData.subCategoryOneId]);

    const fetchSubCategoryTwo = useCallback(async (subOneId, l1Key, l2Key) => {
        try {
            const response = await GetSubCategoriesTwo({ subCategoryOneId: subOneId });
            if (response.success) {
                setCategoryData(prev => {
                    const updated = { ...prev };
                    const children = {};
                    response.data.forEach((item) => {
                        children[item.name] = {
                            description: item.description,
                            allowed: item.allowed,
                            image: item.image,
                            id: item._id,
                        };
                    });
                    if (updated[l1Key]?.children) {
                        updated[l1Key].children[l2Key] = children;
                    }
                    return updated;
                });

                // If EDIT MODE: Auto-select Level 3
                if (listingData.subCategoryTwoId) {
                    const l3Key = response.data.find(item => item._id === listingData.subCategoryTwoId)?.name;
                    if (l3Key) setSelected(prev => ({ ...prev, level3: l3Key }));
                }
            }
        } catch (error) { console.error(error); }
    }, [listingData.subCategoryTwoId]);

    // --- Effects ---

    // 1. Initial Load
    useEffect(() => { fetchCategories(); }, []);

    // 2. Watch Level 1 Selection -> Fetch Level 2
    useEffect(() => {
        const l1Item = categoryData[selected.level1];
        if (selected.level1 && l1Item?.id && !l1Item.children) {
            fetchSubCategoryOne(l1Item.id, selected.level1);
        }
    }, [selected.level1, categoryData, fetchSubCategoryOne]);

    // 3. Watch Level 2 Selection -> Fetch Level 3
    useEffect(() => {
        const l1Item = categoryData[selected.level1];
        if (selected.level1 && selected.level2 && l1Item?.childrenIds) {
            const subOneId = l1Item.childrenIds[selected.level2];
            if (subOneId && (!l1Item.children[selected.level2])) {
                fetchSubCategoryTwo(subOneId, selected.level1, selected.level2);
            }
        }
    }, [selected.level2, selected.level1, categoryData, fetchSubCategoryTwo]);

    // --- Render Logic ---
    const renderLevel = (items, levelKey, nextLevelKey) => {
        if (!items) return <div className="vertical-tab-column" />;
        const keys = Object.keys(items);
        return (
            <div className="vertical-tab-column">
                {keys.map((key) => {
                    const isActive = selected[levelKey] === key;
                    return (
                        <div
                            key={key}
                            className={`vertical-tab-item ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                setSelected((prev) => ({
                                    ...prev,
                                    [levelKey]: key,
                                    ...(nextLevelKey ? { [nextLevelKey]: null } : {}),
                                    ...(levelKey === 'level1' ? { level3: null } : {})
                                }));
                            }}
                        >
                            <div className='d-flex align-items-center'>
                                {levelKey === "level1" && items[key]?.image && (
                                    <img src={items[key].image} alt="" style={{ width: 24, height: 24, marginRight: 8 }} />
                                )}
                                <span>{key}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const selectedLevel3Data = categoryData[selected.level1]?.children?.[selected.level2]?.[selected.level3];

    const handleSelectBrand = () => {
        if (selected.level1 && selected.level2 && selected.level3) {
            onListingDataChange({
                categoryId: categoryData[selected.level1]?.id,
                subCategoryOneId: categoryData[selected.level1]?.childrenIds?.[selected.level2],
                subCategoryTwoId: selectedLevel3Data?.id,
            });
            setCurrentStep(prev => prev + 1);
        } else {
            showToast('error', 'Please select all levels.');
        }
    };

    return (
        <>
            <Row className='mb-4'>
                <Col md="12" className='mb-2'>
                    <h5>Select The Vertical For Your Product</h5>
                    <small>Editing existing listing: {selected.level1} {'>'} {selected.level2} {'>'} {selected.level3}</small>
                </Col>
                <Col md="4"><SearchComponent placeholder="Search Verticals..." /></Col>
            </Row>

            <div className="vertical-tab-wrapper">
                {renderLevel(categoryData, 'level1', 'level2')}
                {renderLevel(categoryData[selected.level1]?.children, 'level2', 'level3')}
                {renderLevel(categoryData[selected.level1]?.children?.[selected.level2], 'level3', null)}

                <div className="vertical-tab-details">
                    <Row>
                        <Col md="12">
                            <div className="vertical-tab-info">
                                <p className="vertical-tab-info-title">VERTICAL: <strong>{selected.level3 || 'None'}</strong></p>
                                <p className="vertical-tab-info-desc">{selectedLevel3Data?.description}</p>
                            </div>
                        </Col>
                        {selected.level3 && (
                            <>
                                <Col md="6" className="text-center">
                                    {selectedLevel3Data?.image && (
                                        <img src={`${IMAGE_URL}/${selectedLevel3Data.image}`} alt="" style={{ maxWidth: '100px' }} />
                                    )}
                                </Col>
                                <Col md="6" className='text-center'>
                                    <Button color="primary" onClick={handleSelectBrand}>Confirm & Proceed</Button>
                                </Col>
                            </>
                        )}
                    </Row>
                </div>
            </div>
        </>
    );
};

export default SelectVerticalTabs;