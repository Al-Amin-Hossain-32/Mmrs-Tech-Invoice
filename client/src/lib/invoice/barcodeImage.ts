import JsBarcode from 'jsbarcode';

export function generateBarcodeDataUrl(value: string): string | null {
  if (typeof document === 'undefined' || !value) return null;

  try {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, value, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 16,
      height: 50,
      margin: 4,
      width: 2,
    });
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}
