import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Card,
  CardBody,
  Row,
  Col,
  Label,
  Input,
  Form,
  InputGroup,
  Button,
  Table // Added for variations table
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa"; // Added FaTrash
import { showToast } from "../../../components/ToastifyNotification"; // Assuming you have this
import { GetSpecificationFieldsBySubsCategoryTwoId } from "../../../api/specificationFieldsAPI";
import { GetAttributes } from "../../../api/attributeAPI";
import Select from 'react-select';
import { StoreProduct } from "../../../api/productAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Assuming you have an API to fetch attributes, e.g.:
// import { GetAttributesBySubCategoryTwoId } from "../../../api/attributesAPI";

const ProductDetails = ({ listingData, onListingDataChange }) => {
  const [open, setOpen] = useState("");
  const [localSpecifications, setLocalSpecifications] = useState([]);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // New states for Product Variants
  const [availableAttributes, setAvailableAttributes] = useState([]); // All attributes from API
  
  const [generatedVariations, setGeneratedVariations] = useState([]); // The actual product variations with their details
  // New state variables for variations
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [selectedAttributeOptions, setSelectedAttributeOptions] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [attributeValueMap, setAttributeValueMap] = useState({});
  const [variations, setVariations] = useState([]);
  const [typeOptions, setTypeOptions] = useState([
    { value: 'simple', label: 'Simple' },
    { value: 'variable', label: 'Variable' },
  ]);
  const [selectedTypeOption, setSelectedTypeOption] = useState(
    listingData.type ? typeOptions.find(opt => opt.value === listingData.type) : { value: 'simple', label: 'Simple' }
  );

  // Fetch specifications when subCategoryTwoId changes
  useEffect(() => {
    if (listingData?.subCategoryTwoId) {
      fetchSpecifications({ "subCategoryTwoId": listingData.subCategoryTwoId });
    }
  }, [listingData?.subCategoryTwoId]);

  // Update localSpecifications when listingData.specifications changes
  useEffect(() => {
    if (listingData.specifications && listingData.specifications.length > 0) {
      const initialSpecs = listingData.specifications.map(headingSection => ({
        ...headingSection,
        fields: headingSection.fields.map(field => {
          const existingValue = listingData.specifications
            .find(s => s._id === headingSection._id)
            ?.fields.find(f => f._id === field._id)?.value || '';
          return {
            ...field,
            value: existingValue
          };
        })
      }));
      setLocalSpecifications(initialSpecs);
    } else {
      setLocalSpecifications([]);
    }
  }, [listingData.specifications]);

  // Update generatedVariations when listingData.variations changes
  useEffect(() => {
    if (listingData.variations && listingData.variations.length > 0) {
        setGeneratedVariations(listingData.variations);
    } else {
        setGeneratedVariations([]);
    }
    // Also, reconstruct selectedAttributes and attributeValueMap from listingData.variations if needed
    // This part can be complex if variations are not structured to easily map back to selectedAttributes and attributeValueMap.
    // For simplicity, we'll assume attributes are re-selected by the user or managed at a higher level during edit.
  }, [listingData.variations]);


  const fetchSpecifications = async (data) => {
    try {
      const response = await GetSpecificationFieldsBySubsCategoryTwoId(data);
      if (response.success === true) {
        const initialSpecs = response?.data?.specs?.map(headingSection => ({
          ...headingSection,
          fields: headingSection.fields.map(field => {
            const existingValue = listingData.specifications
              ?.find(s => s._id === headingSection._id)
              ?.fields.find(f => f._id === field._id)?.value || '';
            return {
              ...field,
              value: existingValue
            };
          })
        })) || [];
        setLocalSpecifications(initialSpecs);
        onListingDataChange(prevListingData => ({
            ...prevListingData,
            specifications: initialSpecs
        }));
      } else {
        showToast('error', response.message);
      }
    } catch (error) {
      showToast('error', 'Failed to fetch specifications categories');
    }
  };

  useEffect(() => {
    if (listingData?.subCategoryTwoId) {
      fetchSpecifications({ "subCategoryTwoId": listingData.subCategoryTwoId });
    }
    // Fetch attributes when subCategoryOneId changes
    if (listingData?.subCategoryOneId && listingData?.categoryId) { // Assuming attributes depend on category and subCategoryOne
      fetchAttributes({ categoryId: listingData.categoryId, subCategoryOneId: listingData.subCategoryOneId });
    }
  }, [listingData?.subCategoryTwoId, listingData?.subCategoryOneId, listingData?.categoryId]);

  // Effect to sync selected attributes with full attribute data
  useEffect(() => {
    const selectedIds = selectedAttributeOptions.map(option => option.value);
    const selectedFullAttrs = attributeOptions.filter(attr => selectedIds.includes(attr.value));
    console.log(attributeOptions)
    setSelectedAttributes(selectedFullAttrs);

    const updatedMap = {};
    selectedFullAttrs.forEach(attr => {
      // Preserve existing values if they exist in listingData.variations or previously selected
      const existingValues = attributeValueMap[attr._id] || [];
      updatedMap[attr._id] = existingValues;
    });
    setAttributeValueMap(updatedMap);
  }, [selectedAttributeOptions, attributeOptions]);

  // Update selectedTypeOption when listingData.type changes
  useEffect(() => {
    if (listingData.type) {
      setSelectedTypeOption(typeOptions.find(opt => opt.value === listingData.type) || { value: 'simple', label: 'Simple' });
    }
  }, [listingData.type, typeOptions]);


  const fetchAttributes = async (data) => {
    try {
      const response = await GetAttributes(data);
      if (response.success === true) {
        setAttributeOptions(response.data.map(attr => ({ value: attr._id, label: attr.name, values: attr.values })));
      } else {
        showToast('error', response.message);
      }
    } catch (error) {
      showToast('error', 'Failed to fetch attributes');
    }
  };

  const handleTypeChange = (selectedOption) => {
    setSelectedTypeOption(selectedOption);
    onListingDataChange({ type: selectedOption.value }); // Update parent state
  };

  const handleAttributeChange = (selectedOptions) => {
    console.log(selectedOptions)
    setSelectedAttributeOptions(selectedOptions);
    // When attributes change, clear variations and attributeValueMap
    setVariations([]);
    setAttributeValueMap({});
  };

  const handleAttributeValueChange = (attributeId, selectedValues) => {
    setAttributeValueMap(prev => {
      const newMap = {
        ...prev,
        [attributeId]: selectedValues?.map(v => v.value) || []
      };
      // When attribute values change, clear variations
      setVariations([]);
      return newMap;
    });
  };

  const generateVariations = () => {
    const attrOptions = selectedAttributes.map(attr => {
      return {
        id: attr.value,
        name: attr.name,
        values: attributeValueMap[attr.value] || []
      };
    });

    if (attrOptions.some(opt => opt.values.length === 0 && selectedAttributes.length > 0)) {
      showToast('error', 'Please select values for all selected attributes.');
      return;
    }

    const cartesianInput = attrOptions.map(attr =>
      attr.values.map(val => ({ id: attr.id, name: attr.name, value: val }))
    );

    const cartesian = (arr) =>
      arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);

    const combos = cartesian(cartesianInput);

    const generated = combos.map(combo => {
      return {
        image: null,
        sku: '',
        regularPrice: '',
        salePrice: '',
        stockQty: '',
        minStockQty: '',
        attributes: combo.map(c => ({ id: c.id, value: c.value }))
      };
    });

    setVariations(generated);
    onListingDataChange(prevListingData => ({
      ...prevListingData,
      variations: generated, // Update listingData with generated variations
      attributes: attrOptions.map(attr => ({ id: attr.id, values: attr.values })) // Save selected attributes too
    }));
  };

  // Handler for individual variation field changes
  const handleVariationChange = (index, field, value) => {
    setVariations(prevVariations => {
      const newVariations = [...prevVariations];
      if (field === 'image') {
        newVariations[index][field] = value; // value will be a File object
      } else {
        newVariations[index][field] = value;
      }

      onListingDataChange(prevListingData => ({
        ...prevListingData,
        variations: newVariations
      }));
      return newVariations;
    });
  };

  // Handler for variation image file selection
  const handleVariationImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      handleVariationChange(index, 'image', file);
    }
  };


  const toggle = id => {
    setOpen(open === id ? "" : id);
  };

  // Generic handler for all simple input changes directly updating listingData
  const handleChange = e => {
    const { name, value } = e.target;
    onListingDataChange({ [name]: value });
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error on change
  };

  // Handlers for dynamic 'productDetails' array (for additional descriptions)
  const handleAddAdditionalDescription = () => {
    onListingDataChange(prevListingData => ({
      ...prevListingData,
      productDetails: [...(prevListingData.productDetails || []), { key: "", value: "" }]
    }));
    setErrors(prevErrors => ({ ...prevErrors, productDetails: '' })); // Clear error on add
  };

  const handleRemoveAdditionalDescription = index => {
    onListingDataChange(prevListingData => {
      const newDescriptions = [...(prevListingData.productDetails || [])];
      newDescriptions.splice(index, 1);
      return {
        ...prevListingData,
        productDetails:
          newDescriptions.length > 0 ? newDescriptions : [{ key: "", value: "" }]
      };
    });
    setErrors(prevErrors => ({ ...prevErrors, productDetails: '' })); // Clear error on remove
  };

  const handleAdditionalDescriptionChange = (index, event) => {
    const { name, value } = event.target;
    onListingDataChange(prevListingData => {
      const newDescriptions = [...(prevListingData.productDetails || [])];
      if (newDescriptions[index]) {
        newDescriptions[index] = {
          ...newDescriptions[index],
          [name]: value
        };
      }
      return {
        ...prevListingData,
        productDetails: newDescriptions
      };
    });
    setErrors(prevErrors => ({ ...prevErrors, productDetails: '' })); // Clear error on change
  };

  // Handler for specification field changes
  const handleSpecificationChange = (headingId, fieldId, value) => {
    setLocalSpecifications(prevSpecs => {
      const updatedSpecs = prevSpecs.map(headingSection => {
        if (headingSection._id === headingId) {
          return {
            ...headingSection,
            fields: headingSection.fields.map(field => {
              if (field._id === fieldId) {
                return { ...field, value: value };
              }
              return field;
            })
          };
        }
        return headingSection;
      });
      onListingDataChange(prevListingData => ({
        ...prevListingData,
        specifications: updatedSpecs
      }));
      return updatedSpecs;
    });
    setErrors(prevErrors => ({ ...prevErrors, [`spec-${headingId}-${fieldId}`]: '' })); // Clear error on change
  };


 const handleSaveDetails = async () => {
  let newErrors = {};
  let isValid = true;

  // Validate main mandatory fields from listingData
  const mandatoryFields = [
    "name", "skuId", "status", "regularPrice", "salePrice",
    "minOrderQuantity", "stockQty", "minStockQty", "shippingProvider",
    "packageLength", "packageBreadth", "packageHeight", "packageWeight",
    "hsn", "luxuryCess", "taxCode", "countryOfOrigin",
    "manufacturerDetails", "packerDetails", "importerDetails",
  ];

  for (const field of mandatoryFields) {
    if (
      (typeof listingData[field] === "string" && listingData[field].trim() === "") ||
      (typeof listingData[field] === "number" && (listingData[field] === "" || isNaN(listingData[field]))) ||
      listingData[field] === null || listingData[field] === undefined
    ) {
      newErrors[field] = `Please fill in the mandatory field: ${field}`;
      isValid = false;
    }
  }

  // If there are any general mandatory field errors, set them and return
  if (!isValid) {
    setErrors(newErrors);
    showToast('error', 'Please fill in all mandatory fields.');
    return;
  }

  // Validate productDetails (additional descriptions)
  if (listingData.productDetails?.some(desc => desc.key.trim() === "" || desc.value.trim() === "")) {
    showToast('error', 'Please fill all additional descriptions or remove empty ones.');
    return;
  }

  // Validate specification fields from localSpecifications (which should be synced with listingData.specifications)
  for (const headingSection of localSpecifications) {
    for (const field of headingSection.fields) {
      if (field.valueType === "string" && (field.value === undefined || field.value === null || field.value.trim() === "")) {
        showToast("error", `Please fill in the mandatory specification field: ${field.key}`);
        return;
      }
      // Add more validation based on valueType (e.g., number, boolean, select) if needed
      if (field.valueType === "number" && (field.value === "" || isNaN(Number(field.value)))) {
        showToast("error", `Please enter a valid number for specification field: ${field.key}`);
        return;
      }
    }
  }

  // Validate variations if product type is 'variable'
  if (listingData.type === 'variable') { // Use listingData.type
    if (!listingData.variations || listingData.variations.length === 0) {
      showToast('error', 'Please generate variations.');
      return;
    }
    for (const variation of listingData.variations) { // Use listingData.variations
      if (!variation.sku || variation.sku.trim() === "") {
        showToast('error', `Variation with attributes "${variation.attributes.map(attr => attr.value).join(", ")}" must have an SKU.`);
        return;
      }
      if (variation.regularPrice === "" || isNaN(Number(variation.regularPrice)) || Number(variation.regularPrice) <= 0) {
        showToast('error', `Variation with SKU "${variation.sku}" must have a valid Regular Price greater than 0.`);
        return;
      }
      if (variation.stockQty === "" || isNaN(Number(variation.stockQty)) || Number(variation.stockQty) < 0) {
        showToast('error', `Variation with SKU "${variation.sku}" must have a valid Stock Quantity.`);
        return;
      }
      if (variation.minStockQty === "" || isNaN(Number(variation.minStockQty)) || Number(variation.minStockQty) < 0) {
        showToast('error', `Variation with SKU "${variation.sku}" must have a valid Minimum Stock Quantity.`);
        return;
      }
      if (variation.salePrice !== "" && Number(variation.salePrice) >= Number(variation.regularPrice)) {
        showToast('error', `Variation with SKU "${variation.sku}" Sale Price must be less than Regular Price.`);
        return;
      }
      // Validate variation image if required (optional, uncomment if image is mandatory for each variation)
      // if (!variation.image) {
      //     showToast('error', `Variation with SKU "${variation.sku}" must have an image.`);
      //     return;
      // }
    }
  }

  // Image validations (assuming mainImage and galleryImages are part of listingData or separate states managed externally)
  // You might need to adjust these based on how you manage these image states
  // Assuming `mainImage` and `galleryImages` are props or derived from listingData.
  // If they are separate states, ensure they are updated via onListingDataChange or are accessible here.
  if (!listingData.mainImage) { // Using listingData.mainImage
    showToast('error', 'Main image is required.');
    // dispatch({ type: 'loader', loader: false }); // Assuming dispatch is available
    return;
  }

  if (!Array.isArray(listingData.galleryImages) || listingData.galleryImages.length < 3 || listingData.galleryImages.length > 7) { // Using listingData.galleryImages
    showToast('error', 'You must upload between 3 and 7 gallery images.');
    // dispatch({ type: 'loader', loader: false });
    return;
  }

  try {
    const formData = new FormData();

    // Append all non-file fields from listingData
    Object.keys(listingData).forEach((key) => {
      // Exclude specific keys that will be handled separately (files, arrays that need stringification)
      if (key !== 'mainImage' && key !== 'galleryImages' && key !== 'variations' && key !== 'specifications' && key !== 'productDetails' && key !== 'attributes') {
        formData.append(key, listingData[key]);
      }
    });

    // Append product details
    if (listingData.productDetails) {
      formData.append('productDetails', JSON.stringify(listingData.productDetails));
    } else {
      formData.append('productDetails', JSON.stringify([]));
    }


    // Append specifications
    if (listingData.specifications) {
      formData.append('specifications', JSON.stringify(listingData.specifications));
    } else {
      formData.append('specifications', JSON.stringify([]));
    }

    // Append mainImage
    // `listingData.mainImage` could be a File object (new upload) or a string (existing URL)
    if (listingData.mainImage instanceof File) {
      formData.append('mainImage', listingData.mainImage);
    } else if (typeof listingData.mainImage === 'string' && listingData.mainImage !== "") {
      // If it's a string, it means it's an existing image URL, no need to re-upload.
      // You might want to send a flag to the backend if the image hasn't changed.
      formData.append('mainImage', listingData.mainImage); // Send the existing URL
    }


    // Append galleryImages
    if (listingData.galleryImages && Array.isArray(listingData.galleryImages)) {
      listingData.galleryImages.forEach((img) => {
        if (img instanceof File) {
          formData.append('galleryImages', img); // Append File objects for new uploads
        } else if (typeof img === 'string') {
          formData.append('existingGalleryImages', img); // Send existing image URLs separately
        }
      });
    }

    // Append attributes for variable products (using listingData.attributes which is set by onListingDataChange)
    // The `attributes` field in `listingData` should reflect the selected attributes and their values.
    if (listingData.type === 'variable' && listingData.attributes && listingData.attributes.length > 0) {
      formData.append('attributes', JSON.stringify(listingData.attributes));
    } else {
      formData.append('attributes', JSON.stringify([]));
    }

    // Append variation data
    if (listingData.type === 'variable' && listingData.variations && listingData.variations.length > 0) {
      formData.append('hasVariations', 'true');
      const stringVariations = JSON.stringify(variations);
      formData.append('stringVariations', stringVariations);

      listingData.variations.forEach((variation, index) => {
        formData.append(`variations[${index}][sku]`, variation.sku || '');
        formData.append(`variations[${index}][regularPrice]`, variation.regularPrice || '');
        formData.append(`variations[${index}][salePrice]`, variation.salePrice || '');
        formData.append(`variations[${index}][stockQty]`, variation.stockQty || '');
        formData.append(`variations[${index}][minStockQty]`, variation.minStockQty || '');
        formData.append(`variations[${index}][attributes]`, JSON.stringify(variation.attributes)); // Stringify attributes for each variation

        // Handle variation image: File object for new, string for existing
        if (variation.image instanceof File) {
          formData.append(`variations[${index}][image]`, variation.image);
        } else if (typeof variation.image === 'string' && variation.image !== "") {
          formData.append(`variations[${index}][existingImage]`, variation.image); // Send existing image URL
        }
      });
    } else {
      formData.append('variations', '[]');
      formData.append('hasVariations', 'false');
    }

    // Assuming StoreProduct is your API call
    dispatch({ type: 'loader', loader: true }); // Activate loader before API call
    const response = await StoreProduct(formData);
    if (response.success === true) {
      showToast('success', response.message);

      navigate('/listings');
      //clear listingData
      // onListingDataChange({
      //   ...listingData,
      //   productDetails: [],
      //   specifications: [],
      //   mainImage: '',
      //   galleryImages: [],
      //   attributes: [],
      //   variations: [],
      //   type: 'simple',
      // })
      // Temporarily uncommenting for local testing feedback
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
      }
      
    } else {
      showToast('error', response.message);
    }
    

  } catch (err) {
    showToast('error', 'Failed to save product details.');
    console.error("Save error:", err);
  } finally {
    // dispatch({ type: 'loader', loader: false }); // Deactivate loader
  }
};

  const renderError = (fieldName) => {
    return errors[fieldName] ? <div className="text-danger small">{errors[fieldName]}</div> : null;
  };

  return (
    <div>
      <Accordion open={open} toggle={toggle}>
        {/* Section 1: Price, Stock and Shipping Information (0/20) */}
        <AccordionItem className="border-0 shadow-sm mb-1">
          <AccordionHeader targetId="1">
            Price, Stock and Shipping Information (0/20)
          </AccordionHeader>
          <AccordionBody accordionId="1">
            <div style={{ height: "250px", overflow: "hidden" }}>
              <PerfectScrollbar options={{ suppressScrollX: true }}>
                <Form>
                  <Row className="mb-3">
                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">* Mandatory fields</Label>
                    </Col>
                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Listing information</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className=" st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Product Name *
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter Product Name"
                          name="name"
                          value={listingData.name || ""}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      {renderError('name')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className=" st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Seller SKU ID *
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter SKU ID"
                          name="skuId"
                          value={listingData.skuId || ""}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      {renderError('skuId')}
                    </Col>
                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Status Details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Listing Status*
                        </span>
                        <Input
                          type="select"
                          name="status"
                          value={listingData.status || ""}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Input>
                      </InputGroup>
                      {renderError('status')}
                    </Col>
                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Price details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          MRP*
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="regularPrice"
                          value={listingData.regularPrice || ""}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">INR</span>
                      </InputGroup>
                      {renderError('regularPrice')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Your selling price*
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="salePrice"
                          value={listingData.salePrice || ""}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">INR</span>
                      </InputGroup>
                      {renderError('salePrice')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Quantity (MinOQ)*
                        </span>
                        <Input
                          type="select"
                          name="minOrderQuantity"
                          value={listingData.minOrderQuantity || ""}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          {/* Add more options as needed */}
                        </Input>
                      </InputGroup>
                      {renderError('minOrderQuantity')}
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Inventory details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Fullfilment by *
                        </span>
                        <Input
                          type="select"
                          name="fulfillmentBy"
                          value={listingData.fulfillmentBy || ""}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="seller">Seller</option>
                          {/* Add other options like 'Flipkart' if applicable */}
                        </Input>
                      </InputGroup>
                      {renderError('fulfillmentBy')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Procurement type
                        </span>
                        <Input
                          type="select"
                          name="procurementType"
                          value={listingData.procurementType || ""}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="instock">Instock</option>
                          <option value="express">Express</option>
                        </Input>
                      </InputGroup>
                      {renderError('procurementType')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Procurement SLA *
                        </span>
                        <Input
                          type="number" // Assuming SLA is a number of days
                          placeholder=""
                          name="procurementSLA"
                          value={listingData.procurementSLA || ""}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">DAY</span>
                      </InputGroup>
                      {renderError('procurementSLA')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Stock *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="stockQty"
                          value={listingData.stockQty || ""}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      {renderError('stockQty')}
                      <small className="ms-auto">
                        Minimum 5 quantity required for listing visibility
                      </small>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Min Stock *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="minStockQty"
                          value={listingData.minStockQty || ""}
                          onChange={handleChange}
                        />
                      </InputGroup>
                       {renderError('minStockQty')}
                       <small className="ms-auto">
                        Minimum 1 quantity required
                      </small>
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Shipping provider</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Shipping provider*
                        </span>
                        <Input
                          type="select"
                          name="shippingProvider"
                          value={listingData.shippingProvider || ""}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="flipkart">Flipkart</option>
                          {/* Add other shipping providers */}
                        </Input>
                      </InputGroup>
                      {renderError('shippingProvider')}
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Package details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Length *
                        </span>
                        <Input
                          type="number" // Assuming dimensions are numbers
                          placeholder=""
                          name="packageLength"
                          value={listingData.packageLength || ""}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">CM</span>
                      </InputGroup>
                      {renderError('packageLength')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Breadth *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="packageBreadth"
                          value={listingData.packageBreadth || ""}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">CM</span>
                      </InputGroup>
                      {renderError('packageBreadth')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Height *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="packageHeight"
                          value={listingData.packageHeight || ""}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">CM</span>
                      </InputGroup>
                      {renderError('packageHeight')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Weight *
                        </span>
                        <Input
                          type="number"
                          placeholder=""
                          name="packageWeight"
                          value={listingData.packageWeight || ""}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">KG</span>
                      </InputGroup>
                      {renderError('packageWeight')}
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Tax details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          HSN *
                        </span>
                        <Input
                          type="text"
                          name="hsn"
                          value={listingData.hsn || ""}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      {renderError('hsn')}
                      <small>Find relevant HSN codes</small>

                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Luxury Cess
                        </span>
                        <Input
                          type="number" // Assuming percentage is a number
                          name="luxuryCess"
                          value={listingData.luxuryCess || ""}
                          onChange={handleChange}
                        />
                        <span className="px-1 py-2">PERCENTAGE</span>
                      </InputGroup>
                      {renderError('luxuryCess')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Tax Code *
                        </span>
                        <Input
                          type="select"
                          name="taxCode"
                          value={listingData.taxCode || ""}
                          onChange={handleChange}
                        >
                          <option value="">-- Select One --</option>
                          <option value="GST_0">GST_0</option>
                          <option value="GST_12">GST_12</option>
                          <option value="GST_18">GST_18</option>
                          <option value="GST_28">GST_28</option>
                          <option value="GST_3">GST_3</option>
                          <option value="GST_5">GST_5</option>
                          <option value="GST_APPAREL">GST_APPAREL</option>
                        </Input>
                      </InputGroup>
                      {renderError('taxCode')}
                    </Col>

                    <Col sm={12} className="mb-3">
                      <Label className="mb-1">Manufacturing Details</Label>
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Country Of Origin*
                        </span>
                        <Input
                          type="select"
                          name="countryOfOrigin"
                          value={listingData.countryOfOrigin || ""}
                          onChange={handleChange}
                        >
                          <option value="">Select One</option>
                          {/* ... all your country options ... */}
                          <option value="IN">India</option>
                          <option value="US">United States of America</option>
                          {/* Add more as needed */}
                        </Input>
                      </InputGroup>
                      {renderError('countryOfOrigin')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Manufacturer Details *
                        </span>
                        <Input
                          type="text"
                          name="manufacturerDetails"
                          value={listingData.manufacturerDetails || ""}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      {renderError('manufacturerDetails')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Packer Details*
                        </span>
                        <Input
                          type="text"
                          name="packerDetails"
                          value={listingData.packerDetails || ""}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      {renderError('packerDetails')}
                      <InputGroup className="mt-1">
                        <span
                          style={{ fontSize: "14px" }}
                          className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                        >
                          Importer Details*
                        </span>
                        <Input
                          type="text"
                          name="importerDetails"
                          value={listingData.importerDetails || ""}
                          onChange={handleChange}
                        />
                      </InputGroup>
                      {renderError('importerDetails')}
                    </Col>
                    {/* <Col sm={12} className="mb-3">
                      <Button
                        className="btn btn-primary btn-sm"
                        onClick={handleSaveDetails}
                      >
                        Save
                      </Button>
                    </Col> */}
                  </Row>
                </Form>
              </PerfectScrollbar>
            </div>
          </AccordionBody>
        </AccordionItem>

        {/* Section 2: Product Description (Dynamic Specifications) */}
        <AccordionItem className="border-0 shadow-sm mb-1">
          <AccordionHeader targetId="2">
            Product Description (0/11)
          </AccordionHeader>
          <AccordionBody accordionId="2">
            <Row>
              <Col sm={12} className="mb-3">
                <Label className="mb-1">* Mandatory fields</Label>
                {/* Render dynamic specification fields */}
                {localSpecifications.map(headingSection => (
                  <div key={headingSection._id} className="mb-3">
                    <h6>{headingSection.heading}</h6>
                    {headingSection.fields.map(field => (
                      <div key={field._id}> {/* Added a div for cleaner rendering of input and error */}
                        <InputGroup className="mt-1">
                          <span
                            style={{ fontSize: "14px" }}
                            className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                          >
                            {field.key}*
                          </span>
                          {field.valueType === "string" && (
                            <Input
                              type="text"
                              name={field.key}
                              value={field.value || ""}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  headingSection._id,
                                  field._id,
                                  e.target.value
                                )
                              }
                            />
                          )}
                          {field.valueType === "number" && (
                            <Input
                              type="number"
                              name={field.key}
                              value={field.value || ""}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  headingSection._id,
                                  field._id,
                                  e.target.value
                                )
                              }
                            />
                          )}
                          {field.valueType === "boolean" && (
                            <Input
                              type="select"
                              name={field.key}
                              value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  headingSection._id,
                                  field._id,
                                  e.target.value === "true"
                                )
                              }
                            >
                              <option value="">-- Select One --</option>
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </Input>
                          )}
                          {field.valueType === "dropdown" && (
                            <Input
                              type="select"
                              name={field.key}
                              value={field.value || ""}
                              onChange={(e) =>
                                handleSpecificationChange(
                                  headingSection._id,
                                  field._id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">-- Select One --</option>
                              {field.options.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Input>
                          )}
                        </InputGroup>
                        {renderError(`spec-${headingSection._id}-${field._id}`)}
                      </div>
                    ))}
                  </div>
                ))}
              </Col>
              {/* <Col sm={12} className="mb-3">
                <Button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveDetails}
                >
                  Save
                </Button>
              </Col> */}
            </Row>
          </AccordionBody>
        </AccordionItem>

        {/* Section 3: Additional Description (Optional) (0/17) */}
        {/* Changed targetId to "3" to make room for Product Variants at "4" */}
        <AccordionItem className="border-0 shadow-sm mb-1">
          <AccordionHeader targetId="3">
            Additional Description (Optional) (0/17)
          </AccordionHeader>
          <AccordionBody accordionId="3">
            <Row className="mb-3">
              <Col sm={12} className="mb-3">
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    Description *
                  </span>
                  <Input
                    type="textarea"
                    name="description"
                    value={listingData.description || ""}
                    onChange={handleChange}
                    rows="3"
                  />
                </InputGroup>
                {renderError('description')}
              </Col>
              <Col sm={12} className="mb-3">
                <Label className="mb-1">Product Details</Label>
                <Row className="mb-3">
                  <div className="col-12">
                    {(listingData.productDetails || []).map((detail, index) =>
                      <div
                        className="d-flex align-items-center mb-2"
                        key={index}
                      >
                        <Input
                          name="key"
                          type="text"
                          value={detail.key || ""}
                          onChange={e =>
                            handleAdditionalDescriptionChange(
                              index,
                              e
                            )}
                          className="me-2"
                          placeholder="Key"
                        />
                        <Input
                          name="value"
                          type="text"
                          value={detail.value || ""}
                          onChange={e =>
                            handleAdditionalDescriptionChange(
                              index,
                              e
                            )}
                          className="me-2"
                          placeholder="Value"
                        />
                        <Button
                          color="success"
                          size="sm"
                          className="me-1"
                          onClick={handleAddAdditionalDescription}
                          disabled={
                            (listingData.productDetails || []).length >= 10
                          } // Optional: Limit number of bullet points
                        >
                          <FaPlus />
                        </Button>
                        {(listingData.productDetails || []).length > 1 &&
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveAdditionalDescription(index)}
                          >
                            <FaMinus />
                          </Button>}
                      </div>
                    )}
                    {renderError('productDetails')}
                  </div>
                </Row>
              </Col>
              <Col sm={12} className="mb-3">
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    More *
                  </span>
                  <Input
                    type="textarea"
                    name="more"
                    value={listingData.more || ""}
                    onChange={handleChange}
                    rows="3"
                  />
                </InputGroup>
                {renderError('more')}
              </Col>
              {/* <Col sm={12} className="mb-3">
                <Button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveDetails}
                >
                  Save
                </Button>
              </Col> */}
            </Row>
          </AccordionBody>
        </AccordionItem>


        {/* Section 4: Product Type and Variations */}
        <AccordionItem className="border-0 shadow-sm mb-1">
          <AccordionHeader targetId="4">
            Product Type & Variations
          </AccordionHeader>
          <AccordionBody accordionId="4">
            <Row>
              <Col sm={12} className="mb-3">
                <Label className="mb-1">Product Type</Label>
                <InputGroup className="mt-1">
                  <span
                    style={{ fontSize: "14px" }}
                    className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                  >
                    Type*
                  </span>
                  <Select
                    name="type"
                    options={typeOptions}
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={handleTypeChange}
                    value={selectedTypeOption}
                  />
                </InputGroup>
              </Col>

              {selectedTypeOption.value === 'variable' && (
                <>
                  <Col sm={12} className="mb-3">
                    <Label className="mb-1">Select Attributes</Label>
                    <Select
                      isMulti
                      name="attributeIds"
                      options={attributeOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleAttributeChange}
                      value={selectedAttributeOptions}
                    />
                  </Col>

                  {selectedAttributes.map(attr => (
                    <Col sm={12} className="mb-3" key={attr.value}>
                      <Label className="mb-1">{`Select values for ${attr.label}`}</Label>
                      <Select
                        isMulti
                        name={`attribute-${attr.value}`}
                        options={attr.values.map(val => ({ value: val, label: val }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={attributeValueMap[attr.value]?.map(val => ({ value: val, label: val })) || []}
                        onChange={(selectedOptions) => handleAttributeValueChange(attr.value, selectedOptions)}
                      />
                    </Col>
                  ))}

                  <Col sm={12} className="mb-3">
                    <Button
                      className="btn btn-info btn-sm"
                      onClick={generateVariations}
                    >
                      Generate Variations
                    </Button>
                  </Col>

                  {variations.length > 0 && (
                    <Col sm={12} className="mb-3">
                      <h5 className="mt-4">Generated Variations</h5>
                      {variations.map((variation, index) => (
                        <Card key={index} className="mb-3 shadow-sm">
                          <CardBody>
                            <Row>
                              <Col sm={12}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <strong>Attributes:</strong>{" "}
                                  {variation.attributes.map((attr) => `${attr.value}`).join(", ")}
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => {
                                      const newVars = [...variations];
                                      newVars.splice(index, 1);
                                      setVariations(newVars);
                                      onListingDataChange(prevListingData => ({
                                        ...prevListingData,
                                        variations: newVars
                                      }));
                                    }}
                                  >
                                    <FaMinus /> Remove
                                  </Button>
                                </div>
                              </Col>
                              <Col md={6} className="mb-2">
                                <Label>Image</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleVariationImageChange(index, e)}
                                />
                                {variation.image && (variation.image instanceof File ?
                                  <img src={URL.createObjectURL(variation.image)} width="80" height="80" className="mt-2 border rounded" alt="Variation" /> :
                                  // Assuming IMAGE_URL is defined (e.g., as an environment variable)
                                  <img src={`${process.env.REACT_APP_IMAGE_URL}${variation.image}`} width="80" height="80" className="mt-2 border rounded" alt="Variation" />
                                )}
                              </Col>
                              <Col md={6} className="mb-2">
                                <Label>SKU</Label>
                                <Input
                                  type="text"
                                  placeholder="SKU"
                                  value={variation.sku}
                                  onChange={(e) => handleVariationChange(index, 'sku', e.target.value)}
                                />
                              </Col>
                              <Col md={6} className="mb-2">
                                <Label>Regular Price</Label>
                                <Input
                                  type="number"
                                  placeholder="Regular Price"
                                  value={variation.regularPrice}
                                  onChange={(e) => handleVariationChange(index, 'regularPrice', e.target.value)}
                                />
                              </Col>
                              <Col md={6} className="mb-2">
                                <Label>Sale Price</Label>
                                <Input
                                  type="number"
                                  placeholder="Sale Price"
                                  value={variation.salePrice}
                                  onChange={(e) => handleVariationChange(index, 'salePrice', e.target.value)}
                                />
                              </Col>
                              <Col md={6} className="mb-2">
                                <Label>Stock Quantity</Label>
                                <Input
                                  type="number"
                                  placeholder="Stock Quantity"
                                  value={variation.stockQty}
                                  onChange={(e) => handleVariationChange(index, 'stockQty', e.target.value)}
                                />
                              </Col>
                              <Col md={6} className="mb-2">
                                <Label>Min Stock Quantity</Label>
                                <Input
                                  type="number"
                                  placeholder="Min Stock Quantity"
                                  value={variation.minStockQty}
                                  onChange={(e) => handleVariationChange(index, 'minStockQty', e.target.value)}
                                />
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      ))}
                    </Col>
                  )}
                </>
              )}
              <Col sm={12} className="mb-3">
                <Button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveDetails}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDetails;