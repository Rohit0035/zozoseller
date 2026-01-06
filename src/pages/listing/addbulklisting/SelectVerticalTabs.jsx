import React, { useState, useEffect } from 'react';
import '../../../assets/styles/selectVertical.css';
import { Button, Col, Row } from 'reactstrap';
import SearchComponent from '../../../components/SearchComponent';
import CategoryImg from '../../../assets/images/common/cate-common.png';
import { GetCategories } from '../../../api/categoryAPI';
import { GetSubCategoriesOne } from '../../../api/subCategoryOneAPI';
import { GetSubCategoriesTwo } from '../../../api/subCategoryTwoAPI';
import { showToast } from '../../../components/ToastifyNotification';
import { IMAGE_URL } from '../../../utils/api-config';

const SelectVerticalTabs = ({ currentStep, setCurrentStep, listingData, onListingDataChange }) => { // Added listingData, onListingDataChange
    const [categoryData, setCategoryData] = useState({});
    const [selected, setSelected] = useState({
        level1: listingData.categoryId ? 'init' : null, // Initialize based on existing data
        level2: listingData.subCategoryOneId ? 'init' : null,
        level3: listingData.subCategoryTwoId ? 'init' : null,
    });

    // Helper to find key by ID if existing data is present
    const findKeyById = (obj, idToFind, isLevel1 = false) => {
        if (!obj || !idToFind) return null;
        for (const key in obj) {
            if (isLevel1) {
                if (obj[key]?.id === idToFind) return key;
            } else if (obj[key]?.id === idToFind) { // For level3 items
                return key;
            } else if (obj[key]?.childrenIds?.[key] === idToFind) { // For level2 items (from childrenIds)
                return key;
            }
        }
        return null;
    };


    useEffect(() => {
        fetchCategories();
    }, []);

    // Effect to set initial selections if data already exists in listingData
    useEffect(() => {
        if (Object.keys(categoryData).length > 0 && listingData.categoryId && listingData.subCategoryOneId && listingData.subCategoryTwoId) {
            const initialLevel1Key = findKeyById(categoryData, listingData.categoryId, true);
            if (initialLevel1Key) {
                setSelected(prev => ({ ...prev, level1: initialLevel1Key }));
            }
            // Further logic to pre-select level2 and level3 might be complex due to async fetching
            // It might require fetching all levels initially if you want perfect pre-selection on mount.
            // For now, it will default to the first option if not explicitly set by user interaction.
        }
    }, [categoryData, listingData.categoryId, listingData.subCategoryOneId, listingData.subCategoryTwoId]);


    useEffect(() => {
        const level1Cat = categoryData[selected.level1];
        if (selected.level1 && level1Cat?.id && !level1Cat.children) {
            fetchSubCategoryOne({categoryId: level1Cat.id});
        }
    }, [selected.level1, categoryData]);

    useEffect(() => {
        const level2Key = selected.level2;
        const level1Cat = categoryData[selected.level1];
        if (
            selected.level1 &&
            level2Key &&
            level1Cat?.children &&
            level1Cat.children[level2Key] === null
        ) {
            const subCategoryOneId = level1Cat.childrenIds?.[level2Key];
            if (subCategoryOneId) {
                fetchSubCategoryTwo({subCategoryOneId: subCategoryOneId});
            }
        }
    }, [selected.level2, selected.level1, categoryData]);

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

                // Default selection if no existing data
                if (!listingData.categoryId) {
                    const defaultKey = Object.keys(formatted)[0];
                    setSelected((prev) => ({ ...prev, level1: defaultKey }));
                }
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', 'Failed to fetch categories');
        }
    };

    const fetchSubCategoryOne = async (categoryId) => {
        try {
            const response = await GetSubCategoriesOne(categoryId);
            if (response.success) {
                const updated = { ...categoryData };
                const children = {};
                if (updated[selected.level1]) {
                    updated[selected.level1].childrenIds = {};
                    response.data.forEach((item) => {
                        children[item.name] = null;
                        updated[selected.level1].childrenIds[item.name] = item._id;
                    });
                    updated[selected.level1].children = children;
                }
                setCategoryData(updated);
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', 'Failed to fetch subcategories');
        }
    };

    const fetchSubCategoryTwo = async (subCatOneId) => {
        try {
            const response = await GetSubCategoriesTwo(subCatOneId);
            if (response.success) {
                const updated = { ...categoryData };
                const level1CatUpdated = updated[selected.level1];
                if (level1CatUpdated?.children) {
                    const children = {};
                    response.data.forEach((item) => {
                        children[item.name] = {
                            description: item.description,
                            allowed: item.allowed,
                            image: item.image,
                            id: item._id,
                        };
                    });
                    level1CatUpdated.children[selected.level2] = children;
                    setCategoryData(updated);
                }
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            showToast('error', 'Failed to fetch sub-subcategories');
        }
    };

    const renderLevel = (items, levelKey, nextLevelKey) => {
        if (!items) return null;
        const keys = Object.keys(items);
        return (
            <div className="vertical-tab-column">
                {keys.map((key) => {
                    const isLevel1 = levelKey === "level1";
                    const imageUrl = isLevel1 ? items[key]?.image : null;
                    const isActive = selected[levelKey] === key ||
                                     (levelKey === 'level1' && listingData.categoryId === items[key]?.id) ||
                                     (levelKey === 'level2' && listingData.subCategoryOneId === items[selected.level1]?.childrenIds?.[key]) ||
                                     (levelKey === 'level3' && listingData.subCategoryTwoId === items[key]?.id);


                    return (
                        <div
                            key={key}
                            className={`vertical-tab-item ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                setSelected((prev) => {
                                    const updated = { ...prev };
                                    updated[levelKey] = key;
                                    if (nextLevelKey) updated[nextLevelKey] = null;
                                    if (nextLevelKey === 'level2') updated.level3 = null;
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

    const selectedLevel3Data = categoryData[selected.level1]?.children?.[selected.level2]?.[selected.level3];

    const handleSelectBrand = () => {
        if (selected.level1 && selected.level2 && selected.level3) {
            const categoryIdsUpdate = {
                categoryId: categoryData[selected.level1]?.id,
                subCategoryOneId: categoryData[selected.level1]?.childrenIds?.[selected.level2],
                subCategoryTwoId: selectedLevel3Data?.id,
            };
            // Call the universal handler to update multiple fields in listingData
            onListingDataChange(categoryIdsUpdate);
            setCurrentStep(prev => prev + 1);
        } else {
            showToast('error', 'Please select all categories (Level 1, Level 2, and Level 3) before proceeding.');
        }
    };

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
                {renderLevel(categoryData, 'level1', 'level2')}
                {renderLevel(categoryData[selected.level1]?.children, 'level2', 'level3')}
                {renderLevel(categoryData[selected.level1]?.children?.[selected.level2], 'level3', null)}

                <div className="vertical-tab-details">
                    <Row>
                        <Col md="12">
                            <div className="vertical-tab-info">
                                <p className="vertical-tab-info-title">
                                    VERTICAL &nbsp;<strong>{selected.level3}</strong>
                                </p>
                                <p className="vertical-tab-info-desc">{selectedLevel3Data?.description}</p>
                            </div>
                        </Col>

                        {selected.level1 && selected.level2 && selected.level3 &&
                            <>
                                <Col md="6" style={{ borderRight: '1px solid #ccc' }}>
                                    <div className='broder-right'>
                                        {selectedLevel3Data?.image && (
                                            <img
                                                src={`${IMAGE_URL}/${selectedLevel3Data.image}`}
                                                alt={selected.level3}
                                                style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: 'auto' }}
                                            />
                                        )}
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className='text-center'>
                                        <p>Please select a brand to start selling in this vertical.</p>
                                        <Button className='btn btn-primary btn-sm' onClick={handleSelectBrand}>Select Brand</Button>
                                    </div>
                                </Col>
                            </>
                        }
                    </Row>
                </div>
            </div>
        </>
    );
};

export default SelectVerticalTabs;