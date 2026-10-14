import React, { useState } from 'react';
import {
  Store,
  ShieldAlert,
  Database,
  Check,
  Save,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { StoreSettings, Product, Bill } from '../../types';
import {
  saveStoredSettings,
  getAppPassword,
  setAppPassword,
  downloadFile,
  SAMPLE_PRODUCTS,
} from '../../utils/storage';

interface SettingsViewProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  products: Product[];
  bills: Bill[];
  onRestoreData: (restored: {
    products?: Product[];
    bills?: Bill[];
    settings?: StoreSettings;
    invoiceSeq?: number;
  }) => void;
  onResetSampleData: () => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  products,
  bills,
  onRestoreData,
  onResetSampleData,
  onShowToast,
}) => {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress);
  const [storePhone, setStorePhone] = useState(settings.storePhone);
  const [storeUpi, setStoreUpi] = useState(settings.storeUpi);
  const [storeWishes, setStoreWishes] = useState(settings.storeWishes);

  const [terminalPassword, setTerminalPassword] = useState(getAppPassword());

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoreSettings = {
      storeName: storeName.trim(),
      storeAddress: storeAddress.trim(),
      storePhone: storePhone.trim(),
      storeUpi: storeUpi.trim(),
      storeWishes: storeWishes.trim(),
    };
    saveStoredSettings(updated);
    onUpdateSettings(updated);
    onShowToast('Store settings saved successfully!', 'success');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPass = terminalPassword.trim();
    if (!newPass) {
      onShowToast('Password cannot be empty!', 'error');
      return;
    }
    setAppPassword(newPass);
    onShowToast(`Terminal security password updated to: ${newPass}`, 'success');
  };

  const handleDownloadBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: {
        storeName,
        storeAddress,
        storePhone,
        storeUpi,
        storeWishes,
      },
      products,
      bills,
    };
    downloadFile(
      JSON.stringify(backupData, null, 2),
      `Super_Bachat_Bazzar_Backup_${new Date().toISOString().slice(0, 10)}.json`,
      'application/json'
    );
    onShowToast('Backup JSON downloaded!', 'success');
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        onRestoreData(data);
        onShowToast('Store data restored successfully!', 'success');
      } catch {
        onShowToast('Invalid backup JSON file!', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSample = () => {
    if (
      confirm(
        'This will replace current inventory with default Super Bachat Bazzar sample items. Continue?'
      )
    ) {
      onResetSampleData();
      onShowToast('Sample grocery inventory loaded!', 'success');
    }
  };

  return (
    <section id="view-settings" className="view-section active">
      <div className="settings-layout">
        <div className="settings-card">
          <div className="pos-card-header">
            <Store size={18} />
            <span>Store Profile &amp; Receipt Branding</span>
          </div>

          <form id="store-settings-form" className="settings-form" onSubmit={handleSettingsSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="set-store-name">Store Name</label>
                <input
                  type="text"
                  id="set-store-name"
                  className="form-input"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="set-store-address">Store Address (Small letters / subtitle)</label>
                <input
                  type="text"
                  id="set-store-address"
                  className="form-input"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="set-store-phone">Store Phone / WhatsApp</label>
                <input
                  type="text"
                  id="set-store-phone"
                  className="form-input"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="set-store-upi">UPI VPA for Instant QR Payments</label>
                <input
                  type="text"
                  id="set-store-upi"
                  className="form-input"
                  placeholder="yourname@upi"
                  value={storeUpi}
                  onChange={(e) => setStoreUpi(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="set-store-wishes">Bottom Customer Wishes / Greetings on Bill</label>
              <textarea
                id="set-store-wishes"
                className="form-textarea"
                rows={2}
                value={storeWishes}
                onChange={(e) => setStoreWishes(e.target.value)}
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn btn-primary">
                <Check size={16} /> Save Store Settings
              </button>
            </div>
          </form>
        </div>

        <div className="settings-card">
          <div className="pos-card-header">
            <ShieldAlert size={18} />
            <span>Terminal Security &amp; Access Password</span>
          </div>
          <form id="security-settings-form" className="settings-form" onSubmit={handlePasswordSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="set-terminal-password">Terminal Access Password</label>
                <input
                  type="text"
                  id="set-terminal-password"
                  className="form-input"
                  value={terminalPassword}
                  onChange={(e) => setTerminalPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
                <small style={{ color: 'var(--text-muted)', fontSize: 12, display: 'block', marginTop: 6 }}>
                  Terminal requires this password to unlock. Default is super99.
                </small>
              </div>
              <div
                className="form-group"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
              >
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Save size={16} /> Update Password
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="settings-card">
          <div className="pos-card-header">
            <Database size={18} />
            <span>Backup &amp; Reset Store Data</span>
          </div>
          <div className="backup-actions-grid">
            <div className="backup-item">
              <h4>Export Backup File</h4>
              <p>Download all inventory items and bill history as a JSON file for safe recordkeeping.</p>
              <button
                type="button"
                className="btn btn-outline"
                id="download-backup-btn"
                onClick={handleDownloadBackup}
              >
                <Download size={16} /> Download Full Backup
              </button>
            </div>

            <div className="backup-item">
              <h4>Restore Data</h4>
              <p>Load previous inventory &amp; bills from a saved backup JSON file.</p>
              <label className="btn btn-outline file-label" style={{ cursor: 'pointer' }}>
                <Upload size={16} /> Restore from JSON
                <input
                  type="file"
                  id="restore-backup-input"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleFileRestore}
                />
              </label>
            </div>

            <div className="backup-item">
              <h4>Reset Sample Data</h4>
              <p>Reload default sample supermarket grocery items for testing.</p>
              <button
                type="button"
                className="btn btn-outline-danger"
                id="reset-sample-data-btn"
                onClick={handleResetSample}
              >
                <RefreshCw size={16} /> Load Sample Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
