const mongoose = require("../database");

const StockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ticker: {
        type: String,
        unique: true,
        required: true
    },
    finnhubIndustry: {
        type: String,
        required: true
    },
    country: {
        type: String
    },
    currency: {
        type: String

    },
    exchange: {
        type: String
    },
    ipo: {
        type: String

    },
    marketCapitalization: {
        type: Number

    },
    shareOutstanding: {
        type: Number

    },
    logo: {
        type: String
    },
    phone: {
        type: String

    },
    weburl: {
        type: String

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

StockSchema.pre('save', async function (next) {
    if (await Stock.exists({ ticker: this.ticker })) {
        const err = new Error("Stock already exists");
        err.name = "UniqueError";
        return next(err);
    } else {
        return next();
    }
})

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;