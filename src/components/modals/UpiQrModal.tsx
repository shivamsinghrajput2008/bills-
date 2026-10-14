import React, { useEffect, useRef } from 'react';
import { QrCode, X, CheckCheck } from 'lucide-react';
import QRCode from 'qrcode';
import { formatCurrency } from '../../utils/storage';

interface UpiQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPaid: () => void;
  amount: number;
  storeName: string;
  storeUpi: string;
}

export const UpiQrModal: React.FC<UpiQrModalProps> = ({
  isOpen,
  onClose,
  onConfirmPaid,
  amount,
  storeName,
  storeUpi,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const upiUri = `upi://pay?pa=${encodeURIComponent(storeUpi)}&pn=${encodeURIComponent(
      storeName
    )}&am=${amount.toFixed(2)}&cu=INR&tn=Bill%20Payment`;

    QRCode.toCanvas(
      canvasRef.current,
      upiUri,
      {
        width: 180,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.warn('QR Code generation error:', error);
      }
    );
  }, [isOpen, amount, storeName, storeUpi]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop show" id="upi-qr-modal">
      <div className="modal-dialog modal-sm">
        <div className="modal-header">
          <div className="modal-title">
            <QrCode size={18} />
            <span>Scan UPI QR to Pay</span>
          </div>
          <button type="button" className="modal-close-btn" id="close-upi-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body text-center">
          <div className="upi-store-badge">{storeName}</div>
          <div className="upi-amount-highlight" id="modal-upi-amount">
            {formatCurrency(amount)}
          </div>

          <div
            className="qr-code-container"
            id="modal-qrcode-target"
            style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}
          >
            <canvas ref={canvasRef}></canvas>
          </div>

          <div className="upi-supported-apps">
            <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM UPI</span>
          </div>
          <p className="upi-help-text">Ask customer to scan using any UPI App &amp; verify payment.</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-success btn-block"
            id="upi-confirm-paid-btn"
            onClick={onConfirmPaid}
          >
            <CheckCheck size={18} /> Payment Received - Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};
