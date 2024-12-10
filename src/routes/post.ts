import express from "express";
import {
  addPost,
  allPost,
  cursorPagePost,
  deletePost,
  offsetPagePost,
  offsetPagePostq,
  updatePost,
  userPost,
} from "../controllers/post";
import { auth } from "../middleware/auth";
import { validateData } from "../middleware/validators/validator";
import { post } from "../Schema/postSchema";

const route = express.Router();

route.post("/addpost", auth, validateData(post), addPost);
route.get("/allpost", auth, allPost);
route.put("/updatepost", auth, validateData(post), updatePost);
route.delete("/deletepost", auth, validateData(post), deletePost);
route.get("/userpost/:userid", auth, userPost);
route.get("/offsetpagepost/:page", auth, offsetPagePost);
route.get("/offsetpagepostq/", auth, offsetPagePostq);
route.get("/cursorpagepost/", auth, cursorPagePost);

export default route;
