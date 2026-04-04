# Excel Analytics Web App

A powerful full-stack web application designed to analyze, visualize, and manage Excel data effectively. Built utilizing a robust modern web stack alongside highly aesthetic, dynamic UI design systems.

## ✨ Features

- 📊 **Excel Data Processing**: Seamlessly upload, parse, and handle `.xlsx` data streams.
- 🚀 **Full-Stack Architecture**: Client-side interface coupled securely with a scalable Express/Node.js API.
- 📈 **Dynamic Visualizations**: Integrated interactive charts and analytics metrics for parsed data.
- 📱 **Mobile Responsive Layout**: Carefully crafted layouts ensuring a perfect experience across all screen sizes (including interactive mobile sidebars).
- 🔒 **Secure & Optimized**: Integrated CORS, environment-variable safety, and robust MongoDB integrations.

## 📁 Project Structure

This project adopts a unified "monorepo" structure containing separated frontend and backend environments:

- `/client` - The frontend interactive web application.
- `/server` - The backend API service and database logic.
- *Root Directory* - Contains shared configuration files, `package.json`, and UI assets.

## 🛠️ Installation & Local Setup

**1. Clone the repository**
```bash
git clone <your-repo-link>
```

**2. Backend Setup**
Open a terminal for the backend API:
```bash
cd server
npm install
```
*Note: Create a `.env` file inside the `server/` folder containing your `PORT` (e.g., 5000) and `MONGO_URI`.*

**3. Frontend Setup**
Open a secondary terminal for the client user-interface:
```bash
cd client
npm install
```
*Note: Create a `.env` file inside the `client/` folder and establish your `VITE_API_BASE_URL` or `REACT_APP_API_BASE_URL` (e.g., `http://localhost:5000`).*

## 💻 Running the Application

To develop or test the application locally, start both servers simultaneously:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev # or npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev # or npm start
```

## 🚀 Deployment

This application is ready to be deployed using popular CI/CD hosting solutions. 
- **Frontend**: Best deployed via [Vercel](https://vercel.com).
- **Backend API**: Best deployed via [Render](https://render.com).
- **Database**: Best handled using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

(See internal documentation or `.gitignore` setups for safe deployment protocols regarding environment variable isolation).

---
*Developed for Summer Internship 2025.*
