import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import { errorHandler, notFoundError } from "./middleware/error/error_handler";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Db connected");
    app.listen(PORT, () => {
      console.log(`server listening on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(`error with database ${err}`);
  }
})();

app.get(`/`, (req: Request, res: Response) => {
  res.json("hello world");
});
app.use(`/user`, userRoutes);
app.use(`/post`, postRoutes);
app.all(`*`, notFoundError);
app.use(errorHandler);
