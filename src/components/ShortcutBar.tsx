import React from 'react';

export const ShortcutBar: React.FC = () => {
  return (
    <div className="shortcut-bar">
      <div className="shortcut-item"><kbd>F4</kbd> Focus Barcode</div>
      <div className="shortcut-item"><kbd>F9</kbd> Scan with Camera</div>
      <div className="shortcut-item"><kbd>F8</kbd> Quick Checkout</div>
      <div className="shortcut-item"><kbd>Ctrl+P</kbd> Print Last Bill</div>
      <div className="shortcut-item"><kbd>Esc</kbd> Close Popup</div>
      <div className="store-tagline">✨ Super Bachat, Super Khushiyan! Wholesale Rates on Retail Items ✨</div>
    </div>
  );
};
