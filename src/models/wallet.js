const mongoose = require("../database");

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    stocks: {
      type: Object,
      default: {},
    },
    history: [
      {
        ticker: String,
        amount: Number,
        price: Number,
        date: Date,
        operationType: String,
        stockId: String,
        name: String,
      },
    ],
    credit: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { minimize: false }
);

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;
