import React, { useEffect, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const scannerElementId = 'camera-scanner-reader';

    const startScanner = async () => {
      try {
        const qr = new Html5Qrcode(scannerElementId);
        scannerRef.current = qr;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 200 },
          aspectRatio: 1.0,
        };

        await qr.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (isMounted) {
              onScanSuccess(decodedText);
              onClose();
            }
          },
          () => {
            // Ignore scan failure frames
          }
        );
      } catch (err) {
        console.warn('Unable to start camera scanner:', err);
      }
    };

    // Small delay to allow modal DOM to be visible
    const timer = setTimeout(startScanner, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .then(() => {
            try {
              scannerRef.current?.clear();
            } catch {
              // Ignore clear error
            }
            scannerRef.current = null;
          });
      }
    };
  }, [isOpen, onClose, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop show" id="camera-modal">
      <div className="modal-dialog modal-md">
        <div className="modal-header">
          <div className="modal-title">
            <Camera size={18} />
            <span>Live Camera Barcode Scanner</span>
          </div>
          <button type="button" className="modal-close-btn" id="close-cam-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="camera-stream-wrapper">
            <div id="camera-scanner-reader"></div>
            <div className="scanner-laser-line"></div>
          </div>
          <p className="camera-hint">Point your camera at any 1D/2D barcode or QR code on the product packet.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" id="cancel-cam-btn" onClick={onClose}>
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
