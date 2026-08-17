'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  value: string;
  className?: string;
}

export function Barcode({ value, className }: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;
    try {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 16,
        height: 65,
        margin: 0,
        width: 1.1,
        
      });
    } catch {
      // Invalid characters for CODE128 (rare, e.g. certain unicode) — fail silently,
      // the barcode number is still shown as plain text elsewhere on the invoice.
    }
  }, [value]);

  if (!value) return null;

  return <svg ref={svgRef} className={className} role="img" aria-label={`Barcode ${value}`} />;
}
