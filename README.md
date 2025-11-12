# Sales Analytics Dashboard

This repository contains a Sales Analytics dashboard built with React and Tailwind CSS. It provides an interface to upload sales CSV/Excel files and visualize key metrics like revenue, orders, product-wise sales and regional breakdowns.

![Sales Dashboard Screenshot]
(<img width="611" height="622" alt="image" src="https://github.com/user-attachments/assets/483830d4-ecda-4f58-a034-4f681e170b23" />)

Why this project
- Clean, responsive dashboard UI for sales insights
- CSV/Excel upload and parsing
- Charts for revenue trend, product-wise sales and regional distribution

Quick start
1. Install dependencies:

```powershell
cd frontend/sales
npm ci
```

2. Start development server:

```powershell
npm start
```

3. Open http://localhost:3000 in your browser.

Backend (API)
1. Install backend dependencies:

```powershell
cd ../../backend
npm ci
```

2. Create a `.env` file in `d:\\sales\\backend` with at least the following variables:

```
MONGODB_URI=mongodb://localhost:27017/salesdb
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

3. Start the backend server (development):

```powershell
npm run dev
```

4. Useful backend endpoints
- `GET /` - Root route (API status)
- `GET /api/health` - Health check
- `POST /api/upload` - Upload CSV/Excel file (multipart form, field name `file`)
- `GET /api/sales` - List sales (supports filters/pagination)
- `GET /api/analytics/summary` - Summary analytics (revenue, orders, avg order value)
- `GET /api/analytics/trends` - Sales trends
- `GET /api/analytics/products` - Product-wise analytics

Tip: You can run `npm run seed` in `backend` to load sample data if the `scripts/seed.js` exists.

Notes on the screenshot
- The screenshot shown above is expected to live at `frontend/sales/assets/screenshot.png`. I couldn't upload the binary image automatically — to show the screenshot on GitHub:
	- Create the folder `frontend/sales/assets` and add the screenshot file `screenshot.png` there, or
	- Replace the `![Sales Dashboard Screenshot](assets/screenshot.png)` link with a remote image URL.

Suggested README improvements I added
- Short project description and features
- Quick start commands tailored to this repo layout
- Screenshot placeholder and path

If you want, I can also:
- Add the `assets/` folder and commit the screenshot if you upload the image here, or
- Create a short `README.md` at the repository root summarizing backend + frontend and linking into `frontend/sales`.

---

How I verified
- Confirmed the React app starts locally after installing PostCSS deps and other fixes.

Next steps (optional)
- I can commit and push this README update right now. If you want the screenshot included in the repo, upload it here or tell me where to fetch it and I will add it and push.

