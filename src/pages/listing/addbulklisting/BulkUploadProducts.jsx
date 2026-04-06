import React, { useState } from "react";
import { Button, Input, Table } from "reactstrap";
import * as XLSX from "xlsx";
import { showToast } from "../../../components/ToastifyNotification";
import { downloadBulkTemplate } from "../../../utils/downloadTemplate";
import { FaTimesCircle } from "react-icons/fa";

/* ================= REQUIRED FIELDS ================= */
const REQUIRED_FIELDS = [
	"name",
	"sku",
	"regularPrice",
	"stockQty",
	"minStockQty",
	"minOrderQuantity",
	"packageLength",
	"packageBreadth",
	"packageHeight",
	"packageWeight",
	"countryOfOrigin"
];

const BulkUploadProducts = ({ listingData, onListingDataChange }) => {
	const [rows, setRows] = useState([]);
	const [errors, setErrors] = useState([]);

	/* ================= FILE UPLOAD ================= */
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (evt) => {
			const data = new Uint8Array(evt.target.result);
			const workbook = XLSX.read(data, { type: "array" });
			const sheet = workbook.Sheets[workbook.SheetNames[0]];
			const parsedData = XLSX.utils.sheet_to_json(sheet);

			validateRows(parsedData);
		};

		reader.readAsArrayBuffer(file);
	};

	const renderImagePreview = (file, rowIndex) => {
		if (!file) return null;

		return (
			<div style={{ position: "relative", display: "inline-block", marginTop: 5 }}>
				<img
					src={URL.createObjectURL(file)}
					alt="preview"
					style={{ width: 100, height: 100, objectFit: "cover" }}
				/>
				<FaTimesCircle
					className="text-danger position-absolute"
					style={{ top: '2px', right: '2px', cursor: 'pointer', background: 'white', borderRadius: '50%' }}
					onClick={() => removeMainImage(rowIndex)}
				/>
			</div>
		);
	};

	const renderGalleryPreview = (files, rowIndex) => {
		if (!files || files.length === 0) return null;

		return (
			<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 5 }}>
				{files.map((file, i) => (
					<div key={i} style={{ position: "relative" }}>
						<img
							src={URL.createObjectURL(file)}
							alt="gallery"
							style={{ width: 100, height: 100, objectFit: "cover" }}
						/>
						<FaTimesCircle
							className="text-danger position-absolute"
							style={{ top: '2px', right: '2px', cursor: 'pointer', background: 'white', borderRadius: '50%' }}
							onClick={() => removeGalleryImage(rowIndex, i)}
						/>
					</div>
				))}
			</div>
		);
	};

	const renderVideoPreview = (files, rowIndex) => {
		if (!files || files.length === 0) return null;

		return (
			<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 5 }}>
				{files.map((file, i) => (
					<div key={i} style={{ position: "relative" }}>
						<video width="200" controls>
							<source src={URL.createObjectURL(file)} />
						</video>
						<FaTimesCircle
							className="text-danger position-absolute"
							style={{ top: '2px', right: '2px', cursor: 'pointer', background: 'white', borderRadius: '50%' }}
							onClick={() => removeVideo(rowIndex, i)}
						/>
					</div>
				))}
			</div>
		);
	};

	const removeMainImage = (rowIndex) => {
		updateRow(rowIndex, "mainImage", null);
	};

	const removeGalleryImage = (rowIndex, imgIndex) => {
		const updated = [...rows[rowIndex].galleryImages];
		updated.splice(imgIndex, 1);
		updateRow(rowIndex, "galleryImages", updated);
	};

	const removeVideo = (rowIndex, videoIndex) => {
		const updated = [...rows[rowIndex].videos];
		updated.splice(videoIndex, 1);
		updateRow(rowIndex, "videos", updated);
	};

	/* ================= VALIDATION ================= */
	const validateRows = (data) => {
		// ✅ No products in file
		if (!data || data.length === 0) {
			setErrors([]);
			setRows([]);
			showToast("error", "No products found in uploaded file");
			return;
		}

		const validationErrors = [];

		data.forEach((row, index) => {
			REQUIRED_FIELDS.forEach((field) => {
				if (row[field] === undefined || row[field] === "") {
					validationErrors.push({
						row: index + 2,
						field,
						message: `${field} is required`
					});
				}
			});
		});

		if (validationErrors.length) {
			setErrors(validationErrors);
			setRows([]);
			showToast("error", "Validation errors found in file");
			return;
		}

		const normalizedRows = data.map((row) => ({
			...row,
			mainImage: null,
			galleryImages: [],
			videos: []
		}));

		setErrors([]);
		setRows(normalizedRows);

		onListingDataChange({
			bulkProducts: normalizedRows.map((item) => ({
				...item,
				categoryId: listingData.categoryId,
				subCategoryOneId: listingData.subCategoryOneId,
				subCategoryTwoId: listingData.subCategoryTwoId,
				brandId: listingData.brandId
			}))
		});

		showToast("success", "File validated successfully");
	};

	/* ================= ROW UPDATE ================= */
	const updateRow = (index, key, value) => {
		setRows((prevRows) => {
			const updatedRows = [...prevRows];
			updatedRows[index] = {
				...updatedRows[index],
				[key]: value
			};

			// 🔥 SYNC WITH PARENT STATE
			onListingDataChange({
				bulkProducts: updatedRows.map((item) => ({
					...item,
					categoryId: listingData.categoryId,
					subCategoryOneId: listingData.subCategoryOneId,
					subCategoryTwoId: listingData.subCategoryTwoId,
					brandId: listingData.brandId
				}))
			});

			return updatedRows;
		});
	};


	return (
		<>
			<Button color="primary" className="mb-3" onClick={downloadBulkTemplate}>
				Download Excel Template
			</Button>

			<Input
				type="file"
				accept=".xlsx,.csv"
				onChange={handleFileUpload}
				className="mb-3"
			/>

			{/* ================= ERRORS ================= */}
			{errors.length > 0 && (
				<Table bordered>
					<thead>
						<tr>
							<th>Row</th>
							<th>Field</th>
							<th>Error</th>
						</tr>
					</thead>
					<tbody>
						{errors.map((err, i) => (
							<tr key={i}>
								<td>{err.row}</td>
								<td>{err.field}</td>
								<td className="text-danger">{err.message}</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}

			{/* ================= PREVIEW + MEDIA ================= */}
			{rows.length > 0 && (
				<>
					<h6 className="mt-4">Products Preview</h6>

					<Table bordered responsive hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>SKU</th>
								<th>Regular Price</th>
								<th>Stock Qty</th>
								<th>Main Image</th>
								<th>Gallery Images</th>
								<th>Videos</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row, index) => (
								<tr key={index}>
									<td>{row.name}</td>
									<td>{row.sku}</td>
									<td>{row.regularPrice}</td>
									<td>{row.stockQty}</td>

									<td>
										<Input
											type="file"
											accept="image/*"
											onChange={(e) =>
												updateRow(index, "mainImage", e.target.files[0])
											}
										/>
										{renderImagePreview(row.mainImage, index)}
									</td>

									<td>
										<Input
											type="file"
											multiple
											accept="image/*"
											onChange={(e) =>
												updateRow(
													index,
													"galleryImages",
													Array.from(e.target.files)
												)
											}
										/>
										{renderGalleryPreview(row.galleryImages, index)}
									</td>

									<td>
										<Input
											type="file"
											multiple
											accept="video/*"
											onChange={(e) =>
												updateRow(
													index,
													"videos",
													Array.from(e.target.files)
												)
											}
										/>
										{renderVideoPreview(row.videos, index)}
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</>
			)}
		</>
	);
};

export default BulkUploadProducts;
