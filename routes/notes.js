
import express from "express";
import {authenticateToken} from "../middleWare/Auth.js";
import { getNotes,getNoteById,createNote,deleteNote,updateNote} from "../Services/notesServices.js";
//intial express router
const router = express.Router();

//endpoints
router.get("/notes",authenticateToken, async (req, res) => {
  try {
    const notes = await getNotes();
    res.json(notes);
  } catch (error) {
    console.log(error);
  }
});

//get one note
router.get("/notes/:id",authenticateToken, async (req, res) => {
  try {
    const{id}=req.params;
    const note = await getNoteById(id);
   res.status(200).json(note);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to get note data" });
  }
});

//add note
router.post("/notes",authenticateToken, async (req, res) => {
  try {
    //1. add new note data
    const { title, content,studentId } = req.body;
    const newNote = await createNote({ title, content,studentId });
    res.status(201).json({
      message: "Note created successfully",
      newNote
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to add note data" });
  }
});


//delete note
router.delete("/notes/:id",authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteNote(id);
    res.status(204).send({
      message:"Note deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to delete note data" });
  }
});

//update function
router.put("/notes/:id", authenticateToken,async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNote = await updateNote(id, req.body);
    res.status(200).json({
      message: "Note updated successfully",
      updatedNote
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "failed to update student data" });
  }
});

export default router;
