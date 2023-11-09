import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
  updateAcessToken,
  getUserInfo,
  socialAuth,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
  getAllUser,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controllers";
import { isAutheticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAutheticated, logoutUser);
userRouter.get("/refresh", updateAcessToken);
userRouter.get("/me", isAutheticated, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.put("/update-user-info", isAutheticated, updateUserInfo);
userRouter.put("/update-user-password", isAutheticated, updatePassword);
userRouter.put("/update-user-profile", isAutheticated, updateProfilePicture);
userRouter.get("/get-all-user", isAutheticated, getAllUser);
userRouter.put("/update-user-role", isAutheticated, updateUserRole);
userRouter.delete("/delete-user/:id", isAutheticated, deleteUser);

export default userRouter;
