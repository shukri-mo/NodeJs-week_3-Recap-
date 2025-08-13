# 📚 Student Management API (Node.js + Express + Prisma + Supabase)

This project is a **simple REST API** for managing students using:
- **Express** for the server
- **Prisma ORM** for database access
- **PostgreSQL** (hosted on Supabase)
- **CRUD operations** (Create, Read, Update, Delete)

---

## 🗂 Project Structure

```
.
├── studentServices/
│   └── studentservice.js   # All database logic (CRUD)
├── routes/
│   └── student.js          # Express routes/endpoints
├── prisma/
│   └── schema.prisma       # Database schema
├── lib/
│   └── prisma.js           # Prisma client initialization
├── server.js               # Main server entry point
├── .env                    # Environment variables (Supabase connection)
└── README.md               # Project documentation
```

---

## ⚙ 1. `schema.prisma`

This file defines the **database structure** for Prisma.

```prisma
model Student {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  age       Int
  grade     String
  major     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("students")
}
```

**Key points:**
- `@id @default(autoincrement())` → Automatically increments student IDs.
- `@unique` → Email must be unique.
- `createdAt` & `updatedAt` → Auto-managed timestamps.
- `@@map("students")` → Table name in PostgreSQL will be **students**.

---

## 🗄 2. `.env`

Stores sensitive database connection info.

```
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/<database>"
```

---

## 🔌 3. `lib/prisma.js`

Initializes Prisma Client.

```js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;
```

---

## 🛠 4. `studentServices/studentservice.js`

This file contains **all database logic**.

### Functions:

#### `getStudents()`
- Fetches all students.
- Uses `prisma.student.findMany()`.

#### `getStudentById(id)`
- Fetches one student by **ID**.

#### `createStudent(studentData)`
1. Validates required fields (`name`, `email`).
2. Checks if email already exists.
3. Creates a new student.

#### `deleteStudent(id)`
- Deletes student by **ID**.

#### `updateStudent(id, studentData)`
1. Validates fields.
2. Checks if student exists.
3. Updates student details.

---

## 🌐 5. `routes/student.js`

Handles HTTP requests and connects them to the **service functions**.

### Endpoints:

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| GET    | `/students`      | Get all students                |
| GET    | `/students/:id`  | Get a student by ID              |
| POST   | `/students`      | Create a new student             |
| DELETE | `/students/:id`  | Delete a student                 |
| PUT    | `/students/:id`  | Update student details           |

Example route:
```js
router.get("/students", async (req, res) => {
  try {
    const students = await getStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});
```

---

## 🚀 6. `server.js`

Main entry point that:
1. Loads environment variables.
2. Starts Express server.
3. Uses routes from `student.js`.

Example:
```js
import express from "express";
import studentRoutes from "./routes/student.js";

const app = express();
app.use(express.json());
app.use("/api", studentRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

---

## 📦 7. Installation & Setup

1️⃣ **Clone the repository**
```sh
git clone <repo-url>
cd <project-folder>
```

2️⃣ **Install dependencies**
```sh
npm install
```

3️⃣ **Set up `.env`**
```sh
DIRECT_URL="postgresql://<user>:<password>@<host>:5432/<database>"
```

4️⃣ **Generate Prisma Client**
```sh
npm run db:generate 
```

5️⃣ **Run migrations**
```sh
npm run db:migrate
```

6️⃣ **Start the server**
```sh
npm run dev
```

---

## 📬 Example API Requests

**Create a Student**
```http
POST /api/students
Content-Type: application/json

{
  "name": "xaliimo faarax",
  "email": "xaliimo@example.com",
  "age": 20,
  "grade": "A",
  "major": "Computer Science"
}
```

**Response**
```json
{
  "message": "Student created successfully",
  "newStudent": {
    "id": 1,
    "name": "xaliimo faarax",
    "email": "xaliimo@example.com",
    "age": 20,
    "grade": "A",
    "major": "Computer Science",
    "createdAt": "2025-08-13T00:00:00.000Z",
    "updatedAt": "2025-08-13T00:00:00.000Z"
  }
}
```

---

## 🎨 Request Flow Diagram

```plaintext
🖥️ Client (Frontend or Postman)
        │   Sends HTTP Request (GET, POST, PUT, DELETE)
        ▼
🚏 Express Routes  (routes/student.js)
        │   Matches endpoint & method
        ▼
🛠 Service Layer   (studentservice.js)
        │   Runs Prisma queries
        ▼
🗄 Prisma ORM      (lib/prisma.js)
        │   Converts JS code → SQL queries
        ▼
🐘 PostgreSQL Database (Supabase)
