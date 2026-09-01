# Super Bachat Bazaar POS & Billing System

A fast, modern, and offline-capable Point of Sale (POS) Billing and Inventory Management System tailored for retail and grocery superstores. Built with Vanilla JS, HTML5, and CSS3.

## Features
- 🛒 **New Sale / POS Counter**: Quick barcode scanning, item search, custom rate editing, line item discounts, cash change calculation, and instant bill generation.
- 📦 **Inventory Management**: Stock inwarding, product search/filters, barcode tag printing, low stock alerts, and CSV export.
- 📖 **Sales Book & Bill History**: Full invoice archive with **Edit Bill**, stock re-adjustment, WhatsApp bill sharing, and thermal receipt printing.
- 📈 **Sale Analysis**: Revenue analytics, payment method breakdown, daily sales charts, and customer savings metrics.
- 🏪 **Store Customization**: Custom store details, logo/photo banner, print headers, and offline data persistence via `localStorage`.

## Deployment

### 1. GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Source**, select `main` branch and `/ (root)`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/bills-/`

### 2. Vercel / Netlify / Render
Simply import the GitHub repository into Vercel or Netlify. No build step is required!
- **Build Command**: *(Leave empty)*
- **Output Directory**: `./` (Root)

## Local Development
- Simply open `index.html` in any modern web browser.
- Alternatively, run `start-server.bat` or run a local HTTP server (`npx http-server .`).
