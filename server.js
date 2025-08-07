import express from "express";
// const express= require("express");
import cors from "cors";
import bodyParser from "body-parser";   
import studentRoutes from "./routes/students.js";
//step 1 : Intial express
const app= express();
const PORT=process.env.PORT || 3000


//All enpoints 
app.use(bodyParser.json())  //to parse json data
app.use(cors())  //to allow cross origin requests
app.use("/api",studentRoutes)   //you can group different apis under one route


// app.use('*',(req,res)=>{
//     res.status(404).json({
//         success:false,
//         message:"Route not found"
//     })
// })









//STEP 2: CREATE API ENDPOINTS
app.get("/hello",(req,res)=>{
    // res.json({message:"hello world from express server"})
    // res.status(200).json({message:"hello world from express"})
    const user={
        name:"Ahmed",
        age:25,
        country:"Somalia"
    }
    res.status(200).json(user);
})
//marka res la helo waxan u baahanhy in port ka u yeedhno
app.listen(PORT,()=>{

    console.log('server is runnig on port',PORT)
})































// //Class work
// const studentData=[
//     {
//         "id":"1",
//         "name":"Ahmed",
//         "age":25,
//         "country":"Somalia",
//         "createdAt":"2023-10-01T12:00:00Z"
//     },
//     {
//         "id":"2",
//         "name":"Ahmed",
//         "age":25,
//         "country":"Somalia",
//         "createdAt":"2023-10-01T12:00:00Z"
//     },
//     {
//         "id":"3",
//         "name":"Ahmed",
//         "age":25,
//         "country":"Somalia",
//         "createdAt":"2023-10-01T12:00:00Z"
//     }
// ]
// //API endpoint to get all students
// app.get("/students",(req,res)=>{
//     res.status(200).json(studentData);
// })
// app.get("/students/:id",(req,res)=>{
//     const studentId=req.params.id
//     res.status(200).json(studentData.find((student)=>student.id===studentId))
// })













export default app;