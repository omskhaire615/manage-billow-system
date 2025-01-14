import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Invoice } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  customerInfo: {
    marginTop: 30,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
    backgroundColor: "#f0f0f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 5,
  },
  columnHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
  },
  column: {
    flex: 1,
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
  },
  total: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export const InvoicePDF = ({ invoice, products }: InvoicePDFProps) => {
  return (
    <PDFViewer style={{ width: "100%", height: "600px" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>OM TRADERS</Text>
            <Text style={styles.address}>
              Nandurdi, Devpur-Panchkeshwer Road 422308
            </Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={styles.label}>Name: {invoice.customerName}</Text>
            <Text style={styles.label}>
              Date: {new Date(invoice.date).toLocaleDateString()}
            </Text>
            <Text style={styles.label}>Invoice No: {invoice.id.slice(0, 8)}</Text>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, { flex: 2 }]}>Product</Text>
              <Text style={styles.columnHeader}>Quantity</Text>
              <Text style={styles.columnHeader}>Rate</Text>
              <Text style={styles.columnHeader}>Amount</Text>
            </View>

            {invoice.items.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.column, { flex: 2 }]}>
                    {product?.name}
                  </Text>
                  <Text style={styles.column}>{item.quantity}</Text>
                  <Text style={styles.column}>₹{item.price.toFixed(2)}</Text>
                  <Text style={styles.column}>
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.total}>
            <Text>Total Amount: ₹{invoice.total.toFixed(2)}</Text>
          </View>

          <View style={styles.footer}>
            <Text>MO.NO : 9326070047 / 9689326627</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};