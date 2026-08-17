'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { InvoicePDFDocument } from '@/components/invoices/InvoicePDFDocument';
import { generateBarcodeDataUrl } from '@/lib/invoice/barcodeImage';
import type { Invoice } from '@/types/invoice';
import type { UserProfile } from '@/types/user';

interface DownloadInvoicePdfButtonProps {
  invoice: Invoice;
  profile: Pick<
    UserProfile,
    'companyName' | 'dutyParagraph' | 'businessRegNo' | 'bankAccount' | 'serviceCenter'
  >;
}

export function DownloadInvoicePdfButton({ invoice, profile }: DownloadInvoicePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
      const barcodeDataUrl = generateBarcodeDataUrl(invoice.barcodeNumber);
      const blob = await pdf(
        <InvoicePDFDocument invoice={invoice} profile={profile} barcodeDataUrl={barcodeDataUrl} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.barcodeNumber || invoice._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('PDF তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? <Loader2 className="animate-spin" /> : <Download />}
      PDF ডাউনলোড
    </Button>
  );
}
