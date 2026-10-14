import React from 'react';
import {
  BadgeIndianRupee,
  PiggyBank,
  Boxes,
  TrendingUp,
  PieChart,
  Trophy,
} from 'lucide-react';
import { Bill, Product } from '../../types';
import { formatCurrency } from '../../utils/storage';

interface AnalyticsViewProps {
  bills: Bill[];
  products: Product[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ bills, products }) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBills = bills.filter((b) => b.createdAt.startsWith(todayStr));

  const todaySales = todayBills.reduce((s, b) => s + b.grandTotal, 0);
  const todaySavings = todayBills.reduce((s, b) => s + b.totalCustomerSavings, 0);
  const allTimeSales = bills.reduce((s, b) => s + b.grandTotal, 0);

  const lowStockCount = products.filter((p) => p.quantity < 10).length;

  // Payment Breakdown
  const payStats: Record<string, number> = { Cash: 0, UPI: 0, Card: 0, Credit: 0 };
  bills.forEach((b) => {
    if (payStats[b.paymentMethod] !== undefined) {
      payStats[b.paymentMethod] += b.grandTotal;
    }
  });

  const totalRevenue = allTimeSales || 1;

  // Top Selling Products
  const itemCounts: Record<string, number> = {};
  bills.forEach((b) => {
    b.items.forEach((i) => {
      itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
    });
  });

  const sortedTop = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxSales = sortedTop[0]?.[1] || 1;

  return (
    <section id="view-analytics" className="view-section active">
      <div className="analytics-layout">
        {/* Summary Metric Cards */}
        <div className="metrics-grid">
          <div className="metric-card metric-primary">
            <div className="metric-icon-wrap">
              <BadgeIndianRupee size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-title">Today's Total Sales</span>
              <h3 className="metric-value" id="metric-today-sales">
                {formatCurrency(todaySales)}
              </h3>
              <span className="metric-sub" id="metric-today-bills-count">
                {todayBills.length} bills generated today
              </span>
            </div>
          </div>

          <div className="metric-card metric-success">
            <div className="metric-icon-wrap">
              <PiggyBank size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-title">Customer Bachat Given</span>
              <h3 className="metric-value" id="metric-today-savings">
                {formatCurrency(todaySavings)}
              </h3>
              <span className="metric-sub">Total savings passed to shoppers</span>
            </div>
          </div>

          <div className="metric-card metric-info">
            <div className="metric-icon-wrap">
              <Boxes size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-title">Total Products in Store</span>
              <h3 className="metric-value" id="metric-total-products">
                {products.length}
              </h3>
              <span className="metric-sub" id="metric-low-stock-count">
                {lowStockCount} low stock alerts (&lt;10)
              </span>
            </div>
          </div>

          <div className="metric-card metric-warning">
            <div className="metric-icon-wrap">
              <TrendingUp size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-title">All-Time Revenue</span>
              <h3 className="metric-value" id="metric-alltime-sales">
                {formatCurrency(allTimeSales)}
              </h3>
              <span className="metric-sub" id="metric-alltime-bills">
                {bills.length} all-time invoices
              </span>
            </div>
          </div>
        </div>

        {/* Charts / Analytics Breakdown Cards */}
        <div className="analytics-charts-grid">
          <div className="analytics-card">
            <h3 className="analytics-card-title">
              <PieChart size={18} />
              Payment Methods Breakdown
            </h3>
            <div className="payment-stats-list" id="payment-stats-container">
              {Object.keys(payStats).map((key) => {
                const amt = payStats[key];
                const pct = ((amt / totalRevenue) * 100).toFixed(1);
                return (
                  <div key={key} className="stat-progress-item">
                    <div className="stat-item-header">
                      <span>
                        {key} ({formatCurrency(amt)})
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="analytics-card-title">
              <Trophy size={18} />
              Top Selling Products
            </h3>
            <div className="top-products-list" id="top-products-container">
              {sortedTop.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No sales recorded yet.</p>
              ) : (
                sortedTop.map(([name, count]) => {
                  const pct = ((count / maxSales) * 100).toFixed(1);
                  return (
                    <div key={name} className="stat-progress-item">
                      <div className="stat-item-header">
                        <span style={{ fontSize: 12.5 }}>{name}</span>
                        <span>{count} units</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${pct}%`, background: 'var(--savings-green)' }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
