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
    fontSize: 12,
  },
  headerStrip: {
    height: 40,
    backgroundColor: "#4A1010",
    flexDirection: "row",
    marginBottom: 20,
  },
  redStrip: {
    backgroundColor: "#ea384c",
    width: "30%",
    transform: "skewX(-20deg)",
    marginLeft: -20,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 5,
    color: "#ea384c",
  },
  address: {
    fontSize: 12,
    color: "#333333",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderColor: "#ea384c",
    borderWidth: 1,
  },
  leftInfo: {
    width: "50%",
    padding: 8,
    borderRightColor: "#ea384c",
    borderRightWidth: 1,
  },
  rightInfo: {
    width: "50%",
    padding: 8,
  },
  label: {
    fontSize: 10,
    marginBottom: 4,
  },
  value: {
    fontSize: 11,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderBottomColor: "#ea384c",
    borderBottomWidth: 1,
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#ea384c",
    borderBottomWidth: 0.5,
    padding: 8,
  },
  slNoCell: {
    width: "10%",
  },
  descriptionCell: {
    width: "40%",
  },
  qtyCell: {
    width: "15%",
    textAlign: "center",
  },
  rateCell: {
    width: "15%",
    textAlign: "right",
  },
  amountCell: {
    width: "20%",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    borderTopColor: "#ea384c",
    borderTopWidth: 1,
  },
  rupeesInWords: {
    marginTop: 20,
    padding: 8,
    borderColor: "#ea384c",
    borderWidth: 1,
  },
  termsContainer: {
    marginTop: 20,
  },
  signatureContainer: {
    marginTop: 40,
    alignItems: "flex-end",
    paddingRight: 30,
  },
  footerStrip: {
    height: 40,
    backgroundColor: "#4A1010",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
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
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    if (num === 0) return "Zero";
    
    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return "";
      
      if (n < 10) return units[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "");
      return units[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "");
    };
    
    const numStr = Math.floor(num).toString();
    const decimal = Math.round((num % 1) * 100);
    
    let result = "";
    if (numStr.length > 3) {
      const thousands = parseInt(numStr.substring(0, numStr.length - 3));
      const remaining = parseInt(numStr.substring(numStr.length - 3));
      if (thousands) {
        result += convertLessThanThousand(thousands) + " Thousand ";
      }
      if (remaining) {
        result += convertLessThanThousand(remaining);
      }
    } else {
      result = convertLessThanThousand(parseInt(numStr));
    }
    
    return `${result} Rupees${decimal ? ` and ${decimal} Paise` : ''} Only`;
  };

  return (
    <PDFViewer style={{ width: "100%", height: "600px" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headerStrip}>
            <View style={styles.redStrip} />
          </View>
          
          <View style={styles.header}>
            <Text style={styles.title}>OM TRADERS</Text>
            <Text style={styles.address}>nanduedi, niphad 422308</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.leftInfo}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{invoice.customerName}</Text>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{invoice.customerAddress || "-"}</Text>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{invoice.customerPhone || "-"}</Text>
            </View>
            <View style={styles.rightInfo}>
              <Text style={styles.label}>INVOICE</Text>
              <Text style={styles.label}>Invoice No:</Text>
              <Text style={styles.value}>{invoice.id}</Text>
              <Text style={styles.label}>Invoice Date:</Text>
              <Text style={styles.value}>
                {new Date(invoice.date).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.slNoCell}>Sl.No.</Text>
              <Text style={styles.descriptionCell}>Description</Text>
              <Text style={styles.qtyCell}>Qty.</Text>
              <Text style={styles.rateCell}>Rate</Text>
              <Text style={styles.amountCell}>Amount</Text>
            </View>

            {invoice.items.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.slNoCell}>{index + 1}</Text>
                  <Text style={styles.descriptionCell}>{product?.name}</Text>
                  <Text style={styles.qtyCell}>{item.quantity}</Text>
                  <Text style={styles.rateCell}>₹{item.price.toFixed(2)}</Text>
                  <Text style={styles.amountCell}>
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </Text>
                </View>
              );
            })}

            <View style={styles.totalRow}>
              <Text style={styles.amountCell}>
                Total: ₹{invoice.total.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.rupeesInWords}>
            <Text>Amount in words: {numberToWords(invoice.total)}</Text>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.label}>Terms & Conditions:</Text>
            <Text>1. Goods once sold will not be taken back</Text>
            <Text>2. Payment should be made at the time of delivery</Text>
          </View>

          <View style={styles.signatureContainer}>
            <Text>Authorized Signatory</Text>
          </View>

          <View style={styles.footerStrip}>
            <View style={[styles.redStrip, { marginLeft: "auto" }]} />
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};