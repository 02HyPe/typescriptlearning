import express from "express";
import { signUp, signIn, refreshAccessToken } from "../controllers/user";
import { validateData } from "../middleware/validators/validator";
import { signInSchema, signUpSchema } from "../Schema/userSchema";

const route = express.Router();

route.post("/signup", validateData(signUpSchema), signUp);
route.get("/signin", validateData(signInSchema), signIn);
route.get("/refreshtoken", refreshAccessToken);

export default route;
