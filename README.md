# 🏨 STAY HOSTEL - Smart University Residence & Room Allocation System

A complete, production-grade, responsive full-stack web application for university hostel accommodation and room allocation management. Built with a modern **React (Vite) + Tailwind CSS** frontend and a robust **Node.js + Express + MongoDB (Atlas / Local)** backend.

---

## 🌟 Key Features

### 👨‍💼 Admin Management Portal
- **Interactive Analytics Dashboard**: Live metrics tracking Total Students, Hostels, Rooms, Available Beds, Occupied Rooms, and Pending Applications.
- **Graphical Analytics (Recharts)**: Room occupancy rates, Hostel-wise capacity vs allocated beds, and application pipeline status charts.
- **Hostel Management**: Add, edit, search, and delete campus hostels (with active student allocation safety guards).
- **Room Management**: Add, edit, filter, and delete rooms. Tracks floor numbers, room types (Single/Double/Triple), monthly fees, and real-time active occupants. Strictly enforces room capacities to prevent over-allocation.
- **Room Allocation Engine**:
  - Review verified/approved student applications.
  - One-click room allocation into available rooms with vacancies.
  - Room transfer/reassignment with automatic bed counts adjustment.
  - Room vacating workflow restoring availability and archiving checkout logs.
- **Applications Review**: Filter and inspect student applications with emergency details; approve or reject with custom administrative remarks.
- **Student Directory**: Complete student roster with contact details, academic details, and current room status.
- **Institutional Reports & CSV Export**: Generate date-filtered reports for occupancy, room inventory, allocation history, and pending applications with one-click CSV export.

### 👨‍🎓 Student Portal
- **Personalized Residence Dashboard**: Dynamic welcome header, student profile summary, current room allocation badge, and live campus room vacancies.
- **Apply for Hostel**: Multi-step accommodation application selecting preferred hostel, room type (Single/Double/Triple), floor preference, and emergency contacts.
- **My Applications**: Track application lifecycle (`Pending` ➔ `Approved` ➔ `Allocated` or `Rejected`) with warden inspection remarks.
- **My Room & Roommates**: Detailed view of allocated hostel, room number, floor level, monthly rent, included amenities, warden contact, and profiles of all co-allocated roommates.
- **Profile & Security**: Update student contact details and securely change account passwords.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React, Recharts |
| **Backend** | Node.js, Express.js, MongoDB (Atlas / Native), Mongoose ORM, JSON Web Tokens (JWT), bcryptjs, Express Validator, Express Rate Limit, Morgan, CORS, dotenv |
| **Database** | MongoDB Atlas (Cloud) / Local MongoDB Service |

---

## 🔐 Pre-Seeded Test Credentials

Use these pre-configured credentials to immediately log in and test all functionalities:

| User Role | Email | Password | Description / State |
|---|---|---|---|
| **Chief Warden (Admin)** | `admin@example.com` | `AdminPass@2025` | Full administrative access to hostels, rooms, allocations, and reports |
| **Student (Allocated)** | `aarav.patel@student.edu` | `Password@123` | Allocated to Aryabhatta Room A-102 with roommate Rohan Verma |
| **Student (Roommate)** | `rohan.verma@student.edu` | `Password@123` | Co-occupant of Room A-102 |
| **Student (Single Room)** | `ananya.sharma@student.edu` | `Password@123` | Allocated to Gargi Hostel Single Room G-101 |
| **Student (Approved)** | `sneha.k@student.edu` | `Password@123` | Application approved; ready in "Awaiting Allocation" tab |
| **Student (Pending)** | `vikram.roy@student.edu` | `Password@123` | Application pending admin review |

*Quick-fill demo buttons are also provided directly on the Login screen for 1-click credential population.*

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- A MongoDB Atlas account **OR** a local MongoDB instance

---

### Step 1: Backend Setup

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure your Environment Variables in `server/.env`:
   ```ini
   PORT=5000
   # Replace with your MongoDB Atlas connection string:
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=hostel_super_secure_jwt_secret_token_university_2025_xyz
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=AdminPass@2025
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Seed the initial database with realistic hostels, rooms, students, and allocations:
   ```bash
   npm run seed:demo
   ```
   *(Or run `npm run seed:admin` to seed only the secure administrator account)*

5. Start the backend server:
   ```bash
   # Development mode with hot-reload
   npm run dev

   # Or standard production mode
   npm start
   ```
   The backend API will run on `http://localhost:5000`.

---

### Step 2: Frontend Setup

1. Open a new terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will launch on `http://localhost:5173`. Open this URL in your web browser.

---

## 🌐 Connecting to MongoDB Atlas

