//Student Service will export functions that get data or add,edit or delete in the database

import prisma from "../lib/prisma.js";

//fetch function

export async function getStudents() {
  try {
    return await prisma.student.findMany();
  } catch (err) {
    throw new Error("error fetching data " + err.message);
  }
}

//get one student
export async function getStudentById(id) {
  try {
    return await prisma.student.findUnique({
      where: { id: Number(id) },
    });
  } catch (err) {
    throw new Error("error fetching data " + err.message);
  }
}

//post function or create Function 

export async function createStudent(studentData) {
  try {
    const { name, email, age, grade, major } = studentData;

    //1. validate

    if (!name || !email) {
      throw new Error("Missing Required Fields");
    }
    //2.  check if email already exist
    const exisitingStudent =
      await prisma.student.findUnique({
        where: { email },
      });
    if (exisitingStudent) {
      throw new Error("Email already exisit");
    }
    //3. now we can create new student

    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        grade: grade || null,
        major: major || null,
        age:age || null
      },
    });

    return newStudent;
  } catch (error) {
    throw error;
  }
}


//delete function

export async function deleteStudent(id) {
  try {
    return await prisma.student.delete({
      where: { id: Number(id) },
    });
  } catch (err) {
    throw new Error("error deleting data " + err.message);
  }
}

//update function
export async function updateStudent(id, studentData) {
  try {
    const { name, email, age, grade, major } = studentData;

    //1. validate
    if (!name || !email) {
      throw new Error("Missing Required Fields");
    }

    //2. check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: Number(id) },
    });
    if (!existingStudent) {
      throw new Error("Student not found");
    }

    //3. update student
    const updatedStudent = await prisma.student.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        age: age || null,
        grade: grade || null,
        major: major || null,
      },
    });

    return updatedStudent;
  } catch (error) {
    throw error;
  }
}