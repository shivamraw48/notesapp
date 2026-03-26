require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const Note = require("./models/notes")
const cors=require("cors")
const cookieParser = require('cookie-parser');
const app = express()
const port = process.env.PORT || 3000
const nodeEnv = process.env.NODE_ENV || 'development';

const noteRoutes = require('./routes/notes');
const userRoutes = require('./routes/users.js');
const auth = require('./middleware/auth.js');

app.use(express.json()); 
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Restrict to frontend domain
    credentials: true // Allow cookies to be sent
}));


const uri = process.env.MONGO_URL;

const connectdb= async()=>{
    try{
        await mongoose.connect(uri);
        console.log("Database connected")
        app.listen(port, () => {
          console.log(`Example app listening on port ${port}`)
        })
    }catch(error){
     console.error("Database connection failed:", error.message);
     process.exit(1);
    }
}
connectdb();

app.use('/home', auth, noteRoutes);
app.use('/api', userRoutes); // User routes (login/register) are not protected
