//we need to get student data from
//we need to read file
// we need to create a function that adds data to the file
//after reading the file , we need to create endpoint that shows student data
import express from "express";
import fs from "fs/promises";
import path from "path"; //inoo ka caawiyo in file pathka sax ah aan helno
import { fileURLToPath } from "url"; //inoo ka caawiyo in file pathka sax ah aan helno . file ka path bdlyaa

//intial express router
const router = express.Router();

//get student json file path at first
const __filename = fileURLToPath(import.meta.url); //gives url of the current file
const __dirname = path.dirname(__filename);

//get student json file
const dataFilePath = path.join(
  __dirname,
  "../Data/students.json"
);

//read data
async function getAllStudents() {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
    console.error("Error reading data:", error);
  }
}
//add student function
async function writeStudent(newStudent) {
  await fs.writeFile(
    dataFilePath,
    JSON.stringify(newStudent, null, 2)
  );
}

//endpoints
router.get("/students", async (req, res) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (error) {
    console.log(error);
  }
});

//get one student
router.get("/students/:id", async (req, res) => {
  try {
    const students = await getAllStudents();
    const studentId = req.params.id;
    // const{id}=req.params;
    const student = students.find(
      (student) => student.id === studentId
    );
    if (!student) {
      return res
        .status(404)
        .json({ error: "student not found" });
    }
    res.status(200).json(student);
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
    const { name, age, country, createdAt } = req.body;

    //2. you need to verify the data
    if (!name) {
      return res.status(400).json({
        error: "please provide atleast id and name",
      });
    }
    //3. you need to generate new id for the new student by checking last student id and adding +1
    const students = await getAllStudents();
    //   const newId=student.length> 0 ? parseInt(students[students.length - 1].id) + 1 : 1;
    const newId =
      students.length > 0
        ? Math.max(
            ...students.map((student) =>
              parseInt(student.id)
            )
          ) + 1
        : 1;
    //4.create a new student object
    const newStudent = {
      id: newId.toString(),
      name: name,
      age: parseInt(age) || null,
      country,
      createdAt: createdAt || new Date().toISOString(),
    };
    //5. add to the new student data to the file
    students.push(newStudent);
    //write all the students in student
    await writeStudent(students);
    res.status(201).json(newStudent);
    //6. return the newly addedd student data
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to add student data" });
  }
});
export default router;
