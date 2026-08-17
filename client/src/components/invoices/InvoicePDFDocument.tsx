import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

import { formatAmount } from '@/lib/invoice/format';
import type { Invoice } from '@/types/invoice';
import type { UserProfile } from '@/types/user';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 9.5, fontFamily: 'Helvetica', color: '#171717' },
  box: { border: '1pt solid #262626' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1pt solid #262626',
    padding: 14,
  },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold' },
  barcodeImg: { width: 160, height: 45 },
  infoGrid: {
    flexDirection: 'row',
    borderBottom: '1pt solid #262626',
    padding: 14,
  },
  infoCol: { flex: 1, paddingRight: 10 },
  infoRow: { flexDirection: 'row', paddingVertical: 2 },
  infoLabel: { width: 140, color: '#404040' },
  infoValue: { flex: 1 },
  spacer: { height: 8 },
  table: { padding: 14 },
  tableRow: { flexDirection: 'row' },
  th: {
    flex: 1,
    backgroundColor: '#BEE1FF',
    border: '0.5pt solid #a3a3a3',
    // margin:"auto",
    padding: 5,
    textAlign: "center",
    fontFamily: 'Helvetica-Bold',
  },
  td: { flex: 1, border: '0.5pt solid #a3a3a3',textAlign: "center", padding: 5 },
  
  subtotalCell: {
    flex: 1,
    backgroundColor: '#BEE1FF',
    border: '0.5pt solid #a3a3a3',
    padding: 5,
    textAlign:"center",
    fontFamily: 'Helvetica-Bold',
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1pt solid #262626',
    padding: 14,
    paddingTop: 60,
  },
  signatureLine: { borderTop: '0.5pt solid #737373', width: '45%', paddingTop: 2 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
});

interface InvoicePDFDocumentProps {
  invoice: Invoice;
  profile: Pick<
    UserProfile,
    'companyName' | 'dutyParagraph' | 'businessRegNo' | 'bankAccount' | 'serviceCenter'
  >;
  barcodeDataUrl: string | null;
}

export function InvoicePDFDocument({ invoice, profile, barcodeDataUrl }: InvoicePDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>{invoice.invoiceType || 'Retail Invoice'}</Text>
            {barcodeDataUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text -- this is @react-pdf/renderer's Image, not next/image; it has no alt prop
              <Image src={barcodeDataUrl} style={styles.barcodeImg} />
            )}
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <InfoRow label="Company Name :" value={profile.companyName} />
              <InfoRow label="Duty Paragraph:" value={profile.dutyParagraph} />
              <View style={styles.spacer} />
              <InfoRow label="Business Registration No:" value={profile.businessRegNo} />
              <InfoRow label="Bank Account:" value={profile.bankAccount} />
              <InfoRow label="Service Center Name :" value={profile.serviceCenter?.name} />
              <InfoRow label="Service Center Address :" value={profile.serviceCenter?.address} />
              <InfoRow label="Service Center Contact :" value={profile.serviceCenter?.contact} />
            </View>
            <View style={styles.infoCol}>
              <InfoRow label="Jobsheet Order :" value={invoice.jobsheetOrder} />
              <InfoRow label="Jobsheet Date :" value={invoice.jobsheetDate} />
              <View style={styles.spacer} />
              <InfoRow label="Payment Date:" value={invoice.paymentDate} />
              <InfoRow label="Customer Name:" value={invoice.customerDetails.name} />
              <InfoRow label="Customer Address:" value={invoice.customerDetails.address} />
              <InfoRow label="Customer Mobile No:" value={invoice.customerDetails.mobileNo} />
              <InfoRow label="E-Mail ID:" value={invoice.customerDetails.email} />
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.th}>Payment Date</Text>
              <Text style={styles.th}>Service Fee</Text>
              <Text style={styles.th}>Amount</Text>
            </View>
            {invoice.items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.td}>{item.paymentDate}</Text>
                <Text style={styles.td}>{item.serviceFee}</Text>
                <Text style={styles.td}>{formatAmount(item.amount)}</Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={[styles.subtotalCell, { flex: 2 }]}>Subtotal</Text>
              <Text style={styles.subtotalCell}>{formatAmount(invoice.subtotal)}</Text>
            </View>
          </View>

          <View style={styles.signatures}>
            <Text style={styles.signatureLine}>Customer Signature with Name</Text>
            <Text style={styles.signatureLine}>Signature of Service Center</Text>
          </View>
          <View style={styles.footerRow}>
            <Text>Signature Date: {invoice.signatureDate}</Text>
            <Text>{profile.serviceCenter?.sealName}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || ' '}</Text>
    </View>
  );
}
