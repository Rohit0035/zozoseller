
import React, { useState } from "react";
import {
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    Input,
    InputGroup,
    InputGroupText,
} from "reactstrap";

import Select from "react-select";
import PerfectScrollbar from "react-perfect-scrollbar";

import {
    FiSliders,
    FiSearch,
    FiChevronDown,
    FiChevronRight,
    FiChevronLeft,
    FiMoreVertical,
} from "react-icons/fi";

import "react-perfect-scrollbar/dist/css/styles.css";

const ZozolistFilter = ({ onApply }) => {
    const [openFilter, setOpenFilter] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandedSubCategories, setExpandedSubCategories] = useState({});
    const [categorySearch, setCategorySearch] = useState("");

    const [selectedFilters, setSelectedFilters] = useState({
        category: [],
        brand: [],
    });

    const [minSettlement, setMinSettlement] = useState(0);
    const [maxSettlement, setMaxSettlement] = useState(1499);

    const [activeMoreFilter, setActiveMoreFilter] = useState("");
    const [search, setSearch] = useState("");
    const [moreValues, setMoreValues] = useState({});

    // THREE LEVEL CATEGORY DATA
    const categoryOptions = [
        {
            label: "Leather & Travel Products",
            value: "leather-travel",
            children: [
                {
                    label: "Bags & Fashion Accessories",
                    value: "bags-accessories",
                    children: [
                        { label: "Backpack", value: "backpack" },
                        { label: "Laptop Bags", value: "laptop-bags" },
                        { label: "Travel Bags", value: "travel-bags" },
                        { label: "Handbags", value: "handbags" },
                        { label: "Wallets", value: "wallets" },
                    ],
                },
                {
                    label: "Luggage & Travel",
                    value: "luggage-travel",
                    children: [
                        { label: "Suitcases", value: "suitcases" },
                        { label: "Trolley Bags", value: "trolley-bags" },
                        { label: "Duffel Bags", value: "duffel-bags" },
                    ],
                },
                {
                    label: "Leather Products",
                    value: "leather-products",
                    children: [
                        { label: "Leather Belts", value: "leather-belts" },
                        { label: "Leather Wallets", value: "leather-wallets" },
                    ],
                },
            ],
        },
        {
            label: "Fashion",
            value: "fashion",
            children: [
                {
                    label: "Men Clothing",
                    value: "men-clothing",
                    children: [
                        { label: "Shirts", value: "shirts" },
                        { label: "T-Shirts", value: "t-shirts" },
                        { label: "Jeans", value: "jeans" },
                    ],
                },
                {
                    label: "Women Clothing",
                    value: "women-clothing",
                    children: [
                        { label: "Kurtis", value: "kurtis" },
                        { label: "Dresses", value: "dresses" },
                        { label: "Tops", value: "tops" },
                    ],
                },
                {
                    label: "Footwear",
                    value: "footwear",
                    children: [
                        { label: "Men Shoes", value: "men-shoes" },
                        { label: "Women Shoes", value: "women-shoes" },
                        { label: "Sandals", value: "sandals" },
                    ],
                },
            ],
        },
        {
            label: "Electronics",
            value: "electronics",
            children: [
                {
                    label: "Mobile Accessories",
                    value: "mobile-accessories",
                    children: [
                        { label: "Mobile Covers", value: "mobile-covers" },
                        { label: "Chargers", value: "chargers" },
                        { label: "Earphones", value: "earphones" },
                    ],
                },
                {
                    label: "Computer Accessories",
                    value: "computer-accessories",
                    children: [
                        { label: "Keyboard", value: "keyboard" },
                        { label: "Mouse", value: "mouse" },
                    ],
                },
            ],
        },
    ];

    const brandOptions = [
        { label: "ZIPRAVEL", value: "zipravel" },
        { label: "ZIPRAVEL MART", value: "zipravel-mart" },
        { label: "ZRG", value: "zrg" },
    ];

    const moreFilterOptions = {
        "Listing Price": [
            { label: "Below ₹200", value: "below-200" },
            { label: "₹200 - ₹500", value: "200-500" },
            { label: "₹500 - ₹1000", value: "500-1000" },
            { label: "Above ₹1000", value: "above-1000" },
        ],
        Assured: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
        ],
        "Shopsy Budget": [
            { label: "Budget 1", value: "budget-1" },
            { label: "Budget 2", value: "budget-2" },
            { label: "Budget 3", value: "budget-3" },
        ],
        Fulfillment: [
            { label: "Seller Fulfilled", value: "seller" },
            { label: "Flipkart Fulfilled", value: "flipkart" },
        ],
        Stock: [
            { label: "In Stock", value: "in-stock" },
            { label: "Out of Stock", value: "out-stock" },
        ],
        "Size Chart": [
            { label: "Available", value: "available" },
            { label: "Not Available", value: "not-available" },
        ],
        "Procurement Type": [
            { label: "Regular", value: "regular" },
            { label: "Express", value: "express" },
        ],
        "Procurement SLA": [
            { label: "0-5 Days", value: "0-5" },
            { label: "5-10 Days", value: "5-10" },
            { label: "10-15 Days", value: "10-15" },
        ],
        "Listing Quality": [
            { label: "Good", value: "good" },
            { label: "Average", value: "average" },
            { label: "Poor", value: "poor" },
        ],
    };

    const toggleFilter = (name) => {
        setOpenFilter(prev => prev === name ? "" : name);
        setActiveMoreFilter("");
        setSearch("");
    };

    // CATEGORY SELECTION HELPERS
    const getDescendantValues = (item) => {
        let values = [item.value];

        (item.children || []).forEach(child => {
            values = [...values, ...getDescendantValues(child)];
        });

        return values;
    };

    const toggleCategoryItem = (item, checked) => {
        const values = getDescendantValues(item);

        setSelectedFilters(prev => {
            const existing = prev.category.filter(
                selected => !values.includes(selected.value)
            );

            const added = checked
                ? getCategoryObjects(values)
                : [];

            return {
                ...prev,
                category: [...existing, ...added],
            };
        });
    };

    const getCategoryObjects = (values) => {
        const allItems = [];

        const traverse = (items, parent = null) => {
            items.forEach(item => {
                allItems.push({
                    ...item,
                    parent: parent?.label || null,
                });

                if (item.children) {
                    traverse(item.children, item);
                }
            });
        };

        traverse(categoryOptions);

        return allItems.filter(item => values.includes(item.value));
    };

    const isCategoryChecked = (item) => {
        const values = getDescendantValues(item);

        return values.every(value =>
            selectedFilters.category.some(selected => selected.value === value)
        );
    };

    const toggleExpand = (value, type) => {
        if (type === "category") {
            setExpandedCategories(prev => ({
                ...prev,
                [value]: !prev[value],
            }));
        } else {
            setExpandedSubCategories(prev => ({
                ...prev,
                [value]: !prev[value],
            }));
        }
    };

    const handleSelect = (name, values) => {
        setSelectedFilters(prev => ({
            ...prev,
            [name]: values || [],
        }));
    };

    const handleMoreSelect = (name, value) => {
        setMoreValues(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        const filters = {
            ...selectedFilters,
            bankSettlement: {
                minimum: minSettlement,
                maximum: maxSettlement,
            },
            ...moreValues,
        };

        onApply?.(filters);
        setOpenFilter("");
    };

    const selectedCount =
        selectedFilters.category.length +
        selectedFilters.brand.length +
        Object.values(moreValues).filter(Boolean).length;

    const selectStyles = {
        control: base => ({
            ...base,
            minHeight: 34,
            fontSize: 12,
            borderRadius: 6,
            boxShadow: "none",
        }),
        menu: base => ({
            ...base,
            fontSize: 12,
            zIndex: 9999,
        }),
        option: base => ({
            ...base,
            fontSize: 12,
            padding: "7px 10px",
        }),
    };

    // SEARCH CATEGORY TREE
    const filterCategoryTree = (items) => {
        if (!categorySearch.trim()) return items;

        return items.reduce((result, item) => {
            const matchedChildren = filterCategoryTree(item.children || []);
            const matches = item.label.toLowerCase().includes(
                categorySearch.toLowerCase()
            );

            if (matches || matchedChildren.length) {
                result.push({
                    ...item,
                    children: matches
                        ? item.children
                        : matchedChildren,
                });
            }

            return result;
        }, []);
    };

    // CATEGORY TREE UI
    const renderCategoryTree = (items, level = 0) => {
        return items.map(item => {
            const hasChildren = item.children?.length > 0;
            const expanded =
                level === 0
                    ? expandedCategories[item.value]
                    : expandedSubCategories[item.value];

            return (
                <div key={item.value}>
                    <div
                        className="d-flex align-items-center py-2 border-bottom"
                        style={{ paddingLeft: level * 18 }}
                    >
                        {hasChildren ? (
                            <Button
                                color="link"
                                size="sm"
                                className="p-0 me-2 text-secondary"
                                onClick={() =>
                                    toggleExpand(
                                        item.value,
                                        level === 0 ? "category" : "subcategory"
                                    )
                                }
                            >
                                {expanded
                                    ? <FiChevronDown size={14} />
                                    : <FiChevronRight size={14} />
                                }
                            </Button>
                        ) : (
                            <span className="me-4" />
                        )}

                        <Input
                            type="checkbox"
                            className="mt-0 me-2 flex-shrink-0"
                            checked={isCategoryChecked(item)}
                            onChange={e =>
                                toggleCategoryItem(item, e.target.checked)
                            }
                        />

                        <span className={`small ${level === 0 ? "fw-semibold" : ""}`}>
                            {item.label}
                        </span>

                        {hasChildren && (
                            <span className="text-muted ms-auto small">
                                {item.children.length}
                            </span>
                        )}
                    </div>

                    {hasChildren && expanded && (
                        <div>
                            {renderCategoryTree(item.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderSelectDropdown = (name, options) => (
        <Dropdown
            isOpen={openFilter === name}
            toggle={() => toggleFilter(name)}
            className="position-relative"
        >
            <DropdownToggle
                caret
                color="white"
                className="border rounded-0 text-dark px-3 py-2 small"
            >
                {name === "category" ? "Category" : "Brand"}
                <FiChevronDown className="ms-2" size={13} />
            </DropdownToggle>

            <DropdownMenu
                className="p-3 shadow border"
                style={{ width: 310, maxWidth: "90vw" }}
            >
                {name === "category" ? (
                    <>
                        <InputGroup size="sm" className="mb-3">
                            <Input
                                placeholder="Search Category..."
                                value={categorySearch}
                                onChange={e => setCategorySearch(e.target.value)}
                            />
                            <InputGroupText>
                                <FiSearch />
                            </InputGroupText>
                        </InputGroup>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small fw-semibold">
                                Category List
                            </span>

                            <Button
                                color="link"
                                size="sm"
                                className="p-0 text-decoration-none"
                                onClick={() => {
                                    const all = getCategoryObjects(
                                        categoryOptions.flatMap(getDescendantValues)
                                    );

                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        category: all,
                                    }));
                                }}
                            >
                                Select All
                            </Button>
                        </div>

                        <PerfectScrollbar
                            options={{ suppressScrollX: true }}
                            style={{ maxHeight: 300 }}
                        >
                            {renderCategoryTree(filterCategoryTree(categoryOptions))}
                        </PerfectScrollbar>

                        <div className="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                            <span className="small text-muted">
                                {selectedFilters.category.length} selected
                            </span>

                            <Button
                                color="link"
                                size="sm"
                                className="p-0 text-danger text-decoration-none"
                                onClick={() => {
                                    handleSelect("category", []);
                                }}
                            >
                                Clear All
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Select
                            isMulti
                            isSearchable
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            options={options}
                            value={selectedFilters[name]}
                            onChange={values => handleSelect(name, values)}
                            styles={selectStyles}
                            placeholder="Search Brand"
                            noOptionsMessage={() => "No Results Found"}
                        />

                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                color="link"
                                size="sm"
                                className="text-dark text-decoration-none p-0"
                                onClick={() => handleSelect(name, options)}
                            >
                                Select All
                            </Button>

                            <Button
                                color="link"
                                size="sm"
                                className="text-danger text-decoration-none p-0"
                                onClick={() => handleSelect(name, [])}
                            >
                                Clear All
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenu>
        </Dropdown>
    );

    return (
        <div className="container-fluid p-0">

            {/* FILTER TOOLBAR */}
            <div className="d-flex align-items-center flex-wrap border rounded bg-white">

                <Button
                    color="white"
                    className="border-end rounded-0 px-3 py-2"
                    onClick={() => toggleFilter("all")}
                >
                    <FiSliders size={18} />
                </Button>

                {renderSelectDropdown("category", categoryOptions)}

                {renderSelectDropdown("brand", brandOptions)}

                {/* BANK SETTLEMENT */}
                <Dropdown
                    isOpen={openFilter === "settlement"}
                    toggle={() => toggleFilter("settlement")}
                >
                    <DropdownToggle
                        color="white"
                        className="border-start border-end rounded-0 text-dark px-3 py-2 small"
                    >
                        Bank Settlement <FiChevronDown size={13} />
                    </DropdownToggle>

                    <DropdownMenu
                        className="p-3 shadow border"
                        style={{ width: 410, maxWidth: "95vw" }}
                    >
                        <div className="d-flex justify-content-between small mb-2">
                            <span>Minimum</span>
                            <span>Maximum</span>
                        </div>

                        <div className="d-flex gap-2">
                            <Input
                                type="number"
                                bsSize="sm"
                                value={minSettlement}
                                onChange={e => setMinSettlement(Number(e.target.value))}
                            />
                            <Input
                                type="number"
                                bsSize="sm"
                                value={maxSettlement}
                                onChange={e => setMaxSettlement(Number(e.target.value))}
                            />
                        </div>

                        <div className="d-flex gap-2 mt-3">
                            <Input
                                type="range"
                                min="0"
                                max="1499"
                                value={minSettlement}
                                onChange={e =>
                                    setMinSettlement(
                                        Math.min(Number(e.target.value), maxSettlement)
                                    )
                                }
                            />
                            <Input
                                type="range"
                                min="0"
                                max="1499"
                                value={maxSettlement}
                                onChange={e =>
                                    setMaxSettlement(
                                        Math.max(Number(e.target.value), minSettlement)
                                    )
                                }
                            />
                        </div>
                    </DropdownMenu>
                </Dropdown>

                {/* MORE FILTERS */}
                <Dropdown
                    isOpen={openFilter === "more"}
                    toggle={() => toggleFilter("more")}
                >
                    <DropdownToggle
                        color="white"
                        className="border-start border-end rounded-0 text-dark px-3 py-2 small"
                    >
                        More Filters <FiMoreVertical size={15} />
                    </DropdownToggle>

                    <DropdownMenu className="shadow border p-0" style={{ width: 180 }}>
                        {Object.keys(moreFilterOptions).map(filter => (
                            <div
                                key={filter}
                                className="position-relative"
                                onMouseEnter={() => setActiveMoreFilter(filter)}
                            >
                                <Button
                                    color="white"
                                    className="w-100 d-flex justify-content-between align-items-center text-dark border-0 rounded-0 px-3 py-2 small"
                                    onClick={() =>
                                        setActiveMoreFilter(
                                            activeMoreFilter === filter ? "" : filter
                                        )
                                    }
                                >
                                    {filter}
                                    <FiChevronRight size={14} />
                                </Button>

                                {activeMoreFilter === filter && (
                                    <div
                                        className="position-absolute bg-white border shadow rounded p-2"
                                        style={{
                                            left: "100%",
                                            top: 0,
                                            width: 230,
                                            zIndex: 1000,
                                        }}
                                    >
                                        <InputGroup size="sm" className="mb-2">
                                            <Input
                                                placeholder="Search"
                                                value={search}
                                                onChange={e => setSearch(e.target.value)}
                                            />
                                            <InputGroupText>
                                                <FiSearch />
                                            </InputGroupText>
                                        </InputGroup>

                                        <PerfectScrollbar
                                            options={{ suppressScrollX: true }}
                                            style={{ maxHeight: 200 }}
                                        >
                                            {moreFilterOptions[filter]
                                                .filter(item =>
                                                    item.label.toLowerCase().includes(
                                                        search.toLowerCase()
                                                    )
                                                )
                                                .map(item => (
                                                    <div className="form-check py-1" key={item.value}>
                                                        <Input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={moreValues[filter] === item.value}
                                                            onChange={e =>
                                                                handleMoreSelect(
                                                                    filter,
                                                                    e.target.checked ? item.value : ""
                                                                )
                                                            }
                                                        />
                                                        <label className="form-check-label small">
                                                            {item.label}
                                                        </label>
                                                    </div>
                                                ))}
                                        </PerfectScrollbar>
                                    </div>
                                )}
                            </div>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                {/* APPLY */}
                <Button
                    color="white"
                    className="text-st small rounded-0 px-3 py-2"
                    onClick={applyFilters}
                >
                    Apply {selectedCount > 0 && `(${selectedCount})`}
                </Button>
            </div>
        </div>
    );
};

export default ZozolistFilter;
