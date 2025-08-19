import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

//middle ware to validate the token
export const authenticateToken = async (req, res, next) => {
  try {
    //step1 : get the token from the header in req
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({
          success: false,
          message: "No token provided",
        });

    //step2 : verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "mySecret"
    );

    //step 3 : get student info using studentID from the token
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
    //check if student exists
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token, student not found",
      });
    }
    req.student = student;
    next();
  } catch (error) {
    console.error("Auth middleware error", error);
    return res.status(403).json({
      success: false,
      message: "invalid or expired token",
    });
  }
};
