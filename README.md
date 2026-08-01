# Ledger — Full-Stack Invoice Generator (MERN)

A complete invoice generator built for Indian B2B billing: Node.js/Express + MongoDB backend,
React + Tailwind frontend, client-side PDF export, and CGST/SGST/IGST-aware tax math with
amounts spelled out in words using the Indian numbering system.

```
invoice-app/
├── backend/     Express API + Mongoose models (Company, Client, Invoice)
└── frontend/    React (Vite) + Tailwind CSS UI, jsPDF/html2canvas export
```

---

## 1. Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** running locally (Community Server) — or a connection string to any MongoDB instance

### Install & start MongoDB locally

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:** install "MongoDB Community Server" from mongodb.com, then it runs as a service
automatically (or run `mongod` from the install directory).

**Linux (Ubuntu/Debian):** follow MongoDB's official apt install guide, then:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Verify it's running:**
```bash
mongosh
# should connect to mongodb://127.0.0.1:27017 without error
```

The app will automatically create the `invoice_db` database and its collections
(`companies`, `clients`, `invoices`) the first time you save data — no manual setup needed.

---

## 2. Backend setup

```bash
cd backend
npm install
npm run dev        # starts with nodemon on http://localhost:5000
# or: npm start     # plain node, no auto-restart
```

The `.env` file already points at `mongodb://localhost:27017/invoice_db`. Edit
`backend/.env` if your MongoDB runs elsewhere:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/invoice_db
```

On success you'll see:
```
✅ Connected to MongoDB: mongodb://localhost:27017/invoice_db
🚀 Server running at http://localhost:5000
```

Sanity check: open `http://localhost:5000/api/health` — should return `{"status":"ok","db":"connected"}`.

---

## 3. Frontend setup

In a **second terminal**:

```bash
cd frontend
npm install
npm run dev         # starts Vite dev server on http://localhost:5173
```

Vite is pre-configured (see `vite.config.js`) to proxy any `/api/*` request to the backend
at `http://localhost:5000`, so no CORS configuration is needed in development.

Open **http://localhost:5173** in your browser.

---

## 4. Using the app

1. **Invoice Editor tab** — fill in:
   - **Invoice Metadata** — the invoice number auto-fills as `INV-<year>-<sequence>` by
     querying `/api/invoices/next-number`; you can overwrite it manually.
   - **Your Company Details** — upload a logo (auto-resized to a Base64 PNG, stored inline
     so PDFs stay portable), address, GSTIN/PAN.
   - **Client / Receiver Details** — billing + shipping address, with a "Same as billing
     address" checkbox. Previously saved clients appear in the "Load saved client…" dropdown.
   - **Line Items** — add/remove rows; quantity × rate is computed live; choose CGST+SGST
     (intra-state) or IGST (inter-state); set a flat ₹ or % discount.
   - **Payment Info & Terms** — bank details, UPI ID, optional UPI QR image, notes, T&Cs.
2. The **Live Preview** on the right updates instantly and is exactly what gets exported/printed.
3. **Save to Database** — POSTs (or PUTs, if editing an existing invoice) to `/api/invoices`.
   The server recomputes subtotal/discount/tax/grand total from the line items as the source
   of truth, so the saved record always matches the math shown on screen.
4. **Download PDF** — renders the live preview DOM node with `html2canvas` at 2.5× scale, then
   places it into an A4 `jsPDF` document (auto-paginating if content overflows one page) and
   triggers a browser download named `<invoice-number>.pdf`.
5. **Saved Invoices tab** — search by invoice number or client name, see status badges, click
   **Open** to reload an invoice back into the editor (for edits or re-export), or **Delete**.

### Verifying PDF export

1. Fill in at least a company name, client name, and one line item.
2. Click **Download PDF** — a file like `INV-2026-001.pdf` should download.
3. Open it: it should match the on-screen preview exactly, with the logo and any UPI QR code
   rendered crisply (not blurry) — this is the effect of exporting at 2.5× canvas scale.

---

## 5. API reference

| Method | Endpoint                          | Purpose                                   |
|--------|------------------------------------|--------------------------------------------|
| GET    | `/api/health`                      | Backend + DB connectivity check           |
| GET    | `/api/companies`                   | List saved sender profiles                |
| POST   | `/api/companies`                   | Create a sender profile                   |
| PUT    | `/api/companies/:id`                | Update a sender profile                   |
| DELETE | `/api/companies/:id`                | Delete a sender profile                   |
| GET    | `/api/clients?q=`                  | List / search clients                     |
| POST   | `/api/clients`                     | Create a client                           |
| PUT    | `/api/clients/:id`                  | Update a client                           |
| DELETE | `/api/clients/:id`                  | Delete a client                           |
| GET    | `/api/invoices?q=&status=`         | List / search / filter invoices           |
| GET    | `/api/invoices/next-number`        | Suggests the next `INV-<year>-###` number |
| GET    | `/api/invoices/:id`                 | Fetch full invoice detail                 |
| POST   | `/api/invoices`                    | Create invoice (server recomputes totals) |
| PUT    | `/api/invoices/:id`                  | Update invoice (server recomputes totals) |
| PATCH  | `/api/invoices/:id/status`           | Update only the status field              |
| DELETE | `/api/invoices/:id`                  | Delete an invoice                         |

---

## 6. Production build

```bash
cd frontend
npm run build        # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host (Nginx, Vercel, etc.), and point it at your deployed
backend URL — update `vite.config.js`'s proxy or add a `VITE_API_BASE` env var and adjust
`src/utils/api.js`'s `baseURL` for production if the frontend and backend aren't on the same
origin. Set `MONGO_URI` in the backend's environment to your production MongoDB connection
string (e.g. a MongoDB Atlas URI) instead of the local one.

## 7. Notes on design decisions

- **Snapshots, not live references:** each saved invoice stores a full snapshot of the company
  and client details at the time it was created, so editing your company profile later won't
  retroactively change historical invoices.
- **Server-side totals as source of truth:** the frontend computes totals live for instant
  feedback, but the backend independently recomputes subtotal/discount/tax/grand total on every
  save — so the numbers in MongoDB can never drift from what the line items actually say.
- **Weighted tax on discounted items:** when a flat/percentage discount is applied, tax is
  calculated on each item's taxable share (proportional to its share of the discount), not on
  the full pre-discount amount — matching standard Indian GST invoicing practice.
