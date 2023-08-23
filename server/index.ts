import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swagerDoc from "./swagger.json";

import { router } from "./src/routes/index";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagerDoc));

const start = async (): Promise<void> => {
  try {
    const url: string | undefined = process.env.DB_URL;

    if (url) {
      await mongoose.connect(url);
      console.log("MongoDB is connected");
    } else console.log("MongoDB is not connected");

    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

export default app