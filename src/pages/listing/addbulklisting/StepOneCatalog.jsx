import React, { useState } from 'react';
import { Button, Input, Table } from 'reactstrap';
import * as XLSX from 'xlsx';
import { showToast } from '../../../components/ToastifyNotification';

const REQUIRED_FIELDS = ['sku', 'name', 'regularPrice', 'stockQty'];

const StepOneCatalog = ({ listingData, onListingDataChange }) => {
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState([]);

  // ⬇️ Download format
  const downloadTemplate = () => {
    const headers = [[
      'sku',
      'name',
      'description',
      'regularPrice',
      'salePrice',
      'stockQty'
    ]];

    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'bulk-upload-format.xlsx');
  };

  // ⬆️ Upload & validate
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      validateData(data);
    };
    reader.readAsBinaryString(file);
  };

  const validateData = (data) => {
    const tempErrors = [];

    data.forEach((row, index) => {
      REQUIRED_FIELDS.forEach((field) => {
        if (!row[field]) {
          tempErrors.push({
            row: index + 2,
            message: `${field} is required`
          });
        }
      });
    });

    if (tempErrors.length > 0) {
      setErrors(tempErrors);
      setProducts([]);
      showToast('error', 'Please fix errors in file');
    } else {
      setErrors([]);
      setProducts(data);

      onListingDataChange({
        bulkProducts: data.map(item => ({
          ...item,
          categoryId: listingData.categoryId,
          subCategoryOneId: listingData.subCategoryOneId,
          subCategoryTwoId: listingData.subCategoryTwoId,
          brandId: listingData.brandId
        }))
      });

      showToast('success', 'File uploaded successfully');
    }
  };


  return (
    <>
      <Button color="primary" className="mb-3" onClick={downloadTemplate}>
        Download Format
      </Button>

      <Input
        type="file"
        accept=".xlsx,.csv"
        onChange={handleFileUpload}
        className="mb-3"
      />

      {/* ❌ Errors */}
      {errors.length > 0 && (
        <Table bordered>
          <thead>
            <tr>
              <th>Row</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((err, i) => (
              <tr key={i}>
                <td>{err.row}</td>
                <td className="text-danger">{err.message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ✅ Product Preview */}
      {products.length > 0 && (
        <>
          <h6 className="mt-4">Products to be uploaded</h6>
          <Table bordered>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.regularPrice}</td>
                  <td>{p.stockQty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default StepOneCatalog;
