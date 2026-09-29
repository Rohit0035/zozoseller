import React, { useState, useEffect, useRef } from "react";
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
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { showToast } from "../../../components/ToastifyNotification";
import { GetSpecificationFieldsBySubsCategoryTwoId } from "../../../api/specificationFieldsAPI";
import { GetAttributes } from "../../../api/attributeAPI";
import Select from 'react-select';
import { StoreProduct, UpdateProduct } from "../../../api/productAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetCommissionSlabsBySubsCategoryTwoId } from "../../../api/commissionSlabAPI";
import { GetHsns } from "../../../api/hsnAPI";

const ProductDetails = ({ listingData, onListingDataChange }) => {
	const [open, setOpen] = useState("1");
	const [localSpecifications, setLocalSpecifications] = useState([]);
	const [commissionSlabs, setCommissionSlabs] = useState([]);
	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isSaving = useRef(false);
	const lastSavedData = useRef("");

	const [availableAttributes, setAvailableAttributes] = useState([]);

	const [generatedVariations, setGeneratedVariations] = useState([]);
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
		listingData.type ? typeOptions.find(opt => opt.value === listingData.type) : { value: '', label: '' }
	);

	const [hsnCodes, setHsnCodes] = useState([]);
	const [hsnOptions, setHsnOptions] = useState([]);
	const [selectedHsnOption, setSelectedHsnOption] = useState(
		listingData.hsn ? hsnOptions.find(opt => opt.value === listingData.hsn) : { value: '', label: 'Please select' }
	);

	useEffect(() => {
		if (listingData?.subCategoryTwoId) {
			fetchSpecifications({ "subCategoryTwoId": listingData.subCategoryTwoId });
		}
	}, [listingData?.subCategoryTwoId]);

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

	useEffect(() => {
		if (listingData.variations && listingData.variations.length > 0) {
			setGeneratedVariations(listingData.variations);
		} else {
			setGeneratedVariations([]);
		}
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

	const fetchCommissionSlabs = async (data) => {
		try {
			const response = await GetCommissionSlabsBySubsCategoryTwoId(data);
			if (response.success === true) {
				setCommissionSlabs(response.data?.slabs || []);
			} else {
				showToast('error', response.message);
			}
		} catch (error) {
			showToast('error', 'Failed to fetch commission slabs');
		}
	};

	useEffect(() => {
		if (listingData?.subCategoryTwoId) {
			fetchSpecifications({ "subCategoryTwoId": listingData.subCategoryTwoId });
			fetchCommissionSlabs({ "subCategoryTwoId": listingData.subCategoryTwoId });
		}
		if (listingData?.subCategoryOneId && listingData?.categoryId) {
			fetchAttributes({ categoryId: listingData.categoryId, subCategoryOneId: listingData.subCategoryOneId });
		}
	}, [listingData?.subCategoryTwoId, listingData?.subCategoryOneId, listingData?.categoryId]);

	useEffect(() => {
		const selectedIds = selectedAttributeOptions.map(option => option.value);
		const selectedFullAttrs = attributeOptions.filter(attr => selectedIds.includes(attr.value));
		setSelectedAttributes(selectedFullAttrs);

		const updatedMap = {};
		selectedFullAttrs.forEach(attr => {
			const existingValues = attributeValueMap[attr._id] || [];
			updatedMap[attr._id] = existingValues;
		});
		setAttributeValueMap(updatedMap);
	}, [selectedAttributeOptions, attributeOptions]);

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

	const fetchHsns = async (data) => {
		try {
			const response = await GetHsns(data);
			if (response.success === true) {
				setHsnOptions(response.data.map(hsn => ({ value: hsn._id, label: hsn.code })));
				setSelectedHsnOption(hsnOptions.find(opt => opt.value === listingData.hsn) || { value: '', label: 'Please select' });
				setHsnCodes(response.data);
			} else {
				showToast('error', response.message);
			}
		} catch (error) {
			showToast('error', 'Failed to fetch Hsns');
		}
	};

	useEffect(() => {
		if (listingData?.categoryId) {
			fetchHsns({ "categoryId": listingData.categoryId });
		}
	}, [listingData?.categoryId]);

	const handleTypeChange = (selectedOption) => {
		setSelectedTypeOption(selectedOption);
		onListingDataChange({ type: selectedOption.value });
	};

	const handleHsnChange = (selectedOption) => {
		setSelectedHsnOption(selectedOption);
		onListingDataChange({ hsn: selectedOption.value });
		onListingDataChange({ taxCode: hsnCodes.find(hsn => hsn._id === selectedOption.value)?.gstPercentage });
	};

	const handleAttributeChange = (selectedOptions) => {
		setSelectedAttributeOptions(selectedOptions);
		setVariations([]);
		setAttributeValueMap({});
	};

	const handleAttributeValueChange = (attributeId, selectedValues) => {
		setAttributeValueMap(prev => {
			const newMap = {
				...prev,
				[attributeId]: selectedValues?.map(v => v.value) || []
			};
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
				packageLength: "",
				packageBreadth: "",
				packageHeight: "",
				packageWeight: "",
				hsn: "",
				regularPrice: '',
				salePrice: '',
				packingCharges: '',
				closingFee: '',
				productPrice: '',
				taxableAmount: '',
				commissionAmountPartial: '',
				commissionGstPartial: '',
				commissionAmount: '',
				gstAmount: '',
				tcsAmount: '',
				shippingChargesPartial: '',
				shippingGstPartial: '',
				shippingCharge: '',
				stockQty: '',
				minStockQty: '',
				attributes: combo.map(c => ({ id: c.id, value: c.value }))
			};
		});

		setVariations(generated);
		onListingDataChange(prevListingData => ({
			...prevListingData,
			variations: generated,
			attributes: attrOptions.map(attr => ({ id: attr.id, values: attr.values }))
		}));
	};

	const handleVariationChange = (index, field, value) => {
		setVariations(prevVariations => {
			const newVariations = [...prevVariations];
			if (field === 'image') {
				newVariations[index][field] = value;
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

	// useEffect for Variable Product variations calculations
	useEffect(() => {
		if (listingData.type === 'variable' && variations.length > 0) {
			const updatedVariations = variations.map((variation) => {
				const salePrice = parseFloat(variation.salePrice) || 0;
				const packingCharges = parseFloat(variation.packingCharges) || 0;
				const closingFee = parseFloat(variation.closingFee) || 0;

				const packageWeight = parseFloat(variation.packageWeight) || 0;
				const packageLength = parseFloat(variation.packageLength) || 0;
				const packageWidth = parseFloat(variation.packageWidth) || parseFloat(variation.packageBreadth) || 0;
				const packageHeight = parseFloat(variation.packageHeight) || 0;

				const gstPercentage = parseFloat(listingData.taxCode) || 0;

				// --- NEW SHIPPING LOGIC ---
				const volumetricWeight = (packageLength * packageWidth * packageHeight) / 5000;
				const chargeableWeight = Math.max(packageWeight, volumetricWeight);
				const shippingChargesPartial = chargeableWeight > 0 ? Math.ceil(chargeableWeight / 0.5) * 70 : 0;
				const shippingGstPartial = (shippingChargesPartial * gstPercentage) / 100;
				const shippingCharge = shippingChargesPartial + shippingGstPartial;
				// --------------------------

				let commissionRate = 0;
				let commissionAmountPartial = 0;
				let commissionGstPartial = 0;
				let commissionAmount = 0;
				let taxableAmount = 0;
				let gstAmount = 0;
				let tcsAmount = 0;
				let productPrice = 0;

				if (salePrice > 0) {
					const slab = commissionSlabs.find(
						slab => salePrice >= slab.min_value && salePrice <= slab.max_value
					);

					commissionRate = slab?.commission_rate || 0;

					// Calculations based on requested logic
					taxableAmount = (salePrice * 100) / (gstPercentage + 100);
					gstAmount = salePrice - taxableAmount;

					commissionAmountPartial = (salePrice * commissionRate) / 100;
					commissionGstPartial = (commissionAmountPartial * gstPercentage) / 100;
					commissionAmount = commissionAmountPartial + commissionGstPartial;

					tcsAmount = salePrice * 0.001;

					// Product Price
					productPrice = salePrice - commissionAmount - packingCharges - shippingCharge - tcsAmount - closingFee;
					productPrice = Math.max(0, productPrice);
				}

				return {
					...variation,
					productPrice: productPrice.toFixed(2),
					taxableAmount: taxableAmount.toFixed(2),
					commissionRate,
					commissionAmountPartial: commissionAmountPartial.toFixed(2),
					commissionGstPartial: commissionGstPartial.toFixed(2),
					commissionAmount: commissionAmount.toFixed(2),
					shippingChargesPartial: shippingChargesPartial.toFixed(2),
					shippingGstPartial: shippingGstPartial.toFixed(2),
					shippingCharge: shippingCharge.toFixed(2),
					gstAmount: gstAmount.toFixed(2),
					tcsAmount: tcsAmount.toFixed(2),
				};
			});

			if (JSON.stringify(updatedVariations) !== JSON.stringify(variations)) {
				setVariations(updatedVariations);
				onListingDataChange(prevListingData => ({
					...prevListingData,
					variations: updatedVariations,
				}));
			}
		}
	}, [
		listingData.type,
		variations,
		listingData.taxCode,
		commissionSlabs,
		onListingDataChange,
	]);

	const handleVariationImageChange = (index, event) => {
		const file = event.target.files[0];
		if (file) {
			handleVariationChange(index, 'image', file);
		}
	};

	const toggle = id => {
		setOpen(open === id ? "" : id);
	};

	const handleChange = e => {
		const { name, value } = e.target;
		onListingDataChange({ [name]: value });
		setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
	};

	// useEffect for Simple Product calculations
	useEffect(() => {
		const salePrice = parseFloat(listingData.salePrice) || 0;
		const packingCharges = parseFloat(listingData.packingCharges) || 0;
		const closingFee = parseFloat(listingData.closingFee) || 0;

		const packageWeight = parseFloat(listingData.packageWeight) || 0;
		const packageLength = parseFloat(listingData.packageLength) || 0;
		const packageBreadth = parseFloat(listingData.packageBreadth) || 0;
		const packageHeight = parseFloat(listingData.packageHeight) || 0;

		const gstPercentage = parseFloat(listingData.taxCode) || 0;

		// --- NEW SHIPPING LOGIC ---
		const volumetricWeight = (packageLength * packageBreadth * packageHeight) / 5000;
		const chargeableWeight = Math.max(packageWeight, volumetricWeight);
		const shippingChargesPartial = chargeableWeight > 0 ? Math.ceil(chargeableWeight / 0.5) * 70 : 0;
		const shippingGstPartial = (shippingChargesPartial * gstPercentage) / 100;
		const shippingCharge = shippingChargesPartial + shippingGstPartial;
		// --------------------------

		let productPrice = 0;
		let taxableAmount = 0;
		let commissionRate = 0;
		let commissionAmountPartial = 0;
		let commissionGstPartial = 0;
		let commissionAmount = 0;
		let gstAmount = 0;
		let tcsAmount = 0;

		if (salePrice > 0) {
			const slab = commissionSlabs.find(
				s => salePrice >= s.min_value && salePrice <= s.max_value
			);

			commissionRate = slab?.commission_rate || 0;

			// Calculations based on requested logic
			taxableAmount = (salePrice * 100) / (gstPercentage + 100);
			gstAmount = salePrice - taxableAmount;

			commissionAmountPartial = (salePrice * commissionRate) / 100;
			commissionGstPartial = (commissionAmountPartial * gstPercentage) / 100;
			commissionAmount = commissionAmountPartial + commissionGstPartial;

			tcsAmount = salePrice * 0.001;

			// Product Price
			productPrice = salePrice - commissionAmount - packingCharges - shippingCharge - tcsAmount - closingFee;
			productPrice = Math.max(0, productPrice);
		}

		onListingDataChange(prev => ({
			...prev,
			productPrice: productPrice.toFixed(2),
			taxableAmount: taxableAmount.toFixed(2),
			commissionRate,
			commissionAmountPartial: commissionAmountPartial.toFixed(2),
			commissionGstPartial: commissionGstPartial.toFixed(2),
			commissionAmount: commissionAmount.toFixed(2),
			shippingChargesPartial: shippingChargesPartial.toFixed(2),
			shippingGstPartial: shippingGstPartial.toFixed(2),
			shippingCharge: shippingCharge.toFixed(2),
			gstAmount: gstAmount.toFixed(2),
			tcsAmount: tcsAmount.toFixed(2),
		}));
	}, [
		listingData.salePrice,
		listingData.packingCharges,
		listingData.closingFee,
		listingData.taxCode,
		listingData.packageWeight,
		listingData.packageLength,
		listingData.packageBreadth,
		listingData.packageHeight,
		commissionSlabs
	]);

	const handleAddAdditionalDescription = () => {
		onListingDataChange(prevListingData => ({
			...prevListingData,
			productDetails: [...(prevListingData.productDetails || []), { key: "", value: "" }]
		}));
		setErrors(prevErrors => ({ ...prevErrors, productDetails: '' }));
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
		setErrors(prevErrors => ({ ...prevErrors, productDetails: '' }));
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
		setErrors(prevErrors => ({ ...prevErrors, productDetails: '' }));
	};

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
		setErrors(prevErrors => ({ ...prevErrors, [`spec-${headingId}-${fieldId}`]: '' }));
	};

	const validateProduct = () => {
		let newErrors = {};
		let isValid = true;

		const mandatoryFields = [
			"name",
			"sku",
			"status",
			"regularPrice",
			"productPrice",
			"salePrice",
			"minOrderQuantity",
			"stockQty",
			"minStockQty",
			"shippingProvider",
			"packageLength",
			"packageBreadth",
			"packageHeight",
			"packageWeight",
			"hsn",
			"taxCode",
			"countryOfOrigin",
			"manufacturerDetails",
			"packerDetails",
			"importerDetails",
		];

		for (const field of mandatoryFields) {
			if (
				(typeof listingData[field] === "string" &&
					listingData[field].trim() === "") ||
				(typeof listingData[field] === "number" &&
					(listingData[field] === "" ||
						isNaN(listingData[field]))) ||
				listingData[field] === null ||
				listingData[field] === undefined
			) {
				newErrors[field] = `Please fill ${field}`;
				isValid = false;
			}
		}

		if (!isValid) {
			setErrors(newErrors);
			showToast("error", "Please fill all mandatory fields.");
			return false;
		}

		if (
			listingData.productDetails?.some(
				d => d.key.trim() === "" || d.value.trim() === ""
			)
		) {
			showToast(
				"error",
				"Please fill all additional descriptions."
			);
			return false;
		}

		for (const section of localSpecifications) {
			for (const field of section.fields) {
				if (
					field.valueType === "string" &&
					!field.value?.trim()
				) {
					showToast(
						"error",
						`Please fill ${field.key}`
					);
					return false;
				}

				if (
					field.valueType === "number" &&
					(field.value === "" ||
						isNaN(Number(field.value)))
				) {
					showToast(
						"error",
						`Invalid value for ${field.key}`
					);
					return false;
				}
			}
		}

		if (listingData.type === "variable") {
			if (!listingData.variations?.length) {
				showToast("error", "Generate variations.");
				return false;
			}

			for (const variation of listingData.variations) {
				if (!variation.sku?.trim()) {
					showToast("error", "Variation SKU is required.");
					return false;
				}

				if (Number(variation.regularPrice) <= 0) {
					showToast("error", "Invalid variation price.");
					return false;
				}

				if (variation.salePrice &&
					Number(variation.salePrice) >= Number(variation.regularPrice)
				) {
					showToast(
						"error",
						"Sale price must be less than Regular price."
					);
					return false;
				}
			}
		}

		if (!listingData.mainImage) {
			showToast("error", "Main image is required.");
			return false;
		}
		return true;
	};

	const saveProduct = async (status) => {
		if (isSaving.current) {
			return;
		}

		isSaving.current = true;
		try {
			const formData = new FormData();
			formData.append("status", status);

			Object.keys(listingData).forEach((key) => {
				if (
					![
						"draftedProductId",
						"status",
						"mainImage",
						"galleryImages",
						"variations",
						"specifications",
						"productDetails",
						"attributes",
					].includes(key)
				) {
					formData.append(key, listingData[key]);
				}
			});

			if (listingData.productDetails) {
				formData.append('productDetails', JSON.stringify(listingData.productDetails));
			} else {
				formData.append('productDetails', JSON.stringify([]));
			}

			if (listingData.specifications) {
				formData.append('specifications', JSON.stringify(listingData.specifications));
			} else {
				formData.append('specifications', JSON.stringify([]));
			}

			if (listingData.mainImage instanceof File) {
				formData.append('mainImage', listingData.mainImage);
			} else if (typeof listingData.mainImage === 'string' && listingData.mainImage !== "") {
				formData.append('mainImage', listingData.mainImage);
			}

			if (listingData.galleryImages && Array.isArray(listingData.galleryImages)) {
				listingData.galleryImages.forEach((img) => {
					if (img instanceof File) {
						formData.append('galleryImages', img);
					} else if (typeof img === 'string') {
						formData.append('existingGalleryImages', img);
					}
				});
			}

			if (listingData.type === 'variable' && listingData.attributes && listingData.attributes.length > 0) {
				formData.append('attributes', JSON.stringify(listingData.attributes));
			} else {
				formData.append('attributes', JSON.stringify([]));
			}

			if (listingData.type === 'variable' && listingData.variations && listingData.variations.length > 0) {
				formData.append('hasVariations', 'true');
				const stringVariations = JSON.stringify(variations);
				formData.append('stringVariations', stringVariations);

				listingData.variations.forEach((variation, index) => {
					formData.append(`variations[${index}][sku]`, variation.sku || '');

					formData.append(`variations[${index}][packageLength]`, variation.packageLength || '');
					formData.append(`variations[${index}][packageWidth]`, variation.packageWidth || '');
					formData.append(`variations[${index}][packageHeight]`, variation.packageHeight || '');
					formData.append(`variations[${index}][packageWeight]`, variation.packageWeight || '');

					formData.append(`variations[${index}][regularPrice]`, variation.regularPrice || '');
					formData.append(`variations[${index}][salePrice]`, variation.salePrice || '');
					formData.append(`variations[${index}][packingCharges]`, variation.packingCharges || '');
					formData.append(`variations[${index}][closingFee]`, variation.closingFee || '');
					formData.append(`variations[${index}][productPrice]`, variation.productPrice || '');
					formData.append(`variations[${index}][taxableAmount]`, variation.taxableAmount || '');
					formData.append(`variations[${index}][commissionRate]`, variation.commissionRate || '');
					formData.append(`variations[${index}][commissionAmountPartial]`, variation.commissionAmountPartial || '');
					formData.append(`variations[${index}][commissionGstPartial]`, variation.commissionGstPartial || '');
					formData.append(`variations[${index}][commissionAmount]`, variation.commissionAmount || '');
					formData.append(`variations[${index}][shippingChargesPartial]`, variation.shippingChargesPartial || '');
					formData.append(`variations[${index}][shippingGstPartial]`, variation.shippingGstPartial || '');
					formData.append(`variations[${index}][shippingCharge]`, variation.shippingCharge || '');
					formData.append(`variations[${index}][gstAmount]`, variation.gstAmount || '');
					formData.append(`variations[${index}][tcsAmount]`, variation.tcsAmount || '');
					formData.append(`variations[${index}][stockQty]`, variation.stockQty || '');
					formData.append(`variations[${index}][minStockQty]`, variation.minStockQty || '');
					formData.append(`variations[${index}][attributes]`, JSON.stringify(variation.attributes));

					if (variation.image instanceof File) {
						formData.append(`variations[${index}][image]`, variation.image);
					} else if (typeof variation.image === 'string' && variation.image !== "") {
						formData.append(`variations[${index}][existingImage]`, variation.image);
					}
				});
			} else {
				formData.append('variations', '[]');
				formData.append('hasVariations', 'false');
			}

			if (listingData.draftedProductId) {
				const response = await UpdateProduct(
					listingData.draftedProductId,
					formData
				);

				if (status !== "Draft" && response.success) {
					showToast("success", response.message);
					navigate("/listing");
				}
				return response.success;
			} else {
				const response = await StoreProduct(formData);

				if (response.success) {
					if (status === "Draft") {
						onListingDataChange(prev => ({
							...prev,
							draftedProductId: response.product._id,
							mainImage: response.product?.mainImage,
							galleryImages: response.product?.galleryImages,
							variations: response.product?.variations
						}));
					} else {
						showToast("success", response.message);
						navigate("/listing");
					}
				}
				return response.success;
			}
		} catch (err) {
			showToast("error", "Failed to save product.");
		} finally {
			isSaving.current = false;
			dispatch({ type: "loader", loader: false });
		}
	};

	const handleSaveDetails = async () => {
		if (!validateProduct()) return;
		await saveProduct("ReadyForActivation");
	};

	useEffect(() => {
		if (!listingData.name?.trim()) return;

		const current = JSON.stringify(listingData);

		if (current === lastSavedData.current) {
			return;
		}

		const timer = setTimeout(async () => {
			const success = await saveProduct("Draft");

			if (success) {
				lastSavedData.current = current;
			}
		}, 3000);

		return () => clearTimeout(timer);
	}, [listingData]);

	const renderError = (fieldName) => {
		return errors[fieldName] ? <div className="text-danger small">{errors[fieldName]}</div> : null;
	};

	return (
		<div>
			<Accordion open={open} toggle={toggle}>
				<AccordionItem className="border-0 shadow-sm mb-1">
					<AccordionHeader targetId="1">
						Price, Stock and Shipping Information
					</AccordionHeader>
					<AccordionBody accordionId="1">
						<div style={{ height: "450px", overflow: "hidden" }}>
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
													value={listingData.name}
													onChange={handleChange}
													invalid={errors.name}
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
													name="sku"
													value={listingData.sku}
													onChange={handleChange}
													invalid={errors.sku}
												/>
											</InputGroup>
											{renderError('sku')}
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
													value={listingData.status}
													onChange={handleChange}
													invalid={errors.status}
												>
													<option value="">-- Select One --</option>
													<option value="ReadyForActivation">Ready For Activation</option>
												</Input>
											</InputGroup>
											{renderError('status')}
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
													value={listingData.fulfillmentBy}
													onChange={handleChange}
													invalid={errors.fulfillmentBy}
												>
													<option value="">-- Select One --</option>
													<option value="Seller">Seller</option>
													<option value="Zozokart">Zozokart</option>
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
													value={listingData.procurementType}
													onChange={handleChange}
													invalid={errors.procurementType}
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
													type="number"
													placeholder=""
													name="procurementSLA"
													value={listingData.procurementSLA}
													onChange={handleChange}
													invalid={errors.procurementSLA}
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
													value={listingData.stockQty}
													onChange={handleChange}
													invalid={errors.stockQty}
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
													value={listingData.minStockQty}
													onChange={handleChange}
													invalid={errors.minStockQty}
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
													value={listingData.shippingProvider}
													onChange={handleChange}
													invalid={errors.shippingProvider}
												>
													<option value="">-- Select One --</option>
													<option value="Zozokart">Zozokart</option>
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
													type="number"
													placeholder=""
													name="packageLength"
													value={listingData.packageLength}
													onChange={handleChange}
													invalid={errors.packageLength}
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
													value={listingData.packageBreadth}
													onChange={handleChange}
													invalid={errors.packageBreadth}
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
													value={listingData.packageHeight}
													onChange={handleChange}
													invalid={errors.packageHeight}
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
													value={listingData.packageWeight}
													onChange={handleChange}
													invalid={errors.packageWeight}
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
												<Select
													name="type"
													options={hsnOptions}
													className="basic-single w-50"
													classNamePrefix="select"
													onChange={handleHsnChange}
													value={selectedHsnOption}
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
													type="number"
													name="luxuryCess"
													value={listingData.luxuryCess}
													onChange={handleChange}
													invalid={errors.luxuryCess}
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
													type="text"
													name="taxCode"
													readOnly
													value={listingData.taxCode}
													invalid={errors.taxCode}
												/>
											</InputGroup>
											{renderError('taxCode')}
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
													value={listingData.regularPrice}
													onChange={handleChange}
													invalid={errors.regularPrice}
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
													value={listingData.salePrice}
													onChange={handleChange}
													invalid={errors.salePrice}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('salePrice')}

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Packing Charges*
												</span>
												<Input
													type="number"
													placeholder="0"
													name="packingCharges"
													value={listingData.packingCharges}
													onChange={handleChange}
													invalid={errors.packingCharges}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('packingCharges')}

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Closing Fee*
												</span>
												<Input
													type="number"
													placeholder="0"
													name="closingFee"
													value={listingData.closingFee}
													onChange={handleChange}
													invalid={errors.closingFee}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('closingFee')}

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Taxable Amount*
												</span>
												<Input
													type="number"
													placeholder=""
													name="taxableAmount"
													value={listingData.taxableAmount}
													onChange={handleChange}
													readOnly
													invalid={errors.taxableAmount}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('taxableAmount')}

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													GST Amount*
												</span>
												<Input
													type="number"
													placeholder=""
													name="gstAmount"
													value={listingData.gstAmount}
													onChange={handleChange}
													readOnly
													invalid={errors.gstAmount}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('gstAmount')}

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Comm. Amt Partial*
												</span>
												<Input
													type="number"
													placeholder=""
													name="commissionAmountPartial"
													value={listingData.commissionAmountPartial}
													onChange={handleChange}
													readOnly
													invalid={errors.commissionAmountPartial}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Comm. GST Partial*
												</span>
												<Input
													type="number"
													placeholder=""
													name="commissionGstPartial"
													value={listingData.commissionGstPartial}
													onChange={handleChange}
													readOnly
													invalid={errors.commissionGstPartial}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Total Commission*
												</span>
												<Input
													type="number"
													placeholder=""
													name="commissionAmount"
													value={listingData.commissionAmount}
													onChange={handleChange}
													readOnly
													invalid={errors.commissionAmount}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('commissionAmount')}

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Ship. Charge Partial*
												</span>
												<Input
													type="number"
													placeholder=""
													name="shippingChargesPartial"
													value={listingData.shippingChargesPartial}
													onChange={handleChange}
													readOnly
													invalid={errors.shippingChargesPartial}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Ship. GST Partial*
												</span>
												<Input
													type="number"
													placeholder=""
													name="shippingGstPartial"
													value={listingData.shippingGstPartial}
													onChange={handleChange}
													readOnly
													invalid={errors.shippingGstPartial}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Total Ship. Charge*
												</span>
												<Input
													type="number"
													placeholder=""
													name="shippingCharge"
													value={listingData.shippingCharge}
													onChange={handleChange}
													readOnly
													invalid={errors.shippingCharge}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('shippingCharge')}

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													TCS Amount*
												</span>
												<Input
													type="number"
													placeholder=""
													name="tcsAmount"
													value={listingData.tcsAmount}
													onChange={handleChange}
													readOnly
													invalid={errors.tcsAmount}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('tcsAmount')}

											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Product price*
												</span>
												<Input
													type="number"
													placeholder=""
													name="productPrice"
													value={listingData.productPrice}
													onChange={handleChange}
													readOnly
													invalid={errors.productPrice}
												/>
												<span className="px-1 py-2">INR</span>
											</InputGroup>
											{renderError('productPrice')}


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
													value={listingData.minOrderQuantity}
													onChange={handleChange}
													invalid={errors.minOrderQuantity}
												>
													<option value="">-- Select One --</option>
													<option value="1">1</option>
													<option value="2">2</option>
												</Input>
											</InputGroup>
											{renderError('minOrderQuantity')}
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
													value={listingData.countryOfOrigin}
													onChange={handleChange}
													invalid={errors.countryOfOrigin}
												>
													<option value="">Select One</option>
													<option value="IN">India</option>
													<option value="US">United States of America</option>
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
													value={listingData.manufacturerDetails}
													onChange={handleChange}
													invalid={errors.manufacturerDetails}
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
													value={listingData.packerDetails}
													onChange={handleChange}
													invalid={errors.packerDetails}
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
													value={listingData.importerDetails}
													onChange={handleChange}
													invalid={errors.importerDetails}
												/>
											</InputGroup>
											{renderError('importerDetails')}
											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Returnable*
												</span>
												<Input
													type="select"
													name="returnable"
													value={listingData.returnable}
													onChange={handleChange}
													invalid={errors.returnable}
												>
													<option value="true">Yes</option>
													<option value="false">No</option>
												</Input>
											</InputGroup>
											{renderError('returnable')}
											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Returnable Days*
												</span>
												<Input
													type="number"
													name="returnableDays"
													value={listingData.returnableDays}
													onChange={handleChange}
													invalid={errors.returnableDays}
												/>
											</InputGroup>
											{renderError('returnableDays')}
											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Exchangeable*
												</span>
												<Input
													type="select"
													name="exchangeable"
													value={listingData.exchangeable}
													onChange={handleChange}
													invalid={errors.exchangeable}
												>
													<option value="true">Yes</option>
													<option value="false">No</option>
												</Input>
											</InputGroup>
											{renderError('exchangeable')}
											<InputGroup className="mt-1">
												<span
													style={{ fontSize: "14px" }}
													className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
												>
													Refundable*
												</span>
												<Input
													type="select"
													name="refundable"
													value={listingData.refundable}
													onChange={handleChange}
													invalid={errors.refundable}
												>
													<option value="true">Yes</option>
													<option value="false">No</option>
												</Input>
											</InputGroup>
											{renderError('refundable')}
										</Col>
									</Row>
								</Form>
							</PerfectScrollbar>
						</div>
					</AccordionBody>
				</AccordionItem>

				{
					localSpecifications.length > 0 && (
						<AccordionItem className="border-0 shadow-sm mb-1">
							<AccordionHeader targetId="2">
								Product Description
							</AccordionHeader>
							<AccordionBody accordionId="2">
								<Row>
									<Col sm={12} className="mb-3">
										<Label className="mb-1">* Mandatory fields</Label>
										{localSpecifications.map(headingSection => (
											<div key={headingSection._id} className="mb-3">
												<h6>{headingSection.heading}</h6>
												{headingSection.fields.map(field => (
													<div key={field._id}>
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
								</Row>
							</AccordionBody>
						</AccordionItem>
					)
				}

				<AccordionItem className="border-0 shadow-sm mb-1">
					<AccordionHeader targetId="3">
						Additional Information (Optional)
					</AccordionHeader>
					<AccordionBody accordionId="3">
						<Row className="mb-3">
							<Col sm={12} className="mb-3">
								<InputGroup className="mt-1">
									<span
										style={{ fontSize: "14px" }}
										className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
									>
										Description (Optional)
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
							{
								listingData.productDetails?.length > 0 &&

								<Col sm={12} className="mb-3">
									<Label className="mb-1">Product Details (Optional)</Label>
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
														}
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
							}
							<Col sm={12} className="mb-3">
								<InputGroup className="mt-1">
									<span
										style={{ fontSize: "14px" }}
										className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
									>
										More (Optional)
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
							<Col sm={12} className="mb-3">
								<InputGroup className="mt-1">
									<span
										style={{ fontSize: "14px" }}
										className="st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
									>
										Keywords (comma separated) (Optional)
									</span>
									<Input
										type="textarea"
										name="keywords"
										value={listingData.keywords || ""}
										onChange={handleChange}
										rows="3"
									/>
								</InputGroup>
								{renderError('keywords')}
							</Col>
						</Row>
					</AccordionBody>
				</AccordionItem>

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
															<Col md={12} className="mb-2">
																<Label>Image</Label>
																<Input
																	type="file"
																	accept="image/*"
																	onChange={(e) => handleVariationImageChange(index, e)}
																/>
																{variation.image && (variation.image instanceof File ?
																	<img src={URL.createObjectURL(variation.image)} width="80" height="80" className="mt-2 border rounded" alt="Variation" /> :
																	<img src={`${process.env.REACT_APP_IMAGE_URL}${variation.image}`} width="80" height="80" className="mt-2 border rounded" alt="Variation" />
																)}
															</Col>
															<Col md={12} className="mb-2">
																<Label>SKU</Label>
																<Input
																	type="text"
																	placeholder="SKU"
																	value={variation.sku}
																	onChange={(e) => handleVariationChange(index, 'sku', e.target.value)}
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Package Length (CM)</Label>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="Package Length"
																	value={variation.packageLength}
																	onChange={(e) => handleVariationChange(index, 'packageLength', e.target.value)}
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Package Width (CM)</Label>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="Package Width"
																	value={variation.packageWidth}
																	onChange={(e) => handleVariationChange(index, 'packageWidth', e.target.value)}
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Package Height (CM)</Label>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="Package Height"
																	value={variation.packageHeight}
																	onChange={(e) => handleVariationChange(index, 'packageHeight', e.target.value)}
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Package Weight (KG)</Label>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="Package Weight"
																	value={variation.packageWeight}
																	onChange={(e) => handleVariationChange(index, 'packageWeight', e.target.value)}
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>MRP</Label>
																<Input
																	type="number"
																	placeholder="MRP"
																	value={variation.regularPrice}
																	onChange={(e) => handleVariationChange(index, 'regularPrice', e.target.value)}
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>Sale Price</Label>
																<Input
																	type="number"
																	placeholder="Sale Price"
																	value={variation.salePrice}
																	onChange={(e) => handleVariationChange(index, 'salePrice', e.target.value)}
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>Packing Charges</Label>
																<Input
																	type="number"
																	placeholder="0"
																	value={variation.packingCharges}
																	onChange={(e) => handleVariationChange(index, 'packingCharges', e.target.value)}
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>Closing Fee</Label>
																<Input
																	type="number"
																	placeholder="0"
																	value={variation.closingFee}
																	onChange={(e) => handleVariationChange(index, 'closingFee', e.target.value)}
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Taxable Amount</Label>
																<Input
																	type="number"
																	placeholder="Taxable Amount"
																	value={variation.taxableAmount}
																	onChange={(e) => handleVariationChange(index, 'taxableAmount', e.target.value)}
																	readOnly
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>GST Amount</Label>
																<Input
																	type="number"
																	placeholder="GST Amount"
																	value={variation.gstAmount}
																	onChange={(e) => handleVariationChange(index, 'gstAmount', e.target.value)}
																	readOnly
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Comm. Amt Partial</Label>
																<Input
																	type="number"
																	placeholder=""
																	value={variation.commissionAmountPartial}
																	onChange={(e) => handleVariationChange(index, 'commissionAmountPartial', e.target.value)}
																	readOnly
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>Comm. GST Partial</Label>
																<Input
																	type="number"
																	placeholder=""
																	value={variation.commissionGstPartial}
																	onChange={(e) => handleVariationChange(index, 'commissionGstPartial', e.target.value)}
																	readOnly
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>Total Commission</Label>
																<Input
																	type="number"
																	placeholder="Total Commission"
																	value={variation.commissionAmount}
																	onChange={(e) => handleVariationChange(index, 'commissionAmount', e.target.value)}
																	readOnly
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Ship. Charge Partial</Label>
																<Input
																	type="number"
																	placeholder=""
																	value={variation.shippingChargesPartial}
																	onChange={(e) => handleVariationChange(index, 'shippingChargesPartial', e.target.value)}
																	readOnly
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>Ship. GST Partial</Label>
																<Input
																	type="number"
																	placeholder=""
																	value={variation.shippingGstPartial}
																	onChange={(e) => handleVariationChange(index, 'shippingGstPartial', e.target.value)}
																	readOnly
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>Total Shipping Charge</Label>
																<Input
																	type="number"
																	placeholder="Total Shipping Charge"
																	value={variation.shippingCharge}
																	onChange={(e) => handleVariationChange(index, 'shippingCharge', e.target.value)}
																	readOnly
																/>
															</Col>
															<Col md={12} className="mb-2">
																<Label>TCS Amount</Label>
																<Input
																	type="number"
																	placeholder="TCS Amount"
																	value={variation.tcsAmount}
																	onChange={(e) => handleVariationChange(index, 'tcsAmount', e.target.value)}
																	readOnly
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Product Price</Label>
																<Input
																	type="number"
																	placeholder="Product Price"
																	value={variation.productPrice}
																	readOnly
																	onChange={(e) => handleVariationChange(index, 'productPrice', e.target.value)}
																/>
															</Col>

															<Col md={12} className="mb-2">
																<Label>Stock Quantity</Label>
																<Input
																	type="number"
																	placeholder="Stock Quantity"
																	value={variation.stockQty}
																	onChange={(e) => handleVariationChange(index, 'stockQty', e.target.value)}
																/>
															</Col>
															<Col md={12} className="mb-2">
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
						</Row>
					</AccordionBody>
				</AccordionItem>
			</Accordion>
			<Row>
				<Col sm={12} className="my-3 text-end">
					<Button
						className="btn btn-primary"
						onClick={handleSaveDetails}
					>
						Submit Listing
					</Button>
				</Col>
			</Row>
		</div>
	);
};

export default ProductDetails;