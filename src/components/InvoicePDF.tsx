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
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    marginBottom: 20,
  },
  tableContainer: {
    display: "flex",
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    padding: 5,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  total: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 14,
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
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.companyName}>Radhekrishn Hardware</Text>
          </View>

          <View>
            <Text>Customer: {invoice.customerName}</Text>
            <Text>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
          </View>

          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Product</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Price</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>

            {invoice.items.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{product?.name}</Text>
                  <Text style={styles.tableCell}>{item.quantity}</Text>
                  <Text style={styles.tableCell}>
                    ${item.price.toFixed(2)}
                  </Text>
                  <Text style={styles.tableCell}>
                    ${(item.quantity * item.price).toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.total}>
            <Text>Total: ${invoice.total.toFixed(2)}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};