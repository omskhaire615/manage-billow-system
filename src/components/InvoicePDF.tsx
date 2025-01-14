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
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: 2,
    borderColor: "#000000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    marginBottom: 5,
    fontWeight: "bold",
  },
  address: {
    fontSize: 12,
    marginBottom: 10,
  },
  contact: {
    fontSize: 10,
    marginTop: 5,
    borderTop: 2,
    borderColor: "#000000",
    paddingTop: 10,
  },
  customerInfo: {
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    marginBottom: 10,
  },
  value: {
    fontSize: 11,
    marginLeft: 10,
  },
  tableContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 5,
    paddingTop: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#000000",
    paddingBottom: 5,
    paddingTop: 5,
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
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    paddingTop: 5,
  },
  rupeesInWords: {
    marginTop: 20,
    marginBottom: 20,
  },
  signatureContainer: {
    marginTop: 40,
    alignItems: "flex-end",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTop: 2,
    borderColor: "#000000",
    paddingTop: 10,
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
          <View style={styles.header}>
            <Text style={styles.title}>OM TRADERS</Text>
            <Text style={styles.address}>
              Nandurdi, Devpur-Panchkeshwer Road 422308
            </Text>
            <Text style={styles.address}>
              Hardware, Electronics and general store
            </Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={styles.label}>
              Name: <Text style={styles.value}>{invoice.customerName}</Text>
            </Text>
            <Text style={styles.label}>
              Address:{" "}
              <Text style={styles.value}>{invoice.customerAddress || "-"}</Text>
            </Text>
            <Text style={styles.label}>
              Phone Number:{" "}
              <Text style={styles.value}>{invoice.customerPhone || "-"}</Text>
            </Text>
            <Text style={styles.label}>
              Invoice No: <Text style={styles.value}>{invoice.id}</Text>
            </Text>
            <Text style={styles.label}>
              Date:{" "}
              <Text style={styles.value}>
                {new Date(invoice.date).toLocaleDateString()}
              </Text>
            </Text>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.slNoCell}>Sr.No.</Text>
              <Text style={styles.descriptionCell}>Description</Text>
              <Text style={styles.qtyCell}>Qty</Text>
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

          <View style={styles.signatureContainer}>
            <Text>Authorized Signatory</Text>
          </View>

          <View style={styles.footer}>
            <Text>MO.NO : 9326070047 / 9689326627</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
