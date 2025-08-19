Here’s the explanation of the **Authentication** and **Middleware** sections along with the full README file in one place. You can easily copy and paste it:

---

# Node.js with Prisma - Student and Notes Management System

This project is a basic **Node.js** API that uses **Prisma ORM** for database management, built with **Express.js**. It allows for the management of students and notes in a **PostgreSQL** database. This API includes routes for user registration, login, creating and managing student data, as well as adding and managing notes.

## Project Structure

* **lib/**: Contains the Prisma client instance (`prisma.js`) to interact with the database.
* **middleware/**: Contains the authentication middleware (`Auth.js`) to protect routes and validate JWT tokens.
* **models/**: Contains the Prisma schema defining the `Student` and `Note` models, along with their relationships.
* **routes/**: Contains the Express routes that handle HTTP requests for students and notes.
* **services/**: Contains the business logic for interacting with the database, such as CRUD operations for students and notes.
* **.env**: Contains environment variables, such as `JWT_SECRET` and database connection URL.

## Prerequisites

* Node.js installed on your machine.
* A PostgreSQL database set up.
* Prisma ORM for database interaction.
* JWT (JSON Web Token) for authentication.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repository-url.git
   cd your-repository-folder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your `.env` file with the necessary environment variables:

   ```bash
   JWT_SECRET=your-secret-key
   DIRECT_URL=your-postgresql-database-url
   ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run Prisma migration to set up the database:

   ```bash
   npx prisma migrate dev
   ```

6. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### Student Routes

1. **POST /register**: Registers a new student.

   * **Request Body**:

     ```json
     {
       "name": "caasha cali",
       "email": "caasha@example.com",
       "password": "password123",
       "age": 25,
       "grade": "A",
       "major": "Computer Science"
     }
     ```
   * **Response**:

     * Returns a `JWT` token and the student data (excluding password).

2. **POST /login**: Authenticates a student and returns a `JWT` token.

   * **Request Body**:

     ```json
     {
       "email": "caasha@example.com",
       "password": "password123"
     }
     ```
   * **Response**:

     * Returns a `JWT` token and the student data (excluding password).

3. **GET /students**: Retrieves a list of all students.

4. **GET /students/\:id**: Retrieves a single student by ID.

5. **POST /students**: Adds a new student (Requires `admin` privileges).

6. **DELETE /students/\:id**: Deletes a student by ID.

7. **PUT /students/\:id**: Updates student data by ID.

### Notes Routes

1. **GET /notes**: Retrieves all notes (Requires authentication).

2. **GET /notes/\:id**: Retrieves a specific note by ID (Requires authentication).

3. **POST /notes**: Adds a new note (Requires authentication).

   * **Request Body**:

     ```json
     {
       "title": "New Note",
       "content": "Note content",
       "studentId": "student-id"
     }
     ```
   * **Response**:

     * Returns the created note.

4. **DELETE /notes/\:id**: Deletes a note by ID (Requires authentication).

5. **PUT /notes/\:id**: Updates a note by ID (Requires authentication).

## JWT Authentication Middleware

### Authentication Middleware (`Auth.js`)

The **`authenticateToken`** middleware is a critical component for protecting routes that require authentication. It validates the JWT token in the `Authorization` header and ensures that only authenticated users can access protected routes.

* **Step 1**: Extract the token from the `Authorization` header.
  The token is expected to be in the `Authorization` header as a Bearer token:

  ```bash
  Authorization: Bearer <JWT_TOKEN>
  ```

* **Step 2**: Verify the token.
  The `jsonwebtoken` package is used to verify the token's validity. If the token is valid, the next step will proceed.

* **Step 3**: Retrieve the student data associated with the token.
  The `studentId` from the decoded token is used to fetch the corresponding student from the database. This student data is then attached to the `req.student` object, making it available for downstream routes.

* **Step 4**: If no valid token is found or the student is not found, the request will be blocked, and a `403` status code will be returned, indicating that the token is either invalid or expired.

### Middleware Code Example

```js
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Middleware to validate the token
export const authenticateToken = async (req, res, next) => {
  try {
    // Step 1: Get the token from the header in req
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Step 2: Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "mySecret"
    );

    // Step 3: Get student info using studentId from the token
    const student = await prisma.student.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        grade: true,
        major: true,
      }
    });

    // Check if student exists
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token, student not found",
      });
    }

    // Attach student to the request object
    req.student = student;
    next();
  } catch (error) {
    console.error("Auth middleware error", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
```

This middleware ensures that all routes requiring authentication are protected. It’s used in routes like **GET /notes**, **POST /notes**, etc., where access to the data should be restricted to authenticated students only.

## Services

* **Prisma Client**: Used to interact with the database, including querying students and notes.
* **JWT Authentication**: Each request requiring authentication uses JWT to validate and authenticate users.
* **Error Handling**: The application returns appropriate error messages for invalid or missing data, as well as for server errors.

## Prisma Schema

### Student Model

* **id**: The unique identifier for a student (String).
* **name**: The student's name (String).
* **email**: The student's email (String, unique).
* **age**: The student's age (Int).
* **grade**: The student's grade (String).
* **major**: The student's major (String).
* **password**: The student's hashed password (String).
* **createdAt**: The timestamp when the student was created (DateTime).
* **updatedAt**: The timestamp when the student was last updated (DateTime).
* **notes**: A relationship with the `Note` model, where a student can have many notes.

### Note Model

* **id**: The unique identifier for a note (Int).
* **title**: The note's title (String, unique).
* **content**: The content of the note (String).
* **createdAt**: The timestamp when the note was created (DateTime).
* **updatedAt**: The timestamp when the note was last updated (DateTime).
* **studentId**: The foreign key linking the note to a student (String).
* **student**: A relation to the `Student` model, indicating which student the note belongs to.

## Notes

* **JWT Secret**: Always use a secure secret for generating JWT tokens. In production, store it securely (e.g., in environment variables).
* **Token Expiry**: The JWT token expires in one day by default (`expiresIn: "1d"`). You can change this in the `jsonwebtoken` configuration.
* **Authorization Header**: When making requests to protected routes (e.g., `/notes`), always include the JWT token in the `Authorization` header.

