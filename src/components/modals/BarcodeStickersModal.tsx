import React, { useState, useEffect } from 'react';
import { Tags, X, Printer } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { Product } from '../../types';

interface BarcodeStickersModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const BarcodeStickersModal: React.FC<BarcodeStickersModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const [copies, setCopies] = useState<number>(2);

  const displayProducts = products.slice(0, 15);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      displayProducts.forEach((p, pIdx) => {
        for (let c = 0; c < copies; c++) {
          const svgEl = document.getElementById(`sticker-barcode-${pIdx}-${c}`);
          if (svgEl) {
            try {
              JsBarcode(svgEl, p.barcode, {
                format: 'CODE128',
                width: 1.2,
                height: 25,
                displayValue: true,
                fontSize: 9,
              });
            } catch (err) {
              console.warn('Barcode sticker error:', err);
            }
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, copies, displayProducts]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop show" id="barcode-stickers-modal">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <div className="modal-title">
            <Tags size={18} />
            <span>Print Product Barcode Stickers / Price Tags</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            id="close-stickers-modal-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="sticker-controls">
            <span>Sticker Quantity per Item:</span>
            <input
              type="number"
              id="sticker-copies-input"
              value={copies}
              min="1"
              max="20"
              className="mini-number-input"
              onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              id="print-stickers-btn"
              onClick={handlePrint}
            >
              <Printer size={16} /> Print Sticker Sheet
            </button>
          </div>
          <div className="stickers-sheet" id="stickers-sheet-target">
            {displayProducts.map((p, pIdx) =>
              Array.from({ length: copies }).map((_, c) => (
                <div key={`${p.id}-${c}`} className="barcode-sticker">
                  <span className="sticker-store">SUPER BACHAT BAZZAR</span>
                  <span className="sticker-name">{p.name}</span>
                  <div className="sticker-prices">
                    <span className="sticker-rate">Rate: ₹{p.rate}</span>
                    <span className="sticker-mrp">MRP: ₹{p.mrp}</span>
                  </div>
                  <svg id={`sticker-barcode-${pIdx}-${c}`} className="sticker-barcode-svg"></svg>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
