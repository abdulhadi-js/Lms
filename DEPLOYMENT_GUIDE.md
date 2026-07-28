# EduCore LMS - Deployment Guide

This guide will walk you through deploying the EduCore LMS project using **Vercel** for the Frontend and **Render** for the Backend + PostgreSQL database.

---

## Part 1: Deploying the Backend on Render (1-Click)

We have added a `render.yaml` file to the root of your repository which automates the provisioning of your NestJS web service and PostgreSQL database.

1. Go to [Render](https://dashboard.render.com/).
2. Create an account or log in with GitHub.
3. Click on the **New** button and select **Blueprint**.
4. Connect your GitHub repository (`abdulhadi-js/Lms`).
5. Render will automatically detect the `render.yaml` file in the root.
6. Click **Apply**. Render will start provisioning:
   - A managed PostgreSQL database (`educore-db`).
   - The NestJS Backend Web Service (`educore-backend`).
7. Wait for both to finish deploying. Once the web service is live, copy the URL provided by Render (e.g., `https://educore-backend-xxxx.onrender.com`).
8. You now have a production-ready backend!

---

## Part 2: Deploying the Frontend on Vercel

Vercel is perfectly optimized for Next.js applications.

1. Go to [Vercel](https://vercel.com/) and log in with GitHub.
2. Click **Add New Project** and select your repository (`abdulhadi-js/Lms`).
3. Under the **"Framework Preset"**, ensure it detects **Next.js**.
4. **CRITICAL STEP**: Under **"Root Directory"**, click "Edit" and select `Frontend`.
5. Open the **"Environment Variables"** dropdown and add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://educore-backend-xxxx.onrender.com/api/v1` *(Replace with the Render URL from Part 1)*
6. Click **Deploy**.
7. Once the build finishes, you will receive your Vercel URL (e.g., `https://lms-frontend-xxx.vercel.app`).

---

## Part 3: Connecting the Frontend to the Backend

1. Now that you have your Vercel URL, go back to your **Render Dashboard**.
2. Click on the `educore-backend` web service.
3. Go to **Environment** in the sidebar.
4. Add or update the following environment variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://lms-frontend-xxx.vercel.app` *(Your Vercel URL without a trailing slash)*
5. Click **Save Changes**. This ensures that the backend CORS policy accepts requests from your production Vercel frontend.

---

## Part 4: Seeding the Production Database

Your production database is currently empty. You can seed it using the Render Shell.

1. In your Render Dashboard, open the `educore-backend` web service.
2. Go to the **Shell** tab on the left.
3. Run the following command in the shell:
   ```bash
   npm run seed
   ```
4. This will create your default user accounts (`admin@educore.com` / `Admin@123!`).

**Congratulations! Your LMS is now deployed and fully functional in production.**
