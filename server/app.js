import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import aiRoutes from "./routes/ai.routes.js"
dotenv.config()
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(express.json())


// ROUTES 
app.use("/api" , aiRoutes)

// TEST ROUTE
app.get("/" , (req , res)=>{
    res.send("AI Resume Analyzer Backend Running")
})

const PORT = process.env.PORT || 5000 

app.listen(PORT , () => {
    console.log("Server running on port " + PORT)
})