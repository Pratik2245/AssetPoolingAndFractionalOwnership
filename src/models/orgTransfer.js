const mongoose = require('mongoose')

const Funds = new mongoose.Schema({
    PortfolioId: { type: String, required: true },
    Transaction: { type: Array, require: true },
    TotalAmount: { type: Number, required: true, default: 0 },
}, { timestamps: true })
mongoose.models = {}

export default mongoose.model.Funds || mongoose.model("Funds", Funds);