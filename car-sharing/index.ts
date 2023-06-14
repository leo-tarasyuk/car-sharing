import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import { router } from "./src/routes/index";

dotenv.config();

const url = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`;
const app = express();

app.use(express.json());
app.use(router);
mongoose.connect(url).then(() => console.log('DB is ready'))
app.listen(5000, () => console.log('Server is started...'));