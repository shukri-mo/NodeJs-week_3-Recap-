//Student Service will export functions that get data or add,edit or delete in the database

import prisma from "../lib/prisma.js";

//fetch function

export async function getNotes() {
  try {
    return await prisma.note.findMany();
  } catch (err) {
    throw new Error("error fetching data " + err.message);
  }
}

//get one note
export async function getNoteById(id) {
  try {
    return await prisma.note.findUnique({
      where: { id: Number(id) },
    });
  } catch (err) {
    throw new Error("error fetching data " + err.message);
  }
}

//post function or create Function 

export async function createNote(noteData) {
  try {
    const { title, content,studentId } = noteData;

    //1. validate

    if (!title || !content || !studentId) {
      throw new Error("Missing Required Fields");
    }
    //2.  check if email already exist
    const exisitingNote =
      await prisma.note.findUnique({
        where: { title },
      });
    if (exisitingNote) {
      throw new Error("Note with this title already exists");
    }
    //3. now we can create new note

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        studentId,
      },
   
    });

    return newNote;
  } catch (error) {
    throw error;
  }
}


//delete function

export async function deleteNote(id) {
  try {
    return await prisma.note.delete({
      where: { id: Number(id) },
    });
  } catch (err) {
    throw new Error("error deleting data " + err.message);
  }
}

//update function
export async function updateNote(id, noteData) {
  try {
    const { title, content } = noteData;

    //1. validate
    if (!title || !content) {
      throw new Error("Missing Required Fields");
    }

    //2. check if note exists
    const existingNote = await prisma.note.findUnique({
      where: { id: Number(id) },
    });
    if (!existingNote) {
      throw new Error("Note not found");
    }

    //3. update note
    const updatedNote = await prisma.note.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
      },
    
    });

    return updatedNote;
  } catch (error) {
    throw error;
  }
}