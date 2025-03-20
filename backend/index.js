import express from 'express';

import { connectDB } from './db/connectDB.js';
import dotenv from "dotenv";

import authRoutes from './routes/auth.route.js';
const app = express();
dotenv.config();
app.get('/',(req,res)=>{
     res.send('Hello world g');
});
app.use(express.json()); //allow us to parse incoming request  it work like middle ware 
 app.use("/api/auth",authRoutes);
// console.log(Object.keys(app));
// console.log(Object.keys(app.get));

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
     connectDB();
     console.log('Server is running on port ',PORT);
});