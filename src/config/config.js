import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("Connection String not available....");
}
const config = {
  MONGO_URI: process.env.MONGO_URI,
};

export default config;
