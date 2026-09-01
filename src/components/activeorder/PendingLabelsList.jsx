import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import {
	Card,
	CardBody,
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button
} from "reactstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
	generateShippingLabels,
	UpdateVendorOrderPackageDetails,
	UpdateVendorOrderStatus
} from "../../api/vendorOrderAPI";
import { useDispatch } from "react-redux";
import { showToast } from "../ToastifyNotification";
import QRCode from "qrcode";
import { Document, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdf from "./InvoicePdf";
import { FaFileInvoice, FaQrcode } from "react-icons/fa";

const allColumns = (generateQr, downloadQR) => [
	{
		name: "S.No.",
		cell: (row, index) => index + 1,
		width: "80px"
	},
	{
		name: "Order ID",
		selector: row => row.orderUniqueId,
		sortable: true
	},
	{
		name: "Sub Order ID",
		selector: row => row.subOrderUniqueId,
		sortable: true
	},
	{
		name: "Product Information",
		selector: row => row.productInfo,
		sortable: true
	},
	{
		name: "SKU",
		selector: row => row.skuNo,
		sortable: true
	},
	{
		name: "Amount",
		selector: row => row.amount,
		sortable: true
	},
	{
		name: "Status",
		selector: row => row.status,
		sortable: true
	},
	// ✅ QR Download
	{
		name: "QR",
		cell: (row) => (
			<button
				className="btn btn-sm btn-success"
				onClick={() => downloadQR(row)}
			>
				<FaQrcode /> QR
			</button>
		)
	},

	// ✅ Invoice
	{
		name: "Invoice",
		cell: (row) => {
			const [qr, setQr] = React.useState(null);

			React.useEffect(() => {
				generateQr(row.orderUniqueId).then(setQr);
			}, [row.orderUniqueId]);
			console.log(row);
			return (
				<PDFDownloadLink
					document={
						qr && (
							<Document>
								<InvoicePdf order={{ ...row.order, qr }} />
							</Document>
						)
					}
					fileName={`invoice_${row.orderUniqueId}.pdf`}
					className="btn btn-dark btn-sm"
				>
					<FaFileInvoice /> Invoice
				</PDFDownloadLink>
			);
		}
	},
];

const generateQr = async (value) => {
		return await QRCode.toDataURL(value);
	};

	const downloadQR = async (row) => {
		const qr = await generateQr(
			JSON.stringify({
				orderUniqueId:
					row.orderUniqueId,
				subOrderUniqueId:
					row.subOrderUniqueId,
				skuNo: row.skuNo,
			})
		);

		const link = document.createElement("a");
		link.href = qr;
		link.download = `${row.orderUniqueId}_qr.png`;
		link.click();
	};

const presets = {
	"Default View": allColumns(generateQr, downloadQR).map(col => col.name),
	"Full View": allColumns(generateQr, downloadQR).map(col => col.name)
};

const PendingLabelsList = ({ orders, fetchOrders, ALL_ALLOWED_STATUSES }) => {
	const dispatch = useDispatch();

	const [visibleColumns, setVisibleColumns] = useState(presets["Default View"]);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
	const [filterText, setFilterText] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [showLabelModal, setShowLabelModal] = useState(false);
	const [packageData, setPackageData] = useState({});
	const [sortConfig, setSortConfig] = useState({
		field: "orderUniqueId",
		order: "desc"
	});

	const filteredData = orders
		.filter(item =>
			Object.values(item).some(val =>
				val?.toString().toLowerCase().includes(filterText.toLowerCase())
			)
		)
		.sort((a, b) => {
			const field = sortConfig.field;
			const valA = a[field];
			const valB = b[field];

			if (sortConfig.order === "desc") {
				return valA < valB ? 1 : -1;
			}

			return valA > valB ? 1 : -1;
		});

	const toggleColumn = colName => {
		setVisibleColumns(prev =>
			prev.includes(colName)
				? prev.filter(c => c !== colName)
				: [...prev, colName]
		);
	};

	const applyPreset = preset => {
		setVisibleColumns(presets[preset]);
		setDropdownOpen(false);
	};

	const handleRowSelected = state => {
		setSelectedRows(state.selectedRows);
	};

	const handleSortSelect = (field, order = "desc") => {
		setSortConfig({ field, order });
		setSortDropdownOpen(false);
	};

	const columnsToShow = allColumns(generateQr,
    downloadQR).filter(col =>
		visibleColumns.includes(col.name)
	);

	const openLabelModal = () => {
		const init = {};

		selectedRows.forEach(row => {
			init[row.id] = {
				length: row.order?.packageDetails?.length || "",
				breadth: row.order?.packageDetails?.breadth || "",
				height: row.order?.packageDetails?.height || "",
				weight: row.order?.packageDetails?.weight || ""
			};
		});

		setPackageData(init);
		setShowLabelModal(true);
	};

	const handlePackageChange = (id, field, value) => {
		setPackageData(prev => ({
			...prev,
			[id]: {
				...prev[id],
				[field]: value
			}
		}));
	};

	const updateSinglePackage = async orderId => {
		const pkg = packageData[orderId];

		if (!pkg.length || !pkg.breadth || !pkg.height || !pkg.weight) {
			return showToast("error", "Please fill all fields");
		}

		dispatch({ type: "loader", loader: true });

		try {
			const res = await UpdateVendorOrderPackageDetails({
				orderId,
				length: pkg.length,
				breadth: pkg.breadth,
				height: pkg.height,
				weight: pkg.weight
			});

			if (res.success) {
				showToast("success", res.message);
				fetchOrders({
					orderStatus: ALL_ALLOWED_STATUSES
				});
			}
		} finally {
			dispatch({ type: "loader", loader: false });
		}
	};

	const handleGenerateLabels = async () => {
		const payload = {
			orders: selectedRows.map(row => ({
				orderId: row.id,
				packageDetails: packageData[row.id]
			}))
		};

		for (let item of payload.orders) {
			const p = item.packageDetails;
			if (!p.length || !p.breadth || !p.height || !p.weight) {
				return showToast("error", "Please fill all package details");
			}
		}

		dispatch({ type: "loader", loader: true });

		try {
			const res = await generateShippingLabels(payload);

			if (res.success) {
				showToast("success", res.message);
				setShowLabelModal(false);
				setSelectedRows([]);
				fetchOrders({
					orderStatus: ALL_ALLOWED_STATUSES
				});
			} else {
				showToast("error", res.message);
			}
		} finally {
			dispatch({ type: "loader", loader: false });
		}
	};

	const handleBulkCancel = async () => {
		if (!selectedRows.length) return;

		dispatch({ type: "loader", loader: true });

		try {
			await Promise.all(
				selectedRows.map(row =>
					UpdateVendorOrderStatus({
						id: row.id,
						status: "Cancelled"
					})
				)
			);

			showToast("success", "Orders cancelled successfully");
			fetchOrders({
				orderStatus: ALL_ALLOWED_STATUSES
			});

			setSelectedRows([]); // clear selection
		} finally {
			dispatch({ type: "loader", loader: false });
		}
	};

	return (
		<div>
			<Row className="mt-2">
				<Col md="6">
					<input
						type="text"
						className="form-control"
						placeholder="Search..."
						value={filterText}
						onChange={e => setFilterText(e.target.value)}
					/>
				</Col>

				<Col md="6">
					<div className="d-flex justify-content-end">
						<button
							className="btn btn-danger btn-sm me-2"
							disabled={!selectedRows.length}
							onClick={handleBulkCancel}
						>
							Cancel Orders
						</button>
						<button
							className="btn btn-warning btn-sm me-2"
							disabled={!selectedRows.length}
							onClick={openLabelModal}
						>
							Generate Labels
						</button>

						<div className="position-relative me-2">
							<button
								className="btn btn-primary btn-sm"
								onClick={() => setDropdownOpen(!dropdownOpen)}
							>
								Customize Columns <RiArrowDropDownLine size={20} />
							</button>

							{dropdownOpen && (
								<div className="position-absolute bg-white border p-2 shadow" style={{
									maxHeight: "250px",
									overflowY: "auto",
									zIndex: 1000
								}}>
									{allColumns.map(col => (
										<label key={col.name} className="dropdown-item">
											<input
												type="checkbox"
												checked={visibleColumns.includes(col.name)}
												onChange={() => toggleColumn(col.name)}
											/>
											{col.name}
										</label>
									))}
								</div>
							)}
						</div>

						<CSVLink
							data={selectedRows.length ? selectedRows : filteredData}
							filename="pending_labels.csv"
							className="btn btn-success btn-sm"
						>
							Export CSV
						</CSVLink>
					</div>
				</Col>
			</Row>

			<hr />

			<Card>
				<CardBody>
					<DataTable
						columns={columnsToShow}
						data={filteredData}
						pagination
						selectableRows
						onSelectedRowsChange={handleRowSelected}
						highlightOnHover
						responsive
					/>
				</CardBody>
			</Card>

			<Modal isOpen={showLabelModal} size="lg">
				<ModalHeader toggle={() => setShowLabelModal(false)}>
					Package Details
				</ModalHeader>

				<ModalBody>
					{selectedRows.map(row => {
						const pkg = packageData[row.id] || {};

						return (
							<div key={row.id} className="border p-3 rounded mb-3">
								{/* ✅ ORDER DETAILS */}
								<div className="mb-2">
									<strong>Order ID:</strong> {row.orderUniqueId} <br />
									<strong>Sub Order:</strong> {row.subOrderUniqueId} <br />
									<strong>Product:</strong> {row.productInfo} <br />
									<strong>SKU:</strong> {row.skuNo} <br />
									<strong>Qty:</strong> {row.quantity}
								</div>

								<Row>
									<Col md="3">
										<input
											className="form-control"
											placeholder="Length"
											value={pkg.length || ""}
											onChange={e =>
												handlePackageChange(row.id, "length", e.target.value)
											}
										/>
									</Col>
									<Col md="3">
										<input
											className="form-control"
											placeholder="Breadth"
											value={pkg.breadth || ""}
											onChange={e =>
												handlePackageChange(row.id, "breadth", e.target.value)
											}
										/>
									</Col>
									<Col md="3">
										<input
											className="form-control"
											placeholder="Height"
											value={pkg.height || ""}
											onChange={e =>
												handlePackageChange(row.id, "height", e.target.value)
											}
										/>
									</Col>
									<Col md="3">
										<input
											className="form-control"
											placeholder="Weight"
											value={pkg.weight || ""}
											onChange={e =>
												handlePackageChange(row.id, "weight", e.target.value)
											}
										/>
									</Col>
								</Row>

								<div className="text-end mt-2">
									<button
										className="btn btn-sm btn-primary"
										onClick={() => updateSinglePackage(row.id)}
									>
										Update
									</button>
								</div>
							</div>
						);
					})}
				</ModalBody>

				<ModalFooter>
					<Button onClick={() => setShowLabelModal(false)}>Cancel</Button>
					<Button color="warning" onClick={handleGenerateLabels}>
						Process Labels
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default PendingLabelsList;