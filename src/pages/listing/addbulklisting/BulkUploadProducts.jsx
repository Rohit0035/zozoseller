import React, { useState } from "react";
import { Button, Input, Table } from "reactstrap";
import * as XLSX from "xlsx";
import { showToast } from "../../../components/ToastifyNotification";
import { downloadBulkTemplate } from "../../../utils/downloadTemplate";

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
