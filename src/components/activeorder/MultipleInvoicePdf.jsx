import React from "react";
import { Document } from "@react-pdf/renderer";
import InvoicePdf from "./InvoicePdf";

const MultiInvoicePdf = ({ orders }) =>
  <Document>
    {orders.map((row, i) => <InvoicePdf key={i} order={row.order} />)}
  </Document>;

export default MultiInvoicePdf;
