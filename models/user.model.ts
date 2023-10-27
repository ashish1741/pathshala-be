require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//for email verification
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// creating user model database
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: Number;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerfied: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  signRefreshToken: () => string;
  SignAccessToken: () => string;
}

// creating user model database schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "password must be at 6 characters"],
      select: false,
    },
    // phoneNumber: {
    //   type: Number,
    //   required: [true, "please enter your phone Number"],
    //   minlength: [10, "number must be 10 digit"],
    //   select: false,
    // },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    courses: [{ courseId: String }],
  },
  { timestamps: true }
);

//hash password before storing

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//sign acess token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn:"5m"
  });
};

//sign refresh token

userSchema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "",{
    expiresIn:"3d"
  });
};

// comapre password

userSchema.methods.comparePassword = async function (
  enterdPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enterdPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("user", userSchema);
export default userModel;
