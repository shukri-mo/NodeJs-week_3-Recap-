import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
const router = express.Router();

//Register student
router.post("/register", async (req, res) => {
  try {
    //step 1 : get student's information
    const { name, email, password, age, grade, major } =
      req.body;

    //step2 :validate
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    //step 3 : check if student already exists
    const existingStudent = await prisma.student.findUnique(
      {
        where: { email },
      }
    );
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student already exists",
      });
    }

    //step 4 : encrypt  password before saving info
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      password,
      saltRounds
    );

    //step 5 : create user
    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        age: age ? parseInt(age) : null,
        grade: grade || null,
        major: major || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        grade: true,
        major: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    //step 6 : generate JWT / create new Token
    const token = jwt.sign(
      { id: newStudent.id, name, email },
      process.env.JWT_SECRET || "mySecret",
      {
        expiresIn: "1d",
      }
    );

    //step 7 : send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        student: newStudent,
        token: token,
      },
    });
  } catch (error) {
    console.error("Registration error", error);
    res.status(500).json({
      success: false,
      message: "error registering student",
      error: error.message,
    });
  }
});
//login student

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //1. validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required fields",
      });
    } //2. find student by email
    const student = await prisma.student.findUnique({
      where: { email },
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "invalid email or password",
      });
    }

    //3. validate password
    const isPasswordValid = await bcrypt.compare(
      password,
      student.password
    );
    if (!isPasswordValid) {
      return res.status(404).json({
        success: false,
        message: "invalid email or password",
      });
    }

    //4. generate JWT
    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET || "mySecret",
      { expiresIn: "1d" }
    );
//5. return student data but not include password

    //6. send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        student: {
          id: student.id,
          email: student.email,
          name: student.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({
      success: false,
      message: "error logging in student",
      error: error.message,
    });
  }
});

//get student profile   -- it needs middleware

export default router;
