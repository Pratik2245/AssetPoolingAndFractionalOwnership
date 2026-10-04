const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: { type: String, reqired: true },
    email: { type: String, reqired: true, unique: true },
    password: { type: String, reqired: true },
    address: { type: String, default: "" },
    organization: { type: String, default: "" },
    metamaskaddress: { type: String, default: "" },
    phone: { type: String, default: "" },
    pincode: { type: Number },
    pic: { type: String },
    role: { type: String, default: "admin" },
}, { timestamps: true })

mongoose.models = {}
export default mongoose.model("User", UserSchema);