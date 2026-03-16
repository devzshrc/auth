import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("Connection String not available....");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured in env file....");
}
const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default config;
