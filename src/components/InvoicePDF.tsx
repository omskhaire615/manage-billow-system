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
    borderBottom: 0,
    paddingBottom: 10,
  },
  title: {
    fontSize: 36,
    color: "#FF3B30",
    marginBottom: 10,
  },
  address: {
    fontSize: 12,
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'right',
  },
  invoiceInfo: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'right',
  },
  customerInfo: {
    marginTop: 30,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
  },
  dotLine: {
    borderBottomWidth: 1,
    borderBottomStyle: 'dotted',
    borderBottomColor: '#000',
    marginVertical: 2,
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 8,
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: "bold",
  },
  column: {
    fontSize: 12,
  },
  slNo: { width: '10%' },
  description: { width: '40%' },
  qty: { width: '15%' },
  rate: { width: '15%' },
  amount: { width: '20%' },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 8,
    marginTop: 20,
  },
  rupeesInWords: {
    marginTop: 20,
    fontSize: 12,
  },
  terms: {
    marginTop: 40,
    fontSize: 12,
  },
  signature: {
    marginTop: 60,
    textAlign: 'right',
    fontSize: 12,
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
  const numberToWords = (num: number) => {
    // Simple implementation - you might want to use a library for this
    return `${num} Rupees Only`; // Placeholder implementation
  };

  return (
    <PDFViewer style={{ width: "100%", height: "600px" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Om Traders</Text>
            <Text style={styles.address}>Nandurdi, Devpur-Panchkeshwer Road</Text>
            <Text style={styles.address}>Niphad, Nashik</Text>
            <Text style={styles.address}>Pin Code - 422308</Text>
            
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceInfo}>Invoice No: {invoice.id.slice(0, 8)}</Text>
            <Text style={styles.invoiceInfo}>Invoice Date: {new Date(invoice.date).toLocaleDateString()}</Text>
          </View>

          <View style={styles.customerInfo}>
            <View style={styles.dotLine}>
              <Text>Name: {invoice.customerName}</Text>
            </View>
            <View style={styles.dotLine}>
              <Text>Address: {invoice.address}</Text>
            </View>
            <View style={styles.dotLine}>
              <Text>Phone Number: {invoice.phone}</Text>
            </View>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.columnHeader, styles.slNo]}>Sl.No.</Text>
              <Text style={[styles.columnHeader, styles.description]}>Description</Text>
              <Text style={[styles.columnHeader, styles.qty]}>Qty.</Text>
              <Text style={[styles.columnHeader, styles.rate]}>Rate</Text>
              <Text style={[styles.columnHeader, styles.amount]}>Amount</Text>
            </View>

            {invoice.items.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.column, styles.slNo]}>{index + 1}</Text>
                  <Text style={[styles.column, styles.description]}>{product?.name}</Text>
                  <Text style={[styles.column, styles.qty]}>{item.quantity}</Text>
                  <Text style={[styles.column, styles.rate]}>₹{item.price.toFixed(2)}</Text>
                  <Text style={[styles.column, styles.amount]}>
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </Text>
                </View>
              );
            })}

            <View style={styles.total}>
              <Text>Total</Text>
              <Text>₹{invoice.total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.rupeesInWords}>
            <Text>Rupees in words: {numberToWords(invoice.total)}</Text>
          </View>

          <View style={styles.terms}>
            <Text>Terms & Conditions:</Text>
          </View>

          <View style={styles.signature}>
            <Text>Signature</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};