# Week 1 

# 📘 Student API - Express + JSON File Storage

A simple Express.js API for managing student data stored in a JSON file. This project demonstrates basic CRUD operations (Create, Read) using Node.js, Express, and file system modules.

---

## 📁 Project Structure

```
project/
├── Data/
│   └── students.json       # The student data file (acts as a database)
├── routes/
│   └── studentRoutes.js    # This is the main file where API logic exists
├──  index.js       # Your server entry point
```

---

## ⚙️ Key Technologies

* **Node.js**
* **Express.js**
* **fs/promises** for file system interactions
* **path** & **fileURLToPath** for resolving file paths with ESM

---

## 📌 Code Explanation by Section

### 1. **Import Required Modules**

```js
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
```

These modules allow you to create an Express server and work with the file system to store and read student data.

### 2. **Initialize Express Router**

```js
const router = express.Router();
```

This router is used to define and group your student-related routes.

### 3. **Setup File Paths**

```js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "../Data/students.json");
```

This ensures that you’re correctly targeting the path to your JSON data file using ES modules.

---

## 📥 Helper Functions

### 🧾 `getAllStudents()`

Reads and returns all students from the file.

```js
async function getAllStudents() {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
  }
}
```

### 📝 `writeStudent(newStudent)`

Writes updated student list to the file.

```js
async function writeStudent(newStudent) {
  await fs.writeFile(dataFilePath, JSON.stringify(newStudent, null, 2));
}
```

---

## 🚀 API Endpoints

### 📍 GET `/students`

Returns all students.

```js
router.get("/students", async (req, res) => { ... })
```

### 📍 GET `/students/:id`

Returns one student by ID.

```js
router.get("/students/:id", async (req, res) => { ... })
```

* Uses `req.params.id`
* Looks up student by matching ID

### 📍 POST `/students`

Adds a new student.

```js
router.post("/students", async (req, res) => { ... })
```

Steps:

1. Validate required fields (e.g., `name` must exist)
2. Read existing students
3. **Generate a new unique ID**:

   * **Method 1**: Get the last student's ID and add 1 (commented in your code)

     ```js
     const newId = parseInt(students[students.length - 1].id) + 1;
     ```
   * **Method 2**: Use `Math.max()` to find the highest ID and add 1 (used in your code)

     ```js
     const newId = students.length > 0 ? Math.max(...students.map(student => parseInt(student.id))) + 1 : 1;
     ```
4. Push the new student into the array
5. Write back to JSON file
6. Return `201 Created` with new student object

---

## ❗ Error Codes and Messages

| HTTP Code | Message                      | Reason                     |
| --------- | ---------------------------- | -------------------------- |
| 200       | OK                           | Successful GET request     |
| 201       | Created                      | Successfully added student |
| 400       | Please provide at least name | Missing required fields    |
| 404       | Student not found            | No student matched by ID   |
| 500       | Failed to read/write data    | File read or write error   |

---

## 💡 Tips & Notes

* Ensure `students.json` file exists with an array (`[]`) if it's initially empty.
* Use `express.json()` middleware in your main server file to parse JSON request bodies.

  ```js
  app.use(express.json());
  ```
* Validate and sanitize inputs on production-level apps.
* Consider using a UUID library for generating IDs in real-world apps.

---


## 🧪 Sample Student Object

```json
{
  "id": "1",
  "name": "Ahmed",
  "age": 25,
  "country": "Somalia",
  "createdAt": "2023-10-01T12:00:00Z"
}
```

---

## ✅ How to Test with Postman

* **GET all students**:

  ```http
  GET http://localhost:3000/api/students
  ```
* **GET single student**:

  ```http
  GET http://localhost:3000/api/students/1
  ```
* **POST new student**:

  ```http
  POST http://localhost:3000/api/students
  Body (JSON):
  {
    "name": "Asha",
    "age": 22,
    "country": "Somalia"
  }
  ```

---

Let me know if you'd like this exported as a PDF!

add the title Gabi school since i want to share this student's 
