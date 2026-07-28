import React from "react";
import {
  Page,
  View,
  Text,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import { numberToWords } from "../../utils/common";
import LogoLg from "../../assets/images/logo/logo.png";
import { formatDate, formatDateWithTime } from "../../utils/dateFormatter";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica"
  },
  row: { flexDirection: "row" },
  col50: { width: "50%" },
  textBold: { fontWeight: "bold" },
  box: {
    border: "1px solid #000",
    padding: 6,
    marginBottom: 6
  },
  table: {
    borderLeft: "1px solid #000",
    borderTop: "1px solid #000",
    marginTop: 8
  },
  tableRow: { 
    flexDirection: "row",
    minHeight: 20
  },
  cell: {
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: "3px 2px",
    fontSize: 8, // Smaller font size fits 10 columns cleanly
    textAlign: "center"
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#eee",
    fontSize: 8
  },
  textLeft: { textAlign: "left" },
  textRight: { textAlign: "right" }
});

const InvoicePdf = ({ order }) => {
  const items = order?.orderItems || [];
  const vendorState = order?.vendorId?.addressDetails?.pickupAddress?.state;
  const customerState = order?.shippingAddressId?.state;

  const isIntraState =
    vendorState?.trim()?.toLowerCase() ===
    customerState?.trim()?.toLowerCase();

  const gstSummary = items.reduce(
    (acc, item) => {
      const taxable = Number(item.subTotal || 0);
      const tax = Number(item.tax || 0);

      acc.taxable += taxable;

      if (isIntraState) {
        acc.cgst += tax / 2;
        acc.sgst += tax / 2;
      } else {
        acc.igst += tax;
      }

      acc.totalTax += tax;

      return acc;
    },
    { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalTax: 0 }
  );

  return (
    <Page size="A4" style={styles.page}>
      {/* LOGO */}
      <View style={[styles.row, { marginBottom: 10 }]}>
        <Image src={LogoLg} style={{ width: 180 }} />
      </View>

      {/* HEADER */}
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.textBold}>Sold By:</Text>
          <Text>{order?.vendorId?.businessDetails?.businessName}</Text>
          <Text>
            {order?.vendorId?.addressDetails?.billingAddress?.addressLine1},{" "}
            {order?.vendorId?.addressDetails?.billingAddress?.city},{" "}
            {order?.vendorId?.addressDetails?.billingAddress?.state} -{" "}
            {order?.vendorId?.addressDetails?.billingAddress?.pincode}
          </Text>

          <Text style={{ marginTop: 5 }}>
            PAN: {order?.vendorId?.businessDetails?.panCard}
          </Text>
          <Text>GST: {order?.vendorId?.businessDetails?.gstNo}</Text>

          {/* QR */}
          {order?.qr && (
            <Image
              src={order.qr}
              style={{ width: 70, height: 70, marginTop: 5 }}
            />
          )}

          <Text style={{ marginTop: 5 }}>
            Order No: {order?.orderId?.orderUniqueId}
          </Text>
          <Text>
            Order Date: {formatDateWithTime(order?.createdAt)}
          </Text>
        </View>

        <View style={[styles.col50, { textAlign: "right" }]}>
          <Text style={styles.textBold}>Billing Address:</Text>
          <Text>{order?.billingAddressId?.fullName}</Text>
          <Text>
            {order?.orderId?.billingAddressId?.houseNumber},{" "}
            {order?.orderId?.billingAddressId?.city},{" "}
            {order?.orderId?.billingAddressId?.state} -{" "}
            {order?.orderId?.billingAddressId?.pincode}
          </Text>

          <Text style={[styles.textBold, { marginTop: 8 }]}>
            Shipping Address:
          </Text>
          <Text>{order?.shippingAddressId?.fullName}</Text>
          <Text>
            {order?.orderId?.shippingAddressId?.houseNumber},{" "}
            {order?.orderId?.shippingAddressId?.city},{" "}
            {order?.orderId?.shippingAddressId?.state} -{" "}
            {order?.orderId?.shippingAddressId?.pincode}
          </Text>

          <Text style={{ marginTop: 8 }}>
            Invoice Number: IN-{formatDate(order?.createdAt, "yyyyMMdd")}-
            {order?.orderId?.orderUniqueId}
          </Text>
        </View>
      </View>

      {/* TABLE */}
      <View style={styles.table}>
        {/* HEADER ROW */}
        <View style={styles.tableRow}>
          <Text style={[styles.cell, styles.headerCell, { width: "4%" }]}>#</Text>
          <Text style={[styles.cell, styles.headerCell, styles.textLeft, { width: "26%" }]}>
            Description
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.textRight, { width: "10%" }]}>
            Unit Price
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.textRight, { width: "9%" }]}>
            Discount
          </Text>
          <Text style={[styles.cell, styles.headerCell, { width: "5%" }]}>Qty</Text>
          <Text style={[styles.cell, styles.headerCell, styles.textRight, { width: "12%" }]}>
            Net Amount
          </Text>
          <Text style={[styles.cell, styles.headerCell, { width: "6%" }]}>GST %</Text>
          <Text style={[styles.cell, styles.headerCell, { width: "9%" }]}>Tax Type</Text>
          <Text style={[styles.cell, styles.headerCell, styles.textRight, { width: "9%" }]}>
            Tax
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.textRight, { width: "10%" }]}>
            Total
          </Text>
        </View>

        {/* ITEM ROWS */}
        {items.map((item, i) => (
          <View style={styles.tableRow} key={item._id || i}>
            <Text style={[styles.cell, { width: "4%" }]}>{i + 1}</Text>
            
            <Text style={[styles.cell, styles.textLeft, { width: "26%" }]}>
              {item.productId?.name}
              {item.productId?.sku ? `\nSKU: ${item.productId.sku}` : ""}
            </Text>

            <Text style={[styles.cell, styles.textRight, { width: "10%" }]}>
              ₹{Number(item.salePrice || 0).toFixed(2)}
            </Text>

            <Text style={[styles.cell, styles.textRight, { width: "9%" }]}>
              ₹{Number(item.discount || 0).toFixed(2)}
            </Text>

            <Text style={[styles.cell, { width: "5%" }]}>{item.quantity}</Text>

            <Text style={[styles.cell, styles.textRight, { width: "12%" }]}>
              ₹{Number(item.subTotal || 0).toFixed(2)}
            </Text>

            <Text style={[styles.cell, { width: "6%" }]}>
              {item.productId?.taxCode || 0}%
            </Text>

            <Text style={[styles.cell, { width: "9%" }]}>
              {isIntraState ? "CGST +\nSGST" : "IGST"}
            </Text>

            <Text style={[styles.cell, styles.textRight, { width: "9%" }]}>
              ₹{Number(item.tax || 0).toFixed(2)}
            </Text>

            <Text style={[styles.cell, styles.textRight, { width: "10%" }]}>
              ₹{Number(item.total || 0).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* TOTALS */}
      <View style={[styles.box, { marginTop: 10 }]}>
        <Text style={styles.textBold}>Total: ₹{Number(order.total || 0).toFixed(2)}</Text>
      </View>

      <View style={styles.box}>
        <Text>
          Amount in words: {numberToWords(Math.round(order.total || 0))}
        </Text>
      </View>

      {/* SIGNATURE */}
      <View style={[styles.box, { alignItems: "flex-end" }]}>
        <Text>For {order?.vendorId?.businessDetails?.businessName}</Text>
        <Image src={LogoLg} style={{ height: 40, marginTop: 5 }} />
        <Text style={{ marginTop: 20 }}>Authorized Signatory</Text>
      </View>
    </Page>
  );
};

export default InvoicePdf;