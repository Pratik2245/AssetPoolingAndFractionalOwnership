const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, reqired: true },
    email: { type: String, reqired: true, unique: true },
    password: { type: String, reqired: true },
    address: { type: String, default: "" },
    organization: { type: String, default: "" },
    metamaskadress: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Admin", AdminSchema);
