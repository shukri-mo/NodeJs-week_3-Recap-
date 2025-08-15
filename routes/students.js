
import express from "express";
import { getStudents,getStudentById,createStudent,deleteStudent,updateStudent} from "../Services/studentservice.js";
//intial express router
const router = express.Router();

//endpoints
router.get("/students", async (req, res) => {
  try {
    const students = await getStudents();
    res.json(students);
  } catch (error) {
    console.log(error);
  }
});

//get one student
router.get("/students/:id", async (req, res) => {
  try {
    const{id}=req.params;
    const students = await getStudentById(id);
   res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to get student data" });
  }
});

//add student
router.post("/students", async (req, res) => {
  try {
    //1. add new student data
    const { name,email, age, grade, major } = req.body;
const newStudent=await createStudent({ name,email, age,grade, major})
res.status(201).json({
  message:"Student created successfully",
  newStudent
});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to add student data" });
  }
});


//delete Student
router.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteStudent(id);
    res.status(204).send({
      message:"Student deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to delete student data" });
  }
});

//update function
router.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await updateStudent(id, req.body);
    res.status(200).json({
      message: "Student updated successfully",
      updatedStudent
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to update student data" });
  }
});

export default router;
