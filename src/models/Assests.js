const mongoose = require('mongoose')

const AssestSchema = new mongoose.Schema({
    AssestId: { type: String, required: true },
    UserId: { type: String, required: true },
    AssestTitle: { type: String, required: true },
    AssestTotalPrice: { type: String, required: true },
    OrginalBuyPrice: { type: String, required: true },
    AssestBuyPrice: { type: String, required: true },
    PercentageOwn: { type: String, required: true },
    Transactionid: { type: String, required: true },
    Transactionamount: { type: String, required: true },
    Profit: { type: Array }

}, { timestamps: true })
mongoose.models = {}

export default mongoose.model.Assest || mongoose.model("Assests", AssestSchema);