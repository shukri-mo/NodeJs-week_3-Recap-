// In your app.js or server.js file
import express from "express";
import cors from "cors";
import studentRoutes from "./routes/students.js";
import authentication from "./routes/authentication.js";
import notes from "./routes/notes.js";
const app = express();
const PORT = process.env.PORT || 3000;

// Use express.json() to parse incoming JSON requests
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(cors()); // To allow cross-origin requests

// Routes
app.use("/api/", notes); // Grouped API for notes
app.use("/api", studentRoutes); // Grouped API for students
app.use("/api/auth", authentication); // Grouped API for authentication

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
