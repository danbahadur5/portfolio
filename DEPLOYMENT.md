# Deployment Guide: Fully Production-Ready on Vercel

This repository is configured for high-performance, production-ready deployment on **Vercel**. Both the Frontend (React/Vite) and Backend (Node/Express) are optimized for serverless architecture.

## 🚀 Quick Start: Deploying to Vercel

### 1. Backend Deployment (API)
The backend is optimized to run as a Vercel Serverless Function.

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"New Project"**.
2.  Import your repository.
3.  **Configure Project**:
    *   **Project Name**: `portfolio-api` (or similar)
    *   **Framework Preset**: `Other`
    *   **Root Directory**: `Backend`
4.  **Environment Variables**: Add all variables from `Backend/.env.example`:
    *   `MONGODB_URL`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A strong random string for tokens.
    *   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: From your Cloudinary dashboard.
    *   `NODE_ENV`: `production`
5.  Click **Deploy**. Copy the provided URL (e.g., `https://portfolio-api.vercel.app`).

### 2. Frontend Deployment (Web)
The frontend is a static React application with SPA routing configured.

1.  Go to the Vercel Dashboard and click **"New Project"**.
2.  Import the **same repository**.
3.  **Configure Project**:
    *   **Project Name**: `portfolio-web` (or your domain name)
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `Frontend`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables**: Add the variable from `Frontend/.env.example`:
    *   `VITE_BACKEND_URL`: Paste the **Backend URL** you copied in Step 1 (e.g., `https://portfolio-api.vercel.app`).
5.  Click **Deploy**.

---

## 🛠 Production-Ready Optimizations

### 📦 Backend (Serverless Express)
- **Connection Pooling**: `DB.configs.js` is optimized to reuse database connections across serverless cold starts, preventing "Too many connections" errors.
- **Auto-Connect Middleware**: The Express app automatically ensures a database connection is active before processing any API request.
- **Memory Storage**: Multer is configured to use `MemoryStorage` in production, avoiding file system restrictions in serverless environments.
- **Security**: Includes `helmet` for secure headers, `compression` for performance, and `express-rate-limit` to prevent abuse.

### 🎨 Frontend (Vite + React)
- **SPA Routing**: `vercel.json` ensures that all routes redirect to `index.html`, allowing React Router to handle navigation without 404s.
- **Optimized API Client**: `axios` is configured with interceptors for automatic JWT handling and error management.
- **Asset Optimization**: Vite handles code-splitting, tree-shaking, and minification automatically.

## 🔑 Environment Variables Checklist

### Backend
| Variable | Description |
| :--- | :--- |
| `MONGODB_URL` | MongoDB connection string (Atlas recommended). |
| `JWT_SECRET` | Secret key for signing JWT tokens. |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name. |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret. |
| `FRONTEND_URL` | (Optional) Restrict CORS to your frontend domain. |

### Frontend
| Variable | Description |
| :--- | :--- |
| `VITE_BACKEND_URL` | The full URL of your deployed Backend API. |

---

## 📝 Post-Deployment
Once deployed, you can use the **Admin Dashboard** to manage your portfolio content.
1.  Navigate to `/login` on your deployed site.
2.  Use the credentials created during your initial database seeding (or create a new admin via the API).
3.  Update your site settings, projects, and blog posts directly from the browser.
