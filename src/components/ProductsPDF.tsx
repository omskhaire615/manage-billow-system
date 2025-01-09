import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Product } from "@/lib/types";

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
});

interface ProductsPDFProps {
  products: Product[];
}

export const ProductsPDF = ({ products }: ProductsPDFProps) => {
  return (
    <PDFViewer style={{ width: "100%", height: "600px" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Products Inventory</Text>
            <Text>Radhekrishn Hardware</Text>
          </View>

          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>Price</Text>
              <Text style={styles.tableCell}>Stock</Text>
              <Text style={styles.tableCell}>Dimensions</Text>
            </View>

            {products.map((product, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{product.name}</Text>
                <Text style={styles.tableCell}>{product.category}</Text>
                <Text style={styles.tableCell}>₹{product.price.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{product.stock}</Text>
                <Text style={styles.tableCell}>{product.dimensions}</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};