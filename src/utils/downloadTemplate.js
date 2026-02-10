// utils/downloadBulkTemplate.js
import * as XLSX from "xlsx";

export const downloadBulkTemplate = () => {
  const headers = [
    "name",
    "sku",
    "description",
    "regularPrice",
    "salePrice",
    "stockQty",
    "minStockQty",
    "minOrderQuantity",
    "packageLength",
    "packageBreadth",
    "packageHeight",
    "packageWeight",
    "countryOfOrigin",
    "luxuryCess",
    "manufacturerDetails",
    "packerDetails",
    "importerDetails"
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, "bulk-product-template.xlsx");
};
