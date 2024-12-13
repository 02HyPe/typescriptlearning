import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import { errorHandler, notFoundError } from "./middleware/error/error_handler";
import cluster, { Worker } from "cluster";
import os from "os";

const MONGO_POOL = 5;
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

if (cluster.isPrimary) {
  console.log(cluster.isPrimary);
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker: Worker) => {
    console.log(`worker id ${worker.process.pid} dead`);
  });
} else {
  (async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        maxPoolSize: MONGO_POOL,
      });
      console.log("Db connected");
      app.listen(PORT, () => {
        console.log(`server listening on PORT ${PORT}`);
      });
    } catch (err) {
      console.log(`error with database ${err}`);
    }
  })();
}

app.get(`/`, (req: Request, res: Response) => {
  res.json("hello world");
});
app.use(`/user`, userRoutes);
app.use(`/post`, postRoutes);
app.all(`*`, notFoundError);
app.use(errorHandler);
