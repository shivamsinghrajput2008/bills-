import React, { useEffect, useState } from 'react';
import { ShoppingBag, MapPin, ShoppingCart, Boxes, BookOpen, TrendingUp, Store, Clock, Volume2, VolumeX, Moon, Sun, Lock } from 'lucide-react';
import { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  productCount: number;
  billCount: number;
  storeName: string;
  storeAddress: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLockTerminal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  productCount,
  billCount,
  storeName,
  storeAddress,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
  onLockTerminal,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="app-header">
      {/* Left: Store Name & All 5 Nav Options in a Row */}
      <div className="header-left">
        <div className="store-badge-icon">
          <ShoppingBag size={24} />
        </div>
        <div className="store-info-group">
          <div className="store-name-row">
            <h1 className="store-title">{storeName}</h1>
            <span className="pos-status-pill">
              <span className="pulse-dot"></span> POS LIVE
            </span>
          </div>
          <p className="store-subtitle">
            <MapPin size={12} className="mini-icon" /> {storeAddress}
          </p>
        </div>

        {/* All 5 Navigation Options */}
        <nav className="nav-tabs" role="tablist">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'pos' ? 'active' : ''}`}
            onClick={() => onTabChange('pos')}
            id="tab-pos-btn"
          >
            <ShoppingCart size={18} />
            <span>New Sale</span>
            <kbd className="shortcut-kbd">F2</kbd>
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => onTabChange('inventory')}
            id="tab-inventory-btn"
          >
            <Boxes size={18} />
            <span>Add Items &amp; Products</span>
            <span className="counter-badge" id="nav-item-count">
              {productCount}
            </span>
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => onTabChange('history')}
            id="tab-history-btn"
          >
            <BookOpen size={18} />
            <span>Sales Book</span>
            <span className="counter-badge" id="nav-bill-count">
              {billCount}
            </span>
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => onTabChange('analytics')}
            id="tab-analytics-btn"
          >
            <TrendingUp size={18} />
            <span>Sale Analysis</span>
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => onTabChange('settings')}
            id="tab-settings-btn"
          >
            <Store size={18} />
            <span>Store Settings</span>
          </button>
        </nav>
      </div>

      {/* Center: Store Front Photo Badge */}
      <div className="header-center-photo">
        <img
          src="/store-photo.jpg"
          alt="Super Bachat Bazaar Store Front"
          className="store-header-img"
          title="Super Bachat Bazaar Store Front"
        />
      </div>

      {/* Right: Clock & Action Icons */}
      <div className="header-right">
        <div className="live-clock" id="live-clock">
          <Clock size={16} className="clock-icon" />
          <div className="clock-text">
            <span className="clock-time" id="clock-time">
              {timeStr}
            </span>
            <span className="clock-date" id="clock-date">
              {dateStr}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="action-btn icon-btn"
          id="sound-toggle-btn"
          title="Toggle Beep Sound"
          onClick={onToggleSound}
        >
          {soundEnabled ? <Volume2 size={18} id="sound-icon" /> : <VolumeX size={18} id="sound-icon" />}
        </button>
        <button
          type="button"
          className="action-btn icon-btn"
          id="theme-toggle-btn"
          title="Toggle Dark/Light Mode"
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} id="theme-icon" /> : <Moon size={18} id="theme-icon" />}
        </button>
        <button
          type="button"
          className="action-btn icon-btn lock-btn-header"
          id="lock-terminal-btn"
          title="Lock POS Terminal"
          onClick={onLockTerminal}
        >
          <Lock size={18} id="lock-icon" />
        </button>
      </div>
    </header>
  );
};
