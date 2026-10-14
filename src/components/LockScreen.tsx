import React, { useState } from 'react';
import { ShieldCheck, MapPin, Lock, Eye, EyeOff, AlertCircle, KeyRound, Shield } from 'lucide-react';
import { getAppPassword, unlockTerminal } from '../utils/storage';
import { playSound } from '../utils/audio';

interface LockScreenProps {
  isLocked: boolean;
  onUnlocked: () => void;
  soundEnabled: boolean;
  storeName: string;
  storeAddress: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlocked,
  soundEnabled,
  storeName,
  storeAddress,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shake, setShake] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  if (!isLocked) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actual = getAppPassword();

    if (password.trim() === actual) {
      setHasError(false);
      unlockTerminal(rememberMe);
      playSound('success', soundEnabled);
      setIsExiting(true);
      setTimeout(() => {
        setIsExiting(false);
        setPassword('');
        onUnlocked();
      }, 300);
    } else {
      playSound('error', soundEnabled);
      setHasError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      id="app-lock-overlay"
      className={`lock-overlay ${isExiting ? 'lock-exiting' : ''}`}
      style={{ display: 'flex' }}
    >
      <div className={`lock-card ${shake ? 'shake' : ''}`} id="lock-card">
        <div className="lock-icon-halo">
          <div className="lock-pulse-ring"></div>
          <div className="lock-shield-icon">
            <ShieldCheck size={36} />
          </div>
        </div>

        <div className="lock-store-badge">
          <img src="/store-photo.jpg" alt="Super Bachat Bazzar Store Front" className="lock-store-img" />
          <div className="lock-store-meta">
            <h2 className="lock-store-name">{storeName}</h2>
            <span className="lock-store-sub">
              <MapPin size={12} className="mini-icon" /> {storeAddress}
            </span>
          </div>
        </div>

        <div className="lock-header-text">
          <h3 className="lock-title">Terminal Locked</h3>
          <p className="lock-desc">Enter authorization password to access Billing, Inventory &amp; Sales</p>
        </div>

        <form id="lock-screen-form" className="lock-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="lock-input-group">
            <Lock size={18} className="lock-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="lock-password-input"
              className="lock-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              autoFocus
            />
            <button
              type="button"
              className="lock-toggle-pwd"
              title="Show / Hide Password"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {hasError && (
            <div id="lock-error-msg" className="lock-error-banner" style={{ display: 'flex' }}>
              <AlertCircle size={16} />
              <span>Incorrect password! Access denied.</span>
            </div>
          )}

          <div className="lock-remember-row">
            <label className="lock-remember-label">
              <input
                type="checkbox"
                id="lock-remember-check"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember on this computer</span>
            </label>
          </div>

          <button type="submit" id="lock-submit-btn" className="lock-btn-submit">
            <KeyRound size={18} />
            <span>Unlock Terminal</span>
          </button>
        </form>

        <div className="lock-security-footer">
          <span className="lock-protected-pill">
            <Shield size={12} className="mini-icon" /> POS Security Guard Active
          </span>
        </div>
      </div>
    </div>
  );
};
