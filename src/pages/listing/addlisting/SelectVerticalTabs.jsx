
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

const SelectVerticalTabs = ({
    currentStep,
    setCurrentStep,
    listingData,
    onListingDataChange
}) => {

    const [categoryData, setCategoryData] = useState({});

    const [selected, setSelected] = useState({
        level1: null,
        level2: null,
        level3: null,
    });

    // Find category key using ID
    const findKeyById = (obj, idToFind, isLevel1 = false) => {
        if (!obj || !idToFind) return null;

        for (const key in obj) {
            if (obj[key]?.id === idToFind) {
                return key;
            }

            if (!isLevel1 && obj[key]?.childrenIds?.[key] === idToFind) {
                return key;
            }
        }

        return null;
    };

    // Fetch categories initially
    useEffect(() => {
        fetchCategories();
    }, []);

    // STEP 1: Restore Level 1 selection
    useEffect(() => {
        if (!Object.keys(categoryData).length || !listingData.categoryId) return;

        const level1Key = findKeyById(
            categoryData,
            listingData.categoryId,
            true
        );

        if (level1Key && selected.level1 !== level1Key) {
            setSelected(prev => ({
                ...prev,
                level1: level1Key,
                level2: null,
                level3: null
            }));
        }
    }, [categoryData, listingData.categoryId]);

    // STEP 2: Restore Level 2 selection
    useEffect(() => {
        const level1Cat = categoryData[selected.level1];

        if (!level1Cat?.childrenIds || !listingData.subCategoryOneId) return;

        const level2Key = Object.keys(level1Cat.childrenIds).find(
            key => level1Cat.childrenIds[key] === listingData.subCategoryOneId
        );

        if (level2Key && selected.level2 !== level2Key) {
            setSelected(prev => ({
                ...prev,
                level2: level2Key,
                level3: null
            }));
        }
    }, [
        categoryData,
        selected.level1,
        listingData.subCategoryOneId
    ]);

    // STEP 3: Restore Level 3 selection
    useEffect(() => {
        const level3Items = categoryData[selected.level1]
            ?.children?.[selected.level2];

        if (!level3Items || !listingData.subCategoryTwoId) return;

        const level3Key = Object.keys(level3Items).find(
            key => level3Items[key]?.id === listingData.subCategoryTwoId
        );

        if (level3Key && selected.level3 !== level3Key) {
            setSelected(prev => ({
                ...prev,
                level3: level3Key
            }));
        }
    }, [
        categoryData,
        selected.level1,
        selected.level2,
        listingData.subCategoryTwoId
    ]);

    // Fetch Level 2 whenever Level 1 changes
    useEffect(() => {
        const level1Cat = categoryData[selected.level1];

        if (
            selected.level1 &&
            level1Cat?.id &&
            !level1Cat.children
        ) {
            fetchSubCategoryOne(
                level1Cat.id,
                selected.level1
            );
        }
    }, [selected.level1, categoryData]);

    // Fetch Level 3 whenever Level 2 changes
    useEffect(() => {
        const level1Cat = categoryData[selected.level1];

        if (
            selected.level1 &&
            selected.level2 &&
            level1Cat?.children &&
            level1Cat.children[selected.level2] === null
        ) {
            const subCategoryOneId =
                level1Cat.childrenIds?.[selected.level2];

            if (subCategoryOneId) {
                fetchSubCategoryTwo(
                    subCategoryOneId,
                    selected.level1,
                    selected.level2
                );
            }
        }
    }, [
        selected.level1,
        selected.level2,
        categoryData
    ]);

    // Fetch all categories
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

                // Default selection only for a new listing
                if (!listingData.categoryId) {
                    const defaultKey = Object.keys(formatted)[0];

                    if (defaultKey) {
                        setSelected(prev => ({
                            ...prev,
                            level1: defaultKey
                        }));
                    }
                }
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to fetch categories');
        }
    };

    // Fetch Level 2 subcategories
    const fetchSubCategoryOne = async (categoryId, level1Key) => {
        try {
            const response = await GetSubCategoriesOne({
                categoryId
            });

            if (response.success) {
                setCategoryData(prev => {
                    const updated = { ...prev };
                    const currentCategory = updated[level1Key];

                    if (currentCategory) {
                        const children = {};
                        const childrenIds = {};

                        response.data.forEach((item) => {
                            children[item.name] = null;
                            childrenIds[item.name] = item._id;
                        });

                        updated[level1Key] = {
                            ...currentCategory,
                            children,
                            childrenIds
                        };
                    }

                    return updated;
                });
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to fetch subcategories');
        }
    };

    // Fetch Level 3 subcategories
    const fetchSubCategoryTwo = async (
        subCatOneId,
        level1Key,
        level2Key
    ) => {
        try {
            const response = await GetSubCategoriesTwo({
                subCategoryOneId: subCatOneId
            });

            if (response.success) {
                setCategoryData(prev => {
                    const updated = { ...prev };

                    const level1Cat = updated[level1Key];

                    if (level1Cat?.children) {
                        const children = {};

                        response.data.forEach((item) => {
                            children[item.name] = {
                                description: item.description,
                                allowed: item.allowed,
                                image: item.image,
                                id: item._id,
                            };
                        });

                        updated[level1Key] = {
                            ...level1Cat,
                            children: {
                                ...level1Cat.children,
                                [level2Key]: children
                            }
                        };
                    }

                    return updated;
                });
            } else {
                showToast('error', response.message);
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to fetch sub-subcategories');
        }
    };

    // Render category levels
    const renderLevel = (items, levelKey, nextLevelKey) => {
        if (!items) return null;

        const keys = Object.keys(items);

        return (
            <div className="vertical-tab-column">
                {keys.map((key) => {
                    const isLevel1 = levelKey === 'level1';
                    const imageUrl = isLevel1 ? items[key]?.image : null;

                    const isActive = selected[levelKey] === key;

                    return (
                        <div
                            key={key}
                            className={`vertical-tab-item ${isActive ? 'active' : ''}`}
                            onClick={() => {
                                setSelected(prev => {
                                    const updated = { ...prev };

                                    updated[levelKey] = key;

                                    if (nextLevelKey) {
                                        updated[nextLevelKey] = null;
                                    }

                                    if (nextLevelKey === 'level2') {
                                        updated.level3 = null;
                                    }

                                    return updated;
                                });

                                // Clear dependent IDs when parent selection changes
                                if (levelKey === 'level1') {
                                    onListingDataChange({
                                        categoryId: items[key]?.id,
                                        subCategoryOneId: null,
                                        subCategoryTwoId: null
                                    });
                                } else if (levelKey === 'level2') {
                                    onListingDataChange({
                                        subCategoryOneId:
                                            categoryData[selected.level1]?.childrenIds?.[key],
                                        subCategoryTwoId: null
                                    });
                                } else if (levelKey === 'level3') {
                                    onListingDataChange({
                                        subCategoryTwoId: items[key]?.id
                                    });
                                }
                            }}
                        >
                            <div className="d-flex">
                                <div className="imgbox">
                                    {isLevel1 && imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt={key}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                marginRight: 8
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="imgbox">
                                    {key}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const selectedLevel3Data =
        categoryData[selected.level1]
            ?.children?.[selected.level2]
            ?.[selected.level3];

    // Continue to Brand selection
    const handleSelectBrand = () => {
        if (selected.level1 && selected.level2 && selected.level3) {
            const categoryIdsUpdate = {
                categoryId: categoryData[selected.level1]?.id,
                subCategoryOneId:
                    categoryData[selected.level1]?.childrenIds?.[selected.level2],
                subCategoryTwoId: selectedLevel3Data?.id,
            };

            onListingDataChange(categoryIdsUpdate);

            setCurrentStep(prev => prev + 1);
        } else {
            showToast(
                'error',
                'Please select all categories (Level 1, Level 2, and Level 3) before proceeding.'
            );
        }
    };

    return (
        <>
            <Row className="mb-4">
                <Col md="12" className="mb-2">
                    <h5>Select The Vertical For Your Product</h5>
                    <small>You can use the Search or Browse options</small>
                </Col>

                <Col md="4">
                    <SearchComponent placeholder="Search Verticals..." />
                </Col>
            </Row>

            <div className="vertical-tab-wrapper">

                {renderLevel(categoryData, 'level1', 'level2')}

                {renderLevel(
                    categoryData[selected.level1]?.children,
                    'level2',
                    'level3'
                )}

                {renderLevel(
                    categoryData[selected.level1]
                        ?.children?.[selected.level2],
                    'level3',
                    null
                )}

                <div className="vertical-tab-details">
                    <Row>
                        <Col md="12">
                            <div className="vertical-tab-info">
                                <p className="vertical-tab-info-title">
                                    VERTICAL &nbsp;
                                    <strong>{selected.level3}</strong>
                                </p>

                                <p className="vertical-tab-info-desc">
                                    {selectedLevel3Data?.description}
                                </p>
                            </div>
                        </Col>

                        {selected.level1 &&
                            selected.level2 &&
                            selected.level3 && (
                                <>
                                    <Col md="6" style={{ borderRight: '1px solid #ccc' }}>
                                        <div className="broder-right">
                                            {selectedLevel3Data?.image && (
                                                <img
                                                    src={`${IMAGE_URL}/${selectedLevel3Data.image}`}
                                                    alt={selected.level3}
                                                    style={{
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                        display: 'block',
                                                        margin: 'auto'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Col>

                                    <Col md="6">
                                        <div className="text-center">
                                            <p>
                                                Please select a brand to start selling in this vertical.
                                            </p>

                                            <Button
                                                className="btn btn-primary btn-sm"
                                                onClick={handleSelectBrand}
                                            >
                                                Select Brand
                                            </Button>
                                        </div>
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
