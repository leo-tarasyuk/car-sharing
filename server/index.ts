import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    const url: string | undefined = process.env.DB_URL;
    if (process.env.NODE_ENV !== "UNITTEST" && url) {
      await mongoose.connect(url);
      console.log("MongoDB is connected");
    } else console.log("MongoDB is not connected");

    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
