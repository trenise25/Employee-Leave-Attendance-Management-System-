# 📘 Employee Leave & Attendance Management System  
*A full-stack MERN application for employee leave handling, attendance tracking, and HR management.*

---
## 📖 Overview
A modern **Employee Leave & Attendance Management System** built with the **MERN Stack** (MongoDB, Express, React, Node.js).

This project can serve as:  
✔ A portfolio project  
✔ A production-ready HR tool  
✔ A foundation for payroll or HRMS systems  

Employees can apply for leave, track attendance, and view records. Admins can manage employees, approve requests, and monitor KPIs.

---

## 🌟 Features

### 👨‍💼 Employee Features
- Apply for different leave types (Sick, Casual, Annual, etc.)
- View leave history & statuses
- Daily attendance check-in & check-out
- Personal attendance overview
- Auto-calculated working hours

### 🛠 Admin Features
- Dashboard with KPIs & analytics
- Add / Edit / Deactivate employees
- Approve or reject leave requests
- View system-wide attendance
- Department-wise employee stats
- Attendance trend charts (Recharts)

---

## 🚀 Tech Stack

### **Frontend**
- React 18  
- Vite  
- React Router  
- Axios  
- Recharts  
- Modern CSS (glassmorphism UI)

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- bcryptjs for password hashing  

---

## 📁 Project Structure

```
employee-management-system/
├─ server/
│  ├─ models/          # User, Leave, Attendance schemas
│  ├─ routes/          # REST API routes
│  ├─ middleware/      # Auth + role protection
│  ├─ utils/           # Helper utilities (optional)
│  ├─ server.js        # Main entry point
│  └─ package.json
│
├─ client/
│  ├─ src/
│  │  ├─ components/   # UI components
│  │  ├─ pages/        # Login, Dashboard, Employees, Leaves
│  │  ├─ context/      # Auth context
│  │  └─ App.jsx
│  └─ package.json
│
└─ README.md
```

---

## 📋 Prerequisites
Make sure you have:

- **Node.js** (16+ recommended)  
- **MongoDB** (local or Atlas)  
- **npm**

---

## 🛠 Installation & Setup

---

### **2️⃣ Backend Setup**
```bash
cd server
npm install
```

### **3️⃣ Frontend Setup**
```bash
cd ../client
npm install
```
---

### **4️⃣ Start the Application**

#### Backend – Terminal 1
```bash
cd server
npm run dev
```

#### Frontend – Terminal 2
```bash
cd client
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000  

---


## 📜 Available Scripts

### **Client**
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production app |
| `npm run preview` | Preview build |

### **Server**
| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Start server normally |

---

## 🔌 API Overview  
Base URL: `/api`

### **Health**
- `GET /api/health`

### **Authentication**
- `POST /api/auth/register`
- `POST /api/auth/login`

### **Employees (Admin Only)**
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

### **Leave**
- `POST /api/leave`
- `GET /api/leave/me`
- `GET /api/leave`
- `PUT /api/leave/:id/approve`
- `PUT /api/leave/:id/reject`

### **Attendance**
- `POST /api/attendance/checkin`
- `POST /api/attendance/checkout`
- `GET /api/attendance/me`
- `GET /api/attendance`

### **Dashboard**
- `GET /api/dashboard/summary`

## Screenshots 
### Employee:
<img width="479" height="653" alt="image" src="https://github.com/user-attachments/assets/9a2d52b1-11f4-4f57-b884-78d3fc66acf8" />
<img width="1919" height="569" alt="image" src="https://github.com/user-attachments/assets/16a8f33c-d448-4281-a617-2410be0587c8" />
<img width="1814" height="609" alt="image" src="https://github.com/user-attachments/assets/e05d331b-b38f-4bfe-95a4-760c83b0c302" />
<img width="1784" height="802" alt="image" src="https://github.com/user-attachments/assets/9fdf73e8-fae5-409d-b6ce-004cda10e35b" />
<img width="763" height="646" alt="image" src="https://github.com/user-attachments/assets/e88fe53a-5831-4a84-9a9c-930b06747984" />

### Admin:
<img width="1463" height="606" alt="image" src="https://github.com/user-attachments/assets/0fa27db4-5b69-45cc-bb38-2ffc6715d54f" />
<img width="1497" height="752" alt="image" src="https://github.com/user-attachments/assets/326b5600-7fc5-4754-b74e-9fccef144637" />
<img width="1668" height="542" alt="image" src="https://github.com/user-attachments/assets/90be736c-b331-4af8-b5b5-5952ffd1b6f1" />
<img width="1668" height="542" alt="image" src="https://github.com/user-attachments/assets/d2a8e1d7-3b6e-4539-b6db-36f22413ceae" />


---

