const mongoose = require("../database");

const WalletSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  stocks: [
    {
      stockId: {
        type: String,
      },
      amount: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

WalletSchema.pre("save", async function (next) {
  if (await Wallet.exists({ userId: this.userId })) {
    const err = new Error("Wallet already exists");
    err.name = "UniqueError";
    return next(err);
  } else {
    return next();
  }
});

const Wallet = mongoose.model("Wallet", WalletSchema);

module.exports = Wallet;
