
interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 128 }: QRCodeProps) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=FEF3E2&color=92400E&margin=10`;
  
  return (
    <div className="inline-block p-2 bg-white rounded-lg shadow-md border border-amber-200">
      <img
        src={qrCodeUrl}
        alt="QR Code"
        className="block"
        style={{ width: size, height: size }}
      />
      <p className="text-xs text-amber-700 text-center mt-2">Scan to Track</p>
    </div>
  );
}