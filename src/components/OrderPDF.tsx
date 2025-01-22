import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#000000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "#666666",
  },
  table: {
    display: "table",
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    paddingTop: 8,
    paddingBottom: 8,
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
  },
  tableCol: {
    width: "25%",
  },
  tableCell: {
    fontSize: 12,
    textAlign: "left",
  },
  total: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderTopStyle: "solid",
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },
});

interface OrderPDFProps {
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export const OrderPDF = ({ orderItems, total }: OrderPDFProps) => {
  return (
    <PDFViewer style={{ width: "100%", height: "600px" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Order Details</Text>
            <Text style={styles.date}>
              Date: {new Date().toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Product</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Quantity</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Price</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total</Text>
              </View>
            </View>

            {orderItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>₹{item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.total}>Total: ₹{total.toFixed(2)}</Text>
        </Page>
      </Document>
    </PDFViewer>
  );
};