import Joi from "joi";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config(); // Tải các biến môi trường từ file .env

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": "Trường Name là bắt buộc",
    "string.empty": "Trường Name không được bỏ trống",
    "string.min": "Trường Name phải có ít nhất {#limit} kí tự",
    "string.max": "Trường Name không được quá {#limit} kí tự",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Trường email là bắt buộc",
    "string.empty": "Trường email không được bỏ trống",
    "string.email": "Trường email không hợp lệ",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "any.required": "Trường password là bắt buộc",
    "string.empty": "Trường password không được bỏ trống",
    "string.min": "Trường password phải có ít nhất {#limit} kí tự",
    "string.max": "Trường password không được quá {#limit} kí tự",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "Trường confirmPassword là bắt buộc",
    "any.only": "Trường confirmPassword phải giống với trường password",
  }),
  avatar: Joi.string().uri().messages({
    "string.uri": "Trường Avatar phải là đường dẫn hợp lệ",
  }),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Trường email là bắt buộc",
    "string.empty": "Trường email không được bỏ trống",
    "string.email": "Trường email không hợp lệ",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "any.required": "Trường password là bắt buộc",
    "string.empty": "Trường password không được bỏ trống",
    "string.min": "Trường password phải có ít nhất {#limit} kí tự",
    "string.max": "Trường password không được quá {#limit} kí tự",
  }),
});

// Giả sử bạn có một danh sách token bị thu hồi (blacklist)
const tokenBlacklist = new Set();

export const signup = async (req, res) => {
  const { email, password, name, avatar } = req.body;
  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((item) => item.message);
    return res.status(400).json({ message });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: ["Email đã tồn tại"] });
    }

    const hashPassword = await bcryptjs.hash(password, 12);
    const adminExists = await User.findOne({ role: 'admin' });
    const role = adminExists ? 'user' : 'admin';

    const user = await User.create({
      ...req.body,
      password: hashPassword,
      role,
    });

    user.password = undefined;
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const { error } = signinSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((item) => item.message);
    return res.status(400).json({ message });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: ["Email không tồn tại"] });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: ["Mật khẩu không chính xác"] });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "123456",
      { expiresIn: "7d" }
    );

    return res.status(200).json({  user: user, token});
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Lấy token từ header Authorization
    const token = req.header('Authorization').replace('Bearer ', '');

    // Thêm token vào danh sách bị thu hồi
    tokenBlacklist.add(token);

    return res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Middleware để kiểm tra token có trong danh sách bị thu hồi hay không
export const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};