To connect this application to your **MongoDB Atlas Cloud Database**:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Database**, click **Connect** on your cluster.
3. Select **Drivers** (Node.js).
4. Copy the connection string. It will look similar to:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/hostel_db?retryWrites=true&w=majority
   ```
5. Open `server/.env` in your code editor.
6. Replace `MONGODB_URI=...` with your copied Atlas connection string (make sure to replace `<password>` with your database user's password).
7. Under MongoDB Atlas ➔ **Network Access**, ensure IP address `0.0.0.0/0` (Allow Access from Anywhere) is added.
8. Run `npm run seed:demo` in `server/` to populate your Atlas cluster with complete sample data.
9. Restart the backend server. The console will display:
   ```
   ✅ MongoDB Connected Successfully: cluster0-shard-... (Database: hostel_db)
   ```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Register a new student (role forced to STUDENT)
- `POST /api/auth/login` - Authenticate user & retrieve JWT token
- `GET /api/auth/me` - Get currently authenticated user profile
- `POST /api/auth/logout` - Invalidate client session
- `PUT /api/auth/update-profile` - Update profile details
- `PUT /api/auth/change-password` - Securely change account password

### Hostels
- `GET /api/hostels` - Retrieve all hostels with live occupancy breakdown
- `GET /api/hostels/:id` - Retrieve single hostel and its room list
- `POST /api/hostels` - Create new hostel *(Admin only)*
- `PUT /api/hostels/:id` - Update hostel information *(Admin only)*
- `DELETE /api/hostels/:id` - Delete hostel if no active occupants exist *(Admin only)*

### Rooms
- `GET /api/rooms` - Query rooms with filters (hostel, floor, type, status) and live occupants
- `GET /api/rooms/:id` - Get room details and roommate occupant list
- `POST /api/rooms` - Register a new room *(Admin only)*
- `PUT /api/rooms/:id` - Edit room details *(Admin only)*
- `DELETE /api/rooms/:id` - Delete room if unoccupied *(Admin only)*

### Applications
- `POST /api/applications` - Submit hostel application *(Student only)*
- `GET /api/applications/my` - View logged-in student's application history *(Student only)*
- `GET /api/applications` - List all applications with status filters *(Admin only)*
- `PUT /api/applications/:id/status` - Approve or reject application with remarks *(Admin only)*

### Allocations
- `POST /api/allocations` - Assign room to student *(Admin only)*
- `GET /api/allocations` - List all active and past allocations *(Admin only)*
- `GET /api/allocations/my` - Get logged-in student's active room & roommates *(Student only)*
- `PUT /api/allocations/:id/reassign` - Transfer student to a different available room *(Admin only)*
- `PUT /api/allocations/:id/vacate` - Vacate room and restore availability *(Admin only)*

### Dashboard & Analytics
- `GET /api/dashboard/admin` - Comprehensive admin analytics, metrics, and chart series
- `GET /api/dashboard/student` - Student residence overview, roommate summary, and room vacancies

### Reports & Audits
- `GET /api/reports/summary` - Aggregate metrics and reports with date and hostel filters
- `GET /api/reports/export/:type` - Download CSV report file (`hostels`, `rooms`, `allocations`, `pending-applications`, `students`)

---

## 🛡️ Security Implementations

1. **Password Hashing**: Irreversible password salting and hashing with `bcryptjs` (salt rounds = 10).
2. **JWT Authorization**: Bearer token authentication with configurable expiry and stateless verification.
3. **Role-Based Access Control (RBAC)**: Route middleware strictly isolates `ADMIN` and `STUDENT` operations.
4. **Registration Sanitization**: The registration endpoint strictly overrides any client-supplied `role` to `STUDENT`. Administrator accounts cannot be created via public registration.
5. **Rate Limiting**: `express-rate-limit` prevents brute-force login and registration attacks.
6. **Input Validation**: `express-validator` validates all incoming payloads (email format, roll numbers, capacities, and object IDs).
7. **Database Concurrency & Capacity Protection**: Prevents double allocations and rejects allocations when room capacity is reached.

---

## 🧪 Verification & Testing Suite

An automated end-to-end verification script is included to test all 16 core requirements:

```bash
cd server
node test-verification.js
```

This automated test suite verifies:
- API health check
- Admin and Student authentication
- Duplicate email and roll number prevention
- Role-based route protection (403 Forbidden checks)
- Hostel and room inventory creation
- Application submission and approval pipeline
- Room allocation and real-time bed count updates
- Capacity overflow rejection (strict 400 Bad Request verification)
- Room vacating and availability restoration
- Live dashboard statistics aggregations
- CSV export generation
