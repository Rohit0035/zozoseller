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
    padding: 15,
    fontSize: 12,
    fontFamily: "Helvetica"
  },
  row: { flexDirection: "row" },
  col50: { width: "50%" },
  textBold: { fontWeight: "bold" },
  box: {
    border: "1px solid black",
    padding: 6,
    marginBottom: 6
  },
  table: {
    border: "1px solid black",
    marginTop: 8
  },
  tableRow: { flexDirection: "row" },
  cell: {
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    padding: 4
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#eee"
  }
});

const InvoicePdf = ({ order }) => {
  const items = order?.orderItems || [];

  return (
    <Page size="A4" style={styles.page}>
      {/* LOGO */}
      <View style={[styles.row, { marginBottom: 10 }]}>
        <Image src={LogoLg} style={{ width: 200 }} />
      </View>

      {/* HEADER */}
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.textBold}>Sold By:</Text>
          <Text>{order.vendorId?.businessDetails?.businessName}</Text>
          <Text>{order.vendorId?.addressDetails?.billingAddress}</Text>

          <Text style={{ marginTop: 5 }}>
            PAN: {order.vendorId?.businessDetails?.panCard}
          </Text>
          <Text>GST: {order.vendorId?.businessDetails?.gstNo}</Text>

          {/* ✅ QR */}
          {order.qr && (
            <Image
              src={order.qr}
              style={{ width: 80, height: 80, marginTop: 5 }}
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
          <Text>{order.shippingAddress?.fullName}</Text>
          <Text>
            {order.shippingAddress?.houseNumber},{" "}
            {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.state} -{" "}
            {order.shippingAddress?.pinCode}
          </Text>

          <Text style={[styles.textBold, { marginTop: 8 }]}>
            Shipping Address:
          </Text>
          <Text>{order.shippingAddress?.fullName}</Text>
          <Text>
            {order.shippingAddress?.houseNumber},{" "}
            {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.state} -{" "}
            {order.shippingAddress?.pinCode}
          </Text>

          <Text style={{ marginTop: 8 }}>
            Invoice Number: IN-
            {formatDate(order?.createdAt, "yyyymmdd")}-
            {order?.orderId?.orderUniqueId}
          </Text>
        </View>
      </View>

      {/* TABLE */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, styles.headerCell, { width: "5%" }]}>#</Text>
          <Text style={[styles.cell, styles.headerCell, { width: "40%" }]}>
            Description
          </Text>
          <Text style={[styles.cell, styles.headerCell, { width: "10%" }]}>
            Price
          </Text>
          <Text style={[styles.cell, styles.headerCell, { width: "8%" }]}>
            Qty
          </Text>
          <Text style={[styles.cell, styles.headerCell, { width: "12%" }]}>
            SubTotal
          </Text>
          <Text style={[styles.cell, styles.headerCell, { width: "10%" }]}>
            Tax
          </Text>
          <Text style={[styles.cell, styles.headerCell, { width: "15%", borderRight: 0 }]}>
            Total
          </Text>
        </View>

        {items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.cell, { width: "5%" }]}>{i + 1}</Text>
            <Text style={[styles.cell, { width: "40%" }]}>
              {item.productId?.name}
            </Text>
            <Text style={[styles.cell, { width: "10%" }]}>₹{item.salePrice}</Text>
            <Text style={[styles.cell, { width: "8%" }]}>{item.quantity}</Text>
            <Text style={[styles.cell, { width: "12%" }]}>₹{item.subTotal}</Text>
            <Text style={[styles.cell, { width: "10%" }]}>₹{item.tax}</Text>
            <Text style={[styles.cell, { width: "15%", borderRight: 0 }]}>
              ₹{item.total}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.box, { marginTop: 10 }]}>
        <Text style={styles.textBold}>Total: ₹{order.total}</Text>
      </View>

      <View style={styles.box}>
        <Text>
          Amount in words: {numberToWords(Math.round(order.total))}
        </Text>
      </View>

      {/* SIGNATURE */}
        <View style={[styles.box, { alignItems: "flex-end" }]}>
          <Text>
            For {order.vendorId?.businessDetails?.businessName}
          </Text>
          <Image
            src={LogoLg}
            style={{ height: 50, marginTop: 5 }}
          />
          <Text style={{ marginTop: 25 }}>
            Authorized Signatory
          </Text>
        </View>
    </Page>
  );
};

export default InvoicePdf